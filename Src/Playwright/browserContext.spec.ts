import { test, expect, Page, chromium, firefox, webkit } from '@playwright/test';

// Browser ---- Context ---- Pages
// Browser: The browser instance (e.g., Chromium, Firefox, WebKit)
// Context: An isolated environment within the browser (like a new incognito window)
            // we can have multiple contexts in a single browser instance, each with its own cookies, cache, and storage
            // we can have multiple contexts for multiple users/apps for the same browser
            // provide a way to operate multiple independent browser sessions
            // Contexts are useful for testing scenarios that require isolation, such as testing multiple users or sessions simultaneously
            // context.newPage() creates a new page within the context, allowing you to interact with it independently of other contexts or pages
            // context.close() will close all pages within that context and free up resources, while browser.close() will close the entire browser instance along with all contexts and pages
            // context.clearCookies() will clear cookies for that specific context, while browser.clearCookies() will clear cookies for all contexts within the browser
            // context.storageState() allows you to capture the current state of the context, including cookies and local storage, which can be saved to a file 
            // and later loaded into a new context using context = await browser.newContext({ storageState: 'path/to/state.json' }) to restore the previous session state.
            // Contexts are particularly useful for testing scenarios that require isolation, such as testing multiple users or sessions simultaneously, without interference from each other.
// Page: A single tab, window, pop up or page within a context

test.describe('Browser Context Tests', () => {
    test('should create a new browser context', async () => {
        // create own browser
        const browser = await chromium.launch(); // create browser instance
        // const browser = await firefox.launch({
        //                 channel: undefined
        //                 });

        // const browser = await webkit.launch({
        //                 channel: undefined
        //                 });
        // create a new browser context
        const context = await browser.newContext(); // create a new context (like a new incognito window)
        // create a new page in the new context
        const page1 = await context.newPage(); // create a new page within the context

        // create another page in the same context
        const page2 = await context.newPage(); // create another page within the same context

        console.log(`number of pages in the context: ${context.pages().length}`); // should output 2

        // navigate to a URL in the new page
        await page1.goto('https://testautomationpractice.blogspot.com/');
        await expect(page1).toHaveTitle("Automation Testing Practice");

        await page2.goto('https://playwright.dev/');
        await expect(page2).toHaveTitle("Fast and reliable end-to-end testing for modern web apps | Playwright");

        await page1.waitForTimeout(3000);
        await page2.waitForTimeout(3000);
    });
});