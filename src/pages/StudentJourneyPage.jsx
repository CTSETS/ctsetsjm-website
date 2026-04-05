import React, { useState } from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";

const STEPS = [
  { n: 1, title: "Explore & Enquire", icon: "🔍", color: S.sky, duration: "Day 1", desc: "Browse our programmes, use the fees calculator, and contact us with questions. WhatsApp, email, or book a consultation — we're here to help you choose the right path.", actions: ["Browse Programmes", "Use Fees Calculator", "WhatsApp us at 876-381-9771"] }, //
  { n: 2, title: "Apply Online", icon: "📝", color: S.coral, duration: "10 minutes", desc: "Complete the online application in under 10 minutes. Select your applicant type (Jamaican, Caribbean, or International), fill in your details, choose your programme, and upload your documents.", actions: ["Fill out the application form", "Upload required documents", "Jamaican applicants: HEART form auto-fills"] }, //
  { n: 3, title: "Acceptance", icon: "✉️", color: S.emerald, duration: "48–72 hours", desc: "Our admissions team reviews your documents. If everything checks out, you receive an acceptance email with your student reference number and payment instructions.", actions: ["Documents reviewed by admissions", "Acceptance email sent", "Payment instructions included"] }, //
  { n: 4, title: "Payment", icon: "💳", color: S.gold, duration: "Within 48 hours", desc: "Choose your payment plan — Gold (full), Silver (60/40), or Bronze (monthly instalments). Pay securely online or via bank transfer.", actions: ["Choose Gold, Silver, or Bronze plan", "Pay online or via bank transfer", "Receipt confirmation sent"] }, //
  { n: 5, title: "Onboarding", icon: "🎓", color: S.teal, duration: "Same day", desc: "Receive your Learning Portal credentials. Access the CTS ETS Interactive Learning System — audio sessions, intelligent study assistant, learner guides, and flashcards.", actions: ["Learning Portal access granted", "Interactive Learning System activated", "Welcome email with study guide"] }, //
  { n: 6, title: "Study & Learn", icon: "📚", color: S.violet, duration: "2–9 months", desc: "Work through your programme at your own pace. Study 6–10 hours per week, use audio sessions during commutes, and ask your AI study assistant questions 24/7.", actions: ["Self-paced online study", "WhatsApp support available", "Progress tracked automatically"] }, //
  { n: 7, title: "Assessment", icon: "📋", color: S.amber, duration: "Ongoing", desc: "Complete internal assessments — practical exercises, portfolio evidence, and knowledge checks. Your assessor provides feedback and guidance throughout.", actions: ["Competency-based assessment", "Portfolio evidence submission", "Assessor feedback & support"] }, //
  { n: 8, title: "Graduation", icon: "🏆", color: S.coral, duration: "Completion", desc: "Receive your CTS ETS Institutional Certificate. Register for external NCTVET certification. Celebrate your achievement — you earned it.", actions: ["CTS ETS Certificate issued", "External certification registration", "Welcome to the alumni network"] }, //
];

