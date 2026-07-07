import { describe, it, expect } from "vitest";
import { STADIUMS, TRANSIT_OPTIONS, SUSTAINABILITY_GAME, INITIAL_INCIDENTS } from "../data/mockData";

describe("Mock Data Schema Integrity Tests", () => {
  it("should verify that all stadiums have a valid definition", () => {
    const keys = Object.keys(STADIUMS);
    expect(keys).toContain("metlife");
    expect(keys).toContain("azteca");
    expect(keys).toContain("bcplace");

    keys.forEach(k => {
      const s = STADIUMS[k];
      expect(s.id).toBe(k);
      expect(s.name).toBeDefined();
      expect(s.city).toBeDefined();
      expect(s.country).toBeDefined();
      expect(s.capacity).toBeGreaterThan(30000);
      expect(Array.isArray(s.gates)).toBe(true);
      expect(Array.isArray(s.zones)).toBe(true);
      expect(Array.isArray(s.amenities)).toBe(true);
      expect(s.sustainability).toBeDefined();
      expect(Array.isArray(s.sustainability.tips)).toBe(true);
    });
  });

  it("should verify gates and accessible options have correct fields", () => {
    Object.values(STADIUMS).forEach(s => {
      s.gates.forEach(g => {
        expect(g.id).toBeDefined();
        expect(g.name).toBeDefined();
        expect(["normal", "congested", "overcrowded"]).toContain(g.status);
        expect(g.queueTime).toBeGreaterThanOrEqual(0);
        expect(g.load).toBeGreaterThanOrEqual(0);
        expect(typeof g.accessible).toBe("boolean");
      });
    });
  });

  it("should check transit options metrics are correct", () => {
    expect(TRANSIT_OPTIONS.length).toBeGreaterThanOrEqual(3);
    TRANSIT_OPTIONS.forEach(opt => {
      expect(opt.id).toBeDefined();
      expect(opt.name).toBeDefined();
      expect(typeof opt.carbon).toBe("number");
      expect(typeof opt.cost).toBe("string");
      expect(typeof opt.etaOffset).toBe("number");
      expect(opt.accessibility).toBeDefined();
    });
  });

  it("should verify sustainability sorting game data matches allowed bins", () => {
    expect(SUSTAINABILITY_GAME.length).toBeGreaterThan(5);
    SUSTAINABILITY_GAME.forEach(item => {
      expect(item.item).toBeDefined();
      expect(typeof item.points).toBe("number");
      expect(["recycle", "compost", "landfill"]).toContain(item.category);
    });
  });

  it("should verify starting incidents format matches layout expects", () => {
    expect(INITIAL_INCIDENTS.length).toBeGreaterThanOrEqual(1);
    INITIAL_INCIDENTS.forEach(inc => {
      expect(inc.id).toBeDefined();
      expect(inc.type).toBeDefined();
      expect(["open", "resolved", "in-progress"]).toContain(inc.status);
      expect(inc.severity).toBeDefined();
      expect(inc.title).toBeDefined();
      expect(inc.zone).toBeDefined();
    });
  });
});
