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

// ═══ IRONCLAD DATA PARSERS ═══
function fmt(n) { return "J$" + Number(n || 0).toLocaleString(); }

function findDate(obj) {
  if (!obj) return null;
  if (obj.timestamp) return obj.timestamp;
  if (obj.Timestamp) return obj.Timestamp;
  if (obj.date) return obj.date;
  if (obj.Date) return obj.Date;
  if (obj["Date Submitted"]) return obj["Date Submitted"];
  
  for (let key in obj) {
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("time")) {
      if (obj[key]) return obj[key];
    }
  }
  return null;
}

function fmtTime(d) {
  const raw = findDate(d);
  if (!raw) return "—";
  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(raw).split("T")[0]; 
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

function getFolderUrl(obj) {
  if (!obj) return "";
  if (obj.folder) return obj.folder;
  if (obj.folderUrl) return obj.folderUrl;
  if (obj["Drive Folder Link"]) return obj["Drive Folder Link"];
  
  for (let key in obj) {
    if (key.toLowerCase().includes("folder") || key.toLowerCase().includes("link") || key.toLowerCase().includes("drive")) {
      if (typeof obj[key] === 'string' && obj[key].includes("drive.google.com")) {
        return obj[key];
      }
    }
  }
  return "";
}

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
  return <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 12, background: s.bg, color: s.c, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap", fontFamily: C.body, transition: "all 0.3s ease", letterSpacing: 0.5 }}>{status || "\u2014"}</span>;
}

function TH({ children, sortKey, currentSort, onSort }) {
  var isActive = currentSort && currentSort.key === sortKey;
  var isAsc = isActive && currentSort.dir === 'asc';
  var isDesc = isActive && currentSort.dir === 'desc';

  return (
    <th className={sortKey ? "sortable-th" : ""} onClick={sortKey ? () => onSort(sortKey) : undefined}
        style={{ padding: "16px", textAlign: "left", fontWeight: 800, color: isActive ? C.navy : C.gray, fontSize: 11, borderBottom: isActive ? "2px solid " + C.navy : "1px solid " + C.border, whiteSpace: "nowrap", position: "sticky", top: 0, background: isActive ? "#E2E8F0" : "#F8FAFC", zIndex: 1, textTransform: "uppercase", letterSpacing: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {children}
        {sortKey && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2, opacity: isActive ? 1 : 0.25, transition: "opacity 0.2s" }}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill={isAsc ? C.coral : "currentColor"}><path d="M5 0L10 6H0L5 0Z"/></svg>
            <svg width="10" height="6" viewBox="0 0 10 6" fill={isDesc ? C.coral : "currentColor"}><path d="M5 6L0 0H10L5 6Z"/></svg>
          </div>
        )}
      </div>
    </th>
  );
}

