import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OverviewPage } from '../pages/OverviewPage';
import { switchLanguagePreference } from '../utils/languageUtils';
import { logger } from '../utils/logger';

export class AuthService {
  constructor(private page: Page) {}

  async loginToURL(
    username: string,
    password: string,
    language: string,
    secretWord: string
  ) {
    logger.trace(`Login Request Received`);
    logger.trace(`username = ${username}, password = ****, language = ${language}`);

    const loginPage = new LoginPage(this.page);
    const overviewPage = new OverviewPage(this.page);

    const currentUser = await overviewPage.getCurrentUserName();

    // If already logged in as same user → skip login
    if (currentUser && currentUser.toLowerCase() === username.toLowerCase()) {
      logger.trace(`User ${username} is already logged in. Navigating to overview page.`);
    } else {
      // If logged in as someone else → ensure logout
      if (currentUser) {
        const usernameVisible = await loginPage.usernameField.isVisible({ timeout: 1000 }).catch(() => false);
        const passwordVisible = await loginPage.passwordField.isVisible({ timeout: 1000 }).catch(() => false);
        const tokenVisible = await loginPage.tokenField.isVisible({ timeout: 1000 }).catch(() => false);
        const loginButtonVisible = await loginPage.loginButton.isVisible({ timeout: 1000 }).catch(() => false);

        const loginFieldsMissing =
          !usernameVisible || !passwordVisible || !tokenVisible || !loginButtonVisible;

        if (loginFieldsMissing) {
          logger.trace(`Sign-out required to end session of user: ${currentUser}`);
          await overviewPage.signOut();
        }
      }

      // Perform login
      logger.trace(`Login started for user: ${username}`);
      await loginPage.userLogin(username, password, secretWord);
    }

    // Switch language preference
    await switchLanguagePreference(this.page, username, password, language);
  }
}
