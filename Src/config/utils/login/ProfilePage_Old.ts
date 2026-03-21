import { Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToProfile() {
    await this.page.click("a[href='/customer/info']");
  }

  async changeLanguage(lang: "en" | "fr") {
    const value = lang === "fr" ? "2" : "1";

    await this.page.selectOption("#CustomerLanguageId", value);
    await this.page.click("input[value='Save']");
    await this.page.waitForLoadState("networkidle");
  }

  async logout() {
    await this.page.click("a.ico-logout");
    await this.page.waitForLoadState("networkidle");
  }
}