// ─── AUTO-SAVE HOOK ─────────────────────────────────────────────────
// Saves form state to sessionStorage with visual "Draft saved ✓" feedback
import { useState, useEffect, useCallback, useRef } from "react";
import S from "../constants/styles";

export function useAutoSave(key, initialState) {
  const [state, setState] = useState(() => {
    try { const saved = sessionStorage.getItem(key); return saved ? JSON.parse(saved) : initialState; } catch { return initialState; }
  });
  const [showSaved, setShowSaved] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem(key, JSON.stringify(state)); } catch {}
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowSaved(true);
    timeoutRef.current = setTimeout(() => setShowSaved(false), 2000);
  }, [key, state]);

  const clearSave = useCallback(() => {
    try { sessionStorage.removeItem(key); } catch {}
  }, [key]);

  return [state, setState, showSaved, clearSave];
}

// Visual indicator component
export function AutoSaveIndicator({ visible }) {
  return (
    <div style={{
      position: "fixed", top: 80, right: 20, zIndex: 9990,
      padding: "8px 16px", borderRadius: 8,
      background: S.emeraldLight, border: "1px solid " + S.emerald + "40",
      display: "flex", alignItems: "center", gap: 6,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-10px)",
      transition: "all 0.3s ease", pointerEvents: "none",
    }}>
      <span style={{ color: S.emerald, fontSize: 12 }}>✓</span>
      <span style={{ fontFamily: S.body, fontSize: 11, color: S.emeraldDark, fontWeight: 600 }}>Draft saved</span>
    </div>
  );
}
