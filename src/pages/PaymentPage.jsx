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

const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

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

// 🚀 6-Box OTP Input Component
function OtpBoxes({ value, onChange, onEnter, disabled }) {
  const inputRefs = useRef([]);
  const [focused, setFocused] = useState(-1);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length > 1) { 
      const paste = val.slice(0, 6);
      onChange(paste);
      inputRefs.current[Math.min(paste.length, 5)]?.focus();
      return;
    }
    const newOtp = value.split("");
    newOtp[idx] = val.slice(-1);
    onChange(newOtp.join(""));
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter" && value.length === 6) {
      onEnter();
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "20px 0" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const isActive = focused === i;
        const hasVal = !!value[i];
        const borderCol = isActive ? S.teal : hasVal ? S.gold : S.border; 
        return (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            value={value[i] || ""}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(-1)}
            disabled={disabled}
            style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(50px, 12vw, 60px)", fontSize: 24, fontFamily: "monospace", fontWeight: 800, textAlign: "center", borderRadius: 10, border: `2px solid ${borderCol}`, outline: "none", color: S.navy, background: "#fff", transition: "0.2s", boxShadow: isActive ? `0 0 0 3px ${S.teal}20` : "none", boxSizing: "border-box" }}
          />
        )
      })}
    </div>
  );
}

