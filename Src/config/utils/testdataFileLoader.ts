import { loadEnvironment } from "./envLoader";

export class TestDataFileLoader {
  static getFilePath(fileKey: string): string {
    const envName = process.env.ENV_NAME || "uat-green"; // Default to 'uat-green' if ENV_NAME is not set
    const envConfig = loadEnvironment(envName);

    const filePath = envConfig.testing.data[fileKey];

    if (!filePath) {
      throw new Error(
        `Testdata key '${fileKey}' not found in environment '${envName}'.`
      );
    }

    return filePath;
  }
}
