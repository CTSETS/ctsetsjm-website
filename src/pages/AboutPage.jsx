import React from "react";
import S from "../constants/styles";
import { CTS_CREST_LOGO } from "../constants/config";
import { PageWrapper, Btn, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const IMAGES = {
  learners: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
};

const VALUES = [
  {
    letter: "C",
    word: "Called",
    text: "Purpose-led training with a clear sense of responsibility to the learner.",
    accent: S.gold,
    icon: "spark",
  },
  {
    letter: "T",
    word: "To",
    text: "A directed route that helps learners move toward meaningful development.",
    accent: S.teal,
    icon: "arrow",
  },
  {
    letter: "S",
    word: "Serve",
    text: "Support, care, and responsiveness are treated as part of the service itself.",
    accent: S.coral,
    icon: "hands",
  },
  {
    letter: "E",
    word: "Excellence",
    text: "Professional standards, structure, and quality remain central to the experience.",
    accent: S.sky,
    icon: "star",
  },
  {
    letter: "T",
    word: "Through",
    text: "The institution works through a clear model, not confusion or guesswork.",
    accent: S.emerald,
    icon: "path",
  },
  {
    letter: "S",
    word: "Service",
    text: "Excellence is expressed through the way people are guided, supported, and prepared.",
    accent: S.goldDark,
    icon: "shield",
  },
];

const MODEL = [
  {
    title: "Flexible Online Delivery",
    text: "Learners can study within a more manageable schedule while still moving through a structured and professionally guided route.",
    accent: S.teal,
  },
  {
    title: "Recognised Progression",
    text: "CTS ETS presents qualification levels that help learners understand where they are starting and how they can move upward over time.",
    accent: S.gold,
  },
  {
    title: "Learner Support",
    text: "The experience is designed to feel clearer and less intimidating, with more guidance around programmes, readiness, and next steps.",
    accent: S.coral,
  },
  {
    title: "Institutional Credibility",
    text: "The public face, stakeholder alignment, and training pathways are presented to reinforce trust, seriousness, and vocational relevance.",
    accent: S.sky,
  },
];

const SNAPSHOT = [
  { value: "28", label: "Programmes", note: "Multiple vocational pathways", tint: `${S.coral}10`, border: `${S.coral}24`, text: S.coral },
  { value: "5", label: "Qualification Levels", note: "Job Certificate to Level 5", tint: `${S.teal}10`, border: `${S.teal}24`, text: S.teal },
  { value: "100%", label: "Online Delivery", note: "Flexible digital model", tint: `${S.sky}10`, border: `${S.sky}24`, text: S.sky },
  { value: "CTS ETS", label: "Called To Serve", note: "Mission-led institutional identity", tint: `${S.gold}12`, border: `${S.gold}28`, text: S.goldDark },
];

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1120,
        margin: "0 auto",
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
        gridTemplateColumns: "minmax(240px, 0.8fr) minmax(320px, 1.2fr)",
        gap: 20,
        alignItems: "end",
        marginBottom: 20,
      }}
      className="resp-grid-2"
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: `${accent}12`,
            color: accent,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontFamily: S.body,
            marginBottom: 8,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(22px, 2.6vw, 30px)",
            lineHeight: 1.12,
            color: S.navy,
            margin: 0,
            fontWeight: 800,
            maxWidth: 700,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          lineHeight: 1.75,
          color: S.gray,
          margin: 0,
          maxWidth: 720,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function ValueIcon({ kind, color }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (kind) {
    case "spark":
      return <svg {...common}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>;
    case "hands":
      return <svg {...common}><path d="M8 12l2-2a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 0 2.8 0L17 9" /><path d="M3 13l3-3 4 4 2-2 4 4 5-5" /></svg>;
    case "star":
      return <svg {...common}><path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3z" /></svg>;
    case "path":
      return <svg {...common}><path d="M4 18c2-4 4-6 8-6s6-2 8-6" /><circle cx="4" cy="18" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="20" cy="6" r="1.5" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3z" /><path d="M9.5 12l1.7 1.7L15 10" /></svg>;
    default:
      return null;
  }
}

