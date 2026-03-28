// ─── PAYMENT / FINANCE PAGE ─────────────────────────────────────────
// Strict ID lookup → auto-populate → founding member detection → pricing → pay
// Backend endpoint: ?action=lookupStudent&ref=CTSETS-2026-03-XXXXX
//   Returns: { found, ref, name, email, programme, level, status, amountDue, paymentPlan, foundingCount }
// Backend endpoint: ?action=getFoundingCount&programme=X&level=Y
//   Returns: { count: N }
import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, BANK_DETAILS, BOOKING_URLS, REG_FEE, USD_RATE, WIPAY_CONFIG } from "../constants/config";
import { FOUNDING_TUITION_DISCOUNT, FOUNDING_SPOTS, FOUNDING_LEVEL3_PLUS } from "../constants/programmes";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PaymentSecurityNotice, HoneypotField } from "../components/shared/DisplayComponents";
import { PaymentMethodSelector, PaymentSetupNotice, isOnlinePaymentAvailable } from "../components/apply/SmartPayment";
import { fmt } from "../utils/formatting";
import { sendPaymentConfirmation } from "../utils/email";

// ── Tuition by level ──
var TUITION_MAP = {
  "Job / Professional Certificates": 10000,
  "Level 2 \u2014 Vocational Certificate": 20000,
  "Level 3 \u2014 Diploma": 30000,
  "Level 4 \u2014 Associate Equivalent": 60000,
  "Level 5 \u2014 Bachelor's Equivalent": 100000,
};

function getTuition(level) {
  for (var key in TUITION_MAP) {
    if (level && (level === key || key.toLowerCase().indexOf(level.toLowerCase().split(" ")[0]) >= 0 || level.toLowerCase().indexOf(key.toLowerCase().split(" ")[0]) >= 0)) return TUITION_MAP[key];
  }
  // Fallback: try matching level number
  if (level) {
    if (level.indexOf("5") >= 0) return 100000;
    if (level.indexOf("4") >= 0) return 60000;
    if (level.indexOf("3") >= 0) return 30000;
    if (level.indexOf("2") >= 0) return 20000;
  }
  return 10000;
}

function isLevel3Plus(level) {
  if (!level) return false;
  for (var i = 0; i < FOUNDING_LEVEL3_PLUS.length; i++) {
    if (level === FOUNDING_LEVEL3_PLUS[i] || level.toLowerCase().indexOf(FOUNDING_LEVEL3_PLUS[i].toLowerCase().split(" ")[0]) >= 0) return true;
  }
  return false;
}

// ── Pricing calculator ──
function calcPricing(level, isFoundingMember) {
  var tuition = getTuition(level);
  var l3plus = isLevel3Plus(level);
  var regFee = isFoundingMember ? 0 : REG_FEE;
  var tuitionDiscount = (isFoundingMember && l3plus) ? FOUNDING_TUITION_DISCOUNT : 0;
  var effectiveTuition = tuition - tuitionDiscount;
  var total = regFee + effectiveTuition;

  var plans = [];
  // Gold — always available
  plans.push({ name: "Gold", label: "Pay in Full", surcharge: 0, total: total, payments: [{ label: "Full Payment", amount: total }] });

  // Silver — L3+ only
  if (l3plus) {
    var silverTotal = Math.round(total * 1.10);
    var silver1 = Math.round(silverTotal * 0.6);
    var silver2 = silverTotal - silver1;
    plans.push({ name: "Silver", label: "60/40 Split", surcharge: 10, total: silverTotal, payments: [{ label: "First Payment (60%)", amount: silver1 }, { label: "Second Payment (40%)", amount: silver2 }] });
  }

  // Bronze — L3+ only
  if (l3plus) {
    var bronzeTotal = Math.round(total * 1.15);
    var bronze1 = Math.round(bronzeTotal * 0.3);
    var remaining = bronzeTotal - bronze1;
    var months = level && level.indexOf("5") >= 0 ? 8 : level && level.indexOf("4") >= 0 ? 7 : 6;
    var monthly = Math.round(remaining / months);
    var bronzePayments = [{ label: "Deposit (30%)", amount: bronze1 }];
    for (var m = 1; m <= months; m++) {
      bronzePayments.push({ label: "Month " + m, amount: m === months ? remaining - (monthly * (months - 1)) : monthly });
    }
    plans.push({ name: "Bronze", label: "30% + Monthly", surcharge: 15, total: bronzeTotal, payments: bronzePayments });
  }

  return {
    tuition: tuition,
    regFee: regFee,
    tuitionDiscount: tuitionDiscount,
    effectiveTuition: effectiveTuition,
    totalSavings: (isFoundingMember ? REG_FEE : 0) + tuitionDiscount,
    plans: plans,
  };
}

