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

// Aggressively hunt for anything that looks like a date
function findDate(obj) {
  if (!obj) return null;
  // Common keys from Google Sheets
  if (obj.timestamp) return obj.timestamp;
  if (obj.Timestamp) return obj.Timestamp;
  if (obj.date) return obj.date;
  if (obj.Date) return obj.Date;
  if (obj["Date Submitted"]) return obj["Date Submitted"];
  if (obj["Timestamp"]) return obj["Timestamp"];
  
  // Last resort: search all keys
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

// Aggressively hunt for folder links
function getFolderUrl(obj) {
  if (!obj) return "";
  if (obj.folder) return obj.folder;
  if (obj.folderUrl) return obj.folderUrl;
  if (obj["Drive Folder Link"]) return obj["Drive Folder Link"];
  if (obj["Folder Link"]) return obj["Folder Link"];
  if (obj["Link"]) return obj["Link"];
  
  for (let key in obj) {
    let val = String(obj[key] || "");
    if (val.startsWith("http") && (val.includes("drive") || val.includes("folder") || val.includes("sharing"))) {
      return val;
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

function TD({ children, mono, bold, color, max }) { return <td style={{ padding: "16px", fontFamily: mono ? "monospace" : C.body, fontSize: mono ? 12 : 13, fontWeight: bold ? 700 : 500, color: color || C.text, maxWidth: max || "none", overflow: max ? "hidden" : "visible", textOverflow: max ? "ellipsis" : "clip", whiteSpace: max ? "nowrap" : "borderBottom: 1px solid " + C.border, transition: "background 0.3s" }}>{children}</td>; }
function Btn({ children, color, bg, onClick, disabled, small }) { return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "8px 14px" : "10px 18px", borderRadius: 8, border: "none", background: disabled ? C.border : (bg || C.emerald), color: disabled ? C.grayLight : (color || "#fff"), fontSize: small ? 12 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: C.body, whiteSpace: "nowrap", transition: "all 0.2s" }}>{children}</button>; }
function Pill({ label, active, onClick }) { return <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 20, border: active ? "2px solid " + C.navy : "1px solid " + C.border, background: active ? C.navy : C.card, color: active ? "#fff" : C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.body, transition: "all 0.2s", boxShadow: active ? "0 2px 8px rgba(1,30,64,0.15)" : "none" }}>{label}</button>; }
function SearchBox({ value, onChange }) { return <input value={value} onChange={function(e) { onChange(e.target.value); }} placeholder="Filter table by any keyword..." style={{ padding: "10px 16px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, width: 280, boxSizing: "border-box", fontFamily: C.body, outline: "none", transition: "0.2s", background: "#fff", fontWeight: 500 }} />; }

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
    
    // 1. Open a blank tab INSTANTLY so the browser doesn't block it
    var newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.document.write("<h2 style='font-family:sans-serif; text-align:center; margin-top:20%; color:#011E40;'>Generating Official Record for " + sn + "...<br><br>Please wait, establishing secure connection to Google Drive...</h2>");
    } else {
      toast("Warning: Your browser blocked the pop-up. We will open it in this window instead.", false);
    }

    api("generaterecord", { student: sn }).then(d => {
      let success = d && (d.ok || d.success);
      let link = d ? (d.url || d.fileUrl || d.link || d.pdfUrl) : null;

      if (success && link) {
        if (newTab) {
          newTab.location.href = link; // Redirect the loading tab to the PDF!
        } else {
          window.location.href = link; // Fallback if popups are strictly disabled
        }
        toast("Record saved to Student Folder and opened!", true);
      } else {
        if (newTab) newTab.close(); // Close the blank tab if it failed
        toast("Failed to generate record: " + (d?.error || d?.message || "Unknown Error"), false);
      }
      setBusy("");
    }).catch(() => { 
      if (newTab) newTab.close();
      toast("Network error.", false); 
      setBusy(""); 
    });
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
      } else setLoginErr("Invalid master password. Intrusion logged.");
    } catch (e) { setLoginErr("Connection error. Gateway offline."); }
    setLoading(false);
  }

  async function handleOtpSubmit() {
    if (!otpCode.trim() || otpCode.length !== 6) { setLoginErr("Enter the 6-digit code."); return; }
    setLoginErr(""); setLoading(true);
    try {
      const res = await fetch(`${VERCEL_URL}?action=verifyotp&identifier=ADMIN&code=${otpCode.trim()}&purpose=admin_login`);
      const data = await res.json();
      if (data && data.success) loadDash(); 
      else { setLoginErr(data?.error === "wrong_code" ? "Invalid 2FA code." : "Code expired. Refresh to try again."); setLoading(false); }
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

  // ═══ LOGIN UI ═══
  if (!loggedIn) {
    const animStyles = `@keyframes pulseFortKnox { 0% { box-shadow: 0 0 0 0 rgba(14, 143, 139, 0.4); } 70% { box-shadow: 0 0 0 40px rgba(14, 143, 139, 0); } 100% { box-shadow: 0 0 0 0 rgba(14, 143, 139, 0); } } @keyframes floatShield { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-15px) scale(1.05); } } @keyframes blinkLight { 0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px ${C.emerald}; } 50% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px ${C.emerald}; } }`;
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
        <style>{animStyles}</style>
        <div style={{ background: C.navy, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", position: "relative", zIndex: 10, borderBottom: `2px solid ${C.gold}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><img src="/logo.jpg" alt="CTS ETS" style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${C.gold}` }} /><div><div style={{ color: C.gold, fontWeight: 900, fontSize: 26, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 4, fontWeight: 800 }}>SECURE GATEWAY</div></div></div>
          <a href="/#Home" style={{ color: "#fff", fontSize: 13, textDecoration: "none", fontWeight: 800, padding: "14px 28px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 1 }}>&larr; Abort Login</a>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, background: `radial-gradient(circle at center, #0a2d4d 0%, ${C.navy} 100%)