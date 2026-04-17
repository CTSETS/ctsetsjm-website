import React from "react";
import S from "../constants/styles";
import { SOCIAL_PROOF, TESTIMONIALS } from "../constants/content";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  TestimonialCard,
  TalkToGraduate,
} from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

const IMAGES = {
  hero: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
  learner: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1200",
  service: "https://images.pexels.com/photos/7709298/pexels-photo-7709298.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const C = {
  navy: "#0b1630",
  navySoft: "#122447",
  gold: "#c49112",
  teal: "#0a6e8a",
  green: "#1c7b47",
  white: "#ffffff",
  mist: "#f6f8fb",
  ink: "#142033",
  inkSoft: "#5b6676",
  line: "rgba(11,22,48,0.10)",
  shadow: "0 16px 36px rgba(11,22,48,0.08)",
};

const stats = [
  { value: SOCIAL_PROOF.enrolled, label: "Facilitating learning", accent: C.gold },
  { value: SOCIAL_PROOF.programmes, label: "Programmes", accent: C.teal },
  { value: SOCIAL_PROOF.completionRate, label: "Completion rate", accent: C.green },
  { value: SOCIAL_PROOF.satisfaction, label: "Learner satisfaction", accent: "#d26a43" },
];

const studyAreas = [
  {
    title: "Business and Office",
    text: "Administrative support, workplace systems, communication, and office readiness.",
  },
  {
    title: "People and Service",
    text: "Customer service, human resource pathways, team support, and client-facing professionalism.",
  },
  {
    title: "Digital and Data",
    text: "Modern workplace technology, practical digital confidence, and useful data awareness.",
  },
  {
    title: "Leadership and Growth",
    text: "Progression for supervisors, managers, and learners preparing for broader responsibility.",
  },
];

const pathways = [
  {
    title: "Job Certificate",
    tag: "Entry level",
    desc: "A practical starting point for learners building confidence and employability.",
    accent: C.green,
  },
  {
    title: "Level 2",
    tag: "Vocational",
    desc: "Structured training for service, office support, business basics, and digital tools.",
    accent: C.teal,
  },
  {
    title: "Level 3",
    tag: "Diploma",
    desc: "Advanced development for stronger workplace responsibility and team contribution.",
    accent: C.gold,
  },
  {
    title: "Level 4 to 5",
    tag: "Leadership",
    desc: "Higher-level progression for management, planning, HR, and long-term growth.",
    accent: "#d26a43",
  },
];

const reasons = [
  "100% online delivery",
  "Designed for busy adults",
  "Structured and professional",
  "Jamaican rooted, internationally aware",
];

const steps = [
  {
    num: "01",
    title: "Explore",
    text: "Review programmes and choose the path that fits your next move.",
  },
  {
    num: "02",
    title: "Apply",
    text: "Complete the online application and receive clear next-step guidance.",
  },
  {
    num: "03",
    title: "Get set up",
    text: "Receive onboarding details and a clearer view of your learner journey.",
  },
  {
    num: "04",
    title: "Start learning",
    text: "Enter a digital training environment built for consistency and progress.",
  },
];

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(16px, 3vw, 34px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Shell({ children, style }) {
  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, dark = false }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 24,
        padding: "0 8px",
        borderRadius: 999,
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(196,145,18,0.12)",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(196,145,18,0.18)",
        color: dark ? C.white : C.gold,
        fontSize: 8,
        textTransform: "uppercase",
        letterSpacing: 1.1,
        fontWeight: 800,
        fontFamily: S.body,
      }}
    >
      {children}
    </div>
  );
}

function Intro({ tag, title, desc, dark = false }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 0.82fr) minmax(220px, 1.18fr)",
        gap: 14,
        alignItems: "end",
        marginBottom: 10,
      }}
      className="resp-grid-2"
    >
      <div>
        <Label dark={dark}>{tag}</Label>
        <div
          style={{
            fontFamily: S.heading,
            fontWeight: 800,
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.12,
            color: dark ? C.white : C.ink,
            marginTop: 7,
          }}
        >
          {title}
        </div>
      </div>
      <p
        style={{
          margin: 0,
          color: dark ? "rgba(255,255,255,0.74)" : C.inkSoft,
          fontSize: 11,
          lineHeight: 1.5,
          fontFamily: S.body,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function FeaturePill({ children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "7px 7px",
        color: C.white,
        fontSize: 9,
        fontWeight: 700,
        fontFamily: S.body,
      }}
    >
      {children}
    </div>
  );
}

