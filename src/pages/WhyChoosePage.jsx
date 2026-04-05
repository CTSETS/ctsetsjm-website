import React, { useState } from "react";
import S from "../constants/styles";
import { TESTIMONIALS } from "../constants/content"; //
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const FEATURES = [
  { icon: "🎓", title: "Nationally Recognised", desc: "All programmes aligned to NCTVET (NVQ-J) — qualifications trusted by employers across Jamaica and internationally.", color: S.teal },
  { icon: "💻", title: "100% Online", desc: "Study from anywhere, on any device. No campus visits required. Our learning system works on phones, tablets, and computers.", color: S.violet },
  { icon: "📚", title: "Interactive Learning", desc: "More than just PDFs. Our proprietary system includes audio study sessions, an intelligent study assistant, video summaries, and flashcards.", color: S.coral },
  { icon: "⏰", title: "Self-Paced Study", desc: "Study at your own pace — evenings, weekends, lunch breaks. Online class days are scheduled strictly for assessment preparation.", color: S.amber },
  { icon: "💳", title: "Flexible Payment Plans", desc: "Gold, Silver, or Bronze — choose the plan that works for you. Levels 3–5 qualify for instalment payments with no hidden fees.", color: S.emerald },
  { icon: "👥", title: "Real Support", desc: "WhatsApp support, email guidance, and optional consultations. You're never alone in your journey. We respond within 48–72 hours.", color: S.sky },
  { icon: "🏢", title: "Employer Partnerships", desc: "15% group discount for 8+ learners. Employers can invest in their team's growth with recognised qualifications.", color: S.gold },
  { icon: "🌍", title: "International Access", desc: "Open to applicants worldwide. Caribbean and international students welcome. Pay seamlessly in JMD or USD.", color: S.rose },
];

const COMPARISONS = [
  ["Feature", "CTS ETS", "Traditional College", "Other Online"],
  ["100% Online", "✓", "✗ Hybrid / In-person", "✓"],
  ["NCTVET (NVQ-J) Aligned", "✓", "Varies", "Rarely"],
  ["Interactive AI Study Tools", "✓", "✗", "✗"],
  ["Self-Paced", "✓", "✗ Fixed schedule", "Sometimes"],
  ["Flexible Payment Plans", "3 plans", "Limited", "Varies"],
  ["WhatsApp Support", "✓ 48-72hr", "✗", "✗"],
  ["Employer Group Discounts", "15%", "Rare", "✗"],
  ["No Campus Visits", "✓", "✗", "✓"],
];

