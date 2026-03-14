import { test, expect } from '@playwright/test';
import fs from "fs";

// Read test data from JSON file
const jsonPath = "src/testdata/data.json";
if (!fs.existsSync(jsonPath)) {
    throw new Error(`Test data file not found: ${jsonPath}`);
}
console.log(`Reading test data from: ${jsonPath}`);

const loginTestData = JSON.parse(fs.readFileSync(jsonPath, "utf-8")); // Validate JSON format

// const loginTestData: { email: string; password: string; validity: string }[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

test.describe("Login Tests with Parameterization", async () => {
    for (const { email, password, validity } of loginTestData) {
        test(`Login test with email: ${email} and password: ${password}`, async ({ page }) => {
            await page.goto("https://demowebshop.tricentis.com/login");
            await page.locator(".ico-login").click();
            await page.locator("#Email").fill(email);
            await page.locator("#Password").fill(password);
            await page.locator("input[value='Log in']").click();

            if (validity.toLowerCase() === "valid") {
                const logoutLink = page.locator("a[href='/logout']");
                console.log("Logout link locator:", await logoutLink.innerText()); // Log the locator for debugging purposes
                await expect(logoutLink).toBeVisible({ timeout: 5000 }); // Verify that the logout link is visible, indicating a successful login
            } else {
                const errorMessage = page.locator(".validation-summary-errors");
                console.log("Error message locator:", await errorMessage.innerText()); // Log the locator for debugging purposes
                await expect(errorMessage).toBeVisible({ timeout: 5000 }); // Verify that an error message is displayed for invalid login attempts
                // assert user still on the login page
                await expect(page).toHaveURL("https://demowebshop.tricentis.com/login", { timeout: 5000 }); // Verify that the user remains on the login page after an unsuccessful login attempt
            }
        });
    };
});