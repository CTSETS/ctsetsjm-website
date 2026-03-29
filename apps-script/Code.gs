// ═══════════════════════════════════════════════════════════════════════
// CTS ETS — MULTI-SHEET APPS SCRIPT BACKEND v2
// ═══════════════════════════════════════════════════════════════════════
// SETUP: Create a new Google Sheet (Master Dashboard), paste this into
// Extensions > Apps Script > Code.gs, then run setupAllSheets().
// This auto-creates 4 child sheets with all tabs + headers.
// ═══════════════════════════════════════════════════════════════════════

var ADMIN_EMAIL = "admin@ctsetsjm.com";
var SHEET_IDS = { master:"", students:"", finance:"", operations:"", academic:"" };

// ── Load IDs from Script Properties (set during setup) ──
function loadIds() {
  if (SHEET_IDS.students) return;
  var p = PropertiesService.getScriptProperties();
  SHEET_IDS.master = p.getProperty("master_id") || "";
  SHEET_IDS.students = p.getProperty("students_id") || "";
  SHEET_IDS.finance = p.getProperty("finance_id") || "";
  SHEET_IDS.operations = p.getProperty("operations_id") || "";
  SHEET_IDS.academic = p.getProperty("academic_id") || "";
}
function tab(sheetId, name) {
  var ss = SpreadsheetApp.openById(sheetId);
  var s = ss.getSheetByName(name);
  return s || ss.insertSheet(name);
}
function sTab(n) { loadIds(); return tab(SHEET_IDS.students, n); }
function fTab(n) { loadIds(); return tab(SHEET_IDS.finance, n); }
function oTab(n) { loadIds(); return tab(SHEET_IDS.operations, n); }
function aTab(n) { loadIds(); return tab(SHEET_IDS.academic, n); }

// ═══════════════════════════════════════════════════════════════════════
// SETUP — Run ONCE
// ═══════════════════════════════════════════════════════════════════════
function setupAllSheets() {
  var master = SpreadsheetApp.getActiveSpreadsheet();
  var s1 = SpreadsheetApp.create("CTS ETS — 1. Student Records");
  var s2 = SpreadsheetApp.create("CTS ETS — 2. Finance");
  var s3 = SpreadsheetApp.create("CTS ETS — 3. Operations");
  var s4 = SpreadsheetApp.create("CTS ETS — 4. Academic");

  SHEET_IDS = { master:master.getId(), students:s1.getId(), finance:s2.getId(), operations:s3.getId(), academic:s4.getId() };
  var p = PropertiesService.getScriptProperties();
  p.setProperties({"master_id":SHEET_IDS.master,"students_id":SHEET_IDS.students,"finance_id":SHEET_IDS.finance,"operations_id":SHEET_IDS.operations,"academic_id":SHEET_IDS.academic});

  // Student Records tabs
  makeTab(s1,"Applications",["Application Ref","Date Submitted","Applicant Type","First Name","Last Name","Middle Name","Email","Phone","TRN","NIS","Parish","Country","Gender","Date of Birth","Address","Nationality","Marital Status","Highest Qualification","School Last Attended","Year Completed","Employment Status","Employer","Job Title","Industry","Years Experience","Emergency Name","Emergency Phone","Emergency Relationship","Level","Programme","Payment Plan","Hear About Us","Message","Documents Uploaded","Drive Folder Link","Status","Notes"]);
  makeTab(s1,"Enrolled Students",["Student Number","Application Ref","Portal Password","First Name","Last Name","Email","Phone","Level","Programme","Payment Plan","Cohort","Start Date","End Date","Total Fees","Total Paid","Outstanding","Status","Payment Status","LMS Access","Enrolled Date","Last Encouragement","Encouragement Count","Notes"]);
  makeTab(s1,"Student Lifecycle",["Date/Time","Application Ref","Student Number","Student Name","Event Type","Category","Details","Previous Value","New Value","Programme","Level","Performed By","Source"]);
  makeTab(s1,"Communication Log",["Timestamp","Student Name","Student Number","App Ref","Channel","Direction","Subject","Summary","Logged By"]);
  makeTab(s1,"Drip Log",["Student Number","App Ref","Email","Student Name","Programme","Level","Enrolled Date","day1_welcome","day3_tips","day7_checkin","day14_encourage"]);
  makeTab(s1,"Employer Contacts",["Organisation","Contact Name","Email","Phone","Students Enrolled","Discount","Notes"]);

  // Add Status dropdown validation to Applications
  setupStatusDropdown(s1);
  rmDef(s1);

  // Finance tabs
  makeTab(s2,"Payment Schedule",["Student ID","Application Ref","Email","Student Name","Programme","Level","Payment Plan","Instalment #","Instalment Label","Amount Due (JMD)","Due Date","Status","Date Paid","Amount Paid","Receipt Link","Last Reminder","Reminder Stage","Notes"]);
  makeTab(s2,"Founding_Cohort",["Programme","Level","Duration","Standard Tuition (JMD)","Founding Tuition (JMD)","Saving (JMD)","Standard Tuition (USD)","Founding Tuition (USD)","Max Spots","Spots Filled","Spots Remaining","Status","Last Updated"]);
  makeTab(s2,"Founding_Credits",["Student ID","Student Name","Email","Programme","Level","Standard Tuition","Founding Tuition","Founding Saving","Referral Credits","Total Referrals","Adjusted Tuition (JMD)","Adjusted Tuition (USD)","Reg Fee","Total Due (JMD)","Total Due (USD)","Amount Paid","Balance (JMD)","Balance (USD)","Payment Plan","Surcharge %","Tuition After Surcharge","Referral Code","Status","Last Updated"]);
  makeTab(s2,"Founding_Referrals",["Referral Code","Referrer ID","Referrer Name","Referrer Email","Referrer Programme","Referrer Level","Referred Name","Referred Email","Referred Programme","Referred Level","Referred Ref","Status","Bonus (JMD)","Bonus (USD)","Credit Applied","Created At","Completed At"]);
  rmDef(s2);

  // Operations tabs
  makeTab(s3,"Site Analytics",["Timestamp","Date","Page","Referrer","Device"]);
  makeTab(s3,"Feedback",["Timestamp","Name","Email","Programme","Rating","What Worked","What to Improve","Recommend","Testimonial","Can Share","Processed"]);
  makeTab(s3,"Interest Capture",["Timestamp","Email","Source"]);
  makeTab(s3,"Audit Log",["Timestamp","Action","Application Ref","Student ID","Student Name","Details","Performed By"]);
  makeTab(s3,"Config",["Key","Value"]);
  rmDef(s3);

  // Academic tabs
  makeTab(s4,"Certificates",["Certificate Number","Student ID","Student Name","Email","Programme","Level","Date Issued","Date Completed","Status","Verified Count","Last Verified","Notes"]);
  makeTab(s4,"Programme Codes",["#","Level","Programme Name","Abbreviation","Course Code","Duration","Tuition (JMD)","Portal ID","Portal State","Notes"]);
  makeTab(s4,"Progress Reports",["Report Date","Total Students","Active (7d)","At Risk (7d+)","Avg Completion %","Pending Grading","Sent To"]);
  makeTab(s4,"NCTVET Ready",["Student ID","Name","Programme","Level","Units Done","Portfolio","Assessment Date","Assessor","Result","Cert Issued","Notes"]);
  makeTab(s4,"Ministry Register",["Adm #","Reg Day","Reg Month","Reg Year","Name","DOB Day","DOB Month","DOB Year","Guardian","Residence","Last School","Distance","Admission Date","Course","Class","Att R","Att I","Att II","Att III","Leaving Date","Cause","Remarks"]);
  rmDef(s4);

  // Populate Founding_Cohort
  populateFC(s2);

  // Build Master Dashboard
  buildMaster(master, s1, s2, s3, s4);

  Logger.log("SETUP COMPLETE");
  Logger.log("Students: " + s1.getUrl());
  Logger.log("Finance: " + s2.getUrl());
  Logger.log("Operations: " + s3.getUrl());
  Logger.log("Academic: " + s4.getUrl());
}

