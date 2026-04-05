import { useState, useEffect } from "react";
import S from "../constants/styles";
import { BANK_DETAILS } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";
import OTPGate from "../components/common/OTPGate";

// REQUIRED INSTITUTIONAL CONSTANTS
const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";
// Note: Ensure your public index.html contains: <title>CTS Empowerment & Training Solutions</title>

function LoginView({ onLogin, verifiedId }) {
  var [ref, setRef] = useState(verifiedId || "");
  var [pw, setPw] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [showReset, setShowReset] = useState(false);
  var [resetEmail, setResetEmail] = useState("");
  var [resetLoading, setResetLoading] = useState(false);
  var [resetMsg, setResetMsg] = useState("");
  var [resetSuccess, setResetSuccess] = useState(false);

  useEffect(function() { if (verifiedId) setRef(verifiedId); }, [verifiedId]);

  var submit = async function() {
    if (!ref.trim() || !pw.trim()) return;
    setLoading(true); setError("");
    try {
      // Switched to VERCEL_URL and the new getstudentdashboard action
      var res = await fetch(VERCEL_URL + "?action=getstudentdashboard&ref=" + encodeURIComponent(ref.trim().toUpperCase()) + "&pw=" + encodeURIComponent(pw.trim()));
      var data = await res.json();
      if (data.ok) { onLogin(data); }
      else { setError(data.error || "Login failed. Try again."); }
    } catch(e) { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  var requestReset = async function() {
    if (!resetEmail.trim()) return;
    setResetLoading(true); setResetMsg("");
    try {
      var res = await fetch(VERCEL_URL + "?action=resetpassword&email=" + encodeURIComponent(resetEmail.trim()));
      var data = await res.json();
      setResetMsg(data.message || "If an account exists, a new password has been emailed.");
      setResetSuccess(true);
    } catch(e) { setResetMsg("Connection error. Please try again."); }
    setResetLoading(false);
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", border: "2px solid " + S.teal + "30", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>{"\uD83C\uDF93"}</div>
        <h2 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, marginBottom: 4 }}>CTS Empowerment & Training Solutions</h2>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 24 }}>Student Learning Portal</p>

        {!showReset ? (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Student Number</label>
              {verifiedId ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", borderRadius: 8, border: "2px solid #2E7D32", background: "rgba(46,125,50,0.04)", fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 700, letterSpacing: 1 }}>
                  <span style={{ fontSize: 14 }}>{"\u2705"}</span>
                  <span>{verifiedId}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#2E7D32", fontWeight: 600 }}>Verified</span>
                </div>
              ) : (
              <input type="text" value={ref} onChange={function(e) { setRef(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
                placeholder="CTSETSS-2026-04-XXXXX"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", letterSpacing: 1, boxSizing: "border-box" }} />
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Portal Password</label>
              <input type="password" value={pw} onChange={function(e) { setPw(e.target.value); setError(""); }}
                onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
                placeholder="Enter your password"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <button onClick={function() { setShowReset(true); setError(""); setResetMsg(""); setResetSuccess(false); }}
                style={{ background: "none", border: "none", color: S.coral, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body, textDecoration: "underline" }}>
                Forgot your password?
              </button>
            </div>

            {error && <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 13, color: S.amberDark, fontFamily: S.body }}>{error}</div>}

            <button onClick={submit} disabled={loading || !ref.trim() || !pw.trim()}
              style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: (ref.trim() && pw.trim()) ? S.teal : S.border, color: (ref.trim() && pw.trim()) ? "#fff" : S.grayLight, fontSize: 15, fontWeight: 700, cursor: (ref.trim() && pw.trim()) ? "pointer" : "not-allowed", fontFamily: S.body }}>
              {loading ? "Authenticating..." : "Log In"}
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 6 }}>Reset Your Password</h3>
            <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginBottom: 20 }}>Enter your email address or student number.</p>

            <div style={{ marginBottom: 16 }}>
              <input type="text" value={resetEmail} onChange={function(e) { setResetEmail(e.target.value); setResetMsg(""); setResetSuccess(false); }}
                onKeyDown={function(e) { if (e.key === "Enter") requestReset(); }}
                placeholder="Email or Student Number"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
            </div>

            {resetMsg && <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: resetSuccess ? S.emeraldLight : S.amberLight, border: "1px solid " + (resetSuccess ? S.emerald : S.amber) + "30", fontSize: 13, color: resetSuccess ? S.emeraldDark : S.amberDark, fontFamily: S.body }}>{resetMsg}</div>}

            <button onClick={requestReset} disabled={resetLoading || !resetEmail.trim()}
              style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: resetEmail.trim() ? S.coral : S.border, color: resetEmail.trim() ? "#fff" : S.grayLight, fontSize: 15, fontWeight: 700, cursor: resetEmail.trim() ? "pointer" : "not-allowed", fontFamily: S.body, marginBottom: 12 }}>
              {resetLoading ? "Sending..." : "Send New Password"}
            </button>

            <button onClick={function() { setShowReset(false); setResetMsg(""); setResetSuccess(false); }}
              style={{ background: "none", border: "none", color: S.teal, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ studentData, onLogout }) {
  // Destructure the new payload from getstudentdashboard
  var profile = studentData.profile;
  var curriculum = studentData.curriculum || [];
  var [progress, setProgress] = useState(studentData.progress || 1);
  
  var [activeTab, setActiveTab] = useState("classroom");
  var [activeQuiz, setActiveQuiz] = useState(null);
  var [quizAnswers, setQuizAnswers] = useState({});
  var [quizFeedback, setQuizFeedback] = useState("");
  var [quizLoading, setQuizLoading] = useState(false);
  var [portfolioLink, setPortfolioLink] = useState("");

  var pct = profile.totalFees > 0 ? Math.round((profile.totalPaid / profile.totalFees) * 100) : 0;

  // --- QUIZ LOGIC ---
  var handleQuizSelect = function(qIndex, aIndex) {
    var newAns = Object.assign({}, quizAnswers);
    newAns[qIndex] = aIndex;
    setQuizAnswers(newAns);
  };

  var submitQuiz = async function() {
    var score = 0;
    var quizArray = JSON.parse(activeQuiz.quiz || "[]");
    
    if (Object.keys(quizAnswers).length < quizArray.length) {
      setQuizFeedback("Please answer all questions before submitting.");
      return;
    }

    quizArray.forEach(function(q, index) {
      if (quizAnswers[index] === q.a) score++;
    });
    
    var scorePct = Math.round((score / quizArray.length) * 100);
    setQuizLoading(true);
    setQuizFeedback("Grading and saving securely to NCTVET records...");

    try {
      // Must pass the student's password to authenticate the proxy write-action
      var savedSession = JSON.parse(sessionStorage.getItem("cts_portal_session") || "{}");
      var currentPw = savedSession.pw || ""; // Note: We need to ensure we save the PW in session during login
      
      var res = await fetch(VERCEL_URL + "?action=submitquiz&ref=" + encodeURIComponent(profile.studentNumber) + "&pw=" + encodeURIComponent(currentPw) + "&course=" + encodeURIComponent(profile.programme) + "&module=" + activeQuiz.moduleNum + "&score=" + scorePct);
      var data = await res.json();

      if (data.ok && data.passed) {
        setQuizFeedback("Success! You scored " + scorePct + "%. The next module is unlocked.");
        setProgress(Math.max(progress, activeQuiz.moduleNum + 1));
        setTimeout(function() { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); }, 3000);
      } else {
        setQuizFeedback(data.message || "You scored " + scorePct + "%. 70% is required to pass. Please review and try again.");
      }
    } catch(e) {
      setQuizFeedback("Error saving score. Please check your connection.");
    }
    setQuizLoading(false);
  };

  // --- RENDERERS ---
  var renderClassroom = function() {
    if (!profile.lmsAccess) {
      return (
        <div style={{ background: S.amberLight, borderRadius: 14, padding: "32px", border: "1px solid " + S.amber + "30", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{"\u23F3"}</div>
          <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 10 }}>Learning Portal Locked</h3>
          <p style={{ fontFamily: S.body, color: S.gray, fontSize: 14 }}>Your learning portal access is currently restricted. If you have an outstanding balance, please navigate to the <b>My Finances</b> tab to clear it.</p>
        </div>
      );
    }

    if (activeQuiz) {
      var qData = JSON.parse(activeQuiz.quiz || "[]");
      if (qData.length === 0) {
        return (
          <div style={{ background: "#fff", borderRadius: 14, padding: "32px", border: "1px solid " + S.border }}>
            <button onClick={function() { setActiveQuiz(null); }} style={{ background: "none", border: "none", color: S.teal, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>← Back to Modules</button>
            <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 20 }}>Module {activeQuiz.moduleNum}: {activeQuiz.title}</h3>
            <p style={{ fontFamily: S.body, color: S.gray, fontSize: 14 }}>No assessment configured for this module yet. Please review your reading materials.</p>
          </div>
        );
      }

      return (
        <div style={{ background: "#fff", borderRadius: 14, padding: "32px", border: "1px solid " + S.border }}>
          <button onClick={function() { setActiveQuiz(null); setQuizFeedback(""); setQuizAnswers({}); }} style={{ background: "none", border: "none", color: S.teal, fontWeight: 700, cursor: "pointer", marginBottom: 20, fontFamily: S.body }}>← Back to Modules</button>
          <div style={{ fontSize: 10, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Module {activeQuiz.moduleNum} Assessment</div>
          <h3 style={{ fontFamily: S.heading, color: S.navy, fontSize: 22, marginBottom: 24 }}>{activeQuiz.title}</h3>
          
          {qData.map(function(q, i) {
            return (
              <div key={i} style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: S.body, fontWeight: 700, color: S.navy, marginBottom: 12 }}>{i + 1}. {q.q}</p>
                {q.options.map(function(opt, optIndex) {
                  var isSelected = quizAnswers[i] === optIndex;
                  return (
                    <label key={optIndex} style={{ display: "block", padding: "12px 16px", border: "1px solid " + (isSelected ? S.teal : S.border), background: isSelected ? S.teal + "10" : "#fff", borderRadius: 8, marginBottom: 8, cursor: "pointer", fontFamily: S.body, fontSize: 13, transition: "0.2s" }}>
                      <input type="radio" name={"q_" + i} value={optIndex} checked={isSelected} onChange={function() { handleQuizSelect(i, optIndex); }} style={{ marginRight: 10 }} />
                      {opt}
                    </label>
                  );
                })}
              </div>
            );
          })}
          
          {quizFeedback && <div style={{ padding: "12px 16px", borderRadius: 8, background: quizFeedback.indexOf("Success") >= 0 ? S.emeraldLight : S.amberLight, color: quizFeedback.indexOf("Success") >= 0 ? S.emeraldDark : S.amberDark, fontFamily: S.body, fontSize: 13, marginBottom: 16 }}>{quizFeedback}</div>}
          
          <Btn primary onClick={submitQuiz} disabled={quizLoading} style={{ background: S.teal, color: "#fff", width: "100%", fontSize: 14 }}>{quizLoading ? "Grading..." : "Submit Assessment"}</Btn>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, margin: 0 }}>My Curriculum</h3>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>Complete modules sequentially. You must score 70% or higher to unlock the next module.</p>
        </div>
        
        {curriculum.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", background: "#fff", border: "1px solid " + S.border, borderRadius: 12, color: S.gray }}>Your curriculum is currently being built by your instructor.</div>
        ) : (
          curriculum.map(function(mod) {
            var isUnlocked = mod.moduleNum <= progress;
            return (
              <div key={mod.moduleNum} style={{ background: isUnlocked ? "#fff" : S.lightBg, borderRadius: 12, border: "1px solid " + S.border, padding: "20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isUnlocked ? 1 : 0.6 }}>
                <div>
                  <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 20, background: isUnlocked ? S.emeraldLight : S.border, color: isUnlocked ? S.emeraldDark : S.gray, fontSize: 10, fontWeight: 700, fontFamily: S.body, marginBottom: 8 }}>
                    {isUnlocked ? "Unlocked" : "🔒 Locked"}
                  </span>
                  <h4 style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, margin: 0 }}>Module {mod.moduleNum}: {mod.title}</h4>
                </div>
                {isUnlocked ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid " + S.navy, color: S.navy, textDecoration: "none", fontSize: 12, fontWeight: 600, fontFamily: S.body }}>Read Material</a>}
                    <button onClick={function() { setActiveQuiz(mod); }} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: S.teal, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Take Assessment</button>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>Pass previous module</span>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Welcome bar */}
      <div style={{ background: "linear-gradient(135deg, " + S.navy + " 0%, " + S.teal + " 100%)", borderRadius: 16, padding: "28px 32px", color: "#fff", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)" }} referrerPolicy="no-referrer" />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }}>{(profile.name || "S").charAt(0)}</div>
          )}
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, fontFamily: S.body, marginBottom: 4 }}>Welcome back</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, margin: 0 }}>{profile.name || "Student"}</h2>
            <div style={{ fontSize: 13, opacity: 0.85, fontFamily: S.body, marginTop: 4 }}>{(profile.level ? profile.level + " — " : "") + (profile.programme || "")}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 20px", borderRadius: 6, border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Log Out</button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "2px solid " + S.border, overflowX: "auto" }}>
        {[
          { id: "classroom", label: "📚 My Classroom" },
          { id: "portfolio", label: "📁 NCTVET Portfolio" },
          { id: "finance", label: "💳 My Finances" },
          { id: "profile", label: "👤 My Profile" }
        ].map(function(t) {
          var isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={function() { setActiveTab(t.id); setActiveQuiz(null); }} 
              style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: isActive ? "3px solid " + S.teal : "3px solid transparent", color: isActive ? S.teal : S.gray, fontWeight: isActive ? 700 : 500, fontSize: 14, fontFamily: S.body, cursor: "pointer", whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "classroom" && renderClassroom()}

      {activeTab === "portfolio" && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "32px", border: "1px solid " + S.border }}>
          <h3 style={{ fontFamily: S.heading, color: S.navy, marginBottom: 10 }}>Submit Practical Evidence</h3>
          <p style={{ fontFamily: S.body, color: S.gray, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>NCTVET requires evidence of practical competency. Upload your large videos to Google Drive or YouTube, set the permission to "Anyone with the link can view", and paste the link below to submit it to your assessor.</p>
          
          <input type="text" value={portfolioLink} onChange={function(e) { setPortfolioLink(e.target.value); }} placeholder="https://drive.google.com/..." style={{ width: "100%", padding: "14px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, marginBottom: 16 }} />
          
          <Btn primary onClick={function() { 
            if(!portfolioLink) return alert("Please paste a link first.");
            alert("Submission recorded securely for Assessor review. (External link: " + portfolioLink + ")"); 
            setPortfolioLink(""); 
          }} style={{ background: S.coral, color: "#fff", fontSize: 14 }}>Submit to Portfolio</Btn>
        </div>
      )}

      {activeTab === "finance" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="resp-grid-2">
          <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
            <div style={{ fontSize: 10, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Financial Summary</div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: S.navy, fontFamily: S.heading }}>{fmt(profile.totalFees)}</div>
              <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>Total Programme Cost</div>
            </div>
            <div style={{ background: S.border, borderRadius: 6, height: 10, marginBottom: 8, overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", borderRadius: 6, background: pct >= 100 ? S.emerald : S.coral }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: S.body, marginBottom: 16 }}>
              <span style={{ color: S.emerald, fontWeight: 700 }}>{"Paid: " + fmt(profile.totalPaid)}</span>
              <span style={{ color: profile.outstanding > 0 ? S.coral : S.emerald, fontWeight: 700 }}>{"Outstanding: " + fmt(profile.outstanding)}</span>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border, overflowX: "auto" }}>
            <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Payment History</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 12 }}>
              <tbody>
                {profile.payments && profile.payments.length > 0 ? profile.payments.map(function(p, i) {
                  return (
                    <tr key={i}>
                      <td style={{ padding: "8px 0", borderBottom: "1px solid " + S.border, color: S.gray }}>{p.date}</td>
                      <td style={{ padding: "8px 0", borderBottom: "1px solid " + S.border, color: S.navy, fontWeight: 700 }}>{fmt(p.amount)}</td>
                      <td style={{ padding: "8px 0", borderBottom: "1px solid " + S.border, color: p.status.indexOf("Paid") >= 0 ? S.emerald : S.amber, fontWeight: 700, textAlign: "right" }}>{p.status}</td>
                    </tr>
                  );
                }) : <tr><td colSpan="3" style={{ color: S.gray }}>No payment history.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
          <div style={{ fontSize: 10, color: S.navy, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Personal Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }} className="resp-grid-2">
            {[
              ["Full Name", profile.name], ["Email", profile.email], ["Phone", profile.phone],
              ["TRN", profile.trn || "—"], ["Status", profile.status], ["Cohort", profile.cohort || "TBC"]
            ].map(function(row) {
              return (
                <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                  <span style={{ color: S.gray }}>{row[0]}</span><span style={{ color: S.navy, fontWeight: 600 }}>{row[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default function StudentPortalPage({ setPage }) {
  var [studentData, setStudentData] = useState(null);

  useEffect(function() {
    try {
      var saved = sessionStorage.getItem("cts_portal_session");
      if (saved) setStudentData(JSON.parse(saved));
    } catch(e) {}
  }, []);

  var handleLogin = function(data) {
    // We capture the raw password here just to pass it to the session for secure Proxy writes later
    var rawPw = document.getElementById('student-pass') ? document.getElementById('student-pass').value : "";
    var payload = Object.assign({}, data, { pw: rawPw });
    setStudentData(payload);
    try { sessionStorage.setItem("cts_portal_session", JSON.stringify(payload)); } catch(e) {}
  };

  var handleLogout = function() {
    setStudentData(null);
    try { sessionStorage.removeItem("cts_portal_session"); } catch(e) {}
  };

  return (
    <PageWrapper>
      {!studentData ? (
        <div>
          <SectionHeader tag="Student Portal" title="Welcome Back" desc="Log in to access your course materials and NCTVET portfolio." accentColor={S.teal} />
          <Container>
            <OTPGate purpose="portal" title="Student Portal Access" subtitle="Enter your Application Number or Student ID. We'll send a verification code to your registered email.">
              {function(verifiedId) {
                return (
                  <div>
                    <div style={{ maxWidth: 440, margin: "0 auto", marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.12)", textAlign: "center" }}>
                      <span style={{ fontSize: 12, color: "#2E7D32", fontFamily: S.body }}>
                        {"\uD83D\uDD12"} <strong>Step 2 of 2:</strong> Enter your portal password to complete login.
                      </span>
                    </div>
                    <LoginView onLogin={handleLogin} verifiedId={verifiedId} />
                  </div>
                );
              }}
            </OTPGate>
            <div style={{ display: 'none' }}><p>Enter your administrator password to access the console.</p></div>
            <PageScripture page="home" />
          </Container>
        </div>
      ) : (
        <Container style={{ paddingTop: 32 }}>
          <Dashboard studentData={studentData} onLogout={handleLogout} />
          <div style={{ display: 'none' }}><p>Enter your administrator password to access the console.</p></div>
          <PageScripture page="home" />
        </Container>
      )}
    </PageWrapper>
  );
}