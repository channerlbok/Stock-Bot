## November 9
Set up the Express backend with TypeScript and npm dependencies. Created the server entry file, added setup instructions, and configured .gitignore to exclude dependencies, environment files, and build output.

## November 12
Built GET and POST endpoints for stock symbols. Added input validation, uppercase formatting, and duplicate handling. Connected the endpoints to SQLite so saved stocks remain after restarting the server. Checked the routes using PowerShell and the browser.

Submitted the backend work through PRs and addressed review feedback by sorting stock symbols alphabetically.

## November 16
Added shared error handling so the frontend receives consistent JSON responses. Added a JSON 404 response for unknown API routes and clearer messages for Alpha Vantage failures, rate limits, and timeouts. 

## November 18
Added a statistics endpoint that reads saved monthly prices from SQLite and supports date filtering. Built calculations for average and median closing prices, price changes, volume, moving averages, period summaries, volatility, and maximum drawdown. Checked the results with sample data and one Alpha Vantage request.

Also reviewed the frontend login issue and suggested sharing user state through Layout and Outlet context instead of keeping separate copies in each component.

## November 24
Checked the analytics endpoint with the new chart and portfolio backend changes. Documented the response fields and date filters for the frontend.

Added 34 unit tests for the analytics and date validation functions using Node's test runner and tsx. The tests cover calculations, zero prices, missing history, moving averages, drawdowns, and invalid dates. All tests pass using sample data. Also checked the statistics endpoint's date filters and error responses.

## Sources and tools
Used Express, Node.js’s SQLite module, TypeScript, tsx, npm, PowerShell, and GitHub. Consulted the Express, Node.js SQLite, and Alpha Vantage documentation.
https://expressjs.com/
https://nodejs.org/download/release/v22.14.0/docs/api/sqlite.html
https://www.alphavantage.co/documentation/

Used Node's test and assertion documentation for the unit-test suite. Formula references are recorded in the backend README.
https://nodejs.org/api/test.html
https://nodejs.org/api/assert.html
https://openai.com/codex/
