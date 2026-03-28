import { useState, useRef } from "react";
import S from "../constants/styles";
import { NAV_LOGO, HERO_LOGO, PORTAL_URL, APPS_SCRIPT_URL } from "../constants/config";
import { TESTIMONIALS, SOCIAL_PROOF, ANNOUNCEMENTS } from "../constants/content";
import { CAREER_OUTCOMES } from "../constants/programmes";
import { Container, Btn, Reveal, PageScripture, SocialProofBar, TalkToGraduate, TestimonialCard } from "../components/shared/CoreComponents";
import { AnimatedStat, CountdownTimer, PartnerLogos, HoneypotField } from "../components/shared/DisplayComponents";

function InterestCapture() {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [hp, setHp] = useState(""); const start = useRef(Date.now());
  const submit = () => { if (hp || Date.now() - start.current < 3000 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return; try { fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Interest Capture", email, timestamp: new Date().toISOString() }), mode: "no-cors" }); } catch {} setSent(true); };
  if (sent) return <div style={{ textAlign: "center", padding: "20px 0" }}><span style={{ fontSize: 28 }}>✅</span><p style={{ fontFamily: S.body, fontSize: 14, color: S.emerald, fontWeight: 600, marginTop: 8 }}>You're on the list!</p></div>;
  return <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}><div style={{ fontSize: 10, color: S.teal, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>Stay Informed</div><h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", marginBottom: 10 }}>Get Notified About Future Intakes</h3><div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto", position: "relative" }}><HoneypotField value={hp} onChange={e => setHp(e.target.value)} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === "Enter" && submit()} aria-label="Email for intake notifications" style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "2px solid " + S.teal + "50", background: "rgba(255,255,255,0.06)", fontSize: 13, fontFamily: S.body, color: "#fff" }} /><button onClick={submit} style={{ padding: "12px 24px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Notify Me</button></div></div>;
}

export default function HomePage({ setPage }) {
  return (
    <div>
      {/* ══ HERO — Student-facing copy, no internal language ══ */}
      <section style={{ background: S.navy, color: "#fff", position: "relative", overflow: "hidden", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${S.coral}12 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 80%, ${S.teal}10 0%, transparent 55%)` }} />
        <Container style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,80px)", alignItems: "center", padding: "clamp(40px,6vw,80px) clamp(16px,3vw,48px)" }} className="resp-grid-2">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
              <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 88, height: 98, objectFit: "contain" }} width={88} height={98} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.2 }}>CTS Empowerment &amp; Training Solutions</div>
                <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, fontFamily: S.body, marginTop: 6, textTransform: "uppercase" }}>Called To Serve — Excellence Through Service</div>
              </div>
              {/* Founding CTA card */}
              <div onClick={() => setPage("Founding Cohort")} style={{ cursor: "pointer", padding: "24px 32px", borderRadius: 18, background: `linear-gradient(135deg, ${S.coral}30 0%, ${S.gold}18 100%)`, border: "3px solid " + S.coral, textAlign: "center", minWidth: 240, boxShadow: "0 8px 32px " + S.coral + "30" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: S.emerald, boxShadow: "0 0 10px " + S.emerald, animation: "pulse 2s infinite" }} /><span style={{ fontSize: 13, fontWeight: 800, color: S.coral, fontFamily: S.body, letterSpacing: 2, textTransform: "uppercase" }}>Founding Cohort</span></div>
                <div style={{ fontFamily: S.heading, fontSize: "clamp(32px,4vw,44px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 8 }}>Save <span style={{ color: S.coral }}>$10K</span></div>
                <div style={{ fontFamily: S.body, fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: 10 }}>Registration free for the first 15 students.<br />Level 3+ get $5,000 off tuition.</div>
                <div style={{ display: "inline-flex", fontSize: 14, color: S.coral, fontFamily: S.body, fontWeight: 800, padding: "8px 20px", borderRadius: 24, border: "2px solid " + S.coral }}>View Founding Prices →</div>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: S.teal + "20", border: "1px solid " + S.teal + "50", borderRadius: 30, padding: "8px 20px", marginBottom: 20 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: S.teal, animation: "pulse 2s infinite" }} /><span style={{ fontSize: 12, color: S.teal, fontFamily: S.body, fontWeight: 600, letterSpacing: 1 }}>ROLLING ENROLMENT — START ANYTIME</span></div>
            <div style={{ marginBottom: 28 }}><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: S.body, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Intake Starts In</div><CountdownTimer targetDate="2026-04-06T09:00:00" /></div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>Build Real Skills.<br /><span style={{ color: S.coral }}>Earn Recognised</span><br />Qualifications.</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>25 programmes from Job Certificate to Bachelor's Equivalent — aligned to NCTVET &amp; City &amp; Guilds. Study online, at your pace, with audio lessons, an AI study assistant, and expert-written guides.</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ fontSize: 15, padding: "16px 36px", color: "#fff", background: S.coral }} ariaLabel="Apply now">Apply Now</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ border: "2px solid " + S.teal, color: S.teal, fontSize: 14 }} ariaLabel="View programmes">View Programmes</Btn>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src={HERO_LOGO} alt="CTS ETS crest" style={{ width: "100%", maxWidth: 420, margin: "0 auto", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", display: "block" }} loading="lazy" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{[["25","Programmes"],["5","Levels"],["3","Payment Plans"],["15%","Group Discount"]].map(([v,l]) => <AnimatedStat key={l} value={v} label={l} />)}</div>
          </div>
        </Container>
      </section>

      {/* ══ PARTNER LOGOS ══ */}
      <section style={{ background: S.lightBg, borderBottom: "1px solid " + S.border }}><Container style={{ padding: "32px clamp(16px,3vw,48px)" }}><PartnerLogos /></Container></section>

      {/* ══ CAREER OUTCOMES PREVIEW — salary ranges and outlook ══ */}
      <section style={{ background: "#fff", padding: "56px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 36 }}><span style={{ fontSize: 11, color: S.emerald, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Where Can This Take You?</span><h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,38px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>Real Career Outcomes at Every Level</h2></div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }} className="resp-grid-3">
            {Object.entries(CAREER_OUTCOMES).map(([level, data], i) => {
              const colors = [S.emerald, S.teal, S.violet, S.coral, S.rose];
              return (
                <Reveal key={level} delay={i * 0.08}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "24px 18px", border: "1px solid " + colors[i] + "25", borderTop: "3px solid " + colors[i], textAlign: "center", height: "100%" }}>
                    <div style={{ fontSize: 10, color: colors[i], letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>{level}</div>
                    <div style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 800, color: S.navy, marginBottom: 6 }}>{data.salaryRange}</div>
                    <p style={{ fontFamily: S.body, fontSize: 11, color: S.gray, lineHeight: 1.5 }}>{data.outlook}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}><Btn primary onClick={() => setPage("Careers")} style={{ color: "#fff", background: S.emerald }}>Explore All Career Paths</Btn></div>
        </Container>
      </section>

      {/* ══ FOUNDING COHORT CTA ══ */}
      <section style={{ background: `linear-gradient(135deg, ${S.coral} 0%, ${S.gold} 100%)`, padding: "48px 0" }}>
        <Container>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(1,30,64,0.15)", borderRadius: 20, padding: "6px 16px", marginBottom: 14 }}><span>🎓</span><span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase" }}>Limited — First 15 Students</span></div>
                <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: "#fff", fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>Founding Cohort Package</h2>
                <p style={{ fontFamily: S.body, fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}><strong>Registration free</strong> for the first 15 students. Level 3+ also get <strong>$5,000 off tuition</strong>. Plus a <strong>5% referral bonus</strong>.</p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Founding Cohort")} style={{ background: S.navy, color: "#fff", fontSize: 15, padding: "16px 32px" }}>View Founding Prices</Btn>
                <Btn onClick={() => setPage("Apply")} style={{ border: "2px solid #fff", color: "#fff" }}>Apply Now</Btn>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ══ TESTIMONIALS — no fictional disclaimer ══ */}
      <section style={{ background: "#fff", padding: "64px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 48 }}><span style={{ fontSize: 11, color: S.violet, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>What Our Learners Say</span><h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,40px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>Success Stories</h2></div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="resp-grid-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: S.lightBg, borderRadius: 16, padding: "28px 24px 24px", border: "1px solid " + S.border, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "absolute", top: 16, right: 20, fontSize: 56, fontFamily: S.heading, color: t.color, opacity: 0.12, lineHeight: 1 }}>"</div>
                  <p style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.75, marginBottom: 22, fontStyle: "italic", flex: 1, position: "relative", zIndex: 1 }}>"{t.quote}"</p>
                  <div style={{ height: 1, background: "rgba(10,35,66,0.07)", marginBottom: 16 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: t.color, fontFamily: S.body, flexShrink: 0 }}>{t.initials}</div>
                    <div><div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.navy }}>{t.name}</div><div style={{ fontSize: 11, color: t.color, fontFamily: S.body, fontWeight: 600 }}>{t.level}</div><div style={{ fontSize: 10, color: S.gray, fontFamily: S.body }}>📍 {t.parish}</div></div>
                  </div>
                  <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: t.color + "15", border: "1px solid " + t.color + "30", borderRadius: 6, padding: "5px 10px", alignSelf: "flex-start" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: t.color, fontFamily: S.body }}>{t.outcome}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}><Btn primary onClick={() => setPage("Apply")} style={{ color: "#fff", background: S.violet }}>Join Our Learners — Apply Now</Btn></div>
        </Container>
      </section>

      {/* ══ TALK TO A GRADUATE ══ */}
      <section style={{ background: S.lightBg, padding: "32px 0" }}><Container><TalkToGraduate setPage={setPage} /></Container></section>

      {/* ══ STUDENT PORTAL CTA ══ */}
      <section style={{ background: "#fff", padding: "48px 0" }}>
        <Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap", padding: "32px clamp(24px,4vw,48px)", background: S.tealLight, borderRadius: 16, border: "1px solid " + S.teal + "30" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><div style={{ width: 44, height: 44, borderRadius: 10, background: S.teal + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎓</div><div><div style={{ fontSize: 10, color: S.tealDark, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>Exclusive to CTS ETS</div><h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, margin: 0, fontWeight: 700 }}>Interactive Learning System</h3></div></div>
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7 }}>Audio Study Sessions you can listen to like a podcast. An AI study assistant that answers your questions 24/7. Expert-written guides, flashcards, and video summaries — all from one place.</p>
            </div>
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 32px", borderRadius: 8, background: S.teal, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none", whiteSpace: "nowrap" }}>Access Student Portal →</a>
          </div>
        </Container>
      </section>

      {/* ══ LATEST ANNOUNCEMENTS (replacing static blog) ══ */}
      <section style={{ background: S.lightBg, padding: "48px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 32 }}><span style={{ fontSize: 11, color: S.amber, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>What's New</span><h2 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>Latest Updates</h2></div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }} className="resp-grid-2">
            {ANNOUNCEMENTS.slice(0, 4).map((a, i) => {
              const typeColors = { intake: S.coral, offer: S.gold, feature: S.teal, milestone: S.violet };
              return (
                <Reveal key={a.id} delay={i * 0.08}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border, borderLeft: "4px solid " + (typeColors[a.type] || S.gold), height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 10, color: typeColors[a.type], letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>{a.type}</span><span style={{ fontSize: 11, color: S.grayLight, fontFamily: S.body }}>{a.date}</span></div>
                    <h4 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, fontWeight: 700, marginBottom: 8 }}>{a.title}</h4>
                    <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, marginBottom: 14 }}>{a.body}</p>
                    <button onClick={() => setPage(a.ctaPage)} style={{ background: "none", border: "none", color: typeColors[a.type], fontSize: 13, fontWeight: 700, fontFamily: S.body, cursor: "pointer", padding: 0 }}>{a.cta} →</button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══ INTEREST CAPTURE ══ */}
      <section style={{ background: S.navy, padding: "48px 0" }}><Container><InterestCapture /></Container></section>

      {/* Scripture */}
      <section style={{ background: "#fff" }}><Container><PageScripture page="home" /></Container></section>
    </div>
  );
}
