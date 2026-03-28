// ─── WHY CHOOSE CTS ETS ─────────────────────────────────────────────
import S from "../constants/styles";
import { TESTIMONIALS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard, TalkToGraduate } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const FEATURES = [
  { icon: "🎓", title: "Nationally Recognised", desc: "All 25 programmes aligned to NCTVET (NVQ-J) or City & Guilds — qualifications trusted by employers across Jamaica and internationally.", color: S.teal },
  { icon: "💻", title: "100% Online", desc: "Study from anywhere, on any device. No campus visits required. Our learning system works on phones, tablets, and computers.", color: S.violet },
  { icon: "📚", title: "Interactive Learning System", desc: "More than just PDFs. Our proprietary system includes audio study sessions, an intelligent study assistant, video summaries, and flashcards.", color: S.coral },
  { icon: "⏰", title: "Self-Paced Study", desc: "No fixed class schedule. Study at your own pace — evenings, weekends, lunch breaks. Life doesn't stop, and neither should your education.", color: S.amber },
  { icon: "💳", title: "Flexible Payment Plans", desc: "Gold, Silver, or Bronze — choose the plan that works for you. Levels 3–5 qualify for instalment payments with no hidden fees.", color: S.emerald },
  { icon: "👥", title: "Real Support", desc: "WhatsApp support, email guidance, and optional consultations. You're never alone in your journey. We respond within 24 hours.", color: S.sky },
  { icon: "🏢", title: "Employer Partnerships", desc: "15% group discount for 8+ learners. Employers can invest in their team's growth with recognised qualifications.", color: S.gold },
  { icon: "🌍", title: "International Access", desc: "Open to applicants worldwide. Caribbean and international students welcome. Pay in JMD or USD.", color: S.rose },
];

const COMPARISONS = [
  ["", "CTS ETS", "Traditional College", "Other Online"],
  ["100% Online", "✓", "✗ Hybrid / In-person", "✓"],
  ["NCTVET / City & Guilds Aligned", "✓", "Varies", "Rarely"],
  ["Interactive AI Study Tools", "✓", "✗", "✗"],
  ["Self-Paced", "✓", "✗ Fixed schedule", "Sometimes"],
  ["Flexible Payment Plans", "3 plans", "Limited", "Varies"],
  ["WhatsApp Support", "✓ 24hr", "✗", "✗"],
  ["Employer Group Discounts", "15%", "Rare", "✗"],
  ["No Campus Visits", "✓", "✗", "✓"],
];

export default function WhyChoosePage({ setPage }) {
  return (
    <PageWrapper>
      <SectionHeader tag="The CTS Difference" title="Why Students Choose CTS ETS" desc="Flexible online study, recognised qualifications, and a learning system designed to feel like a personal instructor." accentColor={S.teal} />
      <Container>
        <SocialProofBar />

        {/* Feature Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 48 }} className="resp-grid-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div style={{ padding: "28px 24px", borderRadius: 16, background: "#fff", border: "1px solid " + S.border, display: "flex", gap: 18, alignItems: "flex-start", height: "100%", transition: "box-shadow 0.2s" }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: f.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: "1px solid " + f.color + "25" }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy, margin: "0 0 6px" }}>{f.title}</h3>
                  <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Comparison Table */}
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: S.violet, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>How We Compare</span>
              <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>CTS ETS vs. Alternatives</h3>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid " + S.border }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: S.navy }}>
                    {COMPARISONS[0].map((h, i) => (
                      <th key={i} style={{ padding: "14px 16px", color: i === 1 ? S.gold : "#fff", fontWeight: 700, textAlign: "left", fontSize: i === 0 ? 12 : 13, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISONS.slice(1).map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : S.lightBg }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: "12px 16px", color: ci === 1 && cell === "✓" ? S.emerald : ci === 1 ? S.navy : S.gray, fontWeight: ci <= 1 ? 700 : 400, borderTop: "1px solid " + S.border, fontSize: ci === 0 ? 12 : 13 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Partner Logos */}
        <PartnerLogos />

        {/* Testimonials */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 32 }} className="resp-grid-2">
            <TestimonialCard t={TESTIMONIALS[0]} />
            <TestimonialCard t={TESTIMONIALS[4]} />
          </div>
        </Reveal>

        <TalkToGraduate setPage={setPage} />

        {/* CTA */}
        <Reveal delay={0.2}>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Apply Now — Start Your Journey</Btn>
            <div style={{ marginTop: 12 }}>
              <Btn onClick={() => setPage("Programmes")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Browse 25 Programmes</Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="whyChoose" />
      </Container>
    </PageWrapper>
  );
}
