const baseURL : string = "https://rickandmortyapi.com";

export async function getStock(ticker:string) {
  let url = new URL(baseURL);
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer YOUR_TOKEN');
headers.append('Ticker', ticker);
headers.append('Action', 'get');
  return await makeAPIcall(url,headers);
}

async function makeAPIcall(url:URL,headers:Headers) {
  try {
    const response = await fetch(url,{ method: 'POST', headers});
 
    // Check if the HTTP status code is OK (200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the data as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
    console.error("Fetch failed:", error.message);
  } else {
    console.error("Unexpected non-error thrown:", String(error));
  }
    
    return null;
  }
}
