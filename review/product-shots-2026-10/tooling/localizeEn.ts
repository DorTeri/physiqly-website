// Marketing-only: turns the dev-DB sales demo's Hebrew DATA into English so the
// English UI reads consistently. Re-run after any demo refresh/reset.
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { DEMO_TRAINER, demoClientId } from "../../src/lib/demo/ids";
import { PERSONAS } from "../../src/lib/demo/personas";
import { pickMainAchievement, type WeeklyClientStats } from "../../src/lib/weeklyAggregation";

const HE = /[֐-׿]/;
const T = DEMO_TRAINER.id;

const DICT: Record<string, string> = {
  // workouts
  "רגליים וישבן": "Legs & Glutes",
  "פלג גוף עליון": "Upper Body",
  "גוף מלא": "Full Body",
  "עליון — כוח": "Upper — Strength",
  "תחתון — כוח": "Lower — Strength",
  "עליון — נפח": "Upper — Volume",
  "תחתון — נפח": "Lower — Volume",
  "גוף מלא A": "Full Body A",
  "גוף מלא B": "Full Body B",
  "גוף מלא C": "Full Body C",
  // memories
  "לא אוהבת דגים": "Doesn't like fish",
  "מעדיפה הודעות קצרות ועניינייות": "Prefers short, to-the-point messages",
  "רגישות ללקטוז": "Lactose sensitive",
  "ניתוח מניסקוס בברך שמאל (2023) – להימנע מכיפוף עמוק תחת עומס": "Left knee meniscus surgery (2023) — avoid deep knee flexion under load",
  "החתונה של אחותה בעוד שלושה שבועות": "Sister's wedding in three weeks",
  "מתאמן מוקדם בבוקר לפני העבודה": "Trains early in the morning before work",
  "לא אוהב שייקי חלבון": "Doesn't like protein shakes",
  "עובדת במשמרות לילה פעמיים בשבוע": "Works night shifts twice a week",
  "לא אוכלת בשר אדום": "Doesn't eat red meat",
  "מתאמנת בחדר הכושר בבניין – ציוד בסיסי": "Trains in her building's gym — basic equipment",
  // notes
  "סקירה חודשית: ירידה של 6 ק״ג מתחילת התהליך. ממשיכים באותו תפריט, מעלים עומס בהיפ תראסט. גב תחתון רגיש בסקוואט כבד.":
    "Monthly review: down 6 kg since the start. Same meal plan, more load on hip thrusts. Lower back is sensitive on heavy squats.",
  "עומס גדול בעבודה בתקופה הזו. מעדיפה הודעות קצרות.": "Very busy at work right now. Prefers short messages.",
  "ניתוח מניסקוס בברך שמאל ב-2023. להימנע מכיפוף עמוק תחת עומס.": "Left knee meniscus surgery in 2023. Avoid deep knee flexion under load.",
  "סטגנציה במשקל 3 שבועות. עמידה גבוהה ביעדים. אם לא זז עד סוף החודש – מורידים 150 קל׳ מפחמימות.":
    "Weight flat for 3 weeks with high adherence. If it hasn't moved by the end of the month — take 150 kcal from carbs.",
  "חתונה של אחות בעוד 3 שבועות. רוצה להרגיש טוב בשמלה – לא לעשות שינויים דרסטיים.": "Sister's wedding in 3 weeks. Wants to feel good in the dress — no drastic changes.",
  "פגישת היכרות: מתחילה מאפס, 3 אימונים בשבוע. עובדת במשמרות לילה פעמיים בשבוע. לבדוק איך עבר השבוע הראשון.":
    "Intro call: starting from zero, 3 workouts a week. Works night shifts twice a week. Check how the first week went.",
  // nudges
  "איתי!! ראיתי את השיא בלחיצת חזה 🔥 עבודה מטורפת – ככה בונים כוח. ממשיכים בדיוק ככה.": "Itai!! Saw the bench press PR 🔥 Crazy work — that's how strength is built. Keep doing exactly this.",
  "שיא אישי חדש השבוע": "New personal record this week",
  "היי מיכל 🙂 ראיתי שהשבוע היה עמוס. רוצה שנעשה שבוע קליל עם שני אימונים קצרים? רק תגידי.": "Hey Michal 🙂 I saw this week was a busy one. Want to do a lighter week with two short workouts? Just say the word.",
  "לא התאמנה 9 ימים ולא ענתה להודעה האחרונה": "Hasn't trained in 9 days and didn't answer the last message",
  // follow-ups
  "לקבוע שיחה – נעלמה בשבוע האחרון": "Book a call — went quiet this past week",
  "לבדוק את המשקל אחרי עדכון היעדים": "Check weight after the target update",
  "שיחה קצרה – איך עבר השבוע הראשון": "Short call — how did the first week go",
  // meeting summaries + notes
  "יציבות מעולה במשקל. מוסיפים יום הליכה ארוכה וממשיכים באותו תפריט.": "Great weight stability. Adding a long-walk day and keeping the same meal plan.",
  "מעלים עומס בהדרגה בסקוואט. שומרים על טכניקה ועל 2 חזרות ברזרבה.": "Gradually adding load on squats. Keeping technique tight with 2 reps in reserve.",
  "עוברים לחלוקה של עליון/תחתון. מוסיפים סט עליון כבד בלחיצת חזה ובסקוואט.": "Moving to an upper/lower split. Adding a heavy top set on bench and squat.",
  "המשקל יציב כבר שלושה שבועות למרות עמידה מצוינת. ממשיכים שבוע נוסף ואז מעדכנים יעדים.": "Weight flat for three weeks despite great adherence. One more week, then we update targets.",
  "תכנון לקראת החתונה: ממשיכים בתפריט, מוסיפים צעדים יומיים, ושבוע לפני מורידים מעט נתרן.": "Wedding plan: keep the meal plan, add daily steps, and lower sodium a little the week before.",
  "ירידה של 6 ק״ג מתחילת הדרך 👏 ממשיכים באותו תפריט, ובאימונים מעלים עומס בהיפ תראסט ובדדליפט רומני.": "Down 6 kg since the start 👏 Same meal plan; in training we add load on hip thrusts and Romanian deadlifts.",
  "ברוכה הבאה! סיכמנו: שלושה אימונים בשבוע, תפריט של ארבע ארוחות וצ'ק-אין יומי קצר.": "Welcome! We agreed: three workouts a week, a four-meal plan and a short daily check-in.",
  "מרוצה מאוד. לשים לב לא להעמיס יותר מדי בסקוואט – מרגישה את הגב התחתון.": "Very happy. Don't overload squats — she feels it in her lower back.",
  "מוכן לעלייה בנפח. לשמור על 1-2 חזרות ברזרבה.": "Ready for more volume. Keep 1-2 reps in reserve.",
  "אם לא זז – להוריד 150 קל׳ מפחמימות, לא יותר.": "If it doesn't move — take 150 kcal from carbs, no more.",
  "מתחילה מאפס. משמרות לילה פעמיים בשבוע – לבנות סביב זה.": "Starting from zero. Night shifts twice a week — build around that.",
  // weekly / daily check-in notes
  "שבוע מעולה, הרגשתי חזקה באימונים": "Great week, felt strong in training",
  "מרגיש חזק מתמיד": "Feeling stronger than ever",
  "לחץ בעבודה": "Stress at work",
  "הרעב בערבים קשה לי": "Evening hunger is hard for me",
  "שוב נפיחות אחרי הצהריים": "Bloated again after lunch",
  "נפיחות כמעט כל יום אחרי הצהריים": "Bloating almost every day after lunch",
  "הברך מציקה": "The knee is bothering me",
  "מרגיש טוב, רק המשקל לא זז": "Feeling good, the weight just isn't moving",
  "החתונה של אחותי בעוד שלושה שבועות": "My sister's wedding is in three weeks",
  "תקופת מבחנים": "Exam season",
  "קשה לי להגיע לחלבון": "Hard for me to hit my protein",
  "עייפה מאוד היום": "Very tired today",
  "עייפה יותר מהרגיל": "More tired than usual",
  // request context
  "ברך שמאל": "Left knee",
  "כאב בצד הפנימי של הברך בירידה בסקוואט": "Pain on the inside of the knee on the way down in squats",
  "שוב כאב בברך אחרי האימון, הפעם גם בלחיצת רגליים": "Knee pain again after training, this time on leg press too",
  "יום הולדת במסעדה איטלקית – מה הכי כדאי להזמין?": "Birthday dinner at an Italian restaurant — what's best to order?",
  "בשר אדום": "Red meat",
  // chat
  "היה לי שבוע קשה בעבודה, אבל אני מחזיקה 💪": "Had a rough week at work, but I'm hanging in there 💪",
  "רואה את זה, כל הכבוד! תזכרי – גם 80% זה מעולה.": "I see it, well done! Remember — 80% is great too.",
  "תודה על התפריט החדש, הרבה יותר קל לי ככה": "Thanks for the new meal plan, it's so much easier for me this way",
  "שמחה לשמוע! 💪": "Glad to hear it! 💪",
  "ליאור! החתונה של אחותי בעוד חודש, אני רוצה להגיע במיטבי 💃": "Lior! My sister's wedding is in a month, I want to be at my best 💃",
  "יאללה! נשארות על התוכנית, ושבוע לפני נעשה כמה התאמות קטנות. נקבע פגישה לסיכום.": "Let's go! We stick to the plan and make a few small tweaks the week before. Let's book a session to plan it.",
  "המשקל תקוע כבר כמה שבועות למרות שאני ממש מקפיד 😤": "My weight has been stuck for a few weeks even though I'm really consistent 😤",
  "רואה, ואתה באמת מקפיד – זה רואים ביומן. נדבר על זה בפגישה.": "I see it, and you really are consistent — it shows in your log. We'll talk about it in our session.",
  "I have pain: ברך שמאל": "I have pain: Left knee",
  "שמעתי. כאב בברך זה משהו שליאור צריכה לראות בעצמה – העברתי לה את ההודעה שלך והיא תחזור אליך. עד אז, עדיף לדלג על תרגילים שמכאיבים.":
    "Got it. Knee pain is something Lior needs to look at herself — I've passed your message to her and she'll get back to you. Until then, skip any exercise that hurts.",
  "עומרי, תוריד בינתיים את הסקוואט ותחליף ללחיצת רגליים בטווח חלקי. אם זה לא עובר תוך שבוע – לפיזיו.": "Omri, drop squats for now and swap in partial-range leg press. If it doesn't settle within a week — physio.",
  "התחלתי להרגיש יותר רעב בערבים, זה נורמלי?": "I've started feeling hungrier in the evenings, is that normal?",
  "נורמלי לגמרי בשלב הזה. נסה להעביר את הקוטג' לערב במקום אחר הצהריים ונראה.": "Totally normal at this stage. Try moving the cottage cheese to the evening instead of the afternoon and let's see.",
  "סורי שלא מילאתי צ'ק-אין, יש לי מבחנים": "Sorry I didn't fill in my check-in, I have exams",
  "בהצלחה במבחנים! נסה לפחות לרשום ארוחות, זה עוזר לי להבין איפה אתה.": "Good luck with the exams! Try to at least log meals, it helps me see where you are.",
  "השבוע מטורף, אנסה להשלים אימונים בסופ״ש": "This week is crazy, I'll try to catch up on workouts over the weekend",
  "בהצלחה! אם צריך, נעשה שבוע קל יותר – רק תגידי": "Good luck! If you need it, we'll do a lighter week — just say",
  "ליאור, אפשר להחליף את הפרפר בכבלים במשהו אחר? המכונה תמיד תפוסה בערב": "Lior, can I swap the cable fly for something else? The machine is always taken in the evening",
  "בטח. תעשה במקום לחיצה בשיפוע עם משקולות יד, 3x12. עדכנתי לך בתוכנית 👍": "Sure. Do incline dumbbell press instead, 3x12. Updated it in your plan 👍",
  "אני מרגישה נפוחה כמעט כל יום אחרי הצהריים 😕": "I feel bloated almost every day after lunch 😕",
  "תודה שסיפרת. בואי נעקוב כמה ימים בצ'ק-אין היומי ונראה אם יש קשר לקינואה או לטחינה.": "Thanks for telling me. Let's track it in the daily check-in for a few days and see if it's the quinoa or the tahini.",
  "קשה לי להגיע לחלבון, אני לא אוהב שייקים": "Hard for me to hit my protein, I don't like shakes",
  "הבנתי. נחפש מקורות אחרים – יוגורט, טונה, חזה הודו. אשלח לך רשימה.": "Got it. We'll find other sources — yogurt, tuna, turkey breast. I'll send you a list.",
  "שלושה שבועות ברצף ביעדים 🙌": "Three weeks in a row on target 🙌",
  "בוקר טוב ליאור! עליתי על המשקל ויש 68 ומשהו 🎉 לא ראיתי את המספר הזה שנים": "Morning Lior! Stepped on the scale and it says 68-something 🎉 Haven't seen that number in years",
  "את מכונה ליה! נעבור על הכל בסקירה החודשית 🙂": "You're a machine, Lia! We'll go over everything in the monthly review 🙂",
  "וואו נועה!! זה פשוט מדהים. שישה קילו בלי להרגיש בדיאטה – זה בדיוק מה שבנינו. גאה בך 💪":
    "Wow Noa!! That's amazing. Six kilos without feeling like you're dieting — that's exactly what we built. Proud of you 💪",
  "עוד שבוע וזה נגמר, אז אני חוזר לגמרי 💪": "One more week and it's over, then I'm fully back 💪",
  "ירדתי עוד קילו וחצי השבוע!! 😍": "Lost another kilo and a half this week!! 😍",
  "מרגיש טוב, אנרגיה טובה, רק המשקל לא זז": "Feeling good, good energy, the weight just isn't moving",
  "וואו, מהר! אנחנו לא ממהרות לשום מקום – אני רוצה לוודא שאת אוכלת מספיק. איך האנרגיה?": "Wow, that's fast! We're not in a hurry — I want to make sure you're eating enough. How's your energy?",
  "מעולה שאתה מרגיש טוב. אני בוחנת עדכון קטן ליעדים השבוע.": "Great that you feel good. I'm looking at a small target update this week.",
  "היי מיכל, לא שמעתי ממך כמה ימים – הכל בסדר? 🙂": "Hey Michal, haven't heard from you in a few days — everything okay? 🙂",
  "איך הולך? אשמח לצ'ק-אין קצר כשתוכל 🙏": "How's it going? A short check-in when you can would be great 🙏",
  "רותם, ברוכה הבאה! 🎉 שמחה שהצטרפת. העליתי לך תוכנית אימונים ותפריט – תתחילי בקצב שלך.": "Rotem, welcome! 🎉 So glad you joined. Your training plan and meal plan are up — start at your own pace.",
  "תודה רבה!! מתרגשת להתחיל": "Thank you so much!! Excited to start",
  "שאלה – מחר יש לי ארוחת ערב משפחתית, משהו שכדאי לשים לב אליו?": "Question — I have a family dinner tomorrow, anything I should watch out for?",
  "ערב משפחתי זה חלק מהחיים 🙂 תתחילי מחלבון וירקות, תיהני מהמנה שאת הכי אוהבת בכמות רגילה, ואל תנסי 'לפצות' למחרת – פשוט חוזרים לתפריט בארוחה הבאה.":
    "Family dinners are part of life 🙂 Start with protein and veggies, enjoy your favourite dish in a normal portion, and don't try to 'make up for it' the next day — just go back to the plan at the next meal.",
  "היה מעולה, תודה! 🙏": "It was great, thanks! 🙏",
  "שיא חדש בלחיצת חזה!!! 🔥🔥": "New bench press PR!!! 🔥🔥",
  "קצת עייפה האמת, אבל שווה את זה": "A bit tired honestly, but worth it",
  "האמת שאני ממש מת מרעב בערבים, וקשה לי להירדם ככה": "Honestly I'm starving in the evenings, and it's hard to fall asleep like that",
  "תודה ששיתפת, רון – זה מידע חשוב. ליאור תעבור על התפריט שלך השבוע. בינתיים, כוס תה עם שתי פריכיות לפני השינה זה בסדר גמור.":
    "Thanks for sharing, Ron — that's important. Lior will go over your meal plan this week. Meanwhile, a cup of tea with two rice cakes before bed is completely fine.",
  "עדיין נפוחה, בעיקר אחרי ארוחת הצהריים": "Still bloated, mostly after lunch",
  "תודה שעדכנת, עומרי. כאב שחוזר צריך את העין של ליאור – העברתי לה את זה עכשיו. עד שתדברו, אל תאמן את הרגליים.":
    "Thanks for the update, Omri. Pain that keeps coming back needs Lior's eye — I've passed it to her now. Until you talk, don't train legs.",
  "עשיתי את האימון הראשון, היה קשה אבל כיף 😅": "Did my first workout, it was hard but fun 😅",
  "כל הכבוד! תמיד הראשון הכי קשה. מחר נדבר חמש דקות לראות איך הולך.": "Well done! The first one is always the hardest. Let's talk for five minutes tomorrow to see how it's going.",
  "מחכה לפגישה מחר!": "Looking forward to tomorrow's session!",
  "גם אני 🙂 נתראה בבוקר": "Me too 🙂 See you in the morning",
  "ואם כבר – כוס יין אחת זה בסדר? 🍷": "And while I'm at it — is one glass of wine okay? 🍷",
  "סיימתי עכשיו רגליים וישבן – שיא חדש בהיפ תראסט!! 🔥": "Just finished Legs & Glutes — new hip thrust PR!! 🔥",
  "איזה כיף לקרוא את זה על הבוקר! 🔥 תשתפי את זה בסטורי, מגיע לך": "What a way to start the morning! 🔥 Share it in a story, you've earned it",
  // AI profile
  "אני מאמינה בהתקדמות עקבית ולא מושלמת: 80% עקביות לאורך חודשים מנצחת 100% לשבועיים. חלבון בכל ארוחה, אימוני כוח שלוש-ארבע פעמים בשבוע, ושינה – לפני שנוגעים בקלוריות. כשמשהו לא עובד, קודם מבינים למה ורק אז משנים, ותמיד בצעדים קטנים.":
    "I believe in consistent, not perfect, progress: 80% consistency over months beats 100% for two weeks. Protein at every meal, strength training three to four times a week, and sleep — before we touch calories. When something isn't working, we first understand why and only then change it, always in small steps.",
  "חמה, ישירה ומעודדת": "Warm, direct and encouraging",
  "במסעדה: מתחילים מחלבון (דג, עוף או בשר רזה), ירקות בלי הגבלה ופחמימה אחת לבחירה. קינוח? חולקים. לא מפצים למחרת – חוזרים לתפריט בארוחה הבאה.":
    "At a restaurant: start with protein (fish, chicken or lean meat), unlimited veggies and one carb of your choice. Dessert? Share it. Don't compensate the next day — go back to the plan at the next meal.",
  "חריגה זה לא אסון. לא צמים ולא מפצים – חוזרים לתפריט בארוחה הבאה ושותים מים. מה שקובע זה השבוע, לא היום.":
    "Going off plan isn't a disaster. No fasting, no compensating — back to the plan at the next meal, and drink water. The week counts, not the day.",
  "רעב חוזר הוא סימן שצריך לבדוק את התפריט, ואני רוצה לדעת על זה. בינתיים: ירקות, מרק, תה, או יוגורט קטן.":
    "Recurring hunger is a sign the plan needs a look, and I want to know about it. Meanwhile: veggies, soup, tea or a small yogurt.",
  "מקורות החלבון שאני אוהבת: יוגורט יווני, קוטג', ביצים, עוף, טונה, הודו וטופו. מחלקים על פני היום – 25-40 גרם בכל ארוחה.":
    "Protein sources I like: Greek yogurt, cottage cheese, eggs, chicken, tuna, turkey and tofu. Spread across the day — 25-40 g per meal.",
  "פספסת אימון? לא משלימים בכוח ולא מכפילים. ממשיכים מהאימון הבא בתוכנית, ואם זה קורה הרבה – מדברים על זה.":
    "Missed a workout? Don't force a make-up or double up. Continue with the next workout in the plan, and if it keeps happening — we talk about it.",
  "מזכירים למה התחלנו, מסתכלים על מה שכבר השתנה, ובוחרים צעד אחד קטן להיום. אם זה נמשך יותר משבוע – אני רוצה לדבר.":
    "Remember why we started, look at what has already changed, and pick one small step for today. If it lasts more than a week — I want to talk.",
  "אלכוהול במידה: עד שתי כוסות, עדיף יין יבש או בירה קלה, לא על בטן ריקה, ובאותו ערב מוותרים על הפחמימה בארוחה.":
    "Alcohol in moderation: up to two drinks, preferably dry wine or light beer, not on an empty stomach, and skip the carb at that evening's meal.",
};

