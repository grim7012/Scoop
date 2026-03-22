"use client";

const FILTERS = [
  { key: "vegan",        label: "Vegan" },
  { key: "gluten_free",  label: "Gluten-Free" },
  { key: "dairy_free",   label: "Dairy-Free" },
  { key: "nut_free",     label: "Nut-Free" },
  { key: "alcohol_free", label: "Alcohol-Free" },
  { key: "egg_free",     label: "Egg-Free" },
  { key: "low_sugar",    label: "Low Sugar" },
  { key: "soy_free",     label: "Soy-Free" },
  { key: "halal",        label: "Halal" },
  { key: "kosher",       label: "Kosher" },
];

interface Props {
  active: string[];
  onChange: (keys: string[]) => void;
}

export default function DietaryFilter({ active, onChange }: Props) {
  const toggle = (key: string) => {
    onChange(active.includes(key) ? active.filter(k => k !== key) : [...active, key]);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {FILTERS.map(f => {
        const on = active.includes(f.key);
        return (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            style={{
              padding: "5px 11px",
              borderRadius: 5,
              fontSize: 11,
              fontWeight: on ? 600 : 400,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.07em",
              cursor: "pointer",
              background: on ? "var(--gold-dim, rgba(200,169,110,0.12))" : "transparent",
              border: `1px solid ${on ? "var(--gold-border, rgba(200,169,110,0.28))" : "var(--line, rgba(255,255,255,0.07))"}`,
              color: on ? "var(--gold, #C8A96E)" : "var(--text-soft, rgba(237,232,223,0.38))",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: on ? 5 : 0,
            }}
            onMouseEnter={e => {
              if (!on) {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--gold-border, rgba(200,169,110,0.28))";
                el.style.color = "var(--text-mid, rgba(237,232,223,0.55))";
              }
            }}
            onMouseLeave={e => {
              if (!on) {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--line, rgba(255,255,255,0.07))";
                el.style.color = "var(--text-soft, rgba(237,232,223,0.38))";
              }
            }}
          >
            {on && (
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold, #C8A96E)", display: "inline-block", flexShrink: 0 }} />
            )}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}