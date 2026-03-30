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
  var [showReset, setShowReset] = useState(false);
  var [resetEmail, setResetEmail] = useState("");
  var [resetLoading, setResetLoading] = useState(false);
  var [resetMsg, setResetMsg] = useState("");
  var [resetSuccess, setResetSuccess] = useState(false);

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

  var requestReset = async function() {
    if (!resetEmail.trim()) return;
    setResetLoading(true); setResetMsg("");
    try {
      var res = await fetch(APPS_SCRIPT_URL + "?action=resetpassword&email=" + encodeURIComponent(resetEmail.trim()));
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
        <h2 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, marginBottom: 4 }}>Student Portal</h2>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 24 }}>Log in with your Application Reference (or Student Number) and portal password.</p>

        {!showReset ? (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6, textAlign: "left" }}>Application Reference</label>
              <input type="text" value={ref} onChange={function(e) { setRef(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={function(e) { if (e.key === "Enter") submit(); }}
                placeholder="CTSETS-2026-03-XXXXX or CTSETS-STU-XXXXX"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", letterSpacing: 1, boxSizing: "border-box" }} />
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
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{"\uD83D\uDD11"}</div>
            <h3 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 6 }}>Reset Your Password</h3>
            <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginBottom: 20, lineHeight: 1.6 }}>Enter your email address, student number, or application reference. If we find your account, a new password will be emailed to you.</p>

            <div style={{ marginBottom: 16 }}>
              <input type="text" value={resetEmail} onChange={function(e) { setResetEmail(e.target.value); setResetMsg(""); setResetSuccess(false); }}
                onKeyDown={function(e) { if (e.key === "Enter") requestReset(); }}
                placeholder="Email, Student Number, or App Reference"
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

