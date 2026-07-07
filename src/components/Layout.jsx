import React, { useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translation";
import { STADIUMS } from "../data/mockData";
import { 
  Shield, 
  Map, 
  MessageSquare, 
  Navigation, 
  Leaf, 
  Globe, 
  Bell, 
  Clock, 
  User, 
  Menu,
  X,
  Thermometer,
  Ticket
} from "lucide-react";

export default function Layout({
  role,
  setRole,
  stadium,
  setStadium,
  timePhase,
  setTimePhase,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  accessibility,
  alerts,
  chatComponent,
  children
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systime, setSystime] = useState("18:35");
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Clock progression
  useEffect(() => {
    const timer = setInterval(() => {
      const parts = systime.split(":");
      let min = parseInt(parts[1]) + 1;
      let hr = parseInt(parts[0]);
      if (min >= 60) {
        min = 0;
        hr = (hr + 1) % 24;
      }
      setSystime(`${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    }, 15000);
    return () => clearInterval(timer);
  }, [systime]);

  // Adjust active tab if switching roles hides the current tab
  useEffect(() => {
    const isOps = role === "staff" || role === "organizer";
    if (activeTab === "command-center" && !isOps) {
      setActiveTab("map");
    }
  }, [role, activeTab, setActiveTab]);

  // Determine match metadata based on stadium and timePhase
  const getMatchCardDetails = () => {
    let match = "USA vs Germany";
    let type = "Quarter-Finals";
    let kickoffMsg = "Kickoff in 1h 25m";
    let temp = "24°C";

    if (stadium.id === "azteca") {
      match = "Mexico vs Italy";
      type = "Opening Match";
      temp = "28°C";
    } else if (stadium.id === "bcplace") {
      match = "Canada vs France";
      type = "Group Stage - Group A";
      temp = "19°C";
    }

    if (timePhase === "mid-match") {
      kickoffMsg = "LIVE • 2nd Half (1 - 1)";
    } else if (timePhase === "post-match") {
      kickoffMsg = "Final Score (2 - 1) • Egress active";
    }

    return { match, type, kickoffMsg, temp };
  };

  const matchDetails = getMatchCardDetails();

  // Desktop tabs: hide Chat since it's permanently docked on the right
  const desktopNavItems = [
    { id: "map", label: t.tabWayfinding, icon: Map },
    { id: "transit", label: t.tabTransit, icon: Navigation },
    { id: "sustainability", label: t.tabSustainability, icon: Leaf },
  ];

  // Mobile tabs: include Chat since it needs to toggle full-screen
  const mobileNavItems = [
    { id: "map", label: t.tabWayfinding, icon: Map },
    { id: "chat", label: t.tabAIChat, icon: MessageSquare },
    { id: "transit", label: t.tabTransit, icon: Navigation },
    { id: "sustainability", label: t.tabSustainability, icon: Leaf },
  ];

  const isOps = role === "staff" || role === "organizer";
  if (isOps) {
    desktopNavItems.push({ id: "command-center", label: t.tabCommandCenter, icon: Shield });
    mobileNavItems.push({ id: "command-center", label: t.tabCommandCenter, icon: Shield });
  }

  const isHC = accessibility.highContrast;
  const contrastClass = isHC 
    ? "bg-black text-yellow-300 border-yellow-400 dark-hc" 
    : "bg-slate-950 text-slate-100 border-slate-900";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${contrastClass} ${accessibility.largeText ? 'text-lg' : 'text-sm'}`}>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        isHC 
          ? "border-yellow-400 bg-black text-yellow-300" 
          : "border-slate-900/60 bg-slate-950/80 text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div aria-hidden="true" className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-red-500 to-yellow-500 flex items-center justify-center font-black text-white shadow-lg tracking-wider text-base">
              F
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight uppercase flex items-center text-sm sm:text-base">
                {t.appName}
                <span className="ml-2 hidden md:inline-block px-2 py-0.5 text-[9px] bg-fifa-red text-white uppercase rounded tracking-widest font-bold">
                  2026
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Clock */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800/80 rounded-full px-3 py-1 text-xs">
              <Clock className="h-3.5 w-3.5 text-fifa-gold animate-pulse" />
              <span className="font-mono text-slate-350">{systime} MDT</span>
            </div>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Context Bar */}
      <section className={`border-b transition-all duration-300 ${
        isHC 
          ? "border-yellow-400 bg-neutral-900 text-yellow-300" 
          : "border-slate-900/40 bg-slate-900/40 text-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-4xl">
            {/* Role Select */}
            <div className="flex flex-col">
              <label htmlFor="role-select" className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5 flex items-center">
                <User className="h-3 w-3 mr-1 text-fifa-gold" /> {t.roleSelector}
              </label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label={t.roleSelector}
                className={`py-1 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  isHC 
                    ? "bg-black border-yellow-400 text-yellow-300" 
                    : "bg-slate-950 border-slate-850/60 text-slate-200 focus:ring-fifa-gold"
                }`}
              >
                <option value="fan">⚽ {t.fan}</option>
                <option value="volunteer">🙋 {t.volunteer}</option>
                <option value="staff">🔧 {t.staff}</option>
                <option value="organizer">📡 {t.organizer}</option>
              </select>
            </div>

            {/* Stadium Select */}
            <div className="flex flex-col">
              <label htmlFor="venue-select" className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5 flex items-center">
                <Map className="h-3 w-3 mr-1 text-fifa-gold" /> {t.stadiumSelector}
              </label>
              <select
                id="venue-select"
                value={stadium.id}
                onChange={(e) => setStadium(STADIUMS[e.target.value])}
                aria-label={t.stadiumSelector}
                className={`py-1 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  isHC 
                    ? "bg-black border-yellow-400 text-yellow-300" 
                    : "bg-slate-950 border-slate-850/60 text-slate-200 focus:ring-fifa-gold"
                }`}
              >
                {Object.values(STADIUMS).map(st => (
                  <option key={st.id} value={st.id}>🏟️ {st.name} ({st.city})</option>
                ))}
              </select>
            </div>

            {/* Match Phase Select */}
            <div className="flex flex-col">
              <label htmlFor="phase-select" className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5 flex items-center">
                <Clock className="h-3 w-3 mr-1 text-fifa-gold" /> {t.timeSelector}
              </label>
              <select
                id="phase-select"
                value={timePhase}
                onChange={(e) => setTimePhase(e.target.value)}
                aria-label={t.timeSelector}
                className={`py-1 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  isHC 
                    ? "bg-black border-yellow-400 text-yellow-300" 
                    : "bg-slate-950 border-slate-850/60 text-slate-200 focus:ring-fifa-gold"
                }`}
              >
                <option value="pre-match">🕒 {t.preMatch}</option>
                <option value="mid-match">🏃 {t.midMatch}</option>
                <option value="post-match">🚶 {t.postMatch}</option>
              </select>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1.5 self-end lg:self-center">
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <div className="flex bg-slate-950 border border-slate-900 rounded-lg p-0.5">
              {["en", "es", "fr"].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  aria-label={`Switch language to ${lang.toUpperCase()}`}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                    language === lang 
                      ? (isHC ? "bg-yellow-400 text-black" : "bg-fifa-blue text-white")
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Matchday Ticket Hero Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className={`p-4 rounded-2xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow ${
          isHC
            ? "bg-black border-yellow-400 text-yellow-300"
            : "bg-gradient-to-r from-slate-900/90 to-slate-950/90 backdrop-blur border-slate-800/80"
        }`}>
          {/* Background Ticket details */}
          <div className="absolute -right-4 -bottom-8 opacity-5 text-fifa-gold scale-150 transform rotate-12 pointer-events-none">
            <Ticket className="h-32 w-32" />
          </div>

          <div className="flex items-center space-x-3.5">
            <span className={`p-3 rounded-xl shrink-0 ${
              isHC ? 'bg-black text-yellow-400 border border-yellow-400' : 'bg-fifa-gold/15 text-fifa-gold'
            }`}>
              <Ticket className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center space-x-2 text-[9px] uppercase font-black text-fifa-gold tracking-widest">
                <span>{matchDetails.type}</span>
                <span>•</span>
                <span>{stadium.name}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5 text-slate-100 uppercase">
                {matchDetails.match}
              </h2>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 self-end md:self-center">
            <div className="text-right">
              <div className="text-[9px] uppercase font-bold text-slate-500">Live Status</div>
              <div className={`text-xs font-black uppercase flex items-center ${
                timePhase === "mid-match" ? "text-fifa-red animate-pulse" : "text-emerald-400"
              }`}>
                {timePhase === "mid-match" && <span className="h-1.5 w-1.5 bg-fifa-red rounded-full mr-1.5 animate-ping"></span>}
                {matchDetails.kickoffMsg}
              </div>
            </div>

            <div className={`h-8 w-[1px] ${isHC ? 'bg-yellow-400' : 'bg-slate-900'}`}></div>

            <div className="flex items-center space-x-1.5" aria-label={`Temperature: ${matchDetails.temp}`}>
              <Thermometer className="h-4.5 w-4.5 text-slate-400" />
              <div className="text-xs font-bold text-slate-350">{matchDetails.temp}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Alerts ticker */}
      {alerts && alerts.length > 0 && (
        <div className="bg-fifa-red/90 text-white py-1.5 px-4 overflow-hidden relative shadow-inner mt-4">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto">
            <Bell className="h-4 w-4 animate-bounce shrink-0" />
            <div className="text-[10px] font-black uppercase tracking-wider animate-pulse shrink-0">
              {t.alerts}:
            </div>
            <div className="relative w-full overflow-hidden h-4">
              <div className="absolute flex space-x-8 whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                {alerts.map((al, index) => (
                  <span key={index} className="font-bold text-xs text-white">
                    ⚠️ [{al.time}] {al.title} - {al.description}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Dashboard */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row gap-5">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block w-52 shrink-0">
          <nav role="tablist" aria-label="Stadium Sections" className="flex flex-col space-y-1">
            {desktopNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  id={`tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  aria-label={`Navigate to ${item.label}`}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl border text-left font-bold text-[10px] uppercase tracking-wider transition-all duration-200 ${
                    isActive 
                      ? (isHC 
                          ? "bg-yellow-400 border-yellow-400 text-black" 
                          : "bg-gradient-to-r from-fifa-blue to-blue-750 border-blue-650 text-white shadow shadow-blue-900/30") 
                      : (isHC
                          ? "bg-black border-yellow-400 text-yellow-300 hover:bg-neutral-900"
                          : "bg-slate-900/30 border-slate-900/60 text-slate-455 hover:bg-slate-900/60 hover:text-slate-200")
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md pt-20 px-6 flex flex-col space-y-4">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close mobile menu"
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <h2 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">Navigation</h2>
            <div role="tablist" aria-label="Mobile Navigation" className="flex flex-col space-y-3">
              {mobileNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${item.id}`}
                    id={`mob-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    aria-label={`Navigate to ${item.label}`}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl border text-left font-bold text-sm uppercase tracking-wide transition-all ${
                      isActive 
                        ? "bg-fifa-blue border-blue-600 text-white" 
                        : "bg-slate-900 border-slate-900 text-slate-350"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Central screen (2/3 width on desktop) */}
        <main className="flex-1 min-w-0 bg-slate-950/10 rounded-2xl">
          {activeTab === "chat" ? (
            <div className="lg:hidden">{chatComponent}</div>
          ) : (
            children
          )}
        </main>

        {/* Docked AI Chat Companion (1/3 width, desktop only) */}
        {activeTab !== "chat" && (
          <aside className="hidden lg:block w-80 xl:w-[350px] shrink-0 self-start sticky top-20">
            {chatComponent}
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className={`mt-auto border-t py-4 text-center text-xs transition-colors duration-300 ${
        isHC 
          ? "border-yellow-400 bg-black text-yellow-300" 
          : "border-slate-900/60 bg-slate-950 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} FIFA World Cup 2026 - Smart Stadium Assistant
          </div>
          <div className="flex space-x-4">
            <span className="font-semibold text-fifa-gold">Vibe-Coded Matchday Cockpit</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping mr-1"></span>
              All nodes active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