function makeTab(ss, name, headers) {
  var s = ss.getSheetByName(name) || ss.insertSheet(name);
  if (s.getLastRow() === 0) { s.appendRow(headers); s.getRange(1,1,1,headers.length).setFontWeight("bold"); s.setFrozenRows(1); }
}
function rmDef(ss) { try { var d=ss.getSheetByName("Sheet1"); if(d&&ss.getSheets().length>1) ss.deleteSheet(d); } catch(e){} }

function setupStatusDropdown(ss) {
  var apps = ss.getSheetByName("Applications");
  if (!apps) return;
  var h = apps.getRange(1,1,1,apps.getLastColumn()).getValues()[0];
  var statusCol = -1;
  for (var i=0; i<h.length; i++) { if (String(h[i]).trim() === "Status") { statusCol = i+1; break; } }
  if (statusCol < 0) return;
  // Apply dropdown to rows 2-500
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Under Review","Pending Payment","Accepted","Rejected","Withdrawn","Deferred"], true)
    .setAllowInvalid(false).build();
  apps.getRange(2, statusCol, 499, 1).setDataValidation(rule);

  // Also set Enrolled Students status dropdown
  var enrolled = ss.getSheetByName("Enrolled Students");
  if (!enrolled) return;
  var h2 = enrolled.getRange(1,1,1,enrolled.getLastColumn()).getValues()[0];
  var statusCol2 = -1;
  for (var i=0; i<h2.length; i++) { if (String(h2[i]).trim() === "Status") { statusCol2 = i+1; break; } }
  if (statusCol2 < 0) return;
  var rule2 = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Active","On Hold","Completed","Withdrawn","Graduated"], true)
    .setAllowInvalid(false).build();
  enrolled.getRange(2, statusCol2, 499, 1).setDataValidation(rule2);
}

// ═══════════════════════════════════════════════════════════════════════
// ON-EDIT TRIGGER — Install via: Triggers > Add Trigger > onEditTrigger > On Edit
// Watches Applications → Status column. When set to "Accepted", auto-enrolls.
// ═══════════════════════════════════════════════════════════════════════
function onEditTrigger(e) {
  try {
    var sheet = e.source.getActiveSheet();
    var sheetName = sheet.getName();
    if (sheetName !== "Applications") return;

    var range = e.range;
    var row = range.getRow();
    if (row < 2) return; // header row

    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    var colMap = {};
    for (var i=0; i<headers.length; i++) colMap[String(headers[i]).trim()] = i;

    var statusCol = colMap["Status"];
    if (statusCol === undefined) return;
    if (range.getColumn() !== statusCol + 1) return; // not the Status column

    var newStatus = String(e.value || "").trim();
    var oldStatus = String(e.oldValue || "").trim();

    if (newStatus === "Accepted" && oldStatus !== "Accepted") {
      enrollStudent(sheet, row, headers, colMap);
    }
  } catch(err) {
    Logger.log("onEditTrigger error: " + err.message);
  }
}

function enrollStudent(appSheet, row, headers, colMap) {
  var data = appSheet.getRange(row, 1, 1, headers.length).getValues()[0];

  var appRef = String(data[colMap["Application Ref"]] || "").trim();
  var firstName = String(data[colMap["First Name"]] || "").trim();
  var lastName = String(data[colMap["Last Name"]] || "").trim();
  var email = String(data[colMap["Email"]] || "").trim();
  var phone = String(data[colMap["Phone"]] || "").trim();
  var level = String(data[colMap["Level"]] || "").trim();
  var programme = String(data[colMap["Programme"]] || "").trim();
  var paymentPlan = String(data[colMap["Payment Plan"]] || "").trim();

  // Generate student number: CTSETS-STU-XXXXX
  var studentNumber = generateStudentNumber();

  // Generate portal password: CTS + 6 random alphanumeric
  var portalPassword = generatePortalPassword();

  // Calculate total fees based on level
  var totalFees = getLevelFee(level);

  // Write to Enrolled Students
  loadIds();
  var enrolled = sTab("Enrolled Students");
  enrolled.appendRow([
    studentNumber,       // Student Number
    appRef,              // Application Ref
    portalPassword,      // Portal Password
    firstName,           // First Name
    lastName,            // Last Name
    email,               // Email
    phone,               // Phone
    level,               // Level
    programme,           // Programme
    paymentPlan,         // Payment Plan
    "",                  // Cohort (you fill in)
    "",                  // Start Date (you fill in)
    "",                  // End Date (you fill in)
    totalFees,           // Total Fees
    0,                   // Total Paid
    totalFees,           // Outstanding
    "Active",            // Status
    "Pending",           // Payment Status
    "Yes",               // LMS Access
    new Date(),          // Enrolled Date
    "",                  // Last Encouragement
    0,                   // Encouragement Count
    ""                   // Notes
  ]);

  // Log to Student Lifecycle
  try {
    var lifecycle = sTab("Student Lifecycle");
    lifecycle.appendRow([
      new Date(), appRef, studentNumber, firstName + " " + lastName,
      "Status Change", "Enrollment", "Application accepted — auto-enrolled",
      "Under Review", "Accepted", programme, level, "System", "Auto"
    ]);
  } catch(e) {}

  // Log to Audit
  try {
    var audit = oTab("Audit Log");
    audit.appendRow([new Date(), "Student Enrolled", appRef, studentNumber, firstName + " " + lastName,
      "Auto-enrolled. Student #: " + studentNumber + " | Password: " + portalPassword, "System"]);
  } catch(e) {}

  Logger.log("Enrolled: " + appRef + " → " + studentNumber + " | PW: " + portalPassword);

  // AUTO-SEND ACCEPTANCE EMAIL
  try {
    if (email) {
      var fmtFees = "J$" + totalFees.toLocaleString();
      var subject = "🎓 Congratulations " + firstName + "! You've Been Accepted — CTS ETS";
      var body = '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">'
        + '<div style="background:#011E40;color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">'
        + '<h1 style="margin:0;font-size:22px">Welcome to CTS ETS!</h1>'
        + '<p style="margin:8px 0 0;opacity:0.8;font-size:13px">Called To Serve — Excellence Through Service</p>'
        + '</div>'
        + '<div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
        + '<p style="font-size:16px;color:#011E40"><strong>Congratulations, ' + firstName + '!</strong></p>'
        + '<p style="font-size:14px;color:#4A5568;line-height:1.7">Your application for <strong>' + programme + ' (' + level + ')</strong> has been accepted. You are now officially a CTS ETS student.</p>'
        + '<div style="background:#F0FFF4;border:2px solid #38A169;border-radius:10px;padding:20px;margin:20px 0">'
        + '<h3 style="color:#22543D;margin:0 0 12px;font-size:15px">Your Portal Credentials</h3>'
        + '<table style="width:100%;font-size:14px"><tr><td style="padding:6px 0;color:#718096">Student Number</td><td style="padding:6px 0;font-weight:bold;color:#011E40">' + studentNumber + '</td></tr>'
        + '<tr><td style="padding:6px 0;color:#718096">Application Ref</td><td style="padding:6px 0;font-weight:bold;color:#011E40">' + appRef + '</td></tr>'
        + '<tr><td style="padding:6px 0;color:#718096">Portal Password</td><td style="padding:6px 0;font-weight:bold;color:#E53E3E;font-family:monospace;font-size:16px">' + portalPassword + '</td></tr>'
        + '<tr><td style="padding:6px 0;color:#718096">Total Fees</td><td style="padding:6px 0;font-weight:bold;color:#011E40">' + fmtFees + '</td></tr></table>'
        + '</div>'
        + '<h3 style="color:#011E40;font-size:15px;margin:20px 0 10px">What to Do Next</h3>'
        + '<ol style="font-size:14px;color:#4A5568;line-height:2">'
        + '<li><strong>Log into the Student Portal</strong> at <a href="https://www.ctsetsjm.com/#Student-Portal" style="color:#0E8F8B">ctsetsjm.com → Student Portal</a> using your Application Ref (or Student Number) and the password above.</li>'
        + '<li><strong>Make your payment</strong> — you can pay online at <a href="https://www.ctsetsjm.com/#pay" style="color:#0E8F8B">ctsetsjm.com → Make a Payment</a></li>'
        + '<li><strong>Access the Learning Portal</strong> — once inside the Student Portal, click "Enter Learning Portal" to start studying.</li>'
        + '<li><strong>Change your password</strong> — you can change your portal password from within the Student Portal.</li>'
        + '</ol>'
        + '<p style="font-size:14px;color:#4A5568;line-height:1.7">We will assign you to a cohort and notify you of your start date. In the meantime, you can begin exploring your study materials.</p>'
        + '<div style="text-align:center;margin:24px 0"><a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:14px 36px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">Log Into Student Portal</a></div>'
        + '<p style="font-size:12px;color:#A0AEC0;margin-top:20px;text-align:center">Keep this email safe — it contains your login credentials.<br>Questions? Email admin@ctsetsjm.com or WhatsApp 876-381-9771</p>'
        + '</div>'
        + '<div style="background:#F7FAFC;padding:16px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">'
        + '<p style="font-size:11px;color:#A0AEC0;margin:0">CTS Empowerment & Training Solutions | 6, Newark Avenue, Kingston 2 | admin@ctsetsjm.com</p>'
        + '</div></body></html>';
      GmailApp.sendEmail(email, subject, "Congratulations " + firstName + "! Your CTS ETS application has been accepted. Student #: " + studentNumber + " | Password: " + portalPassword + " | Log in at ctsetsjm.com → Student Portal", {htmlBody: body, name: "CTS ETS Admissions"});
      Logger.log("Acceptance email sent to: " + email);
    }
  } catch(emailErr) { Logger.log("Acceptance email error: " + emailErr.message); }
}

