import { useState, useRef, useEffect } from "react";
import S from "../constants/styles";
import { PROGRAMMES } from "../constants/programmes";
import { TESTIMONIALS, PRAYERS, genderPronouns } from "../constants/content";
import { BOOKING_URLS, REG_FEE, APPS_SCRIPT_URL } from "../constants/config"; // <-- Updated Import
import { Container, PageWrapper, Btn, SectionHeader, SectionBlock, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
import { CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
import { validateEmail, validatePhone, validateTRN, suggestEmail, validateFileSize } from "../utils/validation";
import { generateRef } from "../utils/submission";
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
    { slot: "passportPhoto", label: "Passport-Size Photo", required: true, accept: "image/*" },
    { slot: "birthCert", label: "Birth Certificate", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity", required: true, accept: "image/*,.pdf" },
    { slot: "trn", label: "TRN Card", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Qualifications", required: false, accept: "image/*,.pdf" },
    { slot: "heartForm", label: "Signed HEART/NSTA Form", required: true, accept: "image/*,.pdf,.html" },
  ],
  caribbean: [
    { slot: "passportPhoto", label: "Passport-Size Photo", required: true, accept: "image/*" },
    { slot: "birthCertOrPassport", label: "Birth Certificate or Passport", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity", required: true, accept: "image/*,.pdf" },
    { slot: "qualifications", label: "Academic Qualifications", required: false, accept: "image/*,.pdf" },
  ],
  international: [
    { slot: "passportPhoto", label: "Passport-Size Photo", required: true, accept: "image/*" },
    { slot: "passportBio", label: "Passport Bio Page", required: true, accept: "image/*,.pdf" },
    { slot: "transcripts", label: "Secondary School Transcripts", required: true, accept: "image/*,.pdf" },
    { slot: "proofId", label: "Proof of Identity", required: true, accept: "image/*,.pdf" },
  ],
};

function Field({ label, required, children, error, hint }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 6 }}>
        {label} {required && <span style={{ color: S.coral }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 4 }}>{hint}</div>}
      {error && <div style={{ fontSize: 11, color: S.error, fontFamily: S.body, marginTop: 4 }}>⚠️ {error}</div>}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.12)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1A202C", outline: "none", background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s" };
const selectStyle = { ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 };

function FileUpload({ doc, file, onFileChange }) {
  const id = "file-" + doc.slot;
  const hasFile = !!file;
  const oversize = file && !validateFileSize(file);
  return (
    <div style={{ padding: "14px 18px", borderRadius: 10, border: "1.5px dashed " + (oversize ? S.error + "60" : hasFile ? S.emerald + "50" : "rgba(1,30,64,0.12)"), background: hasFile ? (oversize ? S.roseLight : S.emeraldLight) : "#fff", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.navy, fontFamily: S.body }}>
            {doc.label} {doc.required && <span style={{ color: S.coral, fontSize: 11 }}>*</span>}
          </div>
          {hasFile && (
            <div style={{ fontSize: 11, color: oversize ? S.error : S.emeraldDark, fontFamily: S.body, marginTop: 3 }}>
              {oversize ? "File too large (max 5 MB)" : `✓ ${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
            </div>
          )}
        </div>
        <label htmlFor={id} style={{ padding: "8px 16px", borderRadius: 6, background: hasFile ? S.emerald + "15" : S.coral + "10", color: hasFile ? S.emeraldDark : S.coral, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body, border: "1px solid " + (hasFile ? S.emerald + "30" : S.coral + "30") }}>
          {hasFile ? "Change" : "Choose File"}
        </label>
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
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: 520, width: "100%", background: "#fff", borderRadius: 20, padding: "clamp(28px,5vw,48px)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
        <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, fontWeight: 700, marginBottom: 16 }}>{prayer.title}</h2>
        <p style={{ fontFamily: S.body, fontSize: 15, color: "#2D3748", lineHeight: 1.8, marginBottom: 24 }}>{prayer.prayer}</p>
        <div style={{ padding: "16px 24px", borderRadius: 12, background: S.goldLight, border: "1px solid " + S.gold + "30", marginBottom: 24 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: S.navy, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 8px" }}>"{prayer.scripture}"</p>
          <p style={{ fontFamily: S.body, fontSize: 11, color: S.gold, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>— {prayer.ref}</p>
        </div>
        <button onClick={onClose} style={{ padding: "14px 40px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Amen 🙏</button>
      </div>
    </div>
  );
}

function StatusTracker({ setPage }) {
  var [lookupVal, setLookupVal] = useState("");
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState(null);
  var [error, setError] = useState("");

  var statusColors = { "Under Review": { bg: S.goldLight, color: S.gold, icon: "🔍" }, "Documents Needed": { bg: S.coralLight, color: S.coral, icon: "📎" }, "Accepted": { bg: S.emeraldLight, color: S.emerald, icon: "🎉" }, "Enrolled": { bg: S.skyLight, color: S.sky, icon: "🎓" }, "Deferred": { bg: "#F3E5F5", color: S.violet, icon: "⏸️" }, "Withdrawn": { bg: S.lightBg, color: S.gray, icon: "📋" }, "Completed": { bg: S.goldLight, color: S.navy, icon: "🏆" }, "Rejected": { bg: S.roseLight, color: S.error, icon: "📨" }, "Pending Payment": { bg: S.skyLight, color: S.sky, icon: "💳" } };

  var lookup = async function() {
    if (!lookupVal.trim()) { setError("Please enter your Application Number or Student ID."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=lookupstudent&ref=${encodeURIComponent(lookupVal.trim().toUpperCase())}`);
      const data = await res.json();
      if (data.found) { setResult(data); }
      else { setError("No application found. Please check your details and try again."); }
    } catch(e) { setError("Unable to connect. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid " + S.border, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, marginBottom: 8 }}>Track My Application</h2>
        </div>
        <div style={{ marginBottom: 16 }}>
          <input value={lookupVal} onChange={e => { setLookupVal(e.target.value.toUpperCase()); setError(""); }} onKeyDown={e => { if (e.key === "Enter") lookup(); }} placeholder="e.g. CTSETSA-2026-04-12345" style={inputStyle} />
        </div>
        {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: S.roseLight, fontSize: 13, color: S.error, fontFamily: S.body, marginBottom: 16 }}>{error}</div>}
        <button onClick={lookup} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 10, background: loading ? S.gray : S.navy, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>
          {loading ? "Searching..." : "Check Status →"}
        </button>

        {result && (
          <div style={{ marginTop: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 30, background: (statusColors[result.status] || statusColors["Under Review"]).bg, border: "2px solid " + (statusColors[result.status] || statusColors["Under Review"]).color + "40" }}>
                <span style={{ fontSize: 20 }}>{(statusColors[result.status] || statusColors["Under Review"]).icon}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: (statusColors[result.status] || statusColors["Under Review"]).color, fontFamily: S.heading }}>{result.status || "Under Review"}</span>
              </div>
            </div>
            <div style={{ background: S.lightBg, borderRadius: 12, padding: "20px", border: "1px solid " + S.border }}>
              <div style={{ display: "grid", gap: 12 }}>
                {result.name && <div><div style={{ fontSize: 10, color: S.gray }}>Name</div><div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>{result.name}</div></div>}
                {result.ref && <div><div style={{ fontSize: 10, color: S.gray }}>Application Reference</div><div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>{result.ref}</div></div>}
                {result.studentNumber && <div><div style={{ fontSize: 10, color: S.gray }}>Student ID</div><div style={{ fontSize: 16, fontWeight: 800, color: S.coral }}>{result.studentNumber}</div></div>}
                {result.programme && <div><div style={{ fontSize: 10, color: S.gray }}>Programme</div><div style={{ fontSize: 13, fontWeight: 600, color: S.navy }}>{(result.level ? result.level + " — " : "") + result.programme}</div></div>}
              </div>
            </div>
            {result.status === "Accepted" && (
              <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: S.emeraldLight, border: "1px solid " + S.emerald + "30", fontSize: 13, color: S.navy }}>
                <strong>Next step:</strong> Complete your payment. <button onClick={() => setPage("Pay")} style={{ background: "none", border: "none", color: S.coral, fontWeight: 700, cursor: "pointer", padding: 0 }}>Go to Payment Centre →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplyPage({ setPage }) {
  const [applicantType, setApplicantType] = useState("");
  const [form, setForm] = useState({ firstName: "", middleName: "", lastName: "", maidenName: "", email: "", phone: "", phone2: "", gender: "", dob: "", nationality: "", maritalStatus: "", parish: "", country: "Jamaica", address: "", district: "", postalZone: "", trn: "", nis: "", highestQualification: "", schoolLastAttended: "", yearCompleted: "", employmentStatus: "", employer: "", jobTitle: "", yearsExperience: "", industry: "", emergencyName: "", emergencyRelationship: "", emergencyPhone: "", emergency2Name: "", emergency2Relationship: "", emergency2Phone: "", specialNeeds: "No", specialNeedsType: "", previousHeart: "", level: "", programme: "", paymentPlan: "", hearAbout: "", message: "" });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prayer, setPrayer] = useState(null);
  const [heartFormDone, setHeartFormDone] = useState(false);
  const [appQueue, setAppQueue] = useState([]);
  const [showQueuePrompt, setShowQueuePrompt] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const appRef = useRef(generateRef());
  const startTime = useRef(Date.now());

  const isJamaican = applicantType === "jamaican";
  const availableProgrammes = form.level ? (PROGRAMMES[form.level] || []) : [];
  const s1Done = !!applicantType;
  const hasQualification = form.highestQualification && form.highestQualification !== "No Formal Qualification";
  const s2Done = s1Done && form.firstName && form.lastName && validateEmail(form.email) && validatePhone(form.phone) && form.gender && form.dob && form.nationality && form.address && form.country && (isJamaican ? (form.parish && form.trn && validateTRN(form.trn)) : true) && form.employmentStatus && form.emergencyName && form.emergencyPhone && form.emergencyRelationship && form.highestQualification && (!hasQualification || (form.schoolLastAttended && form.yearCompleted));
  const s3Done = s2Done && ((form.level && form.programme) || appQueue.length > 0);
  const sHeartDone = isJamaican ? heartFormDone : true;
  const sDocGate = s3Done && sHeartDone;
  const qualsRequired = form.highestQualification && form.highestQualification !== "No Formal Qualification";
  const currentDocs = applicantType ? DOC_REQUIREMENTS[applicantType].map(d => d.slot === "qualifications" ? { ...d, required: qualsRequired } : d) : [];
  const requiredDocs = currentDocs.filter(d => d.required);
  const s4Done = sDocGate && requiredDocs.every(d => files[d.slot] && validateFileSize(files[d.slot]));
  const s5Done = s4Done && captchaOk;
  const secN = isJamaican ? { type: "1", personal: "2", programme: "3", heart: "4", docs: "5", review: "6" } : { type: "1", personal: "2", programme: "3", docs: "4", review: "5" };

  const set = (key, val) => { setForm(prev => ({ ...prev, [key]: val })); if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; }); };
  const onEmailBlur = () => setEmailSuggestion(suggestEmail(form.email));
  const onFileChange = (slot, file) => { if (file) setFiles(prev => ({ ...prev, [slot]: file })); };

  useEffect(() => { set("programme", ""); var isGO = form.level && (form.level.indexOf("Job") >= 0 || form.level.indexOf("Level 2") >= 0); set("paymentPlan", isGO ? "Gold" : "Gold"); }, [form.level]);

  const addToQueue = () => {
    if (!form.level || !form.programme) return;
    if (appQueue.some(q => q.programme === form.programme && q.level === form.level)) { setErrors({ submit: form.programme + " is already in your queue." }); return; }
    setAppQueue([...appQueue, { level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold", ref: generateRef(), heartDone: heartFormDone, heartFile: files.heartForm || null }]);
    set("level", ""); set("programme", ""); set("paymentPlan", ""); setHeartFormDone(false); setFiles(prev => { var n = { ...prev }; delete n.heartForm; return n; }); setShowQueuePrompt(false);
  };
  const removeFromQueue = (idx) => setAppQueue(appQueue.filter((_, i) => i !== idx));

  const toBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = error => reject(error); reader.readAsDataURL(file); });

  const handleSubmit = async () => {
    if (hp || Date.now() - startTime.current < 5000) return;
    var allApps = [...appQueue];
    if (form.level && form.programme) allApps.push({ level: form.level, programme: form.programme, paymentPlan: form.paymentPlan || "Gold", ref: appRef.current });
    if (allApps.length === 0) { setErrors({ submit: "Please select at least one programme." }); return; }

    const errs = {};
    if (!form.firstName) errs.firstName = "First name is required";
    if (!form.lastName) errs.lastName = "Last name is required";
    if (!validateEmail(form.email)) errs.email = "Valid email is required";
    if (!captchaOk) errs.captcha = "Please complete the verification";
    if (Object.keys(errs).length > 0) { setErrors(errs); window.scrollTo({ top: 200, behavior: "smooth" }); return; }

    setSubmitting(true);
    const fullName = form.firstName.trim() + " " + form.lastName.trim();
    var allRefs = [];
    var anyDuplicate = false;

    const fileDataArray = [];
    for (const slot in files) {
      if (files[slot]) {
        try { const b64 = await toBase64(files[slot]); fileDataArray.push({ slot: slot, name: files[slot].name, type: files[slot].type, data: b64 }); } catch (e) { console.error("File conversion error:", e); }
      }
    }

    for (var ai = 0; ai < allApps.length; ai++) {
      var app = allApps[ai];
      var ref = app.ref || generateRef();
      allRefs.push(ref);
      const payload = {
        action: "submitapplication", form_type: "Student Application", ref: ref, applicantType: applicantType, fullName: fullName, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone.trim(), gender: form.gender, dob: fmtDate(form.dob), nationality: form.nationality || "", parish: form.parish || "", country: form.country || "", address: form.address.trim(), trn: form.trn || "", highestQualification: form.highestQualification || "", employmentStatus: form.employmentStatus || "", emergencyName: form.emergencyName || "", emergencyRelationship: form.emergencyRelationship || "", emergencyPhone: form.emergencyPhone || "", level: app.level, programme: app.programme, paymentPlan: app.paymentPlan || "Gold", timestamp: new Date().toISOString(), files: ai === 0 ? fileDataArray : []
      };

      try {
        const response = await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json();
        if (result.duplicate) { setErrors({ submit: app.programme + " — an application already exists with this TRN/email." }); anyDuplicate = true; break; }
      } catch (err) { setErrors({ submit: "Network error submitting application. Please try again." }); setSubmitting(false); return; }
    }

    if (anyDuplicate) { setSubmitting(false); return; }
    registerDripSequence({ name: fullName, email: form.email, ref: allRefs[0], programme: allApps[0].programme, level: allApps[0].level });
    setPrayer(PRAYERS.application(form.firstName.trim(), genderPronouns(form.gender)));
    appRef.current = allRefs.join(", ");
    setSubmitting(false); setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <PageWrapper bg={S.lightBg}>
        <PrayerModal prayer={prayer} onClose={() => setPrayer(null)} />
        <Container style={{ paddingTop: 48 }}>
          <Reveal>
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: S.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px", border: "3px solid " + S.emerald }}>✓</div>
              <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, fontWeight: 700, marginBottom: 12 }}>Application Submitted!</h2>
              <p style={{ fontSize: 15, color: S.gray, marginBottom: 28 }}>Thank you, {form.firstName}. Your application is now under review.</p>
              <Btn primary onClick={() => setPage("Pay")} style={{ background: S.emerald, color: "#fff" }}>Make a Payment</Btn>
            </div>
          </Reveal>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper bg={S.lightBg}>
      {submitting && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(1,30,64,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", maxWidth: 400 }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy }}>Submitting Application...</h3>
          </div>
        </div>
      )}
      <SectionHeader tag="Start Here" title={showTracker ? "Track My Application" : "Apply in Under 10 Minutes"} />
      <Container>
        <div style={{ display: "flex", marginBottom: 24, borderRadius: 10, overflow: "hidden", border: "2px solid " + S.navy }}>
          <button onClick={() => setShowTracker(false)} style={{ flex: 1, padding: "14px", background: !showTracker ? S.navy : "#fff", color: !showTracker ? "#fff" : S.navy, border: "none", fontWeight: 700, cursor: "pointer" }}>📝 Apply Now</button>
          <button onClick={() => setShowTracker(true)} style={{ flex: 1, padding: "14px", background: showTracker ? S.navy : "#fff", color: showTracker ? "#fff" : S.navy, border: "none", fontWeight: 700, cursor: "pointer", borderLeft: "2px solid " + S.navy }}>🔍 Track My Application</button>
        </div>

        {showTracker ? <StatusTracker setPage={setPage} /> : (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />
            
            <SectionBlock num={secN.type} title="Where Are You Applying From?" complete={s1Done}>
              <div style={{ display: "flex", gap: 12 }}>
                {APPLICANT_TYPES.map(t => (
                  <button key={t.key} onClick={() => { setApplicantType(t.key); setFiles({}); }} style={{ flex: 1, padding: "20px 16px", borderRadius: 12, border: applicantType === t.key ? "2.5px solid " + S.coral : "1.5px solid rgba(1,30,64,0.08)", background: applicantType === t.key ? S.coralLight : "#fff", cursor: "pointer" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>{t.label}</div>
                  </button>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock num={secN.personal} title="Personal Information" locked={!s1Done} complete={s2Done}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <Field label="First Name" required error={errors.firstName}><input style={inputStyle} value={form.firstName} onChange={e => set("firstName", e.target.value)} /></Field>
                <Field label="Last Name" required error={errors.lastName}><input style={inputStyle} value={form.lastName} onChange={e => set("lastName", e.target.value)} /></Field>
                <Field label="Email Address" required error={errors.email}><input type="email" style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} onBlur={onEmailBlur} /></Field>
                <Field label="Phone Number" required error={errors.phone}><input type="tel" style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
                <Field label="Gender" required error={errors.gender}><select style={selectStyle} value={form.gender} onChange={e => set("gender", e.target.value)}><option value="">Select...</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</select></Field>
                <Field label="Date of Birth" required error={errors.dob}><input type="date" style={inputStyle} value={form.dob} onChange={e => set("dob", e.target.value)} /></Field>
                <Field label="Nationality" required error={errors.nationality}><input style={inputStyle} value={form.nationality} onChange={e => set("nationality", e.target.value)} /></Field>
                <Field label="Country" required error={errors.country}><select style={selectStyle} value={form.country} onChange={e => set("country", e.target.value)}><option value="">Select...</option><option value="Jamaica">Jamaica</option><option value="Other">Other</option></select></Field>
                <Field label="Address" required error={errors.address}><input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} /></Field>
                <Field label="Highest Qualification" required error={errors.highestQualification}><select style={selectStyle} value={form.highestQualification} onChange={e => set("highestQualification", e.target.value)}><option value="">Select...</option><option value="No Formal Qualification">No Formal Qualification</option><option value="CXC">CXC</option></select></Field>
                <Field label="Employment Status" required error={errors.employmentStatus}><select style={selectStyle} value={form.employmentStatus} onChange={e => set("employmentStatus", e.target.value)}><option value="">Select...</option><option value="Employed">Employed</option><option value="Unemployed">Unemployed</option></select></Field>
                <Field label="Emergency Contact Name" required error={errors.emergencyName}><input style={inputStyle} value={form.emergencyName} onChange={e => set("emergencyName", e.target.value)} /></Field>
                <Field label="Emergency Contact Phone" required error={errors.emergencyPhone}><input style={inputStyle} value={form.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} /></Field>
                <Field label="Emergency Contact Relationship" required error={errors.emergencyRelationship}><input style={inputStyle} value={form.emergencyRelationship} onChange={e => set("emergencyRelationship", e.target.value)} /></Field>
              </div>
            </SectionBlock>

            <SectionBlock num={secN.programme} title="Programme Selection" locked={!s2Done} complete={s3Done}>
              <Field label="Qualification Level" required error={errors.level}>
                <select style={selectStyle} value={form.level} onChange={e => set("level", e.target.value)}><option value="">Select level...</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select>
              </Field>
              {form.level && (
                <Field label="Programme" required error={errors.programme}>
                  <select style={selectStyle} value={form.programme} onChange={e => set("programme", e.target.value)}><option value="">Select...</option>{availableProgrammes.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}</select>
                </Field>
              )}
            </SectionBlock>

            {isJamaican && (
              <SectionBlock num={secN.heart} title="HEART/NSTA Form" locked={!s3Done} complete={heartFormDone}>
                <HeartFormBuilder formData={form} onComplete={(sig, heartFile) => { if (sig) { setHeartFormDone(true); if (heartFile) setFiles(prev => ({...prev, heartForm: heartFile})); } }} />
              </SectionBlock>
            )}

            <SectionBlock num={secN.docs} title="Upload Documents" locked={!sDocGate} complete={s4Done}>
              {applicantType && currentDocs.map(doc => <FileUpload key={doc.slot} doc={doc} file={files[doc.slot]} onFileChange={onFileChange} />)}
            </SectionBlock>

            <SectionBlock num={secN.review} title="Review & Submit" locked={!s4Done} complete={false}>
              <CaptchaChallenge onVerified={() => setCaptchaOk(true)} verified={captchaOk} />
              <button onClick={handleSubmit} disabled={submitting || !s5Done} style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: s5Done ? S.coral : "rgba(1,30,64,0.08)", color: s5Done ? "#fff" : S.grayLight, fontSize: 16, fontWeight: 800, cursor: s5Done ? "pointer" : "not-allowed", marginTop: 20 }}>
                {submitting ? "Submitting..." : "Submit Application →"}
              </button>
            </SectionBlock>
          </div>
        )}
      </Container>
    </PageWrapper>
  );
}