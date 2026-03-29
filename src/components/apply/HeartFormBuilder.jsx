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
    ctx.lineWidth = 2;
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
          width={400}
          height={120}
          style={{ display: "block", width: "100%", maxWidth: 400, height: 120, cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: 12, color: S.grayLight, fontFamily: S.body }}>Draw your signature here</span>
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

// ── Generate printable HEART form as new window ──
function generateHeartPDF(data, signature) {
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups to download your HEART form."); return; }
  const today = new Date().toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" });
  const dobFormatted = data.dob ? new Date(data.dob + "T00:00:00").toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const sigImg = signature ? `<img src="${signature}" style="height:48px;object-fit:contain;" />` : '<div style="border-bottom:1px solid #333;width:200px;height:40px;"></div>';

  w.document.write(`<!DOCTYPE html><html><head><title>HEART Application — ${data.firstName} ${data.lastName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#111;max-width:700px;margin:0 auto;padding:32px 28px}
.header{background:#011E40;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;border-radius:6px 6px 0 0;margin-bottom:0}
.header h1{color:#D4A017;font-size:16px;margin:0}
.header .sub{color:rgba(255,255,255,.6);font-size:10px;letter-spacing:1px;margin-top:2px}
.header .right{text-align:right;color:rgba(255,255,255,.7);font-size:10px}
.section-title{font-size:11px;font-weight:700;color:#D4A017;letter-spacing:1px;text-transform:uppercase;margin:16px 0 6px;padding-top:8px}
.row{display:flex;border-bottom:1px solid #ddd;font-size:12px}
.row .label{width:38%;padding:6px 8px;background:#f5f5f5;font-weight:600;color:#333}
.row .value{flex:1;padding:6px 8px;min-height:24px}
.declaration{padding:10px;font-size:11px;color:#333;line-height:1.7;background:#fafaf7;border:1px solid #eee;border-radius:4px;margin:8px 0}
.sig-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid #ddd}
.footer{margin-top:16px;padding-top:10px;border-top:1px solid #eee;font-size:9px;color:#999;text-align:center;line-height:1.6}
@media print{body{padding:16px}@page{margin:1cm}}
</style></head><body>
<div class="header">
  <div><h1>HEART/NSTA TRUST</h1><div class="sub">APPLICATION FOR TRAINING</div></div>
  <div class="right">Via: CTS Empowerment & Training Solutions<br>Reg. No. 16007/2025</div>
</div>

<div class="section-title">Section A — Personal Information</div>
<div class="row"><div class="label">Surname</div><div class="value">${data.lastName || "—"}</div></div>
<div class="row"><div class="label">First Name(s)</div><div class="value">${[data.firstName, data.middleName].filter(Boolean).join(" ") || "—"}</div></div>
<div class="row"><div class="label">Date of Birth</div><div class="value">${dobFormatted}</div></div>
<div class="row"><div class="label">Gender</div><div class="value">${data.gender || "—"}</div></div>
<div class="row"><div class="label">Nationality</div><div class="value">${data.nationality || "—"}</div></div>
<div class="row"><div class="label">Marital Status</div><div class="value">${data.maritalStatus || "—"}</div></div>
<div class="row"><div class="label">TRN</div><div class="value">${data.trn || "—"}</div></div>
${data.nis ? '<div class="row"><div class="label">NIS Number</div><div class="value">' + data.nis + '</div></div>' : ''}
<div class="row"><div class="label">Address</div><div class="value">${data.address || "—"}</div></div>
<div class="row"><div class="label">Parish</div><div class="value">${data.parish || "—"}</div></div>
<div class="row"><div class="label">Telephone</div><div class="value">${data.phone || "—"}</div></div>
<div class="row"><div class="label">Email</div><div class="value">${data.email || "—"}</div></div>

<div class="section-title">Section B — Education Background</div>
<div class="row"><div class="label">Highest Qualification</div><div class="value">${data.highestQualification || "—"}</div></div>
<div class="row"><div class="label">School / Institution</div><div class="value">${data.schoolLastAttended || "—"}</div></div>
<div class="row"><div class="label">Year Completed</div><div class="value">${data.yearCompleted || "—"}</div></div>

<div class="section-title">Section C — Employment Information</div>
<div class="row"><div class="label">Employment Status</div><div class="value">${data.employmentStatus || "—"}</div></div>
${data.employer ? '<div class="row"><div class="label">Employer / Business</div><div class="value">' + data.employer + '</div></div>' : ''}
${data.jobTitle ? '<div class="row"><div class="label">Job Title / Position</div><div class="value">' + data.jobTitle + '</div></div>' : ''}

<div class="section-title">Section D — Emergency Contact</div>
<div class="row"><div class="label">Contact Name</div><div class="value">${data.emergencyName || "—"}</div></div>
<div class="row"><div class="label">Relationship</div><div class="value">${data.emergencyRelationship || "—"}</div></div>
<div class="row"><div class="label">Contact Phone</div><div class="value">${data.emergencyPhone || "—"}</div></div>

<div class="section-title">Section E — Programme Details</div>
<div class="row"><div class="label">Qualification Level</div><div class="value">${data.level || "—"}</div></div>
<div class="row"><div class="label">Programme</div><div class="value">${data.programme || "—"}</div></div>
<div class="row"><div class="label">Training Provider</div><div class="value">CTS Empowerment & Training Solutions</div></div>
<div class="row"><div class="label">Mode of Delivery</div><div class="value">Online (100%)</div></div>

<div class="section-title">Section F — Declaration</div>
<div class="declaration">
I, <strong>${data.firstName} ${data.lastName}</strong>, declare that the information provided in this application is true and correct to the best of my knowledge. I understand that any false information may result in the cancellation of my application or enrolment. I agree to abide by the rules and regulations of the training institution and the HEART/NSTA Trust.
</div>

<div class="sig-row">
  <div><div style="font-size:10px;color:#999;margin-bottom:4px">Applicant Signature:</div>${sigImg}</div>
  <div style="text-align:right"><div style="font-size:10px;color:#999;margin-bottom:4px">Date:</div><div style="font-size:12px;font-weight:600">${today}</div></div>
</div>

<div class="footer">
This form was auto-generated from the CTS ETS online application system (ctsetsjm.com).<br>
For official HEART/NSTA registration, this form will be submitted alongside your enrolment documents.
</div>
</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
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
          Please sign above before downloading. Your browser will open a print dialog — choose "Save as PDF" to save the file.
        </p>
      )}
    </div>
  );
}
