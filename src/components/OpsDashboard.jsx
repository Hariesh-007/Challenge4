import React, { useState } from "react";
import { TRANSLATIONS } from "../data/translation";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  ShieldAlert, 
  Sliders, 
  AlertTriangle, 
  PlusCircle, 
  Check, 
  Users, 
  Wrench, 
  HeartHandshake,
  Activity
} from "lucide-react";

export default function OpsDashboard({
  role,
  stadium,
  language,
  accessibility,
  gates,
  setGates,
  incidents,
  setIncidents,
  addAlert
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  // Incident injection local state
  const [incTitle, setIncTitle] = useState("");
  const [incType, setIncType] = useState("crowd");
  const [incSeverity, setIncSeverity] = useState("medium");
  const [incZone, setIncZone] = useState("North Stand");
  const [incDesc, setIncDesc] = useState("");

  const handleResolveIncident = (incId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incId) {
        return { ...inc, status: "resolved" };
      }
      return inc;
    }));
  };

  const handleInjectIncident = (e) => {
    e.preventDefault();
    if (!incTitle.trim()) return;

    // Secure input sanitization
    const cleanTitle = incTitle.replace(/[<>]/g, "").slice(0, 80).trim();
    const cleanDesc = incDesc.replace(/[<>]/g, "").slice(0, 250).trim();

    const newInc = {
      id: `inc-${Date.now()}`,
      type: incType,
      status: "open",
      severity: incSeverity,
      title: cleanTitle,
      stadium: stadium.id,
      zone: incZone,
      description: cleanDesc || `Simulated ${incType} occurrence reported.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedTo: "Quick Response Unit"
    };

    setIncidents(prev => [newInc, ...prev]);

    // Push into global alert ticker
    addAlert({
      time: newInc.time,
      title: `${newInc.title} (${newInc.severity.toUpperCase()})`,
      description: newInc.description
    });

    // Reset Form
    setIncTitle("");
    setIncDesc("");
  };

  const handleModulateQueue = (gateId, newTime) => {
    setGates(prev => prev.map(g => {
      if (g.id === gateId) {
        const timeVal = parseInt(newTime);
        let status = "normal";
        if (timeVal >= 30) status = "overcrowded";
        else if (timeVal >= 15) status = "congested";
        
        return {
          ...g,
          queueTime: timeVal,
          load: Math.min(100, Math.round(timeVal * 3)),
          status
        };
      }
      return g;
    }));
  };

  const handleTriggerRedeployment = (srcGateId, _destGateId) => {
    // Simulate re-routing volunteers to lower queue time
    setGates(prev => prev.map(g => {
      if (g.id === srcGateId) {
        // Decrease queue time as staff help handle queues
        const nextTime = Math.max(2, g.queueTime - 8);
        return { ...g, queueTime: nextTime, load: Math.round(nextTime * 3), status: nextTime > 25 ? "overcrowded" : nextTime > 12 ? "congested" : "normal" };
      }
      return g;
    }));
    alert(language === "es" 
      ? `Despliegue activado. Personal de apoyo movilizado.` 
      : language === "fr"
      ? `Redéploiement activé. Bénévoles redirigés.`
      : `Staff redeployed to assist queue management at Gate.`);
  };

  // Compile stats for charts
  const chartData = gates.map(g => ({
    name: g.name.split(" ")[1] || g.name,
    queueTime: g.queueTime,
    load: g.load
  }));

  const activeIncidents = incidents.filter(i => i.status !== "resolved");
  const typeCounts = activeIncidents.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(typeCounts).map(type => ({
    name: type.toUpperCase(),
    value: typeCounts[type]
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // AI Recommendation engine compiling directives on the fly
  const getAIRecommendations = () => {
    const recs = [];
    const congestedGates = gates.filter(g => g.status !== "normal");
    
    congestedGates.forEach(cg => {
      const normalGates = gates.filter(g => g.status === "normal");
      if (normalGates.length > 0) {
        recs.push({
          id: `rec-${cg.id}`,
          severity: cg.status === "overcrowded" ? "high" : "medium",
          text: language === "es"
            ? `[FILA CRÍTICA] Desviar flujo del ${cg.name}. Reasignar 3 voluntarios del ${normalGates[0].name} para acelerar los carriles de entrada.`
            : language === "fr"
            ? `[ATTENTE CRITIQUE] Rediriger le flux de la ${cg.name}. Détacher 3 bénévoles de la ${normalGates[0].name} pour fluidifier les accès.`
            : `[QUEUE DETOUR] ${cg.name} wait exceeds limits. Redeploy 3 volunteers from ${normalGates[0].name} to guide arrivals and open auxiliary lanes.`,
          action: () => handleTriggerRedeployment(cg.id, normalGates[0].id)
        });
      }
    });

    const medicalIncs = activeIncidents.filter(i => i.type === "medical");
    if (medicalIncs.length > 0) {
      recs.push({
        id: "rec-med",
        severity: "high",
        text: language === "es"
          ? "[ALERTA MÉDICA] Reporte de desmayo/deshidratación. Despejar pasillo este para acceso de camilla."
          : language === "fr"
          ? "[URGENCE MÉDICALE] Malaise signalé. Libérer le couloir Est pour l'accès des secours."
          : "[MEDICAL PRIORITY] Heat illness reported in Stand. Clear East Concourse corridor for stretcher access.",
        action: null
      });
    }

    if (recs.length === 0) {
      recs.push({
        id: "rec-none",
        severity: "low",
        text: language === "es"
          ? "Sin alarmas de flujo. Mantener patrullajes rutinarios de sostenibilidad."
          : language === "fr"
          ? "Aucune anomalie. Poursuivre les rondes éco-responsables habituelles."
          : "Operations nominal. Instruct volunteers to distribute empty recycle cups.",
        action: null
      });
    }

    return recs;
  };

  const aiRecs = getAIRecommendations();

  const isHC = accessibility.highContrast;

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Incidents", value: activeIncidents.length, icon: AlertTriangle, color: "text-rose-500 bg-rose-500/10" },
          { label: "Avg. Queue Time", value: `${Math.round(gates.reduce((acc, g) => acc + g.queueTime, 0) / gates.length)}m`, icon: Sliders, color: "text-amber-500 bg-amber-500/10" },
          { label: "Overcrowded Gates", value: gates.filter(g => g.status === "overcrowded").length, icon: ShieldAlert, color: "text-red-500 bg-red-500/10" },
          { label: "Assist Desks Active", value: 3, icon: HeartHandshake, color: "text-emerald-500 bg-emerald-500/10" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-4 rounded-xl border transition-all ${
              isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</span>
                <span className={`p-1.5 rounded-lg ${stat.color}`}><Icon className="h-4 w-4" /></span>
              </div>
              <div className="text-2xl font-black mt-2">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Simulation Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Modulate Stadium Gates Queues */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
        }`}>
          <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
            <Sliders className="h-4 w-4 mr-2 text-fifa-gold" />
            {t.queuesTitle}
          </h3>
          <p className="text-[10px] text-slate-400 mb-4">
            Adjust the sliders below to simulate fluctuating gate crowd pressures. This updates navigation heatmaps in real-time.
          </p>

          <div className="space-y-4">
            {gates.map((g) => (
              <div key={g.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">{g.name}</span>
                  <span className={`font-bold ${
                    g.status === "overcrowded" ? "text-red-500" : g.status === "congested" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {g.queueTime} {t.minutes}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="45"
                  value={g.queueTime}
                  onChange={(e) => handleModulateQueue(g.id, e.target.value)}
                  aria-label={`Queue time modulation for ${g.name}`}
                  className="w-full accent-fifa-gold bg-slate-950 h-1.5 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Live Analytics */}
        <div className={`p-5 rounded-2xl border xl:col-span-2 transition-all ${
          isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
        }`}>
          <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
            <Activity className="h-4 w-4 mr-2 text-fifa-gold" />
            Live Analytics & Egress Pressure
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[180px]">
            {/* Recharts Bar Chart */}
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={9} />
                  <YAxis stroke="#888888" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#0a1931', border: '1px solid #1e293b' }} labelStyle={{ fontSize: 9 }} itemStyle={{ fontSize: 9 }} />
                  <Bar dataKey="queueTime" fill="#e2b33c" radius={[4, 4, 0, 0]} name="Queue Mins" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recharts Pie Chart */}
            <div className="w-full h-full flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0a1931', border: '1px solid #1e293b' }} itemStyle={{ fontSize: 9 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-500 text-xs italic">No active incidents to chart.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Center & AI Suggestions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Active Incident List */}
        <div className={`xl:col-span-2 p-5 rounded-2xl border transition-all ${
          isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
        }`}>
          <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-rose-500" />
            {t.incidentsTitle}
          </h3>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className={`p-3 rounded-xl border flex justify-between items-start text-xs ${
                  inc.status === "resolved" 
                    ? "bg-slate-900/10 border-slate-900 text-slate-500"
                    : inc.severity === "high"
                    ? "bg-rose-950/20 border-rose-900/40 text-slate-200"
                    : "bg-slate-900/60 border-slate-850 text-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] uppercase font-extrabold tracking-widest ${
                      inc.status === "resolved"
                        ? "bg-slate-800 text-slate-500"
                        : inc.severity === "high"
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-amber-600 text-white"
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="font-bold text-slate-200">{inc.title}</span>
                    <span className="text-[10px] text-slate-500">@{inc.zone} | {inc.time}</span>
                  </div>
                  <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">{inc.description}</p>
                </div>

                {inc.status !== "resolved" && (
                  <button
                    onClick={() => handleResolveIncident(inc.id)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase transition-all"
                  >
                    <Check className="h-3 w-3" />
                    <span>{t.resolve}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI suggested actions */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
        }`}>
          <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
            <Users className="h-4 w-4 mr-2 text-fifa-gold" />
            {t.quickActions}
          </h3>

          <div className="space-y-3">
            {aiRecs.map((rec) => (
              <div
                key={rec.id}
                className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                  rec.severity === "high"
                    ? "bg-rose-950/20 border-rose-900/40 text-slate-200"
                    : "bg-slate-950 border-slate-900 text-slate-300"
                }`}
              >
                <div>{rec.text}</div>
                {rec.action && (
                  <button
                    onClick={rec.action}
                    className={`mt-2 flex items-center space-x-1 px-2.5 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                      isHC 
                        ? "bg-yellow-400 text-black hover:bg-yellow-500" 
                        : "bg-fifa-blue text-white hover:bg-blue-700"
                    }`}
                  >
                    <Wrench className="h-3 w-3" />
                    <span>{t.redeploy}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Injector Form (Only visible to Organizer) */}
      {role === "organizer" && (
        <form
          onSubmit={handleInjectIncident}
          className={`p-5 rounded-2xl border transition-all ${
            isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
          }`}
        >
          <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
            <PlusCircle className="h-4 w-4 mr-2 text-fifa-gold" />
            {t.simulateIncident}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="inc-title-input" className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Incident Title</label>
              <input
                id="inc-title-input"
                type="text"
                required
                value={incTitle}
                onChange={(e) => setIncTitle(e.target.value)}
                placeholder="e.g., Gate C ticket reader jammed"
                className={`w-full py-1.5 px-3 rounded-lg border text-xs focus:outline-none ${
                  isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-950 border-slate-850 text-white"
                }`}
              />
            </div>

            <div>
              <label htmlFor="inc-type-select" className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">{t.incidentType}</label>
              <select
                id="inc-type-select"
                value={incType}
                onChange={(e) => setIncType(e.target.value)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs focus:outline-none ${
                  isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-950 border-slate-850 text-white"
                }`}
              >
                <option value="crowd">Crowd Congestion</option>
                <option value="medical">Medical Incident</option>
                <option value="facility">Facility/Hardware</option>
                <option value="accessibility">ADA / Assist Needed</option>
              </select>
            </div>

            <div>
              <label htmlFor="inc-zone-select" className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">{t.incidentZone}</label>
              <select
                id="inc-zone-select"
                value={incZone}
                onChange={(e) => setIncZone(e.target.value)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs focus:outline-none ${
                  isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-950 border-slate-850 text-white"
                }`}
              >
                <option value="North Stand">North Stand</option>
                <option value="East Stand">East Stand</option>
                <option value="South Stand">South Stand (Fan Zone)</option>
                <option value="West Stand">West Stand</option>
              </select>
            </div>

            <div>
              <label htmlFor="inc-severity-select" className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">{t.severity}</label>
              <select
                id="inc-severity-select"
                value={incSeverity}
                onChange={(e) => setIncSeverity(e.target.value)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs focus:outline-none ${
                  isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-950 border-slate-850 text-white"
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  isHC
                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                    : "bg-fifa-red text-white hover:bg-red-700"
                }`}
              >
                {t.submitIncident}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
