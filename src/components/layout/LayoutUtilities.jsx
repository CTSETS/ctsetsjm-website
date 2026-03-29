import { useState, useEffect } from "react";
import S from "../../constants/styles";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from "../../constants/config";

// Context-aware WhatsApp button — pre-fills message based on current page
export function WhatsAppBtn({ currentPage }) {
  const [open, setOpen] = useState(false);
  const msg = WHATSAPP_MESSAGES[currentPage] || WHATSAPP_MESSAGES.default;
  return (
    <div style={{ position: "fixed", bottom: 80, left: 24, zIndex: 9997, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      {open && <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "14px 0", minWidth: 250, marginBottom: 4 }}>
        <div style={{ padding: "6px 18px 10px", fontSize: 11, fontWeight: 700, color: "#666", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #f0f0f0" }}>Chat with us on WhatsApp</div>
        <a href={"https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0 }}>💬</div>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>876-381-9771</div><div style={{ fontSize: 11, color: S.gray, fontFamily: "sans-serif", marginTop: 2 }}>Tap to chat</div></div>
        </a>
      </div>}
      <button onClick={() => setOpen(!open)} aria-label="Chat on WhatsApp" style={{ width: 56, height: 56, borderRadius: "50%", background: "#25D366", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", cursor: "pointer", transition: "transform 0.2s", color: "#fff", fontSize: 22 }}>{open ? "✕" : <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}</button>
    </div>
  );
}

export function ScrollNav() {
  const [showUp, setShowUp] = useState(false);
  useEffect(() => { const onScroll = () => setShowUp(window.scrollY > 300); window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => window.removeEventListener("scroll", onScroll); }, []);
  if (!showUp) return null;
  return <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" style={{ position: "fixed", right: 24, bottom: 96, width: 44, height: 44, borderRadius: 22, background: S.navy, border: "2px solid " + S.gold, color: S.gold, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 9996, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9, transition: "opacity 0.3s" }}>↑</button>;
}

export function AnnouncementBar({ setPage }) {
  const [dismissed, setDismissed] = useState(() => { try { return sessionStorage.getItem("cts_ann_off") === "1"; } catch { return false; } });
  if (dismissed) return null;
  return (
    <div onClick={() => setPage?.("Apply")} role="banner" style={{ background: `linear-gradient(135deg, ${S.coral}, ${S.gold})`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", cursor: "pointer", position: "relative", zIndex: 1001 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, textAlign: "center" }}>🎓 NEXT TERM — ENROL NOW — Multiple Programmes, 100% Online, From J$10,000 <span style={{ textDecoration: "underline" }}>Apply Now →</span></span>
      <button onClick={e => { e.stopPropagation(); try { sessionStorage.setItem("cts_ann_off", "1"); } catch {} setDismissed(true); }} aria-label="Dismiss" style={{ background: "rgba(1,30,64,0.1)", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: S.navy, fontWeight: 700, flexShrink: 0 }}>✕</button>
    </div>
  );
}

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => { const off = () => setOffline(true); const on = () => setOffline(false); window.addEventListener("offline", off); window.addEventListener("online", on); return () => { window.removeEventListener("offline", off); window.removeEventListener("online", on); }; }, []);
  if (!offline) return null;
  return <div role="alert" style={{ background: S.rose, padding: "10px 20px", textAlign: "center", color: "#fff", fontSize: 13, fontFamily: S.body, fontWeight: 600, position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000 }}>⚠️ You are offline. Some features may not work.</div>;
}

export function CookieBanner({ setPage }) {
  const [visible, setVisible] = useState(() => { try { return !localStorage.getItem("cts_cookie"); } catch { return true; } });
  if (!visible) return null;
  const dismiss = (c) => { try { localStorage.setItem("cts_cookie", c); } catch {} setVisible(false); };
  return <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: S.navy, borderTop: "2px solid " + S.gold, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", zIndex: 9998 }}><p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: S.body, margin: 0, flex: 1 }}>We use cookies to improve your experience. <button onClick={() => { dismiss("y"); setPage("Privacy"); }} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Privacy Policy</button></p><div style={{ display: "flex", gap: 10 }}><button onClick={() => dismiss("y")} style={{ padding: "8px 20px", borderRadius: 6, background: S.gold, color: S.navy, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Accept</button><button onClick={() => dismiss("n")} style={{ padding: "8px 16px", borderRadius: 6, background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer" }}>Decline</button></div></div>;
}
