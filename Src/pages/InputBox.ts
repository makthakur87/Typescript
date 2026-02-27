import { Locator, Page, expect } from "@playwright/test";

export class InputBox {
    private readonly page: Page;
    private readonly locator: Locator;

    constructor(page: Page, locator: string) {
        this.page = page;
        this.locator = page.locator(locator);
    }  

    // Method to get the underlying Playwright Locator for advanced interactions if needed
    public getLocator(): Locator {
        return this.locator;
    }

    // Method to fill the input box with a value, ensuring it is visible and filled correctly
    async fill(value: string) {
        await expect(this.locator).toBeVisible({ timeout: 5000 }); // Wait for the input box to be visible
        await this.locator.fill(value); // Fill twice to ensure value is set
    }


    // typeText method to type text into the input box, ensuring it is visible and typed correctly
    async typeText(text: string) : Promise<void> {
        await this.locator.fill(text)
    }

    // clear method to clear the input box, ensuring it is visible and cleared correctly
    async clear() : Promise<void> {
        await expect(this.locator).toBeVisible({ timeout: 5000 }); // Wait for the input box to be visible
        await this.locator.fill(''); // Clear the input box
    }

    // click method to click the input box, ensuring it is visible and clickable
    async click() : Promise<void> {
        await expect(this.locator).toBeVisible({ timeout: 5000 }); // Wait for the input box to be visible
        await this.locator.click(); // Click the input box
    }

    // getValue method to retrieve the current value of the input box, ensuring it is visible and has a value
    async getValue() : Promise<string> {
      const value = await this.locator.inputValue(); // Get the current value of the input box
      if (value === null || value === undefined) {
          throw new Error("Input box value is null or undefined");
      }
      return value;
    }

    // isVisible method to check if the input box is visible on the page
    async isVisible() : Promise<boolean> {
        return await this.locator.isVisible(); // Check if the input box is visible
    }

    // waitForVisibility method to wait until the input box is visible on the page
    async waitForVisibility(timeout: number = 5000) : Promise<void> {
        await this.locator.waitFor({ state: 'visible', timeout }); // Wait for the input box to be visible
    }

    // isEnabled method to check if the input box is enabled and can be interacted with
    async isEnabled() : Promise<boolean> {
        return await this.locator.isEnabled(); // Check if the input box is enabled
    }
}
