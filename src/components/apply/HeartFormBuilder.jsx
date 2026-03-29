// ─── HEART/NSTA APPLICATION FORM BUILDER ────────────────────────────
// Auto-fills the HEART form from application data
// Signature pad for digital signature
// Print-to-PDF download (no external libraries needed)
import { useState, useRef, useEffect } from "react";
import S from "../../constants/styles";

// ── Signature Pad ──
function SignaturePad({ onSign, signatureData }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = S.navy;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setHasDrawn(true);
  };

  const endDraw = () => {
    setDrawing(false);
    if (hasDrawn && canvasRef.current) {
      onSign(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSign(null);
  };

  // Restore signature if data exists
  useEffect(() => {
    if (signatureData && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        canvasRef.current.getContext("2d").drawImage(img, 0, 0);
        setHasDrawn(true);
      };
      img.src = signatureData;
    }
  }, []);

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>
        Applicant Signature <span style={{ color: S.coral }}>*</span>
      </div>
      <div style={{ position: "relative", borderRadius: 10, border: "1.5px dashed " + (hasDrawn ? S.emerald + "60" : "rgba(1,30,64,0.15)"), background: hasDrawn ? S.emeraldLight + "40" : "#fff", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={180}
          style={{ display: "block", width: "100%", maxWidth: 500, height: 180, cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", gap: 6 }}>
            <span style={{ fontSize: 24 }}>{"\u270D\uFE0F"}</span>
            <span style={{ fontSize: 13, color: S.grayLight, fontFamily: S.body }}>Draw your signature here</span>
            <span style={{ fontSize: 11, color: S.grayLight, fontFamily: S.body }}>Use your finger on mobile or mouse on desktop — take your time</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: hasDrawn ? S.emerald : S.gray, fontFamily: S.body }}>
          {hasDrawn ? "✓ Signature captured" : "Use your finger or mouse to sign"}
        </span>
        {hasDrawn && (
          <button onClick={clear} style={{ background: "none", border: "none", color: S.coral, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Clear & Redo</button>
        )}
      </div>
    </div>
  );
}

// ── HEART Form Preview ──
function HeartFormPreview({ data, signature }) {
  const today = new Date().toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" });
  const row = (label, value) => (
    <div style={{ display: "flex", borderBottom: "1px solid #ddd", fontSize: 12 }}>
      <div style={{ width: "38%", padding: "6px 8px", background: "#f5f5f5", fontWeight: 600, color: "#333" }}>{label}</div>
      <div style={{ flex: 1, padding: "6px 8px", color: "#111", minHeight: 24 }}>{value || "—"}</div>
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", fontFamily: "'DM Sans', Arial, sans-serif", fontSize: 12 }}>
      {/* Header */}
      <div style={{ background: "#011E40", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#D4A017", fontSize: 14, fontWeight: 700 }}>HEART/NSTA TRUST</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: 1 }}>APPLICATION FOR TRAINING</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 10 }}>Via: CTS Empowerment & Training Solutions</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>Reg. No. 16007/2025</div>
        </div>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Section A: Personal */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginTop: 4 }}>Section A — Personal Information</div>
        {row("Surname", data.lastName)}
        {row("First Name(s)", [data.firstName, data.middleName].filter(Boolean).join(" "))}
        {row("Date of Birth", data.dob ? new Date(data.dob + "T00:00:00").toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" }) : "")}
        {row("Gender", data.gender)}
        {row("Nationality", data.nationality)}
        {row("Marital Status", data.maritalStatus)}
        {row("TRN", data.trn)}
        {data.nis && row("NIS Number", data.nis)}
        {row("Address", data.address)}
        {row("Parish", data.parish)}
        {row("Telephone", data.phone)}
        {row("Email", data.email)}

        {/* Education */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginTop: 14 }}>Section B — Education Background</div>
        {row("Highest Qualification", data.highestQualification)}
        {row("School / Institution", data.schoolLastAttended)}
        {row("Year Completed", data.yearCompleted)}

        {/* Employment */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginTop: 14 }}>Section C — Employment Information</div>
        {row("Employment Status", data.employmentStatus)}
        {data.employer && row("Employer / Business", data.employer)}
        {data.jobTitle && row("Job Title / Position", data.jobTitle)}

        {/* Emergency Contact */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginTop: 14 }}>Section D — Emergency Contact</div>
        {row("Contact Name", data.emergencyName)}
        {row("Relationship", data.emergencyRelationship)}
        {row("Contact Phone", data.emergencyPhone)}

        {/* Section E: Programme */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginTop: 14 }}>Section E — Programme Details</div>
        {row("Qualification Level", data.level)}
        {row("Programme", data.programme)}
        {row("Training Provider", "CTS Empowerment & Training Solutions")}
        {row("Mode of Delivery", "Online (100%)")}

        {/* Section F: Declaration */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginTop: 14 }}>Section F — Declaration</div>
        <div style={{ padding: "10px 8px", fontSize: 11, color: "#333", lineHeight: 1.7, background: "#fafaf7", border: "1px solid #eee", borderRadius: 4 }}>
          I, <strong>{data.firstName} {data.lastName}</strong>, declare that the information provided in this application is true and correct to the best of my knowledge. I understand that any false information may result in the cancellation of my application or enrolment. I agree to abide by the rules and regulations of the training institution and the HEART/NSTA Trust.
        </div>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 12, borderTop: "1px solid #ddd" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>Applicant Signature:</div>
            {signature ? (
              <img src={signature} alt="Signature" style={{ height: 48, objectFit: "contain" }} />
            ) : (
              <div style={{ borderBottom: "1px solid #333", width: 200, height: 40 }} />
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>Date:</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{today}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, paddingTop: 10, borderTop: "1px solid #eee", fontSize: 9, color: "#999", textAlign: "center", lineHeight: 1.6 }}>
          This form was auto-generated from the CTS ETS online application system (ctsetsjm.com).<br />
          For official HEART/NSTA registration, this form will be submitted alongside your enrolment documents.
        </div>
      </div>
    </div>
  );
}

