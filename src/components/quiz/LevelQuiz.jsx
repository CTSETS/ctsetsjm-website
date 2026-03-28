// ─── WHAT LEVEL AM I? QUIZ ──────────────────────────────────────────
// 5-question interactive quiz that recommends a starting level
// Reduces decision paralysis for first-time visitors
import { useState } from "react";
import S from "../../constants/styles";
import { CAREER_OUTCOMES } from "../../constants/programmes";
import { trackQuizCompleted } from "../../utils/analytics";

const QUESTIONS = [
  {
    q: "What is your highest qualification?",
    options: [
      { label: "No formal qualifications", points: 0 },
      { label: "1–2 CXC/CSEC subjects (or equivalent)", points: 1 },
      { label: "3–4 CXC/CSEC subjects", points: 2 },
      { label: "5+ CXC/CSEC, CAPE, or A-Levels", points: 3 },
      { label: "Associate degree, diploma, or NVQ-J Level 3+", points: 4 },
      { label: "Bachelor's degree or higher", points: 5 },
    ],
  },
  {
    q: "How many years of work experience do you have?",
    options: [
      { label: "None / less than 1 year", points: 0 },
      { label: "1–3 years", points: 1 },
      { label: "3–5 years", points: 2 },
      { label: "5–10 years", points: 3 },
      { label: "10+ years", points: 4 },
    ],
  },
  {
    q: "What best describes your career goal?",
    options: [
      { label: "Get my first job or entry-level position", points: 0 },
      { label: "Get a formal qualification for my current role", points: 1 },
      { label: "Move into a supervisory or team lead position", points: 2 },
      { label: "Become a manager or department head", points: 3 },
      { label: "Reach senior management or executive level", points: 5 },
    ],
  },
  {
    q: "How much time can you dedicate to studying per week?",
    options: [
      { label: "2–4 hours", points: 0 },
      { label: "5–8 hours", points: 1 },
      { label: "8–12 hours", points: 2 },
      { label: "12+ hours", points: 3 },
    ],
  },
  {
    q: "Which field interests you most?",
    options: [
      { label: "Customer service / call centre", value: "cs", points: 0 },
      { label: "Office administration / secretarial", value: "admin", points: 0 },
      { label: "Security operations", value: "security", points: 0 },
      { label: "Business management / entrepreneurship", value: "business", points: 0 },
      { label: "Human resources", value: "hr", points: 0 },
      { label: "Data entry / ICT / digital skills", value: "ict", points: 0 },
    ],
  },
];

const RESULTS = [
  { maxPoints: 3, level: "Job Certificate", color: S.emerald, desc: "Perfect starting point — no qualifications needed. Build foundational skills in 2–3 months and qualify for Level 2.", programmes: ["Customer Service Rep — Admin Asst.", "Team Leader", "Data Entry Processor", "ICT Proficiency"] },
  { maxPoints: 6, level: "Level 2 — Vocational Certificate", color: S.teal, desc: "You're ready for structured vocational training. Earn a nationally recognised certificate in 6 months.", programmes: ["Customer Service", "Entrepreneurship", "Administrative Assistance", "Industrial Security Operations"] },
  { maxPoints: 10, level: "Level 3 — Diploma", color: S.violet, desc: "Time to step into supervisory and management roles. A diploma in 7 months opens real doors.", programmes: ["Customer Service Supervision", "Business Administration — Management", "Supervisory Management"] },
  { maxPoints: 14, level: "Level 4 — Associate Equivalent", color: S.coral, desc: "You're ready for advanced professional qualifications. Strategic management and HR roles await.", programmes: ["Human Resource Management", "Business Administration — Management"] },
  { maxPoints: 99, level: "Level 5 — Bachelor's Equivalent", color: S.rose, desc: "Executive-level qualifications. Policy, strategy, and organisational leadership.", programmes: ["Human Resource Management", "Business Administration Management"] },
];

