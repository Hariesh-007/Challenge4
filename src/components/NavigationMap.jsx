import React, { useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translation";
import { MAP_NODES, findRoute } from "../utils/routing";
import { 
  Accessibility, 
  Clock, 
  TrendingDown,
  Info,
  Maximize2
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

  // Calculate route dynamically
  useEffect(() => {
    const res = findRoute(startNode, destNode, routeMode, gates, zones);
    setRouteResult(res);
  }, [startNode, destNode, routeMode, gates, zones]);

  // Sync mode with accessibility profile
  useEffect(() => {
    if (accessibility?.wheelchairRoute) {
      setRouteMode("accessible");
    } else if (accessibility?.sensoryRoute) {
      setRouteMode("low-crowd");
    }
  }, [accessibility?.wheelchairRoute, accessibility?.sensoryRoute]);

  const handleNodeClick = (nodeId) => {
    const node = MAP_NODES[nodeId];
    if (!node) return;

    setClickedNodeMsg(`${node.name}`);
    if (node.type === "transit") {
      setStartNode(nodeId);
    } else {
      setDestNode(nodeId);
    }
    
    setTimeout(() => setClickedNodeMsg(""), 2500);
  };

  const getHeatmapColor = (gateId) => {
    const gate = gates.find(g => g.id === gateId);
    if (!gate) return "fill-slate-800/40 border-slate-700";
    if (gate.status === "overcrowded") return "fill-red-500/10 stroke-red-500/70 stroke-[2] shadow-lg shadow-red-500/10";
    if (gate.status === "congested") return "fill-amber-500/10 stroke-amber-500/60 stroke-[1.5]";
    return "fill-emerald-500/5 stroke-emerald-500/40 stroke-1";
  };

  const getMapNodeColor = (node) => {
    const isStart = node.id === startNode;
    const isDest = node.id === destNode;
    if (isStart) return "fill-sky-400 stroke-sky-200 stroke-2";
    if (isDest) return "fill-fifa-red stroke-red-200 stroke-2";
    
    switch (node.type) {
      case "transit": return "fill-blue-500/80 stroke-blue-400";
      case "gate": 
        const gate = gates.find(g => g.id === node.id);
        if (gate && gate.status === "overcrowded") return "fill-red-500 stroke-red-400";
        if (gate && gate.status === "congested") return "fill-amber-500 stroke-amber-400";
        return "fill-emerald-500 stroke-emerald-400";
      case "water": return "fill-cyan-400/90 stroke-cyan-300";
      case "sensory": return "fill-purple-400/90 stroke-purple-300";
      case "medical": return "fill-rose-500 stroke-rose-450";
      default: return "fill-slate-650 stroke-slate-550";
    }
  };

  const getGlowFilter = () => {
    if (routeMode === "accessible") return "url(#glow-sky)";
    if (routeMode === "low-crowd") return "url(#glow-green)";
    return "url(#glow-gold)";
  };

  const getRouteStrokeColor = () => {
    if (routeMode === "accessible") return "#38bdf8"; // sky-400
    if (routeMode === "low-crowd") return "#34d399"; // emerald-400
    return "#e2b33c"; // fifa-gold
  };

  const isHC = accessibility?.highContrast;

  return (
    <div className="space-y-4">
      {/* Visual map shell */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isHC 
          ? "bg-black border-yellow-400 text-yellow-300" 
          : "bg-slate-900/60 backdrop-blur-md border-slate-800/80 text-slate-100 shadow-xl"
      }`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-fifa-blue/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>
        
        <div className="flex items-center justify-between mb-3.5 border-b border-slate-900 pb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-lg ${isHC ? 'bg-black text-yellow-400' : 'bg-fifa-blue/30 text-fifa-gold'}`}>
              <Maximize2 className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold uppercase text-xs tracking-wider">
              {stadium.name} Real-Time wayfinder Map
            </h3>
          </div>
          {clickedNodeMsg && (
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase animate-pulse border ${
              isHC 
                ? "bg-yellow-400 border-yellow-400 text-black" 
                : "bg-fifa-blue/30 border-fifa-gold/20 text-fifa-gold"
            }`}>
              📡 {clickedNodeMsg}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* SVG Map Canvas */}
          <div className={`md:col-span-2 relative p-4 rounded-xl border flex items-center justify-center bg-radar-grid ${
            isHC ? "bg-black border-yellow-400" : "bg-slate-950/80 border-slate-900/60"
          }`}>
            <svg viewBox="0 0 300 250" role="img" aria-label="Interactive stadium map showing gates, sections, and wayfinding routes" className="w-full max-w-[380px] h-auto select-none">
              
              {/* Neon Glow Filters Definitions */}
              <defs>
                <filter id="glow-sky" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Guides */}
              <circle cx="150" cy="125" r="95" className="fill-none stroke-slate-800/20 stroke-[0.5]" />
              <circle cx="150" cy="125" r="55" className="fill-none stroke-slate-850/40 stroke-1 border-dashed" />
              
              {/* Stands Heatmaps */}
              <path d="M 110,85 A 50,50 0 0,1 190,85 L 210,65 A 75,75 0 0,0 90,65 Z" className={getHeatmapColor("gate-a")} /> {/* North */}
              <path d="M 190,85 A 50,50 0 0,1 190,165 L 210,185 A 75,75 0 0,0 210,65 Z" className={getHeatmapColor("gate-b")} /> {/* East */}
              <path d="M 190,165 A 50,50 0 0,1 110,165 L 90,185 A 75,75 0 0,0 210,185 Z" className={getHeatmapColor("gate-c")} /> {/* South */}
              <path d="M 110,165 A 50,50 0 0,1 110,85 L 90,65 A 75,75 0 0,0 90,185 Z" className={getHeatmapColor("gate-d")} /> {/* West */}

              {/* Pitch Core */}
              <rect x="120" y="105" width="60" height="40" rx="6" className="fill-slate-900/60 stroke-slate-800 stroke-[1]" />
              <text x="150" y="128" className="fill-slate-600 font-extrabold text-[7px] uppercase tracking-widest text-center" textAnchor="middle">
                FIFA 2026
              </text>

              {/* Connections (Underlay lines) */}
              <g className="opacity-10 stroke-slate-400 stroke-[0.5] fill-none">
                <line x1="150" y1="20" x2="150" y2="70" />
                <line x1="150" y1="20" x2="280" y2="80" />
                <line x1="20" y1="150" x2="50" y2="110" />
                <line x1="20" y1="150" x2="150" y2="230" />
                <line x1="280" y1="80" x2="250" y2="110" />

                <line x1="150" y1="70" x2="150" y2="100" />
                <line x1="250" y1="110" x2="210" y2="150" />
                <line x1="150" y1="230" x2="150" y2="200" />
                <line x1="50" y1="110" x2="90" y2="150" />

                {/* Ring */}
                <line x1="150" y1="100" x2="210" y2="150" />
                <line x1="210" y1="150" x2="150" y2="200" />
                <line x1="150" y1="200" x2="90" y2="150" />
                <line x1="90" y1="150" x2="150" y2="100" />

                {/* Inner */}
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

              {/* Glowing Dynamic Route Overlay */}
              {routeResult && routeResult.path && (
                <g>
                  {/* Glowing Underlay line */}
                  <path
                    d={`M ${routeResult.path.map(n => `${n.x},${n.y}`).join(" L ")}`}
                    fill="none"
                    stroke={getRouteStrokeColor()}
                    strokeWidth="3.5"
                    filter={getGlowFilter()}
                    opacity="0.75"
                    className="pointer-events-none"
                  />
                  {/* Flow animation overlay */}
                  <path
                    d={`M ${routeResult.path.map(n => `${n.x},${n.y}`).join(" L ")}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    className="animate-flow pointer-events-none"
                  />
                </g>
              )}

              {/* Pins & Radar pulse rings */}
              {Object.values(MAP_NODES).map((node) => {
                const isStart = node.id === startNode;
                const isDest = node.id === destNode;
                
                return (
                  <g key={node.id}>
                    {/* Radar Pulse for starts & destinations */}
                    {isStart && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={8}
                        className="fill-none stroke-sky-400 stroke-2 animate-pulse-ring pointer-events-none"
                      />
                    )}
                    {isDest && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={8}
                        className="fill-none stroke-red-500 stroke-2 animate-pulse-ring pointer-events-none"
                      />
                    )}

                    {/* Main Node Point */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isStart || isDest ? 4.5 : 3}
                      className={`cursor-pointer focus:outline-none focus:ring-1 focus:ring-fifa-gold rounded-full transition-all duration-200 hover:scale-150 ${getMapNodeColor(node)}`}
                      onClick={() => handleNodeClick(node.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select ${node.name} node`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleNodeClick(node.id);
                        }
                      }}
                    />
                    <title>{node.name}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Form Controllers and Steps */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div>
                <label htmlFor="start-node-select" className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">
                  {t.selectStart}
                </label>
                <select
                  id="start-node-select"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none ${
                    isHC 
                      ? "bg-black border-yellow-400 text-yellow-300" 
                      : "bg-slate-950/80 border-slate-850/60 text-white focus:border-fifa-gold"
                  }`}
                >
                  {Object.values(MAP_NODES).filter(n => n.type === "transit" || n.type === "gate").map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dest-node-select" className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">
                  {t.selectDest}
                </label>
                <select
                  id="dest-node-select"
                  value={destNode}
                  onChange={(e) => setDestNode(e.target.value)}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none ${
                    isHC 
                      ? "bg-black border-yellow-400 text-yellow-300" 
                      : "bg-slate-950/80 border-slate-850/60 text-white focus:border-fifa-gold"
                  }`}
                >
                  {Object.values(MAP_NODES).filter(n => n.type !== "transit").map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 mb-1.5 block">
                  Mode
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "shortest", label: t.shortestRoute },
                    { id: "accessible", label: t.accessibleRoute },
                    { id: "low-crowd", label: t.lowCrowdRoute }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setRouteMode(mode.id)}
                      className={`px-1 py-2 rounded-lg text-[9px] font-bold border leading-tight text-center uppercase flex flex-col items-center justify-center gap-1 transition-all ${
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

            {/* Calculations Card */}
            {routeResult && (
              <div className={`p-3 rounded-lg border flex justify-between items-center text-xs ${
                isHC ? "bg-black border-yellow-400" : "bg-slate-950/80 border-slate-900/60"
              }`}>
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-fifa-gold shrink-0" />
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase">Est. Walk</div>
                    <span className="font-bold">{Math.round(routeResult.totalDistance / 10)} min</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <Accessibility className="h-4 w-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-[8px] text-slate-400 uppercase">Path type</div>
                    <span className="font-bold capitalize">{routeMode}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Directions details */}
        <div className="border-t border-slate-900 pt-3 mt-3">
          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center">
            <Info className="h-3.5 w-3.5 text-fifa-gold mr-1" /> Navigation Steps
          </div>
          <div className={`max-h-[105px] overflow-y-auto space-y-1.5 pr-1 text-[11px] leading-relaxed ${
            isHC ? "text-yellow-300" : "text-slate-350"
          }`}>
            {routeResult && routeResult.steps && routeResult.steps.length > 0 ? (
              routeResult.steps.map((step, idx) => (
                <div key={idx} className="flex space-x-2 items-start py-1 border-b border-slate-900/20">
                  <span className={`h-4 w-4 text-[9px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isHC ? "bg-yellow-400 text-black" : "bg-slate-900 border border-slate-800 text-slate-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{step.text}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic py-1">Select valid nodes to load steps.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
