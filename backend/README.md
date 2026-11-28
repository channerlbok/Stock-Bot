# Stock-Bot

## Backend setup

### Unit tests

From the backend folder, run `npm test` after installing dependencies with `npm install`.
The suite uses Node's built-in test runner and tsx.

Tests cover eight functions: percentage change, period changes, moving averages,
median closing price, period summaries, maximum drawdown, combined statistics,
and date validation.

Tests run offline with sample prices. They cover calculations, losses, insufficient
history, zero starting prices, invalid stored values, and calendar dates.

References for the testing tools:

- [Node test runner](https://nodejs.org/api/test.html)
- [Node assertions](https://nodejs.org/api/assert.html)

### Running the backend

Use Node.js 22.13 or newer. This backend uses Node's built-in SQLite module.

From the project folder, run these commands to install the backend dependencies.

```powershell
cd backend
npm install
```

Create a `.env` file in the backend folder with your Alpha Vantage API key.
Do not commit this file.

```env
ALPHA_VANTAGE_API_KEY=your_key_here
```

Start the server from the backend folder.

```powershell
npm run dev
```

The backend runs at http://localhost:3001.

- `GET /api/stocks` returns the stocks that have been added.
- `POST /api/stocks` adds a stock. Send JSON like `{"symbol":"AAPL"}` with the `Content-Type: application/json` header.
- `GET /api/stocks/:symbol/prices` returns saved prices or fetches and saves them from Alpha Vantage when they are not in the database.

### Stock statistics

`GET /api/stocks/:symbol/statistics` calculates statistics using saved monthly prices only.
It does not request data from Alpha Vantage. Prices must already exist in the local database.

Optional `from` and `to` query parameters use inclusive calendar dates in `YYYY-MM-DD` format.
Omitting a bound includes all saved prices on that side of the range.

Example: `GET /api/stocks/AAPL/statistics?from=2026-01-01&to=2026-03-31`

Example showing the main response fields for closing prices of 100, 110, and 120:

```json
{
  "symbol": "AAPL",
  "interval": "monthly",
  "from": "2026-01-30",
  "to": "2026-03-31",
  "sampleCount": 3,
  "firstClosingPrice": 100,
  "lastClosingPrice": 120,
  "averageClosingPrice": 110,
  "priceChange": 20,
  "percentageChange": 20
}
```

Response dates are the actual first and last saved observations within the requested range.
The average is the arithmetic mean of the monthly closing prices. Price change is the last
close minus the first close; percentage change divides that difference by the first close
and multiplies by 100. One observation produces zero change. A first close of zero produces
`null` for percentage change. Values are unrounded so the frontend can choose display formatting.
These are raw closing-price comparisons, without dividend or split adjustments.

Additional response fields:

- `highestPrice` and `lowestPrice` use the saved monthly high and low values, rather than just closing prices.
- `totalVolume` sums the monthly volumes; `averageVolume` is the average volume per saved observation.
- `periodChanges` compares each close with the preceding saved close. Each entry has `from`, `to`, `priceChange`, and `percentageChange`.
- `movingAverages` contains `threePeriod`, `sixPeriod`, and `twelvePeriod` arrays. Each entry has `tradeDate` and `averageClosingPrice`.

Moving averages use the current close and the preceding 2, 5, or 11 closes, respectively.
Each entry's `averageClosingPrice` is `null` until a full window is available. All arrays
are ordered oldest to newest. A range with one observation has no period-change entries.
The windows count saved observations, so missing months are not filled in or treated as zero.
The dates in `periodChanges` show any gaps between observations.

For example, closes of 100, 110, 120, and 130 produce three-period averages of
`null`, `null`, `110`, and `120`. Narrowing the date range also narrows the data used
for the moving averages; earlier prices outside the range are not included.

Invalid or reversed dates return JSON `400`; no matching saved prices returns JSON `404`.
Unexpected failures use the shared JSON error handler.

#### Additional analytics

- `medianClosingPrice` is the middle close after sorting by price. For an even number of observations, it is the mean of the two middle closes.
- `periodSummary` counts rising, falling, and unchanged observations and identifies the best and worst periods by percentage change. Ties keep the first occurrence.
- `periodSummary.averagePeriodReturnPercentage` is the arithmetic mean of defined percentage changes. It is not a compounded return.
- `periodSummary.returnVolatilityPercentage` is the sample standard deviation of those percentage changes, in percentage points. It needs at least two defined returns and otherwise returns `null`. It is not annualized.
- `maximumDrawdown` reports the largest decline from an earlier closing-price peak to a later close, as a positive percentage, with peak/trough dates and prices. For closes of 100, 120, 90, and 99, the maximum drawdown is 25%, from 120 to 90.

Zero-baseline returns are counted in `periodSummary.undefinedReturnCount` and excluded from percentage
rankings, averages, and volatility. Direction counts still include those periods.
No periods produces zero counts and `null` return metrics. A positive-price series with no
decline has a drawdown of 0 and `null` peak/trough fields; an all-zero series has a `null`
drawdown percentage. Equal worst drawdowns keep the first occurrence.

These metrics use only the selected saved observations. Missing months make some intervals
longer than one month, so volatility describes the observed intervals rather than a uniform
monthly return series. Monthly closes also cannot reveal drawdowns within a month.

Formula references:

- [MSCI IndexMetrics maximum drawdown definition](https://www.msci.com/documents/10199/402635a5-fd5d-498e-985a-1bec8ff8d8b1)
- [Fidelity discussion of return standard deviation](https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/SHDOCS/CONTCP/hosts/sh_comm_qfr.016850.RETAIL_pdf.pdf)

Example command to test backend API(Run in powershell/terminal):
Invoke-RestMethod -Uri http://localhost:3001/api/stocks -Method Post -ContentType "application/json" -Body '{"symbol":"AAPL"}'

Symbols are trimmed and saved in uppercase. Missing symbols return 400 and duplicates return 409.
Stock symbols and prices are saved in `backend/data/stocks.sqlite` and remain after a restart. The `stocks` and `stock_prices` tables are created automatically. Local database files are ignored by Git.

To test fetching prices, open `http://localhost:3001/api/stocks/AAPL/prices` in a browser or run:

```powershell
Invoke-RestMethod -Uri http://localhost:3001/api/stocks/AAPL/prices
```