function StatBar() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        background: C.navy,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: C.shadow,
      }}
      className="resp-grid-4"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          style={{
            padding: "12px 8px",
            textAlign: "center",
            borderRight: index < stats.length - 1 ? "1px solid rgba(196,145,18,0.16)" : "none",
          }}
        >
          <div
            style={{
              fontFamily: S.heading,
              fontWeight: 800,
              fontSize: "clamp(16px, 2vw, 20px)",
              color: stat.accent,
              lineHeight: 1,
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              marginTop: 4,
              color: "rgba(255,255,255,0.72)",
              fontSize: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontWeight: 600,
              fontFamily: S.body,
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function VisualPanel() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.92fr",
        gap: 8,
      }}
      className="resp-grid-2"
    >
      <div
        style={{
          minHeight: 196,
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <img
          src={IMAGES.hero}
          alt="Black professionals collaborating in a modern office setting"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(11,22,48,0.18) 0%, rgba(11,22,48,0.72) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            minHeight: 22,
            padding: "0 8px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            color: "#f4e1ad",
            fontSize: 8,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: S.body,
          }}
        >
          Online learner experience
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: S.heading,
              fontSize: 15,
              lineHeight: 1.12,
              fontWeight: 800,
              color: C.white,
            }}
          >
            A cleaner first impression for serious learners
          </div>
          <div
            style={{
              marginTop: 7,
              color: "rgba(255,255,255,0.76)",
              fontSize: 11,
              lineHeight: 1.55,
              fontFamily: S.body,
            }}
          >
            Flexible study, clearer pathways, and a more professional public face.
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {[
          {
            label: "Professional learners",
            src: IMAGES.learner,
            alt: "Black woman working confidently on a laptop",
          },
          {
            label: "Service pathways",
            src: IMAGES.service,
            alt: "Black customer service professional wearing a headset",
          },
        ].map((item) => (
          <div
            key={item.label}
            role="img"
            aria-label={item.alt}
            style={{
              minHeight: 94,
              borderRadius: 8,
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: 9,
              display: "flex",
              alignItems: "end",
              color: "rgba(255,255,255,0.82)",
              fontWeight: 600,
              lineHeight: 1.35,
              fontSize: 10,
              fontFamily: S.body,
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(11,22,48,0.12) 0%, rgba(11,22,48,0.7) 100%)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudyCard({ item }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.line}`,
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 8px 18px rgba(11,22,48,0.04)",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 8,
          background: "rgba(10,110,138,0.1)",
          border: "1px solid rgba(10,110,138,0.12)",
          marginBottom: 8,
        }}
      />
      <div
        style={{
          fontFamily: S.heading,
          fontWeight: 700,
          fontSize: 13,
          lineHeight: 1.12,
          color: C.ink,
        }}
      >
        {item.title}
      </div>
      <p
        style={{
          margin: "6px 0 0",
          color: C.inkSoft,
          fontSize: 11,
          lineHeight: 1.5,
          fontFamily: S.body,
        }}
      >
        {item.text}
      </p>
    </div>
  );
}

function PathwayCard({ item }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.line}`,
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 8px 18px rgba(11,22,48,0.05)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 22,
          padding: "0 7px",
          borderRadius: 999,
          background: `${item.accent}18`,
          color: item.accent,
          fontSize: 8,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 800,
          fontFamily: S.body,
        }}
      >
        {item.tag}
      </div>
      <div
        style={{
          fontFamily: S.heading,
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.12,
          color: C.ink,
          marginTop: 8,
        }}
      >
        {item.title}
      </div>
      <p
        style={{
          margin: "6px 0 0",
          color: C.inkSoft,
          fontSize: 11,
          lineHeight: 1.5,
          fontFamily: S.body,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}

function ReasonTile({ text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: 10,
        color: C.white,
        fontSize: 11,
        lineHeight: 1.45,
        fontWeight: 600,
        fontFamily: S.body,
      }}
    >
      {text}
    </div>
  );
}

function StepCard({ item }) {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: C.gold,
          color: C.navy,
          display: "grid",
          placeItems: "center",
          fontFamily: S.heading,
          fontWeight: 800,
          fontSize: 10,
          marginBottom: 8,
        }}
      >
        {item.num}
      </div>
      <div
        style={{
          fontFamily: S.heading,
          fontWeight: 700,
          fontSize: 13,
          lineHeight: 1.12,
          color: C.white,
        }}
      >
        {item.title}
      </div>
      <p
        style={{
          margin: "6px 0 0",
          color: "rgba(255,255,255,0.76)",
          fontSize: 11,
          lineHeight: 1.5,
          fontFamily: S.body,
        }}
      >
        {item.text}
      </p>
    </div>
  );
}

