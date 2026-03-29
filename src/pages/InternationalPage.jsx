// ─── INTERNATIONAL STUDENTS PAGE ────────────────────────────────────
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const REGIONS = [
  { region: "Caribbean (CARICOM)", countries: "Trinidad & Tobago, Barbados, Guyana, Bahamas, Belize, OECS nations, and more", icon: "🌴", color: S.teal },
  { region: "North America", countries: "United States, Canada, Mexico", icon: "🌎", color: S.violet },
  { region: "Europe & UK", countries: "United Kingdom, European Union member states", icon: "🌍", color: S.coral },
  { region: "Africa & Asia", countries: "All countries in Africa, Asia, Middle East, Pacific", icon: "🌏", color: S.amber },
];

export default function InternationalPage({ setPage }) {
  return (
    <PageWrapper>
      <SectionHeader tag="Study From Anywhere" title="International Students Welcome" desc="100% online. Pay in USD or JMD. Qualifications aligned to NCTVET — nationally recognised." accentColor={S.violet} />
      <Container>
        {/* Key facts */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }} className="resp-grid-2">
            {[["100%", "Online", S.teal], ["80+", "Countries", S.violet], ["USD & JMD", "Payment", S.gold], ["48-72hr", "Support", S.coral]].map(([val, label, color]) => (
              <div key={label} style={{ textAlign: "center", padding: "20px 16px", borderRadius: 12, background: "#fff", border: "1px solid " + S.border }}>
                <div style={{ fontFamily: S.heading, fontSize: 26, fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Regions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }} className="resp-grid-2">
          {REGIONS.map((r, i) => (
            <Reveal key={r.region} delay={i * 0.08}>
              <div style={{ padding: "24px", borderRadius: 14, background: "#fff", border: "1px solid " + S.border }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{r.icon}</span>
                  <h3 style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: r.color, margin: 0 }}>{r.region}</h3>
                </div>
                <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.6, margin: 0 }}>{r.countries}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* What you need */}
        <Reveal>
          <div style={{ background: S.navy, borderRadius: 16, padding: "36px 32px", marginBottom: 40 }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Documents Required</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="resp-grid-2">
              {["Passport-size photo", "Passport bio page", "Secondary school transcripts", "Proof of identity (National ID / Passport / Driver's Licence)"].map((doc) => (
                <div key={doc} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color: S.gold, fontSize: 14 }}>📄</span>
                  <span style={{ fontSize: 13, color: "#fff", fontFamily: S.body }}>{doc} <span style={{ color: S.coral, fontSize: 10, fontWeight: 700 }}>Required</span></span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Entry requirements note */}
        <Reveal>
          <div style={{ padding: "20px 24px", borderRadius: 12, background: S.tealLight, border: "1px solid " + S.teal + "30", marginBottom: 40 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>Entry Requirements for International Students</div>
            <p style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body, lineHeight: 1.7, margin: 0 }}>
              Job Certificates are <strong>open entry</strong> — no prior qualifications required. Higher levels accept equivalent qualifications from your country: GCSEs, O-Levels, A-Levels, or equivalent secondary school diplomas. Contact us if you're unsure about your eligibility.
            </p>
          </div>
        </Reveal>

        <PartnerLogos />

        <Reveal>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Apply as International Student</Btn>
            <div style={{ marginTop: 12 }}><Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>View Fees in USD & JMD</Btn></div>
          </div>
        </Reveal>
        <PageScripture page="international" />
      </Container>
    </PageWrapper>
  );
}
