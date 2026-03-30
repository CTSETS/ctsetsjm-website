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
import { fmt, fmtDate } from "../utils/formatting";
import { registerDripSequence } from "../utils/email";
import HeartFormBuilder from "../components/apply/HeartFormBuilder";

// ── Constants ──
const APPLICANT_TYPES = [
  { key: "jamaican", label: "🇯🇲 Jamaican", desc: "Residing in Jamaica" },
  { key: "caribbean", label: "🌴 Caribbean", desc: "CARICOM region" },
  { key: "international", label: "🌍 International", desc: "Worldwide" },
];
const LEVELS = Object.keys(PROGRAMMES);
const GENDERS = ["Male", "Female"];
const JA_PARISHES = ["Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary", "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland", "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"];
const DOC_REQUIREMENTS = {
  jamaican: [
    { slot: "passportPhoto", label: "Passport-Size Photo (upload right-side up — this will be used on your Student ID Card)", required: true, accept: "image/*" },
    { slot: "birthCert", label: "Birth Certificate", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity (National ID / Passport / Driver's Licence)", required: true, accept: "image/*,.pdf" },
    { slot: "trn", label: "TRN Card", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Qualifications (CXC, Diplomas, etc.)", required: false, accept: "image/*,.pdf" },
    { slot: "heartForm", label: "Signed HEART/NSTA Application Form (download from section above)", required: true, accept: "image/*,.pdf" },
  ],
  caribbean: [
    { slot: "passportPhoto", label: "Passport-Size Photo (upload right-side up — this will be used on your Student ID Card)", required: true, accept: "image/*" },
    { slot: "birthCertOrPassport", label: "Birth Certificate or Passport", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity (National ID / Passport / Driver's Licence)", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Academic Qualifications", required: false, accept: "image/*,.pdf" },
  ],
  international: [
    { slot: "passportPhoto", label: "Passport-Size Photo (upload right-side up — this will be used on your Student ID Card)", required: true, accept: "image/*" },
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
  const [form, setForm] = useState({ firstName: "", middleName: "", lastName: "", maidenName: "", email: "", phone: "", phone2: "", gender: "", dob: "", nationality: "", maritalStatus: "", parish: "", country: "Jamaica", address: "", street: "", district: "", postalZone: "", mailingAddress: "", mailingParish: "", mailingStreet: "", trn: "", nis: "", highestQualification: "", schoolLastAttended: "", yearCompleted: "", employmentStatus: "", employer: "", jobTitle: "", yearsExperience: "", industry: "", emergencyName: "", emergencyRelationship: "", emergencyPhone: "", emergency2Name: "", emergency2Relationship: "", emergency2Phone: "", specialNeeds: "No", specialNeedsType: "", previousHeart: "", level: "", programme: "", paymentPlan: "", hearAbout: "", message: "" });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prayer, setPrayer] = useState(null);
  const [heartFormDone, setHeartFormDone] = useState(false);
  const [appQueue, setAppQueue] = useState([]); // queued programme selections
  const [showQueuePrompt, setShowQueuePrompt] = useState(false);
  // Application number — generated once when the page loads, stays the same throughout
  const appRef = useRef(generateRef());
  const startTime = useRef(Date.now());

  // ── Derived ──
  const isJamaican = applicantType === "jamaican";
  const availableProgrammes = form.level ? (PROGRAMMES[form.level] || []) : [];
  const s1Done = !!applicantType;
  const hasQualification = form.highestQualification && form.highestQualification !== "No Formal Qualification";
  const s2Done = s1Done && form.firstName && form.lastName && validateEmail(form.email) && validatePhone(form.phone) && form.gender && form.dob && form.nationality && form.address && form.country && (isJamaican ? (form.parish && form.trn && validateTRN(form.trn)) : true) && form.employmentStatus && form.emergencyName && form.emergencyPhone && form.emergencyRelationship && form.highestQualification && (!hasQualification || (form.schoolLastAttended && form.yearCompleted));
  const s3Done = s2Done && ((form.level && form.programme) || appQueue.length > 0);
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
  useEffect(() => { set("programme", ""); var isGO = form.level && (form.level.indexOf("Job") >= 0 || form.level.indexOf("Level 2") >= 0); set("paymentPlan", isGO ? "Gold" : "Gold"); }, [form.level]);


  // ── Queue management ──
  const addToQueue = () => {
    if (!form.level || !form.programme) return;
    // Check if same programme already in queue
    if (appQueue.some(q => q.programme === form.programme && q.level === form.level)) {
      setErrors({ submit: form.programme + " is already in your application queue." });
      return;
    }
    setAppQueue([...appQueue, { level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold", ref: generateRef(), heartDone: heartFormDone, heartFile: files.heartForm || null }]);
    set("level", ""); set("programme", ""); set("paymentPlan", "");
    // Reset HEART form for next programme
    setHeartFormDone(false);
    setFiles(function(prev) { var n = Object.assign({}, prev); delete n.heartForm; return n; });
    setShowQueuePrompt(false);
  };

  const removeFromQueue = (idx) => {
    setAppQueue(appQueue.filter((_, i) => i !== idx));
  };

  // ── Submit all applications ──
  const handleSubmit = async () => {
    if (hp) return;
    if (Date.now() - startTime.current < 5000) return;

    // Build final list: queued + current (if a programme is selected)
    var allApps = [...appQueue];
    if (form.level && form.programme) {
      allApps.push({ level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold", ref: appRef.current });
    }
    if (allApps.length === 0) { setErrors({ submit: "Please select at least one programme." }); return; }

    // Validate personal info + docs
    const errs = {};
    if (!form.firstName) errs.firstName = "First name is required";
    if (!form.lastName) errs.lastName = "Last name is required";
    if (!validateEmail(form.email)) errs.email = "Valid email is required";
    if (!validatePhone(form.phone)) errs.phone = "Valid phone number required (10+ digits starting with country code, e.g. 876XXXXXXX)";
    if (!form.gender) errs.gender = "Please select your gender";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!form.nationality) errs.nationality = "Nationality is required";
    if (!form.address) errs.address = "Address is required";
    if (applicantType === "jamaican" && !form.parish) errs.parish = "Parish is required";
    if (!form.country) errs.country = "Country is required";
    if (applicantType === "jamaican" && !form.trn) errs.trn = "TRN is required for Jamaican applicants";
    if (applicantType === "jamaican" && form.trn && !validateTRN(form.trn)) errs.trn = "TRN must be 9 digits";
    if (!form.highestQualification) errs.highestQualification = "Please select your highest qualification";
    if (form.highestQualification && form.highestQualification !== "No Formal Qualification") {
      if (!form.schoolLastAttended) errs.schoolLastAttended = "School/institution is required when a qualification is selected";
      if (!form.yearCompleted) errs.yearCompleted = "Year completed is required when a qualification is selected";
    }
    if (!form.employmentStatus) errs.employmentStatus = "Please select your employment status";
    if (!form.emergencyName) errs.emergencyName = "Emergency contact name is required";
    if (!form.emergencyPhone) errs.emergencyPhone = "Emergency contact phone is required";
    if (!form.emergencyRelationship) errs.emergencyRelationship = "Emergency contact relationship is required";
    requiredDocs.forEach(d => { if (!files[d.slot]) errs[d.slot] = d.label + " is required"; else if (!validateFileSize(files[d.slot])) errs[d.slot] = "File too large (max 5 MB)"; });
    if (!captchaOk) errs.captcha = "Please complete the verification";

    if (Object.keys(errs).length > 0) { setErrors(errs); window.scrollTo({ top: 200, behavior: "smooth" }); return; }

    setSubmitting(true);
    const fullName = form.firstName.trim() + " " + form.lastName.trim();
    var allRefs = [];
    var anyDuplicate = false;

    for (var ai = 0; ai < allApps.length; ai++) {
      var app = allApps[ai];
      var ref = app.ref || generateRef();
      allRefs.push(ref);

      const formData = {
        form_type: "Student Application",
        ref,
        applicantType,
        fullName,
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        maidenName: form.maidenName || "",
        email: form.email.trim(),
        phone: form.phone.trim(),
        phone2: form.phone2 || "",
        gender: form.gender,
        dob: fmtDate(form.dob),
        nationality: form.nationality || "",
        maritalStatus: form.maritalStatus || "",
        parish: form.parish || "",
        country: form.country || "",
        address: form.address.trim(),
        district: form.district || "",
        postalZone: form.postalZone || "",
        trn: form.trn || "",
        nis: form.nis || "",
        specialNeeds: form.specialNeeds || "No",
        specialNeedsType: form.specialNeedsType || "",
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
        emergency2Name: form.emergency2Name || "",
        emergency2Relationship: form.emergency2Relationship || "",
        emergency2Phone: form.emergency2Phone || "",
        previousHeart: form.previousHeart || "No",
        level: app.level,
        programme: app.programme,
        paymentPlan: app.paymentPlan || "Gold",
        hearAbout: form.hearAbout || "",
        message: form.message || "",
        timestamp: new Date().toISOString(),
      };

      // Only send files with the first application (shared documents)
      const result = await submitToAppsScript(formData, ai === 0 ? files : {});

      if (result.duplicate) {
        setErrors({ submit: app.programme + " — an application already exists with this TRN/email (Ref: " + (result.existingRef || "—") + "). Contact admin@ctsetsjm.com if unexpected." });
        anyDuplicate = true;
        break;
      }

      // Confirmation email sent by backend (Apps Script)
    }

    if (anyDuplicate) { setSubmitting(false); return; }

    // Register drip once (not per application)
    registerDripSequence({ name: fullName, email: form.email, ref: allRefs[0], programme: allApps[0].programme, level: allApps[0].level });

    // Show prayer
    const g = genderPronouns(form.gender);
    setPrayer(PRAYERS.application(form.firstName.trim(), g));

    // Store all refs for success view
    appRef.current = allRefs.join(", ");

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
                  ["Reference(s)", appRef.current],
                  ["Name", form.firstName + " " + form.lastName],
                  ["Email", form.email],
                  ["Applicant Type", APPLICANT_TYPES.find(t => t.key === applicantType)?.label],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid " + S.border, fontSize: 13, fontFamily: S.body }}>
                    <span style={{ color: S.gray, fontWeight: 500 }}>{k}</span>
                    <span style={{ color: S.navy, fontWeight: 700, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
                {/* List all submitted programmes */}
                <div style={{ marginTop: 12, fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 8 }}>Programmes Applied</div>
                {[...appQueue, ...(form.level && form.programme ? [{ level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold", heartDone: heartFormDone }] : [])].map(function(q, i) {
                  return (
                    <div key={i} style={{ padding: "8px 12px", borderRadius: 6, background: S.lightBg, border: "1px solid " + S.border, marginBottom: 4, fontSize: 13, fontFamily: S.body, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ color: S.navy, fontWeight: 700 }}>{q.programme}</span>
                        <span style={{ color: S.gray }}> · {q.level} · {q.paymentPlan} plan</span>
                      </div>
                      {isJamaican && <span style={{ fontSize: 10, color: q.heartDone ? S.emerald : S.coral, fontWeight: 700 }}>{q.heartDone ? "\u2713 HEART" : "\u2717 HEART"}</span>}
                    </div>
                  );
                })}
              </div>

              <div style={{ background: S.tealLight, borderRadius: 12, padding: "20px 24px", border: "1px solid " + S.teal + "30", textAlign: "left", marginBottom: 28 }}>
                <div style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 700, marginBottom: 10 }}>What Happens Next?</div>
                {[
                  ["1", "Our admissions team reviews your documents (48–72 hours)"],
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
      {/* Full-screen overlay during submission — prevents all interaction */}
      {submitting && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s infinite" }}>{"\uD83D\uDCE8"}</div>
            <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 700, marginBottom: 10 }}>Submitting {appQueue.length + (form.level && form.programme ? 1 : 0)} Application{appQueue.length > 0 ? "s" : ""}</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.6 }}>Please wait — we are processing your application and uploading your documents. Do not close this page.</p>
            <div style={{ marginTop: 20, width: 40, height: 40, border: "4px solid " + S.border, borderTop: "4px solid " + S.coral, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "20px auto 0" }} />
          </div>
        </div>
      )}
      <SectionHeader tag="Start Here" title="Apply in Under 10 Minutes" desc="Complete the form, upload your documents, and we'll review within 48–72 hours." accentColor={S.coral} />
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
              <Field label="Maiden Name" hint="If applicable">
                <input style={inputStyle} value={form.maidenName} onChange={e => set("maidenName", e.target.value)} placeholder="If applicable" />
              </Field>
              <div />
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
              <Field label="Phone Number" required error={errors.phone} hint="10 digits starting with country code, e.g. 8761234567">
                <input type="tel" style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="8763819771" />
              </Field>
              <Field label="Phone 2" hint="Optional alternate number">
                <input type="tel" style={inputStyle} value={form.phone2} onChange={e => set("phone2", e.target.value)} placeholder="Optional" />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
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
              <Field label="Nationality" required error={errors.nationality}>
                <input style={inputStyle} value={form.nationality} onChange={e => set("nationality", e.target.value)} placeholder={isJamaican ? "Jamaican" : "e.g. Trinidadian"} />
              </Field>
              <Field label="Marital Status">
                <select style={selectStyle} value={form.maritalStatus} onChange={e => set("maritalStatus", e.target.value)}>
                  <option value="">Select...</option>
                  {["Single", "Married", "Divorced", "Widowed", "Separated", "Common-Law"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Street Address" required error={errors.address}>
              <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="e.g. 15 King Street" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
              <Field label="District / Town">
                <input style={inputStyle} value={form.district} onChange={e => set("district", e.target.value)} placeholder="e.g. Half Way Tree" />
              </Field>
              <Field label="Postal Zone / Office">
                <input style={inputStyle} value={form.postalZone} onChange={e => set("postalZone", e.target.value)} placeholder="e.g. Kingston 10" />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
              <Field label="Country" required error={errors.country}>
                <select style={selectStyle} value={form.country} onChange={e => set("country", e.target.value)}>
                  <option value="">Select country...</option>
                  {["Jamaica","Trinidad & Tobago","Barbados","Guyana","Bahamas","Belize","St. Lucia","Grenada","Antigua & Barbuda","Dominica","St. Vincent","St. Kitts & Nevis","Suriname","Haiti","Cayman Islands","Bermuda","Turks & Caicos","BVI","USVI","United States","United Kingdom","Canada","Other"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              {isJamaican ? (
                <Field label="Parish" required error={errors.parish}>
                  <select style={selectStyle} value={form.parish} onChange={e => set("parish", e.target.value)}>
                    <option value="">Select parish...</option>
                    {JA_PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              ) : <div />}
            </div>
            {isJamaican && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
                <Field label="TRN (Tax Registration Number)" required error={errors.trn} hint="9 digits — for NCTVET registration">
                  <input style={inputStyle} value={form.trn} onChange={e => set("trn", e.target.value)} placeholder="123456789" maxLength={11} />
                </Field>
                <Field label="NIS Number (National Insurance Scheme)" hint="Optional — if you have one">
                  <input style={inputStyle} value={form.nis} onChange={e => set("nis", e.target.value)} placeholder="NIS number" />
                </Field>
              </div>
            )}

            {/* Special Needs */}
            {isJamaican && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="resp-grid-2">
                <Field label="Do you have any special needs?" hint="Physical, emotional, behavioural, learning disability">
                  <select style={selectStyle} value={form.specialNeeds} onChange={e => set("specialNeeds", e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </Field>
                {form.specialNeeds === "Yes" && (
                  <Field label="If yes, please specify">
                    <select style={selectStyle} value={form.specialNeedsType} onChange={e => set("specialNeedsType", e.target.value)}>
                      <option value="">Select...</option>
                      {["Physical", "Emotional/Behavioural", "Developmental/Learning", "Sensory-Impaired"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                )}
              </div>
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
                <Field label="Year Completed" required={hasQualification} error={errors.yearCompleted}>
                  <input style={inputStyle} value={form.yearCompleted} onChange={e => set("yearCompleted", e.target.value)} placeholder="e.g. 2020" maxLength={4} />
                </Field>
              </div>
              <Field label="Last School / Institution Attended" required={hasQualification} error={errors.schoolLastAttended}>
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
              <div style={{ fontSize: 11, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16 }}>Emergency Contact #1</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }} className="resp-grid-3">
                <Field label="Contact Name" required error={errors.emergencyName}>
                  <input style={inputStyle} value={form.emergencyName} onChange={e => set("emergencyName", e.target.value)} placeholder="e.g. Sandra Campbell" />
                </Field>
                <Field label="Relationship" required error={errors.emergencyRelationship}>
                  <select style={selectStyle} value={form.emergencyRelationship} onChange={e => set("emergencyRelationship", e.target.value)}>
                    <option value="">Select...</option>
                    {["Parent", "Guardian", "Spouse", "Relative", "Friend"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Contact Phone" required error={errors.emergencyPhone}>
                  <input type="tel" style={inputStyle} value={form.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} placeholder="8761234567" />
                </Field>
              </div>
              <div style={{ fontSize: 11, color: S.coral, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 16, marginTop: 16 }}>Emergency Contact #2 <span style={{ opacity: 0.5, fontSize: 9, letterSpacing: 0 }}>(Optional)</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }} className="resp-grid-3">
                <Field label="Contact Name">
                  <input style={inputStyle} value={form.emergency2Name} onChange={e => set("emergency2Name", e.target.value)} placeholder="Optional" />
                </Field>
                <Field label="Relationship">
                  <select style={selectStyle} value={form.emergency2Relationship} onChange={e => set("emergency2Relationship", e.target.value)}>
                    <option value="">Select...</option>
                    {["Parent", "Guardian", "Spouse", "Relative", "Friend"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Contact Phone">
                  <input type="tel" style={inputStyle} value={form.emergency2Phone} onChange={e => set("emergency2Phone", e.target.value)} placeholder="Optional" />
                </Field>
              </div>
            </div>

            {/* Missing fields indicator */}
            {s1Done && !s2Done && (() => {
              var missing = [];
              if (!form.firstName) missing.push("First Name");
              if (!form.lastName) missing.push("Last Name");
              if (!validateEmail(form.email)) missing.push("Valid Email");
              if (!validatePhone(form.phone)) missing.push("Phone (10+ digits with country code)");
              if (!form.gender) missing.push("Gender");
              if (!form.dob) missing.push("Date of Birth");
              if (!form.nationality) missing.push("Nationality");
              if (!form.address) missing.push("Street Address");
              if (!form.country) missing.push("Country");
              if (isJamaican && !form.parish) missing.push("Parish");
              if (isJamaican && !form.trn) missing.push("TRN");
              if (isJamaican && form.trn && !validateTRN(form.trn)) missing.push("Valid TRN (9 digits)");
              if (!form.highestQualification) missing.push("Highest Qualification");
              if (form.highestQualification && form.highestQualification !== "No Formal Qualification") {
                if (!form.schoolLastAttended) missing.push("Last School / Institution");
                if (!form.yearCompleted) missing.push("Year Completed");
              }
              if (!form.employmentStatus) missing.push("Employment Status");
              if (!form.emergencyName) missing.push("Emergency Contact Name");
              if (!form.emergencyPhone) missing.push("Emergency Contact Phone");
              if (!form.emergencyRelationship) missing.push("Emergency Contact Relationship");
              if (missing.length === 0) return null;
              return (
                <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "40", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{"\u26A0\uFE0F"}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.amberDark, fontFamily: S.body, marginBottom: 4 }}>Complete these fields to unlock the next section:</div>
                    <div style={{ fontSize: 12, color: S.amberDark, fontFamily: S.body, lineHeight: 1.8 }}>
                      {missing.map(function(f, i) { return <span key={f} style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: S.amber + "20", marginRight: 6, marginBottom: 4, fontSize: 11, fontWeight: 600 }}>{f}</span>; })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </SectionBlock>
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
              const isGoldOnly = form.level.indexOf("Job") >= 0 || form.level.indexOf("Level 2") >= 0;
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
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>Training Fee</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: S.gold, fontFamily: S.heading }}>{prog.tuition}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body }}>+ {fmt(REG_FEE)} registration (non-refundable)</div>
                      </div>
                    </div>
                    {/* Payment Plan Selector */}
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ fontSize: 11, color: S.gold, letterSpacing: 1, fontFamily: S.body, fontWeight: 600, marginBottom: 10 }}>Payment Plan</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[
                          { value: "Gold", label: "Gold — Pay in Full", desc: "0% surcharge", available: true },
                          { value: "Silver", label: "Silver — 60/40 Split", desc: "+10% on training fee", available: !isGoldOnly },
                          { value: "Bronze", label: "Bronze — 20% + Monthly", desc: "+15% on training fee", available: !isGoldOnly },
                        ].map(function(plan) {
                          var selected = form.paymentPlan === plan.value;
                          return (
                            <button key={plan.value} onClick={function() { if (plan.available) set("paymentPlan", plan.value); }}
                              disabled={!plan.available}
                              style={{ flex: 1, minWidth: 100, padding: "10px 12px", borderRadius: 8, border: "2px solid " + (selected ? S.gold : "rgba(255,255,255,0.15)"), background: selected ? S.gold + "20" : "transparent", cursor: plan.available ? "pointer" : "not-allowed", opacity: plan.available ? 1 : 0.3, textAlign: "center" }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: selected ? S.gold : "#fff", fontFamily: S.body }}>{plan.value}</div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: S.body, marginTop: 2 }}>{plan.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                      {isGoldOnly && <div style={{ fontSize: 10, color: S.amber, fontFamily: S.body, marginTop: 8 }}>Job Certificate and Level 2: Full payment (Gold) only.</div>}

                      {/* Plan breakdown */}
                      {form.paymentPlan && (() => {
                        var tuition = parseInt(prog.tuition.replace(/[$,]/g, ""));
                        var plan = form.paymentPlan;
                        if (plan === "Gold") {
                          return (
                            <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 12, fontFamily: S.body, color: "rgba(255,255,255,0.7)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Registration Fee</span><span style={{ color: S.gold, fontWeight: 700 }}>{fmt(REG_FEE)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Training Fee</span><span style={{ color: S.gold, fontWeight: 700 }}>{fmt(tuition)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 14, fontWeight: 800, color: S.gold }}><span>Total</span><span>{fmt(tuition + REG_FEE)}</span></div>
                            </div>
                          );
                        }
                        if (plan === "Silver") {
                          var silverT = Math.round(tuition * 1.10);
                          var pay1 = REG_FEE + Math.round(silverT * 0.6);
                          var pay2 = silverT - Math.round(silverT * 0.6);
                          return (
                            <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 12, fontFamily: S.body, color: "rgba(255,255,255,0.7)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Training Fee (+10%)</span><span style={{ color: "#ccc", fontWeight: 700 }}>{fmt(silverT)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>At Enrolment (60% + reg)</span><span style={{ color: S.gold, fontWeight: 700 }}>{fmt(pay1)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Mid-Point (40%)</span><span style={{ color: S.gold, fontWeight: 700 }}>{fmt(pay2)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 14, fontWeight: 800, color: S.gold }}><span>Total</span><span>{fmt(REG_FEE + silverT)}</span></div>
                            </div>
                          );
                        }
                        if (plan === "Bronze") {
                          var lv = form.level || "";
                          var months = lv.indexOf("5") >= 0 ? 8 : lv.indexOf("4") >= 0 ? 7 : 6;
                          var bronzeT = Math.round(tuition * 1.15);
                          var deposit = Math.round(bronzeT * 0.20);
                          var remaining = bronzeT - deposit;
                          var monthly = Math.round(remaining / months);
                          var bronzeTotal = REG_FEE + deposit + (monthly * months);
                          return (
                            <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 12, fontFamily: S.body, color: "rgba(255,255,255,0.7)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Training Fee (+15%)</span><span style={{ color: "#ccc", fontWeight: 700 }}>{fmt(bronzeT)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>At Enrolment (20% deposit + reg)</span><span style={{ color: S.gold, fontWeight: 700 }}>{fmt(REG_FEE + deposit)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>{months + " Monthly Payments"}</span><span style={{ color: S.gold, fontWeight: 700 }}>{fmt(monthly) + "/mth"}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 14, fontWeight: 800, color: S.gold }}><span>Total</span><span>{fmt(bronzeTotal)}</span></div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </Reveal>
              );
            })()}

            {/* Missing fields indicator for Section 3 */}
            {s2Done && !s3Done && appQueue.length === 0 && (
              <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "40", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{"\u26A0\uFE0F"}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: S.amberDark, fontFamily: S.body, marginBottom: 4 }}>Complete these fields to continue:</div>
                  <div style={{ fontSize: 12, color: S.amberDark, fontFamily: S.body, lineHeight: 1.8 }}>
                    {!form.level && <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: S.amber + "20", marginRight: 6, fontSize: 11, fontWeight: 600 }}>Qualification Level</span>}
                    {form.level && !form.programme && <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: S.amber + "20", marginRight: 6, fontSize: 11, fontWeight: 600 }}>Programme</span>}
                  </div>
                </div>
              </div>
            )}
          </SectionBlock>
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
            {/* How did you hear about us */}
            <Field label="How did you hear about us?">
              <select style={selectStyle} value={form.hearAbout} onChange={e => set("hearAbout", e.target.value)}>
                <option value="">Select...</option>
                {["Google Search", "Facebook", "Instagram", "TikTok", "LinkedIn", "WhatsApp", "A friend or family member", "Employer", "HEART/NSTA", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            {isJamaican && (
              <Field label="Have you previously enrolled at the HEART/NSTA Trust?">
                <select style={selectStyle} value={form.previousHeart} onChange={e => set("previousHeart", e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Field>
            )}

            {/* Additional message */}
            <Field label="Anything else you'd like us to know?" hint="Optional — special requests, questions, etc.">
              <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.message} onChange={e => set("message", e.target.value)} placeholder="e.g. I have a question about payment plans..." />
            </Field>

            {/* Captcha */}
            <div style={{ marginBottom: 24 }}>
              <CaptchaChallenge onVerified={() => setCaptchaOk(true)} verified={captchaOk} />
              {errors.captcha && <div style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: 6 }}>⚠️ {errors.captcha}</div>}
            </div>

            {/* Application Queue */}
            {appQueue.length > 0 && (() => {
              var allItems = appQueue.map(function(q) {
                var progs = PROGRAMMES[q.level] || [];
                var p = progs.find(function(x) { return x.name === q.programme; });
                var tuition = p ? parseInt(p.tuition.replace(/[$,]/g, "")) : 0;
                var total = tuition + REG_FEE;
                return { ...q, tuition: tuition, total: total };
              });
              if (form.level && form.programme) {
                var curProgs = PROGRAMMES[form.level] || [];
                var curP = curProgs.find(function(x) { return x.name === form.programme; });
                var curTuition = curP ? parseInt(curP.tuition.replace(/[$,]/g, "")) : 0;
                allItems.push({ level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold", ref: "(current)", tuition: curTuition, total: curTuition + REG_FEE, isCurrent: true });
              }
              var grandTotal = allItems.reduce(function(sum, q) { return sum + q.total; }, 0);
              return (
                <div style={{ marginBottom: 20, padding: "20px 24px", borderRadius: 14, background: S.navy, border: "2px solid " + S.teal + "40" }}>
                  <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Your Applications ({allItems.length})</div>

                  {/* Table */}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: S.body, fontSize: 12 }}>
                      <thead>
                        <tr>
                          {["#", "Programme", "Level", "Plan", "Reg Fee", "Training", "Total", ""].map(function(h) {
                            return <th key={h} style={{ padding: "8px 10px", textAlign: h === "Total" || h === "Reg Fee" || h === "Training" ? "right" : "left", color: S.gold, fontSize: 10, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.1)", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {allItems.map(function(q, idx) {
                          return (
                            <tr key={idx} style={{ background: q.isCurrent ? S.gold + "15" : "transparent" }}>
                              <td style={{ padding: "10px", color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{idx + 1}</td>
                              <td style={{ padding: "10px", color: "#fff", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{q.programme} {q.isCurrent ? " ★" : ""}</td>
                              <td style={{ padding: "10px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11 }}>{q.level.replace("Job / Professional Certificates", "JC")}</td>
                              <td style={{ padding: "10px", color: S.gold, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{q.paymentPlan}</td>
                              <td style={{ padding: "10px", color: "rgba(255,255,255,0.5)", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{fmt(REG_FEE)}</td>
                              <td style={{ padding: "10px", color: "rgba(255,255,255,0.7)", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{fmt(q.tuition)}</td>
                              <td style={{ padding: "10px", color: "#fff", fontWeight: 800, textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: S.heading }}>{fmt(q.total)}</td>
                              <td style={{ padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                {!q.isCurrent && <button onClick={function() { removeFromQueue(idx); }} style={{ background: "none", border: "none", color: S.rose, fontSize: 14, cursor: "pointer", padding: "2px 6px" }}>✕</button>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={6} style={{ padding: "12px 10px", color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "right", borderTop: "2px solid " + S.gold + "40" }}>Grand Total</td>
                          <td style={{ padding: "12px 10px", color: S.gold, fontWeight: 800, fontSize: 18, textAlign: "right", borderTop: "2px solid " + S.gold + "40", fontFamily: S.heading }}>{fmt(grandTotal)}</td>
                          <td style={{ borderTop: "2px solid " + S.gold + "40" }}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: S.body, marginTop: 10, textAlign: "center" }}>Each application generates a separate reference number. Documents are shared across all applications. Registration fee ($5,000) is non-refundable per application.</div>
                </div>
              );
            })()}

            {/* Add Another Programme prompt */}
            {s3Done && !showQueuePrompt && (
              <div style={{ marginBottom: 20, padding: "16px 20px", borderRadius: 12, background: S.lightBg, border: "1px solid " + S.border, textAlign: "center" }}>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, marginBottom: 12 }}>Want to apply for another programme using the same personal details and documents?</p>
                <button onClick={function() { addToQueue(); }}
                  style={{ padding: "10px 24px", borderRadius: 8, border: "2px solid " + S.teal, background: "#fff", color: S.teal, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body, marginRight: 10 }}>
                  + Add Another Programme
                </button>
              </div>
            )}

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
              {submitting ? "Submitting " + (appQueue.length + (form.level && form.programme ? 1 : 0)) + " Application" + (appQueue.length > 0 ? "s" : "") + "..." : appQueue.length > 0 ? "Submit All " + (appQueue.length + (form.level && form.programme ? 1 : 0)) + " Applications →" : "Submit Application →"}
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
                <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 2 }}>WhatsApp us at 876-381-9771 or email admin@ctsetsjm.com. We respond within 48–72 hours.</div>
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
