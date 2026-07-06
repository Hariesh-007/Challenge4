import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import NavigationMap from "./components/NavigationMap";
import AIChat from "./components/AIChat";
import TransitHub from "./components/TransitHub";
import GreenZone from "./components/GreenZone";
import OpsDashboard from "./components/OpsDashboard";
import AccessibilityConfig from "./components/AccessibilityConfig";
import { STADIUMS, INITIAL_INCIDENTS } from "./data/mockData";
import { Accessibility, Eye, HelpCircle } from "lucide-react";

export default function App() {
  const [role, setRole] = useState("fan");
  const [stadium, setStadium] = useState(STADIUMS.metlife);
  const [timePhase, setTimePhase] = useState("pre-match");
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("map");
  
  // Accessibility state
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false,
    ttsActive: false,
    wheelchairRoute: false,
    sensoryRoute: false
  });

  // Gates live state (modulated by simulation)
  const [gates, setGates] = useState(stadium.gates);
  
  // Incidents live state (modulated by simulation)
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  
  // Alerts ticker state
  const [alerts, setAlerts] = useState([]);
  const [showQuickAccess, setShowQuickAccess] = useState(false);

  // Sync gates state when active stadium changes
  useEffect(() => {
    setGates(stadium.gates);
  }, [stadium]);

  // Sync alerts ticker with active stadium open incidents
  useEffect(() => {
    const activeStIncidents = incidents.filter(
      inc => inc.stadium === stadium.id && inc.status === "open"
    );
    const mappedAlerts = activeStIncidents.map(inc => ({
      time: inc.time,
      title: inc.title,
      description: inc.description
    }));
    setAlerts(mappedAlerts);
  }, [stadium, incidents]);

  const addAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "map":
        return (
          <NavigationMap
            role={role}
            stadium={stadium}
            accessibility={accessibility}
            language={language}
            gates={gates}
            zones={stadium.zones}
          />
        );
      case "chat":
        return (
          <AIChat
            role={role}
            stadium={stadium}
            timePhase={timePhase}
            accessibility={accessibility}
            language={language}
            gates={gates}
            incidents={incidents}
          />
        );
      case "transit":
        return (
          <TransitHub
            role={role}
            stadium={stadium}
            timePhase={timePhase}
            language={language}
            accessibility={accessibility}
          />
        );
      case "sustainability":
        return (
          <GreenZone
            stadium={stadium}
            language={language}
            accessibility={accessibility}
          />
        );
      case "command-center":
        return (
          <OpsDashboard
            role={role}
            stadium={stadium}
            language={language}
            accessibility={accessibility}
            gates={gates}
            setGates={setGates}
            incidents={incidents}
            setIncidents={setIncidents}
            addAlert={addAlert}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <Layout
      role={role}
      setRole={setRole}
      stadium={stadium}
      setStadium={setStadium}
      timePhase={timePhase}
      setTimePhase={setTimePhase}
      language={language}
      setLanguage={setLanguage}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      accessibility={accessibility}
      setAccessibility={setAccessibility}
      alerts={alerts}
    >
      <div className="space-y-6">
        
        {/* Active Tab Screen */}
        <section className="transition-all duration-300">
          {renderActiveTabContent()}
        </section>

        {/* Quick Accessibility Config Section - always anchorable */}
        <section className="mt-8 border-t border-slate-900 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest flex items-center">
              <Accessibility className="h-4 w-4 mr-1 text-fifa-gold" />
              Dynamic Comfort & Accessibility Settings
            </h4>
            <button
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                showQuickAccess
                  ? (accessibility.highContrast ? "bg-yellow-400 text-black border-yellow-400" : "bg-slate-800 text-slate-100 border-slate-700")
                  : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
              }`}
            >
              {showQuickAccess ? "Hide Panel" : "Expand Panels"}
            </button>
          </div>
          {showQuickAccess && (
            <div className="animate-fade-in">
              <AccessibilityConfig
                accessibility={accessibility}
                setAccessibility={setAccessibility}
                language={language}
              />
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
