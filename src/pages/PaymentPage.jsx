import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { BANK_DETAILS, BOOKING_URLS, REG_FEE, USD_RATE, WIPAY_CONFIG, APPS_SCRIPT_URL } from "../constants/config"; 
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PaymentSecurityNotice, HoneypotField } from "../components/shared/DisplayComponents";
import { PaymentSetupNotice, isOnlinePaymentAvailable } from "../components/apply/SmartPayment";
import { fmt } from "../utils/formatting";
import OTPGate from "../components/common/OTPGate";

var TUITION_MAP = {
  "Job / Professional Certificates": 5000,
  "Level 2 \u2014 Vocational Certificate": 15000,
  "Level 3 \u2014 Diploma": 25000,
  "Level 4 \u2014 Associate Equivalent": 35000,
  "Level 5 \u2014 Bachelor's Equivalent": 45000,
};

function getTuition(level) {
  if (!level) return 5000;
  if (TUITION_MAP[level] !== undefined) return TUITION_MAP[level];
  var l = level.toLowerCase();
  if (l.indexOf("level 5") >= 0 || l.indexOf("bachelor") >= 0) return 45000;
  if (l.indexOf("level 4") >= 0 || l.indexOf("associate") >= 0) return 35000;
  if (l.indexOf("level 3") >= 0 || l.indexOf("diploma") >= 0) return 25000;
  if (l.indexOf("level 2") >= 0 || l.indexOf("vocational") >= 0) return 15000;
  return 5000;
}

function calcPricing(level) {
  var tuition = getTuition(level);
  var l3plus = level ? (level.indexOf("Level 3") >= 0 || level.indexOf("Level 4") >= 0 || level.indexOf("Level 5") >= 0) : false;
  var regFee = REG_FEE || 5000; 
  
  var plans = [];
  
  plans.push({ 
    name: "Gold", 
    label: "Pay in Full", 
    total: regFee + tuition, 
    minDue: regFee + tuition, 
    breakdown: [
      { label: "Registration Fee", value: regFee, dueNow: true },
      { label: "Tuition (No Surcharge)", value: tuition, dueNow: true }
    ]
  });

  if (l3plus) {
    var silverTuition = Math.round(tuition * 1.10); 
    var silverFirst = Math.round(silverTuition * 0.60);
    var silverSecond = silverTuition - silverFirst;
    plans.push({ 
      name: "Silver", 
      label: "60/40 Split", 
      total: regFee + silverTuition, 
      minDue: regFee + silverFirst, 
      breakdown: [
        { label: "Registration Fee", value: regFee, dueNow: true },
        { label: "1st Tuition Payment (60%)", value: silverFirst, dueNow: true },
        { label: "Final Tuition Payment (40%)", value: silverSecond, dueNow: false }
      ]
    });
    
    var bronzeTuition = Math.round(tuition * 1.15); 
    var bronzeDeposit = Math.round(bronzeTuition * 0.20);
    var bronzeBalance = bronzeTuition - bronzeDeposit;
    plans.push({ 
      name: "Bronze", 
      label: "20% Deposit + Monthly", 
      total: regFee + bronzeTuition, 
      minDue: regFee + bronzeDeposit, 
      breakdown: [
        { label: "Registration Fee", value: regFee, dueNow: true },
        { label: "Tuition Deposit (20%)", value: bronzeDeposit, dueNow: true },
        { label: "Remaining Balance (Paid Monthly)", value: bronzeBalance, dueNow: false }
      ]
    });
  }
  return { tuition: tuition, regFee: regFee, plans: plans };
}

