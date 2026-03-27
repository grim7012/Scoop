
// "use client";
// import { useState } from "react";
// import FlavorCard, { CardData } from "./FlavorCard";
// import { flavors } from "@/lib/flavors";

// /* ── Types ─────────────────────────────────────────────────────────── */

// export interface AIResponse {
//   type: "recommendation" | "text";
//   intro?: string;
//   message?: string;
//   cards?: CardData[];
//   followUp?: string;      // plain italic question — NEVER a button
//   suggestions?: string[]; // short clickable chips
// }

// export interface Message {
//   id: string;
//   role: "user" | "assistant";
//   raw: string;
//   parsed?: AIResponse;
//   ts: Date;
// }

// /* ── Helpers ────────────────────────────────────────────────────────── */

// export function parseAIResponse(raw: string): AIResponse {
//   try {
//     const match = raw.match(/```json\s*([\s\S]*?)```/);
//     if (match) return JSON.parse(match[1].trim()) as AIResponse;
//   } catch {}
//   return { type: "text", message: raw };
// }

// // Enrich AI card with image/emoji/hex from local flavors DB if name matches
// function enrichCard(card: CardData): CardData {
//   const match = flavors.find(f => {
//     const a = f.flavor_name.toLowerCase(), b = card.name.toLowerCase();
//     return a === b || a.includes(b) || b.includes(a);
//   });
//   return match
//     ? { ...card, imageUrl: card.imageUrl || match.image_url, emoji: card.emoji || match.image_emoji, hex: card.hex || match.hex_color }
//     : card;
// }

// /* ── Avatar ─────────────────────────────────────────────────────────── */
// // Uses /img.png if it exists, falls back to a simple gold dot avatar
// function ScoopAvatar() {
//   const [imgErr, setImgErr] = useState(false);

//   if (!imgErr) {
//     return (
//       <img
//         src="/img.png"
//         alt="Scoop"
//         onError={() => setImgErr(true)}
//         style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }}
//       />
//     );
//   }

//   // Fallback when /img.png doesn't exist
//   return (
//     <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--raised)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//       <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold)" }} />
//     </div>
//   );
// }

// /* ── Props ──────────────────────────────────────────────────────────── */

// interface Props {
//   msg: Message;
//   onChipClick: (text: string) => void;
//   onCardClick: (name: string) => void;
//   cellarIds: string[];
//   onSaveFlavor: (name: string) => void;
// }

// /* ── Component ──────────────────────────────────────────────────────── */

// export default function MessageBubble({ msg, onChipClick, onCardClick, cellarIds, onSaveFlavor }: Props) {
//   const isUser = msg.role === "user";

//   /* ── User bubble ── */
//   if (isUser) {
//     return (
//       <div className="msg-in" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
//         <div
//           className="bubble-user"
//           style={{ padding: "11px 16px", maxWidth: "min(72%, 560px)" }}
//         >
//           <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
//             {msg.raw}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ── AI bubble ── */
//   const r = msg.parsed ?? { type: "text" as const, message: msg.raw };

//   return (
//     <div className="msg-in" style={{ marginBottom: 28, width: "100%" }}>

//       {/* Avatar + name row */}
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
//         <ScoopAvatar />
//         <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", color: "var(--text-soft)", textTransform: "uppercase" }}>
//           Scoop
//         </span>
//         <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'DM Mono', monospace" }}>
//           {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//         </span>
//       </div>

//       {/* ── Content — full width, NO paddingLeft that would shrink cards ── */}
//       <div style={{ width: "100%" }}>

//         {/* Intro or plain text message */}
//         {(r.intro || r.message) && (
//           <p style={{
//             fontSize: r.type === "recommendation" ? 16 : 14,
//             fontFamily: r.type === "recommendation" ? "'Cormorant Garamond', serif" : "'DM Sans', sans-serif",
//             fontStyle: r.type === "recommendation" ? "italic" : "normal",
//             color: "var(--text)",
//             lineHeight: r.type === "recommendation" ? 1.72 : 1.65,
//             marginBottom: r.cards?.length ? 14 : 0,
//             margin: `0 0 ${r.cards?.length ? "14px" : "0"}`,
//           }}>
//             {r.intro || r.message}
//           </p>
//         )}

