// CSS (cascading style sheets) - HTML + JS + CSS
// CSS is a stylesheet language used to describe the presentation of a document written in HTML or XML. It allows you to control the layout, colors, fonts, and overall visual appearance of a web page.
// CSS selectors are patterns used to select and style elements on a web page. They allow you to target specific HTML elements based on their attributes, relationships, or position in the document structure.
// CSS selectors can be simple or complex, and they provide a powerful way to apply styles to specific elements or groups of elements on a web page.

// Types of CSS selectors:
// 2 Types of CSS selectors:
// 1. Absolute CSS Selectors:

// Generic way to use CSS in automation - tag, id, class, attribute, combination of class and attribute
// a. Tag with ID - tag#id - Selects an element with a specific tag name and id attribute. For example, div#header would select a div element with the id "header".
// b. Tag with Class - tag.class - Selects elements with a specific tag name and class attribute. For example, p.intro would select all p elements with the class "intro".
// c. Tag with Attribute - tag[attribute=value] - Selects elements with a specific tag name and attribute value. 
// For example, input[type="text"] would select all input elements with the type attribute set to "text".
// d. Tag with class and Attribute - tag.class[attribute=value] or .class[attribute=value] - Selects elements with a specific tag name, class attribute, and attribute value. 
// For example, a.button[href="https://example.com"] would select all a elements with the class "button" and an href attribute equal to "https://example.com".
// e. ID Selector (#id): Selects a single element with a specific id attribute. It is denoted by a hash symbol (#) followed by the id value. 
// For example, #header would select an element with the id "header".
// f. Class Selector (.class): Selects all elements with a specific class attribute. It is denoted by a dot (.) followed by the class name. 
// For example, .intro would select all elements with the class "intro".
// g. Attribute Selector ([attribute=value]): Selects elements based on the presence or value of an attribute. 
// For example, [type="text"] would select all elements with the type attribute set to "text".

import {test, expect, Locator} from '@playwright/test';

test("verify CSS Locators", async ({page}) => {
    // step 1 - Launch URL
    await page.goto("https://demowebshop.tricentis.com/");
    // tag#id
    // const searchBox: Locator = page.locator("input#small-searchterms");
    const searchBox: Locator = page.locator("#small-searchterms");
    await searchBox.fill("T-Shirts");

    await page.waitForTimeout(5000); // wait for 5 seconds to see the filled value in the search box

    // tag.class
    expect(page.locator("input.search-box-text.ui-autocomplete-input")).toBeVisible();
    // const searchBoxClass: Locator = page.locator("input.search-box-text.ui-autocomplete-input");
    const searchBoxClass: Locator = page.locator(".search-box-text.ui-autocomplete-input");
    await searchBoxClass.fill("laptop");

    await page.waitForTimeout(5000);

    // tag[attribute=value]
    // await page.locator("input[name='q']").fill("Gift Cards");
    await page.locator("[name='q']").fill("Gift Cards");

    await page.waitForTimeout(5000);

    // tag.class[attribute=value]
    // await page.locator("input.search-box-text[value='Search store']").fill("Books");
    await page.locator(".search-box-text[type='text']").fill("Books");

    await page.waitForTimeout(5000);
});


// 2. Relative CSS Selectors
// a. Universal Selector (*): Selects all elements on the page.
// b. Type Selector (element): Selects all elements of a specific type, such as div, p, or a.
// c. Class Selector (.class): Selects all elements with a specific class attribute.
// d. ID Selector (#id): Selects a single element with a specific id attribute.
// e. Attribute Selector ([attribute=value]): Selects elements based on the presence or value of an attribute.
// 6. Pseudo-class Selector (:pseudo-class): Selects elements based on their state or position, such as :hover, :first-child, or :nth-child().
// 7. Pseudo-element Selector (::pseudo-element): Selects and styles a specific part of an element, such as ::before or ::after.