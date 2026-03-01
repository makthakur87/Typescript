import {test, expect} from '@playwright/test';

test.describe('Debugging Tests', () => {
  test('should demonstrate debugging with Playwright', async ({ page }) => {
    // Navigate to a sample page
    await page.goto('https://example.com');
    // Set a breakpoint here to inspect the page state
    debugger;
    // Example assertion to verify the page title
    const title = await page.title();
    expect(title).toBe('Example Domain');
  });
});