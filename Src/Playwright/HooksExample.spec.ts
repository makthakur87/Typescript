
/*
open app - beforeAll()
login   - beforeEach()
    find products
Logout  - afterEach()

login   - beforeEach()
    add products to cart
logout  - afterEach()

close app - afterAll()
*/

import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeAll('After All Hook - Open App', async ({ browser }) => {
    console.log("This is the After All Hook");
    page = await browser.newPage();
    await page.goto("https://demoblaze.com/index.html");
});

test.afterAll('After All Hook - Close App', async () => {
    console.log("This is the After All Hook");
    await page.close();
});

test.beforeEach('Before Each Hook - Login', async () => {
    console.log("This is the Before Each Hook");
    // perform login steps here using the shared page instance
    await page.click('#login2'); // Click on the login button to open the login modal
    await page.fill('#loginusername', 'mandythakur'); // Fill in the username field
    await page.fill('#loginpassword', 'test@123'); // Fill in the password field
    await page.click('#logInModal .btn-primary'); // Click the login button in the modal to submit the form
    // add assertions here to verify successful login, e.g. check for a logout button or user profile element

});

test.afterEach('After Each Hook - Logout', async () => {
    console.log("This is the After Each Hook");
    // perform logout steps here using the shared page instance
    await page.click('#logout2'); // Click on the logout button to log out
    // add assertions here to verify successful logout, e.g. check for a login button or user profile element
});

test.describe("mygroup", () => {
    test("Test1 - Find Products", async () => {
        console.log("This is Test 1");
        const products = page.locator("#tbodyid .hrefch"); // Locate all product links on the page
        const productCount = await products.count();
        console.log(`Total products found: ${productCount}`); // Log the total number of products found
        await expect(products).toHaveCount(9); // Assert that at least one product is found
    });

    test("Test2 - Add Products to Cart", async () => {
        console.log("This is Test 2");
        await page.locator("text='Samsung galaxy s6'").click();
        page.once('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Product added'); // Assert that the dialog message contains 'Product added'
            await dialog.accept();
        });

        await page.locator('.btn.btn-success.btn-lg').click();

    });
});

