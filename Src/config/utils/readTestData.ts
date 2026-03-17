// src/config/utils/TestData/ReadTestDataFile.ts
import fs from "fs";

export class ReadTestDataFile {
  static readTestcase(jsonFilePath: string, testcaseId: string): any {
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`Testdata JSON file not found: ${jsonFilePath}`);
    }

    const root = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
    const testcases = root.testcases;

    if (!Array.isArray(testcases)) {
      throw new Error(`Invalid testdata format: 'testcases' should be an array in ${jsonFilePath}`);
    }

    const tc = testcases.find(
      (t: any) => t.testcase_id && t.testcase_id.toLowerCase() === testcaseId.toLowerCase()
    );

    if (!tc) {
      console.error("Available testcase_ids:", testcases.map((t: any) => t.testcase_id));
      throw new Error(`Testcase not found: ${testcaseId} in ${jsonFilePath}`);
    }

    return tc.testdata;
  }
}