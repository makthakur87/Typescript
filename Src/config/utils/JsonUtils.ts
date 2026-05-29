// src/config/utils/TestData/ReadTestDataFile.ts
import { EnvLoader } from "@config/loaders/envLoader";
import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";

export class JsonUtils {
  /**
   * Reads test data for a specific testcase from a JSON file. The JSON file should have a structure like:
   *
   * @param fileKeyOrPath     fileKeyOrPath can be either a key defined in EnvLoader.testDataFilePaths or an absolute/relative path to the JSON file.
   * @param targetTestcase    the testcase_id to look for in the JSON file. The search is case-insensitive.
   * @param isPath            set to true if fileKeyOrPath is an actual file path, false if it's a key to look up in EnvLoader.testDataFilePaths.
   * @returns                 the testdata object corresponding to the targetTestcase.
   * @throws                  Error if the JSON file is missing, not found, has invalid format, or if the target testcase is not found.
   *
   * @author                 Mandeep Kumar
   */
  static readTestcaseData(fileKeyOrPath: string, targetTestcase: string, isPath = false): any {
    let jsonFilePath = isPath ? fileKeyOrPath : EnvLoader.testDataFilePaths[fileKeyOrPath];
    if (!jsonFilePath) {
      throw new Error(`Testdata JSON file is missing for key: ${fileKeyOrPath}`);
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

    const testcase = testcases.find((tc: any) => tc.testcase_id && tc.testcase_id.toLowerCase() === targetTestcase.toLowerCase());

    if (!testcase) {
      console.error(
        "Available testcase_ids:",
        testcases.map((tc: any) => tc.testcase_id),
      );
      throw new Error(`Testcase not found: ${targetTestcase} in ${jsonFilePath}`);
    }

    return testcase.testdata;
  }

  /**
   * Utility method to get the file path for a given key from EnvLoader.testDataFilePaths. Throws an error if the key is not found.
   *
   * @param fileKey     the key to look up in EnvLoader.testDataFilePaths.
   * @returns           the file path corresponding to the given key.
   * @throws            Error if the key is not found in EnvLoader.testDataFilePaths.
   *
   * @author           Mandeep Kumar
   */
  static getFilePath(fileKey: string): string {
    const filePath = EnvLoader.testDataFilePaths[fileKey];
    if (!filePath) {
      throw new Error(`Testdata file path not found for key: ${fileKey}`);
    }
    return filePath;
  }

  /**
   * Reads the recipient profile name for a given testcase and environment from a JSON file. The JSON file should have a structure like:
   *
   * @param targetTestcase      the testcase_id to look for in the JSON file. The search is case-insensitive.
   * @param recipientFileKey    the key to look up in EnvLoader.recipientFilePaths.
   * @param environment         the environment name to look for in the JSON file.
   * @returns                   the recipient profile name corresponding to the targetTestcase and environment, or null if not found.
   *
   * @author                   Mandeep Kumar
   */
  public static readRecipientName(targetTestcase: string, recipientFileKey: string, environment: string): string | null {
    const envKey = `profileName - ${environment.toUpperCase().trim()}`;
    const filePath = EnvLoader.getRecipientProfileFilePath(recipientFileKey);

    // 1. Ensure file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ testcases: [] }, null, 2));
      return null;
    }

    // 2. Read JSON
    const jsonContent = fs.readFileSync(filePath, "utf-8");
    const rootNode = jsonContent ? JSON.parse(jsonContent) : { testcases: [] };

    const testcases = rootNode.testcases || [];

    // 3. Find testcase
    for (const testcase of testcases) {
      if (testcase.testcase_id === targetTestcase) {
        const profileNames = testcase.profileNames as Record<string, string>;

        if (profileNames && profileNames[envKey]) {
          const value = profileNames[envKey].trim();
          return value !== "" ? value : null;
        }

        return null; // key missing or empty
      }
    }

    return null; // testcase not found
  }

