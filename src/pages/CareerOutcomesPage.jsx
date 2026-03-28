// Career Outcomes Page
import S from "../constants/styles";
import { CAREER_OUTCOMES } from "../constants/programmes";
import { TESTIMONIALS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, TestimonialCard } from "../components/shared/CoreComponents";

const CAREER_PATHS = [
  { programme: "Customer Service", levels: "L2 to L3 Supervision", roles: ["Customer Service Rep", "Team Leader", "Supervisor", "Call Centre Manager"], sectors: "BPO, Retail, Hospitality, Banking", color: S.teal },
  { programme: "Business Administration", levels: "L3 to L4 to L5", roles: ["Office Administrator", "Operations Coordinator", "Office Manager", "General Manager"], sectors: "Corporate, Government, NGOs, SMEs", color: S.violet },
  { programme: "Human Resource Management", levels: "L4 to L5", roles: ["HR Officer", "HR Coordinator", "HR Manager", "HR Director"], sectors: "All sectors", color: S.coral },
  { programme: "Industrial Security", levels: "L2 to L3", roles: ["Security Officer", "Shift Supervisor", "Operations Manager", "Security Director"], sectors: "Private Security, Hospitality, Corporate, Events", color: S.amber },
  { programme: "Entrepreneurship", levels: "L2 to L3", roles: ["Small Business Owner", "Freelance Consultant", "Social Enterprise Founder"], sectors: "Self-employment, Start-ups, Community Development", color: S.emerald },
];

export default function CareerOutcomesPage({ setPage }) {
  var levels = Object.entries(CAREER_OUTCOMES);
  var colors = [S.emerald, S.teal, S.violet, S.coral, S.rose];
  return (
    <PageWrapper bg="#F5F3EE">
      <SectionHeader tag="Where Can This Take You?" title="Real Career Outcomes at Every Level" desc="Every qualification opens real doors." accentColor={S.emerald} />
      <Container>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,26px)", color: S.navy, fontWeight: 700 }}>Expected Salary Ranges by Level</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }} className="resp-grid-3">
              {levels.map(function(entry, i) {
                var level = entry[0];
                var data = entry[1];
                return (
                  <Reveal key={level} delay={i * 0.06}>
                    <div style={{ background: "#fff", borderRadius: 14, padding: "22px 18px", textAlign: "center", border: "1px solid " + S.border, height: "100%", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: colors[i] }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors[i], fontFamily: S.body, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{level}</div>
                      <div style={{ fontFamily: S.heading, fontSize: 18, fontWeight: 800, color: S.navy, marginBottom: 8 }}>{data.salaryRange}</div>
                      <p style={{ fontFamily: S.body, fontSize: 11, color: S.gray, lineHeight: 1.5, margin: 0 }}>{data.outlook}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 14, fontStyle: "italic" }}>Salary ranges based on Jamaican market data and industry research. Actual salaries vary by employer, location, and experience.</p>
          </div>
        </Reveal>

        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: S.violet, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Progression</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,26px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Career Paths by Programme Area</h3>
          </div>
          {CAREER_PATHS.map(function(cp, i) {
            return (
              <Reveal key={cp.programme} delay={i * 0.06}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cp.color, flexShrink: 0 }} />
                    <h4 style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy, margin: 0 }}>{cp.programme}</h4>
                    <span style={{ fontSize: 11, color: cp.color, fontFamily: S.body, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: cp.color + "10" }}>{cp.levels}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {cp.roles.map(function(r, ri) {
                      return (
                        <span key={cp.programme + "-" + ri}>
                          <span style={{ fontSize: 12, fontFamily: S.body, color: ri === cp.roles.length - 1 ? S.navy : S.gray, fontWeight: ri === cp.roles.length - 1 ? 700 : 400 }}>{r}</span>
                          {ri < cp.roles.length - 1 ? <span style={{ color: cp.color, margin: "0 4px", fontSize: 12 }}>&rarr;</span> : null}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>{"Sectors: " + cp.sectors}</div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }} className="resp-grid-2">
            <TestimonialCard t={TESTIMONIALS[1]} />
            <TestimonialCard t={TESTIMONIALS[5]} />
          </div>
        </Reveal>

        <Reveal>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Btn primary onClick={function() { setPage("Apply"); }} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Start Your Career Path</Btn>
            <div style={{ marginTop: 12 }}><Btn onClick={function() { setPage("Programmes"); }} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Browse All 25 Programmes</Btn></div>
          </div>
        </Reveal>
        <PageScripture page="careers" />
      </Container>
    </PageWrapper>
  );
}
