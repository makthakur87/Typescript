import {test, expect, Locator} from "@playwright/test";
import { text } from "node:stream/consumers";

// 4. Dropdown Actions
test("Single Dropdown Actions", async ({page}) => {
    // step 1 - Launch URL
    await page.goto("https://testautomationpractice.blogspot.com/");
// Single select dropdown
    // There are 4 ways to select an option from dropdown using selectOption method
    // 1. using selectOption with visible text
    const dropdown: Locator = page.locator("#country");
    await page.waitForTimeout(2000);
    await dropdown.selectOption("India");
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toBeEnabled();

    await page.waitForTimeout(2000);

    // 2. by using value attribute
    await dropdown.selectOption({ value: "japan" });

    await page.waitForTimeout(2000);

    // 3. by using label
    await dropdown.selectOption({ label: "Germany" });

    await page.waitForTimeout(2000);

    // 4. by using index
    await dropdown.selectOption({ index: 1 });

    await page.waitForTimeout(2000);

    // check number of options in dropdown (count)
    const dropDownOptions: Locator = page.locator("#country > option");
    await expect(dropDownOptions).toHaveCount(10);

    await page.waitForTimeout(2000);

    // capture all options in dropdown and print the text of each option
    const optionsCount = await dropDownOptions.count();
    console.log("Total number of options in dropdown:", optionsCount);

    // allTextContents method returns an array of text content of all options in dropdown
    console.log("######## allTextContents method ########");
    const optionsText: string[] = (await dropDownOptions.allTextContents()).map(text => text.trim());
    console.log("Options in dropdown:", optionsText);

    expect(optionsText).toContain("India");
    expect(optionsText).toContain("Japan");
    expect(optionsText).toContain("Germany");
    expect(optionsText).toContain("United States");

    // with normal for loop
    console.log("######## Normal for loop ########");
    for (let i = 0; i < optionsCount; i++) {
        const optionText = await dropDownOptions.nth(i).textContent();
        console.log(`Option ${i + 1}: ${optionText?.trim()}`);
    }

    // with forEach loop without then
    console.log("######## forEach loop ########");
    const optionsTextForEach = await dropDownOptions.allTextContents();
    optionsTextForEach.forEach((option, index) => {
        console.log(`Option ${index + 1}: ${option.trim()}`);
    });

    // for in loop
    console.log("######## for in loop ########");
    const optionsTextForIn = await dropDownOptions.allTextContents();
    for (const index in optionsTextForIn) {
        console.log(`Option ${parseInt(index) + 1}: ${optionsTextForIn[index].trim()}`);
    }

    // for of loop
    console.log("######## for of loop ########");
    const optionsTextForOf = await dropDownOptions.allTextContents();
    let optionIndex = 1;
    for (const option of optionsTextForOf) {
        console.log(`Option ${optionIndex}: ${option.trim()}`);
        optionIndex++;
    }

    await page.waitForTimeout(2000);
});

