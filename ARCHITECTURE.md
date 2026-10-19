# Release architecture

React 19 and TypeScript provide the mobile interface; Vite prepares flat static output. The compiled game runs on ordinary HTTPS hosting and can be installed as a PWA. No desktop build is necessary to deploy the delivered files. All authored source is at the repository root; only raster artwork is inside `img/`.

| File | Responsibility |
|---|---|
| model.ts | Versioned save/content types, five elements, nine skills, stats, gear, jobs, combat units and rules |
| content.ts | All 50 family records, staged abilities/passives, 150 form identities, encounters, activities, recipes, facilities, journal and hybrid recipes |
| engine.ts | Seeded RNG, centralized stats/XP, chronological shared simulation, commands and resource validation |
| persistence.ts | Existing-project Firebase auth, IndexedDB, bounded immutable Firestore pages, transactions, clock anchor and migrations |
| simulator-worker.ts | Return settlement using the same engine off the UI thread |
| art.ts + img | Every form's original painted raster and independent native SVG viewport/clips |
| app.tsx + styles.css | Navigation, live game panels, creature/form inspection, teams, workflows and account controls |
| package-build.mjs | Static packaging, recursive art cache, PWA manifest and source/compiled delivery |

Each individual retains a stable ID. Eggs carry their pre-generated IVs, gender and independent appearance axes. A save stores live combat unit timers/cooldowns/statuses, dungeon node, reserved skill cycle ingredients, incubators, breeding jobs, upgrades, workflows, loadouts and collection records. Refreshing resumes those exact objects; offline settlement advances their scheduled events rather than multiplying a reward rate.

The owner explicitly chose free Spark-plan Firebase and browser-computed gameplay for personal use. Authentication uses email/password, Google popup, reset and persistent login. Firestore stores a bounded account header at `players/{uid}` and immutable payload pages under `players/{uid}/snapshots/{generation-page}`. Pages are published before a transaction changes the revision pointer. A stale writer cannot publish over a newer revision; conflicting timelines are exported or explicitly replaced rather than merged. Firestore rules isolate owners. No service-account credentials, paid functions or replacement Firebase project are included.

Schema 1 remains compatible with development saves. Migration updates version metadata and removes duplicate collection entries without rerolling creatures, eggs, equipment or active jobs. Unsupported/corrupt saves produce an error while preserving their original checkpoint. Guest and account timelines remain separate. A writer lock prevents multiple tabs from advancing the same local save.

Randomness is deterministic per save through one RNG interface. Decimal scientific values carry uncapped gameplay statistics/resources; probabilities saturate and costs grow. There is no designed level/mastery/equipment/facility ceiling. Finite numerical representation is a technical boundary, not an imposed progression cap.
