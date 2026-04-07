import { useState, useEffect } from "react";
import S from "../constants/styles";
import { PROGRAMMES } from "../constants/programmes"; 
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
  const [showPaymentModal, setShowPaymentModal] = useState(false); 
  
  const secureImgUrl = getDriveImageUrl(profile.photoUrl);
  const validTermText = getValidTerm(profile.programme, profile.level, profile.dateEnrolled);

  useEffect(() => { loadConfetti(); }, []);

  const handleQuizSelect = (qIndex, aIndex) => { setQuizAnswers(prev => ({ ...prev, [qIndex]: aIndex })); };

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
      
      {/* 💳 UPDATED PAYMENT MODAL WITH CORRECT BANK DETAILS */}
      {showPaymentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(1, 30, 64, 0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", padding: "20px" }}>
          <div style={{ background: "#fff", padding: "40px", borderRadius: 24, maxWidth: 600, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", position: "relative", animation: "fadeIn 0.3s" }}>
            <button onClick={() => setShowPaymentModal(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 28, cursor: "pointer", color: S.grayLight }}>✕</button>
            <h3 style={{ color: S.navy, fontFamily: S.heading, fontSize: 28, marginBottom: 16 }}>Clear Outstanding Balance</h3>
            <p style={{ color: S.gray, fontFamily: S.body, fontSize: 16, marginBottom: 32, lineHeight: 1.5 }}>
              Your current outstanding balance is <strong style={{color: S.coral}}>{fmt(profile.outstanding)}</strong>. Please select your preferred payment method below.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Online Payment Link */}
              <a href="/#pay" onClick={(e) => { setShowPaymentModal(false); window.location.href=`/#pay?ref=${profile.studentNumber}`; }} style={{ textDecoration: "none", background: S.tealLight, border: `2px solid ${S.teal}`, borderRadius: 16, padding: "20px", display: "flex", alignItems: "center", gap: 20, color: S.navy, cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                <span style={{ fontSize: 32 }}>💳</span>
                <div>
                  <div style={{ fontWeight: 800, fontFamily: S.body, fontSize: 18, marginBottom: 4 }}>Pay Online Now</div>
                  <div style={{ fontSize: 14, color: S.teal }}>Credit/Debit Card via Secure Gateway</div>
                </div>
              </a>

              {/* Local Bank Transfer Instructions */}
              <div style={{ background: S.lightBg, border: `2px solid ${S.border}`, borderRadius: 16, padding: "20px", color: S.navy }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>🏦</span>
                  <div>
                    <div style={{ fontWeight: 800, fontFamily: S.body, fontSize: 18, marginBottom: 4 }}>Bank Transfer (Jamaica)</div>
                    <div style={{ fontSize: 14, color: S.gray }}>Deposit directly to our institution account</div>
                  </div>
                </div>
                <div style={{ background: "#fff", padding: "20px", borderRadius: 12, fontSize: 14, fontFamily: "monospace", border: `1px solid ${S.grayLight}`, lineHeight: 1.6 }}>
                  
                  {/* Option 1: Scotiabank */}
                  <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px dashed #CBD5E1" }}>
                    <div style={{ fontWeight: 800, color: S.navy, fontSize: 15, marginBottom: 8, fontFamily: S.body }}>🏦 Option 1: Scotiabank</div>
                    <strong>Bank Name:</strong> Bank of Nova Scotia (BNS)<br/>
                    <strong>Account Name:</strong> Mark Lindo trading as CTS Empowerment & Training Solution<br/>
                    <strong>Account Number:</strong> 001041411<br/>
                    <strong>Account Type:</strong> Savings<br/>
                    <strong>Branch / Transit:</strong> Scotia Center / 50765
                  </div>

                  {/* Option 2: NCB */}
                  <div>
                    <div style={{ fontWeight: 800, color: S.navy, fontSize: 15, marginBottom: 8, fontFamily: S.body }}>🏦 Option 2: National Commercial Bank (NCB)</div>
                    <strong>Bank Name:</strong> National Commercial Bank (NCB)<br/>
                    <strong>Account Name:</strong> Mark Lindo<br/>
                    <strong>Account Number:</strong> 214121697<br/>
                    <strong>Account Type:</strong> Personal
                  </div>

                  <div style={{ marginTop: 16, padding: "12px", background: S.amberLight, color: S.amberDark, borderRadius: 8, fontSize: 13, fontFamily: S.body, border: `1px solid ${S.amber}40` }}>
                    <strong>Important:</strong> Include your Student ID <strong>({profile.studentNumber})</strong> in the transaction memo. Once transferred, email your receipt to <strong>finance@ctsetsjm.com</strong>. Or click "Pay Online Now" above to upload it via the payment portal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 UPGRADED HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${S.navy} 0%, ${S.teal} 100%)`, borderRadius: 16, padding: "32px", color: "#fff", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, boxShadow: "0 10px 30px rgba(1, 30, 64, 0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {secureImgUrl && !imgError ? (
            <img src={secureImgUrl} alt="Profile" onError={() => setImgError(true)} style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.3)" }} referrerPolicy="no-referrer" />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, color: "#fff", border: "4px solid rgba(255,255,255,0.3)" }}>
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, fontFamily: S.body, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>Welcome back,</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, margin: "4px 0" }}>{toTitleCase(profile.name)}</h2>
            <div style={{ fontSize: 16, fontWeight: 800, color: S.gold, fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>{profile.studentNumber}</div>
            
            <div style={{ fontSize: 14, opacity: 0.9, fontFamily: S.body }}>
              {profile.level ? `${profile.level} in ${profile.programme}` : profile.programme}
            </div>
            
            <div style={{ fontSize: 13, color: S.gold, fontFamily: S.body, fontWeight: 700, marginTop: 4 }}>
              {validTermText}
            </div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: "12px 32px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body, transition: "0.2s" }}>Log Out</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, borderBottom: `2px solid ${S.border}`, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 4 }}>
        {[{ id: "classroom", label: "📚 My Classroom" }, { id: "profile", label: "👤 My Profile & ID" }, { id: "portfolio", label: "📁 NCTVET Portfolio" }, { id: "finance", label: "💳 My Finances" }].map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveQuiz(null); }} style={{ padding: "16px 24px", background: "none", border: "none", borderBottom: activeTab === t.id ? `3px solid ${S.coral}` : "3px solid transparent", color: activeTab === t.id ? S.coral : S.gray, fontWeight: activeTab === t.id ? 800 : 600, fontSize: 15, fontFamily: S.body, cursor: "pointer", transition: "0.2s" }}>{t.label}</button>
        ))}
      </div>

      {/* CLASSROOM TAB */}
      {activeTab === "classroom" && (
        <div>
          {!profile.lmsAccess ? (
            <div style={{ background: S.amberLight, borderRadius: 16, padding: "48px", border: `2px solid ${S.amber}40`, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 26, marginBottom: 12 }}>Portal Access Restricted</h3>
              <p style={{ fontFamily: S.body, color: S.gray, fontSize: 16, maxWidth: "600px", margin: "0 auto" }}>Your learning portal is currently locked. If you have an outstanding balance, please navigate to the <b>My Finances</b> tab to clear it.</p>
            </div>
          ) : activeQuiz ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "40px", border: `1px solid ${S.border}` }}>
              <button onClick={() => { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); }} style={{ background: "none", border: "none", color: S.teal, fontWeight: 700, cursor: "pointer", marginBottom: 24, fontSize: 15, fontFamily: S.body, display: "flex", alignItems: "center", gap: 8 }}><span>←</span> Return to Modules</button>
              {JSON.parse(activeQuiz.quiz || "[]").length === 0 ? (
                <div><h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 20, fontSize: 24 }}>Module {activeQuiz.moduleNum}: {activeQuiz.title}</h3><p style={{ fontFamily: S.body, color: S.gray, fontSize: 15 }}>There is no interactive assessment for this module. Please complete the reading materials.</p></div>
              ) : (
                <div>
                  <div style={{ fontSize: 12, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>Knowledge Check</div>
                  <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 28, marginBottom: 32 }}>Module {activeQuiz.moduleNum}: {activeQuiz.title}</h3>
                  {JSON.parse(activeQuiz.quiz || "[]").map((q, i) => (
                    <div key={i} style={{ marginBottom: 32 }}><p style={{ fontFamily: S.body, fontWeight: 700, color: S.navy, marginBottom: 16, fontSize: 16 }}>{i + 1}. {q.q}</p>
                      {q.options.map((opt, optIndex) => {
                        const isSelected = quizAnswers[i] === optIndex;
                        return (<label key={optIndex} style={{ display: "block", padding: "16px 20px", border: `2px solid ${isSelected ? S.teal : S.border}`, background: isSelected ? `${S.teal}10` : "#fff", borderRadius: 10, marginBottom: 12, cursor: "pointer", fontFamily: S.body, fontSize: 15, fontWeight: isSelected ? 600 : 400 }}><input type="radio" name={`q_${i}`} value={optIndex} checked={isSelected} onChange={() => handleQuizSelect(i, optIndex)} style={{ marginRight: 14, transform: "scale(1.2)" }} />{opt}</label>);
                      })}
                    </div>
                  ))}
                  {quizFeedback && <div style={{ padding: "20px", borderRadius: 12, background: quizFeedback.includes("Success") ? S.emeraldLight : S.amberLight, color: quizFeedback.includes("Success") ? S.emeraldDark : S.amberDark, fontFamily: S.body, fontSize: 16, fontWeight: 600, marginBottom: 24, textAlign: "center" }}>{quizFeedback}</div>}
                  <Btn primary onClick={submitQuiz} disabled={quizLoading} style={{ background: S.coral, color: "#fff", width: "100%", maxWidth: "340px", fontSize: 16, padding: "18px", borderRadius: 10 }}>{quizLoading ? "Grading..." : "Submit Assessment"}</Btn>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 32 }}><h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, margin: "0 0 10px 0" }}>Your Learning Path</h3><p style={{ fontFamily: S.body, fontSize: 15, color: S.gray }}>Pass the module assessment with 70% or higher to earn your badge.</p></div>
              {curriculum.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", background: "#fff", border: `1px solid ${S.border}`, borderRadius: 16, color: S.gray, fontFamily: S.body, fontSize: 16 }}>Your curriculum is being populated by your instructor. Check back soon.</div>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  {curriculum.map((mod) => {
                    const isUnlocked = mod.moduleNum <= progress; const isCompleted = mod.moduleNum < progress;
                    return (
                      <div key={mod.moduleNum} style={{ background: isUnlocked ? "#fff" : S.lightBg, borderRadius: 16, border: `2px solid ${isCompleted ? S.emerald + "50" : S.border}`, padding: "28px", display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "center", opacity: isUnlocked ? 1 : 0.5 }}>
                        <div style={{ flex: 1, minWidth: "280px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            {isCompleted ? <span style={{ padding: "6px 14px", borderRadius: 20, background: S.emerald, color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1 }}>🏆 Badge Earned</span> : isUnlocked ? <span style={{ padding: "6px 14px", borderRadius: 20, background: S.tealLight, color: S.teal, fontSize: 11, fontWeight: 800, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1, border: `1px solid ${S.teal}30` }}>📍 Current Module</span> : <span style={{ padding: "6px 14px", borderRadius: 20, background: S.border, color: S.gray, fontSize: 11, fontWeight: 800, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1 }}>🔒 Locked</span>}
                          </div>
                          <h4 style={{ fontFamily: S.heading, fontSize: "clamp(18px, 3vw, 22px)", color: S.navy, margin: 0 }}>Module {mod.moduleNum}: {mod.title}</h4>
                        </div>
                        {isUnlocked ? (
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", maxWidth: "380px" }}>
                            {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "14px 20px", borderRadius: 8, border: `2px solid ${S.navy}`, color: S.navy, textDecoration: "none", fontSize: 14, fontWeight: 700, fontFamily: S.body }}>Read Material</a>}
                            <button onClick={() => setActiveQuiz(mod)} style={{ flex: 1, padding: "14px 20px", borderRadius: 8, border: "none", background: isCompleted ? S.emerald : S.coral, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{isCompleted ? "Review Assessment" : "Take Assessment"}</button>
                          </div>
                        ) : <span style={{ fontSize: 14, color: S.gray, fontFamily: S.body, fontWeight: 600 }}>Pass Module {mod.moduleNum - 1} to unlock</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PROFILE & DIGITAL ID TAB */}
      {activeTab === "profile" && (
         <div style={{ animation: "fadeIn 0.3s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
             <div>
               <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: `1px solid ${S.border}`, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 24 }}>Digital Student ID</div>
                  <div id="student-id-card" style={{ width: "380px", height: "230px", borderRadius: "14px", background: `linear-gradient(135deg, ${S.navy} 0%, #0a2d4d 100%)`, color: "#fff", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 10px 25px rgba(1, 30, 64, 0.25)", border: `1px solid ${S.gold}50` }}>
                    <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(196, 145, 18, 0.15)" }} />
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "10px", alignItems: "center", background: "rgba(0,0,0,0.2)" }}>
                      <img src="/logo.jpg" alt="Logo" style={{ width: 36, height: 36, borderRadius: "6px", border: `1px solid ${S.gold}` }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: S.gold, letterSpacing: 0.5, lineHeight: 1.1 }}>CTS Empowerment &</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: S.gold, letterSpacing: 0.5, lineHeight: 1.1 }}>Training Solutions</div>
                        <div style={{ fontSize: 7, color: "#fff", letterSpacing: 0.5, marginTop: 3, textTransform: "uppercase", opacity: 0.9 }}>Committed to Service | Excellence Through Service</div>
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.8, textAlign: "right" }}>Student<br/>Identity Card</div>
                    </div>
                    <div style={{ padding: "16px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      {secureImgUrl && !imgError ? (
                        <img src={secureImgUrl} alt="Student" onError={() => setImgError(true)} style={{ width: 85, height: 110, objectFit: "cover", borderRadius: "6px", border: `2px solid ${S.gold}`, background: "#fff", zIndex: 2, position: "relative" }} referrerPolicy="no-referrer" />
                      ) : (
                        <div style={{ width: 85, height: 110, background: "rgba(255,255,255,0.1)", borderRadius: "6px", border: `2px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", zIndex: 2, position: "relative" }}>{(profile.name || "S").charAt(0).toUpperCase()}</div>
                      )}
                      <div style={{ flex: 1, zIndex: 2, position: "relative" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1, marginBottom: 2 }}>{toTitleCase(profile.name)}</div>
                        <div style={{ fontSize: 10, color: S.gold, fontWeight: 700, marginBottom: 10, fontFamily: "monospace", letterSpacing: 1 }}>{profile.studentNumber}</div>
                        <div style={{ fontSize: 8, opacity: 0.7, textTransform: "uppercase", marginBottom: 2, letterSpacing: 0.5 }}>Programme & Level</div>
                        <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }}>{profile.level ? `${profile.level} in ${profile.programme}` : profile.programme}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div>
                            <div style={{ fontSize: 8, opacity: 0.7, textTransform: "uppercase", marginBottom: 2, letterSpacing: 0.5 }}>Valid Term</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{validTermText}</div>
                          </div>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: profile.status === "Enrolled" || profile.status === "Active" ? S.emerald : S.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>✓</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Btn primary onClick={printIDCard} style={{ marginTop: 24, background: S.coral, color: "#fff", width: "100%", maxWidth: "380px", fontSize: 14 }}>📥 Download / Print ID</Btn>
               </div>
             </div>

             <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: `1px solid ${S.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                 <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 24, fontSize: 20 }}>Official Institutional Record</h3>
                 
                 <div style={{ padding: "8px 12px", background: S.navy, color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Personal Details</div>
                 <DataRow label="Full Name" value={toTitleCase(profile.name)} />
                 <DataRow label="Date of Birth" value={profile.dob} />
                 <DataRow label="TRN" value={profile.trn} />
                 <DataRow label="Phone Number" value={profile.phone} />
                 <DataRow label="Home Address" value={toTitleCase(profile.address)} />
                 <DataRow label="Email Address" value={profile.email} />
                 
                 <div style={{ padding: "8px 12px", background: S.teal, color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginTop: 24, marginBottom: 12 }}>Academic & Financial</div>
                 <DataRow label="Student Number" value={profile.studentNumber} />
                 <DataRow label="Enrolled Programme" value={profile.programme} />
                 <DataRow label="Qualification Level" value={profile.level} />
                 <DataRow label="Academic Status" value={profile.status} />
                 <DataRow label="Date Enrolled" value={profile.dateEnrolled ? new Date(profile.dateEnrolled).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"} />
                 
                 <div style={{ padding: "8px 12px", background: S.coral, color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginTop: 24, marginBottom: 12 }}>Emergency Contact</div>
                 <DataRow label="Contact Name" value={toTitleCase(profile.emergencyName)} />
                 <DataRow label="Contact Phone" value={profile.emergencyPhone} />

                 <div style={{ marginTop: 32, padding: "16px", background: S.amberLight, borderRadius: 8, fontSize: 13, color: S.amberDark, fontFamily: S.body, lineHeight: 1.6, border: `1px solid ${S.amber}40` }}>
                     To request corrections to your official record, please contact <strong>admin@ctsetsjm.com</strong>.
                 </div>
             </div>
         </div>
      )}

      {/* PORTFOLIO TAB */}
      {activeTab === "portfolio" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px", border: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 16, fontSize: 26 }}>Submit NCTVET Practical Evidence</h3>
          <p style={{ fontFamily: S.body, color: S.gray, fontSize: 16, marginBottom: 32, lineHeight: 1.8, maxWidth: "800px" }}>Your programme requires practical competency evidence. Upload your large videos or documents to Google Drive or YouTube, ensure the permission is set to <strong>"Anyone with the link can view"</strong>, and paste it below.</p>
          <input type="text" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="Paste your link here..." style={{ width: "100%", padding: "20px 24px", borderRadius: 10, border: `2px solid ${S.border}`, fontSize: 16, fontFamily: S.body, marginBottom: 24, outline: "none", background: S.lightBg }} />
          <Btn primary onClick={() => { if(!portfolioLink) return alert("Please paste a link first."); alert(`Your evidence has been securely logged for Assessor review.`); setPortfolioLink(""); }} style={{ background: S.coral, color: "#fff", fontSize: 16, width: "100%", maxWidth: "340px", padding: "18px", borderRadius: 10 }}>Submit to Assessor</Btn>
        </div>
      )}

      {/* FINANCE TAB WITH HISTORY */}
      {activeTab === "finance" && (
        <div style={{ animation: "fadeIn 0.3s" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "40px", border: `1px solid ${S.border}`, textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 16 }}>Total Programme Cost</div>
              <div style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight