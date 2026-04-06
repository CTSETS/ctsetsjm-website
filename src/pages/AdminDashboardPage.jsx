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
  var [loginStep, setLoginStep] = useState(0); // 0 = Password, 1 = 2FA OTP
  var [otpCode, setOtpCode] = useState("");
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

  // Secure API Call via Vercel Proxy
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
      if (d && d.ok) { 
        setDashboard(d); 
        setLoggedIn(true); 
        try { sessionStorage.setItem(PW_KEY, auth); } catch(e) {} 
      } else { 
        setLoginErr("Session expired. Please log in again."); 
        setLoggedIn(false); 
        setLoginStep(0); 
      }
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
    else if (tab === "activity") { setLoading(true); api("adminauditlog").then(function(d) { if (d && d.ok) { setAuditLog(d.entries || []); setLifecycleLog(d.lifecycle || []); } setLoading(false); }).catch(function() { setLoading(false); }); }
  }, [loggedIn, tab, appFilter, refreshKey]);

  function doAction(name, action, params) {
    setBusy(name);
    api(action, params).then(function(d) { toast(d && d.ok ? (d.message || "Done") : ("Error: " + ((d && d.error) || "Failed")), d && d.ok); setBusy(""); refresh(); }).catch(function() { toast("Network error", false); setBusy(""); });
  }

  function acceptApp(ref) { if (confirm("Accept " + ref + "?")) doAction(ref, "adminacceptapp", { ref: ref }); }
  function rejectApp(ref) { if (confirm("Reject " + ref + "?")) doAction(ref, "adminrejectapp", { ref: ref }); }
  function enrollStu(ref) { if (confirm("Enroll " + ref + "? Credentials will be sent.")) doAction(ref, "adminenrollstudent", { ref: ref }); }
  function genRecord(sn) { doAction(sn, "generaterecord", { student: sn }); }
  function rejectPay(ref) { if (confirm("Reject payment for " + ref + "?")) doAction(ref, "rejectpayment", { ref: ref, txn: "admin-dashboard" }); }
  function verifyPay(ref, amt, txn) { doAction(ref, "verifypayment", { ref: ref, amount: amt, txn: txn }); setModal(null); }

  // ═══ BULLETPROOF FORT KNOX 2FA LOGIN LOGIC ═══
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
        
        if (data2 && data2.success) {
          setLoginStep(1); 
        } else {
          setLoginErr("Failed to trigger 2FA sequence.");
        }
      } else {
        setLoginErr("Invalid master password. Intrusion logged.");
      }
    } catch (e) {
      setLoginErr("Connection error. Gateway offline.");
    }
    setLoading(false);
  }

  async function handleOtpSubmit() {
    if (!otpCode.trim() || otpCode.length !== 6) { setLoginErr("Enter the 6-digit code."); return; }
    setLoginErr(""); setLoading(true);
    
    try {
      const res = await fetch(`${VERCEL_URL}?action=verifyotp&identifier=ADMIN&code=${otpCode.trim()}&purpose=admin_login`);
      const data = await res.json();
      
      if (data && data.success) {
        loadDash(); 
      } else {
        setLoginErr(data?.error === "wrong_code" ? "Invalid 2FA code." : "Code expired. Refresh to try again.");
        setLoading(false);
      }
    } catch (e) {
      setLoginErr("Connection error.");
      setLoading(false);
    }
  }

  // ═══ THE INDESTRUCTIBLE FILTER ═══
  function filt(list) {
    const safeList = Array.isArray(list) ? list : [];
    if (!searchTerm) return safeList;
    var s = searchTerm.toLowerCase();
    return safeList.filter(function(item) { 
      if (!item) return false; 
      return Object.values(item).some(function(v) { 
        return String(v || "").toLowerCase().indexOf(s) >= 0; 
      }); 
    });
  }

  // ═══ FORT KNOX GATEWAY UI ═══
  if (!loggedIn) {
    const animStyles = `
      @keyframes pulseFortKnox { 0% { box-shadow: 0 0 0 0 rgba(14, 143, 139, 0.4); } 70% { box-shadow: 0 0 0 40px rgba(14, 143, 139, 0); } 100% { box-shadow: 0 0 0 0 rgba(14, 143, 139, 0); } }
      @keyframes floatShield { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-15px) scale(1.05); } }
      @keyframes blinkLight { 0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px ${C.emerald}; } 50% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px ${C.emerald}; } }
    `;

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
        <style>{animStyles}</style>

        {/* Beefed-Up Header */}
        <div style={{ background: C.navy, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", position: "relative", zIndex: 10, borderBottom: `2px solid ${C.gold}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src="/logo.jpg" alt="CTS ETS" style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${C.gold}`, boxShadow: `0 0 15px ${C.gold}40` }} />
            <div>
              <div style={{ color: C.gold, fontWeight: 900, fontSize: 26, fontFamily: C.heading, letterSpacing: 1 }}>CTS ETS Command</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 4, fontWeight: 800, marginTop: 4 }}>FORT KNOX SECURE GATEWAY</div>
            </div>
          </div>
          <a href="/#Home" style={{ color: "#fff", fontSize: 13, textDecoration: "none", fontWeight: 800, padding: "14px 28px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 1 }}>&larr; Abort Login</a>
        </div>

        {/* Main Vault Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, background: `radial-gradient(circle at center, #0a2d4d 0%, ${C.navy} 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ background: C.card, borderRadius: 24, padding: "64px 48px", maxWidth: 480, width: "100%", textAlign: "center", position: "relative", zIndex: 2, animation: "pulseFortKnox 4s infinite", border: `2px solid ${C.teal}50` }}>
            <div style={{ fontSize: 96, marginBottom: 24, animation: "floatShield 5s ease-in-out infinite", textShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>🛡️</div>
            
            <h1 style={{ fontFamily: C.heading, color: C.navy, fontSize: 36, margin: "0 0 12px", fontWeight: 900, letterSpacing: -0.5 }}>{loginStep === 0 ? "Identify Yourself" : "2FA Verification"}</h1>
            <p style={{ fontFamily: C.body, color: C.gray, fontSize: 15, margin: "0 0 40px", lineHeight: 1.6 }}>{loginStep === 0 ? "Enter master password to initiate secure handshake." : "Military-grade OTP dispatched to Commander's email. Enter to unlock vault."}</p>
            
            {loginStep === 0 ? (
              <div style={{ marginBottom: 24 }}>
                <input type="password" value={pw} onChange={e => { setPw(e.target.value); setLoginErr(""); }} onKeyDown={e => { if (e.key === "Enter") handlePasswordSubmit(); }} autoFocus placeholder="Master Password" style={{ width: "100%", padding: "20px", borderRadius: 12, border: "2px solid " + (loginErr ? C.red : C.border), fontSize: 18, fontFamily: C.body, color: C.navy, boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 4, background: "#F8FAFC", fontWeight: 800 }} />
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <input type="text" value={otpCode} onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setLoginErr(""); }} onKeyDown={e => { if (e.key === "Enter") handleOtpSubmit(); }} autoFocus placeholder="000000" style={{ width: "100%", padding: "20px", borderRadius: 12, border: "2px solid " + (loginErr ? C.red : C.teal), fontSize: 32, fontFamily: "monospace", color: C.navy, boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 12, background: C.emeraldLight, fontWeight: 900 }} />
              </div>
            )}

            {loginErr && <div style={{ padding: "14px", borderRadius: 10, background: C.redLight, color: C.red, fontSize: 14, marginBottom: 24, fontFamily: C.body, fontWeight: 800, border: `1px solid ${C.red}50` }}>{loginErr}</div>}
            
            {loginStep === 0 ? (
              <button onClick={handlePasswordSubmit} disabled={loading || !pw.trim()} style={{ width: "100%", padding: "20px", borderRadius: 12, border: "none", background: (!pw.trim() || loading) ? C.border : C.navy, color: "#fff", fontSize: 16, fontWeight: 900, cursor: pw.trim() && !loading ? "pointer" : "not-allowed", fontFamily: C.body, transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 2 }}>{loading ? "Verifying..." : "Initialize Handshake"}</button>
            ) : (
              <button onClick={handleOtpSubmit} disabled={loading || otpCode.length !== 6} style={{ width: "100%", padding: "20px", borderRadius: 12, border: "none", background: (otpCode.length !== 6 || loading) ? C.border : C.emerald, color: "#fff", fontSize: 16, fontWeight: 900, cursor: otpCode.length === 6 && !loading ? "pointer" : "not-allowed", fontFamily: C.body, transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 2, boxShadow: otpCode.length === 6 ? `0 10px