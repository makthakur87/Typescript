// src/fixtures/loginFixture.ts
import { test as base, BrowserContext, Page, expect as baseExpect, TestInfo } from "@playwright/test";
import { LoginPage } from "@pages/pageActions/loginPage";
import { ProfilePage } from "@pages/pageActions/profilePage";
import { MultiUserManager } from "./multiUserManager";
import { EnvLoader } from "@config/loaders/envLoader";
import { JsonUtils } from "@config/utils/JsonUtils";
import { PropertyUtils } from "@config/utils/PropertyUtils";
import { getUserFromPool } from "@config/loaders/userLoader";
import { UserAllocator } from "./userAllocator";

type WorkerFixtures = {
  loggedInContext: {
    context: BrowserContext;
    persistentLoginPage: Page;
    loginPage: LoginPage;
    profilePage: ProfilePage;
  };
  envName: string;
  aliasName: string | undefined;
  rAliasName: string;
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
  aliasName: [undefined as string | undefined, { scope: "worker", option: true }],

  testDataFileKeys: [[], { option: true }],
  propertyFileKeys: [[], { option: true }],
  recipientFileKeys: [[], { option: true }],

  // overrideable test level fixture
  aliasName: [undefined as string | undefined, { scope: "worker", option: true }],

  // ENV_NAME can be set via environment variable or project metadata, defaulting to "dev"
  envName: [async ({}, use, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    const envName = process.env.ENV_NAME || envFromProject || "uat-green";
    await use(envName);
  }, { scope: "worker" }],

  // LOGIN_USER can be set via environment variable, defaulting to "abc"
  // aliasName: [async ({}, use) => await use(process.env.LOGIN_USER || "abc"), { scope: "worker" }],
  rAliasName: [
  async ({ aliasName, envName }, use, testInfo) => {
    let loginUser =
      aliasName ||                                 // test.use
      testInfo.project.metadata?.loginUser ||       // test + describe + project metadata
      process.env.LOGIN_USER ||                     // CLI
      null;

    if (!loginUser) {
      loginUser = getUserFromPool(envName);
      console.log(`Auto-assigned user from pool: ${loginUser}`);
    }

    console.log(
      `Worker ${testInfo.workerIndex} using loginUser: ${loginUser}`
    );

    await use(loginUser);
  },
  { scope: "worker", option: true }
],

  // LANG can be set via project metadata, defaulting to "en"
  projectLang: [async ({}, use, testInfo) => {
    const lang = (testInfo.project.metadata as any)?.LANG as "en" | "fr" || "en";
    await use(lang as "en" | "fr");
  }, { scope: "worker" }],

  // Load environment and perform login once per worker
  loggedInContext: [async ({ browser, envName, rAliasName, projectLang }, use) => {
    EnvLoader.loadEnvironment(envName, projectLang);
    if (!rAliasName) {
      throw new Error("NO login user resolved. Provide aliasName/LoginUser or configure user pool.");
    }
    UserAllocator.acquire(rAliasName);
    try {
      const context = await browser.newContext();
      const persistentLoginPage = await context.newPage();
      const loginPage = new LoginPage(persistentLoginPage);
      const profilePage = new ProfilePage(persistentLoginPage);

      await loginPage.login(envName, rAliasName, projectLang);

      await use({ context, persistentLoginPage, loginPage, profilePage });

      // Attempt logout during teardown, but don't fail if it fails (e.g., due to session issues)
      try {
        const multiUserManager = new MultiUserManager(loginPage, persistentLoginPage, envName, profilePage);
        await Promise.race([
          multiUserManager.logout(),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Logout timeout")), 30000),
          ),
        ]).catch ((error) => {
          console.log("Logout skipped or timeout...", error.message);
        });
        console.log("logout successful");
      } catch (error) {
        console.log("logout error....", error);
      }

      await context.close();
    } finally {
      UserAllocator.release(rAliasName);
    }   
  }, { scope: "worker" }],

  // Create a new page for each test, using the logged-in context
  page: async ({ loggedInContext }, use) => {
    // const page = await loggedInContext.context.newPage();
    // await use(page);

    // await use(loggedInContext.persistentLoginPage);
    // await page.close();
    await use(loggedInContext.persistentLoginPage);
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
    testData[fileKey] = await JsonUtils.readTestcaseData(resolvedPath, targetTestcase, true);
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
      props[fileKey] = await PropertyUtils.load(resolvedPath, true);
    }
    await use(props);
  },

  // Load recipient files fresh per test
  recipientFiles: async ({ recipientFileKeys }: TestFixtures, use: (data: any) => Promise<void>) => {
    const recipients: Record<string, string> = {};
    if (recipientFileKeys && recipientFileKeys.length > 0) {
      for (const key of recipientFileKeys) {
          recipients[key] = EnvLoader.getRecipientProfileFilePath(key);
      }
    }
    await use(recipients);
  }
});

export const expect = baseExpect;