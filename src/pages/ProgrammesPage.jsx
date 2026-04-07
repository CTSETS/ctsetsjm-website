import { useState } from "react";
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

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  advisor: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  learner: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
};

const LEVEL_COLORS = {
  "Job / Professional Certificates": S.emerald,
  "Level 2 — Vocational Certificates": S.teal,
  "Level 3 — Diploma": S.violet,
  "Level 4 — Associate Equivalent": S.coral,
  "Level 5 — Bachelor's Equivalent": S.rose,
};

const LEVEL_SUMMARIES = {
  "Job / Professional Certificates": {
    label: "Entry pathways",
    note: "Shorter options for learners building confidence, employability, and core workplace readiness.",
  },
  "Level 2 — Vocational Certificates": {
    label: "Foundational vocational training",
    note: "Structured training for practical workplace performance and recognised skill development.",
  },
  "Level 3 — Diploma": {
    label: "Supervisory progression",
    note: "For learners moving into advanced operational, supervisory, and decision-making roles.",
  },
  "Level 4 — Associate Equivalent": {
    label: "Management development",
    note: "Built for learners preparing for higher responsibility, coordination, and people leadership.",
  },
  "Level 5 — Bachelor's Equivalent": {
    label: "Executive progression",
    note: "Advanced options for senior leadership, strategy, and organisational growth.",
  },
};

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

function CertDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 28 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "20px 24px",
          borderRadius: open ? "20px 20px 0 0" : 20,
          border: "1px solid " + (open ? S.teal + "55" : S.border),
          background: open ? S.teal : "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          transition: "all 0.22s ease",
          boxShadow: open ? "0 18px 44px rgba(14,143,139,0.14)" : "0 14px 34px rgba(15,23,42,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: open ? "rgba(255,255,255,0.12)" : S.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎓</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: open ? "#fff" : S.navy, fontFamily: S.heading, marginBottom: 4 }}>About NCTVET Certification</div>
            <div style={{ fontSize: 13, color: open ? "rgba(255,255,255,0.78)" : S.gray, fontFamily: S.body }}>Understand NVQ-J, how CTS ETS prepares learners, and what the qualification means.</div>
          </div>
        </div>
        <span style={{ fontSize: 14, color: open ? "#fff" : S.gray, fontWeight: 800, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: 24, background: "#fff", border: "1px solid " + S.teal + "55", borderTop: "none", borderRadius: "0 0 20px 20px", boxShadow: "0 18px 44px rgba(15,23,42,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 }}>
            {[
              { title: "National recognition", text: "NVQ-J is Jamaica’s recognised vocational qualification standard administered through NCTVET under HEART/NSTA Trust." },
              { title: "CTS ETS pathway", text: "CTS ETS programmes are aligned to competency standards and learners are prepared for assessment through the recognised process." },
              { title: "Why it matters", text: "It strengthens employability, credibility, and confidence by linking learning to recognised occupational competence." },
            ].map((item) => (
              <div key={item.title} style={{ background: S.lightBg, border: "1px solid " + S.border, borderRadius: 16, padding: 18 }}>
                <div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 8 }}>{item.title}</div>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", borderRadius: 14, background: S.tealLight, border: "1px solid " + S.teal + "25", fontSize: 12, color: S.tealDark, fontFamily: S.body, lineHeight: 1.7 }}>
            <strong style={{ color: S.navy }}>Qualification Levels:</strong> Job Certificate → Level 2 → Level 3 → Level 4 (Associate Equivalent) → Level 5 (Bachelor’s Equivalent)
          </div>
        </div>
      )}
    </div>
  );
}

