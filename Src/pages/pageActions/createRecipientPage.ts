import { createRecipientLocators } from "@pages/pageFactory/createRecipientLocators";
import { Page, Locator } from "@playwright/test";
import { RecipientType } from "service/CreateRecipient/CreateRecipientService";

export class RecipientPage {
    page: Page;
    private recipientCreationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.recipientCreationMessage = page.locator(createRecipientLocators.recipientCreationMessage);
    }

    // write a function to get the creation message text
    async getRecipientCreationMessage(): Promise<string> {
        await this.recipientCreationMessage.waitFor({ state: "visible"});
        return (await this.recipientCreationMessage.innerText()).trim();
    }

    async verifyRecipientCreation(expectedSingleMsg: string, expectedMultiMsg: string): Promise<RecipientType> {
        let actualMsg: string;
        try {
            actualMsg = (await this.getRecipientCreationMessage()).trim().toLowerCase();
        } catch (error) {
            console.error(`Recipient creation failed: No success message appear on the screen. Error: ${error}`);
            // throw new Error("Recipinet is not created. Success message was not displayed.")
            return RecipientType.NONE;
        }

        const singleMsg = expectedSingleMsg.trim().toLowerCase();
        const multiMsg = expectedMultiMsg.trim().toLowerCase();

        if (actualMsg === singleMsg) {
            console.info("Recipient Created. SINGLE account recipient");
            return RecipientType.SINGLE;
        }

        if (actualMsg === multiMsg) {
            console.info("Recipient Created. MULTI account recipient");
            return RecipientType.MULTIPLE;
        }

        console.error(`unexpected recipient creation message, Expected either '${singleMsg}' or '${multiMsg}', but got '${actualMsg}'. Treating as recipient creation failure.`);
        // throw new Error(`unexpected recipient creation message, Expected either '${singleMsg}' or '${multiMsg}', but got '${actualMsg}'`);
        return RecipientType.NONE;
    }
}