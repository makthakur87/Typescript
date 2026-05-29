import { chromium, Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "@pages/pageActions/loginPage";

export type GlobalSessions = Record<string, { context: BrowserContext; page: Page }>;

let browser: Browser;

export const setupGlobalSessions = async (langs: ("en" | "fr")[] = ["en", "fr"]): Promise<GlobalSessions> => {
  browser = await chromium.launch({ headless: false });

  const envName = process.env.ENV_NAME || "dev";
  const aliasName = process.env.LOGIN_USER || "abc";
  const sessions: GlobalSessions = {};

  for (const lang of langs) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    console.log(`Logging in user "${aliasName}" for lang=${lang.toUpperCase()}`);
    await loginPage.login(envName, aliasName, lang);

    sessions[lang] = { context, page };
  }

  console.log("Global sessions ready ✅");
  return sessions;
};