function LevelOverviewCard({ title, count, summary, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid " + S.border, borderRadius: 18, padding: 20, boxShadow: "0 14px 34px rgba(15,23,42,0.05)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 11px", borderRadius: 999, background: color + "14", color: color, fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>
        {summary.label}
      </div>
      <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, margin: "0 0 8px", fontWeight: 800, lineHeight: 1.15 }}>{title}</h3>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: "0 0 14px" }}>{summary.note}</p>
      <div style={{ fontFamily: S.body, fontSize: 12, color: S.gray, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>{count} programme{count === 1 ? "" : "s"}</div>
    </div>
  );
}

function FeePreview({ tuitionNum, totalNum, usd, levelColor }) {
  return (
    <div style={{ padding: "16px 18px", borderRadius: 16, background: S.lightBg, border: "1px solid " + S.border, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, fontFamily: S.body, marginBottom: 6 }}><span style={{ color: S.gray }}>Registration Fee</span><span style={{ color: S.navy, fontWeight: 700 }}>{fmt(REG_FEE)}</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, fontFamily: S.body, marginBottom: 6 }}><span style={{ color: S.gray }}>Training Fee</span><span style={{ color: S.navy, fontWeight: 700 }}>{fmt(tuitionNum)}</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 8, borderTop: "1px solid " + S.border }}>
        <span style={{ fontFamily: S.heading, fontWeight: 800, fontSize: 14, color: S.navy }}>Estimated Total</span>
        <span style={{ fontFamily: S.heading, fontWeight: 800, fontSize: 14, color: levelColor }}>{fmt(totalNum)} · US${usd}</span>
      </div>
      <div style={{ fontSize: 10, color: S.grayLight, fontFamily: S.body, marginTop: 8, lineHeight: 1.6 }}>NCTVET registration and assessment fees are not included and are set where applicable. USD amounts are approximate.</div>
    </div>
  );
}

