import { useState, useEffect, useCallback } from "react";
import { APPS_SCRIPT_URL } from "../constants/config";

var PW_KEY = "ctsAdm";
var C = {
  navy: "#011E40", gold: "#C49112", teal: "#0E8F8B", coral: "#E8634A",
  emerald: "#2E7D32", emeraldLight: "#E8F5E9", amber: "#F57F17", amberLight: "#FFF8E1",
  bg: "#F0F2F5", card: "#FFFFFF", border: "#E2E8F0", gray: "#64748B",
  grayLight: "#94A3B8", text: "#1A202C", red: "#C62828", redLight: "#FFEBEE",
  blue: "#1565C0", blueLight: "#E3F2FD", purple: "#6A1B9A", purpleLight: "#F3E5F5",
  heading: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
};
function fmt(n) { return "J$" + Number(n || 0).toLocaleString(); }

function Badge({ status }) {
  var map = {
    "Under Review": { bg: C.amberLight, c: C.amber }, "Accepted": { bg: C.emeraldLight, c: C.emerald },
    "Pending Payment": { bg: C.blueLight, c: C.blue }, "Rejected": { bg: C.redLight, c: C.red },
    "Withdrawn": { bg: C.purpleLight, c: C.purple }, "Deferred": { bg: "#F1F5F9", c: C.gray },
    "Enrolled": { bg: "#E0F7FA", c: "#00838F" }, "Active": { bg: C.blueLight, c: C.blue },
    "On Hold": { bg: "#FFF3E0", c: "#E65100" }, "Completed": { bg: C.emeraldLight, c: C.emerald },
    "Graduated": { bg: "#FFF8E1", c: "#F9A825" }, "Paid": { bg: C.emeraldLight, c: C.emerald },
    "Paid in Full": { bg: C.emeraldLight, c: C.emerald }, "Partial Payment": { bg: C.amberLight, c: C.amber },
    "Pending": { bg: C.amberLight, c: C.amber }, "Pending Verification": { bg: "#FFF3E0", c: "#E65100" },
    "Paid (Online)": { bg: C.emeraldLight, c: C.emerald }, "Rejected \u2014 Not Found": { bg: C.redLight, c: C.red },
    "Yes": { bg: C.emeraldLight, c: C.emerald }, "No": { bg: C.redLight, c: C.red },
    "Evidence Submitted": { bg: C.amberLight, c: C.amber },
  };
  var s = map[status] || { bg: "#F1F5F9", c: C.gray };
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 10, background: s.bg, color: s.c, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{status || "\u2014"}</span>;
}

function TH({ children }) { return <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: C.navy, fontSize: 11, borderBottom: "1px solid " + C.border, whiteSpace: "nowrap", position: "sticky", top: 0, background: "#F8FAFC", zIndex: 1 }}>{children}</th>; }
function TD({ children, mono, bold, color, max }) { return <td style={{ padding: "10px 12px", fontFamily: mono ? "monospace" : C.body, fontSize: mono ? 10 : 12, fontWeight: bold ? 700 : 400, color: color || C.text, maxWidth: max || "none", overflow: max ? "hidden" : "visible", textOverflow: max ? "ellipsis" : "clip", whiteSpace: max ? "nowrap" : "normal" }}>{children}</td>; }
function Btn({ children, color, bg, onClick, disabled, small }) { return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "4px 10px" : "6px 14px", borderRadius: 6, border: "none", background: disabled ? C.border : (bg || C.emerald), color: disabled ? C.grayLight : (color || "#fff"), fontSize: small ? 10 : 11, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: C.body, whiteSpace: "nowrap" }}>{children}</button>; }
function Pill({ label, active, onClick }) { return <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 16, border: active ? "2px solid " + C.navy : "1px solid " + C.border, background: active ? C.navy : C.card, color: active ? "#fff" : C.gray, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.body }}>{label}</button>; }
function SearchBox({ value, onChange }) { return <input value={value} onChange={function(e) { onChange(e.target.value); }} placeholder="Search name, ref, email..." style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 12, width: 220, boxSizing: "border-box", fontFamily: C.body }} />; }

