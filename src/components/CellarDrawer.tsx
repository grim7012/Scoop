"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Flavor } from "@/lib/flavors";

interface Props {
  cellar: Flavor[];
  onClose: () => void;
  onRemove: (f: Flavor) => void;
  onAsk: (name: string) => void;
}

export default function CellarDrawer({ cellar, onClose, onRemove, onAsk }: Props) {
  return (
    <AnimatePresence>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
          cursor: "pointer",
        }}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        className="drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(400px, 85vw)",
          zIndex: 210,
          background: "linear-gradient(145deg, rgba(10,8,6,0.98), rgba(5,5,5,0.98))",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(247,231,206,0.12)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
        }}
      >
        <style jsx>{`
          .drawer-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(247,231,206,0.3) transparent;
            overflow-y: auto;
            flex: 1;
            padding: 0 20px 20px;
          }
          
          .drawer-scroll::-webkit-scrollbar {
            width: 4px;
          }
          
          .drawer-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .drawer-scroll::-webkit-scrollbar-thumb {
            background: rgba(247,231,206,0.3);
            border-radius: 4px;
          }
          
          .serif {
            font-family: 'Cormorant Garamond', serif;
          }
          
          .label {
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(247,231,206,0.5);
            font-weight: 400;
          }
          
          @media (max-width: 640px) {
            .drawer-scroll {
              padding: 0 16px 16px;
            }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            padding: "24px 24px 20px",
            borderBottom: "1px solid rgba(247,231,206,0.08)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(247,231,206,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 22 }}>🏛️</span>
              </div>
              <h2
                className="serif"
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  color: "#F7E7CE",
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
              >
                My Cellar
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {cellar.length === 0
                  ? "Your collection awaits"
                  : `${cellar.length} flavor${cellar.length !== 1 ? "s" : ""} saved`}
              </p>
            </div>
            
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(247,231,206,0.15)",
                color: "#F7E7CE",
                cursor: "pointer",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* List */}
        <div className="drawer-scroll">
          {cellar.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: "clamp(60px, 15vh, 100px)",
              }}
            >
              <p style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🏛️</p>
              <p
                className="serif"
                style={{
                  fontSize: 18,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                  maxWidth: 240,
                  margin: "0 auto",
                }}
              >
                Your cellar awaits its first selection.
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 10,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Ask me for a recommendation
              </p>
            </div>
          ) : (
            cellar.map((f, index) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(247,231,206,0.08)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(247,231,206,0.03)";
                  e.currentTarget.style.paddingLeft = "8px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                {/* Swatch */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `linear-gradient(145deg, ${f.hex_color}aa, ${f.hex_color})`,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    boxShadow: `0 2px 8px ${f.hex_color}33`,
                  }}
                >
                  {f.image_emoji}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="serif"
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "#F7E7CE",
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}
                  >
                    {f.flavor_name}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: "rgba(247,231,206,0.1)",
                        color: "rgba(247,231,206,0.8)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {f.mood_tag}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.6)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {f.texture}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Inter', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span>🍷</span> {f.pairings?.beverage || "Not specified"}
                  </p>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    flexShrink: 0,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      onAsk(f.flavor_name);
                      onClose();
                    }}
                    style={{
                      fontSize: 11,
                      padding: "5px 12px",
                      borderRadius: 20,
                      background: "rgba(247,231,206,0.1)",
                      border: "1px solid rgba(247,231,206,0.2)",
                      color: "#F7E7CE",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(247,231,206,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(247,231,206,0.1)";
                    }}
                  >
                    Ask
                  </button>
                  
                  <button
                    onClick={() => onRemove(f)}
                    style={{
                      fontSize: 11,
                      padding: "5px 12px",
                      borderRadius: 20,
                      background: "transparent",
                      border: "1px solid rgba(200,80,60,0.3)",
                      color: "rgba(200,120,100,0.8)",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(200,80,60,0.1)";
                      e.currentTarget.style.borderColor = "rgba(200,80,60,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(200,80,60,0.3)";
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tasting flight CTA */}
        {cellar.length >= 2 && (
          <div
            style={{
              padding: "16px 20px 24px",
              borderTop: "1px solid rgba(247,231,206,0.08)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => {
                onAsk(
                  `I've saved these to my cellar: ${cellar
                    .map((f) => f.flavor_name)
                    .join(", ")}. Can you create a tasting flight order for me?`
                );
                onClose();
              }}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 24,
                fontSize: 13,
                fontWeight: 500,
                background: "linear-gradient(135deg, #F7E7CE, #B8860B)",
                border: "none",
                color: "#050505",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(247,231,206,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span>✦</span>
                Create Tasting Flight
                <span>→</span>
              </span>
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                marginTop: 8,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Curated tasting sequence • Expert pairings
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}