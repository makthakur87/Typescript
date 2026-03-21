import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/pageActions/Playwright/HomePage';
import { CartPage } from '@pages/pageActions/Playwright/CartPage';
import { LoginPage } from '@pages/pageActions/Playwright/LoginPage';

test.describe('Demoblaze E2E Tests', () => {
    test('should add a product to the cart and verify it is in the cart', async ({ page }) => {
        const homePage = new HomePage(page);
        const cartPage = new CartPage(page);
        const loginPage = new LoginPage(page);

        // Navigate to the home page
        await page.goto('https://demoblaze.com/index.html');

        // Perform login
        await loginPage.performLogin('mandythakur', 'test@123'); // replace with valid credentials

        // Add a specific product to the cart
        const productName = 'Samsung galaxy s6';
        await homePage.addProductToCart(productName);

        // Navigate to the cart page
        await homePage.navigateToCart();

        // Verify that the product is in the cart
        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy(); // assert that the product is found in the cart
    });
});