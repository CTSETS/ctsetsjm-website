import React, { useState, useEffect, useRef } from "react";
import { TESTIMONIALS } from "../constants/content"; 
import { PageScripture, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

// ─── PREMIUM LIGHT THEME DEFINITIONS ───
const T = {
  navy: "#011E40", navyDeep: "#000D1F", gold: "#C8A951", goldDark: "#A68A3D",
  white: "#FFFFFF", offWhite: "#F9FAFB", cream: "#F3F4F6",
  gray: "#4B5563", grayLight: "#9CA3AF", border: "rgba(1,30,64,0.08)",
  emerald: "#059669", teal: "#0891B2", coral: "#EA580C", violet: "#7C3AED", rose: "#DB2777",
};
const f = { display: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" };

// ─── ANIMATED COMPONENTS ───
function Counter({ end, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const step = (now) => { 
          const p = Math.min((now - s) / duration, 1); 
          setVal(Math.floor((1 - Math.pow(1 - p, 4)) * end)); 
          if (p < 1) requestAnimationFrame(step); 
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(50px)", transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>{children}</div>;
}

// Lighter particles for the bright theme
function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", width: `${4 + Math.random() * 6}px`, height: `${4 + Math.random() * 6}px`, background: T.gold, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.2 + Math.random() * 0.3, animation: `float${i % 3} ${6 + Math.random() * 8}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />
      ))}
    </div>
  );
}

