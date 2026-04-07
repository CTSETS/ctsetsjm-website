import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { BOOKING_URLS, REG_FEE, WIPAY_CONFIG, APPS_SCRIPT_URL } from "../constants/config";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";
import { PaymentSecurityNotice, HoneypotField } from "../components/shared/DisplayComponents";
import { fmt } from "../utils/formatting";
import OTPGate from "../components/common/OTPGate";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
  online: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  bank: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
};

const TUITION_MAP = {
  "Job / Professional Certificates": 5000,
  "Level 2 — Vocational Certificate": 15000,
  "Level 3 — Diploma": 25000,
  "Level 4 — Associate Equivalent": 35000,
  "Level 5 — Bachelor's Equivalent": 45000,
};

function getTuition(level) {
  if (!level) return 5000;
  if (TUITION_MAP[level] !== undefined) return TUITION_MAP[level];
  const l = level.toLowerCase();
  if (l.includes("level 5") || l.includes("bachelor")) return 45000;
  if (l.includes("level 4") || l.includes("associate")) return 35000;
  if (l.includes("level 3") || l.includes("diploma")) return 25000;
  if (l.includes("level 2") || l.includes("vocational")) return 15000;
  return 5000;
}

function calcPricing(level) {
  const tuition = getTuition(level);
  const l3plus = level ? level.indexOf("Level 3") >= 0 || level.indexOf("Level 4") >= 0 || level.indexOf("Level 5") >= 0 : false;
  const regFee = REG_FEE || 5000;
  const plans = [{
    name: "Gold",
    label: "Pay in Full",
    total: regFee + tuition,
    minDue: regFee + tuition,
    breakdown: [
      { label: "Registration Fee", value: regFee, dueNow: true },
      { label: "Tuition (No Surcharge)", value: tuition, dueNow: true },
    ],
  }];

  if (l3plus) {
    const silverTuition = Math.round(tuition * 1.1);
    const silverFirst = Math.round(silverTuition * 0.6);
    const silverSecond = silverTuition - silverFirst;
    plans.push({
      name: "Silver",
      label: "60/40 Split",
      total: regFee + silverTuition,
      minDue: regFee + silverFirst,
      breakdown: [
        { label: "Registration Fee", value: regFee, dueNow: true },
        { label: "1st Tuition Payment (60%)", value: silverFirst, dueNow: true },
        { label: "Final Tuition Payment (40%)", value: silverSecond, dueNow: false },
      ],
    });

    const bronzeTuition = Math.round(tuition * 1.15);
    const bronzeDeposit = Math.round(bronzeTuition * 0.2);
    const bronzeBalance = bronzeTuition - bronzeDeposit;
    plans.push({
      name: "Bronze",
      label: "20% Deposit + Monthly",
      total: regFee + bronzeTuition,
      minDue: regFee + bronzeDeposit,
      breakdown: [
        { label: "Registration Fee", value: regFee, dueNow: true },
        { label: "Tuition Deposit (20%)", value: bronzeDeposit, dueNow: true },
        { label: "Remaining Balance (Paid Monthly)", value: bronzeBalance, dueNow: false },
      ],
    });
  }
  return { tuition, regFee, plans };
}

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
        marginBottom: 24,
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
            fontSize: "clamp(28px, 4vw, 46px)",
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
          lineHeight: 1.82,
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

function PlanCard({ plan, active, onClick }) {
  const meta = {
    Gold: { color: S.gold, bg: S.goldLight, badge: "Best value" },
    Silver: { color: S.teal, bg: S.tealLight },
    Bronze: { color: S.coral, bg: S.coralLight },
  }[plan.name] || { color: S.navy, bg: S.lightBg };

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "22px 20px",
        borderRadius: 20,
        border: `2px solid ${active ? meta.color : S.border}`,
        background: active ? meta.bg : S.white,
        cursor: "pointer",
        transition: "all 0.22s ease",
        boxShadow: active ? `0 16px 34px ${meta.color}16` : "0 8px 22px rgba(15,23,42,0.04)",
        position: "relative",
      }}
    >
      {meta.badge && (
        <div style={{ position: "absolute", top: -10, right: 16, padding: "5px 10px", borderRadius: 999, background: meta.color, color: S.white, fontSize: 10, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", fontFamily: S.body }}>
          {meta.badge}
        </div>
      )}
      <div style={{ fontSize: 11, color: meta.color, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>{plan.name} Plan</div>
      <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 6 }}>{plan.label}</div>
      <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7, marginBottom: 12 }}>Total: {fmt(plan.total)}</div>
      <div style={{ fontSize: 13, color: S.navy, fontFamily: S.body, fontWeight: 700 }}>Minimum due now: {fmt(plan.minDue)}</div>
    </button>
  );
}

