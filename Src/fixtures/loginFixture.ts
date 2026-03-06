// src/fixtures/loginFixture.ts

import { test as base, BrowserContext, Page } from "@playwright/test";
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
  loggedInContext: BrowserContext;
  envName: string;
  aliasName: string;
  lang: 'en' | 'fr';
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

  // LANGUAGE
  lang: [
    async ({}, use) => {
      const rawLang = process.env.LANG || "en";
      // normalize values like EN-US.UTF-8 or fr_CA.UTF-8
      const normalizedLang = rawLang.toLowerCase().startsWith("fr") ? "fr" : "en";
      console.log(`Detected language: ${rawLang} → Using: ${normalizedLang}`);
      await use(normalizedLang as "en" | "fr");
    },
    { scope: "worker" }
  ],

  // LOGIN ONCE PER WORKER
  loggedInContext: [
    async ({ browser, envName, aliasName, lang }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      // ✅ login happens once
      await loginPage.login(envName, aliasName, lang);

      await page.close();
      await use(context);
      await context.close();
    }, 
    { scope: "worker" }
  ],

  // CREATE PAGE FOR EACH TEST
  page: async ({ loggedInContext }, use) => {
    const page = await loggedInContext.newPage();
    await use(page);
    await page.close();
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  }

});

export const expect = test.expect;