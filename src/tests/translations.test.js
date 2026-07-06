import { describe, it, expect } from "vitest";
import { TRANSLATIONS } from "../data/translation";

describe("Multilingual Translation Dictionary Tests", () => {
  it("should contain matching translation keys for English, Spanish, and French", () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    const esKeys = Object.keys(TRANSLATIONS.es);
    const frKeys = Object.keys(TRANSLATIONS.fr);

    // Assert that Spanish has the exact same keys as English
    expect(esKeys.length).toBe(enKeys.length);
    enKeys.forEach(key => {
      expect(TRANSLATIONS.es).toHaveProperty(key);
      expect(TRANSLATIONS.es[key]).toBeDefined();
      expect(TRANSLATIONS.es[key].length).toBeGreaterThan(0);
    });

    // Assert that French has the exact same keys as English
    expect(frKeys.length).toBe(enKeys.length);
    enKeys.forEach(key => {
      expect(TRANSLATIONS.fr).toHaveProperty(key);
      expect(TRANSLATIONS.fr[key]).toBeDefined();
      expect(TRANSLATIONS.fr[key].length).toBeGreaterThan(0);
    });
  });

  it("should load localized values depending on requested language code", () => {
    expect(TRANSLATIONS.en.appName).toContain("FIFA");
    expect(TRANSLATIONS.es.appName).toContain("Asistente");
    expect(TRANSLATIONS.fr.appName).toContain("Assistant");
  });
});
