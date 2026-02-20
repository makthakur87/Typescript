/*
Built-in locators - https://playwright.dev/docs/locators#built-in-locators
1. page.getByRole() to locate by explicit and implicit accessibility attributes.
2. page.getByText() to locate by text content.
3. page.getByLabel() to locate a form control by associated label's text.
4. page.getByPlaceholder() to locate an input by placeholder.
5. page.getByAltText() to locate an element, usually image, by its text alternative.
6. page.getByTitle() to locate an element by its title attribute.
7. page.getByTestId() to locate an element based on its data-testid attribute (other attributes can be configured).

Locators are used to find elements on a web page and interact with them in your tests.
DOM - Document Object Model - It is a programming interface for web documents. It represents the structure of a web page as a tree of objects, where each object corresponds to an element on the page.
It is API interface provided by the browser that allows you to manipulate the content, structure, and style of a web page using JavaScript.
*/

import { test, expect, Locator } from '@playwright/test';
import { log } from 'node:console';

test("Playwright built-in locators", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://demo.nopcommerce.com/");

    // 1. page.getByAltText() to locate an element, usually image, by its text alternative.
    // use this locator twhen your element supports alt text, such as images, icons, or other visual elements. 
    // It allows you to locate elements based on their alternative text, which is often used for accessibility purposes.
   const logoPage: Locator = page.getByAltText("nopCommerce demo store");
   await expect(logoPage).toBeVisible(); // Verify that the logo is visible on the page
   await log("Logo is visible on the page"); // Log a message to the console indicating that the logo is visible

   // 2. page.getByText() to locate by text content. use this locator to find non interactive elements, such as headings, paragraphs, or any element that contains text.
   const text: Locator = page.getByText("Welcome to our store");
   await expect(text).toBeVisible(); // Verify that the text is visible on the page
   await log("Text is visible on the page"); // Log a message to the console indicating that the text is visible

   await expect(page.getByText("Welcome to our store")).toBeVisible(); // full String match - Verify that the full string "Welcome to our store" is visible on the page
   await expect(page.getByText("Welcome to")).toBeVisible(); // substring match - Verify that the substring "Welcome to" is visible on the page
   await expect(page.getByText(/Welcome\s+to\s+our\s+store/i)).toBeVisible(); // regex match - Verify that the text matches the regular expression pattern, allowing for flexible matching and ignoring case sensitivity
   await log("Text 'Welcome to our store' is visible on the page"); // Log a message to the console indicating that the text is visible

   // 3. page.getByRole() to locate by explicit and implicit accessibility attributes. 
   // Role locators include buttons, checkboxes, headings, links, lists, tables, and many more and follow W3C specifications for ARIA role, ARIA attributes and accessible name. 
   // Note that many html elements like <button> have an implicitly defined role that is recognized by the role locator.
   // use this locator to find interactive elements, such as buttons, links, form controls, or any element that has a defined role in the accessibility tree.
});
