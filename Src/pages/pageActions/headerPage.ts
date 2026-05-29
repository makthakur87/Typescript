import { Locator, Page } from "@playwright/test";
import { headerLocators } from "@pages/pageFactory/headerLocators";
import { LoginUtils } from "@config/utils/login/loginUtils";

export class HeaderPage {
    private overviewLink: Locator;
    private createRecipient: Locator;
    private paymentsTab: Locator;
    private integratedPaymentsTab: Locator;
    private addOrManageRecipients: Locator;
    private addRecipient: Locator;

    constructor(private page: Page) {
        this.overviewLink = page.locator(headerLocators.overviewLink);
        this.createRecipient = page.locator("//a[contains(@href,'recipientMaintenanceSearch.bns')]");
        this.paymentsTab = page.locator("<<payments locator>>");
        this.integratedPaymentsTab = page.locator("<<integrated payments locator>>");
        this.addOrManageRecipients = page.locator("<<add/manage recipients locator>>");
        this.addRecipient = page.locator("<<add recipinet locator>>");
    }

    async navigateToOverview() {
        const maxLoginAttempts = 3;

        // close defer pop up if present before navigating
        const loginUtils = new LoginUtils(this.page);
        await loginUtils.handleDeferPopup();


        for (let attempt = 1; attempt <= maxLoginAttempts; attempt++) {
            const classValue = await this.overviewLink.getAttribute("class");
            if (classValue?.toLowerCase().includes("active")) {
                await this.overviewLink.click();
                console.log(`Overview link is active after ${attempt - 1} attempts`);
                // close popup again after navigation
                await loginUtils.handleDeferPopup();
                return;
            }

            await this.overviewLink.click().catch(() => null);
            await this.page.waitForLoadState("networkidle");

            // close popup again after navigation
            await loginUtils.handleDeferPopup();
        }

        throw new Error(`overview link did not become active after ${maxLoginAttempts} attempts`);
    }

    async navigateToCreateRecipient() {
        await this.page.waitForLoadState("networkidle");

        if (await this.isCreateRecipientPresentAtOverviewPage()) {
            await this.clickCreateRecipientOnOverviewPage();
            return;
        }

        await this.clickPaymentsTab();
        await this.clickIntegratedPayments();
        await this.clickAddOrManageRecipients();
    }

    async isCreateRecipientPresentAtOverviewPage(): Promise<boolean> {
        return await this.createRecipient.isVisible({ timeout: 5000 }).catch(() => false);
    }

    async clickCreateRecipientOnOverviewPage() {
        await this.createRecipient.click({ timeout: 5000 });
    }

    async clickPaymentsTab() {
        await this.paymentsTab.click();
    }

    async clickIntegratedPayments() {
        await this.integratedPaymentsTab.click();
        const ipClass = await this.integratedPaymentsTab.getAttribute("class");

        if (!ipClass?.toLowerCase().includes("active")) {
            await this.integratedPaymentsTab.click();
        }
    }

    async clickAddOrManageRecipients() {
        await this.addOrManageRecipients.click();
    }

    async clickOnAddRecipient() {
        await this.addRecipient.click();
    }
}