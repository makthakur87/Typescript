import fs from 'fs';
import path from 'path';
// npm install yaml
import { parse as parseYaml } from 'yaml';

export interface EnvConfig {
    name: string;
    web: {baseUrl: string};

    db2: {host: string; port: number; username: string; password: string; database: string};

    mq: { queueManager: string; channel:string; host: string; port: number; 
        queues: {request: string; response: string}; 
    };

    api: { baseUrl: string; 
        auth: { clientIdEnvVar: string; clientSecretEnvVar: string; tokenEndpoint: string };
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
  profile = profile.trim();
  if (cache[profile]) return cache[profile];

  const configDir = path.resolve(process.cwd(), "src/config");
  const file = path.join(configDir, `application-${profile}.yaml`);

  if (!fs.existsSync(file)) {
    throw new Error(`Environment file not found: ${file}`);
  }

  const content = fs.readFileSync(file, "utf-8");
  const config = parseYaml(content) as EnvConfig;

  config.name = profile;
  cache[profile] = config;

  return config;
}
