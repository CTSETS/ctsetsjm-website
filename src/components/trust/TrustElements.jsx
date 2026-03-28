// ─── HEART FORM HELPER ──────────────────────────────────────────────
// Pre-fills the HEART/NSTA form fields from the application data
// Shows step-by-step mobile-friendly instructions
import S from "../../constants/styles";
import { Reveal } from "../shared/CoreComponents";

export function HeartFormHelper({ formData }) {
  const steps = [
    { num: "1", text: "Download the HEART form using the button below", icon: "📥" },
    { num: "2", text: "Open it on your phone or computer", icon: "📱" },
    { num: "3", text: "Fill in the sections shown below (we've pre-filled what we can)", icon: "✏️" },
    { num: "4", text: "Sign the declaration at the bottom", icon: "✍️" },
    { num: "5", text: "Save as PDF or take a clear photo", icon: "📷" },
    { num: "6", text: "Upload it in the Documents section of your application", icon: "📤" },
  ];

  // Pre-filled values from application form data
  const preFilled = formData ? [
    ["Full Name", `${formData.firstName || ""} ${formData.middleName || ""} ${formData.lastName || ""}`.trim()],
    ["Date of Birth", formData.dob || ""],
    ["Gender", formData.gender || ""],
    ["TRN", formData.trn || ""],
    ["Address", formData.address || ""],
    ["Parish", formData.parish || ""],
    ["Phone", formData.phone || ""],
    ["Email", formData.email || ""],
    ["Programme", formData.programme || ""],
    ["Emergency Contact", formData.emergencyName || ""],
    ["Emergency Phone", formData.emergencyPhone || ""],
  ].filter(([, v]) => v) : [];

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid " + S.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>📋</span>
        <div>
          <h4 style={{ fontFamily: S.heading, fontSize: 17, color: S.navy, fontWeight: 700, margin: 0 }}>HEART/NSTA Application Form Guide</h4>
          <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, margin: "2px 0 0" }}>Step-by-step instructions for completing the official form</p>
        </div>
      </div>
      {/* Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }} className="resp-grid-3">
        {steps.map((s) => (
          <div key={s.num} style={{ padding: "14px 12px", borderRadius: 10, background: S.lightBg, border: "1px solid " + S.border, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: S.navy, fontFamily: S.body, fontWeight: 600, lineHeight: 1.4 }}>{s.text}</div>
          </div>
        ))}
      </div>
      {/* Pre-filled values */}
      {preFilled.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 10 }}>Your Details (Copy These Into the Form)</div>
          <div style={{ background: S.tealLight, borderRadius: 10, padding: "14px 16px", border: "1px solid " + S.teal + "20" }}>
            {preFilled.map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid " + S.teal + "10", fontSize: 13, fontFamily: S.body }}>
                <span style={{ color: S.gray, fontWeight: 600 }}>{label}</span>
                <span style={{ color: S.navy, fontWeight: 700 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <a href="/HEART_Application_for_Admission_Form.pdf" download style={{
        display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 10,
        background: S.navy, color: S.gold, fontSize: 14, fontWeight: 700, fontFamily: S.body,
        textDecoration: "none", boxShadow: "0 4px 16px rgba(1,30,64,0.2)",
      }}>📥 Download HEART Form (PDF)</a>
    </div>
  );
}

// ─── TRUST ELEMENTS ─────────────────────────────────────────────────
// Google Maps embed + Registration proof for credibility

export function TrustSection() {
  return (
    <Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 32 }} className="resp-grid-2">
        {/* Google Maps */}
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid " + S.border, height: 300 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.2!2d-76.78!3d18.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s6+Newark+Avenue+Kingston+11+Jamaica!5e0!3m2!1sen!2sjm!4v1"
            width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="CTS ETS Location"
          />
        </div>
        {/* Registration Proof */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid " + S.border }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🏛️</div>
          <h4 style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 700, marginBottom: 12 }}>Officially Registered</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "14px 16px", borderRadius: 10, background: S.emeraldLight, border: "1px solid " + S.emerald + "30" }}>
              <div style={{ fontSize: 11, color: S.emerald, fontFamily: S.body, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Companies of Jamaica</div>
              <div style={{ fontFamily: S.body, fontSize: 14, color: S.navy, fontWeight: 700 }}>Reg. No. 16007/2025</div>
              <a href="https://www.orcjamaica.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: S.emerald, fontFamily: S.body, textDecoration: "underline" }}>Verify at orcjamaica.com →</a>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30" }}>
              <div style={{ fontSize: 11, color: S.amber, fontFamily: S.body, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Ministry of Education</div>
              <div style={{ fontFamily: S.body, fontSize: 13, color: S.navy }}>Independent Schools registration in progress</div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 10, background: S.violetLight, border: "1px solid " + S.violet + "30" }}>
              <div style={{ fontSize: 11, color: S.violet, fontFamily: S.body, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Qualification Alignment</div>
              <div style={{ fontFamily: S.body, fontSize: 13, color: S.navy }}>NCTVET (NVQ-J) and City & Guilds</div>
            </div>
          </div>
          <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginTop: 14, lineHeight: 1.6 }}>📍 6 Newark Avenue, Kingston 11, Jamaica W.I.</p>
        </div>
      </div>
    </Reveal>
  );
}
