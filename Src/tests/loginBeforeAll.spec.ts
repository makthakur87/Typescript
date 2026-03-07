// src/tests/login.spec.ts
// # EN tests
// ENV_NAME=uat-green LOGIN_USER=abc LANG=en USE_GLOBAL_LOGIN=true npx playwright test

// # FR tests
// ENV_NAME=uat-green LOGIN_USER=abc LANG=fr USE_GLOBAL_LOGIN=true npx playwright test
import { ProfilePage } from "@config/utils/login/profilePage";
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

  // Runs once after all tests in this file
 test.afterAll(async ({ loggedInContext }) => {
  try {
    // Create a new page from the logged-in context
    // const page = await loggedInContext.newPage();
    const { persistentLoginPage } = loggedInContext;
    // const profilePage = new ProfilePage(page);
    const profilePage = new ProfilePage(persistentLoginPage);

    await profilePage.navigateToProfile();
    await profilePage.logout();

    console.log("✅ Logout completed after this test file");
    await persistentLoginPage.close();
  } catch (error) {
    console.log(`⚠️ Logout failed after test file: ${error}`);
  }
});
});