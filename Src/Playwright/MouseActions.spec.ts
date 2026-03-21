import { test, expect, Locator } from '@playwright/test';

test("mouse hover", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    const pointme: Locator = page.locator(".dropbtn");
    await pointme.hover();
    await page.waitForTimeout(2000);

    const laptops: Locator = page.locator(".dropdown-content a:nth-child(2)");
    await laptops.hover();
    await page.waitForTimeout(2000);
});

test("right click", async ({ page }) => {
    await page.goto('http://swisnl.github.io/jQuery-contextMenu/demo.html');
    const button: Locator = page.locator("span.context-menu-one");
    await button.click({ button: 'right' });
    await page.waitForTimeout(2000);
});

test("double click", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    const btnCopy: Locator = page.locator("button[ondblclick='myFunction1()']");
    await btnCopy.dblclick();
    await page.waitForTimeout(2000);

    const copyText: Locator = page.locator("#field2");
    await expect(copyText).toHaveValue("Hello World!");
    await page.waitForTimeout(2000);
});

test.only("drag & drop", async ({ page }) => {
    await page.goto('http://www.dhtmlgoodies.com/scripts/drag-drop-custom/demo-drag-drop-3.html#google_vignette');
    const rome: Locator = page.locator("#box6");
    const italy: Locator = page.locator("#box106");
   
    // Approach 1: mouser hover, drag and drop
    await rome.hover();
    await page.mouse.down();
    await italy.hover();
    await page.mouse.up();

    await page.waitForTimeout(2000);

    // Approach 2: drag and drop using the built-in method
    const washington: Locator = page.locator("#box3");
    const usa: Locator = page.locator("#box103");
    await washington.dragTo(usa);

    await page.waitForTimeout(2000);
});