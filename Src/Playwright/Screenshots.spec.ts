import { test, expect } from "@playwright/test";

test("screenshot test", async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");
    const timestamp = Date.now();

    // page screenshot
    await page.screenshot({ path: `screenshots/homepage-${timestamp}.png` });

    // full page screenshot
    await page.screenshot({ path: `screenshots/homepage-full-${timestamp}.png`, fullPage: true });

    // element screenshot
    const logo = page.locator(".header-logo");
    await logo.screenshot({ path: `screenshots/logo-${timestamp}.png` });

    // section screenshot
    const featuredProducts = page.locator(".product-grid.home-page-product-grid");
    await featuredProducts.screenshot({ path: `screenshots/featured-products-${timestamp}.png` });
});

// screenshot with playwright config settings
test.only("screenshot with playwright config", async ({ page }) => {
    await page.goto('https://demoblaze.com/index.html');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.locator('#loginusername').fill('mandythakur');
    await page.locator('#loginpassword').fill('test@123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Log out' }).click();
});