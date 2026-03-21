import { RecipientUtil } from "@config/utils/recipientUtil";
import { EnvLoader } from "@config/loaders/envLoader";

export class RecipientService {
  /**
   * Create or fetch recipient for a testcase
   * Fully generic: only inputDataMap is required
   */
  public static createOrFetchRecipient(inputDataMap: Record<string, any>): Record<string, any> {
    const testcaseId = inputDataMap.testcaseName || inputDataMap.testcase_id;
    if (!testcaseId) throw new Error("testcaseName or testcase_id is required in inputDataMap");

    const recipientFileKey = inputDataMap.recipientFileKey || "interacRecipientProfile"; // default module key
    const envName = inputDataMap.envName || process.env.ENV_NAME;

    // 1️⃣ Check if profile already exists
    let profileName = RecipientUtil.readRecipientName(testcaseId, recipientFileKey, envName);

    if (profileName) {
      console.log(`✅ Reusing existing recipient for ${testcaseId}: ${profileName}`);
      inputDataMap.profileName = profileName;
      return inputDataMap;
    }

    // 2️⃣ Create new profile name
    const profileNameFromTestData = inputDataMap?.createRecipient?.profileInformation?.profileName;
    if (!profileNameFromTestData) throw new Error("Profile name missing in inputDataMap.createRecipient.profileInformation");

    profileName = `${profileNameFromTestData}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    console.log(`🆕 Creating new recipient for ${testcaseId}: ${profileName}`);

    // TODO: call UI/API to actually create recipient here

    // 3️⃣ Write to recipient JSON
    RecipientUtil.writeRecipientName(testcaseId, profileName, recipientFileKey, envName);

    // 4️⃣ Update inputDataMap
    inputDataMap.profileName = profileName;

    return inputDataMap;
  }

  // -----------------------------------
  // Unique recipient key (Java stream equivalent)
  // -----------------------------------

  static createUniqueRecipientString(
    inputDataMap: Record<string, any>
  ) {

    return Object.values(inputDataMap)
      .map(v => this.convertToString(v))
      .join(",");
  }

  static convertToString(value: any): string {

    if (Array.isArray(value)) {
      return value.join(",");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  // -----------------------------------
  // Update profile name
  // -----------------------------------

  static updateUniqueDataInMap(
    inputDataMap: Record<string, any>,
    uniqueNumber: string
  ) {

    let profileName =
      inputDataMap?.createRecipient?.profileInformation?.profileName;

    profileName = this.appendUniqueNumber(
      profileName,
      uniqueNumber,
      PaymentConstants.PROFILE_NAME_MAX_LENGTH
    );

    inputDataMap.profileName = profileName;

    expect(profileName).toBeTruthy();

    return inputDataMap;
  }

  static appendUniqueNumber(
    name: string,
    uniqueNumber: string,
    maxLength: number
  ) {

    if (!name) return name;

    if (name.length >= maxLength) {

      name =
        name.substring(0, maxLength - uniqueNumber.length) +
        uniqueNumber;

    } else {

      name = name + uniqueNumber;

      if (name.length > maxLength) {
        name = name.substring(0, maxLength);
      }
    }

    return name;
  }

  // -----------------------------------
  // Map operations
  // -----------------------------------

  static addRecipientToMap(
    uniqueKey: string,
    recipientName: string
  ) {
    this.recipientMap.set(uniqueKey, recipientName);
  }

  static getRecipientFromMap(uniqueKey: string) {
    return this.recipientMap.get(uniqueKey) || null;
  }

  // -----------------------------------
  // JSON reader
  // -----------------------------------

  static getRecipientFromJson(
    testName: string,
    jsonFilePath: string
  ) {

    if (!fs.existsSync(jsonFilePath)) return null;

    const root = JSON.parse(
      fs.readFileSync(jsonFilePath, "utf-8")
    );

    const testcase = root.testcases?.find(
      (tc: any) => tc.testcase_id === testName
    );

    if (!testcase) return null;

    return testcase.profileNames?.profileName || null;
  }

  // -----------------------------------
  // Utility functions
  // -----------------------------------

  static getNumbersFromString(value: string): string {

    const numbers = value.match(/\d+/g);

    return numbers ? numbers.join("") : "";
  }

  static getRandomNumber(): string {

    return Math.floor(Math.random() * 100000).toString();
  }

  // -----------------------------------
  // Placeholder for UI/API recipient creation
  // -----------------------------------

  static createRecipient(inputData: any) {

    console.log("Creating recipient in system:", inputData.profileName);

    expect(inputData.profileName).toBeTruthy();
  }
}