import React, { useState, useRef, useEffect } from "react";
import S from "../../constants/styles";

const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

export default function OTPGate({ purpose, title, text, children }) {
  const [step, setStep] = useState(0);
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const inputRefs = useRef([]);
  const [focused, setFocused] = useState(-1);

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length > 1) { 
      const paste = val.slice(0, 6);
      setOtpCode(paste);
      inputRefs.current[Math.min(paste.length, 5)]?.focus();
      return;
    }
    
    const currentOtp = (otpCode || "").padEnd(6, " ").split("");
    currentOtp[idx] = val || " ";
    const newOtp = currentOtp.join("").trim();
    
    setOtpCode(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && (!otpCode[idx] || otpCode[idx] === " ") && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter" && otpCode.replace(/\s/g, "").length === 6) {
      handleVerify();
    }
  };

  const handleSend = async () => {
    if (!identifier.trim()) return setError("Please enter your ID.");
    setLoading(true); setError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=sendotp&identifier=${encodeURIComponent(identifier.trim().toUpperCase())}&purpose=${purpose}`);
      const data = await res.json();
      if (data.success) {
        setMaskedEmail(data.maskedEmail || "your email");
        setStep(1);
      } else {
        setError("Record not found. Please check your ID and try again.");
      }
    } catch (e) { setError("Network error. Please check your connection."); }
    setLoading(false);
  };

  const handleVerify = async () => {
    const cleanCode = otpCode.replace(/\s/g, "");
    if (cleanCode.length !== 6) return setError("Please enter the 6-digit code.");
    setLoading(true); setError("");
    try {
      const res = await fetch(`${VERCEL_URL}?action=verifyotp&identifier=${encodeURIComponent(identifier.trim().toUpperCase())}&code=${cleanCode}&purpose=${purpose}`);
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.error === "wrong_code" ? "Invalid code." : "Code expired. Please try again.");
      }
    } catch (e) { setError("Network error. Please check your connection."); }
    setLoading(false);
  };

  // Auto-submit perfectly triggered when 6th digit is typed
  useEffect(() => {
    const cleanCode = otpCode.replace(/\s/g, "");
    if (cleanCode.length === 6 && step === 1 && !loading) {
      handleVerify();
    }
  }, [otpCode]);

  if (step === 2) {
    return children(identifier.trim().toUpperCase());
  }

  // 🚀 DYNAMIC LABELS: Adapts perfectly whether it's an applicant or student
  const isStudent = purpose === "portal";
  const inputLabel = isStudent ? "STUDENT ID" : "APPLICATION NUMBER";
  const inputPlaceholder = isStudent ? "CTSETSS-..." : "CTSETSA-...";
  const defaultText = isStudent 
    ? "Enter your Student ID. We'll send a 6-digit verification code to the email registered with your account. Enter the code to continue."
    : "Enter your Application Number. We'll send a 6-digit verification code to the email registered with your application. Enter the code to continue.";

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s" }}>
      {step === 0 ? (
        <>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🔐</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 16 }}>{title}</h2>
          
          <div style={{ background: S.amberLight, border: `1px solid ${S.amber}40`, padding: 16, borderRadius: 12, marginBottom: 24, textAlign: "left", fontSize: 14, color: S.navy, fontFamily: S.body, lineHeight: 1.6 }}>
            <strong>How it works:</strong> {defaultText}
          </div>

          <div style={{ textAlign: "left", marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: S.navy, fontFamily: S.body, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{inputLabel}</label>
            <input 
              type="text" 
              value={identifier} 
              onChange={e => { setIdentifier(e.target.value.toUpperCase()); setError(""); }} 
              onKeyDown={e => e.key === "Enter" && handleSend()} 
              placeholder={inputPlaceholder} 
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: `2px solid ${error ? S.rose : S.border}`, fontSize: 16, fontFamily: S.body, color: S.navy, boxSizing: "border-box", outline: "none", fontWeight: 700, letterSpacing: 1 }} 
            />
          </div>

          {error && <div style={{ padding: "12px", borderRadius: 10, background: S.roseLight, color: S.roseDark, fontSize: 13, marginBottom: 24, fontFamily: S.body, fontWeight: 800, border: `1px solid ${S.rose}50` }}>{error}</div>}
          
          <button onClick={handleSend} disabled={loading || !identifier.trim()} style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: loading || !identifier.trim() ? S.navy + "80" : S.navy, color: "#fff", fontSize: 15, fontWeight: 800, cursor: loading || !identifier.trim() ? "not-allowed" : "pointer", fontFamily: S.body, transition: "all 0.2s" }}>
            {loading ? "Connecting..." : "Send Verification Code →"}
          </button>

          <div style={{ marginTop: 24, fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
            Can't find your number? Check your confirmation email or contact <br/>
            <a href="mailto:info@ctsetsjm.com" style={{ color: S.goldDark, fontWeight: 800, textDecoration: "none" }}>info@ctsetsjm.com</a> <span style={{ opacity: 0.5, margin: "0 4px" }}>|</span> <strong style={{ color: S.goldDark, fontWeight: 800 }}>876-381-9771</strong>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>✉️</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 8 }}>Check Your Email</h2>
          <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, marginBottom: 24 }}>We've sent a 6-digit code to <strong style={{ color: S.navy }}>{maskedEmail}</strong></p>
          
          <div style={{ background: S.lightBg, borderRadius: 10, padding: "10px", marginBottom: 20, fontSize: 13, fontFamily: S.body, color: S.navy, fontWeight: 800 }}>
            <span style={{ color: S.gray, fontWeight: 500, marginRight: 6 }}>Verifying:</span> {identifier}
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "20px 0" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isActive = focused === i;
              const val = otpCode[i] || "";
              const hasVal = val !== "" && val !== " ";
              const borderCol = isActive ? S.teal : hasVal ? S.gold : S.border; 
              return (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  value={val.trim()}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onFocus={() => setFocused(i)}
                  onBlur={() => setFocused(-1)}
                  disabled={loading}
                  style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(50px, 12vw, 60px)", fontSize: 24, fontFamily: "monospace", fontWeight: 800, textAlign: "center", borderRadius: 10, border: `2px solid ${borderCol}`, outline: "none", color: S.navy, background: "#fff", transition: "0.2s", boxShadow: isActive ? `0 0 0 3px ${S.teal}20` : "none", boxSizing: "border-box" }}
                />
              )
            })}
          </div>
          
          {error && <div style={{ padding: "12px", borderRadius: 10, background: S.roseLight, color: S.roseDark, fontSize: 13, marginBottom: 24, fontFamily: S.body, fontWeight: 800, border: `1px solid ${S.rose}50` }}>{error}</div>}
          
          <button disabled={true} style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: loading ? "#529864" : S.border, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "not-allowed", fontFamily: S.body, transition: "all 0.2s" }}>
            {loading ? "Decrypting..." : "Awaiting 6 digits..."}
          </button>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button onClick={() => { setStep(0); setOtpCode(""); setError(""); }} style={{ background: "none", border: "none", color: S.gray, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>&larr; Change ID</button>
            <button onClick={handleSend} disabled={loading} style={{ background: "none", border: "none", color: S.navy, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Resend Code</button>
          </div> 
        </>
      )}
    </div>
  );
}