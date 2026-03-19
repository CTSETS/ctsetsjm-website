import { useState, useEffect, useRef, useCallback, Component, useMemo } from "react";

const NAV_LOGO = "/logo.jpg";
const HERO_LOGO = "/logo.jpg";
const HEART_LOGO = "/HEART%20Logo.jpg";
const NCTVET_LOGO = "/NCTVET%20Logo.jpg";
const CG_LOGO = "/City%26Guilds%20Logo.jpg";
const FOUNDER_PHOTO = "/Lead%20Facilitator.jpg";

// ─── DATA ────────────────────────────────────────────────────────────
const PROGRAMMES = {
  "Job / Professional Certificates": [
    { name: "Basic Digital Literacy Skills Proficiency", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Build essential computer and internet skills for today's digital workplace." },
    { name: "Customer Service Rep — Admin Asst.", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Gain front-line customer service and office administration capabilities." },
    { name: "Customer Service Rep — Office Admin", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Develop professional office administration and client-facing skills." },
    { name: "Data Entry Processor", duration: "2 months", tuition: "$8,000", total: "$13,000", desc: "Master accurate, efficient data entry and basic records management." },
    { name: "Data Entry Advanced Processor", duration: "2 months", tuition: "$8,000", total: "$13,000", desc: "Take your data processing skills to the next level with advanced techniques." },
    { name: "Introduction to ICT Proficiency", duration: "2 months", tuition: "$8,000", total: "$13,000", desc: "A foundational course in information and communication technology." },
    { name: "Team Leader", duration: "2.5 months", tuition: "$10,000", total: "$15,000", desc: "Learn to lead, motivate, and manage small teams effectively." },
    { name: "Industrial Security Ops Manager", duration: "3 months", tuition: "$12,000", total: "$17,000", desc: "Prepare for supervisory roles in security operations and risk management." },
    { name: "Data Protection Officer", duration: "3 months", tuition: "$15,000", total: "$20,000", desc: "Understand data privacy regulations and organisational compliance requirements." },
    { name: "Human Resource Administrator", duration: "4 months", tuition: "$18,000", total: "$23,000", desc: "Build foundational HR skills including recruitment, records, and compliance." },
  ],
  "Level 2 — Vocational Certificate": [
    { name: "Customer Service", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Develop structured customer service delivery and communication skills." },
    { name: "Entrepreneurship", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Learn to plan, launch, and manage a small business venture." },
    { name: "Administrative Assistance", duration: "6 months", tuition: "$18,000", total: "$23,000", desc: "Gain professional skills for office management and administrative support." },
    { name: "Business Administration (Secretarial)", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Comprehensive secretarial and business administration training." },
    { name: "Industrial Security Operations", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Formalise your security industry experience with recognised certification." },
  ],
  "Level 3 — Diploma": [
    { name: "Customer Service", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Advanced customer service strategy, quality assurance, and team coordination." },
    { name: "Customer Service Supervision", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Prepare to lead and supervise customer-facing teams with confidence." },
    { name: "Business Administration — Management", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Core business management principles for aspiring mid-level managers." },
    { name: "Entrepreneurship", duration: "7 months", tuition: "$35,000", total: "$40,000", desc: "Advanced business planning, financial management, and growth strategy." },
    { name: "Industrial Security Operations", duration: "7 months", tuition: "$40,000", total: "$45,000", desc: "Senior-level security operations management and risk assessment." },
    { name: "Supervisory Management", duration: "7 months", tuition: "$45,000", total: "$50,000", desc: "Develop leadership, decision-making, and people management skills." },
  ],
  "Level 4 — Associate Equivalent": [
    { name: "Human Resource Management", duration: "8 months", tuition: "$60,000", total: "$65,000", desc: "Strategic HR management including workforce planning and labour relations." },
    { name: "Business Administration — Management", duration: "9 months", tuition: "$70,000", total: "$75,000", desc: "Advanced business strategy, operations, and organisational leadership." },
  ],
  "Level 5 — Bachelor's Equivalent": [
    { name: "Human Resource Management", duration: "6 months", tuition: "$110,000", total: "$115,000", desc: "Executive-level HR strategy, policy development, and organisational change." },
    { name: "Business Administration Management", duration: "9 months", tuition: "$150,000", total: "$155,000", desc: "Comprehensive senior management and executive leadership programme." },
  ],
};

const REG_FEE = 5000;
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDzchxbJi7zOIHjZc5yq6wOSvDu7NzsNzMRhgYVtTBplyF_BS_F7adQPZyU1PQrbW8hQ/exec";

// WiPay Configuration — Replace with your live keys after merchant registration
const WIPAY_CONFIG = {
  accountNumber: "", // Your WiPay merchant account number
  apiKey: "", // Your WiPay API key  
  sandbox: true, // Set to false for live payments
  fee: 0.035, // 3.5% transaction fee
  get baseUrl() { return this.sandbox ? "https://sandbox.wipayfinancial.com/v1/gateway" : "https://wipayfinancial.com/v1/gateway"; },
  currency: "JMD",
  country: "JM",
  returnUrl: "https://ctsetsjm.com/#payment-success",
  cancelUrl: "https://ctsetsjm.com/#apply",
};
const CALC_DATA = [
  { level: "Job Certificate", name: "Data Entry / ICT Proficiency", tuition: 8000, goldOnly: true },
  { level: "Job Certificate", name: "Digital Literacy / CSR / Admin Asst.", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Team Leader", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Industrial Security Ops Manager", tuition: 12000, goldOnly: true },
  { level: "Job Certificate", name: "Data Protection Officer", tuition: 15000, goldOnly: true },
  { level: "Job Certificate", name: "Human Resource Administrator", tuition: 18000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Customer Service", tuition: 15000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Entrepreneurship", tuition: 15000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Administrative Assistance", tuition: 18000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Business Admin (Secretarial)", tuition: 20000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Industrial Security Operations", tuition: 20000, goldOnly: true },
  { level: "Level 3 — Diploma", name: "Customer Service", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Customer Service Supervision", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Bus Admin — Management", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Entrepreneurship", tuition: 35000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Industrial Security Ops", tuition: 40000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Supervisory Management", tuition: 45000, bronzeMonths: 6 },
  { level: "Level 4 — Associate", name: "Human Resource Management", tuition: 60000, bronzeMonths: 7 },
  { level: "Level 4 — Associate", name: "Bus Admin — Management", tuition: 70000, bronzeMonths: 8 },
  { level: "Level 5 — Bachelor's", name: "Human Resource Management", tuition: 110000, bronzeMonths: 5 },
  { level: "Level 5 — Bachelor's", name: "Bus Admin Management", tuition: 150000, bronzeMonths: 8 },
];

const GROUP_DISCOUNTS = [
  { level: "JC: Data Entry / ICT", standard: "$13,000", group: "$11,050", saving: "$1,950" },
  { level: "JC: Digital Literacy / CSR / Team Leader", standard: "$15,000", group: "$12,750", saving: "$2,250" },
  { level: "JC: Security Ops Manager", standard: "$17,000", group: "$14,450", saving: "$2,550" },
  { level: "JC: Data Protection Officer", standard: "$20,000", group: "$17,000", saving: "$3,000" },
  { level: "JC: HR Administrator", standard: "$23,000", group: "$19,550", saving: "$3,450" },
  { level: "L2: Customer Service / Entrepreneurship", standard: "$20,000", group: "$17,000", saving: "$3,000" },
  { level: "L2: Admin Assistance", standard: "$23,000", group: "$19,550", saving: "$3,450" },
  { level: "L2: Bus Admin / Ind Security", standard: "$25,000", group: "$21,250", saving: "$3,750" },
  { level: "L3: Customer Service", standard: "$30,000", group: "$25,500", saving: "$4,500" },
  { level: "L3: Cust Serv Supervision / Bus Admin", standard: "$35,000", group: "$29,750", saving: "$5,250" },
  { level: "L3: Entrepreneurship", standard: "$40,000", group: "$34,000", saving: "$6,000" },
  { level: "L3: Industrial Security Ops", standard: "$45,000", group: "$38,250", saving: "$6,750" },
  { level: "L3: Supervisory Management", standard: "$50,000", group: "$42,500", saving: "$7,500" },
  { level: "L4: Human Resource Mgmt", standard: "$65,000", group: "$55,250", saving: "$9,750" },
  { level: "L4: Bus Admin — Mgmt", standard: "$75,000", group: "$63,750", saving: "$11,250" },
  { level: "L5: Human Resource Mgmt", standard: "$115,000", group: "$97,750", saving: "$17,250" },
  { level: "L5: Bus Admin Mgmt", standard: "$155,000", group: "$131,750", saving: "$23,250" },
];

const PAGES = ["Home","About","Why Choose","Programmes","Certification","Fees & Calculator","For Employers","Apply","Contact"];

// Canvas LMS — Update this URL after registering at canvas.instructure.com
const CANVAS_URL = "https://canvas.instructure.com"; // CTS ETS Learning Portal

// Booking appointment URLs (replace with your Google Calendar Appointment Schedule links)
const BOOKING_URLS = {
  general: "https://calendar.app.google/zPKr4G5hdCcbTgdj9",
  payment: "https://calendar.app.google/NBJVeEe1WhwvQXXC7",
  academic: "https://calendar.app.google/dAEuRwjV743izwJM8",
  employer: "https://calendar.app.google/wpLUXKRdWzwY7P929",
};

const FAQS = [
  { q: "What qualifications do I need to enrol?", a: "Entry requirements vary by level. Job Certificates are open entry (no qualifications needed). Level 2 requires a Job Certificate or 2 CXCs. Level 3 needs Level 2 or 3 CXCs. Levels 4 and 5 require the previous level diploma in a related area." },
  { q: "Are your programmes 100% online?", a: "Yes — almost entirely. Delivery is online and self-paced. Some practical assessments may be conducted in person. You can study at your own pace, mornings, evenings, or weekends." },
  { q: "How long do programmes take to complete?", a: "Depending on the level, programmes run from 2 months (Job Certificate) up to 9 months (Level 5). At 2 topics per week, most learners finish comfortably within the timeframe." },
  { q: "What certifications will I receive?", a: "Each programme is aligned to either NCTVET (NVQ-J) or City & Guilds — not both simultaneously. Upon successful completion of your programme and all required assessments, you will receive: (1) A CTS ETS Institutional Certificate of Completion, confirming your achievement with us; and (2) The relevant programme-aligned qualification — either an NVQ-J certificate issued through NCTVET, or a City & Guilds qualification. The specific awarding body is confirmed at enrolment. Both are nationally and internationally recognised." },
  { q: "What is the NCTVET external assessment fee?", a: "NCTVET external assessment and certification fees are separate from tuition and are paid directly to NCTVET. You will be advised of the applicable fees before the assessment stage." },
  { q: "Can my employer pay for my training?", a: "Yes! We offer a 15% group discount for 8 or more learners. Employers can enrol teams under the employer application option. Contact us for a group quotation." },
  { q: "What payment plans are available?", a: "Gold (full payment, 0% surcharge) is available for all levels. Silver (50/50) and Bronze (monthly instalments) are available for Levels 3–5 only. Job Certificate and Level 2 require full payment." },
  { q: "How do I submit my application?", a: "Download the official HEART/NSTA application form, complete it, and upload it along with your required documents on the Apply page. Once received, payment information will be sent to you via email." },
  { q: "What documents do I need to apply?", a: "You will need: a completed HEART/NSTA application form, TRN card or letter, a recent passport-size photograph, proof of qualifications (CXC/CAPE results or certificates), a birth certificate, and a valid National ID (passport, driver's licence, or national ID card)." },
  { q: "How do I contact CTS ETS?", a: "Email us at info@ctsetsjm.com, call 876-525-6802 or 876-381-9771, or WhatsApp us using the chat button on this page. We aim to respond within 24–48 hours." },
];

const TESTIMONIALS = [
  { name: "Kadian H.", initials: "KH", color: "#4A90D9", level: "Level 3 — Customer Service Supervision", outcome: "Promoted to Supervisor", quote: "CTS ETS gave me the qualification I needed to move into a supervisory role. The online format fit perfectly around my work schedule. I studied in the evenings and never missed a shift.", parish: "St. Andrew" },
  { name: "Rohan M.", initials: "RM", color: "#2E7D32", level: "Industrial Security Ops — Level 2", outcome: "Certified & Employed", quote: "I had years of experience but no paper to show for it. Now I have an internationally recognised certificate. It opened real doors for me and my employer finally recognised my value.", parish: "St. Catherine" },
  { name: "Nadine B.", initials: "NB", color: "#7B1FA2", level: "Level 4 — Human Resource Management", outcome: "HR Manager", quote: "The learner guides are thorough and the WhatsApp support made a huge difference. I never felt alone in the process. Worth every dollar I invested in myself.", parish: "Kingston" },
  { name: "Trevor W.", initials: "TW", color: "#C49112", level: "Level 3 — Business Administration", outcome: "Now Enrolled at Level 4", quote: "Affordable, flexible, and genuinely professional. CTS ETS delivered exactly what they promised. I'm now enrolled in Level 4 and looking at Level 5 next year.", parish: "Manchester" },
  { name: "Simone A.", initials: "SA", color: "#C62828", level: "Level 2 — Customer Service", outcome: "Call Centre Team Lead", quote: "As a single mother I needed something I could do around my children. CTS ETS made it possible. The payment plan helped and I finished in under 6 months.", parish: "St. James" },
  { name: "Dwayne P.", initials: "DP", color: "#01579B", level: "Level 3 — Entrepreneurship", outcome: "Running His Own Business", quote: "I launched my business while studying. The programme gave me the structure and confidence I was missing. CTS ETS is not just training — it is a real investment in your future.", parish: "Clarendon" },
];

// ─── UTILITIES ───────────────────────────────────────────────────────
const fmt = (n) => "$" + Math.round(n).toLocaleString();
const S = { heading: "'Playfair Display', Georgia, serif", body: "'DM Sans', sans-serif", navy: "#011E40", gold: "#C49112", gray: "#4A5568", lightBg: "#FAFAF7", darkBg: "#011E40" };

// Email typo detection
const EMAIL_DOMAINS = ["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com","live.com","msn.com","aol.com","ymail.com","mail.com","protonmail.com"];
const suggestEmail = (email) => {
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[1]) return null;
  const domain = parts[1].toLowerCase();
  if (EMAIL_DOMAINS.includes(domain)) return null;
  for (const d of EMAIL_DOMAINS) {
    let diff = 0;
    const shorter = domain.length <= d.length ? domain : d;
    const longer = domain.length > d.length ? domain : d;
    if (Math.abs(domain.length - d.length) > 2) continue;
    for (let i = 0; i < shorter.length; i++) if (shorter[i] !== longer[i]) diff++;
    diff += longer.length - shorter.length;
    if (diff > 0 && diff <= 2) return parts[0] + "@" + d;
  }
  return null;
};

// File size validator (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const validateFileSize = (file) => file && file.size <= MAX_FILE_SIZE;

// Convert a File object to { slot, name, originalName, type, data (base64) }
const fileToBase64 = (slot, file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve({ slot, name: file.name, originalName: file.name, type: file.type, data: reader.result.split(",")[1] });
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// Send form data + files to Google Apps Script
const submitToAppsScript = async (formData, fileMap) => {
  try {
    const files = [];
    for (const [slot, file] of Object.entries(fileMap)) {
      if (file) {
        try { files.push(await fileToBase64(slot, file)); } catch (_) {}
      }
    }
    const payload = JSON.stringify({ ...formData, files });

    // Method 1: Standard fetch
    try {
      const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: payload });
      if (res.ok) return { success: true };
    } catch (_) {}

    // Method 2: no-cors fallback
    try {
      await fetch(APPS_SCRIPT_URL, { method: "POST", body: payload, mode: "no-cors" });
      return { success: true };
    } catch (_) {}

    // Method 3: Form POST via hidden iframe
    try {
      var iframe = document.createElement("iframe");
      iframe.name = "cts_" + Date.now(); iframe.style.display = "none";
      document.body.appendChild(iframe);
      var form = document.createElement("form");
      form.method = "POST"; form.action = APPS_SCRIPT_URL; form.target = iframe.name; form.style.display = "none";
      var inp = document.createElement("textarea");
      inp.name = "payload"; inp.value = payload;
      form.appendChild(inp); document.body.appendChild(form); form.submit();
      setTimeout(() => { try { document.body.removeChild(iframe); document.body.removeChild(form); } catch(_){} }, 15000);
      return { success: true };
    } catch (_) {}

    return { success: false };
  } catch (err) { console.error("Submit error:", err); return { success: false }; }
};

// ─── ERROR BOUNDARY ─────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("CTS ETS Error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", background: "#FAFAF7", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#011E40", marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ fontSize: 15, color: "#4A5568", lineHeight: 1.7, marginBottom: 24 }}>We apologise for the inconvenience. Please refresh the page to continue.</p>
            <button onClick={() => window.location.reload()} style={{ padding: "14px 32px", borderRadius: 8, background: "#C49112", color: "#011E40", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Refresh Page</button>
            <p style={{ fontSize: 12, color: "#4A5568", marginTop: 16 }}>If the problem persists, contact us at <strong>info@ctsetsjm.com</strong></p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


// ─── SHARED COMPONENTS ──────────────────────────────────────────────
function Container({ children, style }) {
  return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,3vw,48px)", ...style }}>{children}</div>;
}

function PageWrapper({ children, bg = "#fff" }) {
  return <div style={{ minHeight: "calc(100vh - 72px)", background: bg, padding: "0 0 60px" }}>{children}</div>;
}

function SectionHeader({ tag, title, desc, light = false }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48, padding: "48px 24px 0" }}>
      <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>{tag}</span>
      <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 40px)", color: light ? "#fff" : S.navy, margin: "10px 0 0", fontWeight: 700 }}>{title}</h2>
      {desc && <p style={{ fontFamily: S.body, fontSize: 15, color: light ? "rgba(255,255,255,0.7)" : S.gray, marginTop: 14, maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>{desc}</p>}
    </div>
  );
}

function Btn({ children, primary, onClick, style }) {
  return (
    <button onClick={onClick} style={{ padding: primary ? "14px 32px" : "12px 28px", borderRadius: 8, border: primary ? "none" : "2px solid " + S.navy, background: primary ? S.gold : "transparent", color: primary ? S.navy : S.navy, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body, letterSpacing: 0.5, transition: "all 0.2s", ...style }}>
      {children}
    </button>
  );
}

function SectionBlock({ num, title, desc, children, locked, complete }) {
  return (
    <div style={{ marginBottom: 32, position: "relative", opacity: locked ? 0.45 : 1, transition: "opacity 0.3s", pointerEvents: locked ? "none" : "auto" }}>
      {locked && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "rgba(248,249,250,0.6)", backdropFilter: "blur(2px)" }}>
          <div style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1.5px solid rgba(1,30,64,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Complete Section {String.fromCharCode(num.charCodeAt(0) - 1)} above to unlock</span>
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: desc ? 6 : 16, paddingBottom: 14, borderBottom: "2px solid " + (complete ? "rgba(46,125,50,0.25)" : "rgba(1,30,64,0.06)") }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: complete ? "#2E7D32" : S.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
          <span style={{ fontFamily: S.heading, fontSize: 13, fontWeight: 800, color: complete ? "#fff" : S.gold }}>{complete ? "✓" : num}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy }}>{title}</div>
          {desc && <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 2 }}>{desc}</div>}
        </div>
        {complete && <div style={{ fontSize: 11, fontWeight: 700, color: "#2E7D32", fontFamily: S.body, letterSpacing: 0.5, whiteSpace: "nowrap" }}>✓ Complete</div>}
      </div>
      {children}
    </div>
  );
}

function PartnerLogos() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap", padding: "24px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: S.gray, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, marginBottom: 8 }}>Aligned To</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <img src={NCTVET_LOGO} alt="NCTVET" style={{ height: 64, objectFit: "contain" }} />
          <img src={CG_LOGO} alt="City and Guilds" style={{ height: 64, objectFit: "contain" }} />
          <img src={HEART_LOGO} alt="HEART NSTA" style={{ height: 64, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}

// WhatsApp Share button helper
function WhatsAppShare({ text, label = "Share via WhatsApp" }) {
  return (
    <a href={"https://wa.me/?text=" + encodeURIComponent(text)} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 6, background: "#25D366", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none", cursor: "pointer", transition: "opacity 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      {label}
    </a>
  );
}

// Countdown Timer
function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const calc = () => {
      const now = new Date(), target = new Date(targetDate), diff = target - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
    };
    setTime(calc());
    const iv = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(iv);
  }, [targetDate]);
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      {[["days", time.days], ["hrs", time.hours], ["min", time.minutes], ["sec", time.seconds]].map(([label, val]) => (
        <div key={label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 52 }}>
          <div style={{ fontFamily: S.heading, fontSize: 20, fontWeight: 800, color: S.gold }}>{String(val || 0).padStart(2, "0")}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: S.body, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// Scroll to Top Button
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top"
      style={{ position: "fixed", bottom: 148, right: 24, width: 44, height: 44, borderRadius: "50%", background: S.navy, border: "2px solid " + S.gold, color: S.gold, fontSize: 18, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 9996, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s, opacity 0.2s", opacity: 0.9 }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.opacity = "1"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "0.9"; }}>
      ↑
    </button>
  );
}

// Announcement Bar
function AnnouncementBar({ onDismiss }) {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("cts_announcement_dismissed") === "true");
  if (dismissed) return null;
  const dismiss = () => { sessionStorage.setItem("cts_announcement_dismissed", "true"); setDismissed(true); if (onDismiss) onDismiss(); };
  return (
    <div style={{ background: S.gold, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1001 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, textAlign: "center" }}>
        🎓 April 2026 intake is NOW OPEN — Limited spots available!
      </span>
      <button onClick={dismiss} aria-label="Dismiss announcement" style={{ background: "rgba(1,30,64,0.1)", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: S.navy, fontWeight: 700, flexShrink: 0 }}>✕</button>
    </div>
  );
}

// Offline Detection Banner
function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOff = () => setOffline(true);
    const goOn = () => setOffline(false);
    window.addEventListener("offline", goOff);
    window.addEventListener("online", goOn);
    return () => { window.removeEventListener("offline", goOff); window.removeEventListener("online", goOn); };
  }, []);
  if (!offline) return null;
  return (
    <div style={{ background: "#C62828", padding: "10px 20px", textAlign: "center", color: "#fff", fontSize: 13, fontFamily: S.body, fontWeight: 600, position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000 }}>
      ⚠️ You are currently offline. Some features may not work until your connection is restored.
    </div>
  );
}

