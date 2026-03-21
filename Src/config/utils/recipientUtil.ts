import fs from "fs";
import { EnvLoader } from "@config/loaders/envLoader";

export class RecipientUtil {
    /**
     * Read recipient profile name for a testcase
     * Returns null if not found
     */
    public static readRecipientName(
        testcaseId: string,
        recipientFileKey: string,
        envName?: string
    ): string | null {
        const environment = (envName || process.env.ENV_NAME || "UAT").toUpperCase();
        const envKey = `profileName - ${environment}`;
        const filePath = EnvLoader.getRecipientFilePath(recipientFileKey);

        // Ensure file exists and has schema
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ testcases: [{ testcase_id: "", profileNames: {} }] }, null, 2));
        }

        const jsonContent = fs.readFileSync(filePath, "utf-8");
        const rootNode = jsonContent ? JSON.parse(jsonContent) : { testcases: [] };
        rootNode.testcases = rootNode.testcases || [];

        const testcaseNode = rootNode.testcases.find((tc: any) => tc.testcase_id === testcaseId);
        if (!testcaseNode) return null;

        const profileName = testcaseNode.profileNames?.[envKey];
        return profileName && profileName.trim() !== "" ? profileName : null;
    }

    /**
     * Write/update a recipient profile for a testcase
     * Creates file/schema if needed
     */
    public static writeRecipientName(
        testcaseId: string,
        profileName: string,
        recipientFileKey: string,
        envName?: string
    ) {
        const environment = (envName || process.env.ENV_NAME || "UAT").toUpperCase();
        const envKey = `profileName - ${environment}`;
        const filePath = EnvLoader.getRecipientFilePath(recipientFileKey);

        // Ensure file exists with schema
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ testcases: [{ testcase_id: "", profileNames: {} }] }, null, 2));
        }

        const rootNode = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        rootNode.testcases = rootNode.testcases || [];

        let testcaseNode = rootNode.testcases.find((tc: any) => tc.testcase_id === testcaseId);
        if (!testcaseNode) {
            testcaseNode = { testcase_id: testcaseId, profileNames: {} };
            rootNode.testcases.push(testcaseNode);
        }

        testcaseNode.profileNames[envKey] = profileName;

        fs.writeFileSync(filePath, JSON.stringify(rootNode, null, 2));
    }
}