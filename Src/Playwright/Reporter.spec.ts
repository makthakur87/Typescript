import { test, expect } from '@playwright/test';

test.beforeEach("Launching app", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");
});

test.describe("Custom Reporter Tests", () => {
    test("logo test", async ({ page }) => {
        console.log("This is a custom log message for a passing test.");
        await expect(page.locator("img[alt='Tricentis Demo Web Shop']")).toBeVisible();
    });

    test("Title test", async ({ page }) => {
        console.log("This is a custom log message for another passing test.");
        await expect(await page.title()).toContain("Demo Web Shop");
    });

    test("search test", async ({ page }) => {
        console.log("This is a search item test with a custom log message.");
        await page.locator("#small-searchterms").fill("laptop");
        await page.locator("input[value='Search']").click();
        await expect(page.locator("h2 a").nth(0)).toContainText("laptop", {ignoreCase: true});
    });
});