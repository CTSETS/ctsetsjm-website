import React from "react";
import S from "../constants/styles";
import { SOCIAL_PROOF, TESTIMONIALS } from "../constants/content"; 
import { Container, PageWrapper, Btn, Reveal, PageScripture, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

export default function HomePage({ setPage }) {

  // Contextualized Faculties & Subject Areas
  const DISCIPLINES = [
    "Business Administration", "Customer Service", "Information Technology",
    "Digital Literacy", "Data Operations", "Leadership & Management", 
    "Allied Health", "Accounting & Finance"
  ];

  // The 5 NCTVET Levels mapped from ProgrammesPage.jsx
  const PATHWAYS = [
    { id: "cert", level: "Job Certificates", tag: "Entry Level", desc: "Fast-track your entry into the workforce with foundational digital and professional skills.", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.emerald },
    { id: "l2", level: "Level 2", tag: "Vocational Certificates", desc: "Industry-standard qualifications to solidify your expertise in Customer Service, Data Operations, and more.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.teal },
    { id: "l3", level: "Level 3", tag: "Diploma Equivalent", desc: "Advanced training for supervisors and team leaders in Business and Administration.", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.violet },
    { id: "l4", level: "Level 4", tag: "Associate Equivalent", desc: "Strategic management and advanced technical competencies for departmental leadership.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.coral },
    { id: "l5", level: "Level 5", tag: "Bachelor's Equivalent", desc: "Top-tier executive qualifications for directors and senior leaders shaping organizational strategy.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.rose }
  ];

  return (
    <PageWrapper bg={S.lightBg}>
      
      {/* ─── 🏆 TOP STATS BANNER ─── */}
      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: "12px 0", zIndex: 50, position: "relative" }}>
        <Container>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "15px", alignItems: "center" }}>
            {[
              { label: "Facilitating Learning", value: "Since 2018", color: S.navy },
              { label: "Completion Rate", value: "94%", color: S.emerald },
              { label: "Student Rating", value: "4.8/5", color: S.goldDark },
              { label: "Global Reach", value: "9 Countries", color: S.teal }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: S.heading, fontSize: "22px", fontWeight: "800", color: stat.color, lineHeight: "1.2" }}>{stat.value}</div>
                <div style={{ fontFamily: S.body, fontSize: "10px", color: S.gray, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ─── 🚀 EXECUTIVE GATEWAY HERO ─── */}
      <div style={{ background: S.navy, position: "relative", overflow: "hidden", padding: "80px 20px 100px", borderBottom: `4px solid ${S.gold}` }}>
        {/* Abstract Tech Map Background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15, zIndex: 0 }}></div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(1, 30, 64, 1) 30%, rgba(1, 30, 64, 0.6) 100%)", zIndex: 0 }}></div>
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px", justifyContent: "space-between" }}>
            
            {/* Left Column: Text & CTA */}
            <div style={{ flex: "1 1 500px", textAlign: "left" }}>
              <Reveal>
                
                {/* 🚨 SPRING COHORT BANNER */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: `linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent)`, border: "1px solid rgba(255,255,255,0.3)", color: S.white, padding: "8px 20px", borderRadius: "30px", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "24px", backdropFilter: "blur(10px)" }}>
                  <span style={{ fontSize: "16px" }}>🗓️</span> 
                  Spring Cohort: Classes Begin April 15, 2026
                </div>
                
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(40px, 5.5vw, 60px)", color: S.white, fontWeight: "800", lineHeight: "1.1", margin: "0 0 20px" }}>
                  An Executive International Gateway.<br />
                  <span style={{ color: S.gold }}>Elevate Your Career.</span>
                </h1>
                
                <p style={{ fontFamily: S.body, fontSize: "clamp(16px, 2vw, 18px)", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", maxWidth: "600px", margin: "0 0 30px" }}>
                  Earn <strong>internationally recognised NCTVET qualifications</strong> directly from your mobile, tablet, or desktop. Access a borderless digital campus without rigid class times. Learn at your own pace with our advanced AI study assistant.
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

            {/* Right Column: Dynamic Image Grid */}
            <div style={{ flex: "1 1 450px", position: "relative" }}>
              <Reveal delay={0.2}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", position: "relative" }}>
                  
                  {/* Image 1 - VR/Tech */}
                  <div style={{ borderRadius: "20px", overflow: "hidden", height: "240px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: "translateY(20px)" }}>
                    <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Advanced Learning" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", padding: "6px 12px", borderRadius: "8px", color: "#fff", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🇯🇲</span> Kingston, Jamaica
                    </div>
                  </div>

                  {/* Image 2 - Professional Business */}
                  <div style={{ borderRadius: "20px", overflow: "hidden", height: "240px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: "translateY(-20px)" }}>
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Executive Leadership" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", padding: "6px 12px", borderRadius: "8px", color: "#fff", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🇳🇬</span> Lagos, Nigeria
                    </div>
                  </div>

                  {/* Center Glass Badge */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(1, 30, 64, 0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "16px 24px", borderRadius: "16px", border: `1px solid ${S.gold}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", zIndex: 10, width: "220px", textAlign: "center" }}>
                    <span style={{ fontSize: "24px" }}>🌍</span>
                    <div style={{ color: S.gold, fontSize: "14px", fontFamily: S.heading, fontWeight: "800", lineHeight: "1.2" }}>Internationally Recognised</div>
                    <div style={{ color: S.white, fontSize: "11px", fontFamily: S.body }}>NCTVET & City & Guilds Aligned</div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </div>

      <Container style={{ position: "relative", zIndex: 10 }}>

        {/* ─── 📚 ACADEMIC PATHWAYS & FACULTIES (NEW SECTION) ─── */}
        <div style={{ padding: "80px 0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ display: "inline-block", padding: "6px 16px", background: `${S.violet}15`, color: S.violet, borderRadius: "20px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>Our Faculties</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "38px", color: S.navy, fontWeight: "800", margin: "0 0 16px" }}>Comprehensive Academic Pathways</h2>
            <p style={{ fontFamily: S.body, fontSize: "16px", color: S.gray, maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
              From foundational job certificates to executive Bachelor's equivalents, our NCTVET-aligned framework maps directly to your career trajectory.
            </p>
          </div>

          {/* Subject Areas Cloud */}
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "50px", maxWidth: "900px", margin: "0 auto 50px" }}>
              {DISCIPLINES.map((subject, i) => (
                <div key={i} style={{ background: S.white, border: `1px solid ${S.border}`, padding: "10px 20px", borderRadius: "30px", fontSize: "13px", fontFamily: S.body, color: S.navy, fontWeight: "600", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                  {subject}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Level Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {PATHWAYS.map((pathway, i) => (
              <Reveal key={pathway.id} delay={i * 0.1}>
                <div 
                  onClick={() => setPage("Programmes")}
                  style={{ 
                    background: S.navy, 
                    borderRadius: "24px", 
                    overflow: "hidden", 
                    position: "relative", 
                    height: "320px", 
                    cursor: "pointer", 
                    boxShadow: "0 15px 35px rgba(1,30,64,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 25px 45px rgba(1,30,64,0.2)"; }} 
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(1,30,64,0.1)"; }}
                >
                  <img src={pathway.img} alt={pathway.level} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transition: "opacity 0.3s" }} />
                  
                  {/* Gradient Overlay */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 20%, rgba(1,30,64,0.95) 100%)` }}></div>
                  
                  {/* Content */}
                  <div style={{ position: "absolute", inset: 0, padding: "30px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    
                    {/* Top Pill */}
                    <div style={{ alignSelf: "flex-start", background: pathway.color, color: "#fff", padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                      {pathway.tag}
                    </div>

                    {/* Bottom Text */}
                    <div>
                      <h3 style={{ fontFamily: S.heading, fontSize: "26px", color: S.white, fontWeight: "800", margin: "0 0 10px" }}>{pathway.level}</h3>
                      <p style={{ fontFamily: S.body, fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: "0 0 16px", lineHeight: "1.5" }}>{pathway.desc}</p>
                      <div style={{ color: pathway.color, fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                        Explore Level <span>→</span>
                      </div>
                    </div>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ─── THE CTS ETS ADVANTAGE ─── */}
        <div style={{ padding: "60px 0 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{ display: "inline-block", padding: "6px 16px", background: `${S.teal}15`, color: S.tealDark, borderRadius: "20px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>The Digital Advantage</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "38px", color: S.navy, fontWeight: "800", margin: "0" }}>Education Redesigned for You</h2>
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

        <PartnerLogos />

        {/* ─── TESTIMONIALS ─── */}
        <div style={{ padding: "80px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ display: "inline-block", padding: "6px 16px", background: `${S.gold}20`, color: S.goldDark, borderRadius: "20px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "16px" }}>Real Results</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "38px", color: S.navy, fontWeight: "800" }}>Student Success Stories</h2>
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
              <h2 style={{ fontFamily: S.heading, fontSize: "40px", color: S.white, fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>Classes Begin April 15, 2026.<br/>Secure Your Spot Today.</h2>
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