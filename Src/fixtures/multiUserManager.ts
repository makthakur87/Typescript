// src/fixtures/multiUserManager.ts
import { Page } from "@playwright/test";
import { LoginPage } from "@pages/pageActions/loginPage";
import { loadUsers, User } from "@config/loaders/userLoader";
import { ProfilePage } from "@pages/pageActions/profilePage";

export class MultiUserManager {
  private persistentLoginPage: Page;
  private loginPage: LoginPage;
  private envName: string;
  private profilePage: ProfilePage;

  constructor(loginPage: LoginPage, persistentLoginPage: Page, envName: string, profilePage: ProfilePage) {
    this.persistentLoginPage = persistentLoginPage;
    this.loginPage = loginPage;
    this.envName = envName;
    this.profilePage = profilePage;
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
    const myProfileIcon = await this.profilePage.isProfileIconVisible().catch(() => false);
    if (!myProfileIcon) {
      console.log("No user is currently logged in.");
      return;
    }
    await this.profilePage.logout();
  }

  public getCurrentUser() {
    return this.loginPage.getCurrentUser();
  }

  public getCurrentLanguage() {
    return this.loginPage.getCurrentLanguage();
  }

  public getCurrentEnvName(): string {
    return this.envName;
  }

  public getContext() {
    return {
      envName: this.getCurrentEnvName(),
      currentUser: this.getCurrentUser(),
      currentLanguage: this.getCurrentLanguage(),
    };
  }
}