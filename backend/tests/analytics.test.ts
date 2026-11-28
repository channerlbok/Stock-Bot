import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMaximumDrawdown,
  calculateMedianClosingPrice,
  calculateMovingAverage,
  calculatePercentageChange,
  calculatePeriodChanges,
  calculateStatistics,
  summarizePeriods,
} from '../src/analytics';
import type { AnalyticsPrice, PeriodChange } from '../src/analytics';

function makePrices(closes: number[]): AnalyticsPrice[] {
  return closes.map((close, index) => ({
    trade_date: `2026-${String(index + 1).padStart(2, '0')}-01`,
    close,
    high: close + 5,
    low: Math.max(0, close - 5),
    volume: (index + 1) * 100,
  }));
}

describe('calculatePercentageChange', () => {
  it('calculates gains, losses, and unchanged prices', () => {
    assert.equal(calculatePercentageChange(100, 125), 25);
    assert.equal(calculatePercentageChange(100, 75), -25);
    assert.equal(calculatePercentageChange(100, 100), 0);
  });

  it('returns null when the starting price is zero', () => {
    assert.equal(calculatePercentageChange(0, 100), null);
    assert.equal(calculatePercentageChange(0, 0), null);
  });
});

describe('calculatePeriodChanges', () => {
  it('compares each observation with the preceding one', () => {
    assert.deepEqual(calculatePeriodChanges(makePrices([100, 120, 90])), [
      { from: '2026-01-01', to: '2026-02-01', priceChange: 20, percentageChange: 20 },
      { from: '2026-02-01', to: '2026-03-01', priceChange: -30, percentageChange: -25 },
    ]);
  });

  it('returns no changes for fewer than two observations', () => {
    assert.deepEqual(calculatePeriodChanges([]), []);
    assert.deepEqual(calculatePeriodChanges(makePrices([100])), []);
  });

  it('preserves actual dates across a missing month', () => {
    const prices = makePrices([100, 120]);
    prices[1].trade_date = '2026-03-01';
    assert.deepEqual(calculatePeriodChanges(prices)[0], {
      from: '2026-01-01', to: '2026-03-01', priceChange: 20, percentageChange: 20,
    });
  });
});

describe('calculateMovingAverage', () => {
  it('waits for a full window and then removes the oldest close', () => {
    assert.deepEqual(calculateMovingAverage(makePrices([100, 110, 120, 130]), 3), [
      { tradeDate: '2026-01-01', averageClosingPrice: null },
      { tradeDate: '2026-02-01', averageClosingPrice: null },
      { tradeDate: '2026-03-01', averageClosingPrice: 110 },
      { tradeDate: '2026-04-01', averageClosingPrice: 120 },
    ]);
  });

  it('calculates six- and twelve-observation windows', () => {
    const prices = makePrices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const sixPeriod = calculateMovingAverage(prices, 6);
    const twelvePeriod = calculateMovingAverage(prices, 12);
    assert.equal(sixPeriod[5].averageClosingPrice, 3.5);
    assert.equal(sixPeriod[6].averageClosingPrice, 4.5);
    assert.equal(twelvePeriod[10].averageClosingPrice, null);
    assert.equal(twelvePeriod[11].averageClosingPrice, 6.5);
  });

  it('handles an empty history and a one-observation window', () => {
    assert.deepEqual(calculateMovingAverage([], 3), []);
    const averages = calculateMovingAverage(makePrices([100, 80]), 1);
    assert.deepEqual(averages.map((row) => row.averageClosingPrice), [100, 80]);
  });

  it('rejects periods that are not positive integers', () => {
    for (const period of [0, -1, 1.5, NaN, Infinity]) {
      assert.throws(() => calculateMovingAverage(makePrices([100]), period), /positive integer/);
    }
  });
});

describe('calculateMedianClosingPrice', () => {
  it('calculates medians for odd and even observation counts', () => {
    assert.equal(calculateMedianClosingPrice(makePrices([30, 10, 20])), 20);
    assert.equal(calculateMedianClosingPrice(makePrices([100, 120, 90, 99])), 99.5);
  });

  it('does not modify the supplied history', () => {
    const prices = makePrices([30, 10, 20]);
    const original = prices.map((price) => ({ ...price }));
    calculateMedianClosingPrice(prices);
    assert.deepEqual(prices, original);
  });

  it('rejects empty history', () => {
    assert.throws(() => calculateMedianClosingPrice([]), /At least one closing price/);
  });
});

