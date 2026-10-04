// Real-app capture against the local production server (dev DB, Physiqly brand).
//   node capture.mjs <jobsFile.json> <outDir>
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3005";
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const env = readFileSync("C:/Users/dor/Desktop/TrainMe/.env", "utf8");
const PW = env.match(/^DEMO_SEED_PASSWORD=(.*)$/m)[1].trim();

const jobs = JSON.parse(readFileSync(process.argv[2], "utf8"));
const out = process.argv[3];
mkdirSync(out, { recursive: true });

const VIEWPORTS = {
  dx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  laptop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

const browser = await chromium.launch({ executablePath: EXE });
const sessions = new Map();

async function contextFor(user, vp) {
  const k = user + "|" + vp;
  if (sessions.has(k)) return sessions.get(k);
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], colorScheme: "dark", locale: "en-US", timezoneId: "Asia/Jerusalem" });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("trainme-language", "en");
      localStorage.setItem("trainme-pwa-install-dismissed", String(Date.now()));
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.fill("#email", `${user}@demo.physiqly.test`);
  await page.fill("#password", PW);
  await Promise.all([page.waitForURL(/dashboard/, { timeout: 60000 }), page.click('button[type="submit"]')]);
  await page.close();
  sessions.set(k, ctx);
  return ctx;
}

for (const j of jobs) {
  const ctx = await contextFor(j.user, j.vp);
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + j.url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(j.wait ?? 2500);
    for (const step of j.steps ?? []) {
      if (step.click) await page.click(step.click, { timeout: 15000 });
      if (step.clickText) await page.getByText(step.clickText, { exact: step.exact ?? false }).first().click({ timeout: 15000 });
      if (step.eval) await page.evaluate(step.eval);
      if (step.shot) { await page.waitForTimeout(step.pre ?? 3000); await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.finish(); } catch {} })); await page.screenshot({ path: path.join(out, step.shot + '.png'), fullPage: !!step.full }); console.log('shot', step.shot); }
      if (step.scroll != null) await page.evaluate((y) => window.scrollTo(0, y), step.scroll);
      await page.waitForTimeout(step.wait ?? 1500);
    }
    await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.finish(); } catch {} }));
    await page.waitForTimeout(400);
    const file = path.join(out, j.name + ".png");
    if (j.selector) await page.locator(j.selector).first().screenshot({ path: file });
    else await page.screenshot({ path: file, fullPage: !!j.full });
    console.log("ok", j.name, page.url());
  } catch (e) {
    console.log("FAIL", j.name, e.message.split("\n")[0]);
  }
  await page.close();
}
await browser.close();
