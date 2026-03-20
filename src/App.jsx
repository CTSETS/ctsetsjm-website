// ═══════════════════════════════════════════════════════════════
// CTS ETS — INTERACTIVE STUDENT JOURNEY COMPONENT
// Add this component ABOVE your App() function in App.jsx
// Then add <StudentJourney /> wherever you want it to appear
// ═══════════════════════════════════════════════════════════════

const StudentJourney = () => {
  const [active, setActive] = React.useState(-1);
  const toggle = (i) => setActive(active === i ? -1 : i);

  const steps = [
    { n: "1", t: "Enquire", s: "Explore programmes and fees", color: "#011E40", bg: "#E6F1FB",
      d: <>Visit <b>ctsetsjm.com</b> and browse our 25 programmes across 5 qualification levels. Use the <b>Fee Calculator</b> to see exact costs for your chosen programme and payment plan. Have questions? <b>WhatsApp us</b> on 876-525-6802 (Flow) or 876-381-9771 (Digicel), or email info@ctsetsjm.com.
        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:6}}>
          {["Website","WhatsApp","Fee calculator"].map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:12,background:'#011E40',color:'#C49112'}}>{t}</span>)}
        </div></>
    },
    { n: "2", t: "Apply online", s: "Fill out form + upload documents", color: "#011E40", bg: "#E6F1FB",
      d: <>Complete the <b>online application form</b> on ctsetsjm.com. You'll provide personal details, emergency contact, programme choice, payment plan, and educational background.<br/><br/><b>Upload these documents:</b><br/>• HEART Registration Form<br/>• TRN (Tax Registration Number)<br/>• Passport-size photo<br/>• Qualifications (CXC, CAPE, etc.)<br/>• National ID or passport<br/><br/>You'll receive a <b>confirmation email with a personalised prayer</b> immediately.</>
    },
    { n: "3", t: "Under review", s: "We check your application", color: "#633806", bg: "#FAEEDA",
      d: <>Our Admissions team reviews your documents and checks <b>entry requirements</b>:<br/><br/>• <b>Job Certificate:</b> Open entry — no formal qualifications<br/>• <b>Level 2:</b> Job Certificate OR 2 CXCs<br/>• <b>Level 3:</b> Level 2 OR 3 CXCs (CAPE accepted)<br/>• <b>Level 4:</b> Level 3 Diploma required<br/>• <b>Level 5:</b> Level 4 Associate required<br/><br/>If anything is missing, we'll email you. You can <b>check your status anytime</b> on the website.</>
    },
    { n: "4", t: "Accepted!", s: "Student ID + acceptance email", color: "#085041", bg: "#E1F5EE",
      d: <>Congratulations! You receive:<br/>• Your permanent <b>Student ID</b> (CTSETS-2026-04-NNNN)<br/>• An <b>acceptance email with a personalised prayer</b><br/>• <b>Payment instructions</b> for your chosen plan<br/><br/>You have <b>14 days to complete payment</b> and secure your place.
        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:6}}>
          {["Student ID","Prayer email","14-day window"].map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:12,background:'#085041',color:'#9FE1CB'}}>{t}</span>)}
        </div></>
    },
    { n: "5", t: "Pay tuition", s: "WiPay online or bank transfer", color: "#011E40", bg: "#E6F1FB",
      d: <><b>Option 1 — Pay online (WiPay)</b><br/>Click "Pay Online" on the website. Enter your card details on WiPay's secure checkout. Instant confirmation.<br/><br/><b>Option 2 — Bank transfer + upload receipt</b><br/>Transfer to the CTS ETS business account. Upload your receipt on the Payment Centre page.<br/><br/><b>Payment plans:</b><br/>• <b>Gold:</b> 100% upfront — no processing fee (all levels)<br/>• <b>Silver:</b> 60% now + 40% at midpoint (Level 3–5 only)<br/>• <b>Bronze:</b> 30% now + monthly instalments (Level 3–5 only)</>
    },
    { n: "6", t: "Enrolled!", s: "Canvas access + welcome packet", color: "#085041", bg: "#E1F5EE",
      d: <>You're officially a CTS ETS student! You receive:<br/>• <b>Canvas LMS login credentials</b> — your Learning Portal<br/>• <b>Welcome Packet PDF</b> with everything you need<br/>• <b>Student Handbook</b> (rights, responsibilities, policies)<br/>• Access to your <b>programme modules</b><br/><br/>Over the next 120 days, you'll receive <b>9 welcome emails</b> with tips, encouragement, and guidance.
        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:6}}>
          {["Canvas login","Welcome packet","Handbook"].map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:12,background:'#085041',color:'#9FE1CB'}}>{t}</span>)}
        </div></>
    },
    { n: "7", t: "Learn", s: "Self-paced modules on Canvas", color: "#3C3489", bg: "#EEEDFE",
      d: <>Study at <b>your own pace</b> from anywhere. Each programme is divided into modules containing learning materials, practice exercises, and assessment tasks.<br/><br/>Aim to complete <b>at least one module per fortnight</b> and log into Canvas <b>at least once per week</b>.<br/><br/><b>Programme durations:</b><br/>• Job Certificate: 2–3 months<br/>• Level 2: 3–4 months<br/>• Level 3: 5–6 months<br/>• Level 4: 7–8 months<br/>• Level 5: 8–9 months</>
    },
    { n: "8", t: "Assessed", s: "Competent or not yet competent", color: "#3C3489", bg: "#EEEDFE",
      d: <>CTS ETS uses <b>competency-based assessment</b>:<br/><br/>• <b>Competent (C)</b> — you've demonstrated all the required skills<br/>• <b>Not Yet Competent (NYC)</b> — you need more work in some areas<br/><br/><b>No grades or percentages.</b> If you receive NYC, you get <b>one free re-assessment within 14 days</b> with clear feedback.<br/><br/><b>Methods:</b> written assignments, case studies, video demonstrations, quizzes, portfolios, and projects.
        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:6}}>
          {["No grades","Free re-sit","Feedback in 10 days"].map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:12,background:'#3C3489',color:'#CECBF6'}}>{t}</span>)}
        </div></>
    },
    { n: "9", t: "Completed!", s: "CTS ETS certificate issued", color: "#27500A", bg: "#EAF3DE",
      d: <>Once all your units are Competent, you receive:<br/>• <b>CTS ETS Institutional Certificate</b> (PDF)<br/>• A <b>completion email with a personalised prayer</b><br/>• A <b>LinkedIn celebration post</b> drafted for you<br/>• An invitation to share a <b>testimonial</b><br/>• A <b>satisfaction survey</b><br/><br/>Within 3 days, you'll receive info about <b>enrolling in the next level</b>.</>
    },
    { n: "10", t: "NCTVET / City & Guilds", s: "National + international certification", color: "#27500A", bg: "#EAF3DE",
      d: <>CTS ETS registers you for <b>NCTVET External Assessment</b> or <b>City & Guilds certification</b>:<br/><br/>• An external assessor reviews your evidence portfolio<br/>• If successful, you receive the <b>NVQ-J</b> or <b>City & Guilds IVQ</b><br/>• These are <b>nationally and internationally recognised</b><br/><br/>External assessment fees are <b>separate from tuition</b> and paid directly to NCTVET.
        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:6}}>
          {["NVQ-J","City & Guilds","Internationally recognised"].map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:12,background:'#27500A',color:'#C0DD97'}}>{t}</span>)}
        </div></>
    },
    { n: "11", t: "Graduate!", s: "Enter the workforce or level up", color: "#27500A", bg: "#EAF3DE",
      d: <>You're now a <b>qualified professional</b>. Your options:<br/><br/>• <b>Enter the workforce</b> — your qualification is recognised across Jamaica and the Caribbean<br/>• <b>Enrol in the next level</b> — Level 2 → 3 → 4 → 5<br/>• <b>Become a mentor</b> — share your experience with new students<br/><br/><b>CTS ETS is with you beyond graduation.</b> We're always here for references, career guidance, or further qualifications.<br/><br/><em>"May all who come behind us, find us faithful to the end."</em></>
    },
  ];

  return (
    <div style={{maxWidth:640,margin:'0 auto',padding:'0 16px'}}>
      <div style={{textAlign:'center',marginBottom:24}}>
        <h2 style={{fontFamily:'Playfair Display,serif',color:'#011E40',fontSize:28,marginBottom:4}}>Your student journey</h2>
        <p style={{color:'#718096',fontSize:14}}>Click each step to learn more — from enquiry to graduation</p>
      </div>
      {steps.map((step, i) => (
        <div key={i}>
          <div
            onClick={() => toggle(i)}
            style={{
              display:'flex',gap:14,alignItems:'flex-start',padding:'12px 14px',
              borderRadius:12,cursor:'pointer',transition:'background 0.15s',
              background: active === i ? step.bg : 'transparent'
            }}
            onMouseEnter={e => { if(active!==i) e.currentTarget.style.background='rgba(1,30,64,0.04)' }}
            onMouseLeave={e => { if(active!==i) e.currentTarget.style.background='transparent' }}
          >
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{
                width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:16,
                background: active === i ? '#011E40' : step.bg,
                color: active === i ? '#C49112' : step.color,
                transition:'all 0.2s',
                transform: active === i ? 'scale(1.1)' : 'scale(1)',
                border: active === i ? '2px solid #C49112' : '2px solid transparent'
              }}>
                {step.n}
              </div>
              {i < steps.length - 1 && (
                <div style={{width:2,height:active===i?8:16,background:'#C49112',opacity:0.3,transition:'height 0.2s'}}/>
              )}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <h3 style={{fontFamily:'Playfair Display,serif',fontSize:16,fontWeight:600,color:'#011E40',margin:0}}>{step.t}</h3>
                <span style={{fontSize:16,color:'#C49112',transition:'transform 0.2s',transform:active===i?'rotate(180deg)':'rotate(0deg)'}}>▾</span>
              </div>
              <p style={{fontSize:13,color:'#718096',margin:'2px 0 0'}}>{step.s}</p>
              <div style={{
                overflow:'hidden',
                maxHeight: active === i ? 500 : 0,
                opacity: active === i ? 1 : 0,
                transition:'max-height 0.35s ease, opacity 0.3s',
                marginTop: active === i ? 10 : 0,
              }}>
                <div style={{
                  padding:'14px 16px',borderRadius:10,fontSize:13,lineHeight:1.7,
                  color:'#4A5568',background: step.bg,
                  borderLeft:`4px solid ${step.color}`
                }}>
                  {step.d}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{textAlign:'center',margin:'20px 0',padding:'16px 0',borderTop:'2px solid #C49112'}}>
        <p style={{fontFamily:'Playfair Display,serif',fontSize:14,fontStyle:'italic',color:'#A0AEC0',margin:0}}>
          "Trust in the Lord with all your heart and lean not on your own understanding." — Proverbs 3:5-6
        </p>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// HOW TO ADD TO YOUR WEBSITE:
// ═══════════════════════════════════════════════════════════════
//
// STEP 1: Copy the entire StudentJourney component above
//
// STEP 2: Paste it in App.jsx ABOVE your main App() function
//         (near where SectionBlock and other components are defined)
//
// STEP 3: Add <StudentJourney /> inside whichever page you want.
//
//         For example, to add it to the ABOUT page or a new section:
//
//         <SectionBlock title="Your Student Journey" id="student-journey">
//           <StudentJourney />
//         </SectionBlock>
//
//         Or to add it on the APPLY page above the form:
//
//         <StudentJourney />
//
// STEP 4: Save App.jsx, commit to GitHub, Vercel auto-deploys.
//
// That's it. The component is self-contained — no external
// dependencies, no CSS files, no images needed.
// ═══════════════════════════════════════════════════════════════
