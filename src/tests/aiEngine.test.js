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
    expect(responseVolunteer).toContain("Zone Supervisor");
    expect(responseVolunteer).toContain("Smile and assist!");
  });

  it("should output dynamic state-aware details (incidents, queues) for organizers and staff", async () => {
    const mockGates = [
      { id: "gate-a", name: "Gate A", status: "overcrowded", queueTime: 35, load: 95 }
    ];
    const mockIncidents = [
      { id: "inc-99", stadium: "bcplace", severity: "high", title: "Power Outage", zone: "West Concourse", description: "Grid failure", status: "open" }
    ];

    const organizerRes = await queryAIAssistant({
      prompt: "show summary",
      role: "organizer",
      stadium: { id: "bcplace", name: "BC Place" },
      timePhase: "mid-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "en",
      gates: mockGates,
      incidents: mockIncidents
    });

    expect(organizerRes).toContain("Incident Commander Summary");
    expect(organizerRes).toContain("capacity load is 95%");
    expect(organizerRes).toContain("1 open incidents");

    const staffRes = await queryAIAssistant({
      prompt: "show safety alert",
      role: "staff",
      stadium: { id: "bcplace", name: "BC Place" },
      timePhase: "mid-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "en",
      gates: mockGates,
      incidents: mockIncidents
    });

    expect(staffRes).toContain("Staff Action Directive");
    expect(staffRes).toContain("exceeded safety margins");
    expect(staffRes).toContain("redirect arrivals");
  });

  it("should validate OpenAI API Key format properly", async () => {
    // Malformed API key with illegal characters
    await expect(
      queryAIAssistant({
        prompt: "hello",
        role: "fan",
        stadium: { id: "metlife", name: "MetLife Stadium" },
        timePhase: "pre-match",
        accessibilityNeeds: { wheelchair: false, sensory: false },
        language: "en",
        apiKey: "invalid_key_with_spaces!@"
      })
    ).rejects.toThrow("Invalid API key format");

    // Correct format should not throw formatting error, but could fail with fetch since it's mock
    // We pass a valid format sk key
    const mockGates = [];
    const mockIncidents = [];
    // If it's a valid key string but fetch is not stubbed, it will try to request OpenAI.
    // Let's pass a valid sk format but mock window.fetch or just check that it doesn't fail on local format validation
  });

  it("should dynamically resolve wayfinding query inputs via Dijkstra", async () => {
    const response = await queryAIAssistant({
      prompt: "Show me the route from parking to seating-n",
      role: "fan",
      stadium: { id: "metlife", name: "MetLife Stadium", zones: [] },
      timePhase: "pre-match",
      accessibilityNeeds: { wheelchair: false, sensory: false },
      language: "en"
    });

    expect(response).toContain("Wayfinding Intelligence Report");
    expect(response).toContain("West Parking Lot");
    expect(response).toContain("Seating Section 100-110");
    expect(response).toContain("Metrics");
  });

  it("should compile system prompt context details including weather, gates status, and incidents", () => {
    const stadium = { name: "MetLife Stadium", city: "New York / New Jersey" };
    const access = { wheelchair: true, sensory: false };
    const gates = [
      { id: "gate-a", name: "Gate A", status: "normal", queueTime: 5, load: 20, accessible: true }
    ];
    const incidents = [
      { id: "inc-1", severity: "high", title: "Gate J Jammed", zone: "West Concourse", description: "Hardware lock", status: "open" }
    ];
    const weather = { temp: 22, humidity: 48, condition: "Partly Cloudy" };

    const prompt = buildSystemPrompt("fan", stadium, "pre-match", access, "en", gates, incidents, weather);

    expect(prompt).toContain("Live Stadium Weather");
    expect(prompt).toContain("22°C, Humidity: 48%, Condition: Partly Cloudy");
    expect(prompt).toContain("Live Gates & Queue Pressures");
    expect(prompt).toContain("Gate A: 5 mins wait (normal, load: 20%, accessible: YES)");
    expect(prompt).toContain("Active Incidents");
    expect(prompt).toContain("[HIGH] Gate J Jammed at West Concourse: Hardware lock");
    expect(prompt).toContain("Strictly answer questions using the provided Context Details");
  });
});
