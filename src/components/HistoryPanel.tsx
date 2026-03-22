"use client";
import { useState } from "react";
import { ChatSession, relativeTime } from "@/lib/sessions";

interface Props {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (session: ChatSession) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onClose: () => void;
}

export default function HistoryPanel({ sessions, activeId, onSelect, onNew, onDelete, onPin, onRename, onClose }: Props) {
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editTitle, setEditTitle]   = useState("");
  const [searchQuery, setSearch]    = useState("");
  const [confirmDelete, setConfirm] = useState<string | null>(null);

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned   = filtered.filter(s => s.pinned);
  const unpinned = filtered.filter(s => !s.pinned);

  function startRename(s: ChatSession) {
    setEditingId(s.id);
    setEditTitle(s.title);
  }

  function commitRename(id: string) {
    if (editTitle.trim()) onRename(id, editTitle.trim());
    setEditingId(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="overlay"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(5px)", zIndex: 300 }}
      />

      {/* Panel */}
      <div
        className="drawer"
        style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 320, zIndex: 310, background: "var(--surface, #100C08)", borderRight: "1px solid rgba(201,162,74,0.22)", display: "flex", flexDirection: "column", boxShadow: "12px 0 48px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(240,230,208,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#F0E6D0", lineHeight: 1, margin: 0 }}>
                Conversations
              </h2>
              <p style={{ fontSize: 12, color: "rgba(240,230,208,0.38)", marginTop: 5 }}>
                {sessions.length} saved · {sessions.filter(s => s.pinned).length} pinned
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(240,230,208,0.06)", border: "1px solid rgba(240,230,208,0.1)", color: "rgba(240,230,208,0.5)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
            >×</button>
          </div>

          {/* New chat button */}
          <button
            onClick={() => { onNew(); onClose(); }}
            style={{ width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg, #DDB85C, #C9A24A)", border: "none", color: "#0A0806", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.18s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
          >
            <span style={{ fontSize: 15 }}>✦</span> New Conversation
          </button>

          {/* Search */}
          {sessions.length > 3 && (
            <input
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              style={{ marginTop: 10, width: "100%", padding: "8px 12px", borderRadius: 10, background: "rgba(240,230,208,0.06)", border: "1px solid rgba(240,230,208,0.1)", color: "#F0E6D0", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none" }}
            />
          )}
        </div>

        {/* Session list */}
        <div className="scr" style={{ flex: 1, padding: "10px 12px" }}>
          {sessions.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <p style={{ fontSize: 36, marginBottom: 14 }}>💬</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "rgba(240,230,208,0.38)", lineHeight: 1.6 }}>
                No conversations yet. Start chatting with your Sommelier.
              </p>
            </div>
          )}

          {pinned.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,162,74,0.55)", fontWeight: 600, padding: "4px 8px", marginBottom: 4 }}>Pinned</p>
              {pinned.map(s => (
                <SessionRow
                  key={s.id}
                  session={s}
                  isActive={s.id === activeId}
                  isEditing={editingId === s.id}
                  editTitle={editTitle}
                  confirmDelete={confirmDelete === s.id}
                  onSelect={() => { onSelect(s); onClose(); }}
                  onStartRename={() => startRename(s)}
                  onEditTitle={setEditTitle}
                  onCommitRename={() => commitRename(s.id)}
                  onPin={() => onPin(s.id)}
                  onDelete={() => setConfirm(s.id)}
                  onConfirmDelete={() => { onDelete(s.id); setConfirm(null); }}
                  onCancelDelete={() => setConfirm(null)}
                />
              ))}
            </div>
          )}

          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && <p style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,230,208,0.25)", fontWeight: 600, padding: "4px 8px", marginBottom: 4 }}>Recent</p>}
              {unpinned.map(s => (
                <SessionRow
                  key={s.id}
                  session={s}
                  isActive={s.id === activeId}
                  isEditing={editingId === s.id}
                  editTitle={editTitle}
                  confirmDelete={confirmDelete === s.id}
                  onSelect={() => { onSelect(s); onClose(); }}
                  onStartRename={() => startRename(s)}
                  onEditTitle={setEditTitle}
                  onCommitRename={() => commitRename(s.id)}
                  onPin={() => onPin(s.id)}
                  onDelete={() => setConfirm(s.id)}
                  onConfirmDelete={() => { onDelete(s.id); setConfirm(null); }}
                  onCancelDelete={() => setConfirm(null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(240,230,208,0.07)", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "rgba(240,230,208,0.2)", textAlign: "center" }}>
            Conversations saved locally in your browser
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Individual session row ──────────────────────────────────────────────── */
interface RowProps {
  session: ChatSession;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  confirmDelete: boolean;
  onSelect: () => void;
  onStartRename: () => void;
  onEditTitle: (v: string) => void;
  onCommitRename: () => void;
  onPin: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

function SessionRow({ session: s, isActive, isEditing, editTitle, confirmDelete, onSelect, onStartRename, onEditTitle, onCommitRename, onPin, onDelete, onConfirmDelete, onCancelDelete }: RowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 12, marginBottom: 4, transition: "background 0.15s", background: isActive ? "rgba(201,162,74,0.1)" : hovered ? "rgba(240,230,208,0.04)" : "transparent", border: isActive ? "1px solid rgba(201,162,74,0.22)" : "1px solid transparent" }}
    >
      {/* Delete confirm state */}
      {confirmDelete ? (
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 12, color: "rgba(240,230,208,0.7)", lineHeight: 1.4 }}>Delete this conversation? This can't be undone.</p>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onConfirmDelete} style={{ flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11, fontWeight: 600, background: "rgba(200,70,60,0.2)", border: "1px solid rgba(200,70,60,0.35)", color: "rgba(220,100,90,0.9)", cursor: "pointer" }}>Delete</button>
            <button onClick={onCancelDelete} style={{ flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11, background: "rgba(240,230,208,0.06)", border: "1px solid rgba(240,230,208,0.12)", color: "rgba(240,230,208,0.6)", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: "10px 12px", cursor: "pointer" }} onClick={onSelect}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            {/* Title + preview */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {isEditing ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={e => onEditTitle(e.target.value)}
                  onBlur={onCommitRename}
                  onKeyDown={e => { if (e.key === "Enter") onCommitRename(); if (e.key === "Escape") onCommitRename(); }}
                  onClick={e => e.stopPropagation()}
                  style={{ width: "100%", padding: "3px 6px", borderRadius: 6, background: "rgba(240,230,208,0.1)", border: "1px solid rgba(201,162,74,0.4)", color: "#F0E6D0", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none" }}
                />
              ) : (
                <p style={{ fontSize: 13, fontWeight: 500, color: isActive ? "#DDB85C" : "rgba(240,230,208,0.85)", margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.pinned && <span style={{ color: "#C9A24A", marginRight: 4, fontSize: 10 }}>📌</span>}
                  {s.title}
                </p>
              )}
              <p style={{ fontSize: 11, color: "rgba(240,230,208,0.35)", margin: "3px 0 0", lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.preview || "No messages yet"}</p>
              <p style={{ fontSize: 10, color: "rgba(240,230,208,0.22)", margin: "4px 0 0" }}>{relativeTime(s.updatedAt)} · {s.messageCount} msg{s.messageCount !== 1 ? "s" : ""}</p>
            </div>

            {/* Action icons — show on hover */}
            {hovered && !isEditing && (
              <div style={{ display: "flex", gap: 3, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <IconBtn title={s.pinned ? "Unpin" : "Pin"} onClick={onPin}>{s.pinned ? "📌" : "📍"}</IconBtn>
                <IconBtn title="Rename" onClick={onStartRename}>✏️</IconBtn>
                <IconBtn title="Delete" onClick={onDelete}>🗑️</IconBtn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(240,230,208,0.07)", border: "1px solid rgba(240,230,208,0.1)", color: "rgba(240,230,208,0.6)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(240,230,208,0.14)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(240,230,208,0.07)"}
    >
      {children}
    </button>
  );
}
