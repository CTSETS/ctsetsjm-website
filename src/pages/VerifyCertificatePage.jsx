// ─── VERIFY CERTIFICATE PAGE ────────────────────────────────────────
import { useState } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";

export default function VerifyCertificatePage({ setPage }) {
  const [certNum, setCertNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!certNum.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(APPS_SCRIPT_URL + "?action=verifyCert&cert=" + encodeURIComponent(certNum.trim().toUpperCase()));
      if (res.ok) { const data = await res.json(); setResult(data); }
      else setResult({ valid: false });
    } catch { setResult({ valid: false }); }
    setLoading(false);
  };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="For Employers & Institutions" title="Verify a CTS ETS Certificate" desc="Enter a certificate number to confirm its authenticity." accentColor={S.emerald} />
      <Container>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          {/* Info */}
          <Reveal>
            <div style={{ padding: "18px 24px", borderRadius: 12, background: S.tealLight, border: "1px solid " + S.teal + "30", marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body, lineHeight: 1.7, margin: 0 }}>
                Every CTS ETS certificate includes a unique reference number. Enter it below to verify the holder's name, programme, and completion date. This service is free for employers and institutions.
              </p>
            </div>
          </Reveal>

          {/* Lookup form */}
          <Reveal delay={0.1}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border, marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>Certificate Number</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text" value={certNum} onChange={e => setCertNum(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && handleVerify()}
                  placeholder="e.g. CTS-CERT-2026-00001"
                  style={{ flex: 1, padding: "14px 16px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.12)", fontSize: 15, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", letterSpacing: 0.5 }}
                />
                <button onClick={handleVerify} disabled={loading || !certNum.trim()}
                  style={{ padding: "14px 28px", borderRadius: 8, background: certNum.trim() ? S.emerald : "rgba(1,30,64,0.08)", color: certNum.trim() ? "#fff" : S.grayLight, border: "none", fontSize: 14, fontWeight: 700, cursor: certNum.trim() ? "pointer" : "not-allowed", fontFamily: S.body, opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Checking..." : "Verify"}
                </button>
              </div>

              {/* Result */}
              {result && (
                <div style={{ marginTop: 24 }}>
                  {result.valid ? (
                    <div style={{ padding: "24px", borderRadius: 12, background: S.emeraldLight, border: "2px solid " + S.emerald }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>✓</div>
                        <div style={{ fontFamily: S.heading, fontSize: 18, fontWeight: 700, color: S.emeraldDark }}>Certificate Verified</div>
                      </div>
                      {[["Name", result.name], ["Programme", result.programme], ["Level", result.level], ["Completed", result.date], ["Reference", result.ref]].map(([k, v]) => v && (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.emerald + "20", fontSize: 13, fontFamily: S.body }}>
                          <span style={{ color: S.gray }}>{k}</span>
                          <span style={{ color: S.navy, fontWeight: 700 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "20px", borderRadius: 12, background: S.roseLight, border: "2px solid " + S.rose + "50" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <div>
                          <div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.roseDark }}>Certificate Not Found</div>
                          <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, margin: "4px 0 0", lineHeight: 1.6 }}>
                            This certificate number was not found in our system. Check the number and try again, or contact info@ctsetsjm.com for assistance.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ textAlign: "center" }}>
              <Btn onClick={() => setPage("Contact")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Contact Us for Help</Btn>
            </div>
          </Reveal>
        </div>
        <PageScripture page="verify" />
      </Container>
    </PageWrapper>
  );
}
