import { Page } from "@playwright/test";
import { ProfilePage } from "@pages/pageActions/profilePage";
import { LoginLocators } from "@pages/pageFactory/loginLocator";
import { expect } from "@fixtures/loginFixture";
import { generateToken } from "authenticator";
import { authConfig } from "../auth.config";

export class LoginUtils {
    private page: Page;
    private currentLanguage: "en" | "fr" | null = null;

    constructor(page: Page) {
        this.page = page;
    }

    
  //////////////////////////////////////////////////
  // switch language
  ///////////////////////////////////////////////////
  async switchLanguage(language: "en" | "en-US" | "fr"): Promise<void> {
    const normalizedLang = language === "en-US" ? "en" : language; // Normalize language for comparison
    const currentLanguage = await this.getCurrentPageLanguage();
    if (currentLanguage === normalizedLang) {
      return;
    }

    console.info(`Switching language from ${currentLanguage} → ${language.toUpperCase()}`);
    const profilePage = new ProfilePage(this.page);
    await profilePage.clickOnProfileIcon();
    await profilePage.clickOnMyProfile();
    await profilePage.selectLanguage(language);
    await this.page.waitForLoadState("domcontentloaded");
    await profilePage.logout();
    console.info(`Language switched ${currentLanguage} → ${language.toUpperCase()} | relogin required`);
     // ✅ update currentLanguage after switching
    this.currentLanguage = language === "en-US" ? "en" : language;
  }


