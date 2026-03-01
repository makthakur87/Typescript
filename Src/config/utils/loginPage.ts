// src/pages/LoginPage.ts
import { Page, expect } from "@playwright/test";
import { loadEnvironment } from "./envLoader";
import { loadUsers } from "./userLoader";
import { InputBox } from "./InputBox";
import { LoginLocators } from "../../pages/interac/locator"; 
import { generateToken } from "authenticator";
import { authConfig } from "./auth.config";


export class LoginPage {
  readonly page: Page;
  readonly loginLink: InputBox;
  readonly username: InputBox;
  readonly token: InputBox;
  readonly password: InputBox;
  readonly loginButton: InputBox;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = new InputBox(page, LoginLocators.loginLink);
    this.username = new InputBox(page, LoginLocators.username);
    this.password = new InputBox(page, LoginLocators.password);
    this.token = new InputBox(page, LoginLocators.token);
    this.loginButton = new InputBox(page, LoginLocators.loginButton);
  }

  async goto(url: string) {
    await this.page.goto(url);
    await this.page.setViewportSize({ width: 1280, height: 800 });
    await expect(this.loginLink.getLocator()).toBeVisible({ timeout: 5000 });
    await this.loginLink.click();
    await expect(this.username.getLocator()).toBeVisible({ timeout: 5000 });
    await expect(this.password.getLocator()).toBeVisible({ timeout: 5000 });
    await expect(this.loginButton.getLocator()).toBeVisible({ timeout: 5000 });
  }

  async login(envName: string, aliasName: string) {
    // 1. Load env config
    const envConfig = loadEnvironment(envName);
  
    // 2. Load user credentials
    // const { userName, userPassword } = loadUsers(envName, loginUser);
    const user = loadUsers(envName, aliasName);

    // 3. Navigate and login once
    const url = envConfig.web.baseUrl;

    console.log(`environment configuration is: ${JSON.stringify(envConfig)}`);
    console.log(`user credentials is: ${JSON.stringify(user)}`);
    console.log(`Navigating to URL: ${url} with user: ${aliasName}`);

    await this.goto(url);
    const token: string = generateToken(authConfig.secretKey);
    
    await this.username.fill(user.userName);
    await this.password.fill(user.userPassword);
    await this.loginButton.click();
    // pass 6 digits google/Microsoft authenticator token
    // await this.token.fill(token);
    // await this.loginButton.click();
    await this.page.waitForLoadState();
  }

  async isLoginSuccessful(): Promise<boolean> {
    try {
      const dashboardText = await this.page.locator(LoginLocators.dashboardHeader).textContent();
      console.log(dashboardText);
      await expect(this.page.locator(LoginLocators.dashboardHeader)).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}