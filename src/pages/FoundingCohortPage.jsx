import S from "../constants/styles";
import { FOUNDING_COHORT, FOUNDING_SPOTS, CAREER_OUTCOMES } from "../constants/programmes";
import { USD_RATE } from "../constants/config";
import { TESTIMONIALS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { CountdownTimer, WhatsAppShare, DualPrice } from "../components/shared/DisplayComponents";
import { trackFoundingCTAClicked } from "../utils/analytics";

export default function FoundingCohortPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Be Among the First" title="Save Up to $10,000 as a Founding Student" desc="Registration free + $5,000 off tuition at Level 3+. Only 15 spots per programme." accentColor={S.coral} />
      <Container>
        <SocialProofBar />
        {/* Countdown + spots */}
        <Reveal>
          <div style={{ background: S.navy, borderRadius: 16, padding: "32px clamp(20px,4vw,40px)", textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: S.emerald, animation: "pulse 2s infinite" }} /><span style={{ fontSize: 12, fontWeight: 700, color: S.emerald, fontFamily: S.body, letterSpacing: 2, textTransform: "uppercase" }}>Founding Cohort — Limited</span></div>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3.5vw,36px)", color: "#fff", fontWeight: 800, marginBottom: 8 }}>Only <span style={{ color: S.coral }}>{FOUNDING_SPOTS} spots</span> per programme</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>Founding intake closes when spots fill. Enrol early to secure your price.</p>
            <CountdownTimer targetDate="2026-04-06T09:00:00" />
          </div>
        </Reveal>

        {/* What you get */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40 }} className="resp-grid-3">
            {[{ icon: "🎁", title: "Registration Free", desc: "J$5,000 registration fee waived for first 15 students.", color: S.emerald },{ icon: "💰", title: "$5,000 Off Tuition", desc: "Level 3 and above get an additional J$5,000 off tuition.", color: S.coral },{ icon: "🤝", title: "5% Referral Bonus", desc: "Refer a friend who enrols — get 5% of their tuition as credit.", color: S.violet }].map(b => (
              <div key={b.title} style={{ background: "#fff", borderRadius: 14, padding: "28px 20px", border: "1px solid " + b.color + "20", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{b.icon}</div>
                <h4 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, fontWeight: 700, marginBottom: 8 }}>{b.title}</h4>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Pricing tables by level */}
        {FOUNDING_COHORT.map((group, gi) => {
          const levelKey = group.level.includes("Job") ? "Job Certificate" : group.level.split(" —")[0];
          const color = S.levelColors[levelKey] || S.navy;
          return (
            <Reveal key={group.level} delay={gi * 0.08}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: color }} />
                  <h4 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, margin: 0 }}>{group.level}</h4>
                </div>
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid " + S.border }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 80px", padding: "12px 16px", background: S.navy, gap: 8 }} className="prog-row">
                    {["Programme","Standard","Founding","You Save",""].map(h => <span key={h} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, textAlign: h === "Programme" ? "left" : "center" }}>{h}</span>)}
                  </div>
                  {group.programmes.map((p, i) => (
                    <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 80px", padding: "12px 16px", background: i % 2 === 0 ? "#fff" : S.lightBg, borderBottom: "1px solid " + S.border, gap: 8, alignItems: "center" }} className="prog-row">
                      <div><span style={{ fontSize: 13, color: S.navy, fontFamily: S.body, fontWeight: 500 }}>{p.name}</span>{p.popular && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: S.coral + "15", color: S.coral, fontFamily: S.body, marginLeft: 6 }}>🔥</span>}</div>
                      <span style={{ textAlign: "center", fontSize: 12, color: S.gray, fontFamily: S.body, textDecoration: "line-through" }}>{p.total}</span>
                      <span style={{ textAlign: "center" }}><DualPrice amount={p.foundingTuition} size={12} /></span>
                      <span style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: S.emerald, fontFamily: S.body }}>Save {new Intl.NumberFormat().format(p.saving)}</span>
                      <div style={{ textAlign: "center" }}><button onClick={() => { trackFoundingCTAClicked(p.name); setPage("Apply"); }} style={{ padding: "6px 14px", borderRadius: 6, background: color, color: "#fff", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Apply</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}

        {/* Referral section */}
        <Reveal>
          <div style={{ background: S.violetLight, borderRadius: 16, padding: "32px clamp(20px,4vw,36px)", border: "1px solid " + S.violet + "30", marginTop: 16, marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 48 }}>🤝</div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 700, marginBottom: 6 }}>Earn 5% Referral Credit</h3>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7 }}>Share your unique referral code with friends. When they enrol, you get <strong>5% of their tuition</strong> as credit toward your next programme or a cash discount. No limits on how many people you can refer.</p>
              </div>
              <WhatsAppShare text="I'm enrolled at CTS ETS as a founding student! 🎓 Registration is free for the first 15 students + $5,000 off at Level 3+. Check it out: https://ctsetsjm.com/#founding-cohort" label="Share With Friends" />
            </div>
          </div>
        </Reveal>

        <TestimonialCard t={TESTIMONIALS[3]} />

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
          <Btn primary onClick={() => { trackFoundingCTAClicked("bottom-cta"); setPage("Apply"); }} style={{ color: "#fff", background: S.coral, fontSize: 15, padding: "16px 36px" }}>Claim Your Founding Spot</Btn>
          <Btn onClick={() => setPage("Fees & Calculator")}>Compare Standard Fees</Btn>
        </div>
        <PageScripture page="founding" />
      </Container>
    </PageWrapper>
  );
}