//         {/* ── Flavor cards — stacked, FULL WIDTH (no maxWidth cap) ── */}
//         {r.cards && r.cards.length > 0 && (
//           <div style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 10,
//             marginBottom: 14,
//             width: "100%",  // fills entire chat column
//           }}>
//             {r.cards.map((c, i) => {
//               const enriched = enrichCard(c);
//               const isCardSaved = cellarIds.some(id => {
//                 const f = flavors.find(fl => fl.id === id);
//                 return f?.flavor_name.toLowerCase() === c.name.toLowerCase();
//               });
//               return (
//                 <FlavorCard
//                   key={`${c.name}-${i}`}
//                   card={enriched}
//                   isSaved={isCardSaved}
//                   onSave={() => onSaveFlavor(c.name)}
//                   onAsk={(prompt: string) => {
//                     onCardClick(c.name);  // open side panel with this flavor
//                     onChipClick(prompt);  // send a contextual deep-dive question (NOT "tell me more")
//                   }}
//                   onImageClick={() => onCardClick(c.name)}  // clicking image opens side panel
//                   delay={i * 0.07}
//                 />
//               );
//             })}
//           </div>
//         )}

//         {/* followUp — plain italic text, never a button */}
//         {r.followUp && (
//           <p style={{
//             fontSize: 15,
//             fontFamily: "'Cormorant Garamond', serif",
//             fontStyle: "italic",
//             color: "var(--text-mid)",
//             lineHeight: 1.65,
//             marginBottom: r.suggestions?.length ? 12 : 0,
//           }}>
//             {r.followUp}
//           </p>
//         )}

//         {/* suggestions — short clickable chips */}
//         {r.suggestions && r.suggestions.length > 0 && (
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
//             {r.suggestions.map((s, i) => (
//               <button
//                 key={i}
//                 onClick={() => onChipClick(s)}
//                 style={{
//                   padding: "7px 14px",
//                   borderRadius: 6,
//                   fontSize: 12,
//                   fontWeight: 400,
//                   fontFamily: "'DM Sans', sans-serif",
//                   background: "var(--raised)",
//                   border: "1px solid var(--line)",
//                   color: "var(--text-mid)",
//                   cursor: "pointer",
//                   transition: "all 0.16s ease",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 5,
//                 }}
//                 onMouseEnter={e => {
//                   const el = e.currentTarget as HTMLElement;
//                   el.style.borderColor = "var(--gold-border)";
//                   el.style.color = "var(--text)";
//                 }}
//                 onMouseLeave={e => {
//                   const el = e.currentTarget as HTMLElement;
//                   el.style.borderColor = "var(--line)";
//                   el.style.color = "var(--text-mid)";
//                 }}
//               >
//                 <span style={{ color: "var(--gold)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>→</span>
//                 {s}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import FlavorCard, { CardData } from "./FlavorCard";
import { flavors } from "@/lib/flavors";

/* ── Types ─────────────────────────────────────────────────────────── */

export interface AIResponse {
  type: "recommendation" | "text";
  intro?: string;
  message?: string;
  cards?: CardData[];
  followUp?: string;
  suggestions?: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  raw: string;
  parsed?: AIResponse;
  ts: Date;
}

