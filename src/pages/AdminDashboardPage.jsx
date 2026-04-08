import { useState, useEffect, useCallback, useMemo } from "react";

const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";
const PW_KEY = "ctsAdm";

const C = {
  navy: "#011E40", gold: "#C49112", teal: "#0E8F8B", coral: "#E8634A",
  emerald: "#2E7D32", emeraldLight: "#E8F5E9", amber: "#F57F17", amberLight: "#FFF8E1",
  bg: "#F8FAFC", card: "#FFFFFF", border: "#E2E8F0", gray: "#64748B", grayLight: "#94A3B8",
  text: "#1E293B", red: "#EF4444", redLight: "#FEE2E2", blue: "#3B82F6", blueLight: "#DBEAFE",
  purple: "#8B5CF6", purpleLight: "#EDE9FE",
  heading: "'Playfair Display', Georgia, serif", body: "'DM Sans', -apple-system, sans-serif",
};

// ─── HELPER FUNCTIONS ───
function fmt(n) { return "J$" + Number(n || 0).toLocaleString(); }
function findDate(obj) {
  if (!obj) return null;
  const direct = [obj.timestamp, obj.Timestamp, obj.date, obj.Date, obj["Date Submitted"], obj["Timestamp"]].find(Boolean);
  if (direct) return direct;
  for (const key in obj) if ((key || "").toLowerCase().includes("date") || (key || "").toLowerCase().includes("time")) if (obj[key]) return obj[key];
  return null;
}
function fmtTime(d) {
  const raw = findDate(d);
  if (!raw) return "—";
  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(raw).split("T")[0];
  return date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}
function getFolderUrl(obj) {
  if (!obj) return "";
  const direct = obj.folder || obj.folderUrl || obj["Drive Folder Link"] || obj["Folder Link"] || obj.Link;
  if (direct) return direct;
  for (const key in obj) {
    const val = String(obj[key] || "");
    if (val.startsWith("http") && (val.includes("drive") || val.includes("folder") || val.includes("sharing"))) return val;
  }
  return "";
}