const MEETING_TITLE: Record<string, string> = {
  "סקירת התקדמות": "Progress review",
  "אימון אישי": "Personal training",
  "סקירת אימונים": "Training review",
  "ייעוץ תזונה": "Nutrition consult",
  "שיחת מעקב": "Follow-up call",
  "פגישת היכרות": "Intro call",
};

const nameEn = new Map<string, string>(PERSONAS.map((p) => [p.name, p.nameEn]));
nameEn.set("ליאור אביטל", "Lior Avital");
const firstEn = new Map<string, string>(PERSONAS.map((p) => [p.name.split(" ")[0], p.nameEn.split(" ")[0]]));

const missing = new Set<string>();
function tr(s: string | null | undefined): string | null | undefined {
  if (!s || !HE.test(s)) return s;
  const t = DICT[s.trim()];
  if (t) return t;
  missing.add(s);
  return s;
}
function trJson(v: unknown): unknown {
  if (typeof v === "string") return tr(v);
  if (Array.isArray(v)) return v.map(trJson);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, trJson(x)]));
  return v;
}

const kg = (n: number) => n.toFixed(1);
function reportEn(key: string, s: WeeklyClientStats): { narrative: string; suggestedReply: string; digest: string; rationale?: string } {
  const w = s.workoutsPlanned > 0 ? `${s.workoutsCompleted} of ${s.workoutsPlanned} workouts` : "";
  const d = s.weightTrend.deltaKg;
  const wt = d == null ? "" : Math.abs(d) < 0.15 ? "weight stable" : d < 0 ? `down ${kg(Math.abs(d))} kg` : `up ${kg(d)} kg`;
  const P: Record<string, ReturnType<typeof reportEn>> = {
    noa: { narrative: `Another strong week for Noa: ${w}, ${wt} and high meal-plan adherence. She feels strong in training and her energy is good — steady progress with no signs of burnout.`, suggestedReply: "Noa, what a week! 👏 Your consistency is doing the work. Keep going exactly like this — next week we add a little more load on hip thrusts.", digest: "Losing at a healthy pace, high adherence to plan and training." },
    itai: { narrative: `Itai completed ${w} and set a bench press PR. ${wt} — right on the planned gain pace, with good appetite and sleep.`, suggestedReply: "Itai, new bench PR! 🔥 That's exactly what the extra volume is for. Next week we try 2.5 kg more on the top set.", digest: "Bench press PR and a controlled weight gain." },
    michal: { narrative: `A hard week for Michal: ${w || "almost no workouts"}, meal logging dropped sharply and she didn't answer the last message. Last week she reported high stress at work — likely the load, not a lack of motivation.`, suggestedReply: "Hey Michal 🙂 I can see things are busy. Let's do a light week — two short workouts and a simple plan. Up for a 10-minute call?", digest: "Stopped training and logging, not answering — reach out this week." },
    ron: { narrative: `Ron is sticking to the plan and training (${w}), ${wt}, but evening hunger keeps rising and he rated it 5/5 in his check-in. Good adherence with rising hunger usually means the deficit is too aggressive.`, suggestedReply: "Ron, thanks for telling me about the hunger — that's exactly what I need to know. I'm updating your plan with a bit more carbs in the evening.", rationale: "Hunger rose through the week despite good adherence — a small carb increase will help him hold the deficit.", digest: "Good adherence but rising hunger — a calorie increase is ready for your approval." },
    shira: { narrative: "Shira is following the plan but reports bloating almost every day after lunch. Before changing amounts, look at the food choices in that meal (quinoa and tahini).", suggestedReply: "Shira, let's try a week with rice instead of quinoa at lunch and no tahini, and see if the bloating changes.", digest: "Recurring bloating after lunch — check food choices." },
    omri: { narrative: `Omri completed ${w}, but reported left knee pain again — this time on leg press too. It's the second time in two weeks, with a history of meniscus surgery.`, suggestedReply: "Omri, I saw your message about the knee. Let's pause leg training until we talk, and I recommend booking a physio assessment.", digest: "Recurring knee pain — needs your attention." },
    tal: { narrative: `Tal is hitting his targets really well (${w}), feels good and reports high energy — but his weight hasn't moved for several weeks. When adherence is high and weight is flat, it's time to update targets.`, suggestedReply: "Tal, you're doing all the work — now it's my turn. I'm taking a few carbs out to get the scale moving again, without touching protein.", rationale: "High adherence and weight flat for three weeks — a 150 kcal carb reduction per your rule.", digest: "High adherence, weight stuck — a target update is ready, built with your rule." },
    dana: { narrative: `Dana keeps going consistently: ${w}, ${wt}. Her sister's wedding is in three weeks and you have a session tomorrow — a good chance to plan the final week before the event.`, suggestedReply: "Dana, you're right on track for the wedding 💃 Tomorrow we'll plan event week — no drastic changes.", digest: "On track for the wedding, session tomorrow." },
    aviv: { narrative: "Aviv is in exam season: logging a meal or two on some days and hasn't filled in a check-in for two weeks. Not enough data to judge nutrition — ask for a short check-in before any change.", suggestedReply: "Aviv, good luck with the exams! When you have a minute, a one-minute check-in would really help me see where you are.", digest: "Partial data — ask for a check-in before deciding." },
    gal: { narrative: `Gal completed ${w}, ${wt} — a good week. Yesterday he asked what to order at a birthday dinner at a restaurant, and the question is still waiting for an answer.`, suggestedReply: "Gal, at an Italian place: a protein main (fish or chicken) with veggies, pasta as a shared starter, and enjoy! 🎉", digest: "Good week; waiting on a restaurant answer." },
    yonatan: { narrative: "Yonatan logs every day and hits his calories, but protein is below target on most days. He doesn't like shakes — suggest protein sources from foods he already eats.", suggestedReply: "Yonatan, idea: Greek yogurt instead of granola in the morning and tuna or turkey at lunch — that gets you to target without shakes.", digest: "Hits calories, short on protein most days." },
    hadar: { narrative: `Hadar is losing fast — ${wt} this week — and reports fatigue almost every day. That rate of loss with low energy is a sign the deficit is too big, not a success.`, suggestedReply: "Hadar, your progress is impressive, but I want you to feel good. Let's add a small snack and slow the pace a little.", digest: "Losing too fast with fatigue — slow down." },
    lia: { narrative: `Lia is nailing maintenance: ${w}, stable weight and three weeks in a row on target. The monthly review is today — a good time to celebrate and set a new strength goal.`, suggestedReply: "Lia, three weeks in a row! 🙌 In today's review we'll pick a strength goal for next month.", digest: "Excellent maintenance stability, a long streak on target." },
  };
  return P[key];
}

