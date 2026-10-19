import { createServer } from "vite";
import { chromium } from "playwright";
import fs from "node:fs";
import * as E from "./engine.ts";
import { FAMILIES } from "./content.ts";
const server = await createServer({
  server: { host: "127.0.0.1", port: 5178 },
  configFile: "vite.config.ts",
});
await server.listen();
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/tmp/ca-chromium/chromium",
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--single-process",
  ],
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
const errors = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
const check = (name, valid) => {
  checks.push({ name, passed: !!valid });
  if (!valid) throw Error("Check failed: " + name);
};
try {
  await page.goto("http://127.0.0.1:5178/", { waitUntil: "domcontentloaded" });
  await page.locator(".starter").first().waitFor();
  await page.waitForTimeout(500);
  check(
    "first tab acquires writer lock",
    (await page
      .getByText("Another tab is playing.", { exact: false })
      .count()) === 0,
  );
  await page.locator(".starter").first().click();
  await page.waitForTimeout(200);
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const r = indexedDB.open("creature-adventure", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise((resolve) => {
      const tx = db.transaction("saves", "readwrite");
      const store = tx.objectStore("saves");
      const req = store.get("guest");
      req.onsuccess = () => {
        const save = req.result;
        save.incubators[0].finish = Date.now() - 1;
        save.time = Date.now();
        store.put(save, "guest");
      };
      tx.oncomplete = resolve;
    });
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Visit farm" }).waitFor();
  await page.getByRole("button", { name: "Visit farm" }).click();
  await page
    .getByRole("button", { name: "Hatch companion", exact: true })
    .click();
  await page.waitForTimeout(200);
  check(
    "starter hatch creates one creature",
    (await page.getByText("Housing 1/10", { exact: false }).count()) > 0,
  );
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Explore" })
    .click();
  await page
    .locator(".encounter-card")
    .first()
    .getByRole("button", { name: "Challenge" })
    .click();
  check(
    "live battle uses player and enemy units",
    (await page.locator(".battle-unit").count()) === 2,
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Explore" })
    .waitFor();
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Explore" })
    .click();
  await page.locator(".battle-unit").first().waitFor();
  check(
    "refresh restores combat",
    (await page.locator(".battle-unit").count()) === 2,
  );
  const save = E.newSave(39812, Date.now());
  save.started = true;
  save.gold = "200000";
  save.tokens = "1000";
  save.facilities = {
    Housing: 10,
    Hatchery: 8,
    Breeding: 4,
    Recovery: 3,
    Workshop: 8,
    Expedition: 3,
  };
  save.unlocks = Array.from({ length: 10 }, (_, i) => "boss-" + i);
  for (let n = 0; n < 18; n++) {
    const inc = {
      id: "fixture-" + n,
      egg: E.egg(save, FAMILIES[n % 50].id, "QA fixture"),
      finish: save.time,
    };
    save.incubators.push(inc);
    E.hatch(save, inc.id);
    save.creatures.at(-1).level = 80;
    save.creatures.at(-1).stage = 3;
  }
  save.incubators = save.incubators.slice(0, 2);
  save.combatTeam = save.creatures.slice(0, 6).map((c) => c.id);
  save.skillTeam = save.creatures.slice(6, 12).map((c) => c.id);
  for (const k of Object.keys(save.skills)) save.skills[k].level = 500;
  for (let k = 0; k < 4; k++)
    for (let t = 0; t < 12; t++) save.inventory[`g${k}-${t}`] = "500";
  for (const k of [
    "essence",
    "gemdust",
    "thread",
    "relic",
    "catalyst",
    "inherit1",
    "inherit2",
    "inherit3",
    "ration",
    "potion",
  ])
    save.inventory[k] = "100";
  for (let i = 0; i < 8; i++)
    save.items.push(E.rollItem(save, 5, undefined, i % 6));
  save.eggs.push(E.egg(save, "W01", "QA fixture"));
  E.startSkill(save, "g0-1");
  E.startCombat(save, "boss-2");
  await page.evaluate(async (save) => {
    const db = await new Promise((resolve) => {
      const r = indexedDB.open("creature-adventure", 1);
      r.onsuccess = () => resolve(r.result);
    });
    await new Promise((resolve) => {
      const tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(save, "guest");
      tx.oncomplete = resolve;
    });
  }, save);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator(".hero").waitFor();
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: width >= 768 ? 950 : 844 });
    await page.waitForTimeout(100);
    check(
      "home fits " + width + "px",
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page.setViewportSize({ width: 1280, height: 950 });
  await page.screenshot({
    path: "/workspace/scratch/3b8102b303b2/desktop-home.png",
    fullPage: true,
  });
  for (const name of [
    "Combat",
    "Creatures",
    "Skills",
    "Farm",
    "Equipment",
    "Slayer",
    "Collection",
    "Shop",
    "Settings",
  ]) {
    await page
      .locator(".sidebar nav")
      .getByRole("button", { name, exact: true })
      .click();
    await page.waitForTimeout(120);
    check(
      name + " renders",
      (await page.locator(".page-title h1").innerText()) === name,
    );
    check(
      name + " fits desktop",
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page
    .locator(".sidebar nav")
    .getByRole("button", { name: "Combat", exact: true })
    .click();
  await page.screenshot({
    path: "/workspace/scratch/3b8102b303b2/desktop-combat.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  await page.screenshot({
    path: "/workspace/scratch/3b8102b303b2/mobile-combat.png",
    fullPage: true,
  });
  for (const name of [
    "Home",
    "Creatures",
    "Skills",
    "Farm",
    "Equipment",
    "Slayer",
    "Collection",
    "Shop",
    "Settings",
  ]) {
    if (["Home", "Creatures", "Skills"].includes(name))
      await page
        .locator(".bottom-nav")
        .getByRole("button", { name, exact: true })
        .click();
    else {
      await page
        .locator(".bottom-nav")
        .getByRole("button", { name: "More", exact: true })
        .click();
      await page
        .locator(".more-menu")
        .getByRole("button", { name, exact: true })
        .click();
    }
    await page.waitForTimeout(100);
    check(
      name + " fits mobile",
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Home", exact: true })
    .click();
  await page.screenshot({
    path: "/workspace/scratch/3b8102b303b2/mobile-home.png",
    fullPage: true,
  });
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Creatures", exact: true })
    .click();
  await page.locator(".creature-card").first().click();
  await page.getByRole("button", { name: "Abilities", exact: true }).click();
  check(
    "ability priorities shown",
    (await page.locator(".ability").count()) === 3,
  );
  await page
    .locator(".ability")
    .last()
    .getByRole("button", { name: /Move .* up/ })
    .click();
  await page
    .getByRole("button", { name: "Close creature", exact: true })
    .click();
  const second = await context.newPage();
  await second.goto("http://127.0.0.1:5178/", {
    waitUntil: "domcontentloaded",
  });
  await second.getByText("Another tab is playing.", { exact: false }).waitFor();
  check("second tab is read-only", true);
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "More", exact: true })
    .click();
  await page
    .locator(".more-menu")
    .getByRole("button", { name: "Settings", exact: true })
    .click();
  await page.getByRole("checkbox", { name: "Interface sound" }).check();
  await page.waitForTimeout(200);
  await second.close();
  const soundSaved = await page.evaluate(async () => {
    const db = await new Promise((resolve) => {
      const req = indexedDB.open("creature-adventure", 1);
      req.onsuccess = () => resolve(req.result);
    });
    return new Promise((resolve) => {
      const req = db
        .transaction("saves", "readonly")
        .objectStore("saves")
        .get("guest");
      req.onsuccess = () => resolve(req.result.settings.sound);
    });
  });
  check(
    "closing a read-only tab preserves the newer checkpoint",
    soundSaved === true,
  );
  check("no runtime page errors", errors.length === 0);
} catch (e) {
  checks.push({ name: "aborted", passed: false, error: e.message });
  console.error(e);
} finally {
  fs.writeFileSync(
    "BROWSER-REPORT.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        browser: await browser.version(),
        checks,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
  await server.close();
  if (checks.some((c) => !c.passed)) process.exitCode = 1;
}
