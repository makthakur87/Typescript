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
  // MAIN LOGIN METHOD
  // ==============================
  async login(envName: string, aliasName: string, lang: "en" | "en-US" | "fr" = "en"): Promise<void> {
    const user = loadUsers(envName, aliasName);
    const envConfig = loadEnvironment(envName);
    const url = envConfig.web.baseUrl;

    console.log(`Navigating to ${url} | env=${envName}, user=${aliasName}, lang=${lang}`);
    
    try { await this.page.goto(url, { waitUntil: 'domcontentloaded' }); }
    catch (err) { console.log(`Cannot reach URL ${url}: ${err}`); return; }

    // Already logged in & FR/EN dashboard enforcement
    if (await this.isLoginSuccessful()) {
      const currentLang = await this.getCurrentLanguage();
      if (currentLang !== lang) {
        await this.switchLanguage(currentLang);
        await this.loginIntoUrl(envName, aliasName, lang);
      }
      console.log(`Already logged in and language correct: ${lang.toUpperCase()}`);
      return;
    }

    // Perform login with retries
    await this.loginIntoUrl(envName, aliasName, lang);

    // Final FR check
    // 3️⃣ Verify language
    const targetLanguage = await this.getCurrentLanguage();
    if (targetLanguage !== lang) {
      console.log(`Switching language from ${targetLanguage} → ${lang}`);
      await this.switchLanguage(lang);
      await this.loginIntoUrl(envName, aliasName, lang);
    }

    if (!await this.isLoginSuccessful()) {
      console.log(`Login failed after ${this.MAX_LOGIN_ATTEMPTS} attempts for user ${aliasName} in env ${envName}`);
      throw new Error(`Login failed for user ${aliasName} in env ${envName}`);
    }
    console.log(`Login successful ✅ | Language: ${lang.toUpperCase()}`);
  }

  // ==============================
  // Perform Login with retries
  // ==============================
  private async loginIntoUrl(envName: string, aliasName: string, lang: "en" | "en-US" | "fr"): Promise<void> {
    const user = loadUsers(envName, aliasName);

    for (let attempt = 1; attempt <= this.MAX_LOGIN_ATTEMPTS; attempt++) {
      console.log(`Login attempt ${attempt}`);

      try {
        await this.loginToSco(user.userName, user.userPassword);
        await this.waitForPostLogin();
        await this.handleRetryIfPresent();

        if (await this.isLoginSuccessful()) {
          console.log(`Login successful ✅`);
          this.alreadyLoggedIn = true;

          const dashboardAvailable = await this.isPageAvailable(LoginLocators.dashboardHeader, 10000);
          if (!dashboardAvailable) {
            console.log("Dashboard not available after login");
            return;
          }
          break; // exit retry loop
        }
      } catch (err) {
        console.log(`Login error attempt ${attempt}: ${err}`);
        await this.handleRetryIfPresent();
      }
    }
  }

  async switchLanguage(targetLang: "en" | "en-US" | "fr"): Promise<void> {
    const currentLang = await this.getCurrentLanguage();
    if (currentLang === targetLang) return;

    console.log(`Switching language from ${currentLang} → ${targetLang}`);
    const profilePage = new ProfilePage(this.page);
    await profilePage.navigateToProfile();
    await profilePage.changeLanguage(targetLang);
    await profilePage.logout();
    console.log(`Language switched ${currentLang} → ${targetLang} | relogin required`);
  }

  // ==============================
  // Login helpers
  // ==============================
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

  private async isPageAvailable(selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.log(`Page not available: ${error}`);
      return false;
    }
  }

  public async getCurrentLanguage(): Promise<"en" | "fr"> {
    const text = await this.dashboardHeader.innerText();
    return text.includes("Tableau de bord") ? "fr" : "en";
  }

  public async getCurrentLanguage1(): Promise<"en" | "fr"> {
  // Try dashboard text first
  if (await this.dashboardHeader.isVisible()) {
    const text = await this.dashboardHeader.innerText();
    if (text.includes("Tableau de bord")) return "fr";
  }

  // Fallback: profile page
  const profilePage = new ProfilePage(this.page);
  await profilePage.navigateToProfile();
  const radioValue = await this.page.locator('input[type="radio"]:checked').getAttribute('value');
  return radioValue === 'F' ? 'fr' : 'en';
}
}