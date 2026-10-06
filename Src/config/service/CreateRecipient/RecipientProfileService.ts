import fs from "fs";

export class RecipientProfileService {
    private static loadJson(filePath: string) {
        // Create file if missing
        if (!fs.existsSync(filePath)) {
            const initial = { testcases: [] };
            fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
        }

        // Read file safely
        const content = fs.readFileSync(filePath, "utf-8").trim();

        // Empty file → initialize
        if (!content) {
            return { testcases: [] };
        }

        // Try parsing JSON
        try {
            return JSON.parse(content);
        } catch {
            // Corrupted JSON → reset
            return { testcases: [] };
        }
    }

    static getProfileName(filePath: string, targetTestcase: string, env: string): string | null {
        const json = this.loadJson(filePath);
        const testcase = json.testcases.find((tc: any) => tc.testcase_id === targetTestcase);
        
        if (!testcase) return null;

        return testcase.profileNames?.[`profileName - ${env}`] || null;
    }

    static saveProfileName(filePath: string, targetTestcase: string, env: string, profileName: string) {
        try {
            const json = this.loadJson(filePath);
            let testcase = json.testcases.find((tc: any) => tc.testcase_id === targetTestcase);

            if (!testcase) {
            testcase = { testcase_id: targetTestcase, profileNames: {}};
            json.testcases.push(testcase);
        }

        if (!testcase.profileNames) {
            testcase.profileNames = {};
        }

        testcase.profileNames[`profileName - ${env}`] = profileName;

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        } catch (error) {
            console.error(`Failed to save profile name for testcase '${targetTestcase}' in environment '${env}':`, error);
            throw new Error(`Failed to save profile name for testcase '${targetTestcase}' in environment '${env}': ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}