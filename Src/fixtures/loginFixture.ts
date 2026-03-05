// src/fixtures/loginFixture.ts
import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../config/utils/loginPage";

type CustomFixtures = {
  page: Page;           // Logged-in page
  loginPage: LoginPage; // Helper
  envName: string;
  aliasName: string;
};

export const test = base.extend<CustomFixtures>({
  envName: async ({}, use, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    const envName = process.env.ENV_NAME || envFromProject || "dev";
    await use(envName);
  },

  aliasName: async ({}, use) => {
    const aliasName = process.env.LOGIN_USER || "abc";
    await use(aliasName);
  },

  loginPage: async ({ page, envName, aliasName }, use) => {
    const loginPage = new LoginPage(page);

    // Login once per test file
    await test.beforeAll(async () => {
      await loginPage.login(envName, aliasName);
    });

    await use(loginPage);
  },

  page: async ({ page }, use) => {
    await use(page); // Already logged-in via loginPage
  },
});

export const expect = test.expect;