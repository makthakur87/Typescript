// src/tests/baseTest.ts
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/interac/loginPage";
import { loadEnvironment } from "../config/utils/envLoader";
import { loadUsers } from "../config/utils/userLoader";

export class BaseTest {
  private browser!: Browser;
  private context!: BrowserContext;
  private page!: Page;
  private loginPage!: LoginPage;

  async start(browser: Browser) {
    this.browser = browser;
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.loginPage = new LoginPage(this.page);
  }

  async login(envName: string, loginUser: string) {
    // 1. Load env config
    const envConfig = loadEnvironment(envName);
  
    // 2. Load user credentials
    // const { userName, userPassword } = loadUsers(envName, loginUser);
    const user = loadUsers(envName, loginUser);

    // 3. Navigate and login once
    const url = envConfig.web.baseUrl;
    console.log(`Navigating to URL: ${url} with user: ${user.userName}`);
    await this.loginPage.goto(url);
    // await this.loginPage.login(userName, userPassword);
    await this.loginPage.login(user.userName, user.userPassword);
  }

  get pageInstance(): Page {
    if (!this.page) {
      throw new Error("Page instance is not initialized. Call start() first.");
    }
    return this.page;
  }
 
  async stop() {
    await this.page.close();
    await this.context.close();
  }
}