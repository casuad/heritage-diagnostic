@AGENTS.md

---

# Relevé Patrimoine — contexte projet

Outil de démonstration technique, indépendant de tout autre projet du dossier `01 - PROJECTS/` (notamment Forma) — ne pas réintroduire de lien commercial ou de logique consulting.

## Ce que c'est

Webapp de diagnostic terrain pour le bâti ancien : les pathologies sont ajoutées librement (pas une checklist figée), consultables par lot, par zone ou par type de désordre, géolocalisées et photographiées, repérables sur plan, avec rapport PDF bilingue généré côté client. Zéro backend — toutes les données vivent dans IndexedDB du navigateur.

## Principes à respecter

- **Pas de backend, pas de compte.** Toute fonctionnalité doit rester implémentable côté client (IndexedDB, géocodage/carte via API publiques sans clé, génération PDF dans le navigateur). Si une feature nécessite un serveur applicatif (ex. analyse IA de documents), c'est un signal qu'elle appartient à une v2 hors scope — à traiter comme une décision d'architecture explicite, pas une extension silencieuse.
- **Lot obligatoire, zone/type libres.** Chaque pathologie a toujours un lot (`category`, requis — sert la numérotation), mais `zone` et `disorderType` sont des champs texte libres facultatifs. Les trois modes de `PathologyBoard` (lot/zone/type) sont des vues différentes sur la même liste, pas des modèles de données séparés.
- **Numérotation intelligente.** Chaque pathologie reçoit un code auto-généré par lot (`lib/numbering.ts`, ex. `STR-01`). Si le lot change après création, le code est recalculé (voir `handleUpdate` dans `app/survey/[id]/page.tsx`) — il n'est jamais figé, mais reste stable tant que le lot ne change pas.
- **Bilingue FR/EN partout.** Toute chaîne visible passe par `lib/i18n.ts` (UI) ou les labels `{ fr, en }` des types/données.
- **Léger et rapide à étendre.** Ce projet sert de pièce de portfolio — privilégier la clarté du code à l'exhaustivité fonctionnelle.

## Structure

- `lib/types.ts` — modèle de données (Survey, Pathology, PlanRecord, PlanMarker, DocumentRecord, PhotoRecord, Severity, Category, GroupMode)
- `lib/pathology-suggestions.ts` — libellés suggérés par lot (purement indicatif, jamais imposé)
- `lib/numbering.ts` — génération du code séquentiel par lot
- `lib/grouping.ts` — regroupement des pathologies par lot/zone/type pour `PathologyBoard`
- `lib/geocode.ts` — autocomplétion d'adresse (API Adresse, data.gouv.fr — gratuite, sans clé)
- `lib/db.ts` — persistance IndexedDB (via `idb`) : surveys, pathologies, photos, plans, planMarkers, documents
- `lib/synthesis.ts` — calcul des compteurs de gravité et de la priorité globale
- `components/AddressAutocomplete.tsx` / `MapPreview.tsx` — saisie d'adresse + carte de vérification (Leaflet/OpenStreetMap)
- `components/PathologyBoard.tsx` + `PathologyCard.tsx` — les 3 modes de saisie, ajout/édition de pathologie
- `components/DocumentsSection.tsx` — pièces jointes au relevé (sans analyse IA)
- `components/PlanCanvas.tsx` + `app/survey/[id]/plans/` — upload de plan, placement des repères au clic, popover photos liées
- `components/PdfDocument.tsx` — rapport PDF (`@react-pdf/renderer`) : introduction (notes + contexte), synthèse, pathologies par lot, plans annotés
- `app/survey/[id]/` — détail du relevé, `/plans` (repérage), `/report` (génération PDF)
