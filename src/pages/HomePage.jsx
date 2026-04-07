import React from "react";
import S from "../constants/styles";
import { TESTIMONIALS, SOCIAL_PROOF } from "../constants/content";
import {
  Container,
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  TestimonialCard,
  TalkToGraduate,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

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
    desc: "Digital literacy, modern workplace technology, and practical data awareness for today’s job market.",
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

function WideIntro({ tag, title, desc, accent = S.teal }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 0.82fr) minmax(320px, 1.18fr)",
        gap: 28,
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
            fontSize: "clamp(30px,4vw,48px)",
            lineHeight: 1.08,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 16,
          lineHeight: 1.8,
          color: S.gray,
          margin: 0,
          maxWidth: 760,
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
          fontSize: "clamp(24px,3vw,34px)",
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
        background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
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
        <Container style={{ position: "relative", paddingTop: 72, paddingBottom: 72, maxWidth: 1320 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.18fr) minmax(360px, 0.82fr)",
              gap: 40,
              alignItems: "stretch",
            }}
            className="resp-grid-2"
          >
            <Reveal>
              <div>
                <h1
                  style={{
                    fontFamily: S.heading,
                    fontSize: "clamp(40px, 7vw, 76px)",
                    lineHeight: 1.03,
                    color: "#fff",
                    margin: "0 0 20px",
                    fontWeight: 900,
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
                    maxWidth: 760,
                    margin: "0 0 30px",
                  }}
                >
                  CTS ETS is built for working adults, ambitious learners, and professionals who need a structured training experience without losing the flexibility of online study.
                </p>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 26 }}>
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}
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
                  gridTemplateColumns: "minmax(0, 1.08fr) minmax(0, 0.92fr)",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    gridRow: "1 / 3",
                    minHeight: 460,
                    borderRadius: 28,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    padding: 24,
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
                      }}
                    >
                      Digital Campus
                    </div>
                    <h3
                      style={{
                        fontFamily: S.heading,
                        fontSize: 34,
                        color: "#fff",
                        margin: "18px 0 10px",
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
                      Study online with a more polished, structured, and flexible experience designed to support progress without unnecessary friction.
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
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
                  <div style={{ fontSize: 28, marginBottom: 10 }}>🌍</div>
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
                    Study with a Jamaican training institution that presents a clear, modern, and professional online learning experience.
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
                    Multiple learning pathways help learners identify where they fit and how they can progress.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      <Container style={{ marginTop: -36, position: "relative", zIndex: 2, maxWidth: 1320 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
          }}
          className="resp-grid-4"
        >
          <Reveal><StatCard value={SOCIAL_PROOF.enrolled} label="Facilitating Learning" accent={S.sky} /></Reveal>
          <Reveal delay={0.04}><StatCard value={SOCIAL_PROOF.programmes} label="Programmes" accent={S.goldDark} /></Reveal>
          <Reveal delay={0.08}><StatCard value={SOCIAL_PROOF.completionRate} label="Completion Rate" accent={S.emerald} /></Reveal>
          <Reveal delay={0.12}><StatCard value={SOCIAL_PROOF.satisfaction} label="Student Satisfaction" accent={S.violet} /></Reveal>
        </div>
      </Container>

      <Container style={{ paddingTop: 54, maxWidth: 1320 }}>
        <Reveal>
          <PartnerLogos />
        </Reveal>
      </Container>

      <section style={{ paddingTop: 20 }}>
        <Container style={{ maxWidth: 1320 }}>
          <WideIntro
            tag="Featured Study Areas"
            title="Professional options learners can quickly understand"
            desc="Explore the main areas of study available through CTS ETS, from office and business training to digital skills, people support, and leadership development."
            accent={S.teal}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 20,
            }}
            className="resp-grid-4"
          >
            {PROGRAMME_BUCKETS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <BucketCard item={item} />
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Btn
              onClick={() => setPage("Programmes")}
              style={{ borderRadius: 12, padding: "14px 30px" }}
            >
              View All Programmes
            </Btn>
          </div>
        </Container>
      </section>

      <section style={{ paddingTop: 40 }}>
        <Container style={{ maxWidth: 1320 }}>
          <WideIntro
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
        </Container>
      </section>

      <section style={{ paddingTop: 44 }}>
        <Container style={{ maxWidth: 1320 }}>
          <WideIntro
            tag="Why CTS ETS"
            title="A clearer reason to choose CTS ETS"
            desc="Learn in a flexible online environment built for serious adults who want structure, support, and a more professional training experience."
            accent={S.coral}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 20,
            }}
            className="resp-grid-4"
          >
            {REASONS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <ReasonCard item={item} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section
        style={{
          marginTop: 60,
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 140%)",
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
        <Container style={{ position: "relative", paddingTop: 64, paddingBottom: 64, maxWidth: 1320 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.88fr) minmax(0, 1.12fr)",
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
                    fontSize: "clamp(30px, 4vw, 50px)",
                    color: "#fff",
                    lineHeight: 1.08,
                    margin: "0 0 14px",
                    fontWeight: 900,
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
                    maxWidth: 540,
                  }}
                >
                  From exploring programmes to submitting an application and starting your training, the path is designed to feel clear, guided, and manageable.
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
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
              className="resp-grid-2"
            >
              {STEPS.map((item, index) => (
                <Reveal key={item.num} delay={index * 0.05}>
                  <StepCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section style={{ paddingTop: 50 }}>
        <Container style={{ maxWidth: 1320 }}>
          <WideIntro
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
        </Container>
      </section>

      <section style={{ paddingTop: 56 }}>
        <Container style={{ maxWidth: 1320 }}>
          <Reveal>
            <div
              style={{
                borderRadius: 28,
                padding: "36px clamp(22px,4vw,42px)",
                background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)",
                boxShadow: "0 24px 56px rgba(15,23,42,0.16)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)",
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
                      fontSize: "clamp(30px,4vw,48px)",
                      color: "#fff",
                      lineHeight: 1.08,
                      margin: "0 0 14px",
                      fontWeight: 900,
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
                      maxWidth: 650,
                    }}
                  >
                    Explore your options, apply online, and begin a flexible learning journey designed to support real personal and professional progress.
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
        </Container>
      </section>

      <PageScripture page="home" />
    </PageWrapper>
  );
}
