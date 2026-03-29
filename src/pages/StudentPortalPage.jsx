import { useState, useEffect } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, LEARNING_PORTAL_URL } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";

function LoginView({ onLogin }) {
  var [ref, setRef] = useState("");
  var [pw, setPw] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");

  var submit = async function() {
    if (!ref.trim() || !pw.trim()) return;
    setLoading(true); setError("");
    try {
      var res = await fetch(APPS_SCRIPT_URL + "?action=studentLogin&ref=" + encodeURIComponent(ref.trim().toUpperCase()) + "&pw=" + encodeURIComponent(pw.trim()));
      var data = await res.json();
      if (data.ok) { onLogin(data); }
      else { setError(data.error || "Login failed. Try again."); }
    } catch(e) { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", border: "2px solid " + S.teal + "30", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>{"\uD83C\uDF93"}</div>
        <h2 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, marginBottom: 4 }}>Student Portal</h2>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 24 }}>Log in with your Application Reference (or Student Number) and portal password.</p>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Application Reference</label>
          <input type="text" value={ref} onChange={function(e) { setRef(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
            placeholder="CTSETS-2026-03-XXXXX or CTSETS-STU-XXXXX"
            style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", letterSpacing: 1, boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Portal Password</label>
          <input type="password" value={pw} onChange={function(e) { setPw(e.target.value); setError(""); }}
            onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
            placeholder="Enter your password"
            style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
        </div>

        {error && <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 13, color: S.amberDark, fontFamily: S.body }}>{error}</div>}

        <button onClick={submit} disabled={loading || !ref.trim() || !pw.trim()}
          style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: (ref.trim() && pw.trim()) ? S.teal : S.border, color: (ref.trim() && pw.trim()) ? "#fff" : S.grayLight, fontSize: 15, fontWeight: 700, cursor: (ref.trim() && pw.trim()) ? "pointer" : "not-allowed", fontFamily: S.body }}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p style={{ fontFamily: S.body, fontSize: 11, color: S.grayLight, marginTop: 14 }}>Your password was emailed to you when your application was accepted. If you haven't received it, contact <a href="mailto:admin@ctsetsjm.com" style={{ color: S.teal }}>admin@ctsetsjm.com</a></p>
      </div>
    </div>
  );
}

