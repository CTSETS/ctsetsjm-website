import React, { useState } from "react";
import GatewayQuiz from "./GatewayQuiz";

// ─── PREMIUM THEME DEFINITIONS ───
const T = {
  navy: "#011E40", navyDeep: "#000D1F", gold: "#C8A951", white: "#FFFFFF", 
  gray: "#4B5563", grayLight: "#9CA3AF", border: "rgba(1,30,64,0.08)",
  teal: "#0891B2", coral: "#EA580C", cream: "#F3F4F6", emerald: "#059669"
};
const f = { display: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" };

export default function OrientationGateway({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  // ─── 15-POINT ORIENTATION DATA (No images needed now!) ───
  const SLIDES = [
    { 
      icon: "🏛️", title: "Welcome to CTS ETS", 
      content: "Your journey to professional certification starts right here on our fully digital campus. We are thrilled to have you!"
    },
    { 
      icon: "🌍", title: "Who We Are", 
      content: "We deliver NCTVET-certified programmes through a 100% online digital campus. Our mission is to empower you with career-ready skills accessible from anywhere in the world."
    },
    { 
      icon: "✈️", title: "Credentials That Travel", 
      content: "Earn an NVQ-J recognised in 53 Commonwealth & CARICOM nations. These are not just local certificates—these are globally portable credentials that open real doors."
    },
    { 
      icon: "🔐", title: "Your First Digital Login", 
      content: "Access the portal using your Student ID and a secure One-Time Password (OTP) sent to your email. Bookmark the portal URL so your digital campus is always one click away!"
    },
    { 
      icon: "⚡", title: "Your First 48 Hours", 
      content: "Download your Digital ID, check your Valid Term, and explore the portal. Most importantly, pass the Knowledge Check at the end of this orientation to unlock Module 1."
    },
    { 
      icon: "💻", title: "Student Portal Overview", 
      content: "Navigate 'My Classroom' for learning, 'My Profile' for your ID, 'NCTVET Portfolio' for practical assignments, and 'My Finances' for your account status."
    },
    { 
      icon: "⏳", title: "Pace & Structure", 
      content: "Your programme is self-paced but bound by a 'Valid Term' deadline. The flexibility of digital learning is your advantage—stay ahead of your deadlines and you will thrive."
    },
    { 
      icon: "📅", title: "Deadlines & Extensions", 
      content: "If you are falling behind, take action early. Extension requests must be sent to administration@ctsetsjm.com before your Valid Term expires."
    },
    { 
      icon: "🏅", title: "The 70% Mastery Rule", 
      content: "You must score 70% or higher on end-of-module Knowledge Checks to earn your Digital Badge and unlock the next section. Retakes are always allowed."
    },
    { 
      icon: "⚖️", title: "Academic Integrity", 
      content: "Submitting someone else's work is a serious offence that leads to automatic module failure. Your digital qualification means more when you have truly earned it."
    },
    { 
      icon: "🤖", title: "24/7 AI Study Assistant", 
      content: "Use your AI Tutor to brainstorm and explain complex topics. Do NOT use it to write final assignments. It helps you learn, but the work must be yours."
    },
    { 
      icon: "💳", title: "Financial Policies", 
      content: "Your portal access is linked to your financial status. If a payment plan falls into arrears, access is restricted until cleared. Contact finance@ctsetsjm.com for assistance."
    },
    { 
      icon: "🛡️", title: "Account Security", 
      content: "Treat your student credentials like your online banking login. Never share your OTP codes. For technical issues, contact support@ctsetsjm.com immediately."
    },
    { 
      icon: "🤝", title: "Your Support Network", 
      content: "From Assessment to Finance, IT, and Student Success—we are here for you. Your success is our mission. Now go pass that Knowledge Check and unlock Module 1!"
    },
    { 
      icon: "📱", title: "Install the Digital Campus", 
      content: "No App Store needed! Open the portal in Safari or Chrome, tap 'Share' or the menu, and select 'Add to Home Screen' to carry your campus in your pocket."
    }
  ];

  const progressPercentage = ((currentSlide + 1) / SLIDES.length) * 100;
  const isLastSlide = currentSlide === SLIDES.length - 1;

  const nextSlide = () => { if (currentSlide < SLIDES.length - 1) setCurrentSlide(currentSlide + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(currentSlide - 1); };

  // ─── GATEWAY QUIZ VIEW ───
  if (showQuiz) {
    return (
      <div style={{ minHeight: "100vh", background: T.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: T.white, width: "100%", maxWidth: "800px", padding: "60px", borderRadius: "32px", boxShadow: "0 20px 50px rgba(1,30,64,0.1)", textAlign: "center" }}>
          <span style={{ fontSize: "48px", display: "block", marginBottom: "20px" }}>📝</span>
          <h2 style={{ fontFamily: f.display, fontSize: "40px", color: T.navy, fontWeight: "900", marginBottom: "16px" }}>Orientation Knowledge Check</h2>
          <p style={{ fontFamily: f.body, fontSize: "18px", color: T.gray, marginBottom: "40px" }}>You must score 70% or higher to permanently unlock your digital campus.</p>
          
          <GatewayQuiz onPass={onComplete} />

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "30px" }}>
            <button onClick={() => setShowQuiz(false)} style={{ padding: "12px 24px", background: "transparent", color: T.navy, border: `2px solid ${T.border}`, borderRadius: "12px", fontFamily: f.body, fontWeight: "700", cursor: "pointer" }}>
              Review Slides
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PRESENTATION VIEW ───
  return (
    <div style={{ minHeight: "100vh", background: T.navyDeep, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <style>
        {`
          @keyframes pulseGlow {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.1); opacity: 0.8; }
          }
        `}
      </style>
      
      <div style={{ display: "flex", background: T.white, width: "100%", maxWidth: "1200px", minHeight: "650px", borderRadius: "32px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        
        {/* LEFT: BRANDED DYNAMIC SIDE (No External Images Needed) */}
        <div style={{ flex: "1 1 50%", position: "relative", background: `linear-gradient(135deg, ${T.navyDeep} 0%, ${T.navy} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", overflow: "hidden" }}>
            
            {/* Animated Glowing Background Effect */}
            <div style={{ position: "absolute", width: "150%", height: "150%", borderRadius: "50%", background: `radial-gradient(circle, ${T.teal}15 0%, transparent 60%)`, top: "-25%", left: "-25%", animation: "pulseGlow 4s infinite alternate" }} />

            {/* Massive Dynamic Icon */}
            <div style={{ fontSize: "140px", marginBottom: "30px", position: "relative", zIndex: 2, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }}>
                {SLIDES[currentSlide].icon}
            </div>

            {/* Dynamic Title */}
            <h2 style={{ fontFamily: f.display, fontSize: "clamp(32px, 4vw, 42px)", color: T.white, fontWeight: "900", textAlign: "center", position: "relative", zIndex: 2, lineHeight: 1.2, maxWidth: "90%" }}>
                {SLIDES[currentSlide].title}
            </h2>

            {/* Dark Mode Logo Overlay */}
            <div style={{ position: "absolute", top: "30px", left: "30px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", padding: "10px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
               <div style={{ width: "30px", height: "30px", background: T.gold, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: T.navyDeep, fontFamily: f.display, fontWeight: "900", fontSize: "16px" }}>C</div>
               <span style={{ fontFamily: f.body, fontSize: "12px", fontWeight: "800", color: T.white, letterSpacing: "1px" }}>CTS ETS</span>
            </div>
        </div>

        {/* RIGHT: CONTENT SIDE */}
        <div style={{ flex: "1 1 50%", padding: "60px 80px", display: "flex", flexDirection: "column", position: "relative" }}>
          
          {/* Progress Bar Header */}
          <div style={{ marginBottom: "50px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontFamily: f.mono, fontSize: "12px", color: T.grayLight, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>Orientation</span>
              <span style={{ fontFamily: f.mono, fontSize: "12px", color: T.teal, fontWeight: "800" }}>{currentSlide + 1} / {SLIDES.length}</span>
            </div>
            <div style={{ background: T.cream, height: "6px", width: "100%", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPercentage}%`, background: T.teal, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)", borderRadius: "3px" }} />
            </div>
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "56px", display: "block", marginBottom: "24px" }}>{SLIDES[currentSlide].icon}</span>
            <h2 style={{ fontFamily: f.display, fontSize: "40px", color: T.navy, fontWeight: "900", marginBottom: "20px", lineHeight: 1.1 }}>
              {SLIDES[currentSlide].title}
            </h2>
            <p style={{ fontFamily: f.body, fontSize: "20px", color: T.gray, lineHeight: 1.6 }}>
              {SLIDES[currentSlide].content}
            </p>
          </div>

          {/* Controls Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "50px", paddingTop: "30px", borderTop: `1px solid ${T.border}` }}>
            
            <button onClick={prevSlide} disabled={currentSlide === 0} style={{ padding: "12px 0", background: "transparent", border: "none", color: currentSlide === 0 ? "transparent" : T.grayLight, fontFamily: f.body, fontWeight: "700", cursor: currentSlide === 0 ? "default" : "pointer", fontSize: "16px", transition: "color 0.2s" }} onMouseEnter={(e) => {if(currentSlide !== 0) e.currentTarget.style.color = T.navy}} onMouseLeave={(e) => {if(currentSlide !== 0) e.currentTarget.style.color = T.grayLight}}>
              ← Previous
            </button>

            {isLastSlide ? (
              <button onClick={() => setShowQuiz(true)} style={{ padding: "18px 40px", background: T.coral, color: T.white, border: "none", borderRadius: "16px", fontFamily: f.body, fontWeight: "900", cursor: "pointer", fontSize: "18px", boxShadow: `0 10px 25px ${T.coral}50`, transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                Start Knowledge Check
              </button>
            ) : (
              <button onClick={nextSlide} style={{ padding: "18px 40px", background: T.navy, color: T.white, border: "none", borderRadius: "16px", fontFamily: f.body, fontWeight: "800", cursor: "pointer", fontSize: "16px", boxShadow: "0 10px 25px rgba(1,30,64,0.2)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                Next Step →
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}