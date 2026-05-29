import { EnvLoader } from "@config/loaders/envLoader";
import * as fs from "fs/promises";

export class PropertyUtils {
  private static properties: Record<string, string> = {};
  private static loadedFiles = new Set<string>();

  /**
   * Universal loader:
   * - Works with YAML keys
   * - Works with direct paths
   * - Stores in static memory (global)
   * - Returns parsed content (for fixtures)
   */
  static async load(fileKeyOrPath: string, isPath = false): Promise<Record<string, string>> {
    // Resolve path from YAML or direct path
    const filePath = isPath ? fileKeyOrPath : EnvLoader.propertyFilePaths[fileKeyOrPath];

    if (!filePath) {
      throw new Error(`Property file path not found for key: ${fileKeyOrPath}`);
    }

    const shouldStore = !this.loadedFiles.has(filePath);
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = this.parseProperties(content);

    // Store in static memory only once
    if (shouldStore) {
      this.properties = { ...this.properties, ...parsed };
      this.loadedFiles.add(filePath);
    }

    // Always return parsed content for per-test usage
    return parsed;
  }

  private static parseProperties(content: string): Record<string, string> {
    const result: Record<string, string> = {};
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const idx = trimmed.indexOf("=");
      if (idx === -1) return;

      const key = trimmed.substring(0, idx).trim();
      const value = trimmed.substring(idx + 1).trim();

      result[key] = value;
    });

    return result;
  }

  static getPropertyValue(key: string): string | undefined {
    return this.properties[key];
  }

  static getProperties(): Record<string, string> {
    return this.properties;
  }
}
