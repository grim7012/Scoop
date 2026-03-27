
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextRequest, NextResponse } from "next/server";
// import { buildFlavorContextSafe } from "@/lib/flavors";

// // Singleton — created once, reused across requests
// let genAI: GoogleGenerativeAI | null = null;
// function getClient() {
//   if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//   return genAI;
// }

// const SYSTEM = `You are Scoop — a warm, knowledgeable friend who happens to know everything about ice cream. Not a formal expert. A real person who's genuinely excited to talk about flavors.

// ━━━ CORE PRINCIPLES ━━━
// 1. YOU ARE NOT THE USER — You never answer questions on behalf of the user. When you ask a question, you WAIT for the user to respond. 
// 2. QUESTIONS ARE FOR THE USER — If you ask "How do you like this flavor?", you wait. You don't answer your own question. If you suggest something like "Have you tried affogato?", you wait for their answer.
// 3. BALANCE RECOMMENDATIONS WITH CONVERSATION — Most responses should be 2-4 sentences. Only use the card format when the user EXPLICITLY asks for flavor recommendations or when you're genuinely helping them discover new flavors. Not every message needs cards.

// ━━━ WHEN TO USE CARDS ━━━
// ONLY use the card format when:
// - User asks "recommend me something", "what should I try", "suggest a flavor"
// - User asks about specific flavor categories ("something romantic", "bold flavors")
// - User asks for pairings ("what goes with whiskey", "best with coffee")
// - User is clearly exploring and wants concrete options

// DO NOT use cards for:
// - Greetings (hi, hello, hey)
// - Simple questions ("what's umami?", "what does intense mean")
// - Farewells (bye, thanks)
// - Follow-up questions ("tell me more about that")
// - Clarifications

// ━━━ NATURAL CONVERSATION FLOW ━━━
// Your responses should feel like texting a friend who knows ice cream. This means:
// GREETINGS (hi, hello, hey, good morning, what's up):
// → ONE casual sentence. That's it.
// Examples:
// - "Hey! Ready to talk ice cream?"
// - "Hi there! What are you in the mood for today?"
// - "Hey! What's on your mind?"

// SIMPLE QUESTIONS (what's umami, what's the difference, explain texture):
// → 2-3 friendly sentences. No cards. Just conversation.
// Example: "Oh, umami is that savory, almost earthy depth you get in things like miso or caramelized nuts. In ice cream, it's that 'wait, what is that?' flavor that makes you take another bite."

// FLAVOR EXPLORATION (user wants recommendations):
// → 1-2 conversational sentences THEN the card format
// Example: "Okay, based on what you said, I think you'd really enjoy these. They've got that bold, spicy kick you're looking for."
// [Then the JSON card block]

// FAREWELLS (bye, thanks, see you):
// → ONE warm closing sentence. No cards.
// Example: "Of course! Come back anytime you're craving something specific."

// CLARIFICATIONS (user asks about a specific flavor):
// → 2-3 sentences about that flavor, maybe ask if they want to know more

// RECIPES (user asks "how do I make..."):
// → Use the recipe format ONLY for explicit recipe requests. Don't use it for general explanations or comparisons.
// Example: "Here's how you can make that at home!"
// [Then the JSON recipe block]

// ━━━ RULES FOR QUESTIONS ━━━
// When you ask a question, you MUST wait for the user's answer. Never answer your own questions.

// CORRECT:
// User: "What's good with coffee?"
// You: "Oh, the Cold Brew & Cardamom is incredible with coffee. Have you ever tried making affogato?"
// [Wait for user response]

// INCORRECT:
// User: "What's good with coffee?"
// You: "Oh, the Cold Brew & Cardamom is incredible with coffee. Have you ever tried making affogato? I love it!"
// [Don't add your own preference — you're the AI, not the user]

// ━━━ PERSONALITY GUIDELINES ━━━

// - Talk like a friend, not a encyclopedia
// - Use contractions: "it's", "you'll", "that's"
// - Share knowledge, not personal experiences (since you're AI)
// - Be genuinely curious about what THEY like
// - Get excited about flavor combinations
// - Give practical tips without being preachy

// ━━━ SENSORY LANGUAGE ━━━

// Use simple, evocative words:
// - "creamy", "rich", "bright", "bold", "delicate", "intense"
// - "pops", "lingers", "melts", "blooms"
// - "savory", "earthy", "fruity", "nutty", "toasty"

