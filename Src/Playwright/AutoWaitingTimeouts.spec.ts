import { test, expect } from '@playwright/test';

test("auto waiting and forcing", async({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');

    // Assertions will automatically wait for the element to be visible and the URL to be correct
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
    await expect(page.locator('text=Welcome to our store')).toBeVisible();

    // Actions will automatically wait for the element to be visible and enabled
    await page.locator("#small-searchterms").fill("laptop", {force: true}); 
    // Force is used to bypass the default waiting behavior and interact with the element immediately, even if it is not visible or enabled. 
    // This can be useful in certain scenarios where you want to interact with an element that is hidden or disabled, 
    // but it should be used with caution as it can lead to flaky tests if the element is not in a state to receive interactions.
    await page.locator(".button-1.search-box-button").click({ force: true });
});

test("Timeout", async({ page }) => {
    test.setTimeout(60 * 1000); // Set the timeout for this test to 60 seconds to allow for slower environments
    // test.slow(); // Mark this test as slow to prevent it from being marked as failed due to timeout in certain environments
    await page.goto('https://demowebshop.tricentis.com/');

    // Assertions will automatically wait for the element to be visible and the URL to be correct
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/', { timeout: 10 * 1000 });
    await expect(page.locator('text=Welcome to our store')).toBeVisible( { timeout: 10 * 1000 } ); 
    // Override the default expectation timeout for this specific assertion to 10 seconds to allow for slower loading times of the element

    // Actions will automatically wait for the element to be visible and enabled
    await page.locator("#small-searchterms").fill("laptop", { timeout: 10 * 1000, force: true }); 
    await page.locator(".button-1.search-box-button").click({ timeout: 10 * 1000, force: true });
});