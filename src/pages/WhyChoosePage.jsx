import React from "react";
import S from "../constants/styles";
import { TESTIMONIALS } from "../constants/content";
import {
  Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const FEATURES = [
  { icon: "🎓", title: "Recognised training pathways", desc: "Programmes are presented around recognised competency-based development so learners can pursue structured and credible growth.", color: S.teal },
  { icon: "💻", title: "Fully online access", desc: "Study from anywhere using a phone, tablet, or computer without needing to travel to a physical campus.", color: S.violet },
  { icon: "📚", title: "Supportive learning design", desc: "A more guided and polished learning experience can reduce confusion and help learners stay engaged from enquiry to completion.", color: S.coral },
  { icon: "⏰", title: "Built for real schedules", desc: "The format is especially attractive to working adults and busy learners who need flexibility around life and work commitments.", color: S.amber },
  { icon: "💳", title: "Flexible payment messaging", desc: "The site can clearly explain staged payment options so learners understand affordability before they commit.", color: S.emerald },
  { icon: "👥", title: "Human support still matters", desc: "Online delivery works best when learners still feel guided, informed, and able to ask questions when needed.", color: S.sky },
];
const BEST_FOR_CTS = [
  "You work full-time and need a study model that fits around your schedule.",
  "You want a clearer digital experience with less need for travel.",
  "You need more flexibility in when you begin your training journey.",
  "You value convenience, responsiveness, and a modern presentation.",
];
const BEST_FOR_HEART = [
  "You prefer a more traditional face-to-face environment.",
  "You can comfortably attend classes at fixed times and locations.",
  "You are mainly choosing based on zero upfront training cost.",
  "You already have easy access to a suitable training centre.",
];

function FeatureCard({ item }) {
  return (
    <div style={{ padding: "28px 22px", borderRadius: 22, background: "#fff", border: "1px solid " + S.border, display: "flex", gap: 16, alignItems: "flex-start", height: "100%", boxShadow: "0 14px 34px rgba(15,23,42,0.04)" }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: item.color + "16", border: "1px solid " + item.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
      <div>
        <h3 style={{ fontFamily: S.heading, fontSize: 21, fontWeight: 800, color: S.navy, margin: "0 0 8px", lineHeight: 1.15 }}>{item.title}</h3>
        <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
      </div>
    </div>
  );
}
function FitCard({ title, intro, items, positive = true }) {
  return (
    <div style={{ background: positive ? S.emeraldLight : "#fff", borderRadius: 22, padding: 28, border: positive ? `1px solid ${S.emerald}35` : `1px solid ${S.border}`, boxShadow: positive ? "0 16px 36px rgba(16,185,129,0.10)" : "0 14px 30px rgba(15,23,42,0.04)" }}>
      <div style={{ fontSize: 11, color: positive ? S.emeraldDark : S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 14 }}>{title}</div>
      <p style={{ fontFamily: S.body, fontSize: 14, color: positive ? S.navy : S.gray, lineHeight: 1.75, margin: "0 0 16px" }}>{intro}</p>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ color: positive ? S.emerald : S.teal, fontWeight: 900, fontSize: 16, flexShrink: 0, lineHeight: 1.2, marginTop: 2 }}>{positive ? "✓" : "•"}</span>
            <span style={{ fontSize: 14, color: positive ? S.navy : S.gray, fontFamily: S.body, lineHeight: 1.65, fontWeight: positive ? 600 : 500 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhyChoosePage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Why CTS ETS</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.04, color: "#fff", fontWeight: 900, margin: "0 0 18px", maxWidth: 860 }}>Why learners choose a more flexible and modern route</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 780, margin: "0 0 26px" }}>This page keeps the same goal as your current version, but presents the value of CTS ETS in a cleaner, more balanced, and more professional way so visitors can compare options without feeling pressured.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Apply Now</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", borderRadius: 14, padding: "15px 26px" }}>Browse Programmes</Btn>
            </div>
          </Reveal>
        </Container>
      </div>
      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></Container>
      <Container style={{ paddingTop: 26 }}>
        <SectionHeader tag="The CTS Difference" title="A stronger value story without changing the function of the page" desc="This redesign keeps the original purpose of the page — helping visitors understand why CTS ETS may suit them better — but improves trust, structure, and visual clarity." accentColor={S.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, marginBottom: 56 }}>
          {FEATURES.map((item, i) => <Reveal key={item.title} delay={i * 0.05}><FeatureCard item={item} /></Reveal>)}
        </div>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ fontSize: 11, color: S.coral, letterSpacing: 2.4, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800 }}>A Fair Comparison</span>
              <h2 style={{ fontFamily: S.heading, fontSize: "clamp(28px, 4vw, 42px)", color: S.navy, margin: "12px 0 10px", fontWeight: 900, lineHeight: 1.1 }}>“HEART is free — so why would I pay?”</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, maxWidth: 760, margin: "0 auto" }}>HEART/NSTA Trust is an important option and remains valuable for many learners. This section is not about undermining that path. It is about helping visitors understand when the CTS ETS model may be a better fit.</p>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 22, boxShadow: "0 14px 38px rgba(1,30,64,0.08)", border: `1px solid ${S.border}`, background: S.white }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "20px 24px", background: S.lightBg, color: S.gray, fontWeight: 700, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: "1.2px", borderBottom: `2px solid ${S.border}` }}>Comparison Point</th>
                    <th style={{ padding: "20px 24px", background: S.navy, color: S.gold, fontWeight: 800, textAlign: "left", fontSize: 16, borderBottom: `2px solid ${S.navy}` }}>CTS ETS</th>
                    <th style={{ padding: "20px 24px", background: S.lightBg, color: S.navy, fontWeight: 700, textAlign: "left", fontSize: 14, borderBottom: `2px solid ${S.border}` }}>HEART / Traditional Route</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cost to learner", "Registration plus training fee", "Often lower or no direct training fee depending on programme route"],
                    ["Study model", "Fully online and flexible", "May be in-person, centre-based, or blended depending on programme"],
                    ["Schedule fit", "Designed to work around demanding personal schedules", "Can involve fixed days and times"],
                    ["Travel requirements", "Minimal or none", "May require attendance at a physical centre"],
                    ["Speed to begin", "Can feel quicker and more convenient for some learners", "May depend on intake timing and local availability"],
                    ["Learning experience", "Digital-first, polished, and structured for convenience", "More traditional delivery model"],
                    ["Qualification direction", "Structured toward recognised development pathways", "Structured toward recognised development pathways"],
                  ].map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? S.white : S.lightBg }}>
                      <td style={{ padding: "18px 24px", fontWeight: 700, color: S.navy, borderBottom: `1px solid ${S.border}`, minWidth: 180 }}>{row[0]}</td>
                      <td style={{ padding: "18px 24px", color: S.navy, fontWeight: 700, borderBottom: `1px solid ${S.border}`, background: `${S.gold}08`, borderLeft: `2px solid ${S.gold}`, borderRight: `2px solid ${S.gold}`, minWidth: 240 }}><span style={{ color: S.teal, marginRight: 8 }}>✓</span>{row[1]}</td>
                      <td style={{ padding: "18px 24px", color: S.gray, borderBottom: `1px solid ${S.border}`, minWidth: 250 }}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22, marginBottom: 54 }}>
            <FitCard title="CTS ETS may be right for you if..." intro="This path is most compelling when the learner values convenience, flexibility, and a smoother digital experience." items={BEST_FOR_CTS} positive />
            <FitCard title="A traditional route may suit you better if..." intro="It is helpful to say this clearly. A trustworthy page should acknowledge that different learners need different models." items={BEST_FOR_HEART} positive={false} />
          </div>
        </Reveal>

        <Reveal><PartnerLogos /></Reveal>
        <Reveal><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 56 }}><TestimonialCard t={TESTIMONIALS[0]} /><TestimonialCard t={TESTIMONIALS[4]} /></div></Reveal>
        <Reveal delay={0.15}>
          <div style={{ textAlign: "center", marginTop: 60, padding: "42px 28px", background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)", borderRadius: 28, boxShadow: "0 22px 54px rgba(15,23,42,0.14)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Ready to Take the Next Step?</div>
            <h2 style={{ color: S.white, fontFamily: S.heading, margin: "0 0 14px", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, lineHeight: 1.1 }}>Choose the route that fits your life and your goals</h2>
            <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.74)", lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>This call-to-action section keeps the same function as your current page, but closes with more confidence and less clutter.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: 16, padding: "16px 40px", border: "none", borderRadius: 14 }}>Apply Now</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ fontSize: 16, border: `1px solid rgba(255,255,255,0.18)`, color: S.white, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px 40px" }}>Browse Programmes</Btn>
            </div>
          </div>
        </Reveal>
        <PageScripture page="whyChoose" />
      </Container>
    </PageWrapper>
  );
}