export default function HomePage({ setPage }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { 
    const h = () => setScrollY(window.scrollY); 
    window.addEventListener("scroll", h, { passive: true }); 
    return () => window.removeEventListener("scroll", h); 
  }, []);

  const PATHWAYS = [
    { level: "Job Certificates", tag: "Entry Level", desc: "Fast-track your entry into the workforce with foundational digital and professional skills.", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80", color: T.emerald },
    { level: "Level 2", tag: "Vocational", desc: "Industry-standard qualifications in Customer Service, Data Operations, and more.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80", color: T.teal },
    { level: "Level 3", tag: "Diploma", desc: "Advanced training for supervisors and team leaders in Business and Administration.", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", color: T.violet },
    { level: "Level 4", tag: "Associate", desc: "Strategic management and advanced technical competencies for departmental leadership.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", color: T.coral },
    { level: "Level 5", tag: "Bachelor's", desc: "Top-tier executive qualifications for directors and senior leaders.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&q=80", color: T.rose },
  ];

  const DISCIPLINES = ["Business Administration", "Customer Service", "Information Technology", "Digital Literacy", "Data Operations", "Leadership & Management", "Accounting & Finance"];

  return (
    <div style={{ background: T.white, minHeight: "100vh", overflow: "hidden", width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes float0 { 0%,100% { transform:translateY(0) translateX(0); } 50% { transform:translateY(-30px) translateX(15px); } }
        @keyframes float1 { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-20px) translateX(-20px); } }
        @keyframes float2 { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-40px) translateX(10px); } }
        @keyframes pulse { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.15); } }
        @keyframes heroIn { 0% { opacity:0; transform:translateY(40px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes badgeIn { 0% { opacity:0; transform:translateY(20px) scale(0.9); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        ::selection { background: ${T.gold}40; color: ${T.navy}; }
      `}</style>

      {/* ━━━━━━ BRIGHT EXECUTIVE HERO ━━━━━━ */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", background: T.white, overflow: "hidden", width: "100%" }}>
        
        {/* Soft, bright background overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, transform: `translateY(${scrollY * 0.2}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,244,246,0.95) 100%)` }} />
        <Particles />
        
        {/* Soft Glowing Orbs (Lighter tones) */}
        {[{ c: T.teal, s: "600px", t: "-15%", l: "55%" }, { c: T.gold, s: "450px", t: "60%", l: "-8%" }, { c: T.violet, s: "350px", t: "20%", l: "85%" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: `radial-gradient(circle, ${o.c}15 0%, transparent 70%)`, top: o.t, left: o.l, filter: "blur(60px)", animation: `pulse 8s ease-in-out infinite ${i * 1.5}s`, pointerEvents: "none" }} />
        ))}

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 10, padding: "160px 4% 80px", width: "100%", maxWidth: "1800px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "50px" }}>
          
          {/* LEFT TEXT (Dark text for readability) */}
          <div style={{ flex: "1 1 520px", maxWidth: "750px" }}>
            <div style={{ animation: "badgeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: `linear-gradient(90deg, ${T.gold}20, transparent)`, border: `1px solid ${T.gold}40`, padding: "10px 22px", borderRadius: "40px", marginBottom: "32px", backdropFilter: "blur(10px)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.emerald, boxShadow: `0 0 12px ${T.emerald}`, animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: f.mono, fontSize: "13px", fontWeight: "800", color: T.goldDark, letterSpacing: "1px" }}>SPRING COHORT — MONDAY APRIL 13, 2026</span>
              </div>
            </div>
            
            <h1 style={{ fontFamily: f.display, fontSize: "clamp(46px, 5.5vw, 84px)", color: T.navy, fontWeight: "900", lineHeight: 1.05, margin: "0 0 28px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              An Executive<br />
              <span style={{ color: T.teal, position: "relative", display: "inline-block" }}>
                International
                <span style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "6px", background: `linear-gradient(90deg, ${T.teal}40, transparent)`, borderRadius: "3px" }} />
              </span> Gateway.
            </h1>
            
            <p style={{ fontFamily: f.body, fontSize: "clamp(18px, 1.8vw, 24px)", color: T.gray, lineHeight: 1.6, margin: "0 0 40px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
              Earn <strong>internationally recognised NCTVET qualifications</strong> from a fully digital campus. No rigid class times. Learn at your own pace with our advanced AI study assistant.
            </p>
            
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
              <button onClick={() => setPage("Apply")} style={{ background: T.navy, color: T.white, border: "none", padding: "20px 48px", borderRadius: "18px", fontFamily: f.body, fontSize: "18px", fontWeight: "800", cursor: "pointer", boxShadow: `0 12px 30px ${T.navy}40` }}>Apply Now — Secure Your Spot</button>
              <button onClick={() => setPage("Programmes")} style={{ background: T.white, color: T.navy, border: `2px solid ${T.border}`, padding: "18px 48px", borderRadius: "18px", fontFamily: f.body, fontSize: "18px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>Explore 28 Programmes</button>
            </div>
          </div>

          {/* RIGHT MOSAIC (Bright, natural images) */}
          <div style={{ flex: "1 1 500px", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "200px 200px 160px", gap: "16px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <div style={{ gridRow: "1 / 3", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(1,30,64,0.15)" }}>
              <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80" alt="Advanced Learning" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: T.navy, fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>🇯🇲 Kingston</div>
            </div>
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(1,30,64,0.15)" }}>
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" alt="Executive Leadership" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: T.navy, fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>🇳🇬 Lagos</div>
            </div>
            {/* Center Floating White Badge */}
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(1,30,64,0.1)", background: T.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}`, padding: "20px" }}>
                <span style={{ fontSize: "36px", marginBottom: "8px" }}>🌍</span>
                <div style={{ color: T.navy, fontSize: "16px", fontFamily: f.display, fontWeight: "900", textAlign: "center", lineHeight: 1.2 }}>Internationally<br/>Recognised</div>
            </div>
            <div style={{ gridColumn: "1 / -1", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(1,30,64,0.15)" }}>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" alt="Global Reach" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", display: "flex", gap: "8px" }}>
                {["🇨🇦", "🇦🇺", "🇹🇹", "🇧🇧", "🇺🇸"].map((flag, i) => <span key={i} style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", padding: "6px 10px", borderRadius: "8px", fontSize: "18px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>{flag}</span>)}
              </div>
              <div style={{ position: "absolute", top: "50%", right: "24px", transform: "translateY(-50%)", background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(12px)", padding: "16px 24px", borderRadius: "16px", border: `1px solid ${T.border}`, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                <div style={{ fontFamily: f.display, fontSize: "28px", fontWeight: "900", color: T.goldDark }}><Counter end={53} suffix="+" /></div>
                <div style={{ fontFamily: f.mono, fontSize: "10px", color: T.gray, letterSpacing: "1.5px", marginTop: "2px", fontWeight: "700" }}>COUNTRIES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar (Light Mode) */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 4% 60px", width: "100%", maxWidth: "1800px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {[
            { icon: "📅", value: "Since 2018", label: "Facilitating Learning" },
            { icon: "📊", value: <Counter end={94} suffix="%" />, label: "Completion Rate" },
            { icon: "⭐", value: "4.8/5", label: "Student Rating" },
            { icon: "🌍", value: <><Counter end={9} /> Countries</>, label: "Global Reach" },
            { icon: "🎓", value: "28", label: "Programmes" },
            { icon: "🏅", value: "NVQ-J", label: "Certified" },
          ].map((s, i) => (
            <Reveal key={i} delay={0.15 + i * 0.08} style={{ flex: "1 1 180px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: T.white, border: `1px solid ${T.border}`, borderRadius: "18px", padding: "20px 24px", transition: "all 0.3s", cursor: "default", boxShadow: "0 10px 30px rgba(1,30,64,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(1,30,64,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(1,30,64,0.03)"; }}>
                <span style={{ fontSize: "28px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: f.display, fontSize: "24px", fontWeight: "800", color: T.navy, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: f.body, fontSize: "11px", color: T.gray, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700", marginTop: "4px" }}>{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ━━━━━━ INFINITE MARQUEE ━━━━━━ */}
      <div style={{ padding: "50px 0", overflow: "hidden", width: "100%", background: T.offWhite, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", animation: "marquee 35s linear infinite", width: "max-content" }}>
          {[...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "35px", padding: "0 35px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: f.display, fontSize: "28px", fontWeight: "700", color: T.gray }}>{d}</span>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: T.goldLight }} />
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━ ADVANTAGES — LIGHT ALTERNATING FULL BLEED ━━━━━━ */}
      <div style={{ width: "100%" }}>
        {[
          { icon: "📱", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80", title: "Study From Anywhere on Earth", desc: "Access all learner guides, audio sessions, and interactive quizzes directly from your smartphone's home screen. No app store needed — just open your browser and learn.", tag: "MOBILITY", color: T.teal },
          { icon: "🤖", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&q=80", title: "Your 24/7 AI-Powered Tutor", desc: "Stuck at 2 AM? Our Intelligent Study Assistant is built right into your digital classroom — explaining complex topics, brainstorming ideas, and helping you prepare for assessments instantly.", tag: "INTELLIGENCE", color: T.violet },
          { icon: "🏅", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=80", title: "NVQ-J: Credentials That Travel", desc: "We prepare you for the exact same NCTVET assessments as traditional institutions. Your NVQ-J is recognised in 53 Commonwealth countries, across CARICOM, and accepted in the USA.", tag: "CERTIFICATION", color: T.emerald },
        ].map((item, i) => {
          const reversed = i % 2 === 1;
          const [hovered, setHovered] = useState(false);
          return (
            <Reveal key={i} delay={0.1}>
              <div style={{ display: "flex", flexDirection: reversed ? "row-reverse" : "row", flexWrap: "wrap", width: "100%", minHeight: "550px", background: i % 2 === 0 ? T.white : T.offWhite }}>
                {/* Image Side */}
                <div style={{ flex: "1 1 50%", minHeight: "400px", position: "relative", overflow: "hidden" }}
                  onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
                  <div style={{ position: "absolute", top: "40px", [reversed ? "right" : "left"]: "40px", background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(12px)", padding: "14px 24px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontFamily: f.mono, fontSize: "12px", color: item.color, letterSpacing: "2.5px", fontWeight: "800" }}>{item.tag}</div>
                  </div>
                </div>
                {/* Text Side */}
                <div style={{ flex: "1 1 45%", padding: "100px 6%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontSize: "56px", marginBottom: "24px", display: "block" }}>{item.icon}</span>
                  <h3 style={{ fontFamily: f.display, fontSize: "clamp(34px, 3.5vw, 50px)", color: T.navy, fontWeight: "900", margin: "0 0 24px", lineHeight: 1.1 }}>{item.title}</h3>
                  <p style={{ fontFamily: f.body, fontSize: "20px", color: T.gray, lineHeight: 1.7, margin: "0 0 40px", maxWidth: "600px" }}>{item.desc}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", color: item.color, fontFamily: f.body, fontSize: "17px", fontWeight: "800", cursor: "pointer" }}>
                    Discover How <span style={{ fontSize: "22px" }}>→</span>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ━━━━━━ BRIGHT ACADEMIC PATHWAYS (CLEAN CARDS) ━━━━━━ */}
      <div style={{ width: "100%", padding: "120px 4% 100px", background: T.cream, position: "relative" }}>
        
        <div style={{ maxWidth: "1800px", margin: "0 auto", marginBottom: "60px", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "30px" }}>
              <div>
                <div style={{ fontFamily: f.mono, fontSize: "14px", color: T.goldDark, letterSpacing: "3px", textTransform: "uppercase", fontWeight: "800", marginBottom: "16px" }}>Our Faculties</div>
                <h2 style={{ fontFamily: f.display, fontSize: "clamp(40px, 4.5vw, 64px)", color: T.navy, fontWeight: "900", lineHeight: 1.05, margin: 0 }}>Five Levels. <span style={{ color: T.teal }}>One Vision.</span></h2>
              </div>
              <p style={{ fontFamily: f.body, fontSize: "19px", color: T.gray, maxWidth: "550px", lineHeight: 1.6, textAlign: "right", margin: 0 }}>
                From foundational job certificates to executive qualifications — your NCTVET-aligned career framework maps directly to your ambition.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Light Cards Layout */}
        <div style={{ maxWidth: "1800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", position: "relative", zIndex: 2 }}>
          {PATHWAYS.map((p, i) => {
            const [h, setH] = useState(false);
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div onClick={() => setPage("Programmes")} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} 
                  style={{ background: T.white, borderRadius: "28px", overflow: "hidden", cursor: "pointer", transition: "all 0.4s ease", transform: h ? "translateY(-12px)" : "none", boxShadow: h ? "0 30px 60px rgba(1,30,64,0.12)" : "0 15px 35px rgba(1,30,64,0.06)", display: "flex", flexDirection: "column" }}>
                  
                  {/* Top Image Half */}
                  <div style={{ height: "220px", position: "relative", overflow: "hidden" }}>
                    <img src={p.img} alt={p.level} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s ease", transform: h ? "scale(1.08)" : "scale(1)" }} />
                    <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(5px)", borderRadius: "10px", padding: "6px 12px", fontSize: "10px", color: T.navy, fontFamily: f.mono, fontWeight: "800", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>NCTVET</div>
                  </div>
                  
                  {/* Bottom Text Half */}
                  <div style={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ alignSelf: "flex-start", background: `${p.color}15`, color: p.color, padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: f.body, marginBottom: "16px" }}>{p.tag}</div>
                    <h3 style={{ fontFamily: f.display, fontSize: "28px", color: T.navy, fontWeight: "900", margin: "0 0 12px", lineHeight: 1.1 }}>{p.level}</h3>
                    <p style={{ fontFamily: f.body, fontSize: "15px", color: T.gray, margin: "0 0 24px", lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: p.color, fontSize: "14px", fontWeight: "800", fontFamily: f.body }}>Explore Level <span style={{ fontSize: "18px", transition: "transform 0.3s", transform: h ? "translateX(6px)" : "none" }}>→</span></div>
                  </div>
                  
                  <div style={{ height: "6px", background: p.color, transform: h ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.4s" }} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <PartnerLogos />

      {/* ━━━━━━ TESTIMONIALS ━━━━━━ */}
      <div style={{ padding: "100px 4%", background: T.white }}>
        <div style={{ maxWidth: "1800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span style={{ display: "inline-block", padding: "10px 24px", background: `${T.gold}20`, color: T.goldDark, borderRadius: "30px", fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: f.mono, fontWeight: "700", marginBottom: "20px" }}>Real Results</span>
            <h2 style={{ fontFamily: f.display, fontSize: "clamp(40px, 4vw, 56px)", color: T.navy, fontWeight: "900" }}>Student Success Stories</h2>
          </div>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px" }}>
              <TestimonialCard t={TESTIMONIALS[2]} /> 
              <TestimonialCard t={TESTIMONIALS[3]} /> 
            </div>
          </Reveal>
        </div>
      </div>

      {/* ━━━━━━ FINAL CTA — BRIGHT & VIBRANT ━━━━━━ */}
      <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
        {/* Soft vibrant background instead of dark blue */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(1,30,64,0.85) 0%, rgba(8,145,178,0.85) 100%)` }} />
        <Particles />
        
        <div style={{ position: "relative", zIndex: 1, padding: "120px 6%", width: "100%", maxWidth: "1800px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "60px" }}>
          <div style={{ flex: "1 1 600px" }}>
            <Reveal>
              <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎓</div>
              <h2 style={{ fontFamily: f.display, fontSize: "clamp(44px, 5vw, 70px)", color: T.white, fontWeight: "900", lineHeight: 1.05, margin: "0 0 24px" }}>Classes Begin<br /><span style={{ color: T.goldLight }}>Monday April 13, 2026.</span></h2>
              <p style={{ fontFamily: f.body, fontSize: "22px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: "0 0 48px", maxWidth: "650px" }}>Join hundreds of students advancing their careers through our digital campus. Your application takes less than 10 minutes.</p>
              <button onClick={() => setPage("Apply")} style={{ background: T.white, color: T.navy, border: "none", padding: "24px 60px", borderRadius: "24px", fontFamily: f.body, fontSize: "20px", fontWeight: "900", cursor: "pointer", boxShadow: `0 16px 50px rgba(0,0,0,0.2)` }}>Start Your Application</button>
            </Reveal>
          </div>
          
          <Reveal delay={0.2} style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "🌍", text: "Recognised in 53+ Commonwealth countries" },
              { icon: "📱", text: "100% digital — study from any device" },
              { icon: "🤖", text: "24/7 AI Study Assistant built in" },
              { icon: "⚡", text: "Apply in under 10 minutes" },
              { icon: "💰", text: "Flexible Gold, Silver & Bronze payment plans" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", padding: "20px 28px", backdropFilter: "blur(16px)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                <span style={{ fontSize: "26px" }}>{item.icon}</span>
                <span style={{ fontFamily: f.body, fontSize: "17px", color: T.white, fontWeight: "700" }}>{item.text}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <PageScripture page="home" /> 

    </div>
  );
}