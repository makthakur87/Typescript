/**
 * Keyboard methods:
 * - insertText
 * - down
 * - press
 * - type
 * - up
 * - sendCharacter
 * await page.keyboard.insertText('Hello');
 */

import { test, expect } from '@playwright/test';

test("Keyboard actions", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    
    const input1 = await page.locator("#input1"); 

    // 1. focus on the input1 field
    await input1.focus();

    // 2. provide the text into input1
    await page.keyboard.insertText("Welcome!");

    await page.waitForTimeout(2000);

    // 3. CTRL+A to select all text
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");

    // 4. CTRL+C to copy the text
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyC");
    await page.keyboard.up("Control");

    // 5. press TAB 2 times
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // 6. CTRL+V to paste the text into input2
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyV");
    await page.keyboard.up("Control");

    await page.waitForTimeout(2000);

    // 7. press TAB 2 times
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // 8. CTRL+V to paste the text into input3
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyV");
    await page.keyboard.up("Control");

    await page.waitForTimeout(2000);

});

test.only("Keyboard actions - Simple way", async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    
    const input1 = await page.locator("#input1"); 

    // 1. focus on the input1 field
    await input1.focus();

    // 2. provide the text into input1
    await page.keyboard.insertText("Welcome!");

    await page.waitForTimeout(2000);

    // 3. CTRL+A to select all text
    await page.keyboard.press("Control+A");

    // 4. CTRL+C to copy the text
    await page.keyboard.press("Control+C");

    // 5. press TAB 2 times
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // 6. CTRL+V to paste the text into input2
    await page.keyboard.press("Control+V");

    await page.waitForTimeout(2000);

    // 7. press TAB 2 times
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // 8. CTRL+V to paste the text into input3
    await page.keyboard.press("Control+V");

    await page.waitForTimeout(2000);

});


test("Using keyboard shortcuts", async ({ page }) => {});

test("Simulating key combinations", async ({ page }) => {});


