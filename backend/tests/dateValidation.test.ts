import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isValidDate } from '../src/dateValidation';

describe('isValidDate', () => {
  it('accepts valid ISO calendar dates', () => {
    assert.equal(isValidDate('2026-01-31'), true);
    assert.equal(isValidDate('2026-12-01'), true);
  });

  it('handles leap years, including the century rule', () => {
    assert.equal(isValidDate('2024-02-29'), true);
    assert.equal(isValidDate('2000-02-29'), true);
    assert.equal(isValidDate('2026-02-29'), false);
    assert.equal(isValidDate('1900-02-29'), false);
  });

  it('rejects dates that roll into another month', () => {
    assert.equal(isValidDate('2026-02-30'), false);
    assert.equal(isValidDate('2026-04-31'), false);
  });

  it('rejects invalid month and day numbers', () => {
    for (const date of ['2026-00-01', '2026-13-01', '2026-01-00', '2026-01-32']) {
      assert.equal(isValidDate(date), false, date);
    }
  });

  it('requires YYYY-MM-DD without a time or whitespace', () => {
    for (const date of ['2026-1-01', '01/01/2026', '2026-01-01T00:00:00Z', ' 2026-01-01', '']) {
      assert.equal(isValidDate(date), false, date);
    }
  });

  it('rejects missing values and query parameters that are not strings', () => {
    for (const value of [undefined, null, 20260101, ['2026-01-01'], { from: '2026-01-01' }]) {
      assert.equal(isValidDate(value), false);
    }
  });
});
