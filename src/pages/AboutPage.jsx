import React from "react";
import S from "../constants/styles";
import { FOUNDER_PHOTO } from "../constants/config";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";
import { TrustSection } from "../components/trust/TrustElements";

const PEOPLE = {
  mission: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  learners: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
};

const VALUES = [
  {
    title: "Called",
    desc: "This work is presented as a mission of purpose and service, not merely a commercial offering.",
    color: S.violet,
  },
  {
    title: "Access",
    desc: "CTS ETS exists to expand opportunity for people who may be excluded by cost, distance, or rigid schedules.",
    color: S.teal,
  },
  {
    title: "Service",
    desc: "Learner support, clarity, and responsiveness are central to the way the institution presents itself.",
    color: S.coral,
  },
  {
    title: "Excellence",
    desc: "Quality, structure, and alignment matter because learners deserve a professional and credible experience.",
    color: S.emerald,
  },
];

const STATS = [
  { num: "28", label: "Programmes", sub: "Multiple progression options", color: S.coral },
  { num: "5", label: "Qualification Levels", sub: "Job Certificate to Level 5", color: S.teal },
  { num: "100%", label: "Online Delivery", sub: "Flexible study model", color: S.violet },
  { num: "CTS ETS", label: "Called To Serve", sub: "Mission-led identity", color: S.gold },
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
            maxWidth: 720,
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

function ValueCard({ item }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: "28px 24px", boxShadow: "0 14px 34px rgba(15,23,42,0.04)", height: "100%" }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${item.color}16`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: item.color, fontFamily: S.heading, fontSize: 18, fontWeight: 800 }}>
        {item.title.slice(0, 1)}
      </div>
      <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, margin: "0 0 10px", fontWeight: 800 }}>{item.title}</h3>
      <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.78, margin: 0 }}>{item.desc}</p>
    </div>
  );
}

function StatCard({ item }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: "34px 20px", textAlign: "center", boxShadow: "0 12px 30px rgba(15,23,42,0.04)", height: "100%" }}>
      <div style={{ fontFamily: S.heading, fontSize: "clamp(34px, 5vw, 54px)", lineHeight: 1, fontWeight: 800, color: item.color, marginBottom: 14 }}>{item.num}</div>
      <div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 800, color: S.navy, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
      <div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7 }}>{item.sub}</div>
    </div>
  );
}

export default function AboutPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(360px, 0.95fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Our Story</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.02, color: "#fff", fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>Why CTS ETS exists and what it stands for</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>CTS ETS was created to expand access to meaningful training, especially for learners who need flexibility, professional structure, and a more supportive online route.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>View Programmes</Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", borderRadius: 14, padding: "15px 26px" }}>Contact Us</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 440, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.mission} alt="Learners in a modern professional training environment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🌍</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Flexible digital access</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🧭</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Mission-led support</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}>
        <Reveal>
          <SocialProofBar />
        </Reveal>
      </WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <div style={{ background: S.white, borderRadius: 28, padding: "clamp(28px, 5vw, 48px)", border: `1px solid ${S.border}`, boxShadow: "0 18px 42px rgba(15,23,42,0.05)", display: "grid", gridTemplateColumns: "minmax(320px, 0.78fr) minmax(0, 1.22fr)", gap: 34, alignItems: "center", marginBottom: 62 }} className="resp-grid-2">
            <div style={{ display: "grid", gap: 18 }}>
              <div style={{ position: "relative", maxWidth: 360, width: "100%" }}>
                <div style={{ position: "absolute", top: 18, left: -18, right: 18, bottom: -18, borderRadius: 24, border: `2px solid ${S.gold}55`, zIndex: 0 }} />
                <img src={FOUNDER_PHOTO} alt="Mark O. Lindo, Ph.D" loading="lazy" style={{ position: "relative", zIndex: 1, width: "100%", height: "auto", borderRadius: 24, objectFit: "cover", boxShadow: "0 18px 36px rgba(2,6,23,0.16)" }} />
                <div style={{ position: "relative", zIndex: 2, marginTop: 18, paddingLeft: 14, borderLeft: `3px solid ${S.teal}` }}>
                  <div style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 800, color: S.navy, lineHeight: 1.2 }}>Mark O. Lindo, Ph.D</div>
                  <div style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginTop: 5 }}>Founder and Lead Facilitator, CTS ETS</div>
                </div>
              </div>
              <div style={{ background: S.lightBg, borderRadius: 20, padding: 16, border: `1px solid ${S.border}` }}>
                <div style={{ width: "100%", height: 180, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
                  <img src={PEOPLE.learners} alt="Learners being guided during professional training" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 800, marginBottom: 8 }}>Built to serve learners who need access and direction</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, margin: 0 }}>CTS ETS exists to help capable people move forward through a more flexible and professionally presented learning route.</p>
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
        </WideWrap>
      </section>

      <section style={{ paddingTop: 6 }}>
        <WideWrap>
          <SectionIntro
            tag="Core Values"
            title="What CTS ETS stands for"
            desc="These values express the character of the institution and reinforce the mission-led identity behind the learner experience."
            accent={S.violet}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 20, marginBottom: 60 }} className="resp-grid-4">
            {VALUES.map((item) => (
              <Reveal key={item.title}>
                <ValueCard item={item} />
              </Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10 }}>
        <WideWrap>
          <SectionIntro
            tag="Institution Snapshot"
            title="A clearer institutional overview"
            desc="These headline facts help visitors quickly understand the scope, delivery model, and mission identity of CTS ETS."
            accent={S.coral}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 18, marginBottom: 56 }} className="resp-grid-4">
            {STATS.map((item) => (
              <Reveal key={item.label}>
                <StatCard item={item} />
              </Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 8 }}>
        <Reveal>
          <PartnerLogos />
        </Reveal>
      </WideWrap>

      <WideWrap style={{ marginTop: 48 }}>
        <Reveal>
          <TrustSection />
        </Reveal>
      </WideWrap>

      <section style={{ paddingTop: 56 }}>
        <WideWrap>
          <Reveal>
            <div style={{ borderRadius: 28, padding: "34px clamp(22px,4vw,40px)", background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)", boxShadow: "0 22px 54px rgba(15,23,42,0.14)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)", gap: 22, alignItems: "center" }} className="resp-grid-2">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Take the Next Step</div>
                  <h2 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,42px)", color: S.white, lineHeight: 1.1, margin: "0 0 12px", fontWeight: 900 }}>Learn more about the programmes behind the mission</h2>
                  <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.74)", lineHeight: 1.8, margin: 0, maxWidth: 660 }}>Explore the training pathways shaped by the mission, values, and learner-centred vision of CTS ETS.</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
                  <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.teal, color: S.white, borderRadius: 14, padding: "16px 28px" }}>View Our Programmes</Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)", color: S.white, borderRadius: 14, padding: "16px 28px" }}>Contact Us</Btn>
                </div>
              </div>
            </div>
          </Reveal>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 18 }}>
        <PageScripture page="about" />
      </WideWrap>
    </PageWrapper>
  );
}