function ProgrammeCard({ prog, level, levelColor, expanded, onToggle, setPage }) {
  const details = PROGRAMME_DETAILS[prog.name];
  const tuitionNum = parseInt(String(prog.tuition).replace(/[^0-9]/g, ""));
  const totalNum = tuitionNum + REG_FEE;
  const usd = Math.round(totalNum / USD_RATE);
  const levelKey = level.includes("5")
    ? "Level 5 (Bachelor's Equiv.)"
    : level.includes("4")
    ? "Level 4 (Associate Equiv.)"
    : level.includes("3")
    ? "Level 3"
    : level.includes("2")
    ? "Level 2"
    : "Job Certificate";
  const career = CAREER_OUTCOMES[levelKey];

  return (
    <div style={{ marginBottom: 14, borderRadius: 20, border: "1px solid " + (expanded ? levelColor + "38" : S.border), overflow: "hidden", background: "#fff", boxShadow: expanded ? "0 18px 44px rgba(15,23,42,0.08)" : "0 10px 28px rgba(15,23,42,0.04)", transition: "all 0.22s ease" }}>
      <button onClick={onToggle} style={{ width: "100%", padding: "18px 20px", background: expanded ? levelColor + "0C" : "#fff", cursor: "pointer", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, textAlign: "left" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: S.navy, fontFamily: S.heading, lineHeight: 1.2 }}>{prog.name}</div>
            {prog.popular && <span style={{ padding: "4px 10px", borderRadius: 999, background: S.goldLight, color: S.goldDark, fontSize: 10, fontWeight: 800, fontFamily: S.body, letterSpacing: 1.2, textTransform: "uppercase" }}>Popular</span>}
          </div>
          <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>{prog.duration} · {prog.desc}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: levelColor, fontFamily: S.heading }}>{fmt(totalNum)}</div>
          <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>US${usd}</div>
        </div>
        <span style={{ fontSize: 14, color: S.gray, fontWeight: 800, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0 }}>▼</span>
      </button>

      {expanded && (
        <div style={{ padding: "0 20px 20px", background: "#fff", borderTop: "1px solid " + S.border }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18, marginTop: 18 }}>
            <div>
              <FeePreview tuitionNum={tuitionNum} totalNum={totalNum} usd={usd} levelColor={levelColor} />
              {details?.prerequisites && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: S.coral, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Entry Requirements</div>
                  <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.75, margin: 0 }}>{details.prerequisites}</p>
                </div>
              )}
              <div style={{ padding: "14px 16px", borderRadius: 14, background: S.tealLight, border: "1px solid " + S.teal + "28", fontSize: 12, fontFamily: S.body, color: S.tealDark, lineHeight: 1.7 }}>
                <strong style={{ color: S.navy }}>Certification:</strong> CTS ETS institutional certificate plus the relevant NCTVET pathway where applicable through the recognised assessment process.
              </div>
            </div>

            <div>
              {details?.modules?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: S.violet, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Modules</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {details.modules.map((module, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", fontSize: 13, fontFamily: S.body, color: "#334155" }}>
                        <span style={{ width: 22, height: 22, borderRadius: 6, background: S.violetLight, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: S.violetDark, flexShrink: 0, marginTop: 1 }}>{index + 1}</span>
                        <span>{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details?.careers?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: S.emerald, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Career Opportunities</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    {details.careers.map((careerItem) => (
                      <span key={careerItem} style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, background: S.emeraldLight, color: S.emeraldDark, fontFamily: S.body, fontWeight: 700 }}>{careerItem}</span>
                    ))}
                  </div>
                  {career && (
                    <div style={{ fontSize: 12, fontFamily: S.body, color: S.gray, lineHeight: 1.7 }}>
                      Estimated salary range: <strong style={{ color: S.navy }}>{career.salaryRange}</strong>
                      <div style={{ fontSize: 10, color: S.grayLight, marginTop: 4 }}>Indicative labour-market estimate only. Actual salaries vary by employer, location, role, and experience.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ color: "#fff", background: S.coral, flex: 1, minWidth: 180, fontSize: 13, borderRadius: 12 }}>Apply for This Programme</Btn>
            <Btn onClick={() => setPage("Fees & Calculator")} style={{ flex: 1, minWidth: 180, fontSize: 13, border: "2px solid " + S.teal, color: S.teal, borderRadius: 12 }}>Calculate Fees</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgrammesPage({ setPage }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Programmes Overview</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.02, color: "#fff", fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>Find the programme that matches your next move</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>Browse flexible online options by level, compare costs more clearly, explore modules and entry requirements, and move directly into the application or fee calculator when you are ready.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Apply Now</Btn>
                  <Btn onClick={() => setPage("Fees & Calculator")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", borderRadius: 14, padding: "15px 26px" }}>View Fees & Calculator</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 440, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.hero} alt="Learners reviewing programme options together" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🧭</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Choose by level</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>💡</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Compare before applying</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <SectionIntro tag="Programme Finder" title="Clearer programme browsing with the same CTS ETS logic" desc="All programmes remain online and self-paced. This redesign improves browsing and comparison while preserving the level quiz, expand-and-collapse programme cards, and direct route actions." accent={S.violet} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.12fr) minmax(320px, 0.88fr)", gap: 24, alignItems: "start", marginBottom: 26 }} className="resp-grid-2">
            <div>
              <CertDropdown />
              <Reveal><LevelQuiz setPage={setPage} /></Reveal>
            </div>
            <Reveal>
              <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", height: 360, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                  <img src={PEOPLE.advisor} alt="Advisor helping a learner choose the right programme" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Find the route that fits your goals more quickly</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>The programme page should help learners compare levels, understand costs, and move toward a confident decision with less friction.</p>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 6 }}>
        <WideWrap>
          <SectionIntro tag="Level Overview" title="See the programme structure at a glance" desc="Each level remains organised the same way, but the wider layout gives learners a quicker overview before they drill down into the full programme cards." accent={S.teal} />
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 16, marginBottom: 26 }} className="resp-grid-5">
              {Object.entries(PROGRAMMES).map(([level, progs]) => (
                <LevelOverviewCard key={level} title={level} count={progs.length} summary={LEVEL_SUMMARIES[level]} color={LEVEL_COLORS[level] || S.navy} />
              ))}
            </div>
          </Reveal>

          <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, textAlign: "left", marginBottom: 28, fontStyle: "italic", lineHeight: 1.7 }}>
            USD equivalents are approximate at J${USD_RATE} = US$1 and may vary. Registration fee ({fmt(REG_FEE)}) is non-refundable. Training fees vary by programme level.
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 4 }}>
        <WideWrap>
          {Object.entries(PROGRAMMES).map(([level, progs], groupIndex) => {
            const color = LEVEL_COLORS[level] || S.navy;
            const summary = LEVEL_SUMMARIES[level];
            const firstTotal = progs[0] ? fmt(parseInt(String(progs[0].total).replace(/[^0-9]/g, ""))) : "";

            return (
              <Reveal key={level} delay={groupIndex * 0.03}>
                <section style={{ marginBottom: 34 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14, marginBottom: 16 }}>
                    <div style={{ background: "#fff", border: "1px solid " + S.border, borderRadius: 22, padding: "20px 22px", boxShadow: "0 16px 38px rgba(15,23,42,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
                        <div style={{ width: 5, height: 34, borderRadius: 999, background: color }} />
                        <h2 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: S.navy, margin: 0, lineHeight: 1.15 }}>{level}</h2>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 10 }}>
                        <span style={{ padding: "5px 10px", borderRadius: 999, background: color + "14", color: color, fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: S.body }}>{summary.label}</span>
                        <span style={{ fontSize: 12, color: S.gray, fontFamily: S.body, fontWeight: 700 }}>{progs.length} programme{progs.length > 1 ? "s" : ""} · totals from {firstTotal}</span>
                      </div>
                      <p style={{ margin: 0, fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, maxWidth: 980 }}>{summary.note}</p>
                    </div>
                  </div>

                  {progs.map((prog) => {
                    const key = level + "-" + prog.name;
                    return <ProgrammeCard key={key} prog={prog} level={level} levelColor={color} expanded={!!expanded[key]} onToggle={() => toggle(key)} setPage={setPage} />;
                  })}
                </section>
              </Reveal>
            );
          })}
        </WideWrap>
      </section>

      <section style={{ paddingTop: 12 }}>
        <WideWrap>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)", gap: 24, alignItems: "center", marginBottom: 24 }} className="resp-grid-2">
              <div style={{ marginTop: 20, borderRadius: 24, padding: "30px clamp(20px,4vw,36px)", background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)", boxShadow: "0 24px 56px rgba(15,23,42,0.14)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: S.goldLight, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: S.body, marginBottom: 14 }}>Need Help Choosing?</div>
                <h2 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,46px)", color: "#fff", lineHeight: 1.08, margin: "0 0 12px", fontWeight: 900 }}>Move from browsing to action with less friction</h2>
                <p style={{ fontFamily: S.body, fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.74)", margin: 0, maxWidth: 680 }}>Once a learner understands the programme, they should be able to move directly into application, fee planning, or FAQs without hunting around the site.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, fontSize: 14, padding: "16px 30px", borderRadius: 14 }}>Apply Now</Btn>
                  <Btn onClick={() => setPage("FAQ")} style={{ fontSize: 14, padding: "16px 30px", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: "#fff", borderRadius: 14 }}>View FAQ</Btn>
                </div>
              </div>
              <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 26, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
                <div style={{ width: "100%", height: 320, borderRadius: 20, overflow: "hidden", marginBottom: 18 }}>
                  <img src={PEOPLE.learner} alt="Learner reviewing study options on a laptop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Better browsing creates better decisions</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>A clearer programmes page helps learners compare pathways faster and choose a route that fits their current goals.</p>
              </div>
            </div>
          </Reveal>

          <PageScripture page="programmes" />
        </WideWrap>
      </section>
    </PageWrapper>
  );
}
