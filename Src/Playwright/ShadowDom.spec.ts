// All locators in playwright by default work with elements in shadow DOM.
// the excpetions are"
// Loacting by xpath does not work with shadow DOM elements, we need to use css selector for that.

import { test, expect } from '@playwright/test';

test("Locating element inside the shadow DOM", async ({ page }) => {
    await page.goto('https://books-pwakit.appspot.com/');

    await page.locator("#input").fill("Playwright Automation");

    await page.keyboard.press("Enter");

    await page.waitForTimeout(5000);

    const bookFound = await page.locator("h2.title").all();
    console.log(`Total books found: ${bookFound.length}`);

    expect(bookFound.length).toBeGreaterThan(0);

    await page.waitForTimeout(5000);
});

test.only("Locating element inside the shadow DOM2", async ({ page }) => {
    await page.goto('https://shop.polymer-project.org/');

    await page.locator("a[aria-label=\"Men's Outerwear Shop Now\"]").click();

    await page.waitForTimeout(5000);

    const productsFound = await page.locator("div.title").all();
    console.log(`Total products found: ${productsFound.length}`);

    expect(productsFound.length).toBeGreaterThan(0);
    expect(productsFound.length).toBe(16);

    await page.waitForTimeout(5000);
});