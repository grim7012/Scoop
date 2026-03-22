// "use client";
// import { useState, useEffect } from "react";

// interface TooltipProps { text: string; children: React.ReactNode; }

// export function Tooltip({ text, children }: TooltipProps) {
//   return (
//     <div className="tooltip-wrap" style={{ display:"inline-flex" }}>
//       {children}
//       <span className="tooltip">{text}</span>
//     </div>
//   );
// }

// // First-time onboarding hints that auto-dismiss
// const HINTS = [
//   { id:"chips",   text:"Tap any suggestion chip to get an instant recommendation" },
//   { id:"cards",   text:"Click a flavor card to explore its full sensory profile" },
//   { id:"cellar",  text:"Save your favourites to the Cellar and create a tasting flight" },
// ];

// export function OnboardingHints() {
//   const [shown, setShown] = useState<string[]>([]);
//   const [dismissed, setDismissed] = useState(false);

//   useEffect(() => {
//     try {
//       if (localStorage.getItem("scoop-onboarded")) { setDismissed(true); return; }
//     } catch {}
//     // Show hints one at a time, 3s apart
//     HINTS.forEach((h, i) => {
//       setTimeout(() => setShown(prev => [...prev, h.id]), i * 3200);
//     });
//     setTimeout(() => {
//       setDismissed(true);
//       try { localStorage.setItem("scoop-onboarded", "1"); } catch {}
//     }, HINTS.length * 3200 + 4000);
//   }, []);

//   if (dismissed) return null;
//   const activeHint = HINTS.find(h => shown.includes(h.id) && shown[shown.length-1] === h.id);
//   if (!activeHint) return null;

