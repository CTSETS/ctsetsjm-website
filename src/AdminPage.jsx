import { useState, useEffect, useCallback } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config";
import { fmt } from "../utils/formatting";

// ═══════════════════════════════════════════════════════════════════
// CTS ETS ADMIN PANEL — Full Management Console
// Access: #admin → PIN + 2FA → 20-min session timeout
// ═══════════════════════════════════════════════════════════════════

var ADMIN_TABS = [
  { id: "dashboard", icon: "\uD83D\uDCCA", label: "Dashboard" },
  { id: "applications", icon: "\uD83D\uDCE5", label: "Applications" },
  { id: "students", icon: "\uD83D\uDC65", label: "Students" },
  { id: "cohorts", icon: "\uD83D\uDCCB", label: "Cohorts" },
  { id: "lms", icon: "\uD83D\uDCDA", label: "LMS Content" },
  { id: "assessments", icon: "\uD83D\uDCDD", label: "Assessments" },
  { id: "results", icon: "\uD83C\uDFC6", label: "Results & Reports" },
  { id: "finance", icon: "\uD83D\uDCB0", label: "Finance" },
  { id: "announcements", icon: "\uD83D\uDCE2", label: "Announcements" },
  { id: "certificates", icon: "\uD83C\uDF93", label: "Certificates" },
  { id: "comms", icon: "\uD83D\uDCE7", label: "Communications" },
  { id: "audit", icon: "\uD83D\uDD12", label: "Audit Log" },
];

// ─── ADMIN LOGIN (PIN + OTP) ───
function AdminLogin({ onLogin }) {
  var [step, setStep] = useState("pin");
  var [pin, setPin] = useState("");
  var [otp, setOtp] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");

  var submitPin = async function() {
    if (!pin.trim()) return;
    setLoading(true); setError("");
    try {
      var res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "adminLogin", pin: pin.trim() }) });
      var data = await res.json();
      if (data.ok) { setStep("otp"); setError(""); }
      else setError(data.error || "Invalid PIN.");
    } catch(e) { setError("Connection error."); }
    setLoading(false);
  };

  var submitOtp = async function() {
    if (!otp.trim()) return;
    setLoading(true); setError("");
    try {
      var res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "adminVerifyOtp", otp: otp.trim() }) });
      var data = await res.json();
      if (data.ok) { onLogin(data.token || "authenticated"); }
      else setError(data.error || "Invalid OTP.");
    } catch(e) { setError("Connection error."); }
    setLoading(false);
  };

  var iStyle = { width: "100%", padding: "14px 18px", borderRadius: 10, border: "2px solid " + S.border, fontSize: 16, fontFamily: S.body, color: S.navy, fontWeight: 700, outline: "none", boxSizing: "border-box", textAlign: "center", letterSpacing: step === "otp" ? 8 : 4 };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0B1120 0%, #1E293B 50%, #0B1120 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDD10"}</div>
        <h1 style={{ fontFamily: S.heading, fontSize: 24, color: "#fff", fontWeight: 700, marginBottom: 4 }}>Admin Console</h1>
        <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>CTS ETS Management Panel</p>

        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px" }}>
          {step === "pin" ? (
            <div>
              <h3 style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.navy, marginBottom: 6 }}>Enter Admin PIN</h3>
              <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginBottom: 20 }}>Enter your admin PIN to begin authentication.</p>
              <input type="password" value={pin} onChange={function(e) { setPin(e.target.value); setError(""); }} onKeyDown={function(e) { if (e.key === "Enter") submitPin(); }} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" style={iStyle} autoFocus />
            </div>
          ) : (
            <div>
              <h3 style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.navy, marginBottom: 6 }}>Two-Factor Verification</h3>
              <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginBottom: 20 }}>A verification code has been sent to the admin email.</p>
              <input type="text" value={otp} onChange={function(e) { setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6)); setError(""); }} onKeyDown={function(e) { if (e.key === "Enter") submitOtp(); }} placeholder="000000" maxLength={6} style={iStyle} autoFocus />
            </div>
          )}
          {error && <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: S.roseLight, border: "1px solid " + S.rose + "30", fontSize: 12, color: S.roseDark, fontFamily: S.body }}>{error}</div>}
          <button onClick={step === "pin" ? submitPin : submitOtp} disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: S.navy, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: S.body, marginTop: 16 }}>
            {loading ? "Verifying..." : step === "pin" ? "Continue" : "Verify & Enter"}
          </button>
          {step === "otp" && <button onClick={function() { setStep("pin"); setOtp(""); setError(""); }} style={{ background: "none", border: "none", color: S.gray, fontSize: 12, cursor: "pointer", fontFamily: S.body, marginTop: 12 }}>Back</button>}
        </div>
      </div>
    </div>
  );
}

