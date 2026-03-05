import {test, expect, Locator} from '@playwright/test';

test('Compare Two methods', async ({page}) => {
  await page.goto('https://demowebshop.tricentis.com/');

  const productTitles: Locator = page.locator(".product-title");
  await expect(productTitles).toHaveCount(6);

  // 1. innerText() vs textContent()
  console.log('First product title (innerText):', await productTitles.first().innerText());
  console.log('First product title (textContent):', await productTitles.first().textContent());
  console.log('First product title (textContent trimmed):', (await productTitles.first().textContent())?.trim());

  console.log('All product titles (innerText):', await productTitles.nth(2).innerText());
  console.log('All product titles (textContent):', await productTitles.nth(2).textContent());

  for (let i = 0; i < await productTitles.count(); i++) {
    const title = await productTitles.nth(i).innerText();
    console.log(`Product ${i + 1} title:`, title);
  }

  // for of loop
    for (const titleLocator of await productTitles.all()) {
    const title = await titleLocator.innerText();
    console.log('Product title (for of loop):', title);
  }

  // for of loop with textContent
    for (const titleLocator of await productTitles.all()) {
        const title = (await titleLocator.textContent())?.trim();
        console.log('Product title (for of loop with textContent):', title);
    }

  // for in loop
    const productTitleLocators = await productTitles.all();
    for (const index in productTitleLocators) {
    const title = await productTitleLocators[index].innerText();
    console.log(`Product title (for in loop, index ${index}):`, title);
  }

  // for in loop with textContent
    for (const index in productTitleLocators) {
        const title = (await productTitleLocators[index].textContent())?.trim();
        console.log(`Product title (for in loop with textContent, index ${index}):`, title);
    }

  // map function
    const productTitleTexts = await Promise.all((await productTitles.all()).map(async (titleLocator) => await titleLocator.innerText()));
    console.log('All product titles (map function):', productTitleTexts);

    // map function with textContent
    const productTitleTextsContent = await Promise.all((await productTitles.all()).map(async (titleLocator) => (await titleLocator.textContent())?.trim()));
    console.log('All product titles (map function with textContent):', productTitleTextsContent);

    // 2. allInnerTexts() vs allTextContents()
    console.log('All product titles (allInnerTexts):', (await productTitles.allInnerTexts()).map(title => title.trim()));
    console.log('All product titles (allTextContents):', (await productTitles.allTextContents()).map(title => title.trim()));

    // normal for loop with allInnerTexts
    for (let i = 0; i < await productTitles.count(); i++) {
        const title = (await productTitles.nth(i).allInnerTexts()).map(title => title.trim());
        console.log(`Product ${i + 1} title (allInnerTexts):`, title);
    }

    // normal for loop with allTextContents
    for (let i = 0; i < await productTitles.count(); i++) {
        const title = (await productTitles.nth(i).allTextContents()).map(title => title.trim());
        console.log(`Product ${i + 1} title (allTextContents):`, title);
    }

    // map function with allInnerTexts
    const allInnerTexts = await Promise.all((await productTitles.all()).map(async (titleLocator) => (await titleLocator.allInnerTexts()).map(title => title.trim())));
    console.log('All product titles (map function with allInnerTexts):', allInnerTexts);

    // map function with allTextContents
    const allTextContents = await Promise.all((await productTitles.all()).map(async (titleLocator) => (await titleLocator.allTextContents()).map(title => title.trim())));
    console.log('All product titles (map function with allTextContents):', allTextContents);

    // 3. all() - converts locator to array of locators[]
    const allProductLocators: Locator[] = await productTitles.all();
    console.log('All product locators (all()):', allProductLocators);

    // for of loop with all()
    for (const productLocator of allProductLocators) {
        const title = await productLocator.innerText();
        console.log('Product title (for of loop with all()):', title);
    }
})