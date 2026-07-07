import { describe, it, expect } from "vitest";
import { findRoute } from "../utils/routing";

describe("Wayfinding Routing Engine Tests", () => {
  it("should calculate the shortest path between Metro and Seating North Stand", () => {
    const route = findRoute("metro", "seating-n", "shortest");
    expect(route).not.toBeNull();
    expect(route.path.length).toBeGreaterThan(2);
    expect(route.path[0].id).toBe("metro");
    expect(route.path[route.path.length - 1].id).toBe("seating-n");
  });

  it("should return null for invalid start or destination nodes", () => {
    const invalidStart = findRoute("unknown-node", "seating-n", "shortest");
    const invalidDest = findRoute("metro", "another-fake-node", "shortest");
    expect(invalidStart).toBeNull();
    expect(invalidDest).toBeNull();
  });

  it("should return a 0-distance path if start equals destination", () => {
    const route = findRoute("metro", "metro", "shortest");
    expect(route).not.toBeNull();
    expect(route.totalDistance).toBe(0);
    expect(route.path.length).toBe(1);
    expect(route.path[0].id).toBe("metro");
    expect(route.steps.length).toBe(0);
  });

  it("should filter out inaccessible stairs when routing in accessible mode", () => {
    const standardRoute = findRoute("metro", "seating-e", "shortest");
    const accessibleRoute = findRoute("metro", "seating-e", "accessible");

    expect(standardRoute).not.toBeNull();
    expect(accessibleRoute).toBeNull(); // Seating E requires stairs
  });

  it("should apply queue time congestion weights in low-crowd mode", () => {
    const gates = [
      { id: "gate-a", name: "Gate A", status: "normal", queueTime: 5, load: 20 },
      { id: "gate-b", name: "Gate B", status: "normal", queueTime: 5, load: 20 },
      { id: "gate-c", name: "Gate C", status: "normal", queueTime: 5, load: 20 },
      { id: "gate-d", name: "Gate D", status: "overcrowded", queueTime: 45, load: 95 }
    ];

    const shortestRoute = findRoute("parking", "concourse-w", "shortest", gates, []);
    const lowCrowdRoute = findRoute("parking", "concourse-w", "low-crowd", gates, []);

    expect(shortestRoute).not.toBeNull();
    expect(lowCrowdRoute).not.toBeNull();
    expect(shortestRoute.totalDistance).toBe(90);
    expect(lowCrowdRoute.totalDistance).toBe(260); // Diverts via Gate C due to penalty on D
    expect(lowCrowdRoute.totalDistance).toBeGreaterThan(shortestRoute.totalDistance);
  });

  it("should return null in accessible mode if start or destination nodes themselves are not accessible", () => {
    const routeInaccessibleStart = findRoute("gate-c", "seating-n", "accessible");
    const routeInaccessibleDest = findRoute("metro", "seating-e", "accessible");

    expect(routeInaccessibleStart).toBeNull();
    expect(routeInaccessibleDest).toBeNull();
  });
});
