import { Page } from "@playwright/test";
import { EnvLoader } from "@config/loaders/envLoader";
import { CommonFunctions } from "@config/utils/CommonFunctions";
import { JsonUtils } from "@config/utils/JsonUtils";
import { RecipientUtils } from "@config/utils/RecipientUtils";
import { PropertyUtils } from "@config/utils/PropertyUtils";
import { HeaderPage } from "@pages/pageActions/headerPage";
import { fillPageFields } from "@config/reusable_functions/recipientHandler";
import { createRecipientLocators } from "@pages/pageFactory/createRecipientLocators";
import { RecipientPage } from "@pages/pageActions/createRecipientPage";
import { page1Fields, page2Fields } from "@pages/pageFactory/interacPageFields";

export enum RecipientType {
    SINGLE = "SINGLE",
    MULTIPLE = "MULTIPLE",
    NONE = "NONE"
}

export class CreateRecipientService {
  private static commonFunctions = CommonFunctions.getInstance();

  /**
   * Creates or fetches a recipient profile based on the testcase_id and environment.
   * If a profile already exists for the given testcase_id and environment, it will be reused.
   * Otherwise, a new recipient profile will be created and persisted to JSON for future reuse.
   * 
   * @param  page - Playwright Page object for browser interaction
   * @param  inputDataMap - Input data containing testcase_id, environment and other necessary fields for recipient creation
   * @return Promise<Record<string, any>> - Returns the inputDataMap with profileName set for the recipient profile
   * @throws Error if testcase_id is missing, recipient creation fails, or profileName is not set after creation
   * 
   */
  async createOrFetchRecipient(page: Page,inputDataMap: Record<string, any>): Promise<Record<string, any>> {
    const testcaseId = inputDataMap.testcaseName || inputDataMap.testcase_id;
    if (!testcaseId) {
      throw new Error("testcaseName or testcase_id is required in inputDataMap");
    }

    // resolve environment and ensure envLoader is initialized to load recipient file paths
    const envName = inputDataMap.envName || process.env.ENV_NAME || "uat-green";
    const envNameUpper = envName.toUpperCase();
    if (!Object.keys(EnvLoader.recipientFilePaths).length) {
      EnvLoader.loadEnvironment(envName);
    }

    inputDataMap.envName = envName;
    const recipientFileKey = "interacRecipientProfile"; // default module key for recipient file path, can be extended to be dynamic based on inputDataMap if needed
    const recipientUtils = new RecipientUtils();

    // step 1: look up for profileName for current testcase_id and environment in the JSON file, if found → use it
    const existingProfileName = JsonUtils.readRecipientName(testcaseId, recipientFileKey, envName);
    if (existingProfileName) {
      // Reuse: rebuild dependent fields (users numeric sufffix from existing profile name and update inputDataMap) → return inputDataMap with profileName
      const suffix = CreateRecipientService.commonFunctions.getNumbersFromString(existingProfileName);
      await recipientUtils.updateUniqueDataInProfileMap(inputDataMap, suffix);
      inputDataMap.profileName = existingProfileName;
      console.info(`[${testcaseId}] Profile already exists in JSON for environment: '${envName}' : '${existingProfileName}' - skipping recipient creation`);
      return inputDataMap;
    }

    // Step 2: If not found in JSON for current testcase_id, create new recipient and write profileName back to JSON file for future reuse
    console.info(`[${testcaseId}] No existing profile found in JSON for environment: '${envName}' - proceeding to create recipient`); 
    CreateRecipientService.commonFunctions.setRandomUniqueNumber(CreateRecipientService.commonFunctions.getRandomNumber());
    const randomNumber = CreateRecipientService.commonFunctions.getrandomUniqueNumber() || "";
    await recipientUtils.updateUniqueData(inputDataMap, randomNumber);

    const paymentType = (JsonUtils.getStringValueFromList(inputDataMap, "testdata.createRecipient.recipients[0].paymentType") || "").toLowerCase();
    let recipientType: RecipientType;
    if (paymentType === "interac e-transfer") {
      // profileName is set on inoputDataMap as a side effect of updateUniqueDataInProfileMap method.
      recipientType = await this.createInteracRecipient(page, inputDataMap);
      console.info(`[${testcaseId}] Interac recipient created with profileName: '${inputDataMap.profileName}' for environment: '${envNameUpper}'`);
    } else {
      console.warn(`[${testcaseId}] Unsupported payment type for recipient creation: '${paymentType}' for environment: '${envNameUpper}'`);
      throw new Error(` [${testcaseId}] Unsupported payment type for recipient creation: '${paymentType}'`);
    }

    if (!inputDataMap.profileName) {
      throw new Error(`[${testcaseId}] Recipient creation failed - profileName not set in inputDataMap after creation flow for environment: '${envNameUpper}'`);
    }

    // step 3 - persist profileName to JSON for future reuse based on testcase_id and envName
    if (recipientType === RecipientType.NONE) {
      throw new Error(`[${testcaseId}] Recipient creation failed for environment: '${envNameUpper}' - profileName ${inputDataMap.profileName} will not be persisted to JSON`);
    }

    if (recipientType === RecipientType.SINGLE) {
      console.info(`[${testcaseId}] Recipient creation successful → SINGLE recipient profile created with profileName: '${inputDataMap.profileName}' for environment: '${envNameUpper}'`);
      this.persistProfileToJson(testcaseId, envNameUpper, recipientFileKey, inputDataMap.profileName);
      console.info(`[${testcaseId}] Recipient profile persisted to JSON for environment: '${envNameUpper}' with profileName: '${inputDataMap.profileName}'`);
      return inputDataMap;
    }

    if (recipientType === RecipientType.MULTIPLE) {
      console.info(`[${testcaseId}] Recipient creation successful → MULTI recipient profile created with profileName: '${inputDataMap.profileName}' for environment: '${envNameUpper}'`);
      this.persistProfileToJson(testcaseId, envNameUpper, recipientFileKey, inputDataMap.profileName);
      console.info(`[${testcaseId}] Recipient profile persisted to JSON for environment: '${envNameUpper}' with profileName: '${inputDataMap.profileName}'`);
      return inputDataMap;
    }

    return inputDataMap;
  }

