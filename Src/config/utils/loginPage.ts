// src/pages/LoginPage.ts

import { Locator, Page, expect } from "@playwright/test";
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
  readonly password: InputBox;
  readonly token: InputBox;
  readonly loginButton: InputBox;

  readonly securityQuestion: InputBox;
  readonly securityAnswer: InputBox;
  readonly continueButton: InputBox;

  readonly retryButton: InputBox;
  readonly dashboardHeader: Locator;

  private readonly MAX_LOGIN_ATTEMPTS = 3;

  constructor(page: Page) {
    this.page = page;

    this.loginLink = new InputBox(page, LoginLocators.loginLink);
    this.username = new InputBox(page, LoginLocators.username);
    this.password = new InputBox(page, LoginLocators.password);
    this.token = new InputBox(page, LoginLocators.token);
    this.loginButton = new InputBox(page, LoginLocators.loginButton);

    this.securityQuestion = new InputBox(page, LoginLocators.securityQuestion);
    this.securityAnswer = new InputBox(page, LoginLocators.securityAnswer);
    this.continueButton = new InputBox(page, LoginLocators.continueButton);

    this.retryButton = new InputBox(page, LoginLocators.retryButton);
    this.dashboardHeader = page.locator(LoginLocators.dashboardHeader);
  }

  // ==============================
  // MAIN LOGIN METHOD (GENERIC)
  // ==============================

  async login(envName: string, aliasName: string) {
    const envConfig = loadEnvironment(envName);
    const user = loadUsers(envName, aliasName);

    for (let attempt = 1; attempt <= this.MAX_LOGIN_ATTEMPTS; attempt++) {
      console.log(`Login attempt ${attempt}`);

      try {
        await this.navigateToLogin(envConfig.web.baseUrl);
        await this.enterCredentials(user.userName, user.userPassword);
        await this.handleMFAIfPresent();
        await this.handleSecurityQuestionIfPresent();
        await this.waitForPostLogin();

        if (await this.isLoginSuccessful()) {
          console.log("Login successful ✅");
          return;
        }

        await this.handleRetryIfPresent();

      } catch (error) {
        console.log(`Login error: ${error}`);
        await this.handleRetryIfPresent();
      }
    }

    throw new Error(`Login failed after ${this.MAX_LOGIN_ATTEMPTS} attempts`);
  }

  // ==============================
  // PRIVATE STEPS (CLEAN DESIGN)
  // ==============================

  private async navigateToLogin(url: string) {
    await this.page.goto(url);
    await this.page.setViewportSize({ width: 1280, height: 800 });

    await expect(this.loginLink.getLocator()).toBeVisible();
    await this.loginLink.click();
  }

  private async enterCredentials(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  private async handleMFAIfPresent() {
    if (await this.token.isVisible()) {
      const tokenValue = generateToken(authConfig.secretKey);
      await this.token.fill(tokenValue);
      await this.loginButton.click();
    }
  }

  private async handleSecurityQuestionIfPresent() {
    if (
      await this.securityQuestion.isVisible().catch(() => false) &&
      await this.securityAnswer.isVisible().catch(() => false)
    ) {
      const questionText = await this.securityQuestion.getLocator().innerText();

      const answer = this.generateSecurityAnswer(questionText);

      await this.securityAnswer.fill(answer);
      await this.continueButton.click();

      await this.continueButton.getLocator().waitFor({ state: "hidden" });
    }
  }

  private generateSecurityAnswer(questionText: string): string {
    // GENERIC LOGIC
    // You can externalize this into config if needed

    const cleanText = questionText.replace("?", "").trim();
    const words = cleanText.split(" ");
    const lastWord = words[words.length - 1];

    return `abc${lastWord}`;
  }

  private async waitForPostLogin() {
    await this.page.waitForLoadState("networkidle");
  }

  private async handleRetryIfPresent() {
    if (await this.retryButton.isVisible().catch(() => false)) {
      console.log("Retry detected, clicking retry...");
      await this.retryButton.click();
      await this.page.waitForLoadState("networkidle");
    }
  }

  async isLoginSuccessful(): Promise<boolean> {
    try {
      await expect(this.dashboardHeader).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}