import React, { useState } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { TrustSection } from "../components/trust/TrustElements";

function LookupToggle({ value, onChange }) {
  return <div style={{ display: "flex", background: "rgba(1,30,64,0.05)", padding: 4, borderRadius: 10, marginBottom: 12, gap: 3 }}>{["certificate", "student"].map((type) => { const active = value === type; const label = type === "certificate" ? "Verify Certificate" : "Verify Student ID"; return <button key={type} onClick={() => onChange(type)} style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "none", background: active ? S.white : "transparent", color: active ? S.navy : S.gray, fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: S.body, boxShadow: active ? "0 4px 12px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s ease" }}>{label}</button>; })}</div>;
}
function InfoCard({ icon, title, desc, color }) { return <div style={{ background: S.white, borderRadius: 16, padding: "16px 14px", border: `1px solid ${S.border}`, boxShadow: "0 10px 24px rgba(15,23,42,0.04)" }}><div style={{ width: 36, height: 36, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 8 }}>{icon}</div><div style={{ fontFamily: S.heading, fontSize: 14, color: S.navy, fontWeight: 800, marginBottom: 6, lineHeight: 1.15 }}>{title}</div><div style={{ fontFamily: S.body, fontSize: 11, color: S.gray, lineHeight: 1.55 }}>{desc}</div></div>; }
function ResultRow({ label, value, dark }) { return <div style={{ display: "flex", justifyContent: "space-between", gap: 10, borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.10)" : S.border}`, paddingBottom: 6, marginBottom: 6 }}><span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.62)" : S.gray, fontFamily: S.body }}>{label}</span><span style={{ fontSize: 11, fontWeight: 700, color: dark ? S.white : S.navy, fontFamily: S.body, textAlign: "right" }}>{value}</span></div>; }