  /**
   * Write profile names into a JSON file under a specific testcase.
   *
   * @param profileNameMap    key/value pairs to write
   * @param targetTestcase    testcase_Id to update or create
   * @param jsonFilePath      path to the JSON file
   * @throws                  Error if the JSON file cannot be read or written, or if the JSON format is invalid.
   *
   * @author                  Mandeep Kumar
   */
  public static writeRecipientNameIntoJsonFile(profileNameMap: Record<string, string>, targetTestcase: string, jsonFilePath: string): void {
    const filePath = path.resolve(jsonFilePath);
    let rootNode: any;

    // 1. Create file if it does not exist
    if (!fs.existsSync(filePath)) {
      rootNode = { testcases: [] };
      fs.writeFileSync(filePath, JSON.stringify(rootNode, null, 2), "utf-8");
    }

    // 2. Read file content
    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      rootNode = JSON.parse(fileContent);
    } catch (err) {
      throw new Error(`Failed to parse JSON file: ${err}`);
    }

    // 3. Ensure testcases array exists
    if (!Array.isArray(rootNode.testcases)) {
      rootNode.testcases = [];
    }

    // 4. Find or create testcase entry
    let findTestcase = rootNode.testcases.find(
      (tc: any) => tc.testcase_Id === targetTestcase
    );

    if (!findTestcase) {
      findTestcase = {
        testcase_Id: targetTestcase,
        profileNames: {}
      };
      rootNode.testcases.push(findTestcase);
    }

    // 5. Ensure profileNames exists
    if (!findTestcase.profileNames) {
      findTestcase.profileNames = {};
    }

    // 6. Write profileName(s)
    for (const [key, value] of Object.entries(profileNameMap)) {
      findTestcase.profileNames[key] = value;
    }

