// src/tests/login.spec.ts
import { test } from "@playwright/test";
import { BaseTest } from "./baseTest";
import { LoginLocators } from "../pages/interac/locator";

test.describe("Login Tests", () => {
  let baseTest: BaseTest;

  test.beforeAll(async ({ browser }, testInfo) => {
    const envFromProject = (testInfo.project.metadata as any)?.ENV_NAME;
    const envName = process.env.ENV_NAME || envFromProject || "uat-green";

    const loginUser = process.env.LOGIN_USER || "abc"; // or "admin" if that exists in JSON

    console.log(`Running tests with environment: ${envName}`);
    console.log(`Running tests with login user: ${loginUser}`);

    baseTest = new BaseTest();
    await baseTest.start(browser);
    await baseTest.login(envName, loginUser);
  });

  test.afterAll(async () => {
    await baseTest.stop();
  });

  test("dummy check after login", async () => {
    const page = baseTest.pageInstance;
    // Example: assert something visible after login
    await page.waitForSelector(LoginLocators.dashboardHeader, { timeout: 5000 });
  });
});