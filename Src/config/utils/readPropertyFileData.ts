// src/config/utils/ReadPropertiesFile.ts
import { EnvLoader } from "@config/loaders/envLoader";
import fs from "fs";

export class ReadPropertiesFile {
  static readPropertyFile(fileKeyOrPath: string, isPath = false): Record<string, string> {
    const filePath = isPath ? fileKeyOrPath : EnvLoader.propertyFilePaths[fileKeyOrPath];
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`Properties file is not found: ${filePath}`);
    }

    const resolvedPath = filePath;
    const content = fs.readFileSync(resolvedPath, "utf-8");
    const result: Record<string, string> = {};
    
    content.split(/\r?\n/).forEach(line => {
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
}
  