import { createRecipientLocators } from "@pages/pageFactory/createRecipientLocators";
import { Page } from "@playwright/test";
import { generateToken } from "@config/utils/token";

export const page1Fields = {
  closePopup: {
    type: "custom",
    handler: "closeOneTrustPopup",
  },
  "testdata.createRecipient.profileInformation.profileType": {
    type: "custom",
    handler: getProfileType,
    required: true,
  },
  profileName: {
    type: "text",
    selector: createRecipientLocators.sProfileName,
    required: true,
  },
  "testdata.createRecipient.profileInformation.profileEmail": {
    type: "text",
    selector: createRecipientLocators.profileEmail
  },

  "testdata.createRecipient.profileInformation.profilePhoneNumber": {
    type: "text",
    selector: createRecipientLocators.profilePhoneNumber
  },

  // RADIO visible only if enhanced
  "testdata.createRecipient.profileInformation.addServiceGroup": {
    type: "radio",
    selectors: {
      Yes: createRecipientLocators.profileSgYesButton,
      No: createRecipientLocators.profileSgNoButton
    },
    visibleWhen: (data: any) => data.isEnhancedCustomer === "true"
  },
  // DROPDOWN visible only if enhanced AND radio = Yes
  "testdata.createRecipient.profileInformation.profileServiceGroup": {
    type: "dropdown",
    selector: createRecipientLocators.profileServiceGroup,
    when: (data: any) =>
      data.isEnhancedCustomer === "true" &&
      normalizeRadioValue(getValueByPath(
        data,
        "testdata.createRecipient.profileInformation.addServiceGroup"
      )) === "Yes",
    required: true,
  },
  continueButton_1: {
    type: "button",
    selector: createRecipientLocators.profileContinueButton
  }
};

export const page2Fields = {
  "currentRecipient.paymentDestination": {
    type: "dropdown",
    selector: createRecipientLocators.recipinentDestination,
    required: true,
  },

  "currentRecipient.paymentType": {
    type: "dropdown",
    selector: createRecipientLocators.paymentType,
    required: true,
  },

  "currentRecipient.fundTransferType": {
    type: "radio",
    selectors: {
      EMAIL: createRecipientLocators.fundTransferEmail,
      ANN: createRecipientLocators.fundTransferAccountNumber,
      BOTH: createRecipientLocators.fundTransferBoth,
    },
    required: true,
  },
   "currentRecipient.bankDetails.bankInstitution": {
    type: "dropdown",
    selector: createRecipientLocators.bankInstitutionNumber,
    visibleWhen: (data: any) => {
      return data.currentRecipient.fundTransferType === "ANN" ||
      data.currentRecipient.fundTransferType === "BOTH";
    },
    required: true
  },
  "currentRecipient.bankDetails.transitNumber": {
    type: "text",
    selector: createRecipientLocators.bankTransitNumber,
    visibleWhen: (data: any) =>
      data.currentRecipient.fundTransferType === "ANN" ||
      data.currentRecipient.fundTransferType === "BOTH",
    required: true
  },
  "currentRecipient.bankDetails.accountNumber": {
    type: "text",
    selector: createRecipientLocators.bankAccountNumber,
    visibleWhen: (data: any) =>
      data.currentRecipient.fundTransferType === "ANN" ||
      data.currentRecipient.fundTransferType === "BOTH",
    required: true
  },
  recipientName: {
    type: "custom",
    handler: fillRecipientName,
    required: true
  },
  "currentRecipient.recipientAddress.recipientEmailAddress": {
    type: "text",
    selector: createRecipientLocators.recipientEmail,
    visibleWhen: (data: any) =>
      data.currentRecipient.fundTransferType === "EMAIL" ||
      data.currentRecipient.fundTransferType === "BOTH",
    required: true
  },
   "currentRecipient.recipientAddress.notificationEmailAddress": {
    type: "text",
    selector: createRecipientLocators.recipientNotificationEmail,
    visibleWhen: (data: any) =>
      data.currentRecipient.fundTransferType === "ANN",
  },
  "currentRecipient.recipientAddress.notificationLanguage": {
    type: "dropdown",
    selector: createRecipientLocators.recipientNotificationLanguage,
  },
  accountNickName: {
    type: "custom",
    handler: fillAccountNickname,
    required: true
  },
  password: {
    type: "custom",
    handler: fillPassword,
    required: true,
  },
  token: {
    type: "custom",
    handler: fillToken,
    required: true,
  },
  continueButton_2: {
    type: "button",
    selector: createRecipientLocators.recipientContinueButton
  }
};

