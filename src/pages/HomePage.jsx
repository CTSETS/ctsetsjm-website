import React from "react";
import S from "../constants/styles";
import { TESTIMONIALS, SOCIAL_PROOF } from "../constants/content";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  TestimonialCard,
  TalkToGraduate,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  learner: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  mentor: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
};

const PATHWAYS = [
  {
    title: "Job Certificate",
    tag: "Entry Level",
    color: S.emerald,
    desc: "A practical starting point for learners building confidence, employability, and foundational workplace skills.",
  },
  {
    title: "Level 2",
    tag: "Vocational",
    color: S.teal,
    desc: "Structured skills training for customer service, office support, digital tools, and core business functions.",
  },
  {
    title: "Level 3",
    tag: "Diploma",
    color: S.violet,
    desc: "Advanced development for supervisors, team leaders, and learners preparing for greater responsibility.",
  },
  {
    title: "Level 4–5",
    tag: "Leadership",
    color: S.coral,
    desc: "Professional progression for management, planning, coordination, and strategic workplace growth.",
  },
];

const PROGRAMME_BUCKETS = [
  {
    title: "Business & Office",
    emoji: "💼",
    desc: "Administrative support, records handling, workplace communication, and professional office readiness.",
  },
  {
    title: "People & Service",
    emoji: "🤝",
    desc: "Customer service, team support, human resource pathways, and professional engagement skills.",
  },
  {
    title: "Digital & Data",
    emoji: "💻",
    desc: "Digital literacy, modern workplace technology, and practical data awareness for today's job market.",
  },
  {
    title: "Leadership & Growth",
    emoji: "📈",
    desc: "Higher-level progression for learners moving into supervisory, management, and strategic roles.",
  },
];

