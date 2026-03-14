// src/tests/login.spec.ts
// # EN tests
// ENV_NAME=uat-green LOGIN_USER=abc LANG=en USE_GLOBAL_LOGIN=true npx playwright test

// # FR tests
// ENV_NAME=uat-green LOGIN_USER=abc LANG=fr USE_GLOBAL_LOGIN=true npx playwright test
import { test, expect } from "../fixtures/loginFixture";

test.describe("Login", () => {
  test("Dashboard is visible", async ({ page }) => {
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("multi-user payment workflow", async ({ multiUserManager }) => {
    const user1 = "user1"; // alias from userLoader.json
    const user2 = "user2"; // alias from userLoader.json

    // ------------------------
    // Step 1: User1 login, create recipient & payment
    // ------------------------
    await multiUserManager.loginAs(user1, "en");
    console.log(`Current user: ${multiUserManager.getCurrentUser()} | lang: ${multiUserManager.getCurrentLanguage()}`);
    // create recipient and payment (pseudo-code)
    // await createRecipient();
    // await createPayment();

    // ------------------------
    // Step 2: Switch to User2 to approve payment
    // ------------------------
    await multiUserManager.loginAs(user2, "fr"); // can switch language on login
    console.log(`Current user: ${multiUserManager.getCurrentUser()} | lang: ${multiUserManager.getCurrentLanguage()}`);
    // approve payment
    // await approvePayment();

    // ------------------------
    // Step 3: Back to User1 to submit payment
    // ------------------------
    await multiUserManager.loginAs(user1); // language defaults to last saved in LoginPage
    console.log(`Current user: ${multiUserManager.getCurrentUser()} | lang: ${multiUserManager.getCurrentLanguage()}`);
    // submit payment
    // await submitPayment();
  });

  test.afterAll(async ({ multiUserManager }) => {
    await multiUserManager.logout();
  });
});