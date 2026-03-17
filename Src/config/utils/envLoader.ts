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
    data: Record<string, Record<string, string>>;         // module -> fileKey -> path
    propertyFiles: Record<string, Record<string, string>>; // module -> fileKey -> path
  };
}

export class EnvLoader {
  private static envConfig: EnvConfig;
  public static testDataPaths: Record<string, string> = {};
  public static propertyPaths: Record<string, string> = {};

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

  // Test data files
    const dataModules = this.envConfig.testing.data || {};
    for (const moduleName in dataModules) {
      const files = dataModules[moduleName];
      for (const fileKey in files) {
        const fileTemplate = files[fileKey];
        if (typeof fileTemplate !== "string") continue;
        const resolved = path.resolve(fileTemplate.replace("${env}", envName));
        if (!fs.existsSync(resolved)) throw new Error(`Testdata file not found: ${resolved}`);
        this.testDataPaths[`${moduleName}.${fileKey}`] = resolved;
      }
    }

    // Properties files
    const propModules = this.envConfig.testing.propertyFiles || {};
    for (const moduleName in propModules) {
      const files = propModules[moduleName];
      for (const fileKey in files) {
        const fileTemplate = files[fileKey];
        if (typeof fileTemplate !== "string") continue;
        const resolved = path.resolve(fileTemplate.replace("${language}", language));
        if (!fs.existsSync(resolved)) throw new Error(`Properties file not found: ${resolved}`);
        this.propertyPaths[`${moduleName}.${fileKey}`] = resolved;
      }
    }

    return config;
  }

  private static resolvePaths(envName: string, language: string) {
    this.testDataPaths = {};
    this.propertyPaths = {};

    // Test data files
    const dataModules = this.envConfig.testing.data || {};
    for (const moduleName in dataModules) {
      const files = dataModules[moduleName];
      for (const fileKey in files) {
        const fileTemplate = files[fileKey];
        if (typeof fileTemplate !== "string") continue;
        const resolved = path.resolve(fileTemplate.replace("${ENVVAR}", envName));
        if (!fs.existsSync(resolved)) throw new Error(`Testdata file not found: ${resolved}`);
        this.testDataPaths[`${moduleName}.${fileKey}`] = resolved;
      }
    }

    // Properties files
    const propModules = this.envConfig.testing.propertyFiles || {};
    for (const moduleName in propModules) {
      const files = propModules[moduleName];
      for (const fileKey in files) {
        const fileTemplate = files[fileKey];
        if (typeof fileTemplate !== "string") continue;
        const resolved = path.resolve(fileTemplate.replace("${language}", language));
        if (!fs.existsSync(resolved)) throw new Error(`Properties file not found: ${resolved}`);
        this.propertyPaths[`${moduleName}.${fileKey}`] = resolved;
      }
    }
  }
}