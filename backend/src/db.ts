import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath =
  process.env.DATABASE_PATH ?? path.join(__dirname, '../data/stocks.sqlite');

mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
-- Table of stock symbols
  CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
-- Table of stock prices
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS stock_prices (
    symbol TEXT NOT NULL,
    trade_date TEXT NOT NULL,
    open REAL NOT NULL,
    high REAL NOT NULL,
    low REAL NOT NULL,
    close REAL NOT NULL,
    volume INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (symbol, trade_date)
    FOREIGN KEY (symbol) REFERENCES stocks(symbol)
    );
`);

// Operations on stocks
export const listStocks = db.prepare(
  'SELECT symbol FROM stocks ORDER BY symbol',
);
export const insertStock = db.prepare(
  'INSERT INTO stocks (symbol) VALUES (?) ON CONFLICT(symbol) DO NOTHING',
);

// Operations on stock_prices
export const getStockPrices = db.prepare(`
  SELECT symbol, trade_date, open, high, low, close, volume
  FROM stock_prices
  WHERE symbol = ?
  ORDER by trade_date`);

export const insertStockPrice = db.prepare(`
  INSERT INTO stock_prices
    (symbol, trade_date, open, high, low, close, volume)
  VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (symbol, trade_date) DO NOTHING
  
  `);