export default function StudentJourneyPage({ setPage }) {
  const [active, setActive] = useState(0);

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="Step by Step" 
        title="Your Journey to Graduation" 
        desc="From your first enquiry to holding your NCTVET-aligned certificate. See exactly what happens at every stage." 
        accentColor={S.teal} 
      />
      <Container>
        
        {/* ─── INTERACTIVE TIMELINE ─── */}
        <div style={{ maxWidth: "800px", margin: "0 auto 60px", padding: "0 10px" }}>
          <div style={{ position: "relative" }}>
            
            {/* The continuous vertical timeline track */}
            <div style={{ position: "absolute", top: "40px", bottom: "40px", left: "28px", width: "4px", background: `linear-gradient(to bottom, ${S.sky}20, ${S.coral}20, ${S.emerald}20, ${S.gold}20, ${S.teal}20, ${S.violet}20, ${S.amber}20, ${S.coral}20)`, borderRadius: "4px", zIndex: 0 }} />

            {STEPS.map((s, i) => {
              const isActive = active === i;
              const isPast = i < active;
              
              return (
                <Reveal key={s.n} delay={i * 0.05}>
                  <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                    
                    {/* Icon Indicator */}
                    <div 
                      onClick={() => setActive(i)}
                      style={{ width: "60px", height: "60px", borderRadius: "50%", background: isActive ? s.color : isPast ? `${s.color}20` : S.white, border: `3px solid ${isActive ? S.white : isPast ? s.color : S.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: isActive ? `0 0 0 4px ${s.color}40, 0 10px 20px ${s.color}30` : "0 4px 6px rgba(0,0,0,0.02)", zIndex: 2, filter: (!isActive && !isPast) ? "grayscale(100%) opacity(0.5)" : "none" }}
                    >
                      {s.icon}
                    </div>

                    {/* Content Card */}
                    <div 
                      onClick={() => setActive(i)}
                      style={{ flex: 1, background: isActive ? S.white : "transparent", border: `1px solid ${isActive ? s.color : "transparent"}`, borderRadius: "20px", padding: isActive ? "24px 30px" : "18px 20px", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: isActive ? `0 15px 35px ${s.color}15` : "none", transform: isActive ? "scale(1.02)" : "scale(1)", transformOrigin: "left center" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
                        <h3 style={{ fontFamily: S.heading, fontSize: isActive ? "22px" : "18px", fontWeight: "700", color: isActive ? S.navy : S.gray, margin: 0, transition: "0.3s" }}>
                          <span style={{ color: isActive ? s.color : S.grayLight, marginRight: "8px" }}>{s.n}.</span> 
                          {s.title}
                        </h3>
                        <span style={{ fontSize: "12px", color: isActive ? s.color : S.gray, fontWeight: "800", fontFamily: S.body, background: isActive ? `${s.color}15` : "transparent", padding: isActive ? "6px 12px" : "0", borderRadius: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                          {s.duration}
                        </span>
                      </div>

                      {/* Expandable Content */}
                      <div style={{ maxHeight: isActive ? "500px" : "0", overflow: "hidden", transition: "max-height 0.4s ease-in-out", opacity: isActive ? 1 : 0 }}>
                        <div style={{ paddingTop: "12px" }}>
                          <p style={{ fontFamily: S.body, fontSize: "15px", color: "#334155", lineHeight: "1.7", marginBottom: "20px" }}>
                            {s.desc}
                          </p>
                          
                          <div style={{ background: S.lightBg, padding: "16px 20px", borderRadius: "12px", border: `1px solid ${S.border}` }}>
                            <div style={{ fontSize: "11px", color: S.navy, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "12px" }}>Action Items</div>
                            {s.actions.map(a => (
                              <div key={a} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                                <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                                  <span style={{ color: s.color, fontWeight: "800", fontSize: "10px" }}>✓</span>
                                </div>
                                <span style={{ fontSize: "14px", color: S.navy, fontFamily: S.body, fontWeight: "500", lineHeight: "1.5" }}>{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ─── BOTTOM CTA ─── */}
        <Reveal>
          <div style={{ textAlign: "center", padding: "60px 20px", background: S.navy, borderRadius: "24px", marginBottom: "40px", borderBottom: `4px solid ${S.gold}` }}>
            <h2 style={{ color: S.white, fontFamily: S.heading, marginBottom: "24px", fontSize: "32px" }}>Ready to Take the First Step?</h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "16px", padding: "16px 40px", border: "none", boxShadow: `0 8px 24px ${S.coral}40` }}>Apply Now</Btn>
              <Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: "16px", border: `2px solid ${S.teal}`, color: S.tealLight, background: "transparent" }}>Check Payment Plans</Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="studentJourney" /> {/* */}
      </Container>
    </PageWrapper>
  );
}