import { useState, useEffect } from "react";
import S from "../constants/styles";
import { CALC_DATA } from "../constants/programmes";
import { REG_FEE, USD_RATE } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { WhatsAppShare } from "../components/shared/DisplayComponents";
import { fmt, dualPrice } from "../utils/formatting";
import { TESTIMONIALS } from "../constants/content";
import { DownloadGuideButton } from "../components/pdf/ProgrammeGuide";

export default function FeesPage({ setPage }) {
  const levels = [...new Set(CALC_DATA.map(d => d.level))];
  const [selLevel, setSelLevel] = useState(levels[0]);
  const [selProg, setSelProg] = useState(null);
  const [selPlan, setSelPlan] = useState("Gold");
  const [isGroup, setIsGroup] = useState(false);
  const progsForLevel = CALC_DATA.filter(d => d.level === selLevel);
  const prog = selProg || progsForLevel[0];
  const isGoldOnly = prog?.goldOnly;

  useEffect(() => { const p = CALC_DATA.filter(d => d.level === selLevel); setSelProg(p[0]); if (p[0]?.goldOnly) setSelPlan("Gold"); }, [selLevel]);
  useEffect(() => { if (isGoldOnly && selPlan !== "Gold") setSelPlan("Gold"); }, [isGoldOnly, selPlan]);

  const calc = () => {
    if (!prog) return null;
    const t = prog.tuition, gd = isGroup ? 0.85 : 1;
    if (selPlan === "Gold") { const tt = t * gd, ae = tt + REG_FEE; return { plan: "Gold", grandTotal: fmt(ae), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: fmt(tt) + " tuition + " + fmt(REG_FEE) + " reg" }], savings: isGroup ? fmt(t * 0.15) : null }; }
    if (selPlan === "Silver") { const st = t * 1.10 * gd, ep = st * 0.6, mp = st * 0.4, ae = ep + REG_FEE; return { plan: "Silver", grandTotal: fmt(ae + mp), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: fmt(ep) + " (60%) + " + fmt(REG_FEE) + " reg" }, { label: "At Mid-Point", amount: fmt(mp), detail: "Remaining 40%" }], savings: isGroup ? fmt(t * 1.10 * 0.15) : null }; }
    const bt = t * 1.15 * gd, dep = bt * 0.3, ae = dep + REG_FEE, rem = bt - dep, m = prog.bronzeMonths || 6, mo = Math.round(rem / m);
    return { plan: "Bronze", grandTotal: fmt(ae + mo * m), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: fmt(dep) + " (30%) + " + fmt(REG_FEE) + " reg" }, { label: m + " Monthly Payments", amount: fmt(mo) + "/mth", detail: fmt(rem) + " over " + m + " months" }], savings: isGroup ? fmt(t * 1.15 * 0.15) : null };
  };
  const result = calc();
  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 6, border: "2px solid rgba(1,30,64,0.1)", background: "#fff", fontSize: 13, fontFamily: S.body, color: S.navy, fontWeight: 600, cursor: "pointer" };
  const labelStyle = { fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, display: "block", marginBottom: 8 };

  return (
    <PageWrapper>
      <SectionHeader tag="Your Investment" title="See Exactly What You'll Pay" desc="Choose your programme and payment plan. No hidden fees." accentColor={S.coral} />
      <Container>
        <SocialProofBar />
        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40 }} className="resp-grid-3">
          {[{ n: "Gold", f: "0%", d: "Full payment. Best value.", color: S.gold, bg: S.goldLight }, { n: "Silver", f: "+10%", d: "60% at enrolment, 40% mid-point.", color: "#64748B", bg: "#F1F5F9" }, { n: "Bronze", f: "+15%", d: "30% deposit + monthly payments.", color: "#CD7F32", bg: S.amberLight }].map(p => (
            <div key={p.n} style={{ background: p.bg, borderRadius: 12, padding: "24px 20px", border: "1px solid " + p.color + "30", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.color, fontFamily: S.body, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{p.n}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>{p.f}</div>
              <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 8 }}>{p.d}</div>
            </div>
          ))}
        </div>

        {/* Calculator */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }} className="resp-grid-calc">
          <div style={{ background: S.lightBg, borderRadius: 14, padding: "28px 24px", border: "1px solid " + S.border }}>
            <label style={labelStyle}>1. Level</label>
            <select value={selLevel} onChange={e => setSelLevel(e.target.value)} style={inputStyle}>{levels.map(l => <option key={l}>{l}</option>)}</select>
            <label style={{ ...labelStyle, marginTop: 20 }}>2. Programme</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {progsForLevel.map(p => <button key={p.name} onClick={() => setSelProg(p)} style={{ padding: "10px 14px", borderRadius: 6, border: "2px solid " + (prog?.name === p.name ? S.teal : "rgba(10,35,66,0.08)"), background: prog?.name === p.name ? S.tealLight : "#fff", color: S.navy, fontSize: 13, fontWeight: prog?.name === p.name ? 700 : 500, cursor: "pointer", fontFamily: S.body, textAlign: "left" }}><div>{p.name}</div><div style={{ fontSize: 11, color: S.gray, marginTop: 2 }}>Tuition: {dualPrice(p.tuition)}</div></button>)}
            </div>
            <label style={labelStyle}>3. Payment Plan</label>
            {isGoldOnly && <div style={{ fontSize: 11, color: S.amber, fontFamily: S.body, marginBottom: 8, padding: "6px 10px", background: S.amberLight, borderRadius: 4 }}>JC & Level 2: Full payment (Gold) only.</div>}
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {["Gold", "Silver", "Bronze"].map(plan => { const dis = isGoldOnly && plan !== "Gold"; const act = selPlan === plan; const c = { Gold: S.gold, Silver: "#64748B", Bronze: "#CD7F32" }; return <button key={plan} onClick={() => !dis && setSelPlan(plan)} style={{ flex: 1, padding: "12px 8px", borderRadius: 6, border: "2px solid " + (act ? c[plan] : "rgba(10,35,66,0.08)"), background: act ? c[plan] + "20" : "#fff", cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.3 : 1, textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, color: act ? c[plan] : S.gray, fontFamily: S.body }}>{plan}</div></button>; })}
            </div>
            <button onClick={() => setIsGroup(!isGroup)} style={{ width: "100%", padding: "12px 14px", borderRadius: 6, border: "2px solid " + (isGroup ? S.emerald : "rgba(10,35,66,0.08)"), background: isGroup ? S.emeraldLight : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: 3, border: "2px solid " + (isGroup ? S.emerald : "#ccc"), background: isGroup ? S.emerald : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{isGroup && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}</div>
              <div style={{ textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 600, color: S.navy, fontFamily: S.body }}>Group (8+ learners)</div><div style={{ fontSize: 10, color: S.gray, fontFamily: S.body }}>15% discount</div></div>
            </button>
          </div>

          {/* Result */}
          {result && <div style={{ background: S.navy, borderRadius: 14, padding: "clamp(24px,3vw,36px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: S.coral + "12" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 10, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>Your Payment Schedule</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: S.body, marginBottom: 20 }}>{prog?.name} — {result.plan} Plan</div>
              {result.steps.map((step, i) => <div key={i} style={{ padding: "16px 0", borderBottom: i < result.steps.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}><span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: S.body }}>{step.label}</span><span style={{ fontSize: 22, fontWeight: 700, color: S.coral, fontFamily: S.heading }}>{step.amount}</span></div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>{step.detail}</div></div>)}
              <div style={{ marginTop: 20, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: S.body }}>Total (USD)</span><span style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: S.heading }}>US${Math.round(parseInt(result.grandTotal.replace(/[$,]/g, "")) / USD_RATE).toLocaleString()}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}><span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>JMD</span><span style={{ fontSize: 18, fontWeight: 700, color: S.gold, fontFamily: S.heading }}>{result.grandTotal}</span></div>
                {result.savings && <div style={{ fontSize: 12, color: S.emerald, fontFamily: S.body, marginTop: 8, textAlign: "right" }}>Group discount saves {result.savings}</div>}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Apply")} style={{ color: "#fff", background: S.coral, flex: 1 }}>Apply Now</Btn>
                <WhatsAppShare text={`CTS ETS Fees: ${prog?.name} — ${result.plan}: US$${Math.round(parseInt(result.grandTotal.replace(/[$,]/g, "")) / USD_RATE).toLocaleString()} | ctsetsjm.com`} label="Share" />
              </div>
            </div>
          </div>}
        </div>

        <div style={{ marginTop: 24, padding: "14px 20px", borderRadius: 8, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>⚠️ <strong>Prices current as of 2026</strong> and subject to change. Confirmed enrolments honoured at the agreed rate.</div>

        <div style={{ marginTop: 32 }}><TestimonialCard t={TESTIMONIALS[4]} /></div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
          <Btn primary onClick={() => setPage("Apply")} style={{ color: "#fff", background: S.coral }}>Apply Now</Btn>
          <Btn onClick={() => setPage("Programmes")}>View All Programmes</Btn>
          <DownloadGuideButton />
        </div>
        <PageScripture page="fees" />
      </Container>
    </PageWrapper>
  );
}