export default function PaymentPage({ setPage }) {
  // ── Lookup ──
  var _s = useState(""); var refInput = _s[0]; var setRefInput = _s[1];
  var _s2 = useState("idle"); var lookupState = _s2[0]; var setLookupState = _s2[1];
  var _s3 = useState(null); var student = _s3[0]; var setStudent = _s3[1];
  var _s4 = useState(""); var lookupMsg = _s4[0]; var setLookupMsg = _s4[1];
  var _s5 = useState(false); var disputeSent = _s5[0]; var setDisputeSent = _s5[1];

  // ── Founding ──
  var _s6 = useState(null); var foundingCount = _s6[0]; var setFoundingCount = _s6[1];
  var _s7 = useState(false); var isFoundingMember = _s7[0]; var setIsFoundingMember = _s7[1];

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

  // ── Fetch founding count when student found ──
  useEffect(function() {
    if (!student || !student.programme) return;
    setFoundingCount(null);
    fetch(APPS_SCRIPT_URL + "?action=getFoundingCount&programme=" + encodeURIComponent(student.programme) + "&level=" + encodeURIComponent(student.level || ""))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var count = data.count || 0;
        setFoundingCount(count);
        var isFounding = count < FOUNDING_SPOTS;
        setIsFoundingMember(isFounding);
        setPricing(calcPricing(student.level, isFounding));
      })
      .catch(function() {
        // If count endpoint fails, assume standard pricing
        setFoundingCount(null);
        setIsFoundingMember(false);
        setPricing(calcPricing(student.level, false));
      });
  }, [student]);

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
    setLookupState("loading");
    setStudent(null);
    setLookupMsg("");
    setPricing(null);
    try {
      var res = await fetch(APPS_SCRIPT_URL + "?action=lookupStudent&ref=" + encodeURIComponent(val));
      if (res.ok) {
        var data = await res.json();
        if (data.found) {
          setStudent(data);
          setLookupState("found");
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
    if (!receipt || !student) return;
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
          ref: student.ref,
          studentName: student.name,
          email: student.email,
          programme: student.programme || "",
          level: student.level || "",
          isFoundingMember: isFoundingMember,
          foundingMemberNumber: isFoundingMember && foundingCount !== null ? foundingCount + 1 : null,
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
        await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Payment Evidence", ref: student.ref, studentName: student.name, email: student.email, amountPaid: payAmount, feeType: feeLabel, paymentPlan: selectedPlan, isFoundingMember: isFoundingMember, timestamp: new Date().toISOString() }), mode: "no-cors" });
      } catch (e2) { /* silent */ }
    }
    setSubmitting(false);
    // Send payment confirmation email to student
    if (student && student.email) {
      sendPaymentConfirmation({
        name: student.name, email: student.email, ref: student.ref,
        programme: student.programme, level: student.level,
        amount: payAmount, feeType: feeLabel, paymentPlan: selectedPlan,
        isFoundingMember: isFoundingMember,
        foundingNumber: isFoundingMember && foundingCount !== null ? foundingCount + 1 : "",
      });
    }
    setSubmitted(true);
  };

  // ── WiPay online payment — creates hidden form and POSTs to gateway ──
  var handleWiPaySubmit = function() {
    var payAmount = amountPaid || String(selectedAmount);
    if (!student || !payAmount || parseInt(payAmount) <= 0) return;
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
          isFoundingMember: isFoundingMember,
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

    // Build WiPay form and submit
    var form = document.createElement("form");
    form.method = "POST";
    form.action = WIPAY_CONFIG.baseUrl;
    form.style.display = "none";

    var fields = {
      account_number: WIPAY_CONFIG.accountNumber,
      avs: "0",
      country_code: WIPAY_CONFIG.country,
      currency: WIPAY_CONFIG.currency,
      environment: WIPAY_CONFIG.sandbox ? "sandbox" : "live",
      fee_structure: "customer_pay",
      method: "credit_card",
      order_id: student.ref + "-" + (payingReg && payingTuition ? "BOTH" : payingReg ? "REG" : "TUI"),
      origin: "ctsetsjm.com",
      total: payAmount,
      addr1: "",
      email: student.email || "",
      name: student.name || "",
      phone: "",
      return_url: WIPAY_CONFIG.returnUrl,
    };

    for (var key in fields) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(fields[key]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  var activePlan = pricing ? pricing.plans.find(function(p) { return p.name === selectedPlan; }) : null;

  // ── Computed amount based on fee type selection ──
  var regFeeAmount = pricing ? pricing.regFee : 5000;
  var tuitionAmount = activePlan ? activePlan.total - regFeeAmount : 0;
  var selectedAmount = 0;
  var feeDescription = [];
  if (payingReg && regFeeAmount > 0) { selectedAmount += regFeeAmount; feeDescription.push("Registration Fee"); }
  if (payingTuition) { selectedAmount += tuitionAmount; feeDescription.push("Tuition"); }
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
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>A receipt has been sent to your email. Your enrolment will be processed within 24 hours.</p>
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
              {isFoundingMember && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 20, background: "linear-gradient(135deg, " + S.gold + " 0%, " + S.amber + " 100%)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: S.body, marginBottom: 16 }}>
                  {"\u2B50 Founding Member #" + (foundingCount !== null ? foundingCount + 1 : "") + " of " + FOUNDING_SPOTS}
                </div>
              )}
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, marginBottom: 6 }}>{"Thank you, " + (student ? student.name : "") + "."}</p>
              <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid " + S.border, textAlign: "left", marginBottom: 24 }}>
                {[
                  ["Reference", student ? student.ref : ""],
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
              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>Our finance team will verify within 24-48 hours. Confirmation will be sent to your email.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={function() { setPage("Home"); }} style={{ background: S.coral, color: "#fff" }}>Return Home</Btn>
                <a href={"https://wa.me/8763819771?text=" + encodeURIComponent("Hi, I just uploaded payment evidence for " + (student ? student.ref : "") + ". Please confirm.")} target="_blank" rel="noopener noreferrer"
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
                  <button onClick={function() { setStudent(null); setLookupState("idle"); setRefInput(""); setReceipt(null); setPricing(null); setFoundingCount(null); }}
                    style={{ padding: "14px 20px", borderRadius: 8, background: S.lightBg, color: S.gray, border: "1px solid " + S.border, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap" }}>Change</button>
                )}
              </div>

              {/* Not found + dispute */}
              {lookupState === "not_found" && (
                <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 12, background: S.roseLight, border: "1px solid " + S.rose + "30" }}>
                  <div style={{ fontSize: 13, color: S.roseDark, fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>{lookupMsg}</div>
                  {!disputeSent ? (
                    <div>
                      <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6, marginBottom: 10 }}>If you are sure this number is correct, click below to notify our admin. They will investigate within 24 hours.</p>
                      <button onClick={handleDispute} style={{ padding: "10px 20px", borderRadius: 8, background: S.navy, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{"I\u2019m Sure \u2014 Notify Admin"}</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10 }}>{"\u2713"}</div>
                      <span style={{ fontSize: 12, color: S.emeraldDark, fontFamily: S.body, fontWeight: 600 }}>Admin notified. You will hear from us within 24 hours.</span>
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
                  {/* Founding member badge */}
                  {isFoundingMember && foundingCount !== null && (
                    <div style={{ marginBottom: 16, padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, #011E40 0%, #0A2342 100%)", border: "2px solid " + S.gold, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: S.gold + "10" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 22 }}>{"\u2B50"}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: S.gold, fontFamily: S.heading, letterSpacing: 1 }}>FOUNDING MEMBER</span>
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: S.body }}>Registration fee waived{isLevel3Plus(student.level) ? " + J$5,000 tuition discount" : ""}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 32, fontWeight: 800, color: S.gold, fontFamily: S.heading }}>{"#" + (foundingCount + 1)}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>{"of " + FOUNDING_SPOTS + " spots"}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {Array.from({ length: FOUNDING_SPOTS }).map(function(_, i) {
                            return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= foundingCount ? S.gold : "rgba(255,255,255,0.1)" }} />;
                          })}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: S.body, marginTop: 4, textAlign: "right" }}>{foundingCount + " of " + FOUNDING_SPOTS + " spots taken in " + (student.programme || "this programme")}</div>
                      </div>
                    </div>
                  )}

                  {/* Standard (non-founding) notice */}
                  {!isFoundingMember && foundingCount !== null && (
                    <div style={{ marginBottom: 16, padding: "12px 18px", borderRadius: 10, background: S.lightBg, border: "1px solid " + S.border, fontSize: 12, color: S.gray, fontFamily: S.body }}>
                      {"All " + FOUNDING_SPOTS + " founding spots for " + (student.programme || "this programme") + " have been filled. Standard pricing applies."}
                    </div>
                  )}

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
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* ════════ STEP 2: PRICING + PLAN SELECTION ════════ */}
          {lookupState === "found" && pricing && (
            <Reveal>
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: S.body }}>2</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>Your Pricing</div>
                </div>

                {/* Price breakdown */}
                <div style={{ padding: "20px 24px", borderRadius: 12, background: S.lightBg, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray }}>Tuition</span>
                    <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(pricing.tuition)}</span>
                  </div>
                  {pricing.tuitionDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: S.body }}>
                      <span style={{ color: S.emerald }}>{"\u2B50 Founding Tuition Discount"}</span>
                      <span style={{ color: S.emerald, fontWeight: 700 }}>{"-" + fmt(pricing.tuitionDiscount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray }}>Registration Fee</span>
                    {pricing.regFee === 0 ? (
                      <span style={{ color: S.emerald, fontWeight: 700 }}><s style={{ color: S.gray, fontWeight: 400, marginRight: 6 }}>{fmt(REG_FEE)}</s>{"\u2B50 WAIVED"}</span>
                    ) : (
                      <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(pricing.regFee)}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", borderTop: "2px solid " + S.border, fontSize: 15, fontFamily: S.heading, marginTop: 8 }}>
                    <span style={{ color: S.navy, fontWeight: 700 }}>Total (Gold)</span>
                    <span style={{ color: S.navy, fontWeight: 800 }}>{fmt(pricing.plans[0].total)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, textAlign: "right" }}>{"US$" + Math.round(pricing.plans[0].total / USD_RATE)}</div>
                  {pricing.totalSavings > 0 && (
                    <div style={{ marginTop: 10, padding: "8px 14px", borderRadius: 8, background: S.emeraldLight, border: "1px solid " + S.emerald + "30", textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: S.emeraldDark, fontFamily: S.body }}>{"\u2B50 You save " + fmt(pricing.totalSavings) + " as a Founding Member!"}</span>
                    </div>
                  )}
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
                          <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>Founding member benefit</div>
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body, marginTop: 4 }}>One-time fee — paid once at registration</div>
                    </button>

                    {/* Tuition Fee */}
                    <button onClick={function() { setPayingTuition(!payingTuition); if (!amountPaid || amountPaid === String(selectedAmount)) setAmountPaid(""); }}
                      style={{ padding: "18px 20px", borderRadius: 12, border: payingTuition ? "2.5px solid " + S.teal : "1.5px solid " + S.border, background: payingTuition ? S.tealLight : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (payingTuition ? S.teal : S.border), background: payingTuition ? S.teal : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>{payingTuition ? "\u2713" : ""}</div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Tuition Fee</span>
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
                        {"When available, use your application number as payment reference: "}<strong>{student ? student.ref : ""}</strong>
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
                        <span style={{ color: S.gray }}>WiPay processing fee (3.5%)</span>
                        <span style={{ color: S.amber, fontWeight: 600 }}>{fmt(Math.round(selectedAmount * 0.035))}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", borderTop: "2px solid " + S.border, fontSize: 16, fontFamily: S.heading, marginTop: 6 }}>
                        <span style={{ fontWeight: 700, color: S.navy }}>Total Card Charge</span>
                        <span style={{ fontWeight: 800, color: S.emerald }}>{fmt(Math.round(selectedAmount * 1.035))}</span>
                      </div>
                    </div>

                    <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.6, marginBottom: 16, textAlign: "center" }}>You will be redirected to WiPay's secure payment page. Visa and Mastercard accepted.</p>

                    <button onClick={function() { if (!amountPaid) setAmountPaid(String(selectedAmount)); handleWiPaySubmit(); }} disabled={selectedAmount <= 0}
                      style={{ width: "100%", padding: "18px", borderRadius: 10, border: "none", background: selectedAmount > 0 ? "linear-gradient(135deg, " + S.emerald + " 0%, #1a9b5c 100%)" : "rgba(1,30,64,0.08)", color: selectedAmount > 0 ? "#fff" : S.grayLight, fontSize: 16, fontWeight: 700, cursor: selectedAmount > 0 ? "pointer" : "not-allowed", fontFamily: S.body, boxShadow: selectedAmount > 0 ? "0 4px 20px " + S.emerald + "30" : "none" }}>
                      {"Pay " + fmt(selectedAmount) + " with Card"}
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
                <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>Email finance@ctsetsjm.com or WhatsApp 876-381-9771</div>
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
