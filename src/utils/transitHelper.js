/**
 * Contextual commute recommender for FIFA matchdays.
 */
export function getAISmartTransitRecommendation(distance, timePhase, weather, language) {
  let modeName = "";
  let reason = "";

  if (distance <= 3) {
    const cond = weather?.condition?.toLowerCase() || "";
    if (cond.includes("rain") || cond.includes("snow") || cond.includes("thunderstorm") || cond.includes("drizzle") || cond.includes("showers")) {
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
}
