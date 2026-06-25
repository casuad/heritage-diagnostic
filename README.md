# Relevé Patrimoine — Heritage Survey

Outil de terrain pour le diagnostic du bâti ancien : organisation par lots, pathologies ajoutées manuellement avec photo et niveau d'urgence, localisation sur plan, et rapport PDF bilingue (FR/EN) généré dans le navigateur.

Pensé pour le diagnostiqueur indépendant ou l'artisan du patrimoine — pas pour le BIM d'entreprise. Fonctionne hors-ligne, sans compte, sans serveur : toutes les données restent sur l'appareil (IndexedDB).

## Pourquoi

Les outils existants (ArchiSnapper, PocketSurvey, GoAudits…) couvrent le snagging et l'état des lieux générique, mais aucun n'est structuré autour des pathologies du bâti ancien (charpente, maçonnerie traditionnelle, couverture, humidité) ni de la logique de priorité de conservation. Ce projet comble ce trou pour un usage léger et personnel.

## Fonctionnalités

- Trois modes de saisie des pathologies : par lot, par zone, ou par type de désordre — la même donnée, vue sous l'angle le plus pratique sur le terrain
- Numérotation intelligente automatique par lot (ex. `STR-01`, `MAC-02`) — repère unique réutilisé sur les plans et dans le rapport, recalculé si le lot change
- Suggestions rapides de pathologies par lot, texte libre toujours possible
- Notation de gravité à 4 niveaux (bon état → urgent), photo géolocalisée et commentaire par pathologie
- Adresse en saisie assistée (autocomplétion via la Base Adresse Nationale) avec carte de vérification du bâtiment (OpenStreetMap)
- Notes libres : description visuelle / principes constructifs, et contexte / raisons du diagnostic — repris dans l'introduction du rapport
- Documents joints au relevé (plans existants, diagnostics antérieurs…)
- Plans téléversables (façade, niveau…) avec placement des pathologies au clic, repérées par leur code ; clic sur un repère pour voir la pathologie et ses photos liées
- Synthèse de priorité globale, calculée automatiquement
- Rapport PDF (introduction, synthèse, pathologies par lot, plans annotés), bilingue FR/EN, entièrement généré côté client
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
- Pas de vue depuis la rue (street view), pas de dictée vocale, pas d'analyse IA des documents joints — en réflexion pour une v2, chacune impliquant une dépendance externe payante ou un backend

## Licence

MIT — voir [LICENSE](./LICENSE).
