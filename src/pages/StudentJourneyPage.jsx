import React, { useState } from "react";
import S from "../constants/styles";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
} from "../components/shared/CoreComponents";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  support: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  success: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
};

const STEPS = [
  {
    n: 1,
    title: "Explore and enquire",
    accent: S.sky,
    duration: "Day 1",
    desc: "Browse programmes, review costs, and ask questions before choosing your path.",
    actions: [
      "Browse the programmes page",
      "Review fees and payment plans",
      "Contact the team for guidance if needed",
    ],
  },
  {
    n: 2,
    title: "Apply online",
    accent: S.coral,
    duration: "About 10 minutes",
    desc: "Complete the online form, choose your programme, and upload the required documents.",
    actions: [
      "Complete the online application form",
      "Upload the required documents",
      "Jamaican applicants complete the HEART form step",
    ],
  },
  {
    n: 3,
    title: "Acceptance review",
    accent: S.emerald,
    duration: "48-72 hours",
    desc: "Admissions reviews the application and confirms the next steps once documents are in order.",
    actions: [
      "Admissions reviews your submission",
      "You receive acceptance guidance",
      "Payment instructions are provided",
    ],
  },
  {
    n: 4,
    title: "Payment",
    accent: S.gold,
    duration: "Within 48 hours",
    desc: "Choose the payment plan that fits your situation and submit your payment confirmation.",
    actions: [
      "Choose Gold, Silver, or Bronze",
      "Pay online or by bank transfer",
      "Payment evidence is verified by the team",
    ],
  },
  {
    n: 5,
    title: "Onboarding",
    accent: S.teal,
    duration: "Same day",
    desc: "Once payment is confirmed, learners receive access details and onboarding guidance.",
    actions: [
      "Learning Portal credentials are issued",
      "Digital resources are enabled",
      "Welcome guidance is shared",
    ],
  },
  {
    n: 6,
    title: "Study and learn",
    accent: S.violet,
    duration: "2-9 months",
    desc: "Learners move through the programme at a structured pace with digital materials and support.",
    actions: [
      "Study online at a guided pace",
      "Progress is monitored over time",
      "Support remains available throughout the journey",
    ],
  },
  {
    n: 7,
    title: "Assessment",
    accent: S.amber,
    duration: "Ongoing",
    desc: "Competency-based assessments are completed through evidence, exercises, and guided evaluation.",
    actions: [
      "Complete assessment tasks",
      "Submit portfolio or evidence where required",
      "Receive feedback and next-step guidance",
    ],
  },
  {
    n: 8,
    title: "Completion",
    accent: S.coral,
    duration: "At the end",
    desc: "Learners complete the journey and move toward certification, recognition, and next-step growth.",
    actions: [
      "CTS ETS completion recognition is issued",
      "External certification support is provided where relevant",
      "Learners move into progression or alumni pathways",
    ],
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
        gridTemplateColumns: "minmax(240px, 0.8fr) minmax(320px, 1.2fr)",
        gap: 20,
        alignItems: "end",
        marginBottom: 22,
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
            marginBottom: 12,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(22px, 2.6vw, 30px)",
            lineHeight: 1.1,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 700,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          lineHeight: 1.75,
          color: S.gray,
          margin: 0,
          maxWidth: 720,
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
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
        <button
          onClick={onClick}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: active ? step.accent : isPast ? `${step.accent}18` : S.white,
            border: `1px solid ${active || isPast ? step.accent : S.border}`,
            color: active ? S.white : step.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontFamily: S.body,
            fontWeight: 800,
            flexShrink: 0,
            cursor: "pointer",
            transition: "all 0.22s ease",
            boxShadow: active ? `0 8px 18px ${step.accent}18` : "none",
            padding: 0,
          }}
        >
          {step.n}
        </button>
        <button
          onClick={onClick}
          style={{
            flex: 1,
            textAlign: "left",
            background: S.white,
            border: `1px solid ${active ? step.accent : S.border}`,
            borderRadius: 18,
            padding: active ? "15px 16px" : "12px 14px",
            cursor: "pointer",
            transition: "all 0.22s ease",
            boxShadow: active ? `0 12px 24px ${step.accent}12` : "0 8px 18px rgba(15,23,42,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: active ? 8 : 0 }}>
            <h3 style={{ fontFamily: S.heading, fontSize: active ? 18 : 16, fontWeight: 800, color: S.navy, margin: 0, lineHeight: 1.2 }}>{step.title}</h3>
            <span style={{ fontSize: 10, color: active ? step.accent : S.gray, fontWeight: 800, fontFamily: S.body, background: active ? `${step.accent}14` : "transparent", padding: active ? "6px 10px" : 0, borderRadius: 999, letterSpacing: 1.1, textTransform: "uppercase" }}>{step.duration}</span>
          </div>
          <div style={{ maxHeight: active ? 420 : 0, overflow: "hidden", opacity: active ? 1 : 0, transition: "max-height 0.32s ease, opacity 0.22s ease" }}>
            <div style={{ paddingTop: 6 }}>
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, margin: "0 0 14px" }}>{step.desc}</p>
              <div style={{ background: S.lightBg, padding: "12px 14px", borderRadius: 12, border: `1px solid ${S.border}` }}>
                <div style={{ fontSize: 10, color: S.navy, letterSpacing: 1.6, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>What happens here</div>
                {step.actions.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 999, background: `${step.accent}18`, color: step.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>-</div>
                    <span style={{ fontSize: 13, color: S.navy, fontFamily: S.body, fontWeight: 500, lineHeight: 1.55 }}>{item}</span>
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
      <section style={{ paddingTop: 30, paddingBottom: 18, background: "linear-gradient(135deg, #102543 0%, #17325B 55%, #244D74 100%)" }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 0.92fr)", gap: 18, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: S.goldLight, fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 14 }}>Student Journey</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.08, color: S.white, fontWeight: 900, margin: "0 0 12px", maxWidth: 640 }}>See what happens from enquiry to completion.</h1>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 10, padding: "12px 20px", boxShadow: "0 10px 20px rgba(196,145,18,0.18)" }}>Start Application</Btn>
                  <Btn onClick={() => setPage("Fees & Calculator")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 10, padding: "12px 20px" }}>Review Payment Plans</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 12, boxShadow: "0 12px 26px rgba(2,6,23,0.12)" }}>
                <div style={{ width: "100%", height: 210, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
                  <img src={PEOPLE.hero} alt="Learners beginning a guided online learning journey together" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, color: S.gold, fontWeight: 800, marginBottom: 6 }}>Clarity</div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: S.body, color: S.white }}>A clearer path from enquiry to entry</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, color: S.teal, fontWeight: 800, marginBottom: 6 }}>Progression</div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: S.body, color: S.white }}>A stronger finish with support throughout</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 18 }}>
        <WideWrap>
          <SectionIntro tag="Step by Step" title="Your path from first contact to final completion" desc="" accent={S.teal} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(280px, 0.92fr)", gap: 18, alignItems: "start" }} className="resp-grid-2">
            <div style={{ position: "relative", paddingRight: 6 }}>
              <div style={{ position: "absolute", top: 34, bottom: 34, left: 17, width: 3, background: `linear-gradient(to bottom, ${S.sky}22, ${S.coral}22, ${S.emerald}22, ${S.gold}22, ${S.teal}22, ${S.violet}22, ${S.amber}22, ${S.coral}22)`, borderRadius: 999, zIndex: 0 }} />
              {STEPS.map((step, i) => (
                <JourneyCard key={step.n} step={step} active={active === i} isPast={i < active} onClick={() => setActive(i)} delay={i * 0.03} />
              ))}
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <Reveal>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: 14, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
                  <div style={{ width: "100%", height: 170, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
                    <img src={PEOPLE.support} alt="Learner receiving guidance during the admissions process" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 8 }}>A guided process helps learners move with more confidence</div>
                  
                </div>
              </Reveal>
              <Reveal>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: 16, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontSize: 10, color: S.coral, letterSpacing: 1.6, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>Journey Snapshot</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      ["Apply", "Complete your form and upload your documents."],
                      ["Review", "Wait for your admissions outcome and next-step guidance."],
                      ["Begin", "Pay, onboard, and start the learning journey."],
                    ].map(([title, text], index) => (
                      <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 8, background: index === 0 ? S.skyLight : index === 1 ? S.coralLight : S.goldLight, color: index === 0 ? S.sky : index === 1 ? S.coral : S.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, flexShrink: 0 }}>{title.slice(0, 1)}</div>
                        <div>
                          <div style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 800, marginBottom: 2 }}>{title}</div>
                          <div style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.65 }}>{text}</div>
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

      <section style={{ paddingTop: 22 }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.92fr) minmax(0, 1.08fr)", gap: 18, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: 14, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", height: 170, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
                  <img src={PEOPLE.success} alt="Successful learners celebrating completion together" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 8 }}>Completion should feel intentional, not accidental</div>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: 0 }}>A clearer student journey helps visitors see that the process leads somewhere meaningful: progress, completion, and real growth.</p>
              </div>
            </Reveal>
            <Reveal>
              <div style={{ textAlign: "center", padding: "22px 18px", background: S.navy, borderRadius: 18, borderBottom: `4px solid ${S.gold}`, boxShadow: "0 14px 28px rgba(15,23,42,0.10)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 12 }}>Ready to Begin?</div>
                <h2 style={{ color: S.white, fontFamily: S.heading, margin: "0 0 12px", fontSize: "clamp(20px,2.6vw,26px)", fontWeight: 900, lineHeight: 1.1 }}>Take the first step with more confidence</h2>
                <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(255,255,255,0.76)", lineHeight: 1.75, maxWidth: 640, margin: "0 auto 18px" }}>Start with the right programme, understand your costs, and move into admissions with a clearer sense of what comes next.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: 13, padding: "12px 20px", border: "none", borderRadius: 10, boxShadow: `0 8px 20px ${S.coral}28` }}>Apply Now</Btn>
                  <Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: 13, border: `1px solid ${S.teal}`, color: S.tealLight, background: "transparent", padding: "12px 20px", borderRadius: 10 }}>Check Payment Plans</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 16 }}>
        <PageScripture page="studentJourney" />
      </WideWrap>
    </PageWrapper>
  );
}



