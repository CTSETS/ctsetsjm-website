import React, { useState } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, WHATSAPP_NUMBER, NAV_LOGO } from "../constants/config";

const StudentPortalPage = () => {
  const [step, setStep] = useState(1); 
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [dashboardData, setDashboardData] = useState(null);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Action name matches the backend Student Number Only logic [cite: 193]
      const resp = await fetch(`${APPS_SCRIPT_URL}?action=sendotp&identifier=${encodeURIComponent(studentId.trim().toUpperCase())}&purpose=portal`);
      const data = await resp.json();
      if (data.success) {
        setMaskedEmail(data.maskedEmail);
        setStep(2);
      } else {
        setError(data.message || "Student Number not recognized.");
      }
    } catch (err) {
      setError("System connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const verifyResp = await fetch(`${APPS_SCRIPT_URL}?action=verifyotp&identifier=${encodeURIComponent(studentId.toUpperCase())}&code=${otp.trim()}&purpose=portal`);
      const verifyData = await verifyResp.json();
      if (verifyData.success) {
        // Fetches dashboard using the specialized Student Number endpoint [cite: 193, 761]
        const dashResp = await fetch(`${APPS_SCRIPT_URL}?action=getstudentdashboard_otp&ref=${encodeURIComponent(studentId.toUpperCase())}`);
        const dashData = await dashResp.json();
        if (dashData.ok) {
          setDashboardData(dashData);
          setStep(3);
        } else {
          setError(dashData.error || "Profile load failed.");
        }
      } else {
        setError(verifyData.message || "Invalid code.");
      }
    } catch (err) {
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) return <ClassroomDashboard data={dashboardData} />;

  return (
    <div style={{ minHeight: "100vh", background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "440px", width: "100%", background: S.white, borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", overflow: "hidden", border: `1px solid ${S.border}` }}>
        
        {/* BRANDED HEADER SECTION [cite: 136, 154, 530] */}
        <div style={{ background: S.navy, padding: "40px 20px", textAlign: "center" }}>
          <img 
            src={NAV_LOGO} 
            alt="CTS ETS Logo" 
            style={{ height: "60px", marginBottom: "16px", borderRadius: "8px" }} 
          />
          <h2 style={{ color: S.gold, fontFamily: S.heading, margin: 0, fontSize: "26px", fontWeight: "700" }}>
            Student Classroom
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2.5px", marginTop: "8px", fontWeight: "600" }}>
            Called To Serve — Excellence Through Service
          </p>
        </div>

        <div style={{ padding: "40px 35px" }}>
          {error && (
            <div style={{ background: S.roseLight, color: S.rose, padding: "14px", borderRadius: "12px", fontSize: "13px", marginBottom: "25px", border: `1px solid ${S.rose}22`, textAlign: "center", fontWeight: "600" }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP}>
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: S.navy, textTransform: "uppercase", marginBottom: "10px", letterSpacing: "0.5px" }}>
                  Your Student Number
                </label>
                <input 
                  type="text" 
                  placeholder="CTSETSS-XXXXX" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", border: `2px solid #E2E8F0`, fontSize: "16px", outline: "none", transition: "0.2s" }}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: "100%", background: S.sky, color: S.white, padding: "18px", borderRadius: "14px", border: "none", fontWeight: "800", fontSize: "16px", cursor: "pointer", boxShadow: `0 4px 14px ${S.sky}44` }}
              >
                {loading ? "Verifying Record..." : "Enter Classroom"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin}>
              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <p style={{ fontSize: "14px", color: S.gray, marginBottom: "5px" }}>Verification code sent to:</p>
                <p style={{ fontWeight: "700", color: S.navy, fontSize: "16px" }}>{maskedEmail}</p>
              </div>
              <input 
                type="text" 
                placeholder="••••••" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{ width: "100%", padding: "16px", borderRadius: "14px", border: `2px solid ${S.teal}`, fontSize: "28px", textAlign: "center", letterSpacing: "12px", fontWeight: "900", color: S.teal, marginBottom: "25px" }}
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: "100%", background: S.teal, color: S.white, padding: "18px", borderRadius: "14px", border: "none", fontWeight: "800", fontSize: "16px", cursor: "pointer" }}
              >
                {loading ? "Unlocking Portal..." : "Verify & Start Learning"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{ width: "100%", background: "none", color: S.grayLight, border: "none", marginTop: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
              >
                Change Student Number
              </button>
            </form>
          )}

          {/* SUPPORT FOOTER */}
          <div style={{ marginTop: "35px", borderTop: `1px solid ${S.border}`, paddingTop: "25px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: S.gray, marginBottom: "8px" }}>Need help accessing your portal?</p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noreferrer" 
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: S.emerald, fontSize: "14px", fontWeight: "700", textDecoration: "none" }}
            >
              <span>WhatsApp Support</span>
              <span style={{ fontSize: "18px" }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassroomDashboard = ({ data }) => {
  const [progress, setProgress] = useState(data.progress || 1);
  const [activeModule, setActiveModule] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizStatus, setQuizStatus] = useState({ loading: false, result: null });

  const modules = data.curriculum || [];

  const handleStartQuiz = (mod) => {
    setActiveModule(mod);
    setAnswers({});
    setQuizStatus({ loading: false, result: null });
    setQuizMode(true);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizStatus({ loading: true, result: null });

    // Parse the quiz JSON safely
    let quizData = [];
    try { quizData = JSON.parse(activeModule.quiz); } catch (err) { quizData = []; }

    if (quizData.length === 0) {
      setQuizStatus({ loading: false, result: { passed: true, message: "No questions configured. Auto-passed!" } });
      return;
    }

    // Calculate Score locally first
    let correct = 0;
    quizData.forEach((q, idx) => {
      if (answers[idx] === q.a) correct++;
    });
    const scorePct = Math.round((correct / quizData.length) * 100);

    // Send score to backend via Proxy
    try {
      const resp = await fetch(`${APPS_SCRIPT_URL}?action=submitquiz&ref=${encodeURIComponent(data.profile.studentNumber)}&course=${encodeURIComponent(data.profile.programme)}&module=${activeModule.moduleNum}&score=${scorePct}`);
      const resultData = await resp.json();

      setQuizStatus({ loading: false, result: { passed: resultData.passed, message: resultData.message, score: scorePct } });
      
      if (resultData.passed && activeModule.moduleNum >= progress) {
        setProgress(activeModule.moduleNum + 1); // Unlock next module locally
      }
    } catch (err) {
      setQuizStatus({ loading: false, result: { passed: false, message: "Connection error. Please try again." } });
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: S.body }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${S.border}`, paddingBottom: "20px", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontFamily: S.heading, color: S.navy, fontSize: "28px", margin: 0 }}>Welcome Back, {data.profile.firstName}</h1>
          <p style={{ color: S.gray, margin: "5px 0 0" }}>{data.profile.programme} ({data.profile.level})</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: S.gray, marginBottom: "4px" }}>Course Progress</div>
          <div style={{ background: S.emeraldLight, color: S.emeraldDark, padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "800" }}>
            Module {progress} of {modules.length}
          </div>
        </div>
      </div>

      {quizMode && activeModule ? (
        // QUIZ ENGINE UI
        <div style={{ background: S.white, padding: "30px", borderRadius: "16px", border: `1px solid ${S.border}`, boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
          <button onClick={() => setQuizMode(false)} style={{ background: "none", border: "none", color: S.gray, cursor: "pointer", fontSize: "14px", marginBottom: "20px" }}>← Back to Modules</button>
          <h2 style={{ color: S.navy, margin: "0 0 5px 0" }}>Module {activeModule.moduleNum} Assessment</h2>
          <p style={{ color: S.gray, marginBottom: "25px" }}>{activeModule.title}</p>

          {quizStatus.result ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: quizStatus.result.passed ? S.emeraldLight : S.roseLight, borderRadius: "12px" }}>
              <h1 style={{ color: quizStatus.result.passed ? S.emeraldDark : S.roseDark, fontSize: "48px", margin: "0 0 10px" }}>
                {quizStatus.result.score}%
              </h1>
              <p style={{ fontSize: "18px", color: S.navy, fontWeight: "bold" }}>{quizStatus.result.message}</p>
              <button onClick={() => setQuizMode(false)} style={{ marginTop: "20px", background: quizStatus.result.passed ? S.emerald : S.navy, color: S.white, padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
                {quizStatus.result.passed ? "Continue Course" : "Review Material & Try Again"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuizSubmit}>
              {JSON.parse(activeModule.quiz || "[]").map((q, qIdx) => (
                <div key={qIdx} style={{ marginBottom: "25px", padding: "20px", background: S.lightBg, borderRadius: "12px" }}>
                  <p style={{ fontWeight: "bold", color: S.navy, margin: "0 0 15px 0" }}>{qIdx + 1}. {q.q}</p>
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} style={{ display: "block", padding: "10px", background: answers[qIdx] === oIdx ? S.skyLight : S.white, border: `1px solid ${answers[qIdx] === oIdx ? S.sky : S.border}`, borderRadius: "8px", marginBottom: "8px", cursor: "pointer", transition: "0.2s" }}>
                      <input type="radio" name={`q-${qIdx}`} value={oIdx} onChange={() => setAnswers({ ...answers, [qIdx]: oIdx })} required style={{ marginRight: "10px" }} />
                      {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button type="submit" disabled={quizStatus.loading} style={{ width: "100%", background: S.gold, color: S.navy, padding: "16px", borderRadius: "12px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
                {quizStatus.loading ? "Grading..." : "Submit Answers"}
              </button>
            </form>
          )}
        </div>
      ) : (
        // CURRICULUM MAP UI
        <div style={{ display: "grid", gap: "15px" }}>
          {modules.map((mod) => {
            const isUnlocked = mod.moduleNum <= progress;
            const isCompleted = mod.moduleNum < progress;
            return (
              <div key={mod.moduleNum} style={{ background: S.white, padding: "20px", borderRadius: "12px", border: `1px solid ${isUnlocked ? S.teal : S.border}`, opacity: isUnlocked ? 1 : 0.6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: isCompleted ? S.emerald : S.gray, textTransform: "uppercase", letterSpacing: "1px" }}>
                    {isCompleted ? "✅ Completed" : `Module ${mod.moduleNum}`}
                  </div>
                  <h3 style={{ color: S.navy, margin: "5px 0 0 0" }}>{mod.title}</h3>
                </div>
                <div>
                  {isUnlocked ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {mod.link && (
                        <a href={mod.link} target="_blank" rel="noreferrer" style={{ background: S.lightBg, color: S.navy, padding: "10px 16px", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", border: `1px solid ${S.border}` }}>
                          Study Material
                        </a>
                      )}
                      {!isCompleted && (
                        <button onClick={() => handleStartQuiz(mod)} style={{ background: S.teal, color: S.white, padding: "10px 16px", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>
                          Take Quiz
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: S.gray, fontSize: "20px" }}>🔒</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default StudentPortalPage;