function generateStudentNumber() {
  loadIds();
  var enrolled = sTab("Enrolled Students");
  var lastRow = enrolled.getLastRow();
  var nextNum = 1;
  if (lastRow > 1) {
    var existing = enrolled.getRange(2, 1, lastRow-1, 1).getValues();
    for (var i=0; i<existing.length; i++) {
      var m = String(existing[i][0]).match(/STU-(\d+)/);
      if (m) { var n = parseInt(m[1]); if (n >= nextNum) nextNum = n + 1; }
    }
  }
  var padded = String(nextNum);
  while (padded.length < 5) padded = "0" + padded;
  return "CTSETS-STU-" + padded;
}

function generatePortalPassword() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  var pw = "CTS";
  for (var i=0; i<6; i++) { pw += chars.charAt(Math.floor(Math.random() * chars.length)); }
  return pw;
}

function getLevelFee(level) {
  var l = String(level).toLowerCase();
  if (l.indexOf("5") >= 0) return 50000;
  if (l.indexOf("4") >= 0) return 40000;
  if (l.indexOf("3") >= 0) return 30000;
  if (l.indexOf("2") >= 0) return 20000;
  return 10000; // Job Certificate
}


function populateFC(fin) {
  var fc = fin.getSheetByName("Founding_Cohort"); if (fc.getLastRow()>1) return;
  var progs = [
    ["Basic Digital Literacy Skills Proficiency","Job Certificate","3 months",5000],
    ["Customer Service Rep — Admin Asst.","Job Certificate","3 months",5000],
    ["Customer Service Rep — Office Admin","Job Certificate","3 months",5000],
    ["Data Entry Processor","Job Certificate","2 months",5000],
    ["Data Entry Advanced Processor","Job Certificate","2 months",5000],
    ["Introduction to ICT Proficiency","Job Certificate","2 months",5000],
    ["Team Leader","Job Certificate","2.5 months",5000],
    ["Industrial Security Ops Manager","Job Certificate","3 months",5000],
    ["Data Protection Officer","Job Certificate","3 months",5000],
    ["Human Resource Administrator","Job Certificate","4 months",5000],
    ["Customer Service","Level 2 — Vocational Certificate","6 months",15000],
    ["Entrepreneurship","Level 2 — Vocational Certificate","6 months",15000],
    ["Administrative Assistance","Level 2 — Vocational Certificate","6 months",15000],
    ["Business Administration (Secretarial)","Level 2 — Vocational Certificate","6 months",15000],
    ["Industrial Security Operations","Level 2 — Vocational Certificate","6 months",15000],
    ["Customer Service","Level 3 — Diploma","7 months",25000],
    ["Customer Service Supervision","Level 3 — Diploma","7 months",25000],
    ["Business Administration — Management","Level 3 — Diploma","7 months",25000],
    ["Entrepreneurship","Level 3 — Diploma","7 months",25000],
    ["Industrial Security Operations","Level 3 — Diploma","7 months",25000],
    ["Supervisory Management","Level 3 — Diploma","7 months",25000],
    ["Human Resource Management","Level 4 — Associate Equivalent","8 months",35000],
    ["Business Administration — Management","Level 4 — Associate Equivalent","9 months",35000],
    ["Human Resource Management","Level 5 — Bachelor's Equivalent","6 months",45000],
    ["Business Administration Management","Level 5 — Bachelor's Equivalent","9 months",45000],
  ];
  var l3=["Level 3 — Diploma","Level 4 — Associate Equivalent","Level 5 — Bachelor's Equivalent"];
  for (var i=0;i<progs.length;i++) {
    var p=progs[i], isL3=l3.indexOf(p[1])>=0;
    var ft=isL3?p[3]-5000:p[3], sv=5000+(isL3?5000:0);
    fc.appendRow([p[0],p[1],p[2],p[3],ft,sv,Math.round(p[3]/155),Math.round(ft/155),15,0,15,"Open",new Date().toISOString()]);
  }
}

