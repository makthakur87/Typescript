// src/pages/LoginPage.ts
import { Page, expect, test } from "@playwright/test";
import { InputBox } from "../InputBox";
import { LoginLocators } from "./locator";


export class LoginPage {
  readonly page: Page;
  readonly loginLink: InputBox;
  readonly username: InputBox;
  readonly password: InputBox;
  readonly loginButton: InputBox;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = new InputBox(page, LoginLocators.loginLink);
    this.username = new InputBox(page, LoginLocators.username);
    this.password = new InputBox(page, LoginLocators.password);
    this.loginButton = new InputBox(page, LoginLocators.loginButton);
  }

  async goto(url: string) {
    await test.step(`Navigate to ${url}`, async () => {
      await this.page.goto(url);
      await this.page.setViewportSize({ width: 1280, height: 800 });
      await expect(this.loginLink.getLocator()).toBeVisible({ timeout: 5000 });
      await this.loginLink.click();
      await expect(this.username.getLocator()).toBeVisible({ timeout: 5000 });
      await expect(this.password.getLocator()).toBeVisible({ timeout: 5000 });
      await expect(this.loginButton.getLocator()).toBeVisible({ timeout: 5000 });
    });
  }

  async login(username: string, password: string) {
    await test.step(`Login with username: ${username}`, async () => {
      await this.username.fill(username);
      await this.password.fill(password);
      await this.loginButton.click();
      // pass 6 digits google/Microsoft authenticator token
       await this.loginButton.click();
    });
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