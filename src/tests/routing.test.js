import { describe, it, expect } from "vitest";
import { findRoute, MAP_NODES } from "../utils/routing";

describe("Wayfinding Routing Engine Tests", () => {
  it("should calculate the shortest path between Metro and Seating North Stand", () => {
    // Route from 'metro' to 'seating-n'
    const route = findRoute("metro", "seating-n", "shortest");
    
    expect(route).toBeDefined();
    expect(route.path.length).toBeGreaterThan(2);
    expect(route.path[0].id).toBe("metro");
    expect(route.path[route.path.length - 1].id).toBe("seating-n");
  });

  it("should filter out inaccessible stairs when routing in accessible mode", () => {
    // Metro to Seating Section E (which requires elevator / has stairs)
    // accessible route should fail or divert because seating-e requires stairs and node-accessible is false
    const standardRoute = findRoute("metro", "seating-e", "shortest");
    const accessibleRoute = findRoute("metro", "seating-e", "accessible");

    // Standard route finds a path
    expect(standardRoute).not.toBeNull();
    
    // Accessible route should fail to find a path because seating-e itself requires elevator which is filtered out
    expect(accessibleRoute).toBeNull();
  });

  it("should apply queue time congestion weights in low-crowd mode", () => {
    // From parking to Concourse West. Shortest path is through Gate D (90 dist).
    // If Gate D is overcrowded, the low-crowd mode should redirect via Gate C (260 weight)
    const gates = [
      { id: "gate-a", name: "Gate A", status: "normal", queueTime: 5, load: 20 },
      { id: "gate-b", name: "Gate B", status: "normal", queueTime: 5, load: 20 },
      { id: "gate-c", name: "Gate C", status: "normal", queueTime: 5, load: 20 },
      { id: "gate-d", name: "Gate D", status: "overcrowded", queueTime: 45, load: 95 }
    ];

    const shortestRoute = findRoute("parking", "concourse-w", "shortest", gates, []);
    const lowCrowdRoute = findRoute("parking", "concourse-w", "low-crowd", gates, []);

    // Both find paths
    expect(shortestRoute).not.toBeNull();
    expect(lowCrowdRoute).not.toBeNull();

    // Shortest distance should be 90 (parking -> gate-d -> concourse-w)
    expect(shortestRoute.totalDistance).toBe(90);

    // Low crowd route should divert via gate-c, with distance 260
    expect(lowCrowdRoute.totalDistance).toBe(260);
    expect(lowCrowdRoute.totalDistance).toBeGreaterThan(shortestRoute.totalDistance);
  });
});
