// scrolling - Playwright automatically scrolls to the element before performing any action on it. 
// However, you can also scroll to a specific position on the page using the page.evaluate() method.
import { test, expect } from '@playwright/test';

test("scrolling to footer", async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');
    const footerText: string = await page.locator(".footer-disclaimer").innerText();
    console.log(`Footer Text: ${footerText}`);
    await page.waitForTimeout(5000);
});

test("scrolling inside the dropdown", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    await page.locator("#comboBox").click();
    const option = page.locator("#dropdown div:nth-child(100)");
    console.log(`Option Text: ${await option.innerText()}`);
    await page.waitForTimeout(2000);
    option.click();
    await page.waitForTimeout(2000);
});

test("scrolling inside the table", async ({ page }) => {
    await page.goto('https://datatables.net/examples/basic_init/scroll_xy.html');
    const name = await page.locator("tbody tr:nth-child(10) td:nth-child(2)").innerText();
    console.log(`Last Name from 10th Row & 2nd Column: ${name}`);
    await page.waitForTimeout(2000);

    const email = await page.locator("tbody tr:nth-child(10) td:nth-child(9)").innerText();
    console.log(`Email from 10th Row & 9th Column: ${email}`);
});

test("Infinite scrolling on the page", async ({ page }) => {
    test.slow(); // mark this test as slow to prevent it from being marked as flaky due to the time it takes to load all content during infinite scrolling
    await page.goto('https://www.booksbykilo.in/new-books?pricerange=201to500');
    
    let previousHeight = 0;
    while (true) {
        await page.waitForTimeout(5000); 

         await page.evaluate(() => {
                window.scrollBy(0, document.body.scrollHeight); // scroll down
        });

        await page.waitForTimeout(2000); 
         const currentHeight = await page.evaluate(() => {
            return document.body.scrollHeight; // capture the current height of the page after scrolling
        });
        console.log(`previouse height: ${previousHeight}, current height: ${currentHeight}`);

        if (currentHeight === previousHeight) {
            break; // no more content to load
        }
        previousHeight = currentHeight;
    }

    console.log(`reached the end of the page, total height: ${previousHeight}`);
   
    await page.waitForTimeout(2000); 
});

test.only("Infinite scrolling - find the book on the page", async ({ page }) => {
    test.slow(); // mark this test as slow to prevent it from being marked as flaky due to the time it takes to load all content during infinite scrolling
    await page.goto('https://www.booksbykilo.in/new-books?pricerange=201to500');
    
    let previousHeight = 0;
    let bookFound = false;
    while (true) {
        await page.waitForTimeout(5000); 
        const titles = await page.locator("#productsDiv h3").allTextContents();
        if (titles.includes("Ratburger")) {
            console.log("Book found on the page!");
            bookFound = true;
            expect(bookFound).toBeTruthy();
            break;
        } 

        await page.evaluate(() => {
                window.scrollBy(0, document.body.scrollHeight); // scroll down
        });

        await page.waitForTimeout(2000); 
         const currentHeight = await page.evaluate(() => {
            return document.body.scrollHeight; // capture the current height of the page after scrolling
        });
        console.log(`previouse height: ${previousHeight}, current height: ${currentHeight}`);

        if (currentHeight === previousHeight) {
            break; // no more content to load
        }
        previousHeight = currentHeight;
    }

    console.log(`reached the end of the page, total height: ${previousHeight}`);

    if (!bookFound) {
        console.log("book is not found")
    }
   
    await page.waitForTimeout(2000); 
});