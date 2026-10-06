import fs from "fs";
import path from "path";
import { parse as parseYaml } from "yaml";

export interface EnvConfig {
  name: string;
  web: { baseUrl: string };
  db2: { 
    host: string; 
    port: number; 
    username: string; 
    password: string; 
    database: string 
  };
  mq: { 
    queueManager: string; 
    channel: string; 
    host: string; 
    port: number; 
    queues: { request: string; response: string } 
  };
  api: { 
    baseUrl: string; 
    auth: { clientIdEnvVar: string; clientSecretEnvVar: string; tokenEndpoint: string } 
  };
  jira?: {
    baseUrl: string;
    tokenEnvVar: string;
    token?: string;
    project: string;
    createTestExecution: boolean;
    jiraStatusUpdateFlag: boolean;
    testPlanKey: string;
    testExecKey: string;
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

// const cache: Record<string, EnvConfig> = {}; // optional caching mechanism for loaded configs

export class EnvLoader {
  private static envConfig: EnvConfig;
  public static testDataFilePaths: Record<string, string> = {};
  public static propertyFilePaths: Record<string, string> = {};
  public static recipientFilePaths: Record<string, string> = {};

  /**
   * loads environment configuration from YAML files with spring boot-style profile support
   * Priority:
   * 1. application-{profile}.yaml (specific profile e.g., application-uat-green.yaml)
   * 2. Fallback to application.yaml with profiles section (e.g., application.yaml with profiles: { uat-green: {...} })
   * 3. Throws error if neither is found or if the profile is not defined in application.yaml
   * 
   * @param envName environment profile name (e.g. "uat-green"). Default is "uat-green" if not provided. It can also be set via ENV_NAME environment variable.
   * @param language the language code for property files (e.g. "en"), default is "en"
   * @returns EnvConfig object containing the loaded configuration  
   * 
   */
  public static loadEnvironment(envName: string, language: string = "en"): EnvConfig {
    const configDir = path.resolve(process.cwd(), "src", "config", "resources");
    const profileFile = path.join(configDir, `application-${envName}.yaml`);
    const baseFile = path.join(configDir, "application.yaml");

    let config: EnvConfig | null = null;

    // try profile-specific file first, then fallback to base file with profiles section
    if (fs.existsSync(profileFile)) {
      const content = fs.readFileSync(profileFile, "utf-8");
      config = parseYaml(content) as EnvConfig;
      config.name = envName;
    } else if (fs.existsSync(baseFile)) {
      // fallback to base file with profiles section
      const content = fs.readFileSync(baseFile, "utf-8");
      const allConfigs = parseYaml(content) as any;

      // check if it has a profiles section and the requested profile exists
      if (allConfigs.profiles && allConfigs.profiles[envName]) {
        config = { 
          ...allConfigs.default, 
          ...allConfigs.profiles[envName], 
          name: envName 
        };
      } else {
        throw new Error(`Profile '${envName}' not found in base config: ${baseFile}`);
      }
    } else {
      throw new Error(`No configuration file found for profile '${envName}'. Expected either ${profileFile} or ${baseFile} to exist.`);
    }

    if (!config) {
      throw new Error(`Failed to load configuration for profile '${envName}'`);
    }

    this.envConfig = config;

    // resolve testdata files path based on the loaded configuration and environment
    const dataFiles = this.envConfig.testing.testDataFiles || {};
    for (const fileKey in dataFiles) {
      if (!dataFiles) continue;
      const fileTemplate = dataFiles[fileKey];

      if (typeof fileTemplate !== "string") {
        continue; // skip if not a string
      }
      const resolvedPath = fileTemplate.replace("${ENV}", envName);
      const absolutePath = path.resolve(process.cwd(), resolvedPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Testdata file is not found: ${absolutePath}`);
      }
      this.testDataFilePaths[fileKey] = absolutePath;
    }

    // resolve property files path based on the loaded configuration and language
    const propFiles = this.envConfig.testing.propertyFiles || {};
    for (const fileKey in propFiles) {
      const fileTemplate = propFiles[fileKey];
      if (!fileTemplate) continue;
      if (typeof fileTemplate !== "string") {
        continue; // skip if not a string
      }
      const resolvedPath = fileTemplate.replace("${LANGUAGE}", language);
      const absolutePath = path.resolve(process.cwd(), resolvedPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Property file is not found: ${absolutePath}`);
      }
      this.propertyFilePaths[fileKey] = absolutePath;
    }

    // resolve recipient files path based on the loaded configuration (static, no replacement)
    const recipientFiles = this.envConfig.testing.recipientFiles || {};
    for (const fileKey in recipientFiles) {
      const filePath = recipientFiles[fileKey];
      if (typeof filePath !== "string") {
        continue; // skip if not a string
      }
      const absolutePath = path.resolve(filePath); // static

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Recipient file is not found: ${absolutePath}`);
      }
      this.recipientFilePaths[fileKey] = absolutePath;
    }

    return config;
  }

  // getters for test data file paths
  public static getTestDataFilePath(key: string): string {
    return this.testDataFilePaths[key];
  }

  // getters for property file paths
  public static getPropertyFilePath(key: string): string {
    return this.propertyFilePaths[key];
  }

  // getters for recipient file paths
  public static getRecipientProfileFilePath(key: string): string {
    return this.recipientFilePaths[key];
  }

  // getters for relative paths for test data files
  public static getRelativeTetstDataFilePath(key: string): string {
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
  
  // This method resolves the paths for test data files, property files, and recipient files based on the provided environment name and language. 
  // It populates the static properties testDataFilePaths, propertyFilePaths, and recipientFilePaths with the resolved absolute paths.
  private static resolvePaths(envName: string, language: string) {
    this.testDataFilePaths = {};
    this.propertyFilePaths = {};
    this.recipientFilePaths = {};

   // resolve testdata files path based on the loaded configuration and environment
    const dataFiles = this.envConfig.testing.testDataFiles || {};
    for (const fileKey in dataFiles) {
      if (!dataFiles) continue;
      const fileTemplate = dataFiles[fileKey];

      if (typeof fileTemplate !== "string") {
        continue; // skip if not a string
      }
      const resolvedPath = fileTemplate.replace("${ENV}", envName);
      const absolutePath = path.resolve(process.cwd(), resolvedPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Testdata file is not found: ${absolutePath}`);
      }
      this.testDataFilePaths[fileKey] = absolutePath;
    }

    // resolve property files path based on the loaded configuration and language
    const propFiles = this.envConfig.testing.propertyFiles || {};
    for (const fileKey in propFiles) {
      const fileTemplate = propFiles[fileKey];
      if (!fileTemplate) continue;
      if (typeof fileTemplate !== "string") {
        continue; // skip if not a string
      }
      const resolvedPath = fileTemplate.replace("${LANGUAGE}", language);
      const absolutePath = path.resolve(process.cwd(), resolvedPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Property file is not found: ${absolutePath}`);
      }
      this.propertyFilePaths[fileKey] = absolutePath;
    }

    // resolve recipient files path based on the loaded configuration (static, no replacement)
    const recipientFiles = this.envConfig.testing.recipientFiles || {};
    for (const fileKey in recipientFiles) {
      const filePath = recipientFiles[fileKey];
      if (typeof filePath !== "string") {
        continue; // skip if not a string
      }
      const absolutePath = path.resolve(filePath); // static

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Recipient file is not found: ${absolutePath}`);
      }
      this.recipientFilePaths[fileKey] = absolutePath;
    }
  }
}