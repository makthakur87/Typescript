// src/config/utils/ReadPropertiesFile.ts
import fs from "fs";

export class ReadPropertiesFile {
  static read(filePath: string): Record<string, string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Properties file not found: ${filePath}`);
    }

    const lines = fs.readFileSync(filePath, "utf-8")
      .split(/\r?\n/)
      .filter(line => line && !line.startsWith("#"));

    const props: Record<string, string> = {};
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      props[key.trim()] = rest.join("=").trim();
    }

    return props;
  }
}