export function parseAIResponse(raw: string): AIResponse {
  try {
    const match = raw.match(/```json\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1].trim()) as AIResponse;
    // Try direct JSON parse
    const trimmed = raw.trim();
    if (trimmed.startsWith("{")) return JSON.parse(trimmed) as AIResponse;
  } catch {}
  return { type: "text", message: raw };
}

function enrichCard(card: CardData): CardData {
  const match = flavors.find(f => {
    const a = f.flavor_name.toLowerCase(), b = card.name.toLowerCase();
    return a === b || a.includes(b) || b.includes(a);
  });
  return match
    ? { ...card, imageUrl: card.imageUrl || match.image_url, emoji: card.emoji || match.image_url, hex: card.hex || match.hex_color }
    : card;
}

/* ── Typewriter hook ─────────────────────────────────────────────────
   Reveals text word-by-word. Only used for text-type responses.
   Cards and recommendations appear immediately.
*/
function useTypewriter(text: string, enabled: boolean, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const words = useRef<string[]>([]);
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    // Reset
    words.current = text.split(" ");
    idx.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      if (idx.current >= words.current.length) {
        setDone(true);
        return;
      }
      const chunk = words.current.slice(0, idx.current + 1).join(" ");
      setDisplayed(chunk);
      idx.current++;
      timer.current = setTimeout(tick, speed);
    };

    // Small initial delay so dots show for a beat before typing starts
    timer.current = setTimeout(tick, 120);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [text, enabled, speed]);

  return { displayed, done };
}

/* ── Avatar ─────────────────────────────────────────────────────────── */
function ScoopAvatar() {
  const [err, setErr] = useState(false);
  if (!err) {
    return (
      <img src="/img.png" alt="Scoop" onError={() => setErr(true)}
        style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }} />
    );
  }
  return (
    <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--raised)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold)" }} />
    </div>
  );
}

/* ── Props ──────────────────────────────────────────────────────────── */
interface Props {
  msg: Message;
  onChipClick: (text: string) => void;
  onCardClick: (name: string) => void;
  cellarIds: string[];
  onSaveFlavor: (name: string) => void;
  isLatest?: boolean; // only animate the most recent message
}

/* ── Component ──────────────────────────────────────────────────────── */
export default function MessageBubble({ msg, onChipClick, onCardClick, cellarIds, onSaveFlavor, isLatest = false }: Props) {
  const isUser = msg.role === "user";

  /* ── User bubble ── */
  if (isUser) {
    return (
      <div className="msg-in" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div className="bubble-user" style={{ padding: "11px 16px", maxWidth: "min(72%, 560px)" }}>
          <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            {msg.raw}
          </p>
        </div>
      </div>
    );
  }

  /* ── AI bubble ── */
  const r = msg.parsed ?? { type: "text" as const, message: msg.raw };
  const isTextType = r.type === "text";
  const textContent = r.message || "";

  // Typewriter only for text responses and only for the latest message
  const { displayed, done } = useTypewriter(textContent, isTextType && isLatest);

  return (
    <div className="msg-in" style={{ marginBottom: 28, width: "100%" }}>
      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
        <ScoopAvatar />
        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", color: "var(--text-soft)", textTransform: "uppercase" }}>Scoop</span>
        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'DM Mono', monospace" }}>
          {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        {/* Blinking cursor while typing */}
        {isTextType && isLatest && !done && (
          <span style={{ width: 2, height: 14, background: "var(--gold)", display: "inline-block", borderRadius: 1, animation: "db 0.7s ease-in-out infinite", marginLeft: 2 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ width: "100%" }}>

        {/* Text message — typewriter */}
        {isTextType && (
          <p style={{
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--text)",
            lineHeight: 1.65,
            marginBottom: 0,
            minHeight: "1.65em", // prevent layout jump
          }}>
            {displayed || <span style={{ opacity: 0 }}>.</span>}
          </p>
        )}

        {/* Recommendation — instant */}
        {!isTextType && (
          <>
            {/* Intro */}
            {r.intro && (
              <p style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--text)", lineHeight: 1.72, marginBottom: r.cards?.length ? 14 : 0 }}>
                {r.intro}
              </p>
            )}

            {/* Cards — full width */}
            {r.cards && r.cards.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, width: "100%" }}>
                {r.cards.map((c, i) => {
                  const enriched = enrichCard(c);
                  const isCardSaved = cellarIds.some(id => {
                    const f = flavors.find(fl => fl.id === id);
                    return f?.flavor_name.toLowerCase() === c.name.toLowerCase();
                  });
                  return (
                    <FlavorCard
                      key={`${c.name}-${i}`}
                      card={enriched}
                      isSaved={isCardSaved}
                      //onSave={() => onSaveFlavor(c.name)}
                      onAsk={(prompt: string) => { onCardClick(c.name); onChipClick(prompt); }}
                      onImageClick={() => onCardClick(c.name)}
                      delay={i * 0.07}
                    />
                  );
                })}
              </div>
            )}

            {/* followUp — plain italic text */}
            {r.followUp && (
              <p style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--text-mid)", lineHeight: 1.65, marginBottom: r.suggestions?.length ? 12 : 0 }}>
                {r.followUp}
              </p>
            )}

            {/* suggestions — clickable chips */}
            {r.suggestions && r.suggestions.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {r.suggestions.map((s, i) => (
                  <button key={i} onClick={() => onChipClick(s)}
                    style={{ padding: "7px 14px", borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans',sans-serif", background: "var(--raised)", border: "1px solid var(--line)", color: "var(--text-mid)", cursor: "pointer", transition: "all 0.16s ease", display: "flex", alignItems: "center", gap: 5 }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--gold-border)"; el.style.color = "var(--text)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--line)"; el.style.color = "var(--text-mid)"; }}
                  >
                    <span style={{ color: "var(--gold)", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>→</span>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}