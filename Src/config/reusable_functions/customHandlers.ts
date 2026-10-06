import { generateToken } from "@config/utils/token";
import { createRecipientLocators } from "@pages/pageFactory/createRecipientLocators";
import { Page } from "@playwright/test";
import { getValueByPath } from "./fieldFillers";

export async function getProfileType(page: Page, inputData: Record<string, any>) {
  const value = await getValueByPath(inputData, "testdata.createRecipient.profileInformation.profileType");

  try {
    if (value && value.toLowerCase() === "business") {
        await page.locator(createRecipientLocators.profileTypeBusiness).click();
    } else if (value && value.toLowerCase() === "individual") {
        await page.locator(createRecipientLocators.profileTypeIndividual).click();
    } else {
        throw new Error(`[ERROR] Unknown profile type: ${value}`);
    }
    console.info(`[FILLED] Field 'Profile Type' - Selected '${value}'`);
  } catch (error) {
    console.error(`[ERROR] Error occurred while setting profile type: ${error}`);
  }
}

export async function fillRecipientName(page: Page, inputData: Record<string, any>) {
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
    console.log(`[SKIPPED] Field 'Recipient Name - ${nameValue}', Error occurred while filling: ${error}`);
  }
}

export async function fillAccountNickname(page: Page, inputData: Record<string, any>) {
  const recipientIndex = inputData.recipientIndex;
  const nicknameKey = `accountNickname${recipientIndex}`;
  const nicknameValue = inputData[nicknameKey];

  if (!nicknameValue) {
    throw new Error(`${nicknameKey} not found in inputData`);
  }

  try {
    const locator = page.locator(createRecipientLocators.recipientAccountNickname);
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(nicknameValue);
    console.log(`[FILLED] Field 'Account Nickname' - Filled - '${nicknameValue}'`);
  } catch (error) {
    console.log(`[SKIPPED] Field 'Account Nickname' - Error occurred while filling: ${error}`);
  }
}

export async function fillPassword(page: Page, inputData: Record<string, any>) {
  const password = inputData.password;

  if (!password) {
    throw new Error("password not found in inputData");
  }

  try {
    const locator = page.locator("#saveRecipientForm\\:currentpwd");
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(password);
    console.log(`[FILLED] Field 'Password' - Filled`);
  } catch (error) {
    console.log(`[SKIPPED] Field 'Password' - Error occurred while filling: ${error}`);
  }
}


export async function fillToken(page: Page, inputData: Record<string, any>) {
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

export async function closeOnePopup(page: Page) {
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