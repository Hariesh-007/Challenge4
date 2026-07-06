import React, { useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translation";
import { STADIUMS } from "../data/mockData";
import { 
  Shield, 
  Map, 
  MessageSquare, 
  Navigation, 
  Leaf, 
  Eye, 
  Globe, 
  Bell, 
  Clock, 
  User, 
  HelpCircle,
  Menu,
  X
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
  setAccessibility,
  alerts,
  children
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systime, setSystime] = useState("18:35");
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Sync clock to matchday mock time (counting up slowly or showing static matching the metadata time)
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

  const navItems = [
    { id: "map", label: t.tabWayfinding, icon: Map },
    { id: "chat", label: t.tabAIChat, icon: MessageSquare },
    { id: "transit", label: t.tabTransit, icon: Navigation },
    { id: "sustainability", label: t.tabSustainability, icon: Leaf },
  ];

  // Show command center for staff and organizers
  if (role === "staff" || role === "organizer") {
    navItems.push({ id: "command-center", label: t.tabCommandCenter, icon: Shield });
  }

  // Accessibility styling helper
  const contrastClass = accessibility.highContrast 
    ? "bg-black text-yellow-300 border-yellow-400" 
    : "bg-slate-950 text-slate-100 border-slate-800";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${contrastClass} ${accessibility.largeText ? 'text-lg' : 'text-sm'}`}>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        accessibility.highContrast 
          ? "border-yellow-400 bg-black text-yellow-300" 
          : "border-slate-800 bg-slate-950/80 text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* FIFA-style modern emblem */}
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 via-red-500 to-yellow-500 flex items-center justify-center font-bold text-white shadow-lg tracking-wider text-base">
              F
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight uppercase flex items-center text-base sm:text-lg">
                {t.appName}
                <span className="ml-2 hidden md:inline-block px-2 py-0.5 text-xs bg-fifa-red text-white uppercase rounded tracking-widest font-normal">
                  2026
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">{t.tagline}</p>
            </div>
          </div>

          {/* Clock and Live Alert Pill */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs">
              <Clock className="h-3.5 w-3.5 text-fifa-gold animate-pulse" />
              <span className="font-mono text-slate-300">{systime} MDT</span>
            </div>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Context Bar */}
      <section className={`border-b transition-all duration-300 ${
        accessibility.highContrast 
          ? "border-yellow-400 bg-neutral-900 text-yellow-300" 
          : "border-slate-900 bg-slate-900/60 text-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-4xl">
            {/* Role Select */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center">
                <User className="h-3 w-3 mr-1 text-fifa-gold" /> {t.roleSelector}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  accessibility.highContrast 
                    ? "bg-black border-yellow-400 text-yellow-300 focus:ring-yellow-400" 
                    : "bg-slate-950 border-slate-800 text-white focus:ring-fifa-gold"
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
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center">
                <Map className="h-3 w-3 mr-1 text-fifa-gold" /> {t.stadiumSelector}
              </label>
              <select
                value={stadium.id}
                onChange={(e) => setStadium(STADIUMS[e.target.value])}
                className={`py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  accessibility.highContrast 
                    ? "bg-black border-yellow-400 text-yellow-300 focus:ring-yellow-400" 
                    : "bg-slate-950 border-slate-800 text-white focus:ring-fifa-gold"
                }`}
              >
                {Object.values(STADIUMS).map(st => (
                  <option key={st.id} value={st.id}>🏟️ {st.name} ({st.city})</option>
                ))}
              </select>
            </div>

            {/* Match Phase Select */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center">
                <Clock className="h-3 w-3 mr-1 text-fifa-gold" /> {t.timeSelector}
              </label>
              <select
                value={timePhase}
                onChange={(e) => setTimePhase(e.target.value)}
                className={`py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 ${
                  accessibility.highContrast 
                    ? "bg-black border-yellow-400 text-yellow-300 focus:ring-yellow-400" 
                    : "bg-slate-950 border-slate-800 text-white focus:ring-fifa-gold"
                }`}
              >
                <option value="pre-match">🕒 {t.preMatch}</option>
                <option value="mid-match">🏃 {t.midMatch}</option>
                <option value="post-match">🚶 {t.postMatch}</option>
              </select>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-3 self-end lg:self-center border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800 w-full lg:w-auto justify-end">
            {/* Language Selector */}
            <div className="flex items-center space-x-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                {["en", "es", "fr"].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      language === lang 
                        ? (accessibility.highContrast ? "bg-yellow-400 text-black" : "bg-fifa-blue text-white")
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic Alert Ticker */}
      {alerts && alerts.length > 0 && (
        <div className="bg-fifa-red text-white py-1.5 px-4 overflow-hidden relative shadow-inner">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto">
            <Bell className="h-4 w-4 animate-bounce shrink-0" />
            <div className="text-xs font-bold uppercase tracking-wider animate-pulse shrink-0">
              {t.alerts}:
            </div>
            <div className="relative w-full overflow-hidden h-4">
              <div className="absolute flex space-x-8 whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                {alerts.map((al, index) => (
                  <span key={index} className="font-semibold text-xs text-white">
                    ⚠️ [{al.time}] {al.title} - {al.description}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout Content wrapper */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="flex flex-col space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border text-left font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                    isActive 
                      ? (accessibility.highContrast 
                          ? "bg-yellow-400 border-yellow-400 text-black" 
                          : "bg-gradient-to-r from-fifa-blue to-blue-700 border-blue-600 text-white shadow-md shadow-blue-900/30") 
                      : (accessibility.highContrast
                          ? "bg-black border-yellow-400 text-yellow-300 hover:bg-neutral-900"
                          : "bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200")
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md pt-20 px-6 flex flex-col space-y-4">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <h2 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">Navigation</h2>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl border text-left font-bold text-sm uppercase tracking-wide transition-all ${
                    isActive 
                      ? "bg-fifa-blue border-blue-600 text-white shadow-md" 
                      : "bg-slate-900 border-slate-900 text-slate-300"
                  }`}
                >
                  <Icon className="h-5 w-5 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Central Content Area */}
        <main className="flex-1 min-w-0 bg-slate-950/20 rounded-2xl">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={`mt-auto border-t py-4 text-center text-xs transition-colors duration-300 ${
        accessibility.highContrast 
          ? "border-yellow-400 bg-black text-yellow-300" 
          : "border-slate-900 bg-slate-950 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} FIFA World Cup 2026 - Smart Stadium Assistant
          </div>
          <div className="flex space-x-4">
            <span className="font-semibold text-fifa-gold">Vibe-Coded Production Ready</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping mr-1"></span>
              All nodes responsive
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
