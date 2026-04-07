import { useState, useEffect } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, WIPAY_CONFIG } from "../constants/config";
import { Container, PageWrapper, Btn, Reveal, PageScripture } from "../components/shared/CoreComponents";
import OrientationGateway from "../components/OrientationGateway";

const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

const toTitleCase = (str) =>
  (str || "")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getDriveImageUrl = (url) => {
  if (!url) return null;
  if (url.match(/^[a-zA-Z0-9_-]{20,}$/)) return `https://drive.google.com/thumbnail?id=${url}&sz=w400`;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
  return url;
};

function MetricCard({ label, value, accent = S.teal }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: "22px 20px", boxShadow: "0 10px 24px rgba(15,23,42,0.04)" }}>
      <div style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,34px)", color: accent, fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontFamily: S.body, fontSize: 11, color: S.gray, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
    </div>
  );
}
function PortalTab({ label, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "12px 18px", borderRadius: 12, border: `1px solid ${active ? S.teal : S.border}`, background: active ? S.tealLight : S.white, color: active ? S.tealDark : S.gray, fontFamily: S.body, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}>{label}</button>;
}
function DataRow({ label, value }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "12px 0", borderBottom: `1px solid ${S.border}`, fontFamily: S.body, fontSize: 14 }}><span style={{ color: S.gray }}>{label}</span><span style={{ color: S.navy, fontWeight: 700, textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span></div>;
}

function AIStudyAssistant({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([{ role: "ai", text: `Hi ${toTitleCase(profile.firstName || profile.name)}! I'm your CTS ETS Study Assistant. Ask me to explain a concept from your ${profile.programme} course!` }]);
  const [isTyping, setIsTyping] = useState(false);

  const askAI = async () => {
    if (!query.trim()) return;
    const userMsg = query.trim();
    setHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setQuery("");
    setIsTyping(true);
    try {
      const res = await fetch(`${VERCEL_URL}?action=aichat&query=${encodeURIComponent(userMsg)}&course=${encodeURIComponent(profile.programme)}`);
      const data = await res.json();
      setHistory((prev) => [...prev, { role: "ai", text: data.response || "I'm having trouble connecting right now. Please try again later." }]);
    } catch {
      setHistory((prev) => [...prev, { role: "ai", text: "Network error. Please check your connection." }]);
    }
    setIsTyping(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={{ position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%", background: S.navy, color: "#fff", fontSize: 28, border: `3px solid ${S.gold}`, boxShadow: "0 8px 24px rgba(1,30,64,0.3)", cursor: "pointer", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>{isOpen ? "✕" : "🤖"}</button>
      {isOpen && (
        <div style={{ position: "fixed", bottom: 100, right: 24, width: "calc(100% - 48px)", maxWidth: 390, height: 510, background: S.white, borderRadius: 18, border: `1px solid ${S.border}`, boxShadow: "0 14px 42px rgba(0,0,0,0.18)", zIndex: 9998, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ background: S.navy, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24 }}>🤖</div>
            <div><div style={{ color: "#fff", fontFamily: S.heading, fontSize: 16, fontWeight: 700 }}>CTS Study Assistant</div><div style={{ color: S.gold, fontFamily: S.body, fontSize: 11 }}>24/7 AI Tutor</div></div>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: "auto", background: S.lightBg, display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((msg, i) => <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? S.teal : S.white, color: msg.role === "user" ? "#fff" : S.navy, padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", maxWidth: "85%", fontSize: 14, fontFamily: S.body, border: msg.role === "ai" ? `1px solid ${S.border}` : "none", lineHeight: 1.5 }}>{msg.text}</div>)}
            {isTyping && <div style={{ alignSelf: "flex-start", background: S.white, padding: "12px 16px", borderRadius: "16px 16px 16px 4px", border: `1px solid ${S.border}`, fontSize: 12, color: S.gray }}>Assistant is typing...</div>}
          </div>
          <div style={{ padding: 16, background: S.white, borderTop: `1px solid ${S.border}`, display: "flex", gap: 8 }}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askAI()} placeholder="Ask a question..." style={{ flex: 1, padding: "12px 16px", borderRadius: 20, border: `1px solid ${S.border}`, outline: "none", fontFamily: S.body, fontSize: 14 }} />
            <button onClick={askAI} disabled={!query.trim() || isTyping} style={{ width: 44, height: 44, borderRadius: "50%", background: query.trim() ? S.coral : S.border, color: "#fff", border: "none", cursor: query.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>↑</button>
          </div>
        </div>
      )}
    </>
  );
}

function PaymentModal({ profile, show, onClose }) {
  const [payMethod, setPayMethod] = useState("");
  const [customAmount, setCustomAmount] = useState(profile.outstanding || 0);
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const toBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(",")[1]); reader.onerror = (error) => reject(error); reader.readAsDataURL(file); });

  const handleReceiptUpload = async () => {
    if (!receipt || submitting || customAmount < 1000) return;
    setSubmitting(true);
    try {
      const b64 = await toBase64(receipt);
      const fileData = [{ slot: "paymentReceipt", name: receipt.name, type: receipt.type, data: b64 }];
      const res = await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "submitpayment", form_type: "Portal In-App Payment Evidence", ref: profile.studentNumber, studentName: profile.name, email: profile.email, paymentPlan: "Dashboard Payment", amountPaid: customAmount, paymentMethod: "bank_transfer", files: fileData, timestamp: new Date().toISOString() }) });
      if (res.ok) { setPaySuccess(true); setReceipt(null); } else alert("Upload failed. Please check your internet connection and try again.");
    } catch { alert("A network error occurred. Please try again."); }
    setSubmitting(false);
  };

  const handleWiPayCheckout = () => {
    if (submitting || customAmount < 1000) return;
    setSubmitting(true);
    const orderId = profile.studentNumber + "-PORTAL";
    const paymentDescription = `Ref: ${profile.studentNumber} | Name: ${profile.name} | Email: ${profile.email}`;
    if (WIPAY_CONFIG && WIPAY_CONFIG.baseUrl.includes("/to_me/")) {
      let base = WIPAY_CONFIG.baseUrl;
      if (base.endsWith("/")) base = base.slice(0, -1);
      window.location.href = `${base}/${customAmount}/${encodeURIComponent(paymentDescription)}`;
    } else if (WIPAY_CONFIG) {
      const returnUrl = encodeURIComponent(window.location.origin + "/#student-portal");
      window.location.href = `${WIPAY_CONFIG.baseUrl}?total=${encodeURIComponent(customAmount)}&currency=${encodeURIComponent(WIPAY_CONFIG.currency)}&order_id=${encodeURIComponent(orderId)}&return_url=${returnUrl}`;
    } else {
      alert("WiPay is not configured correctly. Please use Bank Transfer.");
      setSubmitting(false);
    }
  };

  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(1, 30, 64, 0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", padding: 20 }}>
      <div style={{ background: S.white, padding: "36px", borderRadius: 24, maxWidth: 620, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 28, cursor: "pointer", color: S.grayLight }}>✕</button>
        {paySuccess ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ color: S.navy, fontFamily: S.heading, fontSize: 28, marginBottom: 16 }}>Evidence Submitted!</h3>
            <p style={{ color: S.gray, fontFamily: S.body, fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Your receipt has been securely uploaded to Finance. We will verify your payment of <strong>{fmt(customAmount)}</strong> and update your portal balance within 48–72 hours.</p>
            <Btn primary onClick={onClose} style={{ background: S.emerald, color: S.white, borderRadius: 12 }}>Close</Btn>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>Portal Payment Centre</div>
            <h3 style={{ color: S.navy, fontFamily: S.heading, fontSize: 28, marginBottom: 12, lineHeight: 1.15 }}>Pay your balance without leaving the portal</h3>
            <p style={{ color: S.gray, fontFamily: S.body, fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>This keeps the same in-app payment modal idea from your current portal, but presents it more clearly and with calmer guidance.</p>
            <div style={{ background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 16, padding: 18, marginBottom: 20 }}>
              <DataRow label="Student ID" value={profile.studentNumber} />
              <DataRow label="Programme" value={profile.programme} />
              <DataRow label="Outstanding Balance" value={fmt(profile.outstanding || 0)} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, color: S.navy, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Amount to pay now</label>
              <input type="number" value={customAmount} onChange={(e) => setCustomAmount(Number(e.target.value))} style={{ width: "100%", padding: 16, borderRadius: 12, border: `1px solid ${S.border}`, fontSize: 24, fontWeight: 800, fontFamily: S.heading, color: S.navy, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "grid", gap: 14, marginBottom: 22 }}>
              <button onClick={() => setPayMethod("online")} style={{ padding: 18, borderRadius: 16, border: payMethod === "online" ? `2px solid ${S.navy}` : `1px solid ${S.border}`, background: payMethod === "online" ? S.lightBg : S.white, textAlign: "left", cursor: "pointer" }}><div style={{ fontWeight: 800, color: S.navy, fontFamily: S.heading, fontSize: 20, marginBottom: 6 }}>💳 Pay Online</div><div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7 }}>Secure WiPay checkout using a card.</div></button>
              <button onClick={() => setPayMethod("upload")} style={{ padding: 18, borderRadius: 16, border: payMethod === "upload" ? `2px solid ${S.navy}` : `1px solid ${S.border}`, background: payMethod === "upload" ? S.lightBg : S.white, textAlign: "left", cursor: "pointer" }}><div style={{ fontWeight: 800, color: S.navy, fontFamily: S.heading, fontSize: 20, marginBottom: 6 }}>🏦 Bank Transfer</div><div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7 }}>Transfer funds and upload your receipt for verification.</div></button>
            </div>
            {payMethod === "online" && <Btn primary onClick={handleWiPayCheckout} style={{ width: "100%", background: S.navy, color: S.white, borderRadius: 12 }}>{submitting ? "Connecting to WiPay..." : `Pay ${fmt(customAmount)} Online`}</Btn>}
            {payMethod === "upload" && <div style={{ background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 16, padding: 18 }}><div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.7, marginBottom: 12 }}>Upload your transfer confirmation or bank receipt.</div><input type="file" onChange={(e) => setReceipt(e.target.files[0])} style={{ width: "100%", marginBottom: 14 }} /><Btn primary onClick={handleReceiptUpload} style={{ width: "100%", background: S.emerald, color: S.white, borderRadius: 12 }} disabled={submitting || !receipt || customAmount < 1000}>{submitting ? "Submitting..." : `Submit Evidence for ${fmt(customAmount)}`}</Btn></div>}
          </>
        )}
      </div>
    </div>
  );
}

