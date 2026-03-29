// ─── PAYMENT / FINANCE PAGE ─────────────────────────────────────────
// Strict ID lookup → auto-populate → pricing → pay
// Backend endpoint: ?action=lookupStudent&ref=CTSETS-2026-03-XXXXX
//   Returns: { count: N }
import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, BANK_DETAILS, BOOKING_URLS, REG_FEE, USD_RATE, WIPAY_CONFIG } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PaymentSecurityNotice, HoneypotField } from "../components/shared/DisplayComponents";
import { PaymentMethodSelector, PaymentSetupNotice, isOnlinePaymentAvailable } from "../components/apply/SmartPayment";
import { fmt } from "../utils/formatting";
// Payment confirmation email sent by backend (Apps Script)

// ── Tuition by level ──
var TUITION_MAP = {
  "Job / Professional Certificates": 5000,
  "Level 2 \u2014 Vocational Certificate": 15000,
  "Level 3 \u2014 Diploma": 25000,
  "Level 4 \u2014 Associate Equivalent": 35000,
  "Level 5 \u2014 Bachelor's Equivalent": 45000,
};

function getTuition(level) {
  for (var key in TUITION_MAP) {
    if (level && (level === key || key.toLowerCase().indexOf(level.toLowerCase().split(" ")[0]) >= 0 || level.toLowerCase().indexOf(key.toLowerCase().split(" ")[0]) >= 0)) return TUITION_MAP[key];
  }
  // Fallback: try matching level number
  if (level) {
    if (level.indexOf("5") >= 0) return 45000;
    if (level.indexOf("4") >= 0) return 35000;
    if (level.indexOf("3") >= 0) return 25000;
    if (level.indexOf("2") >= 0) return 15000;
  }
  return 5000;
}

function isLevel3Plus(level) {
  if (!level) return false;
  var l3levels = ["Level 3", "Level 4", "Level 5"];
  for (var i = 0; i < l3levels.length; i++) {
    if (level.indexOf(l3levels[i]) >= 0) return true;
  }
  return false;
}

// ── Pricing calculator ──
function calcPricing(level) {
  var tuition = getTuition(level);
  var l3plus = isLevel3Plus(level);
  var regFee = REG_FEE;
  var total = regFee + tuition;

  var plans = [];
  // Gold — always available
  plans.push({ name: "Gold", label: "Pay in Full", surcharge: 0, total: total, payments: [{ label: "Full Payment", amount: total }] });

  // Silver — L3+ only, +10% on tuition
  if (l3plus) {
    var silverTuition = Math.round(tuition * 1.10);
    var silverTotal = regFee + silverTuition;
    var silver1 = regFee + Math.round(silverTuition * 0.6);
    var silver2 = silverTotal - silver1;
    plans.push({ name: "Silver", label: "60/40 Split", surcharge: 10, total: silverTotal, payments: [{ label: "First Payment (60%)", amount: silver1 }, { label: "Second Payment (40%)", amount: silver2 }] });
  }

  // Bronze — L3+ only, calculated from actual 15% surcharge
  if (l3plus) {
    var months = level && level.indexOf("5") >= 0 ? 8 : level && level.indexOf("4") >= 0 ? 7 : 6;
    var bronzeTuition = Math.round(tuition * 1.15);
    var bronzeDeposit = Math.round(bronzeTuition * 0.20);
    var bronzeRemaining = bronzeTuition - bronzeDeposit;
    var roundedMonthly = Math.round(bronzeRemaining / months);
    var monthlyTotal = roundedMonthly * months;
    var bronzeTotal = regFee + bronzeDeposit + monthlyTotal;
    var bronzePayments = [{ label: "Deposit (20%)", amount: bronzeDeposit }];
    for (var m = 1; m <= months; m++) {
      bronzePayments.push({ label: "Month " + m, amount: roundedMonthly });
    }
    plans.push({ name: "Bronze", label: "20% Deposit + Monthly", surcharge: 15, total: bronzeTotal, payments: bronzePayments });
  }

  return {
    tuition: tuition,
    regFee: regFee,
    total: total,
    plans: plans,
  };
}

