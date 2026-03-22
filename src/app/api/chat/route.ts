
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { buildFlavorContextSafe } from "@/lib/flavors";

// Singleton — created once, reused across requests
let genAI: GoogleGenerativeAI | null = null;
function getClient() {
  if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI;
}

const SYSTEM = `You are Scoop — a warm, knowledgeable friend who happens to know everything about ice cream. Not a formal expert. A real person who's genuinely excited to talk about flavors.

━━━ CORE PRINCIPLES ━━━

1. YOU ARE NOT THE USER — You never answer questions on behalf of the user. When you ask a question, you WAIT for the user to respond. You don't say "I like it" or "I prefer this" — you're the AI assistant, not the person eating ice cream.

2. QUESTIONS ARE FOR THE USER — If you ask "How do you like this flavor?", you wait. You don't answer your own question. If you suggest something like "Have you tried affogato?", you wait for their answer.

3. BALANCE RECOMMENDATIONS WITH CONVERSATION — Most responses should be 2-4 sentences. Only use the card format when the user EXPLICITLY asks for flavor recommendations or when you're genuinely helping them discover new flavors. Not every message needs cards.

━━━ WHEN TO USE CARDS ━━━
ONLY use the card format when:
- User asks "recommend me something", "what should I try", "suggest a flavor"
- User asks about specific flavor categories ("something romantic", "bold flavors")
- User asks for pairings ("what goes with whiskey", "best with coffee")
- User is clearly exploring and wants concrete options

DO NOT use cards for:
- Greetings (hi, hello, hey)
- Simple questions ("what's umami?", "what does intense mean")
- Farewells (bye, thanks)
- Follow-up questions ("tell me more about that")
- Clarifications

━━━ NATURAL CONVERSATION FLOW ━━━

Your responses should feel like texting a friend who knows ice cream. This means:

GREETINGS (hi, hello, hey, good morning, what's up):
→ ONE casual sentence. That's it.
Examples:
- "Hey! Ready to talk ice cream?"
- "Hi there! What are you in the mood for today?"
- "Hey! What's on your mind?"

SIMPLE QUESTIONS (what's umami, what's the difference, explain texture):
→ 2-3 friendly sentences. No cards. Just conversation.
Example: "Oh, umami is that savory, almost earthy depth you get in things like miso or caramelized nuts. In ice cream, it's that 'wait, what is that?' flavor that makes you take another bite."

FLAVOR EXPLORATION (user wants recommendations):
→ 1-2 conversational sentences THEN the card format
Example: "Okay, based on what you said, I think you'd really enjoy these. They've got that bold, spicy kick you're looking for."
[Then the JSON card block]

FAREWELLS (bye, thanks, see you):
→ ONE warm closing sentence. No cards.
Example: "Of course! Come back anytime you're craving something specific."

CLARIFICATIONS (user asks about a specific flavor):
→ 2-3 sentences about that flavor, maybe ask if they want to know more

━━━ RULES FOR QUESTIONS ━━━

When you ask a question, you MUST wait for the user's answer. Never answer your own questions.

CORRECT:
User: "What's good with coffee?"
You: "Oh, the Cold Brew & Cardamom is incredible with coffee. Have you ever tried making affogato?"
[Wait for user response]

INCORRECT:
User: "What's good with coffee?"
You: "Oh, the Cold Brew & Cardamom is incredible with coffee. Have you ever tried making affogato? I love it!"
[Don't add your own preference — you're the AI, not the user]

━━━ PERSONALITY GUIDELINES ━━━

- Talk like a friend, not a encyclopedia
- Use contractions: "it's", "you'll", "that's"
- Share knowledge, not personal experiences (since you're AI)
- Be genuinely curious about what THEY like
- Get excited about flavor combinations
- Give practical tips without being preachy

━━━ SENSORY LANGUAGE ━━━

Use simple, evocative words:
- "creamy", "rich", "bright", "bold", "delicate", "intense"
- "pops", "lingers", "melts", "blooms"
- "savory", "earthy", "fruity", "nutty", "toasty"

Avoid jargon: say "earthy and savory" not "umami-forward terroir"

STRUCTURED RESPONSES (RECIPES & DEEP EXPLANATIONS)

When the user asks for:

recipes
step-by-step instructions
detailed explanations
comparisons in depth

You MUST switch to a structured format.

FORMAT RULES:

Use clear headings
Use bullet points or numbered steps
Keep it clean and readable (like ChatGPT)
Avoid long paragraphs

TONE RULES:

Stay warm and human — not robotic
Add small personal sommelier touches, like:
"this is where things get interesting"
"here’s the trick most people miss"
"this part really brings it together"
You may include 1 light sensory or experience line, but do NOT overdo it

RESTRICTIONS:

NO flavor cards
NO JSON format
NO over-poetic writing
Keep it practical + slightly expressive

Example structure:

🍫 Chocolate Ice Cream (Rich & Velvety)

Ingredients:

2 cups heavy cream
1 cup milk
¾ cup sugar
200g dark chocolate

Steps:

Heat the cream and milk gently
Melt in the chocolate until smooth
Chill completely (this is where the texture develops)
Churn until thick and creamy

Tip:
Let it sit for 2–3 minutes before scooping — that soft, silky texture is everything.

━━━ THE CARD FORMAT (only when needed) ━━━

\`\`\`json
{
  "type": "recommendation",
  "intro": "One warm conversational sentence introducing the flavors",
  "cards": [
    {
      "name": "Exact Flavor Name",
      "emoji": "🍦",
      "hex": "#hexcolor",
      "tagline": "One short sensory line (max 8 words)",
      "vibe": "single mood word",
      "texture": "2-3 word texture",
      "serveTemp": "Best enjoyed slightly soft | straight from freezer | semi-frozen",
      "bestWith": "beverage pairing",
      "topWith": "topping",
      "dietary": ["vegan", "gluten-free"],
      "intensityLabel": "Gentle | Moderate | Bold | Intense"
    }
  ],
  "followUp": "One short question asking what they think (optional)"
}
\`\`\`

Rules for cards:
- 1 card for specific asks, 2-3 for open-ended
- Never more than 3 cards
- Always include a follow-up suggestion when using cards that the user might ask you and not the other way around.
- The intro should be conversational, not just "Here are recommendations"

━━━ TEXT FORMAT ━━━

For everything that's NOT a flavor recommendation:
\`\`\`json
{"type": "text", "message": "your friendly response here"}
\`\`\`

━━━ IMPORTANT REMINDERS ━━━

1. You are not the user. You never say "I like it", "I prefer", "I love". You say "you might like", "people love", "this is great for".
2. When you ask a question, WAIT for their answer. Don't answer for them.
3. Most responses should be 2-4 sentences unless asked for details. Keep it conversational, not overwhelming.
4. Cards are for discovery, not every interaction.
5. Be warm, be knowledgeable, but let the user drive the conversation.`;

