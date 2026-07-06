// GenAI Context Engine and Prompt Orchestrator for FIFA World Cup 2026

const STADIUM_FACTS = {
  metlife: {
    metro: "Meadowlands Rail Station connects directly to Secaucus Junction.",
    accessibility: "ADA seating is located in Sections 117-124 and 224-230. Elevators are next to Gates A, B, and D.",
    sensory: "Sensory Room is located near Section 102 (Gate A side). Noise-canceling headphones are available.",
    eco: "Zero-waste facility: use green bins for recycling, brown for compost, black for landfill."
  },
  azteca: {
    metro: "Estadio Azteca Light Rail Station is situated on the west side (Calzada de Tlalpan).",
    accessibility: "ADA platforms are in the Lateral Poniente. Wheelchair support desks are inside Acceso A.",
    sensory: "Sensory Quiet Room is located in Cabecera Sur (Gate C level).",
    eco: "Electric-rail priority: sorting organic waste is mandatory in brown concourse bins."
  },
  bcplace: {
    metro: "Stadium-Chinatown SkyTrain station is a 3-minute walk from Gate A.",
    accessibility: "ADA seats are in sections 212, 218, and 245. Elevators are accessible from Gate A and Gate H.",
    sensory: "Sensory Friendly Suite 210 offers a quiet environment, sensory kits, and soft seating.",
    eco: "Cup-return deposit scheme: Return cups to sorting centers to claim a $1 refund or donate to soccer youth foundation."
  }
};

