import { useState, useEffect } from "react";
import S from "../constants/styles";
import { PROGRAMMES } from "../constants/programmes"; 
import { APPS_SCRIPT_URL, WIPAY_CONFIG } from "../constants/config"; // 🚀 NEW: Added to connect to your actual payment engines
import { Container, PageWrapper, Btn } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";

import OrientationGateway from "../components/OrientationGateway";

// REQUIRED INSTITUTIONAL CONSTANT
const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

// 🚀 AUTO-CAPITALIZATION HELPER
const toTitleCase = (str) => {
  if (!str) return "";
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// 🚀 GOOGLE THUMBNAIL API
const getDriveImageUrl = (url) => {
  if (!url) return null;
  if (url.match(/^[a-zA-Z0-9_-]{20,}$/)) return `https://drive.google.com/thumbnail?id=${url}&sz=w400`;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
  return url;
};

// 🚀 SMART VALID TERM CALCULATOR
const getValidTerm = (programmeName, level, dateEnrolled) => {
  const start = dateEnrolled ? new Date(dateEnrolled) : new Date();
  let durationInMonths = 3; 

  let found = false;
  if (programmeName) {
    const searchName = programmeName.toLowerCase().trim();
    for (const levelKey in PROGRAMMES) {
      const coursesInLevel = PROGRAMMES[levelKey];
      for (const course of coursesInLevel) {
        if (course.name.toLowerCase().trim() === searchName) {
          const match = course.duration.match(/\d+/);
          if (match) { durationInMonths = parseInt(match[0], 10); found = true; }
          break;
        }
      }
      if (found) break;
    }
  }

  if (!found) {
    const l = (level || "").toLowerCase();
    if (l.includes("level 2") || l.includes("vocational")) durationInMonths = 6;
    else if (l.includes("level 3") || l.includes("diploma")) durationInMonths = 12;
    else if (l.includes("level 4") || l.includes("associate")) durationInMonths = 24;
    else if (l.includes("level 5") || l.includes("bachelor")) durationInMonths = 24;
  }

  const end = new Date(start);
  end.setMonth(start.getMonth() + (durationInMonths - 1));

  const format = (d) => d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  return `${format(start)} – ${format(end)}`; 
};

const loadConfetti = () => {
  if (window.confetti) return;
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
  script.async = true;
  document.body.appendChild(script);
};

// ─── AI Study Assistant Component ───
function AIStudyAssistant({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([{ role: "ai", text: `Hi ${toTitleCase(profile.firstName)}! I'm your CTS ETS Study Assistant. Ask me to explain a concept from your ${profile.programme} course!` }]);
  const [isTyping, setIsTyping] = useState(false);

  const askAI = async () => {
    if (!query.trim()) return;
    const userMsg = query.trim();
    setHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setQuery("");
    setIsTyping(true);

    try {
      const res = await fetch(`${VERCEL_URL}?action=aichat&query=${encodeURIComponent(userMsg)}&course=${encodeURIComponent(profile.programme)}`);
      const data = await res.json();
      setHistory(prev => [...prev, { role: "ai", text: data.response || "I'm having trouble connecting right now. Please try again later." }]);
    } catch(e) {
      setHistory(prev => [...prev, { role: "ai", text: "Network error. Please check your connection." }]);
    }
    setIsTyping(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={{ position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%", background: S.navy, color: "#fff", fontSize: 28, border: `3px solid ${S.gold}`, boxShadow: "0 8px 24px rgba(1,30,64,0.3)", cursor: "pointer", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}>{isOpen ? "✕" : "🤖"}</button>
      {isOpen && (
        <div style={{ position: "fixed", bottom: 100, right: 24, width: "calc(100% - 48px)", maxWidth: 380, height: 500, background: "#fff", borderRadius: 16, border: `1px solid ${S.border}`, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", zIndex: 9998, display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeIn 0.2s" }}>
          <div style={{ background: S.navy, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24 }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontFamily: S.heading, fontSize: 16, fontWeight: 700 }}>CTS Study Assistant</div>
              <div style={{ color: S.gold, fontFamily: S.body, fontSize: 11 }}>24/7 AI Tutor</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: "auto", background: S.lightBg, display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? S.teal : "#fff", color: msg.role === "user" ? "#fff" : S.navy, padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", maxWidth: "85%", fontSize: 14, fontFamily: S.body, border: msg.role === "ai" ? `1px solid ${S.border}` : "none", lineHeight: 1.5 }}>{msg.text}</div>
            ))}
            {isTyping && <div style={{ alignSelf: "flex-start", background: "#fff", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", border: `1px solid ${S.border}`, fontSize: 12, color: S.gray }}>Assistant is typing...</div>}
          </div>
          <div style={{ padding: 16, background: "#fff", borderTop: `1px solid ${S.border}`, display: "flex", gap: 8 }}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && askAI()} placeholder="Ask a question..." style={{ flex: 1, padding: "12px 16px", borderRadius: 20, border: `1px solid ${S.border}`, outline: "none", fontFamily: S.body, fontSize: 14 }} />
            <button onClick={askAI} disabled={!query.trim() || isTyping} style={{ width: 44, height: 44, borderRadius: "50%", background: query.trim() ? S.coral : S.border, color: "#fff", border: "none", cursor: query.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>↑</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Dashboard Component ───
function Dashboard({ studentData, onLogout, fetchDashboard }) {
  const profile = studentData.profile;
  const curriculum = studentData.curriculum || [];
  const payments = studentData.payments || [];
  
  const [progress, setProgress] = useState(studentData.progress || 1);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [imgError, setImgError] = useState(false);
  
  // 💳 EMBEDDED SMART PAYMENT SYSTEM STATES
  const [showPaymentModal, setShowPaymentModal] = useState(false); 
  const [payMethod, setPayMethod] = useState(""); 
  const [customAmount, setCustomAmount] = useState(profile.outstanding || 0);
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  
  const secureImgUrl = getDriveImageUrl(profile.photoUrl);
  const validTermText = getValidTerm(profile.programme, profile.level, profile.dateEnrolled);

  useEffect(() => { loadConfetti(); }, []);

  const handleQuizSelect = (qIndex, aIndex) => { setQuizAnswers(prev => ({ ...prev, [qIndex]: aIndex })); };

  // Helper to convert uploaded receipt to Base64 for Google Drive
  const toBase64 = (file) => new Promise((resolve, reject) => { 
    const reader = new FileReader(); 
    reader.onload = () => resolve(reader.result.split(',')[1]); 
    reader.onerror = error => reject(error); 
    reader.readAsDataURL(file); 
  });

  // 🚀 EMBEDDED BANK TRANSFER ENGINE
  const handleReceiptUpload = async () => {
    if (!receipt || submitting || customAmount < 1000) return;
    setSubmitting(true);
    try {
      const b64 = await toBase64(receipt);
      const fileData = [{ slot: "paymentReceipt", name: receipt.name, type: receipt.type, data: b64 }];
      
      const res = await fetch(APPS_SCRIPT_URL, { 
        method: "POST", 
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify({ 
          action: "submitpayment", 
          form_type: "Portal In-App Payment Evidence", 
          ref: profile.studentNumber, 
          studentName: profile.name, 
          email: profile.email, 
          paymentPlan: "Dashboard Payment", 
          amountPaid: customAmount, 
          paymentMethod: "bank_transfer", 
          files: fileData, 
          timestamp: new Date().toISOString() 
        }) 
      });

      if (res.ok) {
        setPaySuccess(true);
        setReceipt(null);
        if (window.confetti) window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        alert("Upload failed. Please check your internet connection and try again.");
      }
    } catch (e) { 
      console.error(e); 
      alert("A network error occurred. Please try again.");
    }
    setSubmitting(false); 
  };

  // 🚀 EMBEDDED WIPAY REDIRECT ENGINE
  const handleWiPayCheckout = () => {
    if (submitting || customAmount < 1000) return;
    setSubmitting(true);
    
    const orderId = profile.studentNumber + "-PORTAL"; 
    const paymentDescription = `Ref: ${profile.studentNumber} | Name: ${profile.name} | Email: ${profile.email}`;

    // Silently log the attempt
    try {
      fetch(APPS_SCRIPT_URL, { 
        method: "POST", 
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify({ action: "submitpayment", form_type: "WiPay Portal In-App Attempt", ref: profile.studentNumber, studentName: profile.name, email: profile.email, paymentPlan: "Dashboard Payment", amountPaid: customAmount, paymentMethod: "online", timestamp: new Date().toISOString() }) 
      });
    } catch (e) {}

    // Execute WiPay Redirect and bounce them back to the portal
    if (WIPAY_CONFIG && WIPAY_CONFIG.baseUrl.includes("/to_me/")) {
      let base = WIPAY_CONFIG.baseUrl;
      if (base.endsWith("/")) base = base.slice(0, -1); 
      window.location.href = `${base}/${customAmount}/${encodeURIComponent(paymentDescription)}`;
    } else if (WIPAY_CONFIG) {
      const returnUrl = encodeURIComponent(window.location.origin + "/#student-portal");
      window.location.href = `${WIPAY_CONFIG.baseUrl}?total=${encodeURIComponent(customAmount)}&currency=${encodeURIComponent(WIPAY_CONFIG.currency)}&order_id=${encodeURIComponent(orderId)}&return_url=${returnUrl}`;
    } else {
      alert("WiPay is not configured correctly. Please use Bank Transfer.");
      setSubmitting(false);
    }
  };

  const submitQuiz = async () => {
    let score = 0;
    const quizArray = JSON.parse(activeQuiz.quiz || "[]");
    if (Object.keys(quizAnswers).length < quizArray.length) return setQuizFeedback("Please answer all questions before submitting.");
    quizArray.forEach((q, index) => { if (quizAnswers[index] === q.a) score++; });
    const scorePct = Math.round((score / quizArray.length) * 100);
    setQuizLoading(true); setQuizFeedback("Grading assessment...");

    try {
      const res = await fetch(`${VERCEL_URL}?action=submitquiz&ref=${encodeURIComponent(profile.studentNumber)}&course=${encodeURIComponent(profile.programme)}&module=${activeQuiz.moduleNum}&score=${scorePct}`);
      const data = await res.json();
      if (data.ok && data.passed) {
        if (window.confetti) window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: [S.gold, S.teal, S.coral, S.emerald] });
        setQuizFeedback(`🏆 Excellent work! You scored ${scorePct}% and earned the Module ${activeQuiz.moduleNum} Competency Badge!`);
        setProgress(Math.max(progress, activeQuiz.moduleNum + 1));
        setTimeout(() => { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); fetchDashboard(profile.studentNumber); }, 4000);
      } else {
        setQuizFeedback(data.message || `You scored ${scorePct}%. 70% is required to pass.`);
      }
    } catch(e) { setQuizFeedback("Error saving score. Please check your connection."); }
    setQuizLoading(false);
  };

  const printIDCard = () => {
    const idHtml = document.getElementById('student-id-card').outerHTML;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`<html><head><title>CTS ETS Student ID</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"><style>body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; } @media print { @page { margin: 0; size: auto; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style></head><body>${idHtml}</body></html>`);
    win.document.close(); win.focus(); setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const DataRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${S.border}`, fontSize: 14, fontFamily: S.body }}>
      <span style={{ color: S.gray }}>{label}</span><span style={{ color: S.navy, fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", animation: "fadeIn 0.4s" }}>
      
      {/* 💳 SMART EMBEDDED PAYMENT MODAL */}
      {showPaymentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(1, 30, 64, 0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", padding: "20px" }}>
          <div style={{ background: "#fff", padding: "40px", borderRadius: 24, maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", position: "relative", animation: "fadeIn 0.3s" }}>
            
            <button onClick={() => { setShowPaymentModal(false); setPaySuccess(false); setPayMethod(""); }} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 28, cursor: "pointer", color: S.grayLight }}>✕</button>
            
            {paySuccess ? (
               <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeIn 0.4s" }}>
                 <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                 <h3 style={{ color: S.navy, fontFamily: S.heading, fontSize: 28, marginBottom: 16 }}>Evidence Submitted!</h3>
                 <p style={{ color: S.gray, fontFamily: S.body, fontSize: 16, marginBottom: 32, lineHeight: 1.5 }}>Your receipt has been securely uploaded to our Finance department. We will verify your payment of <strong>{fmt(customAmount)}</strong> and update your portal balance within 48-72 hours.</p>
                 <button onClick={() => { setShowPaymentModal(false); setPaySuccess(false); setPayMethod(""); }} style={{ padding: "16px 36px", background: S.emerald, color: "#fff", borderRadius: 12, border: "none", fontSize: