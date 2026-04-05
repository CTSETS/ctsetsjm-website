import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { BANK_DETAILS, BOOKING_URLS, REG_FEE, USD_RATE, WIPAY_CONFIG, APPS_SCRIPT_URL } from "../constants/config"; // <-- Updated Import
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PaymentSecurityNotice, HoneypotField } from "../components/shared/DisplayComponents";
import { PaymentMethodSelector, PaymentSetupNotice, isOnlinePaymentAvailable } from "../components/apply/SmartPayment";
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

function isLevel3Plus(level) {
  if (!level) return false;
  var l3levels = ["Level 3", "Level 4", "Level 5"];
  for (var i = 0; i < l3levels.length; i++) { if (level.indexOf(l3levels[i]) >= 0) return true; }
  return false;
}

function calcPricing(level) {
  var tuition = getTuition(level);
  var l3plus = isLevel3Plus(level);
  var regFee = REG_FEE;
  var total = regFee + tuition;

  var plans = [];
  plans.push({ name: "Gold", label: "Pay in Full", surcharge: 0, total: total, payments: [{ label: "Full Payment", amount: total }] });

  if (l3plus) {
    var silverTuition = Math.round(tuition * 1.10);
    var silverTotal = regFee + silverTuition;
    plans.push({ name: "Silver", label: "60/40 Split", surcharge: 10, total: silverTotal, payments: [{ label: "First Payment (60%)", amount: regFee + Math.round(silverTuition * 0.6) }, { label: "Second Payment (40%)", amount: silverTotal - (regFee + Math.round(silverTuition * 0.6)) }] });
    var bronzeTuition = Math.round(tuition * 1.15);
    var bronzeDeposit = Math.round(bronzeTuition * 0.20);
    plans.push({ name: "Bronze", label: "20% Deposit + Monthly", surcharge: 15, total: regFee + bronzeDeposit + (Math.round((bronzeTuition - bronzeDeposit) / 6) * 6), payments: [{ label: "Deposit (20%)", amount: bronzeDeposit }] });
  }
  return { tuition: tuition, regFee: regFee, total: total, plans: plans };
}

