import React from "react";
import S from "../constants/styles";
import { GROUP_DISCOUNTS } from "../constants/programmes";
import { BOOKING_URLS } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const BENEFITS = [
  { icon: "💰", title: "15% group discount", desc: "Enrol 8 or more learners and reduce cost per learner while building capability across your team.", color: S.gold },
  { icon: "🎓", title: "Recognised qualifications", desc: "Your staff develop through structured NCTVET-aligned pathways that strengthen competence and credibility.", color: S.teal },
  { icon: "💻", title: "Minimal work disruption", desc: "Online, flexible delivery helps staff learn around work schedules rather than leaving the job to train.", color: S.violet },
  { icon: "📊", title: "Progress visibility", desc: "Employers can receive updates that make it easier to monitor engagement and encourage completion.", color: S.coral },
  { icon: "🤝", title: "Direct coordination", desc: "A designated contact helps your organisation manage enrolment, communication, and ongoing support more smoothly.", color: S.emerald },
  { icon: "🏆", title: "Professional outcomes", desc: "Upskilling staff supports stronger service standards, confidence, and a more professional team image.", color: S.sky },
];
const STEPS = [
  { num: "01", title: "Initial consultation", desc: "Tell us your team size, target roles, and the kind of programme support you need." },
  { num: "02", title: "Receive a group quote", desc: "We prepare a clearer corporate quote with your discount and suitable training options." },
  { num: "03", title: "Submit your roster", desc: "Your team list is collected and each learner is guided into the enrolment process." },
  { num: "04", title: "Track progress", desc: "You receive ongoing visibility as learners move through the training and complete their requirements." },
];
function BenefitCard({ item }) { return <div style={{ background: S.white, borderRadius: 22, padding: "30px 24px", border: `1px solid ${S.border}`, height: "100%", boxShadow: "0 8px 20px rgba(15,23,42,0.04)" }}><div style={{ width: 58, height: 58, borderRadius: 16, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 18 }}>{item.icon}</div><h3 style={{ fontFamily: S.heading, fontSize: 21, fontWeight: 800, color: S.navy, margin: "0 0 10px", lineHeight: 1.2 }}>{item.title}</h3><p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, margin: 0 }}>{item.desc}</p></div>; }
function StepCard({ item }) { return <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 18, padding: "28px 20px", textAlign: "center", height: "100%" }}><div style={{ width: 50, height: 50, borderRadius: "50%", background: S.gold, color: S.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.heading, fontSize: 18, fontWeight: 900, margin: "0 auto 18px", boxShadow: `0 0 0 4px ${S.gold}30` }}>{item.num}</div><h4 style={{ fontFamily: S.heading, fontSize: 20, color: S.white, fontWeight: 800, margin: "0 0 12px" }}>{item.title}</h4><p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.75, margin: 0 }}>{item.desc}</p></div>; }

