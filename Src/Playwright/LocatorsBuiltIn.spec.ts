/*
Built-in locators - https://playwright.dev/docs/locators#built-in-locators

1. page.getByAltText() to locate an element, usually image, by its text alternative.
2. page.getByText() to locate by text content. use this locator to find non interactive elements, such as headings, paragraphs, or any element that contains text.
3. page.getByRole() to locate by explicit and implicit accessibility attributes.
4. page.getByLabel() to locate a form control by associated label's text.
5. page.getByPlaceholder() to locate an input by placeholder.
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
   const actualAltText = await logoPage.getAttribute("alt");
   console.log(`Actual alt text: ${actualAltText}`);
   const actualTextContent = await logoPage.textContent();
   console.log(`Actual text content: ${actualTextContent}`);
   const actualInnerText = await logoPage.innerText();
   console.log(`Actual inner text: ${actualInnerText}`);
   const actualInnerHTML = await logoPage.innerHTML();
   console.log(`Actual inner HTML: ${actualInnerHTML}`);

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

   // 3. page.getByRole() to locate by explicit and implicit accessibility attributes. Role is not attribute of the element.
   // Role locators include buttons, checkboxes, headings, links, lists, tables, and many more and follow W3C specifications for ARIA role, ARIA attributes and accessible name. 
   // Note that many html elements like <button> have an implicitly defined role that is recognized by the role locator.
   // use this locator to find interactive elements, such as buttons, links, form controls, or any element that has a defined role in the accessibility tree.
   await page.getByRole("link", { name: "Register" }).click(); // Locate a link with the accessible name "Register" and click on it
   await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
   console.log("Heading 'Register' is visible on the page"); // Log a message to the console indicating that the heading is visible

   // 4. page.getByLabel() to locate a form control by associated label's text. use this locator to find form controls, such as input fields, dropdowns, checkboxes, or any element that is associated with a label. 
   // It allows you to locate form controls based on the text of their associated labels, which is particularly useful for improving accessibility and ensuring that your tests are more resilient 
   // to changes in the underlying HTML structure.
   await page.getByLabel("First name:").fill("John"); 
   console.log("Filled 'First name' input box with value 'John'"); 
   await page.getByLabel("Last name:").fill("Doe");
   console.log("Filled 'Last name' input box with value 'Doe'");
   await page.getByLabel("Email:").fill("john.doe@example.com");
   console.log("Filled 'Email' input box with value 'john.doe@example.com'");

   // 5. page.getByPlaceholder() to locate an input by placeholder. use this locator to find input fields based on their placeholder text, which is the text displayed inside an input field when it is empty. 
   // It allows you to locate input fields based on the placeholder text, which can be helpful when the input field does not have a unique label or 
   // when you want to verify that the correct placeholder text is displayed.
   await page.getByPlaceholder("Search store").fill("Apple MacBook Pro");
   console.log("Filled 'Search store' input box with value 'Apple MacBook Pro'");

   await page.goto("file:///C:/Users/user/Downloads/ClassDemos/ClassDemos/app.html"); // Navigate to login page for the next steps

   // 6. page.getByTitle() to locate an element by its title attribute. use this locator to find elements that have a title attribute, which is often used to provide additional information 
   // about an element when the user hovers over it. 
   // It allows you to locate elements based on the content of their title attribute, which can be useful for finding elements that may not have unique text content or other attributes.
   await expect(page.getByTitle("Home page link")).toHaveText("Home"); // Verify that the element with the title "Home page link" has the text "Home"
   console.log("Element with title 'Home page link' has text 'Home'"); 
   await expect(page.getByTitle("HyperText Markup Language")).toHaveText("HTML");

    // 7. page.getByTestId() to locate an element based on its data-testid attribute (other attributes can be configured). 
    // use this locator to find elements that have a specific data-testid attribute, which is often used in testing to provide a stable and unique identifier for elements.
    await expect(page.getByTestId("profile-email")).toHaveText("john.doe@example.com"); 
    await expect(page.getByTestId("profile-name")).toHaveText("John Doe");

});
