import { CATEGORY_PREFIX, Category, Pathology } from "./types";

export function nextCode(category: Category, existing: Pathology[]) {
  const countInCategory = existing.filter((p) => p.category === category).length;
  return `${CATEGORY_PREFIX[category]}-${String(countInCategory + 1).padStart(2, "0")}`;
}