function Dashboard({ student, onLogout, setPage, onPasswordChanged }) {
  var pct = student.totalFees > 0 ? Math.round((student.totalPaid / student.totalFees) * 100) : 0;
  var [showPwChange, setShowPwChange] = useState(false);
  var [showPayModal, setShowPayModal] = useState(false);
  var [payUrl, setPayUrl] = useState("");
  var [payStep, setPayStep] = useState("choose");
  var [payTxn, setPayTxn] = useState("");
  var [payAmt, setPayAmt] = useState("");
  var [payMethod, setPayMethod] = useState("WiPay Online");
  var [payConfirmMsg, setPayConfirmMsg] = useState("");
  var [payConfirmSuccess, setPayConfirmSuccess] = useState(false);
  var [payConfirmLoading, setPayConfirmLoading] = useState(false);
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {student.photoUrl ? (
            <img src={student.photoUrl} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)" }} referrerPolicy="no-referrer" />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }}>{(student.name || "S").charAt(0)}</div>
          )}
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, fontFamily: S.body, marginBottom: 4 }}>Welcome back</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, margin: 0 }}>{student.name || "Student"}</h2>
            <div style={{ fontSize: 13, opacity: 0.85, fontFamily: S.body, marginTop: 4 }}>{(student.level ? student.level + " — " : "") + (student.programme || "")}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 20px", borderRadius: 6, border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Log Out</button>
      </div>

      {/* Status + Programme Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="resp-grid-2">
        {/* Programme card */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
          <div style={{ fontSize: 10, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Programme Details</div>
          {[
            ["Student Number", student.studentNumber || "—"],
            ["Application Ref", student.ref || "—"],
            ["Programme", student.programme || "—"],
            ["Level", student.level || "—"],
            ["Payment Plan", student.paymentPlan || "—"],
            ["Cohort", student.cohort || "To be assigned"],
            ["Start Date", student.startDate || "To be confirmed"],
            ["End Date", student.endDate || "To be confirmed"],
            ["Status", student.status || "Pending Payment"],
          ].map(function(row) {
            var statusColors = { "Enrolled": S.emerald, "Active": S.emerald, "Graduated": S.gold, "Pending Payment": S.amber, "On Hold": S.coral };
            var color = row[0] === "Status" ? (statusColors[row[1]] || S.navy) : S.navy;
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
            <div>
              <Btn primary onClick={function() {
                var url = "https://jm.wipayfinancial.com/to_me/cts_empowerment_and_training_solutions";
                setShowPayModal(true);
                setPayUrl(url);
              }} style={{ width: "100%", marginTop: 16, color: "#fff", background: S.coral, fontSize: 13 }}>Make a Payment</Btn>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: S.grayLight, fontFamily: S.body }}>
                Reference: <strong>{student.studentNumber || student.ref}</strong> — use this as your payment reference
              </div>
            </div>
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

      {/* Not enrolled yet — show message instead of LMS */}
      {!student.lmsAccess && (
        <div style={{ background: S.amberLight, borderRadius: 14, padding: "24px", border: "1px solid " + S.amber + "30", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{"\u23F3"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, fontFamily: S.heading, marginBottom: 6 }}>
            {student.status === "Pending Payment" ? "Learning Portal — Pay to Unlock" : "Learning Portal — Coming Soon"}
          </div>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6 }}>
            {student.status === "Pending Payment"
              ? "Your application has been accepted! Complete your payment to unlock the Learning Portal. Once your payment is verified, your status will be updated to Enrolled and your study materials will be available."
              : "Your Learning Portal access will be activated once your status is updated to Enrolled. Contact admin@ctsetsjm.com if you have questions."}
          </p>
          {student.status === "Pending Payment" && (
            <Btn primary onClick={function() {
              setShowPayModal(true);
              setPayUrl("https://jm.wipayfinancial.com/to_me/cts_empowerment_and_training_solutions");
            }} style={{ color: "#fff", background: S.coral, fontSize: 14, padding: "14px 32px", marginTop: 12 }}>Make Payment Now</Btn>
          )}
        </div>
      )}

      {/* ═══ PERSONAL PROFILE ═══ */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border, marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: S.navy, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Personal Profile</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }} className="resp-grid-2">
          {[
            ["Full Name", student.name || "—"],
            ["Email", student.email || "—"],
            ["Phone", student.phone || "—"],
            ["Gender", student.gender || "—"],
            ["Date of Birth", student.dob ? new Date(student.dob).toLocaleDateString("en-JM", {year:"numeric",month:"long",day:"numeric"}) : "—"],
            ["Nationality", student.nationality || "—"],
            ["Country", student.country || "—"],
            ["Parish", student.parish || "—"],
            ["Address", student.address || "—"],
            ["TRN", student.trn || "—"],
            ["Highest Qualification", student.highestQualification || "—"],
            ["Employer", student.employer || "—"],
            ["Job Title", student.jobTitle || "—"],
          ].map(function(row) {
            return (
              <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid " + S.border, fontSize: 12, fontFamily: S.body }}>
                <span style={{ color: S.gray }}>{row[0]}</span>
                <span style={{ color: S.navy, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{row[1]}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: S.grayLight, fontFamily: S.body, fontStyle: "italic" }}>To update your personal information, contact admin@ctsetsjm.com</div>
      </div>

      {/* Emergency Contact */}
      {student.emergencyName && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid " + S.border, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 10 }}>Emergency Contact</div>
          {[
            ["Name", student.emergencyName],
            ["Phone", student.emergencyPhone || "—"],
            ["Relationship", student.emergencyRelationship || "—"],
          ].map(function(row) {
            return (
              <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid " + S.border, fontSize: 12, fontFamily: S.body }}>
                <span style={{ color: S.gray }}>{row[0]}</span>
                <span style={{ color: S.navy, fontWeight: 600 }}>{row[1]}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Student ID Card — only if photo on file AND at least one payment made */}
      {student.studentNumber && student.photoUrl && student.totalPaid > 0 && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid " + S.border, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{"\uD83E\uDEAA"}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Student ID Card</span>
            </div>
            <button onClick={function() {
              var card = document.getElementById("cts-id-card");
              if (!card) return;
              var w = window.open("", "_blank");
              if (!w) { alert("Please allow pop-ups."); return; }
              w.document.write('<!DOCTYPE html><html><head><title>Student ID - ' + student.name + '</title>'
                + '<style>*{margin:0;padding:0;box-sizing:border-box}'
                + 'body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#e8e8e8;font-family:Arial,sans-serif}'
                + '.card-wrap{width:323px;margin:20px}'
                + '.instructions{text-align:center;font-size:11px;color:#666;margin-top:16px;line-height:1.6}'
                + '@media print{body{background:#fff}.card-wrap{width:85.6mm}.instructions{display:none}}'
                + '</style></head><body>'
                + '<div class="card-wrap">' + card.innerHTML + '</div>'
                + '<div class="instructions">Print at 100% scale (no fit-to-page) for exact credit card size.<br>Cut along the card edges. Laminate if desired.</div>'
                + '<script>setTimeout(function(){window.print()},400);<\/script></body></html>');
              w.document.close();
            }} style={{ padding: "6px 16px", borderRadius: 6, border: "1.5px solid " + S.navy, background: "transparent", color: S.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
              Print / Save
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <div id="cts-id-card" style={{ width: 323 }}>
            <div style={{ width: 323, height: 204, background: "linear-gradient(135deg, " + S.navy + " 0%, #0A2347 100%)", borderRadius: 10, padding: "10px 12px", color: "#fff", position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
              {/* Gold top bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, " + S.gold + ", " + S.gold + "60)" }} />
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 6, letterSpacing: 2, color: S.gold, fontWeight: 700, textTransform: "uppercase" }}>CTS Empowerment & Training Solutions</div>
                <div style={{ fontSize: 10, fontWeight: 800, marginTop: 1, letterSpacing: 0.5 }}>STUDENT IDENTITY CARD</div>
                <div style={{ fontSize: 5, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Registered Training Institution — COJ Reg. No. 16007/2025</div>
              </div>
              {/* Photo + Info row */}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 52, height: 65, borderRadius: 4, background: "rgba(255,255,255,0.08)", border: "1.5px solid " + S.gold + "50", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 3 }} referrerPolicy="no-referrer" crossOrigin="anonymous" />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, opacity: 0.3 }}>{"\uD83D\uDC64"}</div>
                      <div style={{ fontSize: 4, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>PHOTO</div>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: S.gold, lineHeight: 1.15, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis" }}>{(student.name || "").toUpperCase()}</div>
                  <div style={{ fontSize: 5, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>STUDENT NUMBER</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginBottom: 3 }}>{student.studentNumber}</div>
                  <div style={{ fontSize: 5, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>PROGRAMME</div>
                  <div style={{ fontSize: 6.5, fontWeight: 600, lineHeight: 1.25, overflow: "hidden" }}>{student.programme}</div>
                  <div style={{ fontSize: 6, color: S.gold, marginTop: 1 }}>{student.level}</div>
                </div>
              </div>
              {/* Bottom bar */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 5, borderTop: "0.5px solid rgba(255,255,255,0.1)", fontSize: 5 }}>
                <div><div style={{ color: "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>COHORT</div><div style={{ fontWeight: 700, marginTop: 1, fontSize: 6 }}>{student.cohort || "TBC"}</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>VALID FROM</div><div style={{ fontWeight: 700, marginTop: 1, fontSize: 6 }}>{student.startDate || "TBC"}</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>VALID TO</div><div style={{ fontWeight: 700, marginTop: 1, fontSize: 6 }}>{student.endDate || "TBC"}</div></div>
              </div>
              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: 4, fontSize: 4.5, color: "rgba(255,255,255,0.2)", lineHeight: 1.4 }}>
                6, Newark Avenue, Kingston 2 | 876-525-6802 | 876-381-9771<br/>
                This card remains the property of CTS ETS. If found, please return.
              </div>
            </div>
          </div>
            {/* School Logo beside card */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <img src="/logo.jpg" alt="CTS ETS" style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 8 }} />
              <div style={{ textAlign: "center", fontSize: 8, color: S.gray, fontFamily: S.body, lineHeight: 1.4, maxWidth: 110 }}>CTS Empowerment &amp; Training Solutions</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: S.gray, fontFamily: S.body }}>
            Print at 100% scale for exact credit card size (85.6mm x 54mm). Cut and laminate.
          </div>
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

      {/* Payment Modal — WiPay + Confirm */}
      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 20 }}
          onClick={function(e) { if (e.target === e.currentTarget) setShowPayModal(false); }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", background: S.navy, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div>
                <div style={{ color: S.gold, fontSize: 14, fontWeight: 700 }}>Make a Payment</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>Ref: {student.studentNumber || student.ref} | Outstanding: {fmt(student.outstanding)}</div>
              </div>
              <button onClick={function() { setShowPayModal(false); setPayStep("choose"); setPayTxn(""); setPayAmt(""); setPayConfirmMsg(""); }} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: "0 4px" }}>{"\u2715"}</button>
            </div>
            <div style={{ padding: 20 }}>
              {payStep === "choose" && (
                <div>
                  <div style={{ background: S.amberLight, borderRadius: 8, padding: "12px 16px", marginBottom: 16, border: "1px solid " + S.amber + "30" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.amberDark, fontFamily: S.body, marginBottom: 4 }}>Payment Reference</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: S.navy, fontFamily: "monospace", letterSpacing: 1 }}>{student.studentNumber || student.ref}</div>
                    <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4 }}>Use this reference when making your payment.</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 12 }}>Step 1: Make your payment</div>
                  <a href={payUrl} target="_blank" rel="noopener noreferrer"
                    onClick={function() { setTimeout(function() { setPayStep("confirm"); }, 1000); }}
                    style={{ display: "block", padding: "16px 20px", borderRadius: 10, background: S.emerald, color: "#fff", textAlign: "center", textDecoration: "none", fontWeight: 700, fontSize: 14, fontFamily: S.body, marginBottom: 10 }}>
                    Pay Online with Credit/Debit Card (WiPay)
                  </a>
                  <div style={{ padding: "14px 20px", borderRadius: 10, background: S.lightBg, border: "1px solid " + S.border, fontSize: 12, fontFamily: S.body, color: S.gray, lineHeight: 1.7, marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, color: S.navy, marginBottom: 6 }}>Bank Transfer</div>
                    NCB — JMD Account<br/>
                    After transfer, email your receipt to <strong>admin@ctsetsjm.com</strong> with your reference number.
                  </div>
                  <button onClick={function() { setPayStep("confirm"); }}
                    style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid " + S.teal, background: "transparent", color: S.teal, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
                    I already made a payment — Confirm it
                  </button>
                </div>
              )}
              {payStep === "confirm" && (
                <div>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{"\u2705"}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>Confirm Your Payment</div>
                    <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 6, lineHeight: 1.6 }}>Enter your WiPay Transaction ID from the receipt (e.g. 55-31798-2-20260329221811) and the amount you paid.</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, color: S.gray, fontFamily: S.body, marginBottom: 4 }}>Transaction ID / Receipt Number</label>
                    <input type="text" value={payTxn} onChange={function(e) { setPayTxn(e.target.value); setPayConfirmMsg(""); }}
                      placeholder="e.g. 55-31798-2-20260329221811"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: "monospace", color: S.navy, fontWeight: 600, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, color: S.gray, fontFamily: S.body, marginBottom: 4 }}>Amount Paid (JMD)</label>
                    <input type="number" value={payAmt} onChange={function(e) { setPayAmt(e.target.value); setPayConfirmMsg(""); }}
                      placeholder="e.g. 20000"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, fontWeight: 600, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, color: S.gray, fontFamily: S.body, marginBottom: 4 }}>Payment Method</label>
                    <select value={payMethod} onChange={function(e) { setPayMethod(e.target.value); }}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "2px solid " + S.border, fontSize: 13, fontFamily: S.body, color: S.navy, boxSizing: "border-box" }}>
                      <option value="WiPay Online">WiPay Online (Credit/Debit Card)</option>
                      <option value="Bank Transfer">Bank Transfer / Deposit</option>
                      <option value="Cash">Cash (In-Person)</option>
                    </select>
                  </div>
                  {payConfirmMsg && <div style={{ marginBottom: 12, padding: "12px 16px", borderRadius: 8, background: payConfirmSuccess ? S.emeraldLight : S.amberLight, border: "1px solid " + (payConfirmSuccess ? S.emerald : S.amber) + "30", fontSize: 13, color: payConfirmSuccess ? S.emeraldDark : S.amberDark, fontFamily: S.body }}>{payConfirmMsg}</div>}
                  <button onClick={async function() {
                    if (!payTxn.trim() || !payAmt) { setPayConfirmMsg("Please enter the Transaction ID and amount."); return; }
                    setPayConfirmLoading(true); setPayConfirmMsg("");
                    try {
                      var res = await fetch(APPS_SCRIPT_URL, {
                        method: "POST",
                        body: JSON.stringify({
                          form_type: "Payment Confirmation",
                          ref: student.ref || "",
                          studentNumber: student.studentNumber || "",
                          email: student.email || "",
                          transactionId: payTxn.trim(),
                          amountPaid: payAmt,
                          paymentMethod: payMethod,
                          paymentPlan: student.paymentPlan || "Gold",
                          programme: student.programme || "",
                          level: student.level || "",
                          timestamp: new Date().toISOString()
                        })
                      });
                      setPayConfirmSuccess(true);
                      setPayConfirmMsg("Payment confirmed! Your payment of J$" + Number(payAmt).toLocaleString() + " has been recorded. Your account will be updated within 24 hours. You will receive an email confirmation once verified.");
                    } catch(e) {
                      setPayConfirmMsg("Error submitting. Please try again or contact admin@ctsetsjm.com");
                    }
                    setPayConfirmLoading(false);
                  }} disabled={payConfirmLoading || !payTxn.trim() || !payAmt}
                    style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: (payTxn.trim() && payAmt) ? S.emerald : S.border, color: (payTxn.trim() && payAmt) ? "#fff" : S.grayLight, fontSize: 15, fontWeight: 700, cursor: (payTxn.trim() && payAmt) ? "pointer" : "not-allowed", fontFamily: S.body, marginBottom: 10 }}>
                    {payConfirmLoading ? "Submitting..." : "Confirm Payment"}
                  </button>
                  <button onClick={function() { setPayStep("choose"); setPayConfirmMsg(""); }}
                    style={{ width: "100%", background: "none", border: "none", color: S.gray, fontSize: 12, cursor: "pointer", fontFamily: S.body }}>
                    Back to payment options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
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

  // Auto sign-out after 15 minutes of inactivity
  useEffect(function() {
    if (!student) return;
    var timeout;
    var IDLE_LIMIT = 15 * 60 * 1000; // 15 minutes
    var resetTimer = function() {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        setStudent(null);
        try { sessionStorage.removeItem("cts_portal_session"); } catch(e) {}
        alert("You have been signed out due to inactivity.");
      }, IDLE_LIMIT);
    };
    var events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    for (var i = 0; i < events.length; i++) { document.addEventListener(events[i], resetTimer); }
    resetTimer();
    return function() {
      clearTimeout(timeout);
      for (var i = 0; i < events.length; i++) { document.removeEventListener(events[i], resetTimer); }
    };
  }, [student]);

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
