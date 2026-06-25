import { Pathology, Severity } from "./types";

export interface SeverityCounts {
  0: number;
  1: number;
  2: number;
  3: number;
  unset: number;
  total: number;
}

export function computeSeverityCounts(pathologies: Pathology[]): SeverityCounts {
  const counts: SeverityCounts = { 0: 0, 1: 0, 2: 0, 3: 0, unset: 0, total: pathologies.length };
  for (const pathology of pathologies) {
    if (pathology.severity === null) counts.unset += 1;
    else counts[pathology.severity as Severity] += 1;
  }
  return counts;
}

export function overallPriorityLabel(counts: SeverityCounts): { fr: string; en: string } {
  if (counts[3] > 0) return { fr: "Intervention urgente requise", en: "Urgent intervention required" };
  if (counts[2] > 0) return { fr: "Travaux à programmer", en: "Works to be scheduled" };
  if (counts[1] > 0) return { fr: "Surveillance recommandée", en: "Monitoring recommended" };
  if (counts.total === 0) return { fr: "Aucune pathologie relevée", en: "No pathology recorded" };
  return { fr: "Bon état général", en: "Good overall condition" };
}