export default function PaymentPage({ setPage }) {
  var [verifiedId, setVerifiedId] = useState(null);
  var [refInput, setRefInput] = useState("");
  var [lookupState, setLookupState] = useState("idle");
  var [student, setStudent] = useState(null);
  var [lookupMsg, setLookupMsg] = useState("");
  var [disputeSent, setDisputeSent] = useState(false);
  var [students, setStudents] = useState([]);
  var [pricing, setPricing] = useState(null);
  var [selectedPlan, setSelectedPlan] = useState("Gold");
  var [payMethod, setPayMethod] = useState("upload");
  var [receipt, setReceipt] = useState(null);
  var [paymentNote, setPaymentNote] = useState("");
  var [amountPaid, setAmountPaid] = useState("");
  var [paymentDate, setPaymentDate] = useState("");
  var [submitting, setSubmitting] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var [hp, setHp] = useState("");
  var [wipayReturn, setWipayReturn] = useState(null);
  var [payingReg, setPayingReg] = useState(false);
  var [payingTuition, setPayingTuition] = useState(false);
  var startTime = useRef(Date.now());

  useEffect(() => {
    if (verifiedId && lookupState === "idle") {
      setRefInput(verifiedId);
      setTimeout(() => { var lookupBtn = document.getElementById("otp-auto-lookup"); if (lookupBtn) lookupBtn.click(); }, 300);
    }
  }, [verifiedId]);

  useEffect(() => {
    var params = new URLSearchParams(window.location.search);
    var status = params.get("status");
    var orderId = params.get("order_id");
    if (status && orderId) {
      setWipayReturn({ status: status, orderId: orderId, transactionId: params.get("transaction_id"), total: params.get("total") || "" });
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
      try {
        fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submitpayment", form_type: "WiPay Payment Confirmation", ref: orderId, wipayStatus: status, transactionId: params.get("transaction_id") || "", totalCharged: params.get("total") || "", timestamp: new Date().toISOString() }) });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) setPricing(students[0].pricing);
    else if (student && student.level) setPricing(calcPricing(student.level));
  }, [student, students]);

  var handleLookup = async () => {
    var val = refInput.trim().toUpperCase();
    if (!val) return;
    setLookupState("loading"); setStudent(null); setLookupMsg(""); setPricing(null);
    try {
      var res = await fetch(`${APPS_SCRIPT_URL}?action=lookupstudent&ref=${encodeURIComponent(val)}`);
      if (res.ok) {
        var data = await res.json();
        if (data.found) { setStudent(data); setLookupState("found"); } 
        else { setLookupState("not_found"); setLookupMsg("No application found for " + val + "."); }
      } else { setLookupState("error"); setLookupMsg("Server error."); }
    } catch (err) { setLookupState("error"); setLookupMsg("Connection error."); }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = error => reject(error); reader.readAsDataURL(file); });

  var handlePaymentSubmit = async () => {
    if (hp || Date.now() - startTime.current < 3000) return;
    if (!receipt || (!student && students.length === 0)) return;
    setSubmitting(true);
    try {
      var fileData = [];
      if (receipt) {
        var b64 = await toBase64(receipt);
        fileData.push({ slot: "paymentReceipt", name: receipt.name, type: receipt.type, data: b64 });
      }
      await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submitpayment", form_type: "Payment Evidence", ref: student.ref, studentName: student.name, paymentPlan: selectedPlan, paymentMethod: payMethod, files: fileData, timestamp: new Date().toISOString() }) });
    } catch (e) { console.error(e); }
    setSubmitting(false); setSubmitted(true);
  };

  var handleWiPaySubmit = () => {
    if (submitting || !student) return;
    setSubmitting(true);
    var orderId = student.ref + "-TUI";
    var payAmount = "15000"; // Example logic to calculate based on selectedAmount
    window.location.href = `${WIPAY_CONFIG.baseUrl}?total=${encodeURIComponent(payAmount)}&currency=${encodeURIComponent(WIPAY_CONFIG.currency)}&order_id=${encodeURIComponent(orderId)}&return_url=${encodeURIComponent(WIPAY_CONFIG.returnUrl)}`;
  };

  if (wipayReturn) {
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 48, textAlign: "center" }}>
          <h2>{wipayReturn.status === "success" ? "Payment Successful!" : "Payment Failed"}</h2>
          <Btn primary onClick={() => setPage("Home")}>Return Home</Btn>
        </Container>
      </PageWrapper>
    );
  }

  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 48, textAlign: "center" }}>
          <h2>Evidence Submitted</h2>
          <p>Our team will verify your payment within 48-72 hours.</p>
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
              <p>Found application for: <strong>{student.name}</strong></p>
              {pricing && (
                <div style={{ marginTop: 20 }}>
                  <h4>Select Payment Plan</h4>
                  {pricing.plans.map(plan => (
                    <button key={plan.name} onClick={() => setSelectedPlan(plan.name)} style={{ padding: 10, margin: 5, border: selectedPlan === plan.name ? "2px solid " + S.gold : "1px solid #ccc", background: "#fff" }}>
                      {plan.name} - {fmt(plan.total)}
                    </button>
                  ))}
                  
                  <h4 style={{ marginTop: 20 }}>Payment Method</h4>
                  <PaymentMethodSelector method={payMethod} setMethod={setPayMethod} />
                  
                  {payMethod === "upload" && (
                    <div style={{ marginTop: 20 }}>
                      <input type="file" onChange={e => setReceipt(e.target.files[0])} style={{ marginBottom: 20 }} />
                      <button onClick={handlePaymentSubmit} disabled={submitting || !receipt} style={{ padding: 16, background: S.emerald, color: "#fff", border: "none", borderRadius: 8, width: "100%" }}>Submit Receipt</button>
                    </div>
                  )}

                  {payMethod === "online" && (
                    <div style={{ marginTop: 20 }}>
                      <button onClick={handleWiPaySubmit} disabled={submitting} style={{ padding: 16, background: S.emerald, color: "#fff", border: "none", borderRadius: 8, width: "100%" }}>Pay Securely via WiPay</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </PageWrapper>
  );
}