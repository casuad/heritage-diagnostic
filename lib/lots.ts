import { newId } from "./id";
import { Lang, Lot } from "./types";

export interface LotTemplate {
  slug: string;
  prefix: string;
  name: { fr: string; en: string };
}

export const DEFAULT_LOT_TEMPLATES: LotTemplate[] = [
  {
    slug: "structure",
    prefix: "STR",
    name: { fr: "Structure / Gros-Œuvre", en: "Structure / Shell" },
  },
  {
    slug: "enveloppe",
    prefix: "ENV",
    name: {
      fr: "Enveloppe (Couverture/Façade/Étanchéité)",
      en: "Envelope (Roofing/Facade/Waterproofing)",
    },
  },
  {
    slug: "second-oeuvre",
    prefix: "SEC",
    name: { fr: "Second-Œuvre / Aménagements intérieurs", en: "Finishing Works / Interior Fit-out" },
  },
  {
    slug: "lots-techniques",
    prefix: "TEC",
    name: {
      fr: "Lots techniques (Plomberie, CVC, Électricité)",
      en: "Technical Trades (Plumbing, HVAC, Electrical)",
    },
  },
];

export function defaultLotsFor(surveyId: string, lang: Lang): Lot[] {
  return DEFAULT_LOT_TEMPLATES.map((tpl, i) => ({
    id: newId(),
    surveyId,
    name: tpl.name[lang],
    prefix: tpl.prefix,
    order: i,
    templateSlug: tpl.slug,
  }));
}

const DIACRITIC_MAP = new Map(
  Object.entries({
    "à": "a", "â": "a", "ä": "a", "é": "e", "è": "e", "ê": "e", "ë": "e",
    "î": "i", "ï": "i", "ô": "o", "ö": "o", "œ": "oe", "ù": "u", "û": "u",
    "ü": "u", "ç": "c", "ñ": "n",
  })
);

function stripDiacritics(value: string): string {
  return value
    .toLowerCase()
    .split("")
    .map((ch) => DIACRITIC_MAP.get(ch) ?? ch)
    .join("");
}

export function makeLotPrefix(name: string, existingPrefixes: string[]): string {
  const base =
    stripDiacritics(name)
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 3)
      .padEnd(3, "X") || "LOT";

  let prefix = base;
  let i = 2;
  while (existingPrefixes.includes(prefix)) {
    prefix = `${base.slice(0, 2)}${i}`;
    i += 1;
  }
  return prefix;
}
