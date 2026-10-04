// Production build/start of the app against the DEV database (.env only), for
// marketing screenshots. Env files are loaded HERE and Next is told they are
// processed, so `next start` can never pick up .env.production.local (prod DB).
//   node marketingServer.mjs build|start
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const repo = "C:/Users/dor/Desktop/TrainMe";
process.chdir(repo);
const require = createRequire(repo + "/package.json");
const { config } = require("dotenv");
for (const path of [".env.local", ".env"]) config({ path, quiet: true });
process.env.__NEXT_PROCESSED_ENV = "true";
process.env.RESEND_API_KEY = "";
process.env.AUTH_TRUST_HOST = "true";
// Demo media is served from public/_demo-media (no public bucket locally).
process.env.R2_PUBLIC_BASE_URL = "/_demo-media";
process.env.R2_PUBLIC_BUCKET_NAME = "";

const host = new URL(process.env.DATABASE_URL).hostname;
if (!host.startsWith("ep-wandering-pond")) throw new Error("Refusing: not the dev database (" + host + ")");
console.log("DB host:", host);

const cmd = process.argv[2] === "build" ? ["next", "build"] : ["next", "start", "-p", "3005"];
const r = spawnSync("npx", cmd, { stdio: "inherit", shell: true, env: process.env });
process.exit(r.status ?? 1);
