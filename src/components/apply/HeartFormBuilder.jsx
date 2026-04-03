import { useState, useRef, useEffect } from "react";
import S from "../../constants/styles";

function SignaturePad({ onSign, signatureData }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const getPos = (e) => { const r = canvasRef.current.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const startDraw = (e) => { e.preventDefault(); if (confirmed) return; const ctx = canvasRef.current.getContext("2d"); const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); setDrawing(true); };
  const draw = (e) => { if (!drawing || confirmed) return; e.preventDefault(); const ctx = canvasRef.current.getContext("2d"); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = S.navy; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(); setHasDrawn(true); };
  const endDraw = () => { setDrawing(false); };
  const confirmSignature = () => { if (hasDrawn && canvasRef.current) { onSign(canvasRef.current.toDataURL("image/png")); setConfirmed(true); } };
  const clear = () => { const c = canvasRef.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); setHasDrawn(false); setConfirmed(false); onSign(null); };
  useEffect(() => { if (signatureData && canvasRef.current) { const img = new Image(); img.onload = () => { canvasRef.current.getContext("2d").drawImage(img, 0, 0); setHasDrawn(true); setConfirmed(true); }; img.src = signatureData; } }, []);
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 8 }}>Applicant Signature <span style={{ color: S.coral }}>*</span></div>
      <div style={{ position: "relative", borderRadius: 10, border: "1.5px dashed " + (confirmed ? S.emerald + "60" : hasDrawn ? S.gold + "60" : "rgba(1,30,64,0.15)"), background: confirmed ? S.emeraldLight + "40" : "#fff", overflow: "hidden" }}>
        <canvas ref={canvasRef} width={500} height={180} style={{ display: "block", width: "100%", maxWidth: 500, height: 180, cursor: confirmed ? "default" : "crosshair", touchAction: "none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
        {!hasDrawn && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", gap: 6 }}>
          <span style={{ fontSize: 24 }}>{"\u270D\uFE0F"}</span>
          <span style={{ fontSize: 13, color: S.grayLight, fontFamily: S.body }}>Draw your signature here</span>
          <span style={{ fontSize: 11, color: S.grayLight, fontFamily: S.body }}>Take your time — press "Done Signing" when finished</span>
        </div>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: confirmed ? S.emerald : hasDrawn ? S.gold : S.gray, fontFamily: S.body, fontWeight: 600 }}>
          {confirmed ? "\u2713 Signature confirmed" : hasDrawn ? "Signature drawn \u2014 press Done Signing to confirm" : "Use your finger or mouse to sign"}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {hasDrawn && !confirmed && <button onClick={confirmSignature} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: S.emerald, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{"\u2713"} Done Signing</button>}
          {hasDrawn && <button onClick={clear} style={{ padding: "8px 16px", borderRadius: 6, border: "1.5px solid " + S.coral, background: "transparent", color: S.coral, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>Clear & Redo</button>}
        </div>
      </div>
    </div>
  );
}

function HeartFormPreview({ data, signature }) {
  var row = function(l, v, r) {
    return <div style={{ display: "flex", borderBottom: "1px solid #ddd", fontSize: 11 }}>
      <div style={{ width: "38%", padding: "4px 8px", background: "#f0f4f8", fontWeight: 600, color: "#333" }}>{l}{r && <span style={{ color: "red" }}>*</span>}</div>
      <div style={{ flex: 1, padding: "4px 8px", color: "#111", minHeight: 20, textTransform: "uppercase", fontWeight: 500 }}>{v || "\u2014"}</div>
    </div>;
  };
  var ck = function(v) { return v ? "\u2611" : "\u2610"; };
  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", fontFamily: "'DM Sans',Arial,sans-serif", fontSize: 11 }}>
      <div style={{ background: "#0066B2", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>HEART/NSTA TRUST</div><div style={{ color: "rgba(255,255,255,.85)", fontSize: 9 }}>APPLICATION FOR ADMISSION FORM \u2014 August 2023 V2.0</div></div>
      </div>
      <div style={{ padding: "8px 12px", fontSize: 10 }}>
        <div style={{ fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginBottom: 3 }}>SECTION A \u2014 PERSONAL INFORMATION</div>
        {row("Last Name", data.lastName, true)}{row("First Name", data.firstName, true)}{row("Middle Name", data.middleName)}{row("Maiden Name", data.maidenName)}
        {row("Gender", data.gender, true)}{row("Date of Birth", data.dob, true)}{row("Nationality", data.nationality)}{row("TRN", data.trn, true)}{row("NIS #", data.nis)}
        {row("Email", data.email, true)}{row("Telephone 1", data.phone, true)}{row("Telephone 2", data.phone2)}
        {row("Marital Status", data.maritalStatus)}{row("Special Needs", data.specialNeeds === "Yes" ? "Yes \u2014 " + (data.specialNeedsType || "") : "No")}
        {row("Country", data.country, true)}{row("Parish", data.parish, true)}{row("Street", data.address, true)}{row("District/Town", data.district)}{row("Postal Zone", data.postalZone)}
        {row("Emergency #1 Name", data.emergencyName, true)}{row("Emergency #1 Phone", data.emergencyPhone, true)}{row("Emergency #1 Relationship", data.emergencyRelationship, true)}
        {data.emergency2Name && <>{row("Emergency #2 Name", data.emergency2Name)}{row("Emergency #2 Phone", data.emergency2Phone)}{row("Emergency #2 Relationship", data.emergency2Relationship)}</>}
        <div style={{ fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginTop: 6, marginBottom: 3 }}>SECTION B \u2014 PROGRAMME INFORMATION</div>
        {row("Programme", data.programme, true)}{row("Programme Level", data.level, true)}{row("Previously at HEART?", data.previousHeart || "No")}
        <div style={{ fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginTop: 6, marginBottom: 3 }}>SECTION C \u2014 EDUCATION & EMPLOYMENT</div>
        {row("School", data.schoolLastAttended)}{row("Qualification", data.highestQualification)}{row("Year", data.yearCompleted)}{row("Employment", data.employmentStatus, true)}
        <div style={{ fontWeight: 700, color: "#0066B2", letterSpacing: 1, marginTop: 6, marginBottom: 3 }}>SECTION E \u2014 SIGNATURE</div>
        <div style={{ fontSize: 9, color: "#555", lineHeight: 1.4, padding: "4px 0" }}>
          {ck(true)} All information is true. {ck(true)} I will notify of changes. {ck(true)} Cannot be altered. {ck(true)} Privacy consent.
        </div>
        {signature && <img src={signature} alt="Sig" style={{ height: 44, objectFit: "contain", marginTop: 4 }} />}
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
  var v = function(val) { return (val || "").toString().toUpperCase() || "&nbsp;"; };
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
  var relCk = function(val, opt) { return ck(val === opt); };

  var css = '*{margin:0;padding:0;box-sizing:border-box}'
    + 'body{font-family:Arial,Helvetica,sans-serif;color:#111;font-size:9px;line-height:1.3}'
    + '.page{width:8.5in;min-height:14in;padding:8mm 10mm;overflow:hidden;position:relative;page-break-after:always}'
    + '.page:last-child{page-break-after:auto}'
    + '.hdr{background:#0066B2;padding:8px 10px;display:flex;justify-content:space-between;align-items:center}'
    + '.hdr h1{color:#fff;font-size:13px;margin:0;font-weight:700}'
    + '.hdr .s1{color:#fff;font-size:8px;font-weight:700;letter-spacing:.5px}'
    + '.hdr .s2{color:rgba(255,255,255,.6);font-size:7px;margin-top:1px}'
    + '.hdr .pg{text-align:right;color:rgba(255,255,255,.5);font-size:7px}'
    + '.bb{background:#0066B2;color:#fff;padding:4px 8px;font-size:9px;font-weight:700;letter-spacing:.5px;margin-top:6px}'
    + '.sb{background:#E8F0FE;color:#0066B2;padding:3px 8px;font-size:8px;font-weight:700}'
    + 'table{width:100%;border-collapse:collapse}'
    + 'td{border:1px solid #aaa;padding:3px 5px;vertical-align:top;font-size:8px;line-height:1.3}'
    + 'td.l{background:#f0f4f8;font-weight:600;color:#333}'
    + 'td.v{text-transform:uppercase;font-weight:500;min-height:16px}'
    + '.red{color:red;font-weight:700}'
    + '.inst{font-size:8px;color:#333;line-height:1.5;padding:4px 0}'
    + '.inst b{font-weight:700}'
    + '.dc{padding:4px 6px;font-size:8px;color:#222;line-height:1.5;background:#fafaf7;border:1px solid #ddd;margin:4px 0}'
    + '.sr{display:flex;justify-content:space-between;align-items:flex-end;margin-top:6px;padding:6px 0;border-top:1px solid #999}'
    + '.ft{margin-top:4px;font-size:7px;color:#888;text-align:center;border-top:1px solid #ddd;padding-top:3px}'
    + '.pv{font-size:8px;color:#333;line-height:1.6;margin:4px 0}'
    + '.pv b{font-weight:700}'
    + '.rcpt{border:1px solid #999;margin-top:8px}'
    + '.rcpt td{font-size:8px}'
    + '.ov{position:fixed;inset:0;background:rgba(0,102,178,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;color:#fff;font-size:16px}'
    + '.sp{border:3px solid rgba(255,255,255,.2);border-top:3px solid #fff;border-radius:50%;width:36px;height:36px;animation:s 1s linear infinite;margin-bottom:14px}'
    + '@keyframes s{to{transform:rotate(360deg)}}'
    + '@page{size:8.5in 14in;margin:6mm}@media print{.page{page-break-after:always;padding:8mm 10mm}.ov{display:none}}';

  // ════════════════════════════════════════════════════════════════
  // PAGE 1: Header + Instructions + Section A + Section B
  // ════════════════════════════════════════════════════════════════
  var page1 = '<div class="page">'
    + '<div class="hdr"><div><div class="s1">HEART/NSTA Trust</div><h1>APPLICATION FOR ADMISSION FORM</h1>'
    + '<div class="s2">ADDRESS: Corporate Office: 6B Oxford Road, Kingston 5<br>'
    + 'TEL 876-99- HEART (432768) | EMAIL: info@heart-nsta.org | WEBSITE: https://www.heart-nsta.org<br>'
    + 'Apply online: https://apply.heart-nta.org/</div></div>'
    + '<div class="pg">Page | 1<br>August 2023 V2.0</div></div>'

    // Instructions
    + '<div class="inst" style="margin:4px 0 2px;font-size:7px;color:#C00"><b>Please read the instructions below for completing your application for admission.</b></div>'
    + '<div class="inst" style="font-size:7px">'
    + '1. Only one application is required per applicant.<br>'
    + '2. Ensure that the application is <b>FULLY</b> completed using CAPITAL letters for legibility. Forms not properly completed will not be processed. All sections must be completed, however, for sections not applicable please indicate "N/A".<br>'
    + '3. <b style="color:#C00">A valid working email address and one mobile phone number are mandatory*.</b><br>'
    + '4. Applicants are responsible for ensuring that all supporting documents are submitted with this form.<br>'
    + '5. Each course has its entry requirements.</div>'
    + '<div style="font-size:7px;margin-bottom:2px">Required fields are marked with a <span class="red">red asterisk (*)</span>.</div>'

    // SECTION A
    + '<div class="bb">SECTION A- PERSONAL INFORMATION</div>'
    + '<div class="sb">PERSONAL DATA</div>'
    + '<table>'
    + '<tr><td class="l" style="width:16%">LAST NAME<span class="red">*</span></td><td class="v" style="width:18%">' + v(data.lastName) + '</td><td class="l" style="width:14%">FIRST NAME<span class="red">*</span></td><td class="v" style="width:18%">' + v(data.firstName) + '</td><td class="l" style="width:16%">MIDDLE NAME</td><td class="v" style="width:18%">' + v(data.middleName) + '</td></tr>'
    + '<tr><td class="l">MAIDEN NAME</td><td class="v">' + v(data.maidenName) + '</td><td class="l">GENDER<span class="red">*</span></td><td class="v">' + ck(data.gender==="Female") + ' FEMALE &nbsp;' + ck(data.gender==="Male") + ' MALE</td><td class="l">DATE OF BIRTH<span class="red">*</span><br><span style="font-weight:400;font-size:6px">(DD/MM/YYYY)</span></td><td class="v">' + v(data.dob) + '</td></tr>'
    + '<tr><td class="l">NATIONALITY</td><td class="v">' + v(data.nationality) + '</td><td class="l">TRN<span class="red">*</span></td><td class="v">' + v(data.trn) + '</td><td class="l">NIS#</td><td class="v">' + v(data.nis) + '</td></tr>'
    + '<tr><td class="l">EMAIL ADDRESS<span class="red">*</span></td><td class="v" colspan="2" style="font-size:7px;word-break:break-all">' + v(data.email) + '</td><td class="l">TELEPHONE 1<span class="red">*</span></td><td class="v" colspan="2">' + v(data.phone) + '</td></tr>'
    + '<tr><td class="l" colspan="3">TELEPHONE 2</td><td class="v" colspan="3">' + v(data.phone2) + '</td></tr>'
    + '<tr><td class="l" rowspan="1">MARITAL<br>STATUS</td><td class="v" colspan="2" style="font-size:7px">'
    + ck(data.maritalStatus==="Single") + ' SINGLE<br>' + ck(data.maritalStatus==="Married") + ' MARRIED<br>' + ck(data.maritalStatus==="Widowed") + ' WIDOWED<br>' + ck(data.maritalStatus==="Divorced") + ' DIVORCED<br>' + ck(data.maritalStatus==="Common-Law") + ' COMMON LAW</td>'
    + '<td class="l" style="font-size:7px">DO YOU HAVE SPECIAL NEEDS (physical, emotional, behavioral, learning disability, or impairment that makes learning or other activities difficult)?</td>'
    + '<td class="v">' + ck(data.specialNeeds==="Yes") + ' YES<br>' + ck(data.specialNeeds!=="Yes") + ' NO</td>'
    + '<td class="v" style="font-size:7px">IF YES, PLEASE TICK ALL THAT APPLY<br><br>'
    + ck(data.specialNeedsType==="Physical") + ' PHYSICAL<br>'
    + ck(data.specialNeedsType==="Emotional/Behavioural") + ' EMOTIONAL/BEHAVIORAL<br>'
    + ck(data.specialNeedsType==="Developmental/Learning") + ' DEVELOPMENTAL/LEARNING<br>'
    + ck(data.specialNeedsType==="Sensory-Impaired") + ' SENSORY-IMPAIRED</td></tr>'
    + '</table>'

    // Addresses side by side
    + '<table>'
    + '<tr><td colspan="3" class="sb" style="border:none">PERMANENT ADDRESS</td><td colspan="3" class="sb" style="border:none">MAILING ADDRESS (Complete if different from permanent address)</td></tr>'
    + '<tr><td class="l" style="width:14%">COUNTRY<span class="red">*</span></td><td class="v" colspan="2" style="width:19%">' + v(data.country) + '</td><td class="l" style="width:14%">COUNTRY</td><td class="v" colspan="2" style="width:19%">&nbsp;</td></tr>'
    + '<tr><td class="l">PARISH<span class="red">*</span></td><td class="v" colspan="2">' + v(data.parish) + '</td><td class="l">PARISH</td><td class="v" colspan="2">&nbsp;</td></tr>'
    + '<tr><td class="l">STREET<span class="red">*</span></td><td class="v" colspan="2">' + v(data.address) + '</td><td class="l">STREET</td><td class="v" colspan="2">&nbsp;</td></tr>'
    + '<tr><td class="l">DISTRICT/TOWN</td><td class="v" colspan="2">' + v(data.district) + '</td><td class="l">DISTRICT/TOWN</td><td class="v" colspan="2">&nbsp;</td></tr>'
    + '<tr><td class="l">POSTAL ZONE/OFFICE</td><td class="v" colspan="2">' + v(data.postalZone) + '</td><td class="l">POSTAL ZONE/OFFICE</td><td class="v" colspan="2">&nbsp;</td></tr>'
    + '</table>'

    // Emergency Contacts side by side
    + '<table>'
    + '<tr><td colspan="3" class="sb" style="border:none">EMERGENCY CONTACT #1</td><td colspan="3" class="sb" style="border:none">EMERGENCY CONTACT #2</td></tr>'
    + '<tr><td class="l" style="width:14%">LAST NAME<span class="red">*</span></td><td class="v" colspan="2">' + v(data.emergencyName ? data.emergencyName.split(" ").slice(-1)[0] : "") + '</td><td class="l" style="width:14%">LAST NAME</td><td class="v" colspan="2">' + v(data.emergency2Name ? data.emergency2Name.split(" ").slice(-1)[0] : "") + '</td></tr>'
    + '<tr><td class="l">FIRST NAME<span class="red">*</span></td><td class="v" colspan="2">' + v(data.emergencyName ? data.emergencyName.split(" ").slice(0,-1).join(" ") : "") + '</td><td class="l">FIRST NAME</td><td class="v" colspan="2">' + v(data.emergency2Name ? data.emergency2Name.split(" ").slice(0,-1).join(" ") : "") + '</td></tr>'
    + '<tr><td class="l">TELEPHONE<span class="red"> *</span></td><td class="v" colspan="2">' + v(data.emergencyPhone) + '</td><td class="l">TELEPHONE</td><td class="v" colspan="2">' + v(data.emergency2Phone) + '</td></tr>'
    + '<tr><td class="l">RELATIONSHIP TO APPLICANT<span class="red">*</span></td><td class="v" colspan="2" style="font-size:7px">'
    + relCk(data.emergencyRelationship,"Parent") + ' PARENT &nbsp;' + relCk(data.emergencyRelationship,"Guardian") + ' GUARDIAN<br>'
    + relCk(data.emergencyRelationship,"Relative") + ' RELATIVE &nbsp;' + relCk(data.emergencyRelationship,"Friend") + ' FRIEND &nbsp;' + relCk(data.emergencyRelationship,"Spouse") + ' SPOUSE</td>'
    + '<td class="l">RELATIONSHIP TO APPLICANT</td><td class="v" colspan="2" style="font-size:7px">'
    + relCk(data.emergency2Relationship,"Parent") + ' PARENT &nbsp;' + relCk(data.emergency2Relationship,"Guardian") + ' GUARDIAN<br>'
    + relCk(data.emergency2Relationship,"Relative") + ' RELATIVE &nbsp;' + relCk(data.emergency2Relationship,"Friend") + ' FRIEND &nbsp;' + relCk(data.emergency2Relationship,"Spouse") + ' SPOUSE</td></tr>'
    + '</table>'

    // SECTION B
    + '<div class="bb">SECTION B- PROGRAMME INFORMATION</div>'
    + '<div style="font-size:7px;color:#555;padding:2px 8px">To complete this section, visit https://ndar.heartnsta.org/apply.aspx to view the available programmes. For further assistance visit https://www.heart-nsta.org/locations/</div>'
    + '<table>'
    + '<tr><td class="l" style="width:30%">PROGRAMME OFFERING OF CHOICE<span class="red">*</span></td><td class="v" colspan="3">' + v(data.programme) + '</td></tr>'
    + '<tr><td class="l">NAME OF TRAINING PROVIDER<span class="red">*</span></td><td class="v" colspan="3">&nbsp;</td></tr>'
    + '<tr><td class="l" style="vertical-align:top">PROGRAMME LEVEL<span class="red">*</span><br><span style="font-weight:400;font-size:6px">Only one choice can be selected</span></td>'
    + '<td class="v" colspan="3" style="font-size:7px;line-height:1.6">'
    + '<b>TECHNICAL AND VOCATIONAL</b><br>'
    + ck(ml==="C/NVQ LEVEL 1 - CERTIFICATE") + ' C/NVQ LEVEL 1 - CERTIFICATE<br>'
    + ck(ml==="C/NVQ LEVEL 2 - CERTIFICATE") + ' C/NVQ LEVEL 2 - CERTIFICATE<br>'
    + ck(ml==="C/NVQ LEVEL 3 - DIPLOMA") + ' C/NVQ LEVEL 3 - DIPLOMA<br>'
    + ck(ml==="C/NVQ LEVEL 4 - ASSOCIATE DEGREE") + ' C/NVQ LEVEL 4 - ASSOCIATE DEGREE<br>'
    + ck(ml==="C/NVQ LEVEL 5 - BACHELORS DEGREE") + " C/NVQ LEVEL 5 - BACHELOR'S DEGREE<br>"
    + ck(false) + ' C/NVQ LEVEL 6 - POST GRADUATE CERTIFICATE/DIPLOMA<br>'
    + ck(false) + " C/NVQ LEVEL 7 - MASTER'S DEGREE<br>"
    + ck(false) + ' C/NVQ LEVEL 8 - DOCTORAL DEGREE<br><br>'
    + '<b>LIFELONG LEARNING</b><br>'
    + ck(false) + ' CUSTOMISED CERTIFICATE &nbsp;&nbsp;'
    + ck(ml==="JOB CERTIFICATE") + ' JOB CERTIFICATE &nbsp;&nbsp;'
    + ck(false) + ' PROFESSIONAL CERTIFICATE<br><br>'
    + '<b>GENERAL EDUCATION</b><br>'
    + ck(false) + ' ADULT BASIC EDUCATION &nbsp;&nbsp;'
    + ck(false) + ' HIGH SCHOOL DIPLOMA EQUIVALENCY (HSDE)</td></tr>'
    + '<tr><td class="l">HAVE YOU PREVIOUSLY ENROLLED AT THE HEART/NSTA TRUST?</td><td class="v">' + ck(data.previousHeart==="Yes") + ' YES &nbsp;&nbsp;' + ck(data.previousHeart!=="Yes") + ' NO</td>'
    + '<td class="l">WOULD YOU LIKE SOMEONE TO CONTACT YOU TO DISCUSS YOUR NEEDS?</td><td class="v">' + ck(true) + ' YES &nbsp;&nbsp;' + ck(false) + ' NO</td></tr>'
    + '<tr><td class="l">HOW DID YOU LEARN ABOUT THE HEART/NSTA TRUST PROGRAMMES?</td><td class="v" colspan="3" style="font-size:7px">'
    + ck(false) + ' HEART WEBSITE &nbsp;' + ck(false) + ' SCHOOL &nbsp;' + ck(false) + ' RADIO &nbsp;'
    + ck(data.hearAbout==="Social Media") + ' SOCIAL MEDIA &nbsp;' + ck(false) + ' TV &nbsp;'
    + ck(data.hearAbout==="A friend or family member") + ' FAMILY/FRIEND &nbsp;' + ck(false) + ' MOBILE APP<br>'
    + ck(true) + ' OTHER (PLEASE SPECIFY): ____________________________</td></tr>'
    + '</table>'
    + '<div class="ft">HEART/NSTA Trust- Application for Admission Form -August 2023 V2.0</div>'
    + '</div>';

  // ════════════════════════════════════════════════════════════════
  // PAGE 2: Section C + Section D + Section E
  // ════════════════════════════════════════════════════════════════
  var page2 = '<div class="page">'
    + '<div style="text-align:right;font-size:7px;color:#666;margin-bottom:2px">Page | 2</div>'

    // SECTION C
    + '<div class="bb">SECTION C- EDUCATION AND EMPLOYMENT INFORMATION</div>'
    + '<div class="sb">EDUCATION & FORMAL QUALIFICATIONS <span style="font-weight:400">(In addition to submitting a copy of your qualifications, please list qualifications including any diagnostics test, CVQ/NVQ-J Certificates, and other awards below.)</span></div>'
    + '<table>'
    + '<tr><td class="l" style="width:20%" rowspan="2">CURRENT OR LAST SCHOOL ATTENDED</td><td class="l" style="width:25%">SCHOOL NAME</td><td class="v" colspan="2">' + v(data.schoolLastAttended) + '</td></tr>'
    + '<tr><td class="l">LOCATION (COUNTRY, PARISH, STREET)</td><td class="v" colspan="2">&nbsp;</td></tr>'
    + '<tr><td class="l" colspan="2" style="text-align:right">YEAR ATTENDED FROM: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TO: ' + v(data.yearCompleted) + '</td><td colspan="2">&nbsp;</td></tr>'
    + '</table>'
    + '<table style="margin-top:4px">'
    + '<tr><td class="l" rowspan="4" style="width:20%">LIST YOUR QUALIFICATIONS</td><td class="l" style="width:30%">SUBJECT/PROGRAMME NAME</td><td class="l" style="width:30%">AWARD OR GRADE OBTAINED<br><span style="font-weight:400;font-size:6px">(E.G., CSEC GRADE I, GCE A LEVEL GRADE A, NVQ-J LEVEL1 CERTIFICATE, DIPLOMA, etc.)</span></td><td class="l" style="width:20%">DATE AWARDED<br><span style="font-weight:400;font-size:6px">(DD/MM/YYYY)</span></td></tr>'
    + '<tr><td class="v">&nbsp;</td><td class="v">' + v(data.highestQualification) + '</td><td class="v">&nbsp;</td></tr>'
    + '<tr><td class="v">&nbsp;</td><td class="v">&nbsp;</td><td class="v">&nbsp;</td></tr>'
    + '<tr><td class="v">&nbsp;</td><td class="v">&nbsp;</td><td class="v">&nbsp;</td></tr>'
    + '</table>'

    + '<div class="sb" style="margin-top:6px">EMPLOYMENT & EXPERIENCE</div>'
    + '<table>'
    + '<tr><td class="l" style="width:50%">ARE YOU CURRENTLY EMPLOYED? <span class="red">*</span></td><td class="v" style="width:50%">' + ck(isEmp) + ' YES &nbsp;&nbsp;' + ck(!isEmp && !isSelf) + ' NO</td></tr>'
    + '<tr><td class="l">ARE YOU CURRENTLY SELF-EMPLOYED? <span class="red">*</span></td><td class="v">' + ck(isSelf) + ' YES &nbsp;&nbsp;' + ck(!isSelf) + ' NO</td></tr>'
    + '<tr><td class="l">IF NO, HAVE YOU EVER BEEN EMPLOYED OR SELF-EMPLOYED?</td><td class="v">\u2610 YES &nbsp;&nbsp;\u2610 NO</td></tr>'
    + '<tr><td class="l">DO YOU HAVE ANY EXPERIENCE IN THE SKILL AREA TO WHICH YOU ARE APPLYING? <span class="red">*</span></td><td class="v">\u2610 YES &nbsp;&nbsp;\u2610 NO</td></tr>'
    + '<tr><td class="l">DO YOU HAVE EXPERIENCE IN ANY SKILL AREA OTHER THAN THE ONE(S) STATED IN SECTION B? <span class="red">*</span></td><td class="v">\u2610 YES &nbsp;&nbsp;\u2610 NO &nbsp;&nbsp;IF YES, PLEASE SPECIFY: _______________</td></tr>'
    + '</table>'

    // SECTION D
    + '<div class="bb" style="margin-top:8px">SECTION D- SUPPORTING DOCUMENTS</div>'
    + '<div class="dc" style="font-size:8px;line-height:1.8">'
    + '<b>APPLICANTS ARE RESPONSIBLE FOR ENSURING THAT ALL SUPPORTING DOCUMENTS ARE ATTACHED. APPLICATIONS WITHOUT THE ATTACHED REQUIRED SUPPORTING DOCUMENTS WILL NOT BE CONSIDERED AND SHALL BE DEEMED "INCOMPLETE".</b><br><br>'
    + '\u2610 RECENT RESUME (COMPILED WITHIN THE LAST 6 MONTHS)- APPLICABLE FOR ON-THE-JOB TRAINING OR ASSESSMENT ONLY<br>'
    + '\u2610 COPIES OF QUALIFICATIONS OF ACADEMIC ACHIEVEMENTS AS INDICATED ON THE APPLICATION FORM IN SECTION C<br>'
    + '\u2610 PROOF OF AGE (1 COPY OF PASSPORT OR NATIONAL ID OR BIRTH CERTIFICATE OR DRIVER\'S LICENSE) <span class="red">*</span><br>'
    + '\u2610 ONE(1) RECENT PASSPORT-SIZE PHOTOGRAPH<span class="red">*</span><br>'
    + '\u2610 COPY OF TAX REGISTRATION NUMBER (TRN)<span class="red">*</span><br>'
    + '\u2610 OTHER(SPECIFY): __________________________________________________________'
    + '</div>'

    // SECTION E
    + '<div class="bb" style="margin-top:8px">SECTION E- SIGNATURE</div>'
    + '<div class="dc" style="font-size:8px;line-height:1.7">'
    + '\u2611 I declare that all information submitted including this application and any other supporting documents is my own work, factually true, and honestly presented and that these documents will become the property of the HEART/NSTA Trust to which I am applying and will not be returned to me. I understand that my application for admission may be canceled should the information I have declared be false. <span class="red">*</span><br><br>'
    + '\u2611 I agree to notify the HEART/NSTA Trust to which I am applying immediately should there be any change to the information requested in this application. <span class="red">*</span><br><br>'
    + '\u2611 I understand that once my application has been submitted it may not be altered in any way; I will need to contact the HEART/NSTA Trust directly if I wish to provide additional information or make changes. <span class="red">*</span><br><br>'
    + '\u2611 I understand and agree that by submitting this form I have consented to the practices described in the privacy statement on page 3. <span class="red">*</span>'
    + '</div>'

    + '<div class="sr">'
    + '<div style="width:60%"><div style="font-size:7px;color:#888;margin-bottom:3px">SIGNATURE OF APPLICANT<span class="red">*</span></div>' + sigImg + '<div style="border-top:1px solid #333;width:70%;margin-top:2px"></div></div>'
    + '<div style="width:35%;text-align:right"><div style="font-size:7px;color:#888;margin-bottom:3px">DATE(DD/MM/YYYY)<span class="red">*</span></div><div style="font-size:11px;font-weight:600">' + todayStr + '</div></div>'
    + '</div>'
    + '<div class="ft">HEART/NSTA Trust- Application for Admission Form -August 2023 V2.0</div>'
    + '</div>';

  // ════════════════════════════════════════════════════════════════
  // PAGE 3: Privacy Statement + Official Receipt
  // ════════════════════════════════════════════════════════════════
  var page3 = '<div class="page">'
    + '<div style="text-align:right;font-size:7px;color:#666;margin-bottom:4px">Page | 3</div>'

    + '<div style="font-size:10px;font-weight:700;margin-bottom:6px">HEART/NSTA TRUST PRIVACY STATEMENT</div>'

    + '<div class="pv"><b>USE OF YOUR PERSONAL INFORMATION</b><br>'
    + 'HEART/NSTA TRUST collects and uses your personal information to operate the HEART/NSTA Trust website and deliver the user-requested services. HEART/NSTA Trust also uses your personally identifiable information to inform you of other products or services available from HEART/NSTA Trust and its affiliates. HEART/NSTA Trust may also contact you via surveys to conduct research about your opinion of current services or of potential new services that may be offered.</div>'

    + '<div class="pv">HEART/NSTA Trust does not sell, rent or lease its customer lists to third parties. HEART/NSTA Trust may, from time to time, contact you on behalf of external business partners about a particular offering that may be of interest to you. In those cases, your unique personally identifiable information (e-mail, name, address, telephone number) is not transferred to the third party. In addition, HEART/NSTA Trust may share data with trusted partners to help us perform statistical analysis, send you email or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services to HEART/NSTA Trust and they are required to maintain the confidentiality of your information.</div>'

    + '<div class="pv">HEART/NSTA Trust does not use or disclose sensitive personal information, such as race, religion, or political affiliations, without your explicit consent.</div>'

    + '<div class="pv">HEART/NSTA Trust websites will disclose your personal information, without notice, only if required to do so by law or in the good faith belief that such action is necessary to: (a) conform to the edicts of the law or comply with legal process served on HEART/NSTA Trust or the site; (b) protect and defend the rights or property of HEART/NSTA Trust; and, (c) act under exigent circumstances to protect the personal safety of users of HEART/NSTA Trust, or the public.</div>'

    + '<div class="pv"><b>USE OF COOKIES</b><br>'
    + 'The HEART/NSTA Trust Web site use "cookies" to help you personalize your online experience. A cookie is a text file that is placed on your hard disk by a Web page server. Cookies are uniquely assigned to you and can only be read by a web server in the domain that issued the cookie to you. You have the ability to accept or decline cookies.</div>'

    + '<div class="pv"><b>SECURITY OF YOUR PERSONAL INFORMATION</b><br>'
    + 'HEART/NSTA Trust secures your personal information from unauthorized access, use or disclosure on computer servers in a controlled, secure environment, protected from unauthorized access, use or disclosure. When personal information (such as a credit card number) is transmitted to other Web sites, it is protected through the use of encryption, such as the Secure Socket Layer (SSL) protocol.</div>'

    + '<div class="pv"><b>CONTACT INFORMATION</b><br>'
    + 'HEART/NSTA Trust welcomes your comments regarding this Statement of Privacy. If you believe that HEART/NSTA Trust has not adhered to this Statement, please contact HEART/NSTA Trust via email at info@heart-nta.org.</div>'

    // OFFICIAL RECEIPT
    + '<div style="font-size:12px;font-weight:700;text-align:center;margin:12px 0 6px;border-top:2px solid #333;padding-top:8px">OFFICIAL RECEIPT- APPLICATION FOR ADMISSION</div>'
    + '<div class="inst" style="font-size:7px;margin-bottom:4px">'
    + '1. An officer will contact you by the telephone number or email you provided on this form to process your application.<br>'
    + '2. You will be required to confirm an email verification code by the email provided on this form.<br>'
    + '3. All applicants will receive the receipt below as evidence of submission and will be notified via email and/or SMS regarding the next stage after the application process is completed.</div>'

    + '<table class="rcpt">'
    + '<tr><td class="l" style="width:25%">APPLICATION RECEIVED FROM</td><td class="v" style="width:25%">' + v(data.firstName) + ' ' + v(data.lastName) + '</td><td class="l" style="width:25%">APPLICATION SUBMISSION DATE</td><td class="v" style="width:25%">' + todayStr + '</td></tr>'
    + '<tr><td class="l">DOCUMENTS/ITEMS RECEIVED</td><td class="v" colspan="3">'
    + '\u2610 COMPLETED APPLICATION FORM<br><br>'
    + '<b>SUPPORTING DOCUMENT</b><br>'
    + '\u2610 RECENT RESUME(COMPILED WITHIN THE LAST 6 MONTHS)- APPLICABLE FOR ON-THE-JOB TRAINING/ASSESSMENT ONLY<br>'
    + '\u2610 COPIES OF QUALIFICATIONS OF ALL ACADEMIC ACHIEVEMENTS AS INDICATED ON THE APPLICATION FORM<br>'
    + '\u2610 PROOF OF AGE (PASSPORT, NATIONAL ID, BIRTH CERTIFICATE, DRIVER\'S LICENSE)<br>'
    + '\u2610 ONE(1) RECENT PASSPORT-SIZE PHOTOGRAPH<br>'
    + '\u2610 COPY OF TAX REGISTRATION NUMBER (TRN)<br>'
    + '\u2610 OTHER(SPECIFY): ___________________________________________'
    + '</td></tr>'
    + '<tr><td class="l">RECEIVED BY:</td><td class="v" colspan="3">&nbsp;</td></tr>'
    + '<tr><td class="l">SIGNATURE</td><td class="v" colspan="1">&nbsp;</td><td class="l">DATE</td><td class="v">&nbsp;</td></tr>'
    + '</table>'
    + '<div class="ft">HEART/NSTA Trust- Application for Admission Form -August 2023 V2.0</div>'
    + '</div>';

  var html = '<!DOCTYPE html><html><head><title>HEART Application \u2014 ' + data.firstName + ' ' + data.lastName + '</title>'
    + '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>'
    + '<style>' + css + '</style></head><body>'
    + '<div class="ov" id="lo"><div class="sp"></div>Generating HEART Form PDF...</div>'
    + '<div id="fc">' + page1 + page2 + page3 + '</div>'
    + '<script>window.onload=function(){setTimeout(function(){var el=document.getElementById("fc");'
    + 'var fn="HEART_Application_' + (data.firstName||"").replace(/[^a-zA-Z]/g,"") + '_' + (data.lastName||"").replace(/[^a-zA-Z]/g,"") + '.pdf";'
    + 'html2pdf().set({margin:0,filename:fn,image:{type:"jpeg",quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:["css","legacy"]}})'
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
          <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, fontFamily: S.body, marginBottom: 4 }}>HEART/NSTA Application Form \u2014 Auto-Filled</div>
          <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.7, margin: 0 }}>
            This is the official HEART/NSTA Trust Application for Admission Form (August 2023 V2.0), auto-filled from your details. The PDF will be exactly 3 pages matching the official format. Review below, sign, then download. Upload the signed PDF in the Documents section.
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
          <span style={{ fontSize: 12, color: S.emerald, fontFamily: S.body, fontWeight: 600 }}>Downloaded \u2014 upload it in the Documents section below</span>
        </div>}
      </div>
      {!signature && <p style={{ fontSize: 11, color: S.gray, fontFamily: S.body, marginTop: 10 }}>Please sign above before downloading.</p>}
    </div>
  );
}
