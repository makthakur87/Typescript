// src/tests/baseTest.ts
import { test as base } from "@playwright/test";
import { LoginPage } from "../config/utils/login/loginPage";

type CustomFixtures = {
  loginPage: LoginPage;
  envName: string;
  aliasName: string;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  envName: async ({}, use, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    const envName = process.env.ENV_NAME || envFromProject || "uat-green";
    await use(envName);
  },

  aliasName: async ({}, use) => {
    const aliasName = process.env.LOGIN_USER || "abc";
    await use(aliasName);
  }
});

export const expect = test.expect;