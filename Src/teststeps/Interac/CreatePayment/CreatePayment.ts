import { EnvLoader } from "@config/loaders/envLoader";
import { loadUsers } from "@config/loaders/userLoader";
import { JsonUtils } from "@config/utils/JsonUtils";
import  { test as base } from "@fixtures/loginFixture";
import { MultiUserManager } from "@fixtures/multiUserManager";
import { TestInfo, Page } from "@playwright/test";
import { RecipientService } from "service/CreateRecipient/CreateRecipientService";
import { HeaderPage } from "@pages/pageActions/headerPage";

const testDataFile = ["interacTestDataFile"];
export let localTestData: Record<string, any> = {};
let testcaseName: string = "";

base.beforeEach(async ({ page, multiUserManager }, testInfo: TestInfo) => {
    testcaseName = testInfo.title;
    localTestData = {};
    for (const dataFile of testDataFile) {
        const filePath = EnvLoader.getRelativeTetstDataFilePath(dataFile);
        localTestData[dataFile] = filePath ? JsonUtils.readTestcaseData(dataFile, testcaseName) : null;
    }
    const { envName, currentUser } = multiUserManager.getContext();
    let user;
    if (envName && currentUser) {
        user = loadUsers(envName, currentUser);
    }
    if (user) {
        localTestData.isEnhancedCustomer = user.enhancedCustomer ? "true" : "false";
        localTestData.username = user.userName;
        localTestData.password = user.userPassword;
    }

    const headerPage = new HeaderPage(page);
    await headerPage.navigateToOverview();
});



export async function interac_Create_Approve_Submit_Payment(page: Page, multiUserManager: MultiUserManager) {
    const testDataFile = localTestData["interacTestDataFile"];
    if (!testDataFile) {
        throw new Error("Test data file for 'interacTestDataFile' not found");
    }
    
    const { isEnhancedCustomer, username, password } = localTestData;

    let inputDataMap: Record<string, any> = { isEnhancedCustomer, username, password, ...testDataFile };
    console.log("Input data for Interac Create/Approve/Submit Payment:", inputDataMap);

    console.log(`Executing Interac Create/Approve/Submit Payment for user: ${username} in env: ${multiUserManager.getContext().envName}`);

    const recipientService = new RecipientService();
    // 1. create or fetch recipient based on testcase name and env
    await recipientService.createOrFetchRecipient(page, inputDataMap);

    // 2. search recipient by profileName and get recipient details
    

}