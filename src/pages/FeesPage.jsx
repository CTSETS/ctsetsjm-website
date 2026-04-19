import React, { useEffect, useState } from "react";
import S from "../constants/styles";
import { CALC_DATA } from "../constants/programmes";
import { REG_FEE, USD_RATE } from "../constants/config";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  TestimonialCard,
} from "../components/shared/CoreComponents";
import { WhatsAppShare } from "../components/shared/DisplayComponents";
import { fmt } from "../utils/formatting";
import { TESTIMONIALS } from "../constants/content";

const IMAGES = {
  hero: "https://images.pexels.com/photos/4386372/pexels-photo-4386372.jpeg?auto=compress&cs=tinysrgb&w=1400",
  planning: "https://images.pexels.com/photos/6693658/pexels-photo-6693658.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const C = {
  navy: "#0b1630",
  navySoft: "#122447",
  gold: "#c49112",
  teal: "#0a6e8a",
  green: "#1c7b47",
  white: "#ffffff",
  mist: "#f6f8fb",
  ink: "#142033",
  inkSoft: "#5b6676",
  line: "rgba(11,22,48,0.10)",
  shadow: "0 16px 36px rgba(11,22,48,0.08)",
};

const PLAN_INFO = {
  Gold: {
    fee: "0%",
    title: "Pay in full",
    desc: "Registration fee plus full training fee at enrolment. The simplest and best-value option.",
    color: C.gold,
    bg: "rgba(196,145,18,0.12)",
    badge: "Best value",
  },
  Silver: {
    fee: "+15%",
    title: "Split payment",
    desc: "60% at enrolment and 40% later. 15% surcharge on training fee.",
    color: "#5f6674",
    bg: C.white,
  },
  Bronze: {
    fee: "+20%",
    title: "Deposit and monthly",
    desc: "20% deposit plus monthly payments. 20% surcharge on training fee.",
    color: "#a46d36",
    bg: C.white,
  },
};

function cleanText(value) {
  if (value == null) return "";
  return String(value)
    .replace(/â€”/g, "-")
    .replace(/â€“/g, "-")
    .replace(/â€"/g, "-")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â†’/g, "->")
    .replace(/Â·/g, "·")
    .replace(/Ã—/g, "x")
    .replace(/âˆ’/g, "-")
    .replace(/Â/g, "")
    .trim();
}

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(16px, 3vw, 34px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Shell({ children, style }) {
  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, dark = false }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 24,
        padding: "0 8px",
        borderRadius: 999,
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(196,145,18,0.12)",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(196,145,18,0.18)",
        color: dark ? C.white : C.gold,
        fontSize: 8,
        textTransform: "uppercase",
        letterSpacing: 1.1,
        fontWeight: 800,
        fontFamily: S.body,
      }}
    >
      {children}
    </div>
  );
}

function Intro({ tag, title, desc }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 0.82fr) minmax(220px, 1.18fr)",
        gap: 14,
        alignItems: "end",
        marginBottom: 10,
      }}
      className="resp-grid-2"
    >
      <div>
        <Label>{tag}</Label>
        <div
          style={{
            fontFamily: S.heading,
            fontWeight: 800,
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.12,
            color: C.ink,
            marginTop: 7,
          }}
        >
          {title}
        </div>
      </div>
      <p
        style={{
          margin: 0,
          color: C.inkSoft,
          fontSize: 11,
          lineHeight: 1.5,
          fontFamily: S.body,
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
        padding: "16px 14px",
        borderRadius: 8,
        border: `1px solid ${active ? p.color : C.line}`,
        background: active ? p.bg : C.white,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: active ? `0 12px 24px ${p.color}15` : "0 8px 18px rgba(11,22,48,0.04)",
        position: "relative",
        transition: "all 0.2s ease",
      }}
    >
      {p.badge && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 12,
            padding: "4px 10px",
            borderRadius: 999,
            background: p.color,
            color: C.white,
            fontSize: 8,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontFamily: S.body,
          }}
        >
          {p.badge}
        </div>
      )}
      <div style={{ fontSize: 8, color: active ? C.ink : p.color, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 6 }}>
        {plan} plan
      </div>
      <div style={{ fontFamily: S.heading, fontSize: 24, fontWeight: 800, color: C.ink, lineHeight: 1, marginBottom: 8 }}>{p.fee}</div>
      <div style={{ fontFamily: S.heading, fontSize: 14, color: C.ink, fontWeight: 700, marginBottom: 6 }}>{p.title}</div>
      <div style={{ fontSize: 11, color: C.inkSoft, fontFamily: S.body, lineHeight: 1.55 }}>{p.desc}</div>
      {disabled && <div style={{ marginTop: 10, fontSize: 10, color: C.inkSoft, fontFamily: S.body, fontWeight: 700 }}>Not available for this programme level</div>}
    </button>
  );
}