// ─── UI COMPONENTS ───
function StatusBadge({ status }) {
  const map = {
    "Under Review": { bg: C.amberLight, c: C.amber }, Accepted: { bg: C.emeraldLight, c: C.emerald },
    "Pending Payment": { bg: C.blueLight, c: C.blue }, Rejected: { bg: C.redLight, c: C.red },
    Withdrawn: { bg: C.purpleLight, c: C.purple }, Deferred: { bg: "#F1F5F9", c: C.gray },
    Enrolled: { bg: "#E0F7FA", c: "#00838F" }, Active: { bg: C.blueLight, c: C.blue },
    "On Hold": { bg: "#FFF3E0", c: "#E65100" }, Completed: { bg: C.emeraldLight, c: C.emerald },
    Graduated: { bg: C.amberLight, c: C.gold }, Paid: { bg: C.emeraldLight, c: C.emerald },
    "Paid in Full": { bg: C.emeraldLight, c: C.emerald }, "Partial Payment": { bg: C.amberLight, c: C.amber },
    Pending: { bg: C.amberLight, c: C.amber }, "Pending Verification": { bg: "#FFF3E0", c: "#E65100" },
    "Paid (Online)": { bg: C.emeraldLight, c: C.emerald }, "Rejected — Not Found": { bg: C.redLight, c: C.red },
    Yes: { bg: C.emeraldLight, c: C.emerald }, No: { bg: C.redLight, c: C.red }, "Evidence Submitted": { bg: C.amberLight, c: C.amber },
  };
  const s = map[status] || { bg: "#F1F5F9", c: C.gray };
  return <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 999, background: s.bg, color: s.c, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap", fontFamily: C.body, letterSpacing: 0.5 }}>{status || "—"}</span>;
}
function MetricCard({ label, value, accent = C.teal, sub }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: "24px 22px", boxShadow: "0 12px 28px rgba(15,23,42,0.04)" }}><div style={{ fontFamily: C.heading, fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 10 }}>{value}</div><div style={{ fontFamily: C.body, fontSize: 11, color: C.gray, letterSpacing: 1.6, textTransform: "uppercase", fontWeight: 800, marginBottom: 6 }}>{label}</div>{sub && <div style={{ fontFamily: C.body, fontSize: 13, color: C.gray }}>{sub}</div>}</div>;
}
function ToolbarPill({ label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 16px", borderRadius: 999, border: active ? `2px solid ${C.navy}` : `1px solid ${C.border}`, background: active ? C.navy : C.card, color: active ? "#fff" : C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.body, transition: "all 0.2s ease", display: "inline-flex", alignItems: "center", gap: 8 }}>
      {label}
      {badge !== undefined && (
        <span style={{ background: active ? "rgba(255,255,255,0.25)" : "#E2E8F0", color: active ? "#fff" : C.navy, borderRadius: 999, padding: "2px 8px", fontSize: 12, fontWeight: 800 }}>
          {badge}
        </span>
      )}
    </button>
  );
}
function SearchBox({ value, onChange, placeholder = "Filter table by any keyword..." }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14, width: 300, maxWidth: "100%", boxSizing: "border-box", fontFamily: C.body, outline: "none", background: "#fff" }} />;
}
function ActionBtn({ children, bg = C.emerald, color = "#fff", onClick, disabled, small }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "8px 14px" : "10px 18px", borderRadius: 10, border: "none", background: disabled ? C.border : bg, color: disabled ? C.grayLight : color, fontSize: small ? 12 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: C.body, whiteSpace: "nowrap" }}>{children}</button>;
}
function SortTh({ children, sortKey, currentSort, onSort }) {
  const isActive = currentSort && currentSort.key === sortKey;
  const isAsc = isActive && currentSort.dir === "asc";
  const isDesc = isActive && currentSort.dir === "desc";
  return <th onClick={sortKey ? () => onSort(sortKey) : undefined} style={{ padding: "16px", textAlign: "left", fontWeight: 800, color: isActive ? C.navy : C.gray, fontSize: 11, borderBottom: isActive ? `2px solid ${C.navy}` : `1px solid ${C.border}`, whiteSpace: "nowrap", position: "sticky", top: 0, background: isActive ? "#EEF2F7" : "#F8FAFC", zIndex: 1, textTransform: "uppercase", letterSpacing: 1, cursor: sortKey ? "pointer" : "default" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{children}{sortKey && <span style={{ display: "inline-flex", flexDirection: "column", gap: 2, opacity: isActive ? 1 : 0.25 }}><svg width="10" height="6" viewBox="0 0 10 6" fill={isAsc ? C.coral : "currentColor"}><path d="M5 0L10 6H0L5 0Z"/></svg><svg width="10" height="6" viewBox="0 0 10 6" fill={isDesc ? C.coral : "currentColor"}><path d="M5 6L0 0H10L5 6Z"/></svg></span>}</div></th>;
}
function Td({ children, mono, bold, color, max }) {
  return <td style={{ padding: "16px", fontFamily: mono ? "monospace" : C.body, fontSize: mono ? 12 : 13, fontWeight: bold ? 700 : 500, color: color || C.text, maxWidth: max || "none", overflow: max ? "hidden" : "visible", textOverflow: max ? "ellipsis" : "clip", whiteSpace: max ? "nowrap" : "normal", borderBottom: `1px solid ${C.border}` }}>{children}</td>;
}
function Tfoot({ children }) {
  return <tfoot style={{ position: "sticky", bottom: 0, zIndex: 2, background: "#EEF2F7", borderTop: `2px solid ${C.navy}` }}>{children}</tfoot>;
}
function TdFoot({ children, colSpan = 1, color = C.navy }) {
  return <td colSpan={colSpan} style={{ padding: "16px", fontFamily: C.body, fontSize: 14, fontWeight: 900, color: color, whiteSpace: "nowrap" }}>{children}</td>;
}
function TableShell({ title, tools, children }) {
  return <div style={{ background: C.card, borderRadius: 24, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 10px 26px rgba(15,23,42,0.04)" }}>{(title || tools) && <div style={{ padding: "22px 26px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 16, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>{title && <h2 style={{ fontFamily: C.heading, color: C.navy, fontSize: 24, margin: 0, fontWeight: 800 }}>{title}</h2>}{tools}</div>}<div style={{ overflowX: "auto", maxHeight: "72vh" }}>{children}</div></div>;
}

// ─── MODALS ───
function VerifyModal({ modal, verifyAmt, setVerifyAmt, verifyTxn, setVerifyTxn, onConfirm, onClose, busy }) {
  if (!modal) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div style={{ background: "#fff", borderRadius: 30, width: "100%", maxWidth: 560, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}>
        <div style={{ padding: 28, background: C.navy, color: "#fff" }}><div style={{ fontSize: 28, fontWeight: 800, fontFamily: C.heading, marginBottom: 8 }}>Verify Bank Transfer</div><div style={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>Reference: {modal.data.ref} · {modal.data.name}</div></div>
        <div style={{ padding: 30 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: C.body }}>Confirmed Amount (JMD)</label>
          <input type="number" value={verifyAmt} onChange={(e) => setVerifyAmt(e.target.value)} style={{ width: "100%", padding: 18, borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 22, fontWeight: 800, background: "#F8FAFC", marginBottom: 22, boxSizing: "border-box" }} />
          <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: C.body }}>Bank Receipt / TXN ID</label>
          <input type="text" value={verifyTxn} onChange={(e) => setVerifyTxn(e.target.value)} placeholder="Enter transaction identifier..." style={{ width: "100%", padding: 18, borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "monospace", background: "#F8FAFC", marginBottom: 30, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <ActionBtn onClick={onConfirm} disabled={!verifyAmt || !verifyTxn || busy === modal.data.ref} bg={C.emerald} color="#fff">Confirm Verification</ActionBtn>
            <ActionBtn onClick={onClose} bg={C.bg} color={C.navy}>Cancel</ActionBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditRecordModal({ editModal, onClose, onSave, busy }) {
  if (!editModal) return null;
  const { type, data } = editModal;
  const refId = type === "student" ? data.studentNumber : data.ref;
  
  const [form, setForm] = useState({
    name: data.name || "", email: data.email || "", phone: data.phone || "",
    level: data.level || "", programme: data.programme || "", status: data.status || ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const inputStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: `1px solid ${C.border}`, fontSize: 14, fontFamily: C.body, background: "#F8FAFC", marginBottom: "16px", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 800, color: C.navy, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontFamily: C.body };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 600, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.45)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 30px", background: C.navy, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 24, fontWeight: 800, fontFamily: C.heading, marginBottom: 4 }}>Edit Record</div><div style={{ fontSize: 13, color: C.gold, fontWeight: 600, fontFamily: "monospace" }}>{refId}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 30, overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Full Name</label><input name="name" value={form.name} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Email Address</label><input name="email" value={form.email} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Phone Number</label><input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Programme</label><input name="programme" value={form.programme} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Level</label><input name="level" value={form.level} onChange={handleChange} style={inputStyle} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Override Status</label><select name="status" value={form.status} onChange={handleChange} style={{...inputStyle, background: "#fff", border: `2px solid ${C.teal}`}}><option value="Under Review">Under Review</option><option value="Accepted">Accepted</option><option value="Pending Payment">Pending Payment</option><option value="Enrolled">Enrolled</option><option value="Active">Active</option><option value="On Hold">On Hold</option><option value="Completed">Completed</option><option value="Graduated">Graduated</option><option value="Withdrawn">Withdrawn</option><option value="Rejected">Rejected</option></select></div>
          </div>
        </div>
        <div style={{ padding: "20px 30px", background: "#F8FAFC", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <ActionBtn onClick={onClose} bg={C.border} color={C.gray}>Cancel</ActionBtn>
          <ActionBtn onClick={() => onSave(refId, type, form)} disabled={busy === refId} bg={C.emerald} color="#fff">{busy === refId ? "Saving..." : "Save Changes"}</ActionBtn>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD COMPONENT ───
export default function AdminDashboardPage() {
  const [auth, setAuth] = useState(() => { try { return sessionStorage.getItem(PW_KEY) || ""; } catch { return ""; } });
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [loginStep, setLoginStep] = useState(0);
  const [otpCode, setOtpCode] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("dashboard");

  const [dashboard, setDashboard] = useState(null);
  const [apps, setApps] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  const [appFilter, setAppFilter] = useState("Under Review");
  const [studentFilter, setStudentFilter] = useState("");
  const [payFilter, setPayFilter] = useState("Pending Verification");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMsg, setActionMsg] = useState(null);
  const [busy, setBusy] = useState("");
  
  const [modal, setModal] = useState(null); 
  const [editModal, setEditModal] = useState(null); 
  
  const [verifyAmt, setVerifyAmt] = useState("");
  const [verifyTxn, setVerifyTxn] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", dir: "desc" });

  const api = useCallback(async (action, params) => {
    let url = `${VERCEL_URL}?action=${action}&pw=${encodeURIComponent(auth)}`;
    if (params) for (const k in params) if (params[k] !== undefined && params[k] !== "") url += `&${k}=${encodeURIComponent(params[k])}`;
    try { 
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch(e) { 
      return { error: "Network Error: Backend Failed to Respond. " + e.message }; 
    }
  }, [auth]);

  const toast = (text, ok = true) => { setActionMsg({ text, ok }); setTimeout(() => setActionMsg(null), 6000); };
  const refresh = () => setRefreshKey((k) => k + 1);

  const loadDash = useCallback(() => {
    setLoading(true);
    api("admindashboard").then((d) => {
      if (!d || d.error || d.ok === false) {
        setLoginErr(`SERVER ERROR: ${d?.error || "Invalid response format"}`);
        setLoggedIn(false);
        setLoginStep(0);
      } else {
        setDashboard(d);
        setLoggedIn(true);
        try { sessionStorage.setItem(PW_KEY, auth); } catch {}
      }
      setLoading(false);
    }).catch((err) => { 
      setLoginErr("CONNECTION FATAL ERROR: " + err.message); 
      setLoading(false); 
    });
  }, [api, auth]);

  // Step-Up Authentication on Session Resume
  useEffect(() => { 
    if (auth && !loggedIn) {
      setLoading(true);
      fetch(`${VERCEL_URL}?action=sendotp&identifier=ADMIN&purpose=admin_login`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            setLoginStep(1);
          } else {
            setAuth("");
            setPw("");
            sessionStorage.removeItem(PW_KEY);
            setLoginStep(0);
          }
          setLoading(false);
        })
        .catch(() => { 
          setAuth("");
          setPw("");
          sessionStorage.removeItem(PW_KEY);
          setLoginStep(0);
          setLoading(false); 
        });
    } 
  }, []);
  
  useEffect(() => {
    if (!loggedIn) return;
    if (tab === "dashboard") loadDash();
    else if (tab === "applications") { setLoading(true); api("adminlistapps").then((d) => { if (d && !d.error) setApps(d.applications || []); setLoading(false); }).catch(() => setLoading(false)); }
    else if (tab === "students") { setLoading(true); api("adminliststudents").then((d) => { if (d && !d.error) setStudents(d.students || []); setLoading(false); }).catch(() => setLoading(false)); }
    else if (tab === "payments") { setLoading(true); api("adminlistpayments").then((d) => { if (d && !d.error) setPayments(d.payments || []); setLoading(false); }).catch(() => setLoading(false)); }
    else if (tab === "activity") { setLoading(true); api("adminauditlog").then((d) => { if (d && !d.error) setAuditLog(d.entries || []); setLoading(false); }).catch(() => setLoading(false)); }
  }, [loggedIn, tab, refreshKey]);

  const doAction = (name, action, params) => {
    setBusy(name);
    api(action, params).then((d) => { 
      toast(d && !d.error ? (d.message || "Done") : ("Error: " + ((d && d.error) || "Failed")), !!(d && !d.error)); 
      setBusy(""); 
      setEditModal(null);
      refresh(); 
    }).catch(() => { toast("Network error", false); setBusy(""); });
  };

  const acceptApp = (ref) => { if (window.confirm("Accept " + ref + "?")) { setApps((prev) => prev.map((a) => a.ref === ref ? { ...a, status: "Accepted" } : a)); doAction(ref, "adminacceptapp", { ref }); } };
  const rejectApp = (ref) => { if (window.confirm("Reject " + ref + "?")) { setApps((prev) => prev.map((a) => a.ref === ref ? { ...a, status: "Rejected" } : a)); doAction(ref, "adminrejectapp", { ref }); } };
  const enrollStu = (ref) => { if (window.confirm("Enroll " + ref + "? Credentials will be sent.")) { setStudents((prev) => prev.map((s) => s.ref === ref ? { ...s, status: "Enrolled", lmsAccess: "Yes" } : s)); doAction(ref, "adminenrollstudent", { ref }); } };
  const genRecord = (sn) => { setBusy(sn); api("generaterecord", { student: sn }).then((d) => { const success = d && !d.error; const link = d ? (d.url || d.fileUrl || d.link || d.pdfUrl) : null; if (success && link) { window.open(link, "_blank"); toast("Record saved to Student Folder and opened!", true); } else toast("Failed to generate record: " + (d?.error || d?.message || "Unknown Error"), false); setBusy(""); }).catch(() => { toast("Network error.", false); setBusy(""); }); };
  const rejectPay = (ref) => { if (window.confirm("Reject payment for " + ref + "?")) { setPayments((prev) => prev.map((p) => p.ref === ref ? { ...p, status: "Rejected — Not Found" } : p)); if (dashboard) setDashboard((prev) => ({ ...prev, pendingPayments: prev.pendingPayments.filter((p) => p.ref !== ref) })); doAction(ref, "rejectpayment", { ref, txn: "admin-dashboard" }); } };
  const verifyPay = (ref, amt, txn) => { setPayments((prev) => prev.map((p) => p.ref === ref ? { ...p, status: "Paid", amount: amt } : p)); if (dashboard) setDashboard((prev) => ({ ...prev, pendingPayments: prev.pendingPayments.filter((p) => p.ref !== ref) })); doAction(ref, "verifypayment", { ref, amount: amt, txn }); setModal(null); };

  const handleEditSave = (ref, type, formData) => {
    doAction(ref, "admineditrecord", { ref, type, ...formData });
    if (type === "student") setStudents(prev => prev.map(s => s.studentNumber === ref ? { ...s, ...formData } : s));
    if (type === "app") setApps(prev => prev.map(a => a.ref === ref ? { ...a, ...formData } : a));
  };

  const handleDeleteRecord = (ref, type) => {
    if (window.confirm(`🚨 DANGER: Are you absolutely sure you want to completely DELETE ${ref}? This cannot be undone.`)) {
      doAction(ref, "admindeleterecord", { ref, type });
      if (type === "student") setStudents(prev => prev.filter(s => s.studentNumber !== ref));
      if (type === "app") setApps(prev => prev.filter(a => a.ref !== ref));
    }
  };

  async function handlePasswordSubmit() {
    if (!pw.trim()) return;
    setLoginErr(""); setLoading(true);
    try {
      const data1 = await (await fetch(`${VERCEL_URL}?action=verifyadminpw&pw=${encodeURIComponent(pw.trim())}`)).json();
      if (data1 && !data1.error && data1.ok) {
        setAuth(pw.trim());
        try { sessionStorage.setItem(PW_KEY, pw.trim()); } catch {}
        const data2 = await (await fetch(`${VERCEL_URL}?action=sendotp&identifier=ADMIN&purpose=admin_login`)).json();
        if (data2 && data2.success) setLoginStep(1); else setLoginErr("Failed to trigger 2FA sequence.");
      } else setLoginErr("Invalid master password. Intrusion logged.");
    } catch { setLoginErr("Connection error. Gateway offline."); }
    setLoading(false);
  }

  async function handleOtpSubmit() {
    if (!otpCode.trim() || otpCode.length !== 6) { setLoginErr("Enter the 6-digit code."); return; }
    setLoginErr(""); setLoading(true);
    try {
      const data = await (await fetch(`${VERCEL_URL}?action=verifyotp&identifier=ADMIN&code=${otpCode.trim()}&purpose=admin_login`)).json();
      if (data && data.success) loadDash();
      else { setLoginErr(data?.error === "wrong_code" ? "Invalid 2FA code." : "Code expired. Refresh to try again."); setLoading(false); }
    } catch { setLoginErr("Connection error."); setLoading(false); }
  }

  const handleSort = (key) => { let direction = "asc"; if (sortConfig.key === key && sortConfig.dir === "asc") direction = "desc"; setSortConfig({ key, dir: direction }); };
  const processData = useCallback((list) => {
    if (!Array.isArray(list)) return [];
    let safeList = list.filter((item) => item != null && typeof item === "object");
    if (searchTerm) {
      const s = String(searchTerm).toLowerCase();
      safeList = safeList.filter((item) => Object.values(item).some((v) => String(v || "").toLowerCase().includes(s)));
    }
    if (sortConfig.key) {
      safeList.sort((a, b) => {
        let valA = a[sortConfig.key] || findDate(a);
        let valB = b[sortConfig.key] || findDate(b);
        const sk = sortConfig.key.toLowerCase();
        if (sk.includes("date") || sk.includes("time") || sk.includes("timestamp")) { valA = new Date(valA).getTime() || 0; valB = new Date(valB).getTime() || 0; }
        else if (sortConfig.key === "amount") { valA = Number(String(valA).replace(/[^0-9.-]+/g, "")) || 0; valB = Number(String(valB).replace(/[^0-9.-]+/g, "")) || 0; }
        else { valA = String(valA || "").toLowerCase(); valB = String(valB || "").toLowerCase(); }
        if (valA < valB) return sortConfig.dir === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return safeList;
  }, [searchTerm, sortConfig]);

  // 🚀 FIXED: Dynamic Tab Badges that sync exactly with the loaded data arrays
  const tabList = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "applications", label: "Applications", icon: "📋", b: apps.length > 0 ? apps.filter(a => a.status === "Under Review").length : (dashboard?.apps?.underReview || 0) },
    { id: "students", label: "Students", icon: "🎓", b: students.length > 0 ? students.length : (dashboard?.students?.total || 0) },
    { id: "payments", label: "Payments", icon: "💳", b: payments.length > 0 ? payments.filter(p => p.status === "Pending Verification").length : (dashboard?.pendingPayments?.length || 0) },
    { id: "activity", label: "Activity Log", icon: "⚡" },
  ];
  
  const appRows = useMemo(() => processData(apps).filter((a) => !appFilter || a?.status === appFilter), [apps, appFilter, processData]);
  const studentRows = useMemo(() => processData(students).filter((s) => !studentFilter || s?.status === studentFilter), [students, studentFilter, processData]);
  const paymentRows = useMemo(() => processData(payments).filter((p) => !payFilter || p?.status === payFilter), [payments, payFilter, processData]);
  const activityRows = useMemo(() => processData(auditLog), [auditLog, processData]);

  const totalPaymentSum = paymentRows.reduce((sum, p) => sum + (Number(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0), 0);

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: `radial-gradient(circle at center, #0a2d4d 0%, ${C.navy} 100%)`, display: "flex", flexDirection: "column", fontFamily: C.body }}>
        <div style={{ background: C.navy, padding: "18px 34px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${C.gold}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/logo.jpg" alt="CTS ETS" style={{ width: 52, height: 52, borderRadius: 12, border: `2px solid ${C.gold}` }} />
            <div><div style={{ color: C.gold, fontWeight: 900, fontSize: 24, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 3, fontWeight: 800 }}>SECURE OPERATIONS GATEWAY</div></div>
          </div>
          <a href="/#Home" style={{ color: "#fff", fontSize: 13, textDecoration: "none", fontWeight: 800, padding: "12px 22px", borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>← Return to Site</a>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: C.card, borderRadius: 28, padding: "56px 42px", maxWidth: 500, width: "100%", textAlign: "center", border: `1px solid ${C.teal}40`, boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ fontSize: 82, marginBottom: 20 }}>🛡️</div>
            <div style={{ fontSize: 11, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800, fontFamily: C.body, marginBottom: 12 }}>{loginStep === 0 ? "Step 1 of 2" : "Step 2 of 2"}</div>
            <h1 style={{ fontFamily: C.heading, color: C.navy, fontSize: 36, fontWeight: 900, marginBottom: 12 }}>{loginStep === 0 ? "Admin Password" : "Two-Factor Code"}</h1>
            <p style={{ color: C.gray, fontSize: 14, lineHeight: 1.75, marginBottom: 24, fontFamily: C.body }}>{loginStep === 0 ? "Enter the master password to initiate the secure login sequence." : "Enter the 6-digit verification code sent for admin access."}</p>
            {loginStep === 0 ? <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setLoginErr(""); }} onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()} autoFocus placeholder="Master Password" style={{ width: "100%", padding: "18px 20px", borderRadius: 14, border: `2px solid ${loginErr ? C.red : C.border}`, fontSize: 18, textAlign: "center", letterSpacing: 3, background: "#F8FAFC", fontWeight: 800, boxSizing: "border-box", marginBottom: 18 }} /> : <input type="text" value={otpCode} onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setLoginErr(""); }} onKeyDown={(e) => e.key === "Enter" && handleOtpSubmit()} autoFocus placeholder="000000" style={{ width: "100%", padding: "18px 20px", borderRadius: 14, border: `2px solid ${loginErr ? C.red : C.teal}`, fontSize: 30, fontFamily: "monospace", textAlign: "center", letterSpacing: 10, background: C.emeraldLight, fontWeight: 900, boxSizing: "border-box", marginBottom: 18 }} />}
            {loginErr && <div style={{ color: C.red, fontWeight: 800, marginBottom: 16, fontFamily: C.body, whiteSpace: "pre-wrap", textAlign: "left", padding: 12, background: C.redLight, borderRadius: 8 }}>{loginErr}</div>}
            <button onClick={loginStep === 0 ? handlePasswordSubmit : handleOtpSubmit} disabled={loading} style={{ width: "100%", padding: "18px", borderRadius: 14, border: "none", background: C.navy, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: C.body }}>{loading ? "Authenticating..." : "Access Console"}</button>
            {loginStep === 1 && (
              <button onClick={() => { setLoginStep(0); setAuth(""); setPw(""); setOtpCode(""); setLoginErr(""); sessionStorage.removeItem(PW_KEY); }} style={{ marginTop: 20, background: "none", border: "none", color: C.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.body, textDecoration: "underline" }}>
                Cancel & Return
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.body, width: "100%", overflowX: "hidden" }}>
      <VerifyModal modal={modal} verifyAmt={verifyAmt} setVerifyAmt={setVerifyAmt} verifyTxn={verifyTxn} setVerifyTxn={setVerifyTxn} onConfirm={() => verifyPay(modal.data.ref, verifyAmt, verifyTxn)} onClose={() => setModal(null)} busy={busy} />
      <EditRecordModal editModal={editModal} onClose={() => setEditModal(null)} onSave={handleEditSave} busy={busy} />

      <div style={{ background: C.navy, padding: "14px 34px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.jpg" alt="" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <div><div style={{ color: C.gold, fontWeight: 700, fontSize: 15, fontFamily: C.heading }}>CTS ETS Admin</div><div style={{ color: "rgba(255,255,255,0.54)", fontSize: 10, letterSpacing: 1.3 }}>OPERATIONS COMMAND</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <ActionBtn onClick={refresh} bg="transparent" color="#fff">↻ Refresh</ActionBtn>
          <ActionBtn onClick={() => { setLoggedIn(false); setAuth(""); setPw(""); sessionStorage.removeItem(PW_KEY); }} bg={C.coral} color="#fff">Lock Vault</ActionBtn>
        </div>
      </div>

      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 34px", display: "flex", overflowX: "auto" }}>
        {tabList.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearchTerm(""); setSortConfig({ key: "timestamp", dir: "desc" }); }} style={{ padding: "18px 24px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 800 : 600, color: tab === t.id ? C.navy : C.gray, borderBottom: tab === t.id ? `3px solid ${C.navy}` : "3px solid transparent", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
            {t.b !== undefined && <span style={{ background: tab === t.id ? "rgba(14, 143, 139, 0.15)" : C.coral, color: tab === t.id ? C.teal : "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{t.b}</span>}
          </button>
        ))}
      </div>

      {actionMsg && <div style={{ margin: "18px 34px 0", padding: "14px 18px", borderRadius: 12, background: actionMsg.ok ? C.emeraldLight : C.redLight, color: actionMsg.ok ? C.emerald : C.red, fontSize: 14, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, border: `1px solid ${actionMsg.ok ? C.emerald : C.red}40` }}><span>{actionMsg.text}</span><button onClick={() => setActionMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "inherit" }}>✕</button></div>}
      {loading && <div style={{ height: 4, background: `linear-gradient(90deg, ${C.coral}, ${C.gold}, ${C.teal})` }} />}

      <div style={{ padding: 34, width: "100%", boxSizing: "border-box" }}>
        {tab === "dashboard" && dashboard && (
          <div>
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 11, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800, marginBottom: 10 }}>Control Centre</div>
              <h1 style={{ fontFamily: C.heading, fontSize: "clamp(30px,4vw,48px)", color: C.navy, margin: 0, lineHeight: 1.08, fontWeight: 900 }}>A clearer operational dashboard for CTS ETS</h1>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 30 }}>
              <MetricCard label="Under Review" value={dashboard?.apps?.underReview || 0} accent={C.amber} sub="Pending application decisions" />
              <MetricCard label="Accepted" value={dashboard?.apps?.accepted || 0} accent={C.emerald} sub="Ready for enrolment/payment" />
              <MetricCard label="Students" value={dashboard?.students?.total || 0} accent={C.teal} sub="Tracked in the student registry" />
              <MetricCard label="Pending Payments" value={dashboard?.pendingPayments?.length || 0} accent={C.coral} sub="Awaiting verification" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 20 }}>
              <TableShell title="Recent Applications Requiring Attention" tools={<ActionBtn onClick={() => setTab("applications")} bg={C.navy} color="#fff">Open Applications</ActionBtn>}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  {/* 🚀 ADDED INDEX '#' COLUMN HEADER */}
                  <thead><tr><SortTh>#</SortTh><SortTh sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Submitted</SortTh><SortTh sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Reference</SortTh><SortTh sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</SortTh><SortTh sortKey="programme" currentSort={sortConfig} onSort={handleSort}>Programme</SortTh><SortTh sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</SortTh></tr></thead>
                  {/* 🚀 ADDED INDEX '#' ROW NUMBER */}
                  <tbody>{(dashboard?.recentApps || []).map((a, i) => <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}><Td bold color={C.grayLight}>{i + 1}</Td><Td bold color={C.gray}>{fmtTime(a)}</Td><Td mono bold>{a?.ref}</Td><Td bold>{a?.name}</Td><Td max={250}>{a?.programme}</Td><td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}><StatusBadge status={a?.status} /></td></tr>)}</tbody>
                  <Tfoot>
                    <tr><TdFoot colSpan={6}>Total Recent Items: {(dashboard?.recentApps || []).length}</TdFoot></tr>
                  </Tfoot>
                </table>
              </TableShell>
              <div style={{ display: "grid", gap: 20 }}>
                <div style={{ background: C.card, borderRadius: 24, border: `1px solid ${C.border}`, padding: 24, boxShadow: "0 10px 26px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontFamily: C.heading, fontSize: 24, color: C.navy, fontWeight: 800, marginBottom: 16 }}>Finance Snapshot</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: C.gray }}>Pending Verification</span><strong style={{ color: C.coral }}>{dashboard?.pendingPayments?.length || 0}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: C.gray }}>Registered Students</span><strong style={{ color: C.navy }}>{dashboard?.students?.total || 0}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: C.gray }}>Active Learners</span><strong style={{ color: C.teal }}>{dashboard?.students?.active || 0}</strong></div>
                  </div>
                </div>
                <div style={{ background: C.card, borderRadius: 24, border: `1px solid ${C.border}`, padding: 24, boxShadow: "0 10px 26px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontFamily: C.heading, fontSize: 24, color: C.navy, fontWeight: 800, marginBottom: 16 }}>Priority Actions</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <ActionBtn onClick={() => setTab("applications")} bg={C.gold} color={C.navy}>Review Applications</ActionBtn>
                    <ActionBtn onClick={() => setTab("payments")} bg={C.coral} color="#fff">Verify Payments</ActionBtn>
                    <ActionBtn onClick={() => setTab("students")} bg={C.teal} color="#fff">Open Student Registry</ActionBtn>
                    <ActionBtn onClick={() => setTab("activity")} bg={C.blue} color="#fff">View Audit Log</ActionBtn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "applications" && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "center", background: "#fff", padding: "18px 22px", borderRadius: 18, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
              {["Under Review", "Accepted", "Rejected", ""].map((f) => {
                const count = f === "" ? apps.length : apps.filter(a => a.status === f).length;
                return <ToolbarPill key={f || "All"} label={f || "All"} active={appFilter === f} onClick={() => setAppFilter(f)} badge={count} />;
              })}
              <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
            </div>
            <TableShell title="Applications Queue">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                {/* 🚀 ADDED INDEX '#' COLUMN HEADER */}
                <thead><tr>
                  <SortTh>#</SortTh>
                  <SortTh sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Submitted</SortTh>
                  <SortTh sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Ref</SortTh>
                  <SortTh sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</SortTh>
                  <SortTh sortKey="email" currentSort={sortConfig} onSort={handleSort}>Email</SortTh>
                  <SortTh sortKey="phone" currentSort={sortConfig} onSort={handleSort}>Phone</SortTh>
                  <SortTh sortKey="level" currentSort={sortConfig} onSort={handleSort}>Level</SortTh>
                  <SortTh sortKey="programme" currentSort={sortConfig} onSort={handleSort}>Programme</SortTh>
                  <SortTh sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</SortTh>
                  <SortTh>Actions</SortTh>
                </tr></thead>
                {/* 🚀 ADDED INDEX '#' ROW NUMBER */}
                <tbody>
                  {appRows.map((a, i) => (
                    <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff", opacity: busy === a.ref ? 0.5 : 1 }}>
                      <Td bold color={C.grayLight}>{i + 1}</Td>
                      <Td bold color={C.gray}>{fmtTime(a)}</Td>
                      <Td mono bold>{a?.ref}</Td>
                      <Td bold>{a?.name}</Td>
                      <Td max={180}>{a?.email || "—"}</Td>
                      <Td mono>{a?.phone || "—"}</Td>
                      <Td max={150}>{a?.level || "—"}</Td>
                      <Td max={200}>{a?.programme}</Td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}><StatusBadge status={a?.status} /></td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {a?.status === "Under Review" && <ActionBtn small onClick={() => acceptApp(a.ref)} disabled={busy === a.ref} bg={C.emerald}>Accept</ActionBtn>}
                          {getFolderUrl(a) && <ActionBtn small onClick={() => window.open(getFolderUrl(a), "_blank")} bg={C.blueLight} color={C.blue}>📁</ActionBtn>}
                          <ActionBtn small onClick={() => setEditModal({ type: "app", data: a })} disabled={busy === a.ref} bg={C.amberLight} color={C.amberDark}>✏️ Edit</ActionBtn>
                          <ActionBtn small onClick={() => handleDeleteRecord(a.ref, "app")} disabled={busy === a.ref} bg={C.redLight} color={C.red}>🗑️</ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <Tfoot>
                  <tr>
                    <TdFoot colSpan={10}>Total Listed Applications: {appRows.length}</TdFoot>
                  </tr>
                </Tfoot>
              </table>
            </TableShell>
          </div>
        )}

        {tab === "students" && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "center", background: "#fff", padding: "18px 22px", borderRadius: 18, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
              {["", "Enrolled", "Active", "Pending Payment", "On Hold"].map((f) => {
                const count = f === "" ? students.length : students.filter(s => s.status === f).length;
                return <ToolbarPill key={f || "All"} label={f || "All"} active={studentFilter === f} onClick={() => setStudentFilter(f)} badge={count} />;
              })}
              <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
            </div>
            <TableShell title="Student Registry">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                {/* 🚀 ADDED INDEX '#' COLUMN HEADER */}
                <thead><tr>
                  <SortTh>#</SortTh>
                  <SortTh sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Status Update</SortTh>
                  <SortTh sortKey="studentNumber" currentSort={sortConfig} onSort={handleSort}>Student #</SortTh>
                  <SortTh sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</SortTh>
                  <SortTh sortKey="email" currentSort={sortConfig} onSort={handleSort}>Email</SortTh>
                  <SortTh sortKey="phone" currentSort={sortConfig} onSort={handleSort}>Phone</SortTh>
                  <SortTh sortKey="level" currentSort={sortConfig} onSort={handleSort}>Level</SortTh>
                  <SortTh sortKey="programme" currentSort={sortConfig} onSort={handleSort}>Programme</SortTh>
                  <SortTh sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</SortTh>
                  <SortTh>Services</SortTh>
                </tr></thead>
                {/* 🚀 ADDED INDEX '#' ROW NUMBER */}
                <tbody>
                  {studentRows.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff", opacity: busy === s.studentNumber ? 0.5 : 1 }}>
                      <Td bold color={C.grayLight}>{i + 1}</Td>
                      <Td bold color={C.gray}>{fmtTime(s)}</Td>
                      <Td mono bold>{s?.studentNumber}</Td>
                      <Td bold>{s?.name}</Td>
                      <Td max={180}>{s?.email || "—"}</Td>
                      <Td mono>{s?.phone || "—"}</Td>
                      <Td max={150}>{s?.level || "—"}</Td>
                      <Td max={200}>{s?.programme}</Td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}><StatusBadge status={s?.status} /></td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <ActionBtn small onClick={() => genRecord(s.studentNumber)} disabled={busy === s.studentNumber} bg={C.navy}>📄</ActionBtn>
                          {getFolderUrl(s) && <ActionBtn small onClick={() => window.open(getFolderUrl(s), "_blank")} bg={C.blueLight} color={C.blue}>📁</ActionBtn>}
                          <ActionBtn small onClick={() => setEditModal({ type: "student", data: s })} disabled={busy === s.studentNumber} bg={C.amberLight} color={C.amberDark}>✏️ Edit</ActionBtn>
                          <ActionBtn small onClick={() => handleDeleteRecord(s.studentNumber, "student")} disabled={busy === s.studentNumber} bg={C.redLight} color={C.red}>🗑️</ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <Tfoot>
                  <tr>
                    <TdFoot colSpan={10}>Total Listed Students: {studentRows.length}</TdFoot>
                  </tr>
                </Tfoot>
              </table>
            </TableShell>
          </div>
        )}

        {tab === "payments" && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "center", background: "#fff", padding: "18px 22px", borderRadius: 18, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
              {["Pending Verification", "Paid", ""].map((f) => {
                const count = f === "" ? payments.length : payments.filter(p => p.status === f).length;
                return <ToolbarPill key={f || "All"} label={f || "All"} active={payFilter === f} onClick={() => setPayFilter(f)} badge={count} />;
              })}
              <div style={{ marginLeft: "auto" }}><SearchBox value={searchTerm} onChange={setSearchTerm} /></div>
            </div>
            <TableShell title="Payments Queue">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                {/* 🚀 ADDED INDEX '#' COLUMN HEADER */}
                <thead><tr>
                  <SortTh>#</SortTh>
                  <SortTh sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Submission Time</SortTh>
                  <SortTh sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Reference</SortTh>
                  <SortTh sortKey="name" currentSort={sortConfig} onSort={handleSort}>Name</SortTh>
                  <SortTh sortKey="amount" currentSort={sortConfig} onSort={handleSort}>Amount</SortTh>
                  <SortTh sortKey="status" currentSort={sortConfig} onSort={handleSort}>Status</SortTh>
                  <SortTh>Evidence</SortTh>
                  <SortTh>Actions</SortTh>
                </tr></thead>
                {/* 🚀 ADDED INDEX '#' ROW NUMBER */}
                <tbody>
                  {paymentRows.map((p, i) => (
                    <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                      <Td bold color={C.grayLight}>{i + 1}</Td>
                      <Td bold color={C.gray}>{fmtTime(p)}</Td>
                      <Td mono bold>{p?.ref}</Td>
                      <Td bold>{p?.name}</Td>
                      <Td bold color={C.emerald}>{fmt(p?.amount)}</Td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}><StatusBadge status={p?.status} /></td>
                      <Td>{p?.receipt ? <a href={p.receipt} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, fontWeight: 800, textDecoration: "underline" }}>View Bank Slip</a> : <span style={{ color: C.grayLight, fontSize: 12 }}>No Slip</span>}</Td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                        {p?.status === "Pending Verification" && (
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <ActionBtn small onClick={() => { setModal({ type: "verify", data: p }); setVerifyAmt(String(p.amount)); setVerifyTxn(""); }} disabled={busy === p.ref} bg={C.emerald}>Verify</ActionBtn>
                            <ActionBtn small onClick={() => rejectPay(p.ref)} disabled={busy === p.ref} bg={C.redLight} color={C.red}>Reject</ActionBtn>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <Tfoot>
                  <tr>
                    <TdFoot colSpan={4}>Total Listed Transactions: {paymentRows.length}</TdFoot>
                    <TdFoot color={C.emerald}>{fmt(totalPaymentSum)}</TdFoot>
                    <TdFoot colSpan={3}></TdFoot>
                  </tr>
                </Tfoot>
              </table>
            </TableShell>
          </div>
        )}

        {tab === "activity" && (
          <TableShell title="Institutional Audit Log" tools={<SearchBox value={searchTerm} onChange={setSearchTerm} />}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {/* 🚀 ADDED INDEX '#' COLUMN HEADER */}
              <thead><tr>
                <SortTh>#</SortTh>
                <SortTh sortKey="timestamp" currentSort={sortConfig} onSort={handleSort}>Exact Time</SortTh>
                <SortTh sortKey="action" currentSort={sortConfig} onSort={handleSort}>Protocol Action</SortTh>
                <SortTh sortKey="ref" currentSort={sortConfig} onSort={handleSort}>Entity Ref</SortTh>
                <SortTh>Details</SortTh>
                <SortTh sortKey="by" currentSort={sortConfig} onSort={handleSort}>Executed By</SortTh>
              </tr></thead>
              {/* 🚀 ADDED INDEX '#' ROW NUMBER */}
              <tbody>
                {activityRows.map((e, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                    <Td bold color={C.grayLight}>{i + 1}</Td>
                    <Td bold color={C.gray}>{fmtTime(e)}</Td>
                    <Td><span style={{ padding: "6px 12px", borderRadius: 8, background: C.blueLight, color: C.blue, fontSize: 11, fontWeight: 800 }}>{e?.action}</span></Td>
                    <Td mono bold>{e?.ref}</Td>
                    <Td color={C.gray} max={500}>{e?.details}</Td>
                    <Td bold color={C.navy}>{e?.by}</Td>
                  </tr>
                ))}
              </tbody>
              <Tfoot>
                <tr>
                  <TdFoot colSpan={6}>Total Logged Events: {activityRows.length}</TdFoot>
                </tr>
              </Tfoot>
            </table>
          </TableShell>
        )}
      </div>

    </div>
  );
}