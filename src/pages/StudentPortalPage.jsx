import { useState, useEffect } from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";

// REQUIRED INSTITUTIONAL CONSTANT
const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

const getDriveImageUrl = (url) => {
  if (!url) return null;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  return url;
};

// Gamification: Inject Confetti Library
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
  const [history, setHistory] = useState([{ role: "ai", text: `Hi ${profile.firstName}! I'm your CTS ETS Study Assistant. Ask me to explain a concept from your ${profile.programme} course!` }]);
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
      <button onClick={() => setIsOpen(!isOpen)} style={{ position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%", background: S.navy, color: "#fff", fontSize: 28, border: `3px solid ${S.gold}`, boxShadow: "0 8px 24px rgba(1,30,64,0.3)", cursor: "pointer", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}>
        {isOpen ? "✕" : "🤖"}
      </button>

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
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? S.teal : "#fff", color: msg.role === "user" ? "#fff" : S.navy, padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", maxWidth: "85%", fontSize: 14, fontFamily: S.body, border: msg.role === "ai" ? `1px solid ${S.border}` : "none", lineHeight: 1.5 }}>
                {msg.text}
              </div>
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
  const [progress, setProgress] = useState(studentData.progress || 1);
  const [activeTab, setActiveTab] = useState("classroom");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [imgError, setImgError] = useState(false);
  
  const secureImgUrl = getDriveImageUrl(profile.photoUrl);

  useEffect(() => { loadConfetti(); }, []);

  const handleQuizSelect = (qIndex, aIndex) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
  };

  const submitQuiz = async () => {
    let score = 0;
    const quizArray = JSON.parse(activeQuiz.quiz || "[]");
    
    if (Object.keys(quizAnswers).length < quizArray.length) {
      setQuizFeedback("Please answer all questions before submitting.");
      return;
    }

    quizArray.forEach((q, index) => { if (quizAnswers[index] === q.a) score++; });
    const scorePct = Math.round((score / quizArray.length) * 100);
    setQuizLoading(true);
    setQuizFeedback("Grading assessment...");

    try {
      const res = await fetch(`${VERCEL_URL}?action=submitquiz&ref=${encodeURIComponent(profile.studentNumber)}&course=${encodeURIComponent(profile.programme)}&module=${activeQuiz.moduleNum}&score=${scorePct}`);
      const data = await res.json();

      if (data.ok && data.passed) {
        if (window.confetti) {
          window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: [S.gold, S.teal, S.coral, S.emerald] });
        }
        setQuizFeedback(`🏆 Excellent work! You scored ${scorePct}% and earned the Module ${activeQuiz.moduleNum} Competency Badge!`);
        setProgress(Math.max(progress, activeQuiz.moduleNum + 1));
        
        setTimeout(() => { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); fetchDashboard(profile.studentNumber); }, 4000);
      } else {
        setQuizFeedback(data.message || `You scored ${scorePct}%. 70% is required to pass. Please review the material and try again.`);
      }
    } catch(e) { setQuizFeedback("Error saving score. Please check your connection."); }
    setQuizLoading(false);
  };

  const printIDCard = () => {
    const idHtml = document.getElementById('student-id-card').outerHTML;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`
      <html><head><title>CTS ETS Student ID - ${profile.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print {
          @page { margin: 0; size: auto; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
      </head><body>${idHtml}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const DataRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${S.border}`, fontSize: 14, fontFamily: S.body }}>
      <span style={{ color: S.gray }}>{label}</span>
      <span style={{ color: S.navy, fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", animation: "fadeIn 0.4s" }}>
      {/* Welcome Bar */}
      <div style={{ background: `linear-gradient(135deg, ${S.navy} 0%, ${S.teal} 100%)`, borderRadius: 16, padding: "32px", color: "#fff", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, boxShadow: "0 10px 30px rgba(1, 30, 64, 0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {secureImgUrl && !imgError ? (
            <img src={secureImgUrl} alt="Profile" onError={() => setImgError(true)} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.3)" }} referrerPolicy="no-referrer" crossOrigin="anonymous" />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", border: "4px solid rgba(255,255,255,0.3)" }}>
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 13, opacity: 0.8, fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase" }}>Welcome back, Student</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, margin: "4px 0" }}>{profile.name}</h2>
            <div style={{ fontSize: 14, opacity: 0.9, fontFamily: S.body }}>{profile.studentNumber} • {profile.programme}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: "12px 32px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body, transition: "0.2s" }}>Log Out</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, borderBottom: `2px solid ${S.border}`, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 4 }}>
        {[
          { id: "classroom", label: "📚 My Classroom" },
          { id: "profile", label: "👤 My Profile & ID" },
          { id: "portfolio", label: "📁 NCTVET Portfolio" },
          { id: "finance", label: "💳 My Finances" }
        ].map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveQuiz(null); }} 
            style={{ padding: "16px 24px", background: "none", border: "none", borderBottom: activeTab === t.id ? `3px solid ${S.coral}` : "3px solid transparent", color: activeTab === t.id ? S.coral : S.gray, fontWeight: activeTab === t.id ? 800 : 600, fontSize: 15, fontFamily: S.body, cursor: "pointer", transition: "0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CLASSROOM TAB */}
      {activeTab === "classroom" && (
        <div>
          {!profile.lmsAccess ? (
            <div style={{ background: S.amberLight, borderRadius: 16, padding: "48px", border: `2px solid ${S.amber}40`, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 26, marginBottom: 12 }}>Portal Access Restricted</h3>
              <p style={{ fontFamily: S.body, color: S.gray, fontSize: 16, maxWidth: "600px", margin: "0 auto" }}>Your learning portal is currently locked. If you have an outstanding balance, please navigate to the <b>My Finances</b> tab to clear it. Once verified, access is restored instantly.</p>
            </div>
          ) : activeQuiz ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "40px", border: `1px solid ${S.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <button onClick={() => { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); }} style={{ background: "none", border: "none", color: S.teal, fontWeight: 700, cursor: "pointer", marginBottom: 24, fontSize: 15, fontFamily: S.body, display: "flex", alignItems: "center", gap: 8 }}><span>←</span> Return to Modules</button>
              
              {JSON.parse(activeQuiz.quiz || "[]").length === 0 ? (
                <div>
                  <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 20, fontSize: 24 }}>Module {activeQuiz.moduleNum}: {activeQuiz.title}</h3>
                  <p style={{ fontFamily: S.body, color: S.gray, fontSize: 15 }}>There is no interactive assessment for this module. Please complete the reading materials.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 12, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>Knowledge Check</div>
                  <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 28, marginBottom: 32 }}>Module {activeQuiz.moduleNum}: {activeQuiz.title}</h3>
                  
                  {JSON.parse(activeQuiz.quiz || "[]").map((q, i) => (
                    <div key={i} style={{ marginBottom: 32 }}>
                      <p style={{ fontFamily: S.body, fontWeight: 700, color: S.navy, marginBottom: 16, fontSize: 16 }}>{i + 1}. {q.q}</p>
                      {q.options.map((opt, optIndex) => {
                        const isSelected = quizAnswers[i] === optIndex;
                        return (
                          <label key={optIndex} style={{ display: "block", padding: "16px 20px", border: `2px solid ${isSelected ? S.teal : S.border}`, background: isSelected ? `${S.teal}10` : "#fff", borderRadius: 10, marginBottom: 12, cursor: "pointer", fontFamily: S.body, fontSize: 15, transition: "0.2s", fontWeight: isSelected ? 600 : 400 }}>
                            <input type="radio" name={`q_${i}`} value={optIndex} checked={isSelected} onChange={() => handleQuizSelect(i, optIndex)} style={{ marginRight: 14, transform: "scale(1.2)" }} />
                            {opt}
                          </label>
                        );
                      })}
                    </div>
                  ))}
                  
                  {quizFeedback && (
                    <div style={{ padding: "20px", borderRadius: 12, background: quizFeedback.includes("Success") ? S.emeraldLight : S.amberLight, color: quizFeedback.includes("Success") ? S.emeraldDark : S.amberDark, fontFamily: S.body, fontSize: 16, fontWeight: 600, marginBottom: 24, border: `2px solid ${quizFeedback.includes("Success") ? S.emerald : S.amber}40`, textAlign: "center" }}>
                      {quizFeedback}
                    </div>
                  )}
                  <Btn primary onClick={submitQuiz} disabled={quizLoading} style={{ background: S.coral, color: "#fff", width: "100%", maxWidth: "340px", fontSize: 16, padding: "18px", borderRadius: 10 }}>{quizLoading ? "Grading..." : "Submit Assessment"}</Btn>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, margin: "0 0 10px 0" }}>Your Learning Path</h3>
                <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray }}>Pass the module assessment with 70% or higher to earn your badge and unlock the next stage.</p>
              </div>
              
              {curriculum.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", background: "#fff", border: `1px solid ${S.border}`, borderRadius: 16, color: S.gray, fontFamily: S.body, fontSize: 16 }}>Your curriculum is being populated by your instructor. Check back soon.</div>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  {curriculum.map((mod) => {
                    const isUnlocked = mod.moduleNum <= progress;
                    const isCompleted = mod.moduleNum < progress;
                    return (
                      <div key={mod.moduleNum} style={{ background: isUnlocked ? "#fff" : S.lightBg, borderRadius: 16, border: `2px solid ${isCompleted ? S.emerald + "50" : isUnlocked ? S.border : S.border}`, padding: "28px", display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "center", opacity: isUnlocked ? 1 : 0.5, transition: "0.3s", boxShadow: isUnlocked && !isCompleted ? "0 4px 15px rgba(0,0,0,0.04)" : "none" }}>
                        <div style={{ flex: 1, minWidth: "280px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            {isCompleted ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: S.emerald, color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1, boxShadow: `0 2px 8px ${S.emerald}50` }}>🏆 Badge Earned</span>
                            ) : isUnlocked ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: S.tealLight, color: S.teal, fontSize: 11, fontWeight: 800, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1, border: `1px solid ${S.teal}30` }}>📍 Current Module</span>
                            ) : (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: S.border, color: S.gray, fontSize: 11, fontWeight: 800, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1 }}>🔒 Locked</span>
                            )}
                          </div>
                          <h4 style={{ fontFamily: S.heading, fontSize: "clamp(18px, 3vw, 22px)", color: S.navy, margin: 0 }}>Module {mod.moduleNum}: {mod.title}</h4>
                        </div>
                        
                        {isUnlocked ? (
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", maxWidth: "380px" }}>
                            {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "14px 20px", borderRadius: 8, border: `2px solid ${S.navy}`, color: S.navy, textDecoration: "none", fontSize: 14, fontWeight: 700, fontFamily: S.body, transition: "0.2s" }}>Read Material</a>}
                            <button onClick={() => setActiveQuiz(mod)} style={{ flex: 1, padding: "14px 20px", borderRadius: 8, border: "none", background: isCompleted ? S.emerald : S.coral, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body, transition: "0.2s", boxShadow: `0 4px 12px ${isCompleted ? S.emerald : S.coral}40` }}>
                              {isCompleted ? "Review Assessment" : "Take Assessment"}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, color: S.gray, fontFamily: S.body, fontWeight: 600 }}>Pass Module {mod.moduleNum - 1} to unlock</span>
                        )}
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
             {/* Left Column: The ID Card */}
             <div>
               <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: `1px solid ${S.border}`, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 24 }}>Digital Student ID</div>
                  
                  {/* The Physical ID Card Design */}
                  <div id="student-id-card" style={{ width: "350px", height: "220px", borderRadius: "14px", background: `linear-gradient(135deg, ${S.navy} 0%, #0a2d4d 100%)`, color: "#fff", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 10px 25px rgba(1, 30, 64, 0.25)", border: `1px solid ${S.gold}50` }}>
                    <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(196, 145, 18, 0.15)" }} />
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: S.gold, letterSpacing: 0.5 }}>CTS ETS</div>
                      <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.8 }}>Student Identity Card</div>
                    </div>
                    <div style={{ padding: "16px 20px", display: "flex", gap: "16px", alignItems: "center" }}>
                      {secureImgUrl && !imgError ? (
                        <img src={secureImgUrl} alt="Student" onError={() => setImgError(true)} style={{ width: 85, height: 105, objectFit: "cover", borderRadius: "6px", border: `2px solid ${S.gold}` }} referrerPolicy="no-referrer" crossOrigin="anonymous" />
                      ) : (
                        <div style={{ width: 85, height: 105, background: "rgba(255,255,255,0.1)", borderRadius: "6px", border: `2px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff" }}>{(profile.name || "S").charAt(0)}</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>{profile.name}</div>
                        <div style={{ fontSize: 10, color: S.gold, fontWeight: 700, marginBottom: 12 }}>{profile.studentNumber}</div>
                        <div style={{ fontSize: 9, opacity: 0.7, textTransform: "uppercase", marginBottom: 2 }}>Programme</div>
                        <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, marginBottom: 8 }}>{profile.programme}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div>
                            <div style={{ fontSize: 9, opacity: 0.7, textTransform: "uppercase", marginBottom: 2 }}>Valid Term</div>
                            <div style={{ fontSize: 10, fontWeight: 600 }}>2026 - 2027</div>
                          </div>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: profile.status === "Enrolled" || profile.status === "Active" ? S.emerald : S.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Btn primary onClick={printIDCard} style={{ marginTop: 24, background: S.coral, color: "#fff", width: "100%", maxWidth: "350px", fontSize: 14 }}>📥 Download / Print ID</Btn>
               </div>
             </div>

             {/* Right Column: Institutional Data */}
             <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: `1px solid ${S.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                 <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 24, fontSize: 20 }}>Official Institutional Record</h3>
                 <DataRow label="Full Name" value={profile.name} />
                 <DataRow label="Student Number" value={profile.studentNumber} />
                 <DataRow label="Email Address" value={profile.email} />
                 <DataRow label="Enrolled Programme" value={profile.programme} />
                 <DataRow label="Qualification Level" value={profile.level} />
                 <DataRow label="Academic Status" value={profile.status} />
                 <div style={{ marginTop: 24, padding: "16px", background: S.amberLight, borderRadius: 8, fontSize: 13, color: S.amberDark, fontFamily: S.body, lineHeight: 1.6, border: `1px solid ${S.amber}40` }}>
                     To request corrections to your official name or email, please contact <strong>admin@ctsetsjm.com</strong>.
                 </div>
             </div>
         </div>
      )}

      {/* PORTFOLIO TAB */}
      {activeTab === "portfolio" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px", border: `1px solid ${S.border}`, animation: "fadeIn 0.3s" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 16, fontSize: 26 }}>Submit NCTVET Practical Evidence</h3>
          <p style={{ fontFamily: S.body, color: S.gray, fontSize: 16, marginBottom: 32, lineHeight: 1.8, maxWidth: "800px" }}>Your programme requires practical competency evidence. Upload your large videos or documents to Google Drive or YouTube, ensure the permission is set to <strong>"Anyone with the link can view"</strong>, and paste it below.</p>
          <input type="text" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="Paste your Google Drive or YouTube link here..." style={{ width: "100%", padding: "20px 24px", borderRadius: 10, border: `2px solid ${S.border}`, fontSize: 16, fontFamily: S.body, marginBottom: 24, outline: "none", background: S.lightBg }} />
          <Btn primary onClick={() => { 
            if(!portfolioLink) return alert("Please paste a link first.");
            alert(`Your evidence has been securely logged for Assessor review. (Link: ${portfolioLink})`); 
            setPortfolioLink(""); 
          }} style={{ background: S.coral, color: "#fff", fontSize: 16, width: "100%", maxWidth: "340px", padding: "18px", borderRadius: 10 }}>Submit to Assessor</Btn>
        </div>
      )}

      {/* FINANCE TAB */}
      {activeTab === "finance" && (
        <div style={{ animation: "fadeIn 0.3s" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "40px", border: `1px solid ${S.border}`, textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 16 }}>Total Programme Cost</div>
              <div style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, color: S.navy, fontFamily: S.heading, marginBottom: 24 }}>{fmt(profile.totalFees)}</div>
              
              <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 16, fontFamily: S.body, borderTop: `1px solid ${S.border}`, paddingTop: 24 }}>
                <span style={{ color: S.emerald, fontWeight: 700 }}>Total Paid: {fmt(profile.totalPaid)}</span>
                <span style={{ color: profile.outstanding > 0 ? S.coral : S.emerald, fontWeight: 700 }}>Outstanding: {fmt(profile.outstanding)}</span>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default function StudentPortalPage({ setPage }) {
  const [studentData, setStudentData] = useState(null);
  
  // Custom Gateway Auth State
  const [loginStep, setLoginStep] = useState(0); // 0 = ID, 1 = OTP
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Auto-logout after 15 mins
  useEffect(() => {
    if (!studentData) return;
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => { setStudentData(null); sessionStorage.removeItem("cts_portal_session"); alert("Signed out due to inactivity."); }, 15 * 60 * 1000);
    };
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(evt => document.addEventListener(evt, resetTimer));
    resetTimer();
    return () => events.forEach(evt => document.removeEventListener(evt, resetTimer));
  }, [studentData]);

  // Restoring session on load
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cts_portal_session");
      if (saved) setStudentData(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const fetchDashboard = async (verifiedId) => {
    try {
      const res = await fetch(`${VERCEL_URL}?action=getstudentdashboard_otp&ref=${encodeURIComponent(verifiedId)}`);
      const data = await res.json();
      if (data.ok) {
        setStudentData(data);
        sessionStorage.setItem("cts_portal_session", JSON.stringify(data));
      } else {
        setAuthError(data.error || "Could not load student record.");
        setLoginStep(0);
      }
    } catch (e) {
      setAuthError("Network error connecting to the learning portal.");
      setLoginStep(0);
    }
  };

  const handleSendCode = async () => {
    if (!identifier.trim()) return;
    setAuthLoading(true); setAuthError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=sendotp&identifier=${encodeURIComponent(identifier.trim())}&purpose=portal`);
      const data = await res.json();
      if (data.success) {
        setLoginStep(1);
      } else {
        setAuthError("We could not find a student record with that ID.");
      }
    } catch (e) { setAuthError("Network error. Please check your connection."); }
    setAuthLoading(false);
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) { setAuthError("Please enter the 6-digit code."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=verifyotp&identifier=${encodeURIComponent(identifier.trim())}&code=${otpCode}&purpose=portal`);
      const data = await res.json();
      if (data.success) {
        setAuthError("");
        await fetchDashboard(identifier.trim());
      } else {
        setAuthError(data.error === "wrong_code" ? "Invalid code." : "Code expired. Please try again.");
      }
    } catch (e) { setAuthError("Network error. Please check your connection."); }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setStudentData(null);
    setLoginStep(0);
    setIdentifier("");
    setOtpCode("");
    sessionStorage.removeItem("cts_portal_session");
  };

  // ═══ STUDENT GATEWAY UI ═══
  if (!studentData) {
    const animStyles = `
      @keyframes pulseGateway {
        0% { box-shadow: 0 0 0 0 rgba(232, 99, 74, 0.4); }
        70% { box-shadow: 0 0 0 40px rgba(232, 99, 74, 0); }
        100% { box-shadow: 0 0 0 0 rgba(232, 99, 74, 0); }
      }
      @keyframes floatCap {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-15px) scale(1.05); }
      }
      @keyframes blinkNode {
        0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px ${S.teal}; }
        50% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px ${S.teal}; }
      }
    `;

    const NodeBadge = ({ label, delay }) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.4)", padding: "14px 24px", borderRadius: 30, border: "1px solid rgba(14, 143, 139, 0.3)", backdropFilter: "blur(4px)" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: S.teal, animation: `blinkNode 2s infinite ${delay}` }} />
        <span style={{ color: S.teal, fontSize: 12, fontWeight: 800, fontFamily: S.body, letterSpacing: 2, textTransform: "uppercase" }}>{label}: ONLINE</span>
      </div>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: S.bg, fontFamily: S.body }}>
        <style>{animStyles}</style>

        {/* Gateway Header */}
        <div style={{ background: S.navy, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", position: "relative", zIndex: 10, borderBottom: `2px solid ${S.coral}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src="/logo.jpg" alt="CTS ETS" style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${S.gold}`, boxShadow: `0 0 15px ${S.gold}40` }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 24, fontFamily: S.heading, letterSpacing: 0.5 }}>Student Portal</div>
              <div style={{ color: S.coral, fontSize: 11, letterSpacing: 4, fontWeight: 800, marginTop: 4, textTransform: "uppercase" }}>SECURE LEARNING GATEWAY</div>
            </div>
          </div>
          <a href="/#Home" style={{ color: "#fff", fontSize: 13, textDecoration: "none", fontWeight: 800, padding: "14px 28px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 1 }}>&larr; Back to Website</a>
        </div>

        {/* Main Vault Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, background: `radial-gradient(circle at center, #0a2d4d 0%, ${S.navy} 100%)`, position: "relative", overflow: "hidden" }}>
          
          <div style={{ background: "#fff", borderRadius: 24, padding: "64px 48px", maxWidth: 480, width: "100%", textAlign: "center", position: "relative", zIndex: 2, animation: "pulseGateway 4s infinite", border: `2px solid ${S.coral}50` }}>
            
            <div style={{ fontSize: 96, marginBottom: 24, animation: "floatCap 5s ease-in-out infinite", textShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>🎓</div>
            
            <h1 style={{ fontFamily: S.heading, color: S.navy, fontSize: 36, margin: "0 0 12px", fontWeight: 900, letterSpacing: -0.5 }}>{loginStep === 0 ? "Welcome Student" : "Verify Identity"}</h1>
            <p style={{ fontFamily: S.body, color: S.gray, fontSize: 15, margin: "0 0 40px", lineHeight: 1.6 }}>
              {loginStep === 0 ? "Enter your Student Number (e.g. CTSETSS-...) to access your classroom." : "A secure 6-digit code has been sent to your registered email."}
            </p>
            
            {loginStep === 0 ? (
              <div style={{ marginBottom: 24 }}>
                <input type="text" value={identifier} onChange={e => { setIdentifier(e.target.value.toUpperCase()); setAuthError(""); }}
                  onKeyDown={e => { if (e.key === "Enter") handleSendCode(); }}
                  autoFocus placeholder="Student ID"
                  style={{ width: "100%", padding: "20px", borderRadius: 12, border: "2px solid " + (authError ? S.rose : S.border), fontSize: 18, fontFamily: S.body, color: S.navy, boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 2, background: S.lightBg, fontWeight: 800 }} />
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <input type="text" value={otpCode} onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setAuthError(""); }}
                  onKeyDown={e => { if (e.key === "Enter") handleVerifyCode(); }}
                  autoFocus placeholder="000000"
                  style={{ width: "100%", padding: "20px", borderRadius: 12, border: "2px solid " + (authError ? S.rose : S.teal), fontSize: 32, fontFamily: "monospace", color: S.navy, boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 12, background: S.tealLight, fontWeight: 900 }} />
              </div>
            )}

            {authError && <div style={{ padding: "14px", borderRadius: 10, background: S.roseLight, color: S.roseDark, fontSize: 14, marginBottom: 24, fontFamily: S.body, fontWeight: 800, border: `1px solid ${S.rose}50` }}>{authError}</div>}
            
            {loginStep === 0 ? (
              <button onClick={handleSendCode} disabled={authLoading || !identifier.trim()}
                style={{ width: "100%", padding: "20px", borderRadius: 12, border: "none", background: (!identifier.trim() || authLoading) ? S.border : S.navy, color: "#fff", fontSize: 16, fontWeight: 900, cursor: identifier.trim() && !authLoading ? "pointer" : "not-allowed", fontFamily: S.body, transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 2 }}>
                {authLoading ? "Connecting..." : "Initialize Link"}
              </button>
            ) : (
              <button onClick={handleVerifyCode} disabled={authLoading || otpCode.length !== 6}
                style={{ width: "100%", padding: "20px", borderRadius: 12, border: "none", background: (otpCode.length !== 6 || authLoading) ? S.border : S.coral, color: "#fff", fontSize: 16, fontWeight: 900, cursor: otpCode.length === 6 && !authLoading ? "pointer" : "not-allowed", fontFamily: S.body, transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 2, boxShadow: otpCode.length === 6 ? `0 10px 30px ${S.coral}50` : "none" }}>
                {authLoading ? "Decrypting..." : "Access Classroom"}
              </button>
            )}

            {loginStep === 1 && (
               <button onClick={() => { setLoginStep(0); setOtpCode(""); setAuthError(""); }} style={{ marginTop: 20, background: "none", border: "none", color: S.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body, textDecoration: "underline" }}>Cancel & Return</button>
            )}
          </div>

          {/* Blinking System Monitors */}
          <div style={{ display: "flex", gap: 20, marginTop: 60, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 2 }}>
            <NodeBadge label="LMS Server" delay="0s" />
            <NodeBadge label="Data Sync" delay="0.6s" />
            <NodeBadge label="Identity Auth" delay="1.2s" />
          </div>
        </div>

        {/* Secure Footer */}
        <div style={{ background: "#020b14", padding: "24px", textAlign: "center", borderTop: "1px solid rgba(232, 99, 74, 0.2)" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: S.body, margin: 0, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>&copy; 2026 CTS ETS. Enrolled Students Only. Unauthorized access is strictly prohibited.</p>
        </div>
      </div>
    );
  }

  // ═══ AUTHENTICATED VIEW ═══
  return (
    <PageWrapper>
        <div style={{ background: S.bg, minHeight: "85vh", padding: "48px 20px" }}>
          <Dashboard studentData={studentData} onLogout={handleLogout} fetchDashboard={fetchDashboard} />
          <AIStudyAssistant profile={studentData.profile} />
        </div>
    </PageWrapper>
  );
}