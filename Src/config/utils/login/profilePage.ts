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

    async changeLanguage(lang: "en" | "en-US" | "fr") {
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
    await this.page.locator("text=Save").click();

    // Wait for reload
    await this.page.waitForLoadState("networkidle");

    console.log(`Language changed to ${lang} (value=${valueToSelect})`);
    }

    async logout() {
        await this.page.locator("text=Logout").click();
        await this.page.waitForLoadState("networkidle");    
        console.log("Logged out successfully");
    }
}