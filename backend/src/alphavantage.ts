import 'dotenv/config';
import { insertStockPrice } from './db';

const apiKey: string = process.env.ALPHA_VANTAGE_API_KEY ?? '';
if (!apiKey) throw new Error('Missing API key');

export async function fetchStockData(symbol: string): Promise<StockPrice[]> {
  const params = new URLSearchParams({
    function: 'TIME_SERIES_MONTHLY',
    symbol,
    apikey: apiKey,
  });
  const response = await fetch(`https://www.alphavantage.co/query?${params}`,
    { signal: AbortSignal.timeout(10_000) },
  );

  if (!response.ok) {
    let message = 'Alpha Vantage returned an error.';
    let status = 502;

    if (response.status === 429) {
      message = 'Stock data request limit reached. Please try again later.';
      status = 503;
    }

    const error = new Error(message);
    throw Object.assign(error, { status });
  }
  const data = await response.json();
  const notice = data['Information'] || data['Note'];
  
  if (notice) {
    let message = 'The stock data service could not fulfill the request. Please try again later.';
    const rateLimitPattern = /rate limit|call frequency|requests per|calls per|limit.*(?:day|minute)/i;
    const isRateLimited = rateLimitPattern.test(String(notice));

    if (isRateLimited) {
      message = 'Stock data request limit reached. Please try again later.';
    }

    const error = new Error(message);
    throw Object.assign(error, { status: 503 });
  }

  if (!data['Monthly Time Series']) {
    throw Object.assign(new Error('Alpha Vantage returned no monthly stock data.'), { status: 502 });
  }

  return transformStockData(data['Monthly Time Series'], symbol);
}

function transformStockData(data: any, symbol: string): StockPrice[] {
  return Object.entries(data).map(([date, values]: [string, any]) => ({
    symbol,
    trade_date: date,
    open: Number(values['1. open']),
    high: Number(values['2. high']),
    low: Number(values['3. low']),
    close: Number(values['4. close']),
    volume: Number(values['5. volume']),
  }));
}

export interface StockPrice {
  symbol: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