// Branded Loading Screen
function LoadingScreen() {
  return (
    <div style={{ position: "fixed", inset: 0, background: S.navy, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, flexDirection: "column", gap: 20 }}>
      <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 80, height: 90, objectFit: "contain", animation: "pulse 1.5s infinite" }} />
      <div style={{ fontFamily: S.heading, fontSize: 18, color: "#fff", fontWeight: 700 }}>CTS Empowerment & Training Solutions</div>
      <div style={{ fontSize: 10, color: S.gold, fontFamily: S.body, letterSpacing: 2, textTransform: "uppercase" }}>Called To Serve — Committed to Excellence</div>
      <div style={{ width: 120, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden", marginTop: 8 }}>
        <div style={{ width: "40%", height: "100%", background: S.gold, borderRadius: 2, animation: "loadBar 1.2s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

// 404 Page
function NotFoundPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <Container style={{ paddingTop: 80, textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px,5vw,56px)", color: S.navy, fontWeight: 800, marginBottom: 12 }}>404</h1>
        <h2 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 16 }}>Page Not Found</h2>
        <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 32px" }}>The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn primary onClick={() => setPage("Home")} style={{ color: S.navy }}>Go Home</Btn>
          <Btn onClick={() => setPage("Programmes")} style={{ color: S.navy }}>View Programmes</Btn>
        </div>
      </Container>
    </PageWrapper>
  );
}


// ─── NAVBAR ──────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ background: S.navy, borderBottom: "3px solid " + S.gold, position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 72, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setPage("Home")} role="link" tabIndex={0} onKeyDown={e => e.key === "Enter" && setPage("Home")} aria-label="CTS ETS Home">
          <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 52, height: 58, objectFit: "contain", borderRadius: 4 }} />
          <div className="nav-brand-text">
            <div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>CTS Empowerment &amp; Training Solutions</div>
            <div style={{ fontSize: 10, color: S.gold, fontFamily: S.body, letterSpacing: 1.5, marginTop: 2 }}>CALLED TO SERVE — COMMITTED TO EXCELLENCE</div>
          </div>
        </div>
        <div className="desktop-nav" style={{ display: "flex", gap: 4, alignItems: "center" }} role="menubar">
          {PAGES.map(p => (
            <button key={p} onClick={() => setPage(p)} role="menuitem" aria-current={page === p ? "page" : undefined} style={{ padding: "8px 11px", borderRadius: 6, border: "none", background: page === p ? S.gold : "transparent", color: page === p ? S.navy : "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: page === p ? 700 : 500, cursor: "pointer", fontFamily: S.body, transition: "all 0.2s", whiteSpace: "nowrap" }}>{p}</button>
          ))}
          <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", borderRadius: 6, background: "#2E7D32", color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: S.body, textDecoration: "none", whiteSpace: "nowrap", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>📚 Learning Portal</a>
        </div>
        <button className="mobile-menu-btn" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} style={{ display: "none", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />)}
        </button>
      </div>
      {open && (
        <div style={{ background: S.navy, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "8px 0 16px" }} role="menu">
          {PAGES.map(p => (
            <button key={p} onClick={() => { setPage(p); setOpen(false); }} role="menuitem" style={{ display: "block", width: "100%", padding: "12px 24px", border: "none", background: page === p ? "rgba(196,164,75,0.12)" : "transparent", color: page === p ? S.gold : "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: page === p ? 700 : 400, cursor: "pointer", fontFamily: S.body, textAlign: "left", borderLeft: page === p ? "3px solid " + S.gold : "3px solid transparent" }}>{p}</button>
          ))}
          <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "12px 24px", color: "#81C784", fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none", textAlign: "left", borderLeft: "3px solid #2E7D32" }}>📚 Learning Portal</a>
        </div>
      )}
    </nav>
  );
}

// ─── HOME PAGE ──────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: S.navy, color: "#fff", padding: "0", position: "relative", overflow: "hidden", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(196,145,18,0.07) 0%, transparent 65%)" }} />
        <Container style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,80px)", alignItems: "center", padding: "clamp(40px,6vw,80px) clamp(16px,3vw,48px)" }} className="resp-grid-2">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
              <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 88, height: 98, objectFit: "contain" }} />
              <div>
                <div style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>CTS Empowerment &amp;<br />Training Solutions</div>
                <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, fontFamily: S.body, marginTop: 6, textTransform: "uppercase" }}>Called To Serve — Committed to Excellence</div>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(196,145,18,0.12)", border: "1px solid rgba(196,145,18,0.3)", borderRadius: 30, padding: "8px 20px", marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: S.gold, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: S.gold, fontFamily: S.body, fontWeight: 600, letterSpacing: 1 }}>APRIL 2026 INTAKE — NOW OPEN</span>
            </div>
            {/* Countdown Timer */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: S.body, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Intake Starts In</div>
              <CountdownTimer targetDate="2026-04-06T09:00:00" />
            </div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
              Build Real Skills.<br /><span style={{ color: S.gold }}>Earn Recognised</span><br />Qualifications.
            </h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              25 programmes from Job Certificate to Bachelor's Equivalent — aligned to NCTVET &amp; City &amp; Guilds. Study online, at your pace, on your schedule.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Apply")} style={{ fontSize: 15, padding: "16px 36px", color: S.navy }}>Apply Now</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ border: "2px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 14 }}>View Programmes</Btn>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src={HERO_LOGO} alt="CTS ETS" style={{ width: "100%", maxWidth: 420, margin: "0 auto", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", display: "block" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["25", "Programmes"], ["5", "Levels"], ["3", "Payment Plans"], ["15%", "Group Discount"]].map(([v, l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "16px 14px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: S.gold }}>{v}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Partner logos */}
      <section style={{ background: S.lightBg, borderBottom: "1px solid rgba(10,35,66,0.06)" }}>
        <Container style={{ padding: "32px clamp(16px,3vw,48px)" }}>
          <PartnerLogos />
        </Container>
      </section>

      {/* Testimonials */}
      <section style={{ background: "#fff", padding: "64px 0" }}>
        <SectionHeader tag="What Our Learners Say" title="Success Stories" desc="Real results from real learners across Jamaica." />
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="resp-grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: S.lightBg, borderRadius: 16, padding: "28px 24px 24px", border: "1px solid rgba(10,35,66,0.06)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 16, right: 20, fontSize: 56, fontFamily: S.heading, color: S.gold, opacity: 0.12, lineHeight: 1 }}>"</div>
                <p style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.75, marginBottom: 22, fontStyle: "italic", flex: 1, position: "relative", zIndex: 1 }}>"{t.quote}"</p>
                <div style={{ height: 1, background: "rgba(10,35,66,0.07)", marginBottom: 16 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={"https://api.dicebear.com/8.x/notionists/svg?seed=" + encodeURIComponent(t.name) + "&backgroundColor=" + t.color.replace("#", "")} alt={t.name} style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, boxShadow: "0 3px 10px " + t.color + "40", background: t.color + "18" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: S.body, fontSize: 14, fontWeight: 700, color: S.navy }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: S.gold, fontFamily: S.body, marginTop: 1, fontWeight: 600 }}>{t.level}</div>
                    <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body, marginTop: 1 }}>📍 {t.parish}, Jamaica</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: t.color + "12", border: "1px solid " + t.color + "30", borderRadius: 6, padding: "5px 10px", alignSelf: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.color, fontFamily: S.body }}>{t.outcome}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 18, fontStyle: "italic", opacity: 0.7 }}>Testimonials shown are representative examples. Names and details have been adjusted to protect privacy.</p>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Btn primary onClick={() => setPage("Apply")} style={{ color: S.navy }}>Join Our Learners — Apply Now</Btn>
          </div>
        </Container>
      </section>

      {/* Learning Portal CTA */}
      <section style={{ background: "#fff", padding: "48px 0", borderTop: "1px solid rgba(10,35,66,0.06)" }}>
        <Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap", padding: "32px clamp(24px,4vw,48px)", background: S.lightBg, borderRadius: 16, border: "1px solid rgba(10,35,66,0.06)" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(46,125,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📚</div>
                <div>
                  <div style={{ fontSize: 10, color: "#2E7D32", letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>Now Available</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, margin: 0, fontWeight: 700 }}>CTS ETS Learning Portal</h3>
                </div>
              </div>
              <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, margin: 0 }}>
                Access your course materials, submit assessments, track your progress, and connect with facilitators — all from one place. Available on desktop and the Canvas Student mobile app.
              </p>
            </div>
            <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 32px", borderRadius: 8, background: "#2E7D32", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(46,125,50,0.2)", transition: "opacity 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }} onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Access Learning Portal →
            </a>
          </div>
        </Container>
      </section>

      {/* Interest Capture / Notify Me */}
      <section style={{ background: S.navy, padding: "48px 0" }}>
        <Container>
          <InterestCapture />
        </Container>
      </section>
    </div>
  );
}

