// src/fixtures/loginFixture.ts
import { test as base, BrowserContext, Page, expect as baseExpect, TestInfo } from "@playwright/test";
import { LoginPage } from "@config/utils/login/loginPage";
import { ProfilePage } from "@config/utils/login/profilePage";
import { MultiUserManager } from "./multiUserManager";
import { EnvLoader } from "@config/utils/envLoader";
import { ReadTestDataFile } from "@config/utils/readTestData";
import { ReadPropertiesFile } from "@config/utils/readPropertyFile";

type WorkerFixtures = {
  loggedInContext: {
    context: BrowserContext;
    persistentLoginPage: Page;
    loginPage: LoginPage;
    profilePage: ProfilePage;
  };
  envName: string;
  aliasName: string;
  projectLang: "en" | "fr";
};

type TestFixtures = {
  page: Page;
  multiUserManager: MultiUserManager;
  testData: any;
  properties: any;
  testDataFile: string;
  propertiesFile: string;
};


export const test = base.extend<TestFixtures, WorkerFixtures>({
  testDataFile: ["", { option: true }],
  propertiesFile: ["", { option: true }],

  // other fixtures...
  envName: [async ({}, use, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    await use(process.env.ENV_NAME || envFromProject || "dev");
  }, { scope: "worker" }],

  aliasName: [async ({}, use) => await use(process.env.LOGIN_USER || "abc"), { scope: "worker" }],

  projectLang: [async ({}, use, testInfo) => {
    const lang = (testInfo.project.metadata as any)?.LANG || "en";
    await use(lang as "en" | "fr");
  }, { scope: "worker" }],

  // Load Env and login once per worker
  loggedInContext: [async ({ browser, envName, aliasName, projectLang }, use) => {
    EnvLoader.loadEnvironment(envName, projectLang);

    const context = await browser.newContext();
    const persistentLoginPage = await context.newPage();
    const loginPage = new LoginPage(persistentLoginPage);
    const profilePage = new ProfilePage(persistentLoginPage);

    await loginPage.login(envName, aliasName, projectLang);

    await use({ context, persistentLoginPage, loginPage, profilePage });

    // Teardown: logout
    try {
      const multiUserManager = new MultiUserManager(loginPage, persistentLoginPage, envName, profilePage);
      await multiUserManager.logout();
    } catch (err) {
      console.log("Logout failed during teardown:", err);
    }

    await context.close();
  }, { scope: "worker" }],

  page: async ({ loggedInContext }, use) => {
    const page = await loggedInContext.context.newPage();
    await use(page);
    await page.close();
  },

  multiUserManager: async ({ loggedInContext, envName }, use) => {
    const multiUserManager = new MultiUserManager(loggedInContext.loginPage, loggedInContext.persistentLoginPage, envName, loggedInContext.profilePage);
    await use(multiUserManager);
  },

// Load testdata fresh per test
testData: async ({ testDataFile }: TestFixtures, use: (data: any) => Promise<void>, testInfo: TestInfo) => {

  if (!testDataFile) {
    throw new Error("Please provide testDataFile in test.use()");
  }

  const testcaseId = (testInfo.title || "").trim();

  const data = ReadTestDataFile.readTestcase(
    testDataFile,
    testcaseId
  );

  await use(data);
},

  // Load properties fresh per test
  properties: async ({ propertiesFile }: TestFixtures, use: (data: any) => Promise<void>) => {
    if (!propertiesFile) {
      throw new Error("Please provide propertiesFile in test.use()");
    }
    const props = ReadPropertiesFile.read(propertiesFile);
    await use(props);
  }
});

export const expect = baseExpect;