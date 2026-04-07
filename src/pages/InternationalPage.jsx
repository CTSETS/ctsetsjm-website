import React from "react";
import S from "../constants/styles";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  advisor: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  student: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
};

const REGIONS = [
  {
    region: "Caribbean (CARICOM)",
    countries: "Trinidad & Tobago, Barbados, Guyana, Bahamas, Belize, OECS nations, and more",
    icon: "🌴",
    color: S.teal,
    desc: "A strong fit for learners across the region who want flexible online study without leaving home.",
  },
  {
    region: "North America",
    countries: "United States, Canada, Mexico",
    icon: "🌎",
    color: S.violet,
    desc: "Useful for Caribbean nationals abroad and international learners seeking a structured online training path.",
  },
  {
    region: "Europe & UK",
    countries: "United Kingdom and European destinations",
    icon: "🌍",
    color: S.coral,
    desc: "Ideal for learners who need a digital-first model with clear communication and flexible access.",
  },
  {
    region: "Africa, Asia & Pacific",
    countries: "Countries across Africa, Asia, the Middle East, and the Pacific",
    icon: "🌏",
    color: S.amber,
    desc: "Designed for applicants who want a guided process and a fully online learner experience from anywhere in the world.",
  },
];

const GLOBAL_FACTS = [
  ["100%", "Online Delivery", S.teal],
  ["USD & JMD", "Payment Options", S.gold],
  ["48–72 hrs", "Support Response", S.coral],
  ["Worldwide", "Applicant Access", S.violet],
];

