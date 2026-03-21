import { EnvLoader } from "@config/loaders/envLoader";
import { ReadTestDataFile } from "@config/utils/readTestData";
import  { test as base } from "@fixtures/loginFixture";
import { MultiUserManager } from "@fixtures/multiUserManager";
import { TestInfo } from "@playwright/test";
import { CreateRecipientService } from "service/CreateRecipient/CreateRecipientService";

const testDataFile = ["interacTestDataFile"];
export let localTestData: Record<string, any> = {};
let testcaseName: string = "";

base.beforeEach(async ({}, testInfo: TestInfo) => {
    testcaseName = testInfo.title;
    localTestData = {};
    for (const dataFile of testDataFile) {
        const filePath = EnvLoader.getRelativeTetstDataFilePath(dataFile);
        localTestData[dataFile] = filePath ? ReadTestDataFile.readTestcaseData(dataFile, testcaseName) : null;
    }
});



export async function interac_Create_Approve_Submit_Payment(multiUserManager: MultiUserManager) {
    const testDataFile = localTestData["interacTestDataFile"];
    if (!testDataFile) {
        throw new Error("Test data file for 'interacTestDataFile' not found");
    }

    const inputDataMap: Record<string, any> = { ...testDataFile };
    console.log("Input data for Interac Create/Approve/Submit Payment:", inputDataMap);

    const { envName, currentUser } = multiUserManager.getContext();
    console.log(`Executing Interac Create/Approve/Submit Payment for user: ${currentUser} in env: ${envName}`);

    const profileName = await CreateRecipientService.createOrFetchRecipient(
        inputDataMap,
        testcaseName,
        EnvLoader.getRecipientFilePath("existingRecipientFile")
    );

}