export async function fillPageFields(page: Page, inputData: Record<string, any>, config: Record<string, any>) {
  for (const [jsonPath, field] of Object.entries(config)) {
    // Resolve value (dot-notation or direct key)
    let value = jsonPath.includes(".") ? getValueByPath(inputData, jsonPath) : inputData[jsonPath];

    // 1. visibleWhen FIRST
    if (typeof field.visibleWhen === "function") {
      const isVisible = field.visibleWhen(inputData);
      if (!isVisible) {
        console.log(`[SKIPPED] Field '${jsonPath}' - visibleWhen condition not met`);
        continue;
      }
    }

    // 2. apply when condition for any field type, not just conditional
    if (typeof field.when === "function") {
      const shouldApply = field.when(inputData);
      if (!shouldApply) {
        console.log(`[SKIPPED] Field '${jsonPath}' - when condition not met`);
        continue;
      }
    }

    // 3. CUSTOM fields with custom handlers
    if (field.type === "custom") {
      console.log(`[CUSTOM] Field '${jsonPath}' - executing custom handler`);
      await field.handler(page, inputData);
      continue;
    }

    // 4. BUTTON fields
    if (field.type === "button") {
      console.log(`[BUTTON]  Clicking button: ${jsonPath}`);
      await clickButton(page, field.selector);
      continue;
    }

    // 5. required fields validation - check before skipping
    if (field.required && (value === undefined || value === null || value === "")) {
      throw new Error(`Required Field "${jsonPath}" is missing a value.`);
    }

    // 6. Skip optional fields with no value
    if (value === undefined || value === null || value === "") {
      console.log(`[SKIPPED] Field '${jsonPath}' - value is empty (optional field`);
    }

    // 7. RADIO button value (can be string or object with value/selected)
    if (field.type === "radio") {
      value = await getRadioButtonValue(value);
      if (!field.selectors[value]) {
        throw new Error(
          `Radio value "${value}" does not match options: ${Object.keys(field.selectors)}`);
      }
    }

    // 8. Scroll into view safely
    if (field.selector) {
      try {
        const locator = page.locator(field.selector);
        await locator.scrollIntoViewIfNeeded();
      } catch (error) {
        console.warn(`Failed to scroll element into view for selector: ${field.selector}`, error);
      }
    }

    // 9. Fill based on type
    switch (field.type) {
      case "text":
        console.log(`[FILLED] Field '${jsonPath}' (text) = '${value}'`);
        await fillText(page, field.selector, String(value));
        break;

      case "dropdown":
        console.log(`[FILLED] Field '${jsonPath}' (dropdown) = '${value}'`);
        await fillDropdown(page, field.selector, String(value));
        break;

      case "radio":
         console.log(`[FILLED] Field '${jsonPath}' (radio) = '${value}'`);
        await fillRadio(page, field.selectors, String(value));
        break;

      case "checkbox":
         console.log(`[FILLED] Field '${jsonPath}' (checkbox) = '${value}'`);
        await fillCheckbox(page, field.selector, Boolean(value));
        break;

      default:
        throw new Error(`Unknown field type: ${field.type}`);
    }
  }
}

async function getProfileType(page: Page, inputData: Record<string, any>) {
  const value = getValueByPath(inputData, "testdata.createRecipient.profileInformation.profileType");
  if (value && value.toLowerCase() === "business") {
    await page.locator(createRecipientLocators.profileTypeBusiness).click();
  } else if (value && value.toLowerCase() === "individual") {
    await page.locator(createRecipientLocators.profileTypeIndividual).click();
  } else {
    throw new Error(`Unknown profile type: ${value}`);
  }
}

async function closeOnePopup(page: Page) {
  try {
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(10000);

    // try multiple selectors for the clsoe button
    const selectors = ["#onetrust-close-btn-container button", ".onetrust-close-btn-handler", "button.onetrust-close-btn-handler", "[aria-label='Close'][class*='onetrust']"];
    for (const selector of selectors) {
      try {
        const closeButton = page.locator(selector);
        const isVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          console.log(`OneTrust popup detected with selector: '${selector}', closing it...`);
          await closeButton.click();
          await page.waitForTimeout(500);
          console.log("OneTrust popup closed successfully");
          return;
        }
      } catch (e) {
        // continue to next selector
      }
    }
    console.log("No OneTrust popup found, continuing...");
  } catch (error) {
    console.log(`Error clsoing OneTrust popup: ${error}`);
  }
}

async function fillAccountNickname(page: Page, inputData: Record<string, any>) {
  const recipientIndex = inputData.recipientIndex;
  const nicknameKey = `accountNickname${recipientIndex}`;
  const nicknameValue = inputData[nicknameKey];

  if (!nicknameValue) {
    throw new Error(`${nicknameKey} not found in inputData`);
  }

  try {
     const locator = page.locator(createRecipientLocators.recipientAccountNickname);
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.fill(nicknameValue);
    console.log(`[FILLED] Field 'Account Nickname' - Filled - '${nicknameValue}'`);
  } catch (error) {
    console.log(`[SKIPPED] Field 'Account Nickname' - Error occurred while filling: ${error}`);
  }
}

