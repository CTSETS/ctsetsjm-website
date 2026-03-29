import { useState, useRef, useEffect } from "react";
import S from "../../constants/styles";

function SignaturePad({ onSign, signatureData }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const getPos = (e) => { const r = canvasRef.current.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const startDraw = (e) => { e.preventDefault(); const ctx = canvasRef.current.getContext("2d"); const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); setDrawing(true); };
  const draw = (e) => { if (!drawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext("2d"); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = S.navy; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(); setHasDrawn(true); };
  const endDraw = () => { setDrawing(false); if (hasDrawn && canvasRef.current) onSign(canvasRef.current.toDataURL("image/png")); };
  const clear = () => { const c = canvasRef.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); setHasDrawn(false); onSign(null); };
  useEffect(() => { if (signatureData && canvasRef.current) { const img = new Image(); img.onload = () => { canvasRef.current.getContext("2d").drawImage(img, 0, 0); setHasDrawn(true); }; img.src = signatureData; } }, []);
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>Applicant Signature <span style={{ color: S.coral }}>*</span></div>
      <div style={{ position: "relative", borderRadius: 10, border: "1.5px dashed " + (hasDrawn ? S.emerald + "60" : "rgba(1,30,64,0.15)"), background: hasDrawn ? S.emeraldLight + "40" : "#fff", overflow: "hidden" }}>
        <canvas ref={canvasRef} width={500} height={180} style={{ display: "block", width: "100%", maxWidth: 500, height: 180, cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
        {!hasDrawn && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", gap: 6 }}>
          <span style={{ fontSize: 24 }}>{"\u270D\uFE0F"}</span>
          <span style={{ fontSize: 13, color: S.grayLight, fontFamily: S.body }}>Draw your signature here</span>
        </div>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: hasDrawn ? S.emerald : S.gray, fontFamily: S.body }}>{hasDrawn ? "\u2713 Signature captured" : "Use your finger or mouse to sign"}</span>
        {hasDrawn && <button onClick={clear} style={{ background: "none", border: "none", color: S.coral, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Clear & Redo</button>}
      </div>
    </div>
  );
}

function HeartFormPreview({ data, signature }) {
  var row = function(label, value, req) {
    return <div style={{ display: "flex", borderBottom: "1px solid #ddd", fontSize: 11 }}>
      <div style={{ width: "38%", padding: "4px 8px", background: "#f0f4f8", fontWeight: 600, color: "#333" }}>{label}{req && <span style={{ color: "red" }}>*</span>}</div>
      <div style={{ flex: 1, padding: "4px 8px", color: "#111", minHeight: 20, textTransform: "uppercase", fontWeight: 500 }}>{value || "\u2014"}</div>
    </div>;
  };
  var ck = function(v) { return v ? "\u2611" : "\u2610"; };
  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", fontFamily: "'DM Sans',Arial,sans-serif", fontSize: 11 }}>
      <div style={{ background: "#0066B2", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>HEART/NSTA TRUST</div><div style={{ color: "rgba(255,255,255,.85)", fontSize: 9 }}>APPLICATION FOR ADMISSION FORM — August 2023 V2.0</div></div>
        <div style={{ color: "rgba(255,255,255,.6)", fontSize: 8, textAlign: "right" }}></div>
      </div>
      <div style={{ padding: "8px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginBottom: 3 }}>SECTION A — PERSONAL INFORMATION</div>
        {row("Last Name", data.lastName, true)}{row("First Name", data.firstName, true)}{row("Middle Name", data.middleName)}{row("Maiden Name", data.maidenName)}
        {row("Gender", data.gender, true)}{row("Date of Birth", data.dob, true)}{row("Nationality", data.nationality)}{row("TRN", data.trn, true)}{row("NIS #", data.nis)}
        {row("Email", data.email, true)}{row("Telephone 1", data.phone, true)}{row("Telephone 2", data.phone2)}
        {row("Marital Status", data.maritalStatus)}{row("Special Needs", data.specialNeeds === "Yes" ? "Yes — " + (data.specialNeedsType || "") : "No")}
        <div style={{ fontSize: 9, fontWeight: 700, color: "#555", marginTop: 6, marginBottom: 2 }}>PERMANENT ADDRESS</div>
        {row("Country", data.country, true)}{row("Parish", data.parish, true)}{row("Street", data.address, true)}{row("District/Town", data.district)}{row("Postal Zone", data.postalZone)}
        <div style={{ fontSize: 9, fontWeight: 700, color: "#555", marginTop: 6, marginBottom: 2 }}>EMERGENCY CONTACT #1</div>
        {row("Name", data.emergencyName, true)}{row("Telephone", data.emergencyPhone, true)}{row("Relationship", data.emergencyRelationship, true)}
        {data.emergency2Name && <><div style={{ fontSize: 9, fontWeight: 700, color: "#555", marginTop: 6, marginBottom: 2 }}>EMERGENCY CONTACT #2</div>
        {row("Name", data.emergency2Name)}{row("Telephone", data.emergency2Phone)}{row("Relationship", data.emergency2Relationship)}</>}
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginTop: 8, marginBottom: 3 }}>SECTION B — PROGRAMME INFORMATION</div>
        {row("Programme", data.programme, true)}{row("Training Provider", "", true)}{row("Programme Level", data.level, true)}
        {row("Previously Enrolled at HEART?", data.previousHeart || "No")}
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginTop: 8, marginBottom: 3 }}>SECTION C — EDUCATION & EMPLOYMENT</div>
        {row("Current/Last School", data.schoolLastAttended)}{row("Highest Qualification", data.highestQualification)}{row("Year Completed", data.yearCompleted)}
        {row("Employment Status", data.employmentStatus, true)}{data.employer && row("Employer", data.employer)}{data.jobTitle && row("Job Title", data.jobTitle)}
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginTop: 8, marginBottom: 3 }}>SECTION E — DECLARATION & SIGNATURE</div>
        <div style={{ fontSize: 9, color: "#555", lineHeight: 1.4, padding: "4px 0" }}>
          {ck(true)} All information is true and factual. {ck(true)} I will notify of changes. {ck(true)} Application cannot be altered. {ck(true)} I consent to privacy practices.
        </div>
        {signature && <img src={signature} alt="Signature" style={{ height: 44, objectFit: "contain", marginTop: 4 }} />}
      </div>
    </div>
  );
}

