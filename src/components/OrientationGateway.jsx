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
  const [direction, setDirection] = useState("next"); // Tracks which way the book flips

  // ─── 15-POINT ORIENTATION DATA (FULL RICH TEXT) ───
  const SLIDES = [
    { 
      icon: "🏛️", title: "Welcome to CTS ETS", 
      image: "/logo.jpg",
      content: (
        <div>
          <h4 style={{ color: T.gold, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>"Called to Serve, Committed to Excellence."</h4>
          <p>Your journey to professional certification starts right here on our fully digital campus. We are thrilled to have you!</p>
        </div>
      )
    },
    { 
      icon: "🌍", title: "Who We Are", 
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      content: (
        <div>
          <p>CTS ETS is a registered Jamaican post-secondary digital vocational training institution <em>(COJ Reg. No. 16007/2025)</em>.</p>
          <p style={{ marginTop: "12px" }}>We deliver nationally and internationally recognised programmes certified by NCTVET entirely through a purpose-built digital campus.</p>
          <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}><strong>100% online</strong> — no physical classroom required.</li>
            <li><strong>Borderless</strong> — accessible from anywhere in the world.</li>
          </ul>
          <p style={{ marginTop: "12px" }}>Our mission is to empower learners with career-ready skills and globally respected credentials through the power of digital education.</p>
        </div>
      )
    },
    { 
      icon: "✈️", title: "Credentials That Travel With You", 
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      content: (
        <div>
          <p>Upon completion, students earn an NCTVET-certified National Vocational Qualification of Jamaica (NVQ-J).</p>
          <ul style={{ marginTop: "12px", paddingLeft: "20px", marginBottom: "16px" }}>
            <li style={{ marginBottom: "8px" }}>Recognised in <strong>53 Commonwealth countries</strong> (including the UK, Canada, Australia, and New Zealand).</li>
            <li style={{ marginBottom: "8px" }}>Numerous success stories of acceptance in the <strong>USA</strong>.</li>
            <li style={{ marginBottom: "8px" }}>A basic requirement for free movement of skilled labour within <strong>CARICOM and the CSME</strong>.</li>
          </ul>
          <p>Students receive verifiable digital certificates. Select programmes carry additional international certification.</p>
          <p style={{ marginTop: "16px", fontWeight: "bold", color: T.navy }}>"These are not just local certificates — these are globally portable credentials that open real doors."</p>
        </div>
      )
    },
    { 
      icon: "🔐", title: "Getting Started — Your First Digital Login", 
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      content: (
        <div>
          <ol style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li style={{ marginBottom: "12px" }}><strong>Visit the Digital Student Portal</strong> at <em>https://www.ctsetsjm.com/#student-portal</em>.</li>
            <li style={{ marginBottom: "12px" }}><strong>Enter your Student ID</strong> to continue.</li>
            <li style={{ marginBottom: "12px" }}><strong>Check your email inbox</strong> for a secure One-Time Password (OTP). <br/><span style={{ fontSize: "14px", color: T.grayLight }}>An OTP is a temporary code that expires after a short period and can only be used once, keeping your account safe.</span></li>
            <li><strong>Enter your OTP</strong> to access your personalised Digital Dashboard.</li>
          </ol>
          <div style={{ padding: "12px", background: T.cream, borderLeft: `4px solid ${T.teal}`, borderRadius: "4px" }}>
            <strong>💡 Tip:</strong> Add the portal URL to your browser bookmarks so your digital campus is always one click away.
          </div>
        </div>
      )
    },
    { 
      icon: "⚡", title: "Your First 48 Hours — Action Checklist", 
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
      content: (
        <div>
          <p style={{ fontWeight: "bold", marginBottom: "16px", color: T.coral }}>You've got 48 hours — let's go!</p>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>☑️ Download and save your Digital Student ID.</li>
            <li style={{ marginBottom: "10px" }}>☑️ Check your <strong>Valid Term</strong> (your programme completion deadline).</li>
            <li style={{ marginBottom: "10px" }}>☑️ Explore each tab of your Portal: Classroom, Profile, Portfolio, and Finances.</li>
            <li style={{ marginBottom: "10px" }}>☑️ Save all CTS ETS department email addresses to your contacts.</li>
            <li style={{ marginBottom: "10px" }}>☑️ Familiarise yourself with the 🤖 AI Study Assistant.</li>
            <li style={{ marginBottom: "10px" }}>☑️ <strong>Complete the Knowledge Check</strong> at the end of this orientation with 70% or higher to unlock Module 1.</li>
          </ul>
        </div>
      )
    },
    { 
      icon: "💻", title: "Your Digital Campus Overview", 
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "16px" }}>Your portal acts as a sleek app interface divided into four main hubs:</p>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "12px" }}><strong>📚 My Classroom:</strong> Your digital learning hub for course materials, interactive quizzes, and module-by-module progress tracking.</li>
            <li style={{ marginBottom: "12px" }}><strong>👤 My Profile & ID:</strong> View your Official Institutional Record and live Digital Student ID.</li>
            <li style={{ marginBottom: "12px" }}><strong>📁 NCTVET Portfolio:</strong> Submit digital links to practical assignments (Google Drive or YouTube) for instructor grading and NCTVET compliance.</li>
            <li><strong>💳 My Finances:</strong> Transparent view of tuition fees, outstanding balances, and payment history.</li>
          </ul>
        </div>
      )
    },
    { 
      icon: "⏳", title: "Your Learning Journey — Pace & Structure", 
      image: "https://images.unsplash.com/photo-1506784951205-3341b55979f4?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>This programme is fully digital and self-paced — study whenever and wherever. However, self-paced <strong>does not mean unlimited time</strong>.</p>
          <p style={{ marginBottom: "12px" }}>Every student has a <strong>Valid Term</strong> — a specific completion timeframe printed on your Digital Student ID.</p>
          <p style={{ marginBottom: "20px" }}>Instructors will also set specific assessment deadlines within your Valid Term to keep you on track.</p>
          <p style={{ fontWeight: "bold", color: T.navy }}>"The flexibility of digital learning is your advantage — stay ahead of your deadlines and you will thrive."</p>
        </div>
      )
    },
    { 
      icon: "📅", title: "Staying on Track — Deadlines & Extensions", 
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>Students must meet all assessment deadlines set by their instructor.</p>
          <p style={{ marginBottom: "12px" }}>If you are falling behind, take action early — do not wait. Timeline extensions must be formally requested <strong>before</strong> the Valid Term expires.</p>
          <div style={{ padding: "12px", background: T.cream, borderLeft: `4px solid ${T.navy}`, borderRadius: "4px", marginBottom: "20px" }}>
            Extension requests must be sent to:<br/>
            <strong>administration@ctsetsjm.com</strong>
          </div>
          <p style={{ fontWeight: "bold", color: T.teal }}>"Planning ahead is the key to completing your programme on time and stress-free."</p>
        </div>
      )
    },
    { 
      icon: "🏅", title: "How You're Assessed — The 70% Rule", 
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>All programmes are rigorously aligned with NCTVET competency standards.</p>
          <p style={{ marginBottom: "12px" }}>Each module ends with a digital Knowledge Check within the portal. You must score <strong>70% or higher</strong> to earn a Digital Module Badge and permanently unlock the next section.</p>
          <p style={{ marginBottom: "20px" }}>Do not panic if you don't pass the first time — retakes are allowed if needed.</p>
          <p style={{ fontWeight: "bold", color: T.navy }}>"Every badge you earn brings you one step closer to certification — keep pushing forward."</p>
        </div>
      )
    },
    { 
      icon: "⚖️", title: "Academic Integrity", 
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>All submitted work must be entirely your own. Plagiarism — submitting someone else's work as your own — is a serious academic offence.</p>
          <p style={{ marginBottom: "12px", color: T.coral, fontWeight: "bold" }}>Consequences include automatic module failure and a formal enrollment review.</p>
          <p style={{ marginBottom: "20px" }}>If you are ever unsure about plagiarism or how to properly cite a source, please ask your instructor before submitting.</p>
          <p style={{ fontWeight: "bold", color: T.navy }}>"Your digital qualification means more when you've truly earned it."</p>
        </div>
      )
    },
    { 
      icon: "🤖", title: "Meet Your Digital Study Assistant", 
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "16px" }}>Available 24/7 via the 🤖 button in the bottom-right corner of the Student Portal.</p>
          
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <div style={{ flex: 1, background: `${T.emerald}15`, padding: "12px", borderRadius: "8px", borderLeft: `4px solid ${T.emerald}` }}>
              <strong style={{ color: T.emeraldDark }}>DO use it to:</strong>
              <ul style={{ paddingLeft: "16px", marginTop: "8px", marginBottom: 0, fontSize: "16px" }}>
                <li>Explain difficult concepts</li>
                <li>Brainstorm assignment ideas</li>
                <li>Practise real-world scenarios</li>
              </ul>
            </div>
            <div style={{ flex: 1, background: `${T.coral}15`, padding: "12px", borderRadius: "8px", borderLeft: `4px solid ${T.coral}` }}>
              <strong style={{ color: T.coral }}>DO NOT use it to:</strong>
              <ul style={{ paddingLeft: "16px", marginTop: "8px", marginBottom: 0, fontSize: "16px" }}>
                <li>Write final assignments</li>
                <li>Take your Knowledge Checks</li>
                <li>Generate portfolio evidence</li>
              </ul>
            </div>
          </div>
          <p style={{ fontWeight: "bold", color: T.navy }}>"Think of the AI as your personal digital tutor — it helps you learn, but the work must be yours."</p>
        </div>
      )
    },
    { 
      icon: "💳", title: "Financial Policies & Portal Access", 
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>The digital learning portal is directly linked to your financial status.</p>
          <p style={{ marginBottom: "12px" }}>If a payment plan falls into arrears, Classroom access is temporarily restricted. Once the balance is cleared, access is restored instantly — no waiting period.</p>
          <div style={{ padding: "12px", background: T.cream, borderLeft: `4px solid ${T.navy}`, borderRadius: "4px", marginBottom: "20px" }}>
            To submit payment proof, request payment plan changes, or ask about balances, contact:<br/>
            <strong>finance@ctsetsjm.com</strong>
          </div>
          <p style={{ fontWeight: "bold", color: T.teal }}>"Stay current on your payments and your digital learning will never be interrupted."</p>
        </div>
      )
    },
    { 
      icon: "🛡️", title: "Protecting Your Digital Account", 
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>Digital security is a priority. The portal will automatically log you out after 14 minutes of inactivity.</p>
          <p style={{ marginBottom: "12px" }}>Never share your Digital Student ID or login OTP codes with anyone.</p>
          <div style={{ padding: "12px", background: T.cream, borderLeft: `4px solid ${T.coral}`, borderRadius: "4px", marginBottom: "20px" }}>
            If you are not receiving OTPs or experiencing portal glitches, contact IT Support immediately:<br/>
            <strong>support@ctsetsjm.com</strong>
          </div>
          <p style={{ fontWeight: "bold", color: T.navy }}>"Treat your digital student credentials like your online banking login — keep them private."</p>
        </div>
      )
    },
    { 
      icon: "🤝", title: "Your Digital Support Network", 
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>You are not alone! Save this department directory (all inquiries answered within 48-72 business hours):</p>
          <ul style={{ paddingLeft: "20px", fontSize: "16px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "4px" }}><strong>Grading & Assessment:</strong> assessment@ctsetsjm.com</li>
            <li style={{ marginBottom: "4px" }}><strong>Finance Office:</strong> finance@ctsetsjm.com</li>
            <li style={{ marginBottom: "4px" }}><strong>Administration:</strong> administration@ctsetsjm.com</li>
            <li style={{ marginBottom: "4px" }}><strong>IT & Tech Support:</strong> support@ctsetsjm.com</li>
            <li style={{ marginBottom: "4px" }}><strong>Student Success Team:</strong> studentsuccess@ctsetsjm.com</li>
          </ul>
          <p style={{ fontWeight: "bold", color: T.coral, fontSize: "20px" }}>"Your success is our mission. Now go pass that Knowledge Check and unlock Module 1 — your future starts today!"</p>
        </div>
      )
    },
    { 
      icon: "📱", title: "Take Your Digital Campus With You", 
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      content: (
        <div>
          <p style={{ marginBottom: "12px" }}>Access your Classroom, Digital ID, Portfolio, and Finances directly from your phone's home screen. The CTS ETS Digital Campus works as a full app — fast, clean, and one tap away!</p>
          <p style={{ fontWeight: "bold", color: T.navy, marginBottom: "8px" }}>No App Store needed — install in seconds:</p>
          
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px", fontSize: "16px" }}>
            <div style={{ flex: 1 }}>
              <strong>🍎 iPhone (Safari):</strong>
              <ol style={{ paddingLeft: "16px", marginTop: "8px" }}>
                <li>Tap the Share button (square with arrow)</li>
                <li>Scroll down to "Add to Home Screen"</li>
                <li>Tap "Add"</li>
              </ol>
            </div>
            <div style={{ flex: 1 }}>
              <strong>🤖 Android (Chrome):</strong>
              <ol style={{ paddingLeft: "16px", marginTop: "8px" }}>
                <li>Tap the three-dot menu</li>
                <li>Tap "Install App" or "Add to Home Screen"</li>
                <li>Tap "Add"</li>
              </ol>
            </div>
          </div>
          <p style={{ fontWeight: "bold", color: T.teal }}>"Bookmark it, install it, and carry your digital campus in your pocket wherever you go."</p>
        </div>
      )
    }
  ];

  const progressPercentage = ((currentSlide + 1) / SLIDES.length) * 100;
  const isLastSlide = currentSlide === SLIDES.length - 1;

  // Set the direction of the flip before changing slides
  const nextSlide = () => { 
    if (currentSlide < SLIDES.length - 1) {
      setDirection("next");
      setCurrentSlide(currentSlide + 1); 
    }
  };
  const prevSlide = () => { 
    if (currentSlide > 0) {
      setDirection("prev");
      setCurrentSlide(currentSlide - 1); 
    }
  };

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

  // ─── PRESENTATION VIEW (BOOK LAYOUT) ───
  return (
    <div style={{ minHeight: "100vh", background: T.navyDeep, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", overflowX: "hidden" }}>
      
      {/* 🚀 CSS ANIMATIONS FOR THE 3D BOOK FLIP & CROSSFADE */}
      <style>
        {`
          @keyframes fadeImage {
            0% { opacity: 0.3; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes pageTurnNext {
            0% { transform: perspective(1500px) rotateY(90deg); opacity: 0; }
            100% { transform: perspective(1500px) rotateY(0deg); opacity: 1; }
          }
          @keyframes pageTurnPrev {
            0% { transform: perspective(1500px) rotateY(-90deg); opacity: 0; }
            100% { transform: perspective(1500px) rotateY(0deg); opacity: 1; }
          }
          .image-fade {
            animation: fadeImage 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          .page-flip-next {
            animation: pageTurnNext 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            transform-origin: left center;
          }
          .page-flip-prev {
            animation: pageTurnPrev 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            transform-origin: left center;
          }
        `}
      </style>

      <div style={{ display: "flex", background: T.white, width: "100%", maxWidth: "1200px", minHeight: "820px", borderRadius: "32px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", alignItems: "stretch" }}>
        
        {/* LEFT: IMAGE SIDE (Left page of the book) */}
        <div style={{ flex: "1 1 50%", position: "relative", backgroundColor: T.navyDeep, display: "flex" }}>
          <img 
            className="image-fade"
            src={SLIDES[currentSlide].image} 
            alt={SLIDES[currentSlide].title} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: currentSlide === 0 ? "contain" : "cover", 
              padding: currentSlide === 0 ? "60px" : "0",
            }} 
            key={"img-" + currentSlide} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.6))", pointerEvents: "none" }} />
          
          {/* Subtle Logo Overlay */}
          {currentSlide !== 0 && (
            <div style={{ position: "absolute", top: "30px", left: "30px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", padding: "10px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", zIndex: 10 }}>
               <div style={{ width: "30px", height: "30px", background: T.navy, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontFamily: f.display, fontWeight: "900", fontSize: "16px" }}>C</div>
               <span style={{ fontFamily: f.body, fontSize: "12px", fontWeight: "800", color: T.navy, letterSpacing: "1px" }}>CTS ETS</span>
            </div>
          )}
        </div>

        {/* RIGHT: CONTENT SIDE (Right page of the book with 3D Flip) */}
        <div 
          key={"text-" + currentSlide} 
          className={direction === "next" ? "page-flip-next" : "page-flip-prev"} 
          style={{ flex: "1 1 50%", padding: "60px 70px", display: "flex", flexDirection: "column", position: "relative", backgroundColor: T.white }}
        >
          
          {/* Progress Bar Header */}
          <div style={{ marginBottom: "40px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontFamily: f.mono, fontSize: "12px", color: T.grayLight, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>Orientation</span>
              <span style={{ fontFamily: f.mono, fontSize: "12px", color: T.teal, fontWeight: "800" }}>{currentSlide + 1} / {SLIDES.length}</span>
            </div>
            <div style={{ background: T.cream, height: "6px", width: "100%", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPercentage}%`, background: T.teal, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)", borderRadius: "3px" }} />
            </div>
          </div>

          {/* Text Content Area (No scrolling needed anymore due to taller height) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "20px" }}>{SLIDES[currentSlide].icon}</span>
            <h2 style={{ fontFamily: f.display, fontSize: "38px", color: T.navy, fontWeight: "900", marginBottom: "24px", lineHeight: 1.1 }}>
              {SLIDES[currentSlide].title}
            </h2>
            <div style={{ fontFamily: f.body, fontSize: "18px", color: T.gray, lineHeight: 1.6 }}>
              {SLIDES[currentSlide].content}
            </div>
          </div>

          {/* Controls Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "24px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
            <button onClick={prevSlide} disabled={currentSlide === 0} style={{ padding: "12px 0", background: "transparent", border: "none", color: currentSlide === 0 ? "transparent" : T.grayLight, fontFamily: f.body, fontWeight: "700", cursor: currentSlide === 0 ? "default" : "pointer", fontSize: "16px", transition: "color 0.2s" }} onMouseEnter={(e) => {if(currentSlide !== 0) e.currentTarget.style.color = T.navy}} onMouseLeave={(e) => {if(currentSlide !== 0) e.currentTarget.style.color = T.grayLight}}>
              ← Previous
            </button>

            {isLastSlide ? (
              <button onClick={() => setShowQuiz(true)} style={{ padding: "16px 32px", background: T.coral, color: T.white, border: "none", borderRadius: "12px", fontFamily: f.body, fontWeight: "900", cursor: "pointer", fontSize: "16px", boxShadow: `0 8px 20px ${T.coral}50`, transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                Start Knowledge Check
              </button>
            ) : (
              <button onClick={nextSlide} style={{ padding: "16px 32px", background: T.navy, color: T.white, border: "none", borderRadius: "12px", fontFamily: f.body, fontWeight: "800", cursor: "pointer", fontSize: "16px", boxShadow: "0 8px 20px rgba(1,30,64,0.2)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                Next Step →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}