    // 7. Save file
    fs.writeFileSync(filePath, JSON.stringify(rootNode, null, 2), "utf-8");
}


  /**
   * Retrieves a string value from an object by key. If the key is missing or the value is not a string, it will cause the test to fail with an appropriate message.
   *
   * @param map   The object to retrieve the value from
   * @param key   The key whose value is to be retrieved
   * @returns     The string value associated with the key, or null if not found or not a string
   *
   * @author       Mandeep Kumar
   */
  public static getString(map: Record<string, any>, key: string): string | null {
    const value = map[key];

    if (value === undefined || value === null) {
      expect(false, `Key '${key}' is not present in the object`).toBeTruthy();
      return null;
    }

    if (typeof value === "string") {
      return value;
    }

    expect(false, `Value for key '${key}' is not a string`).toBeTruthy();
    return null;
  }

  /**
   * Fetch an integer value from a Record.
   *
   * @param map    data object
   * @param key    key to find
   * @returns      integer value if found, otherwise null
   * @throws       Test failure if key is missing or value cannot be converted to an integer
   *
   * @author       Mandeep Kumar
   */
  public static getInteger(map: Record<string, any>, key: string): number | null {
    const value = map[key];

    // Key missing
    if (value === undefined || value === null) {
      expect(false, `Key '${key}' is not present in the object`).toBeTruthy();
      return null;
    }

    // Case 1: already a number
    if (typeof value === "number") {
      return Math.trunc(value); // matches Java's intValue()
    }

    // Case 2: string that might be numeric
    if (typeof value === "string") {
      const parsed = Number(value);

      if (!Number.isNaN(parsed)) {
        return Math.trunc(parsed);
      }

      expect(false, `Value for key '${key}' cannot be converted to an integer`).toBeTruthy();
      return null;
    }

    // Case 3: unexpected type
    expect(false, `Value for key '${key}' is not a number or numeric string`).toBeTruthy();
    return null;
  }

  /**
   * Fetch a numeric value from a Record and convert it to the specified type (int, long, double, float). The method handles cases where the value is already a number or is a string that can be parsed as a number. If the key is missing or the value cannot be converted to a number, it will cause the test to fail with an appropriate message.
   *
   * @param map     data object
   * @param key     key to find
   * @param type    the desired numeric type to convert to ("int", "long", "double", "float")
   * @returns       the numeric value converted to the specified type if found and valid, otherwise null
   * @throws        Test failure if key is missing or value cannot be converted to a number
   *
   * @author        Mandeep Kumar
   */
  public static getNumberValue<T extends number>(map: Record<string, any>, key: string, type: "int" | "long" | "double" | "float"): T | null {
    const value = map[key];

    // Key missing
    if (value === undefined || value === null) {
      expect(false, `Key '${key}' is not present in the object`).toBeTruthy();
      return null;
    }

    // Case 1: already a number
    if (typeof value === "number") {
      return this.convertNumber(value, type) as T;
    }

    // Case 2: string that might be numeric
    if (typeof value === "string") {
      const parsed = Number(value);

      if (Number.isNaN(parsed)) {
        expect(false, `Value for key '${key}' cannot be converted to a number`).toBeTruthy();
        return null;
      }

      return this.convertNumber(parsed, type) as T;
    }

    // Case 3: unexpected type
    expect(false, `Value for key '${key}' is not a number or numeric string`).toBeTruthy();
    return null;
  }

  /**
   * Extracts all numeric characters from a string and concatenates them into a single string. If the input is null or undefined, it returns an empty string.
   *
   * @param value   the input string from which to extract numbers
   * @returns       a string containing only the numeric characters from the input, or an empty string if the input is null/undefined or contains no numbers
   *
   * @author        Mandeep Kumar
   */
  private static convertNumber(value: number, type: "int" | "long" | "double" | "float"): number {
    switch (type) {
      case "int":
        return Math.trunc(value);
      case "long":
        return Math.trunc(value); // JS has no 64‑bit long, so truncation matches Java behavior
      case "double":
        return value; // JS numbers are double‑precision floats
      case "float":
        return parseFloat(value.toFixed(7)); // simulate float precision
      default:
        throw new Error(`Conversion to type '${type}' is not supported`);
    }
  }

  /**
   * Retrieves a list (array) from a Record by key.
   *
   * Behavior:
   *  - Looks up the value for the given key
   *  - Ensures the key exists
   *  - Ensures the value is an array
   *  - Returns the array, otherwise fails the test
   *
   * Limitations:
   *  - Does NOT support nested paths (only top‑level keys)
   *
   * @param map   Root object to search
   * @param key   Key whose value should be an array
   * @returns     The array if found, otherwise null (after test failure)
   *
   * @author      Mandeep Kumar
   */
  public static getList(map: Record<string, any>, key: string): any[] | null {
    const value = map[key];

    // Case 1: key missing
    if (value === undefined || value === null) {
      expect(false, `Key '${key}' does not exist in the object`).toBeTruthy();
      return null;
    }

    // Case 2: value is an array
    if (Array.isArray(value)) {
      return value as any[];
    }

    // Case 3: value exists but is not a list
    expect(false, `Value associated with key '${key}' is not a list. Found: ${typeof value}`).toBeTruthy();

    return null;
  }

  /**
   * Retrieves a map (object) from a Record by key.
   *
   * Behavior:
   *  - Looks up the value for the given key
   *  - Ensures the key exists
   *  - Ensures the value is an object (and not an array)
   *  - Returns the object, otherwise fails the test
   *
   * Limitations:
   *  - Does NOT support nested paths (only top‑level keys)
   *
   * @param obj   Root object to search
   * @param key   Key whose value should be an object/map
   * @returns     The object if found, otherwise null (after test failure)
   *
   * @author      Mandeep Kumar
   */
  public static getMap(obj: Record<string, any>, key: string): Record<string, any> | null {
    const value = obj[key];

    // Case 1: key missing
    if (value === undefined || value === null) {
      expect(false, `Key '${key}' does not exist in the object`).toBeTruthy();
      return null;
    }

    // Case 2: value is an object (but not an array)
    if (typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, any>;
    }

    // Case 3: value exists but is not a map
    expect(false, `Value associated with key '${key}' is not a map. Found: ${Array.isArray(value) ? "Array" : typeof value}`).toBeTruthy();

    return null;
  }

  /**
   * Get a string value from a nested object/array using a dot‑notation key path.
   *
   * @param structure     the object or array to search through
   * @param keyPath       a dot‑notation string representing the path to the desired value (e.g., "user.address.street" or "users.0.name")
   * @returns             the string value found at the specified key path, or null if the path is invalid or the value is not a string
   * @throws              Test failure if the structure is null/undefined, if any key along the path is missing, if an expected array index is out of bounds, or if the final value is not a string
   *
   * @author              Mandeep Kumar
   */
  public static getStringValue(structure: any, keyPath: string): string | null {
     if (structure === null || structure === undefined || keyPath === null || keyPath === undefined || keyPath.trim() === "") {
      expect(false, `Structure or keyPath is null/empty: structure=${structure}, keyPath=${keyPath}`).toBeTruthy();
      return null;
    }

    keyPath = keyPath.replace(/\[(\d+)\]/g, ".$1");
    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      if (typeof current === "object" && !Array.isArray(current)) {
        // Object case
        current = current[key];
        if (current === undefined || current === null) {
          expect(false, `Key '${key}' not found in object`).toBeTruthy();
          return null;
        }
      } else if (Array.isArray(current)) {
        // Array case
        const index = Number(key);

        if (Number.isNaN(index)) {
          expect(false, `List index '${key}' is not a valid integer`).toBeTruthy();
          return null;
        }

        if (index < 0 || index >= current.length) {
          expect(false, `Index '${index}' out of bounds for list size ${current.length}`).toBeTruthy();
          return null;
        }

        current = current[index];
      } else {
        // Unexpected type
        expect(false, `Unexpected structure type while resolving key '${key}'`).toBeTruthy();
        return null;
      }
    }

    if (typeof current === "string") {
      return current;
    }

    expect(false, `Value at '${keyPath}' is not a string: ${current}`).toBeTruthy();
    return null;
  }

  /**
   * Enhanced version of getStringValue that includes more robust error handling and supports both object and array traversal. It validates inputs, checks for the existence of keys/indices at each step, and ensures the final value is a string. If any validation fails, it causes the test to fail with a descriptive message.
   * 
   * @param structure     the object or array to search through
   * @param keyPath       a dot‑notation string representing the path to the desired value (e.g., "user.address.street" or "users.0.name")
   * @returns             the string value found at the specified key path, or null if the path is invalid or the value is not a string
   * @throws              Test failure if the structure is null/undefined, if any key along the path is missing, if an expected array index is out of bounds, or if the final value is not a string
   * 
   * @author              Mandeep Kumar
   */
  public static getStringValueFromRecord(structure: any, keyPath: string | null | undefined): string | null {
    // Validate inputs
    if (structure === null || structure === undefined || keyPath === null || keyPath === undefined || keyPath.trim() === "") {
      expect(false, `Invalid input: structure=${structure}, keyPath='${keyPath}'`).toBeTruthy();
      return null;
    }

    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      // Case 1: current is a plain object
      if (typeof current === "object" && !Array.isArray(current)) {
        current = current[key];

        if (current === undefined || current === null) {
          expect(false, `Key '${key}' not found in object`).toBeTruthy();
          return null;
        }
      } else if (Array.isArray(current)) {
        // Case 2: current is an array
        const index = Number(key);

        if (Number.isNaN(index)) {
          expect(false, `Index '${key}' is not a valid integer`).toBeTruthy();
          return null;
        }

        if (index < 0 || index >= current.length) {
          expect(false, `Index '${index}' out of bounds for array of size ${current.length}`).toBeTruthy();
          return null;
        }

        current = current[index];
      } else {
        // Case 3: unexpected type
        expect(false, `Unexpected type '${typeof current}' while resolving key '${key}'`).toBeTruthy();
        return null;
      }
    }

    // Final value must be a string
    if (typeof current === "string") {
      return current;
    }

    expect(false, `Value at '${keyPath}' is not a string. Actual type: ${typeof current}`).toBeTruthy();
    return null;
  }

  /**
   * Retrieves a string value from a nested JSON-like structure using a dot‑notation key path.
   *
   * Supports:
   *  - Nested objects (e.g., "a.b.c")
   *  - Nested arrays using index notation (e.g., "a.b.0.c")
   *  - Mixed object + array traversal
   *
   * Behavior:
   *  - Traverses the structure step-by-step
   *  - Validates that each intermediate value is either an object or array
   *  - Validates array indexes and object keys
   *  - Ensures the final resolved value is a string
   *  - Throws descriptive errors when:
   *      • a key does not exist
   *      • an array index is invalid
   *      • an unexpected type is encountered
   *      • the final value is not a string
   *
   * @param structure Root object to search
   * @param keyPath   Dot-notation path to the desired string value
   * @returns         The string value if found, otherwise throws an error
   */
  public static getStringValueFromList(structure: any, keyPath: string): string | null {
    if (!structure || !keyPath || keyPath.trim() === "") {
      throw new Error(`Invalid input: structure=${structure}, keyPath='${keyPath}'`);
    }

    // Convert [0] → .0 so both notations work
    keyPath = keyPath.replace(/\[(\d+)\]/g, ".$1");

    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      if (Array.isArray(current)) {
        // Array case
        const index = Number(key);

        if (Number.isNaN(index)) {
          throw new Error(`Index '${key}' is not a valid integer`);
        }

        if (index < 0 || index >= current.length) {
          throw new Error(`Index '${index}' out of bounds for array size ${current.length}`);
        }

        current = current[index];
      } else if (typeof current === "object" && current !== null) {
        // Object case
        if (!(key in current)) {
          throw new Error(`Key '${key}' not found in object`);
        }

        current = current[key];
      } else {
        // Unexpected type
        throw new Error(`Unexpected type '${typeof current}' while resolving key '${key}'`);
      }

      if (current === undefined || current === null) {
        throw new Error(`Key or index '${key}' resolved to null/undefined`);
      }
    }

    // Final value must be a string
    if (typeof current === "string") {
      return current;
    }

    throw new Error(`Expected string at '${keyPath}', but found type '${typeof current}'`);
  }

  /**
   * Retrieves a string value from a nested JSON-like structure using a dot‑notation key path.
   *
   * Supports:
   *  - Nested arrays using index notation (e.g., "0.1.2" or "items[0].name")
   *  - Nested objects using dot notation (e.g., "a.b.c")
   *  - Mixed object + array traversal
   *
   * Behavior:
   *  - Traverses the structure step-by-step
   *  - Validates that each intermediate value is an object or array
   *  - Validates array indexes and object keys
   *  - Ensures the final resolved value is a string
   *  - Throws descriptive errors when:
   *      • a key does not exist
   *      • an array index is invalid
   *      • an unexpected type is encountered
   *      • the final value is not a string
   *
   * @param structure Root list or object to search
   * @param keyPath   Dot-notation path to the desired string value
   * @returns         The string value if found, otherwise throws an error
   */
  public static getStringValueFromListUsingList(structure: any, keyPath: string): string | null {
    if (!structure || !keyPath || keyPath.trim() === "") {
      throw new Error(`Invalid input: structure=${structure}, keyPath='${keyPath}'`);
    }

    // Convert [0] → .0 so both notations work
    keyPath = keyPath.replace(/\[(\d+)\]/g, ".$1");

    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      if (Array.isArray(current)) {
        // Array case
        const index = Number(key);

        if (Number.isNaN(index)) {
          throw new Error(`Key '${key}' is not a valid array index`);
        }

        if (index < 0 || index >= current.length) {
          throw new Error(`Index '${index}' out of bounds for list size ${current.length}`);
        }

        current = current[index];
      } else if (typeof current === "object" && current !== null) {
        // Object case
        if (!(key in current)) {
          throw new Error(`Key '${key}' not found in object`);
        }

        current = current[key];
      } else {
        // Unexpected type
        throw new Error(`Unexpected structure type '${typeof current}' at key '${key}'`);
      }

      if (current === undefined || current === null) {
        throw new Error(`Key or index '${key}' resolved to null/undefined`);
      }
    }

    // Final value must be a string
    if (typeof current === "string") {
      return current;
    }

    throw new Error(`Expected string at '${keyPath}', but found type '${typeof current}'`);
  }

  /**
   * Retrieves a nested map/object from a JSON-like structure using a dot‑notation key path.
   *
   * Supports:
   *  - Nested objects (e.g., "a.b.c")
   *  - Nested arrays using index notation (e.g., "a.b[0].c" or "a.b.0.c")
   *  - Mixed object + array traversal
   *
   * Behavior:
   *  - Traverses the structure step-by-step
   *  - Validates that each intermediate value is an object or array
   *  - Validates array indexes and object keys
   *  - Ensures the final resolved value is an object (map)
   *  - Throws descriptive errors when:
   *      • a key does not exist
   *      • an array index is invalid
   *      • an unexpected type is encountered
   *      • the final value is not an object/map
   *
   * @param structure Root object to search
   * @param keyPath   Dot-notation path to the desired map
   * @returns         The resolved map/object, or throws an error if invalid
   */
  public static getMapFromList(structure: any, keyPath: string): Record<string, any> {
    if (!structure || !keyPath || keyPath.trim() === "") {
      throw new Error(`map or keyPath is empty or null: map=${structure}, keyPath=${keyPath}`);
    }

    // Convert [0] → .0 so both notations work
    keyPath = keyPath.replace(/\[(\d+)\]/g, ".$1");

    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      if (Array.isArray(current)) {
        // Array case
        if (!/^\d+$/.test(key)) {
          throw new Error(`Expected numeric index for list but got '${key}'`);
        }

        const index = Number(key);

        if (index < 0 || index >= current.length) {
          throw new Error(`Index '${index}' out of bounds for list size ${current.length}`);
        }

        current = current[index];
      } else if (typeof current === "object" && current !== null) {
        // Object case
        if (!(key in current)) {
          throw new Error(`Path not found: '${key}'`);
        }

        current = current[key];
      } else {
        throw new Error(`Unexpected non-object encountered at '${key}'`);
      }

      if (current === undefined || current === null) {
        throw new Error(`Key or index '${key}' resolved to null/undefined`);
      }
    }

    // Final value must be an object/map
    if (typeof current === "object" && !Array.isArray(current) && current !== null) {
      return current as Record<string, any>;
    }

    throw new Error(`The target at '${keyPath}' is not a map/object`);
  }

  /**
   * Retrieves a nested list/array from a JSON-like structure using a dot‑notation key path.
   *
   * Supports:
   *  - Nested objects (e.g., "a.b.c")
   *  - Nested arrays using index notation (e.g., "a.b[0].c" or "a.b.0.c")
   *  - Mixed object + array traversal
   *
   * Behavior:
   *  - Traverses the structure step-by-step
   *  - Validates that each intermediate value is an object or array
   *  - Validates array indexes and object keys
   *  - Ensures the final resolved value is an array
   *  - Throws descriptive errors when:
   *      • a key does not exist
   *      • an array index is invalid
   *      • an unexpected type is encountered
   *      • the final value is not a list/array
   *
   * @param structure Root object to search
   * @param keyPath   Dot-notation path to the desired list
   * @returns         The resolved list/array, or throws an error if invalid
   */
  public static getListFromMap(structure: any, keyPath: string): any[] {
    if (!structure || !keyPath || keyPath.trim() === "") {
      throw new Error(`map or keyPath is empty or null: map=${structure}, keyPath=${keyPath}`);
    }

    // Convert [0] → .0 so both notations work
    keyPath = keyPath.replace(/\[(\d+)\]/g, ".$1");

    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      if (Array.isArray(current)) {
        
      } else if (typeof current === "object" && current !== null) {
        // Object case
        if (!(key in current)) {
          throw new Error(`Path not found: '${key}'`);
        }

        current = current[key];
      } else {
        throw new Error(`Unexpected non-object encountered at '${key}'`);
      }

      if (current === undefined || current === null) {
        throw new Error(`Key or index '${key}' resolved to null/undefined`);
      }
    }

    // Final value must be an array
    if (Array.isArray(current)) {
      return current;
    }

    throw new Error(`The target at '${keyPath}' is not a list/array`);
  }

  /**
   * Retrieves a nested map/object from a JSON-like structure using a dot‑notation key path.
   *
   * Supports:
   *  - Nested objects (e.g., "a.b.c")
   *  - Nested arrays using index notation (e.g., "a.b[0].c" or "a.b.0.c")
   *  - Mixed object + array traversal
   *
   * Behavior:
   *  - Traverses the structure step-by-step
   *  - Validates that each intermediate value is an object or array
   *  - Validates array indexes and object keys
   *  - Ensures the final resolved value is an object/map
   *  - Throws descriptive errors when:
   *      • a key does not exist
   *      • an array index is invalid
   *      • an unexpected type is encountered
   *      • the final value is not an object/map
   *
   * @param structure Root object to search
   * @param keyPath   Dot-notation path to the desired map
   * @returns         The resolved map/object, or throws an error if invalid
   */
  public static getMapFromMap(structure: any, keyPath: string): Record<string, any> {
    if (!structure || !keyPath || keyPath.trim() === "") {
      throw new Error(`map or keyPath is empty or null: map=${structure}, keyPath=${keyPath}`);
    }

    // Convert [0] → .0 so both notations work
    keyPath = keyPath.replace(/\[(\d+)\]/g, ".$1");

    const keys = keyPath.split(".");
    let current: any = structure;

    for (const key of keys) {
      if (Array.isArray(current)) {
        // Array case
        if (!/^\d+$/.test(key)) {
          throw new Error(`Expected numeric index for list but got '${key}'`);
        }

        const index = Number(key);

        if (index < 0 || index >= current.length) {
          throw new Error(`Index '${index}' out of bounds for list size ${current.length}`);
        }

        current = current[index];
      } else if (typeof current === "object" && current !== null) {
        // Object case
        if (!(key in current)) {
          throw new Error(`Path not found: '${key}'`);
        }

        current = current[key];
      } else {
        throw new Error(`Unexpected non-object encountered at '${key}'`);
      }

      if (current === undefined || current === null) {
        throw new Error(`Key or index '${key}' resolved to null/undefined`);
      }
    }

    // Final value must be an object/map
    if (typeof current === "object" && !Array.isArray(current) && current !== null) {
      return current as Record<string, any>;
    }

    throw new Error(`The target at '${keyPath}' is not a map/object`);
  }

  /**
   * Get a list (array) from a nested object using dot-notation path.
   *
   * Example:
   *   getListFromList(inputDataMap, "testdata.createRecipient.recipients")
   *
   * Supports:
   *   - nested objects
   *   - nested lists
   *   - numeric indexes (e.g., "recipients.0.bankDetails")
   *
   * Throws:
   *   - if path not found
   *   - if index out of bounds
   *   - if final value is not a list
   */
  public static getListFromList(map: any, keyPath: string): any[] {
    if (!map || !keyPath || keyPath.trim() === "") {
      throw new Error(`map or keyPath is null/empty: map=${map}, keyPath=${keyPath}`);
    }

    const keys = keyPath.split(".");
    let current: any = map;

    for (const key of keys) {
      if (Array.isArray(current)) {
        // Expect numeric index
        if (!/^\d+$/.test(key)) {
          throw new Error(`Expected numeric index for list but got '${key}'`);
        }

        const index = Number(key);

        if (index < 0 || index >= current.length) {
          throw new Error(`Index '${index}' out of bounds for list size ${current.length}`);
        }

        current = current[index];
      } else if (typeof current === "object" && current !== null) {
        // Object case
        if (!(key in current)) {
          throw new Error(`Path not found: '${key}'`);
        }

        current = current[key];
      } else {
        throw new Error(`Unexpected non-object encountered at '${key}'`);
      }
    }

    if (!Array.isArray(current)) {
      throw new Error(`Target at '${keyPath}' is not a list`);
    }

    return current;
  }
}
