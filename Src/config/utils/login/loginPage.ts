// src/pages/LoginPage.ts

import { Locator, Page, expect } from "@playwright/test";
import { loadEnvironment } from "@utils/envLoader";
import { loadUsers } from "@utils/userLoader";
import { InputBox } from "@utils/InputBox";
import { LoginLocators } from "@pages/interac/locator";
import { generateToken } from "authenticator";
import { authConfig } from "@utils/auth.config";
import { ProfilePage } from "@config/utils/login/profilePage";

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
  private alreadyLoggedIn = false; 

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

  async login(envName: string, aliasName: string, lang: "en" | "en-US" | "fr" = "en"): Promise<void> {
    // if (this.alreadyLoggedIn) {
    //   console.log("Already logged in, skipping login.");
    //   return;
    // }

    const envConfig = loadEnvironment(envName);
    const user = loadUsers(envName, aliasName);
    const url = envConfig.web.baseUrl;

    // console.log(`environment configuration is ${JSON.stringify(envConfig)}`);
    // console.log(`user configuration is ${JSON.stringify(user)}`);
    console.log(`navigating to ${url}`);
    console.log(`Logging in: env=${envName}, user=${aliasName}, lang=${lang}`);

     // ===== STEP 1: Pre-login check =====
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log(`URL ${url} reachable. Proceeding with login.`);
    } catch (error) {
      console.log(`Application unavailable before login: ${error}`);
      return; // Skip login
    }

    // STEP 2: Check if session already active
    if (await this.isLoginSuccessful()) {
      console.log("Session already active");
      if (lang === "fr" && !(await this.isFrenchDashboard())) {
        console.log("dashboard page is in EN, switching to FR");
        await this.switchLanguageAndRelogin(envName, aliasName, lang);
      }
      return;
    }

    // STEP 3: Perform login with retries
    for (let attempt = 1; attempt <= this.MAX_LOGIN_ATTEMPTS; attempt++) {
      console.log(`Login attempt ${attempt}`);

      try {
        // await this.navigateToUrl(url);
        await this.loginToSco(user.userName, user.userPassword);
        await this.waitForPostLogin();
        await this.handleRetryIfPresent();

        const loginSuccess = await this.isLoginSuccessful();

        if (loginSuccess) {
          console.log(`Login successful ✅ on attempt ${attempt} with username ${user.userName}, password ${user.userPassword}, env ${envName}`);
          // ===== STEP 3: Post-login dashboard check =====
          const dashboardAvailable = await this.isPageAvailable(LoginLocators.dashboardHeader, 10000);
          if (!dashboardAvailable) {
            console.log("Dashboard not available after login. Possibly deployment or server error.");
            return; // Skip tests
          }
          // this.alreadyLoggedIn = true;

          // handle language switch for FR tests
          if (lang === "fr" && !(await this.isFrenchDashboard())) {
            console.log("dashboard page is in EN, switching to FR");
            await this.switchLanguageAndRelogin(envName, aliasName, lang);

            // relogin after language switch
            // this.alreadyLoggedIn = false;
            // return await this.login(envName, aliasName, lang);
          }
          // Language is English, no further action needed
          return; // login successful in English, continue
        } else {
          console.log(`Login failed ❌ on attempt ${attempt} with username ${user.userName}, password ${user.userPassword}, env ${envName}`);
        }
      } catch (error) {
        console.log(`Login error on attempt ${attempt}  : ${error}`);
        await this.handleRetryIfPresent();
      }
    }

    throw new Error(`Login failed after ${this.MAX_LOGIN_ATTEMPTS} attempts`);
  }

  private async isFrenchDashboard(): Promise<boolean> {
    const frText = this.page.getByText("Tableau de bord", { exact: false });
    return await frText.isVisible().catch(() => false);
  }

   // ============================================
  // LANGUAGE SWITCH (SSO FLOW)
  // ============================================

  private async switchLanguageAndRelogin(envName: string, aliasName: string, lang: "en" | "en-US" | "fr") {
    console.log(`Switching language to ${lang}`);
    const profilePage = new ProfilePage(this.page);
    await profilePage.navigateToProfile();
    await profilePage.changeLanguage(lang);
    await profilePage.logout();
    console.log("Re-login required after language switch");
    const envConfig = loadEnvironment(envName);
    const user = loadUsers(envName, aliasName);
    await this.page.goto(envConfig.web.baseUrl);
    await this.loginToSco(user.userName, user.userPassword);
    await this.waitForPostLogin();
    await expect(this.dashboardHeader).toBeVisible();
  }

  // ==============================
  // LANGUAGE SWITCH FOR FR TESTS
  // ==============================
  async switchLanguage(lang: "en" | "en-US" | "fr"): Promise<void> {
    const profilePage = new ProfilePage(this.page);
    await profilePage.navigateToProfile();
    await profilePage.changeLanguage(lang);
    await profilePage.logout();
    console.log(`Language switched to ${lang.toUpperCase()}`);
  }

  // ==============================
  // LOGIN METHODS
  // ==============================
  private async navigateToUrl(url: string) {
    await this.page.goto(url);
    await this.page.setViewportSize({ width: 1280, height: 800 });
    await expect(this.loginLink.getLocator()).toBeVisible();
  }

  private async loginToSco(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
    await this.enterToken();
    await this.handleSecurityQuestionIfPresent();
    await this.page.waitForLoadState();
  }

  private async enterToken() {
    if (await this.token.isVisible()) {
      const tokenValue = generateToken(authConfig.secretKey);
      await this.token.fill(tokenValue);
      await this.loginButton.click();
    }
  }

  private async handleSecurityQuestionIfPresent() {
    const isQuestionVisible = await this.securityQuestion.isVisible().catch(() => false);
    const isAnswerVisible = await this.securityAnswer.isVisible().catch(() => false);
    if (isQuestionVisible && isAnswerVisible) {
      const questionText = await this.securityQuestion.getLocator().innerText();
      const answer = this.generateSecurityAnswer(questionText);
      await this.securityAnswer.fill(answer);
      await this.continueButton.click();
      await this.continueButton.getLocator().waitFor({ state: "hidden" });
    }
  }

  private generateSecurityAnswer(questionText: string): string {
    // GENERIC LOGIC - You can externalize this into config if needed
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

  // Check if a page element is visible (post-login/dashboard check)
  private async isPageAvailable(selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.log(`Page not available: ${error}`);
      return false;
    }
  }
}