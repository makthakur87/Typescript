// src/fixtures/multiUserManager.ts
import { Page } from "@playwright/test";
import { LoginPage } from "@config/utils/login/loginPage";
import { loadUsers, User } from "@config/utils/userLoader";
import { ProfilePage } from "@config/utils/login/profilePage";

export class MultiUserManager {
  private page: Page;
  private loginPage: LoginPage;
  private envName: string;
  private profilePage: ProfilePage;

  constructor(page: Page, envName: string) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.envName = envName;
    this.profilePage = new ProfilePage(page);
  }

  private getUser(aliasName: string): User {
    return loadUsers(this.envName, aliasName);
  }

  /**
   * Login as a specific user and language.
   * If already logged in as same user/lang, does nothing.
   */
  public async loginAs(aliasName: string, lang?: "en" | "fr") {
    const currentUser = this.loginPage.getCurrentUser();
    const currentLang = this.loginPage.getCurrentLanguage();

    if (currentUser === aliasName && (!lang || currentLang === lang)) {
      console.log(`Already logged in as ${aliasName} | lang=${currentLang}`);
      return;
    }

    // Logout if some other user is logged in
    if (currentUser) {
      console.log(`Logging out current user ${currentUser}`);
      await this.profilePage.logout();
    }

    // Perform login
    await this.loginPage.login(this.envName, aliasName, lang || undefined);
  }

   public async logout() {
    if (!this.loginPage.getCurrentUser()) return;
    await this.profilePage.logout();
  }

  public getCurrentUser() {
    return this.loginPage.getCurrentUser();
  }

  public getCurrentLanguage() {
    return this.loginPage.getCurrentLanguage();
  }
}