import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { DEMO_TRAINER } from "../../src/lib/demo/ids";
const HE = /[֐-׿]/;
const D: Record<string,string> = {
 "שבוע מעולה, הרגשתי חזקה באימונים": "Great week, felt strong in training", "מרגיש חזק מתמיד": "Feeling stronger than ever", "לחץ בעבודה": "Stress at work",
 "הרעב בערבים קשה לי": "Evening hunger is hard for me", "נפיחות כמעט כל יום אחרי הצהריים": "Bloating almost every day after lunch", "הברך מציקה": "The knee is bothering me",
 "מרגיש טוב, רק המשקל לא זז": "Feeling good, the weight just isn't moving", "החתונה של אחותי בעוד שלושה שבועות": "My sister's wedding is in three weeks",
 "תקופת מבחנים": "Exam season", "קשה לי להגיע לחלבון": "Hard for me to hit my protein", "עייפה יותר מהרגיל": "More tired than usual",
};
import { PERSONAS } from "../../src/lib/demo/personas";
for (const p of PERSONAS) D[p.name] = p.nameEn;
const miss = new Set<string>();
const tr = (v: unknown): unknown => typeof v === "string" ? (HE.test(v) ? (D[v.trim()] ?? (miss.add(v), v)) : v) : Array.isArray(v) ? v.map(tr) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k,x])=>[k,tr(x)])) : v;
async function main(){
  const ids = (await prisma.user.findMany({ where:{ trainerId: DEMO_TRAINER.id }, select:{id:true}})).map(u=>u.id);
  for (const r of await prisma.weeklyClientReport.findMany({ where:{ clientId:{ in: ids } } })) if (HE.test(JSON.stringify(r.statsJson))) await prisma.weeklyClientReport.update({ where:{id:r.id}, data:{ statsJson: tr(r.statsJson) as object } });
  for (const r of await prisma.weeklyClientSummary.findMany({ where:{ clientId:{ in: ids } } })) if (HE.test(JSON.stringify(r.statsJson))) await prisma.weeklyClientSummary.update({ where:{id:r.id}, data:{ statsJson: tr(r.statsJson) as object } });
  for (const a of await prisma.aiProposedAction.findMany({ where:{ clientId:{ in: ids } } })) if (HE.test(JSON.stringify(a.payload))) console.log("proposal still HE", a.id, JSON.stringify(a.payload).match(/[^"]*[֐-׿][^"]*/g));
  console.log("missing", [...miss]);
}
main().finally(()=>prisma.$disconnect());