function Dashboard({ studentData, onLogout, fetchDashboard }) {
  const profile = studentData.profile;
  const curriculum = studentData.curriculum || [];
  const payments = studentData.payments || [];
  const [progress] = useState(studentData.progress || 1);
  const [activeTab, setActiveTab] = useState("profile");
  const [imgError, setImgError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const secureImgUrl = getDriveImageUrl(profile.photoUrl);

  return (
    <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto" }}>
      <PaymentModal profile={profile} show={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
      <Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
          <div>
            <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 24, padding: 24, boxShadow: "0 12px 30px rgba(15,23,42,0.04)", marginBottom: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                {!imgError && secureImgUrl ? <img src={secureImgUrl} alt={profile.name} onError={() => setImgError(true)} style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: `4px solid ${S.gold}`, marginBottom: 14 }} /> : <div style={{ width: 110, height: 110, borderRadius: "50%", background: S.lightBg, border: `4px solid ${S.gold}`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>👤</div>}
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, lineHeight: 1.15 }}>{toTitleCase(profile.name || profile.firstName)}</div>
                <div style={{ fontFamily: S.body, fontSize: 12, color: S.teal, letterSpacing: 1.6, textTransform: "uppercase", fontWeight: 800, marginTop: 8 }}>{profile.studentNumber}</div>
              </div>
              <div style={{ background: S.lightBg, borderRadius: 16, padding: 16, marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: S.gray, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Current Programme</div>
                <div style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 800, marginBottom: 6 }}>{profile.programme}</div>
                <div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.65 }}>{profile.level}</div>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                <PortalTab label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                <PortalTab label="Coursework" active={activeTab === "coursework"} onClick={() => setActiveTab("coursework")} />
                <PortalTab label="Assessments" active={activeTab === "assessments"} onClick={() => setActiveTab("assessments")} />
                <PortalTab label="Payments" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
                <PortalTab label="Student ID" active={activeTab === "id"} onClick={() => setActiveTab("id")} />
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn primary onClick={() => setShowPaymentModal(true)} style={{ background: S.coral, color: S.white, borderRadius: 12, flex: 1 }}>Pay Balance</Btn>
                <Btn onClick={onLogout} style={{ borderRadius: 12, border: `2px solid ${S.teal}`, color: S.teal, flex: 1 }}>Logout</Btn>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
              <MetricCard label="Progress" value={`${progress}%`} accent={S.teal} />
              <MetricCard label="Outstanding" value={fmt(profile.outstanding || 0)} accent={S.coral} />
              <MetricCard label="Student ID" value={profile.studentNumber || "—"} accent={S.goldDark} />
              <MetricCard label="Assessments" value={curriculum.length || 0} accent={S.violet} />
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 24, padding: "26px", boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
              {activeTab === "profile" && <>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 16 }}>Student Profile</div>
                <DataRow label="Full Name" value={toTitleCase(profile.name)} />
                <DataRow label="Email" value={profile.email} />
                <DataRow label="Programme" value={profile.programme} />
                <DataRow label="Level" value={profile.level} />
                <DataRow label="Student Number" value={profile.studentNumber} />
              </>}
              {activeTab === "coursework" && <>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 14 }}>Coursework & Modules</div>
                <div style={{ display: "grid", gap: 14 }}>{curriculum.length > 0 ? curriculum.map((item, idx) => <div key={idx} style={{ padding: 18, borderRadius: 16, background: S.lightBg, border: `1px solid ${S.border}` }}><div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 6 }}>{item.title || `Module ${idx + 1}`}</div><div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7 }}>{item.desc || "Learning materials and activities available in this module."}</div></div>) : <div style={{ color: S.gray, fontFamily: S.body }}>No curriculum loaded yet.</div>}</div>
              </>}
              {activeTab === "assessments" && <>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 14 }}>Assessments & Quiz Centre</div>
                <div style={{ display: "grid", gap: 14 }}>{curriculum.length > 0 ? curriculum.map((item, idx) => <div key={idx} style={{ padding: 18, borderRadius: 16, background: S.lightBg, border: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}><div><div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 4 }}>{item.title || `Module ${idx + 1}`}</div><div style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>{item.quiz ? "Quiz available" : "Portfolio / practical work"}</div></div>{item.quiz ? <Btn primary style={{ background: S.teal, color: S.white, borderRadius: 12 }}>Open Quiz</Btn> : <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>No quiz loaded</div>}</div>) : <div style={{ color: S.gray, fontFamily: S.body }}>No assessments available yet.</div>}</div>
              </>}
              {activeTab === "payments" && <>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 14 }}>Payments & Finance</div>
                <DataRow label="Outstanding Balance" value={fmt(profile.outstanding || 0)} />
                <DataRow label="Total Paid" value={fmt(profile.totalPaid || 0)} />
                <DataRow label="Payment Plan" value={profile.paymentPlan || "—"} />
                <div style={{ marginTop: 20, display: "grid", gap: 12 }}>{payments.length > 0 ? payments.map((p, i) => <div key={i} style={{ padding: 16, borderRadius: 14, background: S.lightBg, border: `1px solid ${S.border}` }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}><div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.navy }}>{p.label || `Payment ${i + 1}`}</div><div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 800, color: S.emeraldDark }}>{fmt(p.amount || 0)}</div></div><div style={{ fontFamily: S.body, fontSize: 12, color: S.gray }}>{p.date || "Recorded"}</div></div>) : <div style={{ color: S.gray, fontFamily: S.body }}>No payment records displayed yet.</div>}</div>
                <div style={{ marginTop: 18 }}><Btn primary onClick={() => setShowPaymentModal(true)} style={{ background: S.coral, color: S.white, borderRadius: 12 }}>Make a Payment</Btn></div>
              </>}
              {activeTab === "id" && <>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 14 }}>Student ID Card</div>
                <div style={{ maxWidth: 420, background: S.white, border: `2px solid ${S.navy}`, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 28px rgba(15,23,42,0.08)" }}>
                  <div style={{ background: S.navy, padding: 18, color: S.white }}><div style={{ fontFamily: S.heading, fontSize: 24, fontWeight: 800 }}>CTS ETS</div><div style={{ fontFamily: S.body, fontSize: 11, color: S.goldLight, letterSpacing: 1.4, textTransform: "uppercase" }}>Student Identification Card</div></div>
                  <div style={{ padding: 22 }}><div style={{ display: "flex", gap: 18, alignItems: "center" }}>{!imgError && secureImgUrl ? <img src={secureImgUrl} alt={profile.name} onError={() => setImgError(true)} style={{ width: 96, height: 96, borderRadius: 16, objectFit: "cover", border: `3px solid ${S.gold}` }} /> : <div style={{ width: 96, height: 96, borderRadius: 16, background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👤</div>}<div><div style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 800, lineHeight: 1.15 }}>{toTitleCase(profile.name)}</div><div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginTop: 4 }}>{profile.programme}</div><div style={{ fontFamily: S.body, fontSize: 12, color: S.teal, fontWeight: 800, marginTop: 10 }}>{profile.studentNumber}</div></div></div></div>
                </div>
              </>}
            </div>
          </div>
        </div>
      </Reveal>
      <AIStudyAssistant profile={profile} />
    </div>
  );
}

