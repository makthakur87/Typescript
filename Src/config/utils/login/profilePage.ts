import { Page } from "@playwright/test";
import { LoginLocators} from "@pages/interac/locator";
import { InputBox } from "@utils/InputBox";

export class ProfilePage {
    readonly page: Page;

    // add profile locators here

    constructor(page: Page) {
        this.page = page;

        // add profile page element initializations here
    }   

    async navigateToProfile() {
        await this.page.locator("text=Profile").click();
    }

    async changeLanguage(lang: "en" | "fr") {
        const dropdown = this.page.locator("#language-dropdown");
        await dropdown.selectOption(lang);
        await this.page.locator("text=Save").click();
        await this.page.waitForLoadState("networkidle");
        console.log(`Language changed to ${lang.toUpperCase()}`);
    }

    async logout() {
        await this.page.locator("text=Logout").click();
        await this.page.waitForLoadState("networkidle");    
        console.log("Logged out successfully");
    }
}