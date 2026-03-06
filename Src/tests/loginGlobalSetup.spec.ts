// src/tests/login.spec.ts
import { test, expect } from "../fixtures/baseTest";
import { LoginLocators } from "../pages/interac/locator";
import { TestDataFileLoader } from "../config/utils/testdataFileLoader";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("/");

  const testData = TestDataFileLoader.getFilePath("userJsonFile");
  (testInfo as any).testData = testData;
});

test("dummy check after login", async ({ page }) => {
  // await page.goto("/");
  await page.waitForSelector(LoginLocators.dashboardHeader, { timeout: 5000 });
});