// Heuristic Multi-lingual responses if no API key is provided
const LOCAL_RESPONSES = {
  en: {
    greeting: "Hello! I am your FIFA Matchday Assistant. Ask me anything about stadiums, routes, accessibility, or operations.",
    gateC_crowded: "Alert: Gate C is currently overcrowded (Wait time: 32+ mins). For a smoother entry, please route to Gate D or Gate A where wait times are under 10 minutes.",
    gate_general: "Gates A, B, and D are fully accessible. Gate C currently has stairs. Average entry queue across the stadium is currently {avgQueue} minutes.",
    water: "Hydration points are located throughout the concourse. You can find refill stations near Section 110, Section 128, and outside the main plazas. Reusable empty bottles are allowed under 500ml.",
    sensory: "Sensory quiet zones are available for families and neurodivergent fans. Head to the sensory rooms near Gate A (MetLife), Cabecera Sur (Azteca), or Suite 210 (BC Place) for a peaceful space.",
    wheelchair: "Wheelchair accessible lanes are active at Gates A, B, and D. Ramps and lifts connect to seating areas. Please speak to any volunteer in green for golf cart shuttle assistance from parking lots.",
    transit: "We highly recommend using public rail networks to reduce the event's environmental impact. Electric trains run every 5 minutes post-match. Avoid rideshare zones during the peak 45 minutes after the whistle.",
    sustainability: "Our tournament is committed to zero waste. Please sort your trash: compost food scraps, recycle bottles, and place wrappers in landfill bins. Earn badges in the Eco Hub!",
    volunteer_task: "Volunteer Protocol: Please monitor queue lines. If queue times exceed 20 minutes, report to your Zone Supervisor and guide incoming fans toward less crowded gates. Smile and assist!",
    staff_action: "Staff Action Directive: Gate queue times at Gate C have exceeded safety margins. Activate detour barriers. Instruct outer perimeter volunteers to redirect arrivals to Gates A and D immediately.",
    organizer_summary: "Incident Commander Summary: Current stadium capacity load is {load}%. We have {incidents} open incidents. Gate C bottleneck remains high. Secondary transit lines are running with 12-minute headway.",
    unknown: "I'm not quite sure about that specific request. For your safety, please check the stadium information screens, speak with a nearby Volunteer, or proceed to the nearest Information Desk."
  },
  es: {
    greeting: "¡Hola! Soy tu Asistente del Día del Partido de la FIFA. Pregúntame sobre estadios, rutas, accesibilidad u operaciones.",
    gateC_crowded: "Alerta: Acceso C está sobrepoblado (Espera: 32+ min). Para una entrada más fluida, dirígete al Acceso D o Acceso A, con esperas menores a 10 minutos.",
    gate_general: "Los accesos A, B y D son completamente accesibles. El acceso C cuenta con escaleras. La fila promedio de entrada al estadio es de {avgQueue} minutos.",
    water: "Los puntos de hidratación se encuentran en todo el pasillo. Puede encontrar estaciones de recarga cerca de la Sección 110 y Sección 128. Se permiten botellas vacías reutilizables de menos de 500 ml.",
    sensory: "Disponemos de zonas sensoriales tranquilas para aficionados neurodivergentes. Diríjase a las salas cerca del Acceso A (MetLife), Cabecera Sur (Azteca) o Suite 210 (BC Place).",
    wheelchair: "Los carriles accesibles para sillas de ruedas están activos en Accesos A, B y D. Solicite asistencia a cualquier voluntario de verde para traslados en carritos de golf desde el estacionamiento.",
    transit: "Recomendamos usar las redes de tren ligero o metro para reducir las emisiones. Evite las zonas de taxis compartidos durante los primeros 45 minutos después del partido por alta congestión.",
    sustainability: "Comprometidos con el residuo cero. Clasifique la basura: orgánicos en marrón, reciclables en azul y restos en gris. ¡Gana puntos en el Eco Hub!",
    volunteer_task: "Protocolo de Voluntarios: Controle las colas. Si superan los 20 minutos, reporte a su supervisor de zona y redirija a los aficionados a las puertas menos saturadas.",
    staff_action: "Directiva del Personal: Las colas en la Puerta C superan los límites de seguridad. Active barreras de desvío y redirija a los aficionados a los Accesos A y D de inmediato.",
    organizer_summary: "Resumen del Comandante del Incidente: La carga del estadio es de {load}%. Hay {incidents} incidentes activos. Se mantiene el cuello de botella en la Puerta C.",
    unknown: "No estoy seguro de esa solicitud. Por seguridad, consulte las pantallas del estadio, hable con un voluntario o diríjase al mostrador de información."
  },
  fr: {
    greeting: "Bonjour! Je suis votre Assistant de Match FIFA. Posez-moi des questions sur les stades, les accès, l'accessibilité ou les opérations.",
    gateC_crowded: "Alerte: La porte C est saturée (Attente: 32+ min). Pour entrer plus rapidement, veuillez vous diriger vers la porte D ou la porte A (attente de moins de 10 min).",
    gate_general: "Les portes A, B et D sont entièrement accessibles. La porte C comporte des escaliers. L'attente moyenne aux entrées est de {avgQueue} minutes.",
    water: "Des fontaines d'eau sont situées dans tous les couloirs. Stations de recharge près de la Section 110 et de la Section 128. Bouteilles vides réutilisables autorisées (max 500ml).",
    sensory: "Des espaces calmes pour personnes neurodivergentes sont disponibles près de la Porte A (MetLife), Tribune Sud (Azteca) ou Suite 210 (BC Place).",
    wheelchair: "Voies accessibles aux fauteuils roulants ouvertes aux portes A, B et D. Contactez un bénévole en vert pour un transport en voiturette depuis les parkings.",
    transit: "Nous vous conseillons d'emprunter le train ou métro électrique pour réduire l'empreinte carbone. Évitez les zones de VTC pendant les 45 minutes suivant le coup de sifflet final.",
    sustainability: "Objectif zéro déchet. Triez vos déchets: compostez le reste de nourriture, recyclez les gobelets, jetez les emballages dans le bac noir. Rejoignez l'Eco Hub!",
    volunteer_task: "Protocole Bénévole: Surveillez les files d'attente. Si l'attente dépasse 20 minutes, informez votre superviseur de zone et orientez les supporters vers les portes fluides.",
    staff_action: "Directive opérationnelle: Attente critique à la Porte C. Déployez les barrières de déviation. Dirigez immédiatement les flux vers les Portes A et D.",
    organizer_summary: "Synthèse d'organisation: Capacité globale à {load}%. {incidents} incidents en cours. Goulot d'étranglement persistant à la Porte C.",
    unknown: "Je ne dispose pas de cette information. Pour votre sécurité, veuillez consulter les écrans géants ou vous adresser au guichet d'information le plus proche."
  }
};