export default function StudentPortalPage() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async (studentRef) => {
    if (!studentRef) return;
    setLoading(true);
    try {
      const res = await fetch(`${VERCEL_URL}?action=studentportal&ref=${encodeURIComponent(studentRef)}`);
      const data = await res.json();
      if (data && data.profile) setStudentData(data);
      else alert("Unable to load student portal data.");
    } catch {
      alert("Portal connection error. Please try again.");
    }
    setLoading(false);
  };

  const handleLogout = () => setStudentData(null);

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Student Portal</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 66px)", lineHeight: 1.04, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 860 }}>A cleaner portal experience for current learners</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 780, margin: 0 }}>This upgraded layout keeps the orientation gateway, profile view, coursework tabs, assessment handling, in-app payment modal, AI study assistant, and student ID flow — but wraps them in a more polished dashboard shell.</p>
          </Reveal>
        </Container>
      </div>
      <Container style={{ marginTop: -24, position: "relative", zIndex: 2, maxWidth: 1320 }}>
        <Reveal><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}><MetricCard label="Portal Access" value="24/7" accent={S.sky} /><MetricCard label="AI Study Help" value="Live" accent={S.goldDark} /><MetricCard label="Payments" value="In-App" accent={S.coral} /><MetricCard label="ID & Records" value="Digital" accent={S.violet} /></div></Reveal>
      </Container>
      <Container style={{ paddingTop: 28, maxWidth: 1320 }}>
        {!studentData ? <Reveal><div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 24, padding: "34px clamp(22px,4vw,40px)", boxShadow: "0 12px 30px rgba(15,23,42,0.04)", maxWidth: 900, margin: "0 auto" }}><OrientationGateway onVerified={fetchDashboard} loading={loading} /></div></Reveal> : <Dashboard studentData={studentData} onLogout={handleLogout} fetchDashboard={fetchDashboard} />}
        <PageScripture page="studentPortal" />
      </Container>
    </PageWrapper>
  );
}
