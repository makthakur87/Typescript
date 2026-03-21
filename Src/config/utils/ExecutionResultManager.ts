// src/utils/ExecutionResultManager.ts

import fs from "fs/promises";
import path from "path";
import { EnvLoader } from "@config/loaders/envLoader";

export class ExecutionResultManager {
  static async saveResult(
    testcaseId: string,
    data: any,
    testInfo: any
  ) {
    const baseDir = path.resolve("src/results/raw");
    await fs.mkdir(baseDir, { recursive: true });

    const workerId = testInfo.workerIndex;
    const projectName = testInfo.project.name; // EN / FR
    const lang = testInfo.project.metadata.LANG; // en / fr

    // const env = EnvLoader.getCurrentEnv() || process.env.ENV || "qa";
    const env = process.env.ENV || "qa";

    // ✅ Unique file (NO conflict)
    const fileName = `results_${env}_${lang}_${projectName}_worker_${workerId}.json`;

    const filePath = path.join(baseDir, fileName);

    let existing: Record<string, any> = {};

    try {
      const content = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(content);
    } catch {
      existing = {};
    }

    existing[testcaseId] = {
      ...data,
      env,
      lang,
      project: projectName,
      workerId,
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
  }
}

/**
 * test("TC001_CreatePayment", async ({}, testInfo) => {
  const referenceNumber = `REF_${Date.now()}`;

  console.log("Payment created:", referenceNumber);

  const testcaseId = testInfo.title.split("_")[0];

  await ExecutionResultManager.saveResult(
    testcaseId,
    {
      referenceNumber,
      status: "CREATED",
    },
    testInfo
  );
});
 */