import { JsonUtils } from "@config/utils/JsonUtils";
import { EnvLoader } from "@config/loaders/envLoader";
import { PropertyUtils } from "@config/utils/PropertyUtils";
import { CommonFunctions } from "@config/utils/CommonFunctions";
import { RecipientUtils } from "@config/utils/RecipientUtils";
import { HeaderPage } from "@pages/pageActions/headerPage";
import { RecipientPage } from "@pages/pageActions/createRecipientPage";
import { Page } from "@playwright/test";
import { fillPageFields, page1Fields, page2Fields } from "@config/reusable_functions/recipientHandler";
import { createRecipientLocators } from "@pages/pageFactory/createRecipientLocators";

export enum RecipientType {
    SINGLE = "SINGLE",
    MULTIPLE = "MULTIPLE",
    NONE = "NONE"
}

export class RecipientService {
  private static commonFunctions = CommonFunctions.getInstance();

  /**
   * Create or fetch recipient for a testcase
   * Fully generic: only inputDataMap is required
   */
  async createOrFetchRecipient(page: Page,inputDataMap: Record<string, any>): Promise<Record<string, any>> {
    const testcaseId = inputDataMap.testcaseName || inputDataMap.testcase_id;
    if (!testcaseId) throw new Error("testcaseName or testcase_id is required in inputDataMap");

    // resolve environment and ensure envLoader is initialized to load recipient file paths
    const envName = inputDataMap.envName || process.env.ENV_NAME || "uat-green";
    const envNameUpper = envName.toUpperCase();
    if (!Object.keys(EnvLoader.recipientFilePaths).length) {
      EnvLoader.loadEnvironment(envName);
    }

    inputDataMap.envName = envName;
    const recipientFileKey = "interacRecipientProfile"; // default module key for recipient file path, can be extended to be dynamic based on inputDataMap if needed
    const recipientUtils = new RecipientUtils();

    // step 1: look up for profileName for current testcase_id + env in the JSON file, if found → use it
    const existingProfileName = JsonUtils.readRecipientName(testcaseId, recipientFileKey, envName);
    // const uniqueRecipientString = await recipientUtils.createUniqueRecipientString(inputDataMap);
    if (existingProfileName) {
      // Reuse: rebuild dependent fields (users numeric sufffix from existing profile name and update inputDataMap) → return inputDataMap with profileName
      const suffix = RecipientService.commonFunctions.getNumbersFromString(existingProfileName);
      await recipientUtils.updateUniqueDataInProfileMap(inputDataMap, suffix);
      inputDataMap.profileName = existingProfileName;
      console.info(`[${testcaseId}] Profile already exists in JSON for env: '${envName}' : '${existingProfileName}' - skipping recipient creation`);
      return inputDataMap;
    }

    // Step 2: If not found in JSON for current testcase_id, create new recipient and write profileName back to JSON file for future reuse
    console.info(`[${testcaseId}] No existing profile found in JSON for env: '${envName}' - proceeding to create recipient`); 
    RecipientService.commonFunctions.setRandomUniqueNumber(RecipientService.commonFunctions.getRandomNumber());
    const randomNumber = RecipientService.commonFunctions.getrandomUniqueNumber() || "";
    await recipientUtils.updateUniqueDataInProfileMap(inputDataMap, randomNumber);

    const paymentType = (JsonUtils.getStringValueFromList(inputDataMap, "testdata.createRecipient.recipients[0].paymentType") || "").toLowerCase();
    let recipientType: RecipientType;
    if (paymentType === "interac e-transfer") {
      // profileName is set on inoputDataMap as a side effect of updateUniqueDataInProfileMap method.
      recipientType = await this.createRecipient(page, inputDataMap);
      console.info(`[${testcaseId}] Interac recipient created with profileName: '${inputDataMap.profileName}' for env: '${envName}'`);
    } else {
      console.warn(`[${testcaseId}] Unsupported payment type for recipient creation: '${paymentType}' for env: '${envName}'`);
      throw new Error(` [${testcaseId}] Unsupported payment type for recipient creation: '${paymentType}'`);
    }

    if (!inputDataMap.profileName) {
      throw new Error(`[${testcaseId}] Recipient creation failed - profileName not set in inputDataMap after creation flow for env: '${envName}'`);
    }

    if (recipientType === RecipientType.NONE) {
      throw new Error(`[${testcaseId}] Recipient creation failed for env: '${envName}' - profileName ${inputDataMap.profileName} will not be persisted to JSON`);
    }

    if (recipientType === RecipientType.SINGLE) {
      console.info(`[${testcaseId}] Recipient creation successful → SINGLE recipient profile created with profileName: '${inputDataMap.profileName}' for env: '${envName}'`);
      this.persistProfileToJson(testcaseId, envNameUpper, recipientFileKey, inputDataMap.profileName);
      console.info(`[${testcaseId}] Recipient profile persisted to JSON for env: '${envName}' with profileName: '${inputDataMap.profileName}'`);
      return inputDataMap;
    }

    if (recipientType === RecipientType.MULTIPLE) {
      console.info(`[${testcaseId}] Recipient creation successful → MULTI recipient profile created with profileName: '${inputDataMap.profileName}' for env: '${envName}'`);
      this.persistProfileToJson(testcaseId, envNameUpper, recipientFileKey, inputDataMap.profileName);
      console.info(`[${testcaseId}] Recipient profile persisted to JSON for env: '${envName}' with profileName: '${inputDataMap.profileName}'`);
      return inputDataMap;
    }

    return inputDataMap;
  }

