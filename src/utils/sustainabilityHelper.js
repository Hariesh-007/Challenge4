/**
 * Pure utility helper to generate dynamic AI Sustainability Audits based on stadium metrics.
 */
export function getAISustainabilityAudit(stadiumId, language) {
  let score = "B-";
  let analysis = "";
  let recommendation = "";

  if (stadiumId === "metlife") {
    score = "A+";
    if (language === "es") {
      analysis = "MetLife opera bajo un modelo estricto de cero residuos al vertedero. Excelente generación solar local.";
      recommendation = "Continúe utilizando los contenedores marrones para composta y los azules para reciclaje.";
    } else if (language === "fr") {
      analysis = "MetLife fonctionne sans aucun enfouissement des déchets. Excellente performance solaire sur site.";
      recommendation = "Continuez à trier rigoureusement les déchets organiques dans les bacs de compostage marrons.";
    } else {
      analysis = "MetLife operates a highly efficient zero-waste-to-landfill model with optimal on-site solar generation.";
      recommendation = "Keep sorting compostable food scraps into brown bins and recyclables into blue bins.";
    }
  } else if (stadiumId === "bcplace") {
    score = "A";
    if (language === "es") {
      analysis = "BC Place cuenta con un innovador esquema de devolución de vasos de depósito con reembolso de $1.";
      recommendation = "Participe devolviendo sus vasos en los centros de recolección o done su reembolso a la fundación local.";
    } else if (language === "fr") {
      analysis = "BC Place intègre une consigne sur les gobelets avec remboursement immédiat de 1$.";
      recommendation = "Rapportez vos gobelets consignés pour récupérer votre consigne ou faites-en don à la fondation.";
    } else {
      analysis = "BC Place integrates a progressive cup-return deposit scheme with $1 refunds.";
      recommendation = "Make sure to return cups to claim your refund or donate it to the youth soccer foundation.";
    }
  } else if (stadiumId === "azteca") {
    score = "B+";
    if (language === "es") {
      analysis = "Estadio Azteca destaca por priorizar el transporte eléctrico, reduciendo la huella de carbono de los fanáticos.";
      recommendation = "Enfoque en aumentar la clasificación de botellas de PET en los contenedores de las gradas principales.";
    } else if (language === "fr") {
      analysis = "L'Estadio Azteca brille par sa liaison ferroviaire électrique directe, minimisant l'impact carbone.";
      recommendation = "Concentrez-vous sur le tri des bouteilles en plastique PET dans les réceptacles des tribunes.";
    } else {
      analysis = "Estadio Azteca stands out for electric rail priority, drastically reducing fan transit footprints.";
      recommendation = "Focus on improving PET plastic bottle sorting inside main concourse bins.";
    }
  } else {
    if (language === "es") {
      analysis = "Sede no especificada. Protocolo verde estándar activo.";
      recommendation = "Reduzca su huella utilizando transporte público eléctrico.";
    } else if (language === "fr") {
      analysis = "Site non spécifié. Protocole éco-responsable standard activé.";
      recommendation = "Réduisez vos émissions en privilégiant le métro.";
    } else {
      analysis = "Unspecified venue. General stadium green protocol active.";
      recommendation = "Minimize emissions by selecting low-carbon public transport.";
    }
  }

  return { score, analysis, recommendation };
}
