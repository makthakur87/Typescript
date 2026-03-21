import { test, expect } from '@playwright/test';

// testdata
const searchItems: string[] = ["laptop", "Gift card", "smartphone", "monitor"];

// using for of loop 
for (const item of searchItems) {
    test(`search test with for of loop - ${item}`, async({ page }) => {
        await page.goto("https://demowebshop.tricentis.com/");
        await page.locator("#small-searchterms").fill(item);
        await page.locator("input[value='Search']").click();
        await expect.soft(page.locator("h2 a").nth(0)).toContainText(item, { ignoreCase: true }); // check if the first search result contains the word "Laptop" in its title, ignoring case sensitivity
    });
}


// using forEach function
searchItems.forEach(item => {
    test(`search test with for each loop - ${item}`, async({ page }) => {
        await page.goto("https://demowebshop.tricentis.com/");
        await page.locator("#small-searchterms").fill(item);
        await page.locator("input[value='Search']").click();
        await expect.soft(page.locator("h2 a").nth(0)).toContainText(item, { ignoreCase: true }); // check if the first search result contains the word "Laptop" in its title, ignoring case sensitivity
    });
});

test.describe.only("Search tests with test.describe", () => {
    searchItems.forEach(item => {
        test(`search test with for each loop - ${item}`, async({ page }) => {
            await page.goto("https://demowebshop.tricentis.com/");
            await page.locator("#small-searchterms").fill(item);
            await page.locator("input[value='Search']").click();
            await expect.soft(page.locator("h2 a").nth(0)).toContainText(item, { ignoreCase: true }); // check if the first search result contains the word "Laptop" in its title, ignoring case sensitivity
        });
    });
});