async function fillPassword(page: Page, inputData: Record<string, any>) {
  const password = inputData.password;

  if (!password) {
    throw new Error("password not found in inputData");
  }

  try {
    const locator = page.locator("#saveRecipientForm\\:currentpwd");
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.fill(password);
    console.log(`[FILLED] Field 'Password' - Filled`);
  } catch (error) {
    console.log(`[SKIPPED] Field 'Password' - Error occurred while filling: ${error}`);
  }
}

async function fillRecipientName(page: Page, inputData: Record<string, any>) {
  const recipientIndex = inputData.recipientIndex;
  const nameKey = `recipientName${recipientIndex}`;
  const nameValue = inputData[nameKey];

  if (!nameValue) {
    throw new Error(`${nameKey} not found in inputData`);
  }

  try {
    const locator = page.locator(createRecipientLocators.recipientName);
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.fill(nameValue);
    console.log(`[FILLED] Field 'Recipient Name' - Filled - '${nameValue}'`);
  } catch (error) {
    console.log(`[SKIPPED] Field 'Recipient Name' - Error occurred while filling: ${error}`);
  }
}

async function fillToken(page: Page, inputData: Record<string, any>) {
  const envName = inputData.envName;
  // only enter token for IST or UAT
  if (!envName || (!envName.toLowerCase().includes("ist") && !envName.toLowerCase().includes("uat"))) {
    console.log(`[SKIPPED] Field 'token' - environment '${envName}' is not IST/UAT, waiting for user input`);
    return;
  }

  const token = generateToken();
  const tokenLocator = page.locator("#saveRecipientForm\\:tokenValue");
  // try to fill a token input if present
  try {
    await tokenLocator.waitFor({ state: "visible", timeout: 3000 });
    await tokenLocator.fill(token);
    console.log(`[FILLED] Field 'token' - Filled - '${token}'`);
  } catch (error){
    console.log(`[SKIPPED] Field 'token' - field not visible (waiting for user input)`, error);
  }
}


function getValueByPath(obj: any, path: string) {
  return path.replace(/\[(\w+)\]/g, ".$1").split(".").reduce((acc, key) => acc?.[key], obj);
}

async function fillText(page: Page, selector: string, value: string) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 5000 });
  try {
    await locator.fill(value);
    console.log(`[FILLED] Field (text) = '${value}'`);
  } catch (error) {
    console.log(`[SKIPPED] Field (text) - Error occurred while filling: ${error}`);
  }
}

async function fillDropdown(page: Page, selector: string, value: string) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 5000 });

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
      console.log(`[FILLED] Field (dropdown) - Selecting option with value='${actualValue}' for input '${value}'`);
      await locator.selectOption(actualValue || value);

      // wait for JSF AJAX callback to complete
      await page.waitForTimeout(500);
      await page.waitForLoadState("domcontentloaded").catch(() => null);
      await page.waitForTimeout(500);

      const selectedValue = await locator.inputValue().catch(() => null);
      console.log(`[VERIFICATION] Field (dropdown) - After selection, selected value is '${selectedValue}'`);
    } else {
      console.log(`[SKIPPED] Field (dropdown) - Option '${value}' not found in dropdown '${selector}'`);
    }
  } catch (error) {
    console.log(`[SKIPPED] Field (dropdown) - Error occurred while selecting dropdown option '${value}' from selector '${selector}': ${error}`);
  } 
}

async function fillRadio(page: Page, selectors: any, value: string) {
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

async function fillCheckbox(page: Page, selector: string, value: boolean) {
  const element = page.locator(selector);
  await element.waitFor({ state: "visible", timeout: 5000 });
  try {
    value ? await element.check() : await element.uncheck();
    console.info(`[FILLED] Field (checkbox) - Set to '${value}'`);
  } catch (error) {
    console.error(`[SKIPPED] Field (checkbox) - Error occurred while setting checkbox '${selector}' to '${value}': ${error}`);
  }
}

async function clickButton(page: Page, selector: string) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 5000 });
  try {
    await locator.click();
    console.log(`[CLICKED] Button with selector '${selector}'`);
  } catch (error) {
    const message = String(error);
    if (message.includes("intercepts pointer events") || message.includes("subtree intercepts pointer events")) {
      console.warn(`Click intercepted for selector '${selector}', using DOM click fallback...`);
      await locator.evaluate((el) => (el as HTMLElement).click());
      return;
    }
    console.error(`[SKIPPED] Field (button) - Error occurred while clicking button with selector '${selector}': ${error}`);
  }
  await page.locator(selector).click();
}

function normalizeRadioValue(value: any): string | undefined {
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

async function getRadioButtonValue(value:any): Promise<string> {
  const normalizedValue = normalizeRadioValue(value);
  if (normalizedValue) {
    
    return normalizedValue;
  }
  throw new Error(`Unable to determine radio button value from: ${JSON.stringify(value)}`);
}

