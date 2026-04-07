import React, { useState } from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const REGIONS = [
  { region: "Caribbean (CARICOM)", countries: "Trinidad & Tobago, Barbados, Guyana, Bahamas, Belize, OECS nations, and more", icon: "🌴", color: S.teal, desc: "Ideal for learners across the region who want a flexible online route without leaving home." },
  { region: "North America", countries: "United States, Canada, Mexico", icon: "🌎", color: S.violet, desc: "A practical path for Caribbean nationals abroad and international learners seeking structured online study." },
  { region: "Europe & UK", countries: "United Kingdom, European Union member states", icon: "🌍", color: S.coral, desc: "Suitable for learners who need a digital-first training model with clear communication and flexible access." },
  { region: "Africa, Asia & Pacific", countries: "All countries across Africa, Asia, the Middle East, and the Pacific", icon: "🌏", color: S.amber, desc: "Designed for international applicants who want a guided process and a fully online student experience." },
];
const GLOBAL_FACTS = [["100%", "Online Delivery", S.teal], ["USD & JMD", "Payment Options", S.gold], ["48–72 hrs", "Support Response", S.coral], ["Worldwide", "Applicant Access", S.violet]];
const REQUIRED_DOCS = ["Passport-size photograph", "Passport bio data page", "Secondary school transcripts", "Proof of identity (National ID or Driver's Licence)"];

function FactCard({ value, label, color }) { return <div style={{ textAlign: "center", padding: "30px 20px", borderRadius: 22, background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 8px 20px rgba(15,23,42,0.04)" }}><div style={{ fontFamily: S.heading, fontSize: "clamp(30px, 4vw, 40px)", fontWeight: 800, color, marginBottom: 8, lineHeight: 1 }}>{value}</div><div style={{ fontSize: 12, color: S.navy, fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>{label}</div></div>; }
function RegionCard({ item }) { return <div style={{ padding: "30px 24px", borderRadius: 22, background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 8px 20px rgba(15,23,42,0.04)", height: "100%" }}><div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}><div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{item.icon}</div><h3 style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 800, color: item.color, margin: 0, lineHeight: 1.15 }}>{item.region}</h3></div><p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, margin: "0 0 12px" }}>{item.countries}</p><p style={{ fontFamily: S.body, fontSize: 13, color: S.navy, lineHeight: 1.7, margin: 0, fontWeight: 600 }}>{item.desc}</p></div>; }
function DocCard({ doc }) { return <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}><span style={{ color: S.gold, fontSize: 24, lineHeight: 1 }}>📄</span><div><div style={{ fontSize: 15, color: S.white, fontFamily: S.body, fontWeight: 600, marginBottom: 6, lineHeight: 1.5 }}>{doc}</div><div style={{ color: S.coral, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1, fontFamily: S.body }}>Required</div></div></div>; }

export default function InternationalPage({ setPage }) {
  const [, setHoverRegion] = useState(null);
  const [, setHoverFact] = useState(null);
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>International Students</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.04, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 860 }}>Study from anywhere with a fully online CTS ETS experience</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 780, margin: "0 0 24px" }}>This page keeps the same international-student purpose from your current site, but presents it with a stronger global feel, clearer document guidance, and a more premium conversion path.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Apply as an International Student</Btn>
              <Btn onClick={() => setPage("Fees & Calculator")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>View Fees in USD</Btn>
            </div>
          </Reveal>
        </Container>
      </div>
      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></Container>
      <Container style={{ paddingTop: 26 }}>
        <SectionHeader tag="Global Access" title="The same learning model, accessible from around the world" desc="The original page already had the right promise. This redesign makes the international message feel more credible, more structured, and more welcoming." accentColor={S.violet} />
        <Reveal><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 60 }}>{GLOBAL_FACTS.map(([value, label, color], i) => <div key={label} onMouseEnter={() => setHoverFact(i)} onMouseLeave={() => setHoverFact(null)}><FactCard value={value} label={label} color={color} /></div>)}</div></Reveal>
        <div style={{ marginBottom: 70 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}><span style={{ fontSize: 11, color: S.violet, letterSpacing: 2.4, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800 }}>Regions We Welcome</span><h3 style={{ fontFamily: S.heading, fontSize: "clamp(28px, 4vw, 40px)", color: S.navy, margin: "12px 0 0", fontWeight: 900, lineHeight: 1.1 }}>Join learners applying from multiple regions</h3></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 22 }}>{REGIONS.map((item, i) => <Reveal key={item.region} delay={i * 0.06}><div onMouseEnter={() => setHoverRegion(i)} onMouseLeave={() => setHoverRegion(null)}><RegionCard item={item} /></div></Reveal>)}</div>
        </div>
        <Reveal><div style={{ background: S.navy, borderRadius: 26, padding: "48px clamp(24px,4vw,40px)", marginBottom: 44, borderBottom: `4px solid ${S.gold}`, boxShadow: "0 18px 40px rgba(15,23,42,0.12)" }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Documents Required</div>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,40px)", color: S.white, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>Have these ready before you apply</h3>
            <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.72)", marginTop: 12, lineHeight: 1.75 }}>The content here stays the same as your current page, but the layout makes it easier for international learners to understand exactly what they need.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>{REQUIRED_DOCS.map((doc, i) => <Reveal key={doc} delay={i * 0.04}><DocCard doc={doc} /></Reveal>)}</div>
        </div></Reveal>
        <Reveal><div style={{ padding: "28px clamp(22px,4vw,36px)", borderRadius: 22, background: S.tealLight, border: `2px solid ${S.teal}35`, marginBottom: 56, display: "flex", gap: 18, alignItems: "flex-start", boxShadow: `0 12px 28px ${S.teal}12` }}><div style={{ fontSize: 32, flexShrink: 0 }}>ℹ️</div><div><div style={{ fontSize: 11, color: S.tealDark, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Entry Requirements</div><p style={{ fontSize: 15, color: S.navy, fontFamily: S.body, lineHeight: 1.8, margin: 0, fontWeight: 500 }}><strong>Job Certificates</strong> are open entry and do not require prior qualifications. Higher levels may accept equivalent qualifications from your country, including GCSEs, O-Levels, A-Levels, and high school diplomas. If you are unsure, <a href="#" onClick={(e) => { e.preventDefault(); setPage("Contact"); }} style={{ color: S.tealDark, fontWeight: 700 }}>contact us</a> for guidance before you apply.</p></div></div></Reveal>
        <Reveal><PartnerLogos /></Reveal>
        <Reveal><div style={{ textAlign: "center", marginTop: 56, padding: "38px clamp(22px,4vw,40px)", background: S.white, borderRadius: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: S.lightBg, color: S.coral, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Ready to Start?</div>
          <h2 style={{ color: S.navy, fontFamily: S.heading, margin: "0 0 14px", fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, lineHeight: 1.1 }}>Take the next step from anywhere in the world</h2>
          <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>This closing section keeps the same conversion role as your current page, but gives international visitors a stronger sense of clarity and readiness.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: 16, padding: "16px 36px", border: "none", borderRadius: 14, boxShadow: `0 8px 24px ${S.coral}30` }}>Apply as an International Student</Btn>
            <Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: 16, border: `2px solid ${S.teal}`, color: S.teal, background: "transparent", padding: "16px 36px", borderRadius: 14 }}>View Fees in USD</Btn>
          </div>
        </div></Reveal>
        <PageScripture page="international" />
      </Container>
    </PageWrapper>
  );
}
