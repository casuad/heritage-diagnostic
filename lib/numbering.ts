import { Lot, Pathology } from "./types";

export function nextCode(lot: Lot, existing: Pathology[]) {
  const countInLot = existing.filter((p) => p.lotId === lot.id).length;
  return `${lot.prefix}-${String(countInLot + 1).padStart(2, "0")}`;
}