function SummaryRow({ label, value, strong = false, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", padding: "8px 0" }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", fontFamily: S.body }}>{label}</span>
      <span style={{ fontSize: strong ? 16 : 12, color: accent || C.white, fontFamily: strong ? S.heading : S.body, fontWeight: strong ? 800 : 700, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

function OptionButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 72,
        padding: "12px 6px",
        borderRadius: 8,
        border: `1px solid ${active ? C.teal : C.line}`,
        background: active ? "rgba(10,110,138,0.08)" : C.white,
        cursor: "pointer",
        textAlign: "center",
        transition: "0.2s",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? C.teal : C.inkSoft, fontFamily: S.body }}>{children}</div>
    </button>
  );
}

export default function FeesPage({ setPage }) {
  const levels = [...new Set(CALC_DATA.map((d) => d.level))];
  const [selPlan, setSelPlan] = useState("Gold");
  const [progCount, setProgCount] = useState(1);
  const [selLevel, setSelLevel] = useState(levels[0]);
  const [selProg, setSelProg] = useState(null);
  const [selectedProgs, setSelectedProgs] = useState([]);
  const [addingLevel, setAddingLevel] = useState(levels[0]);
  const [singleProgrammesOpen, setSingleProgrammesOpen] = useState(false);
  const [multiProgrammesOpen, setMultiProgrammesOpen] = useState(false);

  const progsForLevel = CALC_DATA.filter((d) => d.level === selLevel);
  const prog = selProg || progsForLevel[0];
  const addingProgsForLevel = CALC_DATA.filter((d) => d.level === addingLevel);

  useEffect(() => {
    const p = CALC_DATA.filter((d) => d.level === selLevel);
    setSelProg(p[0]);
  }, [selLevel]);

  useEffect(() => {
    if (progCount === 1) {
      setSelectedProgs([]);
    } else if (prog && selectedProgs.length === 0) {
      setSelectedProgs([prog]);
    }
  }, [progCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const addProgramme = (p) => {
    if (selectedProgs.length < progCount) {
      setSelectedProgs((prev) => [...prev, p]);
    }
  };

  const removeProgramme = (index) => {
    setSelectedProgs((prev) => prev.filter((_, i) => i !== index));
  };

  const PATHWAY_FEE = 2500;

  const getDurationMonths = (duration, fallback = 6) => {
    const match = String(duration || "").match(/(\d+(?:\.\d+)?)/);
    if (match) return Math.max(1, Math.round(Number(match[1])));
    return Math.max(1, fallback);
  };

  const buildMonthlySchedule = (total, count, labelPrefix = "Month") => {
    const safeCount = Math.max(1, count);
    const base = Math.floor(total / safeCount);
    const remainder = total - base * safeCount;
    return Array.from({ length: safeCount }, (_, index) => {
      const amount = base + (index < remainder ? 1 : 0);
      return {
        label: `${labelPrefix} ${index + 1}`,
        amount: fmt(amount),
        detail: "Estimated monthly instalment",
      };
    });
  };

  const calcSingle = () => {
    if (!prog) return null;
    const t = prog.tuition;
    const regLabel = `${fmt(REG_FEE)} non-refundable reg`;

    if (selPlan === "Gold") {
      const ae = t + REG_FEE;
      return {
        plan: "Gold",
        grandTotal: fmt(ae),
        rawGrandTotal: ae,
        steps: [{ label: "At enrolment", amount: fmt(ae), detail: `${fmt(t)} training + ${regLabel}` }],
        note: "0% surcharge - best value option",
      };
    }
    if (selPlan === "Silver") {
      const st = Math.round(t * 1.15);
      const ep = Math.round(st * 0.6);
      const mp = st - ep;
      const ae = ep + REG_FEE;
      const durationMonths = getDurationMonths(prog.duration, prog.bronzeMonths || 6);
      const instalmentCount = Math.max(1, durationMonths - 1);
      const monthlyPreview = Math.ceil(mp / instalmentCount);
      return {
        plan: "Silver",
        grandTotal: fmt(ae + mp),
        rawGrandTotal: ae + mp,
        steps: [
          { label: "At enrolment", amount: fmt(ae), detail: `${fmt(ep)} (60% training) + ${regLabel}` },
          { label: `Remaining ${instalmentCount} monthly payments`, amount: `${fmt(monthlyPreview)}/mth`, detail: `${fmt(mp)} spread across ${instalmentCount} months` },
        ],
        schedule: buildMonthlySchedule(mp, instalmentCount, "Month"),
        note: "+15% surcharge on training only",
      };
    }
    const durationMonths = getDurationMonths(prog.duration, prog.bronzeMonths || 6);
    const instalmentCount = Math.max(1, durationMonths - 1);
    const bronzeT = Math.round(t * 1.2);
    const bronzeDeposit = Math.round(bronzeT * 0.2);
    const remaining = bronzeT - bronzeDeposit;
    const monthlyPreview = Math.ceil(remaining / instalmentCount);
    const ae = bronzeDeposit + REG_FEE;
    const gt = ae + remaining;
    return {
      plan: "Bronze",
      grandTotal: fmt(gt),
      rawGrandTotal: gt,
      steps: [
        { label: "At enrolment", amount: fmt(ae), detail: `${fmt(bronzeDeposit)} deposit + ${regLabel}` },
        { label: `Remaining ${instalmentCount} monthly payments`, amount: `${fmt(monthlyPreview)}/mth`, detail: `${fmt(remaining)} spread across ${instalmentCount} months` },
      ],
      schedule: buildMonthlySchedule(remaining, instalmentCount, "Month"),
      note: "+20% surcharge on training only",
    };
  };

  const calcMulti = () => {
    if (selectedProgs.length === 0) return null;
    const count = selectedProgs.length;
    const discountRate = count >= 4 ? 0.2 : count === 3 ? 0.15 : count === 2 ? 0.1 : 0;
    const needsPathwayFee = selPlan !== "Gold";
    const surchargeRate = selPlan === "Silver" ? 0.15 : selPlan === "Bronze" ? 0.2 : 0;
    const surchargeLabel = selPlan === "Silver" ? "+15%" : selPlan === "Bronze" ? "+20%" : "";

    let totalTuition = 0;
    let totalDiscount = 0;
    let totalSurcharge = 0;
    let totalReg = 0;
    let totalFinal = 0;

    const breakdown = selectedProgs.map((p) => {
      const tuition = p.tuition;
      const discount = Math.round(tuition * discountRate);
      const discounted = tuition - discount;
      const surcharge = Math.round(discounted * surchargeRate);
      const reg = REG_FEE;
      const lineTotal = discounted + surcharge + reg;
      totalTuition += tuition;
      totalDiscount += discount;
      totalSurcharge += surcharge;
      totalReg += reg;
      totalFinal += lineTotal;
      return { ...p, discount, surcharge, reg, lineTotal };
    });

    const pathwayFee = needsPathwayFee ? PATHWAY_FEE : 0;
    const grandTotal = totalFinal + pathwayFee;

    return {
      plan: selPlan,
      discountRate,
      surchargeRate,
      surchargeLabel,
      breakdown,
      totalTuition,
      totalDiscount,
      totalSurcharge,
      totalReg,
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
    padding: "12px",
    borderRadius: 8,
    border: `1px solid ${C.line}`,
    background: C.white,
    fontSize: 12,
    fontFamily: S.body,
    color: C.ink,
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 8,
    color: C.teal,
    letterSpacing: "1.4px",
    textTransform: "uppercase",
    fontFamily: S.body,
    fontWeight: 800,
    display: "block",
    marginBottom: 8,
  };

  const sectionCardStyle = {
    borderRadius: 8,
    padding: 12,
    border: `1px solid ${C.line}`,
  };

  return (
    <PageWrapper bg={C.mist}>
      <WideWrap style={{ paddingTop: 18, paddingBottom: 22 }}>
        <Shell>
          <div
            style={{
              background:
                "radial-gradient(circle at 16% 18%, rgba(10,110,138,0.20), transparent 30%), radial-gradient(circle at 90% 10%, rgba(196,145,18,0.14), transparent 24%), linear-gradient(135deg, #0b1630 0%, #122447 58%, #17345f 100%)",
              borderRadius: 8,
              padding: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: C.shadow,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(260px, 0.98fr) minmax(260px, 1.02fr)",
                gap: 12,
                alignItems: "center",
              }}
              className="resp-grid-2"
            >
              <Reveal>
                <div>
                  <Label dark>Fees and calculator</Label>
                  <h1
                    style={{
                      fontFamily: S.heading,
                      fontWeight: 800,
                      fontSize: "clamp(18px, 2.6vw, 22px)",
                      lineHeight: 1.12,
                      letterSpacing: -0.1,
                      margin: "8px 0 7px",
                      color: C.white,
                      maxWidth: 360,
                    }}
                  >
                    See exactly what you will pay before you enrol
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "rgba(255,255,255,0.78)",
                      maxWidth: 360,
                      fontFamily: S.body,
                    }}
                  >
                    Estimate your likely training cost, compare payment options, and choose a plan that fits your situation before you move into the application process.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <Btn
                      primary
                      onClick={() => setPage("Apply")}
                      style={{
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`,
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      Start Application
                    </Btn>
                    <Btn
                      onClick={() => setPage("Programmes")}
                      style={{
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      Browse Programmes
                    </Btn>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 0.92fr",
                    gap: 8,
                  }}
                  className="resp-grid-2"
                >
                  <div
                    style={{
                      minHeight: 196,
                      borderRadius: 8,
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <img src={IMAGES.hero} alt="Professional reviewing tuition planning and payment details" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(11,22,48,0.18) 0%, rgba(11,22,48,0.72) 100%)",
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <Label dark>Planning tools</Label>
                    </div>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontFamily: S.heading, fontSize: 15, lineHeight: 1.12, fontWeight: 800, color: C.white }}>
                        Clear pricing helps learners make decisions with less stress
                      </div>
                      <div style={{ marginTop: 7, color: "rgba(255,255,255,0.76)", fontSize: 11, lineHeight: 1.55, fontFamily: S.body }}>
                        Compare plans, understand totals, and move into enrolment with more confidence.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      minHeight: 196,
                      borderRadius: 8,
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: 9,
                      display: "flex",
                      alignItems: "end",
                      color: "rgba(255,255,255,0.82)",
                      fontWeight: 600,
                      lineHeight: 1.35,
                      fontSize: 10,
                      fontFamily: S.body,
                    }}
                  >
                    <img src={IMAGES.planning} alt="Learner planning study finances and payment options" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(11,22,48,0.12) 0%, rgba(11,22,48,0.7) 100%)",
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>Payment options</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Shell>
      </WideWrap>
      <section style={{ paddingTop: 18, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Intro
              tag="Payment plans"
              title="Choose the payment path that fits your situation"
              desc={
                <span style={{ color: "#b42318", fontWeight: 800 }}>
                  {`J$${REG_FEE.toLocaleString()} non-refundable registration fee applies to each course, in addition to the training fee. Multi-programme discounts apply to training fees only, not registration fees. Surcharges also apply to training only, and the calculator below follows those same pricing rules.`}
                </span>
              }
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 12 }} className="resp-grid-3">
              {["Gold", "Silver", "Bronze"].map((plan) => (
                <Reveal key={plan}>
                  <PlanCard plan={plan} active={selPlan === plan} disabled={false} onClick={() => setSelPlan(plan)} />
                </Reveal>
              ))}
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 4, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.14fr) minmax(260px, 0.86fr)", gap: 10, alignItems: "start", marginBottom: 12 }} className="resp-grid-2">
              <Reveal>
                <div style={{ background: C.white, borderRadius: 8, padding: 14, border: `1px solid ${C.line}`, boxShadow: "0 8px 18px rgba(11,22,48,0.04)" }}>
                  <div style={{ fontSize: 8, color: C.teal, letterSpacing: "1.4px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 6 }}>
                    Quote builder
                  </div>
                  <div style={{ fontFamily: S.heading, fontSize: "clamp(22px, 3vw, 30px)", color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 14 }}>
                    Build your quote
                  </div>

                  {progCount === 1 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 14, alignItems: "start", marginBottom: 8 }} className="resp-grid-2">
                      <div>
                        <div style={{ ...sectionCardStyle, background: "rgba(28,123,71,0.30)", borderColor: "rgba(28,123,71,0.42)", marginBottom: 12 }}>
                          <label style={{ ...labelStyle, color: C.green }}>1. How many programmes are you enrolling in?</label>
                          <div style={{ display: "flex", gap: 8, marginBottom: 0, flexWrap: "wrap" }}>
                            {[
                              { n: 1, label: "1" },
                              { n: 2, label: "2 (10% off)" },
                              { n: 3, label: "3 (15% off)" },
                              { n: 4, label: "4+ (20% off)" },
                            ].map((opt) => (
                              <OptionButton key={opt.n} active={progCount === opt.n} onClick={() => { setProgCount(opt.n); setSelectedProgs([]); }}>
                                {opt.label}
                              </OptionButton>
                            ))}
                          </div>
                        </div>

                        <div style={{ ...sectionCardStyle, background: "rgba(196,145,18,0.24)", borderColor: "rgba(196,145,18,0.36)" }}>
                          <label style={{ ...labelStyle, color: C.gold }}>2. Select payment plan</label>
                          <div style={{ display: "flex", gap: 8, marginBottom: 0, flexWrap: "wrap" }}>
                            {["Gold", "Silver", "Bronze"].map((plan) => (
                              <OptionButton key={plan} active={selPlan === plan} onClick={() => setSelPlan(plan)}>
                                {plan}
                              </OptionButton>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ ...sectionCardStyle, background: "rgba(10,110,138,0.34)", borderColor: "rgba(10,110,138,0.44)" }}>
                          <label style={{ ...labelStyle, color: C.teal }}>3. Select your level</label>
                          <select value={selLevel} onChange={(e) => setSelLevel(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
                            {levels.map((l) => (
                              <option key={l}>{cleanText(l)}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => setSingleProgrammesOpen((prev) => !prev)}
                            style={{
                              width: "100%",
                              borderRadius: 8,
                              border: `1px solid ${C.line}`,
                              background: singleProgrammesOpen ? "rgba(10,110,138,0.12)" : C.white,
                              padding: "12px",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                              <div>
                                <div style={{ ...labelStyle, marginBottom: 4 }}>4. Choose programme</div>
                                <div style={{ fontSize: 11, color: C.ink, fontFamily: S.body, fontWeight: 700 }}>{cleanText(prog?.name || "Select a programme")}</div>
                              </div>
                              <span style={{ fontSize: 14, color: C.inkSoft, fontWeight: 800 }}>{singleProgrammesOpen ? "-" : "+"}</span>
                            </div>
                          </button>

                          {singleProgrammesOpen && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                              {progsForLevel.map((p) => (
                                <button
                                  key={p.name}
                                  onClick={() => setSelProg(p)}
                                  style={{
                                    padding: "12px",
                                    borderRadius: 8,
                                    border: `1px solid ${prog?.name === p.name ? C.teal : C.line}`,
                                    background: prog?.name === p.name ? "rgba(10,110,138,0.08)" : C.white,
                                    color: C.ink,
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "0.2s",
                                  }}
                                >
                                  <div style={{ fontSize: 11, fontWeight: prog?.name === p.name ? 800 : 600, fontFamily: S.body }}>{cleanText(p.name)}</div>
                                  <div style={{ fontSize: 10, color: C.inkSoft, marginTop: 4, fontFamily: S.body }}>Base tuition: {fmt(p.tuition)}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label style={labelStyle}>1. How many programmes are you enrolling in?</label>
                      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                        {[
                          { n: 1, label: "1" },
                          { n: 2, label: "2 (10% off)" },
                          { n: 3, label: "3 (15% off)" },
                          { n: 4, label: "4+ (20% off)" },
                        ].map((opt) => (
                          <OptionButton key={opt.n} active={progCount === opt.n} onClick={() => { setProgCount(opt.n); setSelectedProgs([]); }}>
                            {opt.label}
                          </OptionButton>
                        ))}
                      </div>

                      <label style={labelStyle}>2. Select payment plan</label>
                      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                        {["Gold", "Silver", "Bronze"].map((plan) => (
                          <OptionButton key={plan} active={selPlan === plan} onClick={() => setSelPlan(plan)}>
                            {plan}
                          </OptionButton>
                        ))}
                      </div>
                    </>
                  )}

                  {progCount > 1 && (
                    <>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.green,
                          fontFamily: S.body,
                          marginBottom: 12,
                          padding: "10px 12px",
                          background: "rgba(28,123,71,0.10)",
                          borderRadius: 8,
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        Select all {progCount} programmes below to see your combined quote with {progCount >= 4 ? "20%" : progCount === 3 ? "15%" : "10%"} discount on each.
                        {selPlan !== "Gold" && <span> A one-time <strong>J$2,500 pathway fee</strong> applies to lock in the discount.</span>}
                      </div>

                      {selectedProgs.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>Your programmes ({selectedProgs.length}/{progCount})</label>
                          {selectedProgs.map((p, i) => (
                            <div
                              key={`${p.name}-${i}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 12px",
                                marginBottom: 6,
                                borderRadius: 8,
                                background: "rgba(10,110,138,0.08)",
                                border: "1px solid rgba(10,110,138,0.16)",
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, fontFamily: S.body }}>{cleanText(p.name)}</div>
                                <div style={{ fontSize: 10, color: C.inkSoft, fontFamily: S.body }}>{cleanText(p.level)} · Tuition: {fmt(p.tuition)}</div>
                              </div>
                              <button onClick={() => removeProgramme(i)} style={{ background: "none", border: "none", color: C.inkSoft, cursor: "pointer", fontSize: 14, padding: "4px 8px" }}>
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedProgs.length < progCount && (
                        <>
                          <button
                            onClick={() => setMultiProgrammesOpen((prev) => !prev)}
                            style={{
                              width: "100%",
                              borderRadius: 8,
                              border: `1px solid ${C.line}`,
                              background: multiProgrammesOpen ? "rgba(10,110,138,0.08)" : C.white,
                              padding: "12px",
                              cursor: "pointer",
                              textAlign: "left",
                              marginBottom: 10,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                              <div>
                                <div style={labelStyle}>{selectedProgs.length === 0 ? "3. Add your programmes" : `Add programme ${selectedProgs.length + 1} of ${progCount}`}</div>
                                <div style={{ fontSize: 11, color: C.ink, fontFamily: S.body, fontWeight: 700 }}>Open the subject list only when you need it</div>
                              </div>
                              <span style={{ fontSize: 14, color: C.inkSoft, fontWeight: 800 }}>{multiProgrammesOpen ? "-" : "+"}</span>
                            </div>
                          </button>

                          {multiProgrammesOpen && (
                            <>
                              <select value={addingLevel} onChange={(e) => setAddingLevel(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }}>
                                {levels.map((l) => (
                                  <option key={l}>{cleanText(l)}</option>
                                ))}
                              </select>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                                {addingProgsForLevel.map((p) => (
                                  <button
                                    key={p.name}
                                    onClick={() => addProgramme(p)}
                                    style={{
                                      padding: "12px",
                                      borderRadius: 8,
                                      border: `1px solid ${C.line}`,
                                      background: C.mist,
                                      color: C.ink,
                                      cursor: "pointer",
                                      textAlign: "left",
                                      transition: "0.2s",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 600, fontFamily: S.body }}>{cleanText(p.name)}</div>
                                      <div style={{ fontSize: 10, color: C.inkSoft, fontFamily: S.body }}>Tuition: {fmt(p.tuition)}</div>
                                    </div>
                                    <span style={{ color: C.teal, fontWeight: 800, fontSize: 16 }}>+</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {selectedProgs.length > 0 && selectedProgs.length < progCount && (
                        <div
                          style={{
                            fontSize: 10,
                            color: "#8a5d12",
                            fontFamily: S.body,
                            padding: "10px 12px",
                            background: "rgba(196,145,18,0.12)",
                            borderRadius: 8,
                            fontWeight: 600,
                            lineHeight: 1.6,
                          }}
                        >
                          Select {progCount - selectedProgs.length} more programme{progCount - selectedProgs.length > 1 ? "s" : ""} to see your full quote.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Reveal>

              {progCount === 1 && result && (
                <Reveal>
                  <div
                    style={{
                      background: C.navy,
                      borderRadius: 8,
                      padding: 14,
                      position: "sticky",
                      top: "100px",
                      boxShadow: "0 16px 34px rgba(11,22,48,0.16)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: 8, color: C.gold, letterSpacing: "1.4px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: "6px" }}>
                        Your formal quote
                      </div>
                      <div style={{ fontSize: "15px", color: C.white, fontFamily: S.heading, fontWeight: 800, marginBottom: "4px", lineHeight: 1.3 }}>
                        {cleanText(prog?.name)}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", fontFamily: S.body, fontWeight: 700, marginBottom: "12px" }}>
                        {result.plan} Plan
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        {result.steps.map((step, i) => (
                          <div key={i} style={{ padding: "12px 0", borderBottom: i < result.steps.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: "4px" }}>
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.82)", fontFamily: S.body, fontWeight: 700 }}>{step.label}</span>
                              <span style={{ fontSize: "16px", fontWeight: 800, color: C.gold, fontFamily: S.heading, textAlign: "right" }}>{step.amount}</span>
                            </div>
                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.54)", fontFamily: S.body, lineHeight: 1.5 }}>{step.detail}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.2)" }}>
                        <SummaryRow label="Total (USD estimate)" value={`US$${Math.round(result.rawGrandTotal / USD_RATE).toLocaleString()}`} strong />
                        <SummaryRow label="Total (JMD)" value={result.grandTotal} accent={C.gold} />
                        {result.note && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.54)", fontFamily: S.body, marginTop: 8, textAlign: "right", fontStyle: "italic" }}>{result.note}</div>}
                        {result.schedule?.length > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                            <div style={{ fontSize: 8, color: C.gold, letterSpacing: "1.4px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>
                              Forward payment path
                            </div>
                            {result.schedule.map((item, index) => (
                              <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: index < result.schedule.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.72)", fontFamily: S.body }}>{item.label}</span>
                                <span style={{ fontSize: 11, color: C.white, fontFamily: S.body, fontWeight: 700 }}>{item.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: 14, display: "flex", gap: 8, flexDirection: "column" }}>
                        <Btn primary onClick={() => setPage("Apply")} style={{ color: C.white, background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`, width: "100%", padding: "12px", fontSize: "11px", border: "none", borderRadius: 8 }}>
                          Apply for This Programme
                        </Btn>
                        <WhatsAppShare text={`CTS ETS Fees: ${cleanText(prog?.name)} - ${result.plan}: ${result.grandTotal} | ctsetsjm.com`} label="Share Quote via WhatsApp" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}

              {progCount > 1 && multiResult && multiResult.complete && (
                <Reveal>
                  <div
                    style={{
                      background: C.navy,
                      borderRadius: 8,
                      padding: 14,
                      position: "sticky",
                      top: "100px",
                      boxShadow: "0 16px 34px rgba(11,22,48,0.16)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: "8px", color: C.gold, letterSpacing: "1.4px", textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: "6px" }}>
                        Combined quote - {multiResult.count} programmes
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", fontFamily: S.body, fontWeight: 700, marginBottom: "12px" }}>
                        {multiResult.plan} Plan · {Math.round(multiResult.discountRate * 100)}% multi-programme discount{multiResult.surchargeLabel ? ` · ${multiResult.surchargeLabel} surcharge` : ""}
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        {multiResult.breakdown.map((item, i) => (
                          <div key={i} style={{ padding: "10px 0", borderBottom: i < multiResult.breakdown.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: C.white, fontFamily: S.body }}>{cleanText(item.name)}</div>
                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: 2 }}>{cleanText(item.level)}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, fontFamily: S.heading }}>{fmt(item.lineTotal)}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: S.body, lineHeight: 1.5 }}>
                              Tuition {fmt(item.tuition)}{item.discount > 0 ? ` - ${fmt(item.discount)} discount` : ""}{item.surcharge > 0 ? ` + ${fmt(item.surcharge)} surcharge` : ""} + {fmt(item.reg)} reg
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.2)" }}>
                        <SummaryRow label="Total tuition" value={fmt(multiResult.totalTuition)} />
                        {multiResult.totalDiscount > 0 && <SummaryRow label={`Discount (${Math.round(multiResult.discountRate * 100)}%)`} value={`-${fmt(multiResult.totalDiscount)}`} accent={C.green} />}
                        {multiResult.totalSurcharge > 0 && <SummaryRow label={`${multiResult.plan} surcharge`} value={`+${fmt(multiResult.totalSurcharge)}`} />}
                        <SummaryRow label={`Registration (${multiResult.count} x ${fmt(REG_FEE)})`} value={fmt(multiResult.totalReg)} />
                        {multiResult.pathwayFee > 0 && <SummaryRow label="Pathway fee (one-time)" value={fmt(multiResult.pathwayFee)} />}
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.15)" }} />
                        <SummaryRow label="Grand total (USD)" value={`US$${Math.round(multiResult.grandTotal / USD_RATE).toLocaleString()}`} strong />
                        <SummaryRow label="Grand total (JMD)" value={fmt(multiResult.grandTotal)} accent={C.gold} />
                        {multiResult.totalDiscount > 0 && <div style={{ fontSize: 10, color: C.green, fontFamily: S.body, marginTop: 8, textAlign: "right", fontWeight: 700 }}>You save {fmt(multiResult.totalDiscount)} on tuition</div>}
                        {multiResult.pathwayFee > 0 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: 6, textAlign: "right", fontStyle: "italic" }}>Pathway fee is one-time and locks in your discount. Pay in full (Gold) to waive it.</div>}
                      </div>

                      <div style={{ marginTop: 14, display: "flex", gap: 8, flexDirection: "column" }}>
                        <Btn primary onClick={() => setPage("Apply")} style={{ color: C.white, background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`, width: "100%", padding: "12px", fontSize: "11px", border: "none", borderRadius: 8 }}>
                          Apply Now
                        </Btn>
                        <WhatsAppShare text={`CTS ETS Quote: ${multiResult.count} programmes (${multiResult.plan}, ${Math.round(multiResult.discountRate * 100)}% off) - Total: ${fmt(multiResult.grandTotal)} | ctsetsjm.com`} label="Share Quote via WhatsApp" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 4, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Reveal>
              <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(196,145,18,0.12)", border: "1px solid rgba(196,145,18,0.22)", fontSize: "11px", color: C.ink, fontFamily: S.body, lineHeight: 1.6, marginBottom: 12 }}>
                <strong>Prices current as of April 2026</strong> and subject to change. Confirmed enrolments are honoured at the agreed rate. NCTVET registration and assessment fees are arranged through HEART/NSTA and are set by NCTVET where necessary.
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 0.86fr) minmax(0, 1.14fr)", gap: 10, alignItems: "center", marginBottom: 12 }} className="resp-grid-2">
              <Reveal>
                <div style={{ background: C.white, borderRadius: 8, padding: 12, border: `1px solid ${C.line}`, boxShadow: "0 8px 18px rgba(11,22,48,0.04)" }}>
                  <div style={{ width: "100%", height: 220, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                    <img src={IMAGES.planning} alt="Planning tuition and study costs with clarity" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontFamily: S.heading, fontSize: 14, color: C.ink, fontWeight: 700, marginBottom: 6 }}>Plan with clarity before you commit</div>
                  <p style={{ fontFamily: S.body, fontSize: 11, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>
                    A strong fees page helps learners understand the numbers, compare payment pathways, and feel less uncertainty about the next step.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                  <TestimonialCard t={TESTIMONIALS[4]} />
                </div>
              </Reveal>
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 22 }}>
        <WideWrap>
          <Shell>
            <Reveal>
              <div
                style={{
                  background: "linear-gradient(135deg, #0b1630 0%, #17345f 100%)",
                  borderRadius: 8,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: C.shadow,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 1fr) auto", gap: 10, alignItems: "center" }} className="resp-grid-2">
                  <div>
                    <div style={{ color: C.gold, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 800, fontSize: 8, marginBottom: 7, fontFamily: S.body }}>
                      Need help choosing?
                    </div>
                    <div style={{ fontFamily: S.heading, fontWeight: 800, fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.12, color: C.white }}>
                      Move from pricing clarity to enrolment more easily
                    </div>
                    <div style={{ marginTop: 5, color: "rgba(255,255,255,0.78)", fontSize: 11, lineHeight: 1.5, fontFamily: S.body }}>
                      Once you understand your likely cost, the next step should feel simple. Apply, ask a question, or browse programmes again before making your decision.
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Btn primary onClick={() => setPage("Apply")} style={{ minHeight: 34, padding: "0 12px", borderRadius: 8, background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`, color: C.white, fontWeight: 700, fontSize: 11 }}>
                      Apply Now
                    </Btn>
                    <Btn onClick={() => setPage("Contact")} style={{ minHeight: 34, padding: "0 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: C.white, fontWeight: 700, fontSize: 11 }}>
                      Ask a Question
                    </Btn>
                  </div>
                </div>
              </div>
            </Reveal>
            <PageScripture page="fees" />
          </Shell>
        </WideWrap>
      </section>
    </PageWrapper>
  );
}

