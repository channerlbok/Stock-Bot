import express from 'express';
import { insertStock, listStocks } from './db';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
