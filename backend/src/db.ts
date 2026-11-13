import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = process.env.DATABASE_PATH ?? path.join(__dirname, '../data/stocks.sqlite');
mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export const listStocks = db.prepare('SELECT symbol FROM stocks ORDER BY symbol');
export const insertStock = db.prepare(
  'INSERT INTO stocks (symbol) VALUES (?) ON CONFLICT(symbol) DO NOTHING',
);
