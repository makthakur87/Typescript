// install csv-parse package to read CSV file using npm install csv-parse
import { test, expect } from '@playwright/test';
import fs from "fs";
import { parse } from "csv-parse/sync";

// Read test data from CSV file
const csvPath = "src/testdata/data.csv";
if (!fs.existsSync(csvPath)) {
    throw new Error(`Test data file not found: ${csvPath}`);
}
console.log(`Reading test data from: ${csvPath}`);

const csvData = fs.readFileSync(csvPath, "utf-8");
interface LoginData {
    email: string;
    password: string;
    validity: string;
}
const records = parse(csvData, {columns: true, skip_empty_lines: true}) as LoginData[]; // Parse CSV data into an array of objects

test.describe("Login Tests with Parameterization", async () => {
    for (const data of records) {
        test(`Login test with email: ${data.email} and password: ${data.password}`, async ({ page }) => {
            await page.goto("https://demowebshop.tricentis.com/login");
            await page.locator(".ico-login").click();
            await page.locator("#Email").fill(data.email);
            await page.locator("#Password").fill(data.password);
            await page.locator("input[value='Log in']").click();

            if (data.validity.toLowerCase() === "valid") {
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