export default function EmployersPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Employer Partnerships</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.04, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 860 }}>Invest in your team with structured, flexible training</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 780, margin: "0 0 24px" }}>This upgrade keeps the same employer-enrolment purpose from your current page, but presents the value more clearly for business decision-makers, HR teams, and organisational leaders.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={BOOKING_URLS.employer} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 26px", borderRadius: 14, background: S.gold, color: S.navy, fontSize: 15, fontWeight: 800, fontFamily: S.body, textDecoration: "none", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Book Employer Consultation</a>
              <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>Request a Custom Quote</Btn>
            </div>
          </Reveal>
        </Container>
      </div>
      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></Container>
      <Container style={{ paddingTop: 26 }}>
        <SectionHeader tag="Why Employers Choose CTS ETS" title="A stronger business-facing training proposition" desc="The original page already had the right structure. This redesign makes it feel more polished, more credible, and easier for organisations to scan quickly." accentColor={S.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, marginBottom: 62 }}>{BENEFITS.map((item, i) => <Reveal key={item.title} delay={i * 0.04}><BenefitCard item={item} /></Reveal>)}</div>
        <Reveal>
          <div style={{ marginBottom: 76 }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}><span style={{ fontSize: 11, color: S.gold, letterSpacing: 2.4, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800 }}>Corporate Savings</span><h3 style={{ fontFamily: S.heading, fontSize: "clamp(28px, 4vw, 40px)", color: S.navy, margin: "12px 0 0", fontWeight: 900, lineHeight: 1.1 }}>Your 15% group discount at a glance</h3></div>
            <div style={{ overflowX: "auto", borderRadius: 22, boxShadow: "0 12px 30px rgba(1,30,64,0.06)", border: `1px solid ${S.border}`, background: S.white }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 14 }}>
                <thead><tr><th style={{ padding: "20px 24px", background: S.navy, color: S.gold, fontWeight: 800, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.1, borderBottom: `2px solid ${S.navy}` }}>Qualification Level</th><th style={{ padding: "20px 24px", background: S.navy, color: S.gold, fontWeight: 800, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.1, borderBottom: `2px solid ${S.navy}` }}>Standard Price</th><th style={{ padding: "20px 24px", background: S.navy, color: S.gold, fontWeight: 800, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.1, borderBottom: `2px solid ${S.navy}` }}>Group Price (15% Off)</th><th style={{ padding: "20px 24px", background: `${S.coral}15`, color: S.coralDark, fontWeight: 800, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.1, borderBottom: `2px solid ${S.coral}` }}>Savings Per Learner</th></tr></thead>
                <tbody>{GROUP_DISCOUNTS.map((g, i) => <tr key={g.level} style={{ background: i % 2 === 0 ? S.white : S.lightBg }}><td style={{ padding: "18px 24px", fontWeight: 700, color: S.navy, borderBottom: `1px solid ${S.border}` }}>{g.level}</td><td style={{ padding: "18px 24px", color: S.gray, borderBottom: `1px solid ${S.border}`, textDecoration: "line-through" }}>{g.standard}</td><td style={{ padding: "18px 24px", color: S.emerald, fontWeight: 800, borderBottom: `1px solid ${S.border}` }}>{g.group}</td><td style={{ padding: "18px 24px", color: S.coral, fontWeight: 800, borderBottom: `1px solid ${S.border}`, background: `${S.coral}05`, borderLeft: `2px solid ${S.coral}30` }}>{g.saving}</td></tr>)}</tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: S.grayLight, fontFamily: S.body, marginTop: 16, fontStyle: "italic", textAlign: "center", lineHeight: 1.7 }}>Prices in JMD. Includes tuition plus non-refundable registration fee. Minimum 8 learners required for the group discount. NCTVET external assessment fees remain separate.</p>
          </div>
        </Reveal>
        <Reveal><div style={{ background: S.navy, borderRadius: 26, padding: "52px clamp(24px,4vw,40px)", marginBottom: 54, borderBottom: `4px solid ${S.gold}`, boxShadow: "0 18px 40px rgba(15,23,42,0.12)" }}><div style={{ textAlign: "center", marginBottom: 34 }}><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Group Onboarding</div><h3 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,40px)", color: S.white, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>A smoother corporate enrolment process</h3><p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.72)", marginTop: 12, lineHeight: 1.75 }}>The same onboarding logic is preserved here, but the layout makes the journey feel clearer and more organised for employers.</p></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>{STEPS.map((item, index) => <Reveal key={item.num} delay={index * 0.05}><StepCard item={item} /></Reveal>)}</div></div></Reveal>
        <Reveal><PartnerLogos /></Reveal>
        <Reveal><div style={{ textAlign: "center", marginTop: 56, padding: "40px clamp(22px,4vw,40px)", background: S.white, borderRadius: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.03)" }}><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: S.lightBg, color: S.coral, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Next Step</div><h2 style={{ color: S.navy, fontFamily: S.heading, margin: "0 0 14px", fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, lineHeight: 1.1 }}>Ready to upskill your workforce?</h2><p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>This closing section keeps the same purpose as your current page, but makes the final call to action feel stronger and more business-ready.</p><div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}><a href={BOOKING_URLS.employer} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 12, background: S.coral, color: S.white, fontSize: 16, fontWeight: 800, fontFamily: S.body, textDecoration: "none", boxShadow: `0 8px 24px ${S.coral}30` }}>Book Employer Consultation →</a><Btn onClick={() => setPage("Contact")} style={{ fontSize: 16, border: `2px solid ${S.teal}`, color: S.teal, background: "transparent", padding: "16px 36px", borderRadius: 12 }}>Request a Custom Quote</Btn></div></div></Reveal>
        <PageScripture page="employers" />
      </Container>
    </PageWrapper>
  );
}