// ── Generate HEART form as direct PDF download ──
function generateHeartPDF(data, signature) {
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups to download your HEART form."); return; }
  const today = new Date().toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" });
  const dobFormatted = data.dob ? new Date(data.dob + "T00:00:00").toLocaleDateString("en-JM", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  const sigImg = signature ? `<img src="${signature}" style="height:52px;object-fit:contain;" />` : '<div style="border-bottom:1px solid #333;width:200px;height:40px;"></div>';
  const ck = (val) => val ? "☑" : "☐";

  w.document.write(`<!DOCTYPE html><html><head><title>HEART Application — ${data.firstName} ${data.lastName}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#111;max-width:720px;margin:0 auto;padding:24px 20px}
.generating{position:fixed;inset:0;background:rgba(1,30,64,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;color:#fff;font-size:18px}
.generating .spin{border:3px solid rgba(255,255,255,0.2);border-top:3px solid #D4A017;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin-bottom:16px}
@keyframes spin{to{transform:rotate(360deg)}}
.header{background:#0066B2;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border-radius:4px 4px 0 0}
.header h1{color:#fff;font-size:16px;margin:0;font-weight:700}
.header .sub{color:rgba(255,255,255,.85);font-size:10px;margin-top:2px}
.header .right{text-align:right;color:rgba(255,255,255,.7);font-size:9px}
.section-bar{background:#0066B2;color:#fff;padding:6px 12px;font-size:11px;font-weight:700;letter-spacing:1px;margin:12px 0 0}
table{width:100%;border-collapse:collapse;font-size:11px}
td,th{border:1px solid #ccc;padding:5px 8px;text-align:left;vertical-align:top}
td.label{background:#f0f4f8;font-weight:600;color:#333;width:35%}
.declaration{padding:8px 10px;font-size:10px;color:#333;line-height:1.6;background:#fafaf7;border:1px solid #eee;margin:8px 0}
.sig-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;padding-top:10px;border-top:1px solid #ddd}
.footer{margin-top:12px;padding-top:8px;border-top:1px solid #eee;font-size:8px;color:#999;text-align:center;line-height:1.5}
.check{font-size:13px}
</style></head><body>
<div class="generating" id="loadingOverlay"><div class="spin"></div>Generating your PDF...</div>

<div id="formContent">
<div class="header">
  <div>
    <h1>HEART/NSTA TRUST</h1>
    <div class="sub">APPLICATION FOR ADMISSION FORM</div>
    <div style="color:rgba(255,255,255,.6);font-size:9px;margin-top:4px">ADDRESS: Corporate Office: 6B Oxford Road, Kingston 5</div>
  </div>
  <div class="right">Via: CTS Empowerment & Training Solutions<br>Reg. No. 16007/2025<br>${today}</div>
</div>

<div class="section-bar">SECTION A — PERSONAL INFORMATION</div>
<table>
<tr><td class="label">Last Name *</td><td>${(data.lastName || "—").toUpperCase()}</td><td class="label">First Name *</td><td>${(data.firstName || "—").toUpperCase()}</td></tr>
<tr><td class="label">Middle Name</td><td>${(data.middleName || "N/A").toUpperCase()}</td><td class="label">Maiden Name</td><td>N/A</td></tr>
<tr><td class="label">Gender *</td><td>${ck(data.gender==="Female")} FEMALE ${ck(data.gender==="Male")} MALE</td><td class="label">Date of Birth *</td><td>${dobFormatted}</td></tr>
<tr><td class="label">Nationality</td><td>${data.nationality || "Jamaican"}</td><td class="label">TRN *</td><td>${data.trn || "—"}</td></tr>
<tr><td class="label">NIS #</td><td>${data.nis || "N/A"}</td><td class="label">Email Address *</td><td>${data.email || "—"}</td></tr>
<tr><td class="label">Telephone 1 *</td><td>${data.phone || "—"}</td><td class="label">Telephone 2</td><td>N/A</td></tr>
<tr><td class="label">Marital Status</td><td colspan="3">${ck(data.maritalStatus==="Single")} SINGLE ${ck(data.maritalStatus==="Married")} MARRIED ${ck(data.maritalStatus==="Widowed")} WIDOWED ${ck(data.maritalStatus==="Divorced")} DIVORCED ${ck(data.maritalStatus==="Common Law")} COMMON LAW</td></tr>
</table>

<table style="margin-top:2px">
<tr><td class="label" style="width:20%">Permanent Address</td><td colspan="3">${data.address || "—"}</td></tr>
<tr><td class="label">Country *</td><td>${data.country || "Jamaica"}</td><td class="label">Parish *</td><td>${data.parish || "—"}</td></tr>
</table>

<table style="margin-top:2px">
<tr><td class="label" colspan="4" style="background:#e8eef4;font-weight:700">EMERGENCY CONTACT</td></tr>
<tr><td class="label">Contact Name *</td><td>${data.emergencyName || "—"}</td><td class="label">Relationship *</td><td>${data.emergencyRelationship || "—"}</td></tr>
<tr><td class="label">Telephone *</td><td colspan="3">${data.emergencyPhone || "—"}</td></tr>
</table>

<div class="section-bar">SECTION B — PROGRAMME INFORMATION</div>
<table>
<tr><td class="label">Programme Offering of Choice *</td><td colspan="3">${data.programme || "—"}</td></tr>
<tr><td class="label">Name of Training Provider *</td><td colspan="3">CTS Empowerment & Training Solutions</td></tr>
<tr><td class="label">Programme Level *</td><td colspan="3">${data.level || "—"}</td></tr>
<tr><td class="label">Mode of Delivery</td><td colspan="3">Online (100%)</td></tr>
<tr><td class="label">Previously enrolled at HEART?</td><td>☐ YES ☐ NO</td><td class="label">How did you hear about us?</td><td>${data.hearAbout || "Website"}</td></tr>
</table>

<div class="section-bar">SECTION C — EDUCATION AND EMPLOYMENT</div>
<table>
<tr><td class="label">Current/Last School Attended</td><td colspan="3">${data.schoolLastAttended || "—"}</td></tr>
<tr><td class="label">Highest Qualification</td><td>${data.highestQualification || "—"}</td><td class="label">Year Completed</td><td>${data.yearCompleted || "—"}</td></tr>
<tr><td class="label">Currently Employed? *</td><td>${ck(data.employmentStatus==="Employed"||data.employmentStatus==="Full-Time"||data.employmentStatus==="Part-Time")} YES ${ck(data.employmentStatus==="Unemployed"||data.employmentStatus==="Not Employed")} NO</td>
<td class="label">Self-Employed? *</td><td>${ck(data.employmentStatus==="Self-Employed")} YES ${ck(data.employmentStatus!=="Self-Employed")} NO</td></tr>
${data.employer ? '<tr><td class="label">Employer / Business</td><td>' + data.employer + '</td><td class="label">Job Title</td><td>' + (data.jobTitle||"—") + '</td></tr>' : ''}
</table>

<div class="section-bar">SECTION D — SUPPORTING DOCUMENTS</div>
<table>
<tr><td colspan="4" style="font-size:10px;color:#555;padding:8px">
☐ Recent Resume (if applicable)<br>
☐ Copies of qualifications/academic achievements<br>
☐ Proof of age (Passport, National ID, Birth Certificate, or Driver's License) *<br>
☐ One (1) recent passport-size photograph *<br>
☐ Copy of Tax Registration Number (TRN) *
</td></tr>
</table>

<div class="section-bar">SECTION E — DECLARATION & SIGNATURE</div>
<div class="declaration">
<span class="check">☑</span> I, <strong>${data.firstName} ${data.lastName}</strong>, declare that all information submitted including this application and any supporting documents is my own work, factually true, and honestly presented. I understand that my application may be cancelled should the information be false.<br><br>
<span class="check">☑</span> I agree to notify the training institution immediately should there be any change to the information in this application.<br><br>
<span class="check">☑</span> I understand that once submitted, this application may not be altered; I will need to contact CTS ETS directly to make changes.<br><br>
<span class="check">☑</span> I understand and agree that by submitting this form I have consented to the privacy practices described by the HEART/NSTA Trust and CTS ETS.
</div>

<div class="sig-row">
  <div><div style="font-size:10px;color:#999;margin-bottom:4px">Signature of Applicant *</div>${sigImg}</div>
  <div style="text-align:right"><div style="font-size:10px;color:#999;margin-bottom:4px">Date (DD/MM/YYYY) *</div><div style="font-size:12px;font-weight:600">${today}</div></div>
</div>

<div class="footer">
This form was auto-generated by CTS Empowerment & Training Solutions (ctsetsjm.com) from data entered in the online application.<br>
For official HEART/NSTA registration, this form will be submitted alongside your enrolment documents.<br>
CTS ETS | 6, Newark Avenue, Kingston 2 | admin@ctsetsjm.com | 876-381-9771
</div>
</div>

<script>
window.onload = function() {
  setTimeout(function() {
    var el = document.getElementById('formContent');
    var filename = 'HEART_Application_${(data.firstName||"").replace(/[^a-zA-Z]/g,"")}_${(data.lastName||"").replace(/[^a-zA-Z]/g,"")}.pdf';
    html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(el).save().then(function() {
      document.getElementById('loadingOverlay').innerHTML = '<div style="text-align:center"><div style="font-size:48px;margin-bottom:16px">✅</div><div style="font-size:20px;font-weight:700;margin-bottom:8px">PDF Downloaded!</div><div style="font-size:14px;opacity:0.8;margin-bottom:20px">Your HEART application form has been saved.<br>Upload it in the Documents section on ctsetsjm.com.</div><button onclick="window.close()" style="padding:12px 32px;border-radius:8px;border:none;background:#0E8F8B;color:#fff;font-size:14px;font-weight:700;cursor:pointer">Close This Tab</button></div>';
    });
  }, 500);
};
<\/script>
</body></html>`);
  w.document.close();
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT — HEART FORM SECTION
// Shows inside ApplyPage for Jamaican applicants after programme selection
// ═══════════════════════════════════════════════════════════════
export default function HeartFormBuilder({ formData, onComplete }) {
  const [signature, setSignature] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  const data = {
    firstName: formData.firstName || "",
    middleName: formData.middleName || "",
    lastName: formData.lastName || "",
    email: formData.email || "",
    phone: formData.phone || "",
    gender: formData.gender || "",
    dob: formData.dob || "",
    nationality: formData.nationality || "",
    maritalStatus: formData.maritalStatus || "",
    parish: formData.parish || "",
    address: formData.address || "",
    trn: formData.trn || "",
    nis: formData.nis || "",
    highestQualification: formData.highestQualification || "",
    schoolLastAttended: formData.schoolLastAttended || "",
    yearCompleted: formData.yearCompleted || "",
    employmentStatus: formData.employmentStatus || "",
    employer: formData.employer || "",
    jobTitle: formData.jobTitle || "",
    emergencyName: formData.emergencyName || "",
    emergencyRelationship: formData.emergencyRelationship || "",
    emergencyPhone: formData.emergencyPhone || "",
    level: formData.level || "",
    programme: formData.programme || "",
  };

  const handleDownload = () => {
    generateHeartPDF(data, signature);
    setDownloaded(true);
    if (onComplete) onComplete(signature);
  };

  return (
    <div>
      {/* Info banner */}
      <div style={{ padding: "16px 20px", borderRadius: 12, background: S.tealLight, border: "1px solid " + S.teal + "30", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>📋</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>HEART/NSTA Form — Auto-Filled</div>
          <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.7, margin: 0 }}>
            Your HEART/NSTA application form has been automatically completed from the details you entered above. Review it below, add your signature, then download it as a PDF. You'll upload the signed form in the Documents section.
          </p>
        </div>
      </div>

      {/* Form Preview */}
      <div style={{ marginBottom: 24 }}>
        <HeartFormPreview data={data} signature={signature} />
      </div>

      {/* Signature Pad */}
      <div style={{ marginBottom: 24 }}>
        <SignaturePad onSign={setSignature} signatureData={signature} />
      </div>

      {/* Download Button */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={handleDownload}
          disabled={!signature}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 8,
            background: signature ? S.navy : "rgba(1,30,64,0.08)",
            color: signature ? S.gold : S.grayLight,
            border: "none", fontSize: 14, fontWeight: 700,
            cursor: signature ? "pointer" : "not-allowed",
            fontFamily: S.body, transition: "all 0.2s",
            boxShadow: signature ? "0 4px 16px rgba(1,30,64,0.15)" : "none",
          }}
        >
          📄 Download HEART Form (PDF)
        </button>
        {downloaded && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: S.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>✓</span>
            <span style={{ fontSize: 12, color: S.emerald, fontFamily: S.body, fontWeight: 600 }}>Downloaded — upload it in the Documents section below</span>
          </div>
        )}
      </div>

      {!signature && (
        <p style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 10 }}>
          Please sign above before downloading. The PDF will download automatically.
        </p>
      )}
    </div>
  );
}
