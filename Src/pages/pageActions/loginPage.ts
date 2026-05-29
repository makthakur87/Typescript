// src/pages/LoginPage.ts
import { Locator, Page, expect } from "@playwright/test";
import { loadUsers } from "@config/loaders/userLoader";
import { EnvLoader } from "@config/loaders/envLoader";
import { InputBox } from "@utils/InputBox";
import { LoginLocators } from "@pages/pageFactory/loginLocator";
import { generateToken } from "authenticator";
import { authConfig } from "@utils/auth.config";
import { LoginUtils } from "@config/utils/login/loginUtils";


export class LoginPage {
  readonly page: Page;

  // readonly loginLink: InputBox;
  // readonly username: InputBox;
  // readonly password: InputBox;
  // readonly token: InputBox;
  // readonly loginButton: InputBox;

  // readonly securityQuestion: Locator;
  // readonly securityAnswer: InputBox;
  // readonly continueButton: InputBox;

  // readonly retryButton: InputBox;
  // readonly dashboardHeader: Locator;

  private readonly MAX_LOGIN_ATTEMPTS = 3;
  private currentUserKey: string | null = null;
  private currentLanguage: "en" | "fr" | null = null;
  private loginUtils: LoginUtils;

  constructor(page: Page) {
    this.page = page;
    this.loginUtils = new LoginUtils(page);

    // this.loginLink = new InputBox(page, LoginLocators.loginLink);
    // this.username = new InputBox(page, LoginLocators.username);
    // this.password = new InputBox(page, LoginLocators.password);
    // this.token = new InputBox(page, LoginLocators.token);
    // this.loginButton = new InputBox(page, LoginLocators.loginButton);

    // this.securityQuestion = this.page.locator(LoginLocators.securityQuestion);
    // this.securityAnswer = new InputBox(page, LoginLocators.securityAnswer);
    // this.continueButton = new InputBox(page, LoginLocators.continueButton);

    // this.retryButton = new InputBox(page, LoginLocators.retryButton);
    // this.dashboardHeader = page.locator(LoginLocators.dashboardHeader);
  }

  // ==============================
  // MAIN LOGIN METHOD
  // ==============================
  async login(envName: string, aliasName: string, targetLanguage: "en" | "en-US" | "fr" = "en"): Promise<void> {
    const normalizedLang = targetLanguage === "fr" ? "fr" : "en"; // Normalize language for user loading
    if (this.currentUserKey === aliasName && this.currentLanguage === normalizedLang && (await this.loginUtils.isLoginSuccessful())) {
      console.info(`session already active for '${aliasName}' (${normalizedLang}), skipping login...`);
      return;
    }

    // load environment config
    const envConfig = EnvLoader.loadEnvironment(envName);
    // get the url
    const url = envConfig.web.baseUrl;
    console.log(`Navigating to ${url} | env=${envName}, user=${aliasName}, lang=${targetLanguage}`);
    
    // pre login check
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.loginUtils.handleOneTrustPopupIfPresent();
    } catch (error) {
      console.info(`Initial navigation to ${url} failed, Error: ${error}`);
      return;
    }

    // Already logged in & FR/EN dashboard enforcement
    if (await this.loginUtils.isLoginSuccessful()) {
      console.info(`Already logged in with user '${aliasName}'. Verifying language...`);
      const currentLang = await this.loginUtils.getCurrentPageLanguage();
      if (currentLang !== normalizedLang) {
        await this.loginUtils.switchLanguage(targetLanguage);
        await this.loginIntoUrl(envName, aliasName, targetLanguage);
      }
      console.log(`Already logged in and language correct: ${targetLanguage.toUpperCase()}`);
      this.currentUserKey = aliasName;       // ✅ track current user
      this.currentLanguage = targetLanguage === "fr" ? "fr" : "en"; // track language
      return;
    }


