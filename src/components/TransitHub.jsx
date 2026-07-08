import React, { useState } from "react";
import { TRANSLATIONS } from "../data/translation";
import { TRANSIT_OPTIONS } from "../data/mockData";
import { 
  Leaf, 
  Train, 
  Bus, 
  Car, 
  Footprints, 
  Clock, 
  MapPin, 
  AlertCircle
} from "lucide-react";

export default function TransitHub({
  stadium,
  timePhase,
  language,
  accessibility,
  weather
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [distance, setDistance] = useState(15); // standard mock distance in km

  const getIcon = (iconName) => {
    switch (iconName) {
      case "train": return Train;
      case "bus": return Bus;
      case "car": return Car;
      default: return Footprints;
    }
  };

  // Dynamic AI Commute Recommendation based on context (weather, distance, timePhase)
  const getAISmartTransitRecommendation = () => {
    let modeName = "";
    let reason = "";

    if (distance <= 3) {
      if (weather && (weather.condition.toLowerCase().includes("rain") || weather.condition.toLowerCase().includes("snow") || weather.condition.toLowerCase().includes("thunderstorm"))) {
        modeName = language === "es" ? "Lanzaderas Rápidas" : language === "fr" ? "Navettes Rapides" : "Rapid Shuttles";
        reason = language === "es" 
          ? "Debido a la lluvia/tormenta, recomendamos el servicio de enlace gratuito en lugar de caminar."
          : language === "fr"
          ? "En raison de la pluie/orage, nous recommandons la navette gratuite plutôt que la marche."
          : "Due to ongoing precipitation, we recommend the free rapid shuttle loops over walking.";
      } else {
        modeName = language === "es" ? "Caminar / Peatonal" : language === "fr" ? "Marche / Piéton" : "Pedestrian Egress / Walk";
        reason = language === "es"
          ? "Para distancias cortas (<3 km), caminar reduce las emisiones a cero y evita las filas de tránsito."
          : language === "fr"
          ? "Pour de courtes distances (<3 km), la marche réduit vos émissions à zéro et contourne les bouchons."
          : "For short distances (<3 km), walking offsets emissions completely and bypasses transit queues.";
      }
    } else if (timePhase === "post-match") {
      modeName = language === "es" ? "Línea de Tren Eléctrico" : language === "fr" ? "RER Électrique" : "Electric Rail Link";
      reason = language === "es"
        ? "La zona de taxis compartidos tiene congestión crítica. El tren eléctrico tiene vía prioritaria."
        : language === "fr"
        ? "La zone VTC est saturée. Le RER électrique dispose d'une voie prioritaire pour évacuer rapidement."
        : "Rideshare zones are gridlocked post-match. The Electric Rail Link runs on dedicated tracks for rapid egress.";
    } else {
      modeName = language === "es" ? "Metro Express / Lanzaderas" : language === "fr" ? "Métro Express / Navettes" : "Express Metro / Shuttles";
      reason = language === "es"
        ? "El Metro Express ofrece el mejor balance de velocidad, bajo costo y reducción de huella de carbono."
        : language === "fr"
        ? "Le Métro Express offre le meilleur équilibre de vitesse, coût réduit et faible émission de carbone."
        : "Express Metro / Shuttles offer the optimal balance of speed, low cost, and minimal carbon footprint.";
    }

    return { modeName, reason };
  };

  const aiRec = getAISmartTransitRecommendation();

  // Phase specific transit alerts
  const getPhaseTransitTip = () => {
    if (timePhase === "pre-match") {
      return {
        title: language === "es" ? "Recomendación Pre-Partido" : language === "fr" ? "Conseil Avant-Match" : "Pre-Match Arrival Advice",
        text: language === "es"
          ? "Las puertas del estadio abren 3 horas antes del silbatazo. Se recomienda llegar en Metro antes de las 16:30 para evitar congestiones en los torniquetes de entrada."
          : language === "fr"
          ? "Ouverture des grilles 3h avant le match. Utilisez le Métro avant 16h30 pour éviter l'engorgement des portillons d'accès."
          : "Stadium gates open 3 hours prior to kickoff. We highly suggest arriving via Rapid Rail before 16:30 to bypass bag-check queues."
      };
    } else if (timePhase === "mid-match") {
      return {
        title: language === "es" ? "Servicios Durante el Partido" : language === "fr" ? "Transports Pendant le Match" : "Mid-Match Transit Update",
        text: language === "es"
          ? "El tren ligero y los autobuses circulan con horario reducido durante el partido. Los servicios rápidos completos se reanudarán al minuto 75."
          : language === "fr"
          ? "Le métro fonctionne à fréquence réduite pendant le jeu. Le service complet reprendra à la 75ème minute pour la sortie."
          : "Rapid transit and shuttles run on a reduced frequency during game time. Full high-capacity egress service restarts at the 75th minute."
      };
    } else {
      return {
        title: language === "es" ? "Aviso de Salida del Estadio" : language === "fr" ? "Alerte Sortie de Stade" : "Egress Gridlock Advisory",
        text: language === "es"
          ? "⚠️ ALERTA DE CONGESTIÓN: Se esperan demoras de 45 minutos en la zona de taxis compartidos. Recomendamos permanecer en el Fan Zone durante 30 minutos o usar la línea de tren eléctrico."
          : language === "fr"
          ? "⚠️ ALERTE ENCOMBREMENT: Retard estimé de 45 min pour les VTC. Profitez de la Fan Zone pendant 30 min ou empruntez le RER électrique."
          : "⚠️ CROWD GRIDLOCK: Rideshare pick-up zones are heavily congested. Expect 45+ min wait times. We suggest staying in the Fan Zone post-game or taking the Electric Rail link."
      };
    }
  };

  const currentTip = getPhaseTransitTip();
  const isHC = accessibility?.highContrast;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Carbon Calculator & Travel Options */}
      <div className={`xl:col-span-2 p-5 rounded-2xl border transition-all duration-300 ${
        isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
      }`}>
        <h3 className="font-extrabold uppercase text-xs tracking-wider mb-4 flex items-center">
          <Leaf className="h-4.5 w-4.5 text-emerald-500 mr-2 animate-pulse" />
          Eco-Travel Emissions Planner
        </h3>
        
        {/* Distance Slider */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-900 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-400">Specify Travel Distance to Stadium</span>
            <span className="font-mono font-bold text-fifa-gold">{distance} km</span>
          </div>
          <input
            type="range"
            min="2"
            max="50"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            aria-label="Specify Travel Distance to Stadium"
            className="w-full accent-emerald-500 bg-slate-900 h-1.5 rounded"
          />
        </div>

        {/* AI Smart Transit Advisory */}
        <div className={`mb-6 p-4 rounded-xl border flex items-start space-x-3 transition-colors ${
          isHC 
            ? "bg-neutral-900 border-yellow-400 text-yellow-300" 
            : "bg-emerald-950/10 border-emerald-900/20 text-emerald-400"
        }`}>
          <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0 text-emerald-400">
            <Leaf className="h-5 w-5 animate-pulse" />
          </div>
          <div className="text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-300 flex items-center">
              AI Smart Transit Recommendation
            </h4>
            <p className="font-bold text-slate-100 mt-1">Recommended Mode: {aiRec.modeName}</p>
            <p className="leading-relaxed text-[11px] text-slate-300 mt-1">{aiRec.reason}</p>
          </div>
        </div>

        {/* Options list */}
        <div className="space-y-4">
          {TRANSIT_OPTIONS.map((opt) => {
            const Icon = getIcon(opt.icon);
            const carbonTotal = Math.round(opt.carbon * distance);
            const maxCarbon = 154 * distance; // rideshare baseline
            const percent = maxCarbon > 0 ? (carbonTotal / maxCarbon) * 100 : 0;
            
            return (
              <div 
                key={opt.id} 
                className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isHC 
                    ? "bg-neutral-950 border-yellow-400" 
                    : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                }`}
              >
                {/* Transit Metadata */}
                <div className="flex items-start space-x-3">
                  <span className={`p-2 rounded-lg shrink-0 ${
                    opt.carbon === 0 
                      ? "bg-emerald-600/20 text-emerald-400" 
                      : opt.carbon < 30 
                      ? "bg-sky-600/20 text-sky-400" 
                      : "bg-rose-600/20 text-rose-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{opt.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{opt.accessibility}</p>
                    <div className="flex items-center space-x-3 mt-1.5 text-[9px] uppercase tracking-wider font-bold text-slate-500">
                      <span>Fare: {opt.cost}</span>
                      <span>•</span>
                      <span>ETA Adjustment: {opt.etaOffset > 0 ? `+${opt.etaOffset}m` : opt.etaOffset === 0 ? "On-Time" : `${opt.etaOffset}m (Gridlock bypass)`}</span>
                    </div>
                  </div>
                </div>

                {/* Emissions Display bar */}
                <div className="w-full md:w-44 space-y-1.5 self-end md:self-center shrink-0">
                  <div className="flex justify-between text-[10px] uppercase font-bold">
                    <span className="text-slate-400">{t.carbonEmissions}</span>
                    <span className={opt.carbon === 0 ? "text-emerald-400" : "text-slate-300"}>
                      {carbonTotal}g CO₂
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        opt.carbon === 0 
                          ? "bg-emerald-500 w-0" 
                          : opt.carbon < 30 
                          ? "bg-sky-400" 
                          : "bg-fifa-red"
                      }`}
                      style={{ width: `${opt.carbon === 0 ? 0 : Math.max(8, percent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transit Advisory Cards */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
      }`}>
        <div className="space-y-4">
          <h3 className="font-extrabold uppercase text-xs tracking-wider flex items-center">
            <Clock className="h-4.5 w-4.5 text-fifa-gold mr-2" />
            Live Travel Bulletins
          </h3>

          {/* Time Phase specific dynamic content */}
          <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
            timePhase === "post-match" 
              ? "bg-rose-950/20 border-rose-900/30 text-rose-200" 
              : "bg-slate-950 border-slate-900 text-slate-300"
          }`}>
            <AlertCircle className={`h-5 w-5 shrink-0 ${timePhase === "post-match" ? 'text-fifa-red' : 'text-fifa-gold'}`} />
            <div className="text-xs">
              <h4 className="font-extrabold mb-1 uppercase tracking-wide">{currentTip.title}</h4>
              <p className="leading-relaxed text-[11px] text-slate-300">{currentTip.text}</p>
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 text-xs">
            <h4 className="font-bold text-slate-200 flex items-center mb-1">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-fifa-gold" />
              {stadium.name} Transit Nodes
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 mt-2 list-disc pl-4">
              <li>Free shuttle loop runs continuously starting 4h pre-match.</li>
              <li>Wheelchair Accessible Vehicle (WAV) taxi loop is located at East Parking.</li>
              <li>Secure bicycle lockers are located near Gate A (free valet service).</li>
            </ul>
          </div>
        </div>

        {/* Environmental Statement */}
        <div className="pt-4 border-t border-slate-900 mt-4 text-[10px] text-slate-500 italic leading-normal flex items-start">
          <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0 mr-1.5 mt-0.5" />
          <span>By selecting electric rail transit over single-passenger rideshares, you offset approx {Math.round(142 * distance)}g of CO₂ emissions for this leg.</span>
        </div>
      </div>
    </div>
  );
}