function BreakdownRow({ item, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: last ? "none" : `1px dashed ${S.border}`, alignItems: "center" }}>
      <div style={{ fontSize: 13, color: item.dueNow ? S.navy : S.gray, fontFamily: S.body, fontWeight: item.dueNow ? 700 : 500 }}>{item.label}</div>
      <div style={{ fontSize: 14, color: item.dueNow ? S.navy : S.gray, fontFamily: S.body, fontWeight: 800 }}>{fmt(item.value)}</div>
    </div>
  );
}

function TrackerLookup({ refInput, setRefInput, handleLookup, lookupState, lookupMsg }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      <input
        type="text"
        value={refInput}
        onChange={(e) => setRefInput(e.target.value.toUpperCase())}
        placeholder="CTSETSA-..."
        style={{ flex: 1, minWidth: 220, padding: 14, borderRadius: 10, border: `1px solid ${S.border}`, background: S.white, fontFamily: S.body, fontSize: 14 }}
      />
      <button
        id="otp-auto-lookup"
        onClick={handleLookup}
        disabled={lookupState === "loading"}
        style={{ padding: "14px 24px", borderRadius: 10, background: S.navy, color: S.white, border: "none", fontWeight: 700, fontFamily: S.body, cursor: lookupState === "loading" ? "wait" : "pointer" }}
      >
        {lookupState === "loading" ? "Searching..." : "Look Up"}
      </button>
      {lookupMsg && <div style={{ width: "100%", fontSize: 13, color: S.coral, fontFamily: S.body }}>{lookupMsg}</div>}
    </div>
  );
}

function MethodCard({ active, onClick, icon, title, desc }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 22,
        borderRadius: 20,
        border: active ? `2px solid ${S.navy}` : `1px solid ${S.border}`,
        background: active ? S.lightBg : S.white,
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "left",
        boxShadow: active ? "0 14px 30px rgba(15,23,42,0.06)" : "0 8px 20px rgba(15,23,42,0.03)",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 800, color: S.navy, fontSize: 18, fontFamily: S.heading, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7 }}>{desc}</div>
    </button>
  );
}

function SuccessState({ userPayAmount, setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <WideWrap style={{ paddingTop: 56 }}>
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: S.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 20px", border: `3px solid ${S.emerald}` }}>✓</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,42px)", color: S.navy, fontWeight: 800, marginBottom: 12 }}>Payment Evidence Submitted</h2>
            <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, marginBottom: 28 }}>Our team will verify your payment of <strong>{fmt(userPayAmount)}</strong> within 48–72 hours.</p>
            <div style={{ background: S.white, borderRadius: 22, padding: 28, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)", marginBottom: 28, textAlign: "left" }}>
              <div style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 800, marginBottom: 12 }}>What happens next?</div>
              {["Your receipt is reviewed by the CTS ETS team.", "Your payment is matched to your application or student record.", "You will be contacted if additional information is needed.", "Your status will be updated after verification."].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: S.teal, color: S.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{idx + 1}</div>
                  <div style={{ fontSize: 13, color: S.gray, lineHeight: 1.7, fontFamily: S.body }}>{item}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Home")} style={{ background: S.teal, color: S.white, borderRadius: 12 }}>Return Home</Btn>
              <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 12, border: `2px solid ${S.teal}`, color: S.teal }}>Contact Support</Btn>
            </div>
          </div>
        </Reveal>
        <PageScripture page="fees" />
      </WideWrap>
    </PageWrapper>
  );
}

