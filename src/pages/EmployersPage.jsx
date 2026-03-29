// ─── FOR EMPLOYERS PAGE ─────────────────────────────────────────────
import S from "../constants/styles";
import { GROUP_DISCOUNTS } from "../constants/programmes";
import { BOOKING_URLS } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const BENEFITS = [
  { icon: "💰", title: "15% Group Discount", desc: "Enrol 8 or more learners and save 15% on every enrolment. The more you invest, the more you save.", color: S.gold },
  { icon: "🎓", title: "Recognised Qualifications", desc: "Your team earns NCTVET qualifications — trusted by employers across Jamaica and internationally.", color: S.teal },
  { icon: "💻", title: "Zero Disruption", desc: "100% online, self-paced learning. Staff study evenings and weekends — no lost work hours, no travel.", color: S.violet },
  { icon: "📊", title: "Progress Tracking", desc: "Receive progress updates on each enrolled learner. Know who's on track and who needs support.", color: S.coral },
  { icon: "📝", title: "Dedicated Account Manager", desc: "Your group gets a named contact at CTS ETS for enrolment, support, and reporting.", color: S.emerald },
  { icon: "🏆", title: "Team Certificates", desc: "Completion certificates for display in your office. Show clients your team's qualifications.", color: S.amber },
];

export default function EmployersPage({ setPage }) {
  return (
    <PageWrapper>
      <SectionHeader tag="Invest in Your Team" title="15% Group Discount for 8+ Learners" desc="Recognised qualifications for your workforce — flexible, affordable, fully online." accentColor={S.teal} />
      <Container>
        <SocialProofBar />

        {/* Benefits grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }} className="resp-grid-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px 22px", border: "1px solid " + S.border, height: "100%" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: b.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: S.navy, marginBottom: 6 }}>{b.title}</h3>
                <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Group pricing table */}
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Group Pricing</span>
              <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Savings Per Learner (8+ Group)</h3>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid " + S.border, background: "#fff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 13 }}>
                <thead><tr style={{ background: S.navy }}>
                  {["Level", "Standard Price", "Group Price (15% off)", "You Save Per Learner"].map(h => <th key={h} style={{ padding: "12px 16px", color: S.gold, fontWeight: 700, textAlign: "left", fontSize: 12 }}>{h}</th>)}
                </tr></thead>
                <tbody>{GROUP_DISCOUNTS.map((g, i) => (
                  <tr key={g.level} style={{ background: i % 2 === 0 ? "#fff" : S.lightBg }}>
                    <td style={{ padding: "10px 16px", fontWeight: 700, color: S.navy, borderTop: "1px solid " + S.border }}>{g.level}</td>
                    <td style={{ padding: "10px 16px", color: S.gray, borderTop: "1px solid " + S.border }}>{g.standard}</td>
                    <td style={{ padding: "10px 16px", color: S.emerald, fontWeight: 700, borderTop: "1px solid " + S.border }}>{g.group}</td>
                    <td style={{ padding: "10px 16px", color: S.coral, fontWeight: 700, borderTop: "1px solid " + S.border }}>{g.saving}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 10, fontStyle: "italic" }}>Prices in JMD. Includes tuition + registration. Minimum 8 learners required. NCTVET external assessment fees separate.</p>
          </div>
        </Reveal>

        {/* How it works */}
        <Reveal>
          <div style={{ background: S.navy, borderRadius: 16, padding: "36px 32px", marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", fontWeight: 700 }}>How Group Enrolment Works</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="resp-grid-2">
              {[
                ["1", "Contact Us", "Book a consultation or email us with your team size and programme interest."],
                ["2", "Receive Quote", "We prepare a group quotation with your 15% discount applied."],
                ["3", "Enrol Team", "Complete group enrolment — we handle onboarding for every learner."],
                ["4", "Track Progress", "Receive regular progress reports as your team completes modules."],
              ].map(([n, title, desc]) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: S.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: S.navy, fontFamily: S.body, margin: "0 auto 12px" }}>{n}</div>
                  <h4 style={{ fontFamily: S.heading, fontSize: 14, color: "#fff", fontWeight: 700, marginBottom: 6 }}>{title}</h4>
                  <p style={{ fontFamily: S.body, fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        {/* CTAs */}
        <Reveal>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href={BOOKING_URLS.employer} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 8, background: S.coral, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: S.body, textDecoration: "none", boxShadow: "0 4px 20px " + S.coral + "30" }}>Book Employer Consultation →</a>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={() => setPage("Contact")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Contact Us for a Group Quote</Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="employers" />
      </Container>
    </PageWrapper>
  );
}