describe('summarizePeriods', () => {
  const changes: PeriodChange[] = [
    { from: '2026-01-01', to: '2026-02-01', priceChange: 10, percentageChange: 10 },
    { from: '2026-02-01', to: '2026-03-01', priceChange: -11, percentageChange: -10 },
    { from: '2026-03-01', to: '2026-04-01', priceChange: 0, percentageChange: 0 },
  ];

  it('counts directions and ranks periods by percentage return', () => {
    const summary = summarizePeriods(changes);
    assert.equal(summary.upPeriods, 1);
    assert.equal(summary.downPeriods, 1);
    assert.equal(summary.unchangedPeriods, 1);
    assert.deepEqual(summary.bestPeriod, changes[0]);
    assert.deepEqual(summary.worstPeriod, changes[1]);
  });

  it('calculates sample standard deviation rather than population deviation', () => {
    const summary = summarizePeriods(changes);
    // Returns of 10, -10, and 0 have mean 0 and sample variance 100.
    assert.equal(summary.averagePeriodReturnPercentage, 0);
    assert.equal(summary.returnVolatilityPercentage, 10);
  });

  it('excludes undefined percentage returns from return statistics', () => {
    const undefinedReturn: PeriodChange = {
      from: '2025-12-01', to: '2026-01-01', priceChange: 100, percentageChange: null,
    };
    const summary = summarizePeriods([undefinedReturn, ...changes]);
    assert.equal(summary.upPeriods, 2);
    assert.equal(summary.undefinedReturnCount, 1);
    assert.equal(summary.validReturnCount, 3);
    assert.equal(summary.averagePeriodReturnPercentage, 0);
    assert.equal(summary.returnVolatilityPercentage, 10);
  });

  it('requires two defined returns to calculate volatility', () => {
    assert.equal(summarizePeriods([]).bestPeriod, null);
    assert.equal(summarizePeriods([]).returnVolatilityPercentage, null);
    assert.equal(summarizePeriods([changes[0]]).returnVolatilityPercentage, null);
  });

  it('keeps the first occurrence when rankings tie', () => {
    const tied = { ...changes[0], from: '2026-05-01', to: '2026-06-01' };
    const summary = summarizePeriods([changes[0], tied]);
    assert.deepEqual(summary.bestPeriod, changes[0]);
    assert.deepEqual(summary.worstPeriod, changes[0]);
    assert.equal(summary.returnVolatilityPercentage, 0);
  });
});

describe('calculateMaximumDrawdown', () => {
  it('finds a decline from a peak to a later trough', () => {
    assert.deepEqual(calculateMaximumDrawdown(makePrices([100, 120, 90, 99])), {
      percentage: 25,
      peakDate: '2026-02-01',
      troughDate: '2026-03-01',
      peakPrice: 120,
      troughPrice: 90,
    });
  });

  it('uses a new peak after prices recover', () => {
    const drawdown = calculateMaximumDrawdown(makePrices([100, 80, 120, 90]));
    assert.equal(drawdown.percentage, 25);
    assert.equal(drawdown.peakPrice, 120);
    assert.equal(drawdown.troughPrice, 90);
  });

  it('does not count a low that occurred before the peak', () => {
    const drawdown = calculateMaximumDrawdown(makePrices([50, 100, 80]));
    assert.equal(drawdown.percentage, 20);
    assert.equal(drawdown.peakDate, '2026-02-01');
  });

  it('returns zero and no peak/trough dates when prices never decline', () => {
    const drawdown = calculateMaximumDrawdown(makePrices([100, 110, 120]));
    assert.equal(drawdown.percentage, 0);
    assert.equal(drawdown.peakDate, null);
    assert.equal(drawdown.troughDate, null);
  });

  it('handles zero prices without dividing by zero', () => {
    assert.equal(calculateMaximumDrawdown(makePrices([0, 0])).percentage, null);
    assert.equal(calculateMaximumDrawdown(makePrices([0, 10, 0])).percentage, 100);
  });

  it('keeps the first occurrence when maximum declines tie', () => {
    const drawdown = calculateMaximumDrawdown(makePrices([100, 80, 100, 80]));
    assert.equal(drawdown.troughDate, '2026-02-01');
  });
});

describe('calculateStatistics', () => {
  it('combines price and volume statistics', () => {
    const statistics = calculateStatistics(makePrices([100, 120, 90, 99]));
    assert.equal(statistics.sampleCount, 4);
    assert.equal(statistics.from, '2026-01-01');
    assert.equal(statistics.to, '2026-04-01');
    assert.equal(statistics.averageClosingPrice, 102.25);
    assert.equal(statistics.medianClosingPrice, 99.5);
    assert.equal(statistics.priceChange, -1);
    assert.equal(statistics.percentageChange, -1);
    assert.equal(statistics.highestPrice, 125);
    assert.equal(statistics.lowestPrice, 85);
    assert.equal(statistics.totalVolume, 1000);
    assert.equal(statistics.averageVolume, 250);
  });

  it('handles a single observation without inventing a return history', () => {
    const statistics = calculateStatistics(makePrices([100]));
    assert.equal(statistics.priceChange, 0);
    assert.equal(statistics.percentageChange, 0);
    assert.deepEqual(statistics.periodChanges, []);
    assert.equal(statistics.periodSummary.returnVolatilityPercentage, null);
    assert.equal(statistics.movingAverages.threePeriod[0].averageClosingPrice, null);
  });

  it('keeps undefined returns separate when the history starts at zero', () => {
    const statistics = calculateStatistics(makePrices([0, 100, 75]));
    assert.equal(statistics.percentageChange, null);
    assert.equal(statistics.periodSummary.undefinedReturnCount, 1);
    assert.equal(statistics.periodSummary.validReturnCount, 1);
    assert.equal(statistics.periodSummary.averagePeriodReturnPercentage, -25);
    assert.equal(statistics.maximumDrawdown.percentage, 25);
  });

  it('rejects empty history and unusable stored values', () => {
    assert.throws(() => calculateStatistics([]), /At least one price observation/);
    for (const field of ['close', 'high', 'low', 'volume']) {
      for (const value of [NaN, Infinity, -1]) {
        const price = { ...makePrices([100])[0], [field]: value };
        assert.throws(() => calculateStatistics([price]), /valid non-negative numbers/);
      }
    }
  });

  it('rejects a high price below its low price', () => {
    const price = { ...makePrices([100])[0], high: 90, low: 95 };
    assert.throws(() => calculateStatistics([price]), /high price cannot be below/);
  });
});