function TD({ children, mono, bold, color, max }) { return <td style={{ padding: "16px", fontFamily: mono ? "monospace" : C.body, fontSize: mono ? 12 : 13, fontWeight: bold ? 700 : 500, color: color || C.text, maxWidth: max || "none", overflow: max ? "hidden" : "visible", textOverflow: max ? "ellipsis" : "clip", whiteSpace: max ? "nowrap" : "normal", borderBottom: "1px solid " + C.border, transition: "background 0.3s" }}>{children}</td>; }
function Btn({ children, color, bg, onClick, disabled, small }) { return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "8px 14px" : "10px 18px", borderRadius: 8, border: "none", background: disabled ? C.border : (bg || C.emerald), color: disabled ? C.grayLight : (color || "#fff"), fontSize: small ? 12 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: C.body, whiteSpace: "nowrap", transition: "all 0.2s" }}>{children}</button>; }
function Pill({ label, active, onClick }) { return <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 20, border: active ? "2px solid " + C.navy : "1px solid " + C.border, background: active ? C.navy : C.card, color: active ? "#fff" : C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.body, transition: "all 0.2s", boxShadow: active ? "0 2px 8px rgba(1,30,64,0.15)" : "none" }}>{label}</button>; }
function SearchBox({ value, onChange }) { return <input value={value} onChange={function(e) { onChange(e.target.value); }} placeholder="Filter by any name, date, or keyword..." style={{ padding: "10px 16px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, width: 320, boxSizing: "border-box", fontFamily: C.body, outline: "none", transition: "0.2s", background: "#fff", fontWeight: 500 }} />; }

function AdminDashboardPage() {
  var [auth, setAuth] = useState(function() { try { return sessionStorage.getItem(PW_KEY) || ""; } catch(e) { return ""; } });
  var [loggedIn, setLoggedIn] = useState(false);
  var [pw, setPw] = useState("");
  var [loginStep, setLoginStep] = useState(0);
  var [otpCode, setOtpCode] = useState("");
  var [loginErr, setLoginErr] = useState("");
  var [loading, setLoading] = useState(false);
  var [tab, setTab] = useState("dashboard");

  var [dashboard, setDashboard] = useState(null);
  var [apps, setApps] = useState([]);
  var [students, setStudents] = useState([]);
  var [payments, setPayments] = useState([]);
  var [auditLog, setAuditLog] = useState([]);

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
  var [sortConfig, setSortConfig] = useState({ key: "timestamp", dir: "desc" });

  var api = useCallback(async function(action, params) {
    let url = `${VERCEL_URL}?action=${action}&pw=${encodeURIComponent(auth)}`;
    if (params) {
      for (let k in params) {
        if (params[k] !== undefined && params[k] !== "") url += `&${k}=${encodeURIComponent(params[k])}`;
      }
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data || { ok: false, error: "Empty Data" };
    } catch (e) { return { ok: false, error: "Network Error" }; }
  }, [auth]);

  function toast(text, ok) { setActionMsg({ text: text, ok: ok !== false }); setTimeout(function() { setActionMsg(null); }, 6000); }
  function refresh() { setRefreshKey(function(k) { return k + 1; }); }

  function loadDash() {
    setLoading(true);
    api("admindashboard").then(function(d) {
      if (d && d.ok) { setDashboard(d); setLoggedIn(true); try { sessionStorage.setItem(PW_KEY, auth); } catch(e) {} } 
      else { setLoginErr("Session expired. Please log in again."); setLoggedIn(false); setLoginStep(0); }
      setLoading(false);
    }).catch(function() { setLoginErr("Connection error"); setLoading(false); });
  }

  useEffect(function() { if (auth) loadDash(); }, []);
  
  useEffect(function() {
    if (!loggedIn) return;
    if (tab === "dashboard") loadDash();
    else if (tab === "applications") { setLoading(true); api("adminlistapps", { status: appFilter }).then(function(d) { if (d && d.ok) setApps(d.applications || []); setLoading(false); }).catch(function() { setLoading(false); }); }
    else if (tab === "students") { setLoading(true); api("adminliststudents").then(function(d) { if (d && d.ok) setStudents(d.students || []); setLoading(false); }).catch(function() { setLoading(false); }); }
    else if (tab === "payments") { setLoading(true); api("adminlistpayments").then(function(d) { if (d && d.ok) setPayments(d.payments || []); setLoading(false); }).catch(function() { setLoading(false); }); }
    else if (tab === "activity") { setLoading(true); api("adminauditlog").then(function(d) { if (d && d.ok) setAuditLog(d.entries || []); setLoading(false); }).catch(function() { setLoading(false); }); }
  }, [loggedIn, tab, appFilter, refreshKey]);

  function doAction(name, action, params) {
    setBusy(name);
    api(action, params).then(function(d) { 
      toast(d && d.ok ? (d.message || "Done") : ("Error: " + ((d && d.error) || "Failed")), d && d.ok); 
      setBusy(""); 
      refresh(); 
    }).catch(function() { toast("Network error", false); setBusy(""); });
  }

  function acceptApp(ref) { 
    if (confirm("Accept " + ref + "?")) {
      setApps(prev => prev.map(a => a.ref === ref ? { ...a, status: "Accepted" } : a)); 
      doAction(ref, "adminacceptapp", { ref: ref }); 
    }
  }
  function rejectApp(ref) { 
    if (confirm("Reject " + ref + "?")) {
      setApps(prev => prev.map(a => a.ref === ref ? { ...a, status: "Rejected" } : a)); 
      doAction(ref, "adminrejectapp", { ref: ref }); 
    }
  }
  function enrollStu(ref) { 
    if (confirm("Enroll " + ref + "? Credentials will be sent.")) {
      setStudents(prev => prev.map(s => s.ref === ref ? { ...s, status: "Enrolled", lmsAccess: "Yes" } : s)); 
      doAction(ref, "adminenrollstudent", { ref: ref }); 
    }
  }
  
  // ═══ UPGRADED RECORD GENERATOR ═══
  function genRecord(sn) { 
    setBusy(sn);
    api("generaterecord", { student: sn }).then(d => {
      let success = d && (d.ok || d.success);
      let link = d ? (d.url || d.fileUrl || d.link || d.pdfUrl) : null;

      if (success && link) {
        window.open(link, "_blank");
        toast("Record opened in a new tab!", true);
      } else if (success) {
        toast("Record generated successfully! (Check your Google Drive folder)", true);
      } else {
        toast("Failed to generate record: " + (d?.error || d?.message || "Unknown Error"), false);
      }
      setBusy("");
    }).catch(() => { toast("Network error.", false); setBusy(""); });
  }
  
  function rejectPay(ref) { 
    if (confirm("Reject payment for " + ref + "?")) {
      setPayments(prev => prev.map(p => p.ref === ref ? { ...p, status: "Rejected \u2014 Not Found" } : p));
      if (dashboard) setDashboard(prev => ({...prev, pendingPayments: prev.pendingPayments.filter(p => p.ref !== ref)}));
      doAction(ref, "rejectpayment", { ref: ref, txn: "admin-dashboard" }); 
    }
  }
  function verifyPay(ref, amt, txn) { 
    setPayments(prev => prev.map(p => p.ref === ref ? { ...p, status: "Paid", amount: amt } : p));
    if (dashboard) setDashboard(prev => ({...prev, pendingPayments: prev.pendingPayments.filter(p => p.ref !== ref)}));
    doAction(ref, "verifypayment", { ref: ref, amount: amt, txn: txn }); 
    setModal(null); 
  }

  async function handlePasswordSubmit() {
    if (!pw.trim()) return;
    setLoginErr(""); setLoading(true);
    try {
      const res1 = await fetch(`${VERCEL_URL}?action=verifyadminpw&pw=${encodeURIComponent(pw.trim())}`);
      const data1 = await res1.json();
      if (data1 && data1.ok) {
        setAuth(pw.trim()); 
        const res2 = await fetch(`${VERCEL_URL}?action=sendotp&identifier=ADMIN&purpose=admin_login`);
        const data2 = await res2.json();
        if (data2 && data2.success) setLoginStep(1); 
        else setLoginErr("Failed to trigger 2FA sequence.");
      } else setLoginErr("Invalid master password.");
    } catch (e) { setLoginErr("Gateway offline."); }
    setLoading(false);
  }

  async function handleOtpSubmit() {
    if (!otpCode.trim() || otpCode.length !== 6) { setLoginErr("Enter the 6-digit code."); return; }
    setLoginErr(""); setLoading(true);
    try {
      const res = await fetch(`${VERCEL_URL}?action=verifyotp&identifier=ADMIN&code=${otpCode.trim()}&purpose=admin_login`);
      const data = await res.json();
      if (data && data.success) loadDash(); 
      else { setLoginErr(data?.error === "wrong_code" ? "Invalid code." : "Code expired."); setLoading(false); }
    } catch (e) { setLoginErr("Connection error."); setLoading(false); }
  }

  function handleSort(key) {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.dir === 'asc') direction = 'desc';
    setSortConfig({ key, dir: direction });
  }

  function processData(list) {
    if (!Array.isArray(list)) return [];
    let safeList = list.filter(item => item != null && typeof item === "object");
    
    if (searchTerm) {
      let s = String(searchTerm).toLowerCase();
      safeList = safeList.filter(item => Object.values(item).some(v => String(v || "").toLowerCase().indexOf(s) >= 0));
    }
    
    if (sortConfig.key) {
      safeList.sort((a, b) => {
        let valA = a[sortConfig.key] || findDate(a);
        let valB = b[sortConfig.key] || findDate(b);
        if (sortConfig.key.toLowerCase().includes('date') || sortConfig.key.toLowerCase().includes('time') || sortConfig.key.toLowerCase().includes('timestamp')) {
          valA = new Date(valA).getTime() || 0; valB = new Date(valB).getTime() || 0;
        } else if (sortConfig.key === 'amount') {
          valA = Number(String(valA).replace(/[^0-9.-]+/g,"")) || 0; valB = Number(String(valB).replace(/[^0-9.-]+/g,"")) || 0;
        } else {
          valA = String(valA || "").toLowerCase(); valB = String(valB || "").toLowerCase();
        }
        if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return safeList;
  }

  if (!loggedIn) {
    const animStyles = `@keyframes pulseFortKnox { 0% { box-shadow: 0 0 0 0 rgba(14, 143, 139, 0.4); } 70% { box-shadow: 0 0 0 40px rgba(14, 143, 139, 0); } 100% { box-shadow: 0 0 0 0 rgba(14, 143, 139, 0); } } @keyframes floatShield { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-15px) scale(1.05); } } @keyframes blinkLight { 0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px ${C.emerald}; } 50% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px ${C.emerald}; } }`;
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
        <style>{animStyles}</style>
        <div style={{ background: C.navy, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", position: "relative", zIndex: 10, borderBottom: `2px solid ${C.gold}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><img src="/logo.jpg" alt="CTS ETS" style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${C.gold}` }} /><div><div style={{ color: C.gold, fontWeight: 900, fontSize: 26, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 4, fontWeight: 800 }}>SECURE GATEWAY</div></div></div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at center, #0a2d4d 0%, ${C.navy} 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ background: C.card, borderRadius: 24, padding: "64px 48px", maxWidth: 480, width: "100%", textAlign: "center", position: "relative", zIndex: 2, animation: "pulseFortKnox 4s infinite", border: `2px solid ${C.teal}50` }}>
            <div style={{ fontSize: 96, marginBottom: 24, animation: "floatShield 5s ease-in-out infinite" }}>🛡️</div>
            <h1 style={{ fontFamily: C.heading, color: C.navy, fontSize: 36, fontWeight: 900 }}>Identify Yourself</h1>
            {loginStep === 0 ? (
              <div style={{ marginTop: 32 }}><input type="password" value={pw} onChange={e => { setPw(e.target.value); setLoginErr(""); }} onKeyDown={e => e.key === "Enter" && handlePasswordSubmit()} autoFocus placeholder="Master Password" style={{ width: "100%", padding: "20px", borderRadius: 12, border: "2px solid " + (loginErr ? C.red : C.border), fontSize: 18, textAlign: "center", letterSpacing: 4, background: "#F8FAFC", fontWeight: 800 }} /></div>
            ) : (
              <div style={{ marginTop: 32 }}><input type="text" value={otpCode} onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setLoginErr(""); }} onKeyDown={e => e.key === "Enter" && handleOtpSubmit()} autoFocus placeholder="000000" style={{ width: "100%", padding: "20px", borderRadius: 12, border: "2px solid " + (loginErr ? C.red : C.teal), fontSize: 32, fontFamily: "monospace", textAlign: "center", letterSpacing: 12, background: C.emeraldLight, fontWeight: 900 }} /></div>
            )}
            {loginErr && <div style={{ color: C.red, fontWeight: 800, marginTop: 16 }}>{loginErr}</div>}
            <button onClick={loginStep === 0 ? handlePasswordSubmit : handleOtpSubmit} disabled={loading} style={{ width: "100%", marginTop: 24, padding: "20px", borderRadius: 12, border: "none", background: C.navy, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>{loading ? "Decrypting..." : "Access Console"}</button>
          </div>
        </div>
      </div>
    );
  }

  const tabList = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "applications", label: "Applications", icon: "📋", b: dashboard?.apps?.underReview },
    { id: "students", label: "Students", icon: "🎓" },
    { id: "payments", label: "Payments", icon: "💳", b: dashboard?.pendingPayments?.length },
    { id: "activity", label: "Activity Log", icon: "⚡" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body, width: "100vw", overflowX: "hidden" }}>
      <style>{`.sortable-th { cursor: pointer; user-select: none; } .sortable-th:hover { background: #E2E8F0 !important; }`}</style>
      
      <div style={{ background: C.navy, padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.jpg" alt="" style={{ width: 34, height: 34, borderRadius: 8 }} />
          <div><div style={{ color: C.gold, fontWeight: 700, fontSize: 15, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 1 }}>OPERATIONS COMMAND</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={refresh} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>↻ Refresh</button>
          <button onClick={() => { setLoggedIn(false); setAuth(""); setPw(""); sessionStorage.removeItem(PW_KEY); }} style={{ padding: "8px 18px", borderRadius: 8, background: C.coral, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Lock Vault</button>
        </div>
      </div>

      <div style={{ background: C.card, borderBottom: "1px solid " + C.border, padding: "0 40px", display: "flex", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        {tabList.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearchTerm(""); setSortConfig({key: "timestamp", dir: "desc"}); }} style={{ padding: "20px 28px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 800 : 600, color: tab === t.id ? C.navy : C.gray, borderBottom: tab === t.id ? `3px solid ${C.navy}` : "3px solid transparent", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
            {t.b > 0 && <span style={{ background: C.coral, color: "#fff", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{t.b}</span>}
          </button>
        ))}
      </div>

      {actionMsg && (
        <div style={{ margin: "20px 40px 0", padding: "14px 20px", borderRadius: 10, background: actionMsg.ok ? C.emeraldLight : C.redLight, color: actionMsg.ok ? C.emerald : C.red, fontSize: 15, fontWeight: 700, display: "flex", justifyContent: "space-between", border: "2px solid " + (actionMsg.ok ? C.emerald : C.red) + "40" }}>
          <span>{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "inherit" }}>✕</button>
        </div>
      )}

      {loading && <div style={{ height: 4, background: `linear-gradient(90deg, ${C.coral}, ${C.gold}, ${C.teal})`, animation: "pulse 1.5s infinite" }} />}

      <div style={{ padding: "40px", width: "100%", boxSizing: "border-box" }}>

        {tab === "dashboard" && dashboard && (<div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 48 }}>
            {[
              { l: "Total Applications", v: dashboard?.apps?.total || 0, c: C.navy, go: () => { setTab("applications"); setAppFilter(""); } },
              { l: "Awaiting Review", v: dashboard?.apps?.underReview || 0, c: C.coral, go: () => { setTab("applications"); setAppFilter("Under Review"); } },
              { l: "Active Students", v: dashboard?.enrolled?.active || 0, c: C.teal, go: () => { setTab("students"); setStudentFilter("Enrolled"); } },
              { l: "Revenue Collected", v: fmt(dashboard?.enrolled?.revenue || 0), c: C.emerald },
            ].map((s, i) => (
              <div key={i} onClick={s.go} style={{ background: "#fff", borderRadius: 24, padding: "32px", border: "1px solid " + C.border, cursor: s.go ? "pointer" : "default", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.gray, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>{s.l}</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: s.c, fontFamily: C.heading }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, borderRadius: 24, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid " + C.border, background: "#fff" }}>
              <div style={{ fontWeight: 800, color: C.navy, fontSize: 20, fontFamily: C.heading }}>Pending Bank Verifications</div>
            </div>
            {processData(dashboard?.pendingPayments).length === 0 ? <div style={{ padding: 100, textAlign: "center", color: C.grayLight, fontSize: 18, fontWeight: 600 }}>✅ Everything is clear.</div> : (
              <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>
                  <TH sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Date & Time</TH>
                  <TH sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</TH>
                  <TH sortKey="amount" currentSort={sortConfig} onSort={handleSort}>Amount</TH>
                  <TH>Notes</TH>
                  <TH>Actions</TH>
                </tr></thead>
                <tbody>{processData(dashboard?.pendingPayments).map((p, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                    <TD bold color={C.gray}>{fmtTime(p)}</TD><TD bold color={C.navy}>{p?.name}</TD>
                    <TD bold color={C.emerald}>{fmt(p?.amount)}</TD><TD color={C.gray} max={300}>{p?.notes}</TD>
                    <td style={{ padding: "16px" }}><div style={{ display: "flex", gap: 12 }}><Btn small onClick={() => { setModal({ type: "verify", data: p }); setVerifyAmt(String(p?.amount || "")); setVerifyTxn(""); }}>Verify</Btn><Btn small bg={C.redLight} color={C.red} onClick={() => rejectPay(p?.ref)}>Reject</Btn></div></td>
                  </tr>
                ))}</tbody>
              </table></div>
            )}
          </div>
        </div>)}

        {tab === "applications" && (<div>
          <div style={{ display: "flex", gap: 16, marginBottom: 32, alignItems: "center", background: "#fff", padding: "20px 32px", borderRadius: 20, border: "1px solid " + C.border }}>
            {["Under Review", "Accepted", "Pending Payment", "Rejected", ""].map(f => (
              <Pill key={f || "All"} label={f || "All"} active={appFilter === f} onClick={() => setAppFilter(f)} />
            ))}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 24, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto", maxHeight: "72vh" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <TH sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Date & Time Received</TH>
                <TH sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Ref</TH>
                <TH sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</TH>
                <TH sortKey="programme" currentSort={sortConfig} onSort={handleSort}>Programme</TH>
                <TH sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</TH>
                <TH>Operations</TH>
              </tr></thead>
              <tbody>{processData(apps).filter(a => !appFilter || a?.status === appFilter).map((a, i) => (
                <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                  <TD bold color={C.gray}>{fmtTime(a)}</TD><TD mono bold>{a?.ref}</TD><TD bold>{a?.name}</TD>
                  <TD max={400}>{a?.programme}</TD><td><Badge status={a?.status} /></td>
                  <td style={{ padding: "16px" }}><div style={{ display: "flex", gap: 12 }}>
                    {a?.status === "Under Review" && <><Btn small onClick={() => acceptApp(a.ref)} disabled={busy === a.ref}>{busy === a.ref ? "Processing..." : "Accept"}</Btn><Btn small bg={C.redLight} color={C.red} onClick={() => rejectApp(a.ref)} disabled={busy === a.ref}>Reject</Btn></>}
                    {getFolderUrl(a) && <Btn small bg={C.blueLight} color={C.blue} onClick={() => window.open(getFolderUrl(a), "_blank")}>📁 Folder</Btn>}
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>)}

        {tab === "students" && (<div>
          <div style={{ display: "flex", gap: 16, marginBottom: 32, alignItems: "center", background: "#fff", padding: "20px 32px", borderRadius: 20, border: "1px solid " + C.border }}>
            {["", "Enrolled", "Active", "Pending Payment", "On Hold"].map(f => (
              <Pill key={f || "All"} label={f || "All"} active={studentFilter === f} onClick={() => setStudentFilter(f)} />
            ))}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 24, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto", maxHeight: "72vh" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <TH sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Status Update</TH>
                <TH sortKey="studentNumber" currentSort={sortConfig} onSort={handleSort}>Student #</TH>
                <TH sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</TH>
                <TH sortKey="programme" currentSort={sortConfig} onSort={handleSort}>Programme</TH>
                <TH sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</TH>
                <TH>Student Services</TH>
              </tr></thead>
              <tbody>{processData(students).filter(s => !studentFilter || s?.status === studentFilter).map((s, i) => (
                <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                  <TD bold color={C.gray}>{fmtTime(s)}</TD><TD mono bold>{s?.studentNumber}</TD><TD bold>{s?.name}</TD>
                  <TD max={400}>{s?.programme}</TD><td><Badge status={s?.status} /></td>
                  <td style={{ padding: "16px" }}><div style={{ display: "flex", gap: 12 }}>
                    <Btn small bg={C.navy} onClick={() => genRecord(s.studentNumber)} disabled={busy === s.studentNumber}>{busy === s.studentNumber ? "Generating..." : "📄 Record"}</Btn>
                    {getFolderUrl(s) && <Btn small bg={C.blueLight} color={C.blue} onClick={() => window.open(getFolderUrl(s), "_blank")}>📁 Folder</Btn>}
                    {s?.status === "Pending Payment" && <Btn small onClick={() => enrollStu(s.ref)} disabled={busy === s.ref}>{busy === s.ref ? "Processing..." : "Force Enroll"}</Btn>}
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>)}

        {tab === "payments" && (<div>
          <div style={{ display: "flex", gap: 16, marginBottom: 32, alignItems: "center", background: "#fff", padding: "20px 32px", borderRadius: 20, border: "1px solid " + C.border }}>
            {["Pending Verification", "Paid", ""].map(f => (
              <Pill key={f || "All"} label={f || "All"} active={payFilter === f} onClick={() => setPayFilter(f)} />
            ))}
            <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
          </div>
          <div style={{ background: C.card, borderRadius: 24, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto", maxHeight: "72vh" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <TH sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Submission Time</TH>
                <TH sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Ref</TH>
                <TH sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</TH>
                <TH sortKey="amount" currentSort={sortConfig} onSort={handleSort}>Amount</TH>
                <TH sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</TH>
                <TH>Evidence</TH>
                <TH>Actions</TH>
              </tr></thead>
              <tbody>{processData(payments).filter(p => !payFilter || p?.status === payFilter).map((p, i) => (
                <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                  <TD bold color={C.gray}>{fmtTime(p)}</TD><TD mono bold>{p?.ref}</TD><TD bold>{p?.name}</TD>
                  <TD bold color={C.emerald}>{fmt(p?.amount)}</TD><td><Badge status={p?.status} /></td>
                  <TD>{p?.receipt && <a href={p.receipt} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, fontWeight: 800, textDecoration: "underline" }}>View Bank Slip</a>}</TD>
                  <td style={{ padding: "16px" }}>{p?.status === "Pending Verification" && <div style={{ display: "flex", gap: 10 }}><Btn small onClick={() => { setModal({ type: "verify", data: p }); setVerifyAmt(String(p.amount)); setVerifyTxn(""); }}>Verify</Btn><Btn small bg={C.redLight} color={C.red} onClick={() => rejectPay(p.ref)}>Reject</Btn></div>}</td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>)}

        {tab === "activity" && (<div>
          <div style={{ background: C.card, borderRadius: 24, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: C.heading, color: C.navy, fontSize: 24, margin: 0, fontWeight: 800 }}>Institutional Audit Log</h2>
              <SearchBox value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div style={{ overflowX: "auto", maxHeight: "72vh" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <TH sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Exact Time</TH>
                <TH sortKey="action" currentSort={sortConfig} onSort={handleSort}>Protocol Action</TH>
                <TH sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Entity Ref</TH>
                <TH>Details</TH>
                <TH sortKey="by" currentSort={sortConfig} onSort={handleSort}>Executed By</TH>
              </tr></thead>
              <tbody>{processData(auditLog).map((e, i) => (
                <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                  <TD bold color={C.gray}>{fmtTime(e)}</TD>
                  <TD><span style={{ padding: "6px 14px", borderRadius: 8, background: C.blueLight, color: C.blue, fontSize: 11, fontWeight: 800 }}>{e?.action}</span></TD>
                  <TD mono bold>{e?.ref}</TD><TD color={C.gray} max={500}>{e?.details}</TD><TD bold color={C.navy}>{e?.by}</TD>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>)}

      </div>

      {modal && modal.type === "verify" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#fff", borderRadius: 32, width: "100%", maxWidth: 520, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ padding: "32px", background: C.navy, color: "#fff" }}>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: C.heading }}>Verify Bank Transfer</div>
              <div style={{ fontSize: 14, color: C.gold, marginTop: 8, fontWeight: 600 }}>ID: {modal.data.ref} | User: {modal.data.name}</div>
            </div>
            <div style={{ padding: "40px" }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 12 }}>Confirmed Amount (JMD)</label>
              <input type="number" value={verifyAmt} onChange={e => setVerifyAmt(e.target.value)} style={{ width: "100%", padding: "20px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 20, fontWeight: 800, background: "#F8FAFC", marginBottom: 32 }} />
              <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 12 }}>Bank Receipt / TXN ID</label>
              <input type="text" value={verifyTxn} onChange={e => setVerifyTxn(e.target.value)} placeholder="Enter ID..." style={{ width: "100%", padding: "20px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 16, fontFamily: "monospace", background: "#F8FAFC", marginBottom: 40 }} />
              <div style={{ display: "flex", gap: 16 }}><button onClick={() => verifyPay(modal.data.ref, verifyAmt, verifyTxn)} style={{ flex: 1, padding: "20px", borderRadius: 12, border: "none", background: C.emerald, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>Confirm Verification</button><button onClick={() => setModal(null)} style={{ padding: "20px 32px", borderRadius: 12, border: "none", background: C.bg, color: C.navy, fontWeight: 800, cursor: "pointer" }}>Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;