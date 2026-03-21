// src/utils/ResultMerger.ts

import fs from "fs/promises";
import path from "path";

export class ResultMerger {
  static async mergeResults() {
    const rawDir = path.resolve("src/results/raw");
    const finalDir = path.resolve("src/results/final");

    await fs.mkdir(finalDir, { recursive: true });

    const files = await fs.readdir(rawDir);

    let final: Record<string, any> = {};

    for (const file of files) {
      const content = await fs.readFile(
        path.join(rawDir, file),
        "utf-8"
      );

      const json = JSON.parse(content);

      for (const testcaseId of Object.keys(json)) {
        const entry = json[testcaseId];

        // ✅ Unique key (TC + ENV + LANG)
        const finalKey = `${testcaseId}_${entry.env}_${entry.lang}`;

        final[finalKey] = entry;
      }
    }

    const finalPath = path.join(finalDir, "final-results.json");

    await fs.writeFile(finalPath, JSON.stringify(final, null, 2));

    console.log("✅ Final results generated at:", finalPath);
  }
}