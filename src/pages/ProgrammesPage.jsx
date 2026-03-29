import { useState } from "react";
import S from "../constants/styles";
import { PROGRAMMES, PROGRAMME_DETAILS, CAREER_OUTCOMES } from "../constants/programmes";
import { REG_FEE, USD_RATE } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";
import LevelQuiz from "../components/quiz/LevelQuiz";

function CertDropdown() {
  var [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 32 }}>
      <button onClick={function() { setOpen(!open); }} style={{ width: "100%", padding: "18px 24px", borderRadius: open ? "14px 14px 0 0" : 14, border: "2px solid " + S.teal + "40", background: open ? S.teal : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>{"\uD83C\uDF93"}</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: open ? "#fff" : S.navy, fontFamily: S.heading }}>About NCTVET Certification</div>
            <div style={{ fontSize: 12, color: open ? "rgba(255,255,255,0.7)" : S.gray, fontFamily: S.body }}>What is NVQ-J and why does it matter?</div>
          </div>
        </div>
        <span style={{ fontSize: 16, color: open ? "#fff" : S.gray, fontWeight: 700, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25BC"}</span>
      </button>
      {open && (
        <div style={{ padding: "24px", background: "#fff", border: "2px solid " + S.teal + "40", borderTop: "none", borderRadius: "0 0 14px 14px", fontSize: 14, fontFamily: S.body, color: "#2D3748", lineHeight: 1.7 }}>
          <p style={{ marginBottom: 12 }}><strong>NVQ-J (National Vocational Qualification of Jamaica)</strong> is the nationally recognised standard for vocational qualifications in Jamaica, administered by NCTVET under HEART/NSTA Trust.</p>
          <p style={{ marginBottom: 12 }}>All CTS ETS programmes are aligned to NCTVET competency standards. When you complete your training, we arrange your NCTVET assessment through HEART/NSTA — at no additional cost, unless required. NCTVET registration and assessment fees are set by NCTVET where necessary.</p>
          <p style={{ marginBottom: 12 }}>Your NVQ-J qualification is recognised by employers across Jamaica and meets international competency-based education standards.</p>
          <div style={{ padding: "12px 16px", borderRadius: 8, background: S.lightBg, border: "1px solid " + S.border, fontSize: 12, color: S.gray }}>
            <strong style={{ color: S.navy }}>Qualification Levels:</strong> Job Certificate (entry) → Level 2 (Vocational Certificate) → Level 3 (Diploma) → Level 4 (Associate Equivalent) → Level 5 (Bachelor's Equivalent)
          </div>
        </div>
      )}
    </div>
  );
}

function ProgrammeCard({ prog, level, levelColor, expanded, onToggle, setPage }) {
  var d = PROGRAMME_DETAILS[prog.name];
  var tuitionNum = parseInt(prog.tuition.replace(/[$,]/g, ""));
  var totalNum = tuitionNum + REG_FEE;
  var usd = Math.round(totalNum / USD_RATE);
  var levelKey = level.indexOf("5") >= 0 ? "Level 5 (Bachelor's Equiv.)" : level.indexOf("4") >= 0 ? "Level 4 (Associate Equiv.)" : level.indexOf("3") >= 0 ? "Level 3" : level.indexOf("2") >= 0 ? "Level 2" : "Job Certificate";
  var career = CAREER_OUTCOMES[levelKey];

  return (
    <div style={{ marginBottom: 10, borderRadius: expanded ? "14px" : 12, border: "1px solid " + (expanded ? levelColor + "40" : S.border), overflow: "hidden", transition: "all 0.2s" }}>
      {/* Header — always visible */}
      <button onClick={onToggle} style={{ width: "100%", padding: "16px 20px", background: expanded ? levelColor + "08" : "#fff", cursor: "pointer", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>{prog.name}</div>
          <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 2 }}>{prog.duration} {prog.popular ? " · ⭐ Popular" : ""}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: levelColor, fontFamily: S.heading }}>{fmt(totalNum)}</div>
          <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body }}>{"US$" + usd}</div>
        </div>
        <span style={{ fontSize: 14, color: S.gray, fontWeight: 700, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 8 }}>{"\u25BC"}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 20px 20px", background: "#fff", borderTop: "1px solid " + S.border }}>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, margin: "16px 0" }}>{prog.desc}</p>

          {/* Fee breakdown */}
          <div style={{ padding: "14px 16px", borderRadius: 10, background: S.lightBg, border: "1px solid " + S.border, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: S.body, marginBottom: 4 }}>
              <span style={{ color: S.gray }}>Registration Fee (non-refundable)</span>
              <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(REG_FEE)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: S.body, marginBottom: 4 }}>
              <span style={{ color: S.gray }}>Training Fee</span>
              <span style={{ color: S.navy, fontWeight: 600 }}>{fmt(tuitionNum)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: S.heading, fontWeight: 700, paddingTop: 6, borderTop: "1px solid " + S.border }}>
              <span style={{ color: S.navy }}>Total</span>
              <span style={{ color: levelColor }}>{fmt(totalNum) + " (US$" + usd + ")"}</span>
            </div>
            <div style={{ fontSize: 10, color: S.grayLight, fontFamily: S.body, marginTop: 6, fontStyle: "italic" }}>NCTVET registration and assessment fees not included — set by NCTVET where necessary. Payment plans (Silver/Bronze) available for Levels 3–5.</div>
          </div>

          {/* Modules */}
          {d && d.modules && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Modules</div>
              {d.modules.map(function(m, i) {
                return <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 12, fontFamily: S.body, color: "#2D3748" }}><span style={{ width: 18, height: 18, borderRadius: 4, background: S.violet + "12", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: S.violet, flexShrink: 0 }}>{i + 1}</span>{m}</div>;
              })}
            </div>
          )}

          {/* Prerequisites */}
          {d && d.prerequisites && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>Entry Requirements</div>
              <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.5, margin: 0 }}>{d.prerequisites}</p>
            </div>
          )}

          {/* Career Opportunities */}
          {d && d.careers && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: S.emerald, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>Career Opportunities</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {d.careers.map(function(c) { return <span key={c} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 16, background: S.emeraldLight, color: S.emeraldDark, fontFamily: S.body, fontWeight: 600 }}>{c}</span>; })}
              </div>
              {career && (
                <div style={{ fontSize: 12, fontFamily: S.body, color: S.gray, fontStyle: "italic", lineHeight: 1.5 }}>
                  {"Estimated salary range: " + career.salaryRange + ". "}
                  <span style={{ fontSize: 10, color: S.grayLight }}>Estimated ranges based on Jamaican labour market data (2025). Actual salaries vary by employer, experience, and location.</span>
                </div>
              )}
            </div>
          )}

          {/* Certification */}
          <div style={{ padding: "12px 14px", borderRadius: 8, background: S.teal + "08", border: "1px solid " + S.teal + "20", marginBottom: 16, fontSize: 12, fontFamily: S.body, color: S.navy }}>
            <strong>Certification:</strong> CTS ETS Institutional Certificate + NCTVET NVQ-J qualification. Assessment arranged through HEART/NSTA at no additional cost, unless required.
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn primary onClick={function() { setPage("Apply"); }} style={{ color: "#fff", background: S.coral, flex: 1, fontSize: 13 }}>Apply for This Programme</Btn>
            <Btn onClick={function() { setPage("Fees & Calculator"); }} style={{ flex: 1, fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Calculate Fees</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgrammesPage({ setPage }) {
  var [expanded, setExpanded] = useState({});
  var levelColors = { "Job / Professional Certificates": S.emerald, "Level 2 — Vocational Certificate": S.teal, "Level 3 — Diploma": S.violet, "Level 4 — Associate Equivalent": S.coral, "Level 5 — Bachelor's Equivalent": S.rose };

  var toggle = function(key) {
    setExpanded(function(prev) {
      var next = Object.assign({}, prev);
      if (next[key]) { delete next[key]; } else { next[key] = true; }
      return next;
    });
  };

  return (
    <PageWrapper>
      <SectionHeader tag="Our Programmes" title="Find Your Programme" desc="All programmes are 100% online and self-paced. Fees shown in JMD with USD equivalent. Click any programme to see full details." accentColor={S.violet} />
      <Container>
        <SocialProofBar />

        {/* NCTVET Certification dropdown */}
        <CertDropdown />

        {/* Level Quiz */}
        <Reveal><LevelQuiz setPage={setPage} /></Reveal>

        {/* USD disclaimer */}
        <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, textAlign: "center", marginBottom: 24, fontStyle: "italic" }}>
          USD equivalents are approximate at J$155 = US$1 and may vary. Registration fee ($5,000) is non-refundable. Training fee varies by level.
        </div>

        {/* Programmes by level */}
        {Object.entries(PROGRAMMES).map(function(entry) {
          var level = entry[0], progs = entry[1];
          var color = levelColors[level] || S.navy;
          var levelLabel = level.replace("Level 4 — Associate", "Level 4 — Associate Equivalent").replace("Level 5 — Bachelor's", "Level 5 — Bachelor's Equivalent");
          return (
            <Reveal key={level}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 32, borderRadius: 2, background: color }} />
                  <div>
                    <h2 style={{ fontFamily: S.heading, fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: S.navy, margin: 0 }}>{levelLabel}</h2>
                    <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>{progs.length + " programme" + (progs.length > 1 ? "s" : "") + " · Total from " + fmt(parseInt(progs[0].total.replace(/[$,]/g, "")))}</div>
                  </div>
                </div>
                {progs.map(function(prog) {
                  var key = level + "-" + prog.name;
                  return <ProgrammeCard key={key} prog={prog} level={level} levelColor={color} expanded={!!expanded[key]} onToggle={function() { toggle(key); }} setPage={setPage} />;
                })}
              </div>
            </Reveal>
          );
        })}

        {/* Bottom CTA */}
        <Reveal>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Btn primary onClick={function() { setPage("Apply"); }} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "16px 40px" }}>Apply Now — Join the Next Cohort</Btn>
            <div style={{ marginTop: 12 }}><Btn onClick={function() { setPage("FAQ"); }} style={{ fontSize: 13, border: "2px solid " + S.teal, color: S.teal }}>Have Questions? View FAQ</Btn></div>
          </div>
        </Reveal>

        <PageScripture page="programmes" />
      </Container>
    </PageWrapper>
  );
}
