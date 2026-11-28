export interface AnalyticsPrice {
  trade_date: string;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface PeriodChange {
  from: string;
  to: string;
  priceChange: number;
  percentageChange: number | null;
}

export interface MovingAverage {
  tradeDate: string;
  averageClosingPrice: number | null;
}

export interface PeriodSummary {
  upPeriods: number;
  downPeriods: number;
  unchangedPeriods: number;
  validReturnCount: number;
  undefinedReturnCount: number;
  bestPeriod: PeriodChange | null;
  worstPeriod: PeriodChange | null;
  averagePeriodReturnPercentage: number | null;
  returnVolatilityPercentage: number | null;
}

export interface MaximumDrawdown {
  percentage: number | null;
  peakDate: string | null;
  troughDate: string | null;
  peakPrice: number | null;
  troughPrice: number | null;
}

export interface StockStatistics {
  from: string;
  to: string;
  sampleCount: number;
  firstClosingPrice: number;
  lastClosingPrice: number;
  averageClosingPrice: number;
  medianClosingPrice: number;
  priceChange: number;
  percentageChange: number | null;
  highestPrice: number;
  lowestPrice: number;
  totalVolume: number;
  averageVolume: number;
  periodChanges: PeriodChange[];
  periodSummary: PeriodSummary;
  maximumDrawdown: MaximumDrawdown;
  movingAverages: {
    threePeriod: MovingAverage[];
    sixPeriod: MovingAverage[];
    twelvePeriod: MovingAverage[];
  };
}

// A percentage change is undefined when the starting price is zero.
export function calculatePercentageChange(startPrice: number, endPrice: number): number | null {
  if (startPrice === 0) {
    return null;
  }

  const difference = endPrice - startPrice;
  return (difference / startPrice) * 100;
}

// Each entry compares two consecutive saved observations.
// If a month is missing, the dates show the actual gap being compared.
export function calculatePeriodChanges(prices: AnalyticsPrice[]): PeriodChange[] {
  const changes: PeriodChange[] = [];

  for (let index = 1; index < prices.length; index += 1) {
    const previousPrice = prices[index - 1];
    const currentPrice = prices[index];

    changes.push({
      from: previousPrice.trade_date,
      to: currentPrice.trade_date,
      priceChange: currentPrice.close - previousPrice.close,
      percentageChange: calculatePercentageChange(previousPrice.close, currentPrice.close),
    });
  }

  return changes;
}

// A trailing average includes the current observation and the preceding ones.
// Return null until a complete window is available within the selected range.
export function calculateMovingAverage(prices: AnalyticsPrice[], period: number): MovingAverage[] {
  if (!Number.isInteger(period) || period < 1) {
    throw new Error('The moving-average period must be a positive integer.');
  }

  const averages: MovingAverage[] = [];
  let windowTotal = 0;

  for (let index = 0; index < prices.length; index += 1) {
    windowTotal += prices[index].close;

    // Remove the oldest close once it falls outside the window.
    if (index >= period) {
      windowTotal -= prices[index - period].close;
    }

    let averageClosingPrice: number | null = null;

    if (index + 1 >= period) {
      averageClosingPrice = windowTotal / period;
    }

    averages.push({
      tradeDate: prices[index].trade_date,
      averageClosingPrice,
    });
  }

  return averages;
}

// Sort a copy so calculating the median does not disturb chronological order.
export function calculateMedianClosingPrice(prices: AnalyticsPrice[]): number {
  if (prices.length === 0) {
    throw new Error('At least one closing price is required to calculate the median.');
  }

  const closingPrices = prices.map((price) => price.close);
  closingPrices.sort((first, second) => first - second);

  const middleIndex = Math.floor(closingPrices.length / 2);

  if (closingPrices.length % 2 === 1) {
    return closingPrices[middleIndex];
  }

  const lowerMiddle = closingPrices[middleIndex - 1];
  const upperMiddle = closingPrices[middleIndex];
  return (lowerMiddle + upperMiddle) / 2;
}

export function summarizePeriods(changes: PeriodChange[]): PeriodSummary {
  const summary: PeriodSummary = {
    upPeriods: 0,
    downPeriods: 0,
    unchangedPeriods: 0,
    validReturnCount: 0,
    undefinedReturnCount: 0,
    bestPeriod: null,
    worstPeriod: null,
    averagePeriodReturnPercentage: null,
    returnVolatilityPercentage: null,
  };

  const returns: number[] = [];
  let totalReturn = 0;

  for (const change of changes) {
    if (change.priceChange > 0) {
      summary.upPeriods += 1;
    } else if (change.priceChange < 0) {
      summary.downPeriods += 1;
    } else {
      summary.unchangedPeriods += 1;
    }

    // A zero starting price has no defined percentage return.
    if (change.percentageChange === null) {
      summary.undefinedReturnCount += 1;
      continue;
    }

    returns.push(change.percentageChange);
    totalReturn += change.percentageChange;

    const bestReturn = summary.bestPeriod?.percentageChange;
    if (bestReturn === null || bestReturn === undefined || change.percentageChange > bestReturn) {
      summary.bestPeriod = change;
    }

    const worstReturn = summary.worstPeriod?.percentageChange;
    if (worstReturn === null || worstReturn === undefined || change.percentageChange < worstReturn) {
      summary.worstPeriod = change;
    }
  }

  summary.validReturnCount = returns.length;

  if (returns.length === 0) {
    return summary;
  }

  const averageReturn = totalReturn / returns.length;
  summary.averagePeriodReturnPercentage = averageReturn;

  // Sample standard deviation needs at least two defined returns.
  // Returns are already percentages, so the result is in percentage points.
  if (returns.length >= 2) {
    let squaredDifferenceTotal = 0;

    for (const periodReturn of returns) {
      const difference = periodReturn - averageReturn;
      squaredDifferenceTotal += difference * difference;
    }

    const variance = squaredDifferenceTotal / (returns.length - 1);
    summary.returnVolatilityPercentage = Math.sqrt(variance);
  }

  return summary;
}

// Track the largest percentage decline from a prior closing-price peak.
// Monthly highs and lows are not used because their intramonth order is unknown.
export function calculateMaximumDrawdown(prices: AnalyticsPrice[]): MaximumDrawdown {
  const result: MaximumDrawdown = {
    percentage: null,
    peakDate: null,
    troughDate: null,
    peakPrice: null,
    troughPrice: null,
  };

  let peak: AnalyticsPrice | null = null;
  let largestDecline = 0;

  for (const price of prices) {
    if (peak === null || price.close > peak.close) {
      peak = price;
    }

    // Skip zero peaks to avoid division by zero.
    if (peak.close === 0) {
      continue;
    }

    const decline = ((peak.close - price.close) / peak.close) * 100;

    if (decline > largestDecline) {
      largestDecline = decline;
      result.peakDate = peak.trade_date;
      result.troughDate = price.trade_date;
      result.peakPrice = peak.close;
      result.troughPrice = price.close;
    }

    result.percentage = largestDecline;
  }

  return result;
}

// Prices must be ordered from oldest to newest.
export function calculateStatistics(prices: AnalyticsPrice[]): StockStatistics {
  if (prices.length === 0) {
    throw new Error('At least one price observation is required.');
  }

  let totalClosingPrice = 0;
  let totalVolume = 0;
  let highestPrice = prices[0].high;
  let lowestPrice = prices[0].low;

  for (const price of prices) {
    const values = [price.close, price.high, price.low, price.volume];

    for (const value of values) {
      if (!Number.isFinite(value) || value < 0) {
        throw new Error('Stored prices and volume must be valid non-negative numbers.');
      }
    }

    if (price.high < price.low) {
      throw new Error('A stored high price cannot be below its low price.');
    }

    totalClosingPrice += price.close;
    totalVolume += price.volume;

    if (price.high > highestPrice) {
      highestPrice = price.high;
    }

    if (price.low < lowestPrice) {
      lowestPrice = price.low;
    }
  }

  const first = prices[0];
  const last = prices[prices.length - 1];
  const periodChanges = calculatePeriodChanges(prices);

  return {
    from: first.trade_date,
    to: last.trade_date,
    sampleCount: prices.length,
    firstClosingPrice: first.close,
    lastClosingPrice: last.close,
    averageClosingPrice: totalClosingPrice / prices.length,
    medianClosingPrice: calculateMedianClosingPrice(prices),
    priceChange: last.close - first.close,
    percentageChange: calculatePercentageChange(first.close, last.close),
    highestPrice,
    lowestPrice,
    totalVolume,
    averageVolume: totalVolume / prices.length,
    periodChanges,
    periodSummary: summarizePeriods(periodChanges),
    maximumDrawdown: calculateMaximumDrawdown(prices),
    movingAverages: {
      threePeriod: calculateMovingAverage(prices, 3),
      sixPeriod: calculateMovingAverage(prices, 6),
      twelvePeriod: calculateMovingAverage(prices, 12),
    },
  };
}
