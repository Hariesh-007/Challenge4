// Pathfinding and Wayfinding Engine for FIFA World Cup 2026

export const MAP_NODES = {
  // Entrances / Outside
  metro: { id: "metro", name: "Metro / Transit Terminal", x: 150, y: 20, type: "transit", accessible: true },
  parking: { id: "parking", name: "West Parking Lot", x: 20, y: 150, type: "transit", accessible: true },
  shuttle: { id: "shuttle", name: "Shuttle Bus Loop", x: 280, y: 80, type: "transit", accessible: true },
  
  // Gates
  "gate-a": { id: "gate-a", name: "Gate A", x: 150, y: 70, type: "gate", accessible: true },
  "gate-b": { id: "gate-b", name: "Gate B", x: 250, y: 110, type: "gate", accessible: true },
  "gate-c": { id: "gate-c", name: "Gate C", x: 150, y: 230, type: "gate", accessible: false }, // Has steps
  "gate-d": { id: "gate-d", name: "Gate D", x: 50, y: 110, type: "gate", accessible: true },
  
  // Outer Concourses
  "concourse-n": { id: "concourse-n", name: "Concourse North", x: 150, y: 100, type: "concourse", accessible: true },
  "concourse-e": { id: "concourse-e", name: "Concourse East", x: 210, y: 150, type: "concourse", accessible: true },
  "concourse-s": { id: "concourse-s", name: "Concourse South", x: 150, y: 200, type: "concourse", accessible: true },
  "concourse-w": { id: "concourse-w", name: "Concourse West", x: 90, y: 150, type: "concourse", accessible: true },
  
  // Stadium Inner Seats & Services
  "seating-n": { id: "seating-n", name: "Seating Section 100-110", x: 150, y: 120, type: "seat", accessible: true },
  "seating-e": { id: "seating-e", name: "Seating Section 111-125", x: 180, y: 150, type: "seat", accessible: false }, // Stairs only access
  "seating-s": { id: "seating-s", name: "Seating Section 126-140", x: 150, y: 180, type: "seat", accessible: true },
  "seating-w": { id: "seating-w", name: "Seating Section 141-155 (ADA Spot)", x: 120, y: 150, type: "seat", accessible: true },
  
  // Amenities
  "hyd-1": { id: "hyd-1", name: "Hydration Station North", x: 140, y: 80, type: "water", accessible: true },
  "hyd-2": { id: "hyd-2", name: "Hydration Station South", x: 160, y: 220, type: "water", accessible: true },
  "med-1": { id: "med-1", name: "Medical Tent East", x: 260, y: 150, type: "medical", accessible: true },
  "sens-1": { id: "sens-1", name: "Sensory Quiet Room 102", x: 40, y: 150, type: "sensory", accessible: true }
};

// Connections between nodes (bidirectional)
// distance: pixel weight/euclidean approx
// requiresElevator: true if stairs exist in route segment (wheelchair users must avoid)
export const MAP_EDGES = [
  // Outer Connections
  { from: "metro", to: "gate-a", distance: 50 },
  { from: "metro", to: "shuttle", distance: 130 },
  { from: "parking", to: "gate-d", distance: 50 },
  { from: "parking", to: "gate-c", distance: 150 },
  { from: "shuttle", to: "gate-b", distance: 40 },
  
  // Gate to Concourse connections
  { from: "gate-a", to: "concourse-n", distance: 30 },
  { from: "gate-b", to: "concourse-e", distance: 55 },
  { from: "gate-c", to: "concourse-s", distance: 30, requiresElevator: true }, // Gate C entrance has steps
  { from: "gate-d", to: "concourse-w", distance: 40 },
  
  // Concourse Ring connections
  { from: "concourse-n", to: "concourse-e", distance: 80 },
  { from: "concourse-e", to: "concourse-s", distance: 80 },
  { from: "concourse-s", to: "concourse-w", distance: 80 },
  { from: "concourse-w", to: "concourse-n", distance: 80 },
  
  // Concourse to Seating
  { from: "concourse-n", to: "seating-n", distance: 20 },
  { from: "concourse-e", to: "seating-e", distance: 30, requiresElevator: true }, // Seating E is stairs only
  { from: "concourse-s", to: "seating-s", distance: 20 },
  { from: "concourse-w", to: "seating-w", distance: 30 },
  
  // Amenities to Concourses
  { from: "gate-a", to: "hyd-1", distance: 15 },
  { from: "gate-c", to: "hyd-2", distance: 15 },
  { from: "gate-b", to: "med-1", distance: 40 },
  { from: "gate-d", to: "sens-1", distance: 40 }
];

