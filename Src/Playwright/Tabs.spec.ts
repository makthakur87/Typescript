import { test, expect, Page, chromium } from '@playwright/test';

test("handle multiple tabs", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const parentPage = await context.newPage(); // create a new page within the context
    // const page2 = await context.newPage(); // create another page within the same context
    console.log(`number of pages in the context: ${context.pages().length}`); // should output 2

    await parentPage.goto('https://testautomationpractice.blogspot.com/');

    // create event
    // context.waitForEvent('page'); // pending, fulfilled, rejected
    // parentPage.locator("button:has-text('New Tab')").click(); // click on the link to open a new tab

    // wait for the new page (tab) to open and click on the link to open a new tab simultaneously
    const [childPage] = await Promise.all([
        context.waitForEvent('page'), // wait for the new page (tab) to open
        parentPage.locator("button:has-text('New Tab')").click() // click on the link to open a new tab
    ]);

    // Approach 1: switch between tabs and get titles
    const pages = context.pages(); // get all pages in the context
    console.log(`number of pages in the context: ${pages.length}`);

    console.log(`Parent page title: ${await pages[0].title()}`);
    console.log(`Child page title: ${await pages[1].title()}`);

    // Approach 2: alternate
    console.log(`Parent page title: ${await parentPage.title()}`);
    console.log(`Child page title: ${await childPage.title()}`);
});