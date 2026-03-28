// ─── CERTIFICATION PAGE ─────────────────────────────────────────────
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const CERT_PATHS = [
  { body: "NCTVET", full: "National Council on Technical & Vocational Education & Training", qual: "NVQ-J (National Vocational Qualification of Jamaica)", icon: "🇯🇲", color: S.teal, desc: "Jamaica's national standard for workplace competency. Recognised across all 14 parishes and by employers island-wide.", features: ["Nationally recognised by Jamaican employers", "5-level NVQ-J framework", "Competency-based assessment", "External assessment by NCTVET", "Portable across CARICOM"] },
  { body: "City & Guilds", full: "City & Guilds of London Institute", qual: "Internationally Recognised Qualifications", icon: "🌍", color: S.violet, desc: "One of the world's oldest and most respected awarding bodies, operating in over 80 countries.", features: ["Recognised in 80+ countries", "Over 140 years of vocational assessment", "Industry-aligned standards", "Global employer recognition", "International career mobility"] },
];

const PROCESS = [
  { n: "1", title: "Enrol & Study", desc: "Complete your programme through self-paced online study using the CTS ETS Interactive Learning System.", icon: "📚", color: S.teal },
  { n: "2", title: "Internal Assessment", desc: "CTS ETS assesses your competency through practical exercises, portfolio evidence, and knowledge checks.", icon: "📝", color: S.violet },
  { n: "3", title: "CTS ETS Certificate", desc: "Upon passing internal assessment, you receive a CTS ETS Institutional Certificate of Completion.", icon: "🏆", color: S.gold },
  { n: "4", title: "External Certification", desc: "Register for external assessment through NCTVET or City & Guilds. Fees paid directly to the awarding body.", icon: "🎓", color: S.coral },
];

const LEVELS = [
  { level: "Job Certificate", equiv: "Entry Level", nqf: "—", duration: "2–4 months", color: S.emerald },
  { level: "Level 2", equiv: "Vocational Certificate", nqf: "NQF 2", duration: "6 months", color: S.teal },
  { level: "Level 3", equiv: "Diploma", nqf: "NQF 3", duration: "7 months", color: S.violet },
  { level: "Level 4", equiv: "Associate Equivalent", nqf: "NQF 4", duration: "8–9 months", color: S.coral },
  { level: "Level 5", equiv: "Bachelor's Equivalent", nqf: "NQF 5", duration: "6–9 months", color: S.rose },
];

export default function CertificationPage({ setPage }) {
  return (
    <PageWrapper bg="#F5F3EE">
      <SectionHeader tag="Your Credentials" title="How Certification Works" desc="Internal assessments with CTS ETS, then nationally and internationally recognised certification through NCTVET or City & Guilds." accentColor={S.amber} />
      <Container>
        {/* Important note */}
        <Reveal>
          <div style={{ padding: "18px 24px", borderRadius: 12, background: S.amberLight, border: "1px solid " + S.amber + "30", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body, lineHeight: 1.7, margin: 0 }}>
              Each programme is aligned to <strong>either</strong> NCTVET <strong>or</strong> City & Guilds — not both simultaneously. External assessment fees are separate from tuition and paid directly to the awarding body.
            </p>
          </div>
        </Reveal>

        {/* Two certification paths */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }} className="resp-grid-2">
          {CERT_PATHS.map((cp, i) => (
            <Reveal key={cp.body} delay={i * 0.1}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid " + S.border, height: "100%", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: cp.color }} />
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cp.icon}</div>
                <h3 style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 700, color: S.navy, marginBottom: 4 }}>{cp.body}</h3>
                <div style={{ fontSize: 11, color: cp.color, fontFamily: S.body, fontWeight: 600, marginBottom: 12 }}>{cp.full}</div>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: cp.color + "10", border: "1px solid " + cp.color + "20", fontSize: 12, color: cp.color, fontFamily: S.body, fontWeight: 700, marginBottom: 16, display: "inline-block" }}>{cp.qual}</div>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, marginBottom: 16 }}>{cp.desc}</p>
                {cp.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: cp.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#2D3748", fontFamily: S.body }}>{f}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Process steps */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 11, color: S.teal, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Your Path</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>From Enrolment to Certification</h3>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }} className="resp-grid-2">
          {PROCESS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", textAlign: "center", border: "1px solid " + S.border, height: "100%", position: "relative" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: step.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px", border: "2px solid " + step.color + "30" }}>{step.icon}</div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: S.body, position: "absolute", top: 12, right: 12 }}>{step.n}</div>
                <h4 style={{ fontFamily: S.heading, fontSize: 15, fontWeight: 700, color: S.navy, marginBottom: 8 }}>{step.title}</h4>
                <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Levels table */}
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700 }}>Qualification Levels</h3>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid " + S.border, background: "#fff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 13 }}>
                <thead><tr style={{ background: S.navy }}>
                  {["Level", "Equivalent", "NQF", "Duration"].map(h => <th key={h} style={{ padding: "12px 16px", color: S.gold, fontWeight: 700, textAlign: "left", fontSize: 12 }}>{h}</th>)}
                </tr></thead>
                <tbody>{LEVELS.map((l, i) => (
                  <tr key={l.level} style={{ background: i % 2 === 0 ? "#fff" : S.lightBg }}>
                    <td style={{ padding: "10px 16px", fontWeight: 700, color: l.color, borderTop: "1px solid " + S.border }}>{l.level}</td>
                    <td style={{ padding: "10px 16px", color: S.navy, borderTop: "1px solid " + S.border }}>{l.equiv}</td>
                    <td style={{ padding: "10px 16px", color: S.gray, borderTop: "1px solid " + S.border }}>{l.nqf}</td>
                    <td style={{ padding: "10px 16px", color: S.gray, borderTop: "1px solid " + S.border }}>{l.duration}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        <Reveal>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Apply Now</Btn>
            <div style={{ marginTop: 12 }}><Btn onClick={() => setPage("Programmes")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>View All 25 Programmes</Btn></div>
          </div>
        </Reveal>

        <PageScripture page="certification" />
      </Container>
    </PageWrapper>
  );
}
