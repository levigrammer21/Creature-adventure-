# Build and verification report — 1.0.0

Date: 19 October 2026. Evidence below comes from actual local runs. Automated browser/gameplay fixtures are isolated from player saves. No real player account was created, no production Firebase rules or providers were changed, and no paid service was enabled.

| Verification | Actual result | Evidence |
|---|---|---|
| Strict TypeScript + production build | Passed; app, React, Firebase, worker, CSS, PWA and artwork packaged | BUILD-OUTPUT.txt, TYPECHECK-OUTPUT.txt |
| Engine, persistence, art and Firestore rules | **42 passed** in the local Firestore emulator | RULES-TEST-OUTPUT.txt |
| Ordinary unit command | **39 passed; 3 emulator tests skipped**, as intended without the emulator | UNIT-TEST-OUTPUT.txt |
| Main browser walkthrough | **39 passed** | BROWSER-REPORT.json |
| Full art/encyclopedia walkthrough | **13 passed**, including every one of the 150 enlarged inspectors and all nine variant classes | ART-BROWSER-REPORT.json |
| Packaged installed PWA | **8 passed**, including repository subpath, service-worker control, offline reload, retained save, visible 1.0.0 and all ten atlases offline | PACKAGED-REPORT.json |
| All evolution paths | **100 edges passed**, all 150 forms recorded; identity/genetics/level/gear retained | RELEASE-REPORT.json |
| Dungeon/raid completion and resume | **24 seeded successful runs** across all five dungeons and three raids; serialized mid-run return equals uninterrupted settlement | RELEASE-REPORT.json |
| Earned progression | **168 simulated hours**, no injected levels/currency: 17 owned families, seven evolutions, five regions opened, level 166 highest, 94,888 victories, 182,129 skill cycles | PROGRESSION-REPORT.json |
| Seeded balance/probability checks | 100 trials per starter; all 50 family substitutions; ten boss trials; 100,000 rarity rolls; variant/upgrade probabilities | BALANCE-REPORT.json |
| Large inventory | 50,000 items; 1,000 stat evaluations around 53ms; 49,999-item bulk salvage around 1.21s, equipped item retained | PERFORMANCE-REPORT.json |

## What the tests exercise

The engine suite covers roster/reference counts, all staged stat calculations, exact elemental interactions, deterministic RNG, independent variant sampling, distinct rarity affixes, upgrade success floor and failure behavior, original salvage value, permanent milestones, complementary IV inheritance, locked/favorite/assigned protections, manual evolution identity, duplicate discovery handling, XP conservation, real recipe ingredients/outputs, queues and workflows, same-event production fallback, breeding repetition, individual AND/OR IV thresholds, Slayer turn-in, online/partitioned settlement, defeat cutoff and offline windows.

The rules suite rejects anonymous and cross-owner access, stale revisions and mutation of immutable snapshot pages. A large Unicode account round-trips through multiple pages; two concurrent writers cannot both publish the same expected revision. Conflicting rewards are not merged. Development saves migrate without rerolling individuals or silently resetting progress.

The main browser run covers starter choice/hatch, live combat, refresh recovery, 320/390/768/1280 layouts, all principal destinations, ability priority controls, second-tab read-only behavior and preserved checkpoints after closing the second tab. The art run pages every encyclopedia entry, opens every form inspector, checks stats/aptitudes, decodes the corresponding PNGs and exercises all nine appearance combinations. The package run uses the compiled output under `/Creature-adventure-/` and explicitly fetches every atlas after going offline.

## Corrections driven by verification and integration review

- Adjust opening wild encounter scaling and order advantageous targets first so a single starter has a viable opening.
- Keep recipe input reservation and the fixed shared creature-XP pool consistent. Use precision tolerance for fractional decimal XP.
- Start an affordable workflow successor at the same event timestamp after production exhausts ingredients; stop workflows that cannot progress.
- Connect all refined alloys to later facility/Gem/Trinket upgrades and add permanent Slayer milestone rewards.
- Freeze conflicting timelines before commands or offline reconciliation. Reject stale account-worker results and malformed collection/team data. Preserve originals on migration errors.
- Use Unicode-safe 50,000-character cloud pages and bounded commits; retry snapshot reads if another device replaces a generation while it is being read. Scale autosave spacing with snapshot size.
- Page large lists, avoid deep-copying the whole inventory every visual tick, index equipped items, avoid online-only summary scans and filter bulk salvage in one pass.
- Replace all development symbols with painted forms, isolate adjacent atlas art with native SVG clips, enlarge encyclopedia inspection, and cache nested image assets. Simplified clipping geometry reduced application output substantially without changing the original raster art.
- Display save/settlement errors with checkpoint export/reload controls so a retained checkpoint is recoverable from any destination.

## Practical limits of this evidence

- Live email/Google login, password recovery, production Firestore saves and another-device restore require the owner's provider/domain/rules setup. They have not been verified against the owner's real account. Emulator success is not described as live verification.
- The production GitHub Pages URL has not been published by this session. The connected repository integration rejected writes with `Resource not accessible by integration`. The prebuilt/source package is the concrete delivery.
- The earned-only simulation uses one simple decision policy. It is distinct from late-game fixtures that deliberately provide levels/gear to verify all adventures. It is not a natural all-collectibles or all-raid playthrough, nor proof that every strategy is equally strong.
- A family substitution victory establishes useful execution in a team, not perfect competitive balance. Exhaustive rare effect combinations, every phone/foldable/tablet, long-session thermal behavior and screen-reader workflows have not all been certified. Local benchmark times are not phone speed guarantees.
- Progression has no designed cap. Scientific decimal values and JavaScript counters still have finite representation and precision. Probability utilities deliberately saturate; they are not uncapped probabilities.
- Free cloud quotas can pause cloud sync. Local checkpoints and exports remain available; no billing upgrade or paid fallback is configured.

## Reproduction

Use Node with `npm ci`, then `npm test`, `npm run rules`, `npm run balance`, `npm run release:check`, `npm run progression`, `node --import tsx performance-check.ts`, `npm run browser`, `node --import tsx art-browser-check.mjs`, `npm run build`, and `npm run packaged`. Browser scripts accept `CHROMIUM_PATH`. Firestore tests use the demo project emulator, never the production project. Java 17 is supported by the pinned firebase-tools 14 release used here; later CLI releases may require a newer JDK.