function generateHeartPDF(data, signature) {
  var w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups to download your HEART form."); return; }
  var today = new Date();
  var todayStr = String(today.getDate()).padStart(2,"0") + "/" + String(today.getMonth()+1).padStart(2,"0") + "/" + today.getFullYear();
  var sigImg = signature ? '<img src="' + signature + '" style="height:48px;object-fit:contain" />' : '<div style="border-bottom:1px solid #333;width:200px;height:36px"></div>';
  var ck = function(val) { return val ? "\u2611" : "\u2610"; };
  var v = function(val) { return (val || "\u2014").toString().toUpperCase(); };
  var mapLevel = function(level) {
    if (!level) return "";
    if (level.indexOf("Job") >= 0) return "JOB CERTIFICATE";
    if (level.indexOf("1") >= 0) return "C/NVQ LEVEL 1 - CERTIFICATE";
    if (level.indexOf("2") >= 0) return "C/NVQ LEVEL 2 - CERTIFICATE";
    if (level.indexOf("3") >= 0) return "C/NVQ LEVEL 3 - DIPLOMA";
    if (level.indexOf("4") >= 0) return "C/NVQ LEVEL 4 - ASSOCIATE DEGREE";
    if (level.indexOf("5") >= 0) return "C/NVQ LEVEL 5 - BACHELORS DEGREE";
    return level.toUpperCase();
  };
  var ml = mapLevel(data.level);
  var isEmp = data.employmentStatus === "Employed" || data.employmentStatus === "Full-Time" || data.employmentStatus === "Part-Time";
  var isSelf = data.employmentStatus === "Self-Employed";

  var html = '<!DOCTYPE html><html><head><title>HEART Application — ' + data.firstName + ' ' + data.lastName + '</title>'
    + '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:710px;margin:0 auto;padding:14px}'
    + '.ov{position:fixed;inset:0;background:rgba(0,102,178,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;color:#fff;font-size:16px}'
    + '.sp{border:3px solid rgba(255,255,255,.2);border-top:3px solid #fff;border-radius:50%;width:36px;height:36px;animation:s 1s linear infinite;margin-bottom:14px}'
    + '@keyframes s{to{transform:rotate(360deg)}}'
    + '.bb{background:#0066B2;color:#fff;padding:5px 10px;font-size:10px;font-weight:700;letter-spacing:.5px;margin-top:8px}'
    + '.sb{background:#E8F0FE;color:#0066B2;padding:3px 10px;font-size:9px;font-weight:700}'
    + 'table{width:100%;border-collapse:collapse;font-size:10px}'
    + 'td{border:1px solid #bbb;padding:4px 6px;vertical-align:top;line-height:1.4}'
    + 'td.l{background:#f0f4f8;font-weight:600;color:#333;width:22%}'
    + 'td.v{text-transform:uppercase;font-weight:500}'
    + '.dc{padding:5px 8px;font-size:9px;color:#222;line-height:1.5;background:#fafaf7;border:1px solid #ddd;margin:5px 0}'
    + '.sr{display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;padding:6px 0;border-top:1px solid #ccc}'
    + '.ft{margin-top:6px;padding-top:4px;border-top:1px solid #ddd;font-size:7px;color:#999;text-align:center;line-height:1.5}'
    + '</style></head><body>'
    + '<div class="ov" id="lo"><div class="sp"></div>Generating HEART Form PDF...</div>'
    + '<div id="fc">'
    // HEADER
    + '<div style="background:#0066B2;padding:10px 12px;display:flex;justify-content:space-between;align-items:center">'
    + '<div><div style="color:#fff;font-size:9px;font-weight:700;letter-spacing:1px">HEART/NSTA Trust</div>'
    + '<div style="color:#fff;font-size:14px;font-weight:700">APPLICATION FOR ADMISSION FORM</div>'
    + '<div style="color:rgba(255,255,255,.65);font-size:7px;margin-top:1px">ADDRESS: Corporate Office: 6B Oxford Road, Kingston 5 | TEL 876-99-HEART (432768) | EMAIL: info@heart-nsta.org</div></div>'
    + '<div style="text-align:right;color:rgba(255,255,255,.5);font-size:7px">Page | 1<br>August 2023 V2.0</div></div>'
    // SECTION A
    + '<div class="bb">SECTION A \u2014 PERSONAL INFORMATION</div>'
    + '<div class="sb">PERSONAL DATA</div>'
    + '<table>'
    + '<tr><td class="l">LAST NAME *</td><td class="v">' + v(data.lastName) + '</td><td class="l">FIRST NAME *</td><td class="v">' + v(data.firstName) + '</td><td class="l">MIDDLE NAME</td><td class="v">' + v(data.middleName) + '</td></tr>'
    + '<tr><td class="l">MAIDEN NAME</td><td class="v">' + v(data.maidenName) + '</td><td class="l">GENDER *</td><td class="v">' + ck(data.gender==="Female") + ' FEMALE &nbsp;' + ck(data.gender==="Male") + ' MALE</td><td class="l">DATE OF BIRTH *<br><span style="font-weight:400;font-size:7px">(DD/MM/YYYY)</span></td><td class="v">' + v(data.dob) + '</td></tr>'
    + '<tr><td class="l">NATIONALITY</td><td class="v">' + v(data.nationality) + '</td><td class="l">TRN *</td><td class="v">' + v(data.trn) + '</td><td class="l">NIS#</td><td class="v">' + v(data.nis) + '</td></tr>'
    + '<tr><td class="l">EMAIL ADDRESS *</td><td class="v" colspan="2">' + v(data.email) + '</td><td class="l">TELEPHONE 1 *</td><td class="v" colspan="2">' + v(data.phone) + '</td></tr>'
    + '<tr><td class="l" colspan="3">TELEPHONE 2</td><td class="v" colspan="3">' + v(data.phone2) + '</td></tr>'
    + '<tr><td class="l">MARITAL<br>STATUS</td><td class="v" colspan="2">'
    + ck(data.maritalStatus==="Single") + ' SINGLE &nbsp;' + ck(data.maritalStatus==="Married") + ' MARRIED &nbsp;' + ck(data.maritalStatus==="Widowed") + ' WIDOWED &nbsp;' + ck(data.maritalStatus==="Divorced") + ' DIVORCED &nbsp;' + ck(data.maritalStatus==="Common-Law") + ' COMMON LAW</td>'
    + '<td class="l">DO YOU HAVE SPECIAL NEEDS?</td><td class="v">' + ck(data.specialNeeds==="Yes") + ' YES &nbsp;' + ck(data.specialNeeds!=="Yes") + ' NO</td>'
    + '<td class="v" style="font-size:8px">IF YES:<br>' + ck(data.specialNeedsType==="Physical") + ' PHYSICAL<br>' + ck(data.specialNeedsType==="Emotional/Behavioural") + ' EMOTIONAL<br>' + ck(data.specialNeedsType==="Developmental/Learning") + ' DEVELOPMENTAL<br>' + ck(data.specialNeedsType==="Sensory-Impaired") + ' SENSORY</td></tr>'
    + '</table>'
    // ADDRESSES
    + '<table><tr><td colspan="3" class="sb" style="border:none">PERMANENT ADDRESS</td><td colspan="3" class="sb" style="border:none">MAILING ADDRESS <span style="font-weight:400">(if different)</span></td></tr>'
    + '<tr><td class="l">COUNTRY *</td><td class="v" colspan="2">' + v(data.country) + '</td><td class="l">COUNTRY</td><td class="v" colspan="2">\u2014</td></tr>'
    + '<tr><td class="l">PARISH *</td><td class="v" colspan="2">' + v(data.parish) + '</td><td class="l">PARISH</td><td class="v" colspan="2">\u2014</td></tr>'
    + '<tr><td class="l">STREET *</td><td class="v" colspan="2">' + v(data.address) + '</td><td class="l">STREET</td><td class="v" colspan="2">\u2014</td></tr>'
    + '<tr><td class="l">DISTRICT/TOWN</td><td class="v" colspan="2">' + v(data.district) + '</td><td class="l">DISTRICT/TOWN</td><td class="v" colspan="2">\u2014</td></tr>'
    + '<tr><td class="l">POSTAL ZONE/OFFICE</td><td class="v" colspan="2">' + v(data.postalZone) + '</td><td class="l">POSTAL ZONE/OFFICE</td><td class="v" colspan="2">\u2014</td></tr>'
    + '</table>'
    // EMERGENCY
    + '<table><tr><td colspan="3" class="sb" style="border:none">EMERGENCY CONTACT #1</td><td colspan="3" class="sb" style="border:none">EMERGENCY CONTACT #2</td></tr>'
    + '<tr><td class="l">NAME *</td><td class="v" colspan="2">' + v(data.emergencyName) + '</td><td class="l">NAME</td><td class="v" colspan="2">' + v(data.emergency2Name) + '</td></tr>'
    + '<tr><td class="l">TELEPHONE *</td><td class="v" colspan="2">' + v(data.emergencyPhone) + '</td><td class="l">TELEPHONE</td><td class="v" colspan="2">' + v(data.emergency2Phone) + '</td></tr>'
    + '<tr><td class="l">RELATIONSHIP *</td><td class="v" colspan="2">' + ck(data.emergencyRelationship==="Parent") + ' PARENT ' + ck(data.emergencyRelationship==="Guardian") + ' GUARDIAN ' + ck(data.emergencyRelationship==="Relative") + ' RELATIVE ' + ck(data.emergencyRelationship==="Friend") + ' FRIEND ' + ck(data.emergencyRelationship==="Spouse") + ' SPOUSE</td>'
    + '<td class="l">RELATIONSHIP</td><td class="v" colspan="2">' + ck(data.emergency2Relationship==="Parent") + ' PARENT ' + ck(data.emergency2Relationship==="Guardian") + ' GUARDIAN ' + ck(data.emergency2Relationship==="Relative") + ' RELATIVE ' + ck(data.emergency2Relationship==="Friend") + ' FRIEND ' + ck(data.emergency2Relationship==="Spouse") + ' SPOUSE</td></tr>'
    + '</table>'
    // SECTION B
    + '<div class="bb">SECTION B \u2014 PROGRAMME INFORMATION</div>'
    + '<table>'
    + '<tr><td class="l">PROGRAMME OFFERING OF CHOICE *</td><td class="v" colspan="3">' + v(data.programme) + '</td></tr>'
    + '<tr><td class="l">NAME OF TRAINING PROVIDER *</td><td class="v" colspan="3"></td></tr>'
    + '<tr><td class="l" style="vertical-align:top">PROGRAMME LEVEL *<br><span style="font-weight:400;font-size:7px">Only one choice</span></td>'
    + '<td class="v" colspan="3" style="font-size:8px;line-height:1.7">'
    + '<b>TECHNICAL AND VOCATIONAL</b><br>'
    + ck(ml==="C/NVQ LEVEL 1 - CERTIFICATE") + ' C/NVQ LEVEL 1 &nbsp;'
    + ck(ml==="C/NVQ LEVEL 2 - CERTIFICATE") + ' C/NVQ LEVEL 2 &nbsp;'
    + ck(ml==="C/NVQ LEVEL 3 - DIPLOMA") + ' C/NVQ LEVEL 3 &nbsp;'
    + ck(ml==="C/NVQ LEVEL 4 - ASSOCIATE DEGREE") + ' C/NVQ LEVEL 4 &nbsp;'
    + ck(ml==="C/NVQ LEVEL 5 - BACHELORS DEGREE") + ' C/NVQ LEVEL 5<br>'
    + '<b>LIFELONG LEARNING</b><br>'
    + ck(ml==="JOB CERTIFICATE") + ' JOB CERTIFICATE &nbsp;'
    + ck(false) + ' CUSTOMISED CERTIFICATE &nbsp;'
    + ck(false) + ' PROFESSIONAL CERTIFICATE'
    + '</td></tr>'
    + '<tr><td class="l">PREVIOUSLY ENROLLED AT HEART/NSTA? *</td><td class="v">' + ck(data.previousHeart==="Yes") + ' YES ' + ck(data.previousHeart!=="Yes") + ' NO</td>'
    + '<td class="l">CONTACT YOU TO DISCUSS NEEDS?</td><td class="v">' + ck(true) + ' YES ' + ck(false) + ' NO</td></tr>'
    + '<tr><td class="l">HOW DID YOU LEARN ABOUT HEART/NSTA?</td><td class="v" colspan="3">'
    + ck(false) + ' HEART WEBSITE ' + ck(false) + ' SCHOOL ' + ck(false) + ' RADIO '
    + ck(data.hearAbout==="Social Media") + ' SOCIAL MEDIA ' + ck(false) + ' TV '
    + ck(data.hearAbout==="Family/Friend"||data.hearAbout==="Friend") + ' FAMILY/FRIEND '
    + ck(true) + ' OTHER: _________________________</td></tr>'
    + '</table>'
    // SECTION C
    + '<div class="bb">SECTION C \u2014 EDUCATION AND EMPLOYMENT INFORMATION</div>'
    + '<div class="sb">EDUCATION & FORMAL QUALIFICATIONS</div>'
    + '<table>'
    + '<tr><td class="l">CURRENT OR LAST SCHOOL ATTENDED</td><td class="v" colspan="3">' + v(data.schoolLastAttended) + '</td></tr>'
    + '<tr><td class="l">HIGHEST QUALIFICATION</td><td class="v">' + v(data.highestQualification) + '</td><td class="l">YEAR COMPLETED</td><td class="v">' + v(data.yearCompleted) + '</td></tr>'
    + '</table>'
    + '<div class="sb">EMPLOYMENT & EXPERIENCE</div>'
    + '<table>'
    + '<tr><td class="l">ARE YOU CURRENTLY EMPLOYED? *</td><td class="v">' + ck(isEmp) + ' YES ' + ck(!isEmp&&!isSelf) + ' NO</td>'
    + '<td class="l">SELF-EMPLOYED? *</td><td class="v">' + ck(isSelf) + ' YES ' + ck(!isSelf) + ' NO</td></tr>'
    + (data.employer ? '<tr><td class="l">EMPLOYER</td><td class="v">' + v(data.employer) + '</td><td class="l">JOB TITLE</td><td class="v">' + v(data.jobTitle) + '</td></tr>' : '')
    + '</table>'
    // SECTION D
    + '<div class="bb">SECTION D \u2014 SUPPORTING DOCUMENTS</div>'
    + '<div class="dc" style="font-size:8px;line-height:1.7">'
    + '<b>APPLICANTS ARE RESPONSIBLE FOR ENSURING ALL SUPPORTING DOCUMENTS ARE ATTACHED.</b><br>'
    + '\u2610 Recent Resume (within last 6 months) \u2014 applicable for on-the-job training/assessment only<br>'
    + '\u2610 Copies of qualifications of academic achievements as indicated in Section C<br>'
    + '\u2610 Proof of age (Passport, National ID, Birth Certificate, or Driver\'s License) *<br>'
    + '\u2610 One (1) recent passport-size photograph *<br>'
    + '\u2610 Copy of Tax Registration Number (TRN) *<br>'
    + '\u2610 Other (specify): ____________________________'
    + '</div>'
    // SECTION E
    + '<div class="bb">SECTION E \u2014 SIGNATURE</div>'
    + '<div class="dc">'
    + '\u2611 I declare that all information submitted including this application and any other supporting documents is my own work, factually true, and honestly presented and that these documents will become the property of the HEART/NSTA Trust to which I am applying and will not be returned to me. I understand that my application for admission may be canceled should the information I have declared be false. *<br><br>'
    + '\u2611 I agree to notify the HEART/NSTA Trust to which I am applying immediately should there be any change to the information requested in this application. *<br><br>'
    + '\u2611 I understand that once my application has been submitted it may not be altered in any way; I will need to contact the HEART/NSTA Trust directly if I wish to provide additional information or make changes. *<br><br>'
    + '\u2611 I understand and agree that by submitting this form I have consented to the practices described in the privacy statement on page 3. *'
    + '</div>'
    + '<div class="sr"><div><div style="font-size:8px;color:#888;margin-bottom:3px">SIGNATURE OF APPLICANT *</div>' + sigImg + '</div>'
    + '<div style="text-align:right"><div style="font-size:8px;color:#888;margin-bottom:3px">DATE (DD/MM/YYYY) *</div><div style="font-size:11px;font-weight:600">' + todayStr + '</div></div></div>'
    + '<div class="ft">HEART/NSTA Trust \u2014 Application for Admission Form \u2014 August 2023 V2.0<br>'
    + ''
    + '</div>'
    + '</div>'
    + '<script>window.onload=function(){setTimeout(function(){var el=document.getElementById("fc");'
    + 'var fn="HEART_Application_' + (data.firstName||"").replace(/[^a-zA-Z]/g,"") + '_' + (data.lastName||"").replace(/[^a-zA-Z]/g,"") + '.pdf";'
    + 'html2pdf().set({margin:[5,5,5,5],filename:fn,image:{type:"jpeg",quality:0.95},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}})'
    + '.from(el).save().then(function(){document.getElementById("lo").innerHTML=\'<div style="text-align:center"><div style="font-size:48px;margin-bottom:16px">\u2705</div><div style="font-size:20px;font-weight:700;margin-bottom:8px">PDF Downloaded!</div><div style="font-size:14px;opacity:.8;margin-bottom:20px">Your HEART application form has been saved.</div><button onclick="window.close()" style="padding:12px 32px;border-radius:8px;border:none;background:#0066B2;color:#fff;font-size:14px;font-weight:700;cursor:pointer">Close This Tab</button></div>\';});},500);};<\/script>'
    + '</body></html>';
  w.document.write(html);
  w.document.close();
}

