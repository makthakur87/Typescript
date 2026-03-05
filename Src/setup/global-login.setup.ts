// src/setup/global-login.setup.ts
import { chromium } from "@playwright/test";
import path from "path";
import { LoginPage } from "../config/utils/loginPage";
import { ProfilePage } from "../pages/ProfilePage";

async function globalSetup() {
  const browser = await chromium.launch({ channel: "chrome", headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const envName = process.env.ENV_NAME || "uat-green";
  const aliasName = process.env.LOGIN_USER || "abc";
  const lang = (process.env.LANG || "en") as "en" | "fr";

  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);

  console.log("Step 1: Login");
  await loginPage.login(envName, aliasName);

  if (lang !== "en") {
    console.log(`Switching language to ${lang.toUpperCase()}`);
    await profilePage.navigateToProfile();
    await profilePage.changeLanguage(lang);
    await profilePage.logout();

    console.log("Re-login after language switch");
    await loginPage.login(envName, aliasName);
  }

  const storageFileName = `${envName}-${aliasName}-${lang}.json`;
  const storagePath = path.join(__dirname, `../../storage/${storageFileName}`);
  console.log(`Saving storage state to: ${storageFileName}`);
  await context.storageState({ path: storagePath });

  await browser.close();
}

export default globalSetup;