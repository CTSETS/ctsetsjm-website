// ─── STUDENT JOURNEY PAGE ────────────────────────────────────────────
import { useState } from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";

const STEPS = [
  { n: 1, title: "Explore & Enquire", icon: "🔍", color: S.sky, duration: "Day 1", desc: "Browse our 25 programmes, use the fees calculator, and contact us with questions. WhatsApp, email, or book a consultation — we're here to help you choose the right path.", actions: ["Browse Programmes", "Use Fees Calculator", "WhatsApp us at 876-381-9771"] },
  { n: 2, title: "Apply Online", icon: "📝", color: S.coral, duration: "10 minutes", desc: "Complete the online application in under 10 minutes. Select your applicant type (Jamaican, Caribbean, or International), fill in your details, choose your programme, and upload your documents.", actions: ["Fill out the application form", "Upload required documents", "Jamaican applicants: HEART form auto-fills for you"] },
  { n: 3, title: "Acceptance", icon: "✉️", color: S.emerald, duration: "24–48 hours", desc: "Our admissions team reviews your documents. If everything checks out, you receive an acceptance email with your student reference number and payment instructions.", actions: ["Documents reviewed by admissions", "Acceptance email sent", "Payment instructions included"] },
  { n: 4, title: "Payment", icon: "💳", color: S.gold, duration: "Within 48 hours", desc: "Choose your payment plan — Gold (full), Silver (60/40), or Bronze (monthly instalments for Levels 3–5). Pay online with Visa/Mastercard or by NCB bank transfer.", actions: ["Choose Gold, Silver, or Bronze plan", "Pay online or via bank transfer", "Receipt confirmation sent"] },
  { n: 5, title: "Onboarding", icon: "🎓", color: S.teal, duration: "Same day", desc: "Receive your Student Portal credentials. Access the CTS ETS Interactive Learning System — audio sessions, intelligent study assistant, learner guides, flashcards, and more.", actions: ["Student Portal access granted", "Interactive Learning System activated", "Welcome email with study guide"] },
  { n: 6, title: "Study & Learn", icon: "📚", color: S.violet, duration: "2–9 months", desc: "Work through your programme at your own pace. Study 6–10 hours per week, use audio sessions during commutes, and ask your AI study assistant questions 24/7.", actions: ["Self-paced online study", "WhatsApp support available", "Progress tracked automatically"] },
  { n: 7, title: "Assessment", icon: "📋", color: S.amber, duration: "Ongoing", desc: "Complete internal assessments — practical exercises, portfolio evidence, and knowledge checks. Your assessor provides feedback and guidance throughout.", actions: ["Competency-based assessment", "Portfolio evidence submission", "Assessor feedback & support"] },
  { n: 8, title: "Graduation", icon: "🏆", color: S.coral, duration: "Completion", desc: "Receive your CTS ETS Institutional Certificate. Register for external NCTVET or City & Guilds certification. Celebrate your achievement — you earned it.", actions: ["CTS ETS Certificate issued", "External certification registration", "Welcome to the alumni network"] },
];

export default function StudentJourneyPage({ setPage }) {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <PageWrapper bg="#F5F3EE">
      <SectionHeader tag="Step by Step" title="Your Journey from Enquiry to Graduation" desc="Click any step to see what happens at each stage. Every student follows this path." accentColor={S.teal} />
      <Container>
        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <button onClick={() => setActive(i)} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "20px 24px", borderRadius: 14, border: active === i ? "2px solid " + s.color : "1px solid " + S.border, background: active === i ? "#fff" : "transparent", cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", marginBottom: 8, boxShadow: active === i ? "0 4px 20px rgba(0,0,0,0.06)" : "none" }}>
                {/* Step indicator + line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: active === i ? s.color : s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: active === i ? 22 : 18, transition: "all 0.2s", border: "2px solid " + (active === i ? s.color : s.color + "30") }}>
                    {s.icon}
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, height: 20, background: S.border, marginTop: 4 }} />}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <h3 style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: active === i ? S.navy : S.gray, margin: 0 }}>Step {s.n}: {s.title}</h3>
                    <span style={{ fontSize: 11, color: s.color, fontWeight: 600, fontFamily: S.body, whiteSpace: "nowrap" }}>{s.duration}</span>
                  </div>
                  {active === i && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ fontFamily: S.body, fontSize: 13, color: "#2D3748", lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</p>
                      {s.actions.map(a => (
                        <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div style={{ textAlign: "center" }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Start Your Journey — Apply Now</Btn>
            <div style={{ marginTop: 12 }}><Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Check Fees & Payment Plans</Btn></div>
          </div>
        </Reveal>
        <PageScripture page="studentJourney" />
      </Container>
    </PageWrapper>
  );
}