export default function HomePage({ setPage }) {
  return (
    <PageWrapper bg={C.mist}>
      <WideWrap style={{ paddingTop: 18, paddingBottom: 22 }}>
        <Shell>
          <div
            style={{
              background:
                "radial-gradient(circle at 16% 18%, rgba(10,110,138,0.20), transparent 30%), radial-gradient(circle at 90% 10%, rgba(196,145,18,0.14), transparent 24%), linear-gradient(135deg, #0b1630 0%, #122447 58%, #17345f 100%)",
              borderRadius: 8,
              padding: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: C.shadow,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(260px, 0.98fr) minmax(260px, 1.02fr)",
                gap: 12,
                alignItems: "center",
              }}
              className="resp-grid-2"
            >
              <Reveal>
                <div>
                  <Label dark>NCTVET certified and fully online</Label>
                  <h1
                    style={{
                      fontFamily: S.heading,
                      fontWeight: 800,
                      fontSize: "clamp(18px, 2.6vw, 22px)",
                      lineHeight: 1.12,
                      letterSpacing: -0.1,
                      margin: "8px 0 7px",
                      color: C.white,
                      maxWidth: 360,
                    }}
                  >
                    Flexible online training for career growth in Jamaica and beyond
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "rgba(255,255,255,0.78)",
                      maxWidth: 360,
                      fontFamily: S.body,
                    }}
                  >
                    CTS ETS is built for working adults, ambitious learners, and professionals who need a structured
                    training experience without losing the flexibility of online study.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <Btn
                      primary
                      onClick={() => setPage("Apply")}
                      style={{
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`,
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 11,
                        boxShadow: "0 8px 16px rgba(196,145,18,0.16)",
                      }}
                    >
                      Start Your Application
                    </Btn>
                    <Btn
                      onClick={() => setPage("Programmes")}
                      style={{
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 11,
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      Explore Programmes
                    </Btn>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 6,
                      marginTop: 10,
                    }}
                    className="resp-grid-4"
                  >
                    {[
                      "100% online delivery",
                      "Flexible pathways",
                      "Professional support",
                      "Modern learner experience",
                    ].map((item) => (
                      <FeaturePill key={item}>{item}</FeaturePill>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <VisualPanel />
              </Reveal>
            </div>
          </div>
        </Shell>
      </WideWrap>

      <WideWrap style={{ marginTop: -8, position: "relative", zIndex: 2 }}>
        <Shell>
          <Reveal>
            <StatBar />
          </Reveal>
        </Shell>
      </WideWrap>

      <WideWrap style={{ paddingTop: 24 }}>
        <Shell>
          <Reveal>
            <PartnerLogos />
          </Reveal>
        </Shell>
      </WideWrap>

      <section id="study-areas" style={{ paddingTop: 18, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Intro
              tag="Featured study areas"
              title="Professional options learners can quickly understand"
              desc="Explore the main areas of study available through CTS ETS, from business support and customer service to digital confidence and leadership growth."
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 0.92fr) minmax(0, 1.08fr)",
                gap: 10,
              }}
              className="resp-grid-2"
            >
              <Reveal>
                <div
                  style={{
                    minHeight: 190,
                    borderRadius: 8,
                    position: "relative",
                    overflow: "hidden",
                    border: `1px solid ${C.line}`,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 10px 22px rgba(11,22,48,0.06)",
                  }}
                >
                  <img
                    src={IMAGES.learner}
                    alt="Black woman working confidently on a laptop"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(11,22,48,0.14) 0%, rgba(11,22,48,0.72) 100%)",
                    }}
                  />
                  <Label dark>Professional learners</Label>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        fontFamily: S.heading,
                        fontWeight: 700,
                        fontSize: 14,
                        lineHeight: 1.12,
                        color: C.white,
                      }}
                    >
                      Training with structure, support, and flexibility
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        color: "rgba(255,255,255,0.78)",
                        lineHeight: 1.5,
                        fontSize: 11,
                        fontFamily: S.body,
                      }}
                    >
                      Online study with clearer pathways, stronger support, and a more confident first impression.
                    </div>
                  </div>
                </div>
              </Reveal>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
                className="resp-grid-2"
              >
                {studyAreas.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.05}>
                    <StudyCard item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Intro
              tag="Study pathways"
              title="Find the level that fits your next step"
              desc="Whether you are just starting, strengthening practical workplace skills, or preparing for leadership, CTS ETS offers levels that support clear progression."
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 10,
              }}
              className="resp-grid-4"
            >
              {pathways.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.05}>
                  <PathwayCard item={item} />
                </Reveal>
              ))}
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <div
              style={{
                background: "linear-gradient(135deg, #0c1b37 0%, #122447 58%, #173b67 100%)",
                borderRadius: 8,
                padding: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: C.shadow,
              }}
            >
              <Intro
                tag="Why CTS ETS"
                title="A clearer reason to choose CTS ETS"
                desc="Study with a Jamaican training institution that combines flexibility, structure, and a professional online learner experience."
                dark
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
                className="resp-grid-2"
              >
                {reasons.map((item, index) => (
                  <Reveal key={item} delay={index * 0.05}>
                    <ReasonTile text={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <div
              style={{
                background: C.navy,
                borderRadius: 8,
                padding: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: C.shadow,
              }}
            >
              <Intro
                tag="How it works"
                title="A simpler enrolment journey builds confidence"
                desc="From exploring options to starting your programme, the path is designed to feel clear, guided, and manageable."
                dark
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
                className="resp-grid-4"
              >
                {steps.map((item, index) => (
                  <Reveal key={item.num} delay={index * 0.05}>
                    <StepCard item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Intro
              tag="Learner voices"
              title="Real learner results still do important trust work"
              desc="Real learner feedback helps visitors understand the value of the training, the flexibility of the model, and the quality of the support provided."
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
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
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 22 }}>
        <WideWrap>
          <Shell>
            <Reveal>
              <div
                style={{
                  background: "linear-gradient(135deg, #0b1630 0%, #17345f 100%)",
                  borderRadius: 8,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: C.shadow,
                }}
              >
                <div
                  style={{
                    color: C.gold,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    fontWeight: 800,
                    fontSize: 8,
                    marginBottom: 7,
                    fontFamily: S.body,
                  }}
                >
                  Ready to take the next step?
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(200px, 1fr) auto",
                    gap: 10,
                    alignItems: "center",
                  }}
                  className="resp-grid-2"
                >
                  <div>
                    <div
                      style={{
                        fontFamily: S.heading,
                        fontWeight: 800,
                        fontSize: "clamp(15px, 2vw, 18px)",
                        lineHeight: 1.12,
                        color: C.white,
                      }}
                    >
                      Start your next step with CTS ETS
                    </div>
                    <div
                      style={{
                        marginTop: 5,
                        color: "rgba(255,255,255,0.78)",
                        fontSize: 11,
                        lineHeight: 1.5,
                        fontFamily: S.body,
                      }}
                    >
                      Explore your options, apply online, and begin a flexible learning journey designed to support real personal and professional progress.
                    </div>
                  </div>
                  <Btn
                    primary
                    onClick={() => setPage("Apply")}
                    style={{
                      minHeight: 34,
                      padding: "0 12px",
                      borderRadius: 8,
                      background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`,
                      color: C.white,
                      fontWeight: 700,
                      fontSize: 11,
                      boxShadow: "0 8px 16px rgba(196,145,18,0.16)",
                    }}
                  >
                    Apply Now
                  </Btn>
                </div>
              </div>
            </Reveal>
          </Shell>
        </WideWrap>
      </section>

      <PageScripture page="home" />
    </PageWrapper>
  );
}
