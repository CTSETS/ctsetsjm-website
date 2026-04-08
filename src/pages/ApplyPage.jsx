import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { PROGRAMMES } from "../constants/programmes";
import { TESTIMONIALS, PRAYERS, genderPronouns } from "../constants/content";
import { BOOKING_URLS, REG_FEE } from "../constants/config";
import {
  PageWrapper,
  Btn,
  SectionBlock,
  Reveal,
  PageScripture,
  SocialProofBar,
  TestimonialCard,
} from "../components/shared/CoreComponents";
import { CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
import { validateEmail, validatePhone, validateTRN, validateFileSize } from "../utils/validation";
import { submitToAppsScript, generateRef } from "../utils/submission";
import { fmt, fmtDate } from "../utils/formatting";
import { registerDripSequence } from "../utils/email";
import HeartFormBuilder from "../components/apply/HeartFormBuilder";

const VERCEL_URL = "https://ctsetsjm-website.vercel.app/api/proxy";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  advisor: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  tracker: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
};

const APPLICANT_TYPES = [
  { key: "jamaican", label: "🇯🇲 Jamaican", desc: "Residing in Jamaica" },
  { key: "caribbean", label: "🌴 Caribbean", desc: "CARICOM region" },
  { key: "international", label: "🌍 International", desc: "Worldwide" },
];
const GENDERS = ["Male", "Female"];
const JA_PARISHES = ["Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary", "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland", "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"];
const DOC_REQUIREMENTS = {
  jamaican: [
    { slot: "passportPhoto", label: "Passport-Size Photo (used on Student ID)", required: true, accept: "image/*" },
    { slot: "birthCert", label: "Birth Certificate", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity (National ID / Passport / Driver's Licence)", required: true, accept: "image/*,.pdf" },
    { slot: "trn", label: "TRN Card", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Qualifications (CXC, Diplomas, etc.)", required: false, accept: "image/*,.pdf" },
    { slot: "heartForm", label: "Signed HEART/NSTA Application Form", required: true, accept: "image/*,.pdf,.html" },
  ],
  caribbean: [
    { slot: "passportPhoto", label: "Passport-Size Photo (used on Student ID)", required: true, accept: "image/*" },
    { slot: "birthCertOrPassport", label: "Birth Certificate or Passport", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Academic Qualifications", required: false, accept: "image/*,.pdf" },
  ],
  international: [
    { slot: "passportPhoto", label: "Passport-Size Photo (used on Student ID)", required: true, accept: "image/*" },
    { slot: "passportBio", label: "Passport Bio Page", required: true, accept: "image/*,.pdf" },
    { slot: "transcripts", label: "Secondary School Transcripts", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity", required: true, accept: "image/*,.pdf" },
  ],
};

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(18px, 3vw, 40px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionIntro({ tag, title, desc, accent = S.teal }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 0.82fr) minmax(320px, 1.18fr)",
        gap: 30,
        alignItems: "end",
        marginBottom: 28,
      }}
      className="resp-grid-2"
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: `${accent}12`,
            color: accent,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: S.body,
            marginBottom: 14,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(30px, 4vw, 48px)",
            lineHeight: 1.06,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 760,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 16,
          lineHeight: 1.85,
          color: S.gray,
          margin: 0,
          maxWidth: 860,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function SideInfoCard({ title, desc, img, accent = S.teal }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 24, padding: 20, boxShadow: "0 14px 32px rgba(15,23,42,0.04)" }}>
      {img && (
        <div style={{ width: "100%", height: 220, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>
          <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ fontSize: 11, color: accent, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>Admissions Guidance</div>
      <div style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 10, lineHeight: 1.1 }}>{title}</div>
      <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>{desc}</p>
    </div>
  );
}

function ChecklistCard({ title, items, accent = S.teal }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 22, padding: 22, boxShadow: "0 12px 30px rgba(15,23,42,0.04)" }}>
      <div style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, fontWeight: 800, marginBottom: 14 }}>{title}</div>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item) => (
          <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <span style={{ color: accent, fontWeight: 900, fontSize: 10 }}>✓</span>
            </div>
            <span style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, required, children, error, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: S.navy, fontFamily: S.body, marginBottom: 7, textTransform: "uppercase", letterSpacing: 1.2 }}>{label} {required && <span style={{ color: S.coral }}>*</span>}</label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 5 }}>{hint}</div>}
      {error && <div style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: 5 }}>⚠️ {error}</div>}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${S.border}`, fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", background: "#fff", boxSizing: "border-box" };
const selectStyle = { ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 };

function FileUpload({ doc, file, onFileChange }) {
  const id = "file-" + doc.slot;
  const hasFile = !!file;
  const oversize = file && !validateFileSize(file);
  return (
    <div style={{ padding: "14px 16px", borderRadius: 14, border: "1.5px dashed " + (oversize ? S.error + "60" : hasFile ? S.emerald + "50" : S.border), background: hasFile ? (oversize ? S.roseLight : S.emeraldLight) : "#fff", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{doc.label} {doc.required && <span style={{ color: S.coral }}>*</span>}</div>
          {hasFile && <div style={{ fontSize: 11, color: oversize ? S.error : S.emeraldDark, fontFamily: S.body, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{oversize ? "File too large (max 5 MB)" : `✓ ${file.name} (${(file.size / 1024).toFixed(0)} KB)`}</div>}
        </div>
        <label htmlFor={id} style={{ padding: "8px 14px", borderRadius: 10, background: hasFile ? S.emerald + "15" : S.coral + "10", color: hasFile ? S.emeraldDark : S.coral, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body, border: "1px solid " + (hasFile ? S.emerald + "30" : S.coral + "30") }}>{hasFile ? "Change" : "Choose File"}</label>
        <input id={id} type="file" accept={doc.accept} onChange={(e) => onFileChange(doc.slot, e.target.files[0])} style={{ display: "none" }} />
      </div>
    </div>
  );
}

function PrayerModal({ prayer, onClose }) {
  if (!prayer) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(1,30,64,0.85)", backdropFilter: "blur(6px)" }} />
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: 520, width: "100%", background: "#fff", borderRadius: 22, padding: "clamp(28px,5vw,48px)", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
        <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, fontWeight: 800, marginBottom: 16 }}>{prayer.title}</h2>
        <p style={{ fontFamily: S.body, fontSize: 15, color: "#2D3748", lineHeight: 1.8, marginBottom: 24 }}>{prayer.prayer}</p>
        <button onClick={onClose} style={{ padding: "14px 36px", borderRadius: 12, background: S.coral, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Click Amen 🙏</button>
      </div>
    </div>
  );
}

function StatusTracker({ setPage }) {
  const [lookupVal, setLookupVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!lookupVal.trim()) { setError("Please enter your Application Number or Student ID."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      // 🚀 FIXED: Re-routed strictly through Vercel Proxy to bypass CORS blocks
      const res = await fetch(`${VERCEL_URL}?action=lookupstudent&ref=${encodeURIComponent(lookupVal.trim().toUpperCase())}`);
      const data = await res.json();
      if (data.found) setResult(data); else setError("No application found. Please check your details and try again.");
    } catch { setError("Unable to connect. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ background: S.white, borderRadius: 22, padding: "32px 28px", border: `1px solid ${S.border}`, boxShadow: "0 16px 36px rgba(15,23,42,0.05)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 42, marginBottom: 12 }}>🔍</div>
        <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 800, marginBottom: 8 }}>Track My Application</h2>
        <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7 }}>Enter your Application Number or Student ID to check your current status.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
        <input value={lookupVal} onChange={(e) => { setLookupVal(e.target.value.toUpperCase()); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") lookup(); }} placeholder="e.g. CTSETSA-2026-04-12345" style={{ ...inputStyle, border: `2px solid ${error ? S.error + "60" : S.border}` }} />
        <button onClick={lookup} disabled={loading} style={{ padding: "14px 24px", borderRadius: 12, background: loading ? S.gray : S.navy, color: S.white, border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: S.body }}>{loading ? "Searching..." : "Check Status →"}</button>
      </div>
      {error && <div style={{ padding: "12px 14px", borderRadius: 10, background: S.roseLight, fontSize: 13, color: S.error, fontFamily: S.body, marginTop: 14 }}>{error}</div>}
      {result && <div style={{ marginTop: 24, background: S.lightBg, borderRadius: 16, padding: 20, border: `1px solid ${S.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
          {result.name && <div><div style={{ fontSize: 10, color: S.gray, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body }}>Name</div><div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{result.name}</div></div>}
          {result.ref && <div><div style={{ fontSize: 10, color: S.gray, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body }}>Application Reference</div><div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>{result.ref}</div></div>}
          {result.studentNumber && <div><div style={{ fontSize: 10, color: S.gray, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body }}>Student ID</div><div style={{ fontSize: 16, fontWeight: 800, color: S.coral, fontFamily: S.heading }}>{result.studentNumber}</div></div>}
          {result.programme && <div><div style={{ fontSize: 10, color: S.gray, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body }}>Programme</div><div style={{ fontSize: 13, fontWeight: 600, color: S.navy, fontFamily: S.body }}>{(result.level ? result.level + " — " : "") + result.programme}</div></div>}
          {result.paymentPlan && <div><div style={{ fontSize: 10, color: S.gray, letterSpacing: 1, textTransform: "uppercase", fontFamily: S.body }}>Payment Plan</div><div style={{ fontSize: 13, fontWeight: 600, color: S.navy, fontFamily: S.body }}>{result.paymentPlan}</div></div>}
        </div>
        {result.status === "Accepted" && <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: S.emeraldLight, border: `1px solid ${S.emerald}30`, fontSize: 13, fontFamily: S.body, color: S.navy, lineHeight: 1.7 }}><strong>Next step:</strong> Complete your payment to secure your place. <button onClick={() => setPage("Pay")} style={{ background: "none", border: "none", color: S.coral, fontWeight: 700, cursor: "pointer", fontFamily: S.body, fontSize: 13, padding: 0 }}>Go to Payment Centre →</button></div>}
      </div>}
    </div>
  );
}

export default function ApplyPage({ setPage }) {
  const [applicantType, setApplicantType] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", gender: "", dob: "", nationality: "", parish: "", country: "Jamaica", address: "", trn: "", highestQualification: "", employmentStatus: "", emergencyName: "", emergencyRelationship: "", emergencyPhone: "", level: "", programme: "", paymentPlan: "", hearAbout: "", message: "" });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [captchaOk, setCaptchaOk] = useState(false);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prayer, setPrayer] = useState(null);
  const [heartFormDone, setHeartFormDone] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const appRef = useRef(generateRef());
  const startTime = useRef(Date.now());

  const isJamaican = applicantType === "jamaican";
  const availableProgrammes = form.level ? (PROGRAMMES[form.level] || []) : [];
  const currentDocs = applicantType ? DOC_REQUIREMENTS[applicantType].map((d) => d.slot === "qualifications" ? { ...d, required: !!form.highestQualification && form.highestQualification !== "No Formal Qualification" } : d) : [];

  const set = (key, val) => { setForm((prev) => ({ ...prev, [key]: val })); if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; }); };
  const onFileChange = (slot, file) => { if (file) setFiles((prev) => ({ ...prev, [slot]: file })); };

  useEffect(() => { if (window.location.href.indexOf("track=true") !== -1) setShowTracker(true); }, []);

  const handleSubmit = async () => {
    if (hp) return;
    if (Date.now() - startTime.current < 5000) return;
    const errs = {};
    if (!applicantType) errs.applicantType = "Applicant type is required";
    if (!form.firstName) errs.firstName = "First name is required";
    if (!form.lastName) errs.lastName = "Last name is required";
    if (!validateEmail(form.email)) errs.email = "Valid email is required";
    if (!validatePhone(form.phone)) errs.phone = "Valid phone number is required";
    if (!form.gender) errs.gender = "Please select your gender";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!form.nationality) errs.nationality = "Nationality is required";
    if (!form.address) errs.address = "Address is required";
    if (!form.country) errs.country = "Country is required";
    if (applicantType === "jamaican" && !form.parish) errs.parish = "Parish is required";
    if (applicantType === "jamaican" && (!form.trn || !validateTRN(form.trn))) errs.trn = "TRN must be 9 digits";
    if (!form.highestQualification) errs.highestQualification = "Please select your highest qualification";
    if (!form.employmentStatus) errs.employmentStatus = "Please select your employment status";
    if (!form.emergencyName) errs.emergencyName = "Emergency contact name is required";
    if (!form.emergencyPhone) errs.emergencyPhone = "Emergency contact phone is required";
    if (!form.emergencyRelationship) errs.emergencyRelationship = "Emergency contact relationship is required";
    if (!form.level || !form.programme) errs.programme = "Please choose a programme";
    currentDocs.filter((d) => d.required).forEach((d) => {
      if (!files[d.slot]) errs[d.slot] = d.label + " is required";
      else if (!validateFileSize(files[d.slot])) errs[d.slot] = "File too large (max 5 MB)";
    });
    if (isJamaican && !heartFormDone) errs.heartForm = "Please complete the HEART form";
    if (!captchaOk) errs.captcha = "Please complete the verification";
    if (Object.keys(errs).length > 0) { setErrors(errs); window.scrollTo({ top: 200, behavior: "smooth" }); return; }

    setSubmitting(true);
    try {
      const ref = appRef.current;
      const payload = {
        form_type: "Student Application", ref, applicantType,
        fullName: `${form.firstName} ${form.lastName}`, firstName: form.firstName, lastName: form.lastName,
        email: form.email, phone: form.phone, gender: form.gender, dob: fmtDate(form.dob), nationality: form.nationality,
        parish: form.parish || "", country: form.country, address: form.address, trn: form.trn || "",
        highestQualification: form.highestQualification, employmentStatus: form.employmentStatus,
        emergencyName: form.emergencyName, emergencyRelationship: form.emergencyRelationship, emergencyPhone: form.emergencyPhone,
        level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold",
        hearAbout: form.hearAbout || "", message: form.message || "", timestamp: new Date().toISOString(),
      };
      const result = await submitToAppsScript(payload, files);
      if (result?.duplicate) {
        setErrors({ submit: `${form.programme} — an application already exists with this TRN/email (Ref: ${result.existingRef || "—"}). Contact admin@ctsetsjm.com if unexpected.` });
        setSubmitting(false);
        return;
      }
      registerDripSequence({ name: `${form.firstName} ${form.lastName}`, email: form.email, ref, programme: form.programme, level: form.level });
      const g = genderPronouns(form.gender);
      setPrayer(PRAYERS.application(form.firstName.trim(), g));
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ submit: "Network error submitting application. Please try again." });
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <PrayerModal prayer={prayer} onClose={() => setPrayer(null)} />
        <WideWrap style={{ paddingTop: 54 }}>
          <Reveal>
            <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: S.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 20px", border: `3px solid ${S.emerald}` }}>✓</div>
              <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,40px)", color: S.navy, fontWeight: 800, marginBottom: 12 }}>Application Submitted!</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, marginBottom: 28 }}>Thank you, {form.firstName}. Your application has been received and your reference number is <strong>{appRef.current}</strong>.</p>
              <div style={{ background: S.white, borderRadius: 20, padding: 28, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(15,23,42,0.04)", marginBottom: 24 }}>
                <div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 10 }}>What Happens Next?</div>
                {[["1", "Our admissions team reviews your documents (48–72 hours)"], ["2", "You receive an acceptance email with payment instructions"], ["3", "Complete payment to secure your place"], ["4", "Receive Student Portal access and start studying"]].map(([n, txt]) => <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}><div style={{ width: 26, height: 26, borderRadius: "50%", background: S.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: S.white, fontFamily: S.body, flexShrink: 0, marginTop: 1 }}>{n}</div><span style={{ fontSize: 13, color: "#334155", fontFamily: S.body, lineHeight: 1.6 }}>{txt}</span></div>)}
              </div>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Pay")} style={{ background: S.emerald, color: S.white, borderRadius: 12 }}>Make a Payment</Btn>
                <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.coral, color: S.white, borderRadius: 12 }}>View All Programmes</Btn>
                <a href={BOOKING_URLS.general} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 28px", borderRadius: 12, border: `2px solid ${S.teal}`, color: S.teal, fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>Book a Consultation</a>
              </div>
            </div>
          </Reveal>
          <PageScripture page="apply" />
        </WideWrap>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper bg={S.lightBg}>
      <PrayerModal prayer={prayer} onClose={() => setPrayer(null)} />
      {submitting && <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}><div style={{ background: S.white, borderRadius: 18, padding: 40, textAlign: "center", maxWidth: 420 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📨</div><h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 800, marginBottom: 10 }}>Submitting Application</h3><p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7 }}>Please wait while we process your application and upload your documents.</p></div></div>}

      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(360px, 0.92fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Admissions Centre</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 70px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>{showTracker ? "Track your application with your reference number" : "Start your application through a clearer admissions journey"}</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>{showTracker ? "Check your current application status, review your reference, and move into payment or portal access when prompted." : "Complete your details, choose your programme, upload your documents, and move through admissions with more confidence and less confusion."}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setShowTracker(false)} style={{ background: !showTracker ? S.gold : "rgba(255,255,255,0.08)", color: !showTracker ? S.navy : S.white, borderRadius: 14, padding: "15px 24px", border: showTracker ? "1px solid rgba(255,255,255,0.18)" : "none" }}>📝 Apply Now</Btn>
                  <Btn onClick={() => setShowTracker(true)} style={{ background: showTracker ? S.gold : "rgba(255,255,255,0.08)", color: showTracker ? S.navy : S.white, borderRadius: 14, padding: "15px 24px", border: !showTracker ? "1px solid rgba(255,255,255,0.18)" : "none" }}>🔍 Track Application</Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 24px" }}>Need Help?</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 420, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={showTracker ? PEOPLE.tracker : PEOPLE.hero} alt={showTracker ? "Learners checking application status online" : "Professional completing an online application"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{showTracker ? "📌" : "🧾"}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>{showTracker ? "Use your reference" : "Prepare your documents"}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{showTracker ? "💳" : "🎓"}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>{showTracker ? "Move to payment when accepted" : "Choose your programme with confidence"}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          {showTracker ? (
            <>
              <SectionIntro tag="Application Status" title="Check your current admissions progress" desc="Use your application reference or student ID to see where you are in the process and take the next step when prompted." accent={S.teal} />
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)", gap: 24, alignItems: "start" }} className="resp-grid-2">
                <StatusTracker setPage={setPage} />
                <div style={{ display: "grid", gap: 18 }}>
                  <SideInfoCard title="Stay ready for the next step" desc="Once your application is reviewed, you may be asked to complete payment, submit an outstanding item, or prepare for onboarding." img={PEOPLE.tracker} accent={S.coral} />
                  <ChecklistCard title="Good to keep nearby" accent={S.teal} items={["Your application reference number", "The email address you used to apply", "Your student ID if already issued", "A copy of your payment instructions if accepted"]} />
                </div>
              </div>
            </>
          ) : (
            <>
              <SectionIntro tag="Admissions Form" title="Complete your application with more clarity" desc="The application logic remains the same, including applicant type, personal details, programme selection, HEART form handling, document upload, verification, and submission." accent={S.violet} />
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)", gap: 24, alignItems: "start" }} className="resp-grid-2">
                <div>
                  <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />

                  <SectionBlock num="1" title="Where Are You Applying From?" desc="Your document requirements adapt based on your location." complete={!!applicantType}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="resp-grid-3">
                      {APPLICANT_TYPES.map((t) => <button key={t.key} onClick={() => { setApplicantType(t.key); setFiles({}); }} style={{ padding: "22px 16px", borderRadius: 16, border: applicantType === t.key ? `2.5px solid ${S.coral}` : `1.5px solid ${S.border}`, background: applicantType === t.key ? S.coralLight : S.white, cursor: "pointer", textAlign: "center", boxShadow: applicantType === t.key ? `0 8px 20px ${S.coral}15` : "0 8px 18px rgba(15,23,42,0.03)" }}><div style={{ fontSize: 30, marginBottom: 8 }}>{t.label.split(" ")[0]}</div><div style={{ fontSize: 14, fontWeight: 800, color: S.navy, fontFamily: S.body }}>{t.label.split(" ").slice(1).join(" ")}</div><div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 5 }}>{t.desc}</div></button>)}
                    </div>
                    {errors.applicantType && <div style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: 10 }}>⚠️ {errors.applicantType}</div>}
                  </SectionBlock>

                  <SectionBlock num="2" title="Personal Information" locked={!applicantType}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }} className="resp-grid-2">
                      <Field label="First Name" required error={errors.firstName}><input style={inputStyle} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="e.g. Marcus" /></Field>
                      <Field label="Last Name" required error={errors.lastName}><input style={inputStyle} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="e.g. Campbell" /></Field>
                    </div>
                    <Field label="Email Address" required error={errors.email}><input type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }} className="resp-grid-2">
                      <Field label="Phone Number" required error={errors.phone} hint="10 digits starting with country code, e.g. 8761234567"><input type="tel" style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="8763819771" /></Field>
                      <Field label="Gender" required error={errors.gender}><select style={selectStyle} value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">Select...</option>{GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}</select></Field>
                    </div>
                    <div style={{ display: "grid", gridTemplate