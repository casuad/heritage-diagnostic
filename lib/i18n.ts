import { Lang } from "./types";

export const STRINGS = {
  appName: { fr: "Relevo", en: "Relevo" },
  tagline: {
    fr: "Relevez les pathologies d'un bâtiment sur le terrain, photographiez-les, repérez-les sur plan, puis générez un rapport PDF.",
    en: "Survey pathologies in a building on site, photograph them, locate them on a plan, then generate a PDF report.",
  },
  backupData: { fr: "Sauvegarder ou restaurer mes relevés", en: "Back up or restore my surveys" },
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
  buildingTypePlaceholder: {
    fr: "ex : résidentiel individuel, locaux commerciaux…",
    en: "e.g. single-family residential, commercial premises…",
  },
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
  plansHint: {
    fr: "Importez le plan du bâtiment (PDF ou image) pour y repérer précisément chaque pathologie.",
    en: "Import the building's plan (PDF or image) to precisely locate each pathology on it.",
  },
  addFirstPlan: { fr: "Ajouter un premier plan", en: "Add a first plan" },
  managePlans: { fr: "Repérer sur le plan", en: "Locate on the plan" },
  uploadPlan: { fr: "Ajouter un plan", en: "Upload a plan" },
  processingPlan: { fr: "Traitement…", en: "Processing…" },
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
  notes: { fr: "Description visuelle & principes constructifs", en: "Visual description & construction principles" },
  notesPlaceholder: {
    fr: "Aspect général, matériaux apparents, système constructif observé…",
    en: "General appearance, visible materials, observed construction system…",
  },
  diagnosticContext: { fr: "Contexte & raisons du diagnostic", en: "Context & reasons for the survey" },
  diagnosticContextPlaceholder: {
    fr: "Problématiques signalées, motif de la demande, antécédents…",
    en: "Reported issues, reason for the request, history…",
  },
  documents: { fr: "Documents", en: "Documents" },
  documentsHint: {
    fr: "Pièces jointes au relevé (devis, photos d'ensemble, courriers…). Pour annoter un plan et y localiser des pathologies, utilisez la section « Plans » ci-dessus.",
    en: "Attachments to the survey (quotes, overview photos, letters…). To annotate a plan and locate pathologies on it, use the « Plans » section above.",
  },
  uploadDocument: { fr: "Ajouter un document", en: "Upload a document" },
  noDocuments: { fr: "Aucun document pour l'instant.", en: "No documents yet." },
  aiAnalysisComingSoon: {
    fr: "Analyse IA des documents — en cours de développement",
    en: "AI document analysis — in development",
  },
  groupByLot: { fr: "Par lot", en: "By trade" },
  groupByZone: { fr: "Par zone", en: "By zone" },
  zone: { fr: "Zone", en: "Zone" },
  zonePlaceholder: { fr: "ex : façade nord, RDC…", en: "e.g. north facade, ground floor…" },
  unzoned: { fr: "Zone non précisée", en: "Unspecified zone" },
  newLot: { fr: "Nouveau lot", en: "New trade section" },
  lotNamePlaceholder: { fr: "ex : Étanchéité, VRD…", en: "e.g. Waterproofing, Sitework…" },
  newZone: { fr: "Nouvelle zone", en: "New zone" },
  deleteLotBlocked: {
    fr: "Videz ce lot avant de le supprimer",
    en: "Empty this trade section before deleting it",
  },
  noLotsYet: {
    fr: "Aucun lot défini. Créez-en un dans l'onglet « Par lot ».",
    en: "No trade sections defined. Create one in the « By trade » tab.",
  },
  locatedOnPlan: { fr: "Repéré sur plan", en: "Located on plan" },
  viewPathologyCard: { fr: "Voir la fiche", en: "View pathology" },
  storageUnavailable: {
    fr: "Stockage local indisponible dans ce navigateur",
    en: "Local storage is unavailable in this browser",
  },
  storageUnavailableHint: {
    fr: "Cet outil enregistre tout sur l'appareil (IndexedDB). En navigation privée, avec les cookies bloqués, ou avec certaines extensions de confidentialité, ce stockage peut être désactivé. Essayez en navigation normale ou avec un autre navigateur (Chrome, Firefox, Safari hors navigation privée).",
    en: "This tool saves everything on-device (IndexedDB). Private browsing, blocked cookies, or some privacy extensions can disable this storage. Try regular browsing mode or another browser (Chrome, Firefox, Safari outside private browsing).",
  },
  saveError: {
    fr: "Impossible d'enregistrer — vérifiez les paramètres de confidentialité de votre navigateur.",
    en: "Could not save — check your browser's privacy settings.",
  },
  saveErrorBlocked: {
    fr: "Impossible d'enregistrer — fermez les autres onglets ouverts sur cette application, puis réessayez.",
    en: "Could not save — close other open tabs of this app, then try again.",
  },
  renamePlan: { fr: "Renommer le plan", en: "Rename plan" },
  switchToDark: { fr: "Passer en mode sombre", en: "Switch to dark mode" },
  switchToLight: { fr: "Passer en mode clair", en: "Switch to light mode" },
  confirmDeleteSurvey: {
    fr: "Supprimer ce relevé ? Cette action est irréversible.",
    en: "Delete this survey? This action cannot be undone.",
  },
} as const;

export function t(key: keyof typeof STRINGS, lang: Lang) {
  return STRINGS[key][lang];
}
