// src/config/utils/envLoader.ts
// src/config/utils/envLoader.ts
import fs from "fs";
import path from "path";
import { parse as parseYaml } from "yaml";

export interface EnvConfig {
  name: string;
  web: { baseUrl: string };
  db2: { host: string; port: number; username: string; password: string; database: string };
  mq: { queueManager: string; channel: string; host: string; port: number; queues: { request: string; response: string } };
  api: { baseUrl: string; auth: { clientIdEnvVar: string; clientSecretEnvVar: string; tokenEndpoint: string } };
  jira?: {
    baseUrl: string;
    tokenEnvVar: string;
    token?: string;
    project: string;
    createTestExecution: boolean;
    jiraStatusUpdateFlag: boolean;
    testPlanKey: string;
    testcaseKey: string;
    testcaseKey1?: string;
    fixVersion: string;
  };
  testing: {
    testDataFiles: Record<string, string>;         // flat map now
    propertyFiles: Record<string, string>;         // flat map now
    recipientFiles: Record<string, string>;        // flat map for static recipient files
  };
}

export class EnvLoader {
  private static envConfig: EnvConfig;
  public static testDataFilePaths: Record<string, string> = {};
  public static propertyFilePaths: Record<string, string> = {};
  public static recipientFilePaths: Record<string, string> = {};

  public static loadEnvironment(envName: string, language: string = "en"): EnvConfig {
    const configDir = path.resolve(process.cwd(), "src", "config", "resources");
    const profileFile = path.join(configDir, `application-${envName}.yaml`);
    const baseFile = path.join(configDir, "application.yaml");

    let config: EnvConfig | null = null;

    if (fs.existsSync(profileFile)) {
      const content = fs.readFileSync(profileFile, "utf-8");
      config = parseYaml(content) as EnvConfig;
      config.name = envName;
    } else if (fs.existsSync(baseFile)) {
      const content = fs.readFileSync(baseFile, "utf-8");
      const allConfigs = parseYaml(content) as any;
      if (allConfigs.profiles && allConfigs.profiles[envName]) {
        config = { ...allConfigs.default, ...allConfigs.profiles[envName], name: envName };
      } else {
        throw new Error(`Profile '${envName}' not found in base config`);
      }
    } else {
      throw new Error(`No configuration file found for profile '${envName}'`);
    }

    if (!config) throw new Error(`Failed to load configuration for profile '${envName}'`);

    this.envConfig = config;

    // --- Test data files (flat map) ---
    const dataFiles = this.envConfig.testing.testDataFiles || {};
    for (const key in dataFiles) {
      const fileTemplate = dataFiles[key];
      if (typeof fileTemplate !== "string") continue;
      const resolved = path.resolve(fileTemplate.replace("${env}", envName));
      if (!fs.existsSync(resolved)) throw new Error(`Testdata file not found: ${resolved}`);
      this.testDataFilePaths[key] = resolved;
    }

    // --- Property files (flat map) ---
    const propFiles = this.envConfig.testing.propertyFiles || {};
    for (const key in propFiles) {
      const fileTemplate = propFiles[key];
      if (typeof fileTemplate !== "string") continue;
      const resolved = path.resolve(fileTemplate.replace("${language}", language));
      if (!fs.existsSync(resolved)) throw new Error(`Property file not found: ${resolved}`);
      this.propertyFilePaths[key] = resolved;
    }

    // --- Recipient files (static, no replacement) ---
    const recipientFiles = this.envConfig.testing.recipientFiles || {};
    for (const key in recipientFiles) {
      const filePath = recipientFiles[key];
      if (typeof filePath !== "string") continue;
      const resolved = path.resolve(filePath); // static
      if (!fs.existsSync(resolved)) throw new Error(`Recipient file not found: ${resolved}`);
      this.recipientFilePaths[key] = resolved;
    }

    return config;
  }

  // --- Convenience getters ---
  public static getTestDataFilePath(key: string): string {
    return this.testDataFilePaths[key];
  }

  public static getPropertyFilePath(key: string): string {
    return this.propertyFilePaths[key];
  }

  public static getRecipientFilePath(key: string): string {
    return this.recipientFilePaths[key];
  }

  public static getRelativeTetstDataFilePath(key: string): string {
    // const absolutePath = this.getTestDataFilePath(key);
    // return path.relative(process.cwd(), absolutePath);
    return this.getRelativePath(this.getTestDataFilePath(key));
  }

  private static getRelativePath(absolutePath: string): string {
    const projectRoot = path.resolve(process.cwd());
    let relativePath = path.relative(projectRoot, absolutePath);

    // normalize to forward slashes for cross-platform consistency
    relativePath = relativePath.replace(/\\/g, "/");

    // ensure path starts with "./" for relative imports
    const parts = relativePath.split("/");
    const srcIndex = parts.indexOf("src");

    if (srcIndex >= 0) {
      relativePath = parts.slice(srcIndex).join("/");
    }
    return relativePath;
  }
  
  private static resolvePaths(envName: string, language: string) {
    this.testDataFilePaths = {};
    this.propertyFilePaths = {};
    this.recipientFilePaths = {};

    // --- Test data files (flat map) ---
    const dataFiles = this.envConfig.testing.testDataFiles || {};
    for (const key in dataFiles) {
      const fileTemplate = dataFiles[key];
      if (typeof fileTemplate !== "string") continue;
      const resolved = path.resolve(fileTemplate.replace("${env}", envName));
      if (!fs.existsSync(resolved)) throw new Error(`Testdata file not found: ${resolved}`);
      this.testDataFilePaths[key] = resolved;
    }

    // --- Property files (flat map) ---
    const propFiles = this.envConfig.testing.propertyFiles || {};
    for (const key in propFiles) {
      const fileTemplate = propFiles[key];
      if (typeof fileTemplate !== "string") continue;
      const resolved = path.resolve(fileTemplate.replace("${language}", language));
      if (!fs.existsSync(resolved)) throw new Error(`Property file not found: ${resolved}`);
      this.propertyFilePaths[key] = resolved;
    }

    // --- Recipient files (static, no replacement) ---
    const recipientFiles = this.envConfig.testing.recipientFiles || {};
    for (const key in recipientFiles) {
      const filePath = recipientFiles[key];
      if (typeof filePath !== "string") continue;
      const resolved = path.resolve(filePath); // static
      if (!fs.existsSync(resolved)) throw new Error(`Recipient file not found: ${resolved}`);
      this.recipientFilePaths[key] = resolved;
    } 
  }
}