import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { NAV_LOGO, APPS_SCRIPT_URL } from "../constants/config";
import { TESTIMONIALS, FAQS } from "../constants/content";
import { CAREER_OUTCOMES } from "../constants/programmes";
import { Container, Btn, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";
import { PartnerLogos, HoneypotField } from "../components/shared/DisplayComponents";
import SiteTour from "../components/shared/SiteTour";

function InterestCapture() {
  var [email, setEmail] = useState(""); var [sent, setSent] = useState(false); var [hp, setHp] = useState(""); var start = useRef(Date.now());
  var submit = function() { if (hp || Date.now() - start.current < 3000 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return; try { fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Interest Capture", email: email, timestamp: new Date().toISOString() }), mode: "no-cors" }); } catch(e) {} setSent(true); };
  if (sent) return <div style={{ textAlign: "center", padding: "20px 0" }}><span style={{ fontSize: 28 }}>✅</span><p style={{ fontFamily: S.body, fontSize: 14, color: S.emerald, fontWeight: 600, marginTop: 8 }}>You're on the list!</p></div>;
  return <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}><div style={{ fontSize: 10, color: S.teal, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>Stay Informed</div><h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", marginBottom: 10 }}>Get Notified About Future Terms</h3><div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto", position: "relative" }}><HoneypotField value={hp} onChange={function(e) { setHp(e.target.value); }} /><input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="your@email.com" onKeyDown={function(e) { if (e.key === "Enter") submit(); }} style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "2px solid " + S.teal + "50", background: "rgba(255,255,255,0.06)", fontSize: 13, fontFamily: S.body, color: "#fff" }} /><button onClick={submit} style={{ padding: "12px 24px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Notify Me</button></div></div>;
}

var SCENARIOS = [
  { time: "7:15 AM", emoji: "\uD83D\uDE8C", scene: "On the bus to work", desc: "Kezia plugs in her earphones and listens to her Business Administration audio lesson during the 40-minute commute. By the time she reaches work, she's finished a whole module.", bg: S.teal },
  { time: "12:30 PM", emoji: "\uD83C\uDF5B", scene: "Lunch break at the office", desc: "Devon pulls up a quiz on his phone while eating. 10 questions, 8 minutes. He scores 90% and moves on. Nobody at work even knows he's studying.", bg: S.coral },
  { time: "9:45 PM", emoji: "\uD83D\uDECB\uFE0F", scene: "Kids asleep, studying in bed", desc: "Tamara props up her laptop. The house is quiet. She reads through her HR guide, highlights key points, and asks the AI study assistant a question.", bg: S.violet },
  { time: "5:30 AM", emoji: "\u2615", scene: "Early riser — before dawn", desc: "Marcus is up before sunrise. Coffee in hand, he logs into the CTS ETS Learning Portal on his tablet and completes two exercises. By 6:30 he's done for the day.", bg: S.gold },
  { time: "Sunday", emoji: "\uD83C\uDFE0", scene: "Weekend catch-up from the verandah", desc: "Anika hasn't studied all week — life was busy. She does three lessons back-to-back from the verandah. No penalty for the missed days. That's self-paced.", bg: S.emerald },
  { time: "3:00 PM", emoji: "\uD83D\uDE97", scene: "Parked outside the school gate", desc: "Jordan is waiting to pick up the kids. She opens the learning portal and reviews her Customer Service flashcards for 15 minutes. Small pockets of time add up.", bg: S.rose },
  { time: "11:30 PM", emoji: "\uD83C\uDF19", scene: "Night shift break at the security post", desc: "Ansel is on night shift. During his break he watches a 10-minute video summary on his phone and completes the reflection exercise. His certificate is 3 weeks away.", bg: S.sky },
];

export default function HomePage({ setPage }) {
  var [openFaq, setOpenFaq] = useState(null);
  var [showTour, setShowTour] = useState(false);

  useEffect(function() {
    try { if (!localStorage.getItem("cts_tour_done")) setShowTour(true); } catch(e) {}
  }, []);

  var closeTour = function() { setShowTour(false); try { localStorage.setItem("cts_tour_done", "1"); } catch(e) {} };

  return (
    <div>
      {showTour && <SiteTour onClose={closeTour} setPage={setPage} />}

      {/* ══ HERO ══ */}
      <section style={{ background: S.navy, color: "#fff", position: "relative", overflow: "hidden", padding: "clamp(40px,5vw,64px) 0 clamp(32px,4vw,48px)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, " + S.coral + "12 0%, transparent 65%)" }} />
        <Container style={{ position: "relative", zIndex: 2, padding: "0 clamp(16px,3vw,48px)" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
            <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 80, height: 90, objectFit: "contain" }} width={80} height={90} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, lineHeight: 1.2 }}>CTS Empowerment &amp; Training Solutions</div>
              <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, fontFamily: S.body, marginTop: 4, textTransform: "uppercase" }}>Called To Serve — Excellence Through Service</div>
            </div>
          </div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: S.emerald + "25", border: "2px solid " + S.emerald + "60", borderRadius: 30, padding: "10px 24px", marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: S.emerald, boxShadow: "0 0 12px " + S.emerald, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, color: S.emerald, fontFamily: S.body, fontWeight: 800, letterSpacing: 1 }}>100% ONLINE &bull; SELF-PACED &bull; STUDY ANYTIME</span>
          </div>

          <h1 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4.5vw,50px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
            {"Jamaica's "}<span style={{ color: S.coral }}>Digital</span>{" Vocational School."}
          </h1>
          <p style={{ fontFamily: S.body, fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.9)", lineHeight: 1.8, marginBottom: 8, maxWidth: 560 }}>
            Study from your phone or laptop — at home, on the bus, or during your lunch break. No fixed timetable. You move through the material at your own speed, with online class days scheduled for assessment preparation.
          </p>
          <p style={{ fontFamily: S.body, fontSize: "clamp(13px,1.3vw,15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
            Assessments are conducted online unless otherwise needed. NCTVET assessment arranged through HEART/NSTA at no additional cost, unless required.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <Btn primary onClick={function() { setPage("Apply"); }} style={{ fontSize: 15, padding: "16px 36px", color: "#fff", background: S.coral }}>Apply Now — Join the Next Cohort</Btn>
            <Btn onClick={function() { setPage("Programmes"); }} style={{ border: "2px solid " + S.teal, color: S.teal, fontSize: 14 }}>View Programmes</Btn>
          </div>
          <button onClick={function() { setShowTour(true); }} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", fontWeight: 600, padding: 0 }}>{"🗺️ Take a Site Tour"}</button>
        </Container>
      </section>

      {/* ══ PRICING BAR — visible immediately below hero ══ */}
      <section style={{ background: "linear-gradient(135deg, " + S.coral + " 0%, " + S.gold + " 100%)", padding: "28px 0" }}>
        <Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h2 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", color: "#fff", fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>Start From Just J$10,000</h2>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, margin: 0 }}>$5,000 registration + training fee. Payment plans for Levels 3–5. Training professionals since 2018.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn primary onClick={function() { setPage("Fees & Calculator"); }} style={{ background: S.navy, color: "#fff", fontSize: 14, padding: "14px 28px" }}>View Pricing</Btn>
              <Btn onClick={function() { setPage("Apply"); }} style={{ border: "2px solid #fff", color: "#fff", fontSize: 14 }}>Apply Now</Btn>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ HOW OUR STUDENTS STUDY — 7 scenarios, bigger ══ */}
      <section style={{ background: S.navy, padding: "56px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Real Students. Real Schedules.</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,38px)", color: "#fff", margin: "10px 0 0", fontWeight: 700 }}>7 Ways Our Students <span style={{ color: S.coral }}>Actually Study</span></h2>
            <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 520, margin: "12px auto 0" }}>Self-paced means your regular studying fits around your life. You will be part of a cohort with scheduled assessment preparation days — given with advance notice.</p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="resp-grid-2">
            {SCENARIOS.map(function(s, i) {
              var isLast = i === SCENARIOS.length - 1;
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div style={{ display: "flex", gap: 18, padding: "22px 24px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", height: "100%", gridColumn: isLast ? "1 / -1" : undefined }}>
                    <div style={{ flexShrink: 0, textAlign: "center", minWidth: 60 }}>
                      <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 6 }}>{s.emoji}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: s.bg, fontFamily: S.body }}>{s.time}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: S.heading, marginBottom: 6 }}>{s.scene}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: S.body, lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══ PARTNER LOGOS ══ */}
      <section style={{ background: S.lightBg, borderBottom: "1px solid " + S.border }}><Container style={{ padding: "32px clamp(16px,3vw,48px)" }}><PartnerLogos /></Container></section>

      {/* ══ WHAT SELF-PACED MEANS ══ */}
      <section style={{ background: "#fff", padding: "56px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 11, color: S.emerald, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>How It Works</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>What Does "Self-Paced" <span style={{ color: S.coral }}>Actually Mean?</span></h2>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, maxWidth: 600, margin: "12px auto 0" }}>It means there is no fixed timetable for your regular studying. You decide when and where to learn. You are part of a cohort with scheduled online class days for internal assessment — leading to external NCTVET assessment. All dates are announced in advance.</p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="resp-grid-3">
            {[
              { icon: "\uD83D\uDCF1", title: "Your device is your classroom", desc: "Phone, tablet, or laptop — plus an internet connection. Every lesson, quiz, audio session, and study guide is available online 24/7.", color: S.teal },
              { icon: "\u23F0", title: "You choose when to study", desc: "5am before work? Lunch break? 11pm after the kids sleep? Study when your mind is sharpest — not when a timetable says.", color: S.coral },
              { icon: "\uD83D\uDCC8", title: "You move at your speed", desc: "Understand a topic quickly? Skip ahead. Struggling? Go back and repeat. No pressure to keep up with anyone else's pace.", color: S.violet },
              { icon: "\uD83C\uDFE2", title: "Keep your job. Keep your life.", desc: "No time off work needed. No childcare to arrange. No travel. Your studies fit around your life — not the other way around.", color: S.emerald },
              { icon: "\uD83C\uDFA7", title: "Listen like a podcast", desc: "Every lesson has an Audio Study Session. Plug in earphones on the bus, in the car, at the gym, or while cooking.", color: S.gold },
              { icon: "\uD83C\uDF93", title: "Same qualification", desc: "You earn the same nationally recognised NCTVET qualification. Your certificate says NVQ-J — just like any classroom student.", color: S.rose },
            ].map(function(card, i) {
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div style={{ background: S.lightBg, borderRadius: 16, padding: "24px 20px", border: "1px solid " + S.border, borderTop: "4px solid " + card.color, height: "100%" }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{card.icon}</div>
                    <h3 style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
                    <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.65, margin: 0 }}>{card.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══ CAREER OUTCOMES ══ */}
      <section style={{ background: S.lightBg, padding: "56px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 11, color: S.emerald, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Where Can This Take You?</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>Real Career Outcomes at Every Level</h2>
            <p style={{ fontFamily: S.body, fontSize: 12, color: S.grayLight, fontStyle: "italic", marginTop: 8 }}>Estimated salary ranges based on Jamaican labour market data (2025). Actual salaries vary by employer, experience, and location.</p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }} className="resp-grid-3">
            {Object.entries(CAREER_OUTCOMES).map(function(entry, i) {
              var level = entry[0], data = entry[1];
              var colors = [S.emerald, S.teal, S.violet, S.coral, S.rose];
              return (
                <Reveal key={level} delay={i * 0.06}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "22px 16px", border: "1px solid " + colors[i] + "25", borderTop: "3px solid " + colors[i], textAlign: "center", height: "100%" }}>
                    <div style={{ fontSize: 10, color: colors[i], letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>{level}</div>
                    <div style={{ fontFamily: S.heading, fontSize: 20, fontWeight: 800, color: S.navy, marginBottom: 6 }}>{data.salaryRange}</div>
                    <p style={{ fontFamily: S.body, fontSize: 11, color: S.gray, lineHeight: 1.5, margin: 0 }}>{data.outlook}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ background: "#fff", padding: "56px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 40 }}><span style={{ fontSize: 11, color: S.violet, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>What Our Learners Say</span><h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>Success Stories</h2></div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="resp-grid-3">
            {TESTIMONIALS.map(function(t, i) {
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{ background: S.lightBg, borderRadius: 16, padding: "28px 24px 24px", border: "1px solid " + S.border, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100%" }}>
                    <div style={{ position: "absolute", top: 16, right: 20, fontSize: 56, fontFamily: S.heading, color: t.color, opacity: 0.12, lineHeight: 1 }}>"</div>
                    <p style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.75, marginBottom: 22, fontStyle: "italic", flex: 1, position: "relative", zIndex: 1 }}>"{t.quote}"</p>
                    <div style={{ height: 1, background: "rgba(10,35,66,0.07)", marginBottom: 16 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: t.color, fontFamily: S.body, flexShrink: 0 }}>{t.initials}</div>
                      <div><div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.navy }}>{t.name}</div><div style={{ fontSize: 11, color: t.color, fontFamily: S.body, fontWeight: 600 }}>{t.level}</div></div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}><Btn primary onClick={function() { setPage("Apply"); }} style={{ color: "#fff", background: S.violet }}>Join Our Learners — Apply Now</Btn></div>
        </Container>
      </section>

      {/* ══ FAQ — top 6 ══ */}
      <section style={{ background: S.lightBg, padding: "56px 0" }}>
        <Container>
          <Reveal><div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 11, color: S.coral, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Common Questions</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: S.navy, margin: "10px 0 0", fontWeight: 700 }}>Got Questions? We've Got Answers.</h2>
          </div></Reveal>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {FAQS.slice(0, 6).map(function(faq, i) {
              var isOpen = openFaq === i;
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <button onClick={function() { setOpenFaq(isOpen ? null : i); }}
                    style={{ width: "100%", padding: "16px 20px", borderRadius: isOpen ? "12px 12px 0 0" : 12, border: "1px solid " + (isOpen ? S.coral + "40" : S.border), borderBottom: isOpen ? "none" : "1px solid " + S.border, background: isOpen ? S.coral : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", transition: "all 0.2s" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isOpen ? "#fff" : S.navy, fontFamily: S.body }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: isOpen ? "#fff" : S.gray, fontWeight: 700, flexShrink: 0, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                  </button>
                  {isOpen && <div style={{ padding: "18px 20px", background: "#fff", border: "1px solid " + S.coral + "40", borderTop: "none", borderRadius: "0 0 12px 12px", fontSize: 14, color: "#2D3748", fontFamily: S.body, lineHeight: 1.75 }}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Btn onClick={function() { setPage("FAQ"); }} style={{ border: "2px solid " + S.coral, color: S.coral, fontSize: 13 }}>View All FAQs</Btn>
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