function Dashboard({ student, onLogout, setPage, onPasswordChanged }) {
  var pct = student.totalFees > 0 ? Math.round((student.totalPaid / student.totalFees) * 100) : 0;
  var [showPwChange, setShowPwChange] = useState(false);
  var [oldPw, setOldPw] = useState("");
  var [newPw, setNewPw] = useState("");
  var [confirmPw, setConfirmPw] = useState("");
  var [pwMsg, setPwMsg] = useState("");
  var [pwLoading, setPwLoading] = useState(false);
  var [pwSuccess, setPwSuccess] = useState(false);

  var changePw = async function() {
    if (!oldPw || !newPw || !confirmPw) { setPwMsg("All fields are required."); return; }
    if (newPw.length < 6) { setPwMsg("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwMsg("New passwords do not match."); return; }
    setPwLoading(true); setPwMsg("");
    try {
      var ref = student.studentNumber || student.ref;
      var res = await fetch(APPS_SCRIPT_URL + "?action=changePassword&ref=" + encodeURIComponent(ref) + "&oldpw=" + encodeURIComponent(oldPw) + "&newpw=" + encodeURIComponent(newPw));
      var data = await res.json();
      if (data.ok) { setPwSuccess(true); setPwMsg("Password changed successfully!"); setOldPw(""); setNewPw(""); setConfirmPw(""); if (onPasswordChanged) onPasswordChanged(newPw); }
      else { setPwMsg(data.error || "Failed to change password."); }
    } catch(e) { setPwMsg("Connection error. Try again."); }
    setPwLoading(false);
  };

  return (
    <div>
      {/* Welcome bar */}
      <div style={{ background: "linear-gradient(135deg, " + S.teal + " 0%, " + S.emerald + " 100%)", borderRadius: 16, padding: "28px 32px", color: "#fff", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7, fontFamily: S.body, marginBottom: 4 }}>Welcome back</div>
          <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, margin: 0 }}>{student.name || "Student"}</h2>
          <div style={{ fontSize: 13, opacity: 0.85, fontFamily: S.body, marginTop: 4 }}>{(student.level ? student.level + " — " : "") + (student.programme || "")}</div>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 20px", borderRadius: 6, border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Log Out</button>
      </div>

      {/* Status + Programme Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="resp-grid-2">
        {/* Programme card */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
          <div style={{ fontSize: 10, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Programme Details</div>
          {[
            ["Programme", student.programme || "—"],
            ["Level", student.level || "—"],
            ["Cohort", student.cohort || "—"],
            ["Start Date", student.startDate || "To be confirmed"],
            ["End Date", student.endDate || "To be confirmed"],
            ["Status", student.status || "Under Review"],
          ].map(function(row) {
            var color = row[0] === "Status" ? (student.lmsAccess ? S.emerald : S.amber) : S.navy;
            return (
              <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                <span style={{ color: S.gray }}>{row[0]}</span>
                <span style={{ color: color, fontWeight: 700 }}>{row[1]}</span>
              </div>
            );
          })}
        </div>

        {/* Finance card */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
          <div style={{ fontSize: 10, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Financial Summary</div>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: S.navy, fontFamily: S.heading }}>{fmt(student.totalFees)}</div>
            <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>Total Programme Cost</div>
          </div>

          {/* Progress bar */}
          <div style={{ background: S.border, borderRadius: 6, height: 10, marginBottom: 8, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", borderRadius: 6, background: pct >= 100 ? S.emerald : S.coral, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: S.body, marginBottom: 16 }}>
            <span style={{ color: S.emerald, fontWeight: 700 }}>{"Paid: " + fmt(student.totalPaid)}</span>
            <span style={{ color: student.outstanding > 0 ? S.coral : S.emerald, fontWeight: 700 }}>{"Outstanding: " + fmt(student.outstanding)}</span>
          </div>

          {[
            ["Payment Plan", student.paymentPlan || "Gold"],
            ["Payment Status", student.paymentStatus || "Pending"],
          ].map(function(row) {
            var color = row[1].indexOf("Paid") >= 0 || row[1] === "Complete" ? S.emerald : S.amber;
            return (
              <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                <span style={{ color: S.gray }}>{row[0]}</span>
                <span style={{ color: color, fontWeight: 700 }}>{row[1]}</span>
              </div>
            );
          })}

          {student.outstanding > 0 && (
            <Btn primary onClick={function() { setPage("Pay"); }} style={{ width: "100%", marginTop: 16, color: "#fff", background: S.coral, fontSize: 13 }}>Make a Payment</Btn>
          )}
        </div>
      </div>

      {/* Payment History */}
      {student.payments && student.payments.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Payment History</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 12 }}>
              <thead>
                <tr style={{ background: S.lightBg }}>
                  {["Date", "Type", "Amount", "Method", "Status"].map(function(h) {
                    return <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: S.navy, fontSize: 11, borderBottom: "1px solid " + S.border }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {student.payments.map(function(p, i) {
                  var statusColor = p.status === "Paid" || p.status === "Verified" ? S.emerald : S.amber;
                  return (
                    <tr key={i}>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid " + S.border, color: S.gray }}>{p.date || "—"}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid " + S.border, color: S.navy, fontWeight: 600 }}>{p.type || "—"}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid " + S.border, color: S.navy, fontWeight: 700 }}>{fmt(p.amount)}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid " + S.border, color: S.gray }}>{p.method || "—"}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid " + S.border, color: statusColor, fontWeight: 700 }}>{p.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LMS Access — only for accepted */}
      {student.lmsAccess && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "28px", border: "2px solid " + S.teal + "30", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>Your Learning Portal</div>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, maxWidth: 440, margin: "0 auto 20px" }}>Access your course materials, assignments, quizzes, and audio study sessions.</p>
          <a href={LEARNING_PORTAL_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", padding: "16px 48px", borderRadius: 10, background: S.teal, color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: S.heading, textDecoration: "none", boxShadow: "0 4px 16px " + S.teal + "40" }}>
            Enter Learning Portal
          </a>
          <p style={{ fontFamily: S.body, fontSize: 11, color: S.grayLight, marginTop: 12, fontStyle: "italic" }}>Log in with the credentials sent to your email when you were accepted.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 20 }} className="resp-grid-2">
            {[
              { icon: "\uD83D\uDCDA", title: "Course Materials", color: S.teal },
              { icon: "\uD83E\uDD16", title: "AI Study Assistant", color: S.violet },
              { icon: "\uD83C\uDFA7", title: "Audio Sessions", color: S.coral },
              { icon: "\uD83D\uDCDD", title: "Quizzes & Tasks", color: S.emerald },
            ].map(function(t, i) {
              return (
                <div key={i} style={{ padding: "14px 10px", borderRadius: 10, background: t.color + "08", border: "1px solid " + t.color + "20", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: t.color, fontFamily: S.body }}>{t.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Not accepted yet — show message instead of LMS */}
      {!student.lmsAccess && (
        <div style={{ background: S.amberLight, borderRadius: 14, padding: "24px", border: "1px solid " + S.amber + "30", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{"\u23F3"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, fontFamily: S.heading, marginBottom: 6 }}>Learning Portal — Coming Soon</div>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6 }}>Your Learning Portal access will be activated once your application is accepted and payment is confirmed. We will email you your login credentials.</p>
        </div>
      )}

      {/* Password Change */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid " + S.border, marginBottom: 24 }}>
        <button onClick={function() { setShowPwChange(!showPwChange); setPwMsg(""); setPwSuccess(false); }}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{"\uD83D\uDD12"}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Change Portal Password</span>
          </div>
          <span style={{ fontSize: 14, color: S.gray, transform: showPwChange ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25BC"}</span>
        </button>
        {showPwChange && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Current Password</label>
              <input type="password" value={oldPw} onChange={function(e) { setOldPw(e.target.value); setPwMsg(""); }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "2px solid " + S.border, fontSize: 13, fontFamily: S.body, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>New Password</label>
              <input type="password" value={newPw} onChange={function(e) { setNewPw(e.target.value); setPwMsg(""); }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "2px solid " + S.border, fontSize: 13, fontFamily: S.body, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={function(e) { setConfirmPw(e.target.value); setPwMsg(""); }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "2px solid " + S.border, fontSize: 13, fontFamily: S.body, boxSizing: "border-box" }} />
            </div>
            {pwMsg && <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 6, background: pwSuccess ? S.emeraldLight : S.amberLight, border: "1px solid " + (pwSuccess ? S.emerald : S.amber) + "30", fontSize: 12, color: pwSuccess ? S.emeraldDark : S.amberDark, fontFamily: S.body }}>{pwMsg}</div>}
            <button onClick={changePw} disabled={pwLoading}
              style={{ padding: "10px 24px", borderRadius: 6, border: "none", background: S.navy, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
              {pwLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Btn onClick={function() { setPage("FAQ"); }} style={{ border: "2px solid " + S.teal, color: S.teal, fontSize: 12 }}>FAQ</Btn>
        <a href="https://wa.me/8763819771" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", borderRadius: 8, background: S.emerald, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>WhatsApp Support</a>
        <a href="mailto:admin@ctsetsjm.com" style={{ padding: "10px 20px", borderRadius: 8, border: "2px solid " + S.navy, color: S.navy, fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>Email Support</a>
      </div>
    </div>
  );
}

export default function StudentPortalPage({ setPage }) {
  var [student, setStudent] = useState(null);

  // Check for saved session
  useEffect(function() {
    try {
      var saved = sessionStorage.getItem("cts_portal_session");
      if (saved) setStudent(JSON.parse(saved));
    } catch(e) {}
  }, []);

  var handleLogin = function(data) {
    setStudent(data);
    try { sessionStorage.setItem("cts_portal_session", JSON.stringify(data)); } catch(e) {}
  };

  var handleLogout = function() {
    setStudent(null);
    try { sessionStorage.removeItem("cts_portal_session"); } catch(e) {}
  };

  return (
    <PageWrapper>
      {!student ? (
        <div>
          <SectionHeader tag="Student Portal" title="Welcome Back" desc="Log in to view your programme, payment status, and access the Learning Portal." accentColor={S.teal} />
          <Container>
            <LoginView onLogin={handleLogin} />
            <Reveal>
              <div style={{ textAlign: "center", marginTop: 32, padding: "24px", borderRadius: 14, background: S.lightBg, border: "1px solid " + S.border }}>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 12 }}>Not enrolled yet?</p>
                <Btn primary onClick={function() { setPage("Apply"); }} style={{ color: "#fff", background: S.coral, fontSize: 13 }}>Apply Now</Btn>
              </div>
            </Reveal>
            <PageScripture page="home" />
          </Container>
        </div>
      ) : (
        <div>
          <Container style={{ paddingTop: 32 }}>
            <Dashboard student={student} onLogout={handleLogout} setPage={setPage} onPasswordChanged={function() {}} />
            <PageScripture page="home" />
          </Container>
        </div>
      )}
    </PageWrapper>
  );
}