function buildMaster(master, s1, s2, s3, s4) {
  var d = master.getSheets()[0]; d.setName("Master Dashboard"); d.clear();
  d.getRange("A1").setValue("CTS ETS — MASTER DASHBOARD").setFontSize(18).setFontWeight("bold").setFontColor("#011E40");
  d.getRange("A2").setValue("Table of Contents — All System Sheets").setFontSize(11).setFontColor("#666");
  d.getRange("A3").setValue("Setup: " + new Date().toLocaleString()).setFontSize(9).setFontColor("#999");
  var r = 5;
  var items = [
    ["📘 1. STUDENT RECORDS", s1, "#011E40", ["Applications","Enrolled Students","Student Lifecycle","Communication Log","Drip Log","Employer Contacts"]],
    ["💰 2. FINANCE", s2, "#C49112", ["Payment Schedule","Founding_Cohort","Founding_Credits","Founding_Referrals"]],
    ["⚙️ 3. OPERATIONS", s3, "#2D8B61", ["Site Analytics","Feedback","Interest Capture","Audit Log","Config"]],
    ["🎓 4. ACADEMIC", s4, "#7C3AED", ["Certificates","Programme Codes","Progress Reports","NCTVET Ready","Ministry Register"]],
  ];
  for (var i=0;i<items.length;i++) {
    var it=items[i];
    d.getRange("A"+r).setValue(it[0]).setFontSize(14).setFontWeight("bold").setFontColor(it[2]); r++;
    d.getRange("A"+r).setFormula('=HYPERLINK("'+it[1].getUrl()+'","Open Sheet")').setFontColor("#1155CC");
    d.getRange("B"+r).setValue("ID: "+it[1].getId()).setFontSize(9).setFontColor("#999"); r++;
    for (var t=0;t<it[3].length;t++) { d.getRange("B"+r).setValue("  📄 "+it[3][t]).setFontSize(10); r++; }
    r++;
  }
  r++;
  d.getRange("A"+r).setValue("QUICK REFERENCE").setFontSize(12).setFontWeight("bold"); r++;
  var refs=[["Admin Email",ADMIN_EMAIL],["Website","https://www.ctsetsjm.com"],["WiPay","https://wipayfinancial.com"],["Apps Script URL","(paste after deploying)"]];
  for(var j=0;j<refs.length;j++){d.getRange("A"+(r)).setValue(refs[j][0]);d.getRange("B"+(r)).setValue(refs[j][1]);r++;}
  d.setColumnWidth(1,250); d.setColumnWidth(2,400);
}

