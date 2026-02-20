// src/tests/baseTest.ts
import { test as base, expect } from "@playwright/test";
import { loadEnvironment } from "../config/utils/envLoader";
import { getUser } from "../config/utils/userLoader";
import { LoginLocators } from "../pages/interac/locator";

const profile = (process.env.ENV || "uat-green").trim();
const env = loadEnvironment(profile);

console.log("PROFILE RAW:", process.env.ENV);
console.log("PROFILE USED:", profile);

const loginAlias = process.env.LOGIN_USER || "rwq"; // $env:LOGIN_USER="abc"
const user = getUser(profile, loginAlias);

console.log(">>> Using baseTest from:", __filename);
console.log(">>> ENV:", profile);


export const test = base.extend<{ page: any }>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const user = getUser(profile, loginAlias);
    


    // === BEFORE ALL LOGIN ===
    await page.goto(env.web.baseUrl);
    console.log(">>> BASE URL:", env.web.baseUrl);

    // click on Login button to open the login form
    await page.click(LoginLocators.loginBtn);
    await page.fill(LoginLocators.email, user.userName);
    await page.fill(LoginLocators.password, user.userPassword);
    await page.click(LoginLocators.loginButton);

    const dashboardText = await page.locator(LoginLocators.dashboardHeader).textContent();
    console.log(dashboardText);
    await expect(page.locator(LoginLocators.dashboardHeader)).toBeVisible();

    await use(page);

    await context.close();
  },
});

