import { useState, useEffect, useRef } from "react";

const T = {
  navy: "#011E40", navyDeep: "#000D1F", gold: "#C8A951", goldLight: "#E8D48B",
  white: "#FFFFFF", offWhite: "#F7F5F0", cream: "#FAF8F3",
  gray: "#6B7A8D", grayLight: "#9BA8B7", border: "rgba(1,30,64,0.08)",
  emerald: "#0D9668", teal: "#0891B2", coral: "#E8543E", violet: "#7C3AED", rose: "#DB2777",
};
const font = { display: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" };

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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(50px)", transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>{children}</div>;
}

function Particles() {
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ position: "absolute", width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`, background: T.gold, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.15 + Math.random() * 0.25, animation: `float${i % 3} ${6 + Math.random() * 8}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />)}
  </div>;
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  const PATHWAYS = [
    { id: "cert", level: "Job Certificates", tag: "Entry Level", desc: "Fast-track your entry into the workforce with foundational digital and professional skills.", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80", color: T.emerald },
    { id: "l2", level: "Level 2", tag: "Vocational", desc: "Industry-standard qualifications in Customer Service, Data Operations, and more.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80", color: T.teal },
    { id: "l3", level: "Level 3", tag: "Diploma", desc: "Advanced training for supervisors and team leaders in Business and Administration.", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", color: T.violet },
    { id: "l4", level: "Level 4", tag: "Associate", desc: "Strategic management and advanced technical competencies for departmental leadership.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", color: T.coral },
    { id: "l5", level: "Level 5", tag: "Bachelor's", desc: "Top-tier executive qualifications for directors and senior leaders.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&q=80", color: T.rose },
  ];

  const ADVANTAGES = [
    { icon: "📱", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", title: "Study Anywhere", desc: "Access all learner guides, audio sessions, and interactive quizzes directly from your smartphone — no app store needed.", color: T.teal },
    { icon: "🤖", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80", title: "24/7 AI Tutor", desc: "Stuck at 2 AM? Our Intelligent Study Assistant is built right into your classroom to explain complex topics instantly.", color: T.violet },
    { icon: "🏅", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80", title: "NVQ-J Certified", desc: "Earn the exact same NCTVET qualifications as traditional institutions — recognised in 53 Commonwealth countries.", color: T.emerald },
    { icon: "🌍", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80", title: "Global Credentials", desc: "Your NVQ-J opens doors across CARICOM, the UK, Canada, Australia, and beyond — with proven acceptance in the USA.", color: T.gold },
  ];

  const DISCIPLINES = ["Business Administration", "Customer Service", "Information Technology", "Digital Literacy", "Data Operations", "Leadership & Management", "Accounting & Finance"];

  const HoverCard = ({ children, style: s = {} }) => {
    const [h, setH] = useState(false);
    return <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-14px)" : "none", boxShadow: h ? "0 40px 80px rgba(0,0,0,0.18)" : "0 16px 40px rgba(0,0,0,0.06)", ...s }}>{typeof children === 'function' ? children(h) : children}</div>;
  };

  return (
    <div style={{ background: T.cream, minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes float0 { 0%,100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(15px); } }
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px) translateX(-20px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-40px) translateX(10px); } }
        @keyframes pulse { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.15); } }
        @keyframes heroIn { 0% { opacity:0; transform:translateY(40px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes badgeIn { 0% { opacity:0; transform:translateY(20px) scale(0.9); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        ::selection { background: ${T.gold}40; color: ${T.navy}; }
      `}</style>

      {/* ━━━ HERO ━━━ */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", background: T.navyDeep, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, transform: `translateY(${scrollY * 0.25}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${T.navyDeep} 0%, ${T.navy} 50%, ${T.navyDeep} 100%)`, opacity: 0.93 }} />
        <Particles />
        {[{ c: T.gold, s: "500px", t: "-10%", l: "65%" }, { c: T.teal, s: "400px", t: "65%", l: "-5%" }, { c: T.violet, s: "300px", t: "25%", l: "85%" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: `radial-gradient(circle, ${o.c}25 0%, transparent 70%)`, top: o.t, left: o.l, filter: "blur(60px)", animation: `pulse 6s ease-in-out infinite ${i * 2}s`, pointerEvents: "none" }} />
        ))}

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "24px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontFamily: font.display, fontWeight: "900", color: T.navy, boxShadow: `0 4px 20px ${T.gold}40` }}>C</div>
            <div>
              <div style={{ fontFamily: font.display, fontSize: "18px", fontWeight: "800", color: T.white, lineHeight: 1 }}>CTS ETS</div>
              <div style={{ fontFamily: font.mono, fontSize: "10px", color: T.goldLight, letterSpacing: "2px" }}>DIGITAL CAMPUS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: T.white, padding: "12px 28px", borderRadius: "14px", fontFamily: font.body, fontSize: "14px", fontWeight: "700", cursor: "pointer", backdropFilter: "blur(10px)" }}>Programmes</button>
            <button style={{ background: `linear-gradient(135deg, ${T.coral}, ${T.rose})`, border: "none", color: T.white, padding: "12px 28px", borderRadius: "14px", fontFamily: font.body, fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: `0 4px 20px ${T.coral}40` }}>Apply Now</button>
          </div>
        </div>

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 10, padding: "140px 5% 60px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px" }}>
            <div style={{ flex: "1 1 550px" }}>
              <div style={{ animation: "badgeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: `linear-gradient(90deg, ${T.gold}20, transparent)`, border: `1px solid ${T.gold}40`, padding: "10px 22px", borderRadius: "40px", marginBottom: "32px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.emerald, boxShadow: `0 0 12px ${T.emerald}`, animation: "pulse 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: font.mono, fontSize: "13px", fontWeight: "700", color: T.goldLight, letterSpacing: "1px" }}>SPRING COHORT — CLASSES BEGIN APRIL 13, 2026</span>
                </div>
              </div>
              <h1 style={{ fontFamily: font.display, fontSize: "clamp(42px, 5.5vw, 76px)", color: T.white, fontWeight: "900", lineHeight: 1.05, margin: "0 0 28px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
                An Executive <span style={{ color: T.gold, position: "relative", display: "inline-block" }}>International<span style={{ position: "absolute", bottom: "-4px", left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, ${T.gold}, transparent)`, borderRadius: "2px" }} /></span><br />Gateway.
              </h1>
              <p style={{ fontFamily: font.body, fontSize: "clamp(17px, 1.6vw, 21px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: "620px", margin: "0 0 40px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
                Earn <strong style={{ color: T.white }}>internationally recognised NCTVET qualifications</strong> from a fully digital campus. No rigid class times. No physical classroom. Just world-class education from your device.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
                <button style={{ background: `linear-gradient(135deg, ${T.coral}, ${T.rose})`, color: T.white, border: "none", padding: "20px 48px", borderRadius: "18px", fontFamily: font.body, fontSize: "17px", fontWeight: "800", cursor: "pointer", boxShadow: `0 12px 40px ${T.coral}50` }}>Apply Now — Secure Your Spot</button>
                <button style={{ background: "rgba(255,255,255,0.04)", color: T.white, border: "1px solid rgba(255,255,255,0.15)", padding: "20px 48px", borderRadius: "18px", fontFamily: font.body, fontSize: "17px", fontWeight: "700", cursor: "pointer", backdropFilter: "blur(10px)" }}>Explore 28 Programmes</button>
              </div>
            </div>

            {/* Right side glass cards */}
            <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "14px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
              {[
                { icon: "🌍", label: "Recognised in 53+ Countries", sub: "Commonwealth & CARICOM" },
                { icon: "📱", label: "100% Digital Campus", sub: "Study from your phone" },
                { icon: "🤖", label: "AI-Powered Learning", sub: "24/7 Study Assistant" },
                { icon: "🎓", label: "NVQ-J Certification", sub: "Same standard, digital delivery" },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "18px", backdropFilter: "blur(20px)", transition: "all 0.3s", cursor: "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${T.gold}12`; e.currentTarget.style.borderColor = `${T.gold}40`; e.currentTarget.style.transform = "translateX(8px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: "28px" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: font.body, fontSize: "15px", fontWeight: "700", color: T.white }}>{item.label}</div>
                    <div style={{ fontFamily: font.mono, fontSize: "11px", color: T.grayLight, marginTop: "2px" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "80px" }}>
            {[
              { icon: "📅", value: "Since 2018", label: "Facilitating Learning" },
              { icon: "📊", value: <Counter end={94} suffix="%" />, label: "Completion Rate" },
              { icon: "⭐", value: "4.8/5", label: "Student Rating" },
              { icon: "🌍", value: <><Counter end={9} /> Countries</>, label: "Global Reach" },
            ].map((s, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1} style={{ flex: "1 1 200px", minWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: "20px", padding: "20px 28px", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${T.gold}0D`; e.currentTarget.style.borderColor = `${T.gold}40`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: "28px" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: font.display, fontSize: "28px", fontWeight: "800", color: T.gold, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: font.body, fontSize: "12px", color: T.grayLight, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "600", marginTop: "4px" }}>{s.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 100" style={{ position: "absolute", bottom: -1, left: 0, width: "100%", zIndex: 5 }}><path d="M0,60 C360,100 720,20 1440,80 L1440,100 L0,100 Z" fill={T.cream} /></svg>
      </div>

      {/* ━━━ MARQUEE ━━━ */}
      <div style={{ padding: "48px 0", overflow: "hidden", background: T.cream, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", animation: "marquee 30s linear infinite", width: "max-content" }}>
          {[...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "24px", padding: "0 24px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: font.display, fontSize: "22px", fontWeight: "700", color: T.navy }}>{d}</span>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.gold }} />
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ PATHWAYS ━━━ */}
      <div style={{ padding: "120px 5%", maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{ fontFamily: font.mono, fontSize: "13px", color: T.violet, letterSpacing: "3px", textTransform: "uppercase", fontWeight: "700", marginBottom: "16px" }}>Academic Pathways</div>
            <h2 style={{ fontFamily: font.display, fontSize: "clamp(36px, 4vw, 56px)", color: T.navy, fontWeight: "900", margin: "0 0 20px", lineHeight: 1.1 }}>Five Levels. <span style={{ color: T.gold }}>One Vision.</span></h2>
            <p style={{ fontFamily: font.body, fontSize: "18px", color: T.gray, maxWidth: "700px", margin: "0 auto", lineHeight: 1.7 }}>From foundational job certificates to executive qualifications — our NCTVET-aligned framework maps directly to your career trajectory.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
          {PATHWAYS.map((p, i) => {
            const [h, setH] = useState(false);
            return (
              <Reveal key={p.id} delay={i * 0.1}>
                <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", borderRadius: "28px", overflow: "hidden", height: "420px", cursor: "pointer", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-16px) scale(1.02)" : "none", boxShadow: h ? "0 40px 80px rgba(0,0,0,0.25)" : "0 20px 40px rgba(0,0,0,0.1)" }}>
                  <img src={p.img} alt={p.level} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)", transform: h ? "scale(1.1)" : "scale(1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.navyDeep} 0%, ${T.navyDeep}CC 40%, transparent 100%)` }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: p.color, transform: h ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
                  <div style={{ position: "absolute", inset: 0, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ background: p.color, color: "#fff", padding: "8px 18px", borderRadius: "14px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: font.body }}>{p.tag}</div>
                      <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "12px", padding: "8px 14px", fontSize: "11px", color: T.goldLight, fontFamily: font.mono, fontWeight: "700", border: "1px solid rgba(255,255,255,0.1)" }}>NCTVET</div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: font.display, fontSize: "34px", color: T.white, fontWeight: "800", margin: "0 0 12px", lineHeight: 1.1 }}>{p.level}</h3>
                      <p style={{ fontFamily: font.body, fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: "0 0 24px", lineHeight: 1.6 }}>{p.desc}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: h ? "16px" : "10px", color: p.color, fontSize: "14px", fontWeight: "800", fontFamily: font.body, transition: "gap 0.3s" }}>Explore Programme <span style={{ fontSize: "20px", transition: "transform 0.3s", transform: h ? "translateX(4px)" : "none" }}>→</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ━━━ ADVANTAGES ━━━ */}
      <div style={{ padding: "100px 5% 120px", background: T.offWhite }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <div style={{ fontFamily: font.mono, fontSize: "13px", color: T.teal, letterSpacing: "3px", textTransform: "uppercase", fontWeight: "700", marginBottom: "16px" }}>The Digital Advantage</div>
              <h2 style={{ fontFamily: font.display, fontSize: "clamp(36px, 4vw, 56px)", color: T.navy, fontWeight: "900", margin: 0, lineHeight: 1.1 }}>Education, <span style={{ color: T.gold }}>Redesigned.</span></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            {ADVANTAGES.map((f, i) => {
              const [h, setH] = useState(false);
              return (
                <Reveal key={i} delay={i * 0.12}>
                  <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: T.white, borderRadius: "28px", overflow: "hidden", border: `1px solid ${T.border}`, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-14px)" : "none", boxShadow: h ? `0 30px 60px rgba(1,30,64,0.12), 0 0 0 1px ${f.color}30` : "0 10px 30px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                    <div style={{ height: "220px", position: "relative", overflow: "hidden" }}>
                      <img src={f.img} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)", transform: h ? "scale(1.08)" : "scale(1)" }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.navy}DD, transparent 60%)` }} />
                      <div style={{ position: "absolute", bottom: "-28px", left: "28px", width: "64px", height: "64px", borderRadius: "18px", background: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", transition: "transform 0.3s", transform: h ? "rotate(-8deg) scale(1.1)" : "none" }}>{f.icon}</div>
                    </div>
                    <div style={{ padding: "48px 32px 36px", flex: 1 }}>
                      <h3 style={{ fontFamily: font.display, fontSize: "24px", color: T.navy, fontWeight: "800", marginBottom: "14px" }}>{f.title}</h3>
                      <p style={{ fontFamily: font.body, fontSize: "15px", color: T.gray, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* ━━━ CTA ━━━ */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.navyDeep}F5 0%, ${T.navy}E0 100%)` }} />
        <Particles />
        <div style={{ position: "relative", zIndex: 1, padding: "120px 5%", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎓</div>
            <h2 style={{ fontFamily: font.display, fontSize: "clamp(36px, 4vw, 56px)", color: T.white, fontWeight: "900", lineHeight: 1.1, margin: "0 0 20px" }}>Classes Begin<br /><span style={{ color: T.gold }}>Monday April 13, 2026.</span></h2>
            <p style={{ fontFamily: font.body, fontSize: "20px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 48px" }}>Join hundreds of students advancing their careers through our digital campus. Your application takes less than 10 minutes.</p>
            <button style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, border: "none", padding: "22px 56px", borderRadius: "20px", fontFamily: font.body, fontSize: "19px", fontWeight: "800", cursor: "pointer", boxShadow: `0 16px 48px ${T.gold}40` }}>Start Your Application</button>
          </Reveal>
        </div>
      </div>

      {/* ━━━ FOOTER ━━━ */}
      <div style={{ background: T.navyDeep, padding: "60px 5%", borderTop: `3px solid ${T.gold}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
          <div>
            <div style={{ fontFamily: font.display, fontSize: "20px", fontWeight: "800", color: T.white }}>CTS ETS</div>
            <div style={{ fontFamily: font.body, fontSize: "13px", color: T.grayLight, marginTop: "6px" }}>Called to Serve, Committed to Excellence</div>
            <div style={{ fontFamily: font.mono, fontSize: "11px", color: T.gray, marginTop: "4px" }}>COJ Reg. No. 16007/2025</div>
          </div>
          <div style={{ fontFamily: font.body, fontSize: "13px", color: T.gray }}>© {new Date().getFullYear()} CTS Empowerment & Training Solutions. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}