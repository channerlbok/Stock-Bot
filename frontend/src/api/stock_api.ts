export interface StockPrice {
  symbol: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getStock(ticker: string): Promise<StockPrice[]> {
  const symbol = ticker.trim().toUpperCase();

  if (!symbol) {
    throw new Error('Please enter a valid stock symbol.');
  }

  const response = await fetch(
    `/api/stocks/${encodeURIComponent(symbol)}/prices`,
  );

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error || 'Failed to fetch stock prices.');
  }

  return await response.json();
}
