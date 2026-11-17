import express from 'express';
import { fetchStockData } from './alphaVantage';
import {
  getStockPrices,
  insertStock,
  insertStockPrice,
  listStocks,
} from './db';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());
// stock operations
app.get('/api/stocks', (_req, res) => {
  res.json(listStocks.all());
});

app.post('/api/stocks', (req, res) => {
  const symbol = req.body?.symbol;

  if (typeof symbol !== 'string' || !symbol.trim()) {
    res.status(400).json({ error: 'A stock symbol is required.' });
    return;
  }

  const normalizedSymbol = symbol.trim().toUpperCase();
  const result = insertStock.run(normalizedSymbol);

  if (result.changes === 0) {
    res.status(409).json({ error: 'This stock has already been added.' });
    return;
  }

  const stock = { symbol: normalizedSymbol };
  res.status(201).json(stock);
});

// stock_prices operations
app.get('/api/stocks/:symbol/prices', async (req, res) => {
  const symbol = req.params.symbol.trim().toUpperCase();
  // Check to see if symbol already exists with stock prices before fetching.
  try {
    const savedPrices = getStockPrices.all(symbol);

    if (savedPrices.length > 0) {
      console.log(`${symbol} is already in the database.`);
      res.json(savedPrices);
      return; // Data already exists in the database, so we return it without fetching from Alpha Vantage.
    }
    // db does have prices for the symbol so we fetch
    const rows = await fetchStockData(symbol);
    // Insert the symbol into stocks first because of foreign key.
    insertStock.run(symbol);
    // Insert stock prices
    for (const row of rows) {
      insertStockPrice.run(
        row.symbol,
        row.trade_date,
        row.open,
        row.high,
        row.low,
        row.close,
        row.volume,
      );
    }
    // Success
    console.log(`Successfully loaded ${rows.length} prices for ${symbol}.`);
    res.json(rows);
  } catch (error) {
    // Not a success
    console.error(error);
    res.status(500).json({ error: 'Unable to load stock prices.' });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
