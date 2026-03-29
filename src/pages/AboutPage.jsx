import S from "../constants/styles";
import { FOUNDER_PHOTO } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, TalkToGraduate } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";
import { TrustSection } from "../components/trust/TrustElements";

export default function AboutPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Our Story" title="Why CTS ETS Exists" desc="Founded to bring opportunity where it has been denied — to open doors for those told they are not enough." accentColor={S.violet} />
      <Container>
        {/* Founder's letter */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32, alignItems: "start", marginBottom: 48 }} className="resp-grid-2">
            <div style={{ textAlign: "center" }}>
              <img src={FOUNDER_PHOTO} alt="Lead Facilitator" style={{ width: 220, height: 280, objectFit: "cover", borderRadius: 14, boxShadow: "0 8px 32px rgba(1,30,64,0.15)" }} loading="lazy" width={220} height={280} />
              <div style={{ marginTop: 14 }}><div style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: S.navy }}>Lead Facilitator</div><div style={{ fontFamily: S.body, fontSize: 12, color: S.gray }}>CTS Empowerment & Training Solutions</div></div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: S.violet, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 10 }}>A Letter from Our Founder</div>
              <div style={{ fontFamily: S.body, fontSize: 15, color: "#2D3748", lineHeight: 1.85 }}>
                <p style={{ marginBottom: 16 }}>CTS ETS was born from a simple conviction: that every person — regardless of background, location, or circumstance — deserves the opportunity to earn a nationally and internationally recognised qualification.</p>
                <p style={{ marginBottom: 16 }}>Too many Jamaicans and Caribbean people are locked out of advancement. Not because they lack ability, but because they lack access. Traditional institutions are expensive, inflexible, and often out of reach for working adults, single parents, and people in rural communities.</p>
                <p style={{ marginBottom: 16 }}>We built CTS ETS to change that. Every programme is 100% online, self-paced, and priced to be genuinely accessible — from just J$10,000 (total). Our learner guides, audio study sessions, and intelligent study assistant are designed so you can study around your life, not the other way around.</p>
                <p style={{ marginBottom: 16 }}>Our name says it all: <strong>Called To Serve</strong>. This is not just a business — it is a mission. We believe that when one person gains a qualification, their whole family benefits. When one community is empowered, others follow.</p>
                <p>Welcome to CTS ETS. Your journey starts here.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* What CTS ETS stands for */}
        <Reveal>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px clamp(20px,4vw,36px)", border: "1px solid " + S.border, marginBottom: 40 }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>What CTS ETS Stands For</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="resp-grid-3">
              {[{ word: "Called", meaning: "We believe this work is a calling, not just a career.", color: S.violet },{ word: "To Serve", meaning: "Service to our students comes before everything else.", color: S.teal },{ word: "Empowerment", meaning: "We give people the tools to change their own lives.", color: S.coral },{ word: "Training", meaning: "Practical, applied skills — not just theory.", color: S.emerald },{ word: "Solutions", meaning: "We solve the access problem — online, affordable, flexible.", color: S.amber },{ word: "Excellence", meaning: "NCTVET and City & Guilds alignment means our standards are international.", color: S.sky }].map(v => (
                <div key={v.word} style={{ padding: "20px", borderRadius: 12, border: "1px solid " + v.color + "20", borderTop: "3px solid " + v.color }}>
                  <div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy, marginBottom: 6 }}>{v.word}</div>
                  <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, margin: 0 }}>{v.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Institutional structure */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40 }} className="resp-grid-3">
            {[{ num: "25", label: "Programmes", sub: "Job Cert to Bachelor's", color: S.coral },{ num: "5", label: "NVQ-J Levels", sub: "Nationally recognised", color: S.teal },{ num: "100%", label: "Online", sub: "Study from anywhere", color: S.violet }].map(s => (
              <div key={s.label} style={{ background: S.navy, borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: S.heading, fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: s.color }}>{s.num}</div>
                <div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 6 }}>{s.label}</div>
                <div style={{ fontFamily: S.body, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <PartnerLogos />
        <TalkToGraduate setPage={setPage} />
        <TrustSection />

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
          <Btn primary onClick={() => setPage("Programmes")} style={{ color: "#fff", background: S.teal }}>View Our Programmes</Btn>
          <Btn onClick={() => setPage("Contact")}>Contact Us</Btn>
        </div>
        <PageScripture page="about" />
      </Container>
    </PageWrapper>
  );
}
