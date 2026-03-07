import { APIRequestContext } from '@playwright/test';

export async function isServerAvailable(request: APIRequestContext, url: string): Promise<boolean> {
  try {
    const response = await request.get(url, { timeout: 10000 });
    const status = response.status();
    
    // Detect deployment / server issues
    if ([500, 502, 503].includes(status)) {
      console.log("Server is down or deployment running.");
      return false;
    }
    // Server working normally
    if (status >= 200 && status < 400) {
      return true;
    }

    console.log(`Unexpected server status: ${status}`);
    return false;
  } catch (error) {
    console.log(`Server not reachable: ${error}`);
    return false;
  }
}