export default function VerifyCertificatePage({ setPage }) {
  const [lookupType, setLookupType] = useState("certificate");
  const [studentId, setStudentId] = useState("");
  const [certNum, setCertNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (lookupType === "certificate" && (!certNum.trim() || !studentId.trim())) return;
    if (lookupType === "student" && !studentId.trim()) return;
    setLoading(true); setResult(null);
    try {
      const action = lookupType === "certificate" ? "verifyCert" : "verifyStudentStatus";
      let url = `${APPS_SCRIPT_URL}?action=${action}&student=${encodeURIComponent(studentId.trim().toUpperCase())}`;
      if (lookupType === "certificate") url += `&cert=${encodeURIComponent(certNum.trim().toUpperCase())}`;
      const res = await fetch(url);
      if (res.ok) setResult(await res.json()); else setResult({ valid: false });
    } catch { setResult({ valid: false }); } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${S.border}`, fontSize: 11, fontFamily: S.body, color: S.navy, fontWeight: 700, outline: "none", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s", boxSizing: "border-box", background: S.white };
  const labelStyle = { display: "block", fontSize: 9, fontWeight: 800, color: S.gray, fontFamily: S.body, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.2 };
  const canSubmit = studentId.trim() && (lookupType === "student" || certNum.trim());

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 24, paddingBottom: 20 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 10, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", color: S.goldLight, marginBottom: 10 }}>Verification Centre</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(18px, 2.2vw, 24px)", lineHeight: 1.08, color: S.white, fontWeight: 900, margin: "0 0 8px", maxWidth: "none", whiteSpace: "nowrap" }}>Verify credentials and student status with more confidence</h1>
            
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Contact")} style={{ background: S.gold, color: S.navy, borderRadius: 10, padding: "8px 14px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Contact CTS ETS</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 10, padding: "8px 14px" }}>View Programmes</Btn>
            </div>
          </Reveal>
        </Container>
      </div>
      
      <Container style={{ paddingTop: 12 }}>
        <SectionHeader tag="Credential Lookup" title="Search the CTS ETS registry" desc="" accentColor={S.emerald} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: 12 }}>{[
          ["🛡️","Authenticity Check","Use this page to confirm whether a certificate record or student record exists in the CTS ETS system.",S.teal],
          ["🏢","For Employers & Institutions","Designed for HR teams, recruitment officers, and partner institutions verifying the status of an applicant.",S.violet],
          ["⚡","Fast Lookup","Enter the reference details exactly as shown on the document to retrieve the corresponding registry result.",S.coral],
        ].map(([icon,title,desc,color],i)=><Reveal key={title} delay={i*0.04}><InfoCard icon={icon} title={title} desc={desc} color={color} /></Reveal>)}</div>

        <div style={{ maxWidth: 540, margin: "0 auto 36px" }}>
          <Reveal><div style={{ background: S.white, borderRadius: 18, padding: "16px clamp(12px,2vw,18px)", border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
            <LookupToggle value={lookupType} onChange={(type)=>{ setLookupType(type); setResult(null); }} />
            <div style={{ display: "grid", gridTemplateColumns: lookupType === "certificate" ? "1fr 1fr" : "1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={labelStyle}>Student ID Number</label><input type="text" value={studentId} onChange={(e)=>setStudentId(e.target.value.toUpperCase())} placeholder="CTSETSS-XXXXX" style={{ ...inputStyle, borderColor: studentId.trim() ? S.emerald : S.border }} /></div>
              {lookupType === "certificate" && <div><label style={labelStyle}>Certificate Reference</label><input type="text" value={certNum} onChange={(e)=>setCertNum(e.target.value.toUpperCase())} placeholder="CTS-CERT-XXXXX" style={{ ...inputStyle, borderColor: certNum.trim() ? S.emerald : S.border }} /></div>}
            </div>
            <button onClick={handleVerify} disabled={loading || !canSubmit} style={{ width: "100%", padding: "10px", borderRadius: 10, background: S.navy, color: S.white, border: "none", fontSize: 12, fontWeight: 800, cursor: loading || !canSubmit ? "not-allowed" : "pointer", transition: "0.2s", boxShadow: `0 8px 20px ${S.navy}30`, fontFamily: S.body, opacity: loading || !canSubmit ? 0.75 : 1 }}>{loading ? "Accessing Registry..." : `Verify ${lookupType === "certificate" ? "Certificate" : "Enrollment Status"}`}</button>
            {result && <div style={{ marginTop: 16 }}>{result.valid ? <Reveal><div style={{ padding: "16px", borderRadius: 16, background: lookupType === "certificate" ? S.navy : S.white, border: `2px solid ${S.emerald}`, boxShadow: lookupType === "certificate" ? "0 16px 34px rgba(1,30,64,0.18)" : `0 14px 28px ${S.emerald}10` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: S.emerald, color: S.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div><div><div style={{ fontWeight: 800, color: lookupType === "certificate" ? S.white : S.navy, fontSize: 14, fontFamily: S.heading }}>Record Verified</div><div style={{ fontSize: 9, color: lookupType === "certificate" ? S.emeraldLight : S.emerald, fontFamily: S.body, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Status: {result.status || "Active Student"}</div></div></div>
              <div style={{ display: "grid", gap: 3 }}>{[
                ["Student Name", result.name],["Programme", result.programme],["Current Level", result.level],["Enrollment Date", result.enrollmentDate || result.date],lookupType === "certificate" ? ["Certificate Ref", result.ref] : ["Student ID", studentId]
              ].filter(([,v])=>v).map(([k,v])=><ResultRow key={k} label={k} value={v} dark={lookupType === "certificate"} />)}</div>
            </div></Reveal> : <Reveal><div style={{ padding: "16px 14px", borderRadius: 16, background: S.roseLight, border: `2px solid ${S.rose}40`, textAlign: "center", boxShadow: `0 12px 24px ${S.rose}10` }}><div style={{ fontSize: 20, marginBottom: 8 }}>⚠️</div><div style={{ fontWeight: 800, color: S.roseDark, fontFamily: S.heading, fontSize: 14, marginBottom: 6 }}>Verification Failed</div><p style={{ fontSize: 11, color: S.navy, margin: 0, lineHeight: 1.5, fontFamily: S.body }}>We could not verify this {lookupType}. Please ensure the ID and reference numbers are entered exactly as shown on the document.</p></div></Reveal>}</div>}
          </div></Reveal>
        </div>

        <TrustSection />
        <PageScripture page="verify" />
      </Container>
    </PageWrapper>
  );
}
