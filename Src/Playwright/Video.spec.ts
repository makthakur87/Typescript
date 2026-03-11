import { test, expect } from "@playwright/test";

// by defualt in playwright.config.ts video recording is set to 'off' to save resources, but you can change it to 'on' or 'retain-on-failure' based on your needs
test("Capture Video Test", async ({ page }) => {
    await page.goto('https://demoblaze.com/index.html');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.locator('#loginusername').fill('mandythakur');
    await page.locator('#loginpassword').fill('test@123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Log out' }).click();
});