// ─── TAB NAV ───
function AdminTabNav({ activeTab, setActiveTab }) {
  return (
    <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 4, marginBottom: 24, borderBottom: "1px solid " + S.border }}>
      {ADMIN_TABS.map(function(t) {
        var a = activeTab === t.id;
        return <button key={t.id} onClick={function() { setActiveTab(t.id); }} style={{ padding: "10px 14px", borderRadius: "8px 8px 0 0", border: "none", borderBottom: a ? "3px solid " + S.coral : "3px solid transparent", background: a ? S.coralLight : "transparent", color: a ? S.coralDark : S.gray, fontSize: 11, fontWeight: a ? 700 : 500, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}><span style={{ fontSize: 13 }}>{t.icon}</span>{t.label}</button>;
      })}
    </div>
  );
}

// ─── HELPER: Data table ───
function DataTable({ columns, rows, emptyMsg }) {
  if (!rows || rows.length === 0) return <div style={{ padding: "32px", textAlign: "center", color: S.grayLight, fontFamily: S.body, fontSize: 13 }}>{emptyMsg || "No data."}</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 12 }}>
        <thead><tr style={{ background: S.lightBg }}>{columns.map(function(c) { return <th key={c.key || c.label} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: S.navy, fontSize: 11, borderBottom: "2px solid " + S.border, whiteSpace: "nowrap" }}>{c.label}</th>; })}</tr></thead>
        <tbody>{rows.map(function(row, ri) { return <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : S.lightBg }}>{columns.map(function(c) { return <td key={c.key || c.label} style={{ padding: "10px 12px", borderBottom: "1px solid " + S.border, color: S.navy, maxWidth: c.maxWidth || "auto", overflow: "hidden", textOverflow: "ellipsis" }}>{c.render ? c.render(row) : (row[c.key] || "\u2014")}</td>; })}</tr>; })}</tbody>
      </table>
    </div>
  );
}

// ─── HELPER: Stat card ───
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "18px 16px", border: "1px solid " + S.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: (color || S.navy) + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon || "\uD83D\uDCCA"}</div>
        <span style={{ fontSize: 10, color: S.gray, fontFamily: S.body, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontFamily: S.heading, fontSize: 26, fontWeight: 800, color: color || S.navy }}>{value}</div>
    </div>
  );
}

// ─── HELPER: Section card ───
function Card({ title, icon, color, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border, marginBottom: 20 }}>
      {title && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>{icon && <span style={{ fontSize: 18 }}>{icon}</span>}<span style={{ fontSize: 10, color: color || S.navy, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>{title}</span></div>}
      {children}
    </div>
  );
}

// ─── HELPER: Generic fetch ───
function useAdminFetch(action, token, deps) {
  var [data, setData] = useState(null);
  var [loading, setLoading] = useState(true);
  var refresh = useCallback(async function() {
    setLoading(true);
    try {
      var res = await fetch(APPS_SCRIPT_URL + "?action=" + action + "&token=" + encodeURIComponent(token));
      var d = await res.json();
      setData(d);
    } catch(e) { console.error("Admin fetch error:", action, e); }
    setLoading(false);
  }, [action, token]);
  useEffect(function() { refresh(); }, deps || []);
  return { data: data, loading: loading, refresh: refresh };
}

// ═══════════════════════════════════════════════════════════════════
// TAB: DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function DashboardPanel({ token }) {
  var { data, loading, refresh } = useAdminFetch("adminDashboard", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading dashboard...</div>;
  var s = (data && data.stats) || {};
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }} className="resp-grid-4">
        <StatCard label="Total Students" value={s.totalStudents || 0} icon={"\uD83D\uDC65"} color={S.sky} />
        <StatCard label="Pending Applications" value={s.pendingApplications || 0} icon={"\uD83D\uDCE5"} color={S.coral} />
        <StatCard label="Active Enrolled" value={s.activeEnrolled || 0} icon={"\u2705"} color={S.emerald} />
        <StatCard label="Revenue (JMD)" value={s.totalRevenue ? fmt(s.totalRevenue) : "$0"} icon={"\uD83D\uDCB0"} color={S.gold} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }} className="resp-grid-4">
        <StatCard label="Pending Payments" value={s.pendingPayments || 0} icon={"\u23F3"} color={S.amber} />
        <StatCard label="Assessments Taken" value={s.assessmentsTaken || 0} icon={"\uD83D\uDCDD"} color={S.violet} />
        <StatCard label="Competent Rate" value={(s.competentRate || 0) + "%"} icon={"\uD83C\uDFC6"} color={S.teal} />
        <StatCard label="Active Cohorts" value={s.activeCohorts || 0} icon={"\uD83D\uDCCB"} color={S.rose} />
      </div>
      {/* Programme breakdown */}
      {s.programmeBreakdown && s.programmeBreakdown.length > 0 && (
        <Card title="Enrolment by Programme" icon={"\uD83D\uDCCA"} color={S.violet}>
          <DataTable columns={[{ key: "programme", label: "Programme" }, { key: "level", label: "Level" }, { key: "enrolled", label: "Enrolled" }, { key: "pending", label: "Pending" }, { key: "completed", label: "Completed" }]} rows={s.programmeBreakdown} />
        </Card>
      )}
      {/* Recent activity */}
      {s.recentActivity && s.recentActivity.length > 0 && (
        <Card title="Recent Activity" icon={"\uD83D\uDD54"} color={S.teal}>
          {s.recentActivity.map(function(a, i) { return <div key={i} style={{ padding: "8px 0", borderBottom: i < s.recentActivity.length - 1 ? "1px solid " + S.border : "none", fontSize: 12, fontFamily: S.body }}><span style={{ color: S.navy, fontWeight: 600 }}>{a.action}</span> <span style={{ color: S.grayLight }}>\u2014 {a.details}</span> <span style={{ color: S.grayLight, fontSize: 10, marginLeft: 8 }}>{a.time}</span></div>; })}
        </Card>
      )}
      <div style={{ textAlign: "right" }}><button onClick={refresh} style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid " + S.border, background: "#fff", color: S.navy, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>{"\u21BB"} Refresh</button></div>
    </div>
  );
}