    // Perform login with retries
    await this.loginIntoUrl(envName, aliasName, targetLanguage);

    // switch language if needed after login if it is not EN/FR dashboard
    const currLanguage = await this.loginUtils.getCurrentPageLanguage();
    if (currLanguage !== normalizedLang) {
      console.log(`Switching language from ${currLanguage} → ${targetLanguage}`);
      await this.loginUtils.switchLanguage(targetLanguage);
      await this.loginIntoUrl(envName, aliasName, targetLanguage);
    }

    if (!await this.loginUtils.isLoginSuccessful()) {
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
  private async loginIntoUrl(envName: string, aliasName: string, language: "en" | "en-US" | "fr"): Promise<void> {
    const user = loadUsers(envName, aliasName);
    for (let attempt = 1; attempt <= this.MAX_LOGIN_ATTEMPTS; attempt++) {
      console.log(`Login attempt ${attempt}`);

      if (await this.loginUtils.isLoginSuccessful()) {
        console.log(`Already logged in, skipping remaining login attempts '${this.MAX_LOGIN_ATTEMPTS - attempt}'...`);
        return;
      }

      try {
        if (attempt > 1) {
          await this.page.reload({ waitUntil: 'domcontentloaded' });
          await this.loginUtils.handleOneTrustPopupIfPresent();
        }
        await this.loginUtils.loginToSco(user.userName, user.userPassword);
        await this.loginUtils.waitForPostLogin();

        // check if retry button is present and click it to retry login if login failed due to known transient issues
        const retryClicked = await this.loginUtils.handleRetryIfPresent();
        if (retryClicked) {
          console.info("Retrying login due to retry button presence...");
          attempt--;
          continue;
        }

        const loginSuccess = await this.loginUtils.isLoginSuccessful();
        if (loginSuccess) {
          console.info(`able to login with username ${user.userName}, password: ${user.userPassword}, env: ${envName}, & language: ${language}`);
          await this.loginUtils.handleDeferPopup(); // handle defer popup if appears after login
          await this.page.waitForLoadState("domcontentloaded");
          await this.loginUtils.handleOneTrustPopupIfPresent(); // handle OneTrust popup if appears after login
          // post login/overview chekc for page availability
          const dashboardAvailable = await this.loginUtils.isPageAvailable(LoginLocators.dashboardHeader, 10000);
          if (!dashboardAvailable) {
            console.info("Dashboard is not available after login, Possible deployment or server error....");
            return;
          }
          return;
        } else {
          console.info(`unable to login on attempt '${attempt}' with username ${user.userName}, password: ${user.userPassword}, env: ${envName}, & language: ${language}`);
        }
      } catch (err) {
        if (await this.loginUtils.isLoginSuccessful()) { 
          console.info(`dashboard is visible despite timeouts/errors, treating as successful login`);
          await this.loginUtils.handleDeferPopup(); // handle defer popup if appears after login
          await this.page.waitForLoadState("domcontentloaded");
          await this.loginUtils.handleOneTrustPopupIfPresent(); // handle OneTrust popup if appears after login
          return;
        }
        console.info(`Login error on attempt ${attempt} for user ${aliasName} in env ${envName}: ${err}`);

        // check if retry button is present and click it
        const retryClicked = await this.loginUtils.handleRetryIfPresent();
        if (retryClicked) {
          console.info("Retrying login due to retry button presence after error...");
          attempt--;
        }
      }
    }
  }

  // ==============================
  // CURRENT USER 
  // ==============================
  public getCurrentUser(): string | null {
    return this.currentUserKey;
  }

  // ==============================
  // CURRENT LANGUAGE
  // ==============================
  public getCurrentLanguage(): "en" | "fr" {
    return this.currentLanguage || "en"; // default to English if null
  }

  // ==============================
  // clear session (for logout)
  // ==============================
  public clearSession(): void {
    this.currentUserKey = null;
    this.currentLanguage = null;
  }
}