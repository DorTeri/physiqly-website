// Crops the real captures and composes marketing presentations around them.
// The app pixels are never redrawn: each screenshot is placed as an <img>
// inside a CSS browser/phone frame over a Physiqly-dark background.
import sharp from "sharp";
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const RAW = path.resolve("raw");
const OUT = "C:/Users/dor/Desktop/physiqly-website/review/product-shots-2026-10";
const SCREENS = path.join(OUT, "screens");
const COMPS = path.join(OUT, "compositions");
mkdirSync(SCREENS, { recursive: true });
mkdirSync(COMPS, { recursive: true });

// ── 1. Crops (desktop captures are 2x, mobile 3x) ───────────────────────────
const crops = {
  "trainer-home": ["t-home", { top: 0, height: 1540 }],
  "trainer-home-full": ["t-home-full", { top: 0, height: 4024 }],
  "morning-prepared-change": ["t-morning-tal", { top: 0, height: 1560 }],
  "morning-message-draft": ["t-morning-michal", { top: 0, height: 1560 }],
  "morning-program-review": ["t-morning-gal", { top: 0, height: 1560 }],
  "coach-brain-noticed-rule": ["t-rules-review", null],
  "coach-brain-rules": ["t-rules", { top: 0, height: 1200 }],
  "coach-brain-rule-sheet": ["t-rule-sheet", null],
  "coach-approach": ["t-approach", { top: 0, height: 1600 }],
  "ai-coach-control-center": ["t-aicoach", { top: 0, height: 1800 }],
  "clients-roster": ["t-clients", null],
  "client-training-program-review": ["t-gal-training", { top: 0, height: 2000 }],
  "client-nutrition-plan": ["t-noa-nutrition", { top: 0, height: 1800 }],
  "client-progress": ["t-noa-progress", { top: 0, height: 1800 }],
  "client-overview-prepared-change": ["t-tal-overview", { top: 0, height: 4142 }],
  "mobile-trainer-home": ["m-t-home", null],
  "mobile-morning-prepared-change": ["m-t-morning-tal", null],
  "mobile-client-home": ["m-c-home", null],
  "mobile-client-training": ["m-c-training", null],
  "mobile-client-nutrition": ["m-c-nutrition", null],
  "mobile-client-weight": ["m-c-weight", null],
};
const S = {};
for (const [name, [src, box]] of Object.entries(crops)) {
  const file = path.join(RAW, src + ".png");
  const meta = await sharp(file).metadata();
  let img = sharp(file);
  if (box) img = img.extract({ left: 0, top: box.top, width: meta.width, height: Math.min(box.height, meta.height - box.top) });
  const png = path.join(SCREENS, name + ".png");
  await img.png({ compressionLevel: 9 }).toFile(png);
  await sharp(png).webp({ quality: 90 }).toFile(path.join(SCREENS, name + ".webp"));
  S[name] = pathToFileURL(png).href;
}

// ── 2. Compositions ──────────────────────────────────────────────────────────
const CSS = `
*{box-sizing:border-box;margin:0}
body{background:#08080a;font-family:Inter,Segoe UI,system-ui,sans-serif}
.stage{position:relative;overflow:hidden;background:
  radial-gradient(60% 55% at 50% 58%,rgba(255,107,53,.20),rgba(255,107,53,0) 70%),
  radial-gradient(40% 35% at 85% 10%,rgba(255,179,143,.07),rgba(0,0,0,0) 70%),
  linear-gradient(180deg,#0d0d11,#08080a)}
.stage::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 50% 120%,rgba(0,0,0,0),rgba(0,0,0,.35))}
.floor{position:absolute;left:10%;right:10%;height:2px;border-radius:2px;
  background:linear-gradient(90deg,transparent,rgba(255,107,53,.75),transparent);filter:blur(1px)}
.floorglow{position:absolute;left:15%;right:15%;height:120px;border-radius:50%;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,107,53,.35),transparent 70%);filter:blur(30px)}
.abs{position:absolute}
.browser{border-radius:14px;overflow:hidden;background:#141418;
  border:1px solid rgba(255,255,255,.09);
  box-shadow:0 40px 90px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.6),0 0 80px rgba(255,107,53,.10)}
.bar{height:38px;display:flex;align-items:center;gap:8px;padding:0 14px;background:#17171c;border-bottom:1px solid rgba(255,255,255,.06)}
.dot{width:11px;height:11px;border-radius:50%;background:#3a3a42}
.url{margin-left:18px;flex:0 0 auto;width:36%;height:22px;border-radius:7px;background:#0f0f13;color:#8a8a96;
  font-size:11.5px;display:flex;align-items:center;justify-content:center;letter-spacing:.2px}
.browser img,.phone img{display:block;width:100%}
.phone{border-radius:48px;padding:11px;background:linear-gradient(145deg,#2a2a31,#121216 45%,#1d1d22);
  box-shadow:0 40px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08),inset 0 0 0 1px rgba(255,255,255,.05),0 0 70px rgba(255,107,53,.12)}
.screen{position:relative;border-radius:38px;overflow:hidden;background:#000}
.status{height:34px;background:#0b0b0e;display:flex;align-items:center;justify-content:space-between;padding:4px 26px 0;color:#f2f2f5;font:600 13px/1 Inter,Segoe UI,system-ui,sans-serif}
.status i{font-style:normal;letter-spacing:1px;font-size:11px;opacity:.9}
.island{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:31%;height:24px;border-radius:14px;background:#000;z-index:2}
.tilt-l{transform:perspective(2400px) rotateY(9deg) rotateX(2deg)}
.tilt-r{transform:perspective(2400px) rotateY(-9deg) rotateX(2deg)}
.dim{filter:brightness(.72) saturate(.9)}
`;
const browser = (src, { x, y, w, url = "physiqly.fit", cls = "", z = 1 }) =>
  `<div class="abs browser ${cls}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z}">
     <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">${url}</span></div>
     <img src="${src}"></div>`;