// ═══ TAB: APPLICATIONS ═══
function ApplicationsPanel({ token }) {
  var { data, loading, refresh } = useAdminFetch("adminApplications", token, []);
  var [filter, setFilter] = useState("all");
  var [selectedApp, setSelectedApp] = useState(null);
  var [actionLoading, setActionLoading] = useState(false);
  var [actionMsg, setActionMsg] = useState("");

  var apps = (data && data.applications) || [];
  var filtered = filter === "all" ? apps : apps.filter(function(a) { return a.status === filter; });

  var doAction = async function(appRef, action) {
    setActionLoading(true); setActionMsg("");
    try {
      var res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "adminProcessApplication", token: token, appRef: appRef, decision: action }) });
      var d = await res.json();
      setActionMsg(d.message || (action === "accept" ? "Accepted! Student ID generated." : action === "reject" ? "Rejected." : "Waitlisted."));
      refresh();
    } catch(e) { setActionMsg("Error. Try again."); }
    setActionLoading(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading applications...</div>;

  var counts = { all: apps.length, "Under Review": apps.filter(function(a) { return a.status === "Under Review"; }).length, "Accepted": apps.filter(function(a) { return a.status === "Accepted"; }).length, "Rejected": apps.filter(function(a) { return a.status === "Rejected"; }).length, "Waiting List": apps.filter(function(a) { return a.status === "Waiting List"; }).length };

  return (
    <div>
      {/* Status filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all", "All (" + counts.all + ")"], ["Under Review", "\uD83D\uDD51 Under Review (" + counts["Under Review"] + ")"], ["Accepted", "\u2705 Accepted (" + counts["Accepted"] + ")"], ["Rejected", "\u274C Rejected (" + counts["Rejected"] + ")"], ["Waiting List", "\u23F3 Waitlist (" + counts["Waiting List"] + ")"]].map(function(f) {
          var a = filter === f[0]; return <button key={f[0]} onClick={function() { setFilter(f[0]); setSelectedApp(null); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + (a ? S.coral : S.border), background: a ? S.coralLight : "#fff", color: a ? S.coralDark : S.gray, fontSize: 12, fontWeight: a ? 700 : 500, cursor: "pointer", fontFamily: S.body }}>{f[1]}</button>;
        })}
      </div>

      {/* Selected application detail */}
      {selectedApp && (
        <Card title={"Application: " + selectedApp.ref} icon={"\uD83D\uDCC4"} color={S.coral}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }} className="resp-grid-2">
            {[["Name", selectedApp.name], ["Email", selectedApp.email], ["Phone", selectedApp.phone], ["Level", selectedApp.level], ["Programme", selectedApp.programme], ["Payment Plan", selectedApp.paymentPlan], ["Nationality", selectedApp.nationality], ["Status", selectedApp.status], ["Submitted", selectedApp.date], ["TRN", selectedApp.trn]].map(function(r) {
              return <div key={r[0]} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid " + S.border, fontSize: 12, fontFamily: S.body }}><span style={{ color: S.gray }}>{r[0]}</span><span style={{ color: S.navy, fontWeight: 600 }}>{r[1] || "\u2014"}</span></div>;
            })}
          </div>
          {selectedApp.documents && selectedApp.documents.length > 0 && (
            <div style={{ marginTop: 14 }}><div style={{ fontSize: 11, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>Uploaded Documents</div>{selectedApp.documents.map(function(d, i) { return <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "6px 14px", borderRadius: 6, background: S.skyLight, color: S.sky, fontSize: 11, fontWeight: 600, fontFamily: S.body, textDecoration: "none", marginRight: 6, marginBottom: 6 }}>{d.name || "Document " + (i+1)}</a>; })}</div>
          )}
          {actionMsg && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: S.emeraldLight, fontSize: 12, color: S.emeraldDark, fontFamily: S.body }}>{actionMsg}</div>}
          {selectedApp.status === "Under Review" && (
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={function() { doAction(selectedApp.ref, "accept"); }} disabled={actionLoading} style={{ padding: "10px 24px", borderRadius: 8, background: S.emerald, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{"\u2705"} Accept</button>
              <button onClick={function() { doAction(selectedApp.ref, "reject"); }} disabled={actionLoading} style={{ padding: "10px 24px", borderRadius: 8, background: S.rose, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{"\u274C"} Reject</button>
              <button onClick={function() { doAction(selectedApp.ref, "waitlist"); }} disabled={actionLoading} style={{ padding: "10px 24px", borderRadius: 8, background: S.amber, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{"\u23F3"} Waitlist</button>
            </div>
          )}
          <button onClick={function() { setSelectedApp(null); setActionMsg(""); }} style={{ marginTop: 12, background: "none", border: "none", color: S.gray, fontSize: 12, cursor: "pointer", fontFamily: S.body }}>{"\u2190"} Back to list</button>
        </Card>
      )}

      {/* Applications table */}
      {!selectedApp && (
        <Card>
          <DataTable columns={[
            { key: "ref", label: "Reference" },
            { key: "name", label: "Name" },
            { key: "programme", label: "Programme", maxWidth: 180 },
            { key: "level", label: "Level" },
            { key: "date", label: "Date" },
            { label: "Status", render: function(r) { var colors = { "Under Review": S.amber, "Accepted": S.emerald, "Rejected": S.rose, "Waiting List": S.violet }; return <span style={{ fontSize: 10, fontWeight: 700, color: colors[r.status] || S.navy, background: (colors[r.status] || S.navy) + "15", padding: "3px 10px", borderRadius: 20 }}>{r.status}</span>; } },
            { label: "Action", render: function(r) { return <button onClick={function() { setSelectedApp(r); setActionMsg(""); }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid " + S.border, background: "#fff", color: S.navy, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>View</button>; } },
          ]} rows={filtered} emptyMsg={"No " + (filter === "all" ? "" : filter + " ") + "applications found."} />
        </Card>
      )}
    </div>
  );
}

// ═══ TAB: STUDENTS ═══
function StudentsPanel({ token }) {
  var { data, loading, refresh } = useAdminFetch("adminStudents", token, []);
  var [search, setSearch] = useState("");
  var students = (data && data.students) || [];
  var filtered = search ? students.filter(function(s) { var q = search.toLowerCase(); return (s.name || "").toLowerCase().indexOf(q) >= 0 || (s.studentNumber || "").toLowerCase().indexOf(q) >= 0 || (s.email || "").toLowerCase().indexOf(q) >= 0; }) : students;

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading students...</div>;
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="text" value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search by name, ID, or email..." style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 8, border: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }} />
        <button onClick={refresh} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid " + S.border, background: "#fff", color: S.navy, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>{"\u21BB"} Refresh</button>
      </div>
      <Card>
        <DataTable columns={[
          { key: "studentNumber", label: "Student ID" },
          { key: "name", label: "Name" },
          { key: "programme", label: "Programme", maxWidth: 180 },
          { key: "level", label: "Level" },
          { key: "cohort", label: "Cohort" },
          { label: "Status", render: function(r) { var c = { "Enrolled": S.emerald, "Active": S.emerald, "Graduated": S.gold, "Pending Payment": S.amber, "On Hold": S.coral, "Deactivated": S.rose }; return <span style={{ fontSize: 10, fontWeight: 700, color: c[r.status] || S.navy, background: (c[r.status] || S.navy) + "15", padding: "3px 10px", borderRadius: 20 }}>{r.status || "\u2014"}</span>; } },
          { label: "Paid", render: function(r) { return <span style={{ fontWeight: 700, color: r.outstanding > 0 ? S.coral : S.emerald, fontSize: 12 }}>{fmt(r.totalPaid || 0)}</span>; } },
        ]} rows={filtered} emptyMsg="No students found." />
      </Card>
      <div style={{ fontSize: 12, color: S.grayLight, fontFamily: S.body, marginTop: 8 }}>Total: {filtered.length} student{filtered.length !== 1 ? "s" : ""}</div>
    </div>
  );
}

// ═══ TAB: COHORTS ═══
function CohortsPanel({ token }) {
  var { data, loading, refresh } = useAdminFetch("adminCohorts", token, []);
  var [showCreate, setShowCreate] = useState(false);
  var [newCohort, setNewCohort] = useState({ name: "", programme: "", level: "", capacity: 30, startDate: "" });
  var [createLoading, setCreateLoading] = useState(false);
  var [createMsg, setCreateMsg] = useState("");

  var createCohort = async function() {
    if (!newCohort.name || !newCohort.programme) { setCreateMsg("Name and programme are required."); return; }
    setCreateLoading(true); setCreateMsg("");
    try {
      var res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "adminCreateCohort", token: token, ...newCohort }) });
      var d = await res.json();
      if (d.ok) { setCreateMsg("Cohort created!"); setShowCreate(false); setNewCohort({ name: "", programme: "", level: "", capacity: 30, startDate: "" }); refresh(); }
      else setCreateMsg(d.error || "Failed.");
    } catch(e) { setCreateMsg("Error."); }
    setCreateLoading(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading cohorts...</div>;
  var cohorts = (data && data.cohorts) || [];
  var fStyle = { width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid " + S.border, fontSize: 13, fontFamily: S.body, boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: S.navy, fontFamily: S.body }}>{cohorts.length} cohort{cohorts.length !== 1 ? "s" : ""}</div>
        <button onClick={function() { setShowCreate(!showCreate); }} style={{ padding: "8px 20px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>+ Create Cohort</button>
      </div>
      {showCreate && (
        <Card title="New Cohort" icon={"\u2795"} color={S.coral}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="resp-grid-2">
            <div><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Cohort Name</label><input value={newCohort.name} onChange={function(e) { setNewCohort({...newCohort, name: e.target.value}); }} placeholder="e.g. APR-2026" style={fStyle} /></div>
            <div><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Programme</label><input value={newCohort.programme} onChange={function(e) { setNewCohort({...newCohort, programme: e.target.value}); }} placeholder="e.g. Business Admin" style={fStyle} /></div>
            <div><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Level</label><input value={newCohort.level} onChange={function(e) { setNewCohort({...newCohort, level: e.target.value}); }} placeholder="e.g. Level 3" style={fStyle} /></div>
            <div><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Capacity</label><input type="number" value={newCohort.capacity} onChange={function(e) { setNewCohort({...newCohort, capacity: parseInt(e.target.value) || 30}); }} style={fStyle} /></div>
            <div><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Start Date</label><input type="date" value={newCohort.startDate} onChange={function(e) { setNewCohort({...newCohort, startDate: e.target.value}); }} style={fStyle} /></div>
          </div>
          {createMsg && <div style={{ marginTop: 12, fontSize: 12, color: S.coral, fontFamily: S.body }}>{createMsg}</div>}
          <button onClick={createCohort} disabled={createLoading} style={{ marginTop: 16, padding: "10px 28px", borderRadius: 8, background: S.emerald, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{createLoading ? "Creating..." : "Create Cohort"}</button>
        </Card>
      )}
      <Card>
        <DataTable columns={[{ key: "name", label: "Cohort" }, { key: "programme", label: "Programme" }, { key: "level", label: "Level" }, { key: "capacity", label: "Capacity" }, { key: "enrolled", label: "Enrolled" }, { key: "startDate", label: "Start" }, { label: "Status", render: function(r) { return <span style={{ fontSize: 10, fontWeight: 700, color: r.status === "Active" ? S.emerald : S.grayLight, background: (r.status === "Active" ? S.emerald : S.grayLight) + "15", padding: "3px 10px", borderRadius: 20 }}>{r.status || "Pending"}</span>; } }]} rows={cohorts} emptyMsg="No cohorts created yet." />
      </Card>
    </div>
  );
}

// ═══ TAB: LMS CONTENT ═══
function LMSPanel({ token }) {
  var { data, loading, refresh } = useAdminFetch("adminLmsContent", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading LMS content...</div>;
  var content = (data && data.content) || [];
  return (
    <div>
      <Card title="LMS Content Management" icon={"\uD83D\uDCDA"} color={S.violet}>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 16, lineHeight: 1.6 }}>Manage learner guides, videos, and resources per programme. Upload PDFs to Google Drive, add external links per unit.</p>
        <DataTable columns={[{ key: "programme", label: "Programme" }, { key: "unit", label: "Unit" }, { key: "title", label: "Title" }, { key: "type", label: "Type" }, { label: "Status", render: function(r) { return <span style={{ fontSize: 10, fontWeight: 700, color: r.active ? S.emerald : S.grayLight }}>{r.active ? "Active" : "Inactive"}</span>; } }, { key: "releaseDate", label: "Release Date" }]} rows={content} emptyMsg="No LMS content configured. Add content via Google Sheets." />
      </Card>
      <div style={{ padding: "14px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 12, color: S.amberDark, fontFamily: S.body, lineHeight: 1.6 }}>{"\uD83D\uDCA1"} <strong>Tip:</strong> LMS content is managed in the LMS_Content sheet. Add rows with programme, unit number, title, type (pdf/video/audio/link), URL, and release date. The student portal reads from this sheet automatically.</div>
    </div>
  );
}

// ═══ TAB: ASSESSMENTS ═══
function AssessmentsPanel({ token }) {
  var { data, loading } = useAdminFetch("adminAssessmentConfig", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading assessment config...</div>;
  var configs = (data && data.configs) || [];
  return (
    <div>
      <Card title="Assessment Configuration" icon={"\uD83D\uDCDD"} color={S.violet}>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 16, lineHeight: 1.6 }}>Configure topical and final assessments. Question banks: DPO (149 questions), AA2 (284 questions), ICT (99 questions). Weighted scoring: Theory 30 marks (1 mark each) + Practical 70 marks (Basic 2mk, Intermediate 3mk, Advanced 6mk).</p>
        <DataTable columns={[{ key: "programme", label: "Programme" }, { key: "type", label: "Type" }, { key: "unit", label: "Unit" }, { key: "theoryCount", label: "Theory Q's" }, { key: "practicalCount", label: "Practical Q's" }, { key: "timeLimit", label: "Time (min)" }, { label: "Active", render: function(r) { return <span style={{ color: r.active ? S.emerald : S.grayLight, fontWeight: 700 }}>{r.active ? "\u2713" : "\u2014"}</span>; } }]} rows={configs} emptyMsg="No assessments configured. Add via Assessment_Config sheet." />
      </Card>
    </div>
  );
}

// ═══ TAB: RESULTS & REPORTS ═══
function ResultsPanel({ token }) {
  var { data, loading } = useAdminFetch("adminResults", token, []);
  var [filterProg, setFilterProg] = useState("all");
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading results...</div>;
  var results = (data && data.results) || [];
  var filtered = filterProg === "all" ? results : results.filter(function(r) { return r.programme === filterProg; });
  var progs = [...new Set(results.map(function(r) { return r.programme; }).filter(Boolean))];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select value={filterProg} onChange={function(e) { setFilterProg(e.target.value); }} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid " + S.border, fontSize: 12, fontFamily: S.body }}>
          <option value="all">All Programmes</option>
          {progs.map(function(p) { return <option key={p} value={p}>{p}</option>; })}
        </select>
      </div>
      <Card title="Assessment Results" icon={"\uD83C\uDFC6"} color={S.emerald}>
        <DataTable columns={[{ key: "studentName", label: "Student" }, { key: "studentNumber", label: "ID" }, { key: "programme", label: "Programme" }, { key: "assessment", label: "Assessment" }, { key: "theoryScore", label: "Theory" }, { key: "practicalScore", label: "Practical" }, { key: "totalScore", label: "Total %" }, { label: "Competent", render: function(r) { return <span style={{ fontSize: 10, fontWeight: 700, color: r.competent ? S.emerald : S.amber, background: (r.competent ? S.emerald : S.amber) + "15", padding: "3px 10px", borderRadius: 20 }}>{r.competent ? "YES" : "NO"}</span>; } }, { key: "date", label: "Date" }]} rows={filtered} emptyMsg="No results yet." />
      </Card>
    </div>
  );
}

// ═══ TAB: FINANCE ═══
function FinancePanel({ token }) {
  var { data, loading } = useAdminFetch("adminFinance", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading finance data...</div>;
  var s = (data && data.stats) || {};
  var payments = (data && data.recentPayments) || [];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }} className="resp-grid-4">
        <StatCard label="Total Revenue" value={fmt(s.totalRevenue || 0)} icon={"\uD83D\uDCB0"} color={S.emerald} />
        <StatCard label="Outstanding" value={fmt(s.totalOutstanding || 0)} icon={"\u23F3"} color={S.coral} />
        <StatCard label="Payments This Month" value={s.paymentsThisMonth || 0} icon={"\uD83D\uDCB3"} color={S.sky} />
        <StatCard label="Avg Payment" value={fmt(s.avgPayment || 0)} icon={"\uD83D\uDCC8"} color={S.violet} />
      </div>
      <Card title="Recent Payments" icon={"\uD83D\uDCB3"} color={S.gold}>
        <DataTable columns={[{ key: "date", label: "Date" }, { key: "studentName", label: "Student" }, { key: "ref", label: "Reference" }, { key: "amount", label: "Amount", render: function(r) { return <span style={{ fontWeight: 700 }}>{fmt(r.amount)}</span>; } }, { key: "method", label: "Method" }, { label: "Status", render: function(r) { return <span style={{ fontSize: 10, fontWeight: 700, color: r.status === "Verified" ? S.emerald : S.amber }}>{r.status}</span>; } }]} rows={payments} emptyMsg="No payments recorded." />
      </Card>
    </div>
  );
}

// ═══ TAB: ANNOUNCEMENTS ═══
function AnnouncementsPanel({ token }) {
  var { data, loading, refresh } = useAdminFetch("adminAnnouncements", token, []);
  var [showNew, setShowNew] = useState(false);
  var [title, setTitle] = useState("");
  var [message, setMessage] = useState("");
  var [audience, setAudience] = useState("all");
  var [sendEmail, setSendEmail] = useState(true);
  var [sending, setSending] = useState(false);
  var [sendMsg, setSendMsg] = useState("");

  var send = async function() {
    if (!title.trim() || !message.trim()) { setSendMsg("Title and message required."); return; }
    setSending(true); setSendMsg("");
    try {
      var res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "adminSendAnnouncement", token: token, title: title, message: message, audience: audience, sendEmail: sendEmail }) });
      var d = await res.json();
      if (d.ok) { setSendMsg("Announcement sent!"); setTitle(""); setMessage(""); setShowNew(false); refresh(); }
      else setSendMsg(d.error || "Failed.");
    } catch(e) { setSendMsg("Error."); }
    setSending(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading...</div>;
  var anns = (data && data.announcements) || [];
  var fStyle = { width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid " + S.border, fontSize: 13, fontFamily: S.body, boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: S.navy, fontFamily: S.body }}>{anns.length} announcement{anns.length !== 1 ? "s" : ""}</div>
        <button onClick={function() { setShowNew(!showNew); }} style={{ padding: "8px 20px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>+ New Announcement</button>
      </div>
      {showNew && (
        <Card title="Compose Announcement" icon={"\uD83D\uDCE2"} color={S.coral}>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Title</label><input value={title} onChange={function(e) { setTitle(e.target.value); }} style={fStyle} /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, display: "block", marginBottom: 4 }}>Message</label><textarea value={message} onChange={function(e) { setMessage(e.target.value); }} rows={4} style={{ ...fStyle, resize: "vertical" }} /></div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div><label style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginRight: 8 }}>Audience:</label><select value={audience} onChange={function(e) { setAudience(e.target.value); }} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid " + S.border, fontSize: 12, fontFamily: S.body }}><option value="all">All Students</option><option value="enrolled">Enrolled Only</option><option value="pending">Pending Payment</option></select></div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: S.body, color: S.navy, cursor: "pointer" }}><input type="checkbox" checked={sendEmail} onChange={function() { setSendEmail(!sendEmail); }} /> Also send via email</label>
          </div>
          {sendMsg && <div style={{ marginBottom: 12, fontSize: 12, color: S.emerald, fontFamily: S.body }}>{sendMsg}</div>}
          <button onClick={send} disabled={sending} style={{ padding: "10px 28px", borderRadius: 8, background: S.emerald, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{sending ? "Sending..." : "Send Announcement"}</button>
        </Card>
      )}
      <Card>{anns.map(function(a, i) { return <div key={i} style={{ padding: "12px 0", borderBottom: i < anns.length - 1 ? "1px solid " + S.border : "none" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{a.title}</span><span style={{ fontSize: 10, color: S.grayLight, fontFamily: S.body }}>{a.date}</span></div><p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.5, margin: 0 }}>{a.message}</p><span style={{ fontSize: 10, color: S.grayLight, fontFamily: S.body }}>Audience: {a.audience || "all"} {a.emailSent ? "\u00B7 Email sent" : ""}</span></div>; })}</Card>
    </div>
  );
}

// ═══ TAB: CERTIFICATES ═══
function CertificatesPanel({ token }) {
  var { data, loading } = useAdminFetch("adminCertificates", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading...</div>;
  var certs = (data && data.certificates) || [];
  return (
    <Card title="Certificate Management" icon={"\uD83C\uDF93"} color={S.gold}>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 16, lineHeight: 1.6 }}>Generate branded CTS ETS certificates for COMPETENT students. Each certificate has a unique verifiable number.</p>
      <DataTable columns={[{ key: "studentName", label: "Student" }, { key: "programme", label: "Programme" }, { key: "certNumber", label: "Cert Number" }, { key: "issueDate", label: "Issued" }, { label: "Status", render: function(r) { return <span style={{ fontSize: 10, fontWeight: 700, color: r.status === "Issued" ? S.emerald : S.amber }}>{r.status}</span>; } }]} rows={certs} emptyMsg="No certificates generated yet." />
    </Card>
  );
}

