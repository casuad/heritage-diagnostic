@AGENTS.md

---

# Relevé Patrimoine — contexte projet

Outil de démonstration technique, indépendant de tout autre projet du dossier `01 - PROJECTS/` (notamment Forma) — ne pas réintroduire de lien commercial ou de logique consulting.

## Ce que c'est

Webapp de diagnostic terrain pour le bâti ancien : les pathologies sont ajoutées librement par lot (pas une checklist figée), géolocalisées et photographiées, repérables sur plan, avec rapport PDF bilingue généré côté client. Zéro backend — toutes les données vivent dans IndexedDB du navigateur.

## Principes à respecter

- **Pas de backend, pas de compte.** Toute fonctionnalité doit rester implémentable côté client (IndexedDB, géocodage/carte via API publiques sans clé, génération PDF dans le navigateur). Si une feature nécessite un serveur applicatif, c'est un signal qu'elle appartient à une v2 hors scope.
- **Lots fixes, pathologies libres.** Les 5 lots (`lib/types.ts` → `CATEGORIES`) structurent l'affichage, mais les pathologies à l'intérieur sont saisies manuellement par le diagnostiqueur (texte libre + suggestions rapides dans `lib/pathology-suggestions.ts`). Ne jamais revenir à une checklist pré-remplie obligatoire.
- **Numérotation intelligente.** Chaque pathologie reçoit un code auto-généré par lot (`lib/numbering.ts`, ex. `STR-01`) au moment de sa création — ce code est le seul identifiant utilisé pour la relier à un repère sur un plan. Ne pas renuméroter à la suppression (les trous dans la séquence sont acceptables, la stabilité du code prime).
- **Bilingue FR/EN partout.** Toute chaîne visible passe par `lib/i18n.ts` (UI) ou les labels `{ fr, en }` des types/données.
- **Léger et rapide à étendre.** Ce projet sert de pièce de portfolio — privilégier la clarté du code à l'exhaustivité fonctionnelle.

## Structure

- `lib/types.ts` — modèle de données (Survey, Pathology, PlanRecord, PlanMarker, PhotoRecord, Severity, Category)
- `lib/pathology-suggestions.ts` — libellés suggérés par lot (purement indicatif, jamais imposé)
- `lib/numbering.ts` — génération du code séquentiel par lot
- `lib/geocode.ts` — autocomplétion d'adresse (API Adresse, data.gouv.fr — gratuite, sans clé)
- `lib/db.ts` — persistance IndexedDB (via `idb`) : surveys, pathologies, photos, plans, planMarkers
- `lib/synthesis.ts` — calcul des compteurs de gravité et de la priorité globale
- `components/AddressAutocomplete.tsx` / `MapPreview.tsx` — saisie d'adresse + carte de vérification (Leaflet/OpenStreetMap)
- `components/PathologySection.tsx` — un lot : ajout libre de pathologies, gravité, photo
- `components/PlanCanvas.tsx` + `app/survey/[id]/plans/` — upload de plan, placement des repères au clic
- `components/PdfDocument.tsx` — définition du rapport PDF (`@react-pdf/renderer`), inclut les plans annotés
- `app/survey/[id]/` — détail du relevé (lots), `/plans` (repérage), `/report` (génération PDF)
