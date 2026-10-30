/**
 * Krishi Mitra — farming-only AI assistant, backed by Google Gemini.
 *
 * The API key (GEMINI_API_KEY) stays on the server. Two layers keep it to farming:
 *  1. the system instruction tells Gemini to answer only agriculture questions;
 *  2. Gemini must also return `on_topic`, and anything marked off-topic is replaced here with a
 *     fixed refusal, so a non-farming answer never reaches the farmer.
 */
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MODEL = "gemini-flash-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_QUESTION = 600; // characters
const MAX_TURNS = 10; // earlier messages sent for context
const PER_MINUTE = 15; // questions per visitor per minute

type Lang = "en" | "mr";
type Turn = { role: "user" | "assistant"; text: string };

const SYSTEM = `You are "Krishi Mitra", the farming assistant inside the Shet Samruddhi app, used by small and marginal farmers, women farmers and Self-Help Groups in rural Maharashtra, India.

SCOPE — answer ONLY questions about farming and agriculture, including: crops and varieties, sowing and seeds, soil and soil testing, fertiliser and manure, irrigation and water saving, crop pests and diseases, weeds, weather and its effect on crops, harvesting, storage and post-harvest losses, organic and natural farming, horticulture, livestock, dairy, poultry, goats, fisheries, farm machinery, selling produce and market practices, government agriculture and farmer schemes, crop insurance and farm credit, food processing and value addition of farm produce, and agri-businesses for farmers and SHGs.
Anything else (films, politics, sport, coding, homework, general knowledge, jokes, human medical questions, personal or relationship advice, etc.) is OFF-TOPIC: set "on_topic" to false and leave "answer" empty. Greetings or "what can you do" count as on-topic: reply briefly with what you can help with. If a message mixes farming and off-topic parts, answer only the farming part.

HOW TO ANSWER
- Use very simple, everyday words a farmer with little schooling understands. No jargon; if you must use a term, explain it in a few words.
- Keep it short: at most about 120 words. Use 3–5 numbered steps when giving actions, each step on its own new line. Plain text only, no markdown symbols like * or #.
- Use local units (acre, litre, kg, quintal) and Indian context (Kharif/Rabi, Maharashtra crops and conditions).
- Reply in the language the farmer wrote in. If unclear, use LANGUAGE given below. Marathi replies must be natural, simple Marathi in Devanagari.

SAFETY
- For chemical pesticides, fungicides or weedicides: you may name the common type of product, but always tell the farmer to follow the label and confirm the exact dose with the local Krishi Vigyan Kendra (KVK) or agriculture officer, and to wear protection while spraying.
- For sick or dying animals, tell them to call a veterinary doctor quickly.
- Never promise prices, profits, yields or scheme approval. For schemes, say to confirm on the official website or at the agriculture office.
- Never ask for personal details (Aadhaar, bank, OTP, phone number).
- If you are not sure, say so honestly and suggest the Kisan Call Centre (toll-free 1800-180-1551) or the nearest KVK.`;

const REFUSAL: Record<Lang, string> = {
  en: "I can only help with farming and agriculture — crops, soil, water, pests, animals, schemes and selling produce. Please ask a farming question.",
  mr: "मी फक्त शेती व शेतीसंबंधित प्रश्नांना मदत करू शकतो — पिके, माती, पाणी, कीड-रोग, जनावरे, योजना आणि माल विक्री. कृपया शेतीबद्दल प्रश्न विचारा.",
};

const ERRORS = {
  config: { en: "The assistant is not set up yet.", mr: "सहाय्यक अजून सुरू केलेला नाही." },
  busy: { en: "Too many questions right now. Please wait a minute and try again.", mr: "सध्या खूप प्रश्न येत आहेत. एक मिनिट थांबून पुन्हा विचारा." },
  failed: { en: "Couldn’t get an answer. Please try again.", mr: "उत्तर मिळाले नाही. कृपया पुन्हा प्रयत्न करा." },
  empty: { en: "Please type or speak your question.", mr: "कृपया तुमचा प्रश्न लिहा किंवा बोला." },
};

// simple per-visitor limit so the shared free key isn't used up by one person
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > PER_MINUTE;
}

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { messages?: Turn[]; lang?: string };
  const lang: Lang = body.lang === "mr" ? "mr" : "en";

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json({ error: ERRORS.config[lang] }, 503);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return json({ error: ERRORS.busy[lang] }, 429);

  const turns = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, text: m.text.trim().slice(0, MAX_QUESTION) }));
  if (!turns.length || turns[turns.length - 1].role !== "user") return json({ error: ERRORS.empty[lang] }, 400);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `${SYSTEM}\n\nLANGUAGE: ${lang === "mr" ? "Marathi" : "English"}` }] },
      contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.text }] })),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: { on_topic: { type: "BOOLEAN" }, answer: { type: "STRING" } },
          required: ["on_topic", "answer"],
        },
      },
    }),
  }).catch(() => null);

  if (!res) return json({ error: ERRORS.failed[lang] }, 502);
  if (res.status === 429) return json({ error: ERRORS.busy[lang] }, 429);
  if (!res.ok) {
    console.error("Gemini error", res.status, (await res.text()).slice(0, 300));
    return json({ error: ERRORS.failed[lang] }, 502);
  }

  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const raw = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  let parsed: { on_topic?: boolean; answer?: string } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    // blocked or malformed reply — treat as no answer
  }

  if (parsed.on_topic === false) return json({ answer: REFUSAL[lang], onTopic: false });
  // put each numbered step on its own line (1. 2. … or Marathi १. २. …) and drop stray markdown
  const answer = (parsed.answer ?? "")
    .replace(/[*#]+/g, "")
    .replace(/\s+(?=(?:\d{1,2}|[०-९]{1,2})[.)]\s)/g, "\n")
    .trim();
  if (!answer) return json({ error: ERRORS.failed[lang] }, 502);
  return json({ answer, onTopic: true });
}
