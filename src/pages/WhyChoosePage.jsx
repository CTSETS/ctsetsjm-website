// ─── WHY CHOOSE CTS ETS ─────────────────────────────────────────────
import S from "../constants/styles";
import { TESTIMONIALS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const FEATURES = [
  { icon: "🎓", title: "Nationally Recognised", desc: "All programmes aligned to NCTVET (NVQ-J) — qualifications trusted by employers across Jamaica and internationally.", color: S.teal },
  { icon: "💻", title: "100% Online", desc: "Study from anywhere, on any device. No campus visits required. Our learning system works on phones, tablets, and computers.", color: S.violet },
  { icon: "📚", title: "Interactive Learning System", desc: "More than just PDFs. Our proprietary system includes audio study sessions, an intelligent study assistant, video summaries, and flashcards.", color: S.coral },
  { icon: "⏰", title: "Self-Paced Study", desc: "Study at your own pace — evenings, weekends, lunch breaks. Online class days are scheduled for assessment preparation. Assessments on announced dates, conducted online unless otherwise needed.", color: S.amber },
  { icon: "💳", title: "Flexible Payment Plans", desc: "Gold, Silver, or Bronze — choose the plan that works for you. Levels 3–5 qualify for instalment payments with no hidden fees.", color: S.emerald },
  { icon: "👥", title: "Real Support", desc: "WhatsApp support, email guidance, and optional consultations. You're never alone in your journey. We respond within 48–72 hours.", color: S.sky },
  { icon: "🏢", title: "Employer Partnerships", desc: "15% group discount for 8+ learners. Employers can invest in their team's growth with recognised qualifications.", color: S.gold },
  { icon: "🌍", title: "International Access", desc: "Open to applicants worldwide. Caribbean and international students welcome. Pay in JMD or USD.", color: S.rose },
];

const COMPARISONS = [
  ["", "CTS ETS", "Traditional College", "Other Online"],
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

        {/* ══ HEART vs CTS ETS — the key question ══ */}
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: S.coral, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>The Question Everyone Asks</span>
              <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>"HEART is Free — Why Would I Pay?"</h3>
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, maxWidth: 600, margin: "14px auto 0" }}>HEART/NSTA is an excellent institution. But their model works differently from ours. Here is an honest comparison so you can decide which is right for you.</p>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 16, border: "2px solid " + S.border }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: S.navy }}>
                    {["", "HEART/NSTA (Free)", "CTS ETS ($5K Reg + Training Fee)"].map(function(h, i) {
                      return <th key={i} style={{ padding: "16px 18px", color: i === 2 ? S.gold : "#fff", fontWeight: 700, textAlign: "left", fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cost to you", "Free", "$5,000 registration (non-refundable) + training fee per level ($5K–$45K)"],
                    ["How you study", "In-person at a HEART centre and/or online", "100% online — phone, tablet, or laptop"],
                    ["Schedule", "Fixed class days and times", "Self-paced study + scheduled online class days for assessment preparation"],
                    ["Intakes per year", "3 fixed intake dates", "Apply and possibly start this week, or with the next available cohort"],
                    ["Missed the intake?", "Wait 3–4 months for the next one", "Start with the next cohort — no long wait"],
                    ["Working full-time?", "More difficult — classes during or after working hours", "Study around your job. No time off needed"],
                    ["Location", "May be required to travel to a HEART centre and/or attend online at a set time", "Study from anywhere — verandah, bus, bed — on your own time"],
                    ["Study pace", "Fixed — stay within the set timeframe", "Flexible — move at your speed, but you are part of a cohort with scheduled assessment activities"],
                    ["Study tools", "Classroom materials", "Audio sessions, AI assistant, video, flashcards"],
                    ["NCTVET qualification", "Yes — NVQ-J", "Same NVQ-J — assessments online unless otherwise needed"],
                  ].map(function(row, ri) {
                    return (
                      <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : S.lightBg }}>
                        <td style={{ padding: "13px 18px", fontWeight: 700, color: S.navy, borderTop: "1px solid " + S.border, fontSize: 12 }}>{row[0]}</td>
                        <td style={{ padding: "13px 18px", color: S.gray, borderTop: "1px solid " + S.border }}>{row[1]}</td>
                        <td style={{ padding: "13px 18px", color: S.navy, fontWeight: 600, borderTop: "1px solid " + S.border }}>{row[2]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Who should choose CTS ETS */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="resp-grid-2">
              <div style={{ background: S.emeraldLight, borderRadius: 14, padding: "24px", border: "1px solid " + S.emerald + "30" }}>
                <div style={{ fontSize: 11, color: S.emerald, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>CTS ETS Is Right For You If...</div>
                {[
                  "You work full-time and cannot attend daytime classes",
                  "You missed HEART's intake and don't want to wait months",
                  "You live in a rural parish and travel to a centre is difficult",
                  "You prefer studying at night, on weekends, or during commute",
                  "Your employer is paying for your training",
                  "You are an international or diaspora student",
                ].map(function(item, i) {
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ color: S.emerald, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{"\u2713"}</span>
                      <span style={{ fontSize: 13, color: S.navy, fontFamily: S.body, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: S.lightBg, borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
                <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>HEART May Be Better If...</div>
                {[
                  "You are not currently working and can attend daytime classes",
                  "A HEART centre is close to where you live",
                  "You prefer face-to-face classroom learning",
                  "The next intake date works with your schedule",
                  "Cost is your only consideration",
                ].map(function(item, i) {
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ color: S.teal, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{"\u2022"}</span>
                      <span style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  );
                })}
                <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 8, background: S.gold + "15", border: "1px solid " + S.gold + "25", fontSize: 12, color: S.navy, fontFamily: S.body, lineHeight: 1.6, fontWeight: 600 }}>
                  {"Either way, you earn the same NCTVET qualification. We are not competing with HEART — we are offering a different path to the same destination."}
                </div>
              </div>
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


        {/* CTA */}
        <Reveal delay={0.2}>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Apply Now — Start Your Journey</Btn>
            <div style={{ marginTop: 12 }}>
              <Btn onClick={() => setPage("Programmes")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Browse All Programmes</Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="whyChoose" />
      </Container>
    </PageWrapper>
  );
}
