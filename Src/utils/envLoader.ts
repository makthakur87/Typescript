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
        porject: string;
        createTestExecution: boolean;
        jiraStatusUpdateFlag: boolean;
        testPlanKey: string;
        testcaseKey: string;
        testcaseKey1?: string;
        fixVersion: string;
    };
}
  
// Cache for loaded environments.
const cache: Record<string, EnvConfig> = {};

/*
load environment configuration from YAML file with spring boot-style profile support
Priority order:
application-{profile}.yaml > application-uat.yaml
fallback to application.yaml if profile-specific overrides are not found

1. Load the base configuration from `env.yaml`.
2. If an environment name is provided (e.g., `development`, `staging`, `production`), 
    load the corresponding profile configuration from `env-{envName}.yaml` and merge it with the base configuration.
3. The profile-specific configuration will override any overlapping settings from the base configuration.

- The YAML file should be structured with top-level keys representing environment names (e.g., development, staging, production).
- Each environment key should contain the corresponding configuration settings.
- The function will load the specified environment's configuration and return it as an EnvConfig object.

@param profile - The name of the environment profile to load (e.g., 'development', 'staging', 'production').
@return The configuration object for the specified environment profile.
*/

export function loadEnvironment(profile: string): EnvConfig {
    if (cache[profile]) {
        return cache[profile];
    }

    // Load base configuration
    const configDir = path.resolve(process.cwd(), 'src', 'config');
    const baseFile = path.join(configDir, 'application.yaml');
    const profileFile = path.join(configDir, `application-${profile}.yaml`);

    let config: EnvConfig | null = null;

    // Try to load profile-specific configuration first
    if (fs.existsSync(profileFile)) {
        const profileContent = fs.readFileSync(profileFile, 'utf-8');
        config = parseYaml(profileContent) as EnvConfig;
        config.name = profile; // Set the environment name in the config
    } else if (fs.existsSync(baseFile)) {
        // Fallback to base configuration if profile-specific file is not found
        const baseContent = fs.readFileSync(baseFile, 'utf-8');
        const allConfigs = parseYaml(baseContent) as any;       
        
        // check if the base config has a section for the profile and merge it
        if (allConfigs.profiles && allConfigs.profiles[profile]) {
            config = { ...allConfigs.default, ...allConfigs.profiles[profile], name: profile };
        } else {
            throw new Error(`Profile '${profile}' not found in ${baseFile} configuration.`);
        }
    } else {
        throw new Error(`No configuration file found for profile '${profile}'. Expected ${profileFile} or ${baseFile}.`);
    }

    // Additional validation can be added here for other required fields (e.g., db2, mq, api, jira)
    if (!config) {
        throw new Error(`Failed to load configuration for profile '${profile}'.`);
    }

    // Validate that the loaded configuration has the required structure
    if (!config.web || !config.web.baseUrl) {
        throw new Error(`Invalid configuration for profile '${profile}': Missing 'web.baseUrl'`);
    }

    // Cache the loaded configuration for future use
    cache[profile] = config;
    return config;
}






