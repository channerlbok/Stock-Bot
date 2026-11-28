// ISO calendar dates can be compared alphabetically after validation.
export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (!Number.isFinite(date.getTime())) {
    return false;
  }

  // JavaScript rolls dates such as February 30 into March. Reject that rollover.
  return date.toISOString().slice(0, 10) === value;
}
