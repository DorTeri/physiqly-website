// Marketing demo: six past Morning message decisions where the coach shortened
// Physiqly's draft before sending — the same ledger rows (and chat messages)
// the real Morning send path writes. Coach Brain's real detector then proposes
// the pattern. Dev DB only.
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { DEMO_TRAINER, demoClientId } from "../../src/lib/demo/ids";

const T = DEMO_TRAINER.id;
const DAY = 86_400_000;
const rows = [
  { key: "aviv", days: 9, action: "REQUEST_CHECKIN", signal: "CHECKIN_MISSED",
    draft: "Hey Aviv, I noticed you haven't had a chance to fill in your weekly check-in for a couple of weeks. I completely understand exams take over everything right now. When you have a minute, could you send me a quick check-in so I can see how you're doing?",
    sent: "Hey Aviv, quick check-in when you get a minute? Good luck with the exams 🙏" },
  { key: "yonatan", days: 13, action: "REVIEW_NUTRITION", signal: "PROTEIN_LOW",
    draft: "Hi Yonatan, I was looking at your food log this week and you're doing a great job logging every day and hitting your calories. Protein has been a bit below target on most days though. Would it help if I sent you a few protein ideas that don't involve shakes?",
    sent: "Yonatan, calories are spot on 👌 Protein's a bit low — want a few ideas without shakes?" },
  { key: "shira", days: 17, action: "REVIEW_DIGESTION", signal: "DIGESTION_ISSUE",
    draft: "Hi Shira, I saw in your daily check-ins that digestion has been difficult on most days this week, especially in the afternoon. Before we change any amounts, I'd like to look at what you're eating at lunch. Could you tell me how you've been feeling after each meal?",
    sent: "Shira, saw the bloating in your check-ins. How do you feel after lunch specifically?" },
  { key: "dana", days: 22, action: "CHECK_IN", signal: "STALE_WEIGH_IN",
    draft: "Hi Dana, just checking in! I noticed it's been a little while since your last weigh-in. No pressure at all, but a quick weigh-in this week would help me see how things are trending as we get closer to the wedding. How are you feeling overall?",
    sent: "Hi Dana! Quick weigh-in this week? Want to see the trend before the wedding 💃" },
  { key: "itai", days: 29, action: "ASK_ABOUT_TRAINING", signal: "NO_WORKOUTS",
    draft: "Hey Itai, I noticed you haven't logged a workout in the last few days, which isn't like you. Is everything okay? If your schedule changed or the gym has been busy, let me know and we can adjust the plan so it fits your week better.",
    sent: "Itai, all good? Haven't seen a workout in a few days — need me to adjust the plan?" },
  { key: "noa", days: 36, action: "ASK_ABOUT_LOGGING", signal: "NO_MEAL_LOGS",
    draft: "Hi Noa, I noticed your food log has been quiet for the last couple of days. That's totally okay, life happens! Logging even one or two meals helps me understand how the week is going. Is anything making it harder to log right now?",
    sent: "Noa, food log's been quiet — everything okay? Even one meal a day helps 🙂" },
];

async function main() {
  const host = new URL(process.env.DATABASE_URL!).hostname;
  if (!host.startsWith("ep-wandering-pond")) throw new Error("not the dev DB");
  await prisma.coachAction.deleteMany({ where: { trainerId: T, payload: { path: ["marketingSeed"], equals: true } } });
  const now = Date.now();
  for (const r of rows) {
    const clientId = demoClientId(r.key as never);
    const at = new Date(now - r.days * DAY + 8.5 * 3600_000 - (now % DAY));
    const thread = await prisma.chatThread.findFirst({ where: { clientId } });
    if (thread) await prisma.chatMessage.create({ data: { threadId: thread.id, senderId: T, body: r.sent, createdAt: at } as never });
    await prisma.coachAction.create({
      data: {
        trainerId: T, clientId, tool: "SEND_MESSAGE", risk: "LOW", status: "APPLIED", source: "MORNING", outcome: "MODIFIED",
        payload: { marketingSeed: true, decision: { kind: "MESSAGE", action: r.action, primarySignal: r.signal }, message: { originalText: r.draft, text: r.sent } },
        expiresAt: at, appliedAt: at, createdAt: at,
      },
    });
  }
  console.log("seeded", rows.length);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
