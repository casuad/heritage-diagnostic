# Relevé Patrimoine — Heritage Survey

Outil de terrain pour le diagnostic du bâti ancien : organisation par lots, pathologies ajoutées manuellement avec photo et niveau d'urgence, localisation sur plan, et rapport PDF bilingue (FR/EN) généré dans le navigateur.

Pensé pour le diagnostiqueur indépendant ou l'artisan du patrimoine — pas pour le BIM d'entreprise. Fonctionne hors-ligne, sans compte, sans serveur : toutes les données restent sur l'appareil (IndexedDB).

## Pourquoi

Les outils existants (ArchiSnapper, PocketSurvey, GoAudits…) couvrent le snagging et l'état des lieux générique, mais aucun n'est structuré autour des pathologies du bâti ancien (charpente, maçonnerie traditionnelle, couverture, humidité) ni de la logique de priorité de conservation. Ce projet comble ce trou pour un usage léger et personnel.

## Fonctionnalités

- Organisation par grand lot (structure/charpente, maçonnerie, couverture, humidité, menuiserie/ferronnerie) — le diagnostiqueur ajoute librement les pathologies constatées dans chaque lot (suggestions rapides disponibles, texte libre toujours possible)
- Numérotation intelligente automatique par lot (ex. `STR-01`, `MAC-02`) — repère unique réutilisé sur les plans et dans le rapport
- Notation de gravité à 4 niveaux (bon état → urgent) et photo géolocalisée par pathologie
- Adresse en saisie assistée (autocomplétion via la Base Adresse Nationale) avec carte de vérification du bâtiment (OpenStreetMap)
- Plans téléversables (façade, niveau…) avec placement des pathologies au clic, repérées par leur code
- Synthèse de priorité globale, calculée automatiquement
- Rapport PDF (page de garde, synthèse, pathologies par lot, plans annotés), bilingue FR/EN, entièrement généré côté client
- Export/import JSON pour sauvegarde, sans cloud
- PWA installable, fonctionne hors connexion

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · IndexedDB (`idb`) · `@react-pdf/renderer` · Leaflet/OpenStreetMap · API Adresse (data.gouv.fr)

Aucune clé API requise — la géolocalisation d'adresse et les fonds de carte utilisent des services publics gratuits et sans quota bloquant.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Limites connues (v1)

- Pas de multi-utilisateur ni de synchronisation cloud (choix volontaire — données 100% locales)
- Plans en image uniquement (pas de PDF de plan, pas de mise à l'échelle/mesure)
- Pas d'assistance IA à la rédaction (hors scope v1, envisageable en v2)

## Licence

MIT — voir [LICENSE](./LICENSE).
