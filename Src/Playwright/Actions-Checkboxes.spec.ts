import { test, expect, Locator } from "@playwright/test";

// 3. Checkboxes Actions
test.only("Checkbox Actions", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://testautomationpractice.blogspot.com/");

    // select specific checkbox (Sunday) using getByLabel and assert it is checked
    const sundayCheckbox: Locator = page.getByLabel("Sunday");
    await expect(sundayCheckbox).toBeVisible();
    await expect(sundayCheckbox).toBeEnabled();
    const isChecked = await sundayCheckbox.isChecked();
    console.log("Sunday checkbox checked state:", isChecked);
    expect(isChecked).toBe(false);

    await sundayCheckbox.check();
    await expect(sundayCheckbox).toBeChecked();

    await page.waitForTimeout(2000); 

    // capture all checkboxes  and assert each is checked
    const days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const checkboxes: Locator[] = days.map(day => page.getByLabel(day));
    console.log("Total number of checkboxes found:", checkboxes.length);
    expect(checkboxes.length).toBe(days.length);

    // select all checboxes and assert each is checked
    for (const checkbox of checkboxes) {
        await expect(checkbox).toBeVisible();
        await expect(checkbox).toBeEnabled();
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        console.log(`Checkbox checked state: `, await checkbox.isChecked());
    }

    await page.waitForTimeout(1000); 

    // uncheck last 3 checkboxes and assert each is unchecked
    for (const checkbox of checkboxes.slice(-3)) {
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
        console.log(`Checkbox checked state after unchecking: `, await checkbox.isChecked());
    }

    await page.waitForTimeout(1000); 

    // uncheck all checkboxes, assert each is unchecked and check the unchecked checkboxes again and assert each is checked
    for (const checkbox of checkboxes) {
        // only if checkbox is not checked
        if (await checkbox.isChecked()) {
             await checkbox.uncheck();
             await expect(checkbox).not.toBeChecked();
             console.log(`Checkbox checked state after unchecking: `, await checkbox.isChecked());
        } else {
            // only if checkbox is checked
            await checkbox.check();
            await expect(checkbox).toBeChecked();
            console.log(`Checkbox checked state after checking again: `, await checkbox.isChecked());
        }  
    }

    await page.waitForTimeout(1000); 

    for (const checkbox of checkboxes) {
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
        console.log(`Checkbox checked state after unchecking: `, await checkbox.isChecked());
    }

    // select random checkboxes and assert each is checked
    const indexes: number[] = [1, 3, 6]; // select Monday, Wednesday and Saturday checkboxes
    for (const index of indexes) {
        const checkbox = checkboxes[index];
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        console.log(`Checkbox checked state for index ${index}: `, await checkbox.isChecked());
    }

    await page.waitForTimeout(1000); 

    for (const checkbox of checkboxes) {
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
        console.log(`Checkbox checked state after unchecking: `, await checkbox.isChecked());
    }

    await page.waitForTimeout(1000); 

    // select checkbox based on the label text and assert it is checked
    const weekdayName: string = "Friday";
    for (const label of days) {
        if (label === weekdayName) {
            const checkbox = page.getByLabel(label);
            await checkbox.check();
            await expect(checkbox).toBeChecked();
            console.log(`Checkbox checked state for label ${label}: `, await checkbox.isChecked());
        }
    }

    await page.waitForTimeout(2000); 
});