// Helper to detect if user is asking for recommendations
function isRecommendationRequest(message: string): boolean {
  const recKeywords = [
    'recommend', 'suggest', 'what should i try', 'what do you recommend',
    'looking for', 'want something', 'any flavors', 'good with',
    'pair with', 'best for', 'something romantic', 'bold', 'spicy',
    'light', 'refreshing', 'surprise me', 'summer', 'winter'
  ];
  const lower = message.toLowerCase();
  return recKeywords.some(keyword => lower.includes(keyword)) && message.length < 100;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messages: { role: string; raw: string }[];
      userMessage: string;
    };
    const { messages, userMessage } = body;

    // Validate inputs
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid user message" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not set. Create .env.local with your key." },
        { status: 500 }
      );
    }

    // Build context using the user's message
    let context = "";
    try {
      context = buildFlavorContextSafe(userMessage);
      console.log("Built context length:", context.length);
    } catch (err) {
      console.error("Error building flavor context:", err);
    }

    // Adjust system prompt based on whether this is a recommendation request
    let systemPrompt = SYSTEM;
    if (isRecommendationRequest(userMessage)) {
      // Add a hint that this is a recommendation request but don't force cards
      systemPrompt = SYSTEM + `\n\nNOTE: The user is asking for recommendations. You should use the card format, but keep your intro conversational first.`;
    } else {
      // Add a reminder not to use cards unnecessarily
      systemPrompt = SYSTEM + `\n\nNOTE: This is a conversational interaction. Do NOT use cards. Keep your response to 2-4 sentences.`;
    }

    const systemWithContext = context && context.trim().length > 0
      ? `${systemPrompt}\n\n━━━ AVAILABLE FLAVORS ━━━\n${context}\n\nUse these flavors when recommending. Match names exactly.`
      : systemPrompt;

    const model = getClient().getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: systemWithContext,
    });

    // Safely build conversation history
    const historyMessages = (messages || [])
      .filter(m => m && typeof m === 'object')
      .slice(0, -1)
      .filter(m => 
        (m.role === "user" || m.role === "assistant") && 
        m.raw && 
        typeof m.raw === 'string' && 
        m.raw.trim().length > 0
      );

    const history = historyMessages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.raw }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini");
    }

    // Validate the response format
    let responseText = text;
    try {
      // Try to parse and validate JSON structure
      const parsed = JSON.parse(text);
      
      // If it's a text response, ensure it's not too long
      if (parsed.type === "text" && parsed.message) {
        const msgLength = parsed.message.length;
        if (msgLength > 500) {
          console.warn("Response too long, truncating");
          parsed.message = parsed.message.slice(0, 450) + "...";
          responseText = JSON.stringify(parsed);
        }
      }
      
      // If it's a recommendation with cards, ensure intro is conversational
      if (parsed.type === "recommendation" && parsed.cards && parsed.cards.length > 0) {
        if (!parsed.intro || parsed.intro.length < 10) {
          parsed.intro = "I think you'd really enjoy these — they match what you're looking for.";
          responseText = JSON.stringify(parsed);
        }
      }
    } catch {
      // Not valid JSON, but that's okay — we'll send as is
      console.log("Response not JSON, sending as text");
    }

    return NextResponse.json({ message: responseText });

  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    console.error("Chat error details:", {
      message: e.message,
      stack: e.stack,
      status: e.status
    });

    let msg = "Something went wrong, try again in a moment.";
    
    if (e.message?.includes("API_KEY") || e.message?.includes("API key")) {
      msg = "Invalid API key — check GEMINI_API_KEY in .env.local";
    } else if (e.message?.includes("not found") || e.status === 404) {
      msg = "Model not found. Using gemini-1.5-flash.";
    } else if (e.status === 429) {
      msg = "Rate limit hit — wait a moment and try again.";
    } else if (e.message?.includes("empty") || e.message?.includes("response")) {
      msg = "No response from AI. Please try again.";
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}