export default function WhyChoosePage({ setPage }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="The CTS Difference" 
        title="Why Students Choose CTS ETS" 
        desc="Flexible online study, recognised qualifications, and a learning system designed to feel like a personal instructor." 
        accentColor={S.teal} 
      />
      <Container>
        <SocialProofBar />

        {/* Feature Cards - Modernized with Hover States */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "60px", marginTop: "20px" }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div 
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  padding: "32px 24px", 
                  borderRadius: "20px", 
                  background: S.white, 
                  border: `1px solid ${hoveredCard === i ? f.color : S.border}`, 
                  display: "flex", 
                  gap: "20px", 
                  alignItems: "flex-start", 
                  height: "100%", 
                  boxShadow: hoveredCard === i ? `0 12px 24px ${f.color}15` : "0 4px 12px rgba(0,0,0,0.02)",
                  transform: hoveredCard === i ? "translateY(-6px)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
                }}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0, border: `1px solid ${f.color}30` }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: S.heading, fontSize: "18px", fontWeight: "700", color: S.navy, margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ fontFamily: S.body, fontSize: "14px", color: S.gray, lineHeight: "1.7", margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ══ HEART vs CTS ETS — The Premium Comparison ══ */}
        <Reveal>
          <div style={{ marginBottom: "60px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span style={{ fontSize: "12px", color: S.coral, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "700" }}>The Question Everyone Asks</span>
              <h3 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 36px)", color: S.navy, margin: "12px 0 0", fontWeight: "800" }}>"HEART is Free — Why Would I Pay?"</h3>
              <p style={{ fontFamily: S.body, fontSize: "15px", color: S.gray, lineHeight: "1.8", maxWidth: "650px", margin: "16px auto 0" }}>
                HEART/NSTA is an excellent institution. But their model works differently from ours. Here is an honest comparison so you can decide which path is right for you.
              </p>
            </div>

            <div style={{ overflowX: "auto", borderRadius: "20px", boxShadow: "0 10px 30px rgba(1,30,64,0.08)", border: `1px solid ${S.border}`, background: S.white }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "20px 24px", background: S.lightBg, color: S.gray, fontWeight: "700", textAlign: "left", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${S.border}` }}>Comparison Point</th>
                    <th style={{ padding: "20px 24px", background: S.navy, color: S.gold, fontWeight: "800", textAlign: "left", fontSize: "16px", borderBottom: `2px solid ${S.navy}` }}>CTS ETS (Premium)</th>
                    <th style={{ padding: "20px 24px", background: S.lightBg, color: S.navy, fontWeight: "700", textAlign: "left", fontSize: "14px", borderBottom: `2px solid ${S.border}` }}>HEART/NSTA (Free)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cost to you", "J$5,000 Registration + Training Fee", "Free"],
                    ["How you study", "100% Online — Phone, tablet, or laptop", "In-person at a centre and/or online"],
                    ["Schedule", "Self-paced study around your life", "Fixed class days and times"],
                    ["Intakes per year", "Rolling — Start almost immediately", "3 fixed intake dates per year"],
                    ["Working full-time?", "Perfect fit. No time off needed.", "Difficult. Classes conflict with work hours."],
                    ["Location constraints", "None. Study from your verandah or bed.", "Must travel to a specific training centre."],
                    ["Study tools", "AI Assistant, Audio sessions, Flashcards", "Standard classroom materials"],
                    ["Qualification Earned", "NVQ-J (NCTVET)", "NVQ-J (NCTVET)"],
                  ].map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? S.white : S.lightBg, transition: "background 0.2s" }}>
                      <td style={{ padding: "18px 24px", fontWeight: "600", color: S.navy, borderBottom: `1px solid ${S.border}` }}>{row[0]}</td>
                      <td style={{ padding: "18px 24px", color: S.navy, fontWeight: "700", borderBottom: `1px solid ${S.border}`, background: `${S.gold}08`, borderLeft: `2px solid ${S.gold}`, borderRight: `2px solid ${S.gold}` }}>
                        <span style={{ color: S.teal, marginRight: "8px" }}>✓</span>{row[1]}
                      </td>
                      <td style={{ padding: "18px 24px", color: S.gray, borderBottom: `1px solid ${S.border}` }}>{row[2]}</td>
                    </tr>
                  ))}
                  {/* Bottom Border to close the Gold Highlight */}
                  <tr>
                    <td style={{ padding: 0 }}></td>
                    <td style={{ padding: 0, borderBottom: `2px solid ${S.gold}` }}></td>
                    <td style={{ padding: 0 }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Who should choose CTS ETS */}
            <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              <div style={{ background: S.emeraldLight, borderRadius: "20px", padding: "32px", border: `1px solid ${S.emerald}30`, boxShadow: `0 8px 20px ${S.emerald}10` }}>
                <div style={{ fontSize: "12px", color: S.emeraldDark, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>CTS ETS Is Right For You If...</div>
                {[
                  "You work full-time and cannot attend daytime classes",
                  "You missed HEART's intake and don't want to wait months",
                  "You live in a rural parish and travelling is difficult",
                  "Your employer is paying for your training",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ color: S.emerald, fontWeight: "800", fontSize: "16px", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "14px", color: S.navy, fontFamily: S.body, lineHeight: "1.6", fontWeight: "500" }}>{item}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ background: S.white, borderRadius: "20px", padding: "32px", border: `1px solid ${S.border}` }}>
                <div style={{ fontSize: "12px", color: S.teal, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>HEART May Be Better If...</div>
                {[
                  "You are not working and can attend daytime classes",
                  "A HEART centre is close to your home",
                  "You prefer face-to-face, traditional learning",
                  "Cost is your absolute only consideration",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ color: S.teal, fontWeight: "800", fontSize: "16px", flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: "14px", color: S.gray, fontFamily: S.body, lineHeight: "1.6" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: "24px", padding: "16px 24px", borderRadius: "12px", background: `${S.gold}15`, border: `1px solid ${S.gold}30`, fontSize: "14px", color: S.navy, fontFamily: S.body, lineHeight: "1.7", fontWeight: "600", textAlign: "center" }}>
              Either way, you earn the exact same NVQ-J qualification. We are not competing with HEART — we are offering a modern, flexible path to the same destination.
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "60px" }}>
            <TestimonialCard t={TESTIMONIALS[0]} />
            <TestimonialCard t={TESTIMONIALS[4]} />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ textAlign: "center", marginTop: "60px", padding: "40px", background: S.navy, borderRadius: "24px" }}>
            <h2 style={{ color: S.white, fontFamily: S.heading, marginBottom: "24px", fontSize: "28px" }}>Ready to Take Control of Your Career?</h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "16px", padding: "16px 40px", border: "none" }}>Apply Now</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ fontSize: "16px", border: `2px solid ${S.teal}`, color: S.tealLight, background: "transparent" }}>Browse Programmes</Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="whyChoose" />
      </Container>
    </PageWrapper>
  );
}-+-