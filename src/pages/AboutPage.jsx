import React from "react";
import S from "../constants/styles";
import { FOUNDER_PHOTO } from "../constants/config"; //
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";
import { TrustSection } from "../components/trust/TrustElements"; //

export default function AboutPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      {/* ─── EDITORIAL HEADER ─── */}
      <div style={{ background: S.navy, padding: "80px 20px", textAlign: "center", borderBottom: `4px solid ${S.gold}` }}>
        <h4 style={{ color: S.teal, letterSpacing: "4px", textTransform: "uppercase", fontSize: "12px", fontWeight: "700", marginBottom: "16px", fontFamily: S.body }}>Our Story</h4>
        <h1 style={{ color: S.white, fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 56px)", margin: "0 auto 20px", maxWidth: "800px", lineHeight: "1.1" }}>
          Why CTS ETS Exists
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6", fontStyle: "italic", fontFamily: S.heading }}>
          "Founded to bring opportunity where it has been denied — to open doors for those told they are not enough."
        </p>
      </div>

      <Container style={{ marginTop: "-40px" }}>
        
        {/* ─── THE FOUNDER'S FEATURE ─── */}
        <Reveal>
          <div style={{ background: S.white, borderRadius: "2px", padding: "clamp(30px, 6vw, 80px)", boxShadow: "0 20px 40px rgba(1,30,64,0.06)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", alignItems: "start", marginBottom: "80px" }}>
            
            {/* Left: Editorial Portrait */}
            <div style={{ position: "relative", margin: "0 auto", width: "100%", maxWidth: "340px" }}>
              <div style={{ position: "absolute", top: "20px", left: "-20px", width: "100%", height: "100%", border: `2px solid ${S.gold}`, zIndex: 0 }}></div>
              <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "60%", height: "40%", background: S.navy, zIndex: 0 }}></div>
              <img 
                src={FOUNDER_PHOTO} 
                alt="Lead Facilitator" 
                style={{ position: "relative", width: "100%", height: "auto", objectFit: "cover", zIndex: 1, filter: "contrast(1.05) saturate(1.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} 
                loading="lazy" 
              />
              <div style={{ position: "relative", zIndex: 2, marginTop: "24px", paddingLeft: "10px", borderLeft: `3px solid ${S.teal}` }}>
                <div style={{ fontFamily: S.heading, fontSize: "18px", fontWeight: "800", color: S.navy, textTransform: "uppercase", letterSpacing: "1px" }}>Mark O. Lindo, Ph.D</div>
                <div style={{ fontFamily: S.body, fontSize: "13px", color: S.gray, marginTop: "4px" }}>Lead Facilitator, CTS ETS</div>
              </div>
            </div>

            {/* Right: The Letter */}
            <div style={{ maxWidth: "540px" }}>
              <h2 style={{ fontFamily: S.heading, fontSize: "32px", color: S.navy, fontWeight: "700", marginBottom: "32px", lineHeight: "1.2" }}>A Letter from Our Founder</h2>
              
              <div style={{ fontFamily: S.body, fontSize: "16px", color: "#334155", lineHeight: "1.9" }}>
                <p style={{ marginBottom: "24px" }}>
                  <span style={{ float: "left", fontSize: "64px", lineHeight: "50px", paddingRight: "12px", color: S.gold, fontFamily: S.heading, fontWeight: "800", marginTop: "6px" }}>C</span>
                  TS ETS was born from a simple conviction: that every person — regardless of background, location, or circumstance — deserves the opportunity to earn a nationally and internationally recognised qualification.
                </p>
                <p style={{ marginBottom: "24px" }}>
                  Too many Jamaicans and Caribbean people are locked out of advancement. Not because they lack ability, but because they lack access. Traditional institutions are expensive, inflexible, and often out of reach for working adults, single parents, and people in rural communities.
                </p>

                {/* Editorial Pull Quote */}
                <blockquote style={{ margin: "40px 0", padding: "30px", borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: "24px", color: S.teal, marginBottom: "16px" }}>"</div>
                  <p style={{ fontFamily: S.heading, fontSize: "24px", color: S.navy, lineHeight: "1.4", margin: 0, fontStyle: "italic", fontWeight: "600" }}>
                    Our name says it all: Called To Serve. This is not just a business — it is a mission.
                  </p>
                </blockquote>

                <p style={{ marginBottom: "24px" }}>
                  We built CTS ETS to change that. Every programme is 100% online, self-paced, and priced to be genuinely accessible — from just J$10,000 (total). Our learner guides, audio study sessions, and intelligent study assistant are designed so you can study around your life, not the other way around.
                </p>
                <p style={{ marginBottom: "24px" }}>
                  We believe that when one person gains a qualification, their whole family benefits. When one community is empowered, others follow.
                </p>
                <p style={{ fontWeight: "700", color: S.navy, fontSize: "18px", marginTop: "32px", fontFamily: S.heading }}>
                  Welcome to CTS ETS. Your journey starts here.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ─── WHAT WE STAND FOR (Magazine Grid) ─── */}
        <Reveal>
          <div style={{ marginBottom: "80px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ fontSize: "12px", color: S.gray, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "700" }}>Our Core Values</span>
              <h3 style={{ fontFamily: S.heading, fontSize: "36px", color: S.navy, fontWeight: "700", marginTop: "12px" }}>What CTS ETS Stands For</h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {[
                { word: "Called", meaning: "We believe this work is a calling, not just a career.", color: S.violet },
                { word: "To", meaning: "Every decision is directed toward our students' success.", color: S.teal },
                { word: "Serve", meaning: "Service to our students comes before everything else.", color: S.coral },
                { word: "Excellence", meaning: "NCTVET alignment means our standards are nationally recognised.", color: S.emerald },
                { word: "Through", meaning: "We deliver results through technology, innovation, and care.", color: S.amber },
                { word: "Service", meaning: "Everything we build serves one purpose — your success.", color: S.sky },
              ].map((v, i) => (
                <div key={i} style={{ padding: "40px 30px", background: S.white, border: `1px solid ${S.border}`, borderTop: `4px solid ${v.color}`, transition: "transform 0.3s, box-shadow 0.3s", cursor: "default" }} onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 15px 30px ${v.color}15`;}} onMouseLeave={(e) => {e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none";}}>
                  <div style={{ fontFamily: S.heading, fontSize: "28px", fontWeight: "800", color: S.navy, marginBottom: "12px" }}>{v.word}</div>
                  <p style={{ fontFamily: S.body, fontSize: "15px", color: S.gray, lineHeight: "1.6", margin: 0 }}>{v.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ─── INSTITUTIONAL STATS ─── */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2px", background: S.border, border: `1px solid ${S.border}`, marginBottom: "80px", borderRadius: "16px", overflow: "hidden" }}>
            {[
              { num: "28", label: "Programmes", sub: "Job Cert to Bachelor's Equiv.", color: S.coral },
              { num: "5", label: "NVQ-J Levels", sub: "Nationally recognised", color: S.teal },
              { num: "100%", label: "Online", sub: "Study from anywhere", color: S.violet }
            ].map((s, i) => (
              <div key={i} style={{ background: S.white, padding: "50px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: S.heading, fontSize: "56px", fontWeight: "800", color: s.color, lineHeight: "1" }}>{s.num}</div>
                <div style={{ fontFamily: S.body, fontSize: "16px", fontWeight: "800", color: S.navy, marginTop: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                <div style={{ fontFamily: S.body, fontSize: "14px", color: S.gray, marginTop: "8px" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <PartnerLogos />
        <TrustSection />

        {/* ─── FOOTER CTA ─── */}
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "60px", flexWrap: "wrap", paddingBottom: "40px" }}>
            <Btn primary onClick={() => setPage("Programmes")} style={{ color: S.white, background: S.teal, fontSize: "16px", padding: "16px 32px", border: "none" }}>View Our Programmes</Btn>
            <Btn onClick={() => setPage("Contact")} style={{ fontSize: "16px", padding: "16px 32px", color: S.navy, background: "transparent", border: `2px solid ${S.navy}` }}>Contact Us</Btn>
          </div>
        </Reveal>

        <PageScripture page="about" />
      </Container>
    </PageWrapper>
  );
}