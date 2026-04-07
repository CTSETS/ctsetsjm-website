import React, { useState, useEffect, useRef } from "react";
// Integrating your existing content components
import { TESTIMONIALS } from "../constants/content"; 
import { PageScripture, TestimonialCard } from "../components/shared/CoreComponents";
import { PartnerLogos } from "../components/shared/DisplayComponents";

// ─── PREMIUM THEME DEFINITIONS ───
const T = {
  navy: "#011E40", navyDeep: "#000D1F", gold: "#C8A951", goldLight: "#E8D48B",
  white: "#FFFFFF", offWhite: "#F7F5F0", cream: "#FAF8F3",
  gray: "#6B7A8D", grayLight: "#9BA8B7", border: "rgba(1,30,64,0.08)",
  emerald: "#0D9668", teal: "#0891B2", coral: "#E8543E", violet: "#7C3AED", rose: "#DB2777",
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

function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`, background: T.gold, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.12 + Math.random() * 0.2, animation: `float${i % 3} ${6 + Math.random() * 8}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />
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
    <div style={{ background: T.cream, minHeight: "100vh", overflow: "hidden", width: "100%" }}>
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

      {/* ━━━━━━ EXECUTIVE HERO — FULL BLEED ━━━━━━ */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", background: T.navyDeep, overflow: "hidden", width: "100%" }}>
        {/* Parallax Background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15, transform: `translateY(${scrollY * 0.2}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.navyDeep} 0%, ${T.navy}DD 50%, ${T.navyDeep} 100%)` }} />
        <Particles />
        
        {/* Glowing Orbs */}
        {[{ c: T.gold, s: "600px", t: "-15%", l: "55%" }, { c: T.teal, s: "450px", t: "60%", l: "-8%" }, { c: T.violet, s: "350px", t: "20%", l: "85%" }, { c: T.coral, s: "200px", t: "70%", l: "75%" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: `radial-gradient(circle, ${o.c}20 0%, transparent 70%)`, top: o.t, left: o.l, filter: "blur(80px)", animation: `pulse 7s ease-in-out infinite ${i * 1.5}s`, pointerEvents: "none" }} />
        ))}

        {/* Hero Content — Asymmetric Wide Layout */}
        <div style={{ position: "relative", zIndex: 10, padding: "140px 4% 80px", width: "100%", maxWidth: "1800px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "50px" }}>
          
          {/* LEFT TEXT */}
          <div style={{ flex: "1 1 520px", maxWidth: "750px" }}>
            <div style={{ animation: "badgeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: `linear-gradient(90deg, ${T.gold}20, transparent)`, border: `1px solid ${T.gold}40`, padding: "10px 22px", borderRadius: "40px", marginBottom: "32px", backdropFilter: "blur(10px)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.emerald, boxShadow: `0 0 12px ${T.emerald}`, animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: f.mono, fontSize: "13px", fontWeight: "700", color: T.goldLight, letterSpacing: "1px" }}>SPRING COHORT — MONDAY APRIL 13, 2026</span>
              </div>
            </div>
            
            <h1 style={{ fontFamily: f.display, fontSize: "clamp(46px, 5.5vw, 84px)", color: T.white, fontWeight: "900", lineHeight: 1.05, margin: "0 0 28px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              An Executive<br />
              <span style={{ color: T.gold, position: "relative", display: "inline-block" }}>
                International
                <span style={{ position: "absolute", bottom: "-6px", left: 0, right: 0, height: "5px", background: `linear-gradient(90deg, ${T.gold}, transparent)`, borderRadius: "3px" }} />
              </span> Gateway.
            </h1>
            
            <p style={{ fontFamily: f.body, fontSize: "clamp(18px, 1.8vw, 24px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: "0 0 40px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
              Earn <strong>internationally recognised NCTVET qualifications</strong> from a fully digital campus. No rigid class times. Learn at your own pace with our advanced AI study assistant.
            </p>
            
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
              <button onClick={() => setPage("Apply")} style={{ background: `linear-gradient(135deg, ${T.coral}, ${T.rose})`, color: T.white, border: "none", padding: "20px 48px", borderRadius: "18px", fontFamily: f.body, fontSize: "18px", fontWeight: "800", cursor: "pointer", boxShadow: `0 12px 40px ${T.coral}50` }}>Apply Now — Secure Your Spot</button>
              <button onClick={() => setPage("Programmes")} style={{ background: "rgba(255,255,255,0.04)", color: T.white, border: "1px solid rgba(255,255,255,0.15)", padding: "20px 48px", borderRadius: "18px", fontFamily: f.body, fontSize: "18px", fontWeight: "700", cursor: "pointer", backdropFilter: "blur(10px)" }}>Explore 28 Programmes</button>
            </div>
          </div>

          {/* RIGHT MOSAIC */}
          <div style={{ flex: "1 1 500px", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "200px 200px 160px", gap: "16px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <div style={{ gridRow: "1 / 3", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80" alt="Advanced Learning" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>🇯🇲 Kingston</div>
            </div>
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" alt="Executive Leadership" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>🇳🇬 Lagos</div>
            </div>
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", background: "rgba(1, 30, 64, 0.85)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${T.gold}50` }}>
                <span style={{ fontSize: "36px", marginBottom: "8px" }}>🌍</span>
                <div style={{ color: T.gold, fontSize: "16px", fontFamily: f.display, fontWeight: "900", textAlign: "center" }}>Internationally<br/>Recognised</div>
            </div>
            <div style={{ gridColumn: "1 / -1", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" alt="Global Reach" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", display: "flex", gap: "8px" }}>
                {["🇨🇦", "🇦🇺", "🇹🇹", "🇧🇧", "🇺🇸"].map((flag, i) => <span key={i} style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: "8px", fontSize: "16px" }}>{flag}</span>)}
              </div>
              <div style={{ position: "absolute", top: "50%", right: "24px", transform: "translateY(-50%)", background: `${T.navy}DD`, backdropFilter: "blur(12px)", padding: "16px 24px", borderRadius: "16px", border: `1px solid ${T.gold}50`, textAlign: "center" }}>
                <div style={{ fontFamily: f.display, fontSize: "28px", fontWeight: "900", color: T.gold }}><Counter end={53} suffix="+" /></div>
                <div style={{ fontFamily: f.mono, fontSize: "10px", color: T.goldLight, letterSpacing: "1.5px", marginTop: "2px" }}>COUNTRIES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", borderRadius: "18px", padding: "20px 24px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${T.gold}0D`; e.currentTarget.style.borderColor = `${T.gold}35`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}>
                <span style={{ fontSize: "28px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: f.display, fontSize: "24px", fontWeight: "800", color: T.gold, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: f.body, fontSize: "11px", color: T.grayLight, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700", marginTop: "4px" }}>{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Swoosh Divider */}
        <svg viewBox="0 0 1440 80" style={{ position: "absolute", bottom: -1, left: 0, width: "100%", zIndex: 5 }}><path d="M0,50 C480,80 960,20 1440,60 L1440,80 L0,80 Z" fill={T.cream} /></svg>
      </div>

      {/* ━━━━━━ INFINITE MARQUEE ━━━━━━ */}
      <div style={{ padding: "50px 0", overflow: "hidden", width: "100%", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", animation: "marquee 35s linear infinite", width: "max-content" }}>
          {[...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "35px", padding: "0 35px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: f.display, fontSize: "28px", fontWeight: "700", color: T.navy }}>{d}</span>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: T.gold, boxShadow: `0 0 12px ${T.gold}50` }} />
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━ ADVANTAGES — ALTERNATING FULL BLEED ━━━━━━ */}
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
              <div style={{ display: "flex", flexDirection: reversed ? "row-reverse" : "row", flexWrap: "wrap", width: "100%", minHeight: "550px", background: i % 2 === 0 ? T.cream : T.offWhite }}>
                {/* Image Side */}
                <div style={{ flex: "1 1 50%", minHeight: "400px", position: "relative", overflow: "hidden" }}
                  onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: reversed ? `linear-gradient(to left, ${T.navy}30, transparent 60%)` : `linear-gradient(to right, ${T.navy}30, transparent 60%)` }} />
                  <div style={{ position: "absolute", top: "40px", [reversed ? "right" : "left"]: "40px", background: `${T.navy}EE`, backdropFilter: "blur(12px)", padding: "14px 24px", borderRadius: "16px", border: `1px solid ${item.color}50` }}>
                    <div style={{ fontFamily: f.mono, fontSize: "12px", color: item.color, letterSpacing: "2.5px", fontWeight: "700" }}>{item.tag}</div>
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

      {/* ━━━━━━ ACADEMIC PATHWAYS ━━━━━━ */}
      <div style={{ width: "100%", padding: "140px 4% 120px", background: T.navyDeep, position: "relative", overflow: "hidden" }}>
        <Particles />
        {[{ c: T.gold, s: "700px", t: "0%", l: "70%" }, { c: T.violet, s: "500px", t: "50%", l: "-10%" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: `radial-gradient(circle, ${o.c}15 0%, transparent 70%)`, top: o.t, left: o.l, filter: "blur(100px)", pointerEvents: "none" }} />
        ))}

        <div style={{ maxWidth: "1800px", margin: "0 auto", marginBottom: "60px", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "30px" }}>
              <div>
                <div style={{ fontFamily: f.mono, fontSize: "14px", color: T.gold, letterSpacing: "3px", textTransform: "uppercase", fontWeight: "700", marginBottom: "16px" }}>Our Faculties</div>
                <h2 style={{ fontFamily: f.display, fontSize: "clamp(40px, 4.5vw, 64px)", color: T.white, fontWeight: "900", lineHeight: 1.05, margin: 0 }}>Five Levels. <span style={{ color: T.gold }}>One Vision.</span></h2>
              </div>
              <p style={{ fontFamily: f.body, fontSize: "19px", color: T.grayLight, maxWidth: "550px", lineHeight: 1.6, textAlign: "right", margin: 0 }}>
                From foundational job certificates to executive qualifications — your NCTVET-aligned career framework maps directly to your ambition.
              </p>
            </div>
          </Reveal>
        </div>

        <div style={{ maxWidth: "1800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", position: "relative", zIndex: 2 }}>
          {PATHWAYS.map((p, i) => {
            const [h, setH] = useState(false);
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div onClick={() => setPage("Programmes")} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", borderRadius: "28px", overflow: "hidden", height: "500px", cursor: "pointer", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-12px)" : "none", boxShadow: h ? "0 40px 80px rgba(0,0,0,0.6)" : "0 16px 40px rgba(0,0,0,0.3)" }}>
                  <img src={p.img} alt={p.level} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)", transform: h ? "scale(1.1)" : "scale(1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.navyDeep} 0%, ${T.navyDeep}BB 40%, transparent 100%)` }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "6px", background: p.color, transform: h ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.5s" }} />
                  
                  <div style={{ position: "absolute", inset: 0, padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ background: p.color, color: "#fff", padding: "8px 16px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: f.body }}>{p.tag}</div>
                      <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "12px", padding: "8px 14px", fontSize: "11px", color: T.goldLight, fontFamily: f.mono, fontWeight: "700" }}>NCTVET</div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: f.display, fontSize: "32px", color: T.white, fontWeight: "900", margin: "0 0 12px", lineHeight: 1.1 }}>{p.level}</h3>
                      <p style={{ fontFamily: f.body, fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0 0 24px", lineHeight: 1.6 }}>{p.desc}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: h ? "16px" : "10px", color: p.color, fontSize: "15px", fontWeight: "800", fontFamily: f.body, transition: "gap 0.3s" }}>Explore Level <span style={{ fontSize: "20px" }}>→</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <PartnerLogos />

      {/* ━━━━━━ TESTIMONIALS ━━━━━━ */}
      <div style={{ padding: "120px 4%", background: T.cream }}>
        <div style={{ maxWidth: "1800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span style={{ display: "inline-block", padding: "10px 24px", background: `${T.gold}20`, color: T.gold, borderRadius: "30px", fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: f.mono, fontWeight: "700", marginBottom: "20px" }}>Real Results</span>
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

      {/* ━━━━━━ FINAL CTA — FULL BLEED ━━━━━━ */}
      <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.navyDeep}F8 0%, ${T.navy}EE 100%)` }} />
        <Particles />
        
        <div style={{ position: "relative", zIndex: 1, padding: "140px 6%", width: "100%", maxWidth: "1800px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "60px" }}>
          <div style={{ flex: "1 1 600px" }}>
            <Reveal>
              <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎓</div>
              <h2 style={{ fontFamily: f.display, fontSize: "clamp(44px, 5vw, 70px)", color: T.white, fontWeight: "900", lineHeight: 1.05, margin: "0 0 24px" }}>Classes Begin<br /><span style={{ color: T.gold }}>Monday April 13, 2026.</span></h2>
              <p style={{ fontFamily: f.body, fontSize: "22px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: "0 0 48px", maxWidth: "650px" }}>Join hundreds of students advancing their careers through our digital campus. Your application takes less than 10 minutes.</p>
              <button onClick={() => setPage("Apply")} style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, border: "none", padding: "24px 60px", borderRadius: "24px", fontFamily: f.body, fontSize: "20px", fontWeight: "900", cursor: "pointer", boxShadow: `0 16px 50px ${T.gold}40` }}>Start Your Application</button>
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
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px 28px", backdropFilter: "blur(16px)" }}>
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