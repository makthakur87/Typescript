import { setupGlobalSessions } from "./globalSetup";
import { FullConfig } from "@playwright/test";

export default async (config: FullConfig) => {
  const sessions = await setupGlobalSessions();

  for (const lang in sessions) {
    const project = config.projects.find(p => p.metadata.LANG === lang);
    const storageFile = `./storage/${project?.name || lang}.json`;

    await sessions[lang].page.context().storageState({ path: storageFile });
    console.log(`Saved storageState for ${lang.toUpperCase()} at ${storageFile}`);
  }
};