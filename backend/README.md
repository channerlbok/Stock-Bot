# Stock-Bot
## Backend setup

Use Node.js 22.13 or newer. This backend uses Node's built-in SQLite module.

From the project folder, run these commands to install the backend dependencies.

~~~powershell
cd backend
npm install
~~~

Start the server from the backend folder.
~~~powershell
npm run dev
~~~

The backend runs at http://localhost:3000.

- `GET /api/stocks` returns the stocks that have been added.
- `POST /api/stocks` adds a stock. Send JSON like `{"symbol":"AAPL"}` with the `Content-Type: application/json` header.

Example command to test backend API(Run in powershell/terminal):
Invoke-RestMethod -Uri http://localhost:3000/api/stocks -Method Post -ContentType "application/json" -Body '{"symbol":"AAPL"}'

Symbols are trimmed and saved in uppercase. Missing symbols return 400 and duplicates return 409.
Stocks are saved in backend/data/stocks.sqlite and remain after a restart. The database and table are created automatically. Local database files are ignored by Git. These routes do not fetch Alpha Vantage data yet.

