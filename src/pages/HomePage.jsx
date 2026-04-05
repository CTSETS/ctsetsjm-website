import React from "react";
import S from "../constants/styles";
import { SOCIAL_PROOF, TESTIMONIALS } from "../constants/content"; //
import { PROGRAMMES } from "../constants/programmes"; //
import { Container, PageWrapper, Btn, Reveal, PageScripture, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

export default function HomePage({ setPage }) {
  // Extract a few popular programmes to feature on the homepage
  const featuredProgrammes = [
    PROGRAMMES["Level 3 — Diploma"].find(p => p.name.includes("Business Administration")),
    PROGRAMMES["Level 2 — Vocational Certificates"].find(p => p.name.includes("Customer Service")),
    PROGRAMMES["Job / Professional Certificates"].find(p => p.name.includes("Basic Digital Literacy"))
  ].filter(Boolean);

  return (
    <PageWrapper bg={S.lightBg}>
      
      {/* ─── HERO SECTION ─── */}
      <div style={{ background: S.navy, position: "relative", overflow: "hidden", padding: "100px 20px 80px", textAlign: "center", borderBottom: `4px solid ${S.gold}` }}>
        {/* Subtle background pattern/overlay */}
        <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "120%", height: "200%", background: "radial-gradient(circle, rgba(196, 145, 18, 0.05) 0%, transparent 70%)", zIndex: 0 }}></div>
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-block", background: `${S.gold}20`, border: `1px solid ${S.gold}50`, color: S.goldLight, padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "24px" }}>
              Registered Institution • COJ No. 16007/2025
            </div>
            
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(40px, 8vw, 64px)", color: S.white, fontWeight: "800", lineHeight: "1.1", margin: "0 0 24px" }}>
              Your Career Advancement.<br />
              <span style={{ color: S.gold }}>100% On Your Terms.</span>
            </h1>
            
            <p style={{ fontFamily: S.body, fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,255,255,0.8)", lineHeight: "1.6", maxWidth: "700px", margin: "0 auto 40px" }}>
              Earn nationally recognised NCTVET qualifications from your phone. 
              No rigid class times. No campus visits. Study at your own pace with our Intelligent Study Assistant.
            </p>
            
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "16px", padding: "18px 40px", border: "none", boxShadow: `0 8px 24px ${S.coral}40` }}>
                Apply Now — Start Today
              </Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ fontSize: "16px", padding: "18px 40px", color: S.white, background: "transparent", border: `2px solid ${S.teal}` }}>
                Explore 28 Programmes
              </Btn>
            </div>
          </Reveal>
        </div>
      </div>

      <Container style={{ marginTop: "-30px", position: "relative", zIndex: 10 }}>
        {/* ─── SOCIAL PROOF STATS ─── */}
        <Reveal delay={0.2}>
          <div style={{ background: S.white, borderRadius: "16px", padding: "30px", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "20px", boxShadow: "0 10px 30px rgba(1,30,64,0.08)", border: `1px solid ${S.border}` }}>
            {[
              { label: "Active Since", value: SOCIAL_PROOF.enrolled, color: S.navy }, //
              { label: "Completion Rate", value: SOCIAL_PROOF.completionRate, color: S.emerald }, //
              { label: "Student Rating", value: SOCIAL_PROOF.satisfaction, color: S.gold }, //
              { label: "Global Reach", value: `${SOCIAL_PROOF.countries} Countries`, color: S.teal } //
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 20px" }}>
                <div style={{ fontFamily: S.heading, fontSize: "32px", fontWeight: "800", color: stat.color }}>{stat.value}</div>
                <div style={{ fontFamily: S.body, fontSize: "12px", color: S.gray, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ─── THE CTS ETS ADVANTAGE ─── */}
        <div style={{ padding: "80px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "12px", color: S.teal, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "700" }}>The CTS Advantage</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "36px", color: S.navy, fontWeight: "800", marginTop: "12px" }}>Why We Are Different</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            {[
              { icon: "📱", title: "Study Anywhere", desc: "No travel required. Access all learner guides, audio sessions, and quizzes directly from your smartphone or laptop.", color: S.sky },
              { icon: "🤖", title: "24/7 AI Tutor", desc: "Stuck at 2 AM? Our Intelligent Study Assistant is built directly into your classroom to explain complex topics instantly.", color: S.violet },
              { icon: "🏅", title: "NVQ-J Certified", desc: "We prepare you for the exact same NCTVET assessments as traditional institutions, opening doors worldwide.", color: S.emerald }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: S.white, padding: "40px 30px", borderRadius: "20px", border: `1px solid ${S.border}`, textAlign: "center", transition: "transform 0.3s", cursor: "default", height: "100%" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: `${feature.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px" }}>{feature.icon}</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: "20px", color: S.navy, fontWeight: "700", marginBottom: "12px" }}>{feature.title}</h3>
                  <p style={{ fontFamily: S.body, fontSize: "14px", color: S.gray, lineHeight: "1.7" }}>{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ─── FEATURED PROGRAMMES ─── */}
        <Reveal>
          <div style={{ background: S.navy, borderRadius: "24px", padding: "60px 40px", marginBottom: "80px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <h2 style={{ fontFamily: S.heading, fontSize: "32px", color: S.white, margin: "0 0 10px" }}>In-Demand Programmes</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: S.body, fontSize: "15px", margin: 0 }}>Fast-track your career with our most popular courses.</p>
              </div>
              <Btn onClick={() => setPage("Programmes")} style={{ background: "transparent", color: S.gold, border: `2px solid ${S.gold}`, padding: "12px 24px" }}>View All 28 Courses →</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {featuredProgrammes.map((prog, i) => (
                <div key={i} style={{ background: S.white, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
                  <div style={{ background: S.tealLight, color: S.tealDark, padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "800", textTransform: "uppercase", alignSelf: "flex-start", marginBottom: "12px" }}>Featured</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: "18px", color: S.navy, margin: "0 0 10px", lineHeight: "1.3" }}>{prog.name}</h3>
                  <p style={{ fontFamily: S.body, fontSize: "13px", color: S.gray, marginBottom: "20px", flex: 1 }}>{prog.desc}</p>
                  <Btn primary onClick={() => setPage("Apply")} style={{ width: "100%", background: S.navy, color: S.white, padding: "12px" }}>Apply Now</Btn>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        {/* ─── TESTIMONIALS ─── */}
        <div style={{ padding: "60px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontFamily: S.heading, fontSize: "36px", color: S.navy, fontWeight: "800" }}>Student Success Stories</h2>
          </div>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              <TestimonialCard t={TESTIMONIALS[2]} /> {/* Nadine - HR Manager */} {/* */}
              <TestimonialCard t={TESTIMONIALS[3]} /> {/* Simone - Single Mother */} {/* */}
            </div>
          </Reveal>
        </div>

        {/* ─── FINAL CTA ─── */}
        <Reveal>
          <div style={{ textAlign: "center", padding: "60px 20px", background: S.lightBg, borderRadius: "24px", border: `2px solid ${S.border}`, marginBottom: "40px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎓</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "32px", color: S.navy, fontWeight: "800", marginBottom: "16px" }}>Stop Waiting. Start Learning.</h2>
            <p style={{ fontFamily: S.body, fontSize: "16px", color: S.gray, marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
              Join hundreds of students advancing their careers through CTS ETS. Your application takes less than 10 minutes.
            </p>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "18px", padding: "18px 48px", border: "none", boxShadow: `0 8px 24px ${S.coral}40` }}>
              Start Your Application
            </Btn>
          </div>
        </Reveal>

        <PageScripture page="home" /> {/* */}
      </Container>
    </PageWrapper>
  );
}