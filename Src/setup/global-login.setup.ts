import { chromium } from "@playwright/test";
import path from "path";
import { LoginPage } from "../config/utils/loginPage";

async function globalSetup() {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const envName = process.env.ENV_NAME || "uat-green";
  const aliasName = process.env.LOGIN_USER || "abc";
  const lang = process.env.LANG || "en"; // en or fr

  const loginPage = new LoginPage(page);

  // 1. Login in EN (default)
  console.log("Step 1: Login EN");
  await loginPage.login(envName, aliasName);

  // If language is EN, we are done
  if (lang === "en") {
    console.log("Saving EN session...");
    const storagePath = path.join(__dirname, "../../storageState.json");
    await context.storageState({ path: storagePath });
    await browser.close();
    return;
  }

  // 2. Switch to FR inside profile
  console.log("Step 2: Navigate to profile");
  await page.click("a[href='/customer/info']"); // adjust selector

  console.log("Step 3: Change language to FR");
  await page.selectOption("#CustomerLanguageId", "2"); // adjust selector/value

  console.log("Step 4: Save profile");
  await page.click("input[value='Save']"); // adjust selector
  await page.waitForLoadState("networkidle");

  // 3. Logout
  console.log("Step 5: Logout");
  await page.click("a.ico-logout");
  await page.waitForLoadState("networkidle");

  // 4. Login again (now FR UI)
  console.log("Step 6: Login again (FR UI)");
  await loginPage.login(envName, aliasName);

  // 5. Save FR session
  console.log("Step 7: Save FR session");
  const storagePath = path.join(__dirname, "../../storageState.json");
  await context.storageState({ path: storagePath });

  await browser.close();
}

export default globalSetup;