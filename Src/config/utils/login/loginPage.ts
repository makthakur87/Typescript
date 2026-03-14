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

   // ✅ Track current logged-in user and language
  private currentUserKey: string | null = null;
  private currentLanguage: "en" | "fr" | null = null;

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
  async login(envName: string, aliasName: string, targetLanguage: "en" | "en-US" | "fr" = "en"): Promise<void> {
    const user = loadUsers(envName, aliasName);
    const envConfig = loadEnvironment(envName);
    const url = envConfig.web.baseUrl;

    console.log(`Navigating to ${url} | env=${envName}, user=${aliasName}, lang=${targetLanguage}`);
    
    try { await this.page.goto(url, { waitUntil: 'domcontentloaded' }); }
    catch (err) { console.log(`Cannot reach URL ${url}: ${err}`); return; }

    // Already logged in & FR/EN dashboard enforcement
    if (await this.isLoginSuccessful()) {
      const currentLang = await this.getCurrentPageLanguage();
      if (currentLang !== targetLanguage) {
        await this.switchLanguage(targetLanguage);
        await this.loginIntoUrl(envName, aliasName);
      }
      console.log(`Already logged in and language correct: ${targetLanguage.toUpperCase()}`);
      this.currentUserKey = aliasName;       // ✅ track current user
      this.currentLanguage = targetLanguage === "fr" ? "fr" : "en"; // track language
      return;
    }

    // Perform login with retries
    await this.loginIntoUrl(envName, aliasName);

    // Final FR check
    // 3️⃣ Verify language
    const currLanguage = await this.getCurrentPageLanguage();
    if (currLanguage !== targetLanguage) {
      console.log(`Switching language from ${currLanguage} → ${targetLanguage}`);
      await this.switchLanguage(targetLanguage);
      await this.loginIntoUrl(envName, aliasName);
    }

    if (!await this.isLoginSuccessful()) {
      console.log(`Login failed after ${this.MAX_LOGIN_ATTEMPTS} attempts for user ${aliasName} in env ${envName}`);
      throw new Error(`Login failed for user ${aliasName} in env ${envName}`);
    }
    console.log(`Login successful ✅ | Language: ${targetLanguage.toUpperCase()}`);
    // ✅ Track current user and language centrally
    this.currentUserKey = aliasName;
    this.currentLanguage = targetLanguage === "fr" ? "fr" : "en";
  }

  // ==============================
  // Perform Login with retries
  // ==============================
  private async loginIntoUrl(envName: string, aliasName: string): Promise<void> {
    const user = loadUsers(envName, aliasName);

    for (let attempt = 1; attempt <= this.MAX_LOGIN_ATTEMPTS; attempt++) {
      console.log(`Login attempt ${attempt}`);

      try {
        await this.loginToSco(user.userName, user.userPassword);
        await this.waitForPostLogin();
        await this.handleRetryIfPresent();

        if (await this.isLoginSuccessful()) {
          console.log(`Login successful ✅`);

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
    const currentLang = await this.getCurrentPageLanguage();
    if (currentLang === targetLang) return;

    console.log(`Switching language from ${currentLang} → ${targetLang}`);
    const profilePage = new ProfilePage(this.page);
    await profilePage.navigateToProfile();
    await profilePage.selectLanguage(targetLang);
    await this.page.waitForLoadState("domcontentloaded");
    await profilePage.logout();
    console.log(`Language switched ${currentLang} → ${targetLang} | relogin required`);
     // ✅ update currentLanguage after switching
    this.currentLanguage = targetLang === "en-US" ? "en" : targetLang;
  }

  // ==============================
  // CURRENT USER / LANGUAGE GETTERS
  // ==============================
  public getCurrentUser(): string | null {
    return this.currentUserKey;
  }

  public getCurrentLanguage(): "en" | "fr" {
    return this.currentLanguage || "en"; // default to English if null
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

  // ==============================
  // enter token
  // ==============================
  private async enterToken() {
    if (await this.token.isVisible()) {
      const tokenValue = generateToken(authConfig.secretKey);
      await this.token.fill(tokenValue);
      await this.loginButton.click();
    }
  }

  // ==============================
  // security question handling
  // ==============================
  private async handleSecurityQuestionIfPresent() {
    try {
      const isQuestionVisible = await this.securityQuestion.isVisible().catch(() => false);
      const isAnswerVisible = await this.securityAnswer.isVisible().catch(() => false);
      if (isQuestionVisible && isAnswerVisible) {
        const questionText = await this.securityQuestion.getLocator().innerText();
        const answer = this.generateSecurityAnswer(questionText);
        await this.securityAnswer.fill(answer);
        await this.continueButton.click();
        await this.continueButton.getLocator().waitFor({ state: "hidden" });
      } else {
        console.log("No security question detected, proceeding with login...");
      }
    } catch (err) {
      console.log(`Error handling security question: skipping... ${err}`);
    }
  }

  // ==============================
  // generate security answer
  // ==============================
  private generateSecurityAnswer(questionText: string): string {
    const cleanText = questionText.replace("?", "").trim();
    const words = cleanText.split(" ");
    const lastWord = words[words.length - 1];
    return `abc${lastWord}`;
  }

  // ==============================
  // wait for post-login page and handle retry if login fails
  // ==============================
  private async waitForPostLogin() {
    await this.page.waitForLoadState("networkidle");
  }

  // ==============================
  // handle retry if login fails
  // ==============================
  private async handleRetryIfPresent() {
    if (await this.retryButton.isVisible().catch(() => false)) {
      console.log("Retry detected, clicking retry...");
      await this.retryButton.click();
      await this.page.waitForLoadState("networkidle");
    }
  }

  // ==============================
  // handle post-login checks
  // ==============================
  async isLoginSuccessful(): Promise<boolean> {
    try {
      await expect(this.dashboardHeader).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==============================
  // page availability check helper
  // ==============================
  private async isPageAvailable(selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.log(`Page not available: ${error}`);
      return false;
    }
  }

  // ==============================
  // get current page language
  // ==============================
  public async getCurrentPageLanguage(): Promise<"en" | "fr"> {
    const text = await this.dashboardHeader.innerText();
    return text.includes("Tableau de bord") ? "fr" : "en";
  }

  // ==============================
  // alternative get current language method (fallback to profile page if dashboard text is not definitive)
  // ==============================
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

  // ==============================
  // clear session (for logout)
  
  // ==============================
  public clearSession(): void {
    this.currentUserKey = null;
    this.currentLanguage = null;
  }
}