export default function PaymentPage({ setPage }) {
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loginStep, setLoginStep] = useState(0); 
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [student, setStudent] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("Gold");
  const [payMethod, setPayMethod] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hp, setHp] = useState("");
  const startTime = useRef(Date.now());
  const [customAmount, setCustomAmount] = useState("");

  // Check URL Hash for ?ref=CTSETSA-...
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("?")) {
      const queryString = hash.split("?")[1];
      const urlParams = new URLSearchParams(queryString);
      const passedRef = urlParams.get("ref");
      if (passedRef && passedRef.toUpperCase().startsWith("CTSETSA-")) {
        setIdentifier(passedRef.toUpperCase());
      }
      window.history.replaceState(null, "", "/#pay");
    }
  }, []);

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

  const handleSendCode = async () => {
    let ref = identifier.trim().toUpperCase();
    
    // 🚀 STRICT APPLICANT ENFORCEMENT
    if (ref.startsWith("CTSETSS-")) {
      setAuthError("Student payments are processed inside the Student Portal. Please log into your portal.");
      return;
    }
    if (!ref.startsWith("CTSETSA-")) {
      setAuthError("Please enter a valid Application Reference (e.g., CTSETSA-2026-...)");
      return;
    }

    setAuthLoading(true); setAuthError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=sendotp&identifier=${encodeURIComponent(ref)}&purpose=payment`);
      const data = await res.json();
      if (data.success) { 
        setMaskedEmail(data.maskedEmail || "your email");
        setLoginStep(1); 
      } else { 
        setAuthError("We could not find an application with that reference number."); 
      }
    } catch (e) { setAuthError("Network error. Please check your connection."); }
    setAuthLoading(false);
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) { setAuthError("Please enter the 6-digit code."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=verifyotp&identifier=${encodeURIComponent(identifier.trim())}&code=${otpCode}&purpose=payment`);
      const data = await res.json();
      if (data.success) { 
        setAuthError(""); 
        
        // Immediately fetch the student's actual pricing profile!
        const stuRes = await fetch(`${APPS_SCRIPT_URL}?action=lookupstudent&ref=${encodeURIComponent(identifier.trim())}`);
        const stuData = await stuRes.json();
        
        if (stuData.found) {
          setStudent(stuData);
          setLoginStep(2); 
        } else {
          setAuthError("Verification successful, but record data could not be loaded.");
        }
      } 
      else { setAuthError(data.error === "wrong_code" ? "Invalid code." : "Code expired. Please try again."); }
    } catch (e) { setAuthError("Network error. Please check your connection."); }
    setAuthLoading(false);
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

    // 🚀 FIXED: Extremely clean URL routing to prevent WiPay 404
    if (WIPAY_CONFIG.baseUrl.includes("/to_me/")) {
      let base = WIPAY_CONFIG.baseUrl;
      if (base.endsWith("/")) base = base.slice(0, -1);
      window.location.href = `${base}/${payAmount}`;
    } else {
      window.location.href = `${WIPAY_CONFIG.baseUrl}?total=${encodeURIComponent(payAmount)}&currency=${encodeURIComponent(WIPAY_CONFIG.currency)}&order_id=${encodeURIComponent(orderId)}&return_url=${encodeURIComponent(WIPAY_CONFIG.returnUrl)}`;
    }
  };

  if (submitted) return <SuccessState userPayAmount={userPayAmount} setPage={setPage} />;

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
            
            {/* LEFT COLUMN: AUTHENTICATION OR VERIFIED PROFILE */}
            <div>
              <div style={{ background: S.white, borderRadius: 22, padding: "32px clamp(22px,4vw,38px)", border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)", marginBottom: 22 }}>
                
                {loginStep < 2 ? (
                  <div style={{ textAlign: "center", animation: "fadeIn 0.3s" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>
                      {loginStep === 0 ? "🔐" : "✉️"}
                    </div>
                    <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 26, margin: "0 0 12px", fontWeight: 800 }}>
                      {loginStep === 0 ? "Applicant Access" : "Check Your Email"}
                    </h3>
                    <p style={{ fontFamily: S.body, color: S.gray, fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                      {loginStep === 0 
                        ? "Enter your Application Reference to securely load your invoice and access the Payment Centre." 
                        : `We've sent a 6-digit code to ${maskedEmail}`
                      }
                    </p>

                    {loginStep === 0 ? (
                      <div style={{ marginBottom: 24 }}>
                        <input type="text" value={identifier} onChange={e => { setIdentifier(e.target.value.toUpperCase()); setAuthError(""); }} onKeyDown={e => { if (e.key === "Enter") handleSendCode(); }} autoFocus placeholder="CTSETSA-..." style={{ width: "100%", padding: "18px", borderRadius: 12, border: "2px solid " + (authError ? S.rose : S.border), fontSize: 16, fontFamily: S.body, color: S.navy, boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 1, background: S.lightBg, fontWeight: 700 }} />
                      </div>
                    ) : (
                      <>
                        <div style={{ background: S.lightBg, borderRadius: 10, padding: "10px", marginBottom: 20, fontSize: 13, fontFamily: S.body, color: S.navy, fontWeight: 800 }}>
                          <span style={{ color: S.gray, fontWeight: 500, marginRight: 6 }}>Verifying:</span> {identifier}
                        </div>
                        <OtpBoxes value={otpCode} onChange={(v) => { setOtpCode(v); setAuthError(""); }} onEnter={handleVerifyCode} disabled={authLoading} />
                      </>
                    )}

                    {authError && <div style={{ padding: "12px", borderRadius: 10, background: S.roseLight, color: S.roseDark, fontSize: 13, marginBottom: 24, fontFamily: S.body, fontWeight: 800, border: `1px solid ${S.rose}50` }}>{authError}</div>}
                    
                    {loginStep === 0 ? ( 
                      <button onClick={handleSendCode} disabled={authLoading || !identifier.trim()} style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: (!identifier.trim() || authLoading) ? S.border : S.navy, color: "#fff", fontSize: 15, fontWeight: 800, cursor: identifier.trim() && !authLoading ? "pointer" : "not-allowed", fontFamily: S.body, transition: "all 0.2s" }}>{authLoading ? "Connecting..." : "Load Invoice"}</button>
                    ) : ( 
                      <button onClick={handleVerifyCode} disabled={authLoading || otpCode.length !== 6} style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: (otpCode.length !== 6 || authLoading) ? S.border : S.teal, color: "#fff", fontSize: 15, fontWeight: 800, cursor: otpCode.length === 6 && !authLoading ? "pointer" : "not-allowed", fontFamily: S.body, transition: "all 0.2s" }}>{authLoading ? "Decrypting..." : "Access Payment Center"}</button> 
                    )}

                    {loginStep === 1 && ( 
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                        <button onClick={() => { setLoginStep(0); setOtpCode(""); setAuthError(""); }} style={{ background: "none", border: "none", color: S.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>&larr; Change ID</button>
                        <button onClick={handleSendCode} disabled={authLoading} style={{ background: "none", border: "none", color: S.navy, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Resend Code</button>
                      </div> 
                    )}
                  </div>
                ) : (
                  <div style={{ animation: "fadeIn 0.3s" }}>
                    <div style={{ fontSize: 11, color: S.teal, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Applicant Profile</div>
                    <div style={{ fontFamily: S.heading, fontSize: 26, color: S.navy, fontWeight: 800, marginBottom: 8 }}>{student?.name}</div>
                    <div style={{ fontSize: 14, color: S.gray, fontFamily: S.body, lineHeight: 1.7 }}>{student?.level}{student?.ref ? ` · ${student.ref}` : ""}</div>
                    <div style={{ marginTop: 18, padding: "8px 14px", background: S.emeraldLight, color: S.emeraldDark, borderRadius: 8, fontSize: 12, fontWeight: 800, display: "inline-block", fontFamily: S.body, border: `1px solid ${S.emerald}40` }}>✓ Identity Verified</div>
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px dashed ${S.border}` }}>
                       <button onClick={() => { setLoginStep(0); setStudent(null); setIdentifier(""); setOtpCode(""); }} style={{ background: "none", border: "none", color: S.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}>&larr; Pay for a different applicant</button>
                    </div>
                  </div>
                )}
              </div>

              {loginStep === 2 && student && pricing && (
                <div style={{ animation: "fadeIn 0.4s" }}>
                  <div style={{ marginBottom: 22 }}>
                    <SectionIntro tag="Plan Selection" title="Choose your payment plan" desc="Select the fee structure that best fits your situation." accent={S.coral} />
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
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PAYMENT METHODS */}
            <div style={{ display: "grid", gap: 18, opacity: loginStep === 2 ? 1 : 0.4, pointerEvents: loginStep === 2 ? "auto" : "none", transition: "opacity 0.4s ease" }}>
              <div style={{ background: S.white, borderRadius: 22, padding: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
                <SectionIntro tag="Payment Method" title="Choose how you want to pay" desc="Both paths remain active: secure online payment through WiPay or bank transfer with receipt upload." accent={S.gold} />
                <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />
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