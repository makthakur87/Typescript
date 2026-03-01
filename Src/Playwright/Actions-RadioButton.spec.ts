import { test, expect, Locator } from "@playwright/test";

// 2. Radio Button Actions
test("Radio Button Actions", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://testautomationpractice.blogspot.com/");

    const maleRadioButton: Locator = page.locator("#male");
    await expect(maleRadioButton).toBeVisible();
    await expect(maleRadioButton).toBeEnabled();
    let isChecked = await maleRadioButton.isChecked();
    console.log("Male radio button checked state:", isChecked);
    expect(isChecked).toBe(false);

    await maleRadioButton.check();

    await expect(maleRadioButton).toBeChecked();

    isChecked = await maleRadioButton.isChecked();
    console.log("Male radio button checked state:", isChecked);
    expect(isChecked).toBe(true);

    await page.waitForTimeout(2000); 
});