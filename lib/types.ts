export type Severity = 0 | 1 | 2 | 3;

export const SEVERITY_LABELS: Record<Severity, { fr: string; en: string; color: string }> = {
  0: { fr: "Bon état", en: "Good condition", color: "#3da66a" },
  1: { fr: "À surveiller", en: "To monitor", color: "#d4a72c" },
  2: { fr: "Dégradé", en: "Degraded", color: "#e0742f" },
  3: { fr: "Urgent", en: "Urgent", color: "#d6432f" },
};

export type Category =
  | "structure"
  | "maconnerie"
  | "couverture"
  | "humidite"
  | "menuiserie";

export const CATEGORY_LABELS: Record<Category, { fr: string; en: string }> = {
  structure: { fr: "Structure & charpente", en: "Structure & framing" },
  maconnerie: { fr: "Maçonnerie", en: "Masonry" },
  couverture: { fr: "Couverture", en: "Roofing" },
  humidite: { fr: "Humidité", en: "Moisture" },
  menuiserie: { fr: "Menuiserie & ferronnerie", en: "Joinery & ironwork" },
};

export const CATEGORY_PREFIX: Record<Category, string> = {
  structure: "STR",
  maconnerie: "MAC",
  couverture: "COU",
  humidite: "HUM",
  menuiserie: "MEN",
};

export const CATEGORIES: Category[] = ["structure", "maconnerie", "couverture", "humidite", "menuiserie"];

export type GroupMode = "lot" | "zone" | "disorderType";

export interface Pathology {
  id: string;
  surveyId: string;
  category: Category;
  code: string;
  label: string;
  zone: string;
  disorderType: string;
  severity: Severity | null;
  comment: string;
  createdAt: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Survey {
  id: string;
  buildingName: string;
  address: string;
  buildingType: string;
  date: string;
  surveyor: string;
  geo?: GeoPoint | null;
  notes: string;
  diagnosticContext: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  surveyId: string;
  name: string;
  blob: Blob;
  createdAt: string;
}

export interface PhotoRecord {
  id: string;
  surveyId: string;
  pathologyId: string;
  blob: Blob;
  takenAt: string;
  geo?: GeoPoint | null;
}

export interface PlanRecord {
  id: string;
  surveyId: string;
  name: string;
  blob: Blob;
  createdAt: string;
}

export interface PlanMarker {
  id: string;
  planId: string;
  pathologyId: string;
  x: number;
  y: number;
}

export type Lang = "fr" | "en";
