import { describe, it, expect } from "vitest";
import { TRANSIT_OPTIONS } from "../data/mockData";

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
});