/**
 * Dijkstra algorithm to find path between start and end.
 * @param {string} startId
 * @param {string} endId
 * @param {string} mode - 'shortest' | 'accessible' | 'low-crowd'
 * @param {Array} stadiumGates - current status of gates (to apply queue weights)
 * @param {Array} stadiumZones - current status of stands/zones
 */
export function findRoute(startId, endId, mode, stadiumGates = [], stadiumZones = []) {
  if (!MAP_NODES[startId] || !MAP_NODES[endId]) return null;

  // Accessibility check: start and destination must be accessible in accessible mode
  if (mode === "accessible") {
    if (MAP_NODES[startId].accessible === false || MAP_NODES[endId].accessible === false) {
      return null;
    }
  }

  // Build graph representations
  const adjacencyList = {};
  Object.keys(MAP_NODES).forEach(nodeId => {
    adjacencyList[nodeId] = [];
  });

  MAP_EDGES.forEach(edge => {
    // Determine edge weight modifiers
    let weightModifier = 1.0;
    let isSegmentAccessible = true;

    if (edge.requiresElevator) {
      isSegmentAccessible = false;
    }

    // Apply crowd modifiers if mode is 'low-crowd'
    if (mode === "low-crowd") {
      // Check if connecting to a congested gate
      const gateFrom = stadiumGates.find(g => g.id === edge.from || g.id === edge.to);
      if (gateFrom) {
        if (gateFrom.status === "congested") weightModifier += 2.0; // 3x penalty
        if (gateFrom.status === "overcrowded") weightModifier += 6.0; // 7x penalty
      }

      // Check stand density
      const standFrom = stadiumZones.find(z => {
        const matchingNode = edge.from.includes(z.id.replace("zone-", "")) || edge.to.includes(z.id.replace("zone-", ""));
        return matchingNode;
      });
      if (standFrom) {
        if (standFrom.level === "yellow") weightModifier += 1.5;
        if (standFrom.level === "red") weightModifier += 4.0;
      }
    }

    // Accessibility filter: skip if accessible mode and edge contains stairs
    if (mode === "accessible" && !isSegmentAccessible) {
      return; // Skip edge
    }

    const finalWeight = edge.distance * weightModifier;

    adjacencyList[edge.from].push({ node: edge.to, weight: finalWeight, originalDistance: edge.distance });
    adjacencyList[edge.to].push({ node: edge.from, weight: finalWeight, originalDistance: edge.distance });
  });

  // Dijkstra implementation
  const distances = {};
  const previous = {};
  const queue = [];

  Object.keys(MAP_NODES).forEach(nodeId => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  distances[startId] = 0;
  queue.push({ id: startId, dist: 0 });

  while (queue.length > 0) {
    // Sort queue to get node with smallest distance
    queue.sort((a, b) => a.dist - b.dist);
    const { id: u } = queue.shift();

    if (u === endId) break; // Found shortest path to target

    const neighbors = adjacencyList[u] || [];
    for (const neighbor of neighbors) {
      const { node: v, weight } = neighbor;
      const alt = distances[u] + weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = u;
        queue.push({ id: v, dist: alt });
      }
    }
  }

  // Construct path
  const path = [];
  let curr = endId;
  if (distances[endId] === Infinity) {
    return null; // No path found
  }

  while (curr !== null) {
    path.unshift(MAP_NODES[curr]);
    curr = previous[curr];
  }

  // Generate turn-by-turn or descriptive labels
  const steps = [];
  for (let i = 0; i < path.length - 1; i++) {
    const fromNode = path[i];
    const toNode = path[i+1];
    
    let description = `Walk from ${fromNode.name} to ${toNode.name}.`;
    if (toNode.type === "gate") {
      description = `Head to ${toNode.name} entry lanes.`;
    } else if (toNode.type === "transit") {
      description = `Proceed towards ${toNode.name}.`;
    } else if (toNode.type === "water") {
      description = `Refill at the ${toNode.name}.`;
    } else if (toNode.type === "sensory") {
      description = `Seek decompression at the ${toNode.name}.`;
    } else if (toNode.type === "seat") {
      description = `Find your seat in ${toNode.name}.`;
    }
    
    steps.push({
      from: fromNode.id,
      to: toNode.id,
      text: description
    });
  }

  return {
    path,
    steps,
    totalDistance: Math.round(distances[endId]),
    mode
  };
}
