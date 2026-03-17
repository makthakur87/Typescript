import { Page, Locator } from "@playwright/test";

export class HomePage {
    private readonly page: Page;
    // private readonly productListLocator: string;
    private readonly productListLocator: Promise<Array<Locator>>; // locator for all product links on the home page, which are inside the product cards
    private readonly addToCartButton: Locator;
    private readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // CSS selector targeting all product links under the product cards, 
        // this.productListLocator = "div#tbodyid div.card h4.card-title a"; // locator for all product links on the home page, which are inside the product cards
        this.productListLocator = page.locator("div#tbodyid div.card h4.card-title a").all(); // locator for all product links on the home page, which are inside the product cards, using .all() to get an array of locators 

        // Add to cart button (exact match using text)
        this.addToCartButton = page.locator("a:has-text('Add to cart')"); // locator for the "Add to Cart" button, using text selector to ensure we get the correct button


        this.cartLink = page.locator("#cartur"); // locator for the cart link in the navigation bar, which takes the user to the cart page
    }

    // method to add a specific product to the cart by its name
    async addProductToCart(productName: string): Promise<void> {
        // Find the product link that matches the given product name
        // const productElements = await this.page.locator(this.productListLocator).all();
        const productElements = this.productListLocator

        for (const productElement of await productElements) {
            const name = await productElement.textContent();
            if (name?.trim() === productName) {
                await productElement.click();
                break; // exit the loop once the product is found and clicked
            }
        }

        // handle alert/dialog after clicking "Add to Cart"
        this.page.once("dialog", async (dialog) => {
            if (dialog.message().includes("added")) {
                await dialog.accept(); // accept the alert dialog that appears after adding a product to the cart
            }
        });

        await this.addToCartButton.click(); // click the "Add to Cart" button after navigating to the product page
    }

    async navigateToCart(): Promise<void> {
        await this.cartLink.click(); // click the cart link to navigate to the cart page
    }
}