async function main() {
  const host = new URL(process.env.DATABASE_URL!).hostname;
  if (!host.startsWith("ep-wandering-pond")) throw new Error("not the dev DB: " + host);
  const people = await prisma.user.findMany({ where: { OR: [{ id: T }, { trainerId: T }] }, select: { id: true, name: true } });
  const ids = people.filter((p) => p.id !== T).map((p) => p.id);
  const keyOf = new Map(PERSONAS.map((p) => [demoClientId(p.key), p.key]));

  for (const u of people) {
    const en = nameEn.get(u.name ?? "");
    if (en) {
      await prisma.user.update({ where: { id: u.id }, data: { name: en } });
      await prisma.userProfile.updateMany({ where: { userId: u.id }, data: { displayName: en } });
    }
  }
  for (const w of await prisma.workout.findMany({ where: { trainingPlan: { clientId: { in: ids } } }, select: { id: true, name: true } }))
    if (HE.test(w.name)) await prisma.workout.update({ where: { id: w.id }, data: { name: tr(w.name)! } });
  for (const m of await prisma.clientMemory.findMany({ where: { clientId: { in: ids } } }))
    if (HE.test(m.text)) await prisma.clientMemory.update({ where: { id: m.id }, data: { text: tr(m.text)! } });
  for (const n of await prisma.clientNote.findMany({ where: { clientId: { in: ids } } }))
    if (HE.test(n.text)) await prisma.clientNote.update({ where: { id: n.id }, data: { text: tr(n.text)! } });
  for (const n of await prisma.aiNudge.findMany({ where: { clientId: { in: ids } } }))
    await prisma.aiNudge.update({ where: { id: n.id }, data: { body: tr(n.body)!, rationale: tr(n.rationale) ?? null } });
  for (const f of await prisma.clientFollowUpFlag.findMany({ where: { clientId: { in: ids } } }))
    if (f.note && HE.test(f.note)) await prisma.clientFollowUpFlag.update({ where: { id: f.id }, data: { note: tr(f.note) } });
  const meetingTitle = (t: string) => {
    const [kind, who] = t.split(" · ");
    return MEETING_TITLE[kind?.trim()] ? `${MEETING_TITLE[kind.trim()]}${who ? " · " + (firstEn.get(who.trim()) ?? who) : ""}` : tr(t)!;
  };
  for (const m of await prisma.meeting.findMany({ where: { trainerId: T } }))
    await prisma.meeting.update({ where: { id: m.id }, data: { title: HE.test(m.title) ? meetingTitle(m.title) : m.title, clientSummary: tr(m.clientSummary) ?? null } });
  for (const s of await prisma.meetingSeries.findMany({ where: { trainerId: T } }))
    if (HE.test(s.title)) await prisma.meetingSeries.update({ where: { id: s.id }, data: { title: meetingTitle(s.title) } });
  for (const n of await prisma.meetingNote.findMany({ where: { meeting: { trainerId: T } } }))
    if (HE.test(n.body)) await prisma.meetingNote.update({ where: { id: n.id }, data: { body: tr(n.body)! } });
  for (const m of await prisma.chatMessage.findMany({ where: { thread: { clientId: { in: ids } } } })) {
    const data: Record<string, unknown> = {};
    if (HE.test(m.body)) data.body = tr(m.body);
    if (m.requestContext && HE.test(JSON.stringify(m.requestContext))) data.requestContext = trJson(m.requestContext);
    if (Object.keys(data).length) await prisma.chatMessage.update({ where: { id: m.id }, data });
  }
  for (const c of await prisma.weeklyCheckIn.findMany({ where: { clientId: { in: ids } } }))
    await prisma.weeklyCheckIn.update({ where: { id: c.id }, data: { note: tr(c.note) ?? null, upcomingEvents: tr(c.upcomingEvents) ?? null, difficultSituations: tr(c.difficultSituations) ?? null } });
  for (const c of await prisma.dailyCheckIn.findMany({ where: { clientId: { in: ids }, note: { not: null } } }))
    if (HE.test(c.note!)) await prisma.dailyCheckIn.update({ where: { id: c.id }, data: { note: tr(c.note) } });
  for (const o of await prisma.clientOnboarding.findMany({ where: { clientId: { in: ids } } }))
    if (HE.test(JSON.stringify(o.answers))) await prisma.clientOnboarding.update({ where: { id: o.id }, data: { answers: trJson(o.answers) as object } });

  // Weekly reports: English prose from the same stats, English achievement label.
  for (const r of await prisma.weeklyClientReport.findMany({ where: { trainerId: T } })) {
    const key = keyOf.get(r.clientId);
    const s = r.statsJson as unknown as WeeklyClientStats;
    const p = key ? reportEn(key, s) : undefined;
    const { label } = pickMainAchievement(s, "EN");
    await prisma.weeklyClientReport.update({ where: { id: r.id }, data: { mainAchievementLabel: label, ...(p ? { narrative: p.narrative, suggestedReply: p.suggestedReply } : {}) } });
  }
  for (const r of await prisma.weeklyClientSummary.findMany({ where: { clientId: { in: ids } } }))
    await prisma.weeklyClientSummary.update({ where: { id: r.id }, data: { mainAchievementLabel: pickMainAchievement(r.statsJson as unknown as WeeklyClientStats, "EN").label } });
  for (const a of await prisma.aiProposedAction.findMany({ where: { clientId: { in: ids } } })) {
    const payload = a.payload as Record<string, unknown> | null;
    const key = keyOf.get(a.clientId);
    if (payload && typeof payload.rationale === "string" && HE.test(payload.rationale) && key) {
      const s = { workoutsPlanned: 0, workoutsCompleted: 0, weightTrend: { deltaKg: null } } as unknown as WeeklyClientStats;
      const en = reportEn(key, s);
      await prisma.aiProposedAction.update({ where: { id: a.id }, data: { payload: { ...payload, rationale: en.rationale ?? en.narrative } } });
    }
  }
  for (const d of await prisma.weeklyRosterDigest.findMany({ where: { trainerId: T } })) {
    const ranked = (d.rankedClientsJson as { clientId: string; name: string; reasoning: string }[]).map((c) => {
      const key = keyOf.get(c.clientId);
      const s = { workoutsPlanned: 0, workoutsCompleted: 0, weightTrend: { deltaKg: null } } as unknown as WeeklyClientStats;
      return { ...c, name: nameEn.get(c.name) ?? c.name, reasoning: key ? reportEn(key, s).digest : c.reasoning };
    });
    await prisma.weeklyRosterDigest.update({ where: { id: d.id }, data: { rankedClientsJson: ranked } });
  }
  const profile = await prisma.trainerAiProfile.findUnique({ where: { trainerId: T } });
  if (profile) await prisma.trainerAiProfile.update({ where: { id: profile.id }, data: { philosophy: tr(profile.philosophy) ?? null, toneDescriptor: tr(profile.toneDescriptor) ?? null } });
  for (const s of await prisma.trainerAiScenarioResponse.findMany({ where: { trainerId: T } }))
    if (HE.test(s.answerText)) await prisma.trainerAiScenarioResponse.update({ where: { id: s.id }, data: { answerText: tr(s.answerText)! } });
  // Notifications for the coach: names only (bodies are short).
  for (const n of await prisma.notification.findMany({ where: { userId: T } })) {
    let title = n.title, body = n.body;
    for (const [he, en] of nameEn) { title = title.replaceAll(he, en); body = body.replaceAll(he, en); }
    title = title.replace("מילא צ'ק-אין שבועי", "submitted a weekly check-in").replace("הצטרפה", "joined").replace("פנייה חדשה:", "New lead:").replace("שני לוי", "Shani Levi");
    body = body.replace("רעב:", "Hunger:").replace("ההזמנה התקבלה", "Invite accepted").replace("ירידה במשקל אחרי לידה", "Postpartum weight loss").replace("כאב בברך שמאל — ה-AI העביר אלייך", "Left knee pain — the AI handed it to you");
    await prisma.notification.update({ where: { id: n.id }, data: { title, body } });
  }
  await prisma.user.update({ where: { id: T }, data: { preferredLanguage: "EN" } }).catch(() => {});
  await prisma.user.updateMany({ where: { id: { in: ids } }, data: { preferredLanguage: "EN" } }).catch(() => {});
  console.log("missing translations:", [...missing]);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
