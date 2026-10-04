/**
 * Puts the sales demo coach on the default PHYSIQLY look (for marketing
 * screenshots of the public website), keeping every client, plan and log.
 *
 *   npx tsx scripts/demoPhysiqlyLook.ts --confirm-host=<host>
 *
 * Only the demo coach's PUBLISHED brand columns change (no app name, no
 * colours, no logo, no background, Classic style, dark base) and any Studio
 * draft is dropped; story settings are left alone. White-label itself is
 * untouched. "Reset demo completely" (admin console, or scripts/seedDemo.ts)
 * restores the canonical AVITAL brand; a refresh keeps whatever look is set,
 * so this survives refreshes.
 */
import "dotenv/config";
import { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import { DEMO_TRAINER } from "../src/lib/demo/ids";
import { guardDatabase } from "./demoCli";

async function main() {
  guardDatabase(process.argv.slice(2));
  const { count } = await prisma.trainerBranding.updateMany({
    where: { trainerId: DEMO_TRAINER.id },
    data: {
      appName: null,
      primaryHex: null,
      secondaryHex: null,
      tertiaryHex: null,
      themeBase: "DARK",
      stylePreset: "CLASSIC",
      surfaceStyle: null,
      heroStyle: null,
      calorieStyle: null,
      logoR2Key: null,
      backgroundR2Key: null,
      backgroundTreatment: "NONE",
      backgroundIntensity: 0,
      backgroundBlurPx: 0,
      backgroundWorstHex: null,
      backgroundWorstHexLight: null,
      draft: Prisma.DbNull,
      draftUpdatedAt: null,
    },
  });
  console.log(count ? "Demo coach now renders the default Physiqly look." : "No demo brand row — the demo already renders as Physiqly.");
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
