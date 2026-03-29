import { useState } from "react";
import S from "../../constants/styles";

var STEPS = [
  { title: "Welcome to CTS ETS", emoji: "👋", desc: "Jamaica's Digital Vocational School. We offer 25 nationally recognised programmes — all 100% online and self-paced. Let us show you around.", highlight: "Home" },
  { title: "Our Programmes", emoji: "📚", desc: "From Job Certificate to Bachelor's Equivalent — across business, customer service, HR, security, and more. Each programme leads to an NCTVET qualification.", highlight: "Programmes" },
  { title: "Study On Your Own Time", emoji: "📱", desc: "Self-paced means you study when it suits you — mornings, evenings, weekends, on the bus. Online class days are scheduled for assessment preparation, with advance notice.", highlight: "About" },
  { title: "Student Finance", emoji: "💳", desc: "Fees start from J$10,000 (total). Payment plans available for Levels 3–5. Use the calculator to see exactly what you'll pay — no hidden fees.", highlight: "Fees & Calculator" },
  { title: "Apply — Start With the Next Cohort", emoji: "🎓", desc: "Complete the online application in under 10 minutes. Upload your documents, and we'll review within 48–72 hours. You'll be assigned to the next available cohort.", highlight: "Apply" },
  { title: "We're Here to Help", emoji: "💬", desc: "WhatsApp us at 876-381-9771 or email admin@ctsetsjm.com. Check the FAQ for instant answers to common questions. We respond within 48–72 hours.", highlight: "FAQ" },
];

export default function SiteTour({ onClose, setPage }) {
  var [step, setStep] = useState(0);
  var current = STEPS[step];
  var isLast = step === STEPS.length - 1;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "clamp(60px,10vh,120px)", padding: "clamp(60px,10vh,120px) 20px 20px" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(1,30,64,0.85)", backdropFilter: "blur(4px)" }} />

      {/* Card */}
      <div style={{ position: "relative", background: "#fff", borderRadius: 20, padding: "clamp(28px,4vw,44px)", maxWidth: 480, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.3)", textAlign: "center" }}>
        {/* Skip button */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 13, color: S.gray, cursor: "pointer", fontFamily: S.body, fontWeight: 600 }}>Skip Tour</button>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {STEPS.map(function(_, i) {
            return <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? S.coral : S.border, transition: "all 0.3s" }} />;
          })}
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{current.emoji}</div>

        {/* Content */}
        <h2 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 700, marginBottom: 12 }}>{current.title}</h2>
        <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>{current.desc}</p>

        {/* Step counter */}
        <div style={{ fontSize: 11, color: S.grayLight, fontFamily: S.body, marginBottom: 16 }}>{"Step " + (step + 1) + " of " + STEPS.length}</div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {step > 0 && (
            <button onClick={function() { setStep(step - 1); }}
              style={{ padding: "12px 28px", borderRadius: 8, border: "2px solid " + S.border, background: "#fff", color: S.navy, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
              Back
            </button>
          )}
          {!isLast ? (
            <button onClick={function() { setStep(step + 1); }}
              style={{ padding: "12px 36px", borderRadius: 8, border: "none", background: S.coral, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
              Next
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <button onClick={function() { onClose(); setPage("Apply"); }}
                style={{ width: "100%", padding: "14px 36px", borderRadius: 8, border: "none", background: S.emerald, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
                Start My Application
              </button>
              <button onClick={onClose}
                style={{ width: "100%", padding: "12px 36px", borderRadius: 8, border: "2px solid " + S.border, background: "#fff", color: S.navy, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
