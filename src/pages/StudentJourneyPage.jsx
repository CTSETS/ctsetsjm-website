import React, { useState } from "react";
import S from "../constants/styles";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  support: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  success: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
};

const STEPS = [
  {
    n: 1,
    title: "Explore & Enquire",
    icon: "🔍",
    color: S.sky,
    duration: "Day 1",
    desc: "Browse programmes, review the fee calculator, and ask questions before choosing your path.",
    actions: ["Browse programmes", "Use the fees calculator", "WhatsApp or email the team for guidance"],
  },
  {
    n: 2,
    title: "Apply Online",
    icon: "📝",
    color: S.coral,
    duration: "About 10 minutes",
    desc: "Complete the online application, choose your applicant type, enter your details, select your programme, and upload the required documents.",
    actions: ["Complete the online application form", "Upload the required documents", "Jamaican applicants: HEART form step appears automatically"],
  },
  {
    n: 3,
    title: "Acceptance Review",
    icon: "✉️",
    color: S.emerald,
    duration: "48–72 hours",
    desc: "Admissions reviews your submission. Once your documents are in order, you receive acceptance guidance, your student reference, and payment instructions.",
    actions: ["Documents reviewed by admissions", "Acceptance communication sent", "Payment instructions provided"],
  },
  {
    n: 4,
    title: "Payment",
    icon: "💳",
    color: S.gold,
    duration: "Within 48 hours",
    desc: "Choose the payment path that fits your situation. Gold, Silver, and Bronze options help learners manage enrolment realistically.",
    actions: ["Choose Gold, Silver, or Bronze plan", "Pay online or via bank transfer", "Payment evidence verified by the team"],
  },
  {
    n: 5,
    title: "Onboarding",
    icon: "🎓",
    color: S.teal,
    duration: "Same day",
    desc: "Once payment is confirmed, you receive your access details and begin the onboarding process into the learner environment.",
    actions: ["Learning Portal credentials issued", "Access to digital resources enabled", "Welcome guidance shared"],
  },
  {
    n: 6,
    title: "Study & Learn",
    icon: "📚",
    color: S.violet,
    duration: "2–9 months",
    desc: "Learners move through the programme at a structured pace, supported by digital content, assessment guidance, and ongoing communication.",
    actions: ["Self-paced online study", "Progress monitored over time", "Support available when needed"],
  },
  {
    n: 7,
    title: "Assessment",
    icon: "📋",
    color: S.amber,
    duration: "Ongoing",
    desc: "Assessments are completed throughout the learning journey using portfolio evidence, exercises, and competency-based checks.",
    actions: ["Competency-based assessment tasks", "Portfolio or evidence submission", "Feedback and guidance from the assessor"],
  },
  {
    n: 8,
    title: "Graduation",
    icon: "🏆",
    color: S.coral,
    duration: "Completion",
    desc: "The learner completes the journey, receives institutional recognition, and progresses toward external certification where applicable.",
    actions: ["CTS ETS certificate issued", "External certification pathway where relevant", "Transition into alumni or next-step growth"],
  },
];

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(18px, 3vw, 40px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionIntro({ tag, title, desc, accent = S.teal }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 0.82fr) minmax(320px, 1.18fr)",
        gap: 30,
        alignItems: "end",
        marginBottom: 28,
      }}
      className="resp-grid-2"
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: `${accent}12`,
            color: accent,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: S.body,
            marginBottom: 14,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(30px, 4vw, 50px)",
            lineHeight: 1.06,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 760,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 16,
          lineHeight: 1.85,
          color: S.gray,
          margin: 0,
          maxWidth: 860,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function JourneyCard({ step, active, isPast, onClick, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start", position: "relative", zIndex: 1, marginBottom: 18 }}>
        <button
          onClick={onClick}
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            background: active ? step.color : isPast ? `${step.color}18` : S.white,
            border: `3px solid ${active ? S.white : isPast ? step.color : S.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            flexShrink: 0,
            cursor: "pointer",
            transition: "all 0.28s ease",
            boxShadow: active ? `0 0 0 4px ${step.color}30, 0 12px 28px ${step.color}24` : "0 6px 14px rgba(15,23,42,0.05)",
            filter: !active && !isPast ? "grayscale(100%) opacity(0.55)" : "none",
            padding: 0,
          }}
        >
          {step.icon}
        </button>
        <button
          onClick={onClick}
          style={{
            flex: 1,
            textAlign: "left",
            background: active ? S.white : "transparent",
            border: `1px solid ${active ? step.color : "transparent"}`,
            borderRadius: 22,
            padding: active ? "24px 28px" : "18px 20px",
            cursor: "pointer",
            transition: "all 0.28s ease",
            boxShadow: active ? `0 16px 34px ${step.color}14` : "none",
            transform: active ? "scale(1.015)" : "scale(1)",
            transformOrigin: "left center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: active ? 10 : 0 }}>
            <h3 style={{ fontFamily: S.heading, fontSize: active ? 24 : 18, fontWeight: 800, color: active ? S.navy : S.gray, margin: 0, lineHeight: 1.2 }}><span style={{ color: active ? step.color : S.grayLight, marginRight: 8 }}>{step.n}.</span>{step.title}</h3>
            <span style={{ fontSize: 11, color: active ? step.color : S.gray, fontWeight: 800, fontFamily: S.body, background: active ? `${step.color}14` : "transparent", padding: active ? "7px 12px" : 0, borderRadius: 999, letterSpacing: 1.2, textTransform: "uppercase" }}>{step.duration}</span>
          </div>
          <div style={{ maxHeight: active ? 420 : 0, overflow: "hidden", opacity: active ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.28s ease" }}>
            <div style={{ paddingTop: 8 }}>
              <p style={{ fontFamily: S.body, fontSize: 15, color: "#334155", lineHeight: 1.8, margin: "0 0 18px" }}>{step.desc}</p>
              <div style={{ background: S.lightBg, padding: "16px 18px", borderRadius: 14, border: `1px solid ${S.border}` }}>
                <div style={{ fontSize: 11, color: S.navy, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>What happens here</div>
                {step.actions.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: `${step.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ color: step.color, fontWeight: 900, fontSize: 10 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, color: S.navy, fontFamily: S.body, fontWeight: 500, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>
    </Reveal>
  );
}

export default function StudentJourneyPage({ setPage }) {
  const [active, setActive] = useState(0);

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(380px, 0.95fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Student Journey</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>See exactly what happens from enquiry to graduation</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>Follow the full learning journey from first enquiry to final completion, with a clearer sense of what happens, when it happens, and what the learner should expect at each stage.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Start Your Journey</Btn>
                  <Btn onClick={() => setPage("Fees & Calculator")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>Check Payment Plans</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 440, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.hero} alt="Learners beginning a guided online learning journey together" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🧭</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>A clearer path</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🎓</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>A stronger finish</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}>
        <Reveal><SocialProofBar /></Reveal>
      </WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <SectionIntro tag="Step by Step" title="Your path from first contact to final completion" desc="The same journey logic is preserved from your uploaded page, but the wider layout and supporting visuals make the experience easier to scan and more engaging for visitors." accent={S.teal} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.14fr) minmax(320px, 0.86fr)", gap: 24, alignItems: "start" }} className="resp-grid-2">
            <div style={{ position: "relative", paddingRight: 8 }}>
              <div style={{ position: "absolute", top: 42, bottom: 42, left: 29, width: 4, background: `linear-gradient(to bottom, ${S.sky}22, ${S.coral}22, ${S.emerald}22, ${S.gold}22, ${S.teal}22, ${S.violet}22, ${S.amber}22, ${S.coral}22)`, borderRadius: 999, zIndex: 0 }} />
              {STEPS.map((step, i) => (
                <JourneyCard key={step.n} step={step} active={active === i} isPast={i < active} onClick={() => setActive(i)} delay={i * 0.04} />
              ))}
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              <Reveal>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
                  <div style={{ width: "100%", height: 300, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                    <img src={PEOPLE.support} alt="Learner receiving guidance during the admissions process" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>A guided process helps learners move with more confidence</div>
                  <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>From application to onboarding, the learner should always feel informed, supported, and clear about what comes next.</p>
                </div>
              </Reveal>
              <Reveal>
                <div style={{ background: S.lightBg, border: `1px solid ${S.border}`, borderRadius: 24, padding: 22 }}>
                  <div style={{ fontSize: 11, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>Journey Snapshot</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {[
                      ["Apply", "Complete your form and upload your documents"],
                      ["Review", "Wait for your admissions outcome and next-step guidance"],
                      ["Begin", "Pay, onboard, and start your learning journey"],
                    ].map(([title, text]) => (
                      <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 10, background: S.coralLight, color: S.coral, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, flexShrink: 0 }}>{title.slice(0, 1)}</div>
                        <div>
                          <div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 4 }}>{title}</div>
                          <div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7 }}>{text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 48 }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 0.86fr) minmax(0, 1.14fr)", gap: 24, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", height: 320, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                  <img src={PEOPLE.success} alt="Successful learners celebrating completion together" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Completion should feel intentional, not accidental</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>A stronger student journey page helps visitors see that the process leads somewhere meaningful: progress, completion, and real growth.</p>
              </div>
            </Reveal>
            <Reveal>
              <div style={{ textAlign: "center", padding: "46px 28px", background: S.navy, borderRadius: 26, borderBottom: `4px solid ${S.gold}`, boxShadow: "0 20px 44px rgba(15,23,42,0.12)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Ready to Begin?</div>
                <h2 style={{ color: S.white, fontFamily: S.heading, margin: "0 0 14px", fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, lineHeight: 1.1 }}>Take the first step with more confidence</h2>
                <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.74)", lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>Start with the right programme, understand your costs, and move into the admissions process with a clearer sense of what comes next.</p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: 16, padding: "16px 40px", border: "none", borderRadius: 14, boxShadow: `0 8px 24px ${S.coral}30` }}>Apply Now</Btn>
                  <Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: 16, border: `2px solid ${S.teal}`, color: S.tealLight, background: "transparent", padding: "16px 40px", borderRadius: 14 }}>Check Payment Plans</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 18 }}>
        <PageScripture page="studentJourney" />
      </WideWrap>
    </PageWrapper>
  );
}