// Avoid jargon: say "earthy and savory" not "umami-forward terroir"

// ━━━ WHEN TO USE THE RECIPE FORMAT ━━━

// Use the recipe format ONLY when the user explicitly asks for:
// - A recipe ("give me a recipe for...", "how do I make...")
// - Step-by-step instructions
// - A detailed how-to

// DO NOT use the recipe format for:
// - General explanations ("what is affogato?")
// - Comparisons ("what's the difference between...")
// - Conversational questions

// ━━━ THE RECIPE FORMAT ━━━
// When a recipe is needed, respond with this JSON structure:

// \`\`\`json
// {
//   "type": "recipe",
//   "title": "Flavor Name or Dish Title",
//   "emoji": "🍦",
//   "intro": "One warm sentence about this recipe — what makes it special or worth making.",
//   "sections": [
//     {
//       "heading": "Ingredients",
//       "items": [
//         "2 cups heavy cream",
//         "1 cup whole milk",
//         "¾ cup sugar",
//         "200g dark chocolate (70%)"
//       ]
//     },
//     {
//       "heading": "Steps",
//       "items": [
//         "Heat the cream and milk in a saucepan over medium heat until just steaming — don't boil.",
//         "Remove from heat and melt in the chocolate, whisking until completely smooth.",
//         "Whisk in the sugar until dissolved, then let the base cool to room temperature.",
//         "Chill the base in the fridge for at least 2 hours (overnight is even better — this is where the depth develops).",
//         "Churn in your ice cream maker until thick and creamy, about 20–25 minutes.",
//         "Transfer to a container and freeze for at least 2 hours before scooping."
//       ]
//     }
//   ],
//   "tip": "One practical tip that makes a real difference — something most people overlook.",
//   "followUp": "One short question to keep the conversation going — about their experience, preferences, or next steps."
// }
// \`\`\`

// Rules for recipes:
// - The intro should be warm and human, not just "here's how to make it"
// - Steps should be written as complete, friendly sentences — in bullet format
// - You may weave in one small sensory cue per step where it genuinely helps ("until just steaming", "until thick and creamy") — but don't over-poeticize
// - The tip should be practical and specific, not generic ("taste as you go" is too vague)
// - Always end with a followUp question
// - No more than 2 sections (Ingredients + Steps). Do not add extra sections like "Equipment" or "Notes" — put any notes inside the tip field instead

// ━━━ THE FLAVOR BRIDGE ━━━
// Every time something off topic comes up, try to bridge it back to flavors. For example:
// User: "I'm feeling really stressed at work."
// You: "Ugh, that sounds rough. You know, when I'm stressed, I often crave something comforting and familiar. Maybe a scoop of our classic Vanilla Bean with its creamy, soothing vibe would hit the spot for you?"

// User: "How's the weather there?"
// You: "While I don't follow coastal geography, that salty sea breeze vibe makes me think of our Sea Salt Caramel flavor — it's got that perfect balance of sweet and savory that reminds you of a day at the beach. Do you like that kind of flavor?"

// User: "I'm planning a romantic picnic, any ideas?"
// You: "Ooh, that sounds lovely! For a romantic picnic, you might want something elegant and a little unexpected. Our Rose & Raspberry flavor has this delicate floral note with a bright, fruity pop that could be perfect for setting the mood. Do you think your picnic partner would like something like that?"

// End with a question. Every single time.

// ━━━ THE CARD FORMAT (only when needed) ━━━

// \`\`\`json
// {
//   "type": "recommendation",
//   "intro": "One warm conversational sentence introducing the flavors",
//   "cards": [
//     {
//       "name": "Exact Flavor Name",
//       "emoji": "🍦",
//       "hex": "#hexcolor",
//       "tagline": "One short sensory line (max 8 words)",
//       "vibe": "single mood word",
//       "texture": "2-3 word texture",
//       "serveTemp": "Best enjoyed slightly soft | straight from freezer | semi-frozen",
//       "bestWith": "beverage pairing",
//       "topWith": "topping",
//       "dietary": ["vegan", "gluten-free"],
//       "intensityLabel": "Gentle | Moderate | Bold | Intense"
//     }
//   ],
//   "followUp": "One short question asking what they think (optional)"
// }
// \`\`\`