export default function LevelQuiz({ setPage }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [field, setField] = useState(null);

  const selectAnswer = (option) => {
    const newAnswers = [...answers, option];
    // Track field interest from last question
    if (step === 4 && option.value) setField(option.value);
    if (step < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      // Calculate result
      const totalPoints = newAnswers.reduce((sum, a) => sum + a.points, 0);
      const rec = RESULTS.find((r) => totalPoints <= r.maxPoints) || RESULTS[RESULTS.length - 1];
      setResult(rec);
      setAnswers(newAnswers);
      trackQuizCompleted(rec.level);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); setField(null); };

  if (result) {
    const outcome = CAREER_OUTCOMES[result.level.split(" —")[0]] || {};
    return (
      <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,40px)", border: "2px solid " + result.color + "30", boxShadow: "0 8px 32px " + result.color + "10" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 10, color: result.color, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>Your Recommended Starting Level</div>
          <h3 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3vw,32px)", color: S.navy, fontWeight: 800, margin: "0 0 10px" }}>{result.level}</h3>
          <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>{result.desc}</p>
        </div>
        {/* Career outcome data */}
        {outcome.salaryRange && (
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ padding: "12px 20px", borderRadius: 10, background: result.color + "10", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: result.color, fontFamily: S.body, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Salary Range</div>
              <div style={{ fontFamily: S.heading, fontSize: 18, fontWeight: 700, color: S.navy }}>{outcome.salaryRange}</div>
            </div>
          </div>
        )}
        {/* Recommended programmes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, fontWeight: 600, marginBottom: 10, textAlign: "center" }}>Programmes at this level:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {result.programmes.map((p) => (
              <span key={p} style={{ padding: "8px 14px", borderRadius: 8, background: result.color + "10", color: S.navy, fontFamily: S.body, fontSize: 13, fontWeight: 600, border: "1px solid " + result.color + "20" }}>{p}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("Programmes")} style={{ padding: "14px 32px", borderRadius: 8, background: result.color, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>View {result.level} Programmes</button>
          <button onClick={() => setPage("Apply")} style={{ padding: "14px 32px", borderRadius: 8, background: S.navy, color: S.gold, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Apply Now</button>
          <button onClick={reset} style={{ padding: "14px 24px", borderRadius: 8, background: "transparent", border: "2px solid " + S.navy + "20", color: S.gray, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>Retake Quiz</button>
        </div>
      </div>
    );
  }

  const current = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,40px)", border: "1px solid " + S.border, boxShadow: "0 4px 24px rgba(1,30,64,0.06)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: S.teal, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>Not sure where to start?</div>
        <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, fontWeight: 700, margin: "0 0 6px" }}>What Level Am I?</h3>
        <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>Answer 5 quick questions and we'll recommend your ideal starting level.</p>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: S.lightBg, borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ width: progress + "%", height: "100%", background: `linear-gradient(90deg, ${S.teal}, ${S.violet})`, borderRadius: 2, transition: "width 0.3s ease" }} />
      </div>
      {/* Question */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: S.grayLight, fontFamily: S.body, marginBottom: 8 }}>Question {step + 1} of {QUESTIONS.length}</div>
        <h4 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 16 }}>{current.q}</h4>
      </div>
      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {current.options.map((opt, i) => (
          <button key={i} onClick={() => selectAnswer(opt)} style={{
            padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(1,30,64,0.1)",
            background: "#fff", color: S.navy, fontSize: 14, fontWeight: 500,
            cursor: "pointer", fontFamily: S.body, textAlign: "left", transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = S.teal; e.currentTarget.style.background = S.tealLight; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(1,30,64,0.1)"; e.currentTarget.style.background = "#fff"; }}
          >{opt.label}</button>
        ))}
      </div>
      {step > 0 && <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }} style={{ marginTop: 16, background: "none", border: "none", color: S.grayLight, fontSize: 12, cursor: "pointer", fontFamily: S.body }}>← Back</button>}
    </div>
  );
}
