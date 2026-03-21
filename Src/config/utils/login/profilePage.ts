import { Page } from "@playwright/test";
import { LoginPage } from "@config/utils/login/loginPage";

export class ProfilePage {
    readonly page: Page;
    readonly loginPage: LoginPage;
   
    // add profile locators here

    constructor(page: Page) {
        this.page = page;

        // add profile page element initializations here
        this.loginPage = new LoginPage(page);
    }   

    async isProfileIconVisible() {
        return await this.page.locator("css=selector-for-profile-icon").isVisible();
    }
    
    async navigateToProfile() {
        await this.page.locator("text=Profile").click();
    }

    async selectLanguage(lang: "en" | "en-US" | "fr") {
        // Map language code to input value
        const valueMap: Record<"en" | "en-US" | "fr", string> = {
            "en": "E",
            "en-US": "U",
            "fr": "F",
        };

        const valueToSelect = valueMap[lang];
        if (!valueToSelect) throw new Error(`Unsupported language: ${lang}`);

        // Select radio button input by value
        const radio = this.page.locator(`input[type="radio"][value="${valueToSelect}"]`);
        await radio.waitFor({ state: "visible", timeout: 5000 });
        await radio.check();

        // Click Save button
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator("text=Save").click()
        ]);

        // Wait for reload
        await this.page.waitForLoadState("networkidle");

        console.log(`Language changed to ${lang} (value=${valueToSelect})`);
    }

    async logout() {
        try {
            // Click logout button if visible
            if (await this.page.locator("text=Logout").isVisible().catch(() => false)) {
            await this.page.locator("text=Logout").click();
            await this.page.waitForLoadState("networkidle");    
            console.log("Logged out successfully");
        }
        // Clear browser session completely
        await this.page.context().clearCookies();
        await this.page.evaluate(() => localStorage.clear());
        await this.page.evaluate(() => sessionStorage.clear());
        this.loginPage.clearSession();
        } catch (err) {
            console.log(`Logout failed, but clearing session anyway: ${err}`);
            this.loginPage.clearSession();
        }
    }
}