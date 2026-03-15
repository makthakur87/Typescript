import { test, expect } from '@playwright/test';

test("test1", async ({ page }) => {
  await page.goto("https://demowebshop.tricentis.com/");
//  await page.goto("https://demowebshop.tricentis.com/register");

// compare snapshot of the page
  // Approach 1: Using toMatchSnapshot with a custom name
//   expect(await page.screenshot()).toMatchSnapshot("home-page.png");

  // Approach 2: Using toHaveScreenshot with a custom name
  await expect(page).toHaveScreenshot();


  await expect(page).toHaveTitle(/Demo Web Shop/);

  // compare the snapshot of the element
  const logo = page.locator("img[alt='Tricentis Demo Web Shop']");
   expect(await logo.screenshot()).toMatchSnapshot("logo.png");
  });