# Creature Adventure 1.2.0

This download contains the full source and a prebuilt playable web game. It has one containing folder. Upload its contents to the root of your existing repository; keep the `img` folder and its ten images together. Do not upload the outer containing folder as a second website directory.

The repository link is https://github.com/levigrammer21/Creature-adventure-. The connected GitHub integration previously rejected writes with `Resource not accessible by integration`; this package has not been pushed or published for you. After uploading, use Settings → Pages → Deploy from a branch → your branch → /(root). No Actions workflow or paid build service is required.

The provided Firebase configuration is already included. In the existing `creaturerpg` Firebase console, enable Email/Password and Google authentication, authorize `levigrammer21.github.io`, create Firestore if needed, and publish `firestore.rules`. Keep Spark/free; do not enable Blaze. These account settings cannot be enabled using a public web configuration alone.

Upload every supplied root file, including the new JavaScript/CSS bundles, together with img. Keep the website on the same URL to preserve browser saves. Open it in Chrome or Safari. Home now shows your farm. Tap Nursery to manage egg stacks and nests, Work areas for parallel tasks, or Pasture for companions. Open the welcome basket after your first hatch to get two helper eggs and a second nest if needed.

Eggs are stacked by family and take five minutes before upgrades. Skills runs three independent work areas from the beginning, expanding to eight through Workshop upgrades. Each creature has one assignment. Combat remains separate. All offline progress is capped at twelve hours; no upgrade extends it. Existing saves and egg genetics are retained. Existing work becomes work area 1.

README.md contains detailed deployment and play instructions. TEST-REPORT.md records the actual automated checks and clearly identifies what still needs a live account/device verification. CHANGELOG.md describes the interface and combat overhaul. No existing save is intentionally reset by this release.
