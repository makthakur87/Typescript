// Xpath - https://playwright.dev/docs/locators#xpath-locators
// XPath (XML Path Language) is a query language used to navigate and select nodes in an XML document. 
// It can also be used to locate elements on a web page in automation testing. 
// XPath provides a way to traverse the DOM (Document Object Model) and select elements based on their 
// attributes, relationships, and position in the document.

// Xpaths are two types - Absolute Xpath and Relative Xpath
// 1. Absolute Xpath: It starts from the root element and follows the entire path down to the target element. 
// It is denoted by a single forward slash (/) at the beginning of the XPath expression. 
// Absolute XPaths are less flexible and can break if there are changes in the structure of the web page.

// 2. Relative Xpath: It starts from any element in the document and can be more flexible. 
// It is denoted by a double forward slash (//) at the beginning of the XPath expression. 
// Relative XPaths are more robust and can handle changes in the structure of the web page better than absolute XPaths.3

import { test, expect, Locator } from '@playwright/test';

test("verify Xpath Locators", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://demowebshop.tricentis.com/");
    // Absolute Xpath
    const logo: Locator = page.locator("//html[1]/body[1]/div[4]/div[1]/div[4]/div[3]/div[1]/div[1]/div[1]/div[1]/a[2]/img[1]");
    await page.waitForTimeout(5000);
    // await expect(logo).toBeVisible();

    await page.waitForTimeout(5000);

    // relative Xpath
    const logoRelative: Locator = page.locator("//a[@href='https://www.tricentis.com/speed/']");
    await expect(logoRelative).toBeVisible();

    await page.waitForTimeout(5000);

    // contains() function in Xpath: It is used to find elements that contain a specific text or attribute value.
    const products: Locator = page.locator("//h2/a[contains(@href, 'computer')]");
    const productsCount: number = await products.count();
    console.log(`Number of products found: ${productsCount}`);
    expect(productsCount).toBeGreaterThan(0);

    await page.waitForTimeout(5000);

    // console.log(await products.textContent()); // Error: strict mode violation - multiple elements found, use nth() to select a specific element from the list of matching elements
    console.log("First computer related product:", await products.first().textContent());
    console.log("Nth Computer related product:", await products.nth(1).textContent());
    console.log("Last computer related product:", await products.last().textContent());
    console.log("All computer related products:");
    let productTitles = await products.allTextContents();
    productTitles.forEach((title, index) => {
        console.log(`${index + 1}. ${title}`);
    });

    await page.waitForTimeout(5000);

    // starts-with() function in Xpath: It is used to find elements that start with a specific text or attribute value.
    const buildProducts: Locator = page.locator("//h2/a[starts-with(@href, '/build')]");
    buildProducts.count().then(count => {
        console.log(`Number of build related products found: ${count}`);
        expect(count).toBeGreaterThan(0);
    });

    await page.waitForTimeout(5000);

    // text() function in Xpath: It is used to find elements that contain specific text.
    const registerLink: Locator = page.locator("//a[text()='Register']");
    await expect(registerLink).toBeVisible();

    await page.waitForTimeout(5000);

    // last() function in Xpath: It is used to find the last element in a set of elements that match a specific criteria.
    const lastItem: Locator = page.locator("//div[@class = 'column follow-us']//li[last()]");
    await expect(lastItem).toBeVisible();
    console.log("Last item in the list:", await lastItem.textContent());

    await page.waitForTimeout(5000);

    // position() function in Xpath: It is used to find the element at a specific position in a set of elements that match a specific criteria.
    const secondItem: Locator = page.locator("//div[@class = 'column follow-us']//li[position()=2]");
    await expect(secondItem).toBeVisible();
    console.log("Second item in the list:", await secondItem.textContent());

    await page.waitForTimeout(5000);

    await page.goto("https://testautomationpractice.blogspot.com/");
    await page.waitForTimeout(2000);

    // dynamic Xpath: It is used to find elements that have dynamic attributes or values that change frequently.
    for (let i = 1; i <= 5; i++) {
        let button: Locator = page.locator("//button[text()='START' or text() = 'STOP']");
        // let button: Locator = page.locator("//button[@name= 'start']");
        // let button: Locator = page.locator("//button[@name='stop' or @name = 'start']");
        // let button: Locator = page.locator("//button[contains(@name,'st' )]");
        // let button: Locator = page.locator("//button[starts-with(@name,'st')]");

       await button.click();
       await page.waitForTimeout(2000);
    }

    // css selector: It is a pattern used to select elements based on their attributes, classes, ids, and other properties.
    for (let i = 1; i <= 5; i++) {
        let button: Locator = page.locator("button[name ='start'], button[name='stop']");

       await button.click();
       await page.waitForTimeout(2000);
    }

    // using playwright specific locator functions to handle dynamic elements
    for (let i = 1; i <= 5; i++) {
        let button: Locator = page.getByRole('button', { name: /START|STOP/i });
        await button.click();
        await page.waitForTimeout(2000);
    }
});