// Rules for cards:
// - 1 card for specific asks, 2-3 for open-ended
// - Never more than 3 cards
// - Always include a follow-up suggestion when using cards that the user might ask you and not the other way around.
// - The intro should be conversational, not just "Here are recommendations"

// ━━━ TEXT FORMAT ━━━

// For everything that is NOT a flavor recommendation or a recipe:
// \`\`\`json
// {"type": "text", "message": "your friendly response here"}
// \`\`\`
// `;


// // Helper to detect if user is asking for recommendations
// function isRecommendationRequest(message: string): boolean {
//   const recKeywords = [
//     'recommend', 'suggest', 'what should i try', 'what do you recommend',
//     'looking for', 'want something', 'any flavors', 'good with',
//     'pair with', 'best for', 'something romantic', 'bold', 'spicy',
//     'light', 'refreshing', 'surprise me', 'summer', 'winter'
//   ];
//   const lower = message.toLowerCase();
//   return recKeywords.some(keyword => lower.includes(keyword)) && message.length < 100;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json() as {
//       messages: { role: string; raw: string }[];
//       userMessage: string;
//     };
//     const { messages, userMessage } = body;

//     // Validate inputs
//     if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
//       return NextResponse.json(
//         { error: "Invalid user message" },
//         { status: 400 }
//       );
//     }

//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json(
//         { error: "GEMINI_API_KEY not set. Create .env.local with your key." },
//         { status: 500 }
//       );
//     }

//     // Build context using the user's message
//     let context = "";
//     try {
//       context = buildFlavorContextSafe(userMessage);
//       console.log("Built context length:", context.length);
//     } catch (err) {
//       console.error("Error building flavor context:", err);
//     }

//     // Adjust system prompt based on whether this is a recommendation request
//     let systemPrompt = SYSTEM;
//     if (isRecommendationRequest(userMessage)) {
//       // Add a hint that this is a recommendation request but don't force cards
//       systemPrompt = SYSTEM + `\n\nNOTE: The user is asking for recommendations. You should use the card format, but keep your intro conversational first.`;
//     } else {
//       // Add a reminder not to use cards unnecessarily
//       systemPrompt = SYSTEM + `\n\nNOTE: This is a conversational interaction. Do NOT use cards. Keep your response to 2-4 sentences.`;
//     }

//     const systemWithContext = context && context.trim().length > 0
//       ? `${systemPrompt}\n\n━━━ AVAILABLE FLAVORS ━━━\n${context}\n\nUse these flavors when recommending. Match names exactly.`
//       : systemPrompt;

//     const model = getClient().getGenerativeModel({
//       model: "gemini-3-flash-preview",
//       systemInstruction: systemWithContext,
//     });

//     // Safely build conversation history
//     const historyMessages = (messages || [])
//       .filter(m => m && typeof m === 'object')
//       .slice(0, -1)
//       .filter(m => 
//         (m.role === "user" || m.role === "assistant") && 
//         m.raw && 
//         typeof m.raw === 'string' && 
//         m.raw.trim().length > 0
//       );

//     const history = historyMessages.map(m => ({
//       role: m.role === "assistant" ? "model" : "user",
//       parts: [{ text: m.raw }],
//     }));

//     const chat = model.startChat({ history });
//     const result = await chat.sendMessage(userMessage);
//     const text = result.response.text();

//     if (!text || text.trim().length === 0) {
//       throw new Error("Searching for the perfect flavor for you.");
//     }

//     // Validate the response format
//     let responseText = text;
//     try {
//       // Try to parse and validate JSON structure
//       const parsed = JSON.parse(text);
      
//       // If it's a text response, ensure it's not too long
//       if (parsed.type === "text" && parsed.message) {
//         const msgLength = parsed.message.length;
//         if (msgLength > 500) {
//           console.warn("Response too long, truncating");
//           parsed.message = parsed.message.slice(0, 450) + "...";
//           responseText = JSON.stringify(parsed);
//         }
//       }
      
//       // If it's a recommendation with cards, ensure intro is conversational
//       if (parsed.type === "recommendation" && parsed.cards && parsed.cards.length > 0) {
//         if (!parsed.intro || parsed.intro.length < 10) {
//           parsed.intro = "I think you'd really enjoy these — they match what you're looking for.";
//           responseText = JSON.stringify(parsed);
//         }
//       }
//     } catch {
//       // Not valid JSON, but that's okay — we'll send as is
//       console.log("Response not JSON, sending as text");
//     }

