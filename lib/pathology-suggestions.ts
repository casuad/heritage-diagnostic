// Suggestions rapides par lot — cliquer pré-remplit le libellé, librement modifiable.
// Keyées par templateSlug (voir lib/lots.ts) : uniquement les 4 lots par défaut en
// proposent ; un lot créé manuellement par l'utilisateur n'a pas de suggestions.
export const PATHOLOGY_SUGGESTIONS: Record<string, { fr: string; en: string }[]> = {
  structure: [
    { fr: "Fissures structurelles (murs porteurs)", en: "Structural cracks (load-bearing walls)" },
    { fr: "Affaissement de plancher", en: "Floor sagging" },
    { fr: "Dégradation charpente bois (xylophages, pourriture)", en: "Timber frame decay (wood-boring insects, rot)" },
    { fr: "Désagrégation de mortier / joints de maçonnerie", en: "Mortar / masonry joint disintegration" },
  ],
  enveloppe: [
    { fr: "Tuiles / ardoises manquantes ou cassées", en: "Missing or broken tiles / slates" },
    { fr: "Infiltration en toiture ou en façade", en: "Roof or facade water infiltration" },
    { fr: "Remontées capillaires / humidité ascensionnelle", en: "Rising damp" },
    { fr: "Dégradation de zinguerie / gouttières", en: "Flashing / gutter degradation" },
  ],
  "second-oeuvre": [
    { fr: "Pourrissement bois (fenêtres / portes)", en: "Timber rot (windows / doors)" },
    { fr: "Étanchéité défaillante des menuiseries", en: "Failing joinery seals" },
    { fr: "Moisissures / dégradation des finitions intérieures", en: "Mould / interior finish degradation" },
    { fr: "Vitrage endommagé", en: "Damaged glazing" },
  ],
  "lots-techniques": [
    { fr: "Installation électrique vétuste ou non conforme", en: "Outdated or non-compliant electrical wiring" },
    { fr: "Fuite ou corrosion sur réseau de plomberie", en: "Plumbing leak or corrosion" },
    { fr: "Absence ou dysfonctionnement de ventilation/CVC", en: "Missing or faulty ventilation/HVAC" },
    { fr: "Tableau électrique non sécurisé", en: "Unsecured electrical panel" },
  ],
};
