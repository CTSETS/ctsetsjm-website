import { useMemo, useState } from "react";
import S from "../constants/styles";
import { PROGRAMMES, PROGRAMME_DETAILS, CAREER_OUTCOMES } from "../constants/programmes";
import { REG_FEE, USD_RATE } from "../constants/config";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";
import LevelQuiz from "../components/quiz/LevelQuiz";

const IMAGES = {
  hero: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400",
  advisor: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200",
  learner: "https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1200",
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

const LEVEL_COLORS = {
  "Job / Professional Certificates": C.green,
  "Level 2 - Vocational Certificates": C.teal,
  "Level 3 - Diploma": C.gold,
  "Level 4 - Associate Equivalent": "#d26a43",
  "Level 5 - Bachelor's Equivalent": "#8f5a25",
};

const LEVEL_SUMMARIES = {
  "Job / Professional Certificates": {
    label: "Entry pathways",
    note: "Shorter options for learners building confidence, employability, and workplace readiness.",
  },
  "Level 2 - Vocational Certificates": {
    label: "Foundational vocational training",
    note: "Structured training for practical workplace performance and recognised skill development.",
  },
  "Level 3 - Diploma": {
    label: "Supervisory progression",
    note: "For learners moving into advanced operational, supervisory, and decision-making roles.",
  },
  "Level 4 - Associate Equivalent": {
    label: "Management development",
    note: "Built for learners preparing for higher responsibility, coordination, and people leadership.",
  },
  "Level 5 - Bachelor's Equivalent": {
    label: "Executive progression",
    note: "Advanced options for senior leadership, strategy, and organisational growth.",
  },
};

function cleanText(value) {
  if (value == null) return "";
  return String(value)
    .replace(/â€”/g, "-")
    .replace(/â€“/g, "-")
    .replace(/â€"/g, "-")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â†’/g, "->")
    .replace(/Â·/g, "·")
    .replace(/Ã—/g, "x")
    .replace(/âˆ’/g, "-")
    .replace(/Â/g, "")
    .trim();
}

function normalizeLevel(level) {
  return cleanText(level);
}

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

function LevelOverviewCard({ title, count, summary, color }) {
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
          display: "inline-flex",
          alignItems: "center",
          minHeight: 22,
          padding: "0 7px",
          borderRadius: 999,
          background: `${color}18`,
          color,
          fontSize: 8,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 800,
          fontFamily: S.body,
        }}
      >
        {summary.label}
      </div>
      <div
        style={{
          fontFamily: S.heading,
          fontSize: 14,
          color: C.ink,
          fontWeight: 700,
          marginTop: 8,
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      <p
        style={{
          margin: "6px 0 10px",
          color: C.inkSoft,
          fontSize: 11,
          lineHeight: 1.55,
          fontFamily: S.body,
        }}
      >
        {summary.note}
      </p>
      <div
        style={{
          fontSize: 9,
          color: C.inkSoft,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 700,
          fontFamily: S.body,
        }}
      >
        {count} programme{count === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function FeePreview({ tuitionNum, totalNum, usd, levelColor }) {
  return (
    <div
      style={{
        padding: "12px 12px",
        borderRadius: 8,
        background: C.mist,
        border: `1px solid ${C.line}`,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 11, marginBottom: 6, fontFamily: S.body }}>
        <span style={{ color: C.inkSoft }}>Registration fee</span>
        <span style={{ color: C.ink, fontWeight: 700 }}>{fmt(REG_FEE)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 11, marginBottom: 6, fontFamily: S.body }}>
        <span style={{ color: C.inkSoft }}>Training fee</span>
        <span style={{ color: C.ink, fontWeight: 700 }}>{fmt(tuitionNum)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 8, borderTop: `1px solid ${C.line}` }}>
        <span style={{ fontFamily: S.heading, fontWeight: 800, fontSize: 13, color: C.ink }}>Estimated total</span>
        <span style={{ fontFamily: S.heading, fontWeight: 800, fontSize: 13, color: levelColor }}>{fmt(totalNum)} · US${usd}</span>
      </div>
      <div style={{ fontSize: 10, color: C.inkSoft, fontFamily: S.body, marginTop: 8, lineHeight: 1.5 }}>
        NCTVET registration and assessment fees are not included where applicable. USD amounts are approximate.
      </div>
    </div>
  );
}

function ProgrammeCard({ prog, level, levelColor, expanded, onToggle, setPage }) {
  const details = PROGRAMME_DETAILS[prog.name] || PROGRAMME_DETAILS[cleanText(prog.name)];
  const tuitionNum = parseInt(String(prog.tuition).replace(/[^0-9]/g, ""), 10);
  const totalNum = tuitionNum + REG_FEE;
  const usd = Math.round(totalNum / USD_RATE);
  const cleanLevel = normalizeLevel(level);
  const levelKey = cleanLevel.includes("5")
    ? "Level 5 (Bachelor's Equiv.)"
    : cleanLevel.includes("4")
    ? "Level 4 (Associate Equiv.)"
    : cleanLevel.includes("3")
    ? "Level 3"
    : cleanLevel.includes("2")
    ? "Level 2"
    : "Job Certificate";
  const career = CAREER_OUTCOMES[levelKey];

  return (
    <div
      style={{
        marginBottom: 10,
        borderRadius: 8,
        border: `1px solid ${expanded ? `${levelColor}38` : C.line}`,
        overflow: "hidden",
        background: C.white,
        boxShadow: expanded ? "0 12px 28px rgba(11,22,48,0.08)" : "0 8px 18px rgba(11,22,48,0.04)",
        transition: "all 0.22s ease",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "14px 14px",
          background: expanded ? `${levelColor}0C` : C.white,
          cursor: "pointer",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontFamily: S.heading, lineHeight: 1.2 }}>
              {cleanText(prog.name)}
            </div>
            {prog.popular && (
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "rgba(196,145,18,0.12)",
                  color: C.gold,
                  fontSize: 8,
                  fontWeight: 800,
                  fontFamily: S.body,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Popular
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.inkSoft, fontFamily: S.body }}>
            {cleanText(prog.duration)} · {cleanText(prog.desc)}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: levelColor, fontFamily: S.heading }}>{fmt(totalNum)}</div>
          <div style={{ fontSize: 10, color: C.inkSoft, fontFamily: S.body }}>US${usd}</div>
        </div>
        <span
          style={{
            fontSize: 12,
            color: C.inkSoft,
            fontWeight: 800,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "0 14px 14px", background: C.white, borderTop: `1px solid ${C.line}` }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
              marginTop: 14,
            }}
          >
            <div>
              <FeePreview tuitionNum={tuitionNum} totalNum={totalNum} usd={usd} levelColor={levelColor} />
              {details?.prerequisites && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#c7603c",
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      fontFamily: S.body,
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    Entry requirements
                  </div>
                  <p style={{ fontSize: 11, color: C.inkSoft, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>
                    {cleanText(details.prerequisites)}
                  </p>
                </div>
              )}
              <div
                style={{
                  padding: "12px 12px",
                  borderRadius: 8,
                  background: "rgba(10,110,138,0.08)",
                  border: "1px solid rgba(10,110,138,0.16)",
                  fontSize: 11,
                  fontFamily: S.body,
                  color: C.ink,
                  lineHeight: 1.6,
                }}
              >
                <strong>Certification:</strong> CTS ETS institutional certificate plus the relevant NCTVET pathway where applicable through the recognised assessment process.
              </div>
            </div>

            <div>
              {details?.modules?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#7151c8",
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      fontFamily: S.body,
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    Modules
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {details.modules.map((module, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          padding: "4px 0",
                          fontSize: 11,
                          fontFamily: S.body,
                          color: C.ink,
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 6,
                            background: "rgba(113,81,200,0.10)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 9,
                            fontWeight: 800,
                            color: "#7151c8",
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          {index + 1}
                        </span>
                        <span>{cleanText(module)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details?.careers?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: C.green,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      fontFamily: S.body,
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    Career opportunities
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {details.careers.map((careerItem) => (
                      <span
                        key={careerItem}
                        style={{
                          fontSize: 10,
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "rgba(28,123,71,0.10)",
                          color: C.green,
                          fontFamily: S.body,
                          fontWeight: 700,
                        }}
                      >
                        {cleanText(careerItem)}
                      </span>
                    ))}
                  </div>
                  {career && (
                    <div style={{ fontSize: 11, fontFamily: S.body, color: C.inkSoft, lineHeight: 1.6 }}>
                      Estimated salary range: <strong style={{ color: C.ink }}>{cleanText(career.salaryRange)}</strong>
                      <div style={{ fontSize: 10, color: C.inkSoft, marginTop: 4 }}>
                        Indicative labour-market estimate only. Actual salaries vary by employer, location, role, and experience.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            <Btn
              primary
              onClick={() => setPage("Apply")}
              style={{
                color: C.white,
                background: `linear-gradient(180deg, ${C.gold} 0%, #9f7411 100%)`,
                minWidth: 160,
                fontSize: 11,
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              Apply for This Programme
            </Btn>
            <Btn
              onClick={() => setPage("Fees & Calculator")}
              style={{
                minWidth: 160,
                fontSize: 11,
                border: `1px solid ${C.teal}`,
                color: C.teal,
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              Calculate Fees
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function CertDropdown() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      title: "National recognition",
      text: "NVQ-J is Jamaica's recognised vocational qualification standard administered through NCTVET under HEART/NSTA Trust.",
    },
    {
      title: "CTS ETS pathway",
      text: "CTS ETS programmes are aligned to competency standards and learners are prepared for assessment through the recognised process.",
    },
    {
      title: "Why it matters",
      text: "It strengthens employability, credibility, and confidence by linking learning to recognised occupational competence.",
    },
  ];

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "14px 14px",
          borderRadius: open ? "8px 8px 0 0" : 8,
          border: `1px solid ${open ? "rgba(10,110,138,0.45)" : C.line}`,
          background: open ? C.teal : C.white,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          transition: "all 0.22s ease",
          boxShadow: open ? "0 12px 28px rgba(10,110,138,0.12)" : "0 8px 18px rgba(11,22,48,0.04)",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: open ? C.white : C.ink, fontFamily: S.heading, marginBottom: 4 }}>
            About NCTVET certification
          </div>
          <div style={{ fontSize: 11, color: open ? "rgba(255,255,255,0.76)" : C.inkSoft, fontFamily: S.body }}>
            Understand NVQ-J, how CTS ETS prepares learners, and what the qualification means.
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            color: open ? C.white : C.inkSoft,
            fontWeight: 800,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: 14,
            background: C.white,
            border: "1px solid rgba(10,110,138,0.45)",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 12px 28px rgba(11,22,48,0.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {items.map((item) => (
              <div key={item.title} style={{ background: C.mist, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontFamily: S.heading, fontSize: 13, color: C.ink, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontFamily: S.body, fontSize: 11, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(10,110,138,0.08)",
              border: "1px solid rgba(10,110,138,0.16)",
              fontSize: 10,
              color: C.ink,
              fontFamily: S.body,
              lineHeight: 1.6,
            }}
          >
            <strong>Qualification levels:</strong> Job Certificate to Level 2 to Level 3 to Level 4 (Associate Equivalent) to Level 5 (Bachelor's Equivalent)
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgrammesPage({ setPage }) {
  const [expanded, setExpanded] = useState({});

  const groupedProgrammes = useMemo(
    () =>
      Object.entries(PROGRAMMES).map(([rawLevel, progs]) => {
        const level = normalizeLevel(rawLevel);
        const color = LEVEL_COLORS[level] || C.navy;
        const summary = LEVEL_SUMMARIES[level] || {
          label: "Programme group",
          note: "Explore this level to understand the routes available to you.",
        };
        return { level, progs, color, summary };
      }),
    []
  );

  const toggle = (key) => {
    setExpanded((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

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
                  <Label dark>Programmes overview</Label>
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
                    Find the programme that matches your next move
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
                    Browse flexible online options by level, compare costs more clearly, and move directly into the application or fee calculator when you are ready.
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
                      Apply Now
                    </Btn>
                    <Btn
                      onClick={() => setPage("Fees & Calculator")}
                      style={{
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      View Fees
                    </Btn>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
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
                      alt="Black professionals reviewing study and career options"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(11,22,48,0.18) 0%, rgba(11,22,48,0.72) 100%)",
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <Label dark>Programme pathways</Label>
                    </div>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontFamily: S.heading, fontSize: 15, lineHeight: 1.12, fontWeight: 800, color: C.white }}>
                        Clearer browsing builds confidence before application
                      </div>
                      <div style={{ marginTop: 7, color: "rgba(255,255,255,0.76)", fontSize: 11, lineHeight: 1.55, fontFamily: S.body }}>
                        Compare levels, review entry requirements, and understand costs without friction.
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {[
                      { src: IMAGES.advisor, label: "Guided choice", alt: "Advisor helping a learner choose a programme" },
                      { src: IMAGES.learner, label: "Online study", alt: "Learner reviewing options on a laptop" },
                    ].map((item) => (
                      <div
                        key={item.label}
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
                        <img src={item.src} alt={item.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
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
              </Reveal>
            </div>
          </div>
        </Shell>
      </WideWrap>

      <WideWrap style={{ marginTop: -8, position: "relative", zIndex: 2 }}>
        <Shell>
          <Reveal>
            <SocialProofBar />
          </Reveal>
        </Shell>
      </WideWrap>

      <section style={{ paddingTop: 18, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Intro
              tag="Programme finder"
              title="Browse the structure first, then drill into the details"
              desc="All programmes remain online and self-paced. This page improves browsing and comparison while preserving the level quiz, programme details, and direct route actions."
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.12fr) minmax(220px, 0.88fr)",
                gap: 10,
                alignItems: "start",
                marginBottom: 12,
              }}
              className="resp-grid-2"
            >
              <div>
                <CertDropdown />
                <Reveal>
                  <div
                    style={{
                      background: C.white,
                      border: `1px solid ${C.line}`,
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 8px 18px rgba(11,22,48,0.04)",
                    }}
                  >
                    <LevelQuiz setPage={setPage} />
                  </div>
                </Reveal>
              </div>
              <Reveal>
                <div
                  style={{
                    background: C.white,
                    border: `1px solid ${C.line}`,
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: "0 8px 18px rgba(11,22,48,0.04)",
                  }}
                >
                  <div style={{ width: "100%", height: 220, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                    <img src={IMAGES.advisor} alt="Advisor supporting a learner with programme selection" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontFamily: S.heading, fontSize: 14, color: C.ink, fontWeight: 700, marginBottom: 6 }}>
                    Find the route that fits your goals more quickly
                  </div>
                  <p style={{ fontFamily: S.body, fontSize: 11, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>
                    Compare levels, understand costs, and move toward a confident decision with less scrolling and less confusion.
                  </p>
                </div>
              </Reveal>
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 10, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            <Intro
              tag="Level overview"
              title="See the programme structure at a glance"
              desc="Each level stays organised the same way, but the layout now gives learners a quicker overview before they open the full programme cards."
            />
            <Reveal>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  gap: 10,
                  marginBottom: 12,
                }}
                className="resp-grid-5"
              >
                {groupedProgrammes.map(({ level, progs, color, summary }) => (
                  <LevelOverviewCard key={level} title={level} count={progs.length} summary={summary} color={color} />
                ))}
              </div>
            </Reveal>
            <div style={{ fontSize: 10, color: C.inkSoft, fontFamily: S.body, marginBottom: 12, lineHeight: 1.6 }}>
              USD equivalents are approximate at J${USD_RATE} = US$1 and may vary. Registration fee ({fmt(REG_FEE)}) is non-refundable. Training fees vary by programme level.
            </div>
          </Shell>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 4, paddingBottom: 10 }}>
        <WideWrap>
          <Shell>
            {groupedProgrammes.map(({ level, progs, color, summary }, groupIndex) => {
              const firstProg = progs[0];
              const firstTotal = firstProg ? fmt(parseInt(String(firstProg.total).replace(/[^0-9]/g, ""), 10)) : "";

              return (
                <Reveal key={level} delay={groupIndex * 0.03}>
                  <section style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        background: C.white,
                        border: `1px solid ${C.line}`,
                        borderRadius: 8,
                        padding: 12,
                        boxShadow: "0 8px 18px rgba(11,22,48,0.04)",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                        <div style={{ width: 5, height: 26, borderRadius: 999, background: color }} />
                        <div style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>{level}</div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: 999,
                            background: `${color}14`,
                            color,
                            fontSize: 8,
                            fontWeight: 800,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            fontFamily: S.body,
                          }}
                        >
                          {summary.label}
                        </span>
                        <span style={{ fontSize: 10, color: C.inkSoft, fontFamily: S.body, fontWeight: 700 }}>
                          {progs.length} programme{progs.length > 1 ? "s" : ""} · totals from {firstTotal}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontFamily: S.body, fontSize: 11, color: C.inkSoft, lineHeight: 1.55 }}>{summary.note}</p>
                    </div>

                    {progs.map((prog) => {
                      const key = `${level}-${prog.name}`;
                      return (
                        <ProgrammeCard
                          key={key}
                          prog={prog}
                          level={level}
                          levelColor={color}
                          expanded={!!expanded[key]}
                          onToggle={() => toggle(key)}
                          setPage={setPage}
                        />
                      );
                    })}
                  </section>
                </Reveal>
              );
            })}
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
                        color: C.gold,
                        textTransform: "uppercase",
                        letterSpacing: 1.2,
                        fontWeight: 800,
                        fontSize: 8,
                        marginBottom: 7,
                        fontFamily: S.body,
                      }}
                    >
                      Need help choosing?
                    </div>
                    <div style={{ fontFamily: S.heading, fontWeight: 800, fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.12, color: C.white }}>
                      Move from browsing to action with less friction
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
                      Once you understand the programme, the next step should feel simple: apply, compare fees, or ask a question.
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                      }}
                    >
                      Apply Now
                    </Btn>
                    <Btn
                      onClick={() => setPage("FAQ")}
                      style={{
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      View FAQ
                    </Btn>
                  </div>
                </div>
              </div>
            </Reveal>
            <PageScripture page="programmes" />
          </Shell>
        </WideWrap>
      </section>
    </PageWrapper>
  );
}
