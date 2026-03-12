/**
 * only
 * skip
 * fail
 * fixme
 * slow
 */

import { test, expect, Page } from "@playwright/test";

// only - execute only test
// test.only("test1", async({ page }) => {
test("test1", async({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});

// skip the test
test.skip("test2", async({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});

// skip the test based on some condition
test("test3", async({ page, browserName }) => {
    test.skip(browserName === "chromium", "Skipping test on Chromium browser");
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});

// fail the test
test.fail("test4", async({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});

// fixme - it also skip the test, but it will be marked as fixme in the report, so you can easily identify and track the tests that need to be fixed
test.fixme("test5", async({ page }) => {
    await page.goto("https://www.google.com");
    // no assertion here, so it will be marked as fixme
});

// slow - it will not skip the test, but it will be marked as slow in the report, so you can easily identify and track the tests that are taking longer than expected
test("test6", async({ page }) => {
    test.slow(); // triple the default timeout for this test to allow for longer execution time
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
});
  
  