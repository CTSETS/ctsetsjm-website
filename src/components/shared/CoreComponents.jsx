import { useState, useEffect, useRef } from "react";
import S from "../../constants/styles";
import { SCRIPTURES, SOCIAL_PROOF } from "../../constants/content";

export function Container({ children, style }) {
  return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,3vw,48px)", ...style }}>{children}</div>;
}
export function PageWrapper({ children, bg = "#fff" }) {
  return <main id="main-content" tabIndex={-1} style={{ minHeight: "calc(100vh - 72px)", background: bg, padding: "0 0 60px", outline: "none" }}>{children}</main>;
}
export function Btn({ children, primary, onClick, style, ariaLabel }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{ padding: primary ? "14px 32px" : "12px 28px", borderRadius: 8, border: primary ? "none" : "2px solid " + S.navy, background: primary ? S.gold : "transparent", color: primary ? S.navy : S.navy, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body, letterSpacing: 0.5, transition: "all 0.2s", ...style }}>{children}</button>
  );
}
export function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const tx = { up: "translateY(24px)", down: "translateY(-24px)", left: "translateX(24px)", right: "translateX(-24px)", scale: "scale(0.95)", none: "none" };
  return <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : tx[direction], transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`, willChange: "opacity, transform", ...style }}>{children}</div>;
}
export function SectionHeader({ tag, title, desc, light = false, accentColor }) {
  return (
    <Reveal>
      <div style={{ textAlign: "center", marginBottom: 48, padding: "48px 24px 0" }}>
        <span style={{ fontSize: 11, color: accentColor || S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>{tag}</span>
        <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 40px)", color: light ? "#fff" : S.navy, margin: "10px 0 0", fontWeight: 700 }}>{title}</h2>
        {desc && <p style={{ fontFamily: S.body, fontSize: 15, color: light ? "rgba(255,255,255,0.7)" : S.gray, marginTop: 14, maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>{desc}</p>}
      </div>
    </Reveal>
  );
}
export function SectionBlock({ num, title, desc, children, locked, complete }) {
  return (
    <div style={{ marginBottom: 32, position: "relative", opacity: locked ? 0.45 : 1, transition: "opacity 0.3s", pointerEvents: locked ? "none" : "auto" }}>
      {locked && <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "rgba(248,249,250,0.6)", backdropFilter: "blur(2px)" }}><div style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1.5px solid rgba(1,30,64,0.1)", display: "flex", alignItems: "center", gap: 8 }}><span>🔒</span><span style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Complete the section above to unlock</span></div></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: desc ? 6 : 16, paddingBottom: 14, borderBottom: "2px solid " + (complete ? S.emerald + "40" : "rgba(1,30,64,0.06)") }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: complete ? S.emerald : S.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: S.heading, fontSize: 13, fontWeight: 800, color: complete ? "#fff" : S.gold }}>{complete ? "✓" : num}</span></div>
        <div style={{ flex: 1 }}><div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy }}>{title}</div>{desc && <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 2 }}>{desc}</div>}</div>
        {complete && <div style={{ fontSize: 11, fontWeight: 700, color: S.emerald, fontFamily: S.body }}>✓ Complete</div>}
      </div>
      {children}
    </div>
  );
}
export function PageScripture({ page }) {
  const s = SCRIPTURES[page]; if (!s) return null;
  return (
    <Reveal delay={0.3}><div style={{ textAlign: "center", padding: "36px 24px 0", marginTop: 40, borderTop: "1px solid rgba(10,35,66,0.06)" }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(1,30,64,0.35)", lineHeight: 1.7, fontStyle: "italic", maxWidth: 520, margin: "0 auto" }}>"{s.text}"</p>
      <p style={{ fontFamily: S.body, fontSize: 10, color: S.gold + "80", letterSpacing: 2, marginTop: 8, textTransform: "uppercase" }}>— {s.ref}</p>
    </div></Reveal>
  );
}
// Social proof bar — use on decision pages (Apply, Fees)
export function SocialProofBar() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px,3vw,40px)", flexWrap: "wrap", padding: "20px 0", borderRadius: 12, background: S.navy, marginBottom: 32 }}>
      {[
        [SOCIAL_PROOF.enrolled, "Training Professionals", S.coral],
        [SOCIAL_PROOF.programmes, "Programmes", S.teal],
        [SOCIAL_PROOF.completionRate, "Completion Rate", S.emerald],
        [SOCIAL_PROOF.satisfaction, "Satisfaction", S.violet],
      ].map(([val, label, color]) => (
        <div key={label} style={{ textAlign: "center", minWidth: 80 }}>
          <div style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color }}>{val}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
// Talk to a Graduate CTA — use on Home, Contact
export function TalkToGraduate({ setPage }) {
  return (
    <Reveal>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 28px", borderRadius: 16, background: S.violetLight, border: "1px solid " + S.violet + "30", marginTop: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: S.violet + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🎓</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, fontWeight: 700, margin: "0 0 4px" }}>Not sure? Talk to a graduate.</h4>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, margin: 0 }}>Connect with a CTS ETS graduate who can answer your questions from experience. No pressure, no sales — just honest advice from someone who's been where you are.</p>
        </div>
        <a href="https://wa.me/8763819771?text=Hi%2C%20I%E2%80%99d%20like%20to%20speak%20with%20a%20CTS%20ETS%20graduate%20about%20their%20experience." target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", borderRadius: 8, background: S.violet, color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: S.body, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>Chat Now →</a>
      </div>
    </Reveal>
  );
}
// Inline testimonial card for decision pages
export function TestimonialCard({ t }) {
  return (
    <div style={{ background: S.lightBg, borderRadius: 12, padding: "20px", border: "1px solid " + S.border, display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: t.color, fontFamily: S.body, flexShrink: 0 }}>{t.initials}</div>
      <div>
        <p style={{ fontFamily: S.body, fontSize: 13, color: "#2D3748", lineHeight: 1.6, fontStyle: "italic", margin: "0 0 8px" }}>"{t.quote}"</p>
        <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{t.name} · <span style={{ color: t.color, fontWeight: 600 }}>{t.outcome}</span></div>
      </div>
    </div>
  );
}
