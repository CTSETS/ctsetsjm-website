import React, { useState } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config"; //
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";

export default function VerifyCertificatePage({ setPage }) {
  const [lookupType, setLookupType] = useState("certificate"); // 'certificate' or 'student'
  const [studentId, setStudentId] = useState("");
  const [certNum, setCertNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    // Validation based on type
    if (lookupType === "certificate" && (!certNum.trim() || !studentId.trim())) return;
    if (lookupType === "student" && !studentId.trim()) return;

    setLoading(true);
    setResult(null);
    
    try {
      // Direct call to your backend with conditional parameters
      const action = lookupType === "certificate" ? "verifyCert" : "verifyStudentStatus";
      let url = `${APPS_SCRIPT_URL}?action=${action}&student=${encodeURIComponent(studentId.trim().toUpperCase())}`;
      
      if (lookupType === "certificate") {
        url += `&cert=${encodeURIComponent(certNum.trim().toUpperCase())}`;
      }

      const res = await fetch(url);
      if (res.ok) { 
        const data = await res.json(); 
        setResult(data); 
      } else {
        setResult({ valid: false });
      }
    } catch { 
      setResult({ valid: false }); 
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "16px 20px", borderRadius: "12px", border: `2px solid ${S.border}`, fontSize: "15px", fontFamily: S.body, color: S.navy, fontWeight: "700", outline: "none", letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s", boxSizing: "border-box", background: S.white };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: "800", color: S.gray, fontFamily: S.body, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="Verification Centre" 
        title="Credential & Enrollment Lookup" 
        desc="Verify the authenticity of CTS ETS Student IDs or Certificate Awards for employment or institutional processing." 
        accentColor={S.emerald} 
      />
      <Container>
        <div style={{ maxWidth: "700px", margin: "0 auto 80px" }}>
          
          {/* ─── LOOKUP TOGGLE ─── */}
          <div style={{ display: "flex", background: "rgba(1,30,64,0.05)", padding: "6px", borderRadius: "14px", marginBottom: "30px" }}>
            <button 
              onClick={() => { setLookupType("certificate"); setResult(null); }}
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: lookupType === "certificate" ? S.white : "transparent", color: S.navy, fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: lookupType === "certificate" ? "0 4px 10px rgba(0,0,0,0.05)" : "none", transition: "0.2s" }}
            >
              Verify Certificate
            </button>
            <button 
              onClick={() => { setLookupType("student"); setResult(null); }}
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: lookupType === "student" ? S.white : "transparent", color: S.navy, fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: lookupType === "student" ? "0 4px 10px rgba(0,0,0,0.05)" : "none", transition: "0.2s" }}
            >
              Verify Student ID
            </button>
          </div>

          <Reveal>
            <div style={{ background: S.white, borderRadius: "24px", padding: "40px", border: `1px solid ${S.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: lookupType === "certificate" ? "1fr 1fr" : "1fr", gap: "20px", marginBottom: "30px" }}>
                <div>
                  <label style={labelStyle}>Student ID Number</label>
                  <input
                    type="text" 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value.toUpperCase())} 
                    placeholder="CTSETSS-XXXXX"
                    style={{ ...inputStyle, borderColor: studentId.trim() ? S.emerald : S.border }}
                  />
                </div>
                {lookupType === "certificate" && (
                  <div>
                    <label style={labelStyle}>Certificate Reference</label>
                    <input
                      type="text" 
                      value={certNum} 
                      onChange={e => setCertNum(e.target.value.toUpperCase())} 
                      placeholder="CTS-CERT-XXXXX"
                      style={{ ...inputStyle, borderColor: certNum.trim() ? S.emerald : S.border }}
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={handleVerify} 
                disabled={loading || !studentId.trim() || (lookupType === "certificate" && !certNum.trim())}
                style={{ width: "100%", padding: "18px", borderRadius: "14px", background: S.navy, color: S.white, border: "none", fontSize: "16px", fontWeight: "800", cursor: "pointer", transition: "0.2s", boxShadow: `0 8px 20px ${S.navy}30` }}
              >
                {loading ? "Accessing Registry..." : `Verify ${lookupType === "certificate" ? "Certificate" : "Enrollment Status"}`}
              </button>

              {/* ─── DYNAMIC RESULT CARDS ─── */}
              {result && (
                <div style={{ marginTop: "40px", animation: "fadeIn 0.3s ease-out" }}>
                  {result.valid ? (
                    <div style={{ padding: "30px", borderRadius: "20px", background: lookupType === "certificate" ? S.navy : S.white, border: `2px solid ${S.emerald}`, position: "relative" }}>
                      
                      {/* Status Header */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: S.emerald, color: S.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>✓</div>
                        <div>
                          <div style={{ fontWeight: "800", color: lookupType === "certificate" ? S.white : S.navy, fontSize: "18px", fontFamily: S.heading }}>Record Verified</div>
                          <div style={{ fontSize: "12px", color: lookupType === "certificate" ? S.emeraldLight : S.emerald }}>Status: {result.status || "Active Student"}</div>
                        </div>
                      </div>

                      {/* Detail Grid */}
                      <div style={{ display: "grid", gap: "12px" }}>
                        {[
                          ["Student Name", result.name], //
                          ["Programme", result.programme], //
                          ["Current Level", result.level], //
                          ["Enrollment Date", result.enrollmentDate || result.date], //
                          lookupType === "certificate" ? ["Certificate Ref", result.ref] : ["Student ID", studentId] //
                        ].map(([k, v]) => v && (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${lookupType === "certificate" ? "rgba(255,255,255,0.1)" : S.border}`, paddingBottom: "8px" }}>
                            <span style={{ fontSize: "13px", color: lookupType === "certificate" ? "rgba(255,255,255,0.6)" : S.gray }}>{k}</span>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: lookupType === "certificate" ? S.white : S.navy }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "30px", borderRadius: "20px", background: S.roseLight, border: `2px solid ${S.rose}40`, textAlign: "center" }}>
                      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
                      <div style={{ fontWeight: "800", color: S.roseDark, fontFamily: S.heading, fontSize: "18px" }}>Verification Failed</div>
                      <p style={{ fontSize: "14px", color: S.navy, marginTop: "8px", lineHeight: "1.6" }}>
                        We could not verify this {lookupType}. Please ensure the ID and Reference numbers are entered exactly as shown on the document.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>
        
        <TrustSection />
        <PageScripture page="verify" />
      </Container>
    </PageWrapper>
  );
}