function AdminDashboardPage() {
  var [auth, setAuth] = useState(function() { try { return sessionStorage.getItem(PW_KEY) || ""; } catch(e) { return ""; } });
  var [loggedIn, setLoggedIn] = useState(false);
  var [pw, setPw] = useState("");
  var [loginErr, setLoginErr] = useState("");
  var [loading, setLoading] = useState(false);
  var [tab, setTab] = useState("dashboard");

  var [dashboard, setDashboard] = useState(null);
  var [apps, setApps] = useState([]);
  var [students, setStudents] = useState([]);
  var [payments, setPayments] = useState([]);
  var [auditLog, setAuditLog] = useState([]);
  var [lifecycleLog, setLifecycleLog] = useState([]);

  var [appFilter, setAppFilter] = useState("Under Review");
  var [studentFilter, setStudentFilter] = useState("");
  var [payFilter, setPayFilter] = useState("Pending Verification");
  var [searchTerm, setSearchTerm] = useState("");
  var [actionMsg, setActionMsg] = useState(null);
  var [busy, setBusy] = useState("");
  var [modal, setModal] = useState(null);
  var [verifyAmt, setVerifyAmt] = useState("");
  var [verifyTxn, setVerifyTxn] = useState("");
  var [refreshKey, setRefreshKey] = useState(0);

  var api = useCallback(function(action, params) {
    var url = APPS_SCRIPT_URL + "?action=" + action + "&auth=" + encodeURIComponent(auth);
    if (params) { for (var k in params) { if (params[k] !== undefined && params[k] !== "") url += "&" + k + "=" + encodeURIComponent(params[k]); } }
    return fetch(url).then(function(r) { return r.json(); });
  }, [auth]);

  function toast(text, ok) { setActionMsg({ text: text, ok: ok !== false }); setTimeout(function() { setActionMsg(null); }, 6000); }
  function refresh() { setRefreshKey(function(k) { return k + 1; }); }

  function loadDash() {
    setLoading(true);
    api("admindashboard").then(function(d) {
      if (d.ok) { setDashboard(d); setLoggedIn(true); try { sessionStorage.setItem(PW_KEY, auth); } catch(e) {} }
      else { setLoginErr("Invalid credentials"); }
      setLoading(false);
    }).catch(function() { setLoginErr("Connection error"); setLoading(false); });
  }

  useEffect(function() { if (auth) loadDash(); }, []);
  useEffect(function() {
    if (!loggedIn) return;
    if (tab === "dashboard") loadDash();
    else if (tab === "applications") { setLoading(true); api("adminlistapps", { status: appFilter }).then(function(d) { if (d.ok) setApps(d.applications || []); setLoading(false); }).catch(function() { setLoading(false); }); }
    else if (tab === "students") { setLoading(true); api("adminliststudents").then(function(d) { if (d.ok) setStudents(d.students || []); setLoading(false); }).catch(function() { setLoading(false); }); }
    else if (tab === "payments") { setLoading(true); api("adminlistpayments").then(function(d) { if (d.ok) setPayments(d.payments || []); setLoading(false); }).catch(function() { setLoading(false); }); }
    else if (tab === "activity") { setLoading(true); api("adminauditlog").then(function(d) { if (d.ok) { setAuditLog(d.entries || []); setLifecycleLog(d.lifecycle || []); } setLoading(false); }).catch(function() { setLoading(false); }); }
  }, [loggedIn, tab, appFilter, refreshKey]);

  function doAction(name, action, params) {
    setBusy(name);
    api(action, params).then(function(d) { toast(d.ok ? (d.message || "Done") : ("Error: " + (d.error || "")), d.ok); setBusy(""); refresh(); }).catch(function() { toast("Network error", false); setBusy(""); });
  }

  function acceptApp(ref) { if (confirm("Accept " + ref + "?")) doAction(ref, "adminacceptapp", { ref: ref }); }
  function rejectApp(ref) { if (confirm("Reject " + ref + "?")) doAction(ref, "adminrejectapp", { ref: ref }); }
  function enrollStu(ref) { if (confirm("Enroll " + ref + "? Credentials will be sent.")) doAction(ref, "adminenrollstudent", { ref: ref }); }
  function resetPw(ref) { if (confirm("Reset password for " + ref + "?")) doAction(ref, "adminresetpw", { ref: ref }); }
  function genRecord(sn) { doAction(sn, "generaterecord", { student: sn }); }
  function rejectPay(ref) { if (confirm("Reject payment for " + ref + "?")) doAction(ref, "rejectpayment", { ref: ref, txn: "admin-dashboard" }); }
  function verifyPay(ref, amt, txn) { doAction(ref, "verifypayment", { ref: ref, amount: amt, txn: txn }); setModal(null); }

  function handleLogin() {
    if (!pw.trim()) return;
    setLoginErr(""); setLoading(true);
    fetch(APPS_SCRIPT_URL + "?action=admindashboard&auth=" + encodeURIComponent(pw.trim())).then(function(r) { return r.json(); }).then(function(d) {
      if (d.ok) { setDashboard(d); setLoggedIn(true); setAuth(pw.trim()); try { sessionStorage.setItem(PW_KEY, pw.trim()); } catch(e) {} }
      else setLoginErr("Invalid password");
      setLoading(false);
    }).catch(function() { setLoginErr("Connection error"); setLoading(false); });
  }

  function filt(list) {
    if (!searchTerm) return list;
    var s = searchTerm.toLowerCase();
    return list.filter(function(item) { return Object.values(item).some(function(v) { return String(v || "").toLowerCase().indexOf(s) >= 0; }); });
  }

  // ═══ LOGIN ═══
  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, " + C.navy + " 0%, #0a2d4d 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: C.card, borderRadius: 20, padding: "44px 36px", maxWidth: 380, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src="/logo.jpg" alt="CTS ETS" style={{ width: 72, height: 72, borderRadius: 14, marginBottom: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
            <h1 style={{ fontFamily: C.heading, color: C.navy, fontSize: 24, margin: "0 0 4px" }}>Admin Dashboard</h1>
            <p style={{ fontFamily: C.body, color: C.grayLight, fontSize: 12, margin: 0 }}>CTS Empowerment & Training Solutions</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <input type="password" value={pw} onChange={function(e) { setPw(e.target.value); setLoginErr(""); }}
              onKeyDown={function(e) { if (e.key === "Enter") handleLogin(); }}
              autoFocus placeholder="Enter admin password"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "2px solid " + (loginErr ? C.coral : C.border), fontSize: 15, fontFamily: C.body, color: C.navy, boxSizing: "border-box", outline: "none" }} />
          </div>
          {loginErr && <div style={{ padding: "10px 14px", borderRadius: 8, background: C.redLight, color: C.red, fontSize: 13, marginBottom: 16, textAlign: "center" }}>{loginErr}</div>}
          <button onClick={handleLogin} disabled={loading || !pw.trim()}
            style={{ width: "100%", padding: 15, borderRadius: 10, border: "none", background: (!pw.trim() || loading) ? C.border : C.navy, color: (!pw.trim() || loading) ? C.grayLight : C.gold, fontSize: 15, fontWeight: 700, cursor: pw.trim() && !loading ? "pointer" : "not-allowed", fontFamily: C.body }}>
            {loading ? "Connecting..." : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  // ═══ MAIN ═══
  var tabList = [
    { id: "dashboard", label: "Dashboard", icon: "\uD83D\uDCCA" },
    { id: "applications", label: "Applications", icon: "\uD83D\uDCCB", badge: dashboard ? dashboard.apps.underReview : 0 },
    { id: "students", label: "Students", icon: "\uD83C\uDF93" },
    { id: "payments", label: "Payments", icon: "\uD83D\uDCB3", badge: dashboard ? (dashboard.pendingPayments || []).length : 0 },
    { id: "activity", label: "Activity", icon: "\u26A1" },
  ];

  var pp = dashboard ? (dashboard.pendingPayments || []) : [];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body }}>

      {/* TOP BAR */}
      <div style={{ background: C.navy, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.jpg" alt="" style={{ width: 34, height: 34, borderRadius: 8 }} />
          <div><div style={{ color: C.gold, fontWeight: 700, fontSize: 14, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>MANAGEMENT DASHBOARD</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={refresh} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: 14, cursor: "pointer" }}>{"\u21BB"}</button>
          <a href="/#Home" style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, textDecoration: "none" }}>View Site</a>
          <button onClick={function() { setLoggedIn(false); setAuth(""); setPw(""); try { sessionStorage.removeItem(PW_KEY); } catch(e) {} }} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: 11, cursor: "pointer" }}>Log Out</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: C.card, borderBottom: "1px solid " + C.border, padding: "0 20px", display: "flex", overflowX: "auto" }}>
        {tabList.map(function(t) {
          var active = tab === t.id;
          return <button key={t.id} onClick={function() { setTab(t.id); setSearchTerm(""); }} style={{ padding: "13px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500, color: active ? C.navy : C.gray, borderBottom: active ? "3px solid " + C.gold : "3px solid transparent", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", flexShrink: 0, fontFamily: C.body }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}
            {t.badge > 0 && <span style={{ background: C.coral, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 9, fontWeight: 800 }}>{t.badge}</span>}
          </button>;
        })}
      </div>

      {/* TOAST */}
      {actionMsg && (
        <div style={{ margin: "12px 20px 0", padding: "10px 16px", borderRadius: 8, background: actionMsg.ok ? C.emeraldLight : C.redLight, color: actionMsg.ok ? C.emerald : C.red, fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
          <span>{actionMsg.text}</span>
          <button onClick={function() { setActionMsg(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "inherit" }}>{"\u2715"}</button>
        </div>
      )}

      {loading && <div style={{ height: 3, background: "linear-gradient(90deg, " + C.gold + ", " + C.teal + ")" }} />}

      <div style={{ padding: 20, maxWidth: 1300, margin: "0 auto" }}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dashboard" && dashboard && (<div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { l: "Applications", v: dashboard.apps.total, c: C.blue, bg: C.blueLight, go: function() { setTab("applications"); setAppFilter(""); } },
              { l: "Under Review", v: dashboard.apps.underReview, c: C.amber, bg: C.amberLight, go: function() { setTab("applications"); setAppFilter("Under Review"); } },
              { l: "Pending Payment", v: dashboard.enrolled.pendingPayment, c: C.blue, bg: C.blueLight, go: function() { setTab("students"); setStudentFilter("Pending Payment"); } },
              { l: "Enrolled", v: dashboard.enrolled.enrolled, c: C.teal, bg: "#E0F7FA", go: function() { setTab("students"); setStudentFilter("Enrolled"); } },
              { l: "Revenue", v: fmt(dashboard.enrolled.revenue), c: C.emerald, bg: C.emeraldLight },
              { l: "Outstanding", v: fmt(dashboard.enrolled.outstanding), c: dashboard.enrolled.outstanding > 0 ? C.coral : C.emerald, bg: dashboard.enrolled.outstanding > 0 ? "#FFF3E0" : C.emeraldLight },
            ].map(function(s, i) {
              return <div key={i} onClick={s.go} style={{ background: s.bg, borderRadius: 12, padding: "16px 14px", textAlign: "center", cursor: s.go ? "pointer" : "default" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.c, fontFamily: C.heading }}>{s.v}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: s.c, marginTop: 3, textTransform: "uppercase" }}>{s.l}</div>
              </div>;
            })}
          </div>

          {/* Pending Payments */}
          <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.border, background: "#FFFBF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: C.navy, fontSize: 14 }}>{"\uD83D\uDD14"} Payments Awaiting Verification {pp.length > 0 && <span style={{ background: C.coral, color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginLeft: 6 }}>{pp.length}</span>}</div>
            </div>
            {pp.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: C.grayLight }}>{"\u2705"} No pending payments</div> : (
              <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{["Date", "Reference", "Name", "Amount", "Plan", "Notes", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{pp.map(function(p, i) { return (
                  <tr key={i} style={{ borderBottom: "1px solid " + C.border, background: i % 2 ? "#FAFBFC" : "#fff" }}>
                    <TD color={C.gray}>{p.date}</TD><TD mono bold>{p.ref}</TD><TD bold>{p.name}</TD>
                    <TD bold color={C.emerald}>{fmt(p.amount)}</TD><TD color={C.gray}>{p.plan}</TD><TD color={C.gray} max={160}>{p.notes}</TD>
                    <td style={{ padding: "10px 12px" }}><div style={{ display: "flex", gap: 5 }}>
                      <Btn small onClick={function() { setModal({ type: "verify", data: p }); setVerifyAmt(String(p.amount)); setVerifyTxn(""); }}>{"\u2713 Verify"}</Btn>
                      <Btn small bg={C.red} onClick={function() { rejectPay(p.ref); }}>{"\u2717"}</Btn>
                    </div></td>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
          </div>
        </div>)}

        {/* ═══ APPLICATIONS ═══ */}
        {tab === "applications" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            {["Under Review", "Accepted", "Pending Payment", "Rejected", "Withdrawn", ""].map(function(f) {
              return <Pill key={f || "All"} label={f || "All"} active={appFilter === f} onClick={function() { setAppFilter(f); }} />;
            })}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
            {loading && !apps.length ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>Loading...</div> :
            filt(apps).length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>No applications found</div> : (
              <div style={{ overflowX: "auto", maxHeight: "68vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{["Date", "Ref", "Name", "Email", "Phone", "Programme", "Plan", "Status", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{filt(apps).map(function(a, i) { return (
                  <tr key={i} style={{ borderBottom: "1px solid " + C.border, background: i % 2 ? "#FAFBFC" : "#fff" }}>
                    <TD color={C.gray}>{a.date}</TD><TD mono bold>{a.ref}</TD><TD bold>{a.name}</TD>
                    <TD color={C.gray} max={150}>{a.email}</TD><TD color={C.gray}>{a.phone}</TD>
                    <TD max={170}>{(a.level || "").split("\u2014")[0]} \u2014 {a.programme}</TD>
                    <TD color={C.gray}>{a.plan}</TD>
                    <td style={{ padding: "10px 12px" }}><Badge status={a.status} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      {a.status === "Under Review" && <div style={{ display: "flex", gap: 5 }}>
                        <Btn small onClick={function() { acceptApp(a.ref); }} disabled={busy === a.ref}>{busy === a.ref ? "..." : "\u2713 Accept"}</Btn>
                        <Btn small bg={C.red} onClick={function() { rejectApp(a.ref); }} disabled={busy === a.ref}>Reject</Btn>
                      </div>}
                    </td>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
            <div style={{ padding: "8px 16px", borderTop: "1px solid " + C.border, fontSize: 11, color: C.grayLight, background: "#FAFBFC" }}>{filt(apps).length} application(s)</div>
          </div>
        </div>)}

        {/* ═══ STUDENTS ═══ */}
        {tab === "students" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            {["", "Pending Payment", "Enrolled", "Active", "On Hold", "Graduated", "Withdrawn"].map(function(f) {
              return <Pill key={f || "All"} label={f || "All"} active={studentFilter === f} onClick={function() { setStudentFilter(f); }} />;
            })}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
            {loading && !students.length ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>Loading...</div> : (function() {
              var fs = filt(students).filter(function(s) { return !studentFilter || s.status === studentFilter; });
              return fs.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>No students found</div> : (
                <div style={{ overflowX: "auto", maxHeight: "68vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr>{["Student #", "Name", "Email", "Programme", "Plan", "Fees", "Paid", "Owed", "Status", "LMS", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                  <tbody>{fs.map(function(s, i) { return (
                    <tr key={i} style={{ borderBottom: "1px solid " + C.border, background: i % 2 ? "#FAFBFC" : "#fff" }}>
                      <TD mono bold>{s.studentNumber}</TD><TD bold>{s.name}</TD><TD color={C.gray} max={130}>{s.email}</TD>
                      <TD max={130}>{s.programme}</TD><TD color={C.gray}>{s.plan}</TD>
                      <TD>{fmt(s.totalFees)}</TD><TD color={C.emerald} bold>{fmt(s.totalPaid)}</TD>
                      <TD color={s.outstanding > 0 ? C.coral : C.emerald} bold>{fmt(s.outstanding)}</TD>
                      <td style={{ padding: "10px 12px" }}><Badge status={s.status} /></td>
                      <td style={{ padding: "10px 12px" }}><Badge status={s.lmsAccess} /></td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {s.status === "Pending Payment" && s.totalPaid > 0 && <Btn small onClick={function() { enrollStu(s.ref); }} disabled={busy === s.ref}>{busy === s.ref ? "..." : "Enroll"}</Btn>}
                          <Btn small bg={C.teal} onClick={function() { resetPw(s.studentNumber || s.ref); }} disabled={busy === (s.studentNumber || s.ref)}>PW</Btn>
                          <Btn small bg={C.navy} onClick={function() { genRecord(s.studentNumber); }} disabled={busy === s.studentNumber}>Rec</Btn>
                        </div>
                      </td>
                    </tr>
                  ); })}</tbody>
                </table></div>
              );
            })()}
            <div style={{ padding: "8px 16px", borderTop: "1px solid " + C.border, fontSize: 11, color: C.grayLight, background: "#FAFBFC" }}>
              {filt(students).filter(function(s) { return !studentFilter || s.status === studentFilter; }).length} student(s)
            </div>
          </div>
        </div>)}

        {/* ═══ PAYMENTS ═══ */}
        {tab === "payments" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            {["Pending Verification", "Paid", "Rejected \u2014 Not Found", ""].map(function(f) {
              return <Pill key={f || "All"} label={f || "All"} active={payFilter === f} onClick={function() { setPayFilter(f); }} />;
            })}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
            {loading && !payments.length ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>Loading...</div> : (function() {
              var fp = filt(payments).filter(function(p) { return !payFilter || p.status === payFilter; });
              return fp.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>No payments found</div> : (
                <div style={{ overflowX: "auto", maxHeight: "68vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr>{["Date", "Ref", "Name", "Amount", "Plan", "Status", "Notes", "Receipt", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                  <tbody>{fp.map(function(p, i) {
                    var isPending = (p.status || "").indexOf("Pending") >= 0;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid " + C.border, background: i % 2 ? "#FAFBFC" : "#fff" }}>
                        <TD color={C.gray}>{p.date}</TD><TD mono bold>{p.ref}</TD><TD bold>{p.name}</TD>
                        <TD bold color={C.emerald}>{fmt(p.amount)}</TD><TD color={C.gray}>{p.plan}</TD>
                        <td style={{ padding: "10px 12px" }}><Badge status={p.status} /></td>
                        <TD color={C.gray} max={140}>{p.notes}</TD>
                        <td style={{ padding: "10px 12px" }}>{p.receipt && <a href={p.receipt} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: C.teal, fontWeight: 600 }}>View</a>}</td>
                        <td style={{ padding: "10px 12px" }}>
                          {isPending && <div style={{ display: "flex", gap: 5 }}>
                            <Btn small onClick={function() { setModal({ type: "verify", data: p }); setVerifyAmt(String(p.amount)); setVerifyTxn(""); }}>{"\u2713 Verify"}</Btn>
                            <Btn small bg={C.red} onClick={function() { rejectPay(p.ref); }}>{"\u2717"}</Btn>
                          </div>}
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table></div>
              );
            })()}
            <div style={{ padding: "8px 16px", borderTop: "1px solid " + C.border, fontSize: 11, color: C.grayLight, background: "#FAFBFC" }}>
              {filt(payments).filter(function(p) { return !payFilter || p.status === payFilter; }).length} record(s)
            </div>
          </div>
        </div>)}

        {/* ═══ ACTIVITY ═══ */}
        {tab === "activity" && (<div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center" }}>
            <h2 style={{ fontFamily: C.heading, color: C.navy, fontSize: 18, margin: 0 }}>{"\u26A1"} Activity Log</h2>
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>

          <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid " + C.border, fontWeight: 700, color: C.navy, fontSize: 13 }}>Audit Log (last 50)</div>
            {auditLog.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: C.grayLight }}>No entries</div> : (
              <div style={{ overflowX: "auto", maxHeight: "40vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr>{["Time", "Action", "Ref", "Details", "By"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{filt(auditLog).map(function(e, i) { return (
                  <tr key={i} style={{ borderBottom: "1px solid " + C.border, background: i % 2 ? "#FAFBFC" : "#fff" }}>
                    <TD color={C.gray}>{e.timestamp}</TD>
                    <td style={{ padding: "8px 12px" }}><span style={{ padding: "2px 8px", borderRadius: 4, background: C.blueLight, color: C.blue, fontSize: 10, fontWeight: 700 }}>{e.action}</span></td>
                    <TD mono>{e.ref}</TD><TD color={C.gray} max={300}>{e.details}</TD><TD color={C.gray}>{e.by}</TD>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
          </div>

          <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid " + C.border, fontWeight: 700, color: C.navy, fontSize: 13 }}>Student Lifecycle (last 50)</div>
            {lifecycleLog.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: C.grayLight }}>No events</div> : (
              <div style={{ overflowX: "auto", maxHeight: "40vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr>{["Time", "Student", "Event", "Details", "Change", "By"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{filt(lifecycleLog).map(function(e, i) { return (
                  <tr key={i} style={{ borderBottom: "1px solid " + C.border, background: i % 2 ? "#FAFBFC" : "#fff" }}>
                    <TD color={C.gray}>{e.timestamp}</TD><TD bold>{e.name}</TD>
                    <td style={{ padding: "8px 12px" }}><span style={{ padding: "2px 8px", borderRadius: 4, background: C.emeraldLight, color: C.emerald, fontSize: 10, fontWeight: 700 }}>{e.event}</span></td>
                    <TD color={C.gray} max={250}>{e.details}</TD><TD color={C.gray}>{e.change}</TD><TD color={C.gray}>{e.by}</TD>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
          </div>
        </div>)}

      </div>

      {/* ═══ VERIFY MODAL ═══ */}
      {modal && modal.type === "verify" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}
          onClick={function(e) { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 440, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "16px 20px", background: C.navy }}>
              <div style={{ color: C.gold, fontSize: 15, fontWeight: 700 }}>{"\u2713"} Verify Payment</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{modal.data.ref} | {modal.data.name}</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: C.gray, marginBottom: 4, fontWeight: 700 }}>Amount (JMD)</label>
                <input type="number" value={verifyAmt} onChange={function(e) { setVerifyAmt(e.target.value); }}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 16, fontWeight: 700, color: C.navy, boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 11, color: C.gray, marginBottom: 4, fontWeight: 700 }}>Transaction ID</label>
                <input type="text" value={verifyTxn} onChange={function(e) { setVerifyTxn(e.target.value); }} placeholder="Receipt # or txn ID"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 14, fontFamily: "monospace", color: C.navy, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={function() { if (verifyAmt && verifyTxn) verifyPay(modal.data.ref, verifyAmt, verifyTxn); }}
                  disabled={!verifyAmt || !verifyTxn || busy === modal.data.ref}
                  style={{ flex: 1, padding: 14, borderRadius: 10, border: "none", background: (verifyAmt && verifyTxn) ? C.emerald : C.border, color: (verifyAmt && verifyTxn) ? "#fff" : C.grayLight, fontSize: 15, fontWeight: 700, cursor: (verifyAmt && verifyTxn) ? "pointer" : "not-allowed" }}>
                  {busy === modal.data.ref ? "Verifying..." : "\u2713 Confirm"}
                </button>
                <button onClick={function() { setModal(null); }} style={{ padding: "14px 20px", borderRadius: 10, border: "1px solid " + C.border, background: C.card, color: C.gray, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