const REASONS = [
  {
    title: "100% online delivery",
    desc: "Study from your phone, tablet, or laptop without the pressure of a traditional classroom timetable.",
    icon: "🌐",
  },
  {
    title: "Designed for busy adults",
    desc: "Built for working professionals, parents, and determined learners who need flexibility without sacrificing quality.",
    icon: "⏰",
  },
  {
    title: "Structured, professional experience",
    desc: "Clear pathways, polished learner materials, and guided support make the entire journey feel credible and organised.",
    icon: "🧭",
  },
  {
    title: "Jamaican rooted, internationally aware",
    desc: "CTS ETS presents local learners with a modern digital experience shaped for professional opportunities at home and beyond.",
    icon: "🇯🇲",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Explore your options",
    desc: "Review programmes and identify the pathway that best matches your goals, experience, and next career move.",
  },
  {
    num: "02",
    title: "Submit your application",
    desc: "Complete the online application process and receive your next-step guidance from the CTS ETS team.",
  },
  {
    num: "03",
    title: "Get set up",
    desc: "Receive onboarding information, learner support details, and a clearer picture of your study journey.",
  },
  {
    num: "04",
    title: "Start learning confidently",
    desc: "Move into a digital training environment focused on structure, flexibility, and meaningful progress.",
  },
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
        gridTemplateColumns: "minmax(260px, 0.85fr) minmax(320px, 1.15fr)",
        gap: 30,
        alignItems: "end",
        marginBottom: 30,
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

function StatCard({ value, label, accent = S.gold }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid " + S.border,
        borderRadius: 18,
        padding: "20px 18px",
        boxShadow: "0 12px 36px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          fontFamily: S.heading,
          fontSize: "clamp(24px, 3vw, 34px)",
          fontWeight: 800,
          color: accent,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: S.body,
          fontSize: 11,
          color: S.gray,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PathwayCard({ item }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid " + S.border,
        borderRadius: 22,
        padding: 24,
        boxShadow: "0 18px 40px rgba(15,23,42,0.05)",
        minHeight: 220,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          borderRadius: 999,
          background: item.color + "18",
          color: item.color,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.3,
          textTransform: "uppercase",
          fontFamily: S.body,
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: item.color,
          }}
        />
        {item.tag}
      </div>
      <h3
        style={{
          fontFamily: S.heading,
          fontSize: 28,
          lineHeight: 1.1,
          color: S.navy,
          margin: "0 0 12px",
          fontWeight: 800,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          lineHeight: 1.8,
          color: S.gray,
          margin: 0,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}

function BucketCard({ item }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid " + S.border,
        borderRadius: 22,
        padding: 24,
        boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 14 }}>{item.emoji}</div>
      <h3
        style={{
          fontFamily: S.heading,
          fontSize: 24,
          color: S.navy,
          margin: "0 0 10px",
          fontWeight: 800,
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
  );
}

function ReasonCard({ item }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid " + S.border,
        borderRadius: 20,
        padding: 22,
        boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
      <h3
        style={{
          fontFamily: S.heading,
          fontSize: 22,
          color: S.navy,
          margin: "0 0 10px",
          fontWeight: 800,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          lineHeight: 1.75,
          color: S.gray,
          margin: 0,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}

function StepCard({ item }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 22,
        padding: 24,
        backdropFilter: "blur(10px)",
        minHeight: 210,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: S.gold,
          color: S.navy,
          fontFamily: S.body,
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 1.5,
          marginBottom: 16,
        }}
      >
        {item.num}
      </div>
      <h3
        style={{
          fontFamily: S.heading,
          fontSize: 24,
          color: "#fff",
          margin: "0 0 10px",
          fontWeight: 800,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.75)",
          margin: 0,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}

export default function HomePage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      {/* ═══════════ HERO ═══════════ */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0B1120 0%, #15233B 52%, #0E8F8B 140%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 25%, rgba(217,119,6,0.18), transparent 32%), radial-gradient(circle at 85% 20%, rgba(37,99,235,0.16), transparent 28%), radial-gradient(circle at 60% 80%, rgba(14,143,139,0.14), transparent 26%)",
          }}
        />
        <WideWrap style={{ position: "relative", paddingTop: 72, paddingBottom: 72 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(420px, 0.85fr)",
              gap: 42,
              alignItems: "stretch",
            }}
            className="resp-grid-2"
          >
            <Reveal>
              <div>
                <h1
                  style={{
                    fontFamily: S.heading,
                    fontSize: "clamp(40px, 7vw, 78px)",
                    lineHeight: 1.02,
                    color: "#fff",
                    margin: "0 0 20px",
                    fontWeight: 900,
                    maxWidth: 980,
                  }}
                >
                  Flexible Online Training for
                  <span style={{ display: "block", color: S.goldLight }}>
                    Career Growth in Jamaica and Beyond
                  </span>
                </h1>

                <p
                  style={{
                    fontFamily: S.body,
                    fontSize: "clamp(16px, 2vw, 20px)",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.82)",
                    maxWidth: 900,
                    margin: "0 0 30px",
                  }}
                >
                  CTS ETS is built for working adults, ambitious learners, and
                  professionals who need a structured training experience without
                  losing the flexibility of online study.
                </p>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
                  <Btn
                    primary
                    onClick={() => setPage("Apply")}
                    style={{
                      background: S.gold,
                      color: S.navy,
                      borderRadius: 14,
                      padding: "16px 28px",
                      boxShadow: "0 16px 36px rgba(217,119,6,0.28)",
                    }}
                  >
                    Start Your Application
                  </Btn>
                  <Btn
                    onClick={() => setPage("Programmes")}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "#fff",
                      borderRadius: 14,
                      padding: "16px 28px",
                    }}
                  >
                    Explore Programmes
                  </Btn>
                </div>

                {/* ✅ REMOVED: Upcoming Classes block */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                  }}
                  className="resp-grid-4"
                >
                  {[
                    "100% online delivery",
                    "Flexible pathways",
                    "Professional support",
                    "Modern learner experience",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: "14px 16px",
                        color: "#fff",
                        fontFamily: S.body,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.92fr)",
                  gap: 18,
                }}
                className="resp-grid-2"
              >
                <div
                  style={{
                    gridRow: "1 / 3",
                    minHeight: 420,
                    borderRadius: 28,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    padding: 20,
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                        color: S.goldLight,
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: S.body,
                        letterSpacing: 1.3,
                        textTransform: "uppercase",
                        marginBottom: 14,
                      }}
                    >
                      Digital Campus
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 210,
                        borderRadius: 22,
                        overflow: "hidden",
                        marginBottom: 18,
                        boxShadow: "0 18px 36px rgba(2,6,23,0.18)",
                      }}
                    >
                      <img
                        src={PEOPLE.hero}
                        alt="Learners collaborating around a laptop in a modern professional setting"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <h3
                      style={{
                        fontFamily: S.heading,
                        fontSize: 34,
                        color: "#fff",
                        margin: "0 0 10px",
                        lineHeight: 1.08,
                        fontWeight: 800,
                      }}
                    >
                      A cleaner learning journey for serious learners
                    </h3>
                    <p
                      style={{
                        fontFamily: S.body,
                        fontSize: 14,
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.78)",
                        margin: 0,
                      }}
                    >
                      Study online with a more polished, structured, and flexible
                      experience designed to support progress without unnecessary
                      friction.
                    </p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderRadius: 18,
                        padding: 16,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div style={{ color: S.goldLight, fontSize: 22, marginBottom: 8 }}>🎓</div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: S.body }}>
                        Guided learning support
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        borderRadius: 18,
                        padding: 16,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div style={{ color: S.goldLight, fontSize: 22, marginBottom: 8 }}>📱</div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: S.body }}>
                        Learn from any device
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 24,
                    background: "#fff",
                    padding: 22,
                    boxShadow: "0 18px 44px rgba(2,6,23,0.14)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 130,
                      borderRadius: 18,
                      overflow: "hidden",
                      marginBottom: 14,
                    }}
                  >
                    <img
                      src={PEOPLE.learner}
                      alt="Professional learner studying online with a laptop"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: S.heading,
                      fontSize: 24,
                      color: S.navy,
                      fontWeight: 800,
                      marginBottom: 8,
                    }}
                  >
                    Local heart. Professional presentation.
                  </div>
                  <p
                    style={{
                      fontFamily: S.body,
                      fontSize: 13,
                      color: S.gray,
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    Study with a Jamaican training institution that presents a
                    clear, modern, and professional online learning experience.
                  </p>
                </div>

                <div
                  style={{
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    padding: 22,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: S.heading,
                      fontSize: 30,
                      color: S.goldLight,
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    {SOCIAL_PROOF.programmes}
                  </div>
                  <div
                    style={{
                      fontFamily: S.body,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    Programmes
                  </div>
                  <p
                    style={{
                      fontFamily: S.body,
                      fontSize: 13,
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.76)",
                      margin: 0,
                    }}
                  >
                    Multiple learning pathways help learners identify where they
                    fit and how they can progress.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      {/* ═══════════ STATS ═══════════ */}
      <WideWrap style={{ marginTop: -36, position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
          }}
          className="resp-grid-4"
        >
          <Reveal>
            <StatCard value={SOCIAL_PROOF.enrolled} label="Facilitating Learning" accent={S.sky} />
          </Reveal>
          <Reveal delay={0.04}>
            <StatCard value={SOCIAL_PROOF.programmes} label="Programmes" accent={S.goldDark} />
          </Reveal>
          <Reveal delay={0.08}>
            <StatCard value={SOCIAL_PROOF.completionRate} label="Completion Rate" accent={S.emerald} />
          </Reveal>
          <Reveal delay={0.12}>
            <StatCard value={SOCIAL_PROOF.satisfaction} label="Student Satisfaction" accent={S.violet} />
          </Reveal>
        </div>
      </WideWrap>

      {/* ═══════════ PARTNERS ═══════════ */}
      <WideWrap style={{ paddingTop: 44 }}>
        <Reveal>
          <PartnerLogos />
        </Reveal>
      </WideWrap>

      {/* ═══════════ FEATURED STUDY AREAS ═══════════ */}
      <section style={{ paddingTop: 30 }}>
        <WideWrap>
          <SectionIntro
            tag="Featured Study Areas"
            title="Professional options learners can quickly understand"
            desc="Explore the main areas of study available through CTS ETS, from office and business training to digital skills, people support, and leadership development."
            accent={S.teal}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 0.9fr) minmax(0, 1.1fr)",
              gap: 24,
              alignItems: "stretch",
            }}
            className="resp-grid-2"
          >
            <Reveal>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${S.border}`,
                  borderRadius: 26,
                  padding: 20,
                  boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
                  minHeight: 100,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 300,
                    borderRadius: 20,
                    overflow: "hidden",
                    marginBottom: 18,
                  }}
                >
                  <img
                    src={PEOPLE.mentor}
                    alt="Professional mentor guiding learners during a digital training session"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: S.heading,
                    fontSize: 28,
                    color: S.navy,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  Training with structure, support, and real human connection
                </div>
                <p
                  style={{
                    fontFamily: S.body,
                    fontSize: 14,
                    color: S.gray,
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  CTS ETS combines flexibility with a more organised learner
                  experience so online study still feels guided and professional.
                </p>
              </div>
            </Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 18,
              }}
              className="resp-grid-2"
            >
              {PROGRAMME_BUCKETS.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.05}>
                  <BucketCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <Btn onClick={() => setPage("Programmes")} style={{ borderRadius: 12, padding: "14px 30px" }}>
              View All Programmes
            </Btn>
          </div>
        </WideWrap>
      </section>

      {/* ═══════════ STUDY PATHWAYS ═══════════ */}
      <section style={{ paddingTop: 48 }}>
        <WideWrap>
          <SectionIntro
            tag="Study Pathways"
            title="Find the level that fits your next step"
            desc="Whether you are just starting, strengthening practical workplace skills, or preparing for leadership, CTS ETS offers levels that support clear progression."
            accent={S.goldDark}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 20,
            }}
            className="resp-grid-4"
          >
            {PATHWAYS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <PathwayCard item={item} />
              </Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      {/* ═══════════ WHY CTS ETS ═══════════ */}
      <section style={{ paddingTop: 48 }}>
        <WideWrap>
          <SectionIntro
            tag="Why CTS ETS"
            title="A clearer reason to choose CTS ETS"
            desc="Learn in a flexible online environment built for serious adults who want structure, support, and a more professional training experience."
            accent={S.coral}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
              gap: 24,
              alignItems: "stretch",
            }}
            className="resp-grid-2"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 18,
              }}
              className="resp-grid-2"
            >
              {REASONS.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.05}>
                  <ReasonCard item={item} />
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${S.border}`,
                  borderRadius: 26,
                  padding: 20,
                  boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
                  minHeight: 100,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    minHeight: 320,
                    borderRadius: 20,
                    overflow: "hidden",
                    marginBottom: 18,
                  }}
                >
                  <img
                    src={PEOPLE.hero}
                    alt="Professionals and learners collaborating in a modern training environment"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: S.heading,
                    fontSize: 28,
                    color: S.navy,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  A modern institution for ambitious learners
                </div>
                <p
                  style={{
                    fontFamily: S.body,
                    fontSize: 14,
                    color: S.gray,
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  CTS ETS is designed to help learners move forward with a stronger
                  sense of professionalism, direction, and possibility.
                </p>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section
        style={{
          marginTop: 60,
          background:
            "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 140%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(217,119,6,0.14), transparent 28%), radial-gradient(circle at 82% 70%, rgba(124,58,237,0.14), transparent 24%)",
          }}
        />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 64 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 1.22fr)",
              gap: 34,
              alignItems: "start",
            }}
            className="resp-grid-2"
          >
            <Reveal>
              <div>
                <div
                  style={{
                    fontFamily: S.body,
                    fontSize: 11,
                    color: S.goldLight,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: 14,
                  }}
                >
                  How It Works
                </div>
                <h2
                  style={{
                    fontFamily: S.heading,
                    fontSize: "clamp(30px, 4vw, 52px)",
                    color: "#fff",
                    lineHeight: 1.06,
                    margin: "0 0 14px",
                    fontWeight: 900,
                    maxWidth: 640,
                  }}
                >
                  A simple enrolment journey builds confidence
                </h2>
                <p
                  style={{
                    fontFamily: S.body,
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.75)",
                    margin: "0 0 24px",
                    maxWidth: 560,
                  }}
                >
                  From exploring programmes to submitting an application and
                  starting your training, the path is designed to feel clear,
                  guided, and manageable.
                </p>
                <Btn
                  primary
                  onClick={() => setPage("Apply")}
                  style={{
                    background: "#fff",
                    color: S.navy,
                    borderRadius: 14,
                    padding: "15px 28px",
                  }}
                >
                  Enquire or Apply
                </Btn>
              </div>
            </Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 16,
              }}
              className="resp-grid-4"
            >
              {STEPS.map((item, index) => (
                <Reveal key={item.num} delay={index * 0.05}>
                  <StepCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </WideWrap>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section style={{ paddingTop: 54 }}>
        <WideWrap>
          <SectionIntro
            tag="Learner Voices"
            title="See how learners describe the CTS ETS experience"
            desc="Real learner feedback helps new visitors understand the value of the training, the flexibility of the model, and the quality of the support provided."
            accent={S.violet}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 18,
            }}
            className="resp-grid-3"
          >
            {TESTIMONIALS.slice(0, 3).map((t, index) => (
              <Reveal key={t.name} delay={index * 0.05}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
          <TalkToGraduate setPage={setPage} />
        </WideWrap>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section style={{ paddingTop: 56 }}>
        <WideWrap>
          <Reveal>
            <div
              style={{
                borderRadius: 28,
                padding: "36px clamp(22px, 4vw, 42px)",
                background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)",
                boxShadow: "0 24px 56px rgba(15,23,42,0.16)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
                  gap: 28,
                  alignItems: "center",
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
                      background: "rgba(255,255,255,0.06)",
                      color: S.goldLight,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      fontFamily: S.body,
                      marginBottom: 14,
                    }}
                  >
                    Ready to Take the Next Step?
                  </div>
                  <h2
                    style={{
                      fontFamily: S.heading,
                      fontSize: "clamp(30px, 4vw, 48px)",
                      color: "#fff",
                      lineHeight: 1.08,
                      margin: "0 0 14px",
                      fontWeight: 900,
                      maxWidth: 760,
                    }}
                  >
                    Start your next step with CTS ETS
                  </h2>
                  <p
                    style={{
                      fontFamily: S.body,
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.74)",
                      margin: 0,
                      maxWidth: 700,
                    }}
                  >
                    Explore your options, apply online, and begin a flexible
                    learning journey designed to support real personal and
                    professional progress.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  <Btn
                    primary
                    onClick={() => setPage("Apply")}
                    style={{
                      background: S.gold,
                      color: S.navy,
                      borderRadius: 14,
                      padding: "16px 28px",
                    }}
                  >
                    Apply Now
                  </Btn>
                  <Btn
                    onClick={() => setPage("Contact")}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "#fff",
                      borderRadius: 14,
                      padding: "16px 28px",
                    }}
                  >
                    Contact Admissions
                  </Btn>
                </div>
              </div>
            </div>
          </Reveal>
        </WideWrap>
      </section>

      <PageScripture page="home" />
    </PageWrapper>
  );
}