test("Multi Select Dropdown Actions", async ({page}) => {
    // step 1 - Launch URL
    await page.goto("https://testautomationpractice.blogspot.com/");

    // There are 4 ways to select an option from dropdown using selectOption method
    // 1. using selectOption with visible text
    await page.waitForTimeout(2000);

    const dropdown: Locator = page.locator("#colors");    
    await dropdown.selectOption(["Red", "Blue", "Green"]);

    await page.waitForTimeout(2000);

    // 2. by using value attribute
    await dropdown.selectOption( ["red", "green", "white"]);

    await page.waitForTimeout(2000);

    // 3. by using label
    await dropdown.selectOption([{ label: "Red"}, {label: "Green"}, {label: "Yellow"}]);

    await page.waitForTimeout(2000);

    // 4. by using index
    await dropdown.selectOption([{ index: 1 }, { index: 3 }, { index: 5 }]);

    await page.waitForTimeout(2000);

    // check number of options in dropdown (count)
    const dropDownOptions: Locator = page.locator("#colors > option");
    await expect(dropDownOptions).toHaveCount(7);

    await page.waitForTimeout(2000);

    // capture all options in dropdown and print the text of each option
    const optionsCount = await dropDownOptions.count();
    console.log("Total number of options in dropdown:", optionsCount);

    // allTextContents method returns an array of text content of all options in dropdown
    console.log("######## allTextContents method ########");
    const optionsText: string[] = (await dropDownOptions.allTextContents()).map(text => text.trim());
    console.log("Options in dropdown:", optionsText);

    expect(optionsText).toContain("Red");
    expect(optionsText).toContain("Blue");
    expect(optionsText).toContain("Green");
    expect(optionsText).toContain("Yellow");

    const originalOptionsText: string[] = [...optionsText];
    const sortedOptionsText: string[] = [...optionsText].sort();
    console.log("Original options text:", originalOptionsText);
    console.log("Sorted options text:", sortedOptionsText);

    // expect(originalOptionsText).toEqual(sortedOptionsText);

    // with normal for loop
    console.log("######## Normal for loop ########");
    for (let i = 0; i < optionsCount; i++) {
        const optionText = await dropDownOptions.nth(i).textContent();
        console.log(`Option ${i + 1}: ${optionText?.trim()}`);
    }

    // with forEach loop without then
    console.log("######## forEach loop ########");
    const optionsTextForEach = await dropDownOptions.allTextContents();
    optionsTextForEach.forEach((option, index) => {
        console.log(`Option ${index + 1}: ${option.trim()}`);
    });

    // for in loop
    console.log("######## for in loop ########");
    const optionsTextForIn = await dropDownOptions.allTextContents();
    for (const index in optionsTextForIn) {
        console.log(`Option ${parseInt(index) + 1}: ${optionsTextForIn[index].trim()}`);
    }

    // for of loop
    console.log("######## for of loop ########");
    const optionsTextForOf = await dropDownOptions.allTextContents();
    let optionIndex = 1;
    for (const option of optionsTextForOf) {
        console.log(`Option ${optionIndex}: ${option.trim()}`);
        optionIndex++;
    }

    await page.waitForTimeout(2000);

    // dropdown have duplicate elements or not
    const uniqueSetText: Set<string> = new Set();
    const duplicateArrayText: string[] = [];

    for (const text of optionsText) {
        if (uniqueSetText.has(text)) {
            duplicateArrayText.push(text);
        } else {
            uniqueSetText.add(text);
        }
    }

    console.log("Unique options text:", Array.from(uniqueSetText));
    console.log("Duplicate options text:", duplicateArrayText);

    if (duplicateArrayText.length > 0) {
        console.log("Dropdown has duplicate options.");
    } else {        
        console.log("Dropdown does not have duplicate options.");
    }

    expect(duplicateArrayText.length).toBe(0);

    await page.waitForTimeout(2000);
});