  /**
   * Persists the created recipient profileName to JSON file for future reuse based on testcase_id and environment.
   * 
   * @param testcaseId - The unique identifier for the test case
   * @param envNameUpper - The uppercase environment name (e.g., "UAT-GREEN")
   * @param recipientFileKey - The key to identify the recipient profile file path in EnvLoader
   * @param profileName - The created recipient profile name to be persisted
   * @throws Error if writing to JSON file fails
   * 
   */
  private persistProfileToJson(testcaseId: string, envNameUpper: string, recipientFileKey: string, profileName: string): void {
    const envKey =`profileName - ${envNameUpper.replace(/-/g, "")}`;
    const profileNameMap: Record<string, string> = { [envKey]: profileName };
    const recipientFIlePath = EnvLoader.getRecipientProfileFilePath(recipientFileKey);
    JsonUtils.writeRecipientNameIntoJsonFile(profileNameMap, testcaseId, recipientFIlePath);
    console.info(`Recipient profile written to JSON for testcase '${testcaseId}' and environment '${envNameUpper}': ${JSON.stringify(profileNameMap)}`);
  }

  /**
   * Creates a new interac recipient profile
   * 
   * @param page - Playwright Page object for browser interaction
   * @param inputData - Input data containing necessary fields for recipient creation
   * @return Promise<RecipientType> - Returns the type of recipient created (SINGLE, MULTIPLE, or NONE)
   * @throws Error if recipient creation fails or profileName is not set after creation
   * 
   */
  async createInteracRecipient(page: Page, inputData: Record<string, any>): Promise<RecipientType> {
    const headerPage = new HeaderPage(page);
    await PropertyUtils.load("interacPropertyFile");
    await headerPage.navigateToCreateRecipient();
    await headerPage.clickOnAddRecipient();

    const recipients = JsonUtils.getListFromMap(inputData, "testdata.createRecipient.recipients");
    // no recipients found in inputData → throw error
    if (!recipients || recipients.length === 0) {
        throw new Error("At least one recipient is required in inputData to create a recipient profile");
    }

    // PAGE 1 - always filled once for single or multi recipient profile creation
    await fillPageFields(page, inputData, page1Fields);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForURL(/saveRecipientProfile/i, { timeout: 3000 }).catch(() => null);
    await page.locator(createRecipientLocators.recipinentDestination).waitFor({ state: "visible", timeout: 3000 });

    // PAGE 2 - loop for single or multi recipient profile creation
    for (let i = 0; i < recipients.length; i++) {
      // handle each recipient in the list, filling the page fields and clicking "Add Another" if not the last recipient
      const recipient = recipients[i];
      console.info(`Handling recipient ${i + 1} of ${recipients.length}`);
      const scopedData = { ...inputData, currentRecipient: recipient, recipientIndex: i + 1 };
      await fillPageFields(page, scopedData, page2Fields);
      await page.waitForLoadState("domcontentloaded");

      // hceck if more recipients to add
      const isLastRecipient = i === recipients.length - 1;
      if (!isLastRecipient) {
        const addAnotherButton = page.locator(createRecipientLocators.addAnotherRecipient);
        let clicked = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.info(`Attempt ${attempt} to click "Add Another" button for recipient ${i + 1}`);  
          try {
            const visible = await addAnotherButton.isVisible({ timeout: 3000 });
            if (visible) {
              console.info(`Attempt ${attempt}: "Add Another" button is visible for recipient ${i + 1}`);
              await addAnotherButton.scrollIntoViewIfNeeded();
              await addAnotherButton.click();
              await page.waitForLoadState("domcontentloaded");
              clicked = true;
              break;
            } else {
              console.warn(`Attempt ${attempt}: "Add Another" button not visible for recipient ${i + 1}`);
            }
          } catch (error) {
            console.error(`Attempt ${attempt}: Error while checking/clicking "Add Another" button for recipient ${i + 1}: ${error}`);
          }
          await page.waitForTimeout(2000); // wait before retrying
        }
        if (!clicked) {
          throw new Error(`Failed to click "Add Another" button for recipient ${i + 1} after 3 attempts`);
        }
      }
    }

    // SUCCESS MESSAGE VERIFICATION
    const expectedSingleMsg = PropertyUtils.getPropertyValue("interac.createRecipient.singleRecipientMessage") || "";
    const expectedMultiMsg = PropertyUtils.getPropertyValue("interac.createRecipient.multiRecipientMessage") || "";
    const recipientPage = new RecipientPage(page);
    const recipientType = await recipientPage.verifyRecipientCreation(expectedSingleMsg, expectedMultiMsg);
    console.info(`Recipient created successfully: ${recipientType} account.`);

    if (recipientType === RecipientType.SINGLE) {
        console.info("Recipient creation successful - [SINGLE recipient profile created]");
    } else if (recipientType === RecipientType.MULTIPLE) {
        console.info("Recipient creation successful - [MULTIPLE recipient profile created]");
    } else {
        throw new Error("Recipient creation failed - [NONE recipient profile created]");
    }

    // ensure profilename was created and set in inputDataMap as a side effect of the creation flow
    if (!inputData.profileName) {
        throw new Error("profileName was not created during interac recipient creation flow - cannot proceed with payment creation");
    }

    return recipientType; // RecipientType.SINGLE | RecipientType.MULTIPLE | RecipientType.NONE
  }
}