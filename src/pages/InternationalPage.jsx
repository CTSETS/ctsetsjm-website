import React, { useState } from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const REGIONS = [
  { region: "Caribbean (CARICOM)", countries: "Trinidad & Tobago, Barbados, Guyana, Bahamas, Belize, OECS nations, and more", icon: "🌴", color: S.teal }, //
  { region: "North America", countries: "United States, Canada, Mexico", icon: "🌎", color: S.violet }, //
  { region: "Europe & UK", countries: "United Kingdom, European Union member states", icon: "🌍", color: S.coral }, //
  { region: "Africa, Asia & Pacific", countries: "All countries across Africa, Asia, the Middle East, and the Pacific", icon: "🌏", color: S.amber }, //
];

export default function InternationalPage({ setPage }) {
  const [hoverRegion, setHoverRegion] = useState(null);
  const [hoverStat, setHoverStat] = useState(null);

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="Study From Anywhere" 
        title="International Students Welcome" 
        desc="100% online. Pay seamlessly in USD or JMD. Earn qualifications aligned to NCTVET that are recognised globally." 
        accentColor={S.violet} 
      />
      <Container>
        
        {/* ─── KEY GLOBAL FACTS ─── */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "60px", marginTop: "20px" }}>
            {[
              ["100%", "Online Delivery", S.teal], 
              ["Global", "Accessibility", S.violet], 
              ["USD & JMD", "Secure Payments", S.gold], 
              ["48-72hr", "Support Response", S.coral]
            ].map(([val, label, color], i) => ( //
              <div 
                key={label} 
                onMouseEnter={() => setHoverStat(i)}
                onMouseLeave={() => setHoverStat(null)}
                style={{ textAlign: "center", padding: "32px 20px", borderRadius: "20px", background: S.white, border: `1px solid ${hoverStat === i ? color : S.border}`, boxShadow: hoverStat === i ? `0 10px 24px ${color}15` : "0 4px 10px rgba(0,0,0,0.02)", transform: hoverStat === i ? "translateY(-4px)" : "none", transition: "all 0.3s" }}
              >
                <div style={{ fontFamily: S.heading, fontSize: "32px", fontWeight: "800", color: color, marginBottom: "8px" }}>{val}</div>
                <div style={{ fontSize: "12px", color: S.navy, fontFamily: S.body, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ─── REGIONS GRID ─── */}
        <div style={{ marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ fontSize: "12px", color: S.violet, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800" }}>Global Reach</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 36px)", color: S.navy, margin: "12px 0 0", fontWeight: "800" }}>Join Students From Around the World</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {REGIONS.map((r, i) => (
              <Reveal key={r.region} delay={i * 0.08}>
                <div 
                  onMouseEnter={() => setHoverRegion(i)}
                  onMouseLeave={() => setHoverRegion(null)}
                  style={{ padding: "32px 24px", borderRadius: "20px", background: S.white, border: `1px solid ${hoverRegion === i ? r.color : S.border}`, boxShadow: hoverRegion === i ? `0 12px 24px ${r.color}15` : "0 4px 10px rgba(0,0,0,0.02)", transform: hoverRegion === i ? "translateY(-6px)" : "none", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", height: "100%" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${r.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", border: `1px solid ${r.color}30`, flexShrink: 0 }}>
                      {r.icon}
                    </div>
                    <h3 style={{ fontFamily: S.heading, fontSize: "20px", fontWeight: "700", color: r.color, margin: 0, lineHeight: "1.2" }}>{r.region}</h3>
                  </div>
                  <p style={{ fontFamily: S.body, fontSize: "14px", color: S.gray, lineHeight: "1.7", margin: 0 }}>{r.countries}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ─── REQUIRED DOCUMENTS (DARK UI) ─── */}
        <Reveal>
          <div style={{ background: S.navy, borderRadius: "24px", padding: "60px 40px", marginBottom: "40px", borderBottom: `4px solid ${S.gold}` }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h3 style={{ fontFamily: S.heading, fontSize: "32px", color: S.white, fontWeight: "800", margin: 0 }}>Documents Required to Apply</h3>
              <p style={{ fontFamily: S.body, fontSize: "15px", color: "rgba(255,255,255,0.7)", marginTop: "12px" }}>Have these ready to complete your application in under 10 minutes.</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {[
                "Passport-size photograph", 
                "Passport bio data page", 
                "Secondary school transcripts", 
                "Proof of identity (National ID or Driver's Licence)"
              ].map((doc, i) => ( //
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "20px 24px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                  <span style={{ color: S.gold, fontSize: "24px", lineHeight: "1" }}>📄</span>
                  <div>
                    <div style={{ fontSize: "15px", color: S.white, fontFamily: S.body, fontWeight: "600", marginBottom: "6px" }}>{doc}</div>
                    <div style={{ color: S.coral, fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Required</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ─── ENTRY REQUIREMENTS (HIGHLIGHT BOX) ─── */}
        <Reveal>
          <div style={{ padding: "32px 40px", borderRadius: "20px", background: S.tealLight, border: `2px solid ${S.teal}40`, marginBottom: "60px", display: "flex", gap: "20px", alignItems: "flex-start", boxShadow: `0 10px 30px ${S.teal}10` }}>
            <div style={{ fontSize: "32px", flexShrink: 0 }}>ℹ️</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: S.navy, fontFamily: S.heading, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Entry Requirements for International Students</div>
              <p style={{ fontSize: "15px", color: S.navy, fontFamily: S.body, lineHeight: "1.7", margin: 0, fontWeight: "500" }}>
                <strong>Job Certificates</strong> are open entry — no prior qualifications required. Higher levels accept equivalent qualifications from your country (e.g., GCSEs, O-Levels, A-Levels, High School Diplomas). <a href="#" onClick={(e) => {e.preventDefault(); setPage("Contact");}} style={{ color: S.tealDark, fontWeight: "700" }}>Contact us</a> if you're unsure about your eligibility.
              </p>
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        {/* ─── CTA ─── */}
        <Reveal>
          <div style={{ textAlign: "center", marginTop: "60px", padding: "40px", background: S.white, borderRadius: "24px", border: `1px solid ${S.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h2 style={{ color: S.navy, fontFamily: S.heading, marginBottom: "24px", fontSize: "28px" }}>Ready to Advance Your Global Career?</h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "16px", padding: "16px 40px", border: "none", boxShadow: `0 8px 24px ${S.coral}40` }}>Apply as an International Student</Btn>
              <Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: "16px", border: `2px solid ${S.teal}`, color: S.teal, background: "transparent", padding: "16px 40px" }}>View Fees in USD</Btn>
            </div>
          </div>
        </Reveal>
        
        <PageScripture page="international" /> {/* */}
      </Container>
    </PageWrapper>
  );
}