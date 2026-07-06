import React, { useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translation";
import { MAP_NODES, findRoute } from "../utils/routing";
import { 
  Navigation, 
  MapPin, 
  Accessibility, 
  Clock, 
  Activity, 
  Droplet, 
  Smile, 
  TrendingDown,
  Info
} from "lucide-react";

export default function NavigationMap({
  role,
  stadium,
  accessibility,
  language,
  gates,
  zones
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [startNode, setStartNode] = useState("metro");
  const [destNode, setDestNode] = useState("seating-w");
  const [routeMode, setRouteMode] = useState("shortest"); // shortest, accessible, low-crowd
  const [routeResult, setRouteResult] = useState(null);
  const [clickedNodeMsg, setClickedNodeMsg] = useState("");

  // Re-calculate route when nodes, mode, or gates/zones change
  useEffect(() => {
    const res = findRoute(startNode, destNode, routeMode, gates, zones);
    setRouteResult(res);
  }, [startNode, destNode, routeMode, gates, zones]);

  // Sync route mode with accessibility settings
  useEffect(() => {
    if (accessibility.wheelchairRoute) {
      setRouteMode("accessible");
    } else if (accessibility.sensoryRoute) {
      setRouteMode("low-crowd");
    }
  }, [accessibility.wheelchairRoute, accessibility.sensoryRoute]);

  const handleNodeClick = (nodeId) => {
    const node = MAP_NODES[nodeId];
    if (!node) return;

    setClickedNodeMsg(`${node.name} selected.`);

    // Simple heuristic: if clicked transit, set as start, otherwise set as destination
    if (node.type === "transit") {
      setStartNode(nodeId);
    } else {
      setDestNode(nodeId);
    }
    
    setTimeout(() => setClickedNodeMsg(""), 3000);
  };

  const getStatusColor = (status) => {
    if (status === "overcrowded" || status === "red") return "text-red-500 fill-red-500 stroke-red-600";
    if (status === "congested" || status === "yellow") return "text-amber-500 fill-amber-500 stroke-amber-600";
    return "text-emerald-500 fill-emerald-500 stroke-emerald-600";
  };

  const getHeatmapColor = (gateId) => {
    const gate = gates.find(g => g.id === gateId);
    if (!gate) return "fill-slate-700/40 border-slate-600";
    if (gate.status === "overcrowded") return "fill-red-500/20 stroke-red-500 stroke-2";
    if (gate.status === "congested") return "fill-amber-500/20 stroke-amber-500 stroke-2";
    return "fill-emerald-500/10 stroke-emerald-500 stroke-[1.5]";
  };

  const getMapNodeColor = (node) => {
    const isStart = node.id === startNode;
    const isDest = node.id === destNode;
    if (isStart) return "fill-blue-500 stroke-blue-200 stroke-2 r-[6px]";
    if (isDest) return "fill-fifa-red stroke-red-200 stroke-2 r-[6px]";
    
    switch (node.type) {
      case "transit": return "fill-indigo-400 stroke-indigo-600";
      case "gate": 
        const gate = gates.find(g => g.id === node.id);
        if (gate && gate.status === "overcrowded") return "fill-red-500 stroke-red-700";
        if (gate && gate.status === "congested") return "fill-amber-500 stroke-amber-700";
        return "fill-emerald-400 stroke-emerald-600";
      case "water": return "fill-cyan-400 stroke-cyan-600";
      case "sensory": return "fill-purple-400 stroke-purple-600";
      case "medical": return "fill-rose-500 stroke-rose-700";
      default: return "fill-slate-500 stroke-slate-700";
    }
  };

  const isHC = accessibility.highContrast;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Interactive Map Visualizer */}
      <div className={`xl:col-span-2 p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        isHC 
          ? "bg-black border-yellow-400 text-yellow-300" 
          : "bg-slate-900/40 backdrop-blur-lg border-slate-800 text-slate-100"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold uppercase text-xs tracking-wider flex items-center">
              <Activity className="h-4.5 w-4.5 text-fifa-gold mr-2" />
              Interactive Venue Navigation Map
            </h3>
            {clickedNodeMsg && (
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold animate-pulse ${
                isHC ? "bg-yellow-400 text-black" : "bg-fifa-blue text-fifa-gold"
              }`}>
                {clickedNodeMsg}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mb-4">
            💡 *Tip: Click directly on nodes (circles) in the SVG diagram to set departure or seat destinations.*
          </p>
        </div>

        {/* Stadium Layout SVG Map */}
        <div className={`relative flex items-center justify-center p-4 rounded-xl border ${
          isHC ? "bg-neutral-950 border-yellow-400" : "bg-slate-950/60 border-slate-900"
        }`}>
          <svg viewBox="0 0 300 260" className="w-full max-w-[420px] h-auto select-none">
            {/* Background elements / Grid */}
            <circle cx="150" cy="150" r="115" className="fill-none stroke-slate-800/30 stroke-[0.5]" />
            <circle cx="150" cy="150" r="65" className="fill-none stroke-slate-850 stroke-1 border-dashed" />
            
            {/* Map Stadium Sectors Heatmap */}
            <path d="M 110,110 A 55,55 0 0,1 190,110 L 220,90 A 90,90 0 0,0 80,90 Z" className={getHeatmapColor("gate-a")} /> {/* North */}
            <path d="M 190,110 A 55,55 0 0,1 190,190 L 220,210 A 90,90 0 0,0 220,90 Z" className={getHeatmapColor("gate-b")} /> {/* East */}
            <path d="M 190,190 A 55,55 0 0,1 110,190 L 80,210 A 90,90 0 0,0 220,210 Z" className={getHeatmapColor("gate-c")} /> {/* South */}
            <path d="M 110,190 A 55,55 0 0,1 110,110 L 80,90 A 90,90 0 0,0 80,210 Z" className={getHeatmapColor("gate-d")} /> {/* West */}

            {/* Stadium Core Boundary representation */}
            <rect x="110" y="120" width="80" height="60" rx="10" className="fill-slate-900/60 stroke-slate-800 stroke-[1.5]" />
            <text x="150" y="153" className="fill-slate-500 font-extrabold text-[8px] uppercase tracking-widest text-center" textAnchor="middle">
              FIFA 2026
            </text>

            {/* Render Map Connections/Paths (Inactive Edges) */}
            <g className="opacity-15 stroke-slate-500 stroke-[0.75] fill-none">
              {/* Outer Ring & links */}
              <line x1="150" y1="20" x2="150" y2="70" />
              <line x1="150" y1="20" x2="280" y2="80" />
              <line x1="20" y1="150" x2="50" y2="110" />
              <line x1="20" y1="150" x2="150" y2="230" />
              <line x1="280" y1="80" x2="250" y2="110" />

              <line x1="150" y1="70" x2="150" y2="100" />
              <line x1="250" y1="110" x2="210" y2="150" />
              <line x1="150" y1="230" x2="150" y2="200" />
              <line x1="50" y1="110" x2="90" y2="150" />

              {/* Concourse Loop */}
              <line x1="150" y1="100" x2="210" y2="150" />
              <line x1="210" y1="150" x2="150" y2="200" />
              <line x1="150" y1="200" x2="90" y2="150" />
              <line x1="90" y1="150" x2="150" y2="100" />

              {/* Inner Seats */}
              <line x1="150" y1="100" x2="150" y2="120" />
              <line x1="210" y1="150" x2="180" y2="150" />
              <line x1="150" y1="200" x2="150" y2="180" />
              <line x1="90" y1="150" x2="120" y2="150" />

              {/* Amenities */}
              <line x1="150" y1="70" x2="140" y2="80" />
              <line x1="150" y1="230" x2="160" y2="220" />
              <line x1="250" y1="110" x2="260" y2="150" />
              <line x1="50" y1="110" x2="40" y2="150" />
            </g>

            {/* Render Active Route Path */}
            {routeResult && routeResult.path && (
              <g>
                <path
                  d={`M ${routeResult.path.map(n => `${n.x},${n.y}`).join(" L ")}`}
                  className={`fill-none stroke-dasharray-[5,5] ${
                    isHC 
                      ? "stroke-yellow-400 stroke-[3]" 
                      : routeMode === "accessible" 
                      ? "stroke-sky-400 stroke-[2.5]" 
                      : routeMode === "low-crowd" 
                      ? "stroke-emerald-400 stroke-[2.5]"
                      : "stroke-fifa-gold stroke-[2.5]"
                  }`}
                  style={{
                    strokeDasharray: "5,4",
                    animation: "marquee 30s linear infinite"
                  }}
                />
                
                {/* Flow lines and arrows */}
                {routeResult.path.map((node, i) => (
                  <circle
                    key={`route-dot-${node.id}`}
                    cx={node.x}
                    cy={node.y}
                    r={node.id === startNode || node.id === destNode ? 5 : 2}
                    className={node.id === startNode ? "fill-blue-500 animate-ping" : node.id === destNode ? "fill-fifa-red animate-ping" : "fill-white"}
                  />
                ))}
              </g>
            )}

            {/* Nodes Coordinates Pins */}
            {Object.values(MAP_NODES).map((node) => {
              const colorClass = getMapNodeColor(node);
              const isStart = node.id === startNode;
              const isDest = node.id === destNode;
              const size = isStart || isDest ? 6 : 4;
              
              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer group"
                  onClick={() => handleNodeClick(node.id)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    className={`transition-all duration-200 hover:scale-150 ${colorClass}`}
                  />
                  {/* Tooltip on hover */}
                  <title>{node.name} ({node.type})</title>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-900 mt-4 text-[9px] uppercase font-bold tracking-wider text-slate-400">
          <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span> Start Position</div>
          <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-fifa-red mr-1"></span> Destination</div>
          <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-emerald-400 mr-1"></span> Normal Gate</div>
          <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span> Busy Area</div>
        </div>
      </div>

      {/* Navigation Controller & Turn-by-Turn Panel */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        isHC 
          ? "bg-black border-yellow-400 text-yellow-300" 
          : "bg-slate-900/40 backdrop-blur-lg border-slate-800 text-slate-100"
      }`}>
        <div className="space-y-4">
          <h3 className="font-extrabold uppercase text-xs tracking-wider flex items-center">
            <Navigation className="h-4.5 w-4.5 text-fifa-gold mr-2" />
            Route Routing Panel
          </h3>

          {/* Form selectors */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                {t.selectStart}
              </label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  isHC 
                    ? "bg-black border-yellow-400 text-yellow-300" 
                    : "bg-slate-950 border-slate-850 text-white focus:ring-fifa-gold"
                }`}
              >
                {Object.values(MAP_NODES).filter(n => n.type === "transit" || n.type === "gate").map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                {t.selectDest}
              </label>
              <select
                value={destNode}
                onChange={(e) => setDestNode(e.target.value)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  isHC 
                    ? "bg-black border-yellow-400 text-yellow-300" 
                    : "bg-slate-950 border-slate-850 text-white focus:ring-fifa-gold"
                }`}
              >
                {Object.values(MAP_NODES).filter(n => n.type !== "transit").map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            {/* Mode Selectors */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">
                Route Calculation Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "shortest", label: t.shortestRoute },
                  { id: "accessible", label: t.accessibleRoute },
                  { id: "low-crowd", label: t.lowCrowdRoute }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setRouteMode(mode.id)}
                    className={`px-2 py-2 rounded-lg text-[9px] font-bold border leading-tight text-center uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                      routeMode === mode.id
                        ? (isHC ? "bg-yellow-400 text-black border-yellow-400" : "bg-fifa-blue border-blue-600 text-white shadow")
                        : (isHC ? "border-yellow-400 text-yellow-300 hover:bg-neutral-900" : "border-slate-850 bg-slate-950/60 text-slate-400 hover:text-slate-200")
                    }`}
                  >
                    {mode.id === "accessible" && <Accessibility className="h-3 w-3" />}
                    {mode.id === "low-crowd" && <TrendingDown className="h-3 w-3" />}
                    <span>{mode.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Summary */}
          {routeResult && (
            <div className={`p-3.5 rounded-xl border ${
              isHC ? "bg-neutral-950 border-yellow-400" : "bg-slate-950/60 border-slate-900"
            }`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4.5 w-4.5 text-fifa-gold shrink-0" />
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">{t.queueTime}</div>
                    <div className="text-xs font-black">
                      {Math.round(routeResult.totalDistance / 10)} {t.minutes}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Accessibility className="h-4.5 w-4.5 text-fifa-gold shrink-0" />
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Accessibility</div>
                    <div className="text-xs font-semibold text-slate-200">
                      {routeMode === "accessible" ? "100% Lift & Ramps" : "Standard Steps"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Turn-by-Turn Steps */}
        <div className="mt-4 flex-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center">
            <Info className="h-3.5 w-3.5 text-fifa-gold mr-1" /> Wayfinding Directives
          </div>
          <div className={`max-h-[140px] overflow-y-auto space-y-2 pr-1 text-xs ${
            isHC ? "text-yellow-300" : "text-slate-300"
          }`}>
            {routeResult && routeResult.steps && routeResult.steps.length > 0 ? (
              routeResult.steps.map((step, idx) => (
                <div key={idx} className="flex space-x-2 items-start py-1 border-b border-slate-900/50">
                  <span className={`h-4 w-4 text-[9px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isHC ? "bg-yellow-400 text-black" : "bg-slate-900 text-slate-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{step.text}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic py-2">No path segments matching criteria.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
