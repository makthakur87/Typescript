export function normalizeLanguage(lang: string): "en" | "en-US" | "fr" {

  const lower = lang.toLowerCase();

// Map various LANG environment variable formats to our supported language codes
const languageMap: Record<string, "en" | "en-US" | "fr"> = {
    "fr": "fr",
    "en-us": "en-US",
    "en": "en",
};

for (const [key, value] of Object.entries(languageMap)) {
    if (lower.startsWith(key)) return value;
}

  throw new Error(`Unsupported language: ${lang}`);
}