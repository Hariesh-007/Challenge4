import { describe, it, expect } from "vitest";
import { buildSystemPrompt, queryAIAssistant, sanitizeInput } from "../utils/aiEngine";

describe("GenAI Context Engine and Sanitization Tests", () => {
  it("should sanitize and truncate prompt inputs correctly", () => {
    const maliciousPrompt = "Hello <script>alert('hack')</script> world!";
    const sanitized = sanitizeInput(maliciousPrompt);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("</script>");
    expect(sanitized).toBe("Hello scriptalert('hack')/script world!");

    // Check truncation
    const longPrompt = "a".repeat(1200);
    const truncated = sanitizeInput(longPrompt);
    expect(truncated.length).toBe(800);
  });

  it("should compile correct role system prompt instructions for all roles", () => {
    const stadium = { name: "BC Place", city: "Vancouver" };
    const access = { wheelchair: true, sensory: false };

    const fan = buildSystemPrompt("fan", stadium, "pre-match", access, "en");
    const volunteer = buildSystemPrompt("volunteer", stadium, "pre-match", access, "es");
    const staff = buildSystemPrompt("staff", stadium, "mid-match", access, "fr");
    const organizer = buildSystemPrompt("organizer", stadium, "post-match", access, "en");

    expect(fan).toContain("FIFA World Cup Fan Assistant");
    expect(volunteer).toContain("FIFA Volunteer Support Intelligence");
    expect(staff).toContain("Stadium Operations Decision Engine");
    expect(organizer).toContain("Executive Incident Commander AI Analyst");
  });

  it("should return localized heuristic responses for multiple categories in French and Spanish", async () => {
    // Water in Spanish
    const responseWaterEs = await queryAIAssistant({
      prompt: "donde hay agua?",
      role: "fan",
      stadium: { id: "azteca", name: "Estadio Azteca" },
      timePhase: "pre-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "es"
    });
    expect(responseWaterEs).toContain("puntos de hidratación");

    // Transit in French
    const responseTransitFr = await queryAIAssistant({
      prompt: "comment prendre le métro?",
      role: "fan",
      stadium: { id: "bcplace", name: "BC Place" },
      timePhase: "post-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "fr"
    });
    expect(responseTransitFr).toContain("métro");

    // Volunteer checklists
    const responseVolunteer = await queryAIAssistant({
      prompt: "show checklist duties",
      role: "volunteer",
      stadium: { id: "metlife", name: "MetLife Stadium" },
      timePhase: "pre-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "en"
    });
    expect(responseVolunteer).toContain("Volunteer Protocol");
  });
});
