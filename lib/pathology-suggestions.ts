import { Category } from "./types";

// Suggestions rapides par lot — cliquer pré-remplit le libellé, librement modifiable.
export const PATHOLOGY_SUGGESTIONS: Record<Category, { fr: string; en: string }[]> = {
  structure: [
    { fr: "Fissures structurelles (murs porteurs)", en: "Structural cracks (load-bearing walls)" },
    { fr: "Affaissement de plancher", en: "Floor sagging" },
    { fr: "Dégradation charpente bois (xylophages, pourriture)", en: "Timber frame decay (wood-boring insects, rot)" },
    { fr: "Déformation de structure porteuse", en: "Load-bearing structure deformation" },
  ],
  maconnerie: [
    { fr: "Fissures en façade", en: "Facade cracking" },
    { fr: "Désagrégation de mortier / joints", en: "Mortar / joint disintegration" },
    { fr: "Efflorescence saline", en: "Saline efflorescence" },
    { fr: "Décollement d'enduit", en: "Render detachment" },
  ],
  couverture: [
    { fr: "Tuiles / ardoises manquantes ou cassées", en: "Missing or broken tiles / slates" },
    { fr: "Infiltration en toiture", en: "Roof water infiltration" },
    { fr: "Dégradation de zinguerie / gouttières", en: "Flashing / gutter degradation" },
    { fr: "Affaissement de couverture", en: "Roof structure sagging" },
  ],
  humidite: [
    { fr: "Remontées capillaires", en: "Rising damp" },
    { fr: "Moisissures / champignons", en: "Mould / fungal growth" },
    { fr: "Infiltration latérale", en: "Lateral water infiltration" },
    { fr: "Condensation excessive", en: "Excessive condensation" },
  ],
  menuiserie: [
    { fr: "Pourrissement bois (fenêtres / portes)", en: "Timber rot (windows / doors)" },
    { fr: "Corrosion ferronnerie", en: "Ironwork corrosion" },
    { fr: "Étanchéité défaillante des menuiseries", en: "Failing joinery seals" },
    { fr: "Vitrage endommagé", en: "Damaged glazing" },
  ],
};
