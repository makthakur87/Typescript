import { test, expect, Page, chromium } from '@playwright/test';

const screenWidth = 1920;
const screenHeight = 1080;


test("browser settings", async() => {
    const browser = await chromium.launch({
        headless: false,
        // slowMo: 1000, // slow down by 1 second
        // channel: "chrome", // launch the Chrome browser instead of the default Chromium
        args: ["--start-maximized"] // start the browser maximized
    });
    const context = await browser.newContext({
        // viewport: null, // disables Playwright's default viewport
        screen: { width: screenWidth, height: screenHeight }, // set the screen size to the desired dimensions
        locale: "en-US", // set the locale to English (United States)
        // proxy: { server: "http://myproxy:8080" }, // configure proxy settings if needed
        ignoreHTTPSErrors: true, // ignore HTTPS errors to prevent test failures due to certificate issues

    });
    const page = await context.newPage();
    // await page.goto('https://www.google.com');
    await page.goto('https://expired.badssl.com');
    console.log(`Page title: ${await page.title()}`);
    await page.waitForTimeout(5000);
    // await browser.close();
});