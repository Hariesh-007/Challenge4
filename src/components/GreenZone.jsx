import React, { useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translation";
import { SUSTAINABILITY_GAME } from "../data/mockData";
import { 
  Leaf, 
  RefreshCw, 
  Award, 
  Sun, 
  Droplet, 
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function GreenZone({
  stadium,
  language,
  accessibility
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  // Game state
  const [gameItems, setGameItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Initialize/Reset Game
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    // Shuffle the mock game dataset
    const shuffled = [...SUSTAINABILITY_GAME].sort(() => Math.random() - 0.5);
    setGameItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setUnlockedBadge(false);
    setGameOver(false);
  };

  const handleSort = (binCategory) => {
    if (gameOver) return;
    
    const activeItem = gameItems[currentIndex];
    if (!activeItem) return;

    const isCorrect = activeItem.category === binCategory;
    let pointDelta = isCorrect ? activeItem.points : -5;
    
    // Ensure score doesn't go below 0
    const nextScore = Math.max(0, score + pointDelta);
    setScore(nextScore);

    // Trigger Badge Unlock
    if (nextScore >= 50 && !unlockedBadge) {
      setUnlockedBadge(true);
    }

    setFeedback({
      correct: isCorrect,
      text: isCorrect 
        ? `Correct! +${activeItem.points} pts. ${activeItem.tip}` 
        : `Incorrect! -5 pts. "${activeItem.item}" belongs in ${activeItem.category.toUpperCase()}.`
    });

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < gameItems.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 4000);
  };

  const isHC = accessibility.highContrast;
  const currentItem = gameItems[currentIndex];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Waste Sorting Game */}
      <div className={`xl:col-span-2 p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
      }`}>
        <div>
          <h3 className="font-extrabold uppercase text-xs tracking-wider mb-2 flex items-center">
            <Award className="h-4.5 w-4.5 text-fifa-gold mr-2" />
            {t.recycleGameTitle}
          </h3>
          <p className="text-[10px] text-slate-400 mb-4">{t.recycleGameInstructions}</p>
        </div>

        {/* Game play area */}
        <div className={`p-6 rounded-xl border flex flex-col items-center justify-center min-h-[220px] transition-colors relative ${
          isHC ? "bg-neutral-950 border-yellow-400" : "bg-slate-950/60 border-slate-900"
        }`}>
          {gameOver ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-black text-sm uppercase">Sorting Challenge Complete!</h4>
              <p className="text-xs text-slate-400">You scored <span className="font-bold text-fifa-gold">{score}</span> points.</p>
              {unlockedBadge && (
                <div className="flex items-center justify-center gap-1.5 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-black">
                  <Award className="h-4 w-4" />
                  UNLOCKED: Matchday Eco-Champion
                </div>
              )}
              <button
                onClick={resetGame}
                aria-label={t.playAgain}
                className="mt-3 flex items-center space-x-1 px-4 py-2 bg-fifa-blue hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg mx-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t.playAgain}</span>
              </button>
            </div>
          ) : currentItem ? (
            <div className="w-full flex flex-col items-center text-center space-y-4">
              
              {/* Score Counter */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-full px-3 py-0.5 text-[10px] font-bold">
                <span>{t.score}:</span>
                <span className="text-fifa-gold">{score}</span>
              </div>

              {/* Item Card */}
              {!feedback ? (
                <div className="animate-fade-in space-y-4">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Item to sort:</div>
                  <div className="text-xl font-black text-slate-100 bg-slate-900/60 border border-slate-800 px-6 py-4 rounded-xl shadow">
                    🗑️ {currentItem.item}
                  </div>

                  {/* Bin Buttons */}
                  <div className="grid grid-cols-3 gap-3 w-72 pt-2">
                    {[
                      { cat: "recycle", label: t.recycle, color: "bg-sky-600 hover:bg-sky-700" },
                      { cat: "compost", label: t.compost, color: "bg-emerald-600 hover:bg-emerald-700" },
                      { cat: "landfill", label: t.landfill, color: "bg-slate-700 hover:bg-slate-800" }
                    ].map(bin => (
                      <button
                        key={bin.cat}
                        onClick={() => handleSort(bin.cat)}
                        aria-label={`Sort item ${currentItem?.item} into ${bin.label}`}
                        className={`py-2 text-[10px] font-bold uppercase rounded-lg text-white transition-all ${bin.color}`}
                      >
                        {bin.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Feedback Popup */
                <div className="space-y-2 animate-pulse max-w-sm">
                  {feedback.correct ? (
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                  ) : (
                    <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
                  )}
                  <p className={`text-xs font-bold ${feedback.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {feedback.text}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 italic text-xs">Loading items...</div>
          )}
        </div>
      </div>

      {/* Stadium Sustainability Info & Badges */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/40 border-slate-800 text-slate-100"
      }`}>
        <div className="space-y-4">
          <h3 className="font-extrabold uppercase text-xs tracking-wider flex items-center">
            <Leaf className="h-4.5 w-4.5 text-emerald-500 mr-2" />
            {t.ecoTips}
          </h3>

          {/* Environmental Metrics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Solar Energy", value: stadium.sustainability.solarGeneration, icon: Sun, color: "text-amber-400" },
              { label: "Water Saved", value: stadium.sustainability.waterSaved, icon: Droplet, color: "text-blue-400" },
              { label: "Recycled", value: stadium.sustainability.recyclingRate, icon: TrendingUp, color: "text-emerald-400" }
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-center">
                  <Icon className={`h-4.5 w-4.5 mx-auto ${metric.color} mb-1`} />
                  <div className="text-[8px] uppercase font-bold text-slate-400">{metric.label}</div>
                  <div className="text-xs font-black mt-0.5">{metric.value}</div>
                </div>
              );
            })}
          </div>

          {/* Tips List */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {stadium.name} Green Protocols
            </div>
            <div className="space-y-2">
              {stadium.sustainability.tips.map((tipText, idx) => (
                <div key={idx} className="flex space-x-2 items-start text-xs text-slate-300 leading-normal">
                  <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                  <span>{tipText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Virtual Eco Trophy Box */}
        <div className="pt-4 border-t border-slate-900 mt-4">
          <div className="flex items-center space-x-3 bg-slate-950/50 rounded-xl p-2.5 border border-slate-900">
            <Award className={`h-8 w-8 shrink-0 ${unlockedBadge ? 'text-fifa-gold animate-pulse' : 'text-slate-700'}`} />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Matchday Badges</div>
              <div className="text-xs font-black text-slate-200">
                {unlockedBadge ? "🏆 Matchday Eco-Champion" : "Locked: Score 50 pts in Sorter Game"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
