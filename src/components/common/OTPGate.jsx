// ═══════════════════════════════════════════════════════════════════════════
// OTPGate.jsx — Reusable Two-Factor Verification Component
// ═══════════════════════════════════════════════════════════════════════════
// Place at: src/components/common/OTPGate.jsx
//
// Usage:
//   import OTPGate from "../components/common/OTPGate";
//
//   <OTPGate purpose="status_check" title="Check Application Status">
//     {(identifier) => (
//       <YourProtectedContent identifier={identifier} />
//     )}
//   </OTPGate>
//
// Props:
//   purpose    — "status_check" | "portal" | "payment" (determines email wording)
//   title      — heading shown above the ID input (e.g. "Check Application Status")
//   subtitle   — optional smaller text below the heading
//   children   — render prop function: (identifier) => <JSX />
//                 identifier = the verified APP ref or Student ID
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";
import S from "../../constants/styles";
import { APPS_SCRIPT_URL } from "../../constants/config";

const EXPIRY_MINUTES = 5;

export default function OTPGate({ purpose = "status_check", title, subtitle, children }) {
  // ── State machine: "id_entry" → "code_entry" → "verified" ──
  const [step, setStep] = useState("id_entry");
  const [identifier, setIdentifier] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(0);
  const digitRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const cooldownRef = useRef(null);
  const expiryRef = useRef(null);

  // ── Cooldown timer (resend button) ──
  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [cooldown]);

  // ── Expiry countdown ──
  useEffect(() => {
    if (expiryCountdown <= 0) return;
    expiryRef.current = setInterval(() => {
      setExpiryCountdown(prev => {
        if (prev <= 1) { clearInterval(expiryRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(expiryRef.current);
  }, [expiryCountdown]);

  // ── STEP 1: Send OTP ──
  const handleSendOTP = useCallback(async (resend = false) => {
    const id = identifier.trim().toUpperCase();
    if (!id) { setError("Please enter your Application Number or Student ID."); return; }

    setLoading(true);
    setError("");

    try {
      const url = APPS_SCRIPT_URL + "?action=sendOTP&identifier=" + encodeURIComponent(id) + "&purpose=" + purpose;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setMaskedEmail(data.maskedEmail || "your registered email");
        setStep("code_entry");
        setCooldown(60);
        setExpiryCountdown(EXPIRY_MINUTES * 60);
        setCode(["", "", "", "", "", ""]);
        // Auto-focus first digit
        setTimeout(() => { if (digitRefs[0].current) digitRefs[0].current.focus(); }, 100);
      } else {
        if (data.error === "cooldown" && data.retryAfter) {
          setCooldown(data.retryAfter);
          if (!resend) setStep("code_entry"); // still show code entry if first send hit cooldown
        }
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [identifier, purpose]);

  // ── STEP 2: Verify OTP ──
  const handleVerifyOTP = useCallback(async (codeStr) => {
    const fullCode = codeStr || code.join("");
    if (fullCode.length !== 6) { setError("Please enter all 6 digits."); return; }

    setLoading(true);
    setError("");

    try {
      const url = APPS_SCRIPT_URL + "?action=verifyOTP&identifier=" + encodeURIComponent(identifier.trim().toUpperCase())
        + "&code=" + encodeURIComponent(fullCode) + "&purpose=" + purpose;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.verified) {
        setStep("verified");
      } else {
        setError(data.message || "Incorrect code. Please try again.");
        // Clear code on wrong attempt
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => { if (digitRefs[0].current) digitRefs[0].current.focus(); }, 100);

        if (data.error === "locked" && data.retryAfter) {
          setCooldown(data.retryAfter);
        }
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [code, identifier, purpose]);

  // ── Digit input handlers ──
  const handleDigitChange = (index, value) => {
    // Only accept single digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    // Auto-advance to next box
    if (digit && index < 5 && digitRefs[index + 1].current) {
      digitRefs[index + 1].current.focus();
    }

    // Auto-submit when all 6 digits entered
    if (digit && index === 5) {
      const full = newCode.join("");
      if (full.length === 6) {
        handleVerifyOTP(full);
      }
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0 && digitRefs[index - 1].current) {
      digitRefs[index - 1].current.focus();
    }
    if (e.key === "Enter") {
      const full = code.join("");
      if (full.length === 6) handleVerifyOTP(full);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    for (let i = 0; i < 6; i++) newCode[i] = pasted[i] || "";
    setCode(newCode);
    // Focus last filled or submit
    const lastIdx = Math.min(pasted.length, 5);
    if (digitRefs[lastIdx].current) digitRefs[lastIdx].current.focus();
    if (pasted.length === 6) handleVerifyOTP(pasted);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m + ":" + String(s).padStart(2, "0");
  };

  // ── Styles ──
  const cardStyle = {
    maxWidth: 480, margin: "0 auto", background: "#fff", borderRadius: 16,
    padding: "clamp(28px,4vw,40px)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)",
    border: "1px solid rgba(1,30,64,0.06)"
  };
  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 10,
    border: "1.5px solid rgba(1,30,64,0.15)", background: "#fff",
    fontSize: 15, fontFamily: S.body, color: S.navy, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    letterSpacing: 0.5
  };
  const btnStyle = {
    width: "100%", padding: "14px 24px", borderRadius: 10,
    background: S.navy, color: S.gold, border: "none",
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: S.body, transition: "all 0.2s",
    opacity: loading ? 0.7 : 1, letterSpacing: 0.3
  };
  const digitStyle = (filled) => ({
    width: 48, height: 56, borderRadius: 10, textAlign: "center",
    fontSize: 24, fontWeight: 800, fontFamily: "'Courier New', monospace",
    color: S.navy, border: filled ? "2px solid " + S.gold : "2px solid rgba(1,30,64,0.15)",
    background: filled ? "rgba(196,145,18,0.04)" : "#fff",
    outline: "none", transition: "all 0.2s", caretColor: S.gold
  });
  const labelStyle = {
    fontSize: 11, color: "#4A5568", fontWeight: 700, fontFamily: S.body,
    display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5
  };

  // ═════════════════════════════════════════════
  // RENDER: STEP 1 — Enter Application/Student ID
  // ═════════════════════════════════════════════
  if (step === "id_entry") {
    return (
      <div style={cardStyle}>
        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
            background: "rgba(1,30,64,0.04)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24
          }}>🔐</div>
          <h3 style={{
            fontFamily: S.heading, fontSize: "clamp(18px,3vw,22px)", fontWeight: 800,
            color: S.navy, margin: "0 0 6px"
          }}>{title || "Identity Verification"}</h3>
          {subtitle && (
            <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, margin: 0, lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* How it works */}
        <div style={{
          padding: "12px 16px", borderRadius: 10, background: "rgba(196,145,18,0.04)",
          border: "1px solid rgba(196,145,18,0.12)", marginBottom: 20
        }}>
          <div style={{ fontSize: 11, color: S.navy, fontFamily: S.body, lineHeight: 1.7 }}>
            <strong>How it works:</strong> Enter your Application Number or Student ID.
            We'll send a <strong>6-digit verification code</strong> to the email registered
            with your application. Enter the code to continue.
          </div>
        </div>

        {/* ID Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Application Number or Student ID</label>
          <input
            type="text"
            value={identifier}
            onChange={e => { setIdentifier(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleSendOTP(); }}
            placeholder="e.g. APP-APR2026-0012 or CTSETS-2026-04-0012"
            style={inputStyle}
            autoFocus
            autoComplete="off"
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, background: "#fff3f3",
            border: "1px solid #ffcdd2", marginBottom: 14,
            fontSize: 12, color: "#c62828", fontFamily: S.body, lineHeight: 1.5
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button onClick={() => handleSendOTP()} disabled={loading} style={btnStyle}>
          {loading ? "Sending Code..." : "Send Verification Code →"}
        </button>

        {/* Help */}
        <p style={{
          fontSize: 11, color: S.gray, fontFamily: S.body, textAlign: "center",
          marginTop: 14, lineHeight: 1.5
        }}>
          Can't find your number? Check your confirmation email or contact{" "}
          <a href="mailto:info@ctsetsjm.com" style={{ color: S.gold, fontWeight: 700 }}>info@ctsetsjm.com</a>
        </p>
      </div>
    );
  }

  // ═════════════════════════════════════════════
  // RENDER: STEP 2 — Enter 6-Digit Code
  // ═════════════════════════════════════════════
  if (step === "code_entry") {
    return (
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
            background: "rgba(46,125,50,0.06)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24
          }}>📧</div>
          <h3 style={{
            fontFamily: S.heading, fontSize: "clamp(18px,3vw,22px)", fontWeight: 800,
            color: S.navy, margin: "0 0 8px"
          }}>Check Your Email</h3>
          <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, margin: 0, lineHeight: 1.6 }}>
            We've sent a 6-digit code to <strong style={{ color: S.navy }}>{maskedEmail}</strong>
          </p>
        </div>

        {/* Identifier display */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "8px 16px", borderRadius: 8, background: "rgba(1,30,64,0.03)",
          marginBottom: 20
        }}>
          <span style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>Verifying:</span>
          <span style={{
            fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, letterSpacing: 0.5
          }}>{identifier.trim().toUpperCase()}</span>
        </div>

        {/* 6 digit boxes */}
        <div style={{
          display: "flex", gap: "clamp(6px,1.5vw,10px)", justifyContent: "center", marginBottom: 16
        }}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={digitRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleDigitKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              onFocus={e => e.target.select()}
              style={digitStyle(!!digit)}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Expiry countdown */}
        {expiryCountdown > 0 && (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <span style={{
              fontSize: 12, fontFamily: S.body,
              color: expiryCountdown < 60 ? "#c62828" : S.gray
            }}>
              Code expires in <strong>{formatTime(expiryCountdown)}</strong>
            </span>
          </div>
        )}
        {expiryCountdown === 0 && step === "code_entry" && (
          <div style={{
            textAlign: "center", marginBottom: 14, padding: "8px 14px",
            borderRadius: 8, background: "#fff3f3", border: "1px solid #ffcdd2"
          }}>
            <span style={{ fontSize: 12, color: "#c62828", fontFamily: S.body, fontWeight: 600 }}>
              Code expired. Please request a new one.
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, background: "#fff3f3",
            border: "1px solid #ffcdd2", marginBottom: 14,
            fontSize: 12, color: "#c62828", fontFamily: S.body, lineHeight: 1.5
          }}>
            {error}
          </div>
        )}

        {/* Verify button */}
        <button
          onClick={() => handleVerifyOTP()}
          disabled={loading || code.join("").length !== 6}
          style={{
            ...btnStyle,
            background: code.join("").length === 6 ? "#2E7D32" : "rgba(1,30,64,0.15)",
            color: code.join("").length === 6 ? "#fff" : S.gray,
            cursor: code.join("").length === 6 && !loading ? "pointer" : "not-allowed"
          }}
        >
          {loading ? "Verifying..." : "Verify Code →"}
        </button>

        {/* Resend + Back */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 16, flexWrap: "wrap", gap: 8
        }}>
          <button
            onClick={() => { setStep("id_entry"); setError(""); setCode(["", "", "", "", "", ""]); }}
            style={{
              background: "none", border: "none", fontSize: 12, color: S.gray,
              cursor: "pointer", fontFamily: S.body, padding: "4px 0",
              textDecoration: "underline"
            }}
          >
            ← Change Number
          </button>
          <button
            onClick={() => handleSendOTP(true)}
            disabled={cooldown > 0 || loading}
            style={{
              background: "none", border: "none", fontSize: 12,
              color: cooldown > 0 ? S.gray : S.gold, fontWeight: 700,
              cursor: cooldown > 0 ? "not-allowed" : "pointer",
              fontFamily: S.body, padding: "4px 0"
            }}
          >
            {cooldown > 0 ? "Resend in " + cooldown + "s" : "Resend Code"}
          </button>
        </div>

        {/* Security note */}
        <div style={{
          marginTop: 20, padding: "10px 14px", borderRadius: 8,
          background: "rgba(196,145,18,0.04)", border: "1px solid rgba(196,145,18,0.1)"
        }}>
          <p style={{ fontSize: 11, color: S.gray, fontFamily: S.body, margin: 0, lineHeight: 1.6 }}>
            🔒 CTS ETS will <strong>never</strong> call or WhatsApp you asking for this code.
            If you didn't request this, ignore the email.
          </p>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════
  // RENDER: STEP 3 — Verified → Show protected content
  // ═════════════════════════════════════════════
  if (step === "verified") {
    return (
      <>
        {/* Verified banner */}
        <div style={{
          maxWidth: 480, margin: "0 auto 20px", padding: "10px 16px", borderRadius: 10,
          background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.15)",
          display: "flex", alignItems: "center", gap: 10
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <div>
            <span style={{
              fontSize: 12, fontWeight: 700, color: "#2E7D32", fontFamily: S.body
            }}>Identity Verified</span>
            <span style={{
              fontSize: 11, color: S.gray, fontFamily: S.body, marginLeft: 8
            }}>{identifier.trim().toUpperCase()}</span>
          </div>
        </div>
        {/* Render the protected content via render prop */}
        {typeof children === "function" ? children(identifier.trim().toUpperCase()) : children}
      </>
    );
  }

  return null;
}
