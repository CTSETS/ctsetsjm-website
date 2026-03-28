import { useState } from "react";
import S from "../constants/styles";
import { PROGRAMMES, PROGRAMME_DETAILS, CAREER_OUTCOMES } from "../constants/programmes";
import { USD_RATE } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { DualPrice, WhatsAppShare } from "../components/shared/DisplayComponents";
import { dualPrice } from "../utils/formatting";
import { trackProgrammeSelected } from "../utils/analytics";
import LevelQuiz from "../components/quiz/LevelQuiz";
import { DownloadGuideButton } from "../components/pdf/ProgrammeGuide";

function DetailModal({ programme, onClose, setPage }) {
  const d = PROGRAMME_DETAILS[programme.name];
  if (!d) return <div style={{ position: "fixed", inset: 0, background: "rgba(1,30,64,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}><div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 400, textAlign: "center" }}><p style={{ fontFamily: S.body, fontSize: 14, color: S.gray }}>Detailed module information for <strong>{programme.name}</strong> will be available soon. Contact us for more details.</p><Btn primary onClick={() => { onClose(); setPage("Contact"); }} style={{ marginTop: 16, color: "#fff", background: S.teal }}>Contact Us</Btn></div></div>;
  const tuitionNum = parseInt(programme.tuition.replace(/[$,]/g, ""));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(1,30,64,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ background: S.navy, padding: "24px 28px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: 10, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>{d.level}</div><h2 style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>{programme.name}</h2><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: S.body, marginTop: 6 }}>{d.duration} · {d.modules.length} modules · {dualPrice(tuitionNum)}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", alignSelf: "flex-start" }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Entry Requirements</div><p style={{ fontSize: 14, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>{d.prerequisites}</p></div>
          <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Modules</div>{d.modules.map((m, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < d.modules.length - 1 ? "1px solid " + S.border : "none" }}><div style={{ width: 22, height: 22, borderRadius: 6, background: S.violet + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: S.violet, fontFamily: S.body, flexShrink: 0 }}>{i + 1}</div><span style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body }}>{m}</span></div>)}</div>
          <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: S.emerald, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Career Paths</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{d.careers.map(c => <span key={c} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: S.emeraldLight, color: S.emeraldDark, fontFamily: S.body, fontWeight: 600 }}>{c}</span>)}</div></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Btn primary onClick={() => { onClose(); setPage("Apply"); }} style={{ color: "#fff", background: S.coral, flex: 1 }}>Apply Now</Btn><Btn onClick={() => { onClose(); setPage("Fees & Calculator"); }} style={{ flex: 1 }}>Calculate Fees</Btn></div>
        </div>
      </div>
    </div>
  );
}

