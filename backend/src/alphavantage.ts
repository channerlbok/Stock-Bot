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
  const response = await fetch(`https://www.alphavantage.co/query?${params}`);

  if (!response.ok) {
    throw new Error(`Alpha Vantage returned tst ${response.status}.`);
  }

  const data = await response.json();
  //console.error(data);
  if (data['Information']) {
    throw new Error(`Alpha Vantage rate limit: ${data['Information']}`);
  }

  if (!data['Monthly Time Series']) {
    throw new Error('Alpha Vantage returned no monthly stock data.');
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
