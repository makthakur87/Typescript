// src/config/utils/envLoader.ts
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
    database: string;
  };

  mq: {
    queueManager: string;
    channel: string;
    host: string;
    port: number;
    queues: { request: string; response: string };
  };

  api: {
    baseUrl: string;
    auth: {
      clientIdEnvVar: string;
      clientSecretEnvVar: string;
      tokenEndpoint: string;
    };
  };

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
}

const cache: Record<string, EnvConfig> = {};

export function loadEnvironment(profile: string): EnvConfig {
  const trimmedProfile = profile.trim();
  if (cache[trimmedProfile]) return cache[trimmedProfile];

  const configDir = path.resolve(process.cwd(), "src", "config");
  const baseFile = path.join(configDir, "application.yaml");
  const profileFile = path.join(configDir, `application-${trimmedProfile}.yaml`);

  let config: EnvConfig | null = null;

  if (fs.existsSync(profileFile)) {
    const content = fs.readFileSync(profileFile, "utf-8");
    config = parseYaml(content) as EnvConfig;
    config.name = trimmedProfile;
  } else if (fs.existsSync(baseFile)) {
    const content = fs.readFileSync(baseFile, "utf-8");
    const allConfigs = parseYaml(content) as any;

    if (allConfigs.profiles && allConfigs.profiles[trimmedProfile]) {
      config = {
        ...allConfigs.default,
        ...allConfigs.profiles[trimmedProfile],
        name: trimmedProfile,
      };
    } else {
      throw new Error(
        `Profile '${trimmedProfile}' not found in base config: ${baseFile}`
      );
    }
  } else {
    throw new Error(
      `No configuration file found for profile '${trimmedProfile}'. Expected either: ${profileFile} or ${baseFile}`
    );
  }

  if (!config) {
    throw new Error(`Failed to load configuration for profile '${trimmedProfile}'`);
  }

  cache[trimmedProfile] = config;
  return config;
}