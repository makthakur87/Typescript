// src/fixtures/loginFixture.ts
import { test as base, BrowserContext, Page, expect as baseExpect, TestInfo } from "@playwright/test";
import { LoginPage } from "@config/utils/login/loginPage";
import { ProfilePage } from "@config/utils/login/profilePage";
import { MultiUserManager } from "./multiUserManager";
import { EnvLoader } from "@config/loaders/envLoader";
import { ReadTestDataFile } from "@config/utils/readTestData";
import { ReadPropertiesFile } from "@config/utils/readPropertyFileData";

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
  testDataFiles: Record<string, any>;
  propertyFiles: Record<string, any>;
  recipientFiles: Record<string, any>;

  testDataFileKeys: string[];
  propertyFileKeys: string[];
  recipientFileKeys: string[];
};


export const test = base.extend<TestFixtures, WorkerFixtures>({
  testDataFileKeys: [[], { option: true }],
  propertyFileKeys: [[], { option: true }],
  recipientFileKeys: [[], { option: true }],

  // ENV_NAME can be set via environment variable or project metadata, defaulting to "dev"
  envName: [async ({}, use, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    await use(process.env.ENV_NAME || envFromProject || "dev");
  }, { scope: "worker" }],

  // LOGIN_USER can be set via environment variable, defaulting to "abc"
  aliasName: [async ({}, use) => await use(process.env.LOGIN_USER || "abc"), { scope: "worker" }],

  // LANG can be set via project metadata, defaulting to "en"
  projectLang: [async ({}, use, testInfo) => {
    const lang = (testInfo.project.metadata as any)?.LANG || "en";
    await use(lang as "en" | "fr");
  }, { scope: "worker" }],

  // Load environment and perform login once per worker
  loggedInContext: [async ({ browser, envName, aliasName, projectLang }, use) => {
    EnvLoader.loadEnvironment(envName, projectLang);

    const context = await browser.newContext();
    const persistentLoginPage = await context.newPage();
    const loginPage = new LoginPage(persistentLoginPage);
    const profilePage = new ProfilePage(persistentLoginPage);

    await loginPage.login(envName, aliasName, projectLang);

    await use({ context, persistentLoginPage, loginPage, profilePage });

    // Attempt logout during teardown, but don't fail if it fails (e.g., due to session issues)
    try {
      const multiUserManager = new MultiUserManager(loginPage, persistentLoginPage, envName, profilePage);
      await multiUserManager.logout();
    } catch (err) {
      console.log("Logout failed during teardown:", err);
    }

    await context.close();
  }, { scope: "worker" }],

  // Create a new page for each test, using the logged-in context
  page: async ({ loggedInContext }, use) => {
    const page = await loggedInContext.context.newPage();
    await use(page);
    await page.close();
  },

  // Provide MultiUserManager instance for each test, using the logged-in context
  multiUserManager: async ({ loggedInContext, envName }, use) => {
    const multiUserManager = new MultiUserManager(loggedInContext.loginPage, loggedInContext.persistentLoginPage, envName, loggedInContext.profilePage);
    await use(multiUserManager);
  },

// Load test data based on the provided testDataFileKeys and current test title (as testcase_id)
testDataFiles: async ({ testDataFileKeys }: TestFixtures, use: (data: any) => Promise<void>, testInfo: TestInfo) => {
  if (!testDataFileKeys || testDataFileKeys.length === 0) {
    throw new Error("Please provide testDataFileKeys in test.use()");
  }

  const targetTestcase = (testInfo.title || "").trim();
  const testData: Record<string, any> = {};

  for (const fileKey of testDataFileKeys) {
    const resolvedPath = EnvLoader.getTestDataFilePath(fileKey);
    if (!resolvedPath) {
      throw new Error(`No test data file path found for key: ${fileKey}`);
    }
    testData[fileKey] = ReadTestDataFile.readTestcaseData(resolvedPath, targetTestcase, true);
  }

  await use(testData);
},

  // Load properties fresh per test
  propertyFiles: async ({ propertyFileKeys }: TestFixtures, use: (data: any) => Promise<void>) => {
    if (!propertyFileKeys || propertyFileKeys.length === 0) {
      throw new Error("Please provide propertyFileKeys in test.use()");
    }
    const props: Record<string, any> = {};

  for (const fileKey of propertyFileKeys) {
    const resolvedPath = EnvLoader.getPropertyFilePath(fileKey);
    if (!resolvedPath) {
      throw new Error(`No property file path found for key: ${fileKey}`);
    }
    props[fileKey] = ReadPropertiesFile.readPropertyFile(resolvedPath, true);
  }
    await use(props);
  },

  // Load recipient files fresh per test
  recipientFiles: async ({ recipientFileKeys }: TestFixtures, use: (data: any) => Promise<void>) => {
    if (!recipientFileKeys || recipientFileKeys.length === 0) {
      throw new Error("Please provide recipientFileKeys in test.use()");
    }
    const recipients: Record<string, string> = {};
    for (const fileKey of recipientFileKeys) {
        recipients[fileKey] = EnvLoader.getRecipientFilePath(fileKey);
      }
    await use(recipients);

});

export const expect = baseExpect;