//   return (
//     <div
//       style={{ position:"fixed", bottom:120, left:"50%", transform:"translateX(-50%)", zIndex:300, pointerEvents:"none" }}
//       className="fu"
//     >
//       <div style={{ padding:"10px 20px", borderRadius:99, background:"var(--ink)", color:"var(--ivory)", fontSize:13, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(26,18,10,0.25)", display:"flex", alignItems:"center", gap:8 }}>
//         <span style={{ color:"var(--gold)" }}>💡</span>
//         {activeHint.text}
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps { 
  text: string; 
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({ text, children, position = "top", delay = 0 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 };
      case "bottom":
        return { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8 };
      case "left":
        return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 };
      case "right":
        return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 };
      default:
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 };
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case "top":
        return { top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(0,0,0,0.9)" };
      case "bottom":
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "6px solid rgba(0,0,0,0.9)" };
      case "left":
        return { left: "100%", top: "50%", transform: "translateY(-50%)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "6px solid rgba(0,0,0,0.9)" };
      case "right":
        return { right: "100%", top: "50%", transform: "translateY(-50%)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "6px solid rgba(0,0,0,0.9)" };
      default:
        return { top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(0,0,0,0.9)" };
    }
  };

  return (
    <div
      className="tooltip-wrap"
      style={{ display: "inline-flex", position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
            transition={{ duration: 0.2, type: "spring", damping: 20 }}
            style={{
              position: "absolute",
              zIndex: 1000,
              pointerEvents: "none",
              ...getPositionStyles(),
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.95)",
                backdropFilter: "blur(12px)",
                color: "#F7E7CE",
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                border: "1px solid rgba(247,231,206,0.2)",
                letterSpacing: "0.3px",
              }}
            >
              {text}
            </div>
            <div
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                ...getArrowStyles(),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// First-time onboarding hints that auto-dismiss with premium animations
const HINTS = [
  { 
    id: "chips", 
    text: "Tap any suggestion chip to get an instant recommendation",
    icon: "💡",
    highlight: "chip"
  },
  { 
    id: "cards", 
    text: "Click a flavor card to explore its full sensory profile",
    icon: "🍦",
    highlight: "flavor-card"
  },
  { 
    id: "cellar", 
    text: "Save your favourites to the Cellar and create a tasting flight",
    icon: "🏛️",
    highlight: "cellar-btn"
  },
];

export function OnboardingHints() {
  const [shown, setShown] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("scoop-onboarded")) { 
        setDismissed(true); 
        return;
      }
    } catch {}

    // Show hints sequentially with progress tracking
    let currentIndex = 0;
    
    const showNextHint = () => {
      if (currentIndex < HINTS.length) {
        setShown(prev => [...prev, HINTS[currentIndex].id]);
        setCurrentHintIndex(currentIndex);
        setProgress(0);
        
        // Animate progress bar
        const startTime = Date.now();
        const duration = 3200;
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / duration) * 100, 100);
          setProgress(newProgress);
          if (newProgress >= 100) {
            clearInterval(interval);
          }
        }, 16);
        
        currentIndex++;
        setTimeout(showNextHint, duration);
      } else {
        // All hints shown, dismiss after a moment
        setTimeout(() => {
          setDismissed(true);
          try { localStorage.setItem("scoop-onboarded", "1"); } catch {}
        }, 1000);
      }
    };
    
    showNextHint();
  }, []);

  const dismissAll = () => {
    setDismissed(true);
    try { localStorage.setItem("scoop-onboarded", "1"); } catch {}
  };

  const activeHint = HINTS[currentHintIndex];
  const isActive = shown.includes(activeHint?.id) && shown[shown.length - 1] === activeHint?.id;

  if (dismissed || !activeHint || !isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: "fixed",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 300,
          pointerEvents: "auto",
          maxWidth: "90vw",
        }}
      >
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
          }
          
          .highlight-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>
        
        <div
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(10,8,6,0.95))",
            backdropFilter: "blur(20px)",
            borderRadius: 48,
            border: "1px solid rgba(247,231,206,0.2)",
            boxShadow: "0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(247,231,206,0.1)",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* Progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 3,
              background: "linear-gradient(90deg, #F7E7CE, #B8860B)",
              borderRadius: 3,
            }}
          />
          
          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {/* Icon with pulse animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "linear-gradient(135deg, rgba(247,231,206,0.2), rgba(184,134,11,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                border: "1px solid rgba(247,231,206,0.3)",
              }}
            >
              {activeHint.icon}
            </motion.div>
            
            {/* Text content */}
            <div style={{ flex: 1 }}>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontSize: "clamp(13px, 3vw, 14px)",
                  color: "#FFFFFF",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {activeHint.text}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: 10,
                  color: "rgba(247,231,206,0.6)",
                  fontFamily: "'Inter', sans-serif",
                  margin: "4px 0 0",
                  letterSpacing: "0.3px",
                }}
              >
                Tip {currentHintIndex + 1} of {HINTS.length}
              </motion.p>
            </div>
            
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissAll}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(247,231,206,0.3)",
                  borderRadius: 30,
                  padding: "6px 16px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(247,231,206,0.8)",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                Skip
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissAll}
                style={{
                  background: "linear-gradient(135deg, #F7E7CE, #B8860B)",
                  border: "none",
                  borderRadius: 30,
                  padding: "6px 20px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#050505",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Got it
              </motion.button>
            </div>
          </div>
          
          {/* Dots indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 16,
              display: "flex",
              gap: 6,
            }}
          >
            {HINTS.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: currentHintIndex === index ? 1.2 : 1,
                  opacity: currentHintIndex === index ? 1 : 0.4,
                }}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: currentHintIndex === index ? "#F7E7CE" : "rgba(247,231,206,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Additional floating hint component for contextual tips
interface FloatingHintProps {
  text: string;
  targetId: string;
  position?: "top" | "bottom" | "left" | "right";
  onDismiss?: () => void;
}

export function FloatingHint({ text, targetId, position = "top", onDismiss }: FloatingHintProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (target) {
      setTargetRect(target.getBoundingClientRect());
    }
  }, [targetId]);

  const getPositionStyles = () => {
    if (!targetRect) return { display: "none" };
    
    switch (position) {
      case "top":
        return {
          bottom: window.innerHeight - targetRect.top + 10,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          top: targetRect.bottom + 10,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          right: window.innerWidth - targetRect.left + 10,
          top: targetRect.top + targetRect.height / 2,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          left: targetRect.right + 10,
          top: targetRect.top + targetRect.height / 2,
          transform: "translateY(-50%)",
        };
      default:
        return {
          bottom: window.innerHeight - targetRect.top + 10,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        style={{
          position: "fixed",
          zIndex: 1000,
          ...getPositionStyles(),
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(12px)",
            padding: "8px 16px",
            borderRadius: 12,
            border: "1px solid rgba(247,231,206,0.2)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 14 }}>💡</span>
          <span style={{ fontSize: 12, color: "#F7E7CE", fontFamily: "'Inter', sans-serif" }}>
            {text}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(247,231,206,0.6)",
              fontSize: 14,
              cursor: "pointer",
              padding: 0,
              marginLeft: 4,
            }}
          >
            ×
          </motion.button>
        </div>
        <div
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            ...(position === "top" && {
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(0,0,0,0.95)",
            }),
            ...(position === "bottom" && {
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "6px solid rgba(0,0,0,0.95)",
            }),
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}