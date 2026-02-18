import {test, expect} from '@playwright/test';

// Syntax for test with steps
    test("title",  () => {
    // step 1 - Launch URL
    // step 2 - Verify page title
    // step 3 - Verify page URL
    // step 4 - Verify page content
    // step 5 - Verify page logo
    // step 6 - Verify page footer
    }); 

// page - fixture - it is an object that represents a single tab or window in the browser. 
// It provides methods to interact with the page, such as navigating to URLs, clicking elements, filling forms, etc. 
// The `page` fixture is automatically provided by Playwright in each test, 
// allowing you to perform actions on the web page you are testing.

// async function - it is a function that can perform asynchronous operations using the `async` keyword. 
// This allows you to use the `await` keyword inside the function to wait for promises to resolve, 
// making it easier to write asynchronous code in a more synchronous style. 
// In the context of Playwright tests, using async functions allows you to perform actions on the page 
// and wait for them to complete before moving on to the next step in your test.

// what is promises??
// A promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. 
// It allows you to write asynchronous code in a more manageable way by providing methods to handle the success or failure of the operation. 
// In Playwright tests, many actions return promises, such as navigating to a page, clicking an element, or waiting for an element to appear. 
// By using `await` with these promises, you can ensure that your test waits for the action to complete before proceeding to the next step.

test("verify page title", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://automationexercise.com/");

    // step 2 - Verify page title
    let title: string = await page.title();
    console.log("Page title is: " + title);

    await expect(page).toHaveTitle("Automation Exercise");
});