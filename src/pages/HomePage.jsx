import { useState, useRef } from "react";
import S from "../constants/styles";
import { NAV_LOGO, PORTAL_URL, APPS_SCRIPT_URL } from "../constants/config";
import { TESTIMONIALS, SOCIAL_PROOF, ANNOUNCEMENTS } from "../constants/content";
import { CAREER_OUTCOMES } from "../constants/programmes";
import { Container, Btn, Reveal, PageScripture, SocialProofBar, TalkToGraduate, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos, HoneypotField } from "../components/shared/DisplayComponents";

function InterestCapture() {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [hp, setHp] = useState(""); const start = useRef(Date.now());
  const submit = () => { if (hp || Date.now() - start.current < 3000 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return; try { fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Interest Capture", email, timestamp: new Date().toISOString() }), mode: "no-cors" }); } catch {} setSent(true); };
  if (sent) return <div style={{ textAlign: "center", padding: "20px 0" }}><span style={{ fontSize: 28 }}>✅</span><p style={{ fontFamily: S.body, fontSize: 14, color: S.emerald, fontWeight: 600, marginTop: 8 }}>You're on the list!</p></div>;
  return <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}><div style={{ fontSize: 10, color: S.teal, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>Stay Informed</div><h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", marginBottom: 10 }}>Get Notified About Future Intakes</h3><div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto", position: "relative" }}><HoneypotField value={hp} onChange={e => setHp(e.target.value)} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === "Enter" && submit()} aria-label="Email for intake notifications" style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "2px solid " + S.teal + "50", background: "rgba(255,255,255,0.06)", fontSize: 13, fontFamily: S.body, color: "#fff" }} /><button onClick={submit} style={{ padding: "12px 24px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Notify Me</button></div></div>;
}

export default function HomePage({ setPage }) {
  return (
    <div>
      {/* ══ HERO — Digital School, 100% Online, Self-Paced ══ */}
      <section style={{ background: S.navy, color: "#fff", position: "relative", overflow: "hidden", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${S.coral}12 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 80%, ${S.teal}10 0%, transparent 55%)` }} />
        <Container style={{ position: "relative", zIndex: 2, padding: "clamp(40px,6vw,80px) clamp(16px,3vw,48px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,80px)", alignItems: "center" }} className="resp-grid-2">
            <div>
              {/* Logo + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 88, height: 98, objectFit: "contain" }} width={88} height={98} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.2 }}>CTS Empowerment &amp; Training Solutions</div>
                  <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, fontFamily: S.body, marginTop: 6, textTransform: "uppercase" }}>Called To Serve — Excellence Through Service</div>
                </div>
              </div>

              {/* Primary badge — this is what they see FIRST */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: S.emerald + "25", border: "2px solid " + S.emerald + "60", borderRadius: 30, padding: "10px 24px", marginBottom: 22 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: S.emerald, boxShadow: "0 0 12px " + S.emerald, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 13, color: S.emerald, fontFamily: S.body, fontWeight: 800, letterSpacing: 1 }}>100% ONLINE &bull; SELF-PACED &bull; NO CLASS DAYS</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4.5vw,50px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 18 }}>
                Jamaica's <span style={{ color: S.coral }}>Digital</span><br />Vocational School.
              </h1>

              {/* What self-paced really means */}
              <p style={{ fontFamily: S.body, fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.9)", lineHeight: 1.8, marginBottom: 10, maxWidth: 500 }}>
                Everything happens online. There are no classroom days, no fixed timetable, and no need to travel. You log in from your phone or laptop, study at whatever time suits you — morning, night, weekend — and move through the material at your own speed.
              </p>
              <p style={{ fontFamily: S.body, fontSize: "clamp(13px,1.3vw,15px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
                When you are finished, we arrange your NCTVET assessment through HEART/NSTA — at no additional cost. You receive the same nationally recognised NVQ-J qualification.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Apply")} style={{ fontSize: 15, padding: "16px 36px", color: "#fff", background: S.coral }} ariaLabel="Apply now">Apply Now — Start Anytime</Btn>
                <Btn onClick={() => setPage("Programmes")} style={{ border: "2px solid " + S.teal, color: S.teal, fontSize: 14 }} ariaLabel="View programmes">View 25 Programmes</Btn>
              </div>
            </div>

            {/* Right column — Real-life study scenarios */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Scenario cards — paint the picture */}
              {[
                { time: "7:15 AM", emoji: "\uD83D\uDE8C", scene: "On the bus to work", desc: "Kezia opens her phone, plugs in earphones, and listens to her Business Administration audio lesson during the 40-minute commute. By the time she reaches work, she's finished a whole module.", bg: S.teal },
                { time: "12:30 PM", emoji: "\uD83C\uDF5B", scene: "Lunch break at the office", desc: "Devon pulls up a quiz on his phone while eating. 10 questions, 8 minutes. He scores 90% and moves on to the next unit. Nobody at work even knows he's studying.", bg: S.coral },
                { time: "9:45 PM", emoji: "\uD83D\uDECB\uFE0F", scene: "Kids asleep, studying in bed", desc: "Tamara props up her laptop on the pillow. The house is quiet. She reads through her Human Resource Management guide, highlights key points, and asks the AI study assistant a question. No rush — she'll finish tomorrow if she wants.", bg: S.violet },
                { time: "5:30 AM", emoji: "\u2615", scene: "Early riser — before the world wakes up", desc: "Marcus is up before dawn. Coffee in hand, he logs into Canvas on his tablet and completes two exercises. By 6:30 he's done for the day. Self-paced means he sets the schedule.", bg: S.gold },
                { time: "Sunday", emoji: "\uD83C\uDFE0", scene: "Weekend catch-up from the verandah", desc: "Anika hasn't studied all week — life was busy. No problem. She sits on the verandah with her phone and does three lessons back-to-back. No penalty for the missed days. That's what self-paced means.", bg: S.emerald },
              ].map(function(s, i) {
                return (
                  <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s" }}>
                    <div style={{ flexShrink: 0, textAlign: "center", minWidth: 52 }}>
                      <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 4 }}>{s.emoji}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: s.bg, fontFamily: S.body, letterSpacing: 0.5 }}>{s.time}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: S.body, marginBottom: 3 }}>{s.scene}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: S.body, lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom stat bar */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px,4vw,48px)", flexWrap: "wrap", marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[["100%", "Online"], ["25", "Programmes"], ["Self-Paced", "No Deadlines"], ["From J$10K", "Total Cost"], ["NCTVET", "Certified"]].map(function(s) {
              return (
                <div key={s[1]} style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontFamily: S.heading, fontSize: 22, fontWeight: 800, color: S.coral }}>{s[0]}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{s[1]}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══ WHAT SELF-PACED MEANS — full explainer section ══ */}
      <section style={{ background: "#fff", padding: "64px 0", borderBottom: "1px solid " + S.border }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 11, color: S.emerald, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>How It Works</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,40px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>What Does "Self-Paced" <span style={{ color: S.coral }}>Actually Mean?</span></h2>
            <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, maxWidth: 600, margin: "14px auto 0" }}>It means there is no timetable. No class days. No one telling you when to study. You decide everything.</p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="resp-grid-3">
            {[
              { icon: "\uD83D\uDCF1", title: "Your device is your classroom", desc: "All you need is a phone, tablet, or laptop and an internet connection. Every lesson, quiz, audio session, and study guide is available online — 24 hours a day, 7 days a week. There is no building to go to.", color: S.teal },
              { icon: "\u23F0", title: "You choose when to study", desc: "5am before work? Lunch break? 11pm after the kids are asleep? It does not matter. The material is always there waiting for you. Study when your mind is sharpest — not when a timetable tells you to.", color: S.coral },
              { icon: "\uD83D\uDCC8", title: "You move at your speed", desc: "If you understand a topic quickly, skip ahead. If something is difficult, go back and repeat it. There are no deadlines, no exams on a fixed date, and no pressure to keep up with a class.", color: S.violet },
              { icon: "\uD83C\uDFE2", title: "Keep your job. Keep your life.", desc: "You do not need to take time off work. You do not need to arrange childcare. You do not need to travel anywhere. Your studies fit around your life — not the other way around.", color: S.emerald },
              { icon: "\uD83C\uDFA7", title: "Listen like a podcast", desc: "Every lesson has an Audio Study Session. Plug in your earphones on the bus, in the car, at the gym, or while cooking. Learning does not have to mean sitting at a desk.", color: S.gold },
              { icon: "\uD83C\uDF93", title: "Same qualification at the end", desc: "Whether you finish in 2 months or 6, you earn the same nationally recognised NCTVET qualification. Your certificate does not say 'online' — it says NVQ-J, just like any classroom student.", color: S.rose },
            ].map(function(card, i) {
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{ background: S.lightBg, borderRadius: 16, padding: "28px 24px", border: "1px solid " + S.border, borderTop: "4px solid " + card.color, height: "100%" }}>
                    <div style={{ fontSize: 36, marginBottom: 14 }}>{card.icon}</div>
                    <h3 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 10 }}>{card.title}</h3>
                    <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ color: "#fff", background: S.emerald, fontSize: 15, padding: "16px 36px" }}>Ready? Apply Now — Start Anytime</Btn>
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

      {/* ══ PRICING CTA ══ */}
      <section style={{ background: `linear-gradient(135deg, ${S.coral} 0%, ${S.gold} 100%)`, padding: "48px 0" }}>
        <Container>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(1,30,64,0.15)", borderRadius: 20, padding: "6px 16px", marginBottom: 14 }}><span>🎓</span><span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase" }}>April Intake — Now Open</span></div>
                <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: "#fff", fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>Start From Just J$10,000</h2>
                <p style={{ fontFamily: S.body, fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>25 programmes from Job Certificate to Bachelor's Equivalent. <strong>100% online, self-paced</strong>. Payment plans available for Levels 3–5. Your fee covers training — <strong>NCTVET assessment at no extra cost</strong>.</p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Fees & Calculator")} style={{ background: S.navy, color: "#fff", fontSize: 15, padding: "16px 32px" }}>View Pricing</Btn>
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
