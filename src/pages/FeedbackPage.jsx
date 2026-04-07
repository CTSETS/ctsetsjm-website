import { useState, useRef } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config";
import {
  Container,
  PageWrapper,
  Btn,
  SectionHeader,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";
import { HoneypotField } from "../components/shared/DisplayComponents";
import { validateEmail } from "../utils/validation";

function StarRating({ value, onChange, label, color = S.gold }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: S.navy,
          fontFamily: S.body,
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: 1.1,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                border: `1.5px solid ${active ? color : "rgba(1,30,64,0.12)"}`,
                background: active ? `${color}18` : "#fff",
                fontSize: 22,
                cursor: "pointer",
                transition: "all 0.18s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: active ? `0 8px 18px ${color}18` : "none",
              }}
            >
              {active ? "★" : "☆"}
            </button>
          );
        })}
        {value > 0 && (
          <span
            style={{
              fontSize: 12,
              color,
              fontFamily: S.body,
              fontWeight: 800,
              marginLeft: 6,
            }}
          >
            {value}/5
          </span>
        )}
      </div>
    </div>
  );
}

function ChoiceChip({ label, active, onClick, color = S.teal }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        border: `1.5px solid ${active ? color : S.border}`,
        background: active ? `${color}16` : "#fff",
        color: active ? color : S.gray,
        fontSize: 13,
        fontWeight: active ? 800 : 700,
        cursor: "pointer",
        fontFamily: S.body,
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}

