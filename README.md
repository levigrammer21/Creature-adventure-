# Creature Adventure

Release **1.0.0**. A mobile-first, single-player creature collector using the owner's `creaturerpg` Firebase project. All calculations run on-device; Firebase handles authentication and cloud snapshots. No Blaze plan, Cloud Functions, paid backend, or billing setup.

The package contains the playable compiled game, complete TypeScript source, all 150 painted forms, configuration files and actual test reports. Production account setup is still required in the owner’s existing Firebase/GitHub projects; no live deployment or real-account verification is claimed.

## Phone-only deployment

The repository delivery includes a compiled `index.html`, JavaScript/CSS bundles, manifest, service worker, and flat TypeScript source. No local build is needed to play.

1. On GitHub, open this repository → **Settings → Pages**.
2. Select **Deploy from a branch**, the delivered branch, and **/(root)**. Save.
3. Wait for GitHub to show the Pages URL. Expected repository path: `https://levigrammer21.github.io/Creature-adventure-/` (availability must be verified after Pages is enabled).
4. Open that URL in your phone's normal browser. Add it to your home screen if desired.

No `.github/workflows` exception is used. Source and deployable files remain flat; generated local staging and installed dependencies are not committed. All assets are bundled or use system-font fallback; Firebase Storage is not used.

## Firebase console setup — required once

The provided web config is included. It does not grant administrative access to your Firebase console. These settings have **not** been changed for you:

1. In the existing **creaturerpg** project, enable Authentication → Email/Password and Google. Choose the Google support email if asked.
2. Add **levigrammer21.github.io** to Authentication's authorized domains. Use the hostname without the repository path. Keep your existing domains.
3. Create the default Cloud Firestore database if it does not exist. Stay on the free Spark plan.
4. Copy the complete contents of the root **firestore.rules** file into Firestore → Rules and publish them. Do not use public test rules.
5. Open the game, create/sign into your own account, and select **Save to cloud now** in Settings.
6. Verify on another device by signing into the same account. After the initial transfer, use one active device at a time.

Google sign-in uses a popup. If an embedded app browser blocks popups, open the Pages URL in Chrome or Safari. Password reset is available in the account panel.

## Device and cloud saves

The guest sanctuary and each signed-in account have separate IndexedDB saves. If you play as a guest first, sign in and use **Settings → Import guest sanctuary**, then **Save to cloud now**. This explicitly replaces the account's current local timeline; it does not merge rewards.

Local checkpoints occur every five seconds and after commands. Cloud checkpoints begin at a 90-second interval and automatically space out as snapshot size grows to reduce free-plan write traffic. They can also be requested manually. Cloud data is partitioned into immutable bounded snapshot pages with an atomically updated revision pointer. A new pointer becomes visible only after its pages are written.

If a different device saved first, the game stops automatic reconciliation and offers an export of the current timeline and loading the cloud timeline. It never adds rewards from conflicting timelines. Cloud network/quota failures preserve the local checkpoint. Do not clear browser storage before unsynced progress is backed up.

Server timestamps provide a connected clock anchor where rules permit it. Guest and disconnected progress use the device clock until reconnection. This is not an anti-cheat service; modified clients can alter their own progress, as accepted by the owner.

## Playing

- Choose Cindlet, Burlit, or Droplet. Your first egg takes 30 seconds; later eggs share a 60-minute base incubation duration.
- Hatch at Farm. The first creature enters the first combat slot.
- Select a wild encounter. The opening list favors your first companion's elemental advantage.
- Claim **Into the wilds** in the Home journal or Collection → Journal for a second egg.
- Assign a separate creature to Skills. Combat and one skilling activity can operate together.
- The first boss unlocks breeding, equipment upgrades, and Slayer. Evolution is manual at levels 25 and 75, with materials and boss requirements.
- Pause skilling and let the reserved cycle finish before changing its crew. Stop combat before changing its formation or equipment.
- Facility descriptions show automation milestones. Rule previews exclude protected creatures/equipment. Review destructive actions carefully.
- Defeat stops combat. The team recovers automatically, and a retry resumes the saved encounter when requested. Earned rewards remain.

## Development

Root source modules: model.ts, content.ts, engine.ts, persistence.ts, app.tsx, main.tsx, styles.css, simulator-worker.ts. Deterministic engine functions do not depend on React or Firebase.

With Node available: `npm ci`, `npm test`, `npm run balance`, `npm run build`. These are developer commands, not required to play or deploy the delivered static files from a phone.

The build uses `index.source.html` as its source template, emits flat output to a transient staging directory, and packages the manifest/service worker. Commit the prepared source and output together. Keep a visible version and update CHANGELOG.md on every release. Do not edit generated bundles by hand.

Browser verification uses `node --import tsx browser-check.mjs`, with `CHROMIUM_PATH` pointing to a supported local Chromium binary. It starts its own Vite server in the same process and uses isolated test fixtures; no real player account is created. Firestore rules tests use the local emulator with the demo project only; no production rules or billing settings are changed.

## Artwork and encyclopedia

All 150 forms use the approved painted art. Tap any form in Collection to enlarge it and inspect its stats, abilities, passive, aptitudes and evolution costs. Color/effect preview controls demonstrate all nine variant combinations. Image assets are the only nested project files, inside `img/`.

## Verification

See TEST-REPORT.md for the actual test/build evidence and its limits. Reproduce the extra checks with `npm run release:check`, `npm run progression`, and `node --import tsx performance-check.ts`. The supplied reports distinguish earned-only progression from deliberately populated regression fixtures.
