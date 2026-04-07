import { useState, useEffect, useRef } from "react";

const T = {
  navy: "#011E40", navyDeep: "#000D1F", gold: "#C8A951", goldLight: "#E8D48B",
  white: "#FFFFFF", offWhite: "#F7F5F0", cream: "#FAF8F3",
  gray: "#6B7A8D", grayLight: "#9BA8B7", border: "rgba(1,30,64,0.08)",
  emerald: "#0D9668", teal: "#0891B2", coral: "#E8543E", violet: "#7C3AED", rose: "#DB2777",
};
const f = { display: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" };

function Counter({ end, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const step = (now) => { const p = Math.min((now - s) / duration, 1); setVal(Math.floor((1 - Math.pow(1 - p, 4)) * end)); if (p < 1) requestAnimationFrame(step); };
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
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: "absolute", width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`, background: T.gold, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.12 + Math.random() * 0.2, animation: `float${i % 3} ${6 + Math.random() * 8}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />)}
  </div>;
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

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
        @keyframes imgReveal { 0% { clip-path: inset(100% 0 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        @keyframes slideInLeft { 0% { opacity:0; transform:translateX(-80px); } 100% { opacity:1; transform:translateX(0); } }
        @keyframes slideInRight { 0% { opacity:0; transform:translateX(80px); } 100% { opacity:1; transform:translateX(0); } }
        @keyframes scaleIn { 0% { opacity:0; transform:scale(0.8); } 100% { opacity:1; transform:scale(1); } }
        ::selection { background: ${T.gold}40; color: ${T.navy}; }
      `}</style>

      {/* ━━━━━━ HERO — FULL BLEED ━━━━━━ */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", background: T.navyDeep, overflow: "hidden", width: "100%" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, transform: `translateY(${scrollY * 0.2}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.navyDeep} 0%, ${T.navy}EE 50%, ${T.navyDeep} 100%)` }} />
        <Particles />
        {[{ c: T.gold, s: "600px", t: "-15%", l: "55%" }, { c: T.teal, s: "450px", t: "60%", l: "-8%" }, { c: T.violet, s: "350px", t: "20%", l: "85%" }, { c: T.coral, s: "200px", t: "70%", l: "75%" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: `radial-gradient(circle, ${o.c}20 0%, transparent 70%)`, top: o.t, left: o.l, filter: "blur(80px)", animation: `pulse 7s ease-in-out infinite ${i * 1.5}s`, pointerEvents: "none" }} />
        ))}

        {/* Nav — full spread */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "20px 3%", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontFamily: f.display, fontWeight: "900", color: T.navy, boxShadow: `0 4px 24px ${T.gold}50` }}>C</div>
            <div>
              <div style={{ fontFamily: f.display, fontSize: "20px", fontWeight: "800", color: T.white, lineHeight: 1 }}>CTS ETS</div>
              <div style={{ fontFamily: f.mono, fontSize: "10px", color: T.goldLight, letterSpacing: "2.5px" }}>DIGITAL CAMPUS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: T.white, padding: "12px 30px", borderRadius: "14px", fontFamily: f.body, fontSize: "14px", fontWeight: "700", cursor: "pointer", backdropFilter: "blur(10px)" }}>Programmes</button>
            <button style={{ background: `linear-gradient(135deg, ${T.coral}, ${T.rose})`, border: "none", color: T.white, padding: "12px 30px", borderRadius: "14px", fontFamily: f.body, fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: `0 4px 20px ${T.coral}40` }}>Apply Now</button>
          </div>
        </div>

        {/* Hero Content — asymmetric wide layout */}
        <div style={{ position: "relative", zIndex: 10, padding: "160px 3% 80px", width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px" }}>
          
          {/* LEFT TEXT — takes 50% */}
          <div style={{ flex: "1 1 520px", maxWidth: "700px" }}>
            <div style={{ animation: "badgeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: `linear-gradient(90deg, ${T.gold}20, transparent)`, border: `1px solid ${T.gold}40`, padding: "10px 22px", borderRadius: "40px", marginBottom: "32px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.emerald, boxShadow: `0 0 12px ${T.emerald}`, animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: f.mono, fontSize: "12px", fontWeight: "700", color: T.goldLight, letterSpacing: "1px" }}>SPRING COHORT — APRIL 13, 2026</span>
              </div>
            </div>
            <h1 style={{ fontFamily: f.display, fontSize: "clamp(44px, 5.5vw, 80px)", color: T.white, fontWeight: "900", lineHeight: 1.02, margin: "0 0 28px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              An Executive<br /><span style={{ color: T.gold, position: "relative", display: "inline-block" }}>International<span style={{ position: "absolute", bottom: "-6px", left: 0, right: 0, height: "5px", background: `linear-gradient(90deg, ${T.gold}, transparent)`, borderRadius: "3px" }} /></span> Gateway.
            </h1>
            <p style={{ fontFamily: f.body, fontSize: "clamp(17px, 1.6vw, 22px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 40px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
              Earn <strong style={{ color: T.white }}>internationally recognised NCTVET qualifications</strong> from a fully digital campus. No rigid class times. No physical classroom. Just world-class education from any device.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
              <button style={{ background: `linear-gradient(135deg, ${T.coral}, ${T.rose})`, color: T.white, border: "none", padding: "20px 48px", borderRadius: "18px", fontFamily: f.body, fontSize: "17px", fontWeight: "800", cursor: "pointer", boxShadow: `0 12px 40px ${T.coral}50` }}>Apply Now — Secure Your Spot</button>
              <button style={{ background: "rgba(255,255,255,0.04)", color: T.white, border: "1px solid rgba(255,255,255,0.15)", padding: "20px 48px", borderRadius: "18px", fontFamily: f.body, fontSize: "17px", fontWeight: "700", cursor: "pointer", backdropFilter: "blur(10px)" }}>Explore 28 Programmes</button>
            </div>
          </div>

          {/* RIGHT — staggered image mosaic filling the right side */}
          <div style={{ flex: "1 1 500px", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "200px 200px 160px", gap: "16px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            {/* Large top-left — spans 1 col, 2 rows */}
            <div style={{ gridRow: "1 / 3", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>🇯🇲 Kingston</div>
            </div>
            {/* Top right */}
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>🇳🇬 Lagos</div>
            </div>
            {/* Middle right */}
            <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>🇬🇧 London</div>
            </div>
            {/* Bottom full width strip */}
            <div style={{ gridColumn: "1 / -1", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", display: "flex", gap: "8px" }}>
                {["🇨🇦", "🇦🇺", "🇹🇹", "🇧🇧", "🇺🇸"].map((flag, i) => <span key={i} style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: "8px", fontSize: "16px" }}>{flag}</span>)}
              </div>
              <div style={{ position: "absolute", top: "50%", right: "24px", transform: "translateY(-50%)", background: `${T.navy}DD`, backdropFilter: "blur(12px)", padding: "16px 24px", borderRadius: "16px", border: `1px solid ${T.gold}50`, textAlign: "center" }}>
                <div style={{ fontFamily: f.display, fontSize: "28px", fontWeight: "900", color: T.gold }}>53+</div>
                <div style={{ fontFamily: f.mono, fontSize: "10px", color: T.goldLight, letterSpacing: "1.5px", marginTop: "2px" }}>COUNTRIES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats — full bleed bar */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 3% 60px", width: "100%", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {[
            { icon: "📅", value: "Since 2018", label: "Facilitating Learning" },
            { icon: "📊", value: <Counter end={94} suffix="%" />, label: "Completion Rate" },
            { icon: "⭐", value: "4.8/5", label: "Student Rating" },
            { icon: "🌍", value: <><Counter end={9} /> Countries</>, label: "Global Reach" },
            { icon: "🎓", value: "28", label: "Programmes" },
            { icon: "🏅", value: "NVQ-J", label: "Certified" },
          ].map((s, i) => (
            <Reveal key={i} delay={0.15 + i * 0.08} style={{ flex: "1 1 180px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", borderRadius: "18px", padding: "18px 22px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${T.gold}0D`; e.currentTarget.style.borderColor = `${T.gold}35`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}>
                <span style={{ fontSize: "24px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: f.display, fontSize: "24px", fontWeight: "800", color: T.gold, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: f.body, fontSize: "11px", color: T.grayLight, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "600", marginTop: "3px" }}>{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <svg viewBox="0 0 1440 80" style={{ position: "absolute", bottom: -1, left: 0, width: "100%", zIndex: 5 }}><path d="M0,50 C480,80 960,20 1440,60 L1440,80 L0,80 Z" fill={T.cream} /></svg>
      </div>

      {/* ━━━━━━ MARQUEE ━━━━━━ */}
      <div style={{ padding: "44px 0", overflow: "hidden", width: "100%", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", animation: "marquee 25s linear infinite", width: "max-content" }}>
          {[...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "28px", padding: "0 28px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: f.display, fontSize: "24px", fontWeight: "700", color: T.navy }}>{d}</span>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.gold, boxShadow: `0 0 8px ${T.gold}40` }} />
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━ ADVANTAGES — FULL BLEED ALTERNATING ━━━━━━ */}
      <div style={{ width: "100%" }}>
        {[
          { icon: "📱", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80", title: "Study From Anywhere on Earth", desc: "Access all learner guides, audio sessions, and interactive quizzes directly from your smartphone's home screen. No app store needed — just open your browser and learn.", tag: "MOBILITY", color: T.teal },
          { icon: "🤖", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80", title: "Your 24/7 AI-Powered Tutor", desc: "Stuck at 2 AM? Our Intelligent Study Assistant is built right into your digital classroom — explaining complex topics, brainstorming ideas, and helping you prepare for assessments instantly.", tag: "INTELLIGENCE", color: T.violet },
          { icon: "🏅", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80", title: "NVQ-J: Credentials That Travel", desc: "We prepare you for the exact same NCTVET assessments as traditional institutions. Your NVQ-J is recognised in 53 Commonwealth countries, across CARICOM, and accepted in the USA.", tag: "CERTIFICATION", color: T.emerald },
          { icon: "🌍", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80", title: "A Borderless Digital Campus", desc: "Students from 9 countries and counting. No visas. No relocation. No rigid class times. Just a world-class NCTVET-aligned education delivered to your device, wherever you are.", tag: "GLOBAL", color: T.gold },
        ].map((item, i) => {
          const reversed = i % 2 === 1;
          const [hovered, setHovered] = useState(false);
          return (
            <Reveal key={i} delay={0.1}>
              <div style={{ display: "flex", flexDirection: reversed ? "row-reverse" : "row", flexWrap: "wrap", width: "100%", minHeight: "500px", background: i % 2 === 0 ? T.cream : T.offWhite }}>
                {/* Image side — 55% */}
                <div style={{ flex: "1 1 55%", minHeight: "400px", position: "relative", overflow: "hidden" }}
                  onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: reversed ? `linear-gradient(to left, ${T.navy}40, transparent 50%)` : `linear-gradient(to right, ${T.navy}40, transparent 50%)` }} />
                  {/* Floating badge on image */}
                  <div style={{ position: "absolute", top: "32px", [reversed ? "right" : "left"]: "32px", background: `${T.navy}DD`, backdropFilter: "blur(12px)", padding: "12px 20px", borderRadius: "14px", border: `1px solid ${item.color}40` }}>
                    <div style={{ fontFamily: f.mono, fontSize: "11px", color: item.color, letterSpacing: "2px", fontWeight: "700" }}>{item.tag}</div>
                  </div>
                </div>
                {/* Text side — 45% */}
                <div style={{ flex: "1 1 40%", padding: "80px 5%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontSize: "48px", marginBottom: "20px", display: "block" }}>{item.icon}</span>
                  <h3 style={{ fontFamily: f.display, fontSize: "clamp(30px, 3vw, 44px)", color: T.navy, fontWeight: "900", margin: "0 0 20px", lineHeight: 1.1 }}>{item.title}</h3>
                  <p style={{ fontFamily: f.body, fontSize: "18px", color: T.gray, lineHeight: 1.8, margin: "0 0 32px", maxWidth: "540px" }}>{item.desc}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: item.color, fontFamily: f.body, fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                    Learn More <span style={{ fontSize: "20px" }}>→</span>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ━━━━━━ PATHWAYS — FULL BLEED HORIZONTAL SCROLL FEEL ━━━━━━ */}
      <div style={{ width: "100%", padding: "120px 0 100px", background: T.navyDeep, position: "relative", overflow: "hidden" }}>
        <Particles />
        {[{ c: T.gold, s: "500px", t: "10%", l: "70%" }, { c: T.violet, s: "400px", t: "50%", l: "-5%" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: `radial-gradient(circle, ${o.c}15 0%, transparent 70%)`, top: o.t, left: o.l, filter: "blur(80px)", pointerEvents: "none" }} />
        ))}

        <div style={{ padding: "0 3%", marginBottom: "60px", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "20px" }}>
              <div>
                <div style={{ fontFamily: f.mono, fontSize: "13px", color: T.gold, letterSpacing: "3px", textTransform: "uppercase", fontWeight: "700", marginBottom: "16px" }}>Academic Pathways</div>
                <h2 style={{ fontFamily: f.display, fontSize: "clamp(36px, 4vw, 60px)", color: T.white, fontWeight: "900", lineHeight: 1.05, margin: 0 }}>Five Levels. <span style={{ color: T.gold }}>One Vision.</span></h2>
              </div>
              <p style={{ fontFamily: f.body, fontSize: "17px", color: T.grayLight, maxWidth: "500px", lineHeight: 1.7, textAlign: "right" }}>From foundational job certificates to executive qualifications — your NCTVET-aligned career framework.</p>
            </div>
          </Reveal>
        </div>

        <div style={{ padding: "0 3%", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", position: "relative", zIndex: 2 }}>
          {PATHWAYS.map((p, i) => {
            const [h, setH] = useState(false);
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", borderRadius: "24px", overflow: "hidden", height: "480px", cursor: "pointer", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-12px)" : "none", boxShadow: h ? "0 40px 80px rgba(0,0,0,0.5)" : "0 16px 40px rgba(0,0,0,0.2)" }}>
                  <img src={p.img} alt={p.level} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)", transform: h ? "scale(1.12)" : "scale(1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.navyDeep} 0%, ${T.navyDeep}BB 35%, transparent 100%)` }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: p.color, transform: h ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.5s" }} />
                  <div style={{ position: "absolute", inset: 0, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ background: p.color, color: "#fff", padding: "6px 14px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: f.body }}>{p.tag}</div>
                      <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "6px 12px", fontSize: "10px", color: T.goldLight, fontFamily: f.mono, fontWeight: "700" }}>NCTVET</div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: f.display, fontSize: "28px", color: T.white, fontWeight: "800", margin: "0 0 10px", lineHeight: 1.1 }}>{p.level}</h3>
                      <p style={{ fontFamily: f.body, fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: "0 0 20px", lineHeight: 1.5 }}>{p.desc}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: h ? "14px" : "8px", color: p.color, fontSize: "13px", fontWeight: "800", fontFamily: f.body, transition: "gap 0.3s" }}>Explore <span style={{ fontSize: "18px" }}>→</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ━━━━━━ PHOTO STRIP — FULL BLEED ━━━━━━ */}
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", height: "200px" }}>
        {[
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80",
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80",
          "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&q=80",
          "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&q=80",
        ].map((src, i) => (
          <div key={i} style={{ overflow: "hidden", position: "relative" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
            <div style={{ position: "absolute", inset: 0, background: `${T.navy}30` }} />
          </div>
        ))}
      </div>

      {/* ━━━━━━ CTA — FULL BLEED ━━━━━━ */}
      <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.navyDeep}F8 0%, ${T.navy}E8 100%)` }} />
        <Particles />
        <div style={{ position: "relative", zIndex: 1, padding: "120px 3%", width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "40px" }}>
          <div style={{ flex: "1 1 500px" }}>
            <Reveal>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎓</div>
              <h2 style={{ fontFamily: f.display, fontSize: "clamp(38px, 4vw, 60px)", color: T.white, fontWeight: "900", lineHeight: 1.08, margin: "0 0 20px" }}>Classes Begin<br /><span style={{ color: T.gold }}>Monday April 13, 2026.</span></h2>
              <p style={{ fontFamily: f.body, fontSize: "20px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "600px" }}>Join hundreds of students advancing their careers through our digital campus. Your application takes less than 10 minutes.</p>
              <button style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, border: "none", padding: "22px 56px", borderRadius: "20px", fontFamily: f.body, fontSize: "19px", fontWeight: "800", cursor: "pointer", boxShadow: `0 16px 48px ${T.gold}40` }}>Start Your Application</button>
            </Reveal>
          </div>
          <Reveal delay={0.2} style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: "🌍", text: "Recognised in 53+ Commonwealth countries" },
              { icon: "📱", text: "100% digital — study from any device" },
              { icon: "🤖", text: "24/7 AI Study Assistant built in" },
              { icon: "⚡", text: "Apply in under 10 minutes" },
              { icon: "💰", text: "Flexible Gold, Silver & Bronze payment plans" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 24px", backdropFilter: "blur(16px)" }}>
                <span style={{ fontSize: "22px" }}>{item.icon}</span>
                <span style={{ fontFamily: f.body, fontSize: "15px", color: T.white, fontWeight: "600" }}>{item.text}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* ━━━━━━ FOOTER ━━━━━━ */}
      <div style={{ background: T.navyDeep, padding: "50px 3%", borderTop: `3px solid ${T.gold}`, width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", width: "100%" }}>
          <div>
            <div style={{ fontFamily: f.display, fontSize: "22px", fontWeight: "800", color: T.white }}>CTS ETS</div>
            <div style={{ fontFamily: f.body, fontSize: "13px", color: T.grayLight, marginTop: "6px" }}>Called to Serve, Committed to Excellence</div>
            <div style={{ fontFamily: f.mono, fontSize: "11px", color: T.gray, marginTop: "4px" }}>COJ Reg. No. 16007/2025</div>
          </div>
          <div style={{ fontFamily: f.body, fontSize: "13px", color: T.gray }}>© {new Date().getFullYear()} CTS Empowerment & Training Solutions. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}