  /**
   * Persist recipient profile to JSON file for future reuse based on testcase_id and envName
   * 
   * @param testcaseId 
   * @param envNameUpper 
   * @param recipientFileKey 
   * @param profileName 
   */
  private persistProfileToJson(testcaseId: string, envNameUpper: string, recipientFileKey: string, profileName: string): void {
    const envKey =`profileName - ${envNameUpper.replace(/-/g, "")}`;
    const profileNameMap: Record<string, string> = { [envKey]: profileName };
    const recipientFIlePath = EnvLoader.getRecipientProfileFilePath(recipientFileKey);
    JsonUtils.writeRecipientNameIntoJsonFile(profileNameMap, testcaseId, recipientFIlePath);
    console.info(`Recipient profile written to JSON for testcase '${testcaseId}' and env '${envNameUpper}': ${JSON.stringify(profileNameMap)}`);
  }


  /**
   * Creates a new recipient profile
   * 
   * @param page          
   * @param inputData 
   * @param recipientFileKey  
   */

  async createRecipient(page: Page, inputData: Record<string, any>): Promise<RecipientType> {
    const headerPage = new HeaderPage(page);
    await PropertyUtils.load("interacPropertyFile");
    await headerPage.navigateToCreateRecipient();
    await headerPage.clickAddOrManageRecipients();

    const recipients = JsonUtils.getListFromMap(inputData, "testdata.createRecipient.recipients");
    if (!recipients || recipients.length === 0) {
        throw new Error("At least one recipient is required in inputData to create a recipient profile");
    }

    // PAGE 1
    await fillPageFields(page, inputData, page1Fields);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForURL(/saveRecipientProfile/i, { timeout: 3000 }).catch(() => null);
    await page.locator(createRecipientLocators.recipinentDestination).waitFor({ state: "visible", timeout: 3000 });

    // PAGE 2
    for (let i = 0; i < recipients.length; i++) {
        const recip = recipients[i];
        console.info(`Handling recipient ${i + 1} of ${recipients.length}`);

        const scopedData = { ...inputData, currentRecipient: recip, recipientIndex: i + 1 };
        await fillPageFields(page, scopedData, page2Fields);
        await page.waitForLoadState("domcontentloaded");

        const isLast = i === recipients.length - 1;
        if (!isLast) {
            const addAnotherButton = page.locator(createRecipientLocators.addAnotherRecipient);
            await addAnotherButton.waitFor({ state: "visible" });
            await addAnotherButton.scrollIntoViewIfNeeded();
            await addAnotherButton.click();
            await page.waitForLoadState("domcontentloaded");
        }
    }

    // SUCCESS MESSAGE VERIFICATION
    await PropertyUtils.load("interacPropertyFilePath");
    const expectedSingleMsg = PropertyUtils.getPropertyValue("interac.createRecipient.singleRecipientMessage") || "";
    const expectedMultiMsg = PropertyUtils.getPropertyValue("interac.createRecipient.multiRecipientMessage") || "";
    const recipientPage = new RecipientPage(page);
    const recipientType = await recipientPage.verifyRecipientCreation(expectedSingleMsg, expectedMultiMsg);

    if (recipientType === RecipientType.SINGLE) {
        console.info("Recipient creation successful → SINGLE recipient profile created");
    } else if (recipientType === RecipientType.MULTIPLE) {
        console.info("Recipient creation successful → MULTI recipient profile created");
    } else {
        console.warn("Recipient creation did NOT complete successfully → returning NONE");
    }

    if (!inputData.profileName) {
        throw new Error("Recipient creation flow did not set profileName in inputDataMap");
    }

    return recipientType; // RecipientType.SINGLE | RecipientType.MULTIPLE | RecipientType.NONE
  }
}

