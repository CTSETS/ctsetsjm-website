import { useState, useRef, useEffect, useCallback, useMemo } from "react";

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

// 🚀 THE UNIFIED 6-BOX OTP COMPONENT (ADMIN VERSION)
function OtpBoxes({ value, onChange, onEnter, disabled }) {
  const inputRefs = useRef([]);
  const [focused, setFocused] = useState(-1);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length > 1) { 
      const paste = val.slice(0, 6);
      onChange(paste);
      inputRefs.current[Math.min(paste.length, 5)]?.focus();
      return;
    }
    
    const currentOtp = (value || "").padEnd(6, " ").split("");
    currentOtp[idx] = val || " ";
    const newOtp = currentOtp.join("").trim();
    
    onChange(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && (!value[idx] || value[idx] === " ") && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter" && value.replace(/\s/g, "").length === 6) {
      onEnter();
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "20px 0" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const isActive = focused === i;
        const val = value[i] || "";
        const hasVal = val !== "" && val !== " ";
        const borderCol = isActive ? C.teal : hasVal ? C.gold : C.border; 
        return (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            value={val.trim()}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(-1)}
            disabled={disabled}
            style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(50px, 12vw, 60px)", fontSize: 24, fontFamily: "monospace", fontWeight: 800, textAlign: "center", borderRadius: 10, border: `2px solid ${borderCol}`, outline: "none", color: C.navy, background: "#fff", transition: "0.2s", boxShadow: isActive ? `0 0 0 3px ${C.teal}20` : "none", boxSizing: "border-box" }}
          />
        )
      })}
    </div>
  );
}

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

export default function AdminDashboardPage() {
  const [auth, setAuth] = useState(() => { try { return sessionStorage.getItem(PW_KEY) || ""; } catch { return ""; } });
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [loginStep, setLoginStep] = useState(0);
  const [otpCode, setOtpCode] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 🚀 5-minute countdown!
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

  // Countdown timer logic
  useEffect(() => {
    if (loginStep === 1 && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [loginStep, timeLeft]);

  useEffect(() => { 
    if (auth && !loggedIn) {
      setLoading(true);
      fetch(`${VERCEL_URL}?action=sendotp&identifier=ADMIN&purpose=admin_login`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            setMaskedEmail(data.maskedEmail || "your email");
            setLoginStep(1);
            setTimeLeft(300); // Reset timer
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

  async function handlePassword