export default function PaymentPage({ setPage }) {
  var [verifiedId, setVerifiedId] = useState(null);
  var [refInput, setRefInput] = useState("");
  var [lookupState, setLookupState] = useState("idle");
  var [student, setStudent] = useState(null);
  var [lookupMsg, setLookupMsg] = useState("");
  var [pricing, setPricing] = useState(null);
  var [selectedPlan, setSelectedPlan] = useState("Gold");
  
  // Default to bank transfer so the bank details show immediately
  var [payMethod, setPayMethod] = useState("upload"); 
  
  var [receipt, setReceipt] = useState(null);
  var [submitting, setSubmitting] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var [hp, setHp] = useState("");
  var [wipayReturn, setWipayReturn] = useState(null);
  var startTime = useRef(Date.now());

  var [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("?")) {
      const queryString = hash.split("?")[1];
      const urlParams = new URLSearchParams(queryString);
      const passedRef = urlParams.get("ref");
      if (passedRef) { setVerifiedId(passedRef); setRefInput(passedRef); }
      window.history.replaceState(null, "", "/#pay");
    }
  }, []);

  useEffect(() => {
    if (verifiedId && lookupState === "idle") {
      setRefInput(verifiedId);
      setTimeout(() => { var lookupBtn = document.getElementById("otp-auto-lookup"); if (lookupBtn) lookupBtn.click(); }, 300);
    }
  }, [verifiedId, lookupState]);

  useEffect(() => {
    if (student && student.level) setPricing(calcPricing(student.level));
  }, [student]);

  const currentPlanObj = pricing?.plans.find(p => p.name === selectedPlan);
  
  useEffect(() => {
    if (currentPlanObj) {
      let min = currentPlanObj.minDue;
      if (student?.totalPaid >= min) min = 5000; 
      setCustomAmount(min.toString());
    }
  }, [selectedPlan, pricing, student]);

  var handleLookup = async () => {
    var val = refInput.trim().toUpperCase();
    if (!val) return;
    setLookupState("loading"); setStudent(null); setLookupMsg(""); setPricing(null);
    try {
      var res = await fetch(`${APPS_SCRIPT_URL}?action=lookupstudent&ref=${encodeURIComponent(val)}`);
      if (res.ok) {
        var data = await res.json();
        if (data.found) { setStudent(data); setLookupState("found"); } 
        else { setLookupState("not_found"); setLookupMsg("No application found."); }
      } else { setLookupState("error"); setLookupMsg("Server error."); }
    } catch (err) { setLookupState("error"); setLookupMsg("Connection error."); }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = error => reject(error); reader.readAsDataURL(file); });

  const paidAlready = student?.totalPaid || 0;
  const baseMinDue = currentPlanObj?.minDue || 0;
  const actualMinDue = paidAlready >= baseMinDue ? 5000 : (baseMinDue - paidAlready);
  const userPayAmount = Number(customAmount) || 0;
  const remainingTotal = (currentPlanObj?.total || 0) - paidAlready;
  const isAmountValid = userPayAmount >= actualMinDue && userPayAmount > 0;
  const finalBalance = remainingTotal - userPayAmount;

  var handlePaymentSubmit = async () => {
    if (hp || Date.now() - startTime.current < 3000 || !isAmountValid || !receipt || !student) return;
    setSubmitting(true);
    try {
      var fileData = [];
      if (receipt) {
        var b64 = await toBase64(receipt);
        fileData.push({ slot: "paymentReceipt", name: receipt.name, type: receipt.type, data: b64 });
      }
      await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submitpayment", form_type: "Payment Evidence", ref: student.ref, studentName: student.name, paymentPlan: selectedPlan, amountPaid: userPayAmount, paymentMethod: payMethod, files: fileData, timestamp: new Date().toISOString() }) });
    } catch (e) { console.error(e); }
    setSubmitting(false); setSubmitted(true);
  };

  var handleWiPaySubmit = () => {
    if (submitting || !student || !currentPlanObj || !isAmountValid) return;
    setSubmitting(true);
    var orderId = student.ref + "-" + selectedPlan.substring(0,3).toUpperCase(); 
    window.location.href = `${WIPAY_CONFIG.baseUrl}?total=${encodeURIComponent(userPayAmount.toString())}&currency=${encodeURIComponent(WIPAY_CONFIG.currency)}&order_id=${encodeURIComponent(orderId)}&return_url=${encodeURIComponent(WIPAY_CONFIG.returnUrl)}`;
  };

  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 48, textAlign: "center" }}>
          <h2>Evidence Submitted</h2>
          <p>Our team will verify your payment of {fmt(userPayAmount)} within 48-72 hours.</p>
          <Btn primary onClick={() => setPage("Home")}>Return Home</Btn>
        </Container>
      </PageWrapper>
    );
  }

  if (!verifiedId) {
    return (
      <PageWrapper bg={S.lightBg}>
        <SectionHeader tag="Finance" title="Make a Payment" />
        <Container>
          <OTPGate purpose="payment" title="Payment Centre Access">
            {(id) => { setVerifiedId(id); return <div>Identity verified.</div>; }}
          </OTPGate>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Finance" title="Make a Payment" />
      <Container>
        <div style={{ maxWidth: 680, margin: "0 auto", background: "#fff", padding: 32, borderRadius: 16 }}>
          <HoneypotField value={hp} onChange={e => setHp(e.target.value)} />
          
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input type="text" value={refInput} onChange={e => setRefInput(e.target.value.toUpperCase())} placeholder="CTSETSA-..." style={{ flex: 1, padding: 14, borderRadius: 8, border: "1px solid #ccc" }} />
            <button id="otp-auto-lookup" onClick={handleLookup} disabled={lookupState === "loading"} style={{ padding: "14px 28px", borderRadius: 8, background: S.navy, color: "#fff", border: "none" }}>{lookupState === "loading" ? "Searching..." : "Look Up"}</button>
          </div>
          
          {lookupState === "found" && student && (
            <div style={{ marginTop: 20 }}>
              <div style={{ padding: "16px 20px", background: S.lightBg, borderRadius: 12, border: `1px solid ${S.border}` }}>
                <p style={{ margin: 0, color: S.gray, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Student Profile</p>
                <p style={{ margin: "4px 0 0 0", fontSize: 18 }}><strong style={{color: S.navy}}>{student.name}</strong> <span style={{ color: S.gray }}>({student.level})</span></p>
              </div>
              
              {pricing && (
                <div style={{ marginTop: 28 }}>
                  <h4 style={{fontFamily: S.heading, color: S.navy, marginBottom: 12}}>Select Payment Plan</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {pricing.plans.map(plan => (
                      <button key={plan.name} onClick={() => setSelectedPlan(plan.name)} style={{ padding: "12px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", border: selectedPlan === plan.name ? "2px solid " + S.gold : "1px solid " + S.border, background: selectedPlan === plan.name ? S.lightBg : "#fff", color: selectedPlan === plan.name ? S.navy : S.gray }}>
                        {plan.name}
                      </button>
                    ))}
                  </div>
                  
                  {currentPlanObj && (
                    <div style={{ marginTop: 24, padding: 24, background: "#F8FAFC", borderRadius: 16, border: "2px solid #E2E8F0" }}>
                      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <h5 style={{ margin: "0 0 1