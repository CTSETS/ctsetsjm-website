import React from "react";
import S from "../constants/styles";
import { SOCIAL_PROOF, TESTIMONIALS } from "../constants/content"; 
import { PROGRAMMES } from "../constants/programmes"; 
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
      
      {/* ─── 🚀 MODERN SPLIT HERO SECTION ─── */}
      <div style={{ background: S.navy, position: "relative", overflow: "hidden", padding: "120px 20px 100px", borderBottom: `4px solid ${S.gold}` }}>
        {/* Abstract Tech Grid Background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`, backgroundSize: "30px 30px", zIndex: 0 }}></div>
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px", justifyContent: "space-between" }}>
            
            {/* Left Column: Text & CTA */}
            <div style={{ flex: "1 1 500px", textAlign: "left" }}>
              <Reveal>
                
                {/* 🚨 BIG SPLASH ANNOUNCEMENT BANNER 🚨 */}
                <div style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  background: `linear-gradient(90deg, ${S.coral}, #FF6B6B)`, 
                  color: S.white, 
                  padding: "10px 24px", 
                  borderRadius: "30px", 
                  fontSize: "14px", 
                  fontWeight: "800", 
                  letterSpacing: "1.5px", 
                  textTransform: "uppercase", 
                  marginBottom: "20px",
                  boxShadow: `0 0 24px ${S.coral}60`,
                  border: "1px solid rgba(255,255,255,0.4)"
                }}>
                  <span style={{ fontSize: "18px" }}>🔥</span> 
                  Spring Cohort: Classes Begin April 13, 2026
                </div>
                <br/>

                <div style={{ display: "inline-block", background: `linear-gradient(90deg, ${S.gold}20, transparent)`, borderLeft: `3px solid ${S.gold}`, color: S.goldLight, padding: "8px 16px", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px" }}>
                  Registered Institution • COJ No. 16007/2025
                </div>
                
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(46px, 6vw, 64px)", color: S.white, fontWeight: "800", lineHeight: "1.1", margin: "0 0 24px" }}>
                  Your Career Advancement.<br />
                  {/* Modern Gradient Text */}
                  <span style={{ background: `linear-gradient(90deg, ${S.gold}, #FDE08B)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    100% On Your Terms.
                  </span>
                </h1>
                
                <p style={{ fontFamily: S.body, fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.8)", lineHeight: "1.6", maxWidth: "600px", margin: "0 0 40px" }}>
                  Earn nationally recognised NCTVET qualifications directly from your smartphone. 
                  No rigid class times. No campus visits. Study with our elite AI Assistant.
                </p>
                
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "16px", padding: "18px 40px", border: "none", boxShadow: `0 8px 24px ${S.coral}50`, borderRadius: "30px" }}>
                    Apply Now — Secure Your Spot
                  </Btn>
                  <Btn onClick={() => setPage("Programmes")} style={{ fontSize: "16px", padding: "18px 40px", color: S.white, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.2)`, borderRadius: "30px", backdropFilter: "blur(10px)" }}>
                    Explore 28 Programmes
                  </Btn>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Hero Image & Glassmorphism Badges */}
            <div style={{ flex: "1 1 400px", position: "relative" }}>
              <Reveal delay={0.2}>
                <div style={{ position: "relative" }}>
                  {/* Main Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Digital Learner" 
                    style={{ width: "100%", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", objectFit: "cover", height: "450px" }}
                  />
                  
                  {/* Floating Glass Badge 1 - AI */}
                  <div style={{ position: "absolute", top: "30px", right: "-20px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "12px 20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
                    <span style={{ fontSize: "24px" }}>🤖</span>
                    <div>
                      <div style={{ color: S.white, fontSize: "12px", fontFamily: S.body, fontWeight: "800" }}>24/7 AI Tutor</div>
                      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>Built into your portal</div>
                    </div>
                  </div>

                  {/* Floating Glass Badge 2 - PWA */}
                  <div style={{ position: "absolute", bottom: "40px", left: "-30px", background: "rgba(1, 30, 64, 0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "16px", borderRadius: "16px", border: `1px solid ${S.teal}`, display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                    <span style={{ fontSize: "28px" }}>📱</span>
                    <div>
                      <div style={{ color: S.gold, fontSize: "14px", fontFamily: S.heading, fontWeight: "800" }}>Mobile Campus</div>
                      <div style={{ color: S.white, fontSize: "11px", fontFamily: S.body }}>Learn anywhere, anytime.</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </div>

      <Container style={{ marginTop: "-40px", position: "relative", zIndex: 10 }}>
        {/* ─── SOCIAL PROOF STATS ─── */}
        <Reveal delay={0.3}>
          <div style={{ background: S.white, borderRadius: "20px", padding: "35px", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "20px", boxShadow: "0 15px 35px rgba(1,30,64,0.06)", border: `1px solid ${S.border}` }}>
            {[
              { label: "Active Since", value: SOCIAL_PROOF.enrolled, color: S.navy },
              { label: "Completion Rate", value: SOCIAL_PROOF.completionRate, color: S.emerald },
              { label: "Student Rating", value: SOCIAL_PROOF.satisfaction, color: S.gold },
              { label: "Global Reach", value: `${SOCIAL_PROOF.countries} Countries`, color: S.teal }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 20px" }}>
                <div style={{ fontFamily: S.heading, fontSize: "36px", fontWeight: "800", color: stat.color }}>{stat.value}</div>
                <div style={{ fontFamily: S.body, fontSize: "13px", color: S.gray, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700", marginTop: "8px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ─── THE CTS ETS ADVANTAGE ─── */}
        <div style={{ padding: "100px 0 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{ display: "inline-block", padding: "6px 16px", background: `${S.teal}15`, color: S.tealDark, borderRadius: "20px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>The Digital Advantage</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "40px", color: S.navy, fontWeight: "800", margin: "0" }}>Education Redesigned for You</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            {[
              { icon: "📱", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", title: "Study Anywhere", desc: "Access all learner guides, audio sessions, and interactive quizzes directly from your smartphone's home screen.", color: S.sky },
              { icon: "🤖", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", title: "24/7 AI Tutor", desc: "Stuck at 2 AM? Our Intelligent Study Assistant is built right into your classroom to explain complex topics instantly.", color: S.violet },
              { icon: "🏅", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", title: "NVQ-J Certified", desc: "We prepare you for the exact same NCTVET assessments as traditional institutions, opening doors globally.", color: S.emerald }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: S.white, borderRadius: "24px", overflow: "hidden", border: `1px solid ${S.border}`, transition: "all 0.3s ease", boxShadow: "0 10px 20px rgba(0,0,0,0.03)", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.03)"; }}>
                  <div style={{ height: "160px", backgroundImage: `url(${feature.img})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                    {/* Dark overlay */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(1,30,64,0.8), transparent)" }}></div>
                    <div style={{ position: "absolute", bottom: "-24px", left: "24px", width: "56px", height: "56px", borderRadius: "16px", background: S.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>{feature.icon}</div>
                  </div>
                  <div style={{ padding: "40px 30px 30px", flex: 1 }}>
                    <h3 style={{ fontFamily: S.heading, fontSize: "22px", color: S.navy, fontWeight: "800", marginBottom: "12px" }}>{feature.title}</h3>
                    <p style={{ fontFamily: S.body, fontSize: "15px", color: S.gray, lineHeight: "1.6", margin: 0 }}>{feature.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ─── FEATURED PROGRAMMES ─── */}
        <Reveal>
          <div style={{ background: `linear-gradient(135deg, ${S.navy} 0%, #022a5a 100%)`, borderRadius: "32px", padding: "80px 40px", marginBottom: "80px", position: "relative", overflow: "hidden" }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>
            <div style={{ position: "absolute", bottom: "-80px", left: "20px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px", flexWrap: "wrap", gap: "20px", position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: "500px" }}>
                <h2 style={{ fontFamily: S.heading, fontSize: "36px", color: S.white, margin: "0 0 16px" }}>In-Demand Programmes</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: S.body, fontSize: "16px", margin: 0, lineHeight: "1.6" }}>Fast-track your career with our most popular NCTVET-aligned courses. Study at your own pace, on your own terms.</p>
              </div>
              <Btn onClick={() => setPage("Programmes")} style={{ background: "rgba(255,255,255,0.1)", color: S.white, border: `1px solid rgba(255,255,255,0.3)`, padding: "14px 28px", borderRadius: "30px", backdropFilter: "blur(5px)" }}>View All 28 Courses →</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", position: "relative", zIndex: 1 }}>
              {featuredProgrammes.map((prog, i) => (
                <div key={i} style={{ background: S.white, borderRadius: "20px", padding: "30px", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                  <div style={{ background: `${S.teal}15`, color: S.tealDark, padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", alignSelf: "flex-start", marginBottom: "16px", letterSpacing: "1px" }}>Featured Course</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: "20px", color: S.navy, margin: "0 0 12px", lineHeight: "1.3" }}>{prog.name}</h3>
                  <p style={{ fontFamily: S.body, fontSize: "14px", color: S.gray, marginBottom: "24px", flex: 1, lineHeight: "1.6" }}>{prog.desc}</p>
                  <Btn primary onClick={() => setPage("Apply")} style={{ width: "100%", background: S.navy, color: S.white, padding: "14px", borderRadius: "12px" }}>Apply Now</Btn>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <PartnerLogos />

        {/* ─── TESTIMONIALS ─── */}
        <div style={{ padding: "80px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ display: "inline-block", padding: "6px 16px", background: `${S.gold}20`, color: S.goldDark, borderRadius: "20px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>Real Results</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "40px", color: S.navy, fontWeight: "800" }}>Student Success Stories</h2>
          </div>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
              <TestimonialCard t={TESTIMONIALS[2]} /> 
              <TestimonialCard t={TESTIMONIALS[3]} /> 
            </div>
          </Reveal>
        </div>

        {/* ─── FINAL CTA WITH IMAGE BACKGROUND ─── */}
        <Reveal>
          <div style={{ position: "relative", borderRadius: "32px", overflow: "hidden", marginBottom: "60px", boxShadow: "0 20px 40px rgba(1,30,64,0.1)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)", backgroundSize: "cover", backgroundPosition: "center" }}></div>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${S.navy} 40%, rgba(1,30,64,0.8) 100%)` }}></div>
            
            <div style={{ position: "relative", zIndex: 1, padding: "80px 60px", textAlign: "left", maxWidth: "700px" }}>
              <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎓</div>
              <h2 style={{ fontFamily: S.heading, fontSize: "40px", color: S.white, fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>Classes Begin April 13, 2026.<br/>Secure Your Spot Today.</h2>
              <p style={{ fontFamily: S.body, fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "40px", lineHeight: "1.6" }}>
                Join hundreds of students advancing their careers through our digital campus. Your application takes less than 10 minutes.
              </p>
              <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, fontSize: "18px", padding: "18px 48px", border: "none", boxShadow: `0 8px 24px rgba(0,0,0,0.2)`, borderRadius: "30px", fontWeight: "800" }}>
                Start Your Application
              </Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="home" /> 
      </Container>
    </PageWrapper>
  );
}