export default function PaymentPage({ setPage }) {
  // ── Multi-student lookup ──
  var _s = useState(""); var refInput = _s[0]; var setRefInput = _s[1];
  var _s2 = useState("idle"); var lookupState = _s2[0]; var setLookupState = _s2[1];
  var _s3 = useState(null); var student = _s3[0]; var setStudent = _s3[1];
  var _s4 = useState(""); var lookupMsg = _s4[0]; var setLookupMsg = _s4[1];
  var _s5 = useState(false); var disputeSent = _s5[0]; var setDisputeSent = _s5[1];
  var _sStudents = useState([]); var students = _sStudents[0]; var setStudents = _sStudents[1];

  // ── Pricing ──
  var _s8 = useState(null); var pricing = _s8[0]; var setPricing = _s8[1];
  var _s9 = useState("Gold"); var selectedPlan = _s9[0]; var setSelectedPlan = _s9[1];

  // ── Payment ──
  var _s10 = useState("upload"); var payMethod = _s10[0]; var setPayMethod = _s10[1];
  var _s11 = useState(null); var receipt = _s11[0]; var setReceipt = _s11[1];
  var _s12 = useState(""); var paymentNote = _s12[0]; var setPaymentNote = _s12[1];
  var _s13 = useState(""); var amountPaid = _s13[0]; var setAmountPaid = _s13[1];
  var _s14 = useState(""); var paymentDate = _s14[0]; var setPaymentDate = _s14[1];
  var _s15 = useState(false); var submitting = _s15[0]; var setSubmitting = _s15[1];
  var _s16 = useState(false); var submitted = _s16[0]; var setSubmitted = _s16[1];
  var _s17 = useState(""); var hp = _s17[0]; var setHp = _s17[1];
  var _s18 = useState(null); var wipayReturn = _s18[0]; var setWipayReturn = _s18[1];
  // ── Fee type selection ──
  var _s19 = useState(false); var payingReg = _s19[0]; var setPayingReg = _s19[1];
  var _s20 = useState(false); var payingTuition = _s20[0]; var setPayingTuition = _s20[1];
  var startTime = useRef(Date.now());

  // ── Check for WiPay return (query params in URL) ──
  useEffect(function() {
    var params = new URLSearchParams(window.location.search);
    var status = params.get("status");
    var orderId = params.get("order_id");
    var transId = params.get("transaction_id");
    if (status && orderId) {
      setWipayReturn({ status: status, orderId: orderId, transactionId: transId, total: params.get("total") || "" });
      // Clean URL without reloading
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
      // Log to Apps Script
      try {
        fetch(APPS_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({
            form_type: "WiPay Payment Confirmation",
            ref: orderId,
            wipayStatus: status,
            transactionId: transId || "",
            totalCharged: params.get("total") || "",
            reasonCode: params.get("reasonCode") || "",
            responseCode: params.get("responseCode") || "",
            timestamp: new Date().toISOString(),
          }),
          mode: "no-cors",
        });
      } catch (e) { /* silent */ }
    }
  }, []);

  // ── Calculate pricing when student found or students list changes ──
  useEffect(function() {
    if (students.length > 0) {
      // Use first student's pricing for plan display
      setPricing(students[0].pricing);
    } else if (student && student.level) {
      setPricing(calcPricing(student.level));
    }
  }, [student, students]);

  // Combined total for multi-student
  var combinedTotal = students.reduce(function(sum, s) { return sum + (s.pricing ? s.pricing.total : 0); }, 0);

  var inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.12)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1A202C", outline: "none", background: "#fff", boxSizing: "border-box" };

  // ── Lookup handler ──
  var handleLookup = async function() {
    var val = refInput.trim().toUpperCase();
    if (!val) return;
    if (!val.startsWith("CTSETS-")) {
      setLookupState("not_found");
      setLookupMsg("Application numbers start with CTSETS- (e.g. CTSETS-2026-03-12345).");
      return;
    }
    // Check if already added
    if (students.some(function(s) { return s.ref === val; })) {
      setLookupState("not_found");
      setLookupMsg("This application (" + val + ") is already in your payment list.");
      return;
    }
    setLookupState("loading");
    setStudent(null);
    setLookupMsg("");
    setPricing(null);
    try {
      var res = await fetch(APPS_SCRIPT_URL + "?action=lookupStudent&ref=" + encodeURIComponent(val));
      if (res.ok) {
        var data = await res.json();
        if (data.found) {
          // Check if status allows payment
          var allowedStatuses = ["Accepted", "Pending Payment", "Enrolled", "Active", "Completed", "Graduated"];
          var statusOk = false;
          for (var si = 0; si < allowedStatuses.length; si++) {
            if ((data.status || "").indexOf(allowedStatuses[si]) >= 0) { statusOk = true; break; }
          }
          if (!statusOk) {
            setLookupState("not_found");
            var st = data.status || "Under Review";
            if (st === "Under Review") {
              setLookupMsg("Application " + val + " is still under review. You will receive an acceptance email before you can make a payment. Please wait for our admissions team to review your application (48\u201372 hours).");
            } else if (st === "Rejected") {
              setLookupMsg("Application " + val + " was not accepted. Please contact admin@ctsetsjm.com for more information.");
            } else if (st === "Withdrawn" || st === "Deferred") {
              setLookupMsg("Application " + val + " has been " + st.toLowerCase() + ". Contact admin@ctsetsjm.com if you'd like to reapply.");
            } else {
              setLookupMsg("Application " + val + " has status \"" + st + "\" and is not eligible for payment at this time. Contact admin@ctsetsjm.com.");
            }
          } else {
            setStudent(data);
            setLookupState("found");
          }
        } else {
          setLookupState("not_found");
          setLookupMsg("No application found for " + val + ".");
        }
      } else {
        setLookupState("error");
        setLookupMsg("Server error. Please try again.");
      }
    } catch (err) {
      setLookupState("error");
      setLookupMsg("Connection error. Check your internet and try again.");
    }
  };

  var addStudentToList = function() {
    if (!student) return;
    var p = calcPricing(student.level);
    setStudents(function(prev) { return prev.concat([Object.assign({}, student, { pricing: p })]); });
    setStudent(null);
    setRefInput("");
    setLookupState("idle");
    setPricing(null);
  };

  var removeStudentFromList = function(ref) {
    setStudents(function(prev) { return prev.filter(function(s) { return s.ref !== ref; }); });
  };

  // Use first student in list as primary for payment (or single lookup)
  var activeStudent = students.length > 0 ? students[0] : student;
  var allRefs = students.map(function(s) { return s.ref; }).join(", ");

  // ── Dispute → email admin ──
  var handleDispute = async function() {
    if (disputeSent) return;
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          form_type: "Payment Lookup Dispute",
          ref: refInput.trim().toUpperCase(),
          message: "Student attempted payment using " + refInput.trim().toUpperCase() + " but lookup returned no match. They confirmed the number is correct. Please investigate.",
          timestamp: new Date().toISOString(),
        }),
        mode: "no-cors",
      });
    } catch (e) { /* silent */ }
    setDisputeSent(true);
  };

  // ── Submit payment ──
  var handlePaymentSubmit = async function() {
    if (hp || Date.now() - startTime.current < 3000) return;
    if (!receipt || (!student && students.length === 0)) return;
    setSubmitting(true);
    var payAmount = amountPaid || String(selectedAmount);
    var activePlan = pricing ? pricing.plans.find(function(p) { return p.name === selectedPlan; }) : null;
    try {
      var fileData = [];
      if (receipt) {
        var b64 = await new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function() { resolve(reader.result.split(",")[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(receipt);
        });
        fileData.push({ slot: "paymentReceipt", name: receipt.name, type: receipt.type, data: b64 });
      }
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          form_type: "Payment Evidence",
          ref: students.length > 0 ? allRefs : student.ref,
          studentName: activeStudent ? activeStudent.name : "",
          email: activeStudent ? activeStudent.email : "",
          programme: activeStudent ? activeStudent.programme : "" || "",
          level: activeStudent ? activeStudent.level : "" || "",
          
          
          paymentPlan: selectedPlan,
          feeType: feeLabel,
          payingRegistration: payingReg,
          payingTuition: payingTuition,
          planTotal: activePlan ? activePlan.total : "",
          amountPaid: payAmount,
          paymentDate: paymentDate || "",
          paymentMethod: payMethod,
          paymentNote: paymentNote || "",
          files: fileData,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (e) {
      try {
        await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Payment Evidence", ref: students.length > 0 ? allRefs : student.ref, studentName: activeStudent ? activeStudent.name : "", email: activeStudent ? activeStudent.email : "", amountPaid: payAmount, feeType: feeLabel, paymentPlan: selectedPlan,  timestamp: new Date().toISOString() }), mode: "no-cors" });
      } catch (e2) { /* silent */ }
    }
    setSubmitting(false);
    // Payment confirmation email sent by backend (Apps Script)
    setSubmitted(true);
  };

  // ── WiPay online payment ──
  var handleWiPaySubmit = function() {
    if (submitting) return;
    var payAmount = amountPaid || String(selectedAmount);
    if (!student || !payAmount || parseInt(payAmount) <= 0) return;
    setSubmitting(true);
    // Log payment intent to Apps Script before redirect
    try {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          form_type: "Payment Intent",
          ref: student.ref,
          studentName: student.name,
          email: student.email,
          programme: student.programme || "",
          level: student.level || "",
          
          paymentPlan: selectedPlan,
          feeType: feeLabel,
          payingRegistration: payingReg,
          payingTuition: payingTuition,
          amountIntended: payAmount,
          paymentMethod: "WiPay Online",
          timestamp: new Date().toISOString(),
        }),
        mode: "no-cors",
      });
    } catch (e) { /* silent — don't block payment */ }

    // Redirect to WiPay hosted payment page
    var orderId = (students.length > 0 ? students.map(function(s) { return s.ref; }).join("+") : student.ref) + "-" + (payingReg && payingTuition ? "BOTH" : payingReg ? "REG" : "TUI");
    var wipayUrl = WIPAY_CONFIG.baseUrl
      + "?total=" + encodeURIComponent(payAmount)
      + "&currency=" + encodeURIComponent(WIPAY_CONFIG.currency)
      + "&order_id=" + encodeURIComponent(orderId)
      + "&return_url=" + encodeURIComponent(WIPAY_CONFIG.returnUrl)
      + "&email=" + encodeURIComponent(activeStudent ? activeStudent.email || "" : "")
      + "&name=" + encodeURIComponent(activeStudent ? activeStudent.name || "" : "");
    window.location.href = wipayUrl;
  };

  var activePlan = pricing ? pricing.plans.find(function(p) { return p.name === selectedPlan; }) : null;

  // ── Computed amount based on fee type selection ──
  var regFeeAmount = pricing ? pricing.regFee : 5000;
  var tuitionAmount = activePlan ? activePlan.total - regFeeAmount : 0;
  var selectedAmount = 0;
  var feeDescription = [];
  if (payingReg && regFeeAmount > 0) { selectedAmount += regFeeAmount; feeDescription.push("Registration Fee"); }
  if (payingTuition) { selectedAmount += tuitionAmount; feeDescription.push("Training Fee"); }
  var feeLabel = feeDescription.join(" + ") || "";

  // ═══════════ WIPAY RETURN ═══════════
  if (wipayReturn) {
    var isSuccess = wipayReturn.status === "success";
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 48 }}>
          <Reveal>
            <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: isSuccess ? S.emeraldLight : S.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px", border: "3px solid " + (isSuccess ? S.emerald : S.rose) }}>{isSuccess ? "\u2713" : "\u2717"}</div>
              <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 700, marginBottom: 12 }}>{isSuccess ? "Payment Successful!" : "Payment Not Completed"}</h2>
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, marginBottom: 8 }}>
                {isSuccess
                  ? "Your card payment has been processed successfully."
                  : "The payment was not completed. No charge was made to your card."}
              </p>
              <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid " + S.border, textAlign: "left", marginBottom: 24 }}>
                {[
                  ["Application", wipayReturn.orderId],
                  ["Status", isSuccess ? "Paid" : "Not Completed"],
                  wipayReturn.transactionId ? ["Transaction ID", wipayReturn.transactionId] : null,
                  wipayReturn.total ? ["Amount Charged", "J$" + wipayReturn.total] : null,
                ].filter(Boolean).map(function(row) { return (
                  <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray }}>{row[0]}</span>
                    <span style={{ color: isSuccess ? S.emerald : S.navy, fontWeight: 700 }}>{row[1]}</span>
                  </div>
                ); })}
              </div>
              {isSuccess ? (
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>A receipt has been sent to your email. Your enrolment will be processed within 48–72 hours.</p>
              ) : (
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>You can try again or use bank transfer instead. Contact us if you need help.</p>
              )}
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {isSuccess ? (
                  <Btn primary onClick={function() { setPage("Home"); }} style={{ background: S.coral, color: "#fff" }}>Return Home</Btn>
                ) : (
                  <Btn primary onClick={function() { setWipayReturn(null); }} style={{ background: S.coral, color: "#fff" }}>Try Again</Btn>
                )}
                <a href={"https://wa.me/8763819771?text=" + encodeURIComponent("Hi, I just made a " + (isSuccess ? "successful" : "failed") + " card payment for " + wipayReturn.orderId + ". " + (isSuccess ? "Please confirm." : "I need help."))} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "12px 24px", borderRadius: 8, border: "2px solid " + S.teal, color: S.teal, fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>WhatsApp Us</a>
              </div>
            </div>
          </Reveal>
        </Container>
      </PageWrapper>
    );
  }

  // ═══════════ SUCCESS ═══════════
  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 48 }}>
          <Reveal>
            <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: S.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px", border: "3px solid " + S.emerald }}>{"\u2713"}</div>
              <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 700, marginBottom: 12 }}>Payment Evidence Submitted</h2>
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, marginBottom: 6 }}>{"Thank you, " + (activeStudent ? activeStudent.name : "") + "."}</p>
              <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid " + S.border, textAlign: "left", marginBottom: 24 }}>
                {[
                  ["Reference", students.length > 0 ? allRefs : (student ? student.ref : "")],
                  ["Paying For", feeLabel || "Payment"],
                  ["Payment Plan", selectedPlan],
                  ["Amount Declared", (amountPaid || selectedAmount) ? fmt(parseInt(amountPaid || selectedAmount)) : "Not specified"],
                  ["Payment Date", paymentDate || "Not specified"],
                ].map(function(row) { return (
                  <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray }}>{row[0]}</span>
                    <span style={{ color: S.navy, fontWeight: 700 }}>{row[1]}</span>
                  </div>
                ); })}
              </div>
              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>Our finance team will verify within 48–72 hours. Confirmation will be sent to your email.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={function() { setPage("Home"); }} style={{ background: S.coral, color: "#fff" }}>Return Home</Btn>
                <a href={"https://wa.me/8763819771?text=" + encodeURIComponent("Hi, I just uploaded payment evidence for " + (students.length > 0 ? allRefs : (student ? student.ref : "")) + ". Please confirm.")} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "12px 24px", borderRadius: 8, border: "2px solid " + S.emerald, color: S.emerald, fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>Notify via WhatsApp</a>
              </div>
            </div>
          </Reveal>
        </Container>
      </PageWrapper>
    );
  }

  // ═══════════ MAIN ═══════════
  return (
    <PageWrapper bg={S.lightBg}>
      {/* Full-screen overlay — blocks ALL interaction during payment */}
      {submitting && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, background: "rgba(1,30,64,0.9)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", maxWidth: 420, margin: "0 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDCB3"}</div>
            <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 700, marginBottom: 10 }}>Processing Payment</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.6 }}>Please wait — do not close this page, press back, or submit another payment. You will be redirected shortly.</p>
            <div style={{ marginTop: 20, width: 40, height: 40, border: "4px solid " + S.border, borderTop: "4px solid " + S.coral, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "20px auto 0" }} />
          </div>
        </div>
      )}
      <SectionHeader tag="Finance" title="Make a Payment" desc="Enter your application number to view your account and submit payment." accentColor={S.gold} />
      <Container>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <HoneypotField value={hp} onChange={function(e) { setHp(e.target.value); }} />

          {/* ════════ STEP 1: LOOKUP ════════ */}
          <Reveal>
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: lookupState === "found" ? S.emerald : S.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: S.body }}>{lookupState === "found" ? "\u2713" : "1"}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>Enter Your Application Number</div>
              </div>

              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, marginBottom: 16 }}>
                Your application number was assigned when you started your application. It appears at the top of your Apply page and in your confirmation email: <strong>CTSETS-2026-03-XXXXX</strong>
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <input type="text" value={refInput}
                  onChange={function(e) { setRefInput(e.target.value.toUpperCase()); setLookupState("idle"); setLookupMsg(""); setDisputeSent(false); }}
                  onKeyDown={function(e) { if (e.key === "Enter") handleLookup(); }}
                  placeholder="CTSETS-2026-03-XXXXX"
                  disabled={lookupState === "found"}
                  style={{ flex: 1, padding: "14px 16px", borderRadius: 8, border: "2px solid " + (lookupState === "found" ? S.emerald : "rgba(1,30,64,0.12)"), fontSize: 18, fontFamily: "'DM Sans', sans-serif", color: S.navy, fontWeight: 700, outline: "none", letterSpacing: 1, background: lookupState === "found" ? S.emeraldLight + "40" : "#fff" }}
                />
                {lookupState !== "found" ? (
                  <button onClick={handleLookup} disabled={lookupState === "loading" || !refInput.trim()}
                    style={{ padding: "14px 28px", borderRadius: 8, background: refInput.trim() ? S.navy : "rgba(1,30,64,0.08)", color: refInput.trim() ? S.gold : S.grayLight, border: "none", fontSize: 14, fontWeight: 700, cursor: refInput.trim() ? "pointer" : "not-allowed", fontFamily: S.body, opacity: lookupState === "loading" ? 0.6 : 1, whiteSpace: "nowrap" }}>
                    {lookupState === "loading" ? "Searching..." : "Look Up"}
                  </button>
                ) : (
                  <button onClick={function() { setStudent(null); setLookupState("idle"); setRefInput(""); setReceipt(null); setPricing(null); }}
                    style={{ padding: "14px 20px", borderRadius: 8, background: S.lightBg, color: S.gray, border: "1px solid " + S.border, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap" }}>Change</button>
                )}
              </div>

              {/* Not found + dispute */}
              {lookupState === "not_found" && (
                <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 12, background: S.roseLight, border: "1px solid " + S.rose + "30" }}>
                  <div style={{ fontSize: 13, color: S.roseDark, fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>{lookupMsg}</div>
                  {!disputeSent ? (
                    <div>
                      <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6, marginBottom: 10 }}>If you are sure this number is correct, click below to notify our admin. They will investigate within 48–72 hours.</p>
                      <button onClick={handleDispute} style={{ padding: "10px 20px", borderRadius: 8, background: S.navy, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{"I\u2019m Sure \u2014 Notify Admin"}</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10 }}>{"\u2713"}</div>
                      <span style={{ fontSize: 12, color: S.emeraldDark, fontFamily: S.body, fontWeight: 600 }}>Admin notified. You will hear from us within 48–72 hours.</span>
                    </div>
                  )}
                </div>
              )}

              {lookupState === "error" && (
                <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30" }}>
                  <div style={{ fontSize: 13, color: S.amberDark, fontFamily: S.body }}>{lookupMsg}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: S.gray, fontFamily: S.body }}>{"WhatsApp "}<a href="https://wa.me/8763819771" target="_blank" rel="noopener noreferrer" style={{ color: S.teal, fontWeight: 700 }}>876-381-9771</a>{" for help."}</div>
                </div>
              )}

              {/* ── STUDENT FOUND CARD ── */}
              {lookupState === "found" && student && (
                <div style={{ marginTop: 20 }}>


                  {/* Student details */}
                  <div style={{ padding: "20px 24px", borderRadius: 12, background: S.emeraldLight + "60", border: "2px solid " + S.emerald + "40" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>{"\u2713"}</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: S.emeraldDark, fontFamily: S.body }}>Application Verified</span>
                    </div>
                    {[["Name", student.name], ["Email", student.email], ["Programme", (student.level ? student.level + " \u2014 " : "") + (student.programme || "")], ["Status", student.status || "Under Review"]].map(function(row) {
                      return (
                        <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid " + S.emerald + "20", fontSize: 13, fontFamily: S.body }}>
                          <span style={{ color: S.gray }}>{row[0]}</span>
                          <span style={{ color: S.navy, fontWeight: 600, textAlign: "right" }}>{row[1]}</span>
                        </div>
                      );
                    })}
                    {/* Add to Payment button */}
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <button onClick={addStudentToList}
                        style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: S.emerald, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
                        {students.length > 0 ? "Add to Payment List" : "Confirm & Continue"}
                      </button>
                    </div>
                  </div>

                  {/* Multi-student list */}
                  {students.length > 0 && (
                    <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 10, background: "#fff", border: "1px solid " + S.border }}>
                      <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1, fontFamily: S.body, fontWeight: 700, marginBottom: 10 }}>PAYMENT LIST ({students.length} application{students.length > 1 ? "s" : ""})</div>
                      {students.map(function(s) {
                        return (
                          <div key={s.ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 12, fontFamily: S.body }}>
                            <div>
                              <div style={{ fontWeight: 700, color: S.navy }}>{s.name}</div>
                              <div style={{ color: S.gray, fontSize: 11 }}>{s.ref} — {s.programme}</div>
                            </div>
                            <button onClick={function() { removeStudentFromList(s.ref); }}
                              style={{ background: "none", border: "none", color: S.coral, fontSize: 18, cursor: "pointer", padding: "4px 8px" }}>{"\u2715"}</button>
                          </div>
                        );
                      })}
                      <div style={{ marginTop: 10, fontSize: 12, color: S.teal, fontFamily: S.body, fontWeight: 600 }}>Enter another application number above to add more.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          {/* ════════ STEP 2: PRICING + PLAN SELECTION ════════ */}
          {((lookupState === "found" && pricing) || students.length > 0) && (
            <Reveal>
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: S.body }}>2</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>Your Pricing</div>
                </div>

                {/* Price breakdown */}
                <div style={{ padding: "20px 24px", borderRadius: 12, background: S.lightBg, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray }}>Training Fee</span>
                    <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(pricing.tuition)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray }}>Registration Fee (non-refundable)</span>
                    <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(pricing.regFee)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", borderTop: "2px solid " + S.border, fontSize: 15, fontFamily: S.heading, marginTop: 8 }}>
                    <span style={{ color: S.navy, fontWeight: 700 }}>Total (Gold)</span>
                    <span style={{ color: S.navy, fontWeight: 800 }}>{fmt(pricing.total)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, textAlign: "right" }}>{"US$" + Math.round(pricing.total / USD_RATE)}</div>
                </div>

                {/* Plan selection */}
                <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Choose Payment Plan</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(" + pricing.plans.length + ", 1fr)", gap: 12, marginBottom: 20 }} className="resp-grid-2">
                  {pricing.plans.map(function(plan) {
                    var active = selectedPlan === plan.name;
                    var colors = { Gold: S.gold, Silver: S.teal, Bronze: S.amber };
                    var c = colors[plan.name] || S.navy;
                    return (
                      <button key={plan.name} onClick={function() { setSelectedPlan(plan.name); }}
                        style={{ padding: "18px 16px", borderRadius: 12, border: active ? "2.5px solid " + c : "1.5px solid " + S.border, background: active ? c + "08" : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: active ? c : S.navy, fontFamily: S.heading, marginBottom: 4 }}>{plan.name}</div>
                        <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginBottom: 8 }}>{plan.label}{plan.surcharge > 0 ? " (+" + plan.surcharge + "%)" : ""}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: S.navy, fontFamily: S.heading }}>{fmt(plan.total)}</div>
                        <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body }}>{"US$" + Math.round(plan.total / USD_RATE)}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Plan payment schedule */}
                {activePlan && activePlan.payments.length > 1 && (
                  <div style={{ padding: "16px 20px", borderRadius: 10, background: S.lightBg, border: "1px solid " + S.border }}>
                    <div style={{ fontSize: 11, color: S.navy, fontWeight: 700, fontFamily: S.body, marginBottom: 10 }}>{selectedPlan + " Payment Schedule"}</div>
                    {activePlan.payments.map(function(p, i) {
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12, fontFamily: S.body, borderBottom: i < activePlan.payments.length - 1 ? "1px solid " + S.border : "none" }}>
                          <span style={{ color: S.gray }}>{p.label}</span>
                          <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(p.amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* ════════ STEP 3: SUBMIT PAYMENT ════════ */}
          {lookupState === "found" && pricing && (
            <Reveal>
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.coral, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: S.body }}>3</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>Submit Payment</div>
                </div>

                <PaymentSetupNotice />

                {/* ── Fee Type Selection ── */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>What Are You Paying For?</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="resp-grid-2">
                    {/* Registration Fee */}
                    <button onClick={function() { setPayingReg(!payingReg); if (!amountPaid || amountPaid === String(selectedAmount)) setAmountPaid(""); }}
                      style={{ padding: "18px 20px", borderRadius: 12, border: payingReg ? "2.5px solid " + S.gold : "1.5px solid " + S.border, background: payingReg ? S.goldLight : "#fff", cursor: regFeeAmount > 0 ? "pointer" : "not-allowed", textAlign: "left", transition: "all 0.2s", opacity: regFeeAmount > 0 ? 1 : 0.5 }}
                      disabled={regFeeAmount <= 0}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (payingReg ? S.gold : S.border), background: payingReg ? S.gold : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>{payingReg ? "\u2713" : ""}</div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Registration Fee</span>
                      </div>
                      {regFeeAmount > 0 ? (
                        <div style={{ fontSize: 22, fontWeight: 800, color: S.navy, fontFamily: S.heading }}>{fmt(regFeeAmount)}</div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: S.emerald, fontFamily: S.body }}>{"\u2B50 WAIVED"}</div>
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body, marginTop: 4 }}>One-time fee — paid once at registration</div>
                    </button>

                    {/* Training Fee */}
                    <button onClick={function() { setPayingTuition(!payingTuition); if (!amountPaid || amountPaid === String(selectedAmount)) setAmountPaid(""); }}
                      style={{ padding: "18px 20px", borderRadius: 12, border: payingTuition ? "2.5px solid " + S.teal : "1.5px solid " + S.border, background: payingTuition ? S.tealLight : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (payingTuition ? S.teal : S.border), background: payingTuition ? S.teal : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>{payingTuition ? "\u2713" : ""}</div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Training Fee</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: S.navy, fontFamily: S.heading }}>{fmt(tuitionAmount)}</div>
                      <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body, marginTop: 4 }}>{selectedPlan + " plan" + (activePlan && activePlan.surcharge > 0 ? " (+" + activePlan.surcharge + "% surcharge)" : "")}</div>
                    </button>
                  </div>

                  {/* Selected total */}
                  {(payingReg || payingTuition) && (
                    <div style={{ marginTop: 14, padding: "14px 20px", borderRadius: 10, background: S.emeraldLight, border: "1px solid " + S.emerald + "30", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: S.emeraldDark, fontFamily: S.body, fontWeight: 600 }}>{"Paying: " + feeLabel}</div>
                        {payingReg && payingTuition && <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body, marginTop: 2 }}>Both fees in one payment</div>}
                      </div>
                      <div style={{ fontFamily: S.heading, fontSize: 24, fontWeight: 800, color: S.navy }}>{fmt(selectedAmount)}</div>
                    </div>
                  )}

                  {!payingReg && !payingTuition && (
                    <div style={{ marginTop: 14, padding: "12px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "20", fontSize: 12, color: S.amberDark, fontFamily: S.body }}>
                      Please select at least one fee type to continue.
                    </div>
                  )}
                </div>

                {(payingReg || payingTuition) && <PaymentMethodSelector method={payMethod} setMethod={setPayMethod} />}

                {(payingReg || payingTuition) && payMethod === "upload" && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ padding: "20px 24px", borderRadius: 12, background: S.navy, marginBottom: 20 }}>
                      <div style={{ fontSize: 11, color: S.gold, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Bank Transfer Details</div>
                      <div style={{ padding: "20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.15)", textAlign: "center" }}>
                        <div style={{ fontSize: 20, marginBottom: 8 }}>{"\uD83C\uDFE6"}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: S.body, marginBottom: 6 }}>Bank Transfer Details Coming Soon</div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>
                          We are finalising our bank transfer details. In the meantime, you can pay online using your Visa or Mastercard, or contact us at <strong style={{ color: S.gold }}>876-381-9771</strong> for alternative payment arrangements.
                        </p>
                      </div>
                      <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: S.gold + "15", border: "1px solid " + S.gold + "30", fontSize: 12, color: S.gold, fontFamily: S.body, fontWeight: 600 }}>
                        {"When available, use your application number as payment reference: "}<strong>{students.length > 0 ? allRefs : (student ? student.ref : "")}</strong>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 16 }} className="resp-grid-2">
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>{"Amount Paid (JMD) "}<span style={{ color: S.coral }}>*</span></label>
                        <input type="number" style={inputStyle} value={amountPaid || (selectedAmount > 0 ? String(selectedAmount) : "")} onChange={function(e) { setAmountPaid(e.target.value); }} placeholder={selectedAmount > 0 ? String(selectedAmount) : "e.g. 15000"} />
                        {selectedAmount > 0 && !amountPaid && (
                          <div style={{ fontSize: 10, color: S.emerald, fontFamily: S.body, marginTop: 4 }}>{"Auto-filled from your " + feeLabel + " selection"}</div>
                        )}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>{"Payment Date "}<span style={{ color: S.coral }}>*</span></label>
                        <input type="date" style={inputStyle} value={paymentDate} onChange={function(e) { setPaymentDate(e.target.value); }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>{"Upload Payment Receipt "}<span style={{ color: S.coral }}>*</span></label>
                      <div style={{ padding: "18px 20px", borderRadius: 10, border: "1.5px dashed " + (receipt ? S.emerald + "50" : "rgba(1,30,64,0.12)"), background: receipt ? S.emeraldLight : "#fff", textAlign: "center" }}>
                        {receipt ? (
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: S.emeraldDark, fontFamily: S.body }}>{"\u2713 " + receipt.name}</div>
                            <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4 }}>{(receipt.size / 1024).toFixed(0) + " KB"}</div>
                            <label htmlFor="receipt-file" style={{ fontSize: 12, color: S.teal, fontWeight: 700, cursor: "pointer", fontFamily: S.body, marginTop: 8, display: "inline-block" }}>Change file</label>
                          </div>
                        ) : (
                          <label htmlFor="receipt-file" style={{ cursor: "pointer", display: "block", padding: "14px 0" }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{"\uD83D\uDCE4"}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Click to upload receipt</div>
                            <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4 }}>JPG, PNG, or PDF — max 5 MB</div>
                          </label>
                        )}
                        <input id="receipt-file" type="file" accept="image/*,.pdf" onChange={function(e) { if (e.target.files[0]) setReceipt(e.target.files[0]); }} style={{ display: "none" }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>Payment Note (optional)</label>
                      <textarea value={paymentNote} onChange={function(e) { setPaymentNote(e.target.value); }} placeholder={"e.g. " + selectedPlan + " plan payment via NCB online transfer"} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.12)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1A202C", outline: "none", background: "#fff", boxSizing: "border-box", height: 80, resize: "vertical" }} />
                    </div>

                    <button onClick={handlePaymentSubmit} disabled={submitting || !receipt}
                      style={{ width: "100%", padding: "18px", borderRadius: 10, border: "none", background: receipt ? "linear-gradient(135deg, " + S.emerald + " 0%, " + S.teal + " 100%)" : "rgba(1,30,64,0.08)", color: receipt ? "#fff" : S.grayLight, fontSize: 16, fontWeight: 700, cursor: receipt ? "pointer" : "not-allowed", fontFamily: S.body, opacity: submitting ? 0.6 : 1, boxShadow: receipt ? "0 4px 20px " + S.emerald + "30" : "none" }}>
                      {submitting ? "Submitting..." : "Submit Payment Evidence"}
                    </button>
                  </div>
                )}

                {(payingReg || payingTuition) && payMethod === "online" && isOnlinePaymentAvailable() && (
                  <div style={{ marginTop: 24 }}>
                    <PaymentSecurityNotice />

                    <div style={{ padding: "20px 24px", borderRadius: 12, background: S.lightBg, border: "1px solid " + S.border, marginBottom: 20, textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 12 }}>Payment Summary</div>
                      {payingReg && regFeeAmount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                          <span style={{ color: S.gray }}>Registration Fee</span>
                          <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(regFeeAmount)}</span>
                        </div>
                      )}
                      {payingTuition && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                          <span style={{ color: S.gray }}>{"Tuition (" + selectedPlan + " plan)"}</span>
                          <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(tuitionAmount)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", fontSize: 15, fontFamily: S.heading, marginTop: 6 }}>
                        <span style={{ fontWeight: 700, color: S.navy }}>Subtotal</span>
                        <span style={{ fontWeight: 800, color: S.navy }}>{fmt(selectedAmount)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, fontFamily: S.body }}>
                        <span style={{ color: S.gray }}>Card processing fee (3.5%)</span>
                        <span style={{ color: S.amber, fontWeight: 600 }}>{fmt(Math.round(selectedAmount * 0.035))}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", borderTop: "2px solid " + S.border, fontSize: 16, fontFamily: S.heading, marginTop: 6 }}>
                        <span style={{ fontWeight: 700, color: S.navy }}>Total Card Charge</span>
                        <span style={{ fontWeight: 800, color: S.emerald }}>{fmt(Math.round(selectedAmount * 1.035))}</span>
                      </div>
                    </div>

                    <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.6, marginBottom: 16, textAlign: "center" }}>You will be redirected to our secure payment gateway. Visa and Mastercard accepted.</p>

                    <button onClick={function() { if (submitting) return; setSubmitting(true); if (!amountPaid) setAmountPaid(String(selectedAmount)); handleWiPaySubmit(); }} disabled={selectedAmount <= 0 || submitting}
                      style={{ width: "100%", padding: "18px", borderRadius: 10, border: "none", background: selectedAmount > 0 && !submitting ? "linear-gradient(135deg, " + S.emerald + " 0%, #1a9b5c 100%)" : "rgba(1,30,64,0.08)", color: selectedAmount > 0 && !submitting ? "#fff" : S.grayLight, fontSize: 16, fontWeight: 700, cursor: selectedAmount > 0 && !submitting ? "pointer" : "not-allowed", fontFamily: S.body, boxShadow: selectedAmount > 0 && !submitting ? "0 4px 20px " + S.emerald + "30" : "none", opacity: submitting ? 0.6 : 1 }}>
                      {submitting ? "Processing..." : "Pay " + fmt(selectedAmount) + " with Card"}
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* ════════ HELP ════════ */}
          <Reveal delay={0.1}>
            <div style={{ padding: "18px 24px", borderRadius: 12, background: "#fff", border: "1px solid " + S.border, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
              <span style={{ fontSize: 20 }}>{"\uD83D\uDCAC"}</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Need payment help?</div>
                <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>Email admin@ctsetsjm.com or WhatsApp 876-381-9771</div>
              </div>
              <a href={BOOKING_URLS.payment} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 6, background: S.teal, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none", whiteSpace: "nowrap" }}>Book Payment Consultation</a>
            </div>
          </Reveal>

          {lookupState !== "found" && (
            <Reveal delay={0.2}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>{"Don\u2019t have an application yet?"}</p>
                <Btn primary onClick={function() { setPage("Apply"); }} style={{ background: S.coral, color: "#fff", marginTop: 8 }}>Apply Now</Btn>
              </div>
            </Reveal>
          )}
        </div>
        <PageScripture page="fees" />
      </Container>
    </PageWrapper>
  );
}
