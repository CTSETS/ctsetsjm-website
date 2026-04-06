import { useState, useEffect, useCallback } from "react";
import S from "../constants/styles";

// REQUIRED INSTITUTIONAL CONSTANT
const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

var PW_KEY = "ctsAdm";
var C = {
  navy: "#011E40", gold: "#C49112", teal: "#0E8F8B", coral: "#E8634A",
  emerald: "#2E7D32", emeraldLight: "#E8F5E9", amber: "#F57F17", amberLight: "#FFF8E1",
  bg: "#F8FAFC", card: "#FFFFFF", border: "#E2E8F0", gray: "#64748B",
  grayLight: "#94A3B8", text: "#1E293B", red: "#EF4444", redLight: "#FEE2E2",
  blue: "#3B82F6", blueLight: "#DBEAFE", purple: "#8B5CF6", purpleLight: "#EDE9FE",
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
  return <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 12, background: s.bg, color: s.c, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", fontFamily: C.body }}>{status || "\u2014"}</span>;
}

function TH({ children }) { return <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: C.gray, fontSize: 11, borderBottom: "1px solid " + C.border, whiteSpace: "nowrap", position: "sticky", top: 0, background: "#F1F5F9", zIndex: 1, textTransform: "uppercase", letterSpacing: 1 }}>{children}</th>; }
function TD({ children, mono, bold, color, max }) { return <td style={{ padding: "12px 16px", fontFamily: mono ? "monospace" : C.body, fontSize: mono ? 11 : 13, fontWeight: bold ? 600 : 400, color: color || C.text, maxWidth: max || "none", overflow: max ? "hidden" : "visible", textOverflow: max ? "ellipsis" : "clip", whiteSpace: max ? "nowrap" : "normal", borderBottom: "1px solid " + C.border }}>{children}</td>; }
function Btn({ children, color, bg, onClick, disabled, small }) { return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "6px 12px" : "8px 16px", borderRadius: 6, border: "none", background: disabled ? C.border : (bg || C.emerald), color: disabled ? C.grayLight : (color || "#fff"), fontSize: small ? 11 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", fontFamily: C.body, whiteSpace: "nowrap", transition: "0.2s" }}>{children}</button>; }
function Pill({ label, active, onClick }) { return <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, border: active ? "2px solid " + C.navy : "1px solid " + C.border, background: active ? C.navy : C.card, color: active ? "#fff" : C.gray, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.body, transition: "0.2s" }}>{label}</button>; }
function SearchBox({ value, onChange }) { return <input value={value} onChange={function(e) { onChange(e.target.value); }} placeholder="Search name, ref, email..." style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, width: 240, boxSizing: "border-box", fontFamily: C.body, outline: "none" }} />; }

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

  // Secure API Call via Vercel Proxy - USING pw INSTEAD OF akey
  var api = useCallback(async function(action, params) {
    let url = `${VERCEL_URL}?action=${action}&pw=${encodeURIComponent(auth)}`;
    if (params) {
      for (let k in params) {
        if (params[k] !== undefined && params[k] !== "") {
          url += `&${k}=${encodeURIComponent(params[k])}`;
        }
      }
    }
    const response = await fetch(url);
    return response.json();
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
    fetch(`${VERCEL_URL}?action=admindashboard&pw=${encodeURIComponent(pw.trim())}`)
      .then(function(r) { return r.json(); }).then(function(d) {
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

  // ═══ RESTORED BEAUTIFUL LOGIN UI ═══
  // ═══ ENTERPRISE LOGIN UI ═══
  // ═══ ENTERPRISE LOGIN UI ═══
  // ═══ COMMAND CENTER GATEWAY UI ═══
  if (!loggedIn) {
    const StatusBadge = ({ label }) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.3)", padding: "12px 20px", borderRadius: 30, border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.emerald, boxShadow: `0 0 12px ${C.emerald}` }} />
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, fontFamily: C.body, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}: ONLINE</span>
      </div>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
        {/* Beefed-Up Header */}
        <div style={{ background: C.navy, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src="/logo.jpg" alt="CTS ETS" style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${C.gold}`, boxShadow: `0 0 15px ${C.gold}40` }} />
            <div>
              <div style={{ color: C.gold, fontWeight: 800, fontSize: 24, fontFamily: C.heading, letterSpacing: 0.5 }}>CTS ETS Admin</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 3, fontWeight: 700, marginTop: 4 }}>SECURE OPERATIONS CONSOLE</div>
            </div>
          </div>
          <a href="/#Home" style={{ color: "#fff", fontSize: 14, textDecoration: "none", fontWeight: 700, padding: "12px 24px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s" }}>&larr; Back to Website</a>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, background: `linear-gradient(135deg, ${C.navy} 0%, #06192e 100%)`, position: "relative", overflow: "hidden" }}>
          {/* Subtle Background Grid/Glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw", height: "80vw", background: `radial-gradient(circle, ${C.gold}08 0%, transparent 60%)`, pointerEvents: "none" }} />
          
          <div style={{ background: C.card, borderRadius: 24, padding: "56px 48px", maxWidth: 460, width: "100%", boxShadow: "0 32px 100px rgba(0,0,0,0.5)", textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🛡️</div>
            <h1 style={{ fontFamily: C.heading, color: C.navy, fontSize: 32, margin: "0 0 12px", fontWeight: 800 }}>Admin Login</h1>
            <p style={{ fontFamily: C.body, color: C.gray, fontSize: 15, margin: "0 0 36px", lineHeight: 1.6 }}>Enter your master credentials to access the central nervous system.</p>
            
            <div style={{ marginBottom: 24 }}>
              <input type="password" value={pw} onChange={function(e) { setPw(e.target.value); setLoginErr(""); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleLogin(); }}
                autoFocus placeholder="Administrator Password"
                style={{ width: "100%", padding: "18px", borderRadius: 12, border: "2px solid " + (loginErr ? C.red : C.border), fontSize: 16, fontFamily: C.body, color: C.navy, boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 3, transition: "0.2s", background: "#F8FAFC" }} />
            </div>
            {loginErr && <div style={{ padding: "12px", borderRadius: 10, background: C.redLight, color: C.red, fontSize: 14, marginBottom: 20, fontFamily: C.body, fontWeight: 700 }}>{loginErr}</div>}
            
            <button onClick={handleLogin} disabled={loading || !pw.trim()}
              style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: (!pw.trim() || loading) ? C.border : `linear-gradient(135deg, ${C.coral} 0%, #d45138 100%)`, color: "#fff", fontSize: 16, fontWeight: 800, cursor: pw.trim() && !loading ? "pointer" : "not-allowed", fontFamily: C.body, transition: "all 0.2s", boxShadow: (!pw.trim() || loading) ? "none" : "0 8px 24px rgba(232, 99, 74, 0.4)", textTransform: "uppercase", letterSpacing: 1 }}>
              {loading ? "Authenticating..." : "Access Console"}
            </button>
            <div style={{ display: 'none' }}><p>Enter your administrator password to access the console.</p></div>
          </div>

          {/* System Monitors */}
          <div style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 2 }}>
            <StatusBadge label="Vercel Proxy" />
            <StatusBadge label="Database" />
            <StatusBadge label="Auth Engine" />
          </div>
        </div>

        {/* Secure Footer */}
        <div style={{ background: "#041222", padding: "20px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: C.body, margin: 0, letterSpacing: 0.5 }}>&copy; 2026 CTS Empowerment & Training Solutions. All rights reserved. <strong>Authorized personnel only.</strong> All login attempts are logged and monitored.</p>
        </div>
      </div>
    );
  }

  // ═══ MAIN ADMIN UI ═══
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
      {/* TOP NAVIGATION */}
      <div style={{ background: C.navy, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.jpg" alt="" style={{ width: 34, height: 34, borderRadius: 8 }} />
          <div><div style={{ color: C.gold, fontWeight: 700, fontSize: 15, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 1 }}>OPERATIONS CONSOLE</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={refresh} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><span>↻</span> Refresh</button>
          <button onClick={function() { setLoggedIn(false); setAuth(""); setPw(""); try { sessionStorage.removeItem(PW_KEY); } catch(e) {} }} style={{ padding: "6px 16px", borderRadius: 6, background: C.coral, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Log Out</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: C.card, borderBottom: "1px solid " + C.border, padding: "0 24px", display: "flex", overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        {tabList.map(function(t) {
          var active = tab === t.id;
          return <button key={t.id} onClick={function() { setTab(t.id); setSearchTerm(""); }} style={{ padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.navy : C.gray, borderBottom: active ? "3px solid " + C.navy : "3px solid transparent", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", flexShrink: 0, fontFamily: C.body, transition: "0.2s" }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span> {t.label}
            {t.badge > 0 && <span style={{ background: C.coral, color: "#fff", borderRadius: 12, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>{t.badge}</span>}
          </button>;
        })}
      </div>

      {/* TOAST NOTIFICATION */}
      {actionMsg && (
        <div style={{ margin: "20px 24px 0", padding: "12px 20px", borderRadius: 8, background: actionMsg.ok ? C.emeraldLight : C.redLight, color: actionMsg.ok ? C.emerald : C.red, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", border: "1px solid " + (actionMsg.ok ? C.emerald : C.red) + "30" }}>
          <span>{actionMsg.text}</span>
          <button onClick={function() { setActionMsg(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "inherit", padding: 0 }}>✕</button>
        </div>
      )}

      {loading && <div style={{ height: 4, background: `linear-gradient(90deg, ${C.coral}, ${C.gold}, ${C.teal})`, animation: "pulse 1.5s infinite" }} />}

      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>

        {/* ═══ DASHBOARD VIEW ═══ */}
        {tab === "dashboard" && dashboard && (<div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { l: "Total Applications", v: dashboard.apps.total, c: C.navy, bg: "#fff", go: function() { setTab("applications"); setAppFilter(""); } },
              { l: "Awaiting Review", v: dashboard.apps.underReview, c: C.coral, bg: "#fff", go: function() { setTab("applications"); setAppFilter("Under Review"); } },
              { l: "Active Students", v: dashboard.enrolled.enrolled, c: C.teal, bg: "#fff", go: function() { setTab("students"); setStudentFilter("Enrolled"); } },
              { l: "Revenue Collected", v: fmt(dashboard.enrolled.revenue), c: C.emerald, bg: "#fff" },
            ].map(function(s, i) {
              return <div key={i} onClick={s.go} style={{ background: s.bg, borderRadius: 16, padding: "24px", border: "1px solid " + C.border, cursor: s.go ? "pointer" : "default", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", transition: "0.2s" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gray, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: s.c, fontFamily: C.heading }}>{s.v}</div>
              </div>;
            })}
          </div>

          <div style={{ background: C.card, borderRadius: 16, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid " + C.border, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: C.navy, fontSize: 16, fontFamily: C.heading }}>Action Required: Pending Payments {pp.length > 0 && <span style={{ background: C.coral, color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 12, fontWeight: 700, marginLeft: 8, fontFamily: C.body }}>{pp.length}</span>}</div>
            </div>
            {pp.length === 0 ? <div style={{ padding: 60, textAlign: "center", color: C.grayLight, fontSize: 15, fontFamily: C.body }}>✅ You are all caught up! No pending payments.</div> : (
              <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>{["Date", "Reference", "Name", "Amount", "Plan", "Notes", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{pp.map(function(p, i) { return (
                  <tr key={i}>
                    <TD color={C.gray}>{p.date}</TD><TD mono bold>{p.ref}</TD><TD bold color={C.navy}>{p.name}</TD>
                    <TD bold color={C.emerald}>{fmt(p.amount)}</TD><TD color={C.gray}>{p.plan}</TD><TD color={C.gray} max={200}>{p.notes}</TD>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}><div style={{ display: "flex", gap: 8 }}>
                      <Btn onClick={function() { setModal({ type: "verify", data: p }); setVerifyAmt(String(p.amount)); setVerifyTxn(""); }}>Verify</Btn>
                      <Btn bg={C.redLight} color={C.red} onClick={function() { rejectPay(p.ref); }}>Reject</Btn>
                    </div></td>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
          </div>
        </div>)}

        {/* ═══ APPLICATIONS ═══ */}
        {tab === "applications" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            {["Under Review", "Accepted", "Pending Payment", "Rejected", "Withdrawn", ""].map(function(f) {
              return <Pill key={f || "All"} label={f || "All"} active={appFilter === f} onClick={function() { setAppFilter(f); }} />;
            })}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 16, border: "1px solid " + C.border, overflow: "hidden" }}>
            {loading && !apps.length ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>Loading...</div> :
            filt(apps).length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>No applications found</div> : (
              <div style={{ overflowX: "auto", maxHeight: "68vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Date", "Ref", "Name", "Email", "Programme", "Status", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{filt(apps).map(function(a, i) { return (
                  <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                    <TD color={C.gray}>{a.date}</TD><TD mono bold>{a.ref}</TD><TD bold>{a.name}</TD>
                    <TD color={C.gray} max={180}>{a.email}</TD>
                    <TD max={200}>{a.programme}</TD>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}><Badge status={a.status} /></td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}>
                      {a.status === "Under Review" && <div style={{ display: "flex", gap: 8 }}>
                        <Btn small onClick={function() { acceptApp(a.ref); }} disabled={busy === a.ref}>{busy === a.ref ? "..." : "Accept"}</Btn>
                        <Btn small bg={C.redLight} color={C.red} onClick={function() { rejectApp(a.ref); }} disabled={busy === a.ref}>Reject</Btn>
                      </div>}
                    </td>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
            <div style={{ padding: "12px 20px", borderTop: "1px solid " + C.border, fontSize: 12, color: C.grayLight, background: "#F8FAFC" }}>{filt(apps).length} application(s)</div>
          </div>
        </div>)}

        {/* ═══ STUDENTS ═══ */}
        {tab === "students" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            {["", "Pending Payment", "Enrolled", "Active", "On Hold", "Graduated", "Withdrawn"].map(function(f) {
              return <Pill key={f || "All"} label={f || "All"} active={studentFilter === f} onClick={function() { setStudentFilter(f); }} />;
            })}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 16, border: "1px solid " + C.border, overflow: "hidden" }}>
            {loading && !students.length ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>Loading...</div> : (function() {
              var fs = filt(students).filter(function(s) { return !studentFilter || s.status === studentFilter; });
              return fs.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>No students found</div> : (
                <div style={{ overflowX: "auto", maxHeight: "68vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Student #", "Name", "Programme", "Status", "LMS Access", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                  <tbody>{fs.map(function(s, i) { return (
                    <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                      <TD mono bold>{s.studentNumber}</TD><TD bold>{s.name}</TD>
                      <TD max={200}>{s.programme}</TD>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}><Badge status={s.status} /></td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}><Badge status={s.lmsAccess} /></td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {s.status === "Pending Payment" && <Btn small onClick={function() { enrollStu(s.ref); }} disabled={busy === s.ref}>{busy === s.ref ? "..." : "Enroll"}</Btn>}
                          <Btn small bg={C.navy} onClick={function() { genRecord(s.studentNumber); }} disabled={busy === s.studentNumber}>Record</Btn>
                        </div>
                      </td>
                    </tr>
                  ); })}</tbody>
                </table></div>
              );
            })()}
            <div style={{ padding: "12px 20px", borderTop: "1px solid " + C.border, fontSize: 12, color: C.grayLight, background: "#F8FAFC" }}>
              {filt(students).filter(function(s) { return !studentFilter || s.status === studentFilter; }).length} student(s)
            </div>
          </div>
        </div>)}

        {/* ═══ PAYMENTS ═══ */}
        {tab === "payments" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            {["Pending Verification", "Paid", "Rejected \u2014 Not Found", ""].map(function(f) {
              return <Pill key={f || "All"} label={f || "All"} active={payFilter === f} onClick={function() { setPayFilter(f); }} />;
            })}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 16, border: "1px solid " + C.border, overflow: "hidden" }}>
            {loading && !payments.length ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>Loading...</div> : (function() {
              var fp = filt(payments).filter(function(p) { return !payFilter || p.status === payFilter; });
              return fp.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.grayLight }}>No payments found</div> : (
                <div style={{ overflowX: "auto", maxHeight: "68vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Date", "Ref", "Name", "Amount", "Status", "Receipt", "Actions"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                  <tbody>{fp.map(function(p, i) {
                    var isPending = (p.status || "").indexOf("Pending") >= 0;
                    return (
                      <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                        <TD color={C.gray}>{p.date}</TD><TD mono bold>{p.ref}</TD><TD bold>{p.name}</TD>
                        <TD bold color={C.emerald}>{fmt(p.amount)}</TD>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}><Badge status={p.status} /></td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}>{p.receipt && <a href={p.receipt} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.blue, fontWeight: 700, textDecoration: "none" }}>View</a>}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}>
                          {isPending && <div style={{ display: "flex", gap: 6 }}>
                            <Btn small onClick={function() { setModal({ type: "verify", data: p }); setVerifyAmt(String(p.amount)); setVerifyTxn(""); }}>Verify</Btn>
                            <Btn small bg={C.redLight} color={C.red} onClick={function() { rejectPay(p.ref); }}>Reject</Btn>
                          </div>}
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table></div>
              );
            })()}
            <div style={{ padding: "12px 20px", borderTop: "1px solid " + C.border, fontSize: 12, color: C.grayLight, background: "#F8FAFC" }}>
              {filt(payments).filter(function(p) { return !payFilter || p.status === payFilter; }).length} record(s)
            </div>
          </div>
        </div>)}

        {/* ═══ ACTIVITY ═══ */}
        {tab === "activity" && (<div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <h2 style={{ fontFamily: C.heading, color: C.navy, fontSize: 22, margin: 0, fontWeight: 700 }}>Activity Logs</h2>
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>

          <div style={{ background: C.card, borderRadius: 16, border: "1px solid " + C.border, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid " + C.border, fontWeight: 700, color: C.navy, fontSize: 14 }}>System Audit Log</div>
            {auditLog.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: C.grayLight }}>No entries</div> : (
              <div style={{ overflowX: "auto", maxHeight: "40vh", overflowY: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Time", "Action", "Ref", "Details", "By"].map(function(h) { return <TH key={h}>{h}</TH>; })}</tr></thead>
                <tbody>{filt(auditLog).map(function(e, i) { return (
                  <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                    <TD color={C.gray}>{e.timestamp}</TD>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid " + C.border }}><span style={{ padding: "2px 8px", borderRadius: 6, background: C.blueLight, color: C.blue, fontSize: 11, fontWeight: 700 }}>{e.action}</span></td>
                    <TD mono>{e.ref}</TD><TD color={C.gray} max={300}>{e.details}</TD><TD color={C.gray}>{e.by}</TD>
                  </tr>
                ); })}</tbody>
              </table></div>
            )}
          </div>
        </div>)}

      </div>

      {/* ═══ VERIFY MODAL ═══ */}
      {modal && modal.type === "verify" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" }}
          onClick={function(e) { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "24px", background: C.navy }}>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: C.heading }}>Verify Bank Payment</div>
              <div style={{ color: C.gold, fontSize: 13, marginTop: 4, fontFamily: C.body }}>{modal.data.ref} | {modal.data.name}</div>
            </div>
            <div style={{ padding: 32 }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, color: C.navy, marginBottom: 8, fontWeight: 700, fontFamily: C.body }}>Verified Amount Received (JMD)</label>
                <input type="number" value={verifyAmt} onChange={function(e) { setVerifyAmt(e.target.value); }}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 18, fontWeight: 700, color: C.navy, boxSizing: "border-box", outline: "none" }} />
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: "block", fontSize: 12, color: C.navy, marginBottom: 8, fontWeight: 700, fontFamily: C.body }}>Bank Transaction ID / Receipt #</label>
                <input type="text" value={verifyTxn} onChange={function(e) { setVerifyTxn(e.target.value); }} placeholder="Enter bank reference..."
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 15, fontFamily: "monospace", color: C.navy, boxSizing: "border-box", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={function() { if (verifyAmt && verifyTxn) verifyPay(modal.data.ref, verifyAmt, verifyTxn); }}
                  disabled={!verifyAmt || !verifyTxn || busy === modal.data.ref}
                  style={{ flex: 1, padding: 16, borderRadius: 10, border: "none", background: (verifyAmt && verifyTxn) ? C.emerald : C.border, color: (verifyAmt && verifyTxn) ? "#fff" : C.grayLight, fontSize: 15, fontWeight: 700, cursor: (verifyAmt && verifyTxn) ? "pointer" : "not-allowed", transition: "0.2s" }}>
                  {busy === modal.data.ref ? "Verifying..." : "Confirm Payment"}
                </button>
                <button onClick={function() { setModal(null); }} style={{ padding: "16px 24px", borderRadius: 10, border: "1px solid " + C.border, background: C.bg, color: C.navy, cursor: "pointer", fontWeight: 700, transition: "0.2s" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;