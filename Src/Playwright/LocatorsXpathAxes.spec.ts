// XPath Axes: XPath axes are used to navigate through the elements in an XML document. 
// They allow you to select nodes based on their relationship to other nodes. Some common XPath axes include:
// 1. self: Selects the current node.
// 2. parent: Selects the parent node of the current node.
// 3. child: Selects all child nodes of the current node.
// 4. ancestor: Selects all ancestor nodes of the current node.
// 5. descendant: Selects all descendant nodes of the current node.
// 6. following: Selects all nodes that come after the current node in the document.
// 7. following-sibling: Selects all sibling nodes that come after the current node.
// 8. preceding: Selects all nodes that come before the current node in the document.
// 9. preceding-sibling: Selects all sibling nodes that come before the current node.

import { test, expect, Locator } from '@playwright/test';

test("verify Xpath Axes", async ({ page }) => {
    // step 1 - Launch URL
    await page.goto("https://www.w3schools.com/html/html_tables.asp");

    // 1. self axis: Selects the current node.
    const countryCell: Locator = page.locator("//td[text()='Germany']/self::td");
    expect(countryCell).toHaveText("Germany");
    console.log("Self axis - Country cell text:", await countryCell.textContent());

    await page.waitForTimeout(2000);

    // 2. parent axis: Selects the parent node of the current node.
    const parentRow: Locator = page.locator("//td[text()='Germany']/parent::tr");
    expect(parentRow).toContainText("Maria Anders");
    expect(parentRow).toContainText("Alfreds Futterkiste Maria Anders Germany");
    console.log("Parent axis - Row text:", await parentRow.textContent());

    await page.waitForTimeout(2000);

    // 3. child axis: Selects all child nodes of the current node.
    const childCells: Locator = page.locator("//td[text()='Germany']/parent::tr/child::td");
    expect(childCells).toHaveCount(3);
    console.log("Child axis - Number of child cells:", await childCells.count());

    await page.waitForTimeout(1500);

    const childCells1: Locator = page.locator("//td[text()='Germany']/parent::tr/child::td");
    expect(childCells1).toHaveCount(3);
    console.log("Child axis - Number of child cells:", await childCells1.count());

    await page.waitForTimeout(2000);

    // 4. ancestor axis: Selects all ancestor nodes of the current node.
    const ancestorTable: Locator = page.locator("//td[text()='Germany']/ancestor::table");
    expect(ancestorTable).toBeVisible();
    console.log("Ancestor axis - Table text:", await ancestorTable.textContent());

    await page.waitForTimeout(2000);

    // const allAncestor: Locator = page.locator("//td[text()='Germany']/ancestor::*");
    // expect(allAncestor).toHaveAttribute('id', 'customers');
    // console.log("Ancestor axis - Table text:", await allAncestor.textContent()); 
    // strict mode violation: locator resolved to 12 elements - we can only get text content from one element, so we will get the text content of the first element in the list

    // await page.waitForTimeout(2000);

    // 5. descendant axis: Selects all descendant nodes of the current node.
    const descendant: Locator = page.locator("//table[@id='customers']/descendant::td");
    expect(descendant).toHaveCount(18);
    console.log("Descendant axis - Number of descendant cells:", await descendant.count());

    await page.waitForTimeout(2000);

    // 6. following axis: Selects all nodes that come after the current node in the document.
    const following: Locator = page.locator("//td[text()='Germany']/following::td");
    expect(following).toHaveCount(35);
    console.log("Following axis - Number of following cells:", await following.count());
    console.log("Following axis - following cell text:", await following.allTextContents());

    await page.waitForTimeout(2000);

    // 7. following-sibling axis: Selects all sibling nodes that come after the current node.
    const followingRightSibling: Locator = page.locator("//td[text()='Germany']/following-sibling::td");
    const value: boolean = await followingRightSibling.count() === 0;
    console.log("Following-sibling axis - Are there any following siblings?", value);
    expect(value).toBe(true);
    console.log("Following-sibling axis - Number of following siblings:", await followingRightSibling.count());

    await page.waitForTimeout(1500);

    const followingRightSibling1: Locator = page.locator("//td[text()='Alfreds Futterkiste']/following-sibling::td");
    const value1: boolean = await followingRightSibling1.count() === 2;
    console.log("Following-sibling axis - Are there any following siblings?", value1);
    expect(value1).toBe(true);
    console.log("Following-sibling axis - Number of following siblings:", await followingRightSibling1.count());
    console.log("Following-sibling axis - following siblings text:", await followingRightSibling1.allTextContents());

    await page.waitForTimeout(2000);

    // 8. preceding axis: Selects all nodes that come before the current node in the document.
    const preceding: Locator = page.locator("//td[text()='Germany']/preceding::td");
    const totalNumberOfElements: boolean = await preceding.count() === 2;
    console.log("Preceding axis - Are there 2 preceding cells?", totalNumberOfElements);
    expect(totalNumberOfElements).toBe(true);
    console.log("Preceding axis - Number of preceding cells:", await preceding.count());
    console.log("Preceding axis - Preceding cell text:", await preceding.allTextContents());

    // 9. preceding-sibling axis: Selects all sibling nodes that come before the current node.
    const precedingLeftSibling: Locator = page.locator("//td[text()='Germany']/preceding-sibling::td");
    const value2: boolean = await precedingLeftSibling.count() === 2;
    console.log("Preceding-sibling axis - Are there any preceding siblings?", value2);
    expect(value2).toBe(true);
    console.log("Preceding-sibling axis - Number of preceding siblings:", await precedingLeftSibling.count());
    console.log("Preceding-sibling axis - Preceding siblings text:", await precedingLeftSibling.allTextContents());
});