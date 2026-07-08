import { describe, it, expect } from "vitest";
import { getAISustainabilityAudit } from "../utils/sustainabilityHelper";

describe("AI Sustainability Audit Logic Tests", () => {
  it("should calculate correct grade scores and audits for different stadiums", () => {
    // 1. MetLife Stadium Audit (English)
    const auditMetlifeEn = getAISustainabilityAudit("metlife", "en");
    expect(auditMetlifeEn.score).toBe("A+");
    expect(auditMetlifeEn.analysis).toContain("zero-waste-to-landfill");
    expect(auditMetlifeEn.recommendation).toContain("brown bins");

    // 2. MetLife Stadium Audit (Spanish)
    const auditMetlifeEs = getAISustainabilityAudit("metlife", "es");
    expect(auditMetlifeEs.analysis).toContain("cero residuos al vertedero");

    // 3. BC Place Audit (English)
    const auditBcplaceEn = getAISustainabilityAudit("bcplace", "en");
    expect(auditBcplaceEn.score).toBe("A");
    expect(auditBcplaceEn.analysis).toContain("cup-return deposit scheme");

    // 4. BC Place Audit (French)
    const auditBcplaceFr = getAISustainabilityAudit("bcplace", "fr");
    expect(auditBcplaceFr.analysis).toContain("consigne sur les gobelets");

    // 5. Estadio Azteca Audit (English)
    const auditAztecaEn = getAISustainabilityAudit("azteca", "en");
    expect(auditAztecaEn.score).toBe("B+");
    expect(auditAztecaEn.analysis).toContain("electric rail priority");

    // 6. Estadio Azteca Audit (Spanish)
    const auditAztecaEs = getAISustainabilityAudit("azteca", "es");
    expect(auditAztecaEs.analysis).toContain("transporte eléctrico");

    // 7. Unknown stadium fallback
    const auditUnknown = getAISustainabilityAudit("unknown", "en");
    expect(auditUnknown.score).toBe("B-");
    expect(auditUnknown.analysis).toContain("General stadium green protocol");
  });
});
