import { test, expect, Locator } from '@playwright/test';

test("Single file upload to the page", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');

    await page.locator("#singleFileInput").setInputFiles("uploads/baby-names-by-state.csv");
    await page.locator("button:has-text('Upload Single File')").click();
    const msg = await page.locator("#singleFileStatus").textContent();
    expect(msg).toContain("baby-names-by-state.csv");
    //Single file selected: baby-names-by-state.csv, Size: 14520944 bytes, Type: text/csv
    console.log(`Message: ${msg}`);

    await page.waitForTimeout(2000);
});

test.only("Multiple files upload to the page", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');

    await page.locator("#multipleFilesInput").setInputFiles(["uploads/baby-names-by-state.csv", "uploads/baby-names.csv", "uploads/invoice_240623_130512.pdf"]);
    await page.locator("button:has-text('Upload Multiple File')").click();
    const msg = await page.locator("#multipleFilesStatus").textContent();
    expect(msg).toContain("baby-names-by-state.csv");
    expect(msg).toContain("baby-names.csv");
    expect(msg).toContain("invoice_240623_130512.pdf");
    //Multiple files selected:
    // invoice_240623_130512.pdf, Size: 24738 bytes, Type: text/pdf
    // baby-names-by-state.csv, Size: 14520944 bytes, Type: text/csv
    // baby-names.csv, Size: 7447879 bytes, Type: text/csv
    console.log(`Message: ${msg}`);

    await page.waitForTimeout(2000);
});