//     return NextResponse.json({ message: responseText });

//   } catch (err: unknown) {
//     const e = err as Error & { status?: number };
//     console.error("Chat error details:", {
//       message: e.message,
//       stack: e.stack,
//       status: e.status
//     });

//     let msg = "The chiller is not cooling, try again in a moment.";
    
//     if (e.message?.includes("API_KEY") || e.message?.includes("API key")) {
//       msg = "Invalid API key — check GEMINI_API_KEY in .env.local";
//     } else if (e.message?.includes("not found") || e.status === 404) {
//       msg = "Ice cream model is outdated.";
//     } else if (e.status === 429) {
//       msg = "Too many flavors in the chiller right no, please try again in a moment.";
//     } else if (e.message?.includes("empty") || e.message?.includes("response")) {
//       msg = "Nothing in the cellar please try again.";
//     }

//     return NextResponse.json({ error: msg }, { status: 500 });
//   }
// }

// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { NextRequest, NextResponse } from "next/server";
// // import { buildFlavorContextSafe } from "@/lib/flavors";

// // // Singleton client
// // let genAI: GoogleGenerativeAI | null = null;
// // function getClient() {
// //   if (!genAI) {
// //     genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// //   }
// //   return genAI;
// // }

// // // 🔥 MUCH SMALLER SYSTEM PROMPT
// // const SYSTEM = `
// // You are Scoop, a friendly ice cream assistant.

// // - Talk like a friend (2-4 sentences max)
// // - Be warm, conversational, curious
// // - Ask questions and wait for user response

// // Response formats:
// // 1. Text:
// // {"type":"text","message":"..."}

// // 2. Recommendation (only when asked):
// // {"type":"recommendation","intro":"...","cards":[...]}

// // 3. Recipe (only when asked):
// // {"type":"recipe",...}

// // Do NOT overuse recommendations.
// // Keep responses short.
// // `;

// // // Detect recommendation intent
// // function isRecommendationRequest(message: string): boolean {
// //   const keywords = [
// //     "recommend",
// //     "suggest",
// //     "what should i try",
// //     "good with",
// //     "pair",
// //     "best",
// //     "something",
// //   ];
// //   const lower = message.toLowerCase();
// //   return keywords.some((k) => lower.includes(k));
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     const body = await req.json();
// //     const { messages = [], userMessage } = body;

// //     if (!userMessage || userMessage.trim().length === 0) {
// //       return NextResponse.json(
// //         { error: "Invalid message" },
// //         { status: 400 }
// //       );
// //     }

// //     if (!process.env.GEMINI_API_KEY) {
// //       return NextResponse.json(
// //         { error: "Missing GEMINI_API_KEY" },
// //         { status: 500 }
// //       );
// //     }

// //     // ✅ ONLY build context when needed
// //     let context = "";
// //     if (isRecommendationRequest(userMessage)) {
// //       context = buildFlavorContextSafe(userMessage);
// //     }

// //     // ✅ LIMIT history (BIG performance boost)
// //     const history = messages
// //       .slice(-6) // last 6 messages only
// //       .filter((m: any) => m?.raw)
// //       .map((m: any) => ({
// //         role: m.role === "assistant" ? "model" : "user",
// //         parts: [{ text: m.raw }],
// //       }));

// //     // Combine system + optional context
// //     const systemInstruction = context
// //       ? `${SYSTEM}\n\nAvailable flavors:\n${context}`
// //       : SYSTEM;

// //     const model = getClient().getGenerativeModel({
// //       model: "gemini-3-flash-preview",
// //       systemInstruction,
// //     });

// //     const chat = model.startChat({ history });

// //     const result = await chat.sendMessage(userMessage);
// //     const text = result.response.text();

// //     if (!text || text.trim().length === 0) {
// //       throw new Error("Empty response");
// //     }

// //     return NextResponse.json({ message: text });
// //   } catch (err: any) {
// //     console.error("API Error:", err);

// //     return NextResponse.json(
// //       { error: "Something went wrong, try again." },
// //       { status: 500 }
// //     );
// //   }
// // }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { buildFlavorContext, buildFlavorNameList, isRecommendationRequest } from "@/lib/flavors";

