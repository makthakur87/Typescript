/**
 * Test1 - sanity
 * Test2 - sanity, regression
 * Test3 - regression
 * Test4 - sanity, regression, e2e
 * 
 * 1. run only sanity tests - npx playwright test --grep @sanity
 * 2. run only regression tests - npx playwright test --grep @regression
 * 3. run only e2e tests - npx playwright test --grep @e2e
 * 4. run sanity and regression tests - npx playwright test --grep @sanity|@regression
 * 5. run Tests which only sanity not belong to regression - npx playwright test --grep @sanity --grep-invert @regression
 * 6. run Tests which are belongs to both sanity and regression - npx playwright test --grep "(?=.*@sanity)(?=.*@regression)"
 * 7. run Tests which are belongs to both sanity and regression but not e2e - npx playwright test --grep "(?=.*@sanity)(?=.*@regression)" --grep-invert @e2e
 * 8. run Tests belong to either sanity or regression - npx playwright test --grep "@sanity|@regression"
 * 9. run Tests belong to either sanity or regression but not e2e - npx playwright test --grep "@sanity|@regression" --grep-invert @e2e
 * 
 * Regular Expression:
 * (?=.*@sanity) - this will run tests that have @sanity tag
 * (?=.*@regression) - this will run tests that have @regression tag
 * (?=.*@sanity)(?=.*@regression) - this will run tests that have both @sanity and @regression tags
 * npx playwright test --grep "(?=.*@sanity)(?=.*@regression)" - this will run tests that have both @sanity and @regression tags
 * npx playwright test --grep "(?=.*@sanity)(?=.*@regression)" --grep-invert @e2e - this will run tests that have both @sanity and @regression tags but not @e2e tag
 */

import { test, expect, Page } from "@playwright/test";

test("@sanity test1", async({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});

test("check title of home page", { tag: "@sanity" }, async({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});

test("check navigation to Store page", { tag: "@regression" }, async({ page }) => {
    await page.goto("https://www.google.com");
    await page.click("text='Store'");
    await expect(page).toHaveTitle(/Google Store for Google Made Devices & Accessories/);
});

test("check top recommendations", { tag: ["@sanity", "@regression", "@e2e"] }, async({ page }) => {
    await page.goto("https://www.google.com");
    await page.click("text='Store'");
    const value = await page.locator("text='Popular on the Google Store.'");
    await expect(value).toHaveText(/Popular on the Google Store./);
});