import React from "react";
import S from "../constants/styles";
import { TESTIMONIALS } from "../constants/content";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
  TestimonialCard,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  compare: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  support: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
};

const FEATURES = [
  {
    icon: "🎓",
    title: "Recognised training pathways",
    desc: "Programmes are built around structured competency-based development so learners can pursue credible and organised growth.",
    color: S.teal,
  },
  {
    icon: "💻",
    title: "Fully online access",
    desc: "Study from anywhere using a phone, tablet, or computer without needing to travel to a physical campus.",
    color: S.violet,
  },
  {
    icon: "📚",
    title: "Supportive learning design",
    desc: "A more guided learning experience reduces confusion and helps learners stay engaged from enquiry to completion.",
    color: S.coral,
  },
  {
    icon: "⏰",
    title: "Built for real schedules",
    desc: "The model is especially suited to working adults and busy learners who need flexibility around life and work commitments.",
    color: S.amber,
  },
  {
    icon: "💳",
    title: "Clear payment options",
    desc: "Learners can understand staged payment options more clearly before they commit to a training decision.",
    color: S.emerald,
  },
  {
    icon: "👥",
    title: "Human support still matters",
    desc: "Online delivery works best when learners still feel guided, informed, and able to ask questions when needed.",
    color: S.sky,
  },
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
  "You are mainly choosing based on low or no direct upfront training cost.",
  "You already have easy access to a suitable training centre.",
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

function FeatureCard({ item }) {
  return (
    <div
      style={{
        padding: "28px 22px",
        borderRadius: 22,
        background: "#fff",
        border: `1px solid ${S.border}`,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        height: "100%",
        boxShadow: "0 14px 34px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: item.color + "16",
          border: "1px solid " + item.color + "28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}
      >
        {item.icon}
      </div>
      <div>
        <h3
          style={{
            fontFamily: S.heading,
            fontSize: 21,
            fontWeight: 800,
            color: S.navy,
            margin: "0 0 8px",
            lineHeight: 1.15,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: S.body,
            fontSize: 14,
            color: S.gray,
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function FitCard({ title, intro, items, positive = true }) {
  return (
    <div
      style={{
        background: positive ? S.emeraldLight : "#fff",
        borderRadius: 22,
        padding: 28,
        border: positive ? `1px solid ${S.emerald}35` : `1px solid ${S.border}`,
        boxShadow: positive
          ? "0 16px 36px rgba(16,185,129,0.10)"
          : "0 14px 30px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: positive ? S.emeraldDark : S.teal,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontFamily: S.body,
          fontWeight: 800,
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          color: positive ? S.navy : S.gray,
          lineHeight: 1.75,
          margin: "0 0 16px",
        }}
      >
        {intro}
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span
              style={{
                color: positive ? S.emerald : S.teal,
                fontWeight: 900,
                fontSize: 16,
                flexShrink: 0,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              {positive ? "✓" : "•"}
            </span>
            <span
              style={{
                fontSize: 14,
                color: positive ? S.navy : S.gray,
                fontFamily: S.body,
                lineHeight: 1.65,
                fontWeight: positive ? 600 : 500,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhyChoosePage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)",
          }}
        />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
              gap: 34,
              alignItems: "center",
            }}
            className="resp-grid-2"
          >
            <Reveal>
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontFamily: S.body,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    color: S.goldLight,
                    marginBottom: 18,
                  }}
                >
                  Why CTS ETS
                </div>
                <h1
                  style={{
                    fontFamily: S.heading,
                    fontSize: "clamp(38px, 6vw, 72px)",
                    lineHeight: 1.02,
                    color: "#fff",
                    fontWeight: 900,
                    margin: "0 0 18px",
                    maxWidth: 920,
                  }}
                >
                  Why learners choose a more flexible and modern route
                </h1>
                <p
                  style={{
                    fontFamily: S.body,
                    fontSize: "clamp(15px, 2vw, 19px)",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.82)",
                    maxWidth: 860,
                    margin: "0 0 24px",
                  }}
                >
                  CTS ETS is designed for learners who want structure, flexibility, and a more polished digital training experience without losing the value of human support.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn
                    primary
                    onClick={() => setPage("Apply")}
                    style={{
                      background: S.gold,
                      color: S.navy,
                      borderRadius: 14,
                      padding: "15px 26px",
                      boxShadow: "0 16px 38px rgba(217,119,6,0.24)",
                    }}
                  >
                    Apply Now
                  </Btn>
                  <Btn
                    onClick={() => setPage("Programmes")}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "#fff",
                      borderRadius: 14,
                      padding: "15px 26px",
                    }}
                  >
                    Browse Programmes
                  </Btn>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 26,
                  padding: 18,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 20px 42px rgba(2,6,23,0.16)",
                }}
              >
                <div style={{ width: "100%", height: 440, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img
                    src={PEOPLE.hero}
                    alt="Learners collaborating in a modern training environment"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🌐</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Flexible online study</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🤝</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Human support still matters</div>
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
          <SectionIntro
            tag="The CTS Difference"
            title="A stronger value story presented with more clarity"
            desc="This section helps visitors understand the practical value of CTS ETS, especially when flexibility, convenience, and guided support matter most."
            accent={S.teal}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 0.92fr) minmax(0, 1.08fr)",
              gap: 24,
              alignItems: "stretch",
            }}
            className="resp-grid-2"
          >
            <Reveal>
              <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)", minHeight: 100 }}>
                <div style={{ width: "100%", minHeight: 360, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                  <img src={PEOPLE.support} alt="Professional learner receiving guidance during online training" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>A digital training model that still feels supported</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>CTS ETS is built for people who want convenience without losing clarity, structure, and real communication.</p>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }} className="resp-grid-2">
              {FEATURES.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.04}>
                  <FeatureCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 48 }}>
        <WideWrap>
          <SectionIntro
            tag="A Fair Comparison"
            title="When is CTS ETS the better fit?"
            desc="HEART/NSTA Trust remains an important path for many learners. This comparison helps visitors see when the CTS ETS model may fit their circumstances more comfortably."
            accent={S.coral}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.14fr) minmax(320px, 0.86fr)",
              gap: 24,
              alignItems: "start",
            }}
            className="resp-grid-2"
          >
            <Reveal>
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
            </Reveal>
            <Reveal>
              <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", height: 340, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                  <img src={PEOPLE.compare} alt="Professional discussing training options with a learner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Different learners need different routes</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>The strongest comparison pages are honest. CTS ETS is ideal when flexibility, convenience, and a smoother digital experience matter most.</p>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 48 }}>
        <WideWrap>
          <SectionIntro
            tag="Best Fit"
            title="Which route suits your situation?"
            desc="A trustworthy page should clearly acknowledge that different learning models work better for different people."
            accent={S.emerald}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 22 }} className="resp-grid-2">
            <Reveal>
              <FitCard
                title="CTS ETS may be right for you if..."
                intro="This path is most compelling when the learner values convenience, flexibility, and a smoother digital experience."
                items={BEST_FOR_CTS}
                positive
              />
            </Reveal>
            <Reveal>
              <FitCard
                title="A traditional route may suit you better if..."
                intro="It is helpful to say this clearly. Different learners need different models."
                items={BEST_FOR_HEART}
                positive={false}
              />
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 48 }}>
        <Reveal>
          <PartnerLogos />
        </Reveal>
      </WideWrap>

      <section style={{ paddingTop: 46 }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }} className="resp-grid-2">
            <Reveal>
              <TestimonialCard t={TESTIMONIALS[0]} />
            </Reveal>
            <Reveal>
              <TestimonialCard t={TESTIMONIALS[4]} />
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 56 }}>
        <WideWrap>
          <Reveal>
            <div style={{ textAlign: "center", padding: "42px 28px", background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)", borderRadius: 28, boxShadow: "0 22px 54px rgba(15,23,42,0.14)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Ready to Take the Next Step?</div>
              <h2 style={{ color: S.white, fontFamily: S.heading, margin: "0 0 14px", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, lineHeight: 1.1 }}>Choose the route that fits your life and your goals</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(255,255,255,0.74)", lineHeight: 1.8, maxWidth: 760, margin: "0 auto 24px" }}>Explore the option that best matches your reality, your schedule, and the kind of learning experience you want.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: 16, padding: "16px 40px", border: "none", borderRadius: 14 }}>Apply Now</Btn>
                <Btn onClick={() => setPage("Programmes")} style={{ fontSize: 16, border: `1px solid rgba(255,255,255,0.18)`, color: S.white, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px 40px" }}>Browse Programmes</Btn>
              </div>
            </div>
          </Reveal>
        </WideWrap>
      </section>

      <WideWrap style={{ paddingTop: 18 }}>
        <PageScripture page="whyChoose" />
      </WideWrap>
    </PageWrapper>
  );
}
