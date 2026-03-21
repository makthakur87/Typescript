import { test, expect } from "@playwright/test";
// 3 ways to create trace file(.zip) and view it in trace viewer
// Approach 1 using playwright.config.ts settings
// Approach 2 using command prompt to generate trace file
// npx playwright test mytest.spec.ts --headed --trace on
test("Tracing Test", async ({ page, context }) => {
    // Approach 3 using code to generate trace file
    // npx playwright show-trace trace.zip
    // playwright url: https://trace.playwright.dev
    await context.tracing.start({ screenshots: true, snapshots: true });
    await page.goto('https://demoblaze.com/index.html');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.locator('#loginusername').fill('mandythakur');
    await page.locator('#loginpassword').fill('test@123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect (page.locator('#nameofuser')).toContainText('Welcome mandythakur');
    await page.getByRole('link', { name: 'Log out' }).click();
    await context.tracing.stop({ path: `trace-${Date.now()}.zip` });
});