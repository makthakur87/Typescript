import { Page } from "@playwright/test";

export async function getValueByPath(obj: any, [path]: string) {
    return path
        .replace(/\[(\d+)\]/g, ".$1") // convert indexes to properties
        .split(".")
        .reduce((acc, key) => acc ?.[key], obj);
}

export async function fillText(page: Page, selector: string, value: string) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 5000 });
  try {
    await locator.fill(value);
    console.info(`[FILLED] Field (text) '${selector}' = '${value}'`);
  } catch (error) {
    console.info(`[SKIPPED] Field (text) '${selector}' - Error occurred while filling with value '${value}':`, error);
    throw error;
  }
}

export async function fillDropdown(page: Page, selector: string, value: string) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 500 });

  try {
    // click dropdown to open options
    await locator.click();
    await page.waitForTimeout(500); // wait for dropdown options to render

    // try to find and select the option - supports both value and display text matching
    let option = page.locator(`${selector} option[value="${value}"]`);
    let optionCount = await option.count();

    // if exact value match not found, try matching by visible text(for display like "Interac e-Transfer" instead of "interac e-transfer")
    if (optionCount === 0) {
      option = page.locator(`${selector} option:hasText("${value}")`);
      optionCount = await option.count();
    }

    if (optionCount > 0) {
      // get the actual value attribute to select the option
      const actualValue = await option.first().getAttribute("value");
      console.info(`[FILLED] Field (dropdown) - Selecting option with value='${actualValue}' for input '${value}'`);
      
      await locator.selectOption(actualValue || value);

      // wait for JSF AJAX callback to complete
      await page.waitForTimeout(500);
      await page.waitForLoadState("domcontentloaded").catch(() => null);
      await page.waitForTimeout(500);

      const selectedValue = await locator.inputValue().catch(() => null);
      console.info(`[VERIFICATION] Field (dropdown) - After selection, selected value is: '${selectedValue}'`);
    } else {
      console.info(`[SKIPPED] Field (dropdown) - Option '${value}' is not found in dropdown: '${selector}'`);
    }
  } catch (error) {
    console.log(`[SKIPPED] Field (dropdown) - Error occurred while selecting dropdown option '${value}' from selector '${selector}': ${error}`);
  } 
}

export async function fillRadio(page: Page, selectors: any, value: string) {
  const selector = selectors[value];
  if (!selector) {
    throw new Error(`Radio option '${value}' not found in selectors`);
  }
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 5000 });
  try {
    await locator.click();
    console.log(`[FILLED] Field (radio) - Selected option '${value}'`);
  } catch (error) {
    console.log(`[SKIPPED] Field (radio) - Error occurred while selecting radio option '${value}' from selectors: ${error}`);
  }
}

export async function fillCheckbox(page: Page, selector: string, value: boolean) {
  const element = page.locator(selector);
  await element.waitFor({ state: "visible", timeout: 5000 });
  try {
    value ? await element.check() : await element.uncheck();
    console.info(`[FILLED] Field (checkbox) - Set to '${value}'`);
  } catch (error) {
    console.error(`[SKIPPED] Field (checkbox) - Error occurred while setting checkbox '${selector}' to '${value}': ${error}`);
  }
}

export async function clickButton(page: Page, selector: string) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 5000 });
  try {
    await locator.click();
    console.info(`[CLICKED] Button with selector '${selector}'`);
  } catch (error) {
    const message = String(error);
    if (message.includes("intercepts pointer events") || message.includes("subtree intercepts pointer events")) {
      console.warn(`Click intercepted for selector '${selector}', using DOM click fallback...`);
      await locator.evaluate((el) => (el as HTMLElement).click());
      return;
    }
    console.error(`[SKIPPED] Field (button) - Error occurred while clicking button with selector '${selector}': ${error}`);
  }
}

export function normalizeRadioValue(value: any): string | undefined {
  if (typeof value === "string") return value;
  if (value?.value) return value.value;
  if (value?.selected) return value.selected;

  // Case: { Yes: true }
  const keys = Object.keys(value || {});
  if (keys.length === 1) {
    return keys[0];
  }
  return undefined;
}

export async function getRadioButtonValue(value:any): Promise<string> {
  const normalizedValue = normalizeRadioValue(value);
  if (normalizedValue) {
    
    return normalizedValue;
  }
  throw new Error(`Unable to determine radio button value from: ${JSON.stringify(value)}`);
}