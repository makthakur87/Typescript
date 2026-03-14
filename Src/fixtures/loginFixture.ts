// src/fixtures/loginFixture.ts
import { test as base, BrowserContext, Page, expect as baseExpect, TestInfo } from "@playwright/test";
import { LoginPage } from "@config/utils/login/loginPage";
import { MultiUserManager } from "./multiUserManager";
import { ProfilePage } from "@config/utils/login/ProfilePage_Old";

/**
 * Fixtures available in tests
 */
type TestFixtures = {
  page: Page;
  // loginPage: LoginPage;
  multiUserManager: MultiUserManager;
};

/**
 * Worker fixtures
 */
type WorkerFixtures = {
  loggedInContext: {
    context: BrowserContext;
    persistentLoginPage: Page;
    loginPage: LoginPage;
     profilePage: ProfilePage
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
    async ({ browser, envName, aliasName }, use, testInfo) => {
      const context = await browser.newContext();
      const persistentLoginPage = await context.newPage();
      const loginPage = new LoginPage(persistentLoginPage);
      const profilePage = new ProfilePage(persistentLoginPage);
      const projectLang = (testInfo.project.metadata as any).LANG as "en" | "fr";
      await loginPage.login(envName, aliasName, projectLang);
      // const persistentLoginPage = await context.newPage();
      // await use({ context, persistentLoginPage });
      await use({ context, persistentLoginPage, loginPage, profilePage });
      // Do NOT close context here; page fixture will handle per-test pages
      // Worker teardown: logout on last active page
      try {
        const pages = context.pages().filter(p => !p.isClosed());
        if (pages.length > 0) {
          const activePage = pages[pages.length - 1];
          const multiUserManager = new MultiUserManager(activePage, envName);
          await multiUserManager.logout();
        }
      } catch (err) {
        console.log("Logout failed during teardown:", err);
      }

      await context.close();
    },
    { scope: "worker" }
  ],

  // CREATE PAGE FOR EACH TEST
  page: async ({ loggedInContext, envName, aliasName }, use, testInfo) => {
    const page = await loggedInContext.context.newPage();
    // const loginPage = new LoginPage(page);

    // --------------------------
    // Step 1: Determine project language
    // --------------------------
    // const projectLang = (testInfo.project.metadata as any).LANG as "en" | "fr";

    // --------------------------
    // Step 2: Login
    // --------------------------
    // await loginPage.login(envName, aliasName, projectLang);

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

  multiUserManager: async ({ page, envName }, use) => {
    const multiUserManager = new MultiUserManager(page, envName);
    await use(multiUserManager);
  },
});

// test.afterAll(async ({ multiUserManager }) => {
//   await multiUserManager.logout();
// });

export const expect = baseExpect;