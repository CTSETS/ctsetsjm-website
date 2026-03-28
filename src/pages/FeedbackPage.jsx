// ─── FEEDBACK PAGE ──────────────────────────────────────────────────
import { useState, useRef } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { HoneypotField } from "../components/shared/DisplayComponents";
import { validateEmail } from "../utils/validation";

function StarRating({ value, onChange, label }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}
            style={{ width: 40, height: 40, borderRadius: 8, border: "1.5px solid " + (n <= value ? S.gold : "rgba(1,30,64,0.1)"), background: n <= value ? S.goldLight : "#fff", fontSize: 20, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {n <= value ? "★" : "☆"}
          </button>
        ))}
        {value > 0 && <span style={{ fontSize: 12, color: S.gold, fontFamily: S.body, fontWeight: 700, alignSelf: "center", marginLeft: 8 }}>{value}/5</span>}
      </div>
    </div>
  );
}

export default function FeedbackPage({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", programme: "", overall: 0, content: 0, support: 0, platform: 0, recommend: "", comments: "" });
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (hp || Date.now() - startTime.current < 3000) return;
    if (!form.name || !validateEmail(form.email) || !form.overall) return;
    setSubmitting(true);
    try {
      await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Student Feedback", ...form, timestamp: new Date().toISOString() }), mode: "no-cors" });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <Container style={{ paddingTop: 48 }}>
          <Reveal>
            <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
              <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 700, marginBottom: 12 }}>Thank You, {form.name}!</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, marginBottom: 32 }}>Your feedback helps us improve for every learner. We read every response.</p>
              <Btn primary onClick={() => setPage("Home")} style={{ background: S.coral, color: "#fff" }}>Return Home</Btn>
            </div>
          </Reveal>
        </Container>
      </PageWrapper>
    );
  }

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.12)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1A202C", outline: "none", background: "#fff", boxSizing: "border-box" };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Your Voice Matters" title="Help Us Improve" desc="Your honest feedback shapes the experience for future learners." accentColor={S.violet} />
      <Container>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <HoneypotField value={hp} onChange={e => setHp(e.target.value)} />

          <Reveal>
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border }}>
              {/* Basic info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>Your Name <span style={{ color: S.coral }}>*</span></label>
                  <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>Email <span style={{ color: S.coral }}>*</span></label>
                  <input type="email" style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>Programme Completed</label>
                <input style={inputStyle} value={form.programme} onChange={e => set("programme", e.target.value)} placeholder="e.g. Level 3 — Business Administration" />
              </div>

              <div style={{ borderTop: "1px solid " + S.border, paddingTop: 20, marginTop: 8 }}>
                <StarRating label="Overall Experience *" value={form.overall} onChange={v => set("overall", v)} />
                <StarRating label="Learning Content Quality" value={form.content} onChange={v => set("content", v)} />
                <StarRating label="Support & Communication" value={form.support} onChange={v => set("support", v)} />
                <StarRating label="Learning Platform" value={form.platform} onChange={v => set("platform", v)} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>Would you recommend CTS ETS?</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Definitely", "Probably", "Not Sure", "Probably Not"].map(opt => (
                    <button key={opt} onClick={() => set("recommend", opt)}
                      style={{ padding: "8px 16px", borderRadius: 6, border: form.recommend === opt ? "2px solid " + S.teal : "1px solid rgba(1,30,64,0.1)", background: form.recommend === opt ? S.tealLight : "#fff", fontSize: 12, fontWeight: form.recommend === opt ? 700 : 400, color: form.recommend === opt ? S.teal : S.gray, cursor: "pointer", fontFamily: S.body }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>Additional Comments</label>
                <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.comments} onChange={e => set("comments", e.target.value)} placeholder="What did you like most? What could we improve?" />
              </div>

              <button onClick={handleSubmit} disabled={submitting || !form.name || !validateEmail(form.email) || !form.overall}
                style={{ width: "100%", padding: "16px", borderRadius: 8, border: "none", background: form.name && form.overall ? S.violet : "rgba(1,30,64,0.08)", color: form.name && form.overall ? "#fff" : S.grayLight, fontSize: 15, fontWeight: 700, cursor: form.name && form.overall ? "pointer" : "not-allowed", fontFamily: S.body, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </Reveal>
        </div>
        <PageScripture page="feedback" />
      </Container>
    </PageWrapper>
  );
}
