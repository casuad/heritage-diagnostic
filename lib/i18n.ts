import { Lang } from "./types";

export const STRINGS = {
  appName: { fr: "Relevé Patrimoine", en: "Heritage Survey" },
  tagline: {
    fr: "Diagnostic terrain pour le bâti ancien",
    en: "Field diagnostics for historic buildings",
  },
  newSurvey: { fr: "Nouveau relevé", en: "New survey" },
  noSurveys: {
    fr: "Aucun relevé pour l'instant.",
    en: "No surveys yet.",
  },
  buildingName: { fr: "Nom du bâtiment", en: "Building name" },
  address: { fr: "Adresse", en: "Address" },
  addressPlaceholder: { fr: "Commencez à taper l'adresse…", en: "Start typing the address…" },
  verifyBuilding: { fr: "Vérifier le bâtiment sur la carte", en: "Verify the building on the map" },
  buildingType: { fr: "Type de bâtiment", en: "Building type" },
  surveyor: { fr: "Diagnostiqueur", en: "Surveyor" },
  date: { fr: "Date", en: "Date" },
  create: { fr: "Créer le relevé", en: "Create survey" },
  cancel: { fr: "Annuler", en: "Cancel" },
  save: { fr: "Enregistrer", en: "Save" },
  delete: { fr: "Supprimer", en: "Delete" },
  comment: { fr: "Commentaire", en: "Comment" },
  addPhoto: { fr: "Ajouter une photo", en: "Add photo" },
  synthesis: { fr: "Synthèse", en: "Summary" },
  generateReport: { fr: "Générer le rapport PDF", en: "Generate PDF report" },
  downloadReport: { fr: "Télécharger le PDF", en: "Download PDF" },
  backToSurvey: { fr: "Retour au relevé", en: "Back to survey" },
  locating: { fr: "Géolocalisation en cours…", en: "Locating…" },
  exportJson: { fr: "Exporter (JSON)", en: "Export (JSON)" },
  importJson: { fr: "Importer", en: "Import" },
  pathologyLabel: { fr: "Décrire la pathologie", en: "Describe the pathology" },
  addPathology: { fr: "Ajouter une pathologie", en: "Add a pathology" },
  pathologiesRecorded: { fr: "pathologies relevées", en: "pathologies recorded" },
  plans: { fr: "Plans", en: "Plans" },
  uploadPlan: { fr: "Ajouter un plan", en: "Upload a plan" },
  noPlans: { fr: "Aucun plan pour l'instant.", en: "No plans yet." },
  planName: { fr: "Nom du plan", en: "Plan name" },
  placeMarkerHint: {
    fr: "Choisissez une pathologie puis cliquez sur le plan pour la localiser.",
    en: "Choose a pathology, then click on the plan to locate it.",
  },
  selectPathology: { fr: "Pathologie à localiser", en: "Pathology to locate" },
  noPathologiesYet: {
    fr: "Ajoutez d'abord des pathologies dans les lots pour pouvoir les localiser.",
    en: "Add pathologies in the trade sections first to be able to locate them.",
  },
} as const;

export function t(key: keyof typeof STRINGS, lang: Lang) {
  return STRINGS[key][lang];
}
