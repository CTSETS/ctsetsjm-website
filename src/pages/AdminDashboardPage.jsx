import React, { useState, useEffect, useCallback } from "react";
import S from "../constants/styles";
import FeedbackDashboard from "../components/FeedbackDashboard";

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
  body: "'Inter', 'DM Sans', sans-serif",
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

export default function AdminDashboardPage() {
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
  var [refreshKey, setRefreshKey] = useState(0);
  var [actionMsg, setActionMsg] = useState(null);
  var [modal, setModal] = useState(null);

  var api = useCallback(async function(action, params) {
    let url = `${VERCEL_URL}?action=${action}&akey=${encodeURIComponent(auth)}`;
    if (params) {
      for (let k in params) { if (params[k] !== undefined && params[k] !== "") url += `&${k}=${encodeURIComponent(params[k])}`; }
    }
    const response = await fetch(url);
    return response.json();
  }, [auth]);

  function toast(text, ok) { setActionMsg({ text: text, ok: ok !== false }); setTimeout(function() { setActionMsg(null); }, 6000); }
  function refresh() { setRefreshKey(function(k) { return k + 1; }); }

  function handleLogin() {
    if (!pw.trim()) return;
    setLoginErr(""); setLoading(true);
    fetch(`${VERCEL_URL}?action=admindashboard&akey=${encodeURIComponent(pw.trim())}`)
      .then(r => r.json()).then(d => {
        if (d.ok) { setDashboard(d); setLoggedIn(true); setAuth(pw.trim()); sessionStorage.setItem(PW_KEY, pw.trim()); }
        else setLoginErr("Invalid password");
        setLoading(false);
    }).catch(() => { setLoginErr("Connection error"); setLoading(false); });
  }

  useEffect(() => { if (auth) handleLogin(); }, []);

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: C.card, borderRadius: 20, padding: "48px 40px", maxWidth: 400, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", textAlign: "center" }}>
          <h1 style={{ fontFamily: C.heading, color: C.navy, fontSize: 26, margin: "0 0 32px", fontWeight: 700 }}>Admin Console</h1>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Password" style={{ width: "100%", padding: "16px", borderRadius: 10, border: "2px solid " + C.border, marginBottom: 20, textAlign: "center" }} />
          <button onClick={handleLogin} style={{ width: "100%", padding: 16, borderRadius: 10, background: C.coral, color: "#fff", fontWeight: 700, cursor: "pointer", border: "none" }}>{loading ? "Loading..." : "Access Console"}</button>
          {loginErr && <p style={{ color: C.red, marginTop: 12 }}>{loginErr}</p>}
        </div>
      </div>
    );
  }

  var tabList = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "applications", label: "Applications", icon: "📋" },
    { id: "students", label: "Students", icon: "🎓" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "feedback", label: "Feedback", icon: "⭐" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body }}>
      <div style={{ background: C.navy, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        <span style={{ fontWeight: 700 }}>CTS ETS Admin</span>
        <Btn bg={C.coral} onClick={() => { setLoggedIn(false); sessionStorage.removeItem(PW_KEY); }}>Log Out</Btn>
      </div>

      <div style={{ background: C.card, borderBottom: "1px solid " + C.border, display: "flex", overflowX: "auto" }}>
        {tabList.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.navy : C.gray, borderBottom: tab === t.id ? "3px solid " + C.navy : "none" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        {tab === "dashboard" && dashboard && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid " + C.border }}>
              <div style={{ fontSize: 12, color: C.gray }}>TOTAL APPLICATIONS</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>{dashboard.apps.total}</div>
            </div>
            {/* Add more dashboard tiles here as needed */}
          </div>
        )}

        {tab === "feedback" && <FeedbackDashboard auth={auth} />}

        {(tab !== "dashboard" && tab !== "feedback") && (
          <div style={{ background: C.card, borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <h3 style={{ color: C.navy, fontSize: "20px", marginBottom: "10px" }}>Module Loading</h3>
            <p style={{ color: C.gray, fontSize: "15px" }}>The {tab} module is currently being populated...</p>
          </div>
        )}
      </div>
    </div>
  );
}