import React from "react";
import { TRANSLATIONS } from "../data/translation";
import { 
  Eye, 
  Accessibility, 
  Volume2, 
  Ear, 
  Smile, 
  MapPin,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function AccessibilityConfig({
  accessibility,
  setAccessibility,
  language
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHC = accessibility.highContrast;

  const toggleSetting = (key) => {
    setAccessibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Custom Toggle switch renderer
  const ToggleSwitch = ({ active, onClick }) => (
    <button onClick={onClick} className="focus:outline-none transition-colors">
      {active ? (
        <ToggleRight className={`h-8 w-8 ${isHC ? 'text-yellow-400' : 'text-emerald-500'}`} />
      ) : (
        <ToggleLeft className="h-8 w-8 text-slate-650" />
      )}
    </button>
  );

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      isHC 
        ? "bg-black border-yellow-400 text-yellow-300" 
        : "bg-slate-900/40 backdrop-blur-lg border-slate-800 text-slate-100"
    }`}>
      <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
        <Accessibility className="h-4.5 w-4.5 text-fifa-gold mr-2" />
        {t.accessTitle}
      </h3>

      {/* Control Switchboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { key: "highContrast", label: t.highContrast, desc: "Neon/dark contrast for visibility", icon: Eye },
          { key: "largeText", label: t.largeText, desc: "Increases global font readability", icon: Accessibility },
          { key: "ttsActive", label: t.ttsActive, desc: "AI answers are read aloud via voice", icon: Volume2 },
          { key: "wheelchairRoute", label: t.wheelchairReq, desc: "Step-free pathfinding with lifts", icon: MapPin },
          { key: "sensoryRoute", label: t.sensorySens, desc: "Avoids high-crowd stand zones", icon: Smile }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.key} 
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isHC ? "bg-neutral-950 border-yellow-400" : "bg-slate-950/40 border-slate-900"
              }`}
            >
              <div className="flex space-x-3 items-start pr-2">
                <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  <Icon className="h-4.5 w-4.5 text-fifa-gold" />
                </span>
                <div>
                  <h4 className="font-bold text-xs text-slate-200">{item.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{item.desc}</p>
                </div>
              </div>
              <ToggleSwitch 
                active={accessibility[item.key]} 
                onClick={() => toggleSetting(item.key)} 
              />
            </div>
          );
        })}
      </div>

      {/* Support Persona Guidances */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">
          Accessibility Services Directory
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wheelchair Guide */}
          <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-900 text-xs">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5 uppercase text-[10px] tracking-wider text-sky-400">
              <Accessibility className="h-3.5 w-3.5" /> Mobility & Wheelchairs
            </h5>
            <ul className="space-y-1 text-[10px] text-slate-400 pl-3 list-disc">
              <li>Lifts connect Gates A, B, and D to both concourse levels.</li>
              <li>Priority seating and companion spots are situated in Sections 110 & 220.</li>
              <li>Ask volunteers for wheelchair loaners or golf cart parking shuttle tags.</li>
            </ul>
          </div>

          {/* Sensory sensitive Guide */}
          <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-900 text-xs">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">
              <Smile className="h-3.5 w-3.5" /> Sensory & Neurodivergent
            </h5>
            <ul className="space-y-1 text-[10px] text-slate-400 pl-3 list-disc">
              <li>Noise-canceling earmuffs are available at all Information Desks.</li>
              <li>Decompression quiet rooms feature weighted lap pads, soft lights, and bubble tubes.</li>
              <li>Use the "Sensory Route" in wayfinding to bypass noisy concert speakers.</li>
            </ul>
          </div>

          {/* Blind / Low Vision Guide */}
          <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-900 text-xs">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5 uppercase text-[10px] tracking-wider text-amber-400">
              <Eye className="h-3.5 w-3.5" /> Blind & Low-Vision
            </h5>
            <ul className="space-y-1 text-[10px] text-slate-400 pl-3 list-disc">
              <li>All gates and lifts display high-contrast tactile Braille indicators.</li>
              <li>Toggle "TTS Active" to have AI text answers read aloud automatically.</li>
              <li>Dedicated audio commentary headsets are available for pickup at Guest Services.</li>
            </ul>
          </div>

          {/* Deaf / Hard of hearing Guide */}
          <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-900 text-xs">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5 uppercase text-[10px] tracking-wider text-rose-400">
              <Ear className="h-3.5 w-3.5" /> Deaf & Hard-of-Hearing
            </h5>
            <ul className="space-y-1 text-[10px] text-slate-400 pl-3 list-disc">
              <li>Sign language interpreters (ASL / LSM / LSQ) are stationed at main entries.</li>
              <li>Stadium jumbotrons display open-captions for all referee and stage announcements.</li>
              <li>Assisted listening loops (induction) are active in VIP & general stands.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