  //////////////////////////////////////////////////
  // navigate to login page
  ///////////////////////////////////////////////////
  async navigateToUrl(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator(LoginLocators.username)).toBeVisible({ timeout: 5000 });
    await expect(this.page.locator(LoginLocators.password)).toBeVisible();
    await expect(this.page.locator(LoginLocators.loginButton)).toBeVisible();
  }

  // ==============================
  // fill credentials and submit login form
  // ==============================
  async loginToSco(username: string, password: string) {
    await this.page.locator(LoginLocators.username).fill(username);
    await this.page.waitForTimeout(1000);
    await this.page.locator(LoginLocators.password).fill(password);
    await this.page.waitForTimeout(1000);
    await this.page.locator(LoginLocators.loginButton).click();
    await this.page.waitForTimeout(2000);
    await this.enterToken();
    await this.page.waitForTimeout(2000);
    await this.enterSecurityAnswerIfPresent();
    await this.page.waitForLoadState("domcontentloaded");
  }

  // ==============================
  // enter token
  // ==============================
  private async enterToken() {
    if (await this.page.locator(LoginLocators.token).isVisible()) {
      const tokenValue: string = generateToken(authConfig.secretKey);
      await this.page.locator(LoginLocators.token).fill(tokenValue);
      await this.page.waitForTimeout(1000);
      await this.page.locator(LoginLocators.loginButton).click();
    }
  }

  // ==============================
  // security question handling
  // ==============================
  private async enterSecurityAnswerIfPresent() {
    try {
      const questionPromise = this.page.locator(LoginLocators.securityQuestion).waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
      const answerPromise = this.page.locator(LoginLocators.securityAnswer).waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
      const [questionVisible, answerVisible] = await Promise.all([questionPromise, answerPromise]);

      if (questionVisible && answerVisible) {
        console.info("Security question detected, attempting to answer...");
        const questionText = await this.page.locator(LoginLocators.securityQuestion).innerText();
        console.info(`Security question text: '${questionText}'`);
        const answer = this.generateSecurityAnswer(questionText);
        console.info(`Generated security answer: '${answer}'`);
        await this.page.locator(LoginLocators.securityAnswer).fill(answer);
        await this.page.waitForTimeout(1000);
        await this.page.locator(LoginLocators.continueButton).click();
        await this.page.locator(LoginLocators.continueButton).waitFor({ state: "hidden" });
      } else {
        // log the HTML for debugging if not found
        const formHtml = await this.page.locator("#id_form").innerHTML().catch(() => "(form not found)");
        console.info("No security question detected, proceeding with login...");
        console.info("[DEBUG] #id_form HTML content for debugging:\n" + formHtml);
      }
    } catch (error) {
      console.info(`Error handling security question: skipping... ${error}`);
      console.info("[DEBUG] exception: " + error);
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
  async waitForPostLogin() {
    await this.page.waitForLoadState("domcontentloaded");
    await Promise.race([
      this.page.locator(LoginLocators.dashboardHeader).waitFor({ state: "visible", timeout: 10000 }).catch(() => null),
      this.page.locator(LoginLocators.retryButton).waitFor({ state: "visible", timeout: 10000 }).catch(() => null)
    ]);
  }

  // ==============================
  // handle retry if login fails
  // ==============================
  async handleRetryIfPresent(): Promise<boolean> {
    if (await this.page.locator(LoginLocators.retryButton).isVisible().catch(() => false)) {
      console.info("Retry detected, clicking retry...");
      await this.page.locator(LoginLocators.retryButton).click();
      await this.page.waitForLoadState("domcontentloaded");
      return true;
    }
    return false;
  }

  /////////////////////////////////////////////////
  // handle Cookie Banner (OneTrust) if appears after navigation
  /////////////////////////////////////////////////
  async handleOneTrustPopupIfPresent(): Promise<void> {
    try {
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(5000); // wait for popup to appear

      // try accpet button first
      const acceptButton = this.page.locator('#onetrust-accept-btn-handler');
      const acceptVisible = await acceptButton.isVisible({ timeout: 2000 }).catch(() => false);
      if (acceptVisible) {
        console.info("OneTrust: accept button detected, clicking Accept all...");
        await acceptButton.scrollIntoViewIfNeeded();
        await acceptButton.click();
        await this.page.waitForTimeout(1000); // wait for popup to close
        console.info("OneTrust: Cookie banner accepted successfully");
        return;
      }

      // try close button if accept not found
      const closeSelectors = ['#onetrust-close-btn-container button', '.onetrust-close-btn-handler', 'button.onetrust-close-btn-handler', '[aria-label="Close"][class*="onetrust"]'];
      for (const selector of closeSelectors) {
        try {
          const closeButton = this.page.locator(selector);
          const closeVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);
          if (closeVisible) {
            console.info(`OneTrust: close button detected with selector '${selector}', clicking Close...`);
            await closeButton.scrollIntoViewIfNeeded();
            await closeButton.click();
            await this.page.waitForTimeout(500); // wait for popup to close
            console.info("OneTrust: Cookie banner closed successfully");
            return;
          }
        } catch (err) {
          // continue next selector if error occurs (e.g. element detached) and log the error
          console.info(`OneTrust: Error while handling close button with selector '${selector}': ${err}`);
        }
      } 
      console.info("OneTrust: No accept or close button detected on Cookie banner after checking multiple selectors.");
    } catch (error) {
      console.info(`OneTrust: No cookie banner detected: ${error}`);
    }
  }

  //////////////////////////////////////////////////
  // Handle defer iFrame popup if appears after login
  //////////////////////////////////////////////////
  async handleDeferPopup(): Promise<void> {
    try {
      await this.page.waitForLoadState("domcontentloaded");

      // check if iFrame exists
      const iFrameElement = await this.page.locator('iframe#kampyleInvite').count();
      if (iFrameElement === 0) {
        console.info("No kampyleInvite iFrame detected, skipping defer popup handling.");
        return;
      }

      const frameLocator = this.page.frameLocator('iframe#kampyleInvite');
      const deferButton = frameLocator.locator('#kplDeferButton');
      try {
        const isDeferVisible = await deferButton.isVisible({ timeout: 3000 }).catch(() => false);
        if (isDeferVisible) {
          console.info("Defer popup detected in iFrame, attempting to close...");
          await deferButton.scrollIntoViewIfNeeded();
          await deferButton.click();
          console.info("Defer popup closed successfully.");

          // verify popup is closed by waiting for button to disappear
          await deferButton.waitFor({ state: "hidden", timeout: 3000 }).catch(() => null);
          console.info("Verified defer popup is closed.");
        } else {
          console.info("Defer button not visible in iFrame, cannot close defer popup.");
        }
      } catch (error) {
        console.info(`Error while handling defer popup: ${error}`);
      }

      const overviewActive = await this.page.locator('a#nav-overview.active').isVisible({ timeout: 5000 }).catch(() => false);
      console.info(`Post-login overview link is active: ${overviewActive ? "active" : "not active"} after popup handling.`);
    } catch (error) {
      console.info("Error occurred while handling defer popup.", error);
    }
  }
  
  // ==============================
  // handle post-login checks
  // ==============================
  async isLoginSuccessful(): Promise<boolean> {
    try {
      await expect(this.page.locator(LoginLocators.dashboardHeader)).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==============================
  // page availability check helper
  // ==============================
  async isPageAvailable(selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout });
      console.info(`Page is available with selector '${selector}'`);
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
    await this.page.locator(LoginLocators.dashboardHeader).waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
    const text = await this.page.locator(LoginLocators.dashboardHeader).innerText();
    return text.includes("Tableau de bord") ? "fr" : "en";
  }
}