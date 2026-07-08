import { describe, it, expect } from "vitest";
import { TRANSIT_OPTIONS } from "../data/mockData";
import { getAISmartTransitRecommendation } from "../utils/transitHelper";

describe("Transit Options and Carbon Logic Tests", () => {
  it("should calculate correct carbon emissions for varying distances", () => {
    const testDistance = 25; // 25 km
    
    TRANSIT_OPTIONS.forEach(opt => {
      const expectedCarbon = opt.carbon * testDistance;
      // Walking is zero carbon
      if (opt.id === "walking") {
        expect(expectedCarbon).toBe(0);
      } else {
        expect(expectedCarbon).toBeGreaterThan(0);
      }
    });
  });

  it("should verify transit options have correct structures", () => {
    TRANSIT_OPTIONS.forEach(opt => {
      expect(opt.id).toBeDefined();
      expect(opt.name).toBeDefined();
      expect(typeof opt.carbon).toBe("number");
      expect(typeof opt.cost).toBe("string");
      expect(typeof opt.etaOffset).toBe("number");
    });
  });

  it("should validate the carbon offset savings formula (Rideshare vs Metro)", () => {
    const distance = 15; // 15 km
    const metro = TRANSIT_OPTIONS.find(o => o.id === "metro");
    const rideshare = TRANSIT_OPTIONS.find(o => o.id === "rideshare");

    expect(metro).toBeDefined();
    expect(rideshare).toBeDefined();

    const expectedOffsetFactor = rideshare.carbon - metro.carbon; // 154 - 12 = 142
    expect(expectedOffsetFactor).toBe(142);

    const calculatedOffset = Math.round(expectedOffsetFactor * distance);
    expect(calculatedOffset).toBe(142 * distance);
  });

  it("should output correct AI smart transit recommendations based on context", () => {
    // 1. Short walk recommendation on clear day
    const rec1 = getAISmartTransitRecommendation(2, "pre-match", { condition: "Clear Sky" }, "en");
    expect(rec1.modeName).toBe("Pedestrian Egress / Walk");
    expect(rec1.reason).toContain("walking offsets emissions");

    // 2. Short shuttle recommendation on rainy day
    const rec2 = getAISmartTransitRecommendation(2.5, "pre-match", { condition: "Light Rain" }, "en");
    expect(rec2.modeName).toBe("Rapid Shuttles");
    expect(rec2.reason).toContain("rapid shuttle loops");

    // 3. Post-match gridlock rail link recommendation
    const rec3 = getAISmartTransitRecommendation(10, "post-match", { condition: "Overcast" }, "en");
    expect(rec3.modeName).toBe("Electric Rail Link");
    expect(rec3.reason).toContain("Rideshare zones are gridlocked");

    // 4. Standard commute recommendation
    const rec4 = getAISmartTransitRecommendation(15, "pre-match", { condition: "Clear Sky" }, "en");
    expect(rec4.modeName).toBe("Express Metro / Shuttles");

    // 5. Spanish translations
    const recEs = getAISmartTransitRecommendation(2, "pre-match", { condition: "Clear" }, "es");
    expect(recEs.modeName).toBe("Caminar / Peatonal");
  });
});