const REQUIRED_DOCS = [
  "Passport-size photograph",
  "Passport bio data page",
  "Secondary school transcripts",
  "Proof of identity (National ID or Driver's Licence)",
];

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(18px, 3vw, 40px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionIntro({ tag, title, desc, accent = S.teal }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 0.82fr) minmax(320px, 1.18fr)",
        gap: 30,
        alignItems: "end",
        marginBottom: 28,
      }}
      className="resp-grid-2"
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: `${accent}12`,
            color: accent,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: S.body,
            marginBottom: 14,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(30px, 4vw, 50px)",
            lineHeight: 1.06,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 760,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 16,
          lineHeight: 1.85,
          color: S.gray,
          margin: 0,
          maxWidth: 860,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function FactCard({ value, label, color }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 20px",
        borderRadius: 22,
        background: S.white,
        border: `1px solid ${S.border}`,
        boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: S.heading,
          fontSize: "clamp(30px, 4vw, 40px)",
          fontWeight: 800,
          color,
          marginBottom: 8,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: S.navy,
          fontFamily: S.body,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function RegionCard({ item }) {
  return (
    <div
      style={{
        padding: "30px 24px",
        borderRadius: 22,
        background: S.white,
        border: `1px solid ${S.border}`,
        boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: `${item.color}15`,
            border: `1px solid ${item.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          {item.icon}
        </div>
        <h3
          style={{
            fontFamily: S.heading,
            fontSize: 22,
            fontWeight: 800,
            color: item.color,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {item.region}
        </h3>
      </div>
      <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, margin: "0 0 12px" }}>{item.countries}</p>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.navy, lineHeight: 1.7, margin: 0, fontWeight: 600 }}>{item.desc}</p>
    </div>
  );
}

function DocCard({ doc }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "18px 20px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <span style={{ color: S.gold, fontSize: 24, lineHeight: 1 }}>📄</span>
      <div>
        <div style={{ fontSize: 15, color: S.white, fontFamily: S.body, fontWeight: 600, marginBottom: 6, lineHeight: 1.5 }}>{doc}</div>
        <div style={{ color: S.coral, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1, fontFamily: S.body }}>Required</div>
      </div>
    </div>
  );
}

export default function InternationalPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>International Students</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>Study from anywhere with a fully online CTS ETS experience</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>CTS ETS welcomes international applicants who want a flexible online route, clear communication, and a more structured admissions experience from anywhere in the world.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Apply as an International Student</Btn>
                  <Btn onClick={() => setPage("Fees & Calculator")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>View Fees in USD</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 440, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.hero} alt="International learners collaborating online" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🌐</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Worldwide access</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>💬</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Clear support communication</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}>
        <Reveal><SocialProofBar /></Reveal>
      </WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <SectionIntro tag="Global Access" title="The same learning model, accessible from around the world" desc="International applicants can study fully online, communicate with the team remotely, and move through the admissions process without needing to travel." accent={S.violet} />
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 20, marginBottom: 36 }} className="resp-grid-4">
              {GLOBAL_FACTS.map(([value, label, color]) => <FactCard key={label} value={value} label={label} color={color} />)}
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 0.9fr) minmax(0, 1.1fr)", gap: 24, alignItems: "stretch", marginBottom: 54 }} className="resp-grid-2">
            <Reveal>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", minHeight: 360, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                  <img src={PEOPLE.advisor} alt="Advisor helping an international student plan their next step" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>A smoother international admissions route builds confidence</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>The strongest international pages help visitors quickly understand access, support, cost direction, and document requirements.</p>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 22 }} className="resp-grid-2">
              {REGIONS.map((item, i) => <Reveal key={item.region} delay={i * 0.05}><RegionCard item={item} /></Reveal>)}
            </div>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 6 }}>
        <WideWrap>
          <SectionIntro tag="Required Documents" title="Prepare these items before you apply" desc="Having the right documents ready makes the international application process faster and easier to complete." accent={S.goldDark} />
          <Reveal>
            <div style={{ background: S.navy, borderRadius: 26, padding: "40px clamp(24px,4vw,40px)", marginBottom: 32, borderBottom: `4px solid ${S.gold}`, boxShadow: "0 18px 40px rgba(15,23,42,0.12)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)", gap: 24, alignItems: "start" }} className="resp-grid-2">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Documents Required</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,40px)", color: S.white, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.1 }}>Have these ready before you start your application</h3>
                  <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.72)", margin: 0, lineHeight: 1.8, maxWidth: 640 }}>Preparing your files in advance makes the process easier and reduces delays during review.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: 24 }} className="resp-grid-2">
                    {REQUIRED_DOCS.map((doc, i) => <Reveal key={doc} delay={i * 0.04}><DocCard doc={doc} /></Reveal>)}
                  </div>
                </div>
                <Reveal>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 22, padding: 16 }}>
                    <div style={{ width: "100%", height: 320, borderRadius: 18, overflow: "hidden", marginBottom: 14 }}>
                      <img src={PEOPLE.student} alt="International student preparing application documents online" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontFamily: S.heading, fontSize: 24, color: S.white, fontWeight: 800, marginBottom: 8 }}>Document clarity reduces delays</div>
                    <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0 }}>Clear identification files and readable academic records help the review process move more smoothly.</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ padding: "28px clamp(22px,4vw,36px)", borderRadius: 22, background: S.tealLight, border: `2px solid ${S.teal}35`, marginBottom: 56, display: "flex", gap: 18, alignItems: "flex-start", boxShadow: `0 12px 28px ${S.teal}12` }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>ℹ️</div>
              <div>
                <div style={{ fontSize: 11, color: S.tealDark, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Entry Requirements</div>
                <p style={{ fontSize: 15, color: S.navy, fontFamily: S.body, lineHeight: 1.8, margin: 0, fontWeight: 500 }}><strong>Job Certificates</strong> are open entry and do not require prior qualifications. Higher levels may accept equivalent qualifications from your country, including GCSEs, O-Levels, A-Levels, and high school diplomas. If you are unsure, <a href="#" onClick={(e) => { e.preventDefault(); setPage("Contact"); }} style={{ color: S.tealDark, fontWeight: 700 }}>contact us</a> for guidance before you apply.</p>
              </div>
            </div>
          </Reveal>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 4 }}>
        <Reveal><PartnerLogos /></Reveal>
      </WideWrap>

      <section style={{ paddingTop: 54 }}>
        <WideWrap>
          <Reveal>
            <div style={{ textAlign: "center", padding: "38px clamp(22px,4vw,40px)", background: S.white, borderRadius: 24, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: S.lightBg, color: S.coral, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Ready to Start?</div>
              <h2 style={{ color: S.navy, fontFamily: S.heading, margin: "0 0 14px", fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, lineHeight: 1.1 }}>Take the next step from anywhere in the world</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>Choose your programme, review the document requirements, and move into the CTS ETS admissions process with greater clarity.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: 16, padding: "16px 36px", border: "none", borderRadius: 14, boxShadow: `0 8px 24px ${S.coral}30` }}>Apply as an International Student</Btn>
                <Btn onClick={() => setPage("Fees & Calculator")} style={{ fontSize: 16, border: `2px solid ${S.teal}`, color: S.teal, background: "transparent", padding: "16px 36px", borderRadius: 14 }}>View Fees in USD</Btn>
              </div>
            </div>
          </Reveal>
          <PageScripture page="international" />
        </WideWrap>
      </section>
    </PageWrapper>
  );
}
