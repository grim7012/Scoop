
"use client";
import { useState, useEffect } from "react";

export interface CardData {
  name: string;
  emoji: string;
  hex: string;
  tagline: string;
  vibe: string;
  texture: string;
  serveTemp: string;
  bestWith: string;
  topWith: string;
  dietary: string[];
  intensityLabel: string;
  imageUrl?: string;
}

const DIET_LABEL: Record<string, string> = {
  vegan: "Vegan",
  "gluten-free": "GF",
  gluten_free: "GF",
  "dairy-free": "DF",
  dairy_free: "DF",
  "nut-free": "NF",
  nut_free: "NF",
  "alcohol-free": "AF",
  alcohol_free: "AF",
  "egg-free": "EF",
};

function buildAskPrompt(card: CardData): string {
  const prompts = [
    `What makes ${card.name} unique compared to similar flavors, and what food occasion suits it best?`,
    `I'm curious about the flavour science behind ${card.name} — can you tell me more?`,
    `If I enjoy ${card.name}, what other flavors would you recommend and why?`,
    `How was ${card.name} crafted and what makes it special for ${card.vibe?.toLowerCase() || "this"} occasions?`,
    `Walk me through the sensory experience of eating ${card.name} from first bite to finish.`,
  ];
  return prompts[card.name.length % prompts.length];
}

interface Props {
  card: CardData;
  isSaved?: boolean;
  onSave?: () => void;
  onAsk?: (prompt: string) => void;
  onImageClick?: () => void;
  delay?: number;
}

