import fs from "fs";
import { expect } from "@playwright/test";
import { RecipientStore } from "../config/utils/recipient";
import { PaymentConstants } from "@config/common/paymentConstant";

export class RecipientService {

  // Memory map (similar to ThreadLocal map in Java)
  private static recipientMap: Map<string, string> = new Map();

  static createOrFetchRecipient(
    inputDataMap: Record<string, any>,
    testName: string,
    jsonFilePath: string
  ) {

    // 1️⃣ Create unique key for recipient
    const uniqueRecipientKey =
      this.createUniqueRecipientString(inputDataMap);

    // 2️⃣ Check JSON file
    const existingRecipient =
      this.getRecipientFromJson(testName, jsonFilePath);

    // -----------------------------------
    // CASE 1: Recipient already in JSON
    // -----------------------------------
    if (existingRecipient) {

      console.log("Recipient already exists:", existingRecipient);

      const uniqueNumber =
        this.getNumbersFromString(existingRecipient);

      this.updateUniqueDataInMap(inputDataMap, uniqueNumber);

      this.addRecipientToMap(
        uniqueRecipientKey,
        existingRecipient
      );

      inputDataMap.profileName = existingRecipient;

      expect(inputDataMap.profileName).toBeTruthy();

      return inputDataMap;
    }

    // -----------------------------------
    // CASE 2: Check in runtime map
    // -----------------------------------
    const runtimeRecipient =
      this.getRecipientFromMap(uniqueRecipientKey);

    if (runtimeRecipient) {

      console.log("Recipient already created in this run:", runtimeRecipient);

      const uniqueNumber =
        this.getNumbersFromString(runtimeRecipient);

      this.updateUniqueDataInMap(inputDataMap, uniqueNumber);

      inputDataMap.profileName = runtimeRecipient;

      return inputDataMap;
    }

    // -----------------------------------
    // CASE 3: Create new recipient
    // -----------------------------------
    const randomUniqueNumber = this.getRandomNumber();

    console.log("Creating new recipient...");

    this.updateUniqueDataInMap(
      inputDataMap,
      randomUniqueNumber
    );

    const profileName = inputDataMap.profileName;

    expect(profileName).toBeTruthy();

    // Simulate recipient creation
    this.createRecipient(inputDataMap);

    this.addRecipientToMap(uniqueRecipientKey, profileName);

    console.log("New recipient created:", profileName);

    // Write to JSON
    const profileNameMap: Record<string, string> = {
      profileName: profileName
    };

    RecipientStore.writeRecipientNameIntoJsonFile(
      profileNameMap,
      testName,
      jsonFilePath
    );

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