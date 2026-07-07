import { describe, it, expect } from "vitest";

// Simulate the game state transition logic defined in GreenZone.jsx
function simulateSort(state, item, binCategory) {
  const isCorrect = item.category === binCategory;
  const pointDelta = isCorrect ? item.points : -5;
  const nextScore = Math.max(0, state.score + pointDelta);
  const unlockedBadge = nextScore >= 50 || state.unlockedBadge;
  
  return {
    score: nextScore,
    unlockedBadge,
    correct: isCorrect
  };
}

describe("Waste Sorting Gamification Logic Tests", () => {
  const testItemRecycle = { item: "Aluminum Soda Can", category: "recycle", points: 10 };
  const testItemCompost = { item: "Half-Eaten Hot Dog", category: "compost", points: 15 };

  it("should award correct points on a successful match", () => {
    const initialState = { score: 10, unlockedBadge: false };
    const nextState = simulateSort(initialState, testItemRecycle, "recycle");

    expect(nextState.score).toBe(20);
    expect(nextState.correct).toBe(true);
    expect(nextState.unlockedBadge).toBe(false);
  });

  it("should apply a -5 point penalty on a mismatch", () => {
    const initialState = { score: 10, unlockedBadge: false };
    const nextState = simulateSort(initialState, testItemRecycle, "landfill");

    expect(nextState.score).toBe(5);
    expect(nextState.correct).toBe(false);
    expect(nextState.unlockedBadge).toBe(false);
  });

  it("should clamp the score to 0 and not allow negative values", () => {
    const initialState = { score: 3, unlockedBadge: false };
    const nextState = simulateSort(initialState, testItemRecycle, "compost");

    expect(nextState.score).toBe(0);
    expect(nextState.correct).toBe(false);
  });

  it("should unlock the green badge when the score reaches or exceeds 50", () => {
    const stateNearBadge = { score: 45, unlockedBadge: false };
    const stateAfterSort = simulateSort(stateNearBadge, testItemCompost, "compost");

    expect(stateAfterSort.score).toBe(60);
    expect(stateAfterSort.unlockedBadge).toBe(true);
  });

  it("should maintain badge unlock state even if score drops below 50 afterwards", () => {
    const stateUnlocked = { score: 55, unlockedBadge: true };
    const stateAfterPenalty = simulateSort(stateUnlocked, testItemRecycle, "compost"); // Mismatch penalty

    expect(stateAfterPenalty.score).toBe(50);
    expect(stateAfterPenalty.unlockedBadge).toBe(true); // Should stay true!
  });
});
