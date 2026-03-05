// src/tests/login.spec.ts
import { test, expect } from "../fixtures/loginFixture";

test("Dashboard is visible", async ({ page }) => {
  await expect(page.locator("text=Dashboard")).toBeVisible();
});

test("Navigate to Profile", async ({ page }) => {
  await page.locator("text=Profile").click();
});

test("Use loginPage helper", async ({ loginPage, page }) => {
  // Example using loginPage helper method
  const loggedIn = await loginPage.isLoginSuccessful();
  expect(loggedIn).toBe(true);

  // Navigate somewhere
  await page.locator("text=Orders").click();
});