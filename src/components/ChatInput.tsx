
"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading,
  placeholder = "Ask your Sommelier…",
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 120) + "px";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) onSend();
    }
  };

  const canSend = value.trim().length > 0 && !loading;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        padding: "10px 10px 10px 16px",
        borderRadius: 99, // fully curved / pill shape
        background: "var(--raised, #1C1814)",
        border: `1px solid ${focused ? "var(--gold-border, rgba(200,169,110,0.28))" : "var(--line, rgba(255,255,255,0.07))"}`,
        transition: "border-color 0.18s ease",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Textarea */}
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={1}
        disabled={loading}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          resize: "none",
          background: "transparent",
          color: "var(--text, #EDE8DF)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          lineHeight: 1.55,
          padding: "2px 0",
          minHeight: 22,
          maxHeight: 120,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      />

      {/* Enter / send icon button */}
      <button
        onClick={onSend}
        disabled={!canSend}
        title="Send (Enter)"
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `1px solid ${canSend ? "var(--gold-border, rgba(200,169,110,0.28))" : "var(--line, rgba(255,255,255,0.07))"}`,
          background: canSend ? "var(--gold-dim, rgba(200,169,110,0.12))" : "transparent",
          color: canSend ? "var(--gold, #C8A96E)" : "var(--text-dim, rgba(237,232,223,0.18))",
          cursor: canSend ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.16s ease",
          padding: 0,
        }}
        onMouseEnter={e => {
          if (!canSend) return;
          const el = e.currentTarget as HTMLElement;
          el.style.background = "var(--gold, #C8A96E)";
          el.style.color = "var(--bg, #0A0908)";
          el.style.borderColor = "var(--gold, #C8A96E)";
        }}
        onMouseLeave={e => {
          if (!canSend) return;
          const el = e.currentTarget as HTMLElement;
          el.style.background = "var(--gold-dim, rgba(200,169,110,0.12))";
          el.style.color = "var(--gold, #C8A96E)";
          el.style.borderColor = "var(--gold-border, rgba(200,169,110,0.28))";
        }}
      >
        {loading ? (
          // Three tiny dots while loading
          <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[0, 0.15, 0.3].map((d, i) => (
              <span
                key={i}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "currentColor",
                  display: "inline-block",
                  animation: `dotPulse 1.2s ease-in-out ${d}s infinite`,
                }}
              />
            ))}
          </span>
        ) : (
          // Enter / return key icon
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 3v4a2 2 0 0 1-2 2H3.5M3.5 9 1 6.5 3.5 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}