/**
 * Builds the system instructions for the AI model depending on user context.
 */
export function buildSystemPrompt(role, stadium, phase, accessibilityNeeds, language) {
  const stadiumName = stadium ? stadium.name : "FIFA World Cup 2026 Stadium";
  const cityName = stadium ? stadium.city : "Host City";
  
  let roleInstruction = "";
  switch (role) {
    case "fan":
      roleInstruction = `You are a friendly, welcoming, and helpful FIFA World Cup Fan Assistant.
- Your primary target is to guide fans safely, efficiently, and with high hospitality.
- Encourage sustainability (e.g. public transport, compost bins).
- Mention accessibility support if relevant.
- Keep answers warm, concise (2-3 sentences max), and extremely practical.`;
      break;
    case "volunteer":
      roleInstruction = `You are the FIFA Volunteer Support Intelligence.
- Provide concise, actionable directives, task checklists, and service protocols.
- Help volunteers assist fans with routing, gate closures, and basic FAQs.
- Avoid warm fluff. Give direct, step-by-step pointers (bullet points).`;
      break;
    case "staff":
      roleInstruction = `You are the Stadium Operations Decision Engine for Venue Staff.
- Provide immediate, crisp operational decisions, crowd management protocols, security directives, and system overrides.
- Highlight safety, risk levels, and resource redeployment instructions.
- Be formal, precise, and authoritative.`;
      break;
    case "organizer":
      roleInstruction = `You are the Executive Incident Commander AI Analyst.
- Provide high-level aggregated operational intelligence, incident summaries, safety alerts, and command logs.
- Focus on crowd density numbers, active ticket scanner availability, incident resolutions, and strategic recommendations.
- Deliver summary-oriented reports with clear action items.`;
      break;
    default:
      roleInstruction = "You are a helpful FIFA World Cup Stadium Coordinator.";
  }

  const prompt = `${roleInstruction}

Context Details:
- **Active Venue**: ${stadiumName} in ${cityName}
- **Match Phase**: ${phase}
- **Language**: ${language}
- **Accessibility Profile**: Wheelchair routing active? ${accessibilityNeeds.wheelchair ? 'YES' : 'NO'}, Sensory considerations? ${accessibilityNeeds.sensory ? 'YES' : 'NO'}

Guardrails:
1. Always respond in the selected language: ${language.toUpperCase()}.
2. Never invent safety-critical evacuation gates or medical instructions. If you do not know a location or layout detail, instruct the user to "locate the nearest green-vested staff member" or "report to the closest medical beacon".
3. Do not suggest aggressive crowd dispersion tactics. Suggest flow redirections or delayed egress.`;

  return prompt;
}

/**
 * Heuristic fallback matching logic to simulate GenAI logic locally.
 */
