import React, { useState, useEffect } from "react";
import S from "../constants/styles";
import { CALC_DATA } from "../constants/programmes";
import { REG_FEE, USD_RATE } from "../constants/config";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
  TestimonialCard,
} from "../components/shared/CoreComponents";
import { WhatsAppShare } from "../components/shared/DisplayComponents";
import { fmt } from "../utils/formatting";
import { TESTIMONIALS } from "../constants/content";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
  advisor: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
  planning: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
};

const PLAN_INFO = {
  Gold: {
    fee: "0%",
    title: "Pay in Full",
    desc: "Registration fee plus full training fee at enrolment. The simplest and best-value option.",
    color: S.gold,
    bg: S.goldLight,
    badge: "Best Value",
  },
  Silver: {
    fee: "+10%",
    title: "Split Payment",
    desc: "60% at enrolment and 40% later. Available for Level 3–5 programmes.",
    color: S.gray,
    bg: S.white,
  },
  Bronze: {
    fee: "+15%",
    title: "Deposit + Monthly",
    desc: "20% deposit plus monthly payments. Available for Level 3–5 programmes.",
    color: "#CD7F32",
    bg: S.white,
  },
};

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(18px, 3vw, 40px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionIntro({ tag, title, desc, accent = S.teal }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 0.82fr) minmax(320px, 1.18fr)",
        gap: 30,
        alignItems: "end",
        marginBottom: 28,
      }}
      className="resp-grid-2"
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: `${accent}12`,
            color: accent,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: S.body,
            marginBottom: 14,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(30px, 4vw, 50px)",
            lineHeight: 1.06,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 760,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 16,
          lineHeight: 1.85,
          color: S.gray,
          margin: 0,
          maxWidth: 860,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function PlanCard({ plan, active, disabled, onClick }) {
  const p = PLAN_INFO[plan];
  return (
    <button
      onClick={() => !disabled && onClick()}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "26px 22px",
        borderRadius: 22,
        border: `2px solid ${active ? p.color : S.border}`,
        background: active ? p.bg : S.white,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: active ? `0 16px 34px ${p.color}18` : "0 8px 22px rgba(15,23,42,0.04)",
        position: "relative",
        transition: "all 0.2s ease",
      }}
    >
      {p.badge && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 20,
            padding: "5px 12px",
            borderRadius: 999,
            background: p.color,
            color: S.white,
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            fontFamily: S.body,
          }}
        >
          {p.badge}
        </div>
      )}
      <div style={{ fontSize: 11, color: active ? S.navy : p.color, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>
        {plan} Plan
      </div>
      <div style={{ fontFamily: S.heading, fontSize: 38, fontWeight: 800, color: S.navy, lineHeight: 1, marginBottom: 10 }}>{p.fee}</div>
      <div style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 800, marginBottom: 8 }}>{p.title}</div>
      <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7 }}>{p.desc}</div>
      {disabled && <div style={{ marginTop: 12, fontSize: 11, color: S.gray, fontFamily: S.body, fontWeight: 700 }}>Not available for this programme level</div>}
    </button>
  );
}

