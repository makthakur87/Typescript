import { test, expect , Locator} from "@playwright/test";

// 1. Text Input/ Textbox
test("Text Input Actions", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://testautomationpractice.blogspot.com/");

    const textBox: Locator = page.locator("#name");
    await expect(textBox).toBeVisible();
    await expect(textBox).toBeEnabled();
    const maxLength: string | null = await textBox.getAttribute("maxlength");
    console.log("Maxlength attribute length is:", maxLength);

    const value: boolean = maxLength === "15";
    console.log("Is maxlength attribute value 15?", value);
    expect(value).toBe(true);

    // textBox.getAttribute("maxlength").then(value => {
    //     console.log("Maxlength attribute value:", value);
    // });

    await textBox.fill("Mandy Thakur");
    const enteredValue: string = await textBox.inputValue();
    console.log("text content of FirstName with textContent(): ", await textBox.textContent()); // returns empty
    console.log("text content of FirstName with inputValue(): ", await enteredValue); // returns value of the text box
    expect(enteredValue).toBe("Mandy Thakur");
    

    await page.waitForTimeout(2000); // wait for 2 seconds to see the filled value in the text box
});