// ═══ TAB: COMMUNICATIONS LOG ═══
function CommsPanel({ token }) {
  var { data, loading } = useAdminFetch("adminCommsLog", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading...</div>;
  var logs = (data && data.logs) || [];
  return (
    <Card title="Student Communication Log" icon={"\uD83D\uDCE7"} color={S.sky}>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 16 }}>Every email sent to a student is logged here.</p>
      <DataTable columns={[{ key: "date", label: "Date" }, { key: "recipient", label: "To" }, { key: "subject", label: "Subject", maxWidth: 250 }, { key: "type", label: "Type" }, { label: "Status", render: function(r) { return <span style={{ fontSize: 10, fontWeight: 700, color: r.status === "Sent" ? S.emerald : S.rose }}>{r.status}</span>; } }]} rows={logs} emptyMsg="No emails logged yet." />
    </Card>
  );
}

// ═══ TAB: AUDIT LOG ═══
function AuditPanel({ token }) {
  var { data, loading } = useAdminFetch("adminAuditLog", token, []);
  if (loading) return <div style={{ textAlign: "center", padding: 60, color: S.gray, fontFamily: S.body }}>Loading...</div>;
  var logs = (data && data.logs) || [];
  return (
    <Card title="Audit Log" icon={"\uD83D\uDD12"} color={S.navy}>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 16 }}>Complete system audit trail for Ministry compliance.</p>
      <DataTable columns={[{ key: "timestamp", label: "Time" }, { key: "user", label: "User" }, { key: "action", label: "Action" }, { key: "details", label: "Details", maxWidth: 300 }, { key: "ip", label: "IP" }]} rows={logs} emptyMsg="No audit entries." />
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT — Admin Page
// ═══════════════════════════════════════════════════════════════════
export default function AdminPage({ setPage }) {
  var [authenticated, setAuthenticated] = useState(false);
  var [token, setToken] = useState("");
  var [activeTab, setActiveTab] = useState("dashboard");

  // Session check
  useEffect(function() {
    try { var t = sessionStorage.getItem("cts_admin_token"); if (t) { setToken(t); setAuthenticated(true); } } catch(e) {}
  }, []);

  // 20-minute timeout
  useEffect(function() {
    if (!authenticated) return;
    var timeout;
    var resetTimer = function() { clearTimeout(timeout); timeout = setTimeout(function() { setAuthenticated(false); setToken(""); try { sessionStorage.removeItem("cts_admin_token"); } catch(e) {} alert("Admin session expired."); }, 20 * 60 * 1000); };
    var ev = ["mousedown", "keydown", "scroll", "click"];
    for (var i = 0; i < ev.length; i++) document.addEventListener(ev[i], resetTimer);
    resetTimer();
    return function() { clearTimeout(timeout); for (var i = 0; i < ev.length; i++) document.removeEventListener(ev[i], resetTimer); };
  }, [authenticated]);

  var handleLogin = function(t) {
    setToken(t); setAuthenticated(true);
    try { sessionStorage.setItem("cts_admin_token", t); } catch(e) {}
  };

  var handleLogout = function() {
    setAuthenticated(false); setToken(""); setActiveTab("dashboard");
    try { sessionStorage.removeItem("cts_admin_token"); } catch(e) {}
  };

  if (!authenticated) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: S.lightBg }}>
      {/* Admin header */}
      <div style={{ background: S.navy, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>{"\uD83D\uDD10"}</span>
          <div>
            <div style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: "#fff" }}>CTS ETS Admin</div>
            <div style={{ fontSize: 10, color: S.gold, fontFamily: S.body, letterSpacing: 1 }}>MANAGEMENT CONSOLE</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={function() { if (setPage) setPage("Home"); }} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 11, cursor: "pointer", fontFamily: S.body }}>{"\u2190"} Back to Site</button>
          <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid " + S.rose + "60", background: "transparent", color: S.rose, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Log Out</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <AdminTabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "dashboard" && <DashboardPanel token={token} />}
        {activeTab === "applications" && <ApplicationsPanel token={token} />}
        {activeTab === "students" && <StudentsPanel token={token} />}
        {activeTab === "cohorts" && <CohortsPanel token={token} />}
        {activeTab === "lms" && <LMSPanel token={token} />}
        {activeTab === "assessments" && <AssessmentsPanel token={token} />}
        {activeTab === "results" && <ResultsPanel token={token} />}
        {activeTab === "finance" && <FinancePanel token={token} />}
        {activeTab === "announcements" && <AnnouncementsPanel token={token} />}
        {activeTab === "certificates" && <CertificatesPanel token={token} />}
        {activeTab === "comms" && <CommsPanel token={token} />}
        {activeTab === "audit" && <AuditPanel token={token} />}
      </div>
    </div>
  );
}
