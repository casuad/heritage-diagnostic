@AGENTS.md

---

# Relevo — contexte projet

Outil de démonstration technique. Le produit, le nom et toute logique commerciale/consulting restent indépendants des autres projets du dossier `01 - PROJECTS/` — pas de backend partagé, pas de lien commercial, pas de continuité de code avec Forma.

**Exception explicitement décidée et assumée :** l'identité visuelle (palette sombre + accent orange brûlé, polices DM Sans/Krona One, mark hexagonal) réutilise volontairement les codes graphiques de Forma. Seule l'identité visuelle est partagée — le nom du produit ("Relevo"), son positionnement et son code restent propres à ce projet.

## Ce que c'est

Webapp de diagnostic terrain pour le bâti ancien : les pathologies sont ajoutées librement (pas une checklist figée), consultables par lot, par zone ou par type de désordre, géolocalisées et photographiées, repérables sur plan, avec rapport PDF bilingue généré côté client. Zéro backend — toutes les données vivent dans IndexedDB du navigateur.

## Principes à respecter

- **Pas de backend, pas de compte.** Toute fonctionnalité doit rester implémentable côté client (IndexedDB, géocodage/carte via API publiques sans clé, génération PDF dans le navigateur). Si une feature nécessite un serveur applicatif (ex. analyse IA de documents), c'est un signal qu'elle appartient à une v2 hors scope — à traiter comme une décision d'architecture explicite, pas une extension silencieuse.
- **Lot obligatoire, zone/type libres, lots modifiables.** Chaque pathologie a toujours un lot (`lotId`, requis — sert la numérotation), mais `zone` et `disorderType` sont des champs texte libres facultatifs. Les lots eux-mêmes sont des entités par relevé (`lib/types.ts#Lot`, store `lots` dans IndexedDB), créées/renommées/supprimées librement par l'utilisateur — ce ne sont plus des catégories figées. Chaque nouveau relevé est pré-rempli avec 4 lots par défaut (`lib/lots.ts#defaultLotsFor`). Les trois modes de `PathologyBoard` (lot/zone/type) sont des vues différentes sur la même liste, pas des modèles de données séparés.
- **Numérotation intelligente.** Chaque pathologie reçoit un code auto-généré par lot (`lib/numbering.ts`, ex. `STR-01`, préfixe propre à chaque `Lot`). Si le lot change après création, le code est recalculé (voir `handleUpdate` dans `app/survey/[id]/page.tsx`) — il n'est jamais figé, mais reste stable tant que le lot ne change pas.
- **Bilingue FR/EN partout.** Toute chaîne visible passe par `lib/i18n.ts` (UI) ou les labels `{ fr, en }` des types/données. Les lots et zones/types créés par l'utilisateur restent en texte libre (une seule langue, comme zone/disorderType) — seuls les 4 lots par défaut sont seedés bilingues selon la langue active à la création du relevé.
- **Thème clair/sombre.** Géré via une classe `.dark` sur `<html>` (`lib/theme-context.tsx`, persistée en `localStorage` clé `relevo-theme`) et le variant Tailwind v4 `@custom-variant dark` dans `app/globals.css`. Toute nouvelle surface doit gérer les deux variantes.
- **Léger et rapide à étendre.** Ce projet sert de pièce de portfolio — privilégier la clarté du code à l'exhaustivité fonctionnelle.

## Structure

- `lib/types.ts` — modèle de données (Survey, Pathology, Lot, PlanRecord, PlanMarker, DocumentRecord, PhotoRecord, Severity, GroupMode)
- `lib/lots.ts` — lots par défaut seedés à la création d'un relevé, génération de préfixe pour un lot créé manuellement
- `lib/pathology-suggestions.ts` — libellés suggérés par lot par défaut (keyés par `templateSlug`, purement indicatif, jamais imposé ; absent pour un lot créé manuellement)
- `lib/numbering.ts` — génération du code séquentiel par lot
- `lib/grouping.ts` — regroupement des pathologies par lot/zone/type pour `PathologyBoard`
- `lib/geocode.ts` — autocomplétion d'adresse (API Adresse, data.gouv.fr — gratuite, sans clé)
- `lib/db.ts` — persistance IndexedDB (via `idb`) : surveys, pathologies, photos, plans, planMarkers, documents, lots
- `lib/synthesis.ts` — calcul des compteurs de gravité et de la priorité globale
- `lib/theme-context.tsx` / `components/ThemeToggle.tsx` — mode clair/sombre
- `components/AddressAutocomplete.tsx` / `MapPreview.tsx` — saisie d'adresse + carte de vérification (Leaflet/OpenStreetMap)
- `components/PathologyBoard.tsx` + `PathologyCard.tsx` — les 3 modes de saisie, gestion des lots (ajout/renommage/suppression), ajout/édition de pathologie
- `components/DocumentsSection.tsx` — pièces jointes au relevé (sans analyse IA), distinctes des plans annotables
- `components/PlanCanvas.tsx` + `app/survey/[id]/plans/` — upload de plan, renommage, placement des repères au clic, popover photos liées
- `components/PdfDocument.tsx` — rapport PDF (`@react-pdf/renderer`) : introduction (notes + contexte), synthèse, pathologies par lot, plans annotés
- `app/survey/[id]/` — détail du relevé, `/plans` (repérage), `/report` (génération PDF)
