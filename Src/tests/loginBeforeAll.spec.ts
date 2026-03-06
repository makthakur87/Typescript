// src/tests/login.spec.ts
// # EN tests
// ENV_NAME=uat-green LOGIN_USER=abc LANG=en USE_GLOBAL_LOGIN=true npx playwright test

// # FR tests
// ENV_NAME=uat-green LOGIN_USER=abc LANG=fr USE_GLOBAL_LOGIN=true npx playwright test
import { test, expect } from "../fixtures/loginFixture";

test.describe("English tests", () => {
  test.use({ lang: 'en' }); // all tests in this block use English

  test("Dashboard is visible in EN", async ({ page }) => {
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });
});

test.describe("French tests", () => {
  test.use({ lang: 'fr' }); // all tests in this block use French

  test("Dashboard is visible in FR", async ({ page }) => {
    await expect(page.locator("text=Tableau de bord")).toBeVisible();
  });
});