// ═══════════════════════════════════════════════════════════════════════
// GET HANDLER
// ═══════════════════════════════════════════════════════════════════════
function doGet(e) {
  loadIds();
  var a = (e.parameter.action||"").toLowerCase(), r = {};
  try {
    if (a==="lookupstudent") r = lookupStudent(e.parameter.ref||"",e.parameter.email||"");
    else if (a==="studentlogin") r = studentLogin(e.parameter.ref||"",e.parameter.pw||"");
    else if (a==="changepassword") r = changePassword(e.parameter.ref||"",e.parameter.oldpw||"",e.parameter.newpw||"");
    else if (a==="getfoundingcount") r = getFoundingCount(e.parameter.programme||"",e.parameter.level||"");
    else if (a==="verifycert") r = verifyCert(e.parameter.cert||"");
    else if (a==="validatereferral") r = validateReferral(e.parameter.code||"");
    else if (a==="track") { trackPage(e.parameter.page||"",e.parameter.device||""); r={ok:true}; }
    else r = {error:"Unknown action"};
  } catch(err) { r={error:err.message}; }
  return ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════════════
// POST HANDLER
// ═══════════════════════════════════════════════════════════════════════
function doPost(e) {
  loadIds();
  var r = {success:true};
  try {
    var d = JSON.parse(e.postData.contents), ft = d.form_type||"";
    if (ft==="Student Application") r = handleApp(d);
    else if (ft==="Contact Enquiry") handleContact(d);
    else if (ft==="Interest Capture") oTab("Interest Capture").appendRow([new Date(),d.email||"","Homepage"]);
    else if (ft==="Student Feedback") handleFeedback(d);
    else if (ft==="Payment Evidence") handlePayment(d);
    else if (ft==="Payment Intent") audit("PAYMENT INTENT",d.ref||"","WiPay J$"+(d.amountIntended||"")+" Plan:"+(d.paymentPlan||""),"Website");
    else if (ft==="WiPay Payment Confirmation") handleWiPay(d);
    else if (ft==="Payment Lookup Dispute") handleDispute(d);
    else if (ft==="Referral Registration") handleReferral(d);
    else if (ft==="Register Drip Sequence") sTab("Drip Log").appendRow(["",d.ref||"",d.email||"",d.name||"",d.programme||"",d.level||"",new Date()]);
    else audit("UNKNOWN","","form_type: "+ft,"System");
  } catch(err) { r={success:false,error:err.message}; audit("ERROR","",err.message,"System"); }
  return ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════════════
// GET ACTIONS
// ═══════════════════════════════════════════════════════════════════════
function lookupStudent(ref, email) {
  var s=sTab("Applications"), d=s.getDataRange().getValues(), h=d[0], c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
  for(var i=1;i<d.length;i++){
    var row=d[i], ar=String(row[c["Application Ref"]]||"").trim().toUpperCase(), re=String(row[c["Email"]]||"").trim().toLowerCase();
    var match=false;
    if(ref&&ar===ref.trim().toUpperCase()) match=true;
    if(!match&&email&&re===email.trim().toLowerCase()) match=true;
    if(match) {
      var status = String(row[c["Status"]]||"Under Review").trim();
      return {
        found:true, ref:ar,
        name:((row[c["First Name"]]||"")+" "+(row[c["Last Name"]]||"")).trim(),
        email:row[c["Email"]]||"", phone:row[c["Phone"]]||"",
        programme:row[c["Programme"]]||"", level:row[c["Level"]]||"",
        paymentPlan:row[c["Payment Plan"]]||"",
        status:status
      };
    }
  }
  return {found:false};
}

function studentLogin(ref, pw) {
  if (!ref || !pw) return {ok:false, error:"Reference and password are required."};
  var s=sTab("Enrolled Students"), d=s.getDataRange().getValues(), h=d[0], c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
  if (c["Portal Password"] === undefined) return {ok:false, error:"Portal not configured. Contact admin."};
  var refUpper = ref.trim().toUpperCase();
  for(var i=1;i<d.length;i++){
    var row=d[i];
    var ar=String(row[c["Application Ref"]]||"").trim().toUpperCase();
    var sn=String(row[c["Student Number"]]||"").trim().toUpperCase();
    // Match by Application Ref OR Student Number
    if(ar===refUpper || sn===refUpper){
      var storedPw=String(row[c["Portal Password"]]||"").trim();
      if(!storedPw) return {ok:false, error:"Your portal access has not been set up yet. Contact admin@ctsetsjm.com."};
      if(storedPw!==pw.trim()) return {ok:false, error:"Incorrect password. Try again or contact admin@ctsetsjm.com."};
      var status=row[c["Status"]]||"Active";
      var totalFees=Number(row[c["Total Fees"]]||0);
      var totalPaid=Number(row[c["Total Paid"]]||0);
      var outstanding=Number(row[c["Outstanding"]]||0);
      return {
        ok:true,
        ref:ar,
        studentNumber:sn,
        name:((row[c["First Name"]]||"")+" "+(row[c["Last Name"]]||"")).trim(),
        email:row[c["Email"]]||"",
        programme:row[c["Programme"]]||"",
        level:row[c["Level"]]||"",
        paymentPlan:row[c["Payment Plan"]]||"",
        status:status,
        paymentStatus:row[c["Payment Status"]]||"Pending",
        totalFees:totalFees,
        totalPaid:totalPaid,
        outstanding:outstanding>0?outstanding:0,
        startDate:row[c["Start Date"]]||"",
        endDate:row[c["End Date"]]||"",
        cohort:row[c["Cohort"]]||"",
        payments:getPaymentHistory(ar),
        lmsAccess:String(row[c["LMS Access"]]||"").toLowerCase()==="yes"
      };
    }
  }
  return {ok:false, error:"No enrolled student found with this reference. If you applied but haven't been accepted yet, please wait for your acceptance email."};
}

function changePassword(ref, oldPw, newPw) {
  if (!ref || !oldPw || !newPw) return {ok:false, error:"All fields are required."};
  if (newPw.length < 6) return {ok:false, error:"New password must be at least 6 characters."};
  loadIds();
  var s=sTab("Enrolled Students"), d=s.getDataRange().getValues(), h=d[0], c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
  if (c["Portal Password"] === undefined) return {ok:false, error:"Portal not configured."};
  var refUpper = ref.trim().toUpperCase();
  for(var i=1;i<d.length;i++){
    var row=d[i];
    var ar=String(row[c["Application Ref"]]||"").trim().toUpperCase();
    var sn=String(row[c["Student Number"]]||"").trim().toUpperCase();
    if(ar===refUpper || sn===refUpper){
      var storedPw=String(row[c["Portal Password"]]||"").trim();
      if(storedPw!==oldPw.trim()) return {ok:false, error:"Current password is incorrect."};
      // Update password in sheet
      s.getRange(i+1, c["Portal Password"]+1).setValue(newPw.trim());
      // Log it
      try {
        var lifecycle = sTab("Student Lifecycle");
        lifecycle.appendRow([new Date(), ar, sn, (row[c["First Name"]]||"")+" "+(row[c["Last Name"]]||""),
          "Password Change", "Security", "Portal password changed by student", "", "", row[c["Programme"]]||"", row[c["Level"]]||"", "Student", "Portal"]);
      } catch(e){}
      return {ok:true, message:"Password changed successfully."};
    }
  }
  return {ok:false, error:"Student not found."};
}

function getAmtPaid(ref) {
  try {
    var s=fTab("Payment Schedule"),d=s.getDataRange().getValues(),tot=0;
    for(var i=1;i<d.length;i++){
      if(String(d[i][1]||"").trim().toUpperCase()===ref.toUpperCase()){
        var st=String(d[i][11]||"").toLowerCase();
        if(st==="paid"||st==="verified") tot+=Number(d[i][9])||0;
      }
    }
    return tot;
  } catch(e){ return 0; }
}

function getPaymentHistory(ref) {
  try {
    var s=fTab("Payment Schedule"),d=s.getDataRange().getValues(),h=d[0],payments=[];
    for(var i=1;i<d.length;i++){
      if(String(d[i][1]||"").trim().toUpperCase()===ref.toUpperCase()){
        payments.push({
          date:d[i][0]||"",
          type:d[i][3]||"",
          amount:Number(d[i][9])||0,
          status:d[i][11]||"Pending",
          method:d[i][10]||""
        });
      }
    }
    return payments;
  } catch(e){ return []; }
}

function getAmtDue(ref) {
  try {
    var s=fTab("Payment Schedule"),d=s.getDataRange().getValues(),tot=0;
    for(var i=1;i<d.length;i++){
      if(String(d[i][1]||"").trim().toUpperCase()===ref.toUpperCase()){
        var st=String(d[i][11]||"").toLowerCase();
        if(st!=="paid"&&st!=="verified") tot+=Number(d[i][9])||0;
      }
    }
    if(tot>0) return tot;
  } catch(e){}
  return null;
}

function getFoundingCount(prog, level) {
  var s=fTab("Founding_Cohort"),d=s.getDataRange().getValues();
  for(var i=1;i<d.length;i++){
    if(String(d[i][0]||"").trim().toLowerCase()===prog.trim().toLowerCase())
      return {count:Number(d[i][9])||0,maxSpots:Number(d[i][8])||15,remaining:Number(d[i][10])||15,status:d[i][11]||"Open"};
  }
  return {count:0,maxSpots:15,remaining:15,status:"Open"};
}

function verifyCert(num) {
  if(!num) return {valid:false};
  var s=aTab("Certificates"),d=s.getDataRange().getValues();
  for(var i=1;i<d.length;i++){
    var cn=String(d[i][0]||"").trim().toUpperCase();
    if(cn===num.trim().toUpperCase()){
      try{s.getRange(i+1,10).setValue((Number(d[i][9])||0)+1);s.getRange(i+1,11).setValue(new Date());}catch(e){}
      return {valid:true,certificateNumber:cn,name:d[i][2]||"",programme:d[i][4]||"",level:d[i][5]||"",
        dateIssued:d[i][6]?Utilities.formatDate(new Date(d[i][6]),"America/Jamaica","MMMM d, yyyy"):"",status:d[i][8]||"Active"};
    }
  }
  return {valid:false};
}

function validateReferral(code) {
  if(!code) return {valid:false};
  var s=fTab("Founding_Referrals"),d=s.getDataRange().getValues();
  for(var i=1;i<d.length;i++){
    if(String(d[i][0]||"").trim().toUpperCase()===code.trim().toUpperCase())
      return {valid:true,referrerName:d[i][2]||"",referrerRef:d[i][1]||""};
  }
  return {valid:false};
}

function trackPage(pg, dev) {
  var now=new Date();
  oTab("Site Analytics").appendRow([now,Utilities.formatDate(now,"America/Jamaica","yyyy-MM-dd"),pg||"Unknown","direct",dev||"unknown"]);
}

// ═══════════════════════════════════════════════════════════════════════
// POST ACTIONS
// ═══════════════════════════════════════════════════════════════════════
function handleApp(data) {
  var s=sTab("Applications"),all=s.getDataRange().getValues(),h=all[0],c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;

  // Duplicate check
  for(var i=1;i<all.length;i++){
    var ee=String(all[i][c["Email"]]||"").trim().toLowerCase();
    var pp=String(all[i][c["Programme"]]||"").trim().toLowerCase();
    if(ee===(data.email||"").trim().toLowerCase()&&pp===(data.programme||"").trim().toLowerCase())
      return {success:false,duplicate:true,message:"Application with this email/programme exists.",existingRef:all[i][c["Application Ref"]]||""};
  }

  var ref=data.ref||"", now=new Date();

  s.appendRow([
    ref,now,data.applicantType||"",
    data.firstName||"",data.lastName||"",data.middleName||"",data.email||"",data.phone||"",
    data.trn||"",data.nis||"",data.parish||"",data.country||"",data.gender||"",
    data.dob||"",data.address||"",data.nationality||"",data.maritalStatus||"",
    data.highestQualification||"",data.schoolLastAttended||"",data.yearCompleted||"",
    data.employmentStatus||"",data.employer||"",data.jobTitle||"",data.industry||"",data.yearsExperience||"",
    data.emergencyName||"",data.emergencyPhone||"",data.emergencyRelationship||"",
    data.level||"",data.programme||"",data.paymentPlan||"",
    data.hearAbout||"",data.message||"",
    "","","Under Review",""
  ]);

  // Save files
  var fl=saveDriveFiles(data,ref);
  if(fl.url){var lr=s.getLastRow();
    if(c["Drive Folder Link"]!==undefined) s.getRange(lr,c["Drive Folder Link"]+1).setValue(fl.url);
    if(c["Documents Uploaded"]!==undefined) s.getRange(lr,c["Documents Uploaded"]+1).setValue(fl.names);
  }

  audit("APPLICATION RECEIVED",ref,(data.firstName||"")+" "+(data.lastName||"")+" | "+(data.programme||""),"Website");
  lifecycle(ref,"",(data.firstName||"")+" "+(data.lastName||""),"Application Submitted","Administrative",
    "Email: "+(data.email||"")+" | "+(data.applicantType||""),data.programme||"",data.level||"");

  return {success:true,ref:ref};
}

function saveDriveFiles(data, ref) {
  var r={url:"",names:""};
  if(!data.files||data.files.length===0) return r;
  try{
    var rf=DriveApp.getFoldersByName("CTS ETS Applications");
    var root=rf.hasNext()?rf.next():DriveApp.createFolder("CTS ETS Applications");
    var folder=root.createFolder(ref+" — "+(data.firstName||"")+" "+(data.lastName||""));
    var names=[];
    for(var i=0;i<data.files.length;i++){
      var f=data.files[i]; if(!f.data) continue;
      try{
        var dec=Utilities.base64Decode(f.data);
        var ext=(f.name||"").indexOf(".")>=0?(f.name||"").split(".").pop():(f.type||"").indexOf("pdf")>=0?"pdf":"jpg";
        var blob=Utilities.newBlob(dec,f.type||"application/octet-stream",ref+"_"+String(i+1).padStart(2,"0")+"_"+(f.slot||"file")+"."+ext);
        folder.createFile(blob); names.push(blob.getName());
      }catch(fe){}
    }
    r.url=folder.getUrl(); r.names=names.join(", ");
  }catch(err){audit("FILE ERROR",ref,err.message,"System");}
  return r;
}

function updateFC(prog) {
  if(!prog) return;
  var s=fTab("Founding_Cohort"),d=s.getDataRange().getValues();
  for(var i=1;i<d.length;i++){
    if(String(d[i][0]||"").trim().toLowerCase()===prog.trim().toLowerCase()){
      var filled=(Number(d[i][9])||0)+1, max=Number(d[i][8])||15;
      s.getRange(i+1,10).setValue(filled);
      s.getRange(i+1,11).setValue(Math.max(0,max-filled));
      s.getRange(i+1,12).setValue(filled>=max?"Full":"Open");
      s.getRange(i+1,13).setValue(new Date().toISOString());
      break;
    }
  }
}

function handleContact(data) {
  sTab("Communication Log").appendRow([
    new Date(),data.contactName||data.name||"","","",
    "Website Form","Inbound",data.subject||"General",
    (data.message||"")+" | Email: "+(data.email||"")+" | Phone: "+(data.phone||"N/A"),"System"
  ]);
  audit("CONTACT","",(data.contactName||data.name||"")+" — "+(data.subject||"General"),"Website");
}

function handleFeedback(data) {
  oTab("Feedback").appendRow([
    new Date(),data.name||"",data.email||"",data.programme||"",data.rating||"",
    data.wellDone||data.whatWorked||"",data.improve||data.whatToImprove||"",
    data.recommend||"",data.testimonial||"",data.canShare||"","No"
  ]);
}

function handlePayment(data) {
  var ref=data.ref||"",now=new Date(),receiptUrl="";
  if(data.files&&data.files.length>0){
    try{
      var rf=DriveApp.getFoldersByName("CTS ETS Payments");
      var root=rf.hasNext()?rf.next():DriveApp.createFolder("CTS ETS Payments");
      var f=data.files[0]; if(f.data){
        var dec=Utilities.base64Decode(f.data);
        var ext=(f.name||"").indexOf(".")>=0?(f.name||"").split(".").pop():"pdf";
        var blob=Utilities.newBlob(dec,f.type||"application/pdf",ref+"_receipt_"+Utilities.formatDate(now,"America/Jamaica","yyyyMMdd")+"."+ext);
        receiptUrl=root.createFile(blob).getUrl();
      }
    }catch(e){audit("PAY FILE ERR",ref,e.message,"System");}
  }
  fTab("Payment Schedule").appendRow([
    "",ref,data.email||"",data.studentName||"",data.programme||"",data.level||"",data.paymentPlan||"",
    "1","Payment Evidence",data.amountPaid||"",data.paymentDate||"",
    "Pending Verification","",data.amountPaid||"",receiptUrl,"","",
    (data.paymentNote||"")+(data.isFoundingMember?" | FOUNDING #"+(data.foundingMemberNumber||""):"")
  ]);
  updateField("Application Ref",ref,"Payment Status","Evidence Submitted");
  audit("PAYMENT",ref,"J$"+(data.amountPaid||"N/A")+" Plan:"+(data.paymentPlan||""),"Website");
  lifecycle(ref,"",data.studentName||"","Payment Evidence","Financial",
    "J$"+(data.amountPaid||"N/A")+" via "+(data.paymentMethod||"upload"),data.programme||"",data.level||"");
  try{MailApp.sendEmail({to:ADMIN_EMAIL,subject:"💰 Payment — "+ref,
    htmlBody:"<h2>Payment Evidence</h2><p><b>Ref:</b> "+ref+"</p><p><b>Student:</b> "+(data.studentName||"")+"</p><p><b>Amount:</b> J$"+(data.amountPaid||"N/A")+"</p><p><b>Plan:</b> "+(data.paymentPlan||"")+"</p>"+(receiptUrl?"<p><a href='"+receiptUrl+"'>View Receipt</a></p>":"")});}catch(e){}
}

function handleWiPay(data) {
  var ref=data.ref||"",st=data.wipayStatus||"";
  audit("WIPAY "+st.toUpperCase(),ref,"Txn:"+(data.transactionId||"")+" J$"+(data.totalCharged||""),"WiPay");
  if(st==="success"){
    updateField("Application Ref",ref,"Payment Status","Paid (WiPay)");
    updateField("Application Ref",ref,"Payment Reference",data.transactionId||"");
    lifecycle(ref,"","","WiPay Payment","Financial","Txn:"+(data.transactionId||"")+" J$"+(data.totalCharged||""),"","");
    try{MailApp.sendEmail({to:ADMIN_EMAIL,subject:"✅ WiPay — "+ref,
      htmlBody:"<h2>Payment Confirmed</h2><p><b>Ref:</b> "+ref+"</p><p><b>Txn:</b> "+(data.transactionId||"")+"</p><p><b>J$</b> "+(data.totalCharged||"")+"</p>"});}catch(e){}
  }
}

function handleDispute(data) {
  audit("DISPUTE",data.ref||"",data.message||"Lookup failed","Website");
  try{MailApp.sendEmail({to:ADMIN_EMAIL,subject:"⚠️ Dispute — "+(data.ref||""),
    htmlBody:"<h2>Payment Lookup Dispute</h2><p>Ref: <b>"+(data.ref||"")+"</b></p><p>"+(data.message||"")+"</p>"});}catch(e){}
}

function handleReferral(data) {
  fTab("Founding_Referrals").appendRow([data.referralCode||"","","","","","",
    data.referredName||"",data.referredEmail||"",data.referredProgramme||"","",data.referredRef||"",
    "Pending","","","No",new Date().toISOString(),""]);
  audit("REFERRAL",data.referredRef||"","Code: "+(data.referralCode||""),"Website");
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════
function updateField(matchCol,matchVal,targetCol,newVal) {
  if(!matchVal) return;
  var s=sTab("Applications"),d=s.getDataRange().getValues(),h=d[0],mi=-1,ti=-1;
  for(var i=0;i<h.length;i++){if(String(h[i]).trim()===matchCol)mi=i;if(String(h[i]).trim()===targetCol)ti=i;}
  if(mi<0||ti<0) return;
  for(var i=1;i<d.length;i++){
    if(String(d[i][mi]||"").trim().toUpperCase()===matchVal.trim().toUpperCase()){s.getRange(i+1,ti+1).setValue(newVal);return;}
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DRIP EMAIL PROCESSOR — Run daily via Time-Based Trigger
// Triggers > Add Trigger > processDripEmails > Time-driven > Day timer > 9am-10am
// ═══════════════════════════════════════════════════════════════════════
function processDripEmails() {
  loadIds();
  var s = sTab("Drip Log"), d = s.getDataRange().getValues();
  if (d.length < 2) return;
  var h = d[0], c = {};
  for (var i=0; i<h.length; i++) c[String(h[i]).trim()] = i;
  var now = new Date();

  for (var i=1; i<d.length; i++) {
    var row = d[i];
    var email = String(row[c["Email"]]||"").trim();
    var name = String(row[c["Student Name"]]||"").trim();
    var programme = String(row[c["Programme"]]||"").trim();
    var enrolled = row[c["Enrolled Date"]];
    if (!email || !enrolled) continue;

    var enrollDate = new Date(enrolled);
    var daysSince = Math.floor((now - enrollDate) / (1000*60*60*24));

    var dripMap = [
      { day: 1, col: "day1_welcome", subject: "Welcome to CTS ETS — Here's What to Expect", body: welcomeEmail(name) },
      { day: 3, col: "day3_tips", subject: "CTS ETS — Your Programme Starts With a Single Step", body: tipsEmail(name, programme) },
      { day: 7, col: "day7_checkin", subject: "CTS ETS — Your Spot is Waiting", body: checkinEmail(name) },
      { day: 14, col: "day14_encourage", subject: "CTS ETS — Last Reminder: Your Place is Still Open", body: encourageEmail(name, programme) },
    ];

    for (var j=0; j<dripMap.length; j++) {
      var drip = dripMap[j];
      if (daysSince >= drip.day && !row[c[drip.col]]) {
        try {
          GmailApp.sendEmail(email, drip.subject, "", {htmlBody: wrapDripEmail(drip.body), name: "CTS ETS"});
          s.getRange(i+1, c[drip.col]+1).setValue(new Date());
          Logger.log("Drip Day " + drip.day + " sent to: " + email);
        } catch(e) { Logger.log("Drip error Day " + drip.day + ": " + e.message); }
      }
    }
  }
}

function wrapDripEmail(content) {
  return '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">'
    + '<div style="background:#011E40;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center">'
    + '<h2 style="margin:0;font-size:18px">CTS Empowerment & Training Solutions</h2>'
    + '<p style="margin:4px 0 0;opacity:0.7;font-size:11px">Called To Serve — Excellence Through Service</p></div>'
    + '<div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:none">' + content + '</div>'
    + '<div style="background:#F7FAFC;padding:14px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">'
    + '<p style="font-size:11px;color:#A0AEC0;margin:0">CTS ETS | admin@ctsetsjm.com | 876-381-9771</p></div></body></html>';
}

function welcomeEmail(name) {
  return '<h2 style="color:#011E40">Welcome, ' + name + '!</h2>'
    + '<p style="color:#4A5568;line-height:1.7">Your application is being reviewed. Here\'s what the next few days look like:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li><strong>Today:</strong> Our admissions team is reviewing your documents</li>'
    + '<li><strong>Within 48\u201372 hours:</strong> You\'ll receive your acceptance decision</li>'
    + '<li><strong>After acceptance:</strong> Student Portal credentials sent to this email</li></ul>'
    + '<p style="color:#4A5568">In the meantime, explore what\'s waiting for you:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li>\uD83C\uDFA7 <strong>Audio Study Sessions</strong> — learn by listening, anywhere</li>'
    + '<li>\uD83E\uDD16 <strong>AI Study Assistant</strong> — ask questions 24/7</li>'
    + '<li>\uD83D\uDCDD <strong>Expert-Written Guides</strong> — clear, structured content</li></ul>'
    + '<p style="color:#4A5568">We\'re excited to have you. This is the start of something great.</p>';
}

function tipsEmail(name, prog) {
  return '<h2 style="color:#011E40">' + name + ', your ' + prog + ' journey is almost ready.</h2>'
    + '<p style="color:#4A5568;line-height:1.7">Many of our students tell us the hardest part was pressing "Apply." You\'ve already done that.</p>'
    + '<p style="color:#4A5568">Here\'s what successful CTS ETS students have in common:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li>They study 6\u201310 hours per week (at their own pace)</li>'
    + '<li>They use the Audio Study Sessions during commutes</li>'
    + '<li>They ask questions early — our WhatsApp support is available</li></ul>'
    + '<p style="color:#4A5568">Questions? Email admin@ctsetsjm.com or WhatsApp <strong>876-381-9771</strong>. We respond within 48\u201372 hours.</p>';
}

function checkinEmail(name) {
  return '<h2 style="color:#011E40">' + name + ', just checking in.</h2>'
    + '<p style="color:#4A5568;line-height:1.7">It\'s been a week since you applied. If you\'ve already paid \u2014 welcome aboard! Your Learning Portal access is on its way.</p>'
    + '<p style="color:#4A5568">If you haven\'t paid yet, your place is still reserved:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li>Pay online at <a href="https://www.ctsetsjm.com/#pay" style="color:#0E8F8B">ctsetsjm.com \u2192 Make a Payment</a></li>'
    + '<li>Need a payment plan? Gold, Silver, or Bronze \u2014 details in your acceptance email</li></ul>'
    + '<p style="color:#4A5568">We don\'t want you to miss out. If anything is holding you back, tell us \u2014 we\'re here to help.</p>';
}

function encourageEmail(name, prog) {
  return '<h2 style="color:#011E40">' + name + ', your ' + prog + ' spot is still available.</h2>'
    + '<p style="color:#4A5568;line-height:1.7">We know life gets busy. But we wanted you to know: your application is still active.</p>'
    + '<p style="color:#4A5568">Here\'s what you\'ll get when you enrol:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li>\u2705 Access to the CTS ETS Learning Portal</li>'
    + '<li>\uD83C\uDFA7 Audio Study Sessions you can listen to like a podcast</li>'
    + '<li>\uD83E\uDD16 An AI study assistant that answers your questions 24/7</li>'
    + '<li>\uD83C\uDF93 A nationally recognised NCTVET qualification</li></ul>'
    + '<p style="color:#4A5568">Ready? Visit <a href="https://www.ctsetsjm.com/#pay" style="color:#0E8F8B">ctsetsjm.com</a> to complete your payment.</p>'
    + '<p style="color:#4A5568">Not ready yet? That\'s okay. We\'ll be here when you are.</p>';
}

// ═══════════════════════════════════════════════════════════════════════
// BI-WEEKLY ENCOURAGEMENT EMAILS — Run daily via Time-Based Trigger
// Triggers > Add Trigger > processEncouragementEmails > Time-driven > Day timer
// Sends every 14 days to active enrolled students
// ═══════════════════════════════════════════════════════════════════════
function processEncouragementEmails() {
  loadIds();
  var s = sTab("Enrolled Students"), d = s.getDataRange().getValues();
  if (d.length < 2) return;
  var h = d[0], c = {};
  for (var i=0; i<h.length; i++) c[String(h[i]).trim()] = i;
  var now = new Date();

  var encouragements = [
    { subject: "Keep Going, {name}! You're Making Progress", body: encourageMsg1 },
    { subject: "{name}, Every Lesson Brings You Closer to Your Goal", body: encourageMsg2 },
    { subject: "Halfway There, {name}? Let's Keep the Momentum!", body: encourageMsg3 },
    { subject: "{name}, Your Qualification is Within Reach", body: encourageMsg4 },
    { subject: "You're Doing Great, {name} — Don't Stop Now!", body: encourageMsg5 },
    { subject: "Almost There, {name}! The Finish Line is in Sight", body: encourageMsg6 },
  ];

  for (var i=1; i<d.length; i++) {
    var row = d[i];
    var status = String(row[c["Status"]]||"").trim();
    if (status !== "Active") continue;

    var email = String(row[c["Email"]]||"").trim();
    var firstName = String(row[c["First Name"]]||"").trim();
    var programme = String(row[c["Programme"]]||"").trim();
    if (!email) continue;

    var lastSent = row[c["Last Encouragement"]];
    var count = Number(row[c["Encouragement Count"]]||0);

    // Check if 14 days since last encouragement (or enrollment if never sent)
    var lastDate = lastSent ? new Date(lastSent) : new Date(row[c["Enrolled Date"]]||now);
    var daysSince = Math.floor((now - lastDate) / (1000*60*60*24));

    if (daysSince >= 14) {
      var idx = count % encouragements.length;
      var enc = encouragements[idx];
      var subject = enc.subject.replace("{name}", firstName);
      try {
        GmailApp.sendEmail(email, subject, "", {
          htmlBody: wrapDripEmail(enc.body(firstName, programme)),
          name: "CTS ETS"
        });
        s.getRange(i+1, c["Last Encouragement"]+1).setValue(now);
        s.getRange(i+1, c["Encouragement Count"]+1).setValue(count + 1);
        Logger.log("Encouragement #" + (count+1) + " sent to: " + email);
      } catch(e) { Logger.log("Encouragement error: " + e.message); }
    }
  }
}

function encourageMsg1(name, prog) {
  return '<h2 style="color:#011E40">Keep Going, ' + name + '!</h2>'
    + '<p style="color:#4A5568;line-height:1.7">Two weeks into your ' + prog + ' programme \u2014 how are you feeling? Whether you\'ve done one lesson or ten, you\'re ahead of everyone who hasn\'t started.</p>'
    + '<p style="color:#4A5568">Remember:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li>You don\'t have to finish everything today</li>'
    + '<li>Even 15 minutes a day adds up</li>'
    + '<li>The AI Study Assistant is there for you 24/7 \u2014 ask it anything</li></ul>'
    + '<p style="color:#4A5568"><strong>You took the first step. That was the hardest part. Keep going.</strong></p>'
    + '<div style="text-align:center;margin:20px 0"><a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:12px 32px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Continue Studying</a></div>';
}

function encourageMsg2(name, prog) {
  return '<h2 style="color:#011E40">' + name + ', Every Lesson Counts</h2>'
    + '<p style="color:#4A5568;line-height:1.7">Think about where you were before you enrolled. Now think about where you\'ll be when you finish \u2014 with a nationally recognised qualification in ' + prog + '.</p>'
    + '<p style="color:#4A5568">A few tips from students who\'ve been where you are:</p>'
    + '<ul style="color:#4A5568;line-height:2"><li>\uD83C\uDFA7 Put on the audio sessions during your commute \u2014 it counts as studying</li>'
    + '<li>\uD83D\uDCDD Take the quizzes even if you\'re not sure \u2014 they help you learn faster</li>'
    + '<li>\uD83D\uDCAC If you\'re stuck, WhatsApp us at 876-381-9771</li></ul>'
    + '<p style="color:#4A5568"><strong>You\'re closer than you think.</strong></p>';
}

function encourageMsg3(name, prog) {
  return '<h2 style="color:#011E40">Momentum, ' + name + '!</h2>'
    + '<p style="color:#4A5568;line-height:1.7">By now you should be getting into a rhythm with your ' + prog + ' studies. If you are \u2014 brilliant, keep it up. If life got in the way \u2014 that\'s okay. Self-paced means you can pick up right where you left off.</p>'
    + '<p style="color:#4A5568">Quick reminder: your cohort assessment preparation days will be announced in advance. Make sure you\'re checking your email and the Learning Portal regularly.</p>'
    + '<p style="color:#4A5568"><strong>Consistency beats speed. Show up, even for 15 minutes.</strong></p>'
    + '<div style="text-align:center;margin:20px 0"><a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:12px 32px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Log Into Portal</a></div>';
}

function encourageMsg4(name, prog) {
  return '<h2 style="color:#011E40">' + name + ', Your Qualification is Within Reach</h2>'
    + '<p style="color:#4A5568;line-height:1.7">Think about what your NCTVET qualification in ' + prog + ' will mean for you \u2014 a better job, a promotion, a new career path, respect in your field.</p>'
    + '<p style="color:#4A5568">That\'s not a dream. That\'s a plan. And you\'re already executing it.</p>'
    + '<p style="color:#4A5568">If you haven\'t logged in recently, today is a great day to start again. Open one lesson. Do one quiz. That\'s all it takes to get the momentum back.</p>'
    + '<p style="color:#4A5568"><strong>We believe in you. Now prove us right.</strong></p>';
}

function encourageMsg5(name, prog) {
  return '<h2 style="color:#011E40">You\'re Doing Great, ' + name + '!</h2>'
    + '<p style="color:#4A5568;line-height:1.7">Just a quick note to remind you that we see your effort. Studying while working, managing family, juggling life \u2014 that takes real discipline.</p>'
    + '<p style="color:#4A5568">Here\'s something to think about: every module you complete is one step closer to your NVQ-J. And once you have it, nobody can take it away from you.</p>'
    + '<p style="color:#4A5568"><strong>Keep pushing, ' + name + '. The best investment you ever made was in yourself.</strong></p>'
    + '<div style="text-align:center;margin:20px 0"><a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:12px 32px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Continue Studying</a></div>';
}

function encourageMsg6(name, prog) {
  return '<h2 style="color:#011E40">The Finish Line is in Sight, ' + name + '</h2>'
    + '<p style="color:#4A5568;line-height:1.7">You\'ve come so far in your ' + prog + ' programme. Don\'t slow down now \u2014 the end is closer than you think.</p>'
    + '<p style="color:#4A5568">Remember why you started. Think about the person you\'ll be when you walk away with your qualification. That person is worth every late night and early morning.</p>'
    + '<p style="color:#4A5568"><strong>Finish strong. We\'re with you all the way.</strong></p>'
    + '<p style="color:#4A5568;font-size:13px;font-style:italic">"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." \u2014 Jeremiah 29:11</p>';
}

function audit(action,ref,details,by) {
  try{oTab("Audit Log").appendRow([new Date(),action,ref||"","",String(details||"").substring(0,80),details||"",by||"System"]);}catch(e){}
}

function lifecycle(ref,sid,name,event,cat,details,prog,level) {
  try{sTab("Student Lifecycle").appendRow([new Date(),ref||"",sid||"",name||"",event||"",cat||"",details||"","","",prog||"",level||"","System","Website"]);}catch(e){}
}