export default function FeedbackPage({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    programme: "",
    overall: 0,
    content: 0,
    support: 0,
    platform: 0,
    recommend: "",
    comments: "",
  });
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (hp || Date.now() - startTime.current < 3000) return;
    if (!form.name || !validateEmail(form.email) || !form.overall) return;
    setSubmitting(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          form_type: "Student Feedback",
          ...form,
          timestamp: new Date().toISOString(),
        }),
        mode: "no-cors",
      });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: `1.5px solid ${S.border}`,
    fontSize: 14,
    fontFamily: S.body,
    color: S.navy,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 800,
    color: S.navy,
    fontFamily: S.body,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  };

  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 56 }}>
          <Reveal>
            <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: S.violetLight,
                  color: S.violet,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  margin: "0 auto 20px",
                  border: `3px solid ${S.violet}`,
                }}
              >
                💬
              </div>
              <h2
                style={{
                  fontFamily: S.heading,
                  fontSize: "clamp(28px,4vw,40px)",
                  color: S.navy,
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                Thank You, {form.name}!
              </h2>
              <p
                style={{
                  fontFamily: S.body,
                  fontSize: 15,
                  color: S.gray,
                  lineHeight: 1.8,
                  marginBottom: 28,
                }}
              >
                Your feedback helps us strengthen the experience for future learners. Every response matters and helps us improve our programmes, support, and systems.
              </p>

              <div
                style={{
                  background: S.white,
                  borderRadius: 22,
                  padding: 28,
                  border: `1px solid ${S.border}`,
                  boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: S.violet,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: S.body,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  Response Summary
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14 }}>
                  {[
                    ["Overall", form.overall],
                    ["Content", form.content || "—"],
                    ["Support", form.support || "—"],
                    ["Platform", form.platform || "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: S.lightBg, borderRadius: 14, padding: 16 }}>
                      <div style={{ fontFamily: S.heading, fontSize: 24, color: S.goldDark, fontWeight: 800 }}>{v}</div>
                      <div style={{ fontSize: 11, color: S.gray, textTransform: "uppercase", letterSpacing: 1.1, fontWeight: 700, fontFamily: S.body }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Home")} style={{ background: S.coral, color: "#fff", borderRadius: 12 }}>
                  Return Home
                </Btn>
                <Btn onClick={() => setPage("Programmes")} style={{ borderRadius: 12, border: `2px solid ${S.teal}`, color: S.teal }}>
                  Browse Programmes
                </Btn>
              </div>
            </div>
          </Reveal>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper bg={S.lightBg}>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #7C3AED 145%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(14,143,139,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.14), transparent 22%)",
          }}
        />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: S.body,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: S.goldLight,
                marginBottom: 18,
              }}
            >
              Learner Feedback
            </div>
            <h1
              style={{
                fontFamily: S.heading,
                fontSize: "clamp(36px, 6vw, 66px)",
                lineHeight: 1.04,
                color: "#fff",
                fontWeight: 900,
                margin: "0 0 18px",
                maxWidth: 860,
              }}
            >
              Help us improve the CTS ETS learner experience
            </h1>
            <p
              style={{
                fontFamily: S.body,
                fontSize: "clamp(15px, 2vw, 19px)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 780,
                margin: 0,
              }}
            >
              This upgrade keeps the same feedback form, ratings, honeypot protection, validation, and Apps Script submit flow — but presents it in a calmer, more premium way that encourages thoughtful responses.
            </p>
          </Reveal>
        </Container>
      </div>

      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}>
        <Reveal>
          <SocialProofBar />
        </Reveal>
      </Container>

      <SectionHeader
        tag="Your Voice Matters"
        title="Tell us what worked well and what we can improve"
        desc="The goal here is not just to collect ratings. It is to make learners feel that their experience is being heard and used to strengthen the institution."
        accentColor={S.violet}
      />

      <Container>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />

          <Reveal>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: "34px clamp(22px,4vw,38px)",
                border: `1px solid ${S.border}`,
                boxShadow: "0 14px 34px rgba(15,23,42,0.04)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 20px",
                }}
                className="resp-grid-2"
              >
                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>
                    Your Name <span style={{ color: S.coral }}>*</span>
                  </label>
                  <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>
                    Email Address <span style={{ color: S.coral }}>*</span>
                  </label>
                  <input type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" />
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Programme Completed</label>
                <input style={inputStyle} value={form.programme} onChange={(e) => set("programme", e.target.value)} placeholder="e.g. Level 3 — Business Administration" />
              </div>

              <div style={{ marginTop: 8, paddingTop: 22, borderTop: `1px solid ${S.border}` }}>
                <div style={{ fontSize: 11, color: S.goldDark, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 18 }}>
                  Ratings
                </div>
                <StarRating label="Overall Experience *" value={form.overall} onChange={(v) => set("overall", v)} color={S.gold} />
                <StarRating label="Learning Content Quality" value={form.content} onChange={(v) => set("content", v)} color={S.teal} />
                <StarRating label="Support & Communication" value={form.support} onChange={(v) => set("support", v)} color={S.coral} />
                <StarRating label="Learning Platform" value={form.platform} onChange={(v) => set("platform", v)} color={S.violet} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={labelStyle}>Would you recommend CTS ETS?</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["Definitely", "Probably", "Not Sure", "Probably Not"].map((opt) => (
                    <ChoiceChip key={opt} label={opt} active={form.recommend === opt} onClick={() => set("recommend", opt)} color={S.teal} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Additional Comments</label>
                <textarea
                  style={{ ...inputStyle, height: 120, resize: "vertical", lineHeight: 1.7 }}
                  value={form.comments}
                  onChange={(e) => set("comments", e.target.value)}
                  placeholder="What did you value most? What could we improve?"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !form.name || !validateEmail(form.email) || !form.overall}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: 14,
                  border: "none",
                  background: form.name && form.overall ? S.violet : "rgba(1,30,64,0.08)",
                  color: form.name && form.overall ? "#fff" : S.grayLight,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: form.name && form.overall ? "pointer" : "not-allowed",
                  fontFamily: S.body,
                  opacity: submitting ? 0.65 : 1,
                  boxShadow: form.name && form.overall ? `0 10px 24px ${S.violet}28` : "none",
                }}
              >
                {submitting ? "Submitting Feedback..." : "Submit Feedback"}
              </button>
            </div>
          </Reveal>
        </div>
        <PageScripture page="feedback" />
      </Container>
    </PageWrapper>
  );
}
