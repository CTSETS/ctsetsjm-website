import React from "react";
import S from "../constants/styles";
import { SOCIAL_PROOF, TESTIMONIALS } from "../constants/content"; 
import { Container, PageWrapper, Btn, Reveal, PageScripture, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

export default function HomePage({ setPage }) {

  // Contextualized Faculties & Subject Areas (Removed Allied Health)
  const DISCIPLINES = [
    "Business Administration", "Customer Service", "Information Technology",
    "Digital Literacy", "Data Operations", "Leadership & Management", 
    "Accounting & Finance"
  ];

  // The 5 NCTVET Levels mapped from ProgrammesPage.jsx
  const PATHWAYS = [
    { id: "cert", level: "Job Certificates", tag: "Entry Level", desc: "Fast-track your entry into the workforce with foundational digital and professional skills.", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.emerald },
    { id: "l2", level: "Level 2", tag: "Vocational Certificates", desc: "Industry-standard qualifications to solidify your expertise in Customer Service, Data Operations, and more.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.teal },
    { id: "l3", level: "Level 3", tag: "Diploma Equivalent", desc: "Advanced training for supervisors and team leaders in Business and Administration.", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.violet },
    { id: "l4", level: "Level 4", tag: "Associate Equivalent", desc: "Strategic management and advanced technical competencies for departmental leadership.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.coral },
    { id: "l5", level: "Level 5", tag: "Bachelor's Equivalent", desc: "Top-tier executive qualifications for directors and senior leaders shaping organizational strategy.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: S.rose }
  ];

  // Custom wide container for the "Screen Spread" effect
  const wideSpread = { width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 5%" };

  return (
    <PageWrapper bg={S.lightBg}>
      
      {/* ─── 🏆 TOP STATS BANNER (Full Spread) ─── */}
      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: "12px 0", zIndex: 50, position: "relative" }}>
        <div style={wideSpread}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "15px", alignItems: "center" }}>
            {[
              { label: "Facilitating Learning", value: "Since 2018", color: S.navy },
              { label: "Completion Rate", value: "94%", color: S.emerald },
              { label: "Student Rating", value: "4.8/5", color: S.goldDark },
              { label: "Global Reach", value: "9 Countries", color: S.teal }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ fontFamily: S.heading, fontSize: "24px", fontWeight: "800", color: stat.color, lineHeight: "1.2" }}>{stat.value}</div>
                <div style={{ fontFamily: S.body, fontSize: "11px", color: S.gray, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 🚀 EXECUTIVE GATEWAY HERO (Full Spread) ─── */}
      <div style={{ background: S.navy, position: "relative", overflow: "hidden", padding: "80px 0 100px", borderBottom: `4px solid ${S.gold}` }}>
        {/* Abstract Tech Map Background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15, zIndex: 0 }}></div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(1, 30, 64, 1) 30%, rgba(1, 30, 64, 0.6) 100%)", zIndex: 0 }}></div>
        
        <div style={{ ...wideSpread, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px", justifyContent: "space-between" }}>
            
            {/* Left Column: Text & CTA */}
            <div style={{ flex: "1 1 500px", textAlign: "left" }}>
              <Reveal>
                
                {/* 🚨 SPRING COHORT BANNER */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: `linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent)`, border: "1px solid rgba(255,255,255,0.3)", color: S.white, padding: "8px 20px", borderRadius: "30px", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "24px", backdropFilter: "blur(10px)" }}>
                  <span style={{ fontSize: "16px" }}>🗓️</span> 
                  Spring Cohort: Classes Begin Monday April 13, 2026
                </div>
                
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(44px, 5vw, 68px)", color: S.white, fontWeight: "800", lineHeight: "1.1", margin: "0 0 20px" }}>
                  An Executive International Gateway.<br />
                  <span style={{ color: S.gold }}>Elevate Your Career.</span>
                </h1>
                
                <p style={{ fontFamily: S.body, fontSize: "clamp(16px, 1.5vw, 20px)", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", maxWidth: "700px", margin: "0 0 30px" }}>
                  Earn <strong>internationally recognised NCTVET qualifications</strong> directly from your mobile, tablet, or desktop. Access a borderless digital campus without rigid class times. Learn at your own pace with our advanced AI study assistant.
                </p>
                
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white, fontSize: "18px", padding: "18px 48px", border: "none", boxShadow: `0 8px 24px ${S.coral}50`, borderRadius: "30px" }}>
                    Apply Now — Secure Your Spot
                  </Btn>
                  <Btn onClick={() => setPage("Programmes")} style={{ fontSize: "18px", padding: "18px 48px", color: S.white, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.2)`, borderRadius: "30px", backdropFilter: "blur(10px)" }}>
                    Explore 28 Programmes
                  </Btn>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Dynamic Image Grid */}
            <div style={{ flex: "1 1 500px", position: "relative" }}>
              <Reveal delay={0.2}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", position: "relative" }}>
                  
                  {/* Image 1 - VR/Tech */}
                  <div style={{ borderRadius: "24px", overflow: "hidden", height: "280px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: "translateY(20px)" }}>
                    <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Advanced Learning" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>🇯🇲</span> Kingston, Jamaica
                    </div>
                  </div>

                  {/* Image 2 - Professional Business */}
                  <div style={{ borderRadius: "24px", overflow: "hidden", height: "280px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: "translateY(-20px)" }}>
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Executive Leadership" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>🇳🇬</span> Lagos, Nigeria
                    </div>
                  </div>

                  {/* Center Glass Badge */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(1, 30, 64, 0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "20px 30px", borderRadius: "20px", border: `1px solid ${S.gold}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", boxShadow: "0 15px 40px rgba(0,0,0,0.5)", zIndex: 10, width: "260px", textAlign: "center" }}>
                    <span style={{ fontSize: "28px" }}>🌍</span>
                    <div style={{ color: S.gold, fontSize: "16px", fontFamily: S.heading, fontWeight: "800", lineHeight: "1.2" }}>Internationally Recognised</div>
                    <div style={{ color: S.white, fontSize: "12px", fontFamily: S.body }}>NCTVET & City & Guilds Aligned</div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>

      {/* ─── 📅 TOP CTA BANNER (Moved from bottom to right under Hero) ─── */}
      <Reveal delay={0.3}>
        <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${S.border}`, boxShadow: "0 20px 40px rgba(1,30,64,0.1)" }}>
          {/* Full bleed image background */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }}></div>
          {/* Gradient Overlay to ensure text readability */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${S.navy} 30%, rgba(1,30,64,0.7) 100%)` }}></div>
          
          <div style={{ ...wideSpread, position: "relative", zIndex: 1, padding: "80px 5%", textAlign: "left" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎓</div>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 4vw, 52px)", color: S.white, fontWeight: "800", marginBottom: "20px", lineHeight: "1.1" }}>Classes Begin Monday April 13, 2026.<br/>Secure Your Spot Today.</h2>
            <p style={{ fontFamily: S.body, fontSize: "clamp(18px, 2vw, 22px)", color: "rgba(255,255,255,0.9)", marginBottom: "40px", lineHeight: "1.6", maxWidth: "800px" }}>
              Join hundreds of students advancing their careers through our digital campus. Your application takes less than 10 minutes.
            </p>
            <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, fontSize: "20px", padding: "20px 50px", border: "none", boxShadow: `0 10px 30px rgba(0,0,0,0.3)`, borderRadius: "40px", fontWeight: "800" }}>
              Start Your Application
            </Btn>
          </div>
        </div>
      </Reveal>

      {/* ─── 📚 ACADEMIC PATHWAYS & FACULTIES (Wide Spread) ─── */}
      <div style={{ padding: "100px 0 60px" }}>
        <div style={wideSpread}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{ display: "inline-block", padding: "8px 20px", background: `${S.violet}15`, color: S.violet, borderRadius: "30px", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "20px" }}>Our Faculties</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "44px", color: S.navy, fontWeight: "800", margin: "0 0 20px" }}>Comprehensive Academic Pathways</h2>
            <p style={{ fontFamily: S.body, fontSize: "18px", color: S.gray, maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
              From foundational job certificates to executive Bachelor's equivalents, our NCTVET-aligned framework maps directly to your career trajectory.
            </p>
          </div>

          {/* Subject Areas Cloud */}
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "60px", maxWidth: "1200px", margin: "0 auto 60px" }}>
              {DISCIPLINES.map((subject, i) => (
                <div key={i} style={{ background: S.white, border: `1px solid ${S.border}`, padding: "12px 24px", borderRadius: "30px", fontSize: "15px", fontFamily: S.body, color: S.navy, fontWeight: "700", boxShadow: "0 6px 15px rgba(0,0,0,0.03)" }}>
                  {subject}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Level Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
            {PATHWAYS.map((pathway, i) => (
              <Reveal key={pathway.id} delay={i * 0.1}>
                <div 
                  onClick={() => setPage("Programmes")}
                  style={{ 
                    background: S.navy, 
                    borderRadius: "30px", 
                    overflow: "hidden", 
                    position: "relative", 
                    height: "360px", 
                    cursor: "pointer", 
                    boxShadow: "0 20px 40px rgba(1,30,64,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 30px 60px rgba(1,30,64,0.2)"; }} 
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(1,30,64,0.1)"; }}
                >
                  <img src={pathway.img} alt={pathway.level} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transition: "opacity 0.3s" }} />
                  
                  {/* Gradient Overlay */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 10%, rgba(1,30,64,0.95) 100%)` }}></div>
                  
                  {/* Content */}
                  <div style={{ position: "absolute", inset: 0, padding: "40px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    
                    {/* Top Pill */}
                    <div style={{ alignSelf: "flex-start", background: pathway.color, color: "#fff", padding: "8px 16px", borderRadius: "16px", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 6px 15px rgba(0,0,0,0.2)" }}>
                      {pathway.tag}
                    </div>

                    {/* Bottom Text */}
                    <div>
                      <h3 style={{ fontFamily: S.heading, fontSize: "30px", color: S.white, fontWeight: "800", margin: "0 0 12px" }}>{pathway.level}</h3>
                      <p style={{ fontFamily: S.body, fontSize: "16px", color: "rgba(255,255,255,0.8)", margin: "0 0 20px", lineHeight: "1.5" }}>{pathway.desc}</p>
                      <div style={{ color: pathway.color, fontSize: "15px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                        Explore Level <span style={{ fontSize: "18px" }}>→</span>
                      </div>
                    </div>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ─── THE CTS ETS ADVANTAGE (Wide Spread) ─── */}
      <div style={{ padding: "80px 0 100px" }}>
        <div style={wideSpread}>
          <div style={{ textAlign: "center", marginBottom: "70px" }}>
            <span style={{ display: "inline-block", padding: "8px 20px", background: `${S.teal}15`, color: S.tealDark, borderRadius: "30px", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "20px" }}>The Digital Advantage</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "44px", color: S.navy, fontWeight: "800", margin: "0" }}>Education Redesigned for You</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px" }}>
            {[
              { icon: "📱", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", title: "Study Anywhere", desc: "Access all learner guides, audio sessions, and interactive quizzes directly from your smartphone's home screen.", color: S.sky },
              { icon: "🤖", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", title: "24/7 AI Tutor", desc: "Stuck at 2 AM? Our Intelligent Study Assistant is built right into your classroom to explain complex topics instantly.", color: S.violet },
              { icon: "🏅", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", title: "NVQ-J Certified", desc: "We prepare you for the exact same NCTVET assessments as traditional institutions, opening doors globally.", color: S.emerald }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: S.white, borderRadius: "30px", overflow: "hidden", border: `1px solid ${S.border}`, transition: "all 0.3s ease", boxShadow: "0 15px 30px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-12px)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.04)"; }}>
                  <div style={{ height: "200px", backgroundImage: `url(${feature.img})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(1,30,64,0.8), transparent)" }}></div>
                    <div style={{ position: "absolute", bottom: "-30px", left: "30px", width: "70px", height: "70px", borderRadius: "20px", background: S.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>{feature.icon}</div>
                  </div>
                  <div style={{ padding: "50px 40px 40px", flex: 1 }}>
                    <h3 style={{ fontFamily: S.heading, fontSize: "26px", color: S.navy, fontWeight: "800", marginBottom: "16px" }}>{feature.title}</h3>
                    <p style={{ fontFamily: S.body, fontSize: "17px", color: S.gray, lineHeight: "1.6", margin: 0 }}>{feature.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <PartnerLogos />

      {/* ─── TESTIMONIALS (Wide Spread) ─── */}
      <div style={{ padding: "100px 0" }}>
        <div style={wideSpread}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{ display: "inline-block", padding: "8px 20px", background: `${S.gold}20`, color: S.goldDark, borderRadius: "30px", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "20px" }}>Real Results</span>
            <h2 style={{ fontFamily: S.heading, fontSize: "44px", color: S.navy, fontWeight: "800" }}>Student Success Stories</h2>
          </div>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px" }}>
              <TestimonialCard t={TESTIMONIALS[2]} /> 
              <TestimonialCard t={TESTIMONIALS[3]} /> 
            </div>
          </Reveal>
        </div>
      </div>

      <Container>
        <PageScripture page="home" /> 
      </Container>
      
    </PageWrapper>
  );
}