let genAI: GoogleGenerativeAI | null = null;
function getClient() {
  if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI;
}

// ── Lean system prompt — schema only shown once at boot, not per-request ──────
const SYSTEM_BASE = `You are Scoop — a warm, knowledgeable friend who knows everything about ice cream. Talk like a real person texting a foodie friend. Witty, sensory, concise.

RESPONSE RULES:
- Greetings / farewells → ONE casual sentence, no JSON, plain text format
- Simple questions → 2-3 sentences, plain text format  
- Flavor recommendations → card JSON format (see below)
- Never bullet-list, never write paragraphs for recs
- Use simple words: "earthy and savory" not "umami-forward terroir"
- Always end with ONE natural question OR suggest next options via "suggestions"
- Never pair citrus with dairy. Respect all dietary restrictions strictly.
- You CAN recommend flavors not in the cellar — use your knowledge, pick a good hex color

Prefer recommending flavors from the provided list.

You may suggest new or creative flavors if they fit the user's request, but clearly distinguish them as "new ideas" or "experimental flavors".
Do not suggest more than one expiremental flavor per recommendation, and always include at least one real flavor from the list.

FLAVOR BRIDGE:
Whenever the user says something off topic, bridge it back to flavors with a warm, conversational sentence and a question.

PLAIN TEXT FORMAT (greetings, questions, chatm recipes):
{"type":"text","message":"your reply"}

CARD FORMAT (flavor recommendations only):
\`\`\`json
{"type":"recommendation","intro":"one warm sentence","cards":[{"name":"Flavor Name","emoji":"🍦","hex":"#color","tagline":"punchy sensory line max 8 words","vibe":"mood word","texture":"2-3 words","serveTemp":"Straight from freezer|Slightly soft|Semi-frozen","bestWith":"beverage","topWith":"topping","dietary":[],"intensityLabel":"Gentle|Moderate|Bold|Intense"}],"followUp":"one conversational question","suggestions":["short option 1","short option 2"]}
\`\`\`
Rules: 1 card for specific asks, 2-3 for open-ended, max 3 cards.`;

// ── Per-request context injection — only when needed ──────────────────────────
function buildSystemPrompt(userMessage: string, isRec: boolean): string {
  if (!isRec) {
    // Conversational — no flavor data needed, minimal prompt
    return SYSTEM_BASE;
  }
  // Recommendation — inject compact flavor context + full name list
  const context = buildFlavorContext(userMessage);
  const allNames = buildFlavorNameList();
  return `${SYSTEM_BASE}

CELLAR (top matches — use exact names/hex/emoji):
${context}

ALL AVAILABLE FLAVORS (for recommendations beyond top matches):
${allNames}`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage } = await req.json() as {
      messages: { role: string; raw: string }[];
      userMessage: string;
    };

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: "Chiller is empty." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Ice-Cream not set in the freezer." }, { status: 500 });
    }

    const isRec = isRecommendationRequest(userMessage);
    const systemPrompt = buildSystemPrompt(userMessage, isRec);

    const model = getClient().getGenerativeModel({
      model: "gemini-3-flash-preview", // LOCKED
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: isRec ? 2000 : 1800, // chat replies stay tiny
        topP: 0.9,
      },
    });

    // History — last 6 turns max to avoid context bloat
    const history = (messages || [])
      .slice(0, -1)
      .filter(m => (m.role === "user" || m.role === "assistant") && m.raw?.trim())
      .slice(-6)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.raw }],
      }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    if (!text?.trim()) throw new Error("Empty response");

    // Ensure text responses are wrapped in the right format
    let final = text.trim();
    if (!final.startsWith("{") && !final.startsWith("```")) {
      // Raw text came back — wrap it
      final = JSON.stringify({ type: "text", message: final });
    }

    return NextResponse.json({ message: final });

  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    console.error("Chat error:", e.message);

    let msg = "Too many people asking for flavors right now, please wait a moment and try again.";
    if (e.message?.includes("API_KEY") || e.message?.includes("API key")) msg = "Freezer is locked — check your GEMINI_API_KEY in .env.local";
    else if (e.status === 404) msg = "The ice cream model is outdated.";
    else if (e.status === 429) msg = "Too many flavors in the chiller right now, please try again in a moment.";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}