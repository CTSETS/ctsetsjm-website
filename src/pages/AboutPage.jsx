import React from "react";
import S from "../constants/styles";
import { FOUNDER_PHOTO } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";
import { TrustSection } from "../components/trust/TrustElements";

const VALUES = [
  { title: "Called", desc: "This work is presented as a mission of purpose and service, not merely a commercial offering.", color: S.violet },
  { title: "Access", desc: "CTS ETS exists to expand opportunity for people who may be excluded by cost, distance, or rigid schedules.", color: S.teal },
  { title: "Service", desc: "Learner support, clarity, and responsiveness are central to the way the institution presents itself.", color: S.coral },
  { title: "Excellence", desc: "Quality, structure, and alignment matter because learners deserve a professional and credible experience.", color: S.emerald },
];
const STATS = [
  { num: "28", label: "Programmes", sub: "Multiple progression options", color: S.coral },
  { num: "5", label: "Qualification Levels", sub: "Job Certificate to Level 5", color: S.teal },
  { num: "100%", label: "Online Delivery", sub: "Flexible study model", color: S.violet },
  { num: "CTS ETS", label: "Called to Serve", sub: "Mission-led identity", color: S.gold },
];
function ValueCard({ item }) {
  return <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: "28px 24px", boxShadow: "0 14px 34px rgba(15,23,42,0.04)", height: "100%" }}><div style={{ width: 52, height: 52, borderRadius: 16, background: `${item.color}16`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: item.color, fontFamily: S.heading, fontSize: 18, fontWeight: 800 }}>{item.title.slice(0, 1)}</div><h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, margin: "0 0 10px", fontWeight: 800 }}>{item.title}</h3><p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.78, margin: 0 }}>{item.desc}</p></div>;
}
function StatCard({ item }) {
  return <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: "34px 20px", textAlign: "center", boxShadow: "0 12px 30px rgba(15,23,42,0.04)", height: "100%" }}><div style={{ fontFamily: S.heading, fontSize: "clamp(34px, 5vw, 54px)", lineHeight: 1, fontWeight: 800, color: item.color, marginBottom: 14 }}>{item.num}</div><div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 800, color: S.navy, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div><div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7 }}>{item.sub}</div></div>;
}

export default function AboutPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Our Story</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.04, color: "#fff", fontWeight: 900, margin: "0 0 18px", maxWidth: 860 }}>Why CTS ETS exists and what it stands for</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 780, margin: "0 0 24px" }}>This upgrade keeps the same founder-story purpose and institutional message from your current About page, but presents it with a cleaner, more executive feel so it strengthens trust across the site.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>View Programmes</Btn>
              <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", borderRadius: 14, padding: "15px 26px" }}>Contact Us</Btn>
            </div>
          </Reveal>
        </Container>
      </div>
      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></Container>
      <Container style={{ paddingTop: 30 }}>
        <Reveal>
          <div style={{ background: S.white, borderRadius: 28, padding: "clamp(28px, 5vw, 48px)", border: `1px solid ${S.border}`, boxShadow: "0 18px 42px rgba(15,23,42,0.05)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 34, alignItems: "center", marginBottom: 62 }}>
            <div style={{ position: "relative", maxWidth: 360, width: "100%", margin: "0 auto" }}>
              <div style={{ position: "absolute", top: 18, left: -18, right: 18, bottom: -18, borderRadius: 24, border: `2px solid ${S.gold}55`, zIndex: 0 }} />
              <img src={FOUNDER_PHOTO} alt="Mark O. Lindo, Ph.D" loading="lazy" style={{ position: "relative", zIndex: 1, width: "100%", height: "auto", borderRadius: 24, objectFit: "cover", boxShadow: "0 18px 36px rgba(2,6,23,0.16)" }} />
              <div style={{ position: "relative", zIndex: 2, marginTop: 18, paddingLeft: 14, borderLeft: `3px solid ${S.teal}` }}>
                <div style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 800, color: S.navy, lineHeight: 1.2 }}>Mark O. Lindo, Ph.D</div>
                <div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginTop: 5 }}>Founder and Lead Facilitator, CTS ETS</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 14 }}>Founder’s Letter</div>
              <h2 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,42px)", color: S.navy, fontWeight: 900, lineHeight: 1.1, margin: "0 0 16px" }}>A mission rooted in access, dignity, and opportunity</h2>
              <div style={{ fontFamily: S.body, fontSize: 15, color: "#334155", lineHeight: 1.9 }}>
                <p style={{ margin: "0 0 18px" }}>CTS ETS was built around a simple conviction: that more people should be able to access meaningful training and recognised development without being blocked by inflexible systems, distance, or circumstance.</p>
                <p style={{ margin: "0 0 18px" }}>Too many capable people are ready to grow, ready to work, and ready to move forward, yet the traditional path can still feel out of reach. CTS ETS was created to help close that gap by offering a more accessible digital route.</p>
                <blockquote style={{ margin: "28px 0", padding: "22px 24px", borderRadius: 18, background: S.lightBg, borderLeft: `4px solid ${S.gold}`, fontFamily: S.heading, fontSize: 24, lineHeight: 1.45, color: S.navy, fontStyle: "italic" }}>“Called to Serve is not just a tagline. It expresses the purpose behind the institution.”</blockquote>
                <p style={{ margin: "0 0 18px" }}>The aim is not simply to offer courses. It is to provide a more polished, supportive, and structured learning environment where learners can build confidence and work toward real progress.</p>
                <p style={{ margin: 0, fontWeight: 700, color: S.navy }}>Welcome to CTS ETS. Your next step can begin here.</p>
              </div>
            </div>
          </div>
        </Reveal>
        <SectionHeader tag="Core Values" title="What CTS ETS stands for" desc="This section keeps the values-based role of the original page, but expresses it more clearly and more consistently with the upgraded site design." accentColor={S.violet} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 60 }}>{VALUES.map((item) => <Reveal key={item.title}><ValueCard item={item} /></Reveal>)}</div>
        <SectionHeader tag="Institution Snapshot" title="A clearer institutional overview" desc="The original page includes strong headline facts. This version keeps that idea, but presents the information with a cleaner, more polished rhythm." accentColor={S.coral} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 56 }}>{STATS.map((item) => <Reveal key={item.label}><StatCard item={item} /></Reveal>)}</div>
        <Reveal><PartnerLogos /></Reveal>
        <Reveal><div style={{ marginTop: 48 }}><TrustSection /></div></Reveal>
        <Reveal>
          <div style={{ marginTop: 56, borderRadius: 28, padding: "34px clamp(22px,4vw,40px)", background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)", boxShadow: "0 22px 54px rgba(15,23,42,0.14)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 22, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Take the Next Step</div>
                <h2 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,42px)", color: S.white, lineHeight: 1.1, margin: "0 0 12px", fontWeight: 900 }}>Learn more about the programmes behind the mission</h2>
                <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.74)", lineHeight: 1.8, margin: 0, maxWidth: 660 }}>This closing section preserves the original page’s call-to-action role while aligning it with the stronger visual system used across the rest of the upgraded site.</p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
                <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.teal, color: S.white, borderRadius: 14, padding: "16px 28px" }}>View Our Programmes</Btn>
                <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)", color: S.white, borderRadius: 14, padding: "16px 28px" }}>Contact Us</Btn>
              </div>
            </div>
          </div>
        </Reveal>
        <PageScripture page="about" />
      </Container>
    </PageWrapper>
  );
}