const phone = (src, { x, y, w, cls = "", z = 2 }) =>
  `<div class="abs phone ${cls}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z}">
     <div class="screen"><div class="island"></div><div class="status"><span>9:41</span><i>▂▄▆ ◔</i></div><img src="${src}"></div></div>`;
const card = (src, { x, y, w, z = 3 }) =>
  `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};border-radius:20px;overflow:hidden;box-shadow:0 50px 100px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.08),0 0 90px rgba(255,107,53,.22)"><img style="display:block;width:100%" src="${src}"></div>`;
const floor = (y) => `<div class="floorglow" style="top:${y - 60}px"></div><div class="floor" style="top:${y}px"></div>`;

const comps = [
  { name: "01-hero-trainer-home", w: 1600, h: 1000, body:
    floor(930) +
    browser(S["trainer-home"], { x: 60, y: 130, w: 1220, url: "physiqly.fit/dashboard/trainer" }) +
    phone(S["mobile-trainer-home"], { x: 1235, y: 210, w: 310 }) },
  { name: "02-handle-my-morning", w: 1600, h: 1000, body:
    floor(930) +
    browser(S["morning-prepared-change"], { x: 70, y: 110, w: 1240, url: "physiqly.fit/dashboard/trainer/morning" }) +
    phone(S["mobile-morning-prepared-change"], { x: 1230, y: 200, w: 310 }) },
  { name: "03-coach-brain", w: 1600, h: 1000, body:
    floor(930) +
    browser(S["coach-approach"], { x: 60, y: 90, w: 1100, url: "physiqly.fit/dashboard/trainer/ai-coach/setup" }) +
    card(S["coach-brain-rule-sheet"], { x: 1060, y: 170, w: 470 }) },
  { name: "04-training-and-nutrition", w: 1600, h: 1000, body:
    floor(930) +
    browser(S["client-nutrition-plan"], { x: 560, y: 60, w: 980, cls: "dim", url: "physiqly.fit/dashboard/trainer/clients" }) +
    browser(S["client-training-program-review"], { x: 60, y: 200, w: 1000, z: 2, url: "physiqly.fit/dashboard/trainer/clients" }) },
  { name: "05-client-experience", w: 1600, h: 1000, body:
    floor(940) +
    phone(S["mobile-client-training"], { x: 250, y: 150, w: 330, cls: "tilt-l", z: 1 }) +
    phone(S["mobile-client-home"], { x: 625, y: 70, w: 350, z: 3 }) +
    phone(S["mobile-client-nutrition"], { x: 1020, y: 150, w: 330, cls: "tilt-r", z: 1 }) },
  { name: "06-mobile-trainer-home", w: 1200, h: 1000, body:
    floor(940) +
    phone(S["mobile-morning-prepared-change"], { x: 640, y: 150, w: 320, cls: "tilt-r dim", z: 1 }) +
    phone(S["mobile-trainer-home"], { x: 270, y: 70, w: 360, z: 2 }) },
  { name: "07-clients-roster", w: 1600, h: 1000, body:
    floor(930) + browser(S["clients-roster"], { x: 150, y: 50, w: 1300, url: "physiqly.fit/dashboard/trainer/clients" }) },
  { name: "08-client-progress", w: 1600, h: 1000, body:
    floor(930) +
    browser(S["client-progress"], { x: 70, y: 80, w: 1200, url: "physiqly.fit/dashboard/trainer/clients" }) +
    phone(S["mobile-client-weight"], { x: 1210, y: 250, w: 320 }) },
];

const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--allow-file-access-from-files"] });
for (const c of comps) {
  const ctx = await b.newContext({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const html = `<!doctype html><html><head><style>${CSS}</style></head><body><div class="stage" style="width:${c.w}px;height:${c.h}px">${c.body}</div></body></html>`;
  const file = path.join(path.resolve("compose-html"), c.name + ".html");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.waitForTimeout(500);
  const png = path.join(COMPS, c.name + ".png");
  await page.locator(".stage").screenshot({ path: png });
  await sharp(png).webp({ quality: 88 }).toFile(path.join(COMPS, c.name + ".webp"));
  console.log("composed", c.name);
  await ctx.close();
}
await b.close();
