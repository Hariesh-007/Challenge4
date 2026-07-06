import { describe, it, expect } from "vitest";
import { buildSystemPrompt, queryAIAssistant } from "../utils/aiEngine";

describe("GenAI Context Engine Tests", () => {
  it("should compile correct role system prompt instructions", () => {
    const fanPrompt = buildSystemPrompt(
      "fan", 
      { name: "MetLife Stadium", city: "New York" }, 
      "pre-match", 
      { wheelchair: false, sensory: false }, 
      "en"
    );

    const staffPrompt = buildSystemPrompt(
      "staff", 
      { name: "MetLife Stadium", city: "New York" }, 
      "pre-match", 
      { wheelchair: false, sensory: false }, 
      "en"
    );

    expect(fanPrompt).toContain("FIFA World Cup Fan Assistant");
    expect(fanPrompt).toContain("MetLife Stadium");
    
    expect(staffPrompt).toContain("Stadium Operations Decision Engine");
    expect(staffPrompt).not.toContain("warm fluff");
  });

  it("should parse keywords and return localized mock replies in local engine mode", async () => {
    const response = await queryAIAssistant({
      prompt: "Where is the nearest water?",
      role: "fan",
      stadium: { id: "metlife", name: "MetLife Stadium" },
      timePhase: "pre-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "en"
    });

    expect(response).toContain("Hydration points");

    const responseEs = await queryAIAssistant({
      prompt: "¿Dónde puedo conseguir agua?",
      role: "fan",
      stadium: { id: "metlife", name: "MetLife Stadium" },
      timePhase: "pre-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "es"
    });

    expect(responseEs).toContain("puntos de hidratación");
  });
});