export default function FlavorCard({ card, isSaved = false, onSave, onAsk, onImageClick, delay = 0 }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setImgErr(false); }, [card.name]);

  // Responsive breakpoint detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 560);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.();
    if (!isSaved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    }
  };

  const handleAsk = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAsk?.(buildAskPrompt(card));
  };

  // ── Shared image section ─────────────────────────────────────────
  const imageSection = (
    <div
      onClick={onImageClick}
      style={{
        // Mobile: full-width top image bar (150px tall)
        // Desktop: right-side column (130px wide)
        ...(isMobile
          ? { width: "100%", height: 150, flexShrink: 0 }
          : { width: "clamp(90px,22%,130px)", minWidth: "clamp(90px,22%,130px)", flexShrink: 0 }
        ),
        position: "relative",
        overflow: "hidden",
        background: card.hex + "33",
        cursor: onImageClick ? "pointer" : "default",
        order: isMobile ? -1 : 1, // image on top for mobile, right side for desktop
      }}
      title={onImageClick ? `View ${card.name} profile` : undefined}
    >
      {card.imageUrl && !imgErr && (
        <img
          src={card.imageUrl}
          alt={card.name}
          onError={() => setImgErr(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, filter: "grayscale(15%)" }}
        />
      )}

      {/* Blend overlay — bottom for mobile (fade to card bg below), left for desktop */}
      <div style={{
        position: "absolute", inset: 0,
        background: isMobile
          ? "linear-gradient(to bottom, transparent 35%, var(--card,#201C17) 100%)"
          : "linear-gradient(to right, var(--card,#201C17) 0%, transparent 30%)",
      }} />
      {/* Subtle dark vignette */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />

      {/* Fallback — accent bar */}
      {(imgErr || !card.imageUrl) && (
        <div style={{ position: "absolute", inset: 0, background: card.hex + "22" }}>
          <div style={{
            position: "absolute",
            ...(isMobile
              ? { bottom: 0, left: 0, right: 0, height: 3 }
              : { left: 0, top: 0, bottom: 0, width: 3 }),
            background: card.hex,
          }} />
        </div>
      )}

      {/* Color dot */}
      <div style={{ position: "absolute", bottom: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: card.hex, boxShadow: `0 0 10px ${card.hex}88` }} />

      {/* View hint overlay on hover */}
      {onImageClick && (
        <div
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.18s", background: "rgba(0,0,0,0.28)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
        >
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(237,232,223,0.95)", padding: "4px 10px", background: "rgba(0,0,0,0.55)", borderRadius: 4, backdropFilter: "blur(4px)" }}>
            View profile
          </span>
        </div>
      )}
    </div>
  );

  // ── Content section ──────────────────────────────────────────────
  const contentSection = (
    <div style={{ flex: 1, padding: isMobile ? "14px 14px 16px" : "clamp(12px,3vw,18px)", display: "flex", flexDirection: "column", minWidth: 0, order: 0 }}>

      {/* Name + intensity badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 18 : "clamp(16px,2.5vw,20px)", fontWeight: 500, color: "var(--text, #EDE8DF)", margin: 0, lineHeight: 1.2, flex: 1 }}>
          {card.name}
        </h3>
        {card.intensityLabel && (
          <span style={{ flexShrink: 0, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold, #C8A96E)", padding: "2px 6px", border: "1px solid var(--gold-border, rgba(200,169,110,0.22))", borderRadius: 4 }}>
            {card.intensityLabel}
          </span>
        )}
      </div>

      {/* Tagline */}
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 14 : "clamp(13px,2vw,15px)", fontStyle: "italic", color: "var(--text-mid, rgba(237,232,223,0.55))", margin: "0 0 12px", lineHeight: 1.5 }}>
        {card.tagline}
      </p>

      {/* Info grid — 2 cols on desktop, 1 col on mobile */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(min(160px,100%),1fr))",
        gap: isMobile ? "8px 12px" : "5px clamp(10px,3vw,20px)",
        marginBottom: 12,
        flex: 1,
      }}>
        <InfoRow label="Pair with" value={card.bestWith} />
        <InfoRow label="Top with"  value={card.topWith} />
        <InfoRow label="Serve"     value={card.serveTemp} />
        <InfoRow label="Texture"   value={card.texture} />
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12, alignItems: "center" }}>
        {card.vibe && <Tag>{card.vibe}</Tag>}
        {card.dietary?.slice(0, 3).map(d => <Tag key={d} muted>{DIET_LABEL[d] ?? d}</Tag>)}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 7, flexWrap: isMobile ? "nowrap" : "wrap" }}>
        <Btn onClick={onAsk ? handleAsk : undefined} variant="ghost" fullWidth={isMobile}>Ask Scoop</Btn>
        <Btn onClick={handleSave} variant={justSaved ? "saved" : isSaved ? "outline" : "primary"} fullWidth={isMobile}>
          {justSaved ? "Saved" : isSaved ? "In Cellar" : "Save"}
        </Btn>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        minWidth: 0,
        borderRadius: 10,
        border: "1px solid var(--line, rgba(255,255,255,0.07))",
        background: "var(--card, #201C17)",
        overflow: "hidden",
        animation: `msgIn 0.34s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        transition: "border-color 0.18s ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-border, rgba(200,169,110,0.22))"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line, rgba(255,255,255,0.07))"; }}
    >
      {imageSection}
      {contentSection}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "clamp(8px,1.2vw,9px)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold,#C8A96E)", lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(11px,1.8vw,13px)", color: "var(--text-mid,rgba(237,232,223,0.55))", lineHeight: 1.35 }}>
        {value}
      </span>
    </div>
  );
}

function Tag({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "clamp(8px,1.2vw,9px)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, border: "1px solid", borderColor: muted ? "var(--line)" : "var(--gold-border)", background: muted ? "transparent" : "var(--gold-dim)", color: muted ? "var(--text-soft)" : "var(--gold)" }}>
      {children}
    </span>
  );
}

type BtnVariant = "ghost" | "primary" | "outline" | "saved";

function Btn({ children, onClick, variant, fullWidth }: { children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; variant: BtnVariant; fullWidth?: boolean }) {
  const base: React.CSSProperties = {
    flex: fullWidth ? 1 : undefined,
    minWidth: fullWidth ? 0 : "clamp(70px,14vw,110px)",
    padding: "clamp(7px,1.5vw,9px) clamp(10px,2vw,14px)",
    borderRadius: 6,
    fontSize: "clamp(11px,1.5vw,12px)",
    fontWeight: 500,
    fontFamily: "'DM Sans',sans-serif",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.16s ease",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap" as const,
  };
  const styles: Record<BtnVariant, React.CSSProperties> = {
    ghost:   { background: "transparent", border: "1px solid var(--line)", color: "var(--text-mid)" },
    primary: { background: "var(--gold)", border: "none", color: "var(--bg,#0A0908)" },
    outline: { background: "var(--gold-dim)", border: "1px solid var(--gold-border)", color: "var(--gold)" },
    saved:   { background: "rgba(70,160,60,0.12)", border: "1px solid rgba(70,160,60,0.3)", color: "rgba(100,200,80,0.9)" },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...styles[variant] }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        if (variant === "ghost")   { el.style.borderColor = "var(--gold-border)"; el.style.color = "var(--text)"; }
        if (variant === "primary") { el.style.opacity = "0.88"; }
        if (variant === "outline") { el.style.background = "rgba(200,169,110,0.2)"; }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        if (variant === "ghost")   { el.style.borderColor = "var(--line)"; el.style.color = "var(--text-mid)"; }
        if (variant === "primary") { el.style.opacity = "1"; }
        if (variant === "outline") { el.style.background = "var(--gold-dim)"; }
      }}
    >
      {children}
    </button>
  );
}