function SummaryRow({ label, value, strong = false, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", padding: "10px 0" }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.68)", fontFamily: S.body }}>{label}</span>
      <span style={{ fontSize: strong ? 18 : 14, color: accent || S.white, fontFamily: strong ? S.heading : S.body, fontWeight: strong ? 800 : 700, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function FeesPage({ setPage }) {
  const levels = [...new Set(CALC_DATA.map((d) => d.level))];
  const [selLevel, setSelLevel] = useState(levels[0]);
  const [selProg, setSelProg] = useState(null);
  const [selPlan, setSelPlan] = useState("Gold");
  const [isGroup, setIsGroup] = useState(false);

  const progsForLevel = CALC_DATA.filter((d) => d.level === selLevel);
  const prog = selProg || progsForLevel[0];
  const isGoldOnly = prog?.goldOnly;

  useEffect(() => {
    const p = CALC_DATA.filter((d) => d.level === selLevel);
    setSelProg(p[0]);
    if (p[0]?.goldOnly) setSelPlan("Gold");
  }, [selLevel]);

  useEffect(() => {
    if (isGoldOnly && selPlan !== "Gold") setSelPlan("Gold");
  }, [isGoldOnly, selPlan]);

  const calc = () => {
    if (!prog) return null;
    const t = prog.tuition;
    const gd = isGroup ? 0.85 : 1;
    const regLabel = `${fmt(REG_FEE)} non-refundable reg`;

    if (selPlan === "Gold") {
      const tt = t * gd;
      const ae = tt + REG_FEE;
      return {
        plan: "Gold",
        grandTotal: fmt(ae),
        rawGrandTotal: ae,
        steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(tt)} training + ${regLabel}` }],
        savings: isGroup ? fmt(t * 0.15) : null,
        note: "0% surcharge — best value option",
      };
    }
    if (selPlan === "Silver") {
      const st = Math.round(t * 1.1 * gd);
      const ep = Math.round(st * 0.6);
      const mp = st - ep;
      const ae = ep + REG_FEE;
      return {
        plan: "Silver",
        grandTotal: fmt(ae + mp),
        rawGrandTotal: ae + mp,
        steps: [
          { label: "At Enrolment", amount: fmt(ae), detail: `${fmt(ep)} (60% training) + ${regLabel}` },
          { label: "At Mid-Point", amount: fmt(mp), detail: "Remaining 40% of training fee" },
        ],
        savings: isGroup ? fmt(Math.round(t * 1.1 * 0.15)) : null,
        note: "+10% surcharge on training only",
      };
    }
    const m = prog.bronzeMonths || 6;
    const bronzeT = Math.round(t * 1.15 * gd);
    const bronzeDeposit = Math.round(bronzeT * 0.2);
    const remaining = bronzeT - bronzeDeposit;
    const roundedMonthly = Math.round(remaining / m);
    const ae = bronzeDeposit + REG_FEE;
    const monthlyTotal = roundedMonthly * m;
    const gt = ae + monthlyTotal;
    return {
      plan: "Bronze",
      grandTotal: fmt(gt),
      rawGrandTotal: gt,
      steps: [
        { label: "At Enrolment", amount: fmt(ae), detail: `${fmt(bronzeDeposit)} deposit + ${regLabel}` },
        { label: `${m} Monthly Payments`, amount: `${fmt(roundedMonthly)}/mth`, detail: `${fmt(monthlyTotal)} over ${m} months` },
      ],
      savings: isGroup ? `${fmt(Math.round(t * 1.15) - bronzeT)} (group)` : null,
      note: "+15% surcharge on training only",
    };
  };

  const result = calc();

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: `1px solid ${S.border}`,
    background: S.white,
    fontSize: "15px",
    fontFamily: S.body,
    color: S.navy,
    fontWeight: "600",
    cursor: "pointer",
    outline: "none",
    transition: "0.2s",
  };
  const labelStyle = {
    fontSize: "11px",
    color: S.teal,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: S.body,
    fontWeight: "800",
    display: "block",
    marginBottom: "10px",
  };

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Fees & Calculator</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 920 }}>See exactly what you will pay before you enrol</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>Estimate your likely training cost, compare payment options, and choose a plan that fits your situation before you move into the application process.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Start Application</Btn>
                  <Btn onClick={() => setPage("Programmes")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>Browse Programmes</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 440, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.hero} alt="Professional reviewing pricing and financial planning documents" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>💳</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Compare plans</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>📱</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Share your quote</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}>
        <Reveal><SocialProofBar /></Reveal>
      </WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <SectionIntro tag="Payment Plans" title="Choose the payment path that fits your situation" desc={`J$${REG_FEE.toLocaleString()} non-refundable registration fee plus training fee. Surcharges apply to training only, and the calculator below keeps the same pricing rules from your current page.`} accent={S.coral} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 22, marginBottom: 48 }} className="resp-grid-3">
            {["Gold", "Silver", "Bronze"].map((plan) => (
              <Reveal key={plan}><PlanCard plan={plan} active={selPlan === plan} disabled={isGoldOnly && plan !== "Gold"} onClick={() => setSelPlan(plan)} /></Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 4 }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.14fr) minmax(360px, 0.86fr)", gap: 28, alignItems: "start", marginBottom: 56 }} className="resp-grid-2">
            <Reveal>
              <div style={{ background: S.white, borderRadius: 24, padding: "34px 28px", border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                <div style={{ fontSize: "11px", color: S.teal, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: "18px" }}>Build Your Quote</div>
                <label style={labelStyle}>1. Select Your Level</label>
                <select value={selLevel} onChange={(e) => setSelLevel(e.target.value)} style={{ ...inputStyle, marginBottom: 22 }}>
                  {levels.map((l) => <option key={l}>{l}</option>)}
                </select>
                <label style={labelStyle}>2. Choose Programme</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                  {progsForLevel.map((p) => (
                    <button key={p.name} onClick={() => setSelProg(p)} style={{ padding: "16px", borderRadius: 14, border: `2px solid ${prog?.name === p.name ? S.teal : S.border}`, background: prog?.name === p.name ? S.tealLight : S.white, color: S.navy, cursor: "pointer", textAlign: "left", transition: "0.2s" }}>
                      <div style={{ fontSize: 14, fontWeight: prog?.name === p.name ? 800 : 600, fontFamily: S.body }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: S.gray, marginTop: 4, fontFamily: S.body }}>Base tuition: {fmt(p.tuition)}</div>
                    </button>
                  ))}
                </div>
                <label style={labelStyle}>3. Select Payment Plan</label>
                {isGoldOnly && (
                  <div style={{ fontSize: 12, color: S.amberDark, fontFamily: S.body, marginBottom: 12, padding: "10px 14px", background: S.amberLight, borderRadius: 10, fontWeight: 600, lineHeight: 1.6 }}>
                    Job Certificates and Level 2 programmes are currently Gold (Pay in Full) only.
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
                  {["Gold", "Silver", "Bronze"].map((plan) => {
                    const dis = isGoldOnly && plan !== "Gold";
                    const act = selPlan === plan;
                    const c = { Gold: S.gold, Silver: S.gray, Bronze: "#CD7F32" };
                    return (
                      <button key={plan} onClick={() => !dis && setSelPlan(plan)} style={{ flex: 1, minWidth: 96, padding: "14px 8px", borderRadius: 12, border: `2px solid ${act ? c[plan] : S.border}`, background: act ? `${c[plan]}15` : S.white, cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.4 : 1, textAlign: "center", transition: "0.2s" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: act ? c[plan] : S.gray, fontFamily: S.body }}>{plan}</div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setIsGroup(!isGroup)} style={{ width: "100%", padding: "16px", borderRadius: 14, border: `2px solid ${isGroup ? S.emerald : S.border}`, background: isGroup ? S.emeraldLight : S.lightBg, cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "0.2s" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "6px", border: `2px solid ${isGroup ? S.emerald : "#ccc"}`, background: isGroup ? S.emerald : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{isGroup && <span style={{ color: S.white, fontSize: "14px", fontWeight: "bold" }}>✓</span>}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: S.navy, fontFamily: S.body }}>Apply Employer Group Discount</div>
                    <div style={{ fontSize: "12px", color: S.gray, fontFamily: S.body }}>Save 15% per learner for group enrolment (8+ learners)</div>
                  </div>
                </button>
              </div>
            </Reveal>

            {result && (
              <Reveal>
                <div style={{ display: "grid", gap: 20 }}>
                  <div style={{ background: S.navy, borderRadius: 24, padding: "34px 30px", position: "sticky", top: "100px", boxShadow: "0 20px 40px rgba(1,30,64,0.15)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${S.coral}30 0%, transparent 70%)`, zIndex: 0 }} />
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: "11px", color: S.coral, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: "8px" }}>Your Formal Quote</div>
                      <div style={{ fontSize: "22px", color: S.white, fontFamily: S.heading, fontWeight: 800, marginBottom: "6px", lineHeight: 1.35 }}>{prog?.name}</div>
                      <div style={{ fontSize: "14px", color: S.goldLight, fontFamily: S.body, fontWeight: 700, marginBottom: "22px" }}>{result.plan} Plan</div>
                      <div style={{ marginBottom: 20 }}>
                        {result.steps.map((step, i) => (
                          <div key={i} style={{ padding: "18px 0", borderBottom: i < result.steps.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: "6px" }}>
                              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.82)", fontFamily: S.body, fontWeight: 700 }}>{step.label}</span>
                              <span style={{ fontSize: "24px", fontWeight: 800, color: S.coral, fontFamily: S.heading, textAlign: "right" }}>{step.amount}</span>
                            </div>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.54)", fontFamily: S.body, lineHeight: 1.6 }}>{step.detail}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "16px", paddingTop: "20px", borderTop: "2px dashed rgba(255,255,255,0.2)" }}>
                        <SummaryRow label="Total (USD Estimate)" value={`US$${Math.round(result.rawGrandTotal / USD_RATE).toLocaleString()}`} strong />
                        <SummaryRow label="Total (JMD)" value={result.grandTotal} accent={S.gold} />
                        {result.savings && <div style={{ fontSize: 13, color: S.emerald, fontFamily: S.body, marginTop: 10, textAlign: "right", fontWeight: 700 }}>Group discount saves {result.savings} per learner</div>}
                        {result.note && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.54)", fontFamily: S.body, marginTop: 10, textAlign: "right", fontStyle: "italic" }}>{result.note}</div>}
                      </div>
                      <div style={{ marginTop: 24, display: "flex", gap: 12, flexDirection: "column" }}>
                        <Btn primary onClick={() => setPage("Apply")} style={{ color: S.white, background: S.coral, width: "100%", padding: "16px", fontSize: "16px", border: "none", boxShadow: `0 8px 20px ${S.coral}40`, borderRadius: 12 }}>Apply for This Programme</Btn>
                        <WhatsAppShare text={`CTS ETS Fees: ${prog?.name} — ${result.plan}: US$${Math.round(result.rawGrandTotal / USD_RATE).toLocaleString()} | ctsetsjm.com`} label="Share Quote via WhatsApp" />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: S.white, borderRadius: 24, padding: 20, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                    <div style={{ width: "100%", height: 260, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>
                      <img src={PEOPLE.advisor} alt="Advisor helping a learner understand pricing options" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontFamily: S.heading, fontSize: 26, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Clear pricing helps learners decide with confidence</div>
                    <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>The fees page should help visitors compare plans, understand timing, and move toward enrolment without confusion.</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 4 }}>
        <WideWrap>
          <Reveal>
            <div style={{ padding: "16px 22px", borderRadius: 14, background: S.amberLight, border: `1px solid ${S.amber}30`, fontSize: "13px", color: S.navy, fontFamily: S.body, lineHeight: 1.7, marginBottom: 32 }}><strong>Prices current as of 2026</strong> and subject to change. Confirmed enrolments are honoured at the agreed rate. NCTVET registration and assessment fees are arranged through HEART/NSTA and are set by NCTVET where necessary.</div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 0.86fr) minmax(0, 1.14fr)", gap: 24, alignItems: "center", marginBottom: 44 }} className="resp-grid-2">
            <Reveal>
              <div style={{ background: S.white, borderRadius: 24, padding: 20, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", height: 300, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.planning} alt="Financial planning for tuition and study costs" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 26, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Plan with clarity before you commit</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>A strong fees page helps learners understand the numbers, compare payment pathways, and feel less uncertainty about the next step.</p>
              </div>
            </Reveal>
            <Reveal>
              <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                <TestimonialCard t={TESTIMONIALS[4]} />
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 12 }}>
        <WideWrap>
          <Reveal>
            <div style={{ borderRadius: 26, padding: "32px clamp(22px,4vw,38px)", background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 14px 34px rgba(15,23,42,0.04)", marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.06fr) minmax(280px, 0.94fr)", gap: 24, alignItems: "center" }} className="resp-grid-2">
                <div>
                  <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>Need Help Choosing?</div>
                  <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,38px)", color: S.navy, margin: "0 0 10px", lineHeight: 1.1, fontWeight: 900 }}>Move from pricing clarity to enrolment more easily</h2>
                  <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, margin: 0, maxWidth: 620 }}>Once you understand your likely cost, the next step should feel simple. Apply, ask a question, or browse programmes again before making your decision.</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.teal, color: S.white, borderRadius: 12, padding: "14px 24px" }}>Apply Now</Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 12, padding: "14px 24px", border: `2px solid ${S.teal}`, color: S.teal }}>Ask a Question</Btn>
                </div>
              </div>
            </div>
          </Reveal>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 18 }}>
        <PageScripture page="fees" />
      </WideWrap>
    </PageWrapper>
  );
}
