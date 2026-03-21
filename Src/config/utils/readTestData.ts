// src/config/utils/TestData/ReadTestDataFile.ts
import { EnvLoader } from "@config/loaders/envLoader";
import fs from "fs";
import path from "path";
import { json } from "stream/consumers";

export class ReadTestDataFile {
  static readTestcaseData(fileKeyOrPath: string, targetTestcase: string, isPath = false): any {
    let jsonFilePath = isPath ? fileKeyOrPath : EnvLoader.testDataFilePaths[fileKeyOrPath];
    if (!jsonFilePath) {
      throw new Error(`Testdata JSON file is missig for key: ${fileKeyOrPath}`);
    }

     if (!path.isAbsolute(jsonFilePath)) {
      jsonFilePath = path.resolve(process.cwd(), jsonFilePath);
    }

     if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`Testdata JSON file is not found: ${jsonFilePath}`);
    }

    const content = fs.readFileSync(jsonFilePath, "utf-8");
    const root = JSON.parse(content);
    const testcases = root.testcases;

    if (!Array.isArray(testcases)) {
      throw new Error(`Invalid testdata format: 'testcases' should be an array in ${jsonFilePath}`);
    }

    const testcase = testcases.find(
      (tc: any) => tc.testcase_id && tc.testcase_id.toLowerCase() === targetTestcase.toLowerCase()
    );

    if (!testcase) {
      console.error("Available testcase_ids:", testcases.map((tc: any) => tc.testcase_id));
      throw new Error(`Testcase not found: ${targetTestcase} in ${jsonFilePath}`);
    }

    return testcase.testdata;
  }

  static getFilePath(fileKey: string): string {
    const filePath = EnvLoader.testDataFilePaths[fileKey];
    if (!filePath) {
      throw new Error(`Testdata file path not found for key: ${fileKey}`);
    }
    return filePath;
  }
}