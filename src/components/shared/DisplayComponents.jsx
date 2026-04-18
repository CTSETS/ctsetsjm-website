import { useState, useEffect, useRef } from "react";
import S from "../../constants/styles";
import { USD_RATE, NCTVET_LOGO, HEART_LOGO, CTS_CREST_LOGO, JAMAICA_MAP, SECURITY_BADGES } from "../../constants/config";

export function DualPrice({ amount, size = 13, style = {} }) {
  const num = typeof amount === "string" ? parseInt(amount.replace(/[$,]/g, "")) : amount;
  if (isNaN(num)) return <span style={{ fontSize: size, fontFamily: S.body, ...style }}>—</span>;
  return <span style={{ fontFamily: S.body, ...style }}><span style={{ fontSize: size, fontWeight: 700, color: S.navy }}>{"US$" + Math.round(num / USD_RATE).toLocaleString()}</span><span style={{ fontSize: Math.max(size - 2, 10), fontWeight: 600, color: S.gold, marginLeft: 4 }}>{"(J$" + Math.round(num).toLocaleString() + ")"}</span></span>;
}
export function AnimatedStat({ value, label }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null); const animated = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !animated.current) { animated.current = true; const isPct = value.includes("%"); const target = parseInt(value); const dur = 1200; const start = performance.now(); const tick = (now) => { const p = Math.min((now - start) / dur, 1); setDisplay(Math.round(target * (1 - Math.pow(1 - p, 3))) + (isPct ? "%" : "")); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, [value]);
  return <div ref={ref} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "16px 14px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}><div style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: S.gold }}>{display}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{label}</div></div>;
}
export function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState({});
  useEffect(() => { const calc = () => { const d = new Date(targetDate) - new Date(); if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }; return { days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) }; }; setTime(calc()); const iv = setInterval(() => setTime(calc()), 1000); return () => clearInterval(iv); }, [targetDate]);
  return <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>{[["days", time.days], ["hrs", time.hours], ["min", time.minutes], ["sec", time.seconds]].map(([l, v]) => <div key={l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 52 }}><div style={{ fontFamily: S.heading, fontSize: 20, fontWeight: 800, color: S.gold }}>{String(v || 0).padStart(2, "0")}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{l}</div></div>)}</div>;
}
export function PartnerLogos() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(1,30,64,0.10)",
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: "0 10px 24px rgba(1,30,64,0.05)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(90px, 150px) minmax(260px, 1fr) minmax(90px, 110px)",
          alignItems: "center",
          gap: 18,
        }}
        className="resp-grid-3"
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={JAMAICA_MAP}
            alt="Jamaica map in national colors"
            style={{ height: 74, maxWidth: 150, objectFit: "contain" }}
            loading="lazy"
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              color: "#111111",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: S.body,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Stakeholder Partnership
          </div>
          <p
            style={{
              margin: "0 0 12px",
              fontFamily: S.body,
              fontSize: 13,
              lineHeight: 1.6,
              color: "#111111",
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            From Jamaica&apos;s workforce development priorities to CTS ETS delivery and recognised HEART/NCTVET
            certification alignment, this partnership supports clearer vocational progression for learners.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
            <img src={NCTVET_LOGO} alt="NCTVET" style={{ height: 60, objectFit: "contain" }} loading="lazy" />
            <img src={HEART_LOGO} alt="HEART NSTA" style={{ height: 60, objectFit: "contain" }} loading="lazy" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={CTS_CREST_LOGO}
            alt="CTS ETS crest"
            style={{ height: 84, maxWidth: 100, objectFit: "contain" }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
export function WhatsAppShare({ text, label = "Share via WhatsApp" }) {
  return <a href={"https://wa.me/?text=" + encodeURIComponent(text)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 6, background: "#25D366", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>{label}</a>;
}
export function PaymentSecurityNotice() {
  return <div style={{ padding: "16px 20px", borderRadius: 10, background: S.emeraldLight, border: "1px solid " + S.emerald + "30", marginBottom: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><span>🔐</span><span style={{ fontSize: 12, fontWeight: 700, color: S.emeraldDark, fontFamily: S.body }}>International Payment Security</span></div><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{SECURITY_BADGES.map(b => <span key={b} style={{ padding: "4px 10px", borderRadius: 20, background: "#fff", border: "1px solid " + S.emerald + "30", fontSize: 10, color: S.emeraldDark, fontFamily: S.body, fontWeight: 600 }}>{b}</span>)}</div><p style={{ fontSize: 11, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>Processed through WiPay (PCI DSS Level 1). Your card details are never stored on CTS ETS servers.</p></div>;
}
export function CaptchaChallenge({ onVerified, verified }) {
  const [ch, setCh] = useState(null); const [ans, setAns] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { gen(); }, []);
  const gen = () => { const ops = [() => { const a = ~~(Math.random() * 10) + 2, b = ~~(Math.random() * 10) + 1; return { q: `${a} + ${b}`, a: a + b }; }, () => { const a = ~~(Math.random() * 10) + 10, b = ~~(Math.random() * 8) + 1; return { q: `${a} - ${b}`, a: a - b }; }, () => { const a = ~~(Math.random() * 5) + 2, b = ~~(Math.random() * 5) + 2; return { q: `${a} × ${b}`, a: a * b }; }]; setCh(ops[~~(Math.random() * 3)]()); setAns(""); setErr(""); };
  const verify = () => { if (!ch) return; const p = parseInt(ans.trim()); if (isNaN(p)) { setErr("Enter a number"); return; } if (p === ch.a) { onVerified(true); setErr(""); } else { setErr("Incorrect. Try again."); gen(); onVerified(false); } };
  if (verified) return <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 8, background: S.emeraldLight, border: "1px solid " + S.emerald + "40", marginBottom: 16 }}><span style={{ width: 22, height: 22, borderRadius: "50%", background: S.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</span><span style={{ fontFamily: S.body, fontSize: 13, color: S.emeraldDark, fontWeight: 600 }}>Verified</span></div>;
  if (!ch) return null;
  return <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.08)", marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><span style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748" }}>What is <strong style={{ color: S.navy, fontSize: 16 }}>{ch.q}</strong> ?</span><input type="text" value={ans} onChange={e => { setAns(e.target.value.replace(/[^0-9-]/g, "")); setErr(""); }} onKeyDown={e => e.key === "Enter" && verify()} placeholder="?" maxLength={4} autoComplete="off" aria-label="Verification answer" style={{ width: 70, padding: "8px 12px", borderRadius: 6, border: "1px solid " + (err ? S.error : "rgba(1,30,64,0.15)"), fontSize: 16, textAlign: "center", fontFamily: S.body, fontWeight: 700, color: S.navy }} /><button onClick={verify} style={{ padding: "8px 16px", borderRadius: 6, background: S.navy, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Verify</button></div>{err && <div role="alert" style={{ fontFamily: S.body, fontSize: 11, color: S.error, marginTop: 6 }}>{err}</div>}</div>;
}
export function HoneypotField({ value, onChange }) {
  return <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true" tabIndex={-1}><label>Leave blank</label><input type="text" name="website_url" value={value} onChange={onChange} tabIndex={-1} autoComplete="off" /></div>;
}
