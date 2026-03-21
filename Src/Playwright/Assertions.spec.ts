import { test, expect } from '@playwright/test';

test("Assertions", async({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');

    // Auto retry will automatically retry the assertion until it passes or the timeout is reached
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/', { timeout: 10 * 1000 });
    await expect(page.locator('text=Welcome to our store')).toBeVisible();
    await expect(page.locator("div[class='product-grid home-page-product-grid'] strong")).toHaveText('Featured products'); 

    // Non Retry will not retry the assertion and will fail immediately if it does not pass
    const title = await page.title();
    expect(title.includes("Demo Web Shop")).toBeTruthy(); // This assertion will not be retried and will fail immediately if the title does not include "Demo Web Shop"

    const welcomeText = await page.locator('text=Welcome to our store').textContent();
    expect(welcomeText).toContain("Welcome"); // This assertion will not be retried and will fail immediately if the text content does not match "Welcome to our store"

    // Negating Matchers will automatically retry the assertion until it fails or the timeout is reached
    await expect(page.locator('text=Welcome to our store')).not.toBeVisible(); // auto retry
    expect(welcomeText).not.toContain("Welcome"); // Non Retry

    await page.waitForTimeout(5000);
});

test("Hard/Soft Assertions", async({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');

    // Auto retry will automatically retry the assertion until it passes or the timeout is reached
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/', { timeout: 10 * 1000 });
    await expect(page.locator('text=Welcome to our store')).toBeVisible();
    await expect(page.locator("div[class='product-grid home-page-product-grid'] strong")).toHaveText('Featured products'); 

    // Non Retry will not retry the assertion and will fail immediately if it does not pass
    const title = await page.title();
    expect.soft(title.includes("Demo Web Shop")).toBeTruthy(); // This assertion will not be retried and will fail immediately if the title does not include "Demo Web Shop"

    const welcomeText = await page.locator('text=Welcome to our store').textContent();
    expect.soft(welcomeText).toContain("Welcome"); // This assertion will not be retried and will fail immediately if the text content does not match "Welcome to our store"

    // Negating Matchers will automatically retry the assertion until it fails or the timeout is reached
    await expect.soft(page.locator('text=Welcome to our store')).not.toBeVisible(); // auto retry
    expect.soft(welcomeText).not.toContain("Welcome"); // Non Retry

    const logo = await page.locator("img[alt='Tricentis Demo Web Shop']");
    expect.soft(logo).toBeVisible();

    await page.waitForTimeout(5000);
});