export default function HeartFormBuilder({ formData, onComplete }) {
  var _s = useState(null); var signature = _s[0]; var setSignature = _s[1];
  var _s2 = useState(false); var downloaded = _s2[0]; var setDownloaded = _s2[1];
  var data = {
    firstName: formData.firstName || "", middleName: formData.middleName || "", lastName: formData.lastName || "", maidenName: formData.maidenName || "",
    email: formData.email || "", phone: formData.phone || "", phone2: formData.phone2 || "",
    gender: formData.gender || "", dob: formData.dob || "", nationality: formData.nationality || "",
    maritalStatus: formData.maritalStatus || "", specialNeeds: formData.specialNeeds || "No", specialNeedsType: formData.specialNeedsType || "",
    parish: formData.parish || "", country: formData.country || "Jamaica", address: formData.address || "",
    district: formData.district || "", postalZone: formData.postalZone || "",
    trn: formData.trn || "", nis: formData.nis || "",
    highestQualification: formData.highestQualification || "", schoolLastAttended: formData.schoolLastAttended || "", yearCompleted: formData.yearCompleted || "",
    employmentStatus: formData.employmentStatus || "", employer: formData.employer || "", jobTitle: formData.jobTitle || "",
    emergencyName: formData.emergencyName || "", emergencyRelationship: formData.emergencyRelationship || "", emergencyPhone: formData.emergencyPhone || "",
    emergency2Name: formData.emergency2Name || "", emergency2Relationship: formData.emergency2Relationship || "", emergency2Phone: formData.emergency2Phone || "",
    previousHeart: formData.previousHeart || "No", hearAbout: formData.hearAbout || "",
    level: formData.level || "", programme: formData.programme || "",
  };
  var handleDownload = function() { generateHeartPDF(data, signature); setDownloaded(true); if (onComplete) onComplete(signature); };
  return (
    <div>
      <div style={{ padding: "16px 20px", borderRadius: 12, background: S.tealLight, border: "1px solid " + S.teal + "30", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{"\uD83D\uDCCB"}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>HEART/NSTA Application Form — Auto-Filled</div>
          <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.7, margin: 0 }}>
            This is the official HEART/NSTA Trust Application for Admission Form (August 2023 V2.0), auto-filled from your details. Review below, sign, then download. Upload the signed PDF in the Documents section.
          </p>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}><HeartFormPreview data={data} signature={signature} /></div>
      <div style={{ marginBottom: 24 }}><SignaturePad onSign={setSignature} signatureData={signature} /></div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleDownload} disabled={!signature}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 8,
            background: signature ? S.navy : "rgba(1,30,64,0.08)", color: signature ? S.gold : S.grayLight,
            border: "none", fontSize: 14, fontWeight: 700, cursor: signature ? "pointer" : "not-allowed",
            fontFamily: S.body, boxShadow: signature ? "0 4px 16px rgba(1,30,64,0.15)" : "none" }}>
          {"\uD83D\uDCC4"} Download HEART Form (PDF)
        </button>
        {downloaded && <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 20, height: 20, borderRadius: "50%", background: S.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>{"\u2713"}</span>
          <span style={{ fontSize: 12, color: S.emerald, fontFamily: S.body, fontWeight: 600 }}>Downloaded — upload it in the Documents section below</span>
        </div>}
      </div>
      {!signature && <p style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 10 }}>Please sign above before downloading.</p>}
    </div>
  );
}
