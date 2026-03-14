// read data from excel file using xlsx package, install it using npm install xlsx
import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/browser/esm/sync';
import fs from "fs";
import xlsx from "xlsx";

// Read test data from EXCEL file
const excelPath = "src/testdata/data.xlsx";
if (!fs.existsSync(excelPath)) {
    throw new Error(`Test data file not found: ${excelPath}`);
}
console.log(`Reading test data from: ${excelPath}`);

const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// convert sheet into JSON
type LoginData = { email: string; password: string; validity: string };
const loginData = xlsx.utils.sheet_to_json<LoginData>(sheet); // Convert sheet to JSON with header row as keys

test.describe("Login Tests with Parameterization", async () => {
    for (const { email, password, validity } of loginData) {
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