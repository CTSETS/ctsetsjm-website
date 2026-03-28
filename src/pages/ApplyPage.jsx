// ─── APPLY PAGE ─────────────────────────────────────────────────────
// 3-tab application: Jamaican / Caribbean / International
// Stage-gated sections with progressive reveal
// Anti-spam: honeypot, timing, captcha
// Submission to Apps Script with prayer/blessing modal
import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { PROGRAMMES } from "../constants/programmes";
import { TESTIMONIALS, PRAYERS, genderPronouns } from "../constants/content";
import { BOOKING_URLS, REG_FEE } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, SectionBlock, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
import { validateEmail, validatePhone, validateTRN, suggestEmail, MAX_FILE_SIZE, validateFileSize } from "../utils/validation";
import { submitToAppsScript, generateRef } from "../utils/submission";
import { fmt } from "../utils/formatting";
import { validateReferralCode, registerReferral } from "../utils/referral";
import { sendApplicationConfirmation, registerDripSequence } from "../utils/email";
import HeartFormBuilder from "../components/apply/HeartFormBuilder";

// ── Constants ──
const APPLICANT_TYPES = [
  { key: "jamaican", label: "🇯🇲 Jamaican", desc: "Residing in Jamaica" },
  { key: "caribbean", label: "🌴 Caribbean", desc: "CARICOM region" },
  { key: "international", label: "🌍 International", desc: "Worldwide" },
];
const LEVELS = Object.keys(PROGRAMMES);
const GENDERS = ["Male", "Female", "Prefer not to say"];
const JA_PARISHES = ["Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary", "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland", "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"];
const DOC_REQUIREMENTS = {
  jamaican: [
    { slot: "passportPhoto", label: "Passport-Size Photo", required: true, accept: "image/*" },
    { slot: "birthCert", label: "Birth Certificate", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity (National ID / Passport / Driver's Licence)", required: true, accept: "image/*,.pdf" },
    { slot: "trn", label: "TRN Card", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Qualifications (CXC, Diplomas, etc.)", required: false, accept: "image/*,.pdf" },
    { slot: "heartForm", label: "HEART/NSTA Application Form", required: false, accept: "image/*,.pdf" },
  ],
  caribbean: [
    { slot: "passportPhoto", label: "Passport-Size Photo", required: true, accept: "image/*" },
    { slot: "birthCertOrPassport", label: "Birth Certificate or Passport", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity (National ID / Passport / Driver's Licence)", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Academic Qualifications", required: false, accept: "image/*,.pdf" },
  ],
  international: [
    { slot: "passportPhoto", label: "Passport-Size Photo", required: true, accept: "image/*" },
    { slot: "passportBio", label: "Passport Bio Page", required: true, accept: "image/*,.pdf" },
    { slot: "transcripts", label: "Secondary School Transcripts", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity (National ID / Passport / Driver's Licence)", required: true, accept: "image/*,.pdf" },
  ],
};

// ── Styled form field ──
function Field({ label, required, children, error, hint }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>
        {label} {required && <span style={{ color: S.coral }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4 }}>{hint}</div>}
      {error && <div style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>⚠️ {error}</div>}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.12)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1A202C", outline: "none", background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s" };
const selectStyle = { ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 };

// ── File Upload component ──
function FileUpload({ doc, file, onFileChange }) {
  const id = "file-" + doc.slot;
  const hasFile = !!file;
  const oversize = file && !validateFileSize(file);
  return (
    <div style={{ padding: "14px 18px", borderRadius: 10, border: "1.5px dashed " + (oversize ? S.error + "60" : hasFile ? S.emerald + "50" : "rgba(1,30,64,0.12)"), background: hasFile ? (oversize ? S.roseLight : S.emeraldLight) : "#fff", transition: "all 0.2s", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.navy, fontFamily: S.body }}>
            {doc.label} {doc.required && <span style={{ color: S.coral, fontSize: 11 }}>*</span>}
          </div>
          {hasFile && (
            <div style={{ fontSize: 11, color: oversize ? S.error : S.emeraldDark, fontFamily: S.body, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {oversize ? "File too large (max 5 MB)" : `✓ ${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
            </div>
          )}
        </div>
        <label htmlFor={id} style={{ padding: "8px 16px", borderRadius: 6, background: hasFile ? S.emerald + "15" : S.coral + "10", color: hasFile ? S.emeraldDark : S.coral, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap", border: "1px solid " + (hasFile ? S.emerald + "30" : S.coral + "30"), transition: "all 0.2s" }}>
          {hasFile ? "Change" : "Choose File"}
        </label>
        <input id={id} type="file" accept={doc.accept} onChange={(e) => onFileChange(doc.slot, e.target.files[0])} style={{ display: "none" }} />
      </div>
    </div>
  );
}

// ── Prayer/Blessing Modal ──
function PrayerModal({ prayer, onClose }) {
  if (!prayer) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(1,30,64,0.85)", backdropFilter: "blur(6px)" }} />
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: 520, width: "100%", background: "#fff", borderRadius: 20, padding: "clamp(28px,5vw,48px)", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
        <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, fontWeight: 700, marginBottom: 16 }}>{prayer.title}</h2>
        <p style={{ fontFamily: S.body, fontSize: 15, color: "#2D3748", lineHeight: 1.8, marginBottom: 24 }}>{prayer.prayer}</p>
        <div style={{ padding: "16px 24px", borderRadius: 12, background: S.goldLight, border: "1px solid " + S.gold + "30", marginBottom: 24 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: S.navy, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 8px" }}>"{prayer.scripture}"</p>
          <p style={{ fontFamily: S.body, fontSize: 11, color: S.gold, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>— {prayer.ref}</p>
        </div>
        <button onClick={onClose} style={{ padding: "14px 40px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Amen 🙏</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APPLY PAGE
// ═══════════════════════════════════════════════════════════════
export default function ApplyPage({ setPage }) {
  // ── State ──
  const [applicantType, setApplicantType] = useState("");
  const [form, setForm] = useState({ firstName: "", middleName: "", lastName: "", email: "", phone: "", gender: "", dob: "", nationality: "", maritalStatus: "", parish: "", country: "", address: "", trn: "", nis: "", highestQualification: "", schoolLastAttended: "", yearCompleted: "", employmentStatus: "", employer: "", jobTitle: "", yearsExperience: "", industry: "", emergencyName: "", emergencyRelationship: "", emergencyPhone: "", level: "", programme: "", referralCode: "", hearAbout: "", message: "" });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prayer, setPrayer] = useState(null);
  const [referralValid, setReferralValid] = useState(null);
  const [referralChecking, setReferralChecking] = useState(false);
  const [heartFormDone, setHeartFormDone] = useState(false);
  // Application number — generated once when the page loads, stays the same throughout
  const appRef = useRef(generateRef());
  const startTime = useRef(Date.now());

  // ── Derived ──
  const isJamaican = applicantType === "jamaican";
  const availableProgrammes = form.level ? (PROGRAMMES[form.level] || []) : [];
  const s1Done = !!applicantType;
  const s2Done = s1Done && form.firstName && form.lastName && validateEmail(form.email) && validatePhone(form.phone) && form.gender && form.dob && form.address && (isJamaican ? (form.parish && form.trn && validateTRN(form.trn)) : form.country) && form.employmentStatus && form.emergencyName && form.emergencyPhone && form.highestQualification;
  const s3Done = s2Done && form.level && form.programme;
  // Jamaican applicants must complete HEART form before docs; others skip straight to docs
  const sHeartDone = isJamaican ? heartFormDone : true;
  const sDocGate = s3Done && sHeartDone;
  // Qualifications upload is required unless "No Formal Qualification" selected
  const qualsRequired = form.highestQualification && form.highestQualification !== "No Formal Qualification";
  const getDocs = () => {
    if (!applicantType) return [];
    return DOC_REQUIREMENTS[applicantType].map(d =>
      d.slot === "qualifications" ? { ...d, required: qualsRequired } : d
    );
  };
  const currentDocs = getDocs();
  const requiredDocs = currentDocs.filter(d => d.required);
  const s4Done = sDocGate && requiredDocs.every(d => files[d.slot] && validateFileSize(files[d.slot]));
  const s5Done = s4Done && captchaOk;
  // Dynamic section numbers (Jamaican gets extra HEART section)
  const secN = isJamaican ? { type: "1", personal: "2", programme: "3", heart: "4", docs: "5", review: "6" } : { type: "1", personal: "2", programme: "3", docs: "4", review: "5" };

  // ── Handlers ──
  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const onEmailBlur = () => {
    const suggestion = suggestEmail(form.email);
    setEmailSuggestion(suggestion);
  };

  const onFileChange = (slot, file) => {
    if (file) setFiles(prev => ({ ...prev, [slot]: file }));
  };

  // Reset programme when level changes
  useEffect(() => { set("programme", ""); }, [form.level]);

  // Validate referral code
  const checkReferral = async () => {
    if (!form.referralCode || form.referralCode.length < 8) { setReferralValid(null); return; }
    setReferralChecking(true);
    const result = await validateReferralCode(form.referralCode);
    setReferralValid(result);
    setReferralChecking(false);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (hp) return;
    if (Date.now() - startTime.current < 5000) return;

    // Validate
    const errs = {};
    if (!form.firstName) errs.firstName = "First name is required";
    if (!form.lastName) errs.lastName = "Last name is required";
    if (!validateEmail(form.email)) errs.email = "Valid email is required";
    if (!validatePhone(form.phone)) errs.phone = "Valid 10-digit phone number is required";
    if (!form.gender) errs.gender = "Please select your gender";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!form.address) errs.address = "Address is required";
    if (applicantType === "jamaican" && !form.parish) errs.parish = "Parish is required";
    if (applicantType !== "jamaican" && !form.country) errs.country = "Country is required";
    if (applicantType === "jamaican" && !form.trn) errs.trn = "TRN is required for Jamaican applicants";
    if (applicantType === "jamaican" && form.trn && !validateTRN(form.trn)) errs.trn = "TRN must be 9 digits";
    if (!form.highestQualification) errs.highestQualification = "Please select your highest qualification";
    if (!form.employmentStatus) errs.employmentStatus = "Please select your employment status";
    if (!form.emergencyName) errs.emergencyName = "Emergency contact name is required";
    if (!form.emergencyPhone) errs.emergencyPhone = "Emergency contact phone is required";
    if (!form.level) errs.level = "Please select a qualification level";
    if (!form.programme) errs.programme = "Please select a programme";
    requiredDocs.forEach(d => { if (!files[d.slot]) errs[d.slot] = d.label + " is required"; else if (!validateFileSize(files[d.slot])) errs[d.slot] = "File too large (max 5 MB)"; });
    if (!captchaOk) errs.captcha = "Please complete the verification";

    if (Object.keys(errs).length > 0) { setErrors(errs); window.scrollTo({ top: 200, behavior: "smooth" }); return; }

    setSubmitting(true);
    const ref = appRef.current;
    const fullName = form.firstName.trim() + " " + form.lastName.trim();
    const formData = {
      form_type: "Student Application",
      ref,
      applicantType,
      fullName,
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender,
      dob: form.dob,
      nationality: form.nationality || "",
      maritalStatus: form.maritalStatus || "",
      parish: form.parish || "",
      country: form.country || "",
      address: form.address.trim(),
      trn: form.trn || "",
      nis: form.nis || "",
      highestQualification: form.highestQualification || "",
      schoolLastAttended: form.schoolLastAttended || "",
      yearCompleted: form.yearCompleted || "",
      employmentStatus: form.employmentStatus || "",
      employer: form.employer || "",
      jobTitle: form.jobTitle || "",
      industry: form.industry || "",
      yearsExperience: form.yearsExperience || "",
      emergencyName: form.emergencyName || "",
      emergencyRelationship: form.emergencyRelationship || "",
      emergencyPhone: form.emergencyPhone || "",
      level: form.level,
      programme: form.programme,
      referralCode: form.referralCode || "",
      hearAbout: form.hearAbout || "",
      message: form.message || "",
      timestamp: new Date().toISOString(),
    };

    const result = await submitToAppsScript(formData, files);

    if (result.duplicate) {
      setErrors({ submit: `An application with this email already exists (Ref: ${result.existingRef || "—"}). Contact info@ctsetsjm.com if this is unexpected.` });
      setSubmitting(false);
      return;
    }

    // Register referral if valid
    if (referralValid?.valid && form.referralCode) {
      registerReferral({ referralCode: form.referralCode, referredName: fullName, referredEmail: form.email, referredRef: ref, referredProgramme: form.programme });
    }

    // Send confirmation email + register drip
    sendApplicationConfirmation({ name: fullName, email: form.email, ref, programme: form.programme, level: form.level });
    registerDripSequence({ name: fullName, email: form.email, ref, programme: form.programme, level: form.level });

    // Show prayer
    const g = genderPronouns(form.gender);
    setPrayer(PRAYERS.application(form.firstName.trim(), g));

    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ══════════════════════════════════════════════════════════════════
  // SUBMITTED — SUCCESS VIEW
  // ══════════════════════════════════════════════════════════════════
  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <PrayerModal prayer={prayer} onClose={() => setPrayer(null)} />
        <Container style={{ paddingTop: 48 }}>
          <Reveal>
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: S.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px", border: "3px solid " + S.emerald }}>✓</div>
              <h2 style={{ fontFamily: S.heading, fontSize: "clamp(24px,4vw,36px)", color: S.navy, fontWeight: 700, marginBottom: 12 }}>Application Submitted!</h2>
              <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, marginBottom: 28 }}>
                Thank you, {form.firstName}. Your application has been received and is now under review. You should receive a confirmation email shortly.
              </p>

              <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", border: "1px solid " + S.border, textAlign: "left", marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16 }}>Application Summary</div>
                {[
                  ["Reference", appRef.current],
                  ["Name", form.firstName + " " + form.lastName],
                  ["Email", form.email],
                  ["Programme", form.level + " — " + form.programme],
                  ["Applicant Type", APPLICANT_TYPES.find(t => t.key === applicantType)?.label],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray, fontWeight: 500 }}>{k}</span>
                    <span style={{ color: S.navy, fontWeight: 700, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: S.tealLight, borderRadius: 12, padding: "20px 24px", border: "1px solid " + S.teal + "30", textAlign: "left", marginBottom: 28 }}>
                <div style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 700, marginBottom: 10 }}>What Happens Next?</div>
                {[
                  ["1", "Our admissions team reviews your documents (24–48 hours)"],
                  ["2", "You receive an acceptance email with payment instructions"],
                  ["3", "Complete payment to secure your place"],
                  ["4", "Receive Student Portal access and start studying"],
                ].map(([n, txt]) => (
                  <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: S.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: S.body, flexShrink: 0, marginTop: 1 }}>{n}</div>
                    <span style={{ fontSize: 13, color: "#2D3748", fontFamily: S.body, lineHeight: 1.5 }}>{txt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn primary onClick={() => setPage("Pay")} style={{ background: S.emerald, color: "#fff" }}>Make a Payment</Btn>
                <Btn primary onClick={() => setPage("Programmes")} style={{ background: S.coral, color: "#fff" }}>View All Programmes</Btn>
                <a href={BOOKING_URLS.general} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 28px", borderRadius: 8, border: "2px solid " + S.teal, color: S.teal, fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>Book a Consultation</a>
              </div>
            </div>
          </Reveal>
          <PageScripture page="apply" />
        </Container>
      </PageWrapper>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // APPLICATION FORM
  // ══════════════════════════════════════════════════════════════════
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Start Here" title="Apply in Under 10 Minutes" desc="Complete the form, upload your documents, and we'll review within 24–48 hours." accentColor={S.coral} />
      <Container>
        <SocialProofBar />

        {/* Application Number — visible immediately */}
        <div style={{ background: S.navy, borderRadius: 12, padding: "18px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: S.gold + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📋</div>
            <div>
              <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>Your Application Number</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: S.heading, letterSpacing: 1, marginTop: 2 }}>{appRef.current}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: S.body, lineHeight: 1.5 }}>Save this number. You will need it<br />to make payments and check your status.</div>
          </div>
        </div>

        {/* Applicant Type Info Bar */}
        <div style={{ background: S.skyLight, borderRadius: 12, padding: "16px 20px", border: "1px solid " + S.sky + "25", marginBottom: 32, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Before You Start</div>
            <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>Have your ID, qualifications, and a passport-size photo ready. The form saves as you go — you can come back anytime.</div>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Hidden honeypot */}
          <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />

          {/* ════════════════════════════════════════════════ */}
          {/* SECTION 1: APPLICANT TYPE */}
          {/* ════════════════════════════════════════════════ */}
          <SectionBlock num={secN.type} title="Where Are You Applying From?" desc="Your document requirements will adapt based on your location." complete={s1Done}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="resp-grid-3">
              {APPLICANT_TYPES.map(t => (
                <button key={t.key} onClick={() => { setApplicantType(t.key); setFiles({}); }}
                  style={{
                    padding: "20px 16px", borderRadius: 12, border: applicantType === t.key ? "2.5px solid " + S.coral : "1.5px solid rgba(1,30,64,0.08)",
                    background: applicantType === t.key ? S.coralLight : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                    boxShadow: applicantType === t.key ? "0 4px 16px " + S.coral + "20" : "none",
                  }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{t.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>{t.label.split(" ").slice(1).join(" ")}</div>
                  <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </SectionBlock>

          {/* ════════════════════════════════════════════════ */}
          {/* SECTION 2: PERSONAL INFORMATION */}
          {/* ════════════════════════════════════════════════ */}
          <SectionBlock num={secN.personal} title="Personal Information" locked={!s1Done} complete={s2Done}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }} className="resp-grid-3">
              <Field label="First Name" required error={errors.firstName}>
                <input style={inputStyle} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="e.g. Marcus" />
              </Field>
              <Field label="Middle Name">
                <input style={inputStyle} value={form.middleName} onChange={e => set("middleName", e.target.value)} placeholder="e.g. Anthony" />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input style={inputStyle} value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="e.g. Campbell" />
              </Field>
            </div>
            <Field label="Email Address" required error={errors.email}>
              <input type="email" style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} onBlur={onEmailBlur} placeholder="your@email.com" />
              {emailSuggestion && (
                <button onClick={() => { set("email", emailSuggestion); setEmailSuggestion(null); }}
                  style={{ background: S.amberLight, border: "1px solid " + S.amber + "40", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontFamily: S.body, color: S.amberDark, cursor: "pointer", marginTop: 6 }}>
                  Did you mean <strong>{emailSuggestion}</strong>?
                </button>
              )}
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
              <Field label="Phone Number" required error={errors.phone} hint="10 digits, e.g. 876XXXXXXX">
                <input type="tel" style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="8763819771" />
              </Field>
              <Field label="Gender" required error={errors.gender}>
                <select style={selectStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
                  <option value="">Select...</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }} className="resp-grid-3">
              <Field label="Date of Birth" required error={errors.dob}>
                <input type="date" style={inputStyle} value={form.dob} onChange={e => set("dob", e.target.value)} max="2012-01-01" />
              </Field>
              <Field label="Nationality">
                <input style={inputStyle} value={form.nationality} onChange={e => set("nationality", e.target.value)} placeholder={isJamaican ? "Jamaican" : "e.g. Trinidadian"} />
              </Field>
              <Field label="Marital Status">
                <select style={selectStyle} value={form.maritalStatus} onChange={e => set("maritalStatus", e.target.value)}>
                  <option value="">Select...</option>
                  {["Single", "Married", "Divorced", "Widowed", "Separated", "Common-Law"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Address" required error={errors.address}>
              <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="Street, City, Parish/State" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
              {isJamaican ? (
                <Field label="Parish" required error={errors.parish}>
                  <select style={selectStyle} value={form.parish} onChange={e => set("parish", e.target.value)}>
                    <option value="">Select parish...</option>
                    {JA_PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              ) : (
                <Field label="Country" required error={errors.country}>
                  <input style={inputStyle} value={form.country} onChange={e => set("country", e.target.value)} placeholder={applicantType === "caribbean" ? "e.g. Trinidad & Tobago" : "e.g. United Kingdom"} />
                </Field>
              )}
              {isJamaican && (
                <Field label="TRN (Tax Registration Number)" required error={errors.trn} hint="9 digits — for NCTVET registration">
                  <input style={inputStyle} value={form.trn} onChange={e => set("trn", e.target.value)} placeholder="123456789" maxLength={11} />
                </Field>
              )}
            </div>
            {isJamaican && (
              <Field label="NIS Number (National Insurance Scheme)" hint="Optional — if you have one">
                <input style={inputStyle} value={form.nis} onChange={e => set("nis", e.target.value)} placeholder="NIS number" />
              </Field>
            )}

            {/* Education Background */}
            <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid " + S.border }}>
              <div style={{ fontSize: 11, color: S.violet, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16 }}>Education Background</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
                <Field label="Highest Qualification Obtained" required error={errors.highestQualification}>
                  <select style={selectStyle} value={form.highestQualification} onChange={e => set("highestQualification", e.target.value)}>
                    <option value="">Select...</option>
                    {["No Formal Qualification", "Primary School Certificate", "CXC/CSEC (1–2 subjects)", "CXC/CSEC (3–4 subjects)", "CXC/CSEC (5+ subjects)", "CAPE / A-Levels", "HEART Certificate / NVQ-J", "Diploma", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Year Completed">
                  <input style={inputStyle} value={form.yearCompleted} onChange={e => set("yearCompleted", e.target.value)} placeholder="e.g. 2020" maxLength={4} />
                </Field>
              </div>
              <Field label="Last School / Institution Attended">
                <input style={inputStyle} value={form.schoolLastAttended} onChange={e => set("schoolLastAttended", e.target.value)} placeholder="e.g. Kingston Technical High School" />
              </Field>
              {qualsRequired && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 11, color: S.amberDark, fontFamily: S.body, lineHeight: 1.6 }}>
                  You will need to upload your qualification documents (certificates, transcripts) in the Documents section below.
                </div>
              )}
            </div>

            {/* Employment Information */}
            <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid " + S.border }}>
              <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16 }}>Employment Information</div>
              <Field label="Employment Status" required error={errors.employmentStatus}>
                <select style={selectStyle} value={form.employmentStatus} onChange={e => set("employmentStatus", e.target.value)}>
                  <option value="">Select...</option>
                  {["Employed (Full-Time)", "Employed (Part-Time)", "Self-Employed", "Unemployed", "Student", "Retired"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              {(form.employmentStatus && form.employmentStatus !== "Unemployed" && form.employmentStatus !== "Student" && form.employmentStatus !== "Retired") && (
                <Reveal>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
                    <Field label="Current Employer / Business Name">
                      <input style={inputStyle} value={form.employer} onChange={e => set("employer", e.target.value)} placeholder="e.g. National Commercial Bank" />
                    </Field>
                    <Field label="Job Title / Position">
                      <input style={inputStyle} value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} placeholder="e.g. Customer Service Officer" />
                    </Field>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
                    <Field label="Industry / Sector">
                      <select style={selectStyle} value={form.industry} onChange={e => set("industry", e.target.value)}>
                        <option value="">Select...</option>
                        {["Agriculture", "Banking & Finance", "BPO / Call Centre", "Construction", "Education", "Government / Public Sector", "Healthcare", "Hospitality / Tourism", "Information Technology", "Manufacturing", "Media & Entertainment", "Mining & Energy", "Retail / Wholesale", "Security", "Telecommunications", "Transportation & Logistics", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Years of Work Experience">
                      <select style={selectStyle} value={form.yearsExperience} onChange={e => set("yearsExperience", e.target.value)}>
                        <option value="">Select...</option>
                        {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "11–15 years", "16–20 years", "Over 20 years"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </Field>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Emergency Contact */}
            <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid " + S.border }}>
              <div style={{ fontSize: 11, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16 }}>Emergency Contact</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }} className="resp-grid-3">
                <Field label="Contact Name" required error={errors.emergencyName}>
                  <input style={inputStyle} value={form.emergencyName} onChange={e => set("emergencyName", e.target.value)} placeholder="e.g. Sandra Campbell" />
                </Field>
                <Field label="Relationship">
                  <select style={selectStyle} value={form.emergencyRelationship} onChange={e => set("emergencyRelationship", e.target.value)}>
                    <option value="">Select...</option>
                    {["Spouse", "Parent", "Sibling", "Child", "Aunt/Uncle", "Cousin", "Friend", "Employer", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Contact Phone" required error={errors.emergencyPhone}>
                  <input type="tel" style={inputStyle} value={form.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} placeholder="8761234567" />
                </Field>
              </div>
            </div>
          </SectionBlock>

          {/* ════════════════════════════════════════════════ */}
          {/* SECTION 3: PROGRAMME SELECTION */}
          {/* ════════════════════════════════════════════════ */}
          <SectionBlock num={secN.programme} title="Programme Selection" desc="Choose your qualification level and programme." locked={!s2Done} complete={s3Done}>
            <Field label="Qualification Level" required error={errors.level}>
              <select style={selectStyle} value={form.level} onChange={e => set("level", e.target.value)}>
                <option value="">Select level...</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            {form.level && (
              <Reveal>
                <Field label="Programme" required error={errors.programme}>
                  <select style={selectStyle} value={form.programme} onChange={e => set("programme", e.target.value)}>
                    <option value="">Select programme...</option>
                    {availableProgrammes.map(p => <option key={p.name} value={p.name}>{p.name} — {p.duration}</option>)}
                  </select>
                </Field>
              </Reveal>
            )}
            {form.level && form.programme && (() => {
              const prog = availableProgrammes.find(p => p.name === form.programme);
              if (!prog) return null;
              return (
                <Reveal>
                  <div style={{ background: S.navy, borderRadius: 12, padding: "20px 24px", marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 4 }}>{form.level}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: S.heading }}>{form.programme}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: 4 }}>{prog.duration} · {prog.desc}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>Tuition</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: S.gold, fontFamily: S.heading }}>{prog.tuition}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>+ {fmt(REG_FEE)} registration</div>
                      </div>
                    </div>
                    <button onClick={() => setPage("Founding Cohort")} style={{ marginTop: 14, padding: "8px 16px", borderRadius: 6, background: S.coral + "20", border: "1px solid " + S.coral + "40", color: S.coral, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>
                      🎓 Founding Cohort? Save up to $10K →
                    </button>
                  </div>
                </Reveal>
              );
            })()}
          </SectionBlock>

          {/* ════════════════════════════════════════════════ */}
          {/* SECTION 4 (Jamaican only): HEART/NSTA FORM */}
          {/* ════════════════════════════════════════════════ */}
          {isJamaican && (
            <SectionBlock num={secN.heart} title="HEART/NSTA Application Form" desc="Auto-filled from your details. Sign and download, then upload it in the next section." locked={!s3Done} complete={heartFormDone}>
              <HeartFormBuilder formData={form} onComplete={(sig) => { if (sig) setHeartFormDone(true); }} />
            </SectionBlock>
          )}

          {/* ════════════════════════════════════════════════ */}
          {/* DOCUMENT UPLOADS */}
          {/* ════════════════════════════════════════════════ */}
          <SectionBlock num={secN.docs} title="Upload Your Documents" desc={`Required documents for ${APPLICANT_TYPES.find(t => t.key === applicantType)?.label || "your"} applicants. Max 5 MB per file.${isJamaican ? " Include the signed HEART form you just downloaded." : ""}`} locked={!sDocGate} complete={s4Done}>
            {applicantType && currentDocs.map(doc => (
              <FileUpload key={doc.slot} doc={doc} file={files[doc.slot]} onFileChange={onFileChange} />
            ))}
            {Object.keys(errors).filter(k => currentDocs.some(d => d.slot === k)).map(k => (
              <div key={k} style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: -6, marginBottom: 10 }}>⚠️ {errors[k]}</div>
            ))}
          </SectionBlock>

          {/* ════════════════════════════════════════════════ */}
          {/* REVIEW & SUBMIT */}
          {/* ════════════════════════════════════════════════ */}
          <SectionBlock num={secN.review} title="Review & Submit" locked={!s4Done} complete={false}>
            {/* Referral Code */}
            <Field label="Referral Code" hint="If a CTS ETS student referred you, enter their code for a 5% discount.">
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={form.referralCode} onChange={e => set("referralCode", e.target.value.toUpperCase())} placeholder="CTSETS-REF-XXXXX" />
                <button onClick={checkReferral} disabled={referralChecking} style={{ padding: "12px 20px", borderRadius: 8, background: S.teal, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body, opacity: referralChecking ? 0.6 : 1 }}>
                  {referralChecking ? "..." : "Verify"}
                </button>
              </div>
              {referralValid?.valid && <div style={{ fontSize: 12, color: S.emerald, fontFamily: S.body, marginTop: 6, fontWeight: 600 }}>✓ Valid referral from {referralValid.referrerName} — 5% discount will be applied!</div>}
              {referralValid && !referralValid.valid && form.referralCode.length >= 8 && <div style={{ fontSize: 12, color: S.error, fontFamily: S.body, marginTop: 6 }}>Referral code not found. Check and try again.</div>}
            </Field>

            {/* How did you hear about us */}
            <Field label="How did you hear about us?">
              <select style={selectStyle} value={form.hearAbout} onChange={e => set("hearAbout", e.target.value)}>
                <option value="">Select...</option>
                {["Google Search", "Facebook", "Instagram", "TikTok", "LinkedIn", "WhatsApp", "A friend or family member", "Employer", "HEART/NSTA", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            {/* Additional message */}
            <Field label="Anything else you'd like us to know?" hint="Optional — special requests, questions, etc.">
              <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.message} onChange={e => set("message", e.target.value)} placeholder="e.g. I'm interested in the Founding Cohort pricing..." />
            </Field>

            {/* Captcha */}
            <div style={{ marginBottom: 24 }}>
              <CaptchaChallenge onVerified={() => setCaptchaOk(true)} verified={captchaOk} />
              {errors.captcha && <div style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: 6 }}>⚠️ {errors.captcha}</div>}
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div style={{ padding: "14px 20px", borderRadius: 10, background: S.roseLight, border: "1px solid " + S.rose + "30", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: S.roseDark, fontFamily: S.body, fontWeight: 600 }}>⚠️ {errors.submit}</div>
              </div>
            )}

            {/* Submit button */}
            <button onClick={handleSubmit} disabled={submitting || !s5Done}
              style={{
                width: "100%", padding: "18px 40px", borderRadius: 12, border: "none",
                background: s5Done ? `linear-gradient(135deg, ${S.coral} 0%, ${S.gold} 100%)` : "rgba(1,30,64,0.08)",
                color: s5Done ? "#fff" : S.grayLight, fontSize: 16, fontWeight: 800, cursor: s5Done ? "pointer" : "not-allowed",
                fontFamily: S.body, letterSpacing: 0.5, transition: "all 0.3s",
                boxShadow: s5Done ? "0 8px 32px " + S.coral + "30" : "none",
                opacity: submitting ? 0.7 : 1,
              }}>
              {submitting ? "Submitting Application..." : "Submit Application →"}
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 14, lineHeight: 1.6 }}>
              By submitting, you agree to our{" "}
              <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: S.teal, cursor: "pointer", fontFamily: S.body, fontSize: 11, padding: 0 }}>Terms &amp; Conditions</button>
              {" "}and{" "}
              <button onClick={() => setPage("Privacy")} style={{ background: "none", border: "none", color: S.teal, cursor: "pointer", fontFamily: S.body, fontSize: 11, padding: 0 }}>Privacy Policy</button>.
            </p>
          </SectionBlock>

          {/* Testimonial */}
          <Reveal delay={0.2}>
            <div style={{ marginTop: 32 }}>
              <TestimonialCard t={TESTIMONIALS[2]} />
            </div>
          </Reveal>

          {/* Need help? */}
          <Reveal delay={0.3}>
            <div style={{ marginTop: 24, padding: "20px 24px", borderRadius: 12, background: "#fff", border: "1px solid " + S.border, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: S.skyLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💬</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.body }}>Need help with your application?</div>
                <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 2 }}>WhatsApp us at 876-381-9771 or email info@ctsetsjm.com. We respond within 24 hours.</div>
              </div>
              <a href="https://wa.me/8763819771?text=Hi%2C%20I%20need%20help%20with%20my%20CTS%20ETS%20application." target="_blank" rel="noopener noreferrer"
                style={{ padding: "10px 20px", borderRadius: 8, background: S.emerald, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none", whiteSpace: "nowrap" }}>
                WhatsApp Us →
              </a>
            </div>
          </Reveal>
        </div>

        <PageScripture page="apply" />
      </Container>
    </PageWrapper>
  );
}
