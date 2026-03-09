import { test, expect } from '@playwright/test';
import fs from 'fs';

test("Download text file from the page", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/p/download-files_25.html');
    await page.locator("#inputText").fill("Weclome");
    await page.locator("#generateTxt").click();
    const [download] = await Promise.all([
        page.waitForEvent("download"), // wait for the download to start
        page.locator("#txtDownloadLink").click()
    ]);
    // await page.waitForEvent("download"); // wait for the download to start
    // await page.locator("#txtDownloadLink").click();

    // save the file to custom path
    const path = 'downloads/testFile.txt';
    await download.saveAs(path);

    // check if file exists in the path
    fs.existsSync(path) ? console.log("File downloaded successfully") : console.log("File download failed");

    // clearn up - delete the downloaded file
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
        console.log("Downloaded file deleted successfully");
    } else {
        console.log("Downloaded file not found for deletion");
    }

    await page.waitForTimeout(2000);
});

test.only("Download pdf file from the page", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/p/download-files_25.html');
    await page.locator("#inputText").fill("Weclome");
    await page.locator("#generatePdf").click();
    const [download] = await Promise.all([
        page.waitForEvent("download"), // wait for the download to start
        page.locator("#pdfDownloadLink").click()
    ]);
    // await page.waitForEvent("download"); // wait for the download to start
    // await page.locator("#txtDownloadLink").click();

    // save the file to custom path
    const path = 'downloads/testFile.pdf';
    await download.saveAs(path);

    // check if file exists in the path
    fs.existsSync(path) ? console.log("File downloaded successfully") : console.log("File download failed");

    // clearn up - delete the downloaded file
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
        console.log("Downloaded file deleted successfully");
    } else {
        console.log("Downloaded file not found for deletion");
    }

    await page.waitForTimeout(2000);
});