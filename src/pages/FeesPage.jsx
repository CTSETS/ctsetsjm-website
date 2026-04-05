import React, { useState, useEffect } from "react";
import S from "../constants/styles";
import { CALC_DATA } from "../constants/programmes"; //
import { REG_FEE, USD_RATE } from "../constants/config"; //
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { WhatsAppShare } from "../components/shared/DisplayComponents";
import { fmt, dualPrice } from "../utils/formatting";
import { TESTIMONIALS } from "../constants/content"; //
import { DownloadGuideButton } from "../components/pdf/ProgrammeGuide";

export default function FeesPage({ setPage }) {
  const levels = [...new Set(CALC_DATA.map(d => d.level))]; //
  const [selLevel, setSelLevel] = useState(levels[0]);
  const [selProg, setSelProg] = useState(null);
  const [selPlan, setSelPlan] = useState("Gold");
  const [isGroup, setIsGroup] = useState(false);
  const [hoverPlan, setHoverPlan] = useState(null);
  
  const progsForLevel = CALC_DATA.filter(d => d.level === selLevel);
  const prog = selProg || progsForLevel[0];
  const isGoldOnly = prog?.goldOnly; //

  // Auto-update selections
  useEffect(() => { 
    const p = CALC_DATA.filter(d => d.level === selLevel); 
    setSelProg(p[0]); 
    if (p[0]?.goldOnly) setSelPlan("Gold"); 
  }, [selLevel]);
  
  useEffect(() => { 
    if (isGoldOnly && selPlan !== "Gold") setSelPlan("Gold"); 
  }, [isGoldOnly, selPlan]);

  // Calculator Engine
  const calc = () => {
    if (!prog) return null;
    const t = prog.tuition, gd = isGroup ? 0.85 : 1;
    const regLabel = `${fmt(REG_FEE)} non-refundable reg`; //
    
    if (selPlan === "Gold") { 
      const tt = t * gd, ae = tt + REG_FEE; 
      return { plan: "Gold", grandTotal: fmt(ae), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(tt)} training + ${regLabel}` }], savings: isGroup ? fmt(t * 0.15) : null, note: "0% Surcharge — Best Value" }; 
    }
    if (selPlan === "Silver") { 
      const st = Math.round(t * 1.10 * gd), ep = Math.round(st * 0.6), mp = st - ep, ae = ep + REG_FEE; 
      return { plan: "Silver", grandTotal: fmt(ae + mp), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(ep)} (60% training) + ${regLabel}` }, { label: "At Mid-Point", amount: fmt(mp), detail: "Remaining 40% of training fee" }], savings: isGroup ? fmt(Math.round(t * 1.10 * 0.15)) : null, note: "+10% surcharge on training only" }; 
    }
    // Bronze
    const m = prog.bronzeMonths || 6;
    const bronzeT = Math.round(t * 1.15 * gd);
    const bronzeDeposit = Math.round(bronzeT * 0.20);
    const remaining = bronzeT - bronzeDeposit;
    const roundedMonthly = Math.round(remaining / m);
    const ae = bronzeDeposit + REG_FEE;
    const monthlyTotal = roundedMonthly * m;
    const gt = ae + monthlyTotal;
    
    return { plan: "Bronze", grandTotal: fmt(gt), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(bronzeDeposit)} deposit + ${regLabel}` }, { label: `${m} Monthly Payments`, amount: `${fmt(roundedMonthly)}/mth`, detail: `${fmt(monthlyTotal)} over ${m} months` }], savings: isGroup ? `${fmt(Math.round(t * 1.15) - bronzeT)} (group)` : null, note: "+15% surcharge on training only" };
  };

  const result = calc();
  const inputStyle = { width: "100%", padding: "16px", borderRadius: "12px", border: `1px solid ${S.border}`, background: S.white, fontSize: "15px", fontFamily: S.body, color: S.navy, fontWeight: "600", cursor: "pointer", outline: "none", transition: "0.2s" };
  const labelStyle = { fontSize: "12px", color: S.teal, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", display: "block", marginBottom: "10px" };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="Your Investment" 
        title="See Exactly What You'll Pay" 
        desc={`J$${REG_FEE.toLocaleString()} non-refundable registration fee + training fee. Surcharges apply to training only. No hidden fees.`} 
        accentColor={S.coral} 
      />
      <Container>
        <SocialProofBar />

        {/* ─── PAYMENT PLAN CARDS ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "60px", marginTop: "20px" }}>
          {[
            { n: "Gold", f: "0%", d: "Pay registration + training fee in full. Best value.", color: S.gold, bg: S.goldLight, highlight: true }, 
            { n: "Silver", f: "+10%", d: "+10% on training fee. 60/40 split. Levels 3–5 only.", color: S.gray, bg: S.white, highlight: false }, 
            { n: "Bronze", f: "+15%", d: "+15% on training fee. 20% deposit + monthly. Levels 3–5 only.", color: "#CD7F32", bg: S.white, highlight: false }
          ].map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div 
                onMouseEnter={() => setHoverPlan(p.n)}
                onMouseLeave={() => setHoverPlan(null)}
                style={{ 
                  background: p.bg, 
                  borderRadius: "20px", 
                  padding: "32px 24px", 
                  border: `2px solid ${p.highlight ? p.color : S.border}`, 
                  textAlign: "center",
                  boxShadow: hoverPlan === p.n ? `0 15px 30px ${p.color}15` : "0 4px 10px rgba(0,0,0,0.02)",
                  transform: hoverPlan === p.n ? "translateY(-5px)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative"
                }}
              >
                {p.highlight && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: p.color, color: S.white, padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Best Value</div>}
                <div style={{ fontSize: "13px", fontWeight: "800", color: p.highlight ? S.navy : p.color, fontFamily: S.body, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{p.n} Plan</div>
                <div style={{ fontSize: "40px", fontWeight: "800", color: S.navy, fontFamily: S.heading, lineHeight: "1" }}>{p.f}</div>
                <div style={{ fontSize: "13px", color: S.gray, fontFamily: S.body, marginTop: "12px", lineHeight: "1.6" }}>{p.d}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ─── DYNAMIC QUOTE GENERATOR ─── */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "30px", alignItems: "start", marginBottom: "60px" }}>
            
            {/* Left: Inputs */}
            <div style={{ background: S.white, borderRadius: "24px", padding: "40px 30px", border: `1px solid ${S.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              <label style={labelStyle}>1. Select Your Level</label>
              <select value={selLevel} onChange={e => setSelLevel(e.target.value)} style={{...inputStyle, marginBottom: "24px"}}>{levels.map(l => <option key={l}>{l}</option>)}</select>
              
              <label style={labelStyle}>2. Choose Programme</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {progsForLevel.map(p => (
                  <button 
                    key={p.name} 
                    onClick={() => setSelProg(p)} 
                    style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${prog?.name === p.name ? S.teal : S.border}`, background: prog?.name === p.name ? S.tealLight : S.white, color: S.navy, cursor: "pointer", textAlign: "left", transition: "0.2s" }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: prog?.name === p.name ? "800" : "600", fontFamily: S.body }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: S.gray, marginTop: "4px" }}>Base Tuition: {dualPrice(p.tuition)}</div>
                  </button>
                ))}
              </div>

              <label style={labelStyle}>3. Select Payment Plan</label>
              {isGoldOnly && <div style={{ fontSize: "12px", color: S.amberDark, fontFamily: S.body, marginBottom: "12px", padding: "10px 14px", background: S.amberLight, borderRadius: "8px", fontWeight: "600" }}>⚠️ Job Certificates & Level 2 require Gold (Pay in Full).</div>}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                {["Gold", "Silver", "Bronze"].map(plan => { 
                  const dis = isGoldOnly && plan !== "Gold"; 
                  const act = selPlan === plan; 
                  const c = { Gold: S.gold, Silver: S.gray, Bronze: "#CD7F32" }; 
                  return (
                    <button key={plan} onClick={() => !dis && setSelPlan(plan)} style={{ flex: 1, padding: "14px 8px", borderRadius: "12px", border: `2px solid ${act ? c[plan] : S.border}`, background: act ? `${c[plan]}15` : S.white, cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.4 : 1, textAlign: "center", transition: "0.2s" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: act ? c[plan] : S.gray, fontFamily: S.body }}>{plan}</div>
                    </button>
                  ); 
                })}
              </div>

              <button onClick={() => setIsGroup(!isGroup)} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: `2px solid ${isGroup ? S.emerald : S.border}`, background: isGroup ? S.emeraldLight : S.lightBg, cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "0.2s" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", border: `2px solid ${isGroup ? S.emerald : "#ccc"}`, background: isGroup ? S.emerald : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isGroup && <span style={{ color: S.white, fontSize: "14px", fontWeight: "bold" }}>✓</span>}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: S.navy, fontFamily: S.body }}>Apply Employer Group Discount</div>
                  <div style={{ fontSize: "12px", color: S.gray, fontFamily: S.body }}>Save 15% (Requires 8+ learners)</div>
                </div>
              </button>
            </div>

            {/* Right: Smart Receipt */}
            {result && (
              <div style={{ background: S.navy, borderRadius: "24px", padding: "40px", position: "sticky", top: "100px", boxShadow: "0 20px 40px rgba(1,30,64,0.15)", overflow: "hidden" }}>
                {/* Decorative background element */}
                <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${S.coral}30 0%, transparent 70%)`, zIndex: 0 }} />
                
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ fontSize: "12px", color: S.coral, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "8px" }}>Your Formal Quote</div>
                  <div style={{ fontSize: "18px", color: S.white, fontFamily: S.heading, fontWeight: "700", marginBottom: "30px", lineHeight: "1.4" }}>{prog?.name} <br/><span style={{ color: S.goldLight, fontWeight: "400", fontSize: "15px" }}>{result.plan} Plan</span></div>
                  
                  {result.steps.map((step, i) => (
                    <div key={i} style={{ padding: "20px 0", borderBottom: i < result.steps.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6px" }}>
                        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontFamily: S.body, fontWeight: "600" }}>{step.label}</span>
                        <span style={{ fontSize: "24px", fontWeight: "800", color: S.coral, fontFamily: S.heading }}>{step.amount}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>{step.detail}</div>
                    </div>
                  ))}
                  
                  <div style={{ marginTop: "20px", padding: "24px 0", borderTop: "2px dashed rgba(255,255,255,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontFamily: S.body }}>Total (USD Estimate)</span>
                      <span style={{ fontSize: "28px", fontWeight: "800", color: S.white, fontFamily: S.heading }}>US${Math.round(parseInt(result.grandTotal.replace(/[^0-9]/g, "")) / USD_RATE).toLocaleString()}</span> {/* */}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>Total (JMD)</span>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: S.gold, fontFamily: S.heading }}>{result.grandTotal}</span>
                    </div>
                    
                    {result.savings && <div style={{ fontSize: "13px", color: S.emerald, fontFamily: S.body, marginTop: "12px", textAlign: "right", fontWeight: "700" }}>Group discount saves {result.savings} per learner</div>}
                    {result.note && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: "12px", textAlign: "right", fontStyle: "italic" }}>{result.note}</div>}
                  </div>
                  
                  <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexDirection: "column" }}>
                    <Btn primary onClick={() => setPage("Apply")} style={{ color: S.white, background: S.coral, width: "100%", padding: "16px", fontSize: "16px", border: "none", boxShadow: `0 8px 20px ${S.coral}40` }}>Apply For This Programme</Btn>
                    <WhatsAppShare text={`CTS ETS Fees: ${prog?.name} — ${result.plan}: US$${Math.round(parseInt(result.grandTotal.replace(/[^0-9]/g, "")) / USD_RATE).toLocaleString()} | ctsetsjm.com`} label="Share Quote via WhatsApp" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Info & Testimonials */}
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: S.amberLight, border: `1px solid ${S.amber}30`, fontSize: "13px", color: S.navy, fontFamily: S.body, lineHeight: "1.6", textAlign: "center", maxWidth: "800px", margin: "0 auto 60px" }}>
          ⚠️ <strong>Prices current as of 2026</strong> and subject to change. Confirmed enrolments are honoured at the agreed rate. NCTVET registration and assessment fees are arranged through HEART/NSTA and are set by NCTVET where necessary.
        </div>

        <Reveal>
          <div style={{ maxWidth: "600px", margin: "0 auto 60px" }}>
            <TestimonialCard t={TESTIMONIALS[4]} /> {/* Dwayne P. Testimonial */} {/* */}
          </div>
        </Reveal>

        <PageScripture page="fees" /> {/* */}
      </Container>
    </PageWrapper>
  );
}