function getLocalHeuristicResponse(prompt, role, stadium, language, gates = [], incidents = [], _timePhase = "") {
  const dict = LOCAL_RESPONSES[language] || LOCAL_RESPONSES.en;
  const lower = prompt.toLowerCase();

  // Gates and Congestion queries
  if (lower.includes("gate") || lower.includes("entrada") || lower.includes("porte") || lower.includes("accès")) {
    if (lower.includes("gate c") || lower.includes("accès c") || lower.includes("puerta c") || lower.includes("sur c")) {
      return dict.gateC_crowded;
    }
    const avgQueue = gates.length ? Math.round(gates.reduce((acc, g) => acc + g.queueTime, 0) / gates.length) : 15;
    return dict.gate_general.replace("{avgQueue}", avgQueue);
  }

  // Water / Refill
  if (lower.includes("water") || lower.includes("agua") || lower.includes("eau") || lower.includes("drink") || lower.includes("hydration") || lower.includes("hidratación")) {
    return dict.water;
  }

  // Sensory room / Quiet zone
  if (lower.includes("sensory") || lower.includes("quiet") || lower.includes("silencio") || lower.includes("calme") || lower.includes("sensorial")) {
    let response = dict.sensory;
    if (stadium && STADIUM_FACTS[stadium.id]) {
      response += ` Note: At ${stadium.name}, ${STADIUM_FACTS[stadium.id].sensory}`;
    }
    return response;
  }

  // Wheelchair / Accessibility / ADA
  if (lower.includes("wheelchair") || lower.includes("silla") || lower.includes("fauteuil") || lower.includes("accessible") || lower.includes("ada") || lower.includes("disab")) {
    let response = dict.wheelchair;
    if (stadium && STADIUM_FACTS[stadium.id]) {
      response += ` ${STADIUM_FACTS[stadium.id].accessibility}`;
    }
    return response;
  }

  // Transit / Metro / Shuttle
  if (lower.includes("metro") || lower.includes("métro") || lower.includes("shuttle") || lower.includes("bus") || lower.includes("train") || lower.includes("transp") || lower.includes("navette") || lower.includes("llegar")) {
    let response = dict.transit;
    if (stadium && STADIUM_FACTS[stadium.id]) {
      response += ` ${STADIUM_FACTS[stadium.id].metro}`;
    }
    return response;
  }

  // Sustainability / Recycling
  if (lower.includes("sustain") || lower.includes("recycle") || lower.includes("carbon") || lower.includes("waste") || lower.includes("sostenib") || lower.includes("basura") || lower.includes("éco") || lower.includes("durable")) {
    let response = dict.sustainability;
    if (stadium && STADIUM_FACTS[stadium.id]) {
      response += ` ${STADIUM_FACTS[stadium.id].eco}`;
    }
    return response;
  }

  // Role specific overrides
  if (role === "volunteer" && (lower.includes("task") || lower.includes("checklist") || lower.includes("duty") || lower.includes("deber") || lower.includes("tâche") || lower.includes("faire"))) {
    return dict.volunteer_task;
  }

  if (role === "staff" && (lower.includes("action") || lower.includes("alert") || lower.includes("crowd") || lower.includes("congestion") || lower.includes("protocol"))) {
    return dict.staff_action;
  }

  if (role === "organizer" || lower.includes("summary") || lower.includes("command") || lower.includes("report")) {
    const activeInc = incidents.filter(i => i.status !== "resolved").length;
    const capacityLoad = Math.round(gates.reduce((acc, g) => acc + g.load, 0) / (gates.length || 1)) || 55;
    return dict.organizer_summary.replace("{load}", capacityLoad).replace("{incidents}", activeInc);
  }

  // Fallback depending on role
  if (role === "volunteer") return dict.volunteer_task;
  if (role === "staff") return dict.staff_action;
  if (role === "organizer") return dict.organizer_summary.replace("{load}", 62).replace("{incidents}", incidents.filter(i => i.status !== "resolved").length);

  return dict.greeting;
}

export function sanitizeInput(text) {
  if (typeof text !== "string") return "";
  // Strip HTML elements and restrict length to prevent DoS payloads
  return text.replace(/[<>]/g, "").slice(0, 800).trim();
}

/**
 * Core query router for the AI Assistant.
 * Connects to OpenAI if apiKey is set, otherwise utilizes the heuristic local response engine.
 */
export async function queryAIAssistant({
  prompt,
  role,
  stadium,
  timePhase,
  accessibilityNeeds,
  language,
  gates = [],
  incidents = [],
  apiKey = ""
}) {
  const cleanPrompt = sanitizeInput(prompt);
  const systemPrompt = buildSystemPrompt(role, stadium, timePhase, accessibilityNeeds, language);
  
  if (apiKey && apiKey.trim() !== "") {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Cost-effective, fast and safe
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: cleanPrompt }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "OpenAI request failed");
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (e) {
      console.warn("OpenAI API call failed, falling back to local engine. Error:", e.message);
      // Fallback to local
    }
  }

  // Artificial delay to simulate thinking of GenAI
  await new Promise(resolve => setTimeout(resolve, 800));
  return getLocalHeuristicResponse(cleanPrompt, role, stadium, language, gates, incidents, timePhase);
}
