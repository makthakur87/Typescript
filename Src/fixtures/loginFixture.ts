// src/fixtures/loginFixture.ts
import { test as base, BrowserContext, Page, expect as baseExpect, TestInfo } from "@playwright/test";
import { LoginPage } from "@config/utils/login/loginPage";

/**
 * Fixtures available in tests
 */
type TestFixtures = {
  page: Page;
  loginPage: LoginPage;
};

/**
 * Worker fixtures
 */
type WorkerFixtures = {
  loggedInContext: {
    context: BrowserContext;
    // persistentLoginPage: Page;
  };
  envName: string;
  aliasName: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // ENV
  envName: [async ({}, use, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    const envName = process.env.ENV_NAME || envFromProject || "dev";
    await use(envName);
  }, { scope: "worker" }],

  // USER
  aliasName: [async ({}, use) => {
    const aliasName = process.env.LOGIN_USER || "abc";
    await use(aliasName);
  }, { scope: "worker" }],

  // LOGIN ONCE PER WORKER
  loggedInContext: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      // const persistentLoginPage = await context.newPage();
      // await use({ context, persistentLoginPage });
      await use({ context });
      // Do NOT close context here; page fixture will handle per-test pages
    },
    { scope: "worker" }
  ],

  // CREATE PAGE FOR EACH TEST
  page: async ({ loggedInContext, envName, aliasName }, use, testInfo) => {
    const page = await loggedInContext.context.newPage();
    const loginPage = new LoginPage(page);

    // --------------------------
    // Step 1: Determine project language
    // --------------------------
    const projectLang = (testInfo.project.metadata as any).LANG as "en" | "fr";

    // --------------------------
    // Step 2: Login
    // --------------------------
    await loginPage.login(envName, aliasName, projectLang);

    // --------------------------
    // Step 3: Provide page to test
    // --------------------------
    await use(page);
    await page.close();
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export const expect = baseExpect;