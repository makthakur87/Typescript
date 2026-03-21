import { Page, Locator } from "@playwright/test";

export class CartPage {
    private readonly page: Page;
    private readonly productNameInCart: Promise<Array<Locator>>; // locator for all product names in the cart, which are in the second column of the cart table

    constructor(page: Page) {
        this.page = page;
        this.productNameInCart = page.locator("#tbodyid tr td:nth-child(2)").all(); // CSS selector to target the product name in the cart table, which is in the second column of the table row
    }

    // method to check if a specific product is present in the cart by its name
    async isProductInCart(productName: string): Promise<boolean> {
        const productNames = await this.productNameInCart; // get all product name locators in the cart
         
        for (const product of productNames) {
            const name = (await product.textContent())?.trim(); // trim the product name to remove any extra whitespace
            console.log(`Checking product in cart: ${name}`); // log the product name being checked for debugging purposes
            if (name === productName) {
                return true; // return true if the product name matches the expected product name
            }
        }
        return false; // return false if the product name is not found in the cart
    }
}