import { CATEGORIES, CATEGORY_LABELS, Category, GroupMode, Lang, Pathology } from "./types";

export const EMPTY_GROUP_KEY = "__empty__";

export interface PathologyGroup {
  key: string;
  label: string;
  category?: Category;
  items: Pathology[];
}

export function groupPathologies(pathologies: Pathology[], mode: GroupMode, lang: Lang): PathologyGroup[] {
  if (mode === "lot") {
    return CATEGORIES.map((category) => ({
      key: category,
      label: CATEGORY_LABELS[category][lang],
      category,
      items: pathologies.filter((p) => p.category === category),
    }));
  }

  const field = mode === "zone" ? "zone" : "disorderType";
  const map = new Map<string, Pathology[]>();
  map.set(EMPTY_GROUP_KEY, []);
  for (const pathology of pathologies) {
    const value = pathology[field].trim();
    const key = value || EMPTY_GROUP_KEY;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(pathology);
  }

  const groups = Array.from(map.entries()).map(([key, items]) => ({
    key,
    label: key === EMPTY_GROUP_KEY ? "" : key,
    items,
  }));

  groups.sort((a, b) => {
    if (a.key === EMPTY_GROUP_KEY) return 1;
    if (b.key === EMPTY_GROUP_KEY) return -1;
    return a.label.localeCompare(b.label);
  });

  return groups;
}
