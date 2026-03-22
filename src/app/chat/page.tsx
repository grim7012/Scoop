
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import { flavors, Flavor } from "@/lib/flavors";
import {
  ChatSession,
  loadSessions, saveSessions,
  loadActiveSessionId, saveActiveSessionId,
  createSession, upsertSession,
  generateTitle, generatePreview,
} from "@/lib/sessions";
import MessageBubble, { Message, parseAIResponse } from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import CellarDrawer from "@/components/CellarDrawer";
import SidePanel from "@/components/SidePanel";
import DietaryFilter from "@/components/DietaryFilter";
import HistoryPanel from "@/components/HistoryPanel";
import { OnboardingHints } from "@/components/Tooltip";

const DEFAULT_CHIPS = [
  "Something romantic",
  "Bold & spicy",
  "Pair with whiskey",
  "Light & refreshing",
  "Surprise me",
  "Perfect for summer",
];

function useDebounce<T>(value: T, ms: number): T {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return dv;
}

function NewChatModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <div className="overlay" onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 400 }} />
      <div className="si" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 410, width: 360, borderRadius: 10, background: "var(--panel)", border: "1px solid var(--line-hi)", padding: "28px" }}>
        <p className="label" style={{ marginBottom: 12 }}>New Conversation</p>
        <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.65, marginBottom: 24 }}>
          Your current chat will be saved automatically. You can resume it any time from the conversation history.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 6, fontSize: 12, fontWeight: 500, background: "transparent", border: "1px solid var(--line)", color: "var(--text-soft)", cursor: "pointer" }}>Stay</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "var(--gold)", border: "none", color: "var(--bg)", cursor: "pointer" }}>New chat</button>
        </div>
      </div>
    </>
  );
}

