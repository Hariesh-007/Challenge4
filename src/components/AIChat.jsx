import React, { useState, useEffect, useRef } from "react";
import { TRANSLATIONS } from "../data/translation";
import { queryAIAssistant } from "../utils/aiEngine";
import { 
  Send, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Settings, 
  Sparkles, 
  AlertTriangle,
  User
} from "lucide-react";

export default function AIChat({
  role,
  stadium,
  timePhase,
  accessibility,
  language,
  gates,
  incidents,
  weather
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("fifa_openai_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const chatEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize chat with greeting when role/language changes
  useEffect(() => {
    let greetingText = t.chatGreeting;
    if (role === "volunteer") {
      greetingText = language === "es" 
        ? "Tablero de Bénévolos activo. Pregúntame sobre tareas asignadas o protocolos." 
        : language === "fr"
        ? "Console bénévole activée. Posez vos questions sur vos tâches et les consignes de sécurité."
        : "Volunteer Command active. Ask me about duty checklists, protocols, or gate directions.";
    } else if (role === "staff") {
      greetingText = language === "es"
        ? "Consola de operaciones de personal. Solicite directivas sobre seguridad o gestión de colas."
        : language === "fr"
        ? "Console opérationnelle du personnel. Demandez les directives de sécurité ou la gestion des flux."
        : "Operational Staff interface. Ask for crowd directives, queue management, or equipment overrides.";
    } else if (role === "organizer") {
      greetingText = language === "es"
        ? "Centro de Comando del Organizador. Solicite resúmenes de incidentes y recomendaciones de evacuación."
        : language === "fr"
        ? "Poste de commandement d'organisation. Demandez les rapports d'incidents et l'état des flux de sortie."
        : "Organizer Incident Command active. Inquire about high-level summaries, queue loads, and dispatching alerts.";
    }

    setMessages([
      {
        id: "greet",
        sender: "ai",
        text: greetingText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [role, language, t.chatGreeting]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Save API Key to localStorage
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("fifa_openai_key", key);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cleanText = text.replace(/[<>]/g, "").slice(0, 800).trim();
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: cleanText,
      time: timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setLoading(true);

    try {
      const responseText = await queryAIAssistant({
        prompt: text,
        role,
        stadium,
        timePhase,
        accessibilityNeeds: {
          wheelchair: accessibility?.wheelchairRoute,
          sensory: accessibility?.sensoryRoute
        },
        language,
        gates,
        incidents,
        apiKey,
        weather
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // TTS Autoplay if enabled in accessibility
      if (accessibility?.ttsActive && synthRef.current) {
        speakText(responseText);
      }
    } catch (err) {
      const errMsg = {
        id: `err-${Date.now()}`,
        sender: "system",
        text: `Error: ${err.message || "Failed to contact AI Engine. Check internet/API keys."}`,
        time: timestamp
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanedText = text.replace(/[*#`_-]/g, ""); // Strip markdown characters
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Attempt to match voice language
    if (language === "es") utterance.lang = "es-ES";
    else if (language === "fr") utterance.lang = "fr-FR";
    else utterance.lang = "en-US";

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const handleClearChat = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: "greet",
        sender: "ai",
        text: t.chatGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Pre-configured smart prompts depending on user role
  const getSmartPrompts = () => {
    if (role === "fan") {
      return [
        language === "es" ? "¿Cómo llego al metro?" : language === "fr" ? "Comment aller au métro?" : "How do I get to Gate A from metro?",
        language === "es" ? "¿Dónde hay agua gratis?" : language === "fr" ? "Où trouver des fontaines d'eau?" : "Where is the nearest hydration point?",
        language === "es" ? "¿Qué entradas son accesibles?" : language === "fr" ? "Quelles portes sont accessibles?" : "Which entrances are wheelchair accessible?",
        language === "es" ? "Consejos de sostenibilidad" : language === "fr" ? "Conseils éco-responsables" : "Show stadium sustainability tips"
      ];
    } else if (role === "volunteer") {
      return [
        language === "es" ? "Lista de tareas asignadas" : language === "fr" ? "Ma liste de tâches" : "What is my volunteer task checklist?",
        language === "es" ? "Protocolo en Puerta C congestionada" : language === "fr" ? "Consignes en cas de foule Porte C" : "Gate C is overcrowded, what is the protocol?",
        language === "es" ? "¿Dónde está la sala sensorial?" : language === "fr" ? "Où est l'espace sensoriel calme?" : "Where should I redirect sensory-sensitive fans?"
      ];
    } else if (role === "staff") {
      return [
        language === "es" ? "Acción sobre falla en lectores" : language === "fr" ? "Action panne lecteurs tickets" : "Scanner failure protocol",
        language === "es" ? "Protocolo de embotellamiento" : language === "fr" ? "Directive encombrement de foule" : "Gate C overcrowding checklist",
        language === "es" ? "Redirección de transporte" : language === "fr" ? "Redirection navettes" : "Egress detour procedures"
      ];
    } else { // organizer
      return [
        language === "es" ? "Resumen de incidentes activos" : language === "fr" ? "Synthèse des incidents" : "Active incident summary report",
        language === "es" ? "Estado de carga de puertas" : language === "fr" ? "Charge des files d'attente" : "Show gate queue load statuses",
        language === "es" ? "Sugerencias de personal" : language === "fr" ? "Recommandation déploiement" : "AI recommendations for volunteer re-routing"
      ];
    }
  };

  const activePrompts = getSmartPrompts();

  const isHC = accessibility?.highContrast;

  return (
    <div className={`flex flex-col h-[520px] lg:h-[565px] rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 ${
      isHC 
        ? "bg-black border-yellow-400 text-yellow-300" 
        : "bg-slate-900/60 backdrop-blur-md border-slate-800/80 text-slate-100"
    }`}>
      {/* Chat Title / Settings Toggle */}
      <div className={`p-4 border-b flex items-center justify-between transition-colors ${
        isHC ? "border-yellow-400 bg-neutral-900" : "border-slate-800 bg-slate-900/60"
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4.5 w-4.5 text-fifa-gold animate-pulse shrink-0" />
          <div>
            <h3 className="font-extrabold uppercase text-xs tracking-wider flex items-center">
              {t.tabAIChat}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest ${
                apiKey ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-fifa-blue/20 text-fifa-gold border border-fifa-gold/20"
              }`}>
                {apiKey ? "Live GPT" : "Local Engine"}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Role: <span className="font-bold text-slate-300 capitalize">{role}</span> | {stadium.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleClearChat()}
            title={t.clearChat}
            aria-label="Clear chat history"
            className={`p-1.5 rounded-lg border transition-colors ${
              isHC ? "border-yellow-400 hover:bg-neutral-800" : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle AI API configuration settings"
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings 
                ? (isHC ? "bg-yellow-400 text-black border-yellow-400" : "bg-fifa-blue text-white border-blue-600")
                : (isHC ? "border-yellow-400 hover:bg-neutral-800" : "border-slate-800 bg-slate-950/60 hover:bg-slate-900")
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`p-4 border-b transition-colors ${
          isHC ? "bg-neutral-900 border-yellow-400 text-yellow-300" : "bg-slate-950/90 border-slate-800 text-slate-200"
        }`}>
          <h4 className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center text-fifa-gold">
            <Settings className="h-3.5 w-3.5 mr-1" /> {t.apiSettings}
          </h4>
          <div className="flex flex-col space-y-2">
            <label htmlFor="openai-api-key-input" className="text-[10px] text-slate-400 font-bold uppercase">{t.apiKeyLabel}</label>
            <div className="flex gap-2">
              <input
                id="openai-api-key-input"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                className={`flex-grow py-1 px-3 rounded text-xs border focus:outline-none ${
                  isHC 
                    ? "bg-black border-yellow-400 text-yellow-300" 
                    : "bg-slate-900 border-slate-800 text-white focus:border-fifa-gold"
                }`}
              />
              {apiKey && (
                <button
                  onClick={() => handleSaveApiKey("")}
                  className="px-2 py-1 bg-fifa-red text-white text-[10px] uppercase font-bold rounded"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 italic">
              ⚠️ {t.apiWarning}
            </p>
          </div>
        </div>
      )}

      {/* Messages Window */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isHC ? "bg-black" : "bg-slate-950/20"}`}>
        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          const isSys = msg.sender === "system";
          
          let bubbleClass = "";
          let icon = null;

          if (isAI) {
            bubbleClass = isHC 
              ? "bg-neutral-950 border border-yellow-400 text-yellow-300 mr-12"
              : "bg-slate-900/80 border border-slate-800 text-slate-200 mr-12 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl";
            icon = <Sparkles className="h-3.5 w-3.5 text-fifa-gold shrink-0 mt-1" />;
          } else if (isSys) {
            bubbleClass = "bg-red-950/30 border border-red-500/30 text-red-300 w-full rounded-lg";
            icon = <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-1" />;
          } else {
            bubbleClass = isHC
              ? "bg-yellow-400 text-black border border-yellow-400 ml-12 ml-auto"
              : "bg-fifa-blue text-white ml-12 ml-auto rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-md shadow-blue-900/10";
            icon = <User className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-1" />;
          }

          return (
            <div key={msg.id} className={`flex items-start space-x-2 ${!isAI && !isSys ? 'justify-end' : ''}`}>
              {isAI && <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">{icon}</div>}
              <div className={`p-3 text-xs leading-relaxed max-w-[85%] relative group ${bubbleClass}`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500 space-x-4">
                  <span>{msg.time}</span>
                  {isAI && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-800 transition-opacity text-slate-400 hover:text-white"
                      title={t.ttsActive}
                      aria-label="Speak text aloud"
                    >
                      {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>
              {!isAI && !isSys && <div className="p-1 rounded-lg bg-fifa-blue border border-blue-600">{icon}</div>}
            </div>
          );
        })}
        {loading && (
          <div className="flex items-start space-x-2">
            <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-fifa-gold animate-spin" />
            </div>
            <div className={`p-3 text-xs rounded-tr-2xl rounded-br-2xl rounded-bl-2xl max-w-[85%] ${
              isHC ? "bg-neutral-950 border border-yellow-400 text-yellow-300" : "bg-slate-900/50 text-slate-400"
            }`}>
              <span className="animate-pulse flex items-center space-x-1">
                <span>FIFA AI assistant is thinking</span>
                <span className="w-1 h-1 bg-fifa-gold rounded-full animate-bounce delay-75"></span>
                <span className="w-1 h-1 bg-fifa-gold rounded-full animate-bounce delay-150"></span>
                <span className="w-1 h-1 bg-fifa-gold rounded-full animate-bounce delay-300"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Smart Suggestions */}
      {activePrompts && activePrompts.length > 0 && (
        <div className={`p-2 border-t flex flex-wrap gap-1.5 items-center ${
          isHC ? "border-yellow-400 bg-neutral-950" : "border-slate-850 bg-slate-950/40"
        }`}>
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest pl-1 shrink-0">
            {t.smartPrompts}:
          </span>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto">
            {activePrompts.map((pText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(pText)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all text-left font-medium ${
                  isHC
                    ? "border-yellow-400 text-yellow-300 hover:bg-neutral-900"
                    : "border-slate-800 bg-slate-900 text-slate-300 hover:border-fifa-gold hover:text-white"
                }`}
              >
                {pText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text Area Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={`p-3 border-t flex items-center gap-2 ${
          isHC ? "border-yellow-400 bg-neutral-900" : "border-slate-800 bg-slate-900/60"
        }`}
      >
        <input
          type="text"
          placeholder={t.chatPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label={t.chatPlaceholder}
          className={`flex-1 py-2 px-4 rounded-xl border text-xs focus:outline-none ${
            isHC
              ? "bg-black border-yellow-400 text-yellow-300 focus:ring-1 focus:ring-yellow-400"
              : "bg-slate-950 border-slate-800 text-white focus:border-fifa-gold"
          }`}
        />
        <button
          type="submit"
          aria-label="Send message"
          className={`p-2 rounded-xl transition-all ${
            isHC
              ? "bg-yellow-400 hover:bg-yellow-500 text-black"
              : "bg-fifa-blue hover:bg-blue-700 text-white shadow shadow-blue-800/40"
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
