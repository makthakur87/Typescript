import fs from "fs";

export class RecipientProfileService {

    // Ensures file exists and has valid JSON
    private static loadJson(filePath: string) {
        // Create file if missing
        if (!fs.existsSync(filePath)) {
            const initial = { testcases: [] };
            fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
            return initial;
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

    static getProfileName(filePath: string, testcaseId: string, env: string): string | null {
        const json = this.loadJson(filePath);

        const tc = json.testcases.find((t: any) => t.testcase_id === testcaseId);
        if (!tc) return null;

        return tc.profileNames?.[`profileName - ${env}`] || null;
    }

    static saveProfileName(filePath: string, testcaseId: string, env: string, profileName: string) {
        const json = this.loadJson(filePath);

        let tc = json.testcases.find((t: any) => t.testcase_id === testcaseId);

        if (!tc) {
            tc = {
                testcase_id: testcaseId,
                profileNames: {}
            };
            json.testcases.push(tc);
        }

        if (!tc.profileNames) {
            tc.profileNames = {};
        }

        tc.profileNames[`profileName - ${env}`] = profileName;

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    }
}