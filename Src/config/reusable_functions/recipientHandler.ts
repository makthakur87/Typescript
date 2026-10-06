import { Page } from "@playwright/test";
import { getValueByPath, fillText, fillDropdown, fillRadio, fillCheckbox, clickButton, normalizeRadioValue } from "./fieldFillers";
import { fillPassword, fillToken } from "./customHandlers";

async function isStillOnPage(page: Page) {
  try {
    return await page.locator("#saveRecipientForm\\:currentpwd").isVisible({ timeout: 3000 });
  } catch {
    return false;
  }
}

export async function fillPageFields(page: Page, inputData: Record<string, any>, config: Record<string, any>) {
  for (const [jsonPath, field] of Object.entries(config)) {
    // 1. if key contains dot -> treat as JSON
    let value = jsonPath.includes(".") ? getValueByPath(inputData, jsonPath) : inputData[jsonPath];

    // 2. unwrap promises in value (for async when conditions)
    if (value instanceof Promise) {
      console.info(`[INFO] Resolving promise for field '${jsonPath}'...`);
      value = await value;
    }

    // 3. apply visibleWhen only if defind for field
    const isVisible = typeof field.visibleWhen === "function" ? await field.visibleWhen(inputData) : true;
    if (!isVisible) {
      console.info(`[SKIPPED] Field '${jsonPath}' - visibleWhen condition not met`);
      continue;
    }
    
    // 4. apply when condition for any field type, not just conditional
    const shouldApply = typeof field.when === "function" ? await field.when(inputData) : true;
    if (!shouldApply) {
      console.info(`[SKIPPED] Field '${jsonPath}' - when condition not met`);
      continue;
    }

    // 5. CUSTOM fields with custom handlers
    if (field.type === "custom") {
      console.info(`[CUSTOM] Field '${jsonPath}' - executing custom handler`);
      await field.handler(page, inputData);
      continue;
    }

    // 6. Button always click
    // a. post submit retry button
    if (field.type === "button" && field.postSubmitRetry) {
      console.info(`[BUTTON] Field '${jsonPath}' is a post submit retry button. clicking...`);
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.info(`[BUTTON] Attempt ${attempt} to click button '${jsonPath}'`);
        await clickButton(page, field.selector);
        await page.waitForTimeout(2000); // wait for any potential page changes after clicking

        // check if button is still visible (indicating we may need to retry)
        const stillVisible = await page.locator(field.selector).isVisible({ timeout: 3000 }).catch(() => false);
        // const stillVisible = await isStillOnPage(page);
        if (!stillVisible) {
          console.info(`[BUTTON] Button '${jsonPath}' is no longer visible after click. MOving on...`);
          break;
        }
        console.warn(`[BUTTON] Button '${jsonPath}' is still visible after click. Retrying...`);
        await page.locator(field.selector).scrollIntoViewIfNeeded().catch(() => null); // scroll into view before retrying
        await fillPassword(page, inputData); // try to fill password again if needed
        await fillToken(page, inputData); // try to fill token again if needed
        console.info(`[BUTTON] refilled password and token for retry attempt ${attempt}`);
        await clickButton(page, field.selector); // retry click
        await page.waitForTimeout(2000); // wait for any potential page changes after clicking
        const stillVisibleAfterRetry = await page.locator(field.selector).isVisible({ timeout: 3000 }).catch(() => false);
        if (!stillVisibleAfterRetry) {
          console.info(`[BUTTON] Button '${jsonPath}' is no longer visible after retry click. Moving on...`);
          break;
        }
        console.warn(`[BUTTON] Button '${jsonPath}' is still visible after retry click. will attempt again if attempts remain...'${3 - attempt}'`);
      }
      continue;
    }

    // b. normal button click
    if (field.type === "button") {
      console.info(`[BUTTON] Clicking button '${jsonPath}'`);
      await clickButton(page, field.selector);
      continue;
    }

    // 7. required fields validation - check BEFORE skipping
    if (field.required && field.type !== "radio") {
      if (value === undefined || value === null || value === "") {
        throw new Error(`Required Field "${jsonPath}" is missing a value.`);
      }
    }

    // 8. Skip only value is empty (optional fields)
    if (!field.required && (value === undefined || value === null || value === "")) {
      console.info(`[SKIPPED] Field '${jsonPath}' - value is empty (optional field)`);
      continue;
    }

    // 9. RADIO button value (can be string or object with value/selected)
    if (field.type === "radio") {
      console.info(`[DEBUG] radio value for field '${jsonPath}'`, value);
      const normalizedValue = normalizeRadioValue(value);
      // Requried Radio: must have a value, optional radio: can be empty
      if (field.required) {
        if (!normalizedValue) {
          throw new Error(`[REQUIRED] Field "${jsonPath}" is missing a value.`);
        }
      }

      // Optional Radio: skip if no value
      if (!field.required && !normalizedValue) {
        console.info(`[SKIPPED] Field '${jsonPath}' - value is empty (optional radio field)`);
        continue;
      }

      if (normalizedValue == undefined || !field.selectors[normalizedValue]) {
        throw new Error(`[ERROR] value '${value}' is not found in radio selectors for field '${jsonPath}'`);
      }
    }

    // 10. Scroll into view before interacting with the element (for text, dropdown, radio, checkbox)
    if (field.selector) {
      try {
        const locator = page.locator(field.selector);
        await locator.scrollIntoViewIfNeeded();
      } catch (error) {
        console.warn(`[WARNING] Failed to scroll element into view for selector: ${field.selector}`, error);
      }
    }

    // 11. Fill based on type
    switch (field.type) {
      case "text":
        console.info(`[FILLED] Field '${jsonPath}' (text) = '${value}'`);
        await fillText(page, field.selector, String(value));
        break;
      case "dropdown":
        console.info(`[FILLED] Field '${jsonPath}' (dropdown) = '${value}'`);
        await fillDropdown(page, field.selector, String(value));
        break;
      case "radio":
         console.info(`[FILLED] Field '${jsonPath}' (radio) = '${value}'`);
        await fillRadio(page, field.selectors, String(value));
        break;
      case "checkbox":
         console.info(`[FILLED] Field '${jsonPath}' (checkbox) = '${value}'`);
        await fillCheckbox(page, field.selector, Boolean(value));
        break;
      default:
        throw new Error(`[ERROR] Unknown field type: ${field.type}`);
    }
  }
}