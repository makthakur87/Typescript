import { test, expect, Page, chromium } from '@playwright/test';

test("browser settings", async() => {
    const browser = await chromium.launch({
        headless: false,
    });
    const context = await browser.newContext();
    await context.addCookies([
        {
            name: "myCookie",
            value: "123456",
            url: "https://example.com",
        },
        {
            name: "myCookie2",
            value: "123456",
            url: "https://example.com",
        }
    ]);

    console.log("Cookies added to the browser context");

    const page = await context.newPage();
    await page.goto('https://www.google.com');
    console.log(`Page title: ${await page.title()}`);

    // get the details of the cookie by name
    const allCookies = await context.cookies();
    const reteriveCookie = allCookies.find(cookie => cookie.name === "myCookie");
    console.log("Printing Cookie Details:", reteriveCookie);

    expect(reteriveCookie).toBeDefined();

    // get all the cookies created by browser
    console.log("total number of cookies created: ", allCookies.length)

    console.log("printing all the cookies");

    for (const cookie of allCookies) {
        console.log(`${cookie.name}: ${cookie.value}`)
    }
    

    // clear all the cookies from the browser
    await context.clearCookies();

    // number of cookies after clearing
    const cookiesAfterClearing = await context.cookies();
    console.log("total number of cookies after clearing: ", cookiesAfterClearing.length)

    expect(cookiesAfterClearing.length).toBe(0);

    await page.waitForTimeout(5000);
});