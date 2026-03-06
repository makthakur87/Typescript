// https://playwright.dev/docs/dialogs
// alert(), confirm(), prompt() dialog/JS alerts
// By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. 
// However, you can register a dialog handler before the action that triggers the dialog to 
// either dialog.accept() or dialog.dismiss() it.

import { test, expect } from "@playwright/test";

test("Simple Dialog", async ({ page }) => {
    page.goto("https://testautomationpractice.blogspot.com/");

    // page.on('dialog', dialog => dialog.accept());

    // register a dialog handler
    page.on('dialog', (dialog) => {
        console.log(`Dialog type is: ${dialog.type()}`);
        expect(dialog.type()).toContain("alert");
        console.log(`Dialog message: ${dialog.message()}`);
        expect(dialog.message()).toContain("I am an alert box!");
        dialog.accept();
    });
   
    await page.locator("#alertBtn").click(); // open dialog
    await page.waitForTimeout(3000);
});

test("Confirmation Dialog", async ({ page }) => {
    page.goto("https://testautomationpractice.blogspot.com/");

    // page.on('dialog', dialog => dialog.accept());

    // register a dialog handler
    page.on('dialog', (dialog) => {
        console.log(`Dialog type is: ${dialog.type()}`);
        expect(dialog.type()).toContain("confirm");
        console.log(`Dialog message: ${dialog.message()}`);
        expect(dialog.message()).toContain("Press a button!");
        dialog.accept();  // close dialog by accepting it.
        // dialog.dismiss(); // close dialog by dismissing (cancel) it.
    });
   
    await page.locator("#confirmBtn").click(); // open dialog
    const text: string = await page.locator("#demo").innerText();
    console.log(`output text is: ${text}`)
    // expect(page.locator("#demo")).toHaveText("You pressed Cancel!");
    expect(page.locator("#demo")).toHaveText("You pressed OK!");
    await page.waitForTimeout(3000);
});

test.only("Prompt Dialog", async ({ page }) => {
    page.goto("https://testautomationpractice.blogspot.com/");

    // page.on('dialog', dialog => dialog.accept());

    // register a dialog handler
    page.on('dialog', (dialog) => {
        console.log(`Dialog type is: ${dialog.type()}`);
        expect(dialog.type()).toContain("prompt");
        console.log(`Dialog message: ${dialog.message()}`);
        expect(dialog.message()).toContain("Please enter your name:");
        expect(dialog.defaultValue()).toContain("Harry Potter");  // default value of the dialog
        dialog.accept("John");  // close dialog by accepting it.
        // dialog.dismiss(); // close dialog by dismissing (cancel) it.
    });
   
    await page.locator("#promptBtn").click(); // open dialog
    const text: string = await page.locator("#demo").innerText();
    console.log(`output text is: ${text}`)
    // expect(page.locator("#demo")).toHaveText("You pressed Cancel!");
    expect(page.locator("#demo")).toHaveText("Hello John! How are you today?");
    await page.waitForTimeout(3000);
});