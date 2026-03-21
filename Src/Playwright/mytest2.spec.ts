import { test, expect } from "@playwright/test";

test("verify page URL", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://automationexercise.com/");

    // step 2 - Verify page URL
    let url: string = await page.url();
    console.log("Page URL is: " + url);

    await expect(page).toHaveURL("https://automationexercise.com/");
});