export default function ProgrammesPage({ setPage }) {
  const [activeLevel, setActiveLevel] = useState(Object.keys(PROGRAMMES)[0]);
  const [detailProg, setDetailProg] = useState(null);

  return (
    <PageWrapper>
      <SectionHeader tag="Find Your Path" title="25 Programmes for Every Career Stage" desc="From entry-level job certificates to bachelor's-equivalent diplomas — all 100% online." accentColor={S.emerald} />
      <Container>
        <SocialProofBar />
        <Reveal><div style={{ marginBottom: 48 }}><LevelQuiz setPage={setPage} /></div></Reveal>

        {/* Level tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {Object.keys(PROGRAMMES).map(level => {
            const active = activeLevel === level;
            const key = level.includes("Job") ? "Job Certificate" : level.split(" —")[0];
            const color = S.levelColors[key] || S.navy;
            return <button key={level} onClick={() => setActiveLevel(level)} style={{ padding: "9px 18px", borderRadius: 20, border: "2px solid " + (active ? color : "rgba(10,35,66,0.1)"), background: active ? color : "transparent", color: active ? "#fff" : "#2D3748", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap" }}>{level} ({PROGRAMMES[level].length})</button>;
          })}
        </div>

        {/* Career outcome banner */}
        {(() => { const key = activeLevel.includes("Job") ? "Job Certificate" : activeLevel.split(" —")[0]; const o = CAREER_OUTCOMES[key]; const c = S.levelColors[key] || S.navy; if (!o) return null; return <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "14px 24px", borderRadius: 12, background: c + "08", border: "1px solid " + c + "20", marginBottom: 24, flexWrap: "wrap" }}><div style={{ flex: 1, minWidth: 200 }}><div style={{ fontSize: 10, color: c, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>Career Outlook</div><p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, lineHeight: 1.5, margin: "4px 0 0" }}>{o.outlook}</p></div><div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 8, background: c + "12" }}><div style={{ fontSize: 9, color: c, fontFamily: S.body, fontWeight: 700, letterSpacing: 1 }}>SALARY RANGE</div><div style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: S.navy }}>{o.salaryRange}</div></div></div>; })()}

        {/* Programme table */}
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid " + S.border }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px 110px", padding: "12px 20px", background: S.navy, gap: 8 }} className="prog-row">{["Programme", "Duration", "Tuition", "Total*"].map((h, i) => <span key={h} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, textAlign: i > 0 ? "center" : "left" }}>{h}</span>)}</div>
          {PROGRAMMES[activeLevel].map((p, i) => {
            const tNum = parseInt(p.tuition.replace(/[$,]/g, "")); const totNum = parseInt(p.total.replace(/[$,]/g, ""));
            return <div key={p.name} onClick={() => { setDetailProg(p); trackProgrammeSelected(activeLevel, p.name); }} style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px 110px", padding: "12px 20px", background: i % 2 === 0 ? "#fff" : S.lightBg, borderBottom: "1px solid rgba(10,35,66,0.03)", gap: 8, cursor: "pointer", transition: "background 0.15s" }} className="prog-row" onMouseEnter={e => e.currentTarget.style.background = S.tealLight} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : S.lightBg}>
              <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 13, color: S.navy, fontFamily: S.body, fontWeight: 500 }}>{p.name}</span>{p.popular && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: S.coral + "15", color: S.coral, fontFamily: S.body }}>🔥 Popular</span>}</div>{p.desc && <span style={{ fontSize: 10, color: S.gray, fontFamily: S.body, display: "block", marginTop: 2 }}>{p.desc}</span>}</div>
              <span style={{ fontSize: 12, color: S.gray, fontFamily: S.body, textAlign: "center" }}>{p.duration}</span>
              <span style={{ textAlign: "center" }}><DualPrice amount={tNum} size={11} /></span>
              <span style={{ textAlign: "center" }}><DualPrice amount={totNum} size={12} /></span>
            </div>;
          })}
          <div style={{ padding: "12px 20px", background: S.goldLight, fontSize: 11, color: "#2D3748", fontFamily: S.body }}>* Total includes J$5,000 (US${Math.round(5000 / USD_RATE)}) registration fee. NCTVET external fees separate.</div>
        </div>

        {/* Entry Requirements */}
        <div style={{ marginTop: 40, marginBottom: 32 }}>
          <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, textAlign: "center", marginBottom: 20 }}>Entry Requirements by Level</h3>
          {[
            { level: "Job Certificate", req: "Open entry — no qualifications needed", color: S.emerald },
            { level: "Level 2", req: "Job Certificate OR 2 CXC/CSEC subjects (or equivalent)", color: S.teal },
            { level: "Level 3", req: "Level 2 OR 3 CXC/CSEC subjects (CAPE, GCSEs accepted)", color: S.violet },
            { level: "Level 4", req: "Level 3 Diploma in a related business area", color: S.coral },
            { level: "Level 5", req: "Level 4 Associate in a related business area", color: S.rose },
          ].map((r, i) => <Reveal key={r.level} delay={i * 0.06}><div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderRadius: 10, background: "#fff", border: "1px solid " + S.border, borderLeft: "4px solid " + r.color, marginBottom: 8 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: r.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: r.color, fontFamily: S.body, flexShrink: 0 }}>{i + 1}</div><div><div style={{ fontFamily: S.body, fontSize: 13, fontWeight: 700, color: S.navy }}>{r.level}</div><div style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginTop: 1 }}>{r.req}</div></div></div></Reveal>)}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
          <Btn primary onClick={() => setPage("Fees & Calculator")} style={{ color: "#fff", background: S.teal }}>See What You'll Pay</Btn>
          <Btn primary onClick={() => setPage("Apply")} style={{ color: "#fff", background: S.coral }}>Apply Now</Btn>
          <DownloadGuideButton />
        </div>
        <PageScripture page="programmes" />
        {detailProg && <DetailModal programme={detailProg} onClose={() => setDetailProg(null)} setPage={setPage} />}
      </Container>
    </PageWrapper>
  );
}
