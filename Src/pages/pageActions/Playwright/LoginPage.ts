import { Page, Locator } from "@playwright/test";

export class LoginPage {
    // define the variables for the locators - private and readonly to prevent modification from outside the class
    private readonly page: Page;
    private readonly loginLink: Locator;
    private readonly userNameInput: Locator;
    private readonly passwordInput: Locator
    private readonly loginButton: Locator;

    // constructor to initialize the variables
    constructor(page: Page) {
        this.page = page;
        this.loginLink = page.locator("#login2");
        this.userNameInput = page.locator("#loginusername");
        this.passwordInput = page.locator("#loginpassword");
        this.loginButton = page.locator("button[onclick='logIn()']");
    }

    // actions methods to perform the actions on the page
    async clickLoginLink(): Promise<void> {
        await this.loginLink.click();
    }

    async enterUserName(userName: string): Promise<void> {
        this.userNameInput.clear(); // clear the input field before entering the username
        await this.userNameInput.fill(userName);
    }

    async enterPassword(password: string): Promise<void> {
        this.passwordInput.clear(); // clear the input field before entering the password
        await this.passwordInput.fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async performLogin(userName: string, password: string): Promise<void> {
        await this.clickLoginLink();
        await this.enterUserName(userName);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}