import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import NavigationMap from "./components/NavigationMap";
import AIChat from "./components/AIChat";
import TransitHub from "./components/TransitHub";
import GreenZone from "./components/GreenZone";
import OpsDashboard from "./components/OpsDashboard";
import VolunteerHub from "./components/VolunteerHub";
import AccessibilityConfig from "./components/AccessibilityConfig";
import { STADIUMS, INITIAL_INCIDENTS } from "./data/mockData";
import { Accessibility } from "lucide-react";
import { db } from "./firebase";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";

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

  // Weather state (populated by Open-Meteo real-time REST API)
  const [weather, setWeather] = useState({
    temp: 24,
    humidity: 50,
    condition: "Clear Sky"
  });

  // Gates live state (modulated by simulation)
  const [gates, setGates] = useState(stadium.gates);
  
  // Incidents live state (modulated by simulation)
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  
  // Volunteer Tasks state
  const [volunteerTasks, setVolunteerTasks] = useState([
    { id: "task-1", title: "Check gate D ADA accessibility scanner", zone: "Gate D Access", priority: "high", status: "pending", assignedTime: "14:10" },
    { id: "task-2", title: "Distribute stadium maps at West Concourse", zone: "West Concourse", priority: "medium", status: "pending", assignedTime: "14:15" },
    { id: "task-3", title: "Assist recycling waste sorting game guidelines", zone: "Green Zone", priority: "low", status: "completed", assignedTime: "13:45" }
  ]);
  
  // Alerts ticker state
  const [alerts, setAlerts] = useState([]);
  const [showQuickAccess, setShowQuickAccess] = useState(false);

  // Sync gates state when active stadium changes (offline fallback)
  useEffect(() => {
    if (!db && stadium?.gates) {
      setGates(stadium.gates);
    }
  }, [stadium]);

  // Real-time gates synchronization with Firestore
  useEffect(() => {
    if (!db || !stadium?.id) return;

    const gatesColRef = collection(db, `stadiums/${stadium.id}/gates`);
    const unsubscribe = onSnapshot(gatesColRef, (snapshot) => {
      if (snapshot.empty) {
        // Initialize Firestore with default gates if empty
        stadium.gates.forEach(async (g) => {
          try {
            await setDoc(doc(gatesColRef, g.id), g);
          } catch (err) {
            console.warn("Failed initializing gate document in Firestore:", err.message);
          }
        });
      } else {
        const fetchedGates = snapshot.docs.map(doc => doc.data());
        // Sort to keep rendering order consistent
        fetchedGates.sort((a, b) => a.id.localeCompare(b.id));
        setGates(fetchedGates);
      }
    }, (error) => {
      console.warn("Firestore gates snapshot listener permission issue:", error.message);
      // Graceful offline fallback
      setGates(stadium.gates);
    });

    return () => unsubscribe();
  }, [stadium]);

  // Real-time incidents synchronization with Firestore
  useEffect(() => {
    if (!db) return;

    const incColRef = collection(db, "incidents");
    const unsubscribe = onSnapshot(incColRef, (snapshot) => {
      if (snapshot.empty) {
        // Initialize Firestore with default incidents if empty
        INITIAL_INCIDENTS.forEach(async (inc) => {
          try {
            await setDoc(doc(incColRef, inc.id), inc);
          } catch (err) {
            console.warn("Failed initializing incident document in Firestore:", err.message);
          }
        });
      } else {
        const fetchedIncidents = snapshot.docs.map(doc => doc.data());
        // Sort to keep order consistent
        fetchedIncidents.sort((a, b) => a.id.localeCompare(b.id));
        setIncidents(fetchedIncidents);
      }
    }, (error) => {
      console.warn("Firestore incidents snapshot listener permission issue:", error.message);
      // Graceful offline fallback
      setIncidents(INITIAL_INCIDENTS);
    });

    return () => unsubscribe();
  }, []);

  // Real-time volunteer tasks synchronization with Firestore
  useEffect(() => {
    if (!db) return;

    const tasksColRef = collection(db, "volunteer_tasks");
    const unsubscribe = onSnapshot(tasksColRef, (snapshot) => {
      if (snapshot.empty) {
        const defaultTasks = [
          { id: "task-1", title: "Check gate D ADA accessibility scanner", zone: "Gate D Access", priority: "high", status: "pending", assignedTime: "14:10" },
          { id: "task-2", title: "Distribute stadium maps at West Concourse", zone: "West Concourse", priority: "medium", status: "pending", assignedTime: "14:15" },
          { id: "task-3", title: "Assist recycling waste sorting game guidelines", zone: "Green Zone", priority: "low", status: "completed", assignedTime: "13:45" }
        ];
        defaultTasks.forEach(async (t) => {
          try {
            await setDoc(doc(tasksColRef, t.id), t);
          } catch (err) {
            console.warn("Failed initializing volunteer task in Firestore:", err.message);
          }
        });
      } else {
        const fetchedTasks = snapshot.docs.map(doc => doc.data());
        // Sort to keep order consistent
        fetchedTasks.sort((a, b) => b.id.localeCompare(a.id));
        setVolunteerTasks(fetchedTasks);
      }
    }, (error) => {
      console.warn("Firestore volunteer tasks snapshot listener issue:", error.message);
    });

    return () => unsubscribe();
  }, []);

  const handleSetVolunteerTasks = (value) => {
    if (typeof value === "function") {
      setVolunteerTasks(prev => {
        const next = value(prev);
        if (db) {
          next.forEach(async (t) => {
            try {
              await setDoc(doc(db, "volunteer_tasks", t.id), t);
            } catch (err) {
              console.warn("Failed to sync volunteer task to Firestore:", err.message);
            }
          });
        }
        return next;
      });
    } else {
      setVolunteerTasks(value);
      if (db && Array.isArray(value)) {
        value.forEach(async (t) => {
          try {
            await setDoc(doc(db, "volunteer_tasks", t.id), t);
          } catch (err) {
            console.warn("Failed to sync volunteer task to Firestore:", err.message);
          }
        });
      }
    }
  };

  // Intercept state changes to synchronize with Firestore database
  const handleSetGates = (value) => {
    if (typeof value === "function") {
      setGates(prev => {
        const next = value(prev);
        if (db && stadium?.id) {
          next.forEach(async (g) => {
            try {
              await setDoc(doc(db, `stadiums/${stadium.id}/gates`, g.id), g);
            } catch (err) {
              console.warn("Failed to sync gate to Firestore:", err.message);
            }
          });
        }
        return next;
      });
    } else {
      setGates(value);
      if (db && stadium?.id && Array.isArray(value)) {
        value.forEach(async (g) => {
          try {
            await setDoc(doc(db, `stadiums/${stadium.id}/gates`, g.id), g);
          } catch (err) {
            console.warn("Failed to sync gate to Firestore:", err.message);
          }
        });
      }
    }
  };

  const handleSetIncidents = (value) => {
    if (typeof value === "function") {
      setIncidents(prev => {
        const next = value(prev);
        if (db) {
          next.forEach(async (inc) => {
            try {
              await setDoc(doc(db, "incidents", inc.id), inc);
            } catch (err) {
              console.warn("Failed to sync incident to Firestore:", err.message);
            }
          });
        }
        return next;
      });
    } else {
      setIncidents(value);
      if (db && Array.isArray(value)) {
        value.forEach(async (inc) => {
          try {
            await setDoc(doc(db, "incidents", inc.id), inc);
          } catch (err) {
            console.warn("Failed to sync incident to Firestore:", err.message);
          }
        });
      }
    }
  };

  // Fetch real-time weather data from Open-Meteo REST API
  useEffect(() => {
    async function fetchWeather() {
      if (!stadium || typeof stadium.lat !== "number" || typeof stadium.lon !== "number") return;
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${stadium.lat}&longitude=${stadium.lon}&current=temperature_2m,relative_humidity_2m,weather_code`);
        if (res.ok) {
          const data = await res.json();
          const weatherMap = {
            0: "Clear Sky",
            1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing Rime Fog",
            51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
            61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
            71: "Slight Snowfall", 73: "Moderate Snowfall", 75: "Heavy Snowfall",
            80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
            95: "Thunderstorm"
          };
          const code = data.current?.weather_code;
          const condition = weatherMap[code] || "Clear Sky";
          
          setWeather({
            temp: Math.round(data.current?.temperature_2m ?? (stadium.id === "azteca" ? 28 : stadium.id === "bcplace" ? 19 : 24)),
            humidity: data.current?.relative_humidity_2m ?? 50,
            condition
          });
        }
      } catch (e) {
        console.warn("Failed to fetch real-time weather from Open-Meteo, falling back to stadium defaults:", e);
        setWeather({
          temp: stadium.id === "azteca" ? 28 : stadium.id === "bcplace" ? 19 : 24,
          humidity: 50,
          condition: "Clear Sky"
        });
      }
    }
    fetchWeather();
  }, [stadium]);

  // Sync alerts ticker with active stadium open incidents
  useEffect(() => {
    if (!stadium?.id) return;
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

  const chatComponent = (
    <AIChat
      role={role}
      stadium={stadium}
      timePhase={timePhase}
      accessibility={accessibility}
      language={language}
      gates={gates}
      incidents={incidents}
      weather={weather}
    />
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "map":
        return (
          <NavigationMap
            stadium={stadium}
            accessibility={accessibility}
            language={language}
            gates={gates}
            zones={stadium?.zones || []}
          />
        );
      case "transit":
        return (
          <TransitHub
            stadium={stadium}
            timePhase={timePhase}
            language={language}
            accessibility={accessibility}
            weather={weather}
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
            setGates={handleSetGates}
            incidents={incidents}
            setIncidents={handleSetIncidents}
            addAlert={addAlert}
          />
        );
      case "volunteer-hub":
        return (
          <VolunteerHub
            volunteerTasks={volunteerTasks}
            setVolunteerTasks={handleSetVolunteerTasks}
            accessibility={accessibility}
            language={language}
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
      chatComponent={chatComponent}
      weather={weather}
    >
      <div className="space-y-5">
        
        {/* Active Tab Screen */}
        <section 
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="transition-all duration-300"
        >
          {renderActiveTabContent()}
        </section>

        {/* Accessibility configurations panel */}
        <section className="mt-8 border-t border-slate-900 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest flex items-center">
              <Accessibility className="h-4 w-4 mr-1 text-fifa-gold" />
              Dynamic Comfort & Accessibility Settings
            </h3>
            <button
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                showQuickAccess
                  ? (accessibility.highContrast ? "bg-yellow-400 text-black border-yellow-400" : "bg-slate-800 text-slate-100 border-slate-700")
                  : "bg-slate-900 border-slate-850 text-slate-405 hover:text-slate-200"
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
