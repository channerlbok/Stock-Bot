## November 9
Set up the Express backend with TypeScript and npm dependencies. Created the server entry file, added setup instructions, and configured .gitignore to exclude dependencies, environment files, and build output.

## November 12
Built GET and POST endpoints for stock symbols. Added input validation, uppercase formatting, and duplicate handling. Connected the endpoints to SQLite so saved stocks remain after restarting the server. Checked the routes using PowerShell and the browser.

Submitted the backend work through PRs and addressed review feedback by sorting stock symbols alphabetically.

## November 16
Added shared error handling so the frontend receives consistent JSON responses. Added a JSON 404 response for unknown API routes and clearer messages for Alpha Vantage failures, rate limits, and timeouts. 

## Sources and tools
Used Express, Node.js’s SQLite module, TypeScript, tsx, npm, PowerShell, and GitHub. Consulted the Express, Node.js SQLite, and Alpha Vantage documentation.
https://expressjs.com/
https://nodejs.org/download/release/v22.14.0/docs/api/sqlite.html
https://www.alphavantage.co/documentation/