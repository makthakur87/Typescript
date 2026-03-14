import fs from "fs";

export class RecipientStore {

  static writeRecipientNameIntoJsonFile(
    profileNameMap: Record<string, string>,
    targetTestcase: string,
    jsonFilePath: string
  ): void {

    try {

      let root: any = { testcases: [] };

      // 1️⃣ Read file if exists
      if (fs.existsSync(jsonFilePath)) {
        const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
        root = JSON.parse(fileContent);
      }

      // 2️⃣ Ensure testcases array
      if (!root.testcases) {
        root.testcases = [];
      }

      // 3️⃣ Find testcase
      let findTestcase = root.testcases.find(
        (tc: any) => tc.testcase_id === targetTestcase
      );

      // 4️⃣ Create testcase if missing
      if (!findTestcase) {
        findTestcase = {
          testcase_id: targetTestcase,
          profileNames: {}
        };
        root.testcases.push(findTestcase);
      }

      // 5️⃣ Ensure profileNames exists
      if (!findTestcase.profileNames) {
        findTestcase.profileNames = {};
      }

      // 6️⃣ Update profile names
      for (const key in profileNameMap) {
        findTestcase.profileNames[key] = profileNameMap[key];
      }

      // 7️⃣ Write JSON back
      fs.writeFileSync(
        jsonFilePath,
        JSON.stringify(root, null, 2)
      );

    } catch (error) {

      console.error(
        `Error updating recipient JSON file: ${jsonFilePath}`,
        error
      );

      throw error;
    }
  }
}