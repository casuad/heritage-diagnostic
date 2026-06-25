export type Severity = 0 | 1 | 2 | 3;

export const SEVERITY_LABELS: Record<Severity, { fr: string; en: string; color: string }> = {
  0: { fr: "Bon état", en: "Good condition", color: "#3da66a" },
  1: { fr: "À surveiller", en: "To monitor", color: "#d4a72c" },
  2: { fr: "Dégradé", en: "Degraded", color: "#e0742f" },
  3: { fr: "Urgent", en: "Urgent", color: "#d6432f" },
};

export interface Lot {
  id: string;
  surveyId: string;
  name: string;
  prefix: string;
  order: number;
  // Links a lot back to one of the seeded default trades, for suggestion
  // lookups (see lib/pathology-suggestions.ts). Absent on user-created lots.
  templateSlug?: string;
}

export type GroupMode = "lot" | "zone" | "disorderType";

export interface Pathology {
  id: string;
  surveyId: string;
  lotId: string;
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
