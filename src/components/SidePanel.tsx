
"use client";
import { useState, useEffect } from "react";
import { Flavor } from "@/lib/flavors";

interface Props {
  activeFlavor: Flavor | null;
  cellarIds: string[];
  onSave: (f: Flavor) => void;
  onAsk: (text: string) => void;
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 150); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "var(--text-mid)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em" }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'DM Mono',monospace" }}>{value}</span>
      </div>
      <div style={{ height: 2, background: "rgba(237,232,223,0.07)" }}>
        <div className="bar" style={{ height: "100%", width: `${w}%`, background: "var(--gold)" }} />
      </div>
    </div>
  );
}

export default function SidePanel({ activeFlavor, cellarIds, onSave, onAsk }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const f = activeFlavor;
  const isSaved = f ? cellarIds.includes(f.id) : false;

  useEffect(() => { setImgErr(false); }, [f?.id]);

  /* ── Empty state ── */
  if (!f) {
    return (
      <aside style={{ width: 260, flexShrink: 0, borderLeft: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--panel)", overflow: "hidden" }}>
        <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--line)" }}>
          <p className="label">Flavor Profile</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 24px", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid var(--text-dim)" }} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 400, color: "var(--text-soft)", lineHeight: 1.6, fontStyle: "italic" }}>
            Select a flavor or ask for a recommendation to see its profile
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside style={{ width: 260, flexShrink: 0, borderLeft: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--panel)", overflow: "hidden" }}>

      {/* Label bar */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--line)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p className="label">Flavor Profile</p>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: f.hex_color }} />
      </div>

      <div className="scr" style={{ flex: 1 }}>
        {/* Image */}
        <div style={{ height: 100, position: "relative", overflow: "hidden", background: f.hex_color + "22", borderBottom: "1px solid var(--line)" }}>
          {f.image_url && !imgErr && (
            <img
              src={f.image_url}
              alt={f.flavor_name}
              onError={() => setImgErr(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, filter: "grayscale(20%)" }}
            />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(21,18,16,0.85))" }} />
          <div style={{ position: "absolute", bottom: 12, left: 16 }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: "var(--text)", lineHeight: 1.2 }}>{f.flavor_name}</p>
          </div>
        </div>

        <div style={{ padding: "14px 16px" }}>
          {/* Tags */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
            <Tag>{f.mood_tag}</Tag>
            <Tag>{f.pairing_logic}</Tag>
          </div>

          {/* Sommelier note */}
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontStyle: "italic", color: "var(--text-mid)", lineHeight: 1.7, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
            "{f.sommelier_note}"
          </p>

          {/* Metrics */}
          <div style={{ marginBottom: 16 }}>
            <p className="label" style={{ marginBottom: 12 }}>Profile</p>
            <MetricBar label="Sweetness" value={f.metrics.sweetness} />
            <MetricBar label="Richness"  value={f.metrics.richness} />
            <MetricBar label="Earthiness" value={f.metrics.umami} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <span style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em" }}>Intensity</span>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 3, borderRadius: 0, background: i < f.metrics.intensity ? "var(--gold)" : "rgba(237,232,223,0.1)" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Pairings */}
          <div style={{ marginBottom: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <p className="label" style={{ marginBottom: 12 }}>Pairings</p>
            <PairRow label="Drink" value={f.pairings.beverage} />
            <PairRow label="Top"   value={f.pairings.topping} />
            <PairRow label="Side"  value={f.pairings.dessert} />
          </div>

          {/* Serve temp */}
          <div style={{ marginBottom: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <p className="label" style={{ marginBottom: 10 }}>Serve</p>
            <p style={{ fontSize: 12, color: "var(--text-mid)", fontFamily: "'DM Sans',sans-serif" }}>{f.serve_temp}</p>
          </div>

          {/* Avoid with */}
          {f.avoid_with.length > 0 && (
            <div style={{ padding: "10px 12px", borderRadius: 6, background: "var(--danger)", border: "1px solid var(--danger-border)", marginBottom: 14 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--danger-text)", fontFamily: "'DM Mono',monospace", marginBottom: 5 }}>Avoid with</p>
              <p style={{ fontSize: 11, color: "rgba(220,180,170,0.65)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{f.avoid_with.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--line)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 7 }}>
        <button
          onClick={() => onAsk(`Tell me more about ${f.flavor_name}`)}
          style={{ width: "100%", padding: "9px 0", borderRadius: 6, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", background: "var(--gold-dim)", border: "1px solid var(--gold-border)", color: "var(--gold)", cursor: "pointer", transition: "all 0.16s", letterSpacing: "0.02em" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(200,169,110,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-dim)"; }}
        >
          Ask about this
        </button>
        <button
          onClick={() => onSave(f)}
          style={{ width: "100%", padding: "9px 0", borderRadius: 6, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.16s", background: isSaved ? "var(--gold-dim)" : "var(--gold)", border: isSaved ? "1px solid var(--gold-border)" : "none", color: isSaved ? "var(--gold)" : "var(--bg)" }}
        >
          {isSaved ? "Saved to Cellar" : "Save to Cellar"}
        </button>
      </div>
    </aside>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: "rgba(237,232,223,0.05)", border: "1px solid var(--line)", color: "var(--text-soft)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em" }}>
      {children}
    </span>
  );
}

function PairRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "baseline" }}>
      <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", minWidth: 30, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: "var(--text-mid)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}