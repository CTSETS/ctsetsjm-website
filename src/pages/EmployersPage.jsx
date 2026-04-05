import React, { useState } from "react";
import S from "../constants/styles";
import { GROUP_DISCOUNTS } from "../constants/programmes"; //
import { BOOKING_URLS } from "../constants/config"; //
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const BENEFITS = [
  { icon: "💰", title: "15% Group Discount", desc: "Enrol 8 or more learners and save 15% on every enrolment. The more you invest, the more you save.", color: S.gold },
  { icon: "🎓", title: "Recognised Qualifications", desc: "Your team earns NCTVET qualifications — trusted by employers across Jamaica and internationally.", color: S.teal },
  { icon: "💻", title: "Zero Disruption", desc: "100% online, self-paced learning. Staff study evenings and weekends — no lost work hours, no travel.", color: S.violet },
  { icon: "📊", title: "Progress Tracking", desc: "Receive progress updates on each enrolled learner. Know who's on track and who needs support.", color: S.coral },
  { icon: "📝", title: "Dedicated Account Manager", desc: "Your group gets a named contact at CTS ETS for enrolment, support, and reporting.", color: S.emerald },
  { icon: "🏆", title: "Team Certificates", desc: "Completion certificates for display in your office. Show clients your team's qualifications.", color: S.sky },
];

export default function EmployersPage({ setPage }) {
  const [hoverCard, setHoverCard] = useState(null);

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="Invest in Your Team" 
        title="Corporate Group Enrolment" 
        desc="Upskill your workforce with recognised NCTVET qualifications. Secure a 15% discount for groups of 8 or more." 
        accentColor={S.teal} 
      />
      <Container>
        <SocialProofBar />

        {/* ─── B2B BENEFITS GRID ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "60px", marginTop: "20px" }}>
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div 
                onMouseEnter={() => setHoverCard(i)}
                onMouseLeave={() => setHoverCard(null)}
                style={{ 
                  background: S.white, 
                  borderRadius: "20px", 
                  padding: "32px 24px", 
                  border: `1px solid ${hoverCard === i ? b.color : S.border}`, 
                  height: "100%",
                  boxShadow: hoverCard === i ? `0 12px 24px ${b.color}15` : "0 4px 12px rgba(0,0,0,0.02)",
                  transform: hoverCard === i ? "translateY(-6px)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
                }}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "20px", border: `1px solid ${b.color}30` }}>
                  {b.icon}
                </div>
                <h3 style={{ fontFamily: S.heading, fontSize: "18px", fontWeight: "700", color: S.navy, marginBottom: "10px" }}>{b.title}</h3>
                <p style={{ fontFamily: S.body, fontSize: "14px", color: S.gray, lineHeight: "1.7", margin: 0 }}>{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ─── GROUP PRICING ROI TABLE ─── */}
        <Reveal>
          <div style={{ marginBottom: "80px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span style={{ fontSize: "12px", color: S.gold, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800" }}>Group Pricing</span>
              <h3 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 36px)", color: S.navy, margin: "12px 0 0", fontWeight: "800" }}>Your 15% Corporate Savings</h3>
            </div>
            
            <div style={{ overflowX: "auto", borderRadius: "20px", boxShadow: "0 10px 30px rgba(1,30,64,0.06)", border: `1px solid ${S.border}`, background: S.white }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: "14px" }}>
                <thead>
                  <tr>
                    {["Qualification Level", "Standard Price", "Group Price (15% Off)", "You Save Per Learner"].map((h, i) => (
                      <th key={h} style={{ padding: "20px 24px", background: i === 3 ? `${S.coral}15` : S.navy, color: i === 3 ? S.coralDark : S.gold, fontWeight: "800", textAlign: "left", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${i === 3 ? S.coral : S.navy}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GROUP_DISCOUNTS.map((g, i) => ( //
                    <tr key={g.level} style={{ background: i % 2 === 0 ? S.white : S.lightBg }}>
                      <td style={{ padding: "18px 24px", fontWeight: "700", color: S.navy, borderBottom: `1px solid ${S.border}` }}>{g.level}</td>
                      <td style={{ padding: "18px 24px", color: S.gray, borderBottom: `1px solid ${S.border}`, textDecoration: "line-through" }}>{g.standard}</td>
                      <td style={{ padding: "18px 24px", color: S.emerald, fontWeight: "800", borderBottom: `1px solid ${S.border}` }}>{g.group}</td>
                      <td style={{ padding: "18px 24px", color: S.coral, fontWeight: "800", borderBottom: `1px solid ${S.border}`, background: `${S.coral}05`, borderLeft: `2px solid ${S.coral}30` }}>{g.saving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "12px", color: S.grayLight, fontFamily: S.body, marginTop: "16px", fontStyle: "italic", textAlign: "center" }}>
              Prices in JMD. Includes tuition + non-refundable registration fee. Minimum 8 learners required for discount. NCTVET external assessment fees separate.
            </p>
          </div>
        </Reveal>

        {/* ─── HOW IT WORKS (ONBOARDING PIPELINE) ─── */}
        <Reveal>
          <div style={{ background: S.navy, borderRadius: "24px", padding: "60px 40px", marginBottom: "60px", borderBottom: `4px solid ${S.gold}` }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h3 style={{ fontFamily: S.heading, fontSize: "32px", color: S.white, fontWeight: "800", margin: 0 }}>Seamless Group Onboarding</h3>
              <p style={{ fontFamily: S.body, fontSize: "15px", color: "rgba(255,255,255,0.7)", marginTop: "12px" }}>We handle the administrative heavy lifting so you don't have to.</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", position: "relative" }}>
              {[
                ["1", "Contact Us", "Book a consultation or email us with your team size and programme interest."],
                ["2", "Receive Quote", "We prepare a formal group quotation with your 15% discount applied."],
                ["3", "Enrol Team", "Send us your roster. We handle individual onboarding for every learner."],
                ["4", "Track Progress", "Receive automated, regular progress reports as your team completes modules."],
              ].map(([n, title, desc]) => (
                <div key={n} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "30px 20px", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: S.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900", color: S.navy, fontFamily: S.heading, margin: "0 auto 20px", boxShadow: `0 0 0 4px ${S.gold}30` }}>{n}</div>
                  <h4 style={{ fontFamily: S.heading, fontSize: "18px", color: S.white, fontWeight: "700", marginBottom: "12px" }}>{title}</h4>
                  <p style={{ fontFamily: S.body, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        {/* ─── CTAs ─── */}
        <Reveal>
          <div style={{ textAlign: "center", marginTop: "60px", padding: "40px", background: S.white, borderRadius: "24px", border: `1px solid ${S.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h2 style={{ color: S.navy, fontFamily: S.heading, marginBottom: "24px", fontSize: "28px" }}>Ready to Upskill Your Workforce?</h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a 
                href={BOOKING_URLS.employer} //
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 36px", borderRadius: "12px", background: S.coral, color: S.white, fontSize: "16px", fontWeight: "800", fontFamily: S.body, textDecoration: "none", boxShadow: `0 8px 24px ${S.coral}40`, transition: "transform 0.2s" }}
              >
                Book Employer Consultation →
              </a>
              <Btn onClick={() => setPage("Contact")} style={{ fontSize: "16px", border: `2px solid ${S.teal}`, color: S.teal, background: "transparent", padding: "16px 36px", borderRadius: "12px" }}>
                Request a Custom Quote
              </Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="employers" /> {/* */}
      </Container>
    </PageWrapper>
  );
}