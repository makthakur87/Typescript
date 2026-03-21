import { test, expect, Page, chromium } from '@playwright/test';

test("handle pop up", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage(); // create a new page within the context

    await page.goto('https://testautomationpractice.blogspot.com/');

    // multipe pop up handling
    // page.waitForEvent('popup'); // pending, fulfilled, rejected
    // await page.locator("#Popup").click(); // click on the link to open a new window
    await Promise.all([
        page.waitForEvent('popup'), // wait for the new page (pop up) to open
        page.locator("#PopUp").click() // click on the link to open a new window
    ]);

    // Approach 1: switch between tabs and get titles
    const allPopupWindows = context.pages(); // get all pages in the context
    console.log(`number of pages in the context: ${allPopupWindows.length}`);

    console.log(`${allPopupWindows[0].url()}`);
    console.log(`${allPopupWindows[1].url()}`); 
    console.log(`${allPopupWindows[2].url()}`);

    for (const pw of allPopupWindows) {
        console.log(`Page URL: ${pw.url()}`);
        const title = await pw.title();
        console.log(`Page Title: ${title}`);
        if (title.includes("Playwright")) {
            await pw.locator('.getStarted_Sjon').click();
            await page.waitForTimeout(3000);
            await pw.close();
        }
    }

    await page.waitForTimeout(5000);
});


test.only("authenticated pop up", async ({ browser }) => {
    const context = await browser.newContext({ httpCredentials: {username: 'admin', password: 'admin' }});
    const page = await context.newPage(); 
    // await page.goto('https://the-internet.herokuapp.com/basic_auth');

    // Approach 1: handle authentication pop up by passing credentials in the URL
    // https://the-internet.herokuapp.com/basic_auth
    // https://username:password@the-internet.herokuapp.com/basic_auth
    // await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');

    // Approach 2: pass the credentials in the browser context options
    await page.goto('https://the-internet.herokuapp.com/basic_auth');
    await page.waitForLoadState('networkidle'); // wait for the page to load completely

    await expect(page.locator("text=Congratulations")).toBeVisible();
    await page.waitForTimeout(5000);
});