/* ── Build a synthetic Flavor from AI card data (for unknown flavors) ── */
function cardToFlavor(name: string, allMessages: Message[]): Flavor | null {
  // Search all message cards for matching card data
  for (const msg of allMessages) {
    if (msg.role !== "assistant" || !msg.parsed?.cards) continue;
    const card = msg.parsed.cards.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!card) continue;
    return {
      id: `ai-${name.toLowerCase().replace(/\s+/g, "-")}`,
      flavor_name: card.name,
      hex_color: card.hex || "#C8A96E",
      image_emoji: card.emoji || "🍦",
      image_url: card.imageUrl || "",
      aroma_profile: [],
      metrics: { sweetness: 50, richness: 50, umami: 20, intensity: 3 },
      pairings: { beverage: card.bestWith || "—", topping: card.topWith || "—", dessert: "—" },
      pairing_logic: "Complementary",
      mood_tag: card.vibe || "—",
      sommelier_note: card.tagline || "",
      use_cases: [],
      dietary: { vegan: false, gluten_free: false, nut_free: false, dairy_free: false, alcohol_free: false, egg_free: false },
      avoid_with: [],
      serve_temp: card.serveTemp || "—",
      texture: card.texture || "—",
    } as Flavor;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [loading, setLoading]               = useState(false);

  const [sessions, setSessions]             = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveId]      = useState<string | null>(null);
  const [historyOpen, setHistoryOpen]       = useState(false);
  const [showNewModal, setShowNewModal]     = useState(false);

  const [cellar, setCellar]                 = useState<Flavor[]>([]);
  const [cellarOpen, setCellarOpen]         = useState(false);
  const [activeFlavor, setActiveFlavor]     = useState<Flavor | null>(null);
  const [dietary, setDietary]               = useState<string[]>([]);
  const [dietaryOpen, setDietaryOpen]       = useState(false);
  const [sidePanelOpen, setSidePanelOpen]   = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages    = messages.length > 0;
  const debouncedMsgs  = useDebounce(messages, 600);

  /* ── Bootstrap ─────────────────────────────────────────────── */
  useEffect(() => {
    try {
      const s = localStorage.getItem("scoop-cellar");
      if (s) setCellar(JSON.parse(s));
    } catch {}
    const stored = loadSessions();
    setSessions(stored);
    const lastId = loadActiveSessionId();
    if (lastId) {
      const last = stored.find(s => s.id === lastId);
      if (last?.messages.length) { setMessages(last.messages); setActiveId(lastId); }
    }
  }, []);

  /* ── Auto-save ──────────────────────────────────────────────── */
  useEffect(() => {
    if (debouncedMsgs.length === 0) return;
    setSessions(prev => {
      let session = prev.find(s => s.id === activeSessionId);
      if (!session) {
        session = createSession(debouncedMsgs);
        setActiveId(session.id);
        saveActiveSessionId(session.id);
        const next = upsertSession(prev, session);
        saveSessions(next);
        return next;
      }
      const updated: ChatSession = {
        ...session,
        messages: debouncedMsgs,
        title: generateTitle(debouncedMsgs),
        preview: generatePreview(debouncedMsgs),
        messageCount: debouncedMsgs.length,
        updatedAt: new Date().toISOString(),
      };
      const next = upsertSession(prev, updated);
      saveSessions(next);
      return next;
    });
  }, [debouncedMsgs]); // eslint-disable-line

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  /* ── Session ops ────────────────────────────────────────────── */
  const startNew = useCallback(() => {
    setMessages([]); setActiveFlavor(null); setActiveId(null); saveActiveSessionId(null);
  }, []);

  const resumeSession = useCallback((s: ChatSession) => {
    setMessages(s.messages); setActiveId(s.id); saveActiveSessionId(s.id); setActiveFlavor(null);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => { const next = prev.filter(s => s.id !== id); saveSessions(next); return next; });
    if (id === activeSessionId) startNew();
  }, [activeSessionId, startNew]);

  const pinSession = useCallback((id: string) => {
    setSessions(prev => { const next = prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s); saveSessions(next); return next; });
  }, []);

  const renameSession = useCallback((id: string, title: string) => {
    setSessions(prev => { const next = prev.map(s => s.id === id ? { ...s, title } : s); saveSessions(next); return next; });
  }, []);

  /* ── Cellar ops ─────────────────────────────────────────────── */
  const saveToCellar = useCallback((f: Flavor) => {
    setCellar(prev => {
      const next = prev.find(x => x.id === f.id) ? prev.filter(x => x.id !== f.id) : [...prev, f];
      try { localStorage.setItem("scoop-cellar", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeFromCellar = useCallback((f: Flavor) => {
    setCellar(prev => {
      const next = prev.filter(x => x.id !== f.id);
      try { localStorage.setItem("scoop-cellar", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const saveFlavorByName = useCallback((name: string) => {
    const f = flavors.find(fl => { const a = fl.flavor_name.toLowerCase(), b = name.toLowerCase(); return a === b || a.includes(b) || b.includes(a); });
    if (f) saveToCellar(f);
  }, [saveToCellar]);

  /* ── Find flavor — first in local DB, then in current messages ── */
  const findFlavor = useCallback((name: string, currentMessages: Message[]): Flavor | null => {
    const lower = name.toLowerCase();
    const local = flavors.find(f =>
      f.flavor_name.toLowerCase() === lower ||
      f.flavor_name.toLowerCase().includes(lower) ||
      lower.includes(f.flavor_name.toLowerCase())
    );
    if (local) return local;
    // Build synthetic flavor from AI card data
    return cardToFlavor(name, currentMessages);
  }, []);

  /* ── Handle card click: find flavor + open panel ──────────── */
  const handleCardClick = useCallback((name: string) => {
    setMessages(prev => {
      const f = findFlavor(name, prev);
      if (f) {
        setActiveFlavor(f);
        setSidePanelOpen(true);
      }
      return prev; // no mutation
    });
  }, [findFlavor]);

  /* ── Chat send ──────────────────────────────────────────────── */
  const send = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const prefix = dietary.length > 0 ? `[My dietary restrictions: ${dietary.join(", ")}] ` : "";
    const userMsg: Message = { id: Date.now().toString(), role: "user", raw: t, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, raw: m.raw })),
          userMessage: prefix + t,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const parsed = parseAIResponse(data.message);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", raw: data.message, parsed, ts: new Date() };
      setMessages(prev => {
        const next = [...prev, aiMsg];
        // Auto-open side panel with first card
        if (parsed.type === "recommendation" && parsed.cards?.[0]) {
          const f = findFlavor(parsed.cards[0].name, next);
          if (f) { setActiveFlavor(f); setSidePanelOpen(true); }
        }
        return next;
      });
    } catch (e: unknown) {
      const err = e as Error;
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: "assistant", raw: err.message,
        parsed: { type: "text", message: err.message || "Something went wrong." }, ts: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, dietary, findFlavor]);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null;

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg,#0A0908)" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="header-glass" style={{ flexShrink: 0, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 50, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* History */}
          <div className="tt-wrap">
            <button
              onClick={() => setHistoryOpen(true)}
              style={{ width: 36, height: 36, borderRadius: 6, background: "transparent", border: "1px solid transparent", color: "var(--text-soft)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.16s", position: "relative", flexShrink: 0, fontFamily: "'DM Mono',monospace" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(237,232,223,0.06)"; el.style.borderColor = "var(--line)"; el.style.color = "var(--text)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "transparent"; el.style.color = "var(--text-soft)"; }}
            >
              ≡
              {sessions.length > 0 && <span style={{ position: "absolute", top: 7, right: 7, width: 5, height: 5, borderRadius: "50%", background: "var(--gold)" }} />}
            </button>
            <span className="tt">Conversations</span>
          </div>

          <div style={{ width: 1, height: 18, background: "var(--line)", margin: "0 10px" }} />

          <Link href="/" style={{ textDecoration: "none" }}>
          <div className="flex items-center gap-2">
            <motion.span 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-xl text-[#F7E7CE]"
            >
              ✧
            </motion.span>
            <span className="serif-swirl text-md italic tracking-widest uppercase font-light">Scoop</span>
          </div></Link>

          {activeSession && (
            <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
              <span style={{ color: "var(--line-hi)", fontSize: 12, margin: "0 6px" }}>/</span>
              <span style={{ fontSize: 12, color: "var(--text-soft)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }} title={activeSession.title}>
                {activeSession.title}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-soft)" }}>
          <NavBtn label="+ NEW"  active={false}  tip="New conversation"       onClick={() => hasMessages ? setShowNewModal(true) : startNew()} />
          <NavBtn label="DIET"   active={dietaryOpen || dietary.length > 0}   tip="Dietary preferences"   onClick={() => setDietaryOpen(p => !p)}    badge={dietary.length || undefined} />
          <NavBtn label={sidePanelOpen ? "PANEL ON" : "PANEL OFF"} active={sidePanelOpen} tip="Flavor profile panel" onClick={() => setSidePanelOpen(p => !p)} />
          <NavBtn label="CELLAR" active={cellar.length > 0} tip="Saved flavors" onClick={() => setCellarOpen(true)} badge={cellar.length || undefined} />
        </div>
      </header>

      {/* ── DIETARY BAR ─────────────────────────────────────────── */}
      {dietaryOpen && (
        <div style={{ flexShrink: 0, borderBottom: "1px solid var(--line)", background: "var(--surface)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 12, overflowX: "auto", zIndex: 40 }}>
          <span className="label" style={{ flexShrink: 0 }}>Dietary</span>
          <DietaryFilter active={dietary} onChange={setDietary} />
          {dietary.length > 0 && (
            <button onClick={() => setDietary([])} style={{ fontSize: 10, color: "var(--text-dim)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", flexShrink: 0 }}>CLEAR</button>
          )}
        </div>
      )}

      {/* ── STATUS BAR ──────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em" }}>
            {sessions.length > 0 ? `${sessions.length} CONVERSATION${sessions.length !== 1 ? "S" : ""}` : "NO HISTORY"}
          </span>
          {hasMessages && (
            <>
              <span style={{ color: "var(--line-hi)", fontSize: 10 }}>·</span>
              <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em" }}>
                {messages.length} MESSAGE{messages.length !== 1 ? "S" : ""}
              </span>
            </>
          )}
        </div>
        {hasMessages && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(80,160,70,0.8)" }} />
            <span style={{ fontSize: 9, color: "var(--text-dim)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em" }}>SAVED</span>
          </div>
        )}
      </div>

      {/* ── BODY ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── CHAT ────────────────────────────────────────────── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Empty state */}
          {!hasMessages && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px 80px" }}>
              {sessions.length > 0 && (
                <div style={{ width: "100%", maxWidth: 500, marginBottom: 40 }}>
                  <p className="label" style={{ marginBottom: 12 }}>Recent</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {sessions.slice(0, 3).map(s => (
                      <button key={s.id} onClick={() => resumeSession(s)} className="session-row"
                        style={{ padding: "10px 12px", borderRadius: 6, background: "transparent", border: "1px solid transparent", color: "var(--text-soft)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                        <div style={{ width: 2, height: 20, background: "var(--line)", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>{s.title}</p>
                          <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>{s.preview || "—"}</p>
                        </div>
                        <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>→</span>
                      </button>
                    ))}
                  </div>
                  {sessions.length > 3 && (
                    <button onClick={() => setHistoryOpen(true)} style={{ marginTop: 6, background: "transparent", border: "none", color: "var(--gold)", fontSize: 10, cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", padding: "4px 12px" }}>
                      ALL CONVERSATIONS ({sessions.length}) →
                    </button>
                  )}
                </div>
              )}

              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 300, fontStyle: "italic", color: "var(--text)", lineHeight: 1.1, marginBottom: 12 }}>
                  Good evening.
                </h2>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,2vw,19px)", fontStyle: "italic", color: "var(--text-mid)", maxWidth: 400, lineHeight: 1.65 }}>
                  I'm Scoop, your sommelier. What are you in the mood for?
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 500 }}>
                {DEFAULT_CHIPS.map(c => (
                  <button key={c} onClick={() => send(c)} className="chip" style={{ padding: "8px 16px", fontSize: 12, background: "rgba(200,169,110,0.07)", border: "1px solid rgba(200,169,110,0.16)", color: "var(--text-mid)", fontFamily: "'DM Sans',sans-serif" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {hasMessages && (
            <div className="scr" style={{ flex: 1, padding: "24px 24px 8px", maxWidth: 860, width: "100%", margin: "0 auto", alignSelf: "stretch" }}>
              {messages.map(m => (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  onChipClick={send}
                  onCardClick={handleCardClick}
                  cellarIds={cellar.map(f => f.id)}
                  onSaveFlavor={saveFlavorByName}
                />
              ))}
              {loading && (
                <div className="msg-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--raised)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1px solid var(--gold)" }} />
                  </div>
                  <div style={{ display: "flex", gap: 5, padding: "11px 16px", background: "var(--raised)", borderRadius: "14px 14px 14px 4px", border: "1px solid var(--line)" }}>
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Inline chips */}
          {hasMessages && (
            <div style={{ flexShrink: 0, padding: "6px 24px 0", overflowX: "auto", maxWidth: 860, width: "100%", alignSelf: "center" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {DEFAULT_CHIPS.slice(0, 4).map(c => (
                  <button key={c} onClick={() => send(c)} className="chip" style={{ whiteSpace: "nowrap", flexShrink: 0, padding: "5px 12px", fontSize: 11, background: "rgba(200,169,110,0.05)", border: "1px solid rgba(200,169,110,0.12)", color: "var(--text-dim)", fontFamily: "'DM Sans',sans-serif" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ flexShrink: 0, padding: "10px 24px 18px", maxWidth: 860, width: "100%", margin: "0 auto", alignSelf: "stretch" }}>
            <div style={{ background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 8, padding: "10px 12px 10px 16px", display: "flex", alignItems: "flex-end", gap: 10, transition: "border-color 0.18s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--gold-border)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--line)")}
            >
              <ChatInput value={input} onChange={setInput} onSend={() => send(input)} loading={loading} />
            </div>
            <p style={{ textAlign: "center", fontSize: 9, color: "var(--text-dim)", marginTop: 6, letterSpacing: "0.14em", fontFamily: "'DM Mono',monospace" }}>
              ENTER TO SEND · SHIFT+ENTER FOR NEW LINE
            </p>
          </div>
        </main>

        {/* ── SIDE PANEL ──────────────────────────────────────── */}
        {sidePanelOpen && (
          <SidePanel
            activeFlavor={activeFlavor}
            cellarIds={cellar.map(f => f.id)}
            onSave={saveToCellar}
            onAsk={send}
          />
        )}
      </div>

      {/* ── OVERLAYS ────────────────────────────────────────────── */}
      {historyOpen && (
        <HistoryPanel sessions={sessions} activeId={activeSessionId} onSelect={resumeSession} onNew={startNew} onDelete={deleteSession} onPin={pinSession} onRename={renameSession} onClose={() => setHistoryOpen(false)} />
      )}
      {showNewModal && (
        <NewChatModal onConfirm={() => { setShowNewModal(false); startNew(); }} onCancel={() => setShowNewModal(false)} />
      )}
      {cellarOpen && (
        <CellarDrawer cellar={cellar} onClose={() => setCellarOpen(false)} onRemove={removeFromCellar} onAsk={text => { send(text); setCellarOpen(false); }} />
      )}
      <OnboardingHints />
    </div>
  );
}

/* ── Reusable nav button ─────────────────────────────────────── */
function NavBtn({ label, active, tip, onClick, badge }: { label: string; active: boolean; tip: string; onClick: () => void; badge?: number }) {
  return (
    <div className="tt-wrap">
      <button
        onClick={onClick}
        style={{ height: 32, padding: "0 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", background: active ? "var(--gold-dim)" : "transparent", border: `1px solid ${active ? "var(--gold-border)" : "var(--line)"}`, color: active ? "var(--gold)" : "var(--text-soft)", cursor: "pointer", transition: "all 0.16s", display: "flex", alignItems: "center", gap: 6 }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!active) { el.style.borderColor = "var(--gold-border)"; el.style.color = "var(--gold)"; } }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (!active) { el.style.borderColor = "var(--line)"; el.style.color = "var(--text-soft)"; } }}
      >
        {label}
        {badge !== undefined && badge > 0 && (
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, background: "var(--gold)", color: "var(--bg)", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
            {badge}
          </span>
        )}
      </button>
      <span className="tt">{tip}</span>
    </div>
  );
}