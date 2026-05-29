// src/config/utils/ReadPropertiesFile.ts
import { EnvLoader } from "@config/loaders/envLoader";
import fs from "fs";
import * as fsPromises from "fs/promises";

export class PropertyUtils_Old {
  private static properties: Record<string, string> = {};

  static readPropertyFile(fileKeyOrPath: string, isPath = false): Record<string, string> {
    const filePath = isPath ? fileKeyOrPath : EnvLoader.propertyFilePaths[fileKeyOrPath];
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`Properties file is not found: ${filePath}`);
    }

    const resolvedPath = filePath;
    const content = fs.readFileSync(resolvedPath, "utf-8");
    const result: Record<string, string> = {};

    content.split(/\r?\n/).forEach((line) => {
      line = line.trim();
      if (!line || line.startsWith("#")) return; // Skip empty lines and comments

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) return; // Skip lines without '='

      const key = line.substring(0, separatorIndex).trim();
      const value = line.substring(separatorIndex + 1).trim();
      result[key] = value;
    });
    return result;
  }

  /**
   * Load properties from a file and store them in the static properties object.
   * 
   * @param filePath The path to the properties file.
   * @returns void
   * @throws Error if the file cannot be read.
   * 
   * @author Mandeep Kumar
   */
  static async loadProperties(filePath: string): Promise<void> {
    try {
      const content = await fsPromises.readFile(filePath, "utf-8");
      const lines = content.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();

        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith("#")) continue;

        const [key, ...rest] = trimmed.split("=");
        const value = rest.join("=").trim();
        this.properties[key.trim()] = value;
      }

      console.log(`Properties file loaded: ${filePath}`);
    } catch (err) {
      console.error(`Unable to load properties file: ${filePath}`, err);
    }
  }

  /**
   * Get the value of a property by its key.
   * 
   * @param key The key of the property.
   * @returns The value of the property, or undefined if not found.
   * @throws Error if the properties have not been loaded.
   * 
   * @author Mandeep Kumar
   * @deprecated This method is deprecated. Please use getProperties() to access all properties instead.
   */
  static getPropertyValue(key: string): string | undefined {
    const value = this.properties[key];
    console.log(`key: ${key} | value: ${value}`);
    return value;
  }

  /**
   * Get all loaded properties.
   * 
   * @returns An object containing all loaded properties.
   * @throws Error if the properties have not been loaded.
   * 
   * @author Mandeep Kumar
   */
  static getProperties(): Record<string, string> {
    return this.properties;
  }
}
