import { test, expect } from '@playwright/test';

// // npx playwright codegen -o src/Playwright/CodeGenTest.spec.ts
test('test', async ({ page }) => {
  await page.goto('https://demoblaze.com/index.html');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').fill('mandythakur');
  await page.locator('#loginpassword').fill('test@123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  await expect(page.locator('#nameofuser')).toContainText('Welcome mandythakur');
  await page.getByRole('link', { name: 'Log out' }).click();
});