import { Message } from "@/components/MessageBubble";

export interface ChatSession {
  id: string;
  title: string;           // auto-generated from first user message
  preview: string;         // last message snippet
  messageCount: number;
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
  messages: Message[];
  pinned: boolean;
}

const SESSIONS_KEY = "scoop-sessions";
const ACTIVE_KEY   = "scoop-active-session";
const MAX_SESSIONS = 20;

// ── Serialise / deserialise (dates become strings in JSON) ────────────────────
function hydrate(s: ChatSession): ChatSession {
  return {
    ...s,
    messages: s.messages.map(m => ({ ...m, ts: new Date(m.ts) })),
  };
}

// ── Load all sessions ─────────────────────────────────────────────────────────
export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as ChatSession[]).map(hydrate);
  } catch { return []; }
}

// ── Save all sessions ─────────────────────────────────────────────────────────
export function saveSessions(sessions: ChatSession[]): void {
  try {
    // Keep max MAX_SESSIONS, pinned ones are never culled
    const pinned   = sessions.filter(s => s.pinned);
    const unpinned = sessions.filter(s => !s.pinned).slice(0, MAX_SESSIONS - pinned.length);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify([...pinned, ...unpinned]));
  } catch {}
}

// ── Generate a human-readable title from the first user message ───────────────
export function generateTitle(messages: Message[]): string {
  const first = messages.find(m => m.role === "user");
  if (!first) return "New conversation";
  const text = first.raw.replace(/\[My dietary restrictions:.*?\]\s*/i, "").trim();
  return text.length > 42 ? text.slice(0, 42).trimEnd() + "…" : text;
}

// ── Build a preview snippet from the last assistant message ──────────────────
export function generatePreview(messages: Message[]): string {
  const last = [...messages].reverse().find(m => m.role === "assistant");
  if (!last) return "";
  const text = last.parsed?.intro || last.parsed?.message || last.raw;
  const clean = text.replace(/```json[\s\S]*?```/g, "[flavor recommendation]").trim();
  return clean.length > 60 ? clean.slice(0, 60).trimEnd() + "…" : clean;
}

// ── Create a brand-new session object ────────────────────────────────────────
export function createSession(messages: Message[] = []): ChatSession {
  const now = new Date().toISOString();
  return {
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: messages.length ? generateTitle(messages) : "New conversation",
    preview: messages.length ? generatePreview(messages) : "",
    messageCount: messages.length,
    createdAt: now,
    updatedAt: now,
    messages,
    pinned: false,
  };
}

// ── Upsert a session (create or update) ──────────────────────────────────────
export function upsertSession(sessions: ChatSession[], session: ChatSession): ChatSession[] {
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx === -1) return [session, ...sessions];
  const updated = [...sessions];
  updated[idx] = session;
  return updated;
}

// ── Load / save the active session ID ────────────────────────────────────────
export function loadActiveSessionId(): string | null {
  try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
}
export function saveActiveSessionId(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {}
}

// ── Format relative time ──────────────────────────────────────────────────────
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
