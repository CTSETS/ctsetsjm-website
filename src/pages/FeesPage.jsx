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
    fee: "+15%",
    title: "Split Payment",
    desc: "60% at enrolment and 40% later. 15% surcharge on training fee.",
    color: S.gray,
    bg: S.white,
  },
  Bronze: {
    fee: "+20%",
    title: "Deposit + Monthly",
    desc: "20% deposit plus monthly payments. 20% surcharge on training fee.",
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
  const [selPlan, setSelPlan] = useState("Gold");
  const [progCount, setProgCount] = useState(1);

  // Single-programme mode
  const [selLevel, setSelLevel] = useState(levels[0]);
  const [selProg, setSelProg] = useState(null);

  // Multi-programme mode: array of selected programmes
  const [selectedProgs, setSelectedProgs] = useState([]);
  const [addingLevel, setAddingLevel] = useState(levels[0]);

  const progsForLevel = CALC_DATA.filter((d) => d.level === selLevel);
  const prog = selProg || progsForLevel[0];

  // Programmes available for the "add" dropdown in multi mode
  const addingProgsForLevel = CALC_DATA.filter((d) => d.level === addingLevel);

  useEffect(() => {
    const p = CALC_DATA.filter((d) => d.level === selLevel);
    setSelProg(p[0]);
  }, [selLevel]);

  // Reset selections when progCount changes
  useEffect(() => {
    if (progCount === 1) {
      setSelectedProgs([]);
    } else {
      // If switching to multi, seed with current single selection if available
      if (prog && selectedProgs.length === 0) {
        setSelectedProgs([prog]);
      }
    }
  }, [progCount]);

  const addProgramme = (p) => {
    if (selectedProgs.length < progCount) {
      setSelectedProgs(prev => [...prev, p]);
    }
  };

  const removeProgramme = (index) => {
    setSelectedProgs(prev => prev.filter((_, i) => i !== index));
  };

  // ── Fee Calculation ──────────────────────────────────────────────────
  const PATHWAY_FEE = 2500;

  const calcSingle = () => {
    if (!prog) return null;
    const t = prog.tuition;
    const discountRate = 0; // single programme, no discount
    const discountedTuition = t;
    const regLabel = `${fmt(REG_FEE)} non-refundable reg`;

    if (selPlan === "Gold") {
      const ae = discountedTuition + REG_FEE;
      return { plan: "Gold", grandTotal: fmt(ae), rawGrandTotal: ae, steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(discountedTuition)} training + ${regLabel}` }], note: "0% surcharge — best value option", discountRate: 0, pathwayFee: 0 };
    }
    if (selPlan === "Silver") {
      const st = Math.round(discountedTuition * 1.15);
      const ep = Math.round(st * 0.6); const mp = st - ep; const ae = ep + REG_FEE;
      return { plan: "Silver", grandTotal: fmt(ae + mp), rawGrandTotal: ae + mp, steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(ep)} (60% training) + ${regLabel}` }, { label: "At Mid-Point", amount: fmt(mp), detail: "Remaining 40% of training fee" }], note: "+15% surcharge on training only", discountRate: 0, pathwayFee: 0 };
    }
    const m = prog.bronzeMonths || 6;
    const bronzeT = Math.round(discountedTuition * 1.20);
    const bronzeDeposit = Math.round(bronzeT * 0.2); const remaining = bronzeT - bronzeDeposit;
    const roundedMonthly = Math.round(remaining / m); const ae = bronzeDeposit + REG_FEE;
    const monthlyTotal = roundedMonthly * m; const gt = ae + monthlyTotal;
    return { plan: "Bronze", grandTotal: fmt(gt), rawGrandTotal: gt, steps: [{ label: "At Enrolment", amount: fmt(ae), detail: `${fmt(bronzeDeposit)} deposit + ${regLabel}` }, { label: `${m} Monthly Payments`, amount: `${fmt(roundedMonthly)}/mth`, detail: `${fmt(monthlyTotal)} over ${m} months` }], note: "+20% surcharge on training only", discountRate: 0, pathwayFee: 0 };
  };

  const calcMulti = () => {
    if (selectedProgs.length === 0) return null;
    const count = selectedProgs.length;
    const discountRate = count >= 4 ? 0.20 : count === 3 ? 0.15 : count === 2 ? 0.10 : 0;
    const needsPathwayFee = selPlan !== "Gold";
    const surchargeRate = selPlan === "Silver" ? 0.15 : selPlan === "Bronze" ? 0.20 : 0;
    const surchargeLabel = selPlan === "Silver" ? "+15%" : selPlan === "Bronze" ? "+20%" : "";

    let totalTuition = 0, totalDiscount = 0, totalSurcharge = 0, totalReg = 0, totalFinal = 0;
    const breakdown = selectedProgs.map((p, i) => {
      const tuition = p.tuition;
      const discount = Math.round(tuition * discountRate);
      const discounted = tuition - discount;
      const surcharge = Math.round(discounted * surchargeRate);
      const reg = REG_FEE;
      const lineTotal = discounted + surcharge + reg;
      totalTuition += tuition; totalDiscount += discount; totalSurcharge += surcharge; totalReg += reg; totalFinal += lineTotal;
      return { name: p.name, level: p.level, tuition, discount, discounted, surcharge, reg, lineTotal };
    });

    const pathwayFee = needsPathwayFee ? PATHWAY_FEE : 0;
    const grandTotal = totalFinal + pathwayFee;

    return {
      plan: selPlan,
      discountRate,
      surchargeRate,
      surchargeLabel,
      breakdown,
      totalTuition, totalDiscount, totalSurcharge, totalReg,
      totalFinal,
      pathwayFee,
      grandTotal,
      count,
      complete: count >= progCount,
    };
  };

  const result = progCount === 1 ? calcSingle() : null;
  const multiResult = progCount > 1 ? calcMulti() : null;

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
              <Reveal key={plan}><PlanCard plan={plan} active={selPlan === plan} disabled={false} onClick={() => setSelPlan(plan)} /></Reveal>
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

                {/* Step 1: How many programmes */}
                <label style={labelStyle}>1. How many programmes are you enrolling in?</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                  {[
                    { n: 1, label: "1" },
                    { n: 2, label: "2 (10% off)" },
                    { n: 3, label: "3 (15% off)" },
                    { n: 4, label: "4+ (20% off)" },
                  ].map((opt) => (
                    <button key={opt.n} onClick={() => { setProgCount(opt.n); setSelectedProgs([]); }} style={{ flex: 1, minWidth: 80, padding: "14px 6px", borderRadius: 12, border: `2px solid ${progCount === opt.n ? S.emerald : S.border}`, background: progCount === opt.n ? S.emeraldLight : S.white, cursor: "pointer", textAlign: "center", transition: "0.2s" }}>
                      <div style={{ fontSize: 13, fontWeight: progCount === opt.n ? 800 : 600, color: progCount === opt.n ? S.emerald : S.gray, fontFamily: S.body }}>{opt.label}</div>
                    </button>
                  ))}
                </div>

                {/* Step 2: Payment Plan */}
                <label style={labelStyle}>2. Select Payment Plan</label>
                <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
                  {["Gold", "Silver", "Bronze"].map((plan) => {
                    const act = selPlan === plan;
                    const c = { Gold: S.gold, Silver: S.gray, Bronze: "#CD7F32" };
                    return (
                      <button key={plan} onClick={() => setSelPlan(plan)} style={{ flex: 1, minWidth: 96, padding: "14px 8px", borderRadius: 12, border: `2px solid ${act ? c[plan] : S.border}`, background: act ? `${c[plan]}15` : S.white, cursor: "pointer", textAlign: "center", transition: "0.2s" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: act ? c[plan] : S.gray, fontFamily: S.body }}>{plan}</div>
                      </button>
                    );
                  })}
                </div>

                {/* SINGLE PROGRAMME MODE */}
                {progCount === 1 && (
                  <>
                    <label style={labelStyle}>3. Select Your Level</label>
                    <select value={selLevel} onChange={(e) => setSelLevel(e.target.value)} style={{ ...inputStyle, marginBottom: 22 }}>
                      {levels.map((l) => <option key={l}>{l}</option>)}
                    </select>
                    <label style={labelStyle}>4. Choose Programme</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                      {progsForLevel.map((p) => (
                        <button key={p.name} onClick={() => setSelProg(p)} style={{ padding: "16px", borderRadius: 14, border: `2px solid ${prog?.name === p.name ? S.teal : S.border}`, background: prog?.name === p.name ? S.tealLight : S.white, color: S.navy, cursor: "pointer", textAlign: "left", transition: "0.2s" }}>
                          <div style={{ fontSize: 14, fontWeight: prog?.name === p.name ? 800 : 600, fontFamily: S.body }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: S.gray, marginTop: 4, fontFamily: S.body }}>Base tuition: {fmt(p.tuition)}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* MULTI-PROGRAMME MODE */}
                {progCount > 1 && (
                  <>
                    {/* Info box */}
                    <div style={{ fontSize: 12, color: S.emerald, fontFamily: S.body, marginBottom: 16, padding: "10px 14px", background: S.emeraldLight, borderRadius: 10, fontWeight: 600, lineHeight: 1.6 }}>
                      Select all {progCount} programmes below to see your combined quote with {progCount >= 4 ? "20%" : progCount === 3 ? "15%" : "10%"} discount on each.
                      {selPlan !== "Gold" && <span> A one-time <strong>J$2,500 pathway fee</strong> applies to lock in the discount.</span>}
                    </div>

                    {/* Selected programmes */}
                    {selectedProgs.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Your Programmes ({selectedProgs.length}/{progCount})</label>
                        {selectedProgs.map((p, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", marginBottom: 6, borderRadius: 12, background: S.tealLight, border: `1.5px solid ${S.teal}30` }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>{p.level} · Tuition: {fmt(p.tuition)}</div>
                            </div>
                            <button onClick={() => removeProgramme(i)} style={{ background: "none", border: "none", color: S.gray, cursor: "pointer", fontSize: 16, padding: "4px 8px" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add programme picker */}
                    {selectedProgs.length < progCount && (
                      <>
                        <label style={labelStyle}>{selectedProgs.length === 0 ? "3. Add Your Programmes" : `Add Programme ${selectedProgs.length + 1} of ${progCount}`}</label>
                        <select value={addingLevel} onChange={(e) => setAddingLevel(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
                          {levels.map((l) => <option key={l}>{l}</option>)}
                        </select>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                          {addingProgsForLevel.map((p) => (
                            <button key={p.name} onClick={() => addProgramme(p)} style={{ padding: "14px", borderRadius: 12, border: `1.5px solid ${S.border}`, background: S.lightBg, color: S.navy, cursor: "pointer", textAlign: "left", transition: "0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: S.body }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>Tuition: {fmt(p.tuition)}</div>
                              </div>
                              <span style={{ color: S.teal, fontWeight: 800, fontSize: 18 }}>+</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Completion prompt */}
                    {selectedProgs.length > 0 && selectedProgs.length < progCount && (
                      <div style={{ fontSize: 12, color: S.amberDark, fontFamily: S.body, padding: "10px 14px", background: S.amberLight, borderRadius: 10, fontWeight: 600, lineHeight: 1.6 }}>
                        Select {progCount - selectedProgs.length} more programme{progCount - selectedProgs.length > 1 ? "s" : ""} to see your full quote.
                      </div>
                    )}
                  </>
                )}
              </div>
            </Reveal>

            {/* SINGLE PROGRAMME RESULT */}
            {progCount === 1 && result && (
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
                        {result.note && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.54)", fontFamily: S.body, marginTop: 10, textAlign: "right", fontStyle: "italic" }}>{result.note}</div>}
                      </div>
                      <div style={{ marginTop: 24, display: "flex", gap: 12, flexDirection: "column" }}>
                        <Btn primary onClick={() => setPage("Apply")} style={{ color: S.white, background: S.coral, width: "100%", padding: "16px", fontSize: "16px", border: "none", boxShadow: `0 8px 20px ${S.coral}40`, borderRadius: 12 }}>Apply for This Programme</Btn>
                        <WhatsAppShare text={`CTS ETS Fees: ${prog?.name} — ${result.plan}: ${result.grandTotal} | ctsetsjm.com`} label="Share Quote via WhatsApp" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* MULTI-PROGRAMME RESULT */}
            {progCount > 1 && multiResult && multiResult.complete && (
              <Reveal>
                <div style={{ display: "grid", gap: 20 }}>
                  <div style={{ background: S.navy, borderRadius: 24, padding: "34px 30px", position: "sticky", top: "100px", boxShadow: "0 20px 40px rgba(1,30,64,0.15)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${S.coral}30 0%, transparent 70%)`, zIndex: 0 }} />
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: "11px", color: S.coral, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: "8px" }}>Combined Quote — {multiResult.count} Programmes</div>
                      <div style={{ fontSize: "14px", color: S.goldLight, fontFamily: S.body, fontWeight: 700, marginBottom: "22px" }}>{multiResult.plan} Plan · {Math.round(multiResult.discountRate * 100)}% multi-programme discount{multiResult.surchargeLabel ? ` · ${multiResult.surchargeLabel} surcharge` : ""}</div>

                      {/* Per-programme breakdown */}
                      <div style={{ marginBottom: 20 }}>
                        {multiResult.breakdown.map((item, i) => (
                          <div key={i} style={{ padding: "14px 0", borderBottom: i < multiResult.breakdown.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: S.white, fontFamily: S.body }}>{item.name}</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: 2 }}>{item.level}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: S.coral, fontFamily: S.heading }}>{fmt(item.lineTotal)}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: S.body, lineHeight: 1.6 }}>
                              Tuition {fmt(item.tuition)}{item.discount > 0 ? ` − ${fmt(item.discount)} discount` : ""}{item.surcharge > 0 ? ` + ${fmt(item.surcharge)} surcharge` : ""} + {fmt(item.reg)} reg
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div style={{ marginTop: "16px", paddingTop: "20px", borderTop: "2px dashed rgba(255,255,255,0.2)" }}>
                        <SummaryRow label="Total tuition" value={fmt(multiResult.totalTuition)} />
                        {multiResult.totalDiscount > 0 && <SummaryRow label={`Discount (${Math.round(multiResult.discountRate * 100)}%)`} value={`−${fmt(multiResult.totalDiscount)}`} accent={S.emerald} />}
                        {multiResult.totalSurcharge > 0 && <SummaryRow label={`${multiResult.plan} surcharge`} value={`+${fmt(multiResult.totalSurcharge)}`} />}
                        <SummaryRow label={`Registration (${multiResult.count} × ${fmt(REG_FEE)})`} value={fmt(multiResult.totalReg)} />
                        {multiResult.pathwayFee > 0 && <SummaryRow label="Pathway fee (one-time)" value={fmt(multiResult.pathwayFee)} />}
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.15)" }} />
                        <SummaryRow label="Grand Total (USD)" value={`US$${Math.round(multiResult.grandTotal / USD_RATE).toLocaleString()}`} strong />
                        <SummaryRow label="Grand Total (JMD)" value={fmt(multiResult.grandTotal)} accent={S.gold} />
                        {multiResult.totalDiscount > 0 && <div style={{ fontSize: 13, color: S.emerald, fontFamily: S.body, marginTop: 10, textAlign: "right", fontWeight: 700 }}>You save {fmt(multiResult.totalDiscount)} on tuition</div>}
                        {multiResult.pathwayFee > 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: 6, textAlign: "right", fontStyle: "italic" }}>Pathway fee is one-time and locks in your discount. Pay in full (Gold) to waive it.</div>}
                      </div>

                      <div style={{ marginTop: 24, display: "flex", gap: 12, flexDirection: "column" }}>
                        <Btn primary onClick={() => setPage("Apply")} style={{ color: S.white, background: S.coral, width: "100%", padding: "16px", fontSize: "16px", border: "none", boxShadow: `0 8px 20px ${S.coral}40`, borderRadius: 12 }}>Apply Now</Btn>
                        <WhatsAppShare text={`CTS ETS Quote: ${multiResult.count} programmes (${multiResult.plan}, ${Math.round(multiResult.discountRate * 100)}% off) — Total: ${fmt(multiResult.grandTotal)} | ctsetsjm.com`} label="Share Quote via WhatsApp" />
                      </div>
                    </div>
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