export default function PaymentPage({ setPage }) {
  const [verifiedId, setVerifiedId] = useState(null);
  const [refInput, setRefInput] = useState("");
  const [lookupState, setLookupState] = useState("idle");
  const [student, setStudent] = useState(null);
  const [lookupMsg, setLookupMsg] = useState("");
  const [pricing, setPricing] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("Gold");
  const [payMethod, setPayMethod] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hp, setHp] = useState("");
  const startTime = useRef(Date.now());
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("?")) {
      const queryString = hash.split("?")[1];
      const urlParams = new URLSearchParams(queryString);
      const passedRef = urlParams.get("ref");
      if (passedRef) {
        setVerifiedId(passedRef);
        setRefInput(passedRef);
      }
      window.history.replaceState(null, "", "/#pay");
    }
  }, []);

  useEffect(() => {
    if (verifiedId && lookupState === "idle") {
      setRefInput(verifiedId);
      setTimeout(() => {
        const lookupBtn = document.getElementById("otp-auto-lookup");
        if (lookupBtn) lookupBtn.click();
      }, 300);
    }
  }, [verifiedId, lookupState]);

  useEffect(() => {
    if (student && student.level) setPricing(calcPricing(student.level));
  }, [student]);

  const currentPlanObj = pricing?.plans.find((p) => p.name === selectedPlan);

  useEffect(() => {
    if (currentPlanObj) {
      let min = currentPlanObj.minDue;
      if (student?.totalPaid >= min) min = 5000;
      setCustomAmount(min.toString());
    }
  }, [selectedPlan, pricing, student]);

  const handleLookup = async () => {
    const val = refInput.trim().toUpperCase();
    if (!val) return;
    setLookupState("loading");
    setStudent(null);
    setLookupMsg("");
    setPricing(null);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=lookupstudent&ref=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found) {
          setStudent(data);
          setLookupState("found");
        } else {
          setLookupState("not_found");
          setLookupMsg("No application found.");
        }
      } else {
        setLookupState("error");
        setLookupMsg("Server error.");
      }
    } catch {
      setLookupState("error");
      setLookupMsg("Connection error.");
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  const paidAlready = student?.totalPaid || 0;
  const baseMinDue = currentPlanObj?.minDue || 0;
  const actualMinDue = paidAlready >= baseMinDue ? 5000 : baseMinDue - paidAlready;
  const userPayAmount = Number(customAmount) || 0;
  const remainingTotal = (currentPlanObj?.total || 0) - paidAlready;
  const isAmountValid = userPayAmount >= actualMinDue && userPayAmount > 0;

  const handlePaymentSubmit = async () => {
    if (hp || Date.now() - startTime.current < 3000 || !isAmountValid || !receipt || !student) return;
    setSubmitting(true);
    try {
      const b64 = await toBase64(receipt);
      const fileData = [{ slot: "paymentReceipt", name: receipt.name, type: receipt.type, data: b64 }];
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "submitpayment",
          form_type: "Payment Evidence",
          ref: student.ref,
          studentName: student.name,
          email: student.email,
          paymentPlan: selectedPlan,
          amountPaid: userPayAmount,
          paymentMethod: payMethod,
          files: fileData,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) setSubmitted(true);
      else alert("Upload failed. Please check your internet connection and try again.");
    } catch {
      alert("A network error occurred. Please try again.");
    }
    setSubmitting(false);
  };

  const handleWiPaySubmit = () => {
    if (submitting || !student || !currentPlanObj || !isAmountValid) return;
    setSubmitting(true);
    const orderId = student.ref + "-" + selectedPlan.substring(0, 3).toUpperCase();
    const payAmount = userPayAmount.toString();
    const paymentDescription = `Ref: ${orderId} | Name: ${student.name} | Email: ${student.email || "Not Provided"}`;
    try {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "submitpayment",
          form_type: "WiPay Payment Attempt",
          ref: student.ref,
          studentName: student.name,
          email: student.email,
          paymentPlan: selectedPlan,
          amountPaid: userPayAmount,
          paymentMethod: "online",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {}
    if (WIPAY_CONFIG.baseUrl.includes("/to_me/")) {
      let base = WIPAY_CONFIG.baseUrl;
      if (base.endsWith("/")) base = base.slice(0, -1);
      window.location.href = `${base}/${payAmount}/${encodeURIComponent(paymentDescription)}`;
    } else {
      window.location.href = `${WIPAY_CONFIG.baseUrl}?total=${encodeURIComponent(payAmount)}&currency=${encodeURIComponent(WIPAY_CONFIG.currency)}&order_id=${encodeURIComponent(orderId)}&return_url=${encodeURIComponent(WIPAY_CONFIG.returnUrl)}`;
    }
  };

  if (submitted) return <SuccessState userPayAmount={userPayAmount} setPage={setPage} />;

  if (!verifiedId) {
    return (
      <PageWrapper bg={S.lightBg}>
        <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
          <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(360px, 0.95fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
              <Reveal>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Payment Centre</div>
                  <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 68px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>Secure payment access starts with identity verification</h1>
                  <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: 0 }}>Enter through the same OTP-protected route, confirm your record, and then choose the payment path that fits your situation.</p>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                  <div style={{ width: "100%", height: 420, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                    <img src={PEOPLE.hero} alt="Professional making a secure digital payment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                      <div style={{ fontSize: 22, marginBottom: 8 }}>🔐</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>OTP-protected access</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                      <div style={{ fontSize: 22, marginBottom: 8 }}>🧾</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Clear payment paths</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </WideWrap>
        </div>
        <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></WideWrap>
        <section style={{ paddingTop: 34 }}>
          <WideWrap>
            <SectionIntro tag="Access Verification" title="Enter the payment centre securely" desc="The OTP gate remains intact. The layout is simply clearer and more supportive so users understand why access is protected before they proceed." accent={S.teal} />
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)", gap: 24, alignItems: "start" }} className="resp-grid-2">
              <Reveal>
                <div style={{ background: S.white, borderRadius: 24, padding: "32px clamp(22px,4vw,38px)", border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                  <OTPGate purpose="payment" title="Payment Centre Access">
                    {(id) => {
                      setVerifiedId(id);
                      return <div>Identity verified.</div>;
                    }}
                  </OTPGate>
                </div>
              </Reveal>
              <div style={{ display: "grid", gap: 18 }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: 22, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Why the extra step?</div>
                  <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>Payment access is tied to the correct student or application record so fees, receipts, and payment history stay connected to the right person.</p>
                </div>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: 22, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Need support before you pay?</div>
                  <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, marginBottom: 14 }}>If your payment path is unclear, contact the CTS ETS team before proceeding.</p>
                  <a href={BOOKING_URLS.general} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 18px", borderRadius: 12, background: S.teal, color: S.white, textDecoration: "none", fontFamily: S.body, fontSize: 13, fontWeight: 700 }}>Book a Consultation</a>
                </div>
              </div>
            </div>
            <PageScripture page="fees" />
          </WideWrap>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Payment Centre</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 70px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>Pay online or submit bank transfer evidence with more clarity</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 22px" }}>Choose a payment plan, confirm the amount due, and either pay securely online or upload your bank transfer evidence for review.</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 420, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.online} alt="Professional reviewing a secure online payment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>💳</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Online checkout</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🏦</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Bank transfer upload</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <SectionIntro tag="Payment Workflow" title="The same payment logic, presented more clearly" desc="Lookup, pricing rules, plan selection, custom payment amounts, WiPay redirection, and receipt submission are all preserved. The layout is simply wider and easier to follow." accent={S.teal} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)", gap: 28, alignItems: "start" }} className="resp-grid-2">
            <div>
              <div style={{ background: S.white, borderRadius: 22, padding: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)", marginBottom: 22 }}>
                <SectionIntro tag="Lookup & Verification" title="Find your student or application record first" desc="Payment is matched to the correct record before any amount is processed or submitted." accent={S.teal} />
                <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />
                <TrackerLookup refInput={refInput} setRefInput={setRefInput} handleLookup={handleLookup} lookupState={lookupState} lookupMsg={lookupMsg} />
                {lookupState === "found" && student && (
                  <div style={{ padding: "18px 20px", background: S.lightBg, borderRadius: 16, border: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 11, color: S.teal, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Student Profile</div>
                    <div style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 800, marginBottom: 6 }}>{student.name}</div>
                    <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7 }}>{student.level}{student.ref ? ` · ${student.ref}` : ""}</div>
                  </div>
                )}
              </div>

              {lookupState === "found" && student && pricing && (
                <>
                  <div style={{ marginBottom: 22 }}>
                    <SectionIntro tag="Plan Selection" title="Choose your payment plan" desc="Gold, Silver, and Bronze remain exactly as configured in your current pricing logic." accent={S.coral} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                      {pricing.plans.map((plan) => <PlanCard key={plan.name} plan={plan} active={selectedPlan === plan.name} onClick={() => setSelectedPlan(plan.name)} />)}
                    </div>
                  </div>

                  {currentPlanObj && (
                    <div style={{ background: S.white, borderRadius: 22, padding: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)", marginBottom: 24 }}>
                      <div style={{ fontSize: 11, color: S.violet, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>{currentPlanObj.name} Plan Breakdown</div>
                      <div style={{ background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 16, padding: 18, marginBottom: 18 }}>
                        {currentPlanObj.breakdown.map((item, i) => <BreakdownRow key={i} item={item} last={i === currentPlanObj.breakdown.length - 1} />)}
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 14, marginTop: 8, borderTop: `2px solid ${S.border}` }}><span style={{ color: S.navy, fontWeight: 800, fontFamily: S.body }}>Total Program Cost</span><strong style={{ color: S.navy, fontSize: 16, fontFamily: S.heading }}>{fmt(currentPlanObj.total)}</strong></div>
                      </div>

                      {paidAlready > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, padding: "12px 16px", background: S.emeraldLight, borderRadius: 12, border: `1px solid ${S.emerald}30`, fontSize: 14 }}>
                          <span style={{ color: S.emeraldDark, fontWeight: 700, fontFamily: S.body }}>Total Paid to Date</span>
                          <strong style={{ color: S.emeraldDark, fontFamily: S.body }}>{fmt(paidAlready)}</strong>
                        </div>
                      )}

                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 11, fontWeight: 800, color: S.navy, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.3, fontFamily: S.body }}>
                          <span>Amount to Pay Today (JMD)</span>
                          <span style={{ color: S.emerald, fontSize: 11, background: S.emeraldLight, padding: "4px 8px", borderRadius: 999, textTransform: "none", letterSpacing: 0 }}>Min due: {fmt(actualMinDue)}</span>
                        </label>
                        <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginBottom: 8 }}>You can increase this amount if you want to pay more than the minimum due today.</div>
                        <input type="number" min={actualMinDue} max={remainingTotal} value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} style={{ width: "100%", padding: 16, fontSize: 26, fontWeight: 900, borderRadius: 12, border: !isAmountValid ? `2px solid ${S.coral}` : `2px solid ${S.emerald}`, background: S.white, color: S.navy, outline: "none", fontFamily: S.heading, boxSizing: "border-box" }} />
                        {!isAmountValid && <div style={{ color: S.coral, fontSize: 12, marginTop: 8, fontWeight: 700, fontFamily: S.body }}>You must pay at least {fmt(actualMinDue)} to satisfy this plan.</div>}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div style={{ background: S.white, borderRadius: 22, padding: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                <SectionIntro tag="Payment Method" title="Choose how you want to pay" desc="Both paths remain active: secure online payment through WiPay or bank transfer with receipt upload." accent={S.gold} />
                <div style={{ display: "grid", gap: 16, marginBottom: 22 }}>
                  <MethodCard active={payMethod === "online"} onClick={() => setPayMethod("online")} icon="💳" title="Pay Online" desc="Use a credit card or Visa debit card through the secure WiPay payment page." />
                  <MethodCard active={payMethod === "upload"} onClick={() => setPayMethod("upload")} icon="🏦" title="Bank Transfer" desc="Transfer funds from your bank and upload your receipt for manual verification." />
                </div>
                <PaymentSecurityNotice />
              </div>

              {payMethod === "upload" && (
                <Reveal>
                  <div style={{ padding: 24, background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                    <div style={{ width: "100%", height: 220, borderRadius: 18, overflow: "hidden", marginBottom: 18 }}>
                      <img src={PEOPLE.bank} alt="Bank transfer and receipt preparation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <h4 style={{ margin: "0 0 20px 0", fontFamily: S.heading, color: S.navy, fontSize: 22, fontWeight: 800 }}>Bank Transfer Instructions</h4>
                    <div style={{ background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 14, padding: 18, color: S.navy, fontSize: 14, lineHeight: 1.7, fontFamily: S.body, marginBottom: 18 }}>
                      <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px dashed ${S.border}` }}>
                        <div style={{ fontWeight: 800, color: S.navy, fontSize: 15, marginBottom: 8 }}>🏦 Option 1: Scotiabank</div>
                        <strong>Bank Name:</strong> Bank of Nova Scotia (BNS)<br />
                        <strong>Account Name:</strong> Mark Lindo trading as CTS Empowerment & Training Solution<br />
                        <strong>Account Number:</strong> 001041411<br />
                        <strong>Account Type:</strong> Savings<br />
                        <strong>Branch / Transit:</strong> Scotia Center / 50765
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: S.navy, fontSize: 15, marginBottom: 8 }}>🏦 Option 2: National Commercial Bank (NCB)</div>
                        <strong>Bank Name:</strong> National Commercial Bank (NCB)<br />
                        <strong>Account Name:</strong> Mark Lindo<br />
                        <strong>Account Number:</strong> 214121697<br />
                        <strong>Account Type:</strong> Personal
                      </div>
                    </div>
                    <div style={{ marginTop: 12, background: S.amberLight, padding: "10px 12px", borderRadius: 12, border: `1px solid ${S.amber}35`, fontSize: 12, color: S.amberDark, fontFamily: S.body, lineHeight: 1.7, marginBottom: 18 }}>
                      <strong>Important:</strong> include your reference number <strong>({student?.ref})</strong> in the payment memo or notes so we can match it to your profile.
                    </div>
                    <div style={{ padding: 18, background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 14 }}>
                      <input type="file" onChange={(e) => setReceipt(e.target.files[0])} style={{ marginBottom: 14, width: "100%", padding: 12, borderRadius: 10, border: `1px dashed ${S.border}`, background: S.white, boxSizing: "border-box" }} />
                      <button onClick={handlePaymentSubmit} disabled={submitting || !receipt || !isAmountValid} style={{ padding: 16, background: S.emerald, color: S.white, border: "none", borderRadius: 12, width: "100%", fontWeight: 800, fontSize: 15, cursor: submitting || !receipt || !isAmountValid ? "not-allowed" : "pointer", fontFamily: S.body, boxShadow: `0 8px 20px ${S.emerald}30` }}>{submitting ? "Processing..." : `Submit Evidence for ${fmt(userPayAmount)}`}</button>
                    </div>
                  </div>
                </Reveal>
              )}

              {payMethod === "online" && (
                <Reveal>
                  <div style={{ padding: 28, background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, textAlign: "center", boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                    <div style={{ width: "100%", height: 220, borderRadius: 18, overflow: "hidden", marginBottom: 18 }}>
                      <img src={PEOPLE.online} alt="Secure online payment checkout" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: 42, marginBottom: 12 }}>🔒</div>
                    <h4 style={{ margin: "0 0 12px 0", fontFamily: S.heading, color: S.navy, fontSize: 24, fontWeight: 800 }}>Secure Online Checkout</h4>
                    <p style={{ fontSize: 14, color: S.gray, margin: "0 auto 24px auto", maxWidth: 420, fontFamily: S.body, lineHeight: 1.75 }}>You will be redirected to the secure WiPay payment page to complete your transaction using card payment.</p>
                    <div style={{ background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 14, padding: 16, marginBottom: 18, textAlign: "left" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, fontSize: 13, fontFamily: S.body }}><span style={{ color: S.gray }}>Student</span><strong style={{ color: S.navy }}>{student?.name || "—"}</strong></div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, fontSize: 13, fontFamily: S.body }}><span style={{ color: S.gray }}>Reference</span><strong style={{ color: S.navy }}>{student?.ref || "—"}</strong></div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, fontFamily: S.body }}><span style={{ color: S.gray }}>Amount Due Now</span><strong style={{ color: S.emeraldDark }}>{fmt(userPayAmount)}</strong></div>
                    </div>
                    <button onClick={handleWiPaySubmit} disabled={submitting || !isAmountValid} style={{ padding: 16, background: S.navy, color: S.white, border: "none", borderRadius: 12, width: "100%", fontWeight: 800, fontSize: 15, cursor: submitting || !isAmountValid ? "not-allowed" : "pointer", fontFamily: S.body, boxShadow: `0 8px 20px ${S.navy}30` }}>{submitting ? "Redirecting..." : `Pay ${fmt(userPayAmount)} Online`}</button>
                  </div>
                </Reveal>
              )}

              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: 22, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                <div style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Need help before you pay?</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, marginBottom: 14 }}>If anything about your plan, amount, or payment route is unclear, speak with the CTS ETS team first.</p>
                <a href={BOOKING_URLS.general} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 18px", borderRadius: 12, background: S.teal, color: S.white, textDecoration: "none", fontFamily: S.body, fontSize: 13, fontWeight: 700 }}>Book a Consultation</a>
              </div>
            </div>
          </div>
          <PageScripture page="fees" />
        </WideWrap>
      </section>
    </PageWrapper>
  );
}
