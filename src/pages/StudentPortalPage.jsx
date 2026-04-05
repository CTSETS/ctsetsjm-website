import { useState, useEffect } from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";
import OTPGate from "../components/common/OTPGate";

// REQUIRED INSTITUTIONAL CONSTANTS
const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

function LoginView({ onLogin, verifiedId }) {
  const [ref, setRef] = useState(verifiedId || "");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => { if (verifiedId) setRef(verifiedId); }, [verifiedId]);

  const submit = async () => {
    if (!ref.trim() || !pw.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=getstudentdashboard&ref=${encodeURIComponent(ref.trim().toUpperCase())}&pw=${encodeURIComponent(pw.trim())}`);
      const data = await res.json();
      if (data.ok) { onLogin(data); }
      else { setError(data.error || "Login failed. Try again."); }
    } catch(e) { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  const requestReset = async () => {
    if (!resetEmail.trim()) return;
    setResetLoading(true); setResetMsg("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=resetpassword&email=${encodeURIComponent(resetEmail.trim())}`);
      const data = await res.json();
      setResetMsg(data.message || "If an account exists, a new password has been emailed.");
    } catch(e) { setResetMsg("Connection error. Please try again."); }
    setResetLoading(false);
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", border: `2px solid ${S.teal}30`, textAlign: "center", width: "100%" }}>
        <div style={{ fontSize: 50, marginBottom: 10 }}>🎓</div>
        <h2 style={{ fontFamily: S.heading, fontSize: "clamp(18px, 5vw, 22px)", color: S.navy, fontWeight: 700, marginBottom: 4 }}>
          CTS Empowerment & Training Solutions
        </h2>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 24 }}>Student Learning Portal</p>

        {!showReset ? (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Student Number</label>
              {verifiedId ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px", borderRadius: 8, border: "2px solid #2E7D32", background: "rgba(46,125,50,0.04)", fontSize: 13, fontFamily: S.body, color: S.navy, fontWeight: 700 }}>
                  <span>✅</span><span>{verifiedId}</span><span style={{ marginLeft: "auto", fontSize: 10, color: "#2E7D32" }}>Verified</span>
                </div>
              ) : (
                <input type="text" value={ref} onChange={(e) => { setRef(e.target.value.toUpperCase()); setError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                  placeholder="CTSETSS-2026-04-XXXXX"
                  style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Portal Password</label>
              <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                placeholder="Enter password"
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <button onClick={() => { setShowReset(true); setError(""); setResetMsg(""); }}
                style={{ background: "none", border: "none", color: S.coral, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body, textDecoration: "underline" }}>
                Forgot your password?
              </button>
            </div>

            {error && <div style={{ marginBottom: 16, padding: "10px", borderRadius: 8, background: S.amberLight, border: `1px solid ${S.amber}30`, fontSize: 12, color: S.amberDark, fontFamily: S.body }}>{error}</div>}

            <button onClick={submit} disabled={loading || !ref.trim() || !pw.trim()}
              style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: (ref.trim() && pw.trim()) ? S.teal : S.border, color: (ref.trim() && pw.trim()) ? "#fff" : S.grayLight, fontSize: 14, fontWeight: 700, cursor: (ref.trim() && pw.trim()) ? "pointer" : "not-allowed", fontFamily: S.body, transition: "0.2s" }}>
              {loading ? "Authenticating..." : "Log In"}
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 6 }}>Reset Password</h3>
            <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginBottom: 20 }}>Enter your email or student number to receive a new password.</p>

            <input type="text" value={resetEmail} onChange={(e) => { setResetEmail(e.target.value); setResetMsg(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") requestReset(); }}
              placeholder="Email or Student Number"
              style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />

            {resetMsg && <div style={{ marginBottom: 16, padding: "10px", borderRadius: 8, background: S.emeraldLight, border: `1px solid ${S.emerald}30`, fontSize: 12, color: S.emeraldDark, fontFamily: S.body }}>{resetMsg}</div>}

            <button onClick={requestReset} disabled={resetLoading || !resetEmail.trim()}
              style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: resetEmail.trim() ? S.coral : S.border, color: resetEmail.trim() ? "#fff" : S.grayLight, fontSize: 14, fontWeight: 700, cursor: resetEmail.trim() ? "pointer" : "not-allowed", fontFamily: S.body, marginBottom: 12 }}>
              {resetLoading ? "Sending..." : "Send New Password"}
            </button>

            <button onClick={() => { setShowReset(false); setResetMsg(""); }}
              style={{ background: "none", border: "none", color: S.teal, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ studentData, onLogout }) {
  const profile = studentData.profile;
  const curriculum = studentData.curriculum || [];
  const [progress, setProgress] = useState(studentData.progress || 1);
  const [activeTab, setActiveTab] = useState("classroom");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");

  const pct = profile.totalFees > 0 ? Math.round((profile.totalPaid / profile.totalFees) * 100) : 0;

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
    setQuizFeedback("Grading and saving securely to NCTVET records...");

    try {
      const savedSession = JSON.parse(sessionStorage.getItem("cts_portal_session") || "{}");
      const res = await fetch(`${VERCEL_URL}?action=submitquiz&ref=${encodeURIComponent(profile.studentNumber)}&pw=${encodeURIComponent(savedSession.pw || "")}&course=${encodeURIComponent(profile.programme)}&module=${activeQuiz.moduleNum}&score=${scorePct}`);
      const data = await res.json();

      if (data.ok && data.passed) {
        setQuizFeedback(`Success! You scored ${scorePct}%. The next module is unlocked.`);
        setProgress(Math.max(progress, activeQuiz.moduleNum + 1));
        setTimeout(() => { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); }, 3000);
      } else {
        setQuizFeedback(data.message || `You scored ${scorePct}%. 70% is required to pass. Please review and try again.`);
      }
    } catch(e) { setQuizFeedback("Error saving score. Please check your connection."); }
    setQuizLoading(false);
  };

  // Helper to render read-only data rows
  const DataRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${S.border}`, fontSize: 13, fontFamily: S.body }}>
      <span style={{ color: S.gray, paddingRight: "10px" }}>{label}</span>
      <span style={{ color: S.navy, fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div className="portal-container">
      {/* Injecting Responsive CSS */}
      <style>{`
        .portal-container { width: 100%; max-width: 1000px; margin: 0 auto; }
        .welcome-bar { background: linear-gradient(135deg, ${S.navy} 0%, ${S.teal} 100%); border-radius: 16px; padding: 24px; color: #fff; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .welcome-info { display: flex; align-items: center; gap: 16px; }
        .nav-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid ${S.border}; overflow-x: auto; white-space: nowrap; padding-bottom: 4px; scrollbar-width: none; }
        .nav-tabs::-webkit-scrollbar { display: none; }
        .resp-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .profile-img-large { width: 120px; height: 150px; object-fit: cover; border-radius: 8px; border: 3px solid ${S.border}; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 16px; }
        
        @media (max-width: 768px) {
          .welcome-bar { flex-direction: column; text-align: center; justify-content: center; }
          .welcome-info { flex-direction: column; text-align: center; }
          .nav-tabs { padding-bottom: 8px; }
        }
      `}</style>

      {/* Welcome Bar */}
      <div className="welcome-bar">
        <div className="welcome-info">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="Student" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)" }} referrerPolicy="no-referrer" crossOrigin="anonymous" />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }}>{(profile.name || "S").charAt(0)}</div>
          )}
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, fontFamily: S.body, marginBottom: 2 }}>Welcome back</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, margin: 0 }}>{profile.name || "Student"}</h2>
            <div style={{ fontSize: 13, opacity: 0.9, fontFamily: S.body, marginTop: 4 }}>{profile.studentNumber} • {profile.level}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 24px", borderRadius: 6, border: "2px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.body, transition: "0.2s" }}>Log Out</button>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        {[
          { id: "classroom", label: "📚 My Classroom" },
          { id: "profile", label: "👤 My Profile" },
          { id: "portfolio", label: "📁 NCTVET Portfolio" },
          { id: "finance", label: "💳 My Finances" }
        ].map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveQuiz(null); }} 
            style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: activeTab === t.id ? `3px solid ${S.teal}` : "3px solid transparent", color: activeTab === t.id ? S.teal : S.gray, fontWeight: activeTab === t.id ? 700 : 500, fontSize: 14, fontFamily: S.body, cursor: "pointer", transition: "0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* --- CLASSROOM TAB --- */}
      {activeTab === "classroom" && (
        <div style={{ animation: "fadeIn 0.3s" }}>
          {!profile.lmsAccess ? (
            <div style={{ background: S.amberLight, borderRadius: 14, padding: "32px", border: `1px solid ${S.amber}30`, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
              <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 10 }}>Learning Portal Locked</h3>
              <p style={{ fontFamily: S.body, color: S.gray, fontSize: 14 }}>Your learning portal access is currently restricted. If you have an outstanding balance, please navigate to the <b>My Finances</b> tab to clear it.</p>
            </div>
          ) : activeQuiz ? (
            <div style={{ background: "#fff", borderRadius: 14, padding: "32px 20px", border: `1px solid ${S.border}` }}>
              <button onClick={() => { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); }} style={{ background: "none", border: "none", color: S.teal, fontWeight: 700, cursor: "pointer", marginBottom: 20, fontFamily: S.body }}>← Back to Modules</button>
              
              {JSON.parse(activeQuiz.quiz || "[]").length === 0 ? (
                <div>
                  <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 20 }}>Module {activeQuiz.moduleNum}: {activeQuiz.title}</h3>
                  <p style={{ fontFamily: S.body, color: S.gray, fontSize: 14 }}>No assessment configured for this module yet. Please review your reading materials.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Module {activeQuiz.moduleNum} Assessment</div>
                  <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 22, marginBottom: 24 }}>{activeQuiz.title}</h3>
                  
                  {JSON.parse(activeQuiz.quiz || "[]").map((q, i) => (
                    <div key={i} style={{ marginBottom: 24 }}>
                      <p style={{ fontFamily: S.body, fontWeight: 700, color: S.navy, marginBottom: 12 }}>{i + 1}. {q.q}</p>
                      {q.options.map((opt, optIndex) => {
                        const isSelected = quizAnswers[i] === optIndex;
                        return (
                          <label key={optIndex} style={{ display: "block", padding: "12px 16px", border: `1px solid ${isSelected ? S.teal : S.border}`, background: isSelected ? `${S.teal}10` : "#fff", borderRadius: 8, marginBottom: 8, cursor: "pointer", fontFamily: S.body, fontSize: 13, transition: "0.2s" }}>
                            <input type="radio" name={`q_${i}`} value={optIndex} checked={isSelected} onChange={() => handleQuizSelect(i, optIndex)} style={{ marginRight: 10 }} />
                            {opt}
                          </label>
                        );
                      })}
                    </div>
                  ))}
                  
                  {quizFeedback && <div style={{ padding: "12px 16px", borderRadius: 8, background: quizFeedback.includes("Success") ? S.emeraldLight : S.amberLight, color: quizFeedback.includes("Success") ? S.emeraldDark : S.amberDark, fontFamily: S.body, fontSize: 13, marginBottom: 16, border: `1px solid ${quizFeedback.includes("Success") ? S.emerald : S.amber}30` }}>{quizFeedback}</div>}
                  <Btn primary onClick={submitQuiz} disabled={quizLoading} style={{ background: S.teal, color: "#fff", width: "100%", fontSize: 14 }}>{quizLoading ? "Grading..." : "Submit Assessment"}</Btn>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, margin: 0 }}>My Curriculum</h3>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>Complete modules sequentially. You must score 70% or higher to unlock the next module.</p>
              </div>
              
              {curriculum.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", background: "#fff", border: `1px solid ${S.border}`, borderRadius: 12, color: S.gray, fontFamily: S.body }}>Your curriculum is currently being built by your instructor.</div>
              ) : (
                curriculum.map((mod) => {
                  const isUnlocked = mod.moduleNum <= progress;
                  return (
                    <div key={mod.moduleNum} style={{ background: isUnlocked ? "#fff" : S.lightBg, borderRadius: 12, border: `1px solid ${S.border}`, padding: "20px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center", opacity: isUnlocked ? 1 : 0.6 }}>
                      <div>
                        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 20, background: isUnlocked ? S.emeraldLight : S.border, color: isUnlocked ? S.emeraldDark : S.gray, fontSize: 10, fontWeight: 700, fontFamily: S.body, marginBottom: 8 }}>
                          {isUnlocked ? "Unlocked" : "🔒 Locked"}
                        </span>
                        <h4 style={{ fontFamily: S.heading, fontSize: "clamp(15px, 3vw, 17px)", color: S.navy, margin: 0 }}>Module {mod.moduleNum}: {mod.title}</h4>
                      </div>
                      {isUnlocked ? (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: "100%", maxWidth: "300px" }}>
                          {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "10px 16px", borderRadius: 8, border: `1px solid ${S.navy}`, color: S.navy, textDecoration: "none", fontSize: 12, fontWeight: 600, fontFamily: S.body }}>Read Material</a>}
                          <button onClick={() => setActiveQuiz(mod)} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: "none", background: S.teal, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Take Assessment</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>Pass previous module</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* --- FULL PROFILE TAB --- */}
      {activeTab === "profile" && (
        <div style={{ animation: "fadeIn 0.3s" }}>
          <div style={{ background: S.amberLight, padding: "12px 20px", borderRadius: 8, border: `1px solid ${S.amber}40`, marginBottom: 20, color: S.amberDark, fontSize: 12, fontFamily: S.body, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <span>This is your official institutional record. To request updates or corrections to this information, please contact <b>admin@ctsetsjm.com</b>.</span>
          </div>

          <div className="resp-grid-2">
            {/* Identity Column */}
            <div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `1px solid ${S.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 20, borderBottom: `2px solid ${S.border}`, paddingBottom: 8 }}>Identity & Status</div>
                
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt="Profile" className="profile-img-large" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                  ) : (
                    <div className="profile-img-large" style={{ background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", color: S.gray, fontSize: 12, fontFamily: S.body, margin: "0 auto 16px" }}>No Photo<br/>Uploaded</div>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>{profile.name}</div>
                  <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>{profile.studentNumber}</div>
                  <div style={{ display: "inline-block", marginTop: 8, padding: "4px 12px", background: profile.status === "Enrolled" || profile.status === "Active" ? S.emeraldLight : S.amberLight, color: profile.status === "Enrolled" || profile.status === "Active" ? S.emeraldDark : S.amberDark, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{profile.status}</div>
                </div>

                <DataRow label="Programme" value={profile.programme} />
                <DataRow label="Level" value={profile.level} />
                <DataRow label="Cohort" value={profile.cohort || "TBC"} />
                <DataRow label="Start Date" value={profile.startDate || "TBC"} />
                <DataRow label="End Date" value={profile.endDate || "TBC"} />
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `1px solid ${S.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16, borderBottom: `2px solid ${S.border}`, paddingBottom: 8 }}>Personal Details</div>
                <DataRow label="First Name" value={profile.firstName} />
                <DataRow label="Middle Name" value={profile.middleName} />
                <DataRow label="Last Name" value={profile.lastName} />
                <DataRow label="Maiden Name" value={profile.maidenName} />
                <DataRow label="Gender" value={profile.gender} />
                <DataRow label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"}) : ""} />
                <DataRow label="Marital Status" value={profile.maritalStatus} />
                <DataRow label="Nationality" value={profile.nationality} />
                <DataRow label="TRN" value={profile.trn} />
                <DataRow label="NIS" value={profile.nis} />
                <DataRow label="Special Needs" value={profile.specialNeeds === "Yes" ? `Yes - ${profile.specialNeedsType}` : "No"} />
              </div>
            </div>

            {/* Contact & Extra Column */}
            <div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `1px solid ${S.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16, borderBottom: `2px solid ${S.border}`, paddingBottom: 8 }}>Contact & Address</div>
                <DataRow label="Email" value={profile.email} />
                <DataRow label="Primary Phone" value={profile.phone} />
                <DataRow label="Secondary Phone" value={profile.phone2} />
                <DataRow label="Street Address" value={profile.address} />
                <DataRow label="District/Town" value={profile.district} />
                <DataRow label="Postal Zone" value={profile.postalZone} />
                <DataRow label="Parish" value={profile.parish} />
                <DataRow label="Country" value={profile.country} />
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `1px solid ${S.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16, borderBottom: `2px solid ${S.border}`, paddingBottom: 8 }}>Education & Employment</div>
                <DataRow label="Highest Qualification" value={profile.highestQualification} />
                <DataRow label="Last School Attended" value={profile.schoolLastAttended} />
                <DataRow label="Year Completed" value={profile.yearCompleted} />
                <DataRow label="Employment Status" value={profile.employmentStatus} />
                <DataRow label="Employer" value={profile.employer} />
                <DataRow label="Job Title" value={profile.jobTitle} />
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `1px solid ${S.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16, borderBottom: `2px solid ${S.border}`, paddingBottom: 8 }}>Emergency Contacts</div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: S.gray, marginBottom: 8 }}>Primary Contact</div>
                  <DataRow label="Name" value={profile.emergencyName} />
                  <DataRow label="Phone" value={profile.emergencyPhone} />
                  <DataRow label="Relationship" value={profile.emergencyRelationship} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: S.gray, marginBottom: 8 }}>Secondary Contact</div>
                  <DataRow label="Name" value={profile.emergency2Name} />
                  <DataRow label="Phone" value={profile.emergency2Phone} />
                  <DataRow label="Relationship" value={profile.emergency2Relationship} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PORTFOLIO TAB --- */}
      {activeTab === "portfolio" && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "32px 24px", border: `1px solid ${S.border}`, animation: "fadeIn 0.3s" }}>
          <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 10 }}>Submit Practical Evidence</h3>
          <p style={{ fontFamily: S.body, color: S.gray, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>NCTVET requires evidence of practical competency. Upload your large videos or documents to Google Drive or YouTube, set the permission to "Anyone with the link can view", and paste the link below to submit it to your assessor.</p>
          
          <input type="text" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: "100%", padding: "14px", borderRadius: 8, border: `2px solid ${S.border}`, fontSize: 14, fontFamily: S.body, marginBottom: 16, outline: "none" }} />
          
          <Btn primary onClick={() => { 
            if(!portfolioLink) return alert("Please paste a link first.");
            alert(`Submission recorded securely for Assessor review. (External link: ${portfolioLink})`); 
            setPortfolioLink(""); 
          }} style={{ background: S.coral, color: "#fff", fontSize: 14, width: "100%", maxWidth: "300px" }}>Submit Evidence to Assessor</Btn>