const baseURL : string = "https://rickandmortyapi.com";

export async function getUser(user:string,pass:string) {
  let url = new URL(baseURL);
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer YOUR_TOKEN');
headers.append('User', 'Anonymous');
headers.append('Pass', 'Password');
headers.append('Action', 'get');
  return await makeAPIcall(url,headers);
}

export async function createUser(user:string,pass:string) {
  let url = new URL(baseURL);
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer YOUR_TOKEN');
headers.append('User', user);
headers.append('Pass', pass);
headers.append('Action', 'create');
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