function CompactCard({ children, style }) {
  return (
    <div
      style={{
        background: S.white,
        border: `1px solid ${S.border}`,
        borderRadius: 8,
        padding: "13px 12px",
        boxShadow: "0 10px 22px rgba(15,23,42,0.04)",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ValueWordCard({ item }) {
  return (
    <CompactCard style={{ borderColor: `${item.accent}24` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${item.accent}14`,
            border: `1px solid ${item.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: item.accent,
            fontFamily: S.heading,
            fontSize: 17,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {item.letter}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `${item.accent}10`,
              border: `1px solid ${item.accent}24`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ValueIcon kind={item.icon} color={item.accent} />
          </div>
          <div style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 800, lineHeight: 1.08 }}>
            {item.word}
          </div>
        </div>
      </div>
      <p style={{ fontFamily: S.body, fontSize: 11.5, color: S.gray, lineHeight: 1.55, margin: 0 }}>{item.text}</p>
    </CompactCard>
  );
}

function InfoCard({ title, text, accent }) {
  return (
    <CompactCard>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${accent}16`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
          color: accent,
          fontFamily: S.heading,
          fontSize: 14,
          fontWeight: 800,
        }}
      >
        {title.slice(0, 1)}
      </div>
      <div style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, marginBottom: 6, fontWeight: 800, lineHeight: 1.1 }}>
        {title}
      </div>
      <p style={{ fontFamily: S.body, fontSize: 11.5, color: S.gray, lineHeight: 1.55, margin: 0 }}>{text}</p>
    </CompactCard>
  );
}

function SnapshotCard({ item }) {
  return (
    <div
      style={{
        background: item.tint,
        border: `1px solid ${item.border}`,
        borderRadius: 8,
        padding: "16px 12px",
        textAlign: "center",
        boxShadow: "0 10px 22px rgba(15,23,42,0.04)",
        height: "100%",
      }}
    >
      <div style={{ fontFamily: S.heading, fontSize: "clamp(21px, 2.5vw, 26px)", lineHeight: 1, fontWeight: 800, color: item.text, marginBottom: 7 }}>
        {item.value}
      </div>
      <div style={{ fontFamily: S.body, fontSize: 10.5, fontWeight: 800, color: S.navy, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 5 }}>
        {item.label}
      </div>
      <div style={{ fontFamily: S.body, fontSize: 10.5, color: S.gray, lineHeight: 1.48 }}>{item.note}</div>
    </div>
  );
}

export default function AboutPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #061428 0%, #011E40 54%, #0A6E8A 122%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(196,145,18,0.18), transparent 28%), radial-gradient(circle at 82% 18%, rgba(10,110,138,0.16), transparent 24%), radial-gradient(circle at 70% 80%, rgba(0,155,58,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 24, paddingBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.04fr) minmax(240px, 0.96fr)", gap: 18, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 10, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", color: S.goldLight, marginBottom: 10 }}>
                  About
                </div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(22px, 2.8vw, 29px)", lineHeight: 1.08, color: "#fff", fontWeight: 800, margin: "0 0 8px", maxWidth: 540 }}>
                  An institution built to expand access, structure, and meaningful vocational progression
                </h1>
                <p style={{ fontFamily: S.body, fontSize: 12.5, lineHeight: 1.58, color: "rgba(255,255,255,0.82)", maxWidth: 560, margin: "0 0 14px" }}>
                  CTS ETS was created to offer a more flexible, professionally presented, and mission-led route for learners who need recognised development without being blocked by rigid delivery models or distance.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.gold, color: S.navy, borderRadius: 8, padding: "10px 16px", boxShadow: "0 14px 30px rgba(217,119,6,0.22)" }}>
                    View Programmes
                  </Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", borderRadius: 8, padding: "10px 16px" }}>
                    Contact Us
                  </Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: 10, backdropFilter: "blur(10px)", boxShadow: "0 16px 30px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 204, borderRadius: 8, marginBottom: 8, background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)", border: "1px solid rgba(255,255,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
                  <img src={CTS_CREST_LOGO} alt="CTS ETS school crest" style={{ width: "100%", maxWidth: 154, height: "auto", objectFit: "contain" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }} className="resp-grid-2">
                  <InfoCard title="Flexible Access" text="The institution is designed for people who need serious training within a more manageable schedule." accent={S.gold} />
                  <InfoCard title="Mission-Led Support" text="Called to Serve shapes the tone, clarity, and learner-centred support CTS ETS seeks to provide." accent={S.teal} />
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <section style={{ paddingTop: 18 }}>
        <WideWrap>
          <div style={{ background: S.white, borderRadius: 8, padding: "clamp(16px, 2.8vw, 22px)", border: `1px solid ${S.border}`, boxShadow: "0 14px 28px rgba(15,23,42,0.05)", display: "grid", gridTemplateColumns: "minmax(240px, 0.9fr) minmax(0, 1.1fr)", gap: 16, alignItems: "center", marginBottom: 26 }} className="resp-grid-2">
            <div style={{ display: "grid", gap: 10 }}>
              <CompactCard style={{ background: "linear-gradient(135deg, rgba(10,110,138,0.08) 0%, rgba(196,145,18,0.12) 100%)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 10px", borderRadius: 999, background: "#fff", border: `1px solid ${S.border}`, color: S.teal, fontSize: 10, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", fontFamily: S.body, marginBottom: 8 }}>
                  Institutional Focus
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 800, color: S.navy, lineHeight: 1.1, marginBottom: 6 }}>
                  Built around access, structure, and credible learner progression
                </div>
                <p style={{ fontFamily: S.body, fontSize: 11.5, color: S.gray, lineHeight: 1.55, margin: 0 }}>
                  CTS ETS is presented as an institution designed to widen access to meaningful training through a structured, professional, and flexible online environment.
                </p>
              </CompactCard>
              <CompactCard style={{ background: S.lightBg }}>
                <div style={{ width: "100%", height: 118, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                  <img src={IMAGES.learners} alt="Learners being guided during professional training" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 800, marginBottom: 6, lineHeight: 1.1 }}>
                  Built to serve learners who need access and direction
                </div>
                <p style={{ fontFamily: S.body, fontSize: 11.5, color: S.gray, lineHeight: 1.55, margin: 0 }}>
                  The goal is not only to provide courses, but to offer a clearer route into recognised development, confidence, and vocational readiness.
                </p>
              </CompactCard>
            </div>
            <div>
              <div style={{ fontSize: 10, color: S.teal, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 7 }}>
                Our Story
              </div>
              <h2 style={{ fontFamily: S.heading, fontSize: "clamp(18px, 2.2vw, 24px)", color: S.navy, fontWeight: 800, lineHeight: 1.12, margin: "0 0 10px" }}>
                A mission rooted in access, dignity, and opportunity
              </h2>
              <div style={{ fontFamily: S.body, fontSize: 12, color: "#334155", lineHeight: 1.62 }}>
                <p style={{ margin: "0 0 12px" }}>
                  CTS ETS was built around a simple conviction: that more people should be able to access meaningful training and recognised development without being blocked by inflexible systems, distance, or circumstance.
                </p>
                <p style={{ margin: "0 0 12px" }}>
                  Many capable people are ready to grow, ready to work, and ready to move forward, yet the traditional path can still feel out of reach. CTS ETS was created to help close that gap by offering a more accessible digital route.
                </p>
                <blockquote style={{ margin: "14px 0", padding: "12px 14px", borderRadius: 8, background: S.lightBg, borderLeft: `4px solid ${S.gold}`, fontFamily: S.heading, fontSize: 16, lineHeight: 1.34, color: S.navy, fontStyle: "italic" }}>
                  "Called to Serve is not just a tagline. It expresses the purpose behind the institution."
                </blockquote>
                <p style={{ margin: "0 0 12px" }}>
                  The institution aims to provide a more polished, supportive, and structured learning environment where learners can build confidence and work toward real progress.
                </p>
                <p style={{ margin: 0, fontWeight: 700, color: S.navy }}>
                  CTS ETS exists to help the next step feel possible.
                </p>
              </div>
            </div>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 2 }}>
        <WideWrap>
          <SectionIntro tag="Core Values" title="What CTS ETS stands for" desc="The institutional identity is expressed through the words that make up CTS ETS: Called To Serve and Excellence Through Service." accent={S.gold} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 26 }} className="resp-grid-3">
            {VALUES.map((item) => (
              <Reveal key={`${item.letter}-${item.word}`}>
                <ValueWordCard item={item} />
              </Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 2 }}>
        <WideWrap>
          <SectionIntro tag="How It Works" title="How the institution presents its learning model" desc="CTS ETS combines flexible online delivery, clearer progression pathways, learner support, and public credibility into one structured institutional story." accent={S.teal} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 26 }} className="resp-grid-4">
            {MODEL.map((item) => (
              <Reveal key={item.title}>
                <InfoCard title={item.title} text={item.text} accent={item.accent} />
              </Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 2 }}>
        <Reveal>
          <PartnerLogos />
        </Reveal>
      </WideWrap>

      <section style={{ paddingTop: 14 }}>
        <WideWrap>
          <SectionIntro tag="Institution Snapshot" title="A clearer institutional overview" desc="" accent={S.coral} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 26 }} className="resp-grid-4">
            {SNAPSHOT.map((item) => (
              <Reveal key={item.label}>
                <SnapshotCard item={item} />
              </Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10 }}>
        <WideWrap>
          <Reveal>
            <div style={{ borderRadius: 8, padding: "18px clamp(16px,3vw,22px)", background: "linear-gradient(135deg, #061428 0%, #011E40 60%, #0A6E8A 140%)", boxShadow: "0 18px 34px rgba(15,23,42,0.14)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(220px, 0.92fr)", gap: 14, alignItems: "center" }} className="resp-grid-2">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: S.body, marginBottom: 8 }}>
                    Take the Next Step
                  </div>
                  <h2 style={{ fontFamily: S.heading, fontSize: "clamp(18px,2.2vw,24px)", color: S.white, lineHeight: 1.1, margin: "0 0 8px", fontWeight: 800 }}>
                    Explore the programmes behind the institutional mission
                  </h2>
                  <p style={{ fontFamily: S.body, fontSize: 12, color: "rgba(255,255,255,0.74)", lineHeight: 1.58, margin: 0, maxWidth: 500 }}>
                    Review the training pathways shaped by the mission, values, and learner-centred direction of CTS ETS.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-start" }}>
                  <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.teal, color: S.white, borderRadius: 8, padding: "10px 16px" }}>
                    View Our Programmes
                  </Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)", color: S.white, borderRadius: 8, padding: "10px 16px" }}>
                    Contact Us
                  </Btn>
                </div>
              </div>
            </div>
          </Reveal>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 14 }}>
        <PageScripture page="about" />
      </WideWrap>
    </PageWrapper>
  );
}