test("Sorted Dropdown Actions", async ({page}) => {
    // step 1 - Launch URL
    await page.goto("https://testautomationpractice.blogspot.com/");

    // There are 4 ways to select an option from dropdown using selectOption method
    // 1. using selectOption with visible text
    await page.waitForTimeout(2000);

    const dropdown: Locator = page.locator("#animals");    
    await dropdown.selectOption(["Cat", "Dog", "Elephant"]);

    await page.waitForTimeout(2000);

    // 2. by using value attribute
    await dropdown.selectOption( ["cat", "dog", "elephant"]);

    await page.waitForTimeout(2000);

    // 3. by using label
    await dropdown.selectOption([{ label: "Zebra"}, {label: "Giraffe"}, {label: "Lion"}]);

    await page.waitForTimeout(2000);

    // 4. by using index
    await dropdown.selectOption([{ index: 1 }, { index: 3 }, { index: 5 }]);

    await page.waitForTimeout(2000);

    // check number of options in dropdown (count)
    const dropDownOptions: Locator = page.locator("#animals > option");
    await expect(dropDownOptions).toHaveCount(10);

    await page.waitForTimeout(2000);

    // capture all options in dropdown and print the text of each option
    const optionsCount = await dropDownOptions.count();
    console.log("Total number of options in dropdown:", optionsCount);

    // allTextContents method returns an array of text content of all options in dropdown
    console.log("######## allTextContents method ########");
    const optionsText: string[] = (await dropDownOptions.allTextContents()).map(text => text.trim());
    console.log("Options in dropdown:", optionsText);

    expect(optionsText).toContain("Cat");
    expect(optionsText).toContain("Dog");
    expect(optionsText).toContain("Elephant");
    expect(optionsText).toContain("Zebra");

    const originalOptionsText: string[] = [...optionsText];
    const sortedOptionsText: string[] = [...optionsText].sort();
    console.log("Original options text:", originalOptionsText);
    console.log("Sorted options text:", sortedOptionsText);

    expect(originalOptionsText).toEqual(sortedOptionsText);
    
    // with normal for loop
    console.log("######## Normal for loop ########");
    for (let i = 0; i < optionsCount; i++) {
        const optionText = await dropDownOptions.nth(i).textContent();
        console.log(`Option ${i + 1}: ${optionText?.trim()}`);
    }

    // with forEach loop without then
    console.log("######## forEach loop ########");
    const optionsTextForEach = await dropDownOptions.allTextContents();
    optionsTextForEach.forEach((option, index) => {
        console.log(`Option ${index + 1}: ${option.trim()}`);
    });

    // for in loop
    console.log("######## for in loop ########");
    const optionsTextForIn = await dropDownOptions.allTextContents();
    for (const index in optionsTextForIn) {
        console.log(`Option ${parseInt(index) + 1}: ${optionsTextForIn[index].trim()}`);
    }

    // for of loop
    console.log("######## for of loop ########");
    const optionsTextForOf = await dropDownOptions.allTextContents();
    let optionIndex = 1;
    for (const option of optionsTextForOf) {
        console.log(`Option ${optionIndex}: ${option.trim()}`);
        optionIndex++;
    }

    await page.waitForTimeout(2000);

    // dropdown have duplicate elements or not
    const uniqueSetText: Set<string> = new Set();
    const duplicateArrayText: string[] = [];

    for (const text of optionsText) {
        if (uniqueSetText.has(text)) {
            duplicateArrayText.push(text);
        } else {
            uniqueSetText.add(text);
        }
    }

    console.log("Unique options text:", Array.from(uniqueSetText));
    console.log("Duplicate options text:", duplicateArrayText);

    if (duplicateArrayText.length > 0) {
        console.log("Dropdown has duplicate options.");
    } else {        
        console.log("Dropdown does not have duplicate options.");
    }

    expect(duplicateArrayText.length).toBe(0);

    await page.waitForTimeout(2000);

});

test("AutoSuggest/Dynamic Dropdown Actions", async ({page}) => {
    // step 1 - Launch URL
    await page.goto("https://www.flipkart.com/");
    await page.waitForTimeout(5000);

    await page.locator("(//input[@placeholder='Search for Products, Brands and More'])[1]").fill("smart");
    await page.waitForTimeout(5000);

    // get all the suggested options
    const options: Locator = page.locator("ui>li")
    const count = await options.count();
    console.log("Total number of options in dropdown:", count);

    // printing all the suggested options
    for (let i = 0; i < count; i++) {
        const optionText = await options.nth(i).textContent();
        console.log(`Option ${i + 1}: ${optionText?.trim()}`);
    }

    await page.waitForTimeout(2000);

    // select/click on the specific option from the dropdown
    for (let i = 0; i < count; i++) {
        const optionText = await options.nth(i).textContent();
        if (optionText?.trim() === "smartphone") {
            await options.nth(i).click();
            break;
        }
    }
});


test.only("Hidden Dropdown Actions", async ({page}) => {
    // step 1 - Launch URL
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
   
    // login
    await page.locator("input[name='username']").fill("Admin");
    await page.locator("input[name='password']").fill("admin123");
    await page.locator("button[type='submit']").click();

    // click on PIM module
    // await page.locator("//span[text()='PIM']").click();
    await page.getByText("PIM").click();

    await page.waitForTimeout(2000);

    // click on job title dropdown
    await page.locator("form i").nth(2).click();

    await page.waitForTimeout(2000);

    // capture all options in dropdown and print the text of each option
    const options: Locator = page.locator("div[role='listbox'] span");
    const optionsCount = await options.count();
    console.log("Total number of options in dropdown:", optionsCount);

    await page.waitForTimeout(2000);

    console.log("All options text:", await options.allTextContents());

    // printing all the options in dropdown
    for (let i = 0; i < optionsCount; i++) {
        const optionText = await options.nth(i).innerText();
        console.log(`Option ${i + 1}: ${optionText?.trim()}`);
    }

    // select/click on the specific option from the dropdown
    await page.waitForTimeout(1000);

    for (let i = 0; i < optionsCount; i++) {
        const optionText = await options.nth(i).innerText();
        if (optionText?.trim() === "Automation Tester") {
            await options.nth(i).click();
            break;
        }
    }

    await page.waitForTimeout(3000);
});