// Interest Capture Component
function InterestCapture() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    // Fire and forget to Apps Script
    try {
      fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify({ form_type: "Interest Capture", email, timestamp: new Date().toISOString() }), mode: "no-cors" });
    } catch (_) {}
    setSent(true);
  };
  if (sent) return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
      <div style={{ fontFamily: S.body, fontSize: 14, color: S.gold, fontWeight: 600 }}>You're on the list! We'll notify you about upcoming intakes.</div>
    </div>
  );
  return (
    <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ fontSize: 10, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 8 }}>Stay Informed</div>
      <h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", marginBottom: 10 }}>Get Notified About Future Intakes</h3>
      <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20, lineHeight: 1.6 }}>Enter your email and we'll let you know when the next enrolment window opens.</p>
      <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "2px solid rgba(196,145,18,0.3)", background: "rgba(255,255,255,0.06)", fontSize: 13, fontFamily: S.body, color: "#fff", outline: "none" }} />
        <button onClick={handleSubmit} style={{ padding: "12px 24px", borderRadius: 8, background: S.gold, color: S.navy, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap" }}>Notify Me</button>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────
function AboutPage() {
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Our Story" title="Why We Started" desc="CTS Empowerment and Training Solutions was founded on a simple but powerful belief: access to quality training can change lives." />
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="resp-grid-2">
          <div>
            <p style={{ fontFamily: S.body, fontSize: 16, lineHeight: 1.8, color: "#2D3748", marginBottom: 18 }}>In Jamaica, thousands of talented individuals are held back — not by lack of ability, but by limited access to affordable, flexible, and professionally recognised training. CTS ETS was established to change that reality.</p>
            <p style={{ fontFamily: S.body, fontSize: 16, lineHeight: 1.8, color: "#2D3748", marginBottom: 18 }}>We deliver competency-based education and training (CBET) that is aligned to both NCTVET and City &amp; Guilds — ensuring our learners graduate with qualifications that are respected nationally and internationally. Our programmes are designed to be practical, employer-relevant, and accessible to working adults, school leavers, and career changers alike.</p>
            <p style={{ fontFamily: S.body, fontSize: 16, lineHeight: 1.8, color: "#2D3748" }}>From our base at 6 Newark Avenue in Kingston, we serve learners across all 14 parishes through flexible online delivery — because geography should never be a barrier to professional growth.</p>
          </div>
          <div style={{ background: S.navy, borderRadius: 16, padding: "clamp(28px,3vw,48px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(196,145,18,0.08)" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ width: 48, height: 3, background: S.gold, marginBottom: 24, borderRadius: 2 }} />
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: "#fff", marginBottom: 24, lineHeight: 1.4 }}>Our Core Values</h3>
              {["Excellence", "Integrity", "Empowerment", "Service"].map((v, i) => (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 3 ? 18 : 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(196,145,18,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: S.gold }} />
                  </div>
                  <span style={{ fontFamily: S.body, fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 48, padding: "24px 0", borderTop: "1px solid rgba(10,35,66,0.08)" }}>
          <p style={{ fontFamily: S.heading, fontSize: 19, color: S.navy, fontStyle: "italic", opacity: 0.7 }}>"Called To Serve — Committed to Excellence"</p>
        </div>

        {/* Founder */}
        <div style={{ marginTop: 48, padding: "clamp(28px,3vw,48px)", background: "#fff", borderRadius: 16, border: "1px solid rgba(10,35,66,0.06)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            <img src={FOUNDER_PHOTO} alt="Dr. Mark O. Lindo" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", flexShrink: 0, boxShadow: "0 4px 16px rgba(1,30,64,0.15)", border: "3px solid " + S.gold }} />
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 6 }}>Founder &amp; Principal</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 14, fontWeight: 700 }}>Mark O. Lindo, Ph.D</h3>
              <p style={{ fontFamily: S.body, fontSize: 15, lineHeight: 1.75, color: "#2D3748", marginBottom: 12 }}>Dr. Mark O. Lindo founded CTS Empowerment and Training Solutions from a clear belief that many individuals are ready to grow, ready to work, and ready to move forward — but access to the right opportunities is often limited. Recognising that gap, he established CTS ETS to help create meaningful pathways for personal and professional development.</p>
              <p style={{ fontFamily: S.body, fontSize: 15, lineHeight: 1.75, color: "#2D3748", marginBottom: 12 }}>His vision was never limited to simply delivering courses. He set out to build a professional learning institution where individuals can develop relevant skills, strengthen their confidence, and prepare for real progress in education, employment, and life.</p>
              <p style={{ fontFamily: S.body, fontSize: 15, lineHeight: 1.75, color: "#2D3748" }}>Dr. Lindo believes that when people are given the right knowledge, support, and opportunities, they are empowered to transform their futures and make a stronger contribution to their communities and the wider world.</p>
              <p style={{ fontFamily: S.heading, fontSize: 16, fontStyle: "italic", color: S.gold, marginTop: 18, lineHeight: 1.6 }}>"May all who come behind us, find us faithful to the end."</p>
            </div>
          </div>
        </div>

        {/* Registration */}
        <div style={{ marginTop: 28, padding: "18px 24px", background: "#fff", borderRadius: 10, border: "1px solid rgba(10,35,66,0.06)", display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🏛️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>Registered Institution</div>
            <p style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>Registered with the Companies of Jamaica — Registration No. 16007/2025. Currently in process for registration with the Ministry of Education, Youth and Information (Independent Schools).</p>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── WHY CHOOSE PAGE ─────────────────────────────────────────────────
function WhyChoosePage({ setPage }) {
  const reasons = [
    { icon: "🕐", title: "Study On Your Terms", desc: "No fixed class times. No commuting. Log in when it suits you — mornings, evenings, weekends." },
    { icon: "💼", title: "Prove You Can Do The Job", desc: "Our CBET model means you build a portfolio of practical evidence employers want." },
    { icon: "⚡", title: "Finish Faster", desc: "At 2 topics per week, most programmes complete in 2–9 months." },
    { icon: "💰", title: "Pay A Fraction", desc: "Programmes from $13,000 to $155,000 JMD — up to 50–81% less than traditional institutions." },
    { icon: "📋", title: "Flexible Payments", desc: "Gold (full), Silver (50/50), or Bronze (20% deposit + monthly instalments)." },
    { icon: "🌍", title: "Internationally Recognised", desc: "City & Guilds and NCTVET qualifications recognised across Jamaica, CARICOM, and beyond." },
  ];
  const audiences = [
    { icon: "👨‍💼", text: "Working adults needing qualifications without leaving their job" },
    { icon: "🛡️", text: "Security professionals formalising experience with NVQ-J" },
    { icon: "🚀", text: "Aspiring entrepreneurs wanting practical business knowledge" },
    { icon: "📞", text: "Customer service & admin professionals advancing to management" },
    { icon: "👥", text: "HR practitioners building credentials from JC to Level 5" },
    { icon: "🏢", text: "Employers investing in team development (15% group discount)" },
  ];
  return (
    <PageWrapper>
      <SectionHeader tag="The CTS Difference" title="Why Choose CTS ETS?" desc="A registered post-secondary vocational training institution delivering 25 programmes almost entirely online." />
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 56 }} className="resp-grid-3">
          {reasons.map(r => (
            <div key={r.title} style={{ background: S.lightBg, borderRadius: 12, padding: "28px 24px", border: "1px solid rgba(10,35,66,0.05)" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{r.icon}</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, marginBottom: 8, fontWeight: 700 }}>{r.title}</h3>
              <p style={{ fontSize: 14, color: S.gray, fontFamily: S.body, lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>
        {/* Who is it for */}
        <div style={{ background: S.navy, borderRadius: 16, padding: "clamp(28px,3vw,48px)", marginBottom: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body }}>Built For You</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: "#fff", margin: "8px 0 0", fontWeight: 700 }}>Who Is CTS ETS For?</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="resp-grid-2">
            {audiences.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{a.icon}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontFamily: S.body, lineHeight: 1.55 }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* What you get */}
        <div style={{ padding: "24px 28px", borderRadius: 12, background: S.lightBg, border: "1px solid rgba(10,35,66,0.06)" }}>
          <h4 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, marginBottom: 14, fontWeight: 700 }}>What Every Programme Includes</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Online learning platform", "Learner guides for every unit", "Internal cluster assessments", "Personalised feedback", "Email & WhatsApp support", "Monthly group Q&A sessions (when required)"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 6, background: "#fff", border: "1px solid rgba(10,35,66,0.06)", fontSize: 13, color: "#2D3748", fontFamily: S.body }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: S.gold, flexShrink: 0 }} />{item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Btn primary onClick={() => setPage("Apply")} style={{ color: S.navy }}>Start Your Application</Btn>
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── PROGRAMMES PAGE ─────────────────────────────────────────────────
function ProgrammesPage({ setPage }) {
  const [activeLevel, setActiveLevel] = useState(Object.keys(PROGRAMMES)[0]);
  const REQUIREMENTS = [
    { level: "Job Certificate", icon: "📝", req: "No formal qualifications required", detail: "Open entry. Suitable for individuals with or without prior training. Basic literacy and numeracy recommended.", color: "#4CAF50" },
    { level: "Level 2 — Vocational Certificate", icon: "📗", req: "Level 1 / Job Certificate OR 2 CXCs", detail: "Completion of a related Job Certificate programme, or at least 2 CXC/CSEC subjects at General Proficiency (Grades 1–3).", color: "#2196F3" },
    { level: "Level 3 — Diploma", icon: "📘", req: "Level 2 Certificate OR 3 CXCs", detail: "Completion of a related Level 2 Vocational Certificate, or at least 3 CXC/CSEC subjects at General Proficiency (Grades 1–3). CAPE passes also accepted.", color: "#7B1FA2" },
    { level: "Level 4 — Associate Equivalent", icon: "📙", req: "Level 3 Diploma required", detail: "Completion of a Level 3 Diploma in a related business area (e.g. Business Administration, Customer Service, HR, or Management). Prior work experience in a relevant field is an advantage.", color: "#E65100" },
    { level: "Level 5 — Bachelor's Equivalent", icon: "🎓", req: "Level 4 Associate required", detail: "Completion of a Level 4 Associate Equivalent in a related business area. Candidates should have a foundation in business operations, management, or a related discipline. Work experience in the field is preferred.", color: "#C62828" },
  ];
  return (
    <PageWrapper>
      <SectionHeader tag="25 Programmes" title="Our Programmes" desc="All aligned to NCTVET and City & Guilds standards, from Job Certificate to Bachelor's Equivalent (Level 5)." />
      <Container>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {Object.keys(PROGRAMMES).map(level => (
            <button key={level} onClick={() => setActiveLevel(level)} style={{ padding: "9px 18px", borderRadius: 6, border: "1px solid", borderColor: activeLevel === level ? S.gold : "rgba(10,35,66,0.1)", background: activeLevel === level ? S.gold : "transparent", color: activeLevel === level ? S.navy : "#2D3748", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.body, transition: "all 0.25s", whiteSpace: "nowrap" }}>{level}</button>
          ))}
        </div>
        <div style={{ background: S.lightBg, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(10,35,66,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px", padding: "14px 24px", background: S.navy, gap: 10 }} className="prog-row">
            {["Programme", "Duration", "Tuition", "Total*"].map((h, i) => (
              <span key={h} style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, textAlign: i > 0 ? "center" : "left" }}>{h}</span>
            ))}
          </div>
          {PROGRAMMES[activeLevel].map((p, i) => (
            <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px", padding: "14px 24px", background: i % 2 === 0 ? "#fff" : S.lightBg, borderBottom: "1px solid rgba(10,35,66,0.03)", gap: 10 }} className="prog-row">
              <div>
                <span style={{ fontSize: 14, color: S.navy, fontFamily: S.body, fontWeight: 500, display: "block" }}>{p.name}</span>
                {p.desc && <span style={{ fontSize: 11, color: S.gray, fontFamily: S.body, lineHeight: 1.4, marginTop: 3, display: "block", opacity: 0.8 }}>{p.desc}</span>}
              </div>
              <span style={{ fontSize: 13, color: S.gray, fontFamily: S.body, textAlign: "center" }}>{p.duration}</span>
              <span style={{ fontSize: 13, color: S.gray, fontFamily: S.body, textAlign: "center" }}>{p.tuition}</span>
              <span style={{ fontSize: 14, color: S.navy, fontFamily: S.body, fontWeight: 700, textAlign: "center" }}>{p.total}</span>
            </div>
          ))}
          <div style={{ padding: "14px 24px", background: "rgba(196,145,18,0.06)", fontSize: 12, color: "#2D3748", fontFamily: S.body, lineHeight: 1.55 }}>
            <strong>* Total = Tuition + $5,000 Registration Fee (non-refundable).</strong> All fees in JMD. Includes cluster assessments. NCTVET external fees separate.
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>What You Need</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Entry Requirements by Level</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, marginTop: 10, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>Each level builds on the one before. Levels 4 and 5 require prior qualifications in a related business area.</p>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 28, top: 40, bottom: 40, width: 2, background: "rgba(10,35,66,0.08)", zIndex: 0 }} className="req-line" />
            {REQUIREMENTS.map((r, i) => (
              <div key={r.level} style={{ display: "flex", gap: 20, marginBottom: i < REQUIREMENTS.length - 1 ? 16 : 0, position: "relative", zIndex: 1 }} className="req-row">
                <div style={{ width: 58, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: r.color + "15", border: "2px solid " + r.color + "40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{r.icon}</div>
                </div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid rgba(10,35,66,0.06)", borderLeft: "3px solid " + r.color }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <h4 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, fontWeight: 700, margin: 0 }}>{r.level}</h4>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.color, fontFamily: S.body, letterSpacing: 0.5, background: r.color + "10", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>{r.req}</span>
                  </div>
                  <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: "18px 24px", borderRadius: 10, background: "rgba(196,145,18,0.05)", border: "1px solid rgba(196,145,18,0.15)", display: "flex", gap: 12, alignItems: "flex-start" }} className="cert-note">
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>Prior Learning &amp; Experience</div>
              <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>Applicants who do not meet the standard entry requirements but have significant work experience in a related field may be considered through our Recognition of Prior Learning (RPL) process. Contact us to discuss your eligibility.</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 40, flexWrap: "wrap", alignItems: "center" }}>
          <Btn primary onClick={() => setPage("Fees & Calculator")} style={{ color: S.navy }}>View Fees &amp; Calculator</Btn>
          <Btn primary onClick={() => setPage("Apply")} style={{ color: S.navy }}>Apply Now</Btn>
          <WhatsAppShare text={"Check out the programmes at CTS ETS — 25 programmes from Job Certificate to Bachelor's Equivalent, aligned to NCTVET & City & Guilds! 🎓 https://ctsetsjm.com"} label="Share Programmes" />
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── CERTIFICATION PAGE ──────────────────────────────────────────────
function CertificationPage() {
  const steps = [
    { num: "01", title: "Internal Cluster Assessments", icon: "📋", desc: "Unit-based practical and knowledge assessments conducted by CTS ETS. Included in your tuition fees.", items: ["End of each unit cluster", "Graded by CTS ETS facilitators", "Practical & knowledge components", "Included in tuition"] },
    { num: "02", title: "NCTVET External Assessment", icon: "🏛️", desc: "Official written and practical exams for NVQ-J certification, set and administered by the NCTVET.", items: ["Written & practical exams", "Set by NCTVET standards", "Required for NVQ-J", "Fees paid to NCTVET separately"] },
    { num: "03", title: "Certification", icon: "🎓", desc: "Nationally and internationally recognised qualifications aligned to NCTVET and City & Guilds.", items: ["NVQ-J national certification", "City & Guilds alignment", "Regional & international recognition", "Pathway to higher levels"] },
  ];
  return (
    <PageWrapper bg="#F5F3EE">
      <SectionHeader tag="Your Pathway" title="Certification & Assessment" desc="All programmes are aligned to both NCTVET and City & Guilds standards with a clear, structured assessment pathway." />
      <Container>
        {/* Partner Logos */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px", marginBottom: 40, border: "1px solid rgba(10,35,66,0.06)" }}>
          <PartnerLogos />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="resp-grid-3">
          {steps.map(s => (
            <div key={s.num} style={{ background: "#fff", borderRadius: 14, padding: "32px 28px", border: "1px solid rgba(10,35,66,0.06)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -8, right: 12, fontSize: 72, fontWeight: 800, color: "rgba(10,35,66,0.03)", fontFamily: S.heading }}>{s.num}</div>
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>Step {s.num}</div>
                <h3 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, marginBottom: 12, fontWeight: 700 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                <div style={{ width: "100%", height: 1, background: "rgba(10,35,66,0.06)", marginBottom: 14 }} />
                {s.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: j < s.items.length - 1 ? 8 : 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: S.gold, marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#2D3748", fontFamily: S.body, lineHeight: 1.45 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, padding: "20px 28px", borderRadius: 10, background: "#fff", border: "1px solid rgba(196,145,18,0.2)", display: "flex", gap: 14, alignItems: "flex-start" }} className="cert-note">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(196,145,18,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 16, color: S.gold }}>ℹ</span></div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>External Assessment Fees</div>
            <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>NCTVET external assessment and certification fees are not included in tuition and are payable directly to the NCTVET. Learners will be advised of applicable fees prior to registration.</p>
          </div>
        </div>

        {/* Institution Certificate Section */}
        <div style={{ marginTop: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>What You Receive</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Your Certifications</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, marginTop: 10, maxWidth: 580, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
              Upon successful completion, every graduate receives <strong>two</strong> forms of certification.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }} className="resp-grid-2">
            <div style={{ background: S.navy, borderRadius: 14, padding: "28px 24px", color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(196,145,18,0.08)" }} />
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏛️</div>
              <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Certificate 1</div>
              <h4 style={{ fontFamily: S.heading, fontSize: 18, color: "#fff", fontWeight: 700, marginBottom: 10 }}>CTS ETS Institutional Certificate</h4>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: S.body, lineHeight: 1.65, margin: 0 }}>
                A professionally designed certificate of completion issued directly by CTS Empowerment & Training Solutions, confirming your successful completion of the programme. Signed by institutional leadership and bearing the CTS ETS seal.
              </p>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid rgba(10,35,66,0.08)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(196,145,18,0.05)" }} />
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎓</div>
              <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Certificate 2</div>
              <h4 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 10 }}>Programme-Aligned Qualification</h4>
              <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.65, margin: 0 }}>
                The nationally/internationally recognised qualification aligned to your programme — either an <strong>NVQ-J certificate via NCTVET</strong> or a <strong>City & Guilds qualification</strong>. The specific awarding body is confirmed at enrolment. Note: programmes are aligned to one body, not both simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Certificate Preview */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Preview</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,26px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Sample Institutional Certificate</h3>
          </div>
          {/* Certificate Design */}
          <div style={{ maxWidth: 680, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px rgba(10,35,66,0.12)", border: "6px solid " + S.navy }}>
            <div style={{ background: S.navy, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <img src={NAV_LOGO} alt="CTS ETS" style={{ height: 48, objectFit: "contain" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: S.gold, fontFamily: "serif", letterSpacing: 2, textTransform: "uppercase" }}>CTS Empowerment & Training Solutions</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "serif", marginTop: 2 }}>Called To Serve — Committed to Excellence</div>
              </div>
            </div>
            <div style={{ padding: "28px 32px 24px", background: "linear-gradient(135deg, #fafaf7 0%, #fff 100%)", textAlign: "center", borderTop: "3px solid " + S.gold, borderBottom: "3px solid " + S.gold }}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: S.gold, fontFamily: "serif", marginBottom: 8 }}>Certificate of Completion</div>
              <div style={{ fontSize: 12, color: S.gray, fontFamily: "serif", marginBottom: 14, fontStyle: "italic" }}>This is to certify that</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,4vw,32px)", color: S.navy, fontWeight: 700, borderBottom: "2px solid " + S.gold, display: "inline-block", padding: "0 24px 8px", marginBottom: 14 }}>
                Learner Full Name
              </div>
              <div style={{ fontSize: 12, color: S.gray, fontFamily: "serif", marginBottom: 8, fontStyle: "italic" }}>has successfully completed all requirements of</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(14px,2.5vw,20px)", color: S.navy, fontWeight: 700, marginBottom: 4 }}>Level 3 Diploma — Customer Service Supervision</div>
              <div style={{ fontSize: 11, color: S.gold, fontFamily: "serif", marginBottom: 18 }}>NVQ-J Aligned Programme</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, maxWidth: 480, margin: "0 auto 16px" }}>
                {[["Issue Date", "April 2026"], ["Programme Duration", "7 Months"], ["Reference", "CTS-2026-001"]].map(([label, val]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: S.gray, fontFamily: "serif", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                    <div style={{ fontSize: 12, color: S.navy, fontFamily: "serif", fontWeight: 700, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: S.gray, fontFamily: "serif", fontStyle: "italic", borderTop: "1px solid rgba(10,35,66,0.08)", paddingTop: 12 }}>
                This certificate is issued in recognition of demonstrated competence and knowledge consistent with national vocational qualification standards.
              </div>
            </div>
            <div style={{ background: S.navy, padding: "10px 28px", display: "flex", justifyContent: "center", gap: 24, alignItems: "center" }}>
              <img src={NCTVET_LOGO} alt="NCTVET" style={{ height: 24, objectFit: "contain", background: "#fff", borderRadius: 3, padding: "2px 4px" }} />
              <img src={CG_LOGO} alt="C&G" style={{ height: 24, objectFit: "contain", background: "#fff", borderRadius: 3, padding: "2px 4px" }} />
              <img src={HEART_LOGO} alt="HEART" style={{ height: 24, objectFit: "contain", background: "#fff", borderRadius: 3, padding: "2px 4px" }} />
            </div>
          </div>
          <p style={{ textAlign: "center", fontFamily: S.body, fontSize: 12, color: S.gray, marginTop: 12, fontStyle: "italic" }}>Sample only — actual certificate will bear learner's name, programme details, and official signatures.</p>
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── FEES & CALCULATOR PAGE ──────────────────────────────────────────
function FeesPage({ setPage }) {
  const levels = [...new Set(CALC_DATA.map(d => d.level))];
  const [selLevel, setSelLevel] = useState(levels[0]);
  const [selProg, setSelProg] = useState(null);
  const [selPlan, setSelPlan] = useState("Gold");
  const [isGroup, setIsGroup] = useState(false);
  const progsForLevel = CALC_DATA.filter(d => d.level === selLevel);
  const prog = selProg || progsForLevel[0];
  const isGoldOnly = prog?.goldOnly;

  useEffect(() => { const p = CALC_DATA.filter(d => d.level === selLevel); setSelProg(p[0]); if (p[0]?.goldOnly) setSelPlan("Gold"); }, [selLevel]);
  useEffect(() => { if (isGoldOnly && selPlan !== "Gold") setSelPlan("Gold"); }, [isGoldOnly, selPlan]);

  const calc = () => {
    if (!prog) return null;
    const t = prog.tuition, gd = isGroup ? 0.85 : 1;
    if (selPlan === "Gold") { const tt = t * gd, ae = tt + REG_FEE; return { plan: "Gold", grandTotal: fmt(ae), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: fmt(tt) + " tuition + " + fmt(REG_FEE) + " reg" }], savings: isGroup ? fmt(t * 0.15) : null }; }
    if (selPlan === "Silver") { const st = t * 1.05 * gd, h = st / 2, ae = h + REG_FEE; return { plan: "Silver", grandTotal: fmt(ae + h), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: fmt(h) + " (50%) + " + fmt(REG_FEE) + " reg" }, { label: "At Mid-Point", amount: fmt(h), detail: "Remaining 50%" }], savings: isGroup ? fmt(t * 1.05 * 0.15) : null }; }
    const bt = t * 1.08 * gd, dep = bt * 0.2, ae = dep + REG_FEE, rem = bt - dep, m = prog.bronzeMonths || 6, mo = Math.round(rem / m);
    return { plan: "Bronze", grandTotal: fmt(ae + mo * m), steps: [{ label: "At Enrolment", amount: fmt(ae), detail: fmt(dep) + " (20%) + " + fmt(REG_FEE) + " reg" }, { label: m + " Monthly Payments", amount: fmt(mo) + "/mth", detail: fmt(rem) + " over " + m + " months" }], savings: isGroup ? fmt(t * 1.08 * 0.15) : null };
  };
  const result = calc();
  const planColors = { Gold: S.gold, Silver: "#8A96A8", Bronze: "#CD7F32" };

  // Print / Share calculator result
  const printResult = () => {
    if (!result || !prog) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>CTS ETS Fee Breakdown</title><style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto}h1{color:#011E40;font-size:24px}h2{color:#C49112;font-size:18px}.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee}.label{color:#666}.amount{font-weight:700;color:#011E40}.total{font-size:22px;font-weight:800}.note{font-size:12px;color:#666;margin-top:20px;line-height:1.6}</style></head><body><h1>CTS Empowerment & Training Solutions</h1><h2>Fee Breakdown — ${result.plan} Plan</h2><p><strong>Programme:</strong> ${prog.name}</p><p><strong>Level:</strong> ${selLevel}</p>${isGroup ? "<p><strong>Group Discount:</strong> 15% applied</p>" : ""}${result.steps.map(s => `<div class="row"><span class="label">${s.label}</span><span class="amount">${s.amount}</span></div><div style="font-size:12px;color:#888;padding-bottom:8px">${s.detail}</div>`).join("")}<div class="row" style="border-top:2px solid #011E40;margin-top:12px;padding-top:16px"><span class="label" style="font-size:16px">Total</span><span class="total">${result.grandTotal}</span></div>${result.savings ? `<p style="color:#2E7D32;font-weight:600">Group discount saves ${result.savings}</p>` : ""}<p class="note">⚠️ Fees shown are current as of April 2026 and are subject to change. NCTVET external assessment fees are separate.</p><p class="note">CTS ETS | ctsetsjm.com | finance@ctsetsjm.com | 876-525-6802</p></body></html>`);
    w.document.close();
    w.print();
  };

  const shareText = result && prog ? `CTS ETS Fee Breakdown:\n${prog.name} (${selLevel})\n${result.plan} Plan: ${result.grandTotal}\n${isGroup ? "Group discount applied!\n" : ""}Apply: https://ctsetsjm.com` : "";

  return (
    <PageWrapper>
      <SectionHeader tag="Plan Your Investment" title="Fees & Payment Calculator" desc="Select your programme and plan to see exactly what you'll pay and when." />
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 48 }} className="resp-grid-3">
          {[{ n: "Gold", f: "0%", d: "Full payment at enrolment. Best value." }, { n: "Silver", f: "+5%", d: "50% at enrolment, 50% at mid-point." }, { n: "Bronze", f: "+8%", d: "20% deposit, then equal monthly payments." }].map(p => (
            <div key={p.n} style={{ background: p.n === "Gold" ? "rgba(196,145,18,0.06)" : S.lightBg, borderRadius: 12, padding: "24px 20px", border: "1px solid " + (p.n === "Gold" ? "rgba(196,145,18,0.2)" : "rgba(10,35,66,0.06)"), textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: planColors[p.n], fontFamily: S.body, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{p.n}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>{p.f}</div>
              <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 8, lineHeight: 1.5 }}>{p.d}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 28, alignItems: "start" }} className="resp-grid-calc">
          <div style={{ background: S.lightBg, borderRadius: 14, padding: "28px 24px", border: "1px solid rgba(10,35,66,0.06)" }}>
            <label style={{ fontSize: 10, color: S.gray, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, display: "block", marginBottom: 8 }}>1. Level</label>
            <select value={selLevel} onChange={e => setSelLevel(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 6, border: "2px solid rgba(10,35,66,0.1)", background: "#fff", fontSize: 13, fontFamily: S.body, color: S.navy, fontWeight: 600, cursor: "pointer", marginBottom: 20, appearance: "none" }}>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <label style={{ fontSize: 10, color: S.gray, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, display: "block", marginBottom: 8 }}>2. Programme</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {progsForLevel.map(p => (
                <button key={p.name} onClick={() => setSelProg(p)} style={{ padding: "10px 14px", borderRadius: 6, border: "2px solid " + (prog?.name === p.name ? S.gold : "rgba(10,35,66,0.08)"), background: prog?.name === p.name ? "rgba(196,145,18,0.06)" : "#fff", color: S.navy, fontSize: 13, fontWeight: prog?.name === p.name ? 700 : 500, cursor: "pointer", fontFamily: S.body, textAlign: "left" }}>
                  <div>{p.name}</div><div style={{ fontSize: 11, color: S.gray, marginTop: 2 }}>Tuition: {fmt(p.tuition)}</div>
                </button>
              ))}
            </div>
            <label style={{ fontSize: 10, color: S.gray, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, display: "block", marginBottom: 8 }}>3. Payment Plan</label>
            {isGoldOnly && <div style={{ fontSize: 11, color: S.gold, fontFamily: S.body, marginBottom: 8, padding: "6px 10px", background: "rgba(196,145,18,0.08)", borderRadius: 4 }}>JC &amp; Level 2: Full payment (Gold) only.</div>}
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {["Gold","Silver","Bronze"].map(plan => { const dis = isGoldOnly && plan !== "Gold"; const act = selPlan === plan; return (
                <button key={plan} onClick={() => !dis && setSelPlan(plan)} style={{ flex: 1, padding: "12px 8px", borderRadius: 6, border: "2px solid " + (act ? planColors[plan] : "rgba(10,35,66,0.08)"), background: act ? planColors[plan] + "12" : "#fff", cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.3 : 1, textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: act ? planColors[plan] : S.gray, fontFamily: S.body }}>{plan}</div>
                  <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body }}>{plan === "Gold" ? "0%" : plan === "Silver" ? "+5%" : "+8%"}</div>
                </button>
              ); })}
            </div>
            <button onClick={() => setIsGroup(!isGroup)} style={{ width: "100%", padding: "12px 14px", borderRadius: 6, border: "2px solid " + (isGroup ? "#2E7D32" : "rgba(10,35,66,0.08)"), background: isGroup ? "rgba(46,125,50,0.05)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: 3, border: "2px solid " + (isGroup ? "#2E7D32" : "#ccc"), background: isGroup ? "#2E7D32" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{isGroup && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}</div>
              <div style={{ textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 600, color: S.navy, fontFamily: S.body }}>Group (8+ learners)</div><div style={{ fontSize: 10, color: S.gray, fontFamily: S.body }}>15% discount</div></div>
            </button>
          </div>
          {result && (
            <div style={{ background: S.navy, borderRadius: 14, padding: "clamp(24px,3vw,36px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,145,18,0.07) 0%, transparent 70%)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 6 }}>Your Payment Schedule</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: S.body, marginBottom: 20 }}>{prog?.name} — {result.plan} Plan</div>
                {result.steps.map((step, i) => (
                  <div key={i} style={{ padding: "18px 0", borderBottom: i < result.steps.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: S.body }}>{step.label}</span>
                      <span style={{ fontSize: 22, fontWeight: 700, color: S.gold, fontFamily: S.heading }}>{step.amount}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>{step.detail}</div>
                  </div>
                ))}
                <div style={{ marginTop: 24, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: S.body }}>Total Cost</span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: S.heading }}>{result.grandTotal}</span>
                  </div>
                  {result.savings && <div style={{ fontSize: 12, color: "#81C784", fontFamily: S.body, marginTop: 8, textAlign: "right" }}>Group discount saves {result.savings}</div>}
                </div>
                {result.plan !== "Gold" && (
                  <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: S.body, lineHeight: 1.5 }}>
                    Silver &amp; Bronze plans include a processing fee (+5% or +8%). Gold plan (full payment) has no surcharge.
                  </div>
                )}
                {/* Save / Print / Share buttons */}
                <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={printResult} style={{ padding: "8px 16px", borderRadius: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.body }}>🖨️ Print</button>
                  <WhatsAppShare text={shareText} label="Share" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 24, padding: "14px 20px", borderRadius: 8, background: "rgba(196,145,18,0.04)", border: "1px solid rgba(196,145,18,0.1)", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
          ⚠️ <strong>Price Fluctuation Disclaimer:</strong> All fees shown are current as of April 2026 and are subject to change. CTS ETS reserves the right to adjust fees with reasonable notice. Confirmed enrolments will be honoured at the rate agreed at the time of registration.
        </div>
      </Container>
    </PageWrapper>
  );
}


// ─── FOR EMPLOYERS PAGE ──────────────────────────────────────────────
function EmployersPage({ setPage }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? GROUP_DISCOUNTS : GROUP_DISCOUNTS.slice(0, 8);
  return (
    <PageWrapper>
      <SectionHeader tag="Corporate Training" title="For Employers" desc="Invest in your team with a 15% group discount on all programmes for 8 or more learners." />
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 48 }} className="resp-grid-3">
          {[["💰", "15% Group Discount", "8 or more learners qualify automatically."], ["📋", "25 Programmes", "From data entry to management — cover every role."], ["🎓", "Certified Workforce", "NCTVET & City & Guilds recognised qualifications."]].map(([icon, title, desc]) => (
            <div key={title} style={{ background: S.lightBg, borderRadius: 12, padding: "28px 24px", border: "1px solid rgba(10,35,66,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, marginBottom: 8, fontWeight: 700 }}>{title}</h3>
              <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
        <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,26px)", color: S.navy, fontWeight: 700, marginBottom: 20 }}>Group Savings Table</h3>
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(10,35,66,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 110px", padding: "14px 24px", background: S.navy, gap: 8 }} className="group-row">
            {["Programme", "Standard", "Group Rate", "You Save"].map((h, i) => (
              <span key={h} style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, textAlign: i > 0 ? "center" : "left" }}>{h}</span>
            ))}
          </div>
          {displayed.map((r, i) => (
            <div key={r.level} style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 110px", padding: "12px 24px", background: i % 2 === 0 ? "#fff" : S.lightBg, borderBottom: "1px solid rgba(10,35,66,0.03)", gap: 8 }} className="group-row">
              <span style={{ fontSize: 13, color: S.navy, fontFamily: S.body, fontWeight: 500 }}>{r.level}</span>
              <span style={{ fontSize: 13, color: S.gray, fontFamily: S.body, textAlign: "center" }}>{r.standard}</span>
              <span style={{ fontSize: 13, color: S.navy, fontFamily: S.body, textAlign: "center", fontWeight: 600 }}>{r.group}</span>
              <span style={{ fontSize: 13, color: "#2E7D32", fontFamily: S.body, textAlign: "center", fontWeight: 700 }}>{r.saving}</span>
            </div>
          ))}
        </div>
        {GROUP_DISCOUNTS.length > 8 && (
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={() => setShowAll(!showAll)} style={{ background: "none", border: "1px solid rgba(10,35,66,0.15)", borderRadius: 6, padding: "9px 24px", fontSize: 12, fontWeight: 600, color: S.navy, cursor: "pointer", fontFamily: S.body }}>{showAll ? "Show Less" : "View All 25 Programmes"}</button>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 36 }}><Btn primary onClick={() => { sessionStorage.setItem("cts_apply_tab", "group"); setPage("Apply"); }} style={{ color: S.navy }}>Enrol Your Team</Btn></div>
      </Container>
    </PageWrapper>
  );
}


// ─── APPLY PAGE ──────────────────────────────────────────────────────
function ApplyPage({ setPage }) {
  const [activeTab, setActiveTab] = useState(() => {
    try { const t = sessionStorage.getItem("cts_apply_tab"); if (t) { sessionStorage.removeItem("cts_apply_tab"); return t; } } catch(_){}
    return "apply";
  });
  const [sector, setSector] = useState("");
  const [publicType, setPublicType] = useState("");
  const [empStatus, setEmpStatus] = useState("");
  const [form, setForm] = useState(() => {
    // Restore from sessionStorage
    try { const saved = sessionStorage.getItem("cts_form_draft"); if (saved) return JSON.parse(saved); } catch(_){}
    return {
      firstName: "", middleName: "", lastName: "", email: "", phone: "", dob: "", parish: "", programme: "", level: "",
      education: "", lastSchool: "", message: "", trn: "", address: "", gender: "", nationality: "Jamaican", maritalStatus: "",
      specialNeeds: "No", specialNeedsType: "",
      emergencyName: "", emergencyPhone: "",
      emergencyRelation: "", paymentPlan: "", jcfDivision: "", jcfStation: "", jcfRank: "",
      orgName: "", department: "", jobTitle: "", yearsService: "",
      _hp: "", // honeypot
    };
  });
  const [files, setFiles] = useState({ heartForm: null, trn: null, photo: null, qualifications: null, nationalId: null, birthCert: null, paymentProof: null });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusEmail, setStatusEmail] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [payRef, setPayRef] = useState("");
  const [payEmail, setPayEmail] = useState("");
  const [paySubmitted, setPaySubmitted] = useState(false);
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState("online"); // "online" or "upload"
  const [payLevel, setPayLevel] = useState("");
  const [payProg, setPayProg] = useState("");
  const [payPlan, setPayPlan] = useState("Gold");
  const [payName, setPayName] = useState("");
  const [payConfirm, setPayConfirm] = useState(false);
  const [payDeclare, setPayDeclare] = useState(false);
  const [payDeclareTimestamp, setPayDeclareTimestamp] = useState(null);
  const [payAppRef, setPayAppRef] = useState(""); // Application reference (CTS-2026-XXXXX)
  const [payStudentId, setPayStudentId] = useState(""); // Only assigned on acceptance
  const [payIdLoading, setPayIdLoading] = useState(false);
  const [payLocked, setPayLocked] = useState(false);
  const [payApplications, setPayApplications] = useState([]); // Multiple applications for same email
  const payLookupTimer = useRef(null);

  // Helper: match level string from application to CALC_DATA key
  const matchLevel = (levelStr) => {
    if (!levelStr) return "";
    return [...new Set(CALC_DATA.map(d => d.level))].find(l => levelStr.toLowerCase().includes(l.toLowerCase().split(" —")[0])) || "";
  };
  const matchProg = (levelKey, progStr) => {
    if (!levelKey || !progStr) return "";
    const p = CALC_DATA.filter(d => d.level === levelKey).find(p => progStr.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]));
    return p ? p.name : "";
  };

  // Select a specific application from the list
  const selectPayApplication = (app) => {
    setPayAppRef(app.ref || "");
    setPayStudentId(app.studentId || ""); // Only present if accepted
    if (app.name) setPayName(app.name);
    const lv = matchLevel(app.level);
    if (lv) {
      setPayLevel(lv);
      setPayProg(matchProg(lv, app.programme));
      if (CALC_DATA.find(d => d.level === lv)?.goldOnly) setPayPlan("Gold");
    }
    setPayLocked(true);
    setPayDeclare(false);
    setPayDeclareTimestamp(null);
    setPayConfirm(false);
  };

  // Auto-lookup applications when email is entered
  const handlePayEmail = (email) => {
    setPayEmail(email);
    setPayAppRef("");
    setPayStudentId("");
    setPayApplications([]);
    setPayLocked(false);
    setPayDeclare(false);
    setPayDeclareTimestamp(null);
    setPayConfirm(false);
    setPayLevel("");
    setPayProg("");
    setPayName("");
    if (payLookupTimer.current) clearTimeout(payLookupTimer.current);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    payLookupTimer.current = setTimeout(async () => {
      setPayIdLoading(true);
      let foundApps = [];
      try {
        const url = APPS_SCRIPT_URL + "?action=lookup&email=" + encodeURIComponent(email.trim());
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.found) {
            // If API returns multiple applications
            if (data.applications && Array.isArray(data.applications)) {
              foundApps = data.applications;
            } else {
              // Single result — wrap in array
              foundApps = [{ ref: data.ref, studentId: data.studentId || "", name: data.name, level: data.level, programme: data.programme, status: data.status }];
            }
          }
        }
      } catch (_) {}
      // Also check localStorage for any not yet synced
      try {
        const localApps = JSON.parse(localStorage.getItem("cts_applications") || "[]")
          .filter(a => a.email.toLowerCase() === email.toLowerCase().trim())
          .map(a => ({ ref: a.ref, studentId: "", name: a.name, level: a.level, programme: a.programme, status: a.status || "Under Review" }));
        // Merge — add local apps that aren't already in foundApps
        localApps.forEach(la => {
          if (!foundApps.find(fa => fa.ref === la.ref)) foundApps.push(la);
        });
      } catch (_) {}

      setPayApplications(foundApps);
      if (foundApps.length === 1) {
        selectPayApplication(foundApps[0]);
      }
      setPayIdLoading(false);
    }, 800);
  };
  const [declareChecked, setDeclareChecked] = useState(false);
  const [declareTimestamp, setDeclareTimestamp] = useState(null);
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const submitGuardRef = useRef(false);
  const [groupForm, setGroupForm] = useState({ companyName: "", contactName: "", contactPosition: "", contactEmail: "", contactPhone: "", sector: "", numLearners: "", selectedProgs: [], message: "" });
  const [groupSubmitted, setGroupSubmitted] = useState(false);
  const [groupSubmitting, setGroupSubmitting] = useState(false);
  const [groupDeclare, setGroupDeclare] = useState(false);
  const [groupDeclareTimestamp, setGroupDeclareTimestamp] = useState(null);
  const ug = (k, v) => setGroupForm(f => ({ ...f, [k]: v }));
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-save form to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem("cts_form_draft", JSON.stringify(form)); } catch(_){}
  }, [form]);

  // Restore sector from sessionStorage
  useEffect(() => {
    try { const s = sessionStorage.getItem("cts_form_sector"); if (s) setSector(s); } catch(_){}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem("cts_form_sector", sector); } catch(_){}
  }, [sector]);

  // Track declaration timestamp
  useEffect(() => {
    if (declareChecked && !declareTimestamp) {
      setDeclareTimestamp(new Date().toISOString());
    } else if (!declareChecked) {
      setDeclareTimestamp(null);
    }
  }, [declareChecked]);

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.15)", background: "#fff", fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: 11, color: "#4A5568", fontWeight: 700, fontFamily: S.body, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 };
  const reqDot = <span style={{ color: "#C62828", marginLeft: 2 }}>*</span>;
  const errMsg = (field) => formErrors[field] ? <div style={{ fontSize: 11, color: "#C62828", fontFamily: S.body, marginTop: 3 }}>{formErrors[field]}</div> : null;

  // Phone / TRN auto-format (strip non-digits)
  const handlePhone = (k, val) => u(k, val.replace(/\D/g, "").slice(0, 10));
  const handleTRN = (val) => u("trn", val.replace(/\D/g, "").slice(0, 9));

  // Email change with typo detection
  const handleEmailChange = (val) => {
    u("email", val);
    if (val.includes("@") && val.length > 5) {
      setEmailSuggestion(suggestEmail(val));
    } else {
      setEmailSuggestion(null);
    }
  };

  // File handler with size validation
  const handleFile = (key, file) => {
    if (!file) return;
    if (!validateFileSize(file)) {
      alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
      return;
    }
    setUploadProgress(p => ({ ...p, [key]: true }));
    setTimeout(() => setUploadProgress(p => ({ ...p, [key]: false })), 800);
    setFiles(f => ({ ...f, [key]: file }));
  };

  const checkStatus = async () => {
    if (!statusEmail) return;
    setStatusLoading(true);
    setStatusResult(null);
    try {
      const url = APPS_SCRIPT_URL + "?action=lookup&email=" + encodeURIComponent(statusEmail.trim());
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.found) {
          setStatusResult(data);
        } else {
          const apps = JSON.parse(localStorage.getItem("cts_applications") || "[]");
          const match = apps.find(a => a.email.toLowerCase() === statusEmail.toLowerCase().trim());
          setStatusResult(match ? match : "notfound");
        }
      } else {
        const apps = JSON.parse(localStorage.getItem("cts_applications") || "[]");
        const match = apps.find(a => a.email.toLowerCase() === statusEmail.toLowerCase().trim());
        setStatusResult(match ? match : "notfound");
      }
    } catch (err) {
      console.error("Status check error:", err);
      const apps = JSON.parse(localStorage.getItem("cts_applications") || "[]");
      const match = apps.find(a => a.email.toLowerCase() === statusEmail.toLowerCase().trim());
      setStatusResult(match ? match : "notfound");
    } finally {
      setStatusLoading(false);
    }
  };

  const generateRef = () => {
    const y = new Date().getFullYear();
    const r = Math.floor(10000 + Math.random() * 90000);
    return "CTS-" + y + "-" + r;
  };

  const [formErrors, setFormErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => { const digits = phone.replace(/\D/g, ""); return digits.length === 10; };
  const validateTRN = (trn) => { const digits = trn.replace(/\D/g, ""); return digits.length === 9; };

  const secA = !!(form.firstName.trim() && form.lastName.trim() && form.email.trim() && validateEmail(form.email) && form.phone.trim() && validatePhone(form.phone) && form.gender && form.parish && form.maritalStatus && form.address.trim() && form.trn.trim() && validateTRN(form.trn));
  const secB = !!(secA && form.emergencyName.trim() && form.emergencyPhone.trim() && validatePhone(form.emergencyPhone) && form.emergencyRelation);
  const secC = !!(secB && form.level && form.programme);
  const secD = !!(secC && form.education && form.lastSchool.trim());
  const secE = !!(secD && sector);
  const secF = !!(secE && files.heartForm);
  const secDeclare = secF;

  // Generate application receipt PDF
  const generateReceiptPDF = (ref, timestamp) => {
    const w = window.open("", "_blank");
    const dt = new Date(timestamp).toLocaleString("en-JM", { dateStyle: "long", timeStyle: "short" });
    w.document.write(`<html><head><title>CTS ETS Application Receipt</title><style>body{font-family:sans-serif;padding:40px;max-width:650px;margin:0 auto;color:#011E40}h1{font-size:22px;border-bottom:3px solid #C49112;padding-bottom:10px}h2{font-size:16px;color:#C49112;margin-top:24px}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:13px}.label{color:#666;font-weight:600}.val{font-weight:600;text-align:right;max-width:60%}.ref{font-size:20px;font-weight:800;color:#011E40;background:#f5f3ee;padding:12px 20px;border-radius:8px;text-align:center;margin:16px 0;border-left:4px solid #C49112}.footer{margin-top:30px;font-size:11px;color:#666;border-top:1px solid #eee;padding-top:16px;line-height:1.6}.stamp{margin-top:20px;padding:12px;background:#f0faf0;border:1px solid #c8e6c9;border-radius:8px;font-size:12px;color:#2E7D32}</style></head><body>`);
    w.document.write(`<h1>CTS Empowerment & Training Solutions</h1><p style="font-size:11px;color:#C49112;letter-spacing:2px;text-transform:uppercase">Application Receipt</p>`);
    w.document.write(`<div class="ref">${ref}</div>`);
    w.document.write(`<div class="row"><span class="label">Applicant</span><span class="val">${form.firstName} ${form.middleName ? form.middleName + " " : ""}${form.lastName}</span></div>`);
    w.document.write(`<div class="row"><span class="label">Email</span><span class="val">${form.email}</span></div>`);
    w.document.write(`<div class="row"><span class="label">Phone</span><span class="val">${form.phone}</span></div>`);
    w.document.write(`<div class="row"><span class="label">TRN</span><span class="val">${form.trn}</span></div>`);
    w.document.write(`<div class="row"><span class="label">Parish</span><span class="val">${form.parish}</span></div>`);
    w.document.write(`<h2>Programme Details</h2>`);
    w.document.write(`<div class="row"><span class="label">Level</span><span class="val">${form.level}</span></div>`);
    w.document.write(`<div class="row"><span class="label">Programme</span><span class="val">${form.programme}</span></div>`);
    if (form.paymentPlan) w.document.write(`<div class="row"><span class="label">Payment Plan</span><span class="val">${form.paymentPlan}</span></div>`);
    w.document.write(`<h2>Employment</h2>`);
    w.document.write(`<div class="row"><span class="label">Sector</span><span class="val">${sector}</span></div>`);
    if (form.orgName) w.document.write(`<div class="row"><span class="label">Organisation</span><span class="val">${form.orgName}</span></div>`);
    w.document.write(`<div class="stamp">✅ Declaration accepted on ${dt}<br/>All information declared accurate and complete.</div>`);
    w.document.write(`<div class="footer"><strong>CTS Empowerment & Training Solutions</strong><br/>6 Newark Avenue, Kingston 11, Jamaica W.I.<br/>finance@ctsetsjm.com | 876-525-6802<br/>ctsetsjm.com | Reg. No. 16007/2025<br/><br/>This receipt confirms submission only. Acceptance and enrolment are subject to document review and payment.</div>`);
    w.document.write(`</body></html>`);
    w.document.close();
    w.print();
  };

  const submitApplication = async () => {
    // Honeypot check — bots will fill the hidden field
    if (form._hp) { console.warn("Bot detected"); return; }
    // Duplicate guard
    if (submitGuardRef.current) return;
    submitGuardRef.current = true;

    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(form.email)) errors.email = "Please enter a valid email";
    if (!form.phone.trim()) errors.phone = "Phone number is required (10 digits, no dashes)";
    else if (!validatePhone(form.phone)) errors.phone = "Phone must be exactly 10 digits (e.g. 8765256802)";
    if (!form.trn.trim()) errors.trn = "TRN is required";
    else if (!validateTRN(form.trn)) errors.trn = "TRN must be exactly 9 digits";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.parish) errors.parish = "Parish of residence is required";
    if (!form.maritalStatus) errors.maritalStatus = "Marital status is required";
    if (!form.address.trim()) errors.address = "Residential address is required";
    if (!form.emergencyName.trim()) errors.emergencyName = "Emergency contact name is required";
    if (!form.emergencyPhone.trim()) errors.emergencyPhone = "Emergency contact number is required (10 digits)";
    else if (!validatePhone(form.emergencyPhone)) errors.emergencyPhone = "Contact number must be exactly 10 digits";
    if (!form.emergencyRelation) errors.emergencyRelation = "Relationship is required";
    if (!form.level) errors.level = "Please select a level";
    if (!form.programme) errors.programme = "Please select a programme";
    if (!form.education) errors.education = "Highest qualification is required";
    if (!form.lastSchool.trim()) errors.lastSchool = "Last school attended is required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) { submitGuardRef.current = false; return; }

    setSubmitting(true);
    try {
    const ref = generateRef();
    const now = new Date();
    const apps = JSON.parse(localStorage.getItem("cts_applications") || "[]");
    apps.push({
      ref, name: form.firstName + " " + form.lastName, email: form.email, phone: form.phone,
      level: form.level, programme: form.programme, status: "Under Review",
      submittedAt: now.toLocaleDateString("en-JM", { day: "numeric", month: "long", year: "numeric" }),
      notes: "Application received. Documents under review. You will be contacted within 24–48 hours.",
      refNumber: ref
    });
    localStorage.setItem("cts_applications", JSON.stringify(apps));

    await submitToAppsScript({
      form_type: "New Application", ref,
      firstName: form.firstName, middleName: form.middleName, lastName: form.lastName,
      email: form.email, phone: form.phone,
      trn: form.trn, parish: form.parish, gender: form.gender, dob: form.dob, address: form.address,
      nationality: form.nationality, maritalStatus: form.maritalStatus,
      specialNeeds: form.specialNeeds, specialNeedsType: form.specialNeedsType,
      level: form.level, programme: form.programme, paymentPlan: form.paymentPlan,
      sector, orgName: form.orgName, department: form.department, jobTitle: form.jobTitle,
      emergencyName: form.emergencyName, emergencyPhone: form.emergencyPhone, emergencyRelation: form.emergencyRelation,
      education: form.education, lastSchool: form.lastSchool, message: form.message,
      declarationTimestamp: declareTimestamp,
    }, { heartForm: files.heartForm, trn: files.trn, photo: files.photo, qualifications: files.qualifications, nationalId: files.nationalId, birthCert: files.birthCert });

    if (window.emailjs) {
      window.emailjs.send("service_05xj674", "template_rvn4485", {
        form_type: "New Application",
        from_name: form.firstName + " " + form.lastName,
        email: form.email,
        phone: form.phone,
        message: "Reference: " + ref + "\nLevel: " + form.level + "\nProgramme: " + form.programme + "\nTRN: " + (form.trn || "N/A") + "\nParish: " + (form.parish || "N/A") + "\nPayment Plan: " + (form.paymentPlan || "N/A") + "\nSector: " + (sector || "N/A") + "\nOrganisation: " + (form.orgName || "N/A") + "\nEducation: " + (form.education || "N/A") + "\nDeclaration: " + (declareTimestamp || "N/A"),
      }).catch(err => console.error("EmailJS error:", err));
    }

    // Clear draft on success
    try { sessionStorage.removeItem("cts_form_draft"); sessionStorage.removeItem("cts_form_sector"); } catch(_){}
    setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      submitGuardRef.current = false;
    }
  };


  // ── Confirmation screen ──
  if (submitted) {
    const savedRef = JSON.parse(localStorage.getItem("cts_applications") || "[]").slice(-1)[0]?.ref || "CTS-PENDING";
    const shareMsg = `I just applied to CTS ETS for ${form.level} — ${form.programme}! 🎓\nReference: ${savedRef}\nApply too: https://ctsetsjm.com`;
    return (
      <PageWrapper>
        <Container style={{ paddingTop: 72, paddingBottom: 72, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(46,125,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>✅</div>
          <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,3vw,32px)", color: S.navy, marginBottom: 10 }}>Application Received</h2>
          <p style={{ fontFamily: S.body, fontSize: 15, color: "#4A5568", maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.75 }}>
            Thank you, <strong>{form.firstName}</strong>. Your application has been received and is now under review by the CTS ETS Admissions Team.
          </p>

          <div style={{ display: "inline-flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            <div style={{ padding: "18px 40px", borderRadius: 12, background: S.navy, boxShadow: "0 8px 32px rgba(1,30,64,0.2)" }}>
              <div style={{ fontSize: 10, color: S.gold, fontFamily: S.body, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Application Reference</div>
              <div style={{ fontFamily: S.heading, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: 2 }}>{savedRef}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: S.body, marginTop: 4 }}>Save this number — use it to track your application</div>
            </div>
            <div style={{ padding: "14px 24px", borderRadius: 10, background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.15)" }}>
              <div style={{ fontSize: 12, color: "#2E7D32", fontFamily: S.body, lineHeight: 1.6, textAlign: "center" }}>📧 A confirmation email has been sent to <strong>{form.email}</strong>. Your permanent Student ID will be issued upon acceptance.</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, maxWidth: 620, margin: "0 auto 28px" }} className="resp-grid-3">
            {[
              ["📋", "Step 1", "Application under review by our admissions team (24–48 hrs)"],
              ["💳", "Step 2", "Payment instructions from Finance Dept sent to " + form.email + " upon acceptance"],
              ["🎓", "Step 3", "Complete payment to confirm enrolment and begin your programme"],
            ].map(([icon, step, desc]) => (
              <div key={step} style={{ padding: "18px 16px", borderRadius: 10, background: "#F8F9FA", border: "1px solid rgba(1,30,64,0.06)", textAlign: "left" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: S.gold, fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{step}</div>
                <p style={{ fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 16 }}>
            Questions? Email <strong>info@ctsetsjm.com</strong> or call <strong>876-525-6802</strong> (Flow) / <strong>876-381-9771</strong> (Digicel)
          </p>
          <div style={{ padding: "14px 24px", borderRadius: 10, background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.15)", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            <div style={{ fontSize: 13, color: "#2E7D32", fontFamily: S.body, lineHeight: 1.6, textAlign: "center" }}>📧 A confirmation email with your <strong>Student ID</strong> and application details has been sent to <strong>{form.email}</strong></div>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <Btn primary onClick={() => { setActiveTab("payment"); setSubmitted(false); }} style={{ color: S.navy }}>Proceed to Payment Centre</Btn>
            <Btn onClick={() => { setActiveTab("status"); setStatusEmail(form.email); setSubmitted(false); }} style={{ color: S.navy }}>Track My Application</Btn>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => generateReceiptPDF(savedRef, declareTimestamp || new Date().toISOString())} style={{ padding: "8px 18px", borderRadius: 6, background: S.lightBg, border: "1px solid rgba(10,35,66,0.1)", fontSize: 12, fontWeight: 600, color: S.navy, cursor: "pointer", fontFamily: S.body }}>🖨️ Download Receipt</button>
            <WhatsAppShare text={shareMsg} label="Share on WhatsApp" />
          </div>

          {/* Learning Portal note */}
          <div style={{ marginTop: 28, padding: "16px 24px", borderRadius: 10, background: "rgba(46,125,50,0.04)", border: "1px solid rgba(46,125,50,0.12)", maxWidth: 520, margin: "28px auto 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>📚</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", fontFamily: S.body }}>Learning Portal</div>
                <p style={{ fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.6, margin: "4px 0 0" }}>Once enrolled, you'll access your course materials, assessments, and progress tracker through our <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" style={{ color: S.gold, fontWeight: 700 }}>Learning Portal</a>. Download the <strong>Canvas Student</strong> app on your phone to study on the go.</p>
              </div>
            </div>
          </div>
        </Container>
      </PageWrapper>
    );
  }


  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Admissions" title="Apply to CTS ETS" desc="Complete the application form below and upload your required documents. Our admissions team will review your submission within 24–48 hours." />
      <Container>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, justifyContent: "center", marginBottom: 40, background: "#fff", borderRadius: 10, padding: 4, maxWidth: 600, margin: "0 auto 40px", boxShadow: "0 2px 8px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.08)" }}>
          {[["apply", "📝  Apply Now"], ["group", "👥  Group Enrol"], ["download", "📥  HEART Form"], ["status", "🔍  Check Status"], ["payment", "💳  Payment Centre"]].map(([v, l]) => (
            <button key={v} onClick={() => setActiveTab(v)} style={{ flex: 1, padding: "11px 8px", borderRadius: 8, border: "none", background: activeTab === v ? S.navy : "transparent", color: activeTab === v ? "#fff" : S.gray, fontSize: 12, fontWeight: activeTab === v ? 700 : 500, cursor: "pointer", fontFamily: S.body, transition: "all 0.2s", whiteSpace: "nowrap" }}>{l}</button>
          ))}
        </div>

        {/* ─── TAB: APPLY ─── */}
        {activeTab === "apply" && (
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            {/* Trust Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20, padding: "8px 16px", borderRadius: 6, background: "rgba(46,125,50,0.04)", border: "1px solid rgba(46,125,50,0.12)" }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontSize: 11, color: "#2E7D32", fontFamily: S.body, fontWeight: 600 }}>Your data is secure. Information is encrypted and only shared with CTS ETS admissions.</span>
            </div>

            {/* Progress indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
              {[["A", "Personal", secA], ["B", "Emergency", secB], ["C", "Programme", secC], ["D", "Education", secD], ["E", "Employment", secE], ["F", "Documents", secF]].map(([letter, step, done], i) => (
                <div key={step} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#2E7D32" : S.navy, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", boxShadow: done ? "0 0 0 3px rgba(46,125,50,0.2)" : "none" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: done ? "#fff" : S.gold }}>{done ? "✓" : letter}</span>
                    </div>
                    <span style={{ fontSize: 9, color: done ? "#2E7D32" : S.gray, fontFamily: S.body, marginTop: 4, whiteSpace: "nowrap", fontWeight: done ? 700 : 400 }} className="hide-xs">{step}</span>
                  </div>
                  {i < 5 && <div style={{ width: "clamp(16px,4vw,40px)", height: 2, background: done ? "#2E7D32" : "rgba(1,30,64,0.1)", margin: "0 2px 16px", transition: "background 0.3s" }} />}
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,48px)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.05)" }}>

              {/* Honeypot (hidden from humans) */}
              <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                <label>Leave blank</label>
                <input type="text" name="_hp" value={form._hp} onChange={e => u("_hp", e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              {/* SECTION A */}
              <SectionBlock num="A" title="Personal Information" desc="Please provide your personal details exactly as they appear on your official identification." complete={secA}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                  <div><label style={labelStyle}>First Name(s) {reqDot}</label><input style={{ ...inputStyle, borderColor: formErrors.firstName ? "#C62828" : undefined }} value={form.firstName} onChange={e => u("firstName", e.target.value)} placeholder="First name(s)" />{errMsg("firstName")}</div>
                  <div><label style={labelStyle}>Middle Name</label><input style={inputStyle} value={form.middleName} onChange={e => u("middleName", e.target.value)} placeholder="Middle name (if any)" /></div>
                  <div><label style={labelStyle}>Last Name {reqDot}</label><input style={{ ...inputStyle, borderColor: formErrors.lastName ? "#C62828" : undefined }} value={form.lastName} onChange={e => u("lastName", e.target.value)} placeholder="Last name" />{errMsg("lastName")}</div>
                  <div><label style={labelStyle}>Gender {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.gender ? "#C62828" : undefined }} value={form.gender} onChange={e => u("gender", e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other / Prefer not to say</option></select>{errMsg("gender")}</div>
                  <div><label style={labelStyle}>Date of Birth {reqDot}</label><input type="date" style={inputStyle} value={form.dob} onChange={e => u("dob", e.target.value)} /></div>
                  <div><label style={labelStyle}>Nationality</label><input style={inputStyle} value={form.nationality} onChange={e => u("nationality", e.target.value)} placeholder="e.g. Jamaican" /></div>
                  <div><label style={labelStyle}>TRN {reqDot}</label><input style={{ ...inputStyle, borderColor: formErrors.trn ? "#C62828" : undefined }} value={form.trn} onChange={e => handleTRN(e.target.value)} placeholder="9-digit Tax Registration Number" maxLength={9} />{errMsg("trn")}</div>
                  <div><label style={labelStyle}>Marital Status {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.maritalStatus ? "#C62828" : undefined }} value={form.maritalStatus} onChange={e => u("maritalStatus", e.target.value)}><option value="">Select</option><option>Single</option><option>Married</option><option>Common Law</option><option>Widowed</option><option>Divorced</option></select>{errMsg("maritalStatus")}</div>
                  <div>
                    <label style={labelStyle}>Email Address {reqDot}</label>
                    <input type="email" style={{ ...inputStyle, borderColor: formErrors.email ? "#C62828" : undefined }} value={form.email} onChange={e => handleEmailChange(e.target.value)} placeholder="your@email.com" />
                    {emailSuggestion && <div style={{ fontSize: 11, color: S.gold, fontFamily: S.body, marginTop: 3, cursor: "pointer" }} onClick={() => { u("email", emailSuggestion); setEmailSuggestion(null); }}>Did you mean <strong>{emailSuggestion}</strong>? (click to accept)</div>}
                    {errMsg("email")}
                  </div>
                  <div>
                    <label style={labelStyle}>Mobile Number {reqDot}</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: S.gray, fontFamily: S.body, pointerEvents: "none" }}>+1</span>
                      <input style={{ ...inputStyle, paddingLeft: 34, borderColor: formErrors.phone ? "#C62828" : undefined }} value={form.phone} onChange={e => handlePhone("phone", e.target.value)} placeholder="8765256802" maxLength={10} />
                    </div>
                    {errMsg("phone")}
                  </div>
                  <div><label style={labelStyle}>Parish of Residence {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.parish ? "#C62828" : undefined }} value={form.parish} onChange={e => u("parish", e.target.value)}><option value="">Select parish</option>{["Kingston","St. Andrew","St. Thomas","Portland","St. Mary","St. Ann","Trelawny","St. James","Hanover","Westmoreland","St. Elizabeth","Manchester","Clarendon","St. Catherine"].map(p => <option key={p}>{p}</option>)}</select>{errMsg("parish")}</div>
                  <div><label style={labelStyle}>Special Needs</label><select style={inputStyle} value={form.specialNeeds} onChange={e => u("specialNeeds", e.target.value)}><option>No</option><option>Yes</option></select></div>
                </div>
                {form.specialNeeds === "Yes" && (
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>Type of Special Need</label><select style={inputStyle} value={form.specialNeedsType} onChange={e => u("specialNeedsType", e.target.value)}><option value="">Select type</option><option>Physical</option><option>Emotional / Behavioural</option><option>Developmental / Learning</option><option>Sensory-Impaired</option><option>Other</option></select></div>
                )}
                <div><label style={labelStyle}>Residential Address {reqDot}</label><input style={{ ...inputStyle, borderColor: formErrors.address ? "#C62828" : undefined }} value={form.address} onChange={e => u("address", e.target.value)} placeholder="Street address, community, parish" />{errMsg("address")}</div>
              </SectionBlock>

              {/* SECTION B */}
              <SectionBlock num="B" title="Emergency Contact" desc="Provide the details of a person we can contact in the event of an emergency." locked={!secA} complete={secB}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="resp-grid-2">
                  <div><label style={labelStyle}>Contact Full Name {reqDot}</label><input style={{ ...inputStyle, borderColor: formErrors.emergencyName ? "#C62828" : undefined }} value={form.emergencyName} onChange={e => u("emergencyName", e.target.value)} placeholder="Full name" />{errMsg("emergencyName")}</div>
                  <div>
                    <label style={labelStyle}>Contact Number {reqDot}</label>
                    <input style={{ ...inputStyle, borderColor: formErrors.emergencyPhone ? "#C62828" : undefined }} value={form.emergencyPhone} onChange={e => handlePhone("emergencyPhone", e.target.value)} placeholder="8761234567 (10 digits)" maxLength={10} />
                    {errMsg("emergencyPhone")}
                  </div>
                  <div><label style={labelStyle}>Relationship to Applicant {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.emergencyRelation ? "#C62828" : undefined }} value={form.emergencyRelation} onChange={e => u("emergencyRelation", e.target.value)}><option value="">Select</option><option>Parent</option><option>Guardian</option><option>Spouse / Partner</option><option>Sibling</option><option>Relative</option><option>Friend</option></select>{errMsg("emergencyRelation")}</div>
                </div>
              </SectionBlock>

              {/* SECTION C */}
              <SectionBlock num="C" title="Programme Selection" desc="Select the level and programme you wish to enrol in." locked={!secB} complete={secC}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                  <div><label style={labelStyle}>Qualification Level {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.level ? "#C62828" : undefined }} value={form.level} onChange={e => u("level", e.target.value)}><option value="">Select level</option>{Object.keys(PROGRAMMES).map(l => <option key={l}>{l}</option>)}</select>{errMsg("level")}</div>
                  <div><label style={labelStyle}>Programme {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.programme ? "#C62828" : undefined }} value={form.programme} onChange={e => u("programme", e.target.value)}><option value="">Select programme</option>{(PROGRAMMES[form.level] || []).map(p => <option key={p.name}>{p.name}</option>)}</select>{errMsg("programme")}</div>
                </div>
                {form.level && !form.level.includes("Job") && !form.level.includes("Level 2") && (
                  <div><label style={labelStyle}>Preferred Payment Plan</label><select style={inputStyle} value={form.paymentPlan} onChange={e => u("paymentPlan", e.target.value)}><option value="">Select plan</option><option>Gold — Full payment (0% surcharge)</option><option>Silver — 50/50 instalments (+5%)</option><option>Bronze — 20% deposit + monthly payments (+8%)</option></select></div>
                )}
              </SectionBlock>

              {/* SECTION D */}
              <SectionBlock num="D" title="Educational Background" desc="Indicate your highest level of academic or vocational qualification." locked={!secC} complete={secD}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                  <div><label style={labelStyle}>Highest Qualification Attained {reqDot}</label><select style={{ ...inputStyle, borderColor: formErrors.education ? "#C62828" : undefined }} value={form.education} onChange={e => u("education", e.target.value)}><option value="">Select</option>{["No formal qualifications","CXC/CSEC (1–4 subjects)","CXC/CSEC (5+ subjects)","CAPE","NVQ-J Level 1 / Job Certificate","NVQ-J Level 2","NVQ-J Level 3 Diploma","Associate Degree","Bachelor's Degree","Postgraduate / Master's","Other"].map(e => <option key={e}>{e}</option>)}</select>{errMsg("education")}</div>
                  <div><label style={labelStyle}>Last School / Institution Attended {reqDot}</label><input style={{ ...inputStyle, borderColor: formErrors.lastSchool ? "#C62828" : undefined }} value={form.lastSchool} onChange={e => u("lastSchool", e.target.value)} placeholder="Name of school or institution" />{errMsg("lastSchool")}</div>
                </div>
              </SectionBlock>

              {/* SECTION E — Employment */}
              <SectionBlock num="E" title="Employment Information" desc="This helps us tailor your learning pathway and confirm group rate eligibility where applicable." locked={!secD} complete={secE}>
                <label style={{ ...labelStyle, marginBottom: 8 }}>Employment Sector {reqDot}</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }} className="resp-grid-2">
                  {[
                    ["public",     "🏛️  Public Sector",                  "Government ministries, statutory bodies & agencies"],
                    ["private",    "🏢  Private Sector",                  "Privately owned companies & organisations"],
                    ["student",    "📚  Full-Time Student",               "Currently enrolled at a school or institution"],
                    ["unemployed", "🔍  Currently Seeking Employment",    "Not currently in paid employment"],
                  ].map(([v, title, sub]) => (
                    <button key={v} onClick={() => { setSector(v); setPublicType(""); setEmpStatus(""); }}
                      style={{ padding: "14px 16px", borderRadius: 10, border: "2px solid " + (sector === v ? S.gold : "rgba(1,30,64,0.1)"), background: sector === v ? "rgba(196,145,18,0.06)" : "#fff", color: S.navy, fontSize: 13, fontWeight: sector === v ? 700 : 500, cursor: "pointer", fontFamily: S.body, textAlign: "left", transition: "all 0.2s" }}>
                      <div>{title}</div>
                      <div style={{ fontSize: 11, color: S.gray, fontWeight: 400, marginTop: 3 }}>{sub}</div>
                    </button>
                  ))}
                </div>

                {sector === "public" && (
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 8 }}>Public Sector Category {reqDot}</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 18 }} className="resp-grid-3">
                      {[
                        ["ministry",     "Government Ministry"],
                        ["statutory",    "Statutory Body / Authority"],
                        ["municipal",    "Parish Council / Municipal"],
                        ["health",       "Health Sector (RHAs, Hospitals)"],
                        ["education",    "Education Sector (Schools, Colleges)"],
                        ["security",     "Security / Emergency Services"],
                        ["other_public", "Other Government Agency"],
                      ].map(([v, l]) => (
                        <button key={v} onClick={() => setPublicType(v)}
                          style={{ padding: "10px 12px", borderRadius: 8, border: "1.5px solid " + (publicType === v ? S.navy : "rgba(1,30,64,0.1)"), background: publicType === v ? S.navy : "#fff", color: publicType === v ? "#fff" : "#4A5568", fontSize: 12, fontWeight: publicType === v ? 700 : 400, cursor: "pointer", fontFamily: S.body, transition: "all 0.2s", textAlign: "center", lineHeight: 1.4 }}>{l}</button>
                      ))}
                    </div>
                    {publicType && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="resp-grid-2">
                        <div><label style={labelStyle}>Ministry / Organisation / Institution Name {reqDot}</label><input style={inputStyle} value={form.orgName} onChange={e => u("orgName", e.target.value)} placeholder="e.g. Ministry of Finance" /></div>
                        <div><label style={labelStyle}>Department / Division</label><input style={inputStyle} value={form.department} onChange={e => u("department", e.target.value)} placeholder="e.g. Human Resource Division" /></div>
                        <div><label style={labelStyle}>Job Title / Position {reqDot}</label><input style={inputStyle} value={form.jobTitle} onChange={e => u("jobTitle", e.target.value)} placeholder="e.g. Administrative Officer" /></div>
                        <div><label style={labelStyle}>Employment Type</label><select style={inputStyle} value={empStatus} onChange={e => setEmpStatus(e.target.value)}><option value="">Select</option><option value="full-time">Full-Time</option><option value="contract">Contract / Temporary</option><option value="casual">Casual</option></select></div>
                        <div><label style={labelStyle}>Years in Post</label><input style={inputStyle} value={form.yearsService} onChange={e => u("yearsService", e.target.value)} placeholder="e.g. 3 years" /></div>
                      </div>
                    )}
                  </div>
                )}

                {sector === "private" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="resp-grid-2">
                    <div><label style={labelStyle}>Company / Organisation Name {reqDot}</label><input style={inputStyle} value={form.orgName} onChange={e => u("orgName", e.target.value)} placeholder="e.g. Sagicor Group Jamaica" /></div>
                    <div><label style={labelStyle}>Industry</label><select style={inputStyle} value={form.department} onChange={e => u("department", e.target.value)}><option value="">Select industry</option>{["Banking & Finance","Insurance","Retail & Distribution","Tourism & Hospitality","Manufacturing","Telecommunications","Information Technology","Legal & Professional Services","Real Estate","Transportation & Logistics","Agriculture","Construction","Other"].map(i => <option key={i}>{i}</option>)}</select></div>
                    <div><label style={labelStyle}>Job Title / Position {reqDot}</label><input style={inputStyle} value={form.jobTitle} onChange={e => u("jobTitle", e.target.value)} placeholder="e.g. Customer Service Representative" /></div>
                    <div><label style={labelStyle}>Employment Type</label><select style={inputStyle} value={empStatus} onChange={e => setEmpStatus(e.target.value)}><option value="">Select</option><option value="full-time">Full-Time</option><option value="part-time">Part-Time</option><option value="self">Self-Employed / Business Owner</option><option value="contract">Contract</option></select></div>
                    <div><label style={labelStyle}>Years with Organisation</label><input style={inputStyle} value={form.yearsService} onChange={e => u("yearsService", e.target.value)} placeholder="e.g. 2 years" /></div>
                  </div>
                )}

                {sector === "student" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="resp-grid-2">
                    <div><label style={labelStyle}>School / Institution Name {reqDot}</label><input style={inputStyle} value={form.orgName} onChange={e => u("orgName", e.target.value)} placeholder="e.g. University of the West Indies" /></div>
                    <div><label style={labelStyle}>Type of Institution</label><select style={inputStyle} value={form.department} onChange={e => u("department", e.target.value)}><option value="">Select</option><option>High School / Secondary</option><option>Community College</option><option>University / Tertiary</option><option>HEART / NSTA Trust</option><option>Vocational / Technical Institution</option><option>Other</option></select></div>
                    <div><label style={labelStyle}>Programme / Course of Study</label><input style={inputStyle} value={form.jobTitle} onChange={e => u("jobTitle", e.target.value)} placeholder="e.g. Business Administration" /></div>
                    <div><label style={labelStyle}>Current Year / Level</label><select style={inputStyle} value={empStatus} onChange={e => setEmpStatus(e.target.value)}><option value="">Select</option><option>Year 1 / Level 1</option><option>Year 2 / Level 2</option><option>Year 3 / Level 3</option><option>Year 4+</option><option>Final Year</option><option>Part-Time Study</option></select></div>
                    <div><label style={labelStyle}>Expected Graduation / Completion Year</label><input style={inputStyle} value={form.yearsService} onChange={e => u("yearsService", e.target.value)} placeholder="e.g. 2026" /></div>
                  </div>
                )}
              </SectionBlock>

              {/* SECTION F: Documents */}
              <SectionBlock num="F" title="Document Upload" desc="Upload the following required documents. Accepted formats: PDF, JPG, PNG (max 5MB each)." locked={!secE} complete={secF}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    ["heartForm", "📋", "Official HEART/NSTA Trust Application Form", "Download from the Official Form tab, complete and upload here"],
                    ["trn", "🔢", "Tax Registration Number (TRN)", "TRN card or official TRN letter"],
                    ["photo", "📷", "Passport-Size Photograph", "Recent colour photo, clear background, plain clothing"],
                    ["birthCert", "📜", "Birth Certificate", "Original or certified copy"],
                    ["qualifications", "🎓", "Academic / Vocational Qualifications", "CXC results slip, CAPE, NVQ-J, or other certificates"],
                    ["nationalId", "🪪", "Government-Issued ID", "National ID card, Passport, or Driver's Licence"],
                  ].map(([key, icon, label, hint]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: "1.5px solid " + (files[key] ? "rgba(46,125,50,0.4)" : "rgba(1,30,64,0.1)"), background: files[key] ? "rgba(46,125,50,0.03)" : "#fff", transition: "all 0.2s" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: files[key] ? "rgba(46,125,50,0.1)" : "rgba(1,30,64,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{uploadProgress[key] ? "⏳" : files[key] ? "✅" : icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{label} {key === "heartForm" ? reqDot : ""}</div>
                        <div style={{ fontSize: 11, color: files[key] ? "#2E7D32" : S.gray, fontFamily: S.body, marginTop: 2 }}>
                          {files[key] ? `✓ ${files[key].name} (${(files[key].size / 1024).toFixed(0)} KB)` : hint}
                        </div>
                      </div>
                      <label style={{ padding: "8px 16px", borderRadius: 6, background: files[key] ? "rgba(46,125,50,0.1)" : S.lightBg, border: "1px solid " + (files[key] ? "rgba(46,125,50,0.2)" : "rgba(1,30,64,0.1)"), fontSize: 12, fontWeight: 700, color: files[key] ? "#2E7D32" : S.navy, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap", transition: "all 0.2s" }}>
                        {files[key] ? "Replace" : "Choose File"}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFile(key, e.target.files[0])} style={{ display: "none" }} />
                      </label>
                    </div>
                  ))}
                </div>
              </SectionBlock>

              {/* Declaration + Submit — locked until all sections complete */}
              <div style={{ position: "relative", opacity: secF ? 1 : 0.45, transition: "opacity 0.3s", pointerEvents: secF ? "auto" : "none" }}>
                {!secF && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "rgba(248,249,250,0.6)", backdropFilter: "blur(2px)" }}>
                    <div style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1.5px solid rgba(1,30,64,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🔒</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Complete all sections above to unlock</span>
                    </div>
                  </div>
                )}

              {/* Additional notes */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Additional Notes or Special Requirements</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.message} onChange={e => u("message", e.target.value)} placeholder="Any questions, relevant work experience, special requirements, or additional information for the admissions team..." />
              </div>

              {/* Declaration with timestamp */}
              <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.08)", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 10 }}>Declaration</div>
                <p style={{ fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.75, margin: "0 0 14px 0" }}>
                  By submitting this application, I declare that all information provided is accurate, truthful, and complete. I understand that any misrepresentation may result in the withdrawal of my enrolment. I have read and understand the <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Terms &amp; Conditions</button> and <button onClick={() => setPage("Privacy")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Privacy Policy</button> of CTS Empowerment &amp; Training Solutions.
                </p>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 8, background: declareChecked ? "rgba(46,125,50,0.06)" : "rgba(1,30,64,0.02)", border: declareChecked ? "1.5px solid rgba(46,125,50,0.3)" : "1.5px solid rgba(1,30,64,0.1)", transition: "all 0.2s" }}>
                  <input type="checkbox" checked={declareChecked} onChange={e => setDeclareChecked(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#2E7D32", cursor: "pointer", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: declareChecked ? "#2E7D32" : "#4A5568", fontFamily: S.body, lineHeight: 1.65, fontWeight: declareChecked ? 600 : 400 }}>
                    I confirm that I have read, understood, and agree to the Terms &amp; Conditions and Privacy Policy as stated above, and I have no objection to the terms outlined therein.
                  </span>
                </label>
                {declareChecked && declareTimestamp && (
                  <div style={{ marginTop: 10, fontSize: 11, color: "#2E7D32", fontFamily: S.body, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>✅</span> Declaration accepted on {new Date(declareTimestamp).toLocaleString("en-JM", { dateStyle: "long", timeStyle: "short" })}
                  </div>
                )}
              </div>

              {/* Payment notice */}
              <div style={{ padding: "14px 20px", borderRadius: 10, background: "rgba(196,145,18,0.05)", border: "1px solid rgba(196,145,18,0.2)", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💳</span>
                <p style={{ fontSize: 13, color: "#4A5568", fontFamily: S.body, lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: S.navy }}>Next Step — Payment:</strong> Once your application and documents are reviewed and accepted, payment instructions will be sent to your email address by the Finance Department (finance@ctsetsjm.com). Payment must be completed within 48 hours to secure your place.
                </p>
              </div>

              <button onClick={submitApplication} disabled={!declareChecked || submitting} style={{ width: "100%", padding: "17px", borderRadius: 10, background: (!declareChecked || submitting) ? "#4A5568" : S.navy, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: (!declareChecked || submitting) ? "not-allowed" : "pointer", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", boxShadow: declareChecked && !submitting ? "0 4px 16px rgba(1,30,64,0.25)" : "none", transition: "all 0.2s", opacity: (!declareChecked || submitting) ? 0.5 : 1 }}
                onMouseEnter={e => { if (declareChecked && !submitting) e.currentTarget.style.background = "#001228"; }}
                onMouseLeave={e => { if (declareChecked && !submitting) e.currentTarget.style.background = S.navy; }}>
                {submitting ? "⏳ Submitting Application — Please Wait..." : !declareChecked ? "🔒 Please Accept Declaration Above" : "Submit Application →"}
              </button>
              {!declareChecked && <p style={{ textAlign: "center", fontSize: 11, color: "#C62828", fontFamily: S.body, marginTop: 8 }}>You must accept the declaration above before submitting your application.</p>}
              <p style={{ textAlign: "center", fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 12 }}>Your Student ID and reference number will be displayed immediately after submission.</p>
              </div>{/* end cascading lock wrapper */}
            </div>
          </div>
        )}

        {/* ─── TAB: GROUP ENROLMENT ─── */}
        {activeTab === "group" && (
          groupSubmitted ? (
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
              <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, marginBottom: 12 }}>Group Enquiry Submitted!</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: "#2D3748", maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.7 }}>
                Thank you, <strong>{groupForm.contactName}</strong>. Our team will prepare a group quotation for <strong>{groupForm.companyName}</strong> and contact you within 24–48 hours.
              </p>
              <div style={{ padding: "16px 24px", borderRadius: 10, background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.15)", maxWidth: 420, margin: "0 auto 24px" }}>
                <div style={{ fontSize: 13, color: "#2E7D32", fontFamily: S.body, lineHeight: 1.6 }}>📧 A confirmation has been sent to <strong>{groupForm.contactEmail}</strong></div>
              </div>
              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>📧 finance@ctsetsjm.com &nbsp;|&nbsp; 📞 876-525-6802</p>
            </div>
          ) : (() => {
            const groupReqComplete = !!(groupForm.companyName.trim() && groupForm.contactName.trim() && groupForm.contactPosition.trim() && groupForm.contactEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(groupForm.contactEmail) && groupForm.contactPhone.trim() && groupForm.contactPhone.replace(/\D/g,"").length === 10 && groupForm.sector && groupForm.numLearners && parseInt(groupForm.numLearners) >= 1 && groupForm.selectedProgs.length > 0);

            const groupTotals = (() => {
              let standardTotal = 0, groupTotal = 0;
              groupForm.selectedProgs.forEach(prog => {
                // Find which PROGRAMMES key this prog starts with
                const levelKey = Object.keys(PROGRAMMES).find(k => prog.startsWith(k + " — "));
                if (levelKey) {
                  const progName = prog.slice(levelKey.length + 3); // skip " — "
                  const match = PROGRAMMES[levelKey].find(p => p.name === progName);
                  if (match) {
                    const totalNum = parseInt(match.total.replace(/[$,]/g, ""));
                    standardTotal += totalNum;
                    groupTotal += Math.round(totalNum * 0.85);
                  }
                }
              });
              const numL = parseInt(groupForm.numLearners) || 1;
              return { perLearner: standardTotal, perLearnerGroup: groupTotal, allStandard: standardTotal * numL, allGroup: groupTotal * numL, savingPer: standardTotal - groupTotal, savingAll: (standardTotal - groupTotal) * numL, count: groupForm.selectedProgs.length, numLearners: numL };
            })();

            const groupLevels = Object.keys(PROGRAMMES);
            const currentGroupLevel = groupForm._activeLevel || groupLevels[0];

            return (
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(28px,4vw,48px)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.05)" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(196,145,18,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 28 }}>👥</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 8 }}>Group / Employer Enrolment</h3>
                  <p style={{ fontFamily: S.body, fontSize: 14, color: "#4A5568", lineHeight: 1.6 }}>Enrolling 8 or more learners? Complete this form and our team will prepare a group quotation with your <strong>15% discount</strong> applied.</p>
                </div>

                <div style={{ padding: "14px 18px", borderRadius: 8, background: "rgba(46,125,50,0.04)", border: "1px solid rgba(46,125,50,0.12)", marginBottom: 28, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>💰</span>
                  <div style={{ fontSize: 13, color: "#2E7D32", fontFamily: S.body, lineHeight: 1.5 }}><strong>15% group discount</strong> applies automatically for 8+ learners in a single programme intake.</div>
                </div>

                {/* Row 1: Sector (left) + Organisation (right) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                  <div><label style={labelStyle}>Sector {reqDot}</label><select style={inputStyle} value={groupForm.sector} onChange={e => ug("sector", e.target.value)}>
                    <option value="">Select sector</option>
                    <optgroup label="Public Sector">
                      <option>Public Sector — Government Ministry</option>
                      <option>Public Sector — Statutory Body / Authority</option>
                      <option>Public Sector — Parish Council / Municipal</option>
                      <option>Public Sector — Health (RHAs, Hospitals)</option>
                      <option>Public Sector — Education (Schools, Colleges)</option>
                      <option>Public Sector — Security / Emergency Services</option>
                      <option>Public Sector — Other Government Agency</option>
                    </optgroup>
                    <optgroup label="Private Sector">
                      <option>Private Sector — Banking &amp; Finance</option>
                      <option>Private Sector — Insurance</option>
                      <option>Private Sector — Retail &amp; Distribution</option>
                      <option>Private Sector — Tourism &amp; Hospitality</option>
                      <option>Private Sector — Manufacturing</option>
                      <option>Private Sector — Telecommunications</option>
                      <option>Private Sector — Information Technology</option>
                      <option>Private Sector — Legal &amp; Professional Services</option>
                      <option>Private Sector — Real Estate</option>
                      <option>Private Sector — Transportation &amp; Logistics</option>
                      <option>Private Sector — Agriculture</option>
                      <option>Private Sector — Construction</option>
                      <option>Private Sector — Other</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option>NGO / Non-Profit</option>
                      <option>Other</option>
                    </optgroup>
                  </select></div>
                  <div><label style={labelStyle}>Company / Organisation Name {reqDot}</label><input style={inputStyle} value={groupForm.companyName} onChange={e => ug("companyName", e.target.value)} placeholder="e.g. Ministry of Finance" /></div>
                </div>

                {/* Row 2: Contact details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                  <div><label style={labelStyle}>Contact Person (Full Name) {reqDot}</label><input style={inputStyle} value={groupForm.contactName} onChange={e => ug("contactName", e.target.value)} placeholder="e.g. John Smith" /></div>
                  <div><label style={labelStyle}>Position / Job Title {reqDot}</label><input style={inputStyle} value={groupForm.contactPosition} onChange={e => ug("contactPosition", e.target.value)} placeholder="e.g. HR Manager" /></div>
                  <div><label style={labelStyle}>Contact Email {reqDot}</label><input type="email" style={inputStyle} value={groupForm.contactEmail} onChange={e => ug("contactEmail", e.target.value)} placeholder="john@company.com" /></div>
                  <div><label style={labelStyle}>Contact Phone {reqDot}</label><input style={inputStyle} value={groupForm.contactPhone} onChange={e => ug("contactPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="8765256802" maxLength={10} /></div>
                  <div><label style={labelStyle}>Number of Learners {reqDot}</label><input type="number" min="1" style={inputStyle} value={groupForm.numLearners} onChange={e => ug("numLearners", e.target.value)} placeholder="e.g. 12" /></div>
                </div>

                {/* Programme selector — Level tabs + checkboxes */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Programme(s) of Interest {reqDot} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10, color: S.gray }}> — select across any level</span></label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {groupLevels.map(level => {
                      const count = groupForm.selectedProgs.filter(p => p.startsWith(level)).length;
                      return (
                        <button key={level} onClick={() => ug("_activeLevel", level)} style={{ padding: "7px 14px", borderRadius: 6, border: "1.5px solid " + (currentGroupLevel === level ? S.gold : "rgba(1,30,64,0.1)"), background: currentGroupLevel === level ? S.gold : "#fff", color: currentGroupLevel === level ? S.navy : "#4A5568", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.body, transition: "all 0.2s", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                          {level.split(" — ")[0]}
                          {count > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: currentGroupLevel === level ? S.navy : S.gold, color: currentGroupLevel === level ? S.gold : S.navy, fontSize: 10, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ border: "1.5px solid rgba(1,30,64,0.1)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                    {(PROGRAMMES[currentGroupLevel] || []).map((p, i) => {
                      const val = currentGroupLevel + " — " + p.name;
                      const checked = groupForm.selectedProgs.includes(val);
                      const totalNum = parseInt(p.total.replace(/[$,]/g, ""));
                      const groupPrice = fmt(Math.round(totalNum * 0.85));
                      return (
                        <label key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", background: checked ? "rgba(196,145,18,0.05)" : "transparent", borderBottom: i < (PROGRAMMES[currentGroupLevel] || []).length - 1 ? "1px solid rgba(1,30,64,0.04)" : "none", transition: "background 0.15s" }}
                          onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "rgba(1,30,64,0.02)"; }}
                          onMouseLeave={e => { if (!checked) e.currentTarget.style.background = checked ? "rgba(196,145,18,0.05)" : "transparent"; }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            ug("selectedProgs", checked ? groupForm.selectedProgs.filter(x => x !== val) : [...groupForm.selectedProgs, val]);
                          }} style={{ width: 18, height: 18, accentColor: S.gold, cursor: "pointer", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, color: S.navy, fontFamily: S.body, fontWeight: checked ? 700 : 500 }}>{p.name}</div>
                            {p.desc && <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, lineHeight: 1.4, marginTop: 2 }}>{p.desc}</div>}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 13, color: S.navy, fontFamily: S.body, fontWeight: 700 }}>{groupPrice}</div>
                            <div style={{ fontSize: 10, color: S.gray, fontFamily: S.body, textDecoration: "line-through" }}>{p.total}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {groupForm.selectedProgs.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {groupForm.selectedProgs.map(prog => (
                        <span key={prog} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "rgba(196,145,18,0.08)", border: "1px solid rgba(196,145,18,0.2)", fontSize: 11, color: S.navy, fontFamily: S.body, fontWeight: 600 }}>
                          {prog.split(" — ").slice(1).join(" — ")}
                          <button onClick={() => ug("selectedProgs", groupForm.selectedProgs.filter(x => x !== prog))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: S.gray, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Totals summary panel */}
                {groupForm.selectedProgs.length > 0 && (
                  <div style={{ background: S.navy, borderRadius: 12, padding: "20px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,145,18,0.08) 0%, transparent 70%)" }} />
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>Estimated Group Pricing</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="resp-grid-2">
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginBottom: 4 }}>Per Learner ({groupTotals.count} programme{groupTotals.count !== 1 ? "s" : ""})</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: S.gold, fontFamily: S.heading }}>{fmt(groupTotals.perLearnerGroup)}</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: S.body, textDecoration: "line-through" }}>{fmt(groupTotals.perLearner)}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#81C784", fontFamily: S.body, marginTop: 2 }}>Save {fmt(groupTotals.savingPer)} per learner</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginBottom: 4 }}>Total for {groupTotals.numLearners} Learner{groupTotals.numLearners !== 1 ? "s" : ""}</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: S.heading }}>{fmt(groupTotals.allGroup)}</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: S.body, textDecoration: "line-through" }}>{fmt(groupTotals.allStandard)}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#81C784", fontFamily: S.body, marginTop: 2, fontWeight: 700 }}>Total savings: {fmt(groupTotals.savingAll)}</div>
                        </div>
                      </div>
                      <div style={{ padding: "10px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: S.body, lineHeight: 1.5 }}>
                        Estimates based on 15% group discount. Final quotation may vary. Registration fees ($5,000 per learner) included. NCTVET external fees separate.
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Additional Details</label>
                  <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={groupForm.message} onChange={e => ug("message", e.target.value)} placeholder="Any specific requirements, preferred start date, billing arrangements, or questions for our team..." />
                </div>

                {/* Declaration */}
                <div style={{ position: "relative", opacity: groupReqComplete ? 1 : 0.45, transition: "opacity 0.3s", pointerEvents: groupReqComplete ? "auto" : "none", marginBottom: 20 }}>
                  {!groupReqComplete && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(248,249,250,0.6)", backdropFilter: "blur(2px)" }}>
                      <div style={{ padding: "8px 16px", borderRadius: 6, background: "#fff", border: "1.5px solid rgba(1,30,64,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14 }}>🔒</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Complete all required fields above to unlock</span>
                      </div>
                    </div>
                  )}
                  <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.08)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 10 }}>Declaration</div>
                    <p style={{ fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.75, margin: "0 0 14px 0" }}>
                      By submitting this group enrolment enquiry, I confirm that I am authorised to act on behalf of <strong>{groupForm.companyName || "[Organisation]"}</strong> and that the information provided above is accurate and complete. I understand that CTS ETS will contact me to discuss programme details, group pricing, and enrolment procedures. I have read and agree to the <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Terms &amp; Conditions</button> and <button onClick={() => setPage("Privacy")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Privacy Policy</button>.
                    </p>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 8, background: groupDeclare ? "rgba(46,125,50,0.06)" : "rgba(1,30,64,0.02)", border: groupDeclare ? "1.5px solid rgba(46,125,50,0.3)" : "1.5px solid rgba(1,30,64,0.1)", transition: "all 0.2s" }}>
                      <input type="checkbox" checked={groupDeclare} onChange={e => { setGroupDeclare(e.target.checked); if (e.target.checked && !groupDeclareTimestamp) setGroupDeclareTimestamp(new Date().toISOString()); if (!e.target.checked) setGroupDeclareTimestamp(null); }} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#2E7D32", cursor: "pointer", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: groupDeclare ? "#2E7D32" : "#4A5568", fontFamily: S.body, lineHeight: 1.65, fontWeight: groupDeclare ? 600 : 400 }}>
                        I confirm that I am authorised to submit this enquiry on behalf of the above organisation, and I agree to the Terms &amp; Conditions and Privacy Policy.
                      </span>
                    </label>
                    {groupDeclare && groupDeclareTimestamp && (
                      <div style={{ marginTop: 10, fontSize: 11, color: "#2E7D32", fontFamily: S.body, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>✅</span> Declaration accepted on {new Date(groupDeclareTimestamp).toLocaleString("en-JM", { dateStyle: "long", timeStyle: "short" })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button onClick={async () => {
                  setGroupSubmitting(true);
                  try {
                    const progsText = groupForm.selectedProgs.join("; ");
                    await submitToAppsScript({
                      form_type: "Group Enrolment Enquiry",
                      companyName: groupForm.companyName, sector: groupForm.sector,
                      contactName: groupForm.contactName, contactPosition: groupForm.contactPosition,
                      email: groupForm.contactEmail, phone: groupForm.contactPhone,
                      numLearners: groupForm.numLearners, programmes: progsText,
                      estimatedTotal: fmt(groupTotals.allGroup), estimatedSavings: fmt(groupTotals.savingAll),
                      message: groupForm.message || "No additional details provided",
                      declarationTimestamp: groupDeclareTimestamp,
                    }, {});
                    if (window.emailjs) {
                      window.emailjs.send("service_05xj674", "template_rvn4485", {
                        form_type: "Group Enrolment Enquiry",
                        from_name: groupForm.contactName + " — " + groupForm.contactPosition + " (" + groupForm.companyName + ")",
                        email: groupForm.contactEmail, phone: groupForm.contactPhone,
                        message: "Company: " + groupForm.companyName + "\nSector: " + groupForm.sector + "\nPosition: " + groupForm.contactPosition + "\nLearners: " + groupForm.numLearners + "\nProgramme(s): " + progsText + "\nEst. Total: " + fmt(groupTotals.allGroup) + " (savings: " + fmt(groupTotals.savingAll) + ")\n\n" + (groupForm.message || ""),
                      }).catch(err => console.error("EmailJS error:", err));
                    }
                    setGroupSubmitted(true);
                  } catch (err) { console.error("Group submit error:", err); alert("Something went wrong. Please try again."); }
                  finally { setGroupSubmitting(false); }
                }} disabled={!groupDeclare || groupSubmitting} style={{ width: "100%", padding: "16px", borderRadius: 10, background: (!groupDeclare || groupSubmitting) ? "#4A5568" : S.navy, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: (!groupDeclare || groupSubmitting) ? "not-allowed" : "pointer", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", opacity: (!groupDeclare || groupSubmitting) ? 0.5 : 1, transition: "all 0.2s", boxShadow: groupDeclare && !groupSubmitting ? "0 4px 16px rgba(1,30,64,0.25)" : "none" }}
                  onMouseEnter={e => { if (groupDeclare && !groupSubmitting) e.currentTarget.style.background = "#001228"; }}
                  onMouseLeave={e => { if (groupDeclare && !groupSubmitting) e.currentTarget.style.background = S.navy; }}>
                  {groupSubmitting ? "⏳ Submitting Enquiry..." : !groupDeclare ? "🔒 Please Accept Declaration Above" : "Submit Group Enquiry →"}
                </button>
                {!groupDeclare && groupReqComplete && <p style={{ textAlign: "center", fontSize: 11, color: "#C62828", fontFamily: S.body, marginTop: 8 }}>You must accept the declaration above before submitting.</p>}

                <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 8, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.06)", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6, textAlign: "center" }}>
                  💡 Need to apply individually? Use the <strong>Apply Now</strong> tab. Group enquiries are processed separately — our team will contact you with a quotation and bulk application instructions.
                </div>
              </div>
            </div>
            );
          })()
        )}

        {/* ─── TAB: DOWNLOAD ─── */}
        {activeTab === "download" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(28px,4vw,48px)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.05)", textAlign: "center" }}>
              <img src={HEART_LOGO} alt="HEART NSTA Trust" style={{ height: 64, objectFit: "contain", marginBottom: 20 }} />
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 10 }}>HEART Official Application</h3>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "#4A5568", lineHeight: 1.7, maxWidth: 460, margin: "0 auto 28px" }}>
                CTS ETS uses the official HEART/NSTA Trust Application for Admission Form. Download it below, complete all sections in <strong>BLOCK LETTERS</strong>, sign the declaration, then return to the <strong>Apply Now</strong> tab to submit it with your documents.
              </p>
              <a href="/HEART%20Application%20for%20Admission%20Form.pdf" download="HEART_Application_for_Admission_Form.pdf"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 10, background: S.navy, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body, textDecoration: "none", marginBottom: 28, boxShadow: "0 4px 16px rgba(1,30,64,0.2)" }}>
                <img src={HEART_LOGO} alt="" style={{ height: 20, objectFit: "contain" }} />
                Download HEART Application Form (PDF)
              </a>
              <div style={{ width: "100%", height: 1, background: "rgba(1,30,64,0.07)", margin: "0 0 28px" }} />
              <h4 style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, marginBottom: 18, textAlign: "left" }}>Required Documents Checklist</h4>
              <div style={{ textAlign: "left" }}>
                {[
                  ["📋", "Completed HEART/NSTA Application Form", "All sections completed in BLOCK LETTERS, signed"],
                  ["🔢", "Tax Registration Number (TRN)", "TRN card or official TRN letter"],
                  ["📷", "Passport-Size Photograph", "Colour, recent, clear background"],
                  ["📜", "Birth Certificate", "Original or certified copy"],
                  ["🎓", "Academic / Vocational Qualifications", "CXC results, CAPE, NVQ-J, or other relevant certificates"],
                  ["🪪", "Government-Issued Photo ID", "National ID, Passport, or Driver's Licence"],
                ].map(([icon, label, detail]) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(1,30,64,0.05)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(1,30,64,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{label}</div>
                      <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 2 }}>{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab("apply")} style={{ marginTop: 28, width: "100%", padding: "14px", borderRadius: 10, background: S.gold, color: S.navy, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
                Proceed to Application Form →
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB: STATUS ─── */}
        {activeTab === "status" && (
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(28px,4vw,44px)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.05)" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(1,30,64,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 24 }}>🔍</div>
                <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 8 }}>Track Your Application</h3>
                <p style={{ fontFamily: S.body, fontSize: 14, color: "#4A5568", lineHeight: 1.6 }}>Enter the email address you used when applying to see your application status and next steps.</p>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={statusEmail} onChange={e => setStatusEmail(e.target.value)} placeholder="your@email.com" type="email" onKeyDown={e => e.key === "Enter" && !statusLoading && checkStatus()} />
                  <button onClick={checkStatus} disabled={statusLoading} style={{ padding: "12px 22px", borderRadius: 8, background: statusLoading ? "#4A5568" : S.navy, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: statusLoading ? "wait" : "pointer", fontFamily: S.body, whiteSpace: "nowrap", opacity: statusLoading ? 0.7 : 1, transition: "all 0.2s", minWidth: 120 }}>{statusLoading ? "⏳ Checking..." : "Check Status"}</button>
                </div>
              </div>

              {statusResult === "notfound" && (
                <div style={{ padding: "16px 20px", borderRadius: 10, background: "#fff3f3", border: "1px solid #ffcdd2" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#c62828", fontFamily: S.body, marginBottom: 4 }}>No Application Found</div>
                  <p style={{ fontSize: 13, color: "#555", fontFamily: S.body, margin: 0 }}>No application was found for <strong>{statusEmail}</strong>. Please verify the email address used during application, or contact us at <strong>info@ctsetsjm.com</strong>.</p>
                </div>
              )}

              {statusResult && statusResult !== "notfound" && (() => {
                const statusConfig = {
                  "Under Review": { colour: "#F59E0B", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", icon: "📋", step: 1, next: "Our admissions team is reviewing your application and documents. You will receive an email within 24–48 hours." },
                  "Documents Needed": { colour: "#E65100", bg: "rgba(230,81,0,0.06)", border: "rgba(230,81,0,0.2)", icon: "📄", step: 1, next: "Additional documents are required. Please upload them using the Upload Documents tab on this page, or email them to info@ctsetsjm.com." },
                  "Accepted": { colour: "#2E7D32", bg: "rgba(46,125,50,0.06)", border: "rgba(46,125,50,0.2)", icon: "✅", step: 2, next: "Congratulations! Complete your payment via the Payment Centre tab to secure your place and receive access to the Learning Portal." },
                  "Enrolled": { colour: "#0D47A1", bg: "rgba(13,71,161,0.06)", border: "rgba(13,71,161,0.2)", icon: "🎓", step: 3, next: "You're enrolled! Access your course materials at canvas.instructure.com. Download the Canvas Student app to study on the go." },
                  "Completed": { colour: "#C49112", bg: "rgba(196,145,18,0.06)", border: "rgba(196,145,18,0.15)", icon: "🏆", step: 4, next: "Congratulations on completing your programme! Your certificate has been emailed to you. NCTVET external assessment details will follow." },
                  "Deferred": { colour: "#6A1B9A", bg: "rgba(106,27,154,0.06)", border: "rgba(106,27,154,0.2)", icon: "⏸️", step: 0, next: "Your application has been deferred. Contact us at info@ctsetsjm.com to discuss options for a future intake." },
                  "Withdrawn": { colour: "#616161", bg: "rgba(97,97,97,0.06)", border: "rgba(97,97,97,0.2)", icon: "↩️", step: 0, next: "Your application has been withdrawn. If you wish to re-apply, you are welcome to submit a new application." },
                  "Rejected": { colour: "#B71C1C", bg: "rgba(183,28,28,0.06)", border: "rgba(183,28,28,0.2)", icon: "📨", step: 0, next: "Your application was not successful at this time. Contact info@ctsetsjm.com for guidance on reapplication." },
                };
                const apps = statusResult.applications || [statusResult];
                const steps = [
                  { label: "Applied", desc: "Application received" },
                  { label: "Accepted", desc: "Payment required" },
                  { label: "Enrolled", desc: "Learning started" },
                  { label: "Completed", desc: "Certified" },
                ];
                return <div>
                  {apps.map((app, idx) => {
                    const cfg = statusConfig[app.status] || statusConfig["Under Review"];
                    return <div key={app.ref} style={{ marginBottom: idx < apps.length - 1 ? 24 : 0 }}>
                      {/* Header */}
                      <div style={{ background: S.navy, padding: "14px 20px", borderRadius: "12px 12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: S.body }}>{app.name || "Application"}</div>
                        <div style={{ fontSize: 11, color: S.gold, fontFamily: S.body, fontWeight: 700, letterSpacing: 1 }}>{app.ref}</div>
                      </div>

                      {/* Student ID */}
                      {app.studentId && <div style={{ background: "rgba(196,145,18,0.08)", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "1px solid rgba(1,30,64,0.05)", borderRight: "1px solid rgba(1,30,64,0.05)" }}>
                        <span style={{ fontSize: 11, color: S.gray, fontWeight: 700, fontFamily: S.body, letterSpacing: 0.5, textTransform: "uppercase" }}>Student ID</span>
                        <span style={{ fontSize: 14, color: S.navy, fontWeight: 800, fontFamily: S.heading, letterSpacing: 1 }}>{app.studentId}</span>
                      </div>}

                      <div style={{ background: S.lightBg, borderRadius: "0 0 12px 12px", border: "1px solid rgba(1,30,64,0.07)", borderTop: "none", padding: 20 }}>
                        {/* Progress timeline */}
                        {cfg.step > 0 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, padding: "0 4px" }}>
                          {steps.map((s, si) => {
                            const active = si < cfg.step;
                            const current = si === cfg.step - 1;
                            return <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative" }}>
                              <div style={{ width: current ? 32 : 24, height: current ? 32 : 24, borderRadius: "50%", background: active ? cfg.colour : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: current ? 14 : 11, color: active ? "#fff" : "#A0AEC0", fontWeight: 700, fontFamily: S.body, transition: "all 0.3s", border: current ? "3px solid " + cfg.colour : "none", boxShadow: current ? "0 0 0 4px " + cfg.bg : "none" }}>{active ? "✓" : si + 1}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: active ? cfg.colour : "#A0AEC0", fontFamily: S.body, marginTop: 6, textAlign: "center" }}>{s.label}</div>
                              <div style={{ fontSize: 9, color: "#A0AEC0", fontFamily: S.body, textAlign: "center" }}>{s.desc}</div>
                              {si < steps.length - 1 && <div style={{ position: "absolute", top: current ? 16 : 12, left: "55%", width: "90%", height: 2, background: active && si < cfg.step - 1 ? cfg.colour : "#E2E8F0" }} />}
                            </div>;
                          })}
                        </div>}

                        {/* Details */}
                        {[["Programme", app.level + " — " + app.programme], ["Payment Plan", app.payPlan || "To be confirmed"], ["Date Submitted", app.submittedAt]].map(([label, val]) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(1,30,64,0.05)", fontSize: 13, fontFamily: S.body }}>
                            <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                            <span style={{ color: S.navy, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{val}</span>
                          </div>
                        ))}

                        {/* Status badge */}
                        <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 8, background: cfg.bg, border: "1px solid " + cfg.border }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: cfg.colour, fontFamily: S.body }}>Status: {app.status}</span>
                          </div>
                          <p style={{ fontSize: 13, color: "#4A5568", fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>{cfg.next}</p>
                        </div>

                        {/* Action buttons based on status */}
                        {app.status === "Accepted" && <div style={{ marginTop: 14, textAlign: "center" }}>
                          <button onClick={() => { setActiveTab("payment"); setStatusEmail(statusEmail); }} style={{ padding: "12px 28px", borderRadius: 8, background: "#2E7D32", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Go to Payment Centre →</button>
                        </div>}
                        {app.status === "Documents Needed" && <div style={{ marginTop: 14, textAlign: "center" }}>
                          <button onClick={() => setActiveTab("apply")} style={{ padding: "12px 28px", borderRadius: 8, background: "#E65100", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Upload Documents →</button>
                        </div>}
                        {app.status === "Enrolled" && <div style={{ marginTop: 14, textAlign: "center" }}>
                          <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 8, background: "#2E7D32", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700, fontFamily: S.body }}>📚 Access Learning Portal →</a>
                        </div>}
                      </div>
                    </div>;
                  })}

                  <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 8, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.06)", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6, textAlign: "center" }}>
                    For urgent queries: <strong>info@ctsetsjm.com</strong> | <strong>876-525-6802</strong> (Flow) | <strong>876-381-9771</strong> (Digicel)<br />
                    Payment queries: <strong>finance@ctsetsjm.com</strong>
                  </div>
                </div>;
              })()}

              {!statusResult && (
                <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 8, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.06)", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6, textAlign: "center" }}>
                  💡 Haven't applied yet? Use the <strong>Apply Now</strong> tab. Your application reference and status will be retrievable here using your registered email.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: PAYMENT CENTRE ─── */}
        {activeTab === "payment" && (
          paySubmitted ? (
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>💳</div>
              <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, marginBottom: 12 }}>
                {payMethod === "online" ? "Payment Initiated!" : "Payment Evidence Received!"}
              </h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: "#2D3748", maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.7 }}>
                {payMethod === "online"
                  ? "Thank you. If your payment was successful, your enrolment will be confirmed within 24–48 hours. Check your email for a receipt from WiPay."
                  : "Thank you. We have received your payment evidence and will confirm your enrolment within 48 hours."}
              </p>
              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>📧 finance@ctsetsjm.com &nbsp;|&nbsp; 📞 876-525-6802</p>
            </div>
          ) : (
            <div>
              {/* Plan cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 36 }} className="resp-grid-3">
                {[["Gold — Full Payment", "0% surcharge. Pay everything at enrolment. Best value.", S.gold], ["Silver — Two Instalments", "+5% processing fee. 50% at enrolment, 50% at mid-point.", "#8A96A8"], ["Bronze — Monthly", "+8% processing fee. 20% deposit, then monthly instalments.", "#CD7F32"]].map(([name, desc, color]) => (
                  <div key={name} style={{ background: S.lightBg, borderRadius: 12, padding: "24px 20px", border: "1px solid rgba(10,35,66,0.06)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color, fontFamily: S.body, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{name.split(" — ")[0]}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>{name.split(" — ")[1]}</div>
                    <p style={{ fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.55, margin: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ padding: "18px 24px", borderRadius: 10, background: "rgba(196,145,18,0.06)", border: "1px solid rgba(196,145,18,0.2)", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 36 }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>⏱️</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>48-Hour Payment Window</div>
                  <p style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>Once you receive your payment information from the Finance Department (<strong>finance@ctsetsjm.com</strong>), please complete payment <strong>within 48 hours</strong> to secure your place. Late submissions may result in your spot being released.</p>
                </div>
              </div>

              {/* Method toggle */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <div style={{ display: "flex", background: S.lightBg, borderRadius: 10, padding: 4, border: "1px solid rgba(1,30,64,0.08)" }}>
                  {[["online", "💳  Pay Online"], ["upload", "📤  Upload Evidence"]].map(([v, l]) => (
                    <button key={v} onClick={() => { setPayMethod(v); setPayConfirm(false); setPayDeclare(false); setPayDeclareTimestamp(null); }} style={{ padding: "11px 24px", borderRadius: 8, border: "none", background: payMethod === v ? S.navy : "transparent", color: payMethod === v ? "#fff" : S.gray, fontSize: 13, fontWeight: payMethod === v ? 700 : 500, cursor: "pointer", fontFamily: S.body, transition: "all 0.2s", whiteSpace: "nowrap" }}>{l}</button>
                  ))}
                </div>
              </div>

              {/* ── PAY ONLINE ── */}
              {payMethod === "online" && (() => {
                const payCalcLevels = [...new Set(CALC_DATA.map(d => d.level))];
                const payCalcProgs = CALC_DATA.filter(d => d.level === payLevel);
                const paySelectedProg = payCalcProgs.find(p => p.name === payProg) || payCalcProgs[0];
                const payIsGoldOnly = paySelectedProg?.goldOnly;
                const payCalcAmount = (() => {
                  if (!paySelectedProg) return null;
                  const t = paySelectedProg.tuition;
                  const plan = payIsGoldOnly ? "Gold" : payPlan;
                  if (plan === "Gold") return { label: "Full Payment", amount: t + REG_FEE, detail: fmt(t) + " tuition + " + fmt(REG_FEE) + " reg" };
                  if (plan === "Silver") { const st = t * 1.05, h = st / 2; return { label: "1st Instalment (50%)", amount: Math.round(h) + REG_FEE, detail: fmt(Math.round(h)) + " (50%) + " + fmt(REG_FEE) + " reg" }; }
                  if (plan === "Bronze") { const bt = t * 1.08, dep = bt * 0.2; return { label: "Deposit (20%)", amount: Math.round(dep) + REG_FEE, detail: fmt(Math.round(dep)) + " (20%) + " + fmt(REG_FEE) + " reg" }; }
                  return null;
                })();

                const wipayReady = WIPAY_CONFIG.accountNumber && WIPAY_CONFIG.apiKey;
                const canPay = !!(payEmail && payName && payAppRef && payLevel && paySelectedProg && payCalcAmount);

                const initiateWiPay = async () => {
                  if (!canPay) return;
                  setPaySubmitting(true);
                  try {
                    // Log payment attempt to Apps Script
                    await submitToAppsScript({
                      form_type: "Online Payment Initiated",
                      email: payEmail, name: payName, applicationRef: payAppRef, studentId: payStudentId || "",
                      level: payLevel, programme: paySelectedProg?.name,
                      plan: payIsGoldOnly ? "Gold" : payPlan,
                      amount: payCalcAmount.amount, currency: "JMD",
                      declarationTimestamp: payDeclareTimestamp,
                    }, {});

                    if (wipayReady) {
                      // WiPay hosted checkout redirect
                      const formData = new URLSearchParams({
                        account_number: WIPAY_CONFIG.accountNumber,
                        avs: "0",
                        country_code: WIPAY_CONFIG.country,
                        currency: WIPAY_CONFIG.currency,
                        data: JSON.stringify({ email: payEmail, programme: paySelectedProg?.name, level: payLevel, plan: payIsGoldOnly ? "Gold" : payPlan }),
                        environment: WIPAY_CONFIG.sandbox ? "sandbox" : "live",
                        fee_structure: "customer_pay",
                        method: "credit_card",
                        order_id: "CTS-" + Date.now(),
                        origin: "CTS ETS Website",
                        response_url: WIPAY_CONFIG.returnUrl,
                        total: payCalcAmount.amount.toFixed(2),
                        version: "1",
                      });
                      window.location.href = WIPAY_CONFIG.baseUrl + "?" + formData.toString();
                    } else {
                      // WiPay not configured — show manual instructions
                      setPaySubmitted(true);
                    }
                  } catch (err) {
                    console.error("Payment error:", err);
                    alert("Something went wrong. Please try the Upload Evidence option or contact us.");
                  } finally {
                    setPaySubmitting(false);
                  }
                };

                return (
                <div style={{ maxWidth: 620, margin: "0 auto" }}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,3vw,40px)", border: "1px solid rgba(10,35,66,0.06)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(196,145,18,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💳</div>
                      <div>
                        <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, margin: 0 }}>Pay Online</h3>
                        <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, margin: 0 }}>Secure payment via Visa, Mastercard, or bank transfer</p>
                      </div>
                    </div>

                    {/* Secure badges */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                      {["🔒 SSL Encrypted", "💳 Visa / Mastercard", "🏦 Bank Transfer"].map(b => (
                        <span key={b} style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(46,125,50,0.04)", border: "1px solid rgba(46,125,50,0.12)", fontSize: 11, color: "#2E7D32", fontFamily: S.body, fontWeight: 600 }}>{b}</span>
                      ))}
                    </div>

                    {/* Email — always editable (triggers lookup) */}
                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Email Address {reqDot}</label>
                      <input type="email" style={inputStyle} value={payEmail} onChange={e => handlePayEmail(e.target.value)} placeholder="Enter the email you used to apply" />
                    </div>

                    {/* Auto-filled fields — shown after lookup */}
                    {payIdLoading && (
                      <div style={{ padding: "20px", textAlign: "center", marginBottom: 14 }}>
                        <div style={{ fontSize: 14 }}>⏳</div>
                        <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 6 }}>Looking up your application...</div>
                      </div>
                    )}

                    {/* Multiple applications — let student pick */}
                    {!payIdLoading && payApplications.length > 1 && !payLocked && (
                      <div style={{ marginBottom: 20, animation: "fadeIn 0.25s ease" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 10 }}>Multiple applications found — select the one you are paying for:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {payApplications.map(app => (
                            <button key={app.ref} onClick={() => selectPayApplication(app)}
                              style={{ padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(1,30,64,0.1)", background: "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = S.gold; e.currentTarget.style.background = "rgba(196,145,18,0.03)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(1,30,64,0.1)"; e.currentTarget.style.background = "#fff"; }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{app.programme || "Programme"}</div>
                                <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 2 }}>{app.level} · Ref: {app.ref}</div>
                                {app.studentId && <div style={{ fontSize: 10, color: "#2E7D32", fontFamily: S.body, marginTop: 2 }}>Student ID: {app.studentId}</div>}
                              </div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: ({"Accepted":"#2E7D32","Under Review":"#F59E0B","Enrolled":"#0D47A1"}[app.status] || S.gold), padding: "3px 10px", borderRadius: 20, fontFamily: S.body, whiteSpace: "nowrap" }}>{app.status || "Pending"}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locked detail card — single or selected application */}
                    {payLocked && payAppRef && !payIdLoading && (
                      <div style={{ background: "rgba(46,125,50,0.03)", border: "1.5px solid rgba(46,125,50,0.15)", borderRadius: 12, padding: "18px 20px", marginBottom: 20, animation: "fadeIn 0.25s ease" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                          <span style={{ fontSize: 16 }}>✅</span>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", fontFamily: S.body }}>Application found — please confirm your details</div>
                        </div>
                        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(1,30,64,0.06)", overflow: "hidden" }}>
                          {[
                            ["Application Reference", payAppRef],
                            ...(payStudentId ? [["Student ID", payStudentId]] : []),
                            ["Full Name", payName],
                            ["Level", payLevel],
                            ["Programme", paySelectedProg?.name || "—"],
                            ["Payment Plan", payIsGoldOnly ? "Gold — Full Payment" : payPlan + (payCalcAmount ? " — " + payCalcAmount.label : "")],
                          ].map(([label, val], i, arr) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(1,30,64,0.04)" : "none", fontSize: 13, fontFamily: S.body }}>
                              <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                              <span style={{ color: label === "Student ID" ? "#2E7D32" : S.navy, fontWeight: 700, textAlign: "right", maxWidth: "60%", letterSpacing: label === "Application Reference" || label === "Student ID" ? 0.5 : 0 }}>{val || "—"}</span>
                            </div>
                          ))}
                        </div>
                        {payApplications.length > 1 && (
                          <button onClick={() => { setPayLocked(false); setPayAppRef(""); setPayStudentId(""); setPayDeclare(false); setPayDeclareTimestamp(null); }} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 6, background: "transparent", border: "1.5px solid rgba(1,30,64,0.15)", color: S.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body, marginRight: 8 }}>
                            ← Select different application
                          </button>
                        )}
                        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, background: "rgba(196,145,18,0.04)", border: "1px solid rgba(196,145,18,0.12)", fontSize: 11, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
                          Details incorrect? Contact the Finance Department at <a href="mailto:finance@ctsetsjm.com" style={{ color: S.gold, fontWeight: 700 }}>finance@ctsetsjm.com</a> or call <strong>876-525-6802</strong>.
                        </div>
                      </div>
                    )}

                    {!payLocked && !payIdLoading && payEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payEmail) && payApplications.length === 0 && (
                      <div style={{ padding: "14px 18px", borderRadius: 8, background: "#fff3f3", border: "1px solid #ffcdd2", marginBottom: 14, fontSize: 12, color: "#c62828", fontFamily: S.body, lineHeight: 1.6 }}>
                        <strong>No application found</strong> for <strong>{payEmail}</strong>. Please check the email address, <button onClick={() => setActiveTab("apply")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>submit an application first</button>, or contact the Finance Department at <a href="mailto:finance@ctsetsjm.com" style={{ color: S.gold, fontWeight: 700 }}>finance@ctsetsjm.com</a>.
                      </div>
                    )}

                    {/* Amount display */}
                    {payCalcAmount && paySelectedProg && (
                      <div style={{ background: S.navy, borderRadius: 12, padding: "20px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,145,18,0.08) 0%, transparent 70%)" }} />
                        <div style={{ position: "relative", zIndex: 2 }}>
                          <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 4 }}>Amount Due Now — {payCalcAmount.label}</div>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginBottom: 12 }}>{paySelectedProg.name}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <span style={{ fontSize: 32, fontWeight: 800, color: S.gold, fontFamily: S.heading }}>{fmt(payCalcAmount.amount)}</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>JMD</span>
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body, marginTop: 4 }}>{payCalcAmount.detail}</div>
                        </div>
                      </div>
                    )}

                    {/* WiPay not configured notice */}
                    {!wipayReady && !payConfirm && (
                      <div style={{ padding: "14px 18px", borderRadius: 8, background: "rgba(196,145,18,0.06)", border: "1px solid rgba(196,145,18,0.15)", marginBottom: 20, fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.65 }}>
                        <strong style={{ color: S.navy }}>🔧 Online payments coming soon.</strong> Our secure payment gateway is being finalised. In the meantime, please use the <strong>Upload Evidence</strong> option after making a bank transfer, or contact us for payment instructions.
                      </div>
                    )}

                    {/* Step 1: Review button (before confirmation) */}
                    {!payConfirm && (
                      <button onClick={() => setPayConfirm(true)} disabled={!canPay} style={{ width: "100%", padding: "17px", borderRadius: 10, background: !canPay ? "#4A5568" : S.navy, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: !canPay ? "not-allowed" : "pointer", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", opacity: !canPay ? 0.5 : 1, transition: "all 0.2s", boxShadow: canPay ? "0 4px 16px rgba(1,30,64,0.25)" : "none" }}>
                        {canPay ? "Review Payment →" : "Complete fields above to continue"}
                      </button>
                    )}

                    {/* Step 2: Confirmation panel */}
                    {payConfirm && payCalcAmount && paySelectedProg && (
                      <div style={{ animation: "fadeIn 0.25s ease" }}>
                        <div style={{ padding: "20px 24px", borderRadius: 12, background: "rgba(46,125,50,0.03)", border: "2px solid rgba(46,125,50,0.15)", marginBottom: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <span style={{ fontSize: 20 }}>✅</span>
                            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Please confirm your payment details</div>
                          </div>

                          <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(1,30,64,0.06)", marginBottom: 16 }}>
                            {[
                              ["Full Name", payName],
                              ["Email", payEmail],
                              ["Application Reference", payAppRef], ...(payStudentId ? [["Student ID", payStudentId]] : []),
                              ["Level", payLevel],
                              ["Programme", paySelectedProg.name],
                              ["Payment Plan", payIsGoldOnly ? "Gold — Full Payment" : payPlan + " — " + payCalcAmount.label],
                              ["Amount Due Now", fmt(payCalcAmount.amount) + " JMD"],
                              ["Breakdown", payCalcAmount.detail],
                            ].map(([label, val], i) => (
                              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < 7 ? "1px solid rgba(1,30,64,0.04)" : "none", fontSize: 13, fontFamily: S.body }}>
                                <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                                <span style={{ color: label === "Amount Due Now" ? "#2E7D32" : S.navy, fontWeight: label === "Amount Due Now" ? 800 : 600, textAlign: "right", maxWidth: "58%" }}>{val}</span>
                              </div>
                            ))}
                          </div>

                          <div style={{ padding: "10px 14px", borderRadius: 6, background: "rgba(196,145,18,0.06)", fontSize: 11, color: "#4A5568", fontFamily: S.body, lineHeight: 1.6, marginBottom: 16 }}>
                            ⚠️ By clicking <strong>Confirm &amp; Pay</strong>, you will be redirected to our secure payment partner to complete your transaction. A receipt will be sent to <strong>{payEmail}</strong>.
                          </div>

                          {/* Payment Declaration */}
                          <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.08)", marginBottom: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 10 }}>Payment Declaration</div>
                            <p style={{ fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.75, margin: "0 0 12px 0" }}>
                              I confirm the following payment details:
                            </p>
                            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(1,30,64,0.06)", marginBottom: 14, overflow: "hidden" }}>
                              {[["Application Reference", payAppRef], ...(payStudentId ? [["Student ID", payStudentId]] : []), ["Programme", paySelectedProg.name], ["Level", payLevel], ["Payment Plan", (payIsGoldOnly ? "Gold" : payPlan) + " — " + payCalcAmount.label], ["Amount", fmt(payCalcAmount.amount) + " JMD"]].map(([label, val], i) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: i < 4 ? "1px solid rgba(1,30,64,0.04)" : "none", fontSize: 12, fontFamily: S.body }}>
                                  <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                                  <span style={{ color: label === "Amount" ? "#2E7D32" : S.navy, fontWeight: label === "Amount" ? 800 : 600 }}>{val}</span>
                                </div>
                              ))}
                            </div>
                            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 8, background: payDeclare ? "rgba(46,125,50,0.06)" : "rgba(1,30,64,0.02)", border: payDeclare ? "1.5px solid rgba(46,125,50,0.3)" : "1.5px solid rgba(1,30,64,0.1)", transition: "all 0.2s" }}>
                              <input type="checkbox" checked={payDeclare} onChange={e => { setPayDeclare(e.target.checked); if (e.target.checked && !payDeclareTimestamp) setPayDeclareTimestamp(new Date().toISOString()); if (!e.target.checked) setPayDeclareTimestamp(null); }} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#2E7D32", cursor: "pointer", flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: payDeclare ? "#2E7D32" : "#4A5568", fontFamily: S.body, lineHeight: 1.65, fontWeight: payDeclare ? 600 : 400 }}>
                                I confirm that the payment details above are correct and I authorise this transaction of <strong>{fmt(payCalcAmount.amount)} JMD</strong> for <strong>{paySelectedProg.name}</strong> at CTS Empowerment &amp; Training Solutions. I understand that the registration fee is non-refundable and I agree to the <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Terms &amp; Conditions</button>.
                              </span>
                            </label>
                            {payDeclare && payDeclareTimestamp && (
                              <div style={{ marginTop: 10, fontSize: 11, color: "#2E7D32", fontFamily: S.body, display: "flex", alignItems: "center", gap: 6 }}>
                                <span>✅</span> Declaration accepted on {new Date(payDeclareTimestamp).toLocaleString("en-JM", { dateStyle: "long", timeStyle: "short" })}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => { setPayConfirm(false); setPayDeclare(false); setPayDeclareTimestamp(null); }} style={{ flex: 1, padding: "14px", borderRadius: 8, background: "transparent", border: "2px solid rgba(1,30,64,0.15)", color: S.navy, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
                              ← Edit Details
                            </button>
                            <button onClick={wipayReady ? initiateWiPay : () => { setPayConfirm(false); setPayDeclare(false); setPayDeclareTimestamp(null); setPayMethod("upload"); }} disabled={!payDeclare || paySubmitting} style={{ flex: 2, padding: "14px", borderRadius: 8, background: (!payDeclare || paySubmitting) ? "#4A5568" : "#2E7D32", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: (!payDeclare || paySubmitting) ? "not-allowed" : "pointer", fontFamily: S.body, letterSpacing: 0.5, opacity: (!payDeclare || paySubmitting) ? 0.5 : 1, transition: "all 0.2s", boxShadow: payDeclare && !paySubmitting ? "0 4px 16px rgba(46,125,50,0.25)" : "none" }}
                              onMouseEnter={e => { if (payDeclare && !paySubmitting) e.currentTarget.style.background = "#1B5E20"; }}
                              onMouseLeave={e => { if (payDeclare && !paySubmitting) e.currentTarget.style.background = (!payDeclare || paySubmitting) ? "#4A5568" : "#2E7D32"; }}>
                              {paySubmitting ? "⏳ Processing..." : !payDeclare ? "🔒 Accept Declaration to Continue" : wipayReady ? "🔒 Confirm & Pay — " + fmt(payCalcAmount.amount) : "📤 Confirm & Upload Evidence"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: S.gray, fontFamily: S.body }}>🔒 Payments processed securely by WiPay</span>
                    </div>
                  </div>
                </div>
                );
              })()}

              {/* ── UPLOAD EVIDENCE ── */}
              {payMethod === "upload" && (() => {
                const upCalcLevels = [...new Set(CALC_DATA.map(d => d.level))];
                const upCalcProgs = CALC_DATA.filter(d => d.level === payLevel);
                const upSelectedProg = upCalcProgs.find(p => p.name === payProg) || upCalcProgs[0];
                const upIsGoldOnly = upSelectedProg?.goldOnly;
                const upCalcAmount = (() => {
                  if (!upSelectedProg) return null;
                  const t = upSelectedProg.tuition;
                  const plan = upIsGoldOnly ? "Gold" : payPlan;
                  if (plan === "Gold") return { label: "Full Payment", amount: t + REG_FEE, detail: fmt(t) + " tuition + " + fmt(REG_FEE) + " reg" };
                  if (plan === "Silver") { const st = t * 1.05, h = st / 2; return { label: "1st Instalment (50%)", amount: Math.round(h) + REG_FEE, detail: fmt(Math.round(h)) + " (50%) + " + fmt(REG_FEE) + " reg" }; }
                  if (plan === "Bronze") { const bt = t * 1.08, dep = bt * 0.2; return { label: "Deposit (20%)", amount: Math.round(dep) + REG_FEE, detail: fmt(Math.round(dep)) + " (20%) + " + fmt(REG_FEE) + " reg" }; }
                  return null;
                })();
                const upReqComplete = !!(payEmail && payAppRef && payLevel && upSelectedProg && upCalcAmount && files.paymentProof);

                return (
              <div style={{ maxWidth: 620, margin: "0 auto" }}>
                <div style={{ background: S.lightBg, borderRadius: 16, padding: "clamp(24px,3vw,40px)", border: "1px solid rgba(10,35,66,0.06)" }}>
                  <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, marginBottom: 20 }}>Upload Payment Evidence</h3>

                  {/* Email — always editable */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Your Email Address {reqDot}</label>
                    <input type="email" style={inputStyle} value={payEmail} onChange={e => handlePayEmail(e.target.value)} placeholder="Enter the email you used to apply" />
                  </div>

                  {payIdLoading && (
                    <div style={{ padding: "20px", textAlign: "center", marginBottom: 14 }}>
                      <div style={{ fontSize: 14 }}>⏳</div>
                      <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 6 }}>Looking up your application...</div>
                    </div>
                  )}

                  {/* Multiple applications — let student pick */}
                  {!payIdLoading && payApplications.length > 1 && !payLocked && (
                    <div style={{ marginBottom: 20, animation: "fadeIn 0.25s ease" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 10 }}>Multiple applications found — select the one you are paying for:</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {payApplications.map(app => (
                          <button key={app.ref} onClick={() => selectPayApplication(app)}
                            style={{ padding: "14px 18px", borderRadius: 10, border: "2px solid rgba(1,30,64,0.1)", background: "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = S.gold; e.currentTarget.style.background = "rgba(196,145,18,0.03)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(1,30,64,0.1)"; e.currentTarget.style.background = "#fff"; }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{app.programme || "Programme"}</div>
                              <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 2 }}>{app.level} · Ref: {app.ref}</div>
                              {app.studentId && <div style={{ fontSize: 10, color: "#2E7D32", fontFamily: S.body, marginTop: 2 }}>Student ID: {app.studentId}</div>}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: ({"Accepted":"#2E7D32","Under Review":"#F59E0B","Enrolled":"#0D47A1"}[app.status] || S.gold), padding: "3px 10px", borderRadius: 20, fontFamily: S.body, whiteSpace: "nowrap" }}>{app.status || "Pending"}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {payLocked && payAppRef && !payIdLoading && (
                    <div style={{ background: "rgba(46,125,50,0.03)", border: "1.5px solid rgba(46,125,50,0.15)", borderRadius: 12, padding: "18px 20px", marginBottom: 20, animation: "fadeIn 0.25s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 16 }}>✅</span>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", fontFamily: S.body }}>Application found — please confirm your details</div>
                      </div>
                      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(1,30,64,0.06)", overflow: "hidden" }}>
                        {[
                          ["Application Reference", payAppRef],
                          ...(payStudentId ? [["Student ID", payStudentId]] : []),
                          ["Full Name", payName],
                          ["Level", payLevel],
                          ["Programme", upSelectedProg?.name || "—"],
                          ["Payment Plan", upIsGoldOnly ? "Gold — Full Payment" : payPlan + (upCalcAmount ? " — " + upCalcAmount.label : "")],
                          ["Amount Due", upCalcAmount ? fmt(upCalcAmount.amount) + " JMD" : "—"],
                        ].map(([label, val], i, arr) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(1,30,64,0.04)" : "none", fontSize: 13, fontFamily: S.body }}>
                            <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                            <span style={{ color: label === "Amount Due" ? "#2E7D32" : label === "Student ID" ? "#2E7D32" : S.navy, fontWeight: label === "Amount Due" ? 800 : 700, textAlign: "right", maxWidth: "60%" }}>{val || "—"}</span>
                          </div>
                        ))}
                      </div>
                      {payApplications.length > 1 && (
                        <button onClick={() => { setPayLocked(false); setPayAppRef(""); setPayStudentId(""); setPayDeclare(false); setPayDeclareTimestamp(null); }} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 6, background: "transparent", border: "1.5px solid rgba(1,30,64,0.15)", color: S.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body, marginRight: 8 }}>
                          ← Select different application
                        </button>
                      )}
                      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, background: "rgba(196,145,18,0.04)", border: "1px solid rgba(196,145,18,0.12)", fontSize: 11, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
                        Details incorrect? Contact the Finance Department at <a href="mailto:finance@ctsetsjm.com" style={{ color: S.gold, fontWeight: 700 }}>finance@ctsetsjm.com</a> or call <strong>876-525-6802</strong>.
                      </div>
                    </div>
                  )}

                  {!payLocked && !payIdLoading && payEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payEmail) && payApplications.length === 0 && (
                    <div style={{ padding: "14px 18px", borderRadius: 8, background: "#fff3f3", border: "1px solid #ffcdd2", marginBottom: 14, fontSize: 12, color: "#c62828", fontFamily: S.body, lineHeight: 1.6 }}>
                      <strong>No application found</strong> for <strong>{payEmail}</strong>. Please check the email address, <button onClick={() => setActiveTab("apply")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>submit an application first</button>, or contact the Finance Department at <a href="mailto:finance@ctsetsjm.com" style={{ color: S.gold, fontWeight: 700 }}>finance@ctsetsjm.com</a>.
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 18px", borderRadius: 10, border: "2px solid " + (files.paymentProof ? "#2E7D3240" : "rgba(10,35,66,0.1)"), background: files.paymentProof ? "rgba(46,125,50,0.03)" : "#fff", marginBottom: 20 }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{files.paymentProof ? "✅" : "💳"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Proof of Payment {reqDot}</div>
                      <div style={{ fontSize: 12, color: files.paymentProof ? "#2E7D32" : S.gray, fontFamily: S.body }}>{files.paymentProof ? files.paymentProof.name : "Bank receipt, transfer confirmation, or deposit slip (PDF, JPG, PNG)"}</div>
                    </div>
                    <label style={{ padding: "10px 18px", borderRadius: 6, background: files.paymentProof ? "rgba(46,125,50,0.08)" : "#fff", border: "1px solid rgba(10,35,66,0.08)", fontSize: 13, fontWeight: 700, color: S.navy, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap" }}>
                      {files.paymentProof ? "Change" : "Choose File"}
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFile("paymentProof", e.target.files[0])} style={{ display: "none" }} />
                    </label>
                  </div>

                  <div style={{ padding: "14px 18px", borderRadius: 8, background: "rgba(10,35,66,0.03)", border: "1px solid rgba(10,35,66,0.06)", marginBottom: 20, fontSize: 12, color: "#2D3748", fontFamily: S.body, lineHeight: 1.65 }}>
                    Accepted: bank transfer receipts, transaction confirmations from any financial institution, Western Union receipts, cash deposit slips, or any valid proof of payment. Make payments payable to <strong>CTS Empowerment &amp; Training Solutions</strong>. Payment details will be provided in your acceptance email from the Finance Department.
                  </div>

                  {/* Upload Evidence Declaration — locked until required info complete */}
                  <div style={{ position: "relative", opacity: upReqComplete ? 1 : 0.45, transition: "opacity 0.3s", pointerEvents: upReqComplete ? "auto" : "none", marginBottom: 20 }}>
                    {!upReqComplete && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(248,249,250,0.6)", backdropFilter: "blur(2px)" }}>
                        <div style={{ padding: "8px 16px", borderRadius: 6, background: "#fff", border: "1.5px solid rgba(1,30,64,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 14 }}>🔒</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Complete all fields and upload proof above</span>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(1,30,64,0.03)", border: "1px solid rgba(1,30,64,0.08)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 10 }}>Payment Declaration</div>
                      <p style={{ fontSize: 12, color: "#4A5568", fontFamily: S.body, lineHeight: 1.75, margin: "0 0 12px 0" }}>
                        I confirm the following payment details:
                      </p>
                      {upCalcAmount && upSelectedProg && (
                        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(1,30,64,0.06)", marginBottom: 14, overflow: "hidden" }}>
                          {[["Application Reference", payAppRef], ...(payStudentId ? [["Student ID", payStudentId]] : []), ["Programme", upSelectedProg.name], ["Level", payLevel], ["Payment Plan", (upIsGoldOnly ? "Gold" : payPlan) + " — " + upCalcAmount.label], ["Amount", fmt(upCalcAmount.amount) + " JMD"]].map(([label, val], i) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: i < 4 ? "1px solid rgba(1,30,64,0.04)" : "none", fontSize: 12, fontFamily: S.body }}>
                              <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                              <span style={{ color: label === "Amount" ? "#2E7D32" : S.navy, fontWeight: label === "Amount" ? 800 : 600 }}>{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 8, background: payDeclare ? "rgba(46,125,50,0.06)" : "rgba(1,30,64,0.02)", border: payDeclare ? "1.5px solid rgba(46,125,50,0.3)" : "1.5px solid rgba(1,30,64,0.1)", transition: "all 0.2s" }}>
                        <input type="checkbox" checked={payDeclare} onChange={e => { setPayDeclare(e.target.checked); if (e.target.checked && !payDeclareTimestamp) setPayDeclareTimestamp(new Date().toISOString()); if (!e.target.checked) setPayDeclareTimestamp(null); }} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#2E7D32", cursor: "pointer", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: payDeclare ? "#2E7D32" : "#4A5568", fontFamily: S.body, lineHeight: 1.65, fontWeight: payDeclare ? 600 : 400 }}>
                          I confirm that the uploaded payment evidence is genuine, relates to a payment of <strong>{upCalcAmount ? fmt(upCalcAmount.amount) + " JMD" : "the stated amount"}</strong> for <strong>{upSelectedProg ? upSelectedProg.name : "the selected programme"}</strong> at CTS Empowerment &amp; Training Solutions. I understand that providing fraudulent payment evidence may result in the withdrawal of my application and I agree to the <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Terms &amp; Conditions</button>.
                        </span>
                      </label>
                      {payDeclare && payDeclareTimestamp && (
                        <div style={{ marginTop: 10, fontSize: 11, color: "#2E7D32", fontFamily: S.body, display: "flex", alignItems: "center", gap: 6 }}>
                          <span>✅</span> Declaration accepted on {new Date(payDeclareTimestamp).toLocaleString("en-JM", { dateStyle: "long", timeStyle: "short" })}
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={async () => {
                    if (!payEmail || !files.paymentProof) { alert("Please provide your email and upload proof of payment."); return; }
                    setPaySubmitting(true);
                    try {
                    await submitToAppsScript({
                      form_type: "Payment Evidence", email: payEmail, applicationRef: payAppRef, studentId: payStudentId || "Not provided",
                      level: payLevel, programme: upSelectedProg?.name,
                      plan: upIsGoldOnly ? "Gold" : payPlan,
                      amount: upCalcAmount?.amount, currency: "JMD",
                      declarationTimestamp: payDeclareTimestamp,
                    }, { paymentProof: files.paymentProof });
                    if (window.emailjs) {
                      window.emailjs.send("service_05xj674", "template_rvn4485", {
                        form_type: "Payment Evidence Upload",
                        from_name: payEmail,
                        email: payEmail,
                        message: "Application Ref: " + (payAppRef || "Not provided") + "\nStudent ID: " + (payStudentId || "Not yet assigned") + "\nLevel: " + payLevel + "\nProgramme: " + (upSelectedProg?.name || "N/A") + "\nPlan: " + (upIsGoldOnly ? "Gold" : payPlan) + "\nAmount: " + (upCalcAmount ? fmt(upCalcAmount.amount) : "N/A") + "\nFile: " + files.paymentProof.name + "\nDeclaration: " + (payDeclareTimestamp || "N/A"),
                      }).catch(err => console.error("EmailJS error:", err));
                    }
                    setPaySubmitted(true);
                    } catch (err) {
                      console.error("Payment submit error:", err);
                      alert("Something went wrong. Please try again.");
                    } finally {
                      setPaySubmitting(false);
                    }
                  }} disabled={!payDeclare || paySubmitting} style={{ width: "100%", padding: "16px", borderRadius: 8, background: (!payDeclare || paySubmitting) ? "#4A5568" : S.gold, color: S.navy, border: "none", fontSize: 15, fontWeight: 700, cursor: (!payDeclare || paySubmitting) ? "not-allowed" : "pointer", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", opacity: (!payDeclare || paySubmitting) ? 0.5 : 1, transition: "all 0.2s", boxShadow: payDeclare && !paySubmitting ? "0 4px 16px rgba(196,145,18,0.25)" : "none" }}>
                    {paySubmitting ? "⏳ Submitting..." : !payDeclare ? "🔒 Accept Declaration to Submit" : "Submit Payment Evidence"}
                  </button>
                  {!payDeclare && upReqComplete && <p style={{ textAlign: "center", fontSize: 11, color: "#C62828", fontFamily: S.body, marginTop: 8 }}>You must accept the declaration above before submitting.</p>}
                </div>
              </div>
                );
              })()}
            </div>
          )
        )}


      </Container>
    </PageWrapper>
  );
}

// ─── CONTACT PAGE ────────────────────────────────────────────────────
function ContactPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [cForm, setCForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [cSent, setCSent] = useState(false);
  const [cSending, setCSending] = useState(false);
  const cu = (k, v) => setCForm(f => ({ ...f, [k]: v }));

  const sendEnquiry = async () => {
    if (!cForm.name.trim() || !cForm.email.trim() || !cForm.message.trim()) { alert("Please fill in your name, email, and message."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cForm.email)) { alert("Please enter a valid email address."); return; }
    setCSending(true);
    try {
      await submitToAppsScript({
        form_type: "Contact Enquiry",
        contactName: cForm.name,
        email: cForm.email,
        phone: cForm.phone || "Not provided",
        subject: cForm.subject || "General Enquiry",
        message: cForm.message,
      }, {});
      if (window.emailjs) {
        window.emailjs.send("service_05xj674", "template_rvn4485", {
          form_type: "Contact Enquiry",
          from_name: cForm.name,
          email: cForm.email,
          phone: cForm.phone || "N/A",
          message: "Subject: " + (cForm.subject || "General Enquiry") + "\n\n" + cForm.message,
        }).catch(err => console.error("EmailJS error:", err));
      }
      setCSent(true);
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Something went wrong. Please try again or email us directly at finance@ctsetsjm.com.");
    } finally {
      setCSending(false);
    }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.15)", background: "#fff", fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: 11, color: "#4A5568", fontWeight: 700, fontFamily: S.body, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 };
  const reqDot = <span style={{ color: "#C62828", marginLeft: 2 }}>*</span>;

  return (
    <PageWrapper>
      <SectionHeader tag="Get In Touch" title="Contact Us" desc="Whether you're an individual or an employer, we're here to help you get started." />
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, marginBottom: 40 }} className="resp-grid-2">
          {[["📧","General Enquiries","info@ctsetsjm.com","mailto:info@ctsetsjm.com"], ["💰","Finance Department","finance@ctsetsjm.com","mailto:finance@ctsetsjm.com"], ["📞","Call / WhatsApp","876-525-6802","tel:8765256802"], ["📞","Also Reach Us","876-381-9771","tel:8763819771"], ["📍","Visit Us (By Appointment)","6 Newark Avenue, Kingston 11, Jamaica W.I.","https://maps.google.com/?q=6+Newark+Avenue+Kingston+11+Jamaica"]].map(([icon, label, value, href]) => (
            <a key={label} href={href} style={{ textDecoration: "none" }} target={label === "Visit Us" ? "_blank" : undefined} rel={label === "Visit Us" ? "noopener noreferrer" : undefined}>
              <div style={{ background: S.lightBg, borderRadius: 10, padding: "28px 20px", textAlign: "center", border: "1px solid rgba(10,35,66,0.06)" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 10, color: S.gray, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 15, color: S.navy, fontWeight: 700, fontFamily: S.body }}>{value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* ─── BOOK AN APPOINTMENT ─── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Schedule a Call</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Book an Appointment</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, marginTop: 10, lineHeight: 1.6, maxWidth: 540, margin: "10px auto 0" }}>Choose a time that works for you. All consultations are free and conducted via phone or WhatsApp.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }} className="resp-grid-2">
            {[
              { icon: "🎓", title: "General Enquiry", desc: "Questions about programmes, entry requirements, or getting started.", duration: "15 min", who: "Prospective students", url: BOOKING_URLS.general },
              { icon: "💳", title: "Payment & Enrolment", desc: "Guidance on payment plans, the Payment Centre, or enrolment steps.", duration: "20 min", who: "Accepted students", url: BOOKING_URLS.payment },
              { icon: "📚", title: "Academic Support", desc: "Help with coursework, assessments, Canvas, or programme content.", duration: "30 min", who: "Enrolled students", url: BOOKING_URLS.academic },
              { icon: "👥", title: "Employer Consultation", desc: "Discuss group enrolment, 15% discount, and training plans for your team.", duration: "30 min", who: "Employers & HR", url: BOOKING_URLS.employer },
            ].map(apt => (
              <a key={apt.title} href={apt.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "28px 22px", border: "1px solid rgba(1,30,64,0.06)", boxShadow: "0 2px 12px rgba(1,30,64,0.04)", transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = S.gold; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(196,145,18,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(1,30,64,0.06)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(1,30,64,0.04)"; }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{apt.icon}</div>
                  <div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy, marginBottom: 6 }}>{apt.title}</div>
                  <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, marginBottom: 14 }}>{apt.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: S.body, fontSize: 11, color: S.gold, fontWeight: 700, background: "rgba(196,145,18,0.08)", padding: "4px 10px", borderRadius: 6 }}>{apt.duration}</span>
                      <span style={{ fontFamily: S.body, fontSize: 11, color: S.gray, marginLeft: 8 }}>{apt.who}</span>
                    </div>
                    <span style={{ fontFamily: S.body, fontSize: 13, color: S.gold, fontWeight: 700 }}>Book →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ─── CONTACT FORM ─── */}
        <div style={{ maxWidth: 640, margin: "0 auto 56px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Send Us a Message</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Have a Question or Enquiry?</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, marginTop: 10, lineHeight: 1.6 }}>Fill out the form below and our team will respond within 24–48 hours.</p>
          </div>

          {cSent ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "48px 32px", boxShadow: "0 4px 24px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 10 }}>Message Sent!</h3>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "#4A5568", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 20px" }}>
                Thank you, <strong>{cForm.name}</strong>. We've received your enquiry and will get back to you at <strong>{cForm.email}</strong> within 24–48 hours.
              </p>
              <Btn primary onClick={() => { setCSent(false); setCForm({ name: "", email: "", phone: "", subject: "", message: "" }); }} style={{ color: S.navy }}>Send Another Message</Btn>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,40px)", boxShadow: "0 4px 24px rgba(1,30,64,0.06)", border: "1px solid rgba(1,30,64,0.05)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                <div><label style={labelStyle}>Full Name {reqDot}</label><input style={inputStyle} value={cForm.name} onChange={e => cu("name", e.target.value)} placeholder="Your full name" /></div>
                <div><label style={labelStyle}>Email Address {reqDot}</label><input type="email" style={inputStyle} value={cForm.email} onChange={e => cu("email", e.target.value)} placeholder="your@email.com" /></div>
                <div><label style={labelStyle}>Phone Number</label><input style={inputStyle} value={cForm.phone} onChange={e => cu("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="8765256802 (optional)" maxLength={10} /></div>
                <div><label style={labelStyle}>Subject</label><select style={inputStyle} value={cForm.subject} onChange={e => cu("subject", e.target.value)}>
                  <option value="">Select a topic</option>
                  <option>General Enquiry</option>
                  <option>Programme Information</option>
                  <option>Fees & Payment Plans</option>
                  <option>Application Help</option>
                  <option>Employer / Group Enrolment</option>
                  <option>Certification & Assessment</option>
                  <option>Technical Issue</option>
                  <option>Feedback / Suggestion</option>
                  <option>Other</option>
                </select></div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Your Message {reqDot}</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} value={cForm.message} onChange={e => cu("message", e.target.value)} placeholder="Tell us how we can help you..." />
              </div>
              <button onClick={sendEnquiry} disabled={cSending} style={{ width: "100%", padding: "16px", borderRadius: 10, background: cSending ? "#4A5568" : S.navy, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: cSending ? "wait" : "pointer", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", opacity: cSending ? 0.7 : 1, transition: "all 0.2s" }}>
                {cSending ? "⏳ Sending..." : "Send Message →"}
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 10, lineHeight: 1.5 }}>Or email us directly at <strong>info@ctsetsjm.com</strong></p>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Btn primary onClick={() => setPage("Apply")} style={{ color: S.navy }}>Start Your Application</Btn>
        </div>

        {/* FAQ */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 11, color: S.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600 }}>Common Questions</span>
          <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,32px)", color: S.navy, margin: "8px 0 0", fontWeight: 700 }}>Frequently Asked Questions</h3>
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderRadius: 10, border: "1px solid rgba(10,35,66,0.06)", marginBottom: 10, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} style={{ width: "100%", padding: "18px 24px", background: openFaq === i ? S.navy : "#fff", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: openFaq === i ? "#fff" : S.navy, fontFamily: S.body, textAlign: "left" }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: openFaq === i ? S.gold : S.gray, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "18px 24px", background: S.lightBg, fontSize: 14, color: "#2D3748", fontFamily: S.body, lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── PRIVACY POLICY PAGE ─────────────────────────────────────────────
function PrivacyPage() {
  const sectionStyle = { marginBottom: 28 };
  const hStyle = { fontFamily: S.heading, fontSize: 18, color: S.navy, marginBottom: 10, fontWeight: 700 };
  const pStyle = { fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.8, marginBottom: 10 };
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Legal" title="Privacy Policy" desc="How CTS Empowerment & Training Solutions collects, uses, and protects your personal information." />
      <Container>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "clamp(28px,4vw,48px)", border: "1px solid rgba(10,35,66,0.06)" }}>
          <p style={{ ...pStyle, fontStyle: "italic", color: S.gray }}>Effective Date: 1 April 2026 &nbsp;|&nbsp; Last Updated: March 2026</p>

          <div style={sectionStyle}>
            <h3 style={hStyle}>1. Information We Collect</h3>
            <p style={pStyle}>When you apply to CTS ETS or use our website, we may collect the following personal information:</p>
            <p style={pStyle}>Personal identifiers such as your full name, date of birth, gender, nationality, Tax Registration Number (TRN), email address, phone number, residential address, and parish of residence. We also collect emergency contact details, educational background, employment information, and documents you upload including your HEART/NSTA application form, TRN card, passport-size photograph, academic qualifications, birth certificate, and national identification.</p>
            <p style={pStyle}>If you make a payment, we collect payment reference numbers and proof of payment uploads. We do not collect or store credit card numbers, bank account numbers, or other direct financial account information.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>2. How We Use Your Information</h3>
            <p style={pStyle}>We use your personal information to process your application for admission, verify your identity and eligibility for programmes, communicate with you regarding your enrolment and programme progress, generate your Student ID and institutional records, comply with requirements of the Ministry of Education, Youth and Information, NCTVET, City &amp; Guilds, and the HEART/NSTA Trust, and to improve our services and your learning experience.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>3. How We Store and Protect Your Data</h3>
            <p style={pStyle}>Your personal data is stored securely using Google Workspace (Google Drive and Google Sheets) with access restricted to authorised CTS ETS administrative staff only. Uploaded documents are stored in private Google Drive folders organised by student. We use industry-standard security measures including encrypted connections (HTTPS) for all data transmission. Application data is also stored locally in your browser for your convenience in tracking your application status.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>4. Who We Share Your Information With</h3>
            <p style={pStyle}>We may share your information with the HEART/NSTA Trust as required for programme registration and external assessment, NCTVET for certification and assessment purposes, City &amp; Guilds for international qualification alignment, and the Ministry of Education, Youth and Information as required for institutional compliance and inspections. We do not sell, rent, or lease your personal information to any third party for marketing purposes.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>5. Your Rights</h3>
            <p style={pStyle}>You have the right to request access to the personal data we hold about you, request correction of inaccurate or incomplete data, request deletion of your data (subject to our legal and regulatory retention obligations), and withdraw consent for non-essential processing at any time. To exercise any of these rights, contact us at info@ctsetsjm.com.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>6. Cookies and Local Storage</h3>
            <p style={pStyle}>Our website uses browser local storage to save your cookie consent preference and to temporarily store application data for your convenience. We do not use tracking cookies or third-party advertising cookies. The DiceBear avatar service is used to generate illustrative profile images and does not collect personal data.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>7. Data Retention</h3>
            <p style={pStyle}>We retain student records for a minimum of seven (7) years after the completion or withdrawal from a programme, in accordance with Jamaican regulatory requirements for educational institutions. Records required for Ministry inspections are retained indefinitely as part of the official Admission Register.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>8. Contact</h3>
            <p style={pStyle}>If you have questions about this Privacy Policy or your personal data, contact us at:</p>
            <p style={pStyle}>CTS Empowerment &amp; Training Solutions, 6 Newark Avenue, Kingston 11, Jamaica W.I. Email: info@ctsetsjm.com. Phone: 876-525-6802.</p>
          </div>

          <div style={{ padding: "14px 18px", borderRadius: 8, background: "rgba(10,35,66,0.03)", border: "1px solid rgba(10,35,66,0.06)", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
            Registered with the Companies of Jamaica — Reg. No. 16007/2025. MOE Independent Schools registration in progress.
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── TERMS & CONDITIONS PAGE ─────────────────────────────────────────
function TermsPage() {
  const sectionStyle = { marginBottom: 28 };
  const hStyle = { fontFamily: S.heading, fontSize: 18, color: S.navy, marginBottom: 10, fontWeight: 700 };
  const pStyle = { fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.8, marginBottom: 10 };
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Legal" title="Terms & Conditions" desc="The terms governing your use of this website and your enrolment with CTS Empowerment & Training Solutions." />
      <Container>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "clamp(28px,4vw,48px)", border: "1px solid rgba(10,35,66,0.06)" }}>
          <p style={{ ...pStyle, fontStyle: "italic", color: S.gray }}>Effective Date: 1 April 2026 &nbsp;|&nbsp; Last Updated: March 2026</p>

          <div style={sectionStyle}>
            <h3 style={hStyle}>1. About CTS ETS</h3>
            <p style={pStyle}>CTS Empowerment and Training Solutions ("CTS ETS", "we", "our", "us") is a post-secondary vocational training institution registered with the Companies of Jamaica (Reg. No. 16007/2025), located at 6 Newark Avenue, Kingston 11, Jamaica W.I. Our programmes are aligned to the National Council on Technical and Vocational Education and Training (NCTVET) and City &amp; Guilds standards.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>2. Eligibility and Admission</h3>
            <p style={pStyle}>By submitting an application, you confirm that all information provided is truthful and accurate. CTS ETS reserves the right to reject or cancel any application or enrolment if information provided is found to be false or misleading. Entry requirements vary by qualification level and are published on our website. Meeting the minimum entry requirements does not guarantee admission. Final admission decisions are at the discretion of CTS ETS.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>3. Fees and Payment</h3>
            <p style={pStyle}>All fees are quoted in Jamaican Dollars (JMD) and are subject to change with reasonable notice. Confirmed enrolments are honoured at the rate agreed at the time of registration. The registration fee of $5,000 JMD is non-refundable. Payment plans (Gold, Silver, Bronze) are subject to the terms described on our Fees &amp; Calculator page. Silver and Bronze plans include a processing fee of 5% and 8% respectively. Job Certificate and Level 2 programmes require full payment (Gold plan only). NCTVET external assessment and certification fees are separate from tuition and are paid directly to NCTVET. For all fee and payment enquiries, contact the Finance Department at finance@ctsetsjm.com.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>4. Payment Deadlines</h3>
            <p style={pStyle}>Upon acceptance, payment instructions are sent to your registered email address. Payment evidence must be uploaded within 48 hours of receiving your payment information. Failure to submit payment within the specified period may result in your place being released to another applicant. CTS ETS is not liable for any consequences arising from late payment.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>5. Programme Delivery</h3>
            <p style={pStyle}>Programmes are delivered primarily online through self-paced study. Some practical assessments may require in-person attendance. CTS ETS reserves the right to modify programme content, delivery schedules, and assessment methods as necessary to maintain quality and alignment with NCTVET and City &amp; Guilds standards. Programme duration is approximate and may vary depending on the pace of study and assessment scheduling.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>6. Certification</h3>
            <p style={pStyle}>Each programme is aligned to either NCTVET (NVQ-J) or City &amp; Guilds — not both simultaneously. The specific awarding body is confirmed at enrolment. Upon successful completion of your programme and all required assessments, you will receive a CTS ETS Institutional Certificate of Completion and the relevant programme-aligned qualification. CTS ETS does not guarantee the outcome of external assessments conducted by NCTVET or City &amp; Guilds.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>7. Student Conduct</h3>
            <p style={pStyle}>Students are expected to conduct themselves professionally at all times. CTS ETS reserves the right to suspend or expel any student for academic dishonesty, plagiarism, harassment, or conduct that is disruptive to the learning environment. Expelled students are not entitled to a refund of fees paid.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>8. Refund Policy</h3>
            <p style={pStyle}>The registration fee is non-refundable. Tuition refunds are considered on a case-by-case basis. If a student withdraws within the first 14 days of programme commencement and has not accessed more than 20% of course materials, a partial refund (less the registration fee and any processing fees) may be issued. No refunds are provided after 14 days or if more than 20% of course materials have been accessed. Refund requests must be submitted in writing to finance@ctsetsjm.com.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>9. Employer Group Enrolments</h3>
            <p style={pStyle}>A 15% group discount applies to employers enrolling 8 or more learners in a single programme intake. The discount applies to tuition only and is calculated before any processing fees. The employer is responsible for payment on behalf of all enrolled learners unless otherwise agreed in writing.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>10. Intellectual Property</h3>
            <p style={pStyle}>All course materials, learner guides, assessments, and content provided by CTS ETS are the intellectual property of CTS ETS or its licensors. Students may not reproduce, distribute, or share course materials without written permission.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>11. Limitation of Liability</h3>
            <p style={pStyle}>CTS ETS makes every effort to provide accurate information on this website. However, we do not warrant that the website will be error-free or uninterrupted. CTS ETS is not liable for any indirect, incidental, or consequential damages arising from the use of this website or participation in our programmes.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>12. Governing Law</h3>
            <p style={pStyle}>These terms and conditions are governed by and construed in accordance with the laws of Jamaica. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Jamaica.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>13. Changes to These Terms</h3>
            <p style={pStyle}>CTS ETS reserves the right to update these Terms &amp; Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our website or services after changes are posted constitutes acceptance of the revised terms.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>14. Contact</h3>
            <p style={pStyle}>For questions about these terms, contact us at: CTS Empowerment &amp; Training Solutions, 6 Newark Avenue, Kingston 11, Jamaica W.I. Email: info@ctsetsjm.com. Phone: 876-525-6802.</p>
          </div>

          <div style={{ padding: "14px 18px", borderRadius: 8, background: "rgba(10,35,66,0.03)", border: "1px solid rgba(10,35,66,0.06)", fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
            Registered with the Companies of Jamaica — Reg. No. 16007/2025. MOE Independent Schools registration in progress.
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: S.navy, padding: "40px 20px 28px", borderTop: "3px solid " + S.gold }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 32 }} className="resp-grid-3">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 16 }} onClick={() => setPage("Home")}>
              <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 44, height: 48, objectFit: "contain", borderRadius: 4 }} />
              <div>
                <div style={{ fontFamily: S.heading, fontSize: 14, fontWeight: 700, color: "#fff" }}>CTS Empowerment &amp; Training Solutions</div>
                <div style={{ fontSize: 10, color: S.gold, fontFamily: S.body, marginTop: 2, letterSpacing: 1 }}>Called To Serve — Committed to Excellence</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body, lineHeight: 1.6, marginBottom: 10 }}>A registered post-secondary vocational training institution in Jamaica. 25 programmes aligned to NCTVET &amp; City &amp; Guilds.</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: S.body, lineHeight: 1.6, marginBottom: 4 }}>📍 6 Newark Avenue, Kingston 11, Jamaica W.I.</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: S.body, lineHeight: 1.5 }}>Reg. No. 16007/2025 — Companies of Jamaica</p>
          </div>
          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 16 }}>Quick Links</div>
            {["About","Programmes","Fees & Calculator","Certification","Apply","Contact"].map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: S.body, cursor: "pointer", padding: "4px 0", textAlign: "left" }}>{p}</button>
            ))}
            <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", color: "#81C784", fontSize: 13, fontFamily: S.body, padding: "4px 0", textDecoration: "none", fontWeight: 600 }}>📚 Learning Portal</a>
          </div>
          {/* Partners */}
          <div>
            <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 16 }}>Our Partners</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={NCTVET_LOGO} alt="NCTVET" style={{ height: 32, objectFit: "contain", background: "#fff", borderRadius: 4, padding: "2px 4px" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>NCTVET — National Standards</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={CG_LOGO} alt="City and Guilds" style={{ height: 32, objectFit: "contain", background: "#fff", borderRadius: 4, padding: "2px 4px" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>City &amp; Guilds — International</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={HEART_LOGO} alt="HEART NSTA" style={{ height: 32, objectFit: "contain", background: "#fff", borderRadius: 4, padding: "2px 4px" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>HEART/NSTA Trust</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: S.body }}>© 2026 CTS Empowerment &amp; Training Solutions. All Rights Reserved. &nbsp;|&nbsp; ctsetsjm.com &nbsp;|&nbsp; info@ctsetsjm.com</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("Privacy")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: S.body, cursor: "pointer", padding: 0 }}>Privacy Policy</button>
            <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: S.body, cursor: "pointer", padding: 0 }}>Terms &amp; Conditions</button>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: S.body }}>Reg. 16007/2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── COOKIE BANNER ───────────────────────────────────────────────────
function CookieBanner({ setPage }) {
  const [visible, setVisible] = useState(() => !localStorage.getItem("cts_cookie_consent"));
  const dismiss = (choice) => { localStorage.setItem("cts_cookie_consent", choice); setVisible(false); };
  if (!visible) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: S.navy, borderTop: "2px solid " + S.gold, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", zIndex: 9998 }}>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: S.body, margin: 0, flex: 1 }}>We use cookies and local storage to improve your experience. <button onClick={() => { dismiss("accepted"); setPage("Privacy"); }} style={{ background: "none", border: "none", color: S.gold, fontSize: 12, fontFamily: S.body, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Privacy Policy</button></p>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={() => dismiss("accepted")} style={{ padding: "8px 20px", borderRadius: 6, background: S.gold, color: S.navy, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Accept</button>
        <button onClick={() => dismiss("declined")} style={{ padding: "8px 16px", borderRadius: 6, background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer", fontFamily: S.body }}>Decline</button>
      </div>
    </div>
  );
}

// ─── WHATSAPP BUTTON ─────────────────────────────────────────────────
function WhatsAppBtn() {
  const [open, setOpen] = useState(false);
  const WA_ICON = (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
  return (
    <div style={{ position: "fixed", bottom: 80, right: 24, zIndex: 9997, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      {open && (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "14px 0", minWidth: 230, marginBottom: 4 }}>
          <div style={{ padding: "6px 18px 10px", fontSize: 11, fontWeight: 700, color: "#666", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #f0f0f0" }}>Chat with us on WhatsApp</div>
          {[
            { label: "876-525-6802", tag: "Flow", num: "8765256802", color: "#1565C0" },
            { label: "876-381-9771", tag: "Digicel", num: "8763819771", color: "#E53935" },
          ].map(n => (
            <a key={n.num} href={"https://wa.me/" + n.num + "?text=Hello%20CTS%20ETS%2C%20I%20am%20interested%20in%20your%20programmes."} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", fontFamily: "sans-serif" }}>{n.label}</div>
                <span style={{ fontSize: 11, color: "#fff", background: n.color, borderRadius: 4, padding: "1px 6px", fontFamily: "sans-serif", fontWeight: 600 }}>{n.tag}</span>
              </div>
            </a>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        style={{ width: 56, height: 56, borderRadius: "50%", background: "#25D366", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", cursor: "pointer", transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        {open ? <span style={{ color: "#fff", fontSize: 22, lineHeight: 1 }}>✕</span> : WA_ICON}
      </button>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function CTSApp() {
  const [page, setPage] = useState(() => {
    // Hash routing: read initial page from URL hash
    const hash = window.location.hash.replace("#", "").replace(/-/g, " ");
    const match = PAGES.find(p => p.toLowerCase() === hash.toLowerCase());
    return match || "Home";
  });
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const navigate = useCallback((p) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      // Update URL hash
      const hash = p === "Home" ? "" : "#" + p.toLowerCase().replace(/ /g, "-");
      window.history.pushState(null, "", hash || window.location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => setTransitioning(false), 50);
    }, 150);
  }, []);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Browser back button handling
  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.replace("#", "").replace(/-/g, " ");
      const match = PAGES.find(p => p.toLowerCase() === hash.toLowerCase());
      setPage(match || "Home");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Page titles
  useEffect(() => {
    const titles = { Home: "CTS ETS — Build Real Skills. Earn Recognised Qualifications.", About: "About Us — CTS ETS", "Why Choose": "Why Choose CTS ETS", Programmes: "Programmes — CTS ETS", Certification: "Certification — CTS ETS", "Fees & Calculator": "Fees & Payment Calculator — CTS ETS", "For Employers": "For Employers — CTS ETS", Apply: "Apply Now — CTS ETS", Contact: "Contact Us — CTS ETS", Privacy: "Privacy Policy — CTS ETS", Terms: "Terms & Conditions — CTS ETS" };
    document.title = titles[page] || "CTS Empowerment & Training Solutions";
  }, [page]);

  // Google Analytics 4
  useEffect(() => {
    const GA_ID = "G-CNTDTP49S4"; // CTS ETS Google Analytics 4
    if (document.getElementById("ga4-script")) return;
    const s = document.createElement("script");
    s.id = "ga4-script";
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
  }, []);

  // Track page views (GA4 + local)
  useEffect(() => {
    if (window.gtag) window.gtag("event", "page_view", { page_title: page, page_location: window.location.href, page_path: "/" + page.toLowerCase().replace(/ /g, "-") });
  }, [page]);

  // Simple local analytics
  useEffect(() => {
    try {
      const views = JSON.parse(localStorage.getItem("cts_page_views") || "{}");
      views[page] = (views[page] || 0) + 1;
      views._total = (views._total || 0) + 1;
      views._last = new Date().toISOString();
      localStorage.setItem("cts_page_views", JSON.stringify(views));
    } catch(_){}
  }, [page]);

  // Load EmailJS SDK
  useEffect(() => {
    if (!document.getElementById("emailjs-sdk")) {
      const s = document.createElement("script"); s.id = "emailjs-sdk";
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      s.onload = () => {
        if (window.emailjs) {
          try { window.emailjs.init({ publicKey: "FwxOgZox_rfUze7Dd" }); } catch(_) { window.emailjs.init("FwxOgZox_rfUze7Dd"); }
        }
      };
      document.head.appendChild(s);
    }
  }, []);

  const renderPage = () => {
    switch (page) {
      case "Home": return <HomePage setPage={navigate} />;
      case "About": return <AboutPage />;
      case "Why Choose": return <WhyChoosePage setPage={navigate} />;
      case "Programmes": return <ProgrammesPage setPage={navigate} />;
      case "Certification": return <CertificationPage />;
      case "Fees & Calculator": return <FeesPage setPage={navigate} />;
      case "For Employers": return <EmployersPage setPage={navigate} />;
      case "Apply": return <ApplyPage setPage={navigate} />;
      case "Contact": return <ContactPage setPage={navigate} />;
      case "Privacy": return <PrivacyPage />;
      case "Terms": return <TermsPage />;
      default: return <NotFoundPage setPage={navigate} />;
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <div style={{ fontFamily: S.body, WebkitFontSmoothing: "antialiased" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          input:focus, select:focus, textarea:focus { border-color: #C49112 !important; outline: none; box-shadow: 0 0 0 3px rgba(196,145,18,0.15); }
          a:focus-visible, button:focus-visible { outline: 2px solid #C49112; outline-offset: 2px; }
          @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
          @keyframes loadBar { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(300%); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 1100px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
          }
          @media (min-width: 1101px) {
            .mobile-menu-btn { display: none !important; }
          }
          @media (max-width: 768px) {
            .resp-grid-2 { grid-template-columns: 1fr !important; }
            .resp-grid-3 { grid-template-columns: 1fr !important; }
            .resp-grid-calc { grid-template-columns: 1fr !important; }
            .compare-row { font-size: 11px !important; }
            .compare-row > div { padding: 8px 10px !important; }
            .prog-row { grid-template-columns: 1fr 70px 70px 70px !important; padding: 10px 14px !important; }
            .group-row { grid-template-columns: 1fr 80px 80px 80px !important; padding: 10px 14px !important; }
            .cert-note { flex-direction: column !important; }
            .nav-brand-text { display: none !important; }
            .req-line { left: 20px !important; }
            .req-row { gap: 12px !important; }
            .req-row > div:first-child { width: 42px !important; }
            .req-row > div:first-child > div { width: 32px !important; height: 32px !important; font-size: 16px !important; }
          }
          @media print {
            nav, footer, .mobile-menu-btn, button { display: none !important; }
            body { font-size: 12px !important; }
            * { box-shadow: none !important; }
          }
        `}</style>
        <OfflineBanner />
        <AnnouncementBar />
        <Navbar page={page} setPage={navigate} />
        <div style={{ opacity: transitioning ? 0.6 : 1, transition: "opacity 0.15s ease", animation: "fadeIn 0.25s ease" }}>
          {renderPage()}
        </div>
        <Footer setPage={navigate} />
        <ScrollToTop />
        <WhatsAppBtn />
        <CookieBanner setPage={navigate} />
      </div>
    </ErrorBoundary>
  );
}

