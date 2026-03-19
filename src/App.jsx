// ═══════════════════════════════════════════════════════════════════════════
// CTS ETS — Google Apps Script v5.0
//
// WORKFLOW:
//   1. Student applies on website → App Ref assigned (CTS-2026-XXXXX)
//   2. Data + files saved to Sheet + Drive (folder/files named with App Ref)
//   3. Admin reviews → changes Status column
//   4. onEdit trigger fires → Status change email sent to student
//   5. If Status = "Accepted": Student ID generated, folder renamed, etc.
//   6. Student can check live status on website via doGet lookup
//   7. Everything logged to Audit Log
//
// SHEETS: Student Tracker | Ministry Admission Register | Audit Log | Config
// ═══════════════════════════════════════════════════════════════════════════

var SHEET_NAME = "Student Tracker";
var REGISTER_SHEET_NAME = "Ministry Admission Register";
var AUDIT_SHEET_NAME = "Audit Log";
var CONFIG_SHEET_NAME = "Config";
var DRIVE_FOLDER_ID = "1H1uE3bwPiir5-fSYI29O3DN8RO3Q-ros";
var NOTIFICATION_EMAIL = "info@ctsetsjm.com";
var ACADEMIC_YEAR_START_MONTH = 4;

// Tuition data (JMD) — keep in sync with website CALC_DATA
var TUITION_DATA = {
  "Basic Digital Literacy Skills Proficiency": 10000,
  "Customer Service Rep — Admin Asst.": 10000,
  "Customer Service Rep — Office Admin": 10000,
  "Data Entry Processor": 8000,
  "Data Entry Advanced Processor": 8000,
  "Introduction to ICT Proficiency": 8000,
  "Team Leader": 10000,
  "Industrial Security Ops Manager": 12000,
  "Data Protection Officer": 15000,
  "Human Resource Administrator": 18000,
  "Customer Service": 15000,
  "Entrepreneurship": 15000,
  "Administrative Assistance": 18000,
  "Business Administration (Secretarial)": 20000,
  "Industrial Security Operations": 20000,
  "Customer Service Supervision": 30000,
  "Business Administration Management": 30000,
  "Business Administration — Management": 30000,
  "Supervisory Management": 45000,
  "Entrepreneurship (L3)": 35000,
  "Industrial Security Operations (L3)": 40000,
  "Human Resource Management": 60000,
  "Business Administration Management (L4)": 70000,
  "Human Resource Management (L5)": 110000,
  "Business Administration Management (L5)": 150000,
};

function getTuitionForProgramme(name) {
  if (!name) return null;
  if (TUITION_DATA[name]) return TUITION_DATA[name];
  var keys = Object.keys(TUITION_DATA);
  for (var i = 0; i < keys.length; i++) {
    if (name.toLowerCase().indexOf(keys[i].toLowerCase().split(" ")[0]) > -1) return TUITION_DATA[keys[i]];
  }
  return null;
}

// Column indices (1-based) in Student Tracker
var COL = {
  STUDENT_ID: 1, APP_REF: 2, DATE: 3, FORM_TYPE: 4,
  LAST_NAME: 5, FIRST_NAME: 6, MIDDLE_NAME: 7, EMAIL: 8, PHONE: 9, TRN: 10,
  PARISH: 11, GENDER: 12, DOB: 13, ADDRESS: 14, NATIONALITY: 15,
  MARITAL: 16, SPECIAL_NEEDS: 17, SPECIAL_TYPE: 18,
  LEVEL: 19, PROGRAMME: 20, PAY_PLAN: 21,
  SECTOR: 22, ORG: 23, DEPT: 24, JOB_TITLE: 25,
  EMERG_NAME: 26, EMERG_PHONE: 27, EMERG_RELATION: 28,
  EDUCATION: 29, LAST_SCHOOL: 30, MESSAGE: 31,
  DOCS: 32, DRIVE_LINK: 33,
  STATUS: 34, PAY_STATUS: 35, PAY_REF: 36,
  ENROL_DATE: 37, CLASS_START: 38, COMPLETION: 39, NOTES: 40
};

var FILE_NAME_MAP = {
  "heartForm":"01_HEART_Application", "trn":"02_TRN", "photo":"03_Passport_Photo",
  "qualifications":"04_Qualifications", "nationalId":"05_National_ID",
  "birthCert":"06_Birth_Certificate", "paymentProof":"07_Payment_Receipt"
};

// ═══ STATUS EMAIL CONFIGURATION ══════════════════════════════════════════
// Each status has: subject, heading, message, colour, icon, nextSteps

var STATUS_EMAIL_CONFIG = {
  "Under Review": {
    subject: "Application Under Review",
    heading: "Application Under Review",
    icon: "🔍",
    colour: "#856404",
    bgColour: "#FFF3CD",
    message: "Your application is currently being reviewed by our admissions team. We will contact you within <strong>24–48 hours</strong> with an update.",
    nextSteps: [
      "Our admissions team is reviewing your application and supporting documents.",
      "You may be contacted if additional information or documents are required.",
      "Check back here or monitor your email for updates on your application status."
    ]
  },
  "Documents Needed": {
    subject: "Additional Documents Required",
    heading: "Action Required — Documents Needed",
    icon: "📎",
    colour: "#E65100",
    bgColour: "#FFE0B2",
    message: "We have reviewed your application and require <strong>additional documents</strong> before we can proceed. Please see below for details.",
    nextSteps: [
      "Review the notes below or your email for details on which documents are needed.",
      "Visit <a href='https://www.ctsetsjm.com' style='color:#C49112'>www.ctsetsjm.com</a> → Apply → <strong>Upload Documents</strong> tab to submit your documents.",
      "Please submit the required documents within <strong>7 days</strong> to avoid delays in processing your application."
    ]
  },
  "Accepted": {
    subject: "Congratulations — You Have Been Accepted!",
    heading: "Congratulations — You Have Been Accepted!",
    icon: "🎉",
    colour: "#2E7D32",
    bgColour: "#C8E6C9",
    message: "We are pleased to inform you that your application to <strong>CTS Empowerment &amp; Training Solutions</strong> has been <strong style='color:#2E7D32'>ACCEPTED</strong>.",
    nextSteps: [
      "Visit the <strong>Payment Centre</strong> at <a href='https://www.ctsetsjm.com/#apply' style='color:#C49112'>www.ctsetsjm.com</a> to make your first payment. Enter your email and your details will be auto-filled.",
      "Complete your payment within <strong>48 hours</strong> to secure your place.",
      "Your payment plan details are shown above. Gold = full payment. Silver = 50% now + 50% at midpoint. Bronze = 20% deposit + monthly instalments.",
      "Once payment is verified, you will receive access to the <strong>CTS ETS Learning Portal</strong> on Canvas.",
      "For payment queries: <a href='mailto:finance@ctsetsjm.com' style='color:#C49112'>finance@ctsetsjm.com</a> or call 876-525-6802."
    ]
  },
  "Enrolled": {
    subject: "Enrolment Confirmed — Welcome to CTS ETS!",
    heading: "Enrolment Confirmed — Welcome!",
    icon: "🎓",
    colour: "#0D47A1",
    bgColour: "#BBDEFB",
    message: "Your payment has been verified and your enrolment is now <strong style='color:#0D47A1'>CONFIRMED</strong>. Welcome to CTS Empowerment &amp; Training Solutions!",
    nextSteps: [
      "Access your course materials now on the <strong>CTS ETS Learning Portal</strong>: <a href='https://canvas.instructure.com' style='color:#C49112'>canvas.instructure.com</a>",
      "Download the <strong>Canvas Student</strong> app on your phone (iOS or Android) to study on the go.",
      "Your programme is <strong>self-paced</strong> — work through each module at your own speed.",
      "If you are on a Silver or Bronze plan, your instalment schedule has been generated. You will receive reminders before each due date.",
      "For questions: <strong>info@ctsetsjm.com</strong>. For payment queries: <strong>finance@ctsetsjm.com</strong>."
    ]
  },
  "Deferred": {
    subject: "Application Deferred",
    heading: "Application Deferred",
    icon: "⏸️",
    colour: "#6A1B9A",
    bgColour: "#E1BEE7",
    message: "Your application has been <strong>deferred</strong> to a future intake. This does not affect your eligibility — your place will be reserved for the next available intake period.",
    nextSteps: [
      "Your application remains on file and will be reconsidered for the next intake.",
      "You will be notified when the next intake opens and given priority consideration.",
      "If you have questions, please contact us at <strong>info@ctsetsjm.com</strong>."
    ]
  },
  "Withdrawn": {
    subject: "Application Withdrawn",
    heading: "Application Withdrawn",
    icon: "📋",
    colour: "#616161",
    bgColour: "#F5F5F5",
    message: "Your application has been <strong>withdrawn</strong> as per your request or due to non-completion of required steps within the specified timeframe.",
    nextSteps: [
      "If you believe this was done in error, please contact us immediately.",
      "You are welcome to reapply at any time through our website.",
      "Contact: <strong>info@ctsetsjm.com</strong> | <strong>876-525-6802</strong>"
    ]
  },
  "Completed": {
    subject: "Programme Completed — Congratulations!",
    heading: "Programme Completed — Congratulations!",
    icon: "🏆",
    colour: "#C49112",
    bgColour: "#011E40",
    message: "Congratulations on <strong>successfully completing</strong> your programme at CTS Empowerment &amp; Training Solutions! We are proud of your achievement.",
    nextSteps: [
      "Your certification details will be communicated separately.",
      "Keep an eye on your email for information about your NCTVET external assessment and certification.",
      "We wish you every success in your career. Stay connected!"
    ]
  },
  "Rejected": {
    subject: "Application Update",
    heading: "Application Not Successful",
    icon: "📨",
    colour: "#B71C1C",
    bgColour: "#FFCDD2",
    message: "After careful review, we regret to inform you that your application has <strong>not been successful</strong> at this time.",
    nextSteps: [
      "Please review the notes provided for the reason and any guidance for reapplication.",
      "You are welcome to apply again for a future intake if your circumstances change.",
      "For further information, contact us at <strong>info@ctsetsjm.com</strong>."
    ]
  }
};

// ═══ UTILITY FUNCTIONS ═══════════════════════════════════════════════════

function getOrCreateFolder(n) {
  var f = DriveApp.getFoldersByName(n); return f.hasNext() ? f.next() : DriveApp.createFolder(n);
}
function getExt(fn) {
  if (!fn) return ""; var p = fn.split("."); return p.length > 1 ? "." + p[p.length - 1].toLowerCase() : "";
}
function pad2(n) { return ("0" + n).slice(-2); }
function pad4(n) { return ("0000" + n).slice(-4); }
function getAcademicYear(d) {
  var m = d.getMonth() + 1; return m < ACADEMIC_YEAR_START_MONTH ? d.getFullYear() - 1 : d.getFullYear();
}
function timestamp() {
  return Utilities.formatDate(new Date(), "America/Jamaica", "dd MMM yyyy, hh:mm:ss a");
}

// ═══ HTML EMAIL TEMPLATES ════════════════════════════════════════════════

function emailHeader(title) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
    + '<body style="margin:0;padding:20px;background:#F5F3EE;font-family:Arial,sans-serif">'
    + '<div style="max-width:600px;margin:0 auto">'
    + '<div style="background:#011E40;padding:28px 30px;border-radius:8px 8px 0 0;text-align:center">'
    + '<div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#FFFFFF;margin-bottom:4px">CTS Empowerment &amp; Training Solutions</div>'
    + '<div style="font-size:11px;color:#C49112;letter-spacing:2px;text-transform:uppercase">Called To Serve — Committed to Excellence</div></div>'
    + '<div style="background:#C49112;padding:14px 30px;text-align:center">'
    + '<div style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#011E40">' + title + '</div></div>'
    + '<div style="padding:32px 30px;background:#FFFFFF;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0">';
}

function emailRow(label, value) {
  return '<tr>'
    + '<td style="padding:8px 12px;font-family:Arial,sans-serif;font-size:13px;color:#718096;font-weight:bold;width:160px;border-bottom:1px solid #F0F0F0">' + label + '</td>'
    + '<td style="padding:8px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;border-bottom:1px solid #F0F0F0">' + value + '</td></tr>';
}

function emailButton(text, url, colour) {
  var bg = colour || "#C49112";
  var textCol = bg === "#C49112" ? "#011E40" : "#FFFFFF";
  return '<div style="text-align:center;margin:28px 0">'
    + '<a href="' + url + '" style="display:inline-block;background:' + bg + ';color:' + textCol + ';font-family:Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.5px">' + text + '</a></div>';
}

function emailContact() {
  return '<div style="background:#F8F9FA;border-radius:8px;padding:16px 20px;margin:24px 0">'
    + '<div style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#011E40;margin-bottom:8px">Need Help?</div>'
    + '<table style="border-collapse:collapse">'
    + '<tr><td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4A5568"><strong>General:</strong> <a href="mailto:info@ctsetsjm.com" style="color:#C49112">info@ctsetsjm.com</a></td></tr>'
    + '<tr><td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4A5568"><strong>Finance:</strong> <a href="mailto:finance@ctsetsjm.com" style="color:#C49112">finance@ctsetsjm.com</a></td></tr>'
    + '<tr><td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4A5568"><strong>Phone:</strong> 876-525-6802 (Flow) &nbsp;|&nbsp; 876-381-9771 (Digicel)</td></tr>'
    + '<tr><td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4A5568"><strong>WhatsApp:</strong> 876-525-6802</td></tr>'
    + '</table></div>';
}

function emailSignature() {
  return '<div style="margin-top:24px;padding-top:16px;border-top:2px solid #C49112">'
    + '<div style="font-family:cursive,Georgia,serif;font-size:18px;color:#011E40;margin-bottom:2px">Mark O. Lindo, Ph.D</div>'
    + '<div style="font-family:Arial,sans-serif;font-size:12px;color:#718096">Founder &amp; Principal</div>'
    + '<div style="font-family:Arial,sans-serif;font-size:12px;color:#718096">CTS Empowerment &amp; Training Solutions</div></div>';
}

function emailFooter() {
  return '</div>'
    + '<div style="background:#011E40;padding:20px 30px;border-radius:0 0 8px 8px;text-align:center">'
    + '<div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.5);line-height:1.6">'
    + '6 Newark Avenue, Kingston 11, Jamaica W.I.<br>'
    + '<a href="https://www.ctsetsjm.com" style="color:#C49112;text-decoration:none">www.ctsetsjm.com</a> &nbsp;|&nbsp; info@ctsetsjm.com &nbsp;|&nbsp; finance@ctsetsjm.com<br>'
    + 'Reg. No. 16007/2025 — Companies of Jamaica</div></div></div></body></html>';
}

function findStudentFolder(mainFolder, email) {
  if (!email) return null;
  var subs = mainFolder.getFolders();
  while (subs.hasNext()) {
    var f = subs.next();
    if ((f.getDescription() || "").toLowerCase().indexOf(email.toLowerCase()) > -1) return f;
  }
  return null;
}

// ═══ STUDENT ID GENERATOR ════════════════════════════════════════════════

function getNextStudentId() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cs = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!cs) {
    cs = ss.insertSheet(CONFIG_SHEET_NAME);
    cs.getRange("A1").setValue("next_student_number"); cs.getRange("B1").setValue(1);
    cs.getRange("A2").setValue("current_intake_year"); cs.getRange("B2").setValue("");
    cs.hideSheet();
  }
  var now = new Date();
  var intakeYear = now.getFullYear();
  var stored = cs.getRange("B2").getValue();
  if (stored != intakeYear) {
    cs.getRange("B1").setValue(1);
    cs.getRange("B2").setValue(intakeYear);
  }
  var cell = cs.getRange("B1");
  var num = cell.getValue();
  if (!num || isNaN(num)) num = 1;
  cell.setValue(num + 1);
  return "CTSETS-" + intakeYear + "-" + pad2(ACADEMIC_YEAR_START_MONTH) + "-" + pad4(num);
}

// ═══ AUDIT LOG ═══════════════════════════════════════════════════════════

function getOrCreateAuditLog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(AUDIT_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(AUDIT_SHEET_NAME);
    var h = ["Timestamp", "Action", "Application Ref", "Student ID", "Student Name", "Details", "Performed By"];
    sh.getRange(1, 1, 1, h.length).setValues([h]);
    sh.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#011E40").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 180); sh.setColumnWidth(2, 180); sh.setColumnWidth(3, 150);
    sh.setColumnWidth(4, 200); sh.setColumnWidth(5, 180); sh.setColumnWidth(6, 400); sh.setColumnWidth(7, 180);
  }
  return sh;
}

function logAudit(action, appRef, studentId, studentName, details, performedBy) {
  var sh = getOrCreateAuditLog();
  sh.appendRow([timestamp(), action, appRef || "", studentId || "", studentName || "", details || "", performedBy || "System"]);
}

// ═══ SHEET SETUP ═════════════════════════════════════════════════════════

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    var h = [
      "Student ID", "Application Ref", "Date Submitted", "Form Type",
      "Last Name", "First Name", "Middle Name", "Email", "Phone", "TRN",
      "Parish", "Gender", "Date of Birth", "Address", "Nationality",
      "Marital Status", "Special Needs", "Special Needs Type",
      "Level", "Programme", "Payment Plan",
      "Sector", "Organisation", "Department", "Job Title",
      "Emergency Name", "Emergency Phone", "Emergency Relation",
      "Education", "Last School Attended", "Message",
      "Documents Uploaded", "Drive Folder Link",
      "Application Status", "Payment Status", "Payment Reference",
      "Enrolment Date", "Class Start", "Completion Date", "Notes"
    ];
    sh.getRange(1, 1, 1, h.length).setValues([h]);
    sh.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#011E40").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
    sh.setColumnWidth(COL.STUDENT_ID, 200); sh.setColumnWidth(COL.APP_REF, 150);
    sh.setColumnWidth(COL.STATUS, 130); sh.setColumnWidth(COL.PAY_STATUS, 130);
  }
  return sh;
}

function getOrCreateRegister() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(REGISTER_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(REGISTER_SHEET_NAME);
    var h = [
      "Adm. Number",
      "Date of Registration — Day", "Date of Registration — Month", "Date of Registration — Year",
      "Name in Full",
      "Date of Birth — Day", "Date of Birth — Month", "Date of Birth — Year",
      "Name of Parent or Guardian", "Residence",
      "Last School Attended — Name", "Last School Attended — Distance from School",
      "Date of Admission to Programme", "Course on Rolls", "In What Classes",
      "Attendance — R", "Attendance — I", "Attendance — II", "Attendance — III",
      "Date of Leaving School", "Cause of Leaving", "Remarks"
    ];
    sh.getRange(1, 1, 1, h.length).setValues([h]);
    sh.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#011E40").setFontColor("#FFFFFF").setWrap(true);
    sh.setFrozenRows(1); sh.setRowHeight(1, 60);
    sh.setColumnWidth(1, 200); sh.setColumnWidth(5, 250); sh.setColumnWidth(9, 200);
    sh.setColumnWidth(10, 220); sh.setColumnWidth(11, 200); sh.setColumnWidth(14, 220);
  }
  return sh;
}

// ═══ STATUS UPDATE EMAIL BUILDER ═════════════════════════════════════════
// Builds a branded email for ANY status change

function buildStatusEmail(config, studentName, appRef, studentId, level, programme, payPlan, notes) {
  var course = level + (programme ? " — " + programme : "");
  var firstName = studentName.split(" ")[0] || studentName;

  var html = emailHeader(config.heading)
    + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.8;margin:0 0 20px">Dear <strong>' + studentName + '</strong>,</p>'
    + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.8;margin:0 0 24px">' + config.message + '</p>';

  // Status badge
  var isCompleted = (config.bgColour === "#011E40");
  var badgeTextColour = isCompleted ? "#C49112" : config.colour;
  var badgeBorderColour = isCompleted ? "#C49112" : config.colour;
  html += '<div style="text-align:center;margin:24px 0">'
    + '<div style="display:inline-block;padding:12px 28px;border-radius:8px;background:' + config.bgColour + ';border:2px solid ' + badgeBorderColour + '">'
    + '<span style="font-size:18px;margin-right:8px">' + config.icon + '</span>'
    + '<span style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:' + badgeTextColour + ';letter-spacing:1px">' + config.heading.toUpperCase().replace("CONGRATULATIONS — ", "").replace("ACTION REQUIRED — ", "") + '</span>'
    + '</div></div>';

  // Student ID block (only if assigned)
  if (studentId && studentId.indexOf("CTSETS") > -1) {
    html += '<div style="background:#011E40;border-radius:8px;padding:20px 24px;margin:20px 0;text-align:center">'
      + '<div style="font-size:11px;color:#C49112;letter-spacing:3px;margin-bottom:6px">YOUR STUDENT ID</div>'
      + '<div style="font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#FFFFFF;letter-spacing:2px">' + studentId + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:6px">This is your permanent identification number — please save it</div></div>';
  }

  // Details table
  html += '<div style="background:#F8F9FA;border-left:4px solid #C49112;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0">'
    + '<table style="width:100%;border-collapse:collapse">';
  if (studentId && studentId.indexOf("CTSETS") > -1) {
    html += emailRow("Student ID", '<strong>' + studentId + '</strong>');
  }
  html += emailRow("Application Ref", '<strong>' + appRef + '</strong>')
    + emailRow("Programme", course)
    + emailRow("Payment Plan", payPlan || "To be confirmed")
    + emailRow("Status", '<strong style="color:' + config.colour + '">' + config.heading.replace("Congratulations — ", "").replace("Action Required — ", "") + '</strong>')
    + '</table></div>';

  // Notes from admin (if any)
  if (notes) {
    html += '<div style="background:#FFF8E1;border-left:4px solid #F59E0B;padding:14px 18px;border-radius:0 8px 8px 0;margin:16px 0">'
      + '<div style="font-family:Georgia,serif;font-size:13px;font-weight:bold;color:#011E40;margin-bottom:6px">Notes from Admissions</div>'
      + '<p style="font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.7;margin:0">' + notes + '</p></div>';
  }

  // Next steps
  if (config.nextSteps && config.nextSteps.length > 0) {
    html += '<div style="margin:24px 0"><div style="font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#011E40;margin-bottom:14px">Your Next Steps</div>'
      + '<table style="width:100%;border-collapse:collapse">';
    for (var i = 0; i < config.nextSteps.length; i++) {
      html += '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0;vertical-align:top;width:30px"><strong>' + (i+1) + '.</strong></td>'
        + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0">' + config.nextSteps[i] + '</td></tr>';
    }
    html += '</table></div>';
  }

  // CTA button based on status
  var heading = config.heading.toLowerCase();
  if (heading.indexOf("accepted") > -1) {
    html += emailButton("Go to Payment Centre \u2192", "https://www.ctsetsjm.com/#apply");
  } else if (heading.indexOf("enrolled") > -1 || heading.indexOf("confirmed") > -1) {
    html += emailButton("Access Learning Portal \u2192", "https://canvas.instructure.com", "#2E7D32");
  } else if (heading.indexOf("documents") > -1) {
    html += emailButton("Upload Documents \u2192", "https://www.ctsetsjm.com/#apply");
  } else {
    html += emailButton("Visit CTS ETS \u2192", "https://www.ctsetsjm.com");
  }

  // Warm closing
  html += '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.7;margin:20px 0 0">We are here to support you every step of the way, ' + firstName + '.</p>';

  html += emailSignature() + emailContact() + emailFooter();
  return html;
}

// ═══ HANDLE WEB SUBMISSIONS ══════════════════════════════════════════════

function doPost(e) {
  try {
    var raw;
    if (e.parameter && e.parameter.payload) { raw = e.parameter.payload; }
    else { raw = e.postData.contents; }
    var data = JSON.parse(raw);
    var formType = data.form_type || "Unknown";
    var sheet = getOrCreateSheet();
    var mainFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var appRef = data.ref || ("CTS-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000));
    var now = new Date();
    var dateStr = Utilities.formatDate(now, "America/Jamaica", "dd MMM yyyy, hh:mm a");

    var existingStudentId = "";
    var isReturning = false;
    if (data.email) {
      var allData = sheet.getDataRange().getValues();
      for (var r = 1; r < allData.length; r++) {
        if (allData[r][COL.EMAIL - 1] && allData[r][COL.EMAIL - 1].toString().toLowerCase() === data.email.toLowerCase()) {
          existingStudentId = allData[r][COL.STUDENT_ID - 1] || "";
          isReturning = true;
          break;
        }
      }
    }

    var studentFolder;
    if (isReturning) { studentFolder = findStudentFolder(mainFolder, data.email); }
    if (!studentFolder) {
      var last = (data.lastName || "UNKNOWN").toUpperCase().trim();
      var first = (data.firstName || "").trim();
      if (first.length > 0) first = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
      var folderName = last + ", " + first + " — " + appRef;
      studentFolder = mainFolder.createFolder(folderName);
      studentFolder.setDescription("Email:" + (data.email || "") + " | Ref:" + appRef);
    }

    var prefix = existingStudentId || appRef;
    var fileNames = [];
    if (data.files && data.files.length > 0) {
      for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.data && f.slot) {
          try {
            var sn = FILE_NAME_MAP[f.slot] || ("99_" + f.slot);
            var ext = getExt(f.originalName || f.name || "file.bin");
            var finalName = prefix + "_" + sn + ext;
            var ex = studentFolder.getFilesByName(finalName);
            while (ex.hasNext()) ex.next().setTrashed(true);
            var decoded = Utilities.base64Decode(f.data);
            var blob = Utilities.newBlob(decoded, f.type || "application/octet-stream", finalName);
            studentFolder.createFile(blob);
            fileNames.push(finalName);
          } catch (err) { fileNames.push((f.slot || "?") + " (error)"); }
        }
      }
    }

    sheet.appendRow([
      existingStudentId, appRef, dateStr, formType,
      (data.lastName || "").toUpperCase(), data.firstName || "", data.middleName || "",
      data.email || "", data.phone || "", data.trn || "", data.parish || "",
      data.gender || "", data.dob || "", data.address || "",
      data.nationality || "", data.maritalStatus || "", data.specialNeeds || "", data.specialNeedsType || "",
      data.level || "", data.programme || "", data.paymentPlan || "",
      data.sector || "", data.orgName || "", data.department || "", data.jobTitle || "",
      data.emergencyName || "", data.emergencyPhone || "", data.emergencyRelation || "",
      data.education || "", data.lastSchool || "", data.message || "",
      fileNames.join(", "), studentFolder.getUrl(),
      formType === "Payment Evidence" ? "Payment Received" : "Under Review",
      formType === "Payment Evidence" ? "Evidence Uploaded" : "Pending",
      data.paymentRef || "",
      "", "", "",
      formType === "Payment Evidence" ? "Payment evidence uploaded " + dateStr : "Application received " + dateStr
    ]);

    var studentName = ((data.firstName || "") + " " + (data.lastName || "")).trim();
    logAudit(
      formType === "Payment Evidence" ? "PAYMENT EVIDENCE UPLOADED" : "APPLICATION RECEIVED",
      appRef, existingStudentId, studentName,
      "Form: " + formType + " | Programme: " + (data.level || "") + " — " + (data.programme || "") + " | Files: " + fileNames.join(", "),
      "Website (Auto)"
    );

    // Log to Student Lifecycle
    try {
      if (formType === "Payment Evidence") {
        logPaymentEvidence(appRef, existingStudentId, studentName, data.email || "", data.amount || "", data.level || "", data.programme || "");
      } else {
        logNewApplication(appRef, studentName, data.email || "", data.level || "", data.programme || "", data.sector || "");
      }
    } catch (lcErr) { Logger.log("Lifecycle log error: " + lcErr); }

    // Email to ADMIN
    try {
      var subj = formType === "Payment Evidence"
        ? "💳 Payment — " + studentName + " (" + appRef + ")"
        : "📋 New Application — " + studentName + " (" + appRef + ")";
      var adminHtml = emailHeader("New " + formType)
        + '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">'
        + emailRow("Application Ref", appRef)
        + emailRow("Name", studentName)
        + emailRow("Email", data.email || "N/A")
        + emailRow("Phone", data.phone || "N/A")
        + emailRow("TRN", data.trn || "N/A")
        + emailRow("Level", data.level || "N/A")
        + emailRow("Programme", data.programme || "N/A")
        + emailRow("Payment Plan", data.paymentPlan || "N/A")
        + emailRow("Documents", fileNames.length > 0 ? fileNames.join(", ") : "None")
        + emailRow("Drive Folder", '<a href="' + studentFolder.getUrl() + '" style="color:#C49112">Open Folder</a>')
        + emailRow("Date", dateStr)
        + '</table>'
        + (isReturning ? '<p style="color:#E65100;font-weight:bold;font-family:Arial,sans-serif;font-size:14px">⚠️ RETURNING STUDENT — ' + existingStudentId + '</p>' : '')
        + emailFooter();
      MailApp.sendEmail({ to: NOTIFICATION_EMAIL, subject: subj, body: subj, htmlBody: adminHtml });
    } catch (me) { Logger.log("Admin mail error: " + me); }

    // Confirmation email TO STUDENT (application only)
    if (data.email && formType !== "Payment Evidence") {
      try {
        var firstName = (data.firstName || studentName.split(" ")[0] || "").trim();
        var studentHtml = emailHeader("Application Received")
          + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.8;margin:0 0 20px">Dear <strong>' + studentName + '</strong>,</p>'
          + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.8;margin:0 0 24px">Thank you for applying to <strong>CTS Empowerment &amp; Training Solutions</strong>. Your application has been received and is now under review.</p>'
          + '<div style="background:#F8F9FA;border-left:4px solid #C49112;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0">'
          + '<table style="width:100%;border-collapse:collapse">'
          + emailRow("Application Reference", '<strong style="font-size:16px;letter-spacing:1px">' + appRef + '</strong>')
          + emailRow("Programme", (data.level || "") + " — " + (data.programme || ""))
          + emailRow("Payment Plan", data.paymentPlan || "To be confirmed")
          + emailRow("Date Submitted", dateStr)
          + '</table></div>'
          + '<div style="margin:24px 0"><div style="font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#011E40;margin-bottom:14px">Your Next Steps</div>'
          + '<table style="width:100%;border-collapse:collapse">'
          + '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0;vertical-align:top;width:30px"><strong>1.</strong></td>'
          + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0">Our admissions team will review your application and documents within <strong>24\u201348 hours</strong>.</td></tr>'
          + '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0;vertical-align:top"><strong>2.</strong></td>'
          + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0">Upon acceptance, you will receive your <strong>permanent Student ID</strong> and payment instructions via email.</td></tr>'
          + '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;vertical-align:top"><strong>3.</strong></td>'
          + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6">Complete your payment within <strong>48 hours</strong> to secure your place in the programme.</td></tr>'
          + '</table></div>'
          + emailButton("Track My Application \u2192", "https://www.ctsetsjm.com/#apply")
          + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.7;margin:20px 0 0">We look forward to welcoming you to CTS ETS, ' + firstName + '.</p>'
          + emailSignature() + emailContact() + emailFooter();
        MailApp.sendEmail({
          to: data.email, subject: "CTS ETS \u2014 Application Received (" + appRef + ")",
          body: "Dear " + studentName + ", your application " + appRef + " has been received.",
          htmlBody: studentHtml, name: "CTS ETS Admissions", replyTo: NOTIFICATION_EMAIL
        });
      } catch (se) { Logger.log("Student mail error: " + se); }
    }

    // Payment evidence confirmation email
    if (data.email && formType === "Payment Evidence") {
      try {
        var payFirstName = (data.firstName || studentName.split(" ")[0] || "").trim();
        var payHtml = emailHeader("Payment Evidence Received")
          + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.8;margin:0 0 20px">Dear <strong>' + studentName + '</strong>,</p>'
          + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.8;margin:0 0 24px">Thank you. Your payment evidence has been received and is being reviewed by our Finance Department.</p>'
          + '<div style="background:#F8F9FA;border-left:4px solid #C49112;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0">'
          + '<table style="width:100%;border-collapse:collapse">'
          + emailRow("Application Reference", '<strong>' + appRef + '</strong>')
          + emailRow("Payment Reference", '<strong>' + (data.paymentRef || data.applicationRef || "Not provided") + '</strong>')
          + emailRow("Programme", (data.level || "") + (data.programme ? " \u2014 " + data.programme : ""))
          + emailRow("Amount", data.amount ? "JMD $" + Number(data.amount).toLocaleString() : "As submitted")
          + emailRow("Date Received", dateStr)
          + '</table></div>'
          + '<div style="margin:24px 0"><div style="font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#011E40;margin-bottom:14px">What Happens Next</div>'
          + '<table style="width:100%;border-collapse:collapse">'
          + '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0;vertical-align:top;width:30px"><strong>1.</strong></td>'
          + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0">Our Finance Department will verify your payment within <strong>24\u201348 hours</strong>.</td></tr>'
          + '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0;vertical-align:top"><strong>2.</strong></td>'
          + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;border-bottom:1px solid #F0F0F0">Once confirmed, your status will be updated to <strong>Enrolled</strong>.</td></tr>'
          + '<tr><td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6;vertical-align:top"><strong>3.</strong></td>'
          + '<td style="padding:10px 12px;font-family:Arial,sans-serif;font-size:14px;color:#2D3748;line-height:1.6">You will receive access to the <strong>CTS ETS Learning Portal</strong> on Canvas to begin your programme.</td></tr>'
          + '</table></div>'
          + emailButton("Track My Application \u2192", "https://www.ctsetsjm.com/#apply")
          + '<p style="font-family:Arial,sans-serif;font-size:15px;color:#2D3748;line-height:1.7;margin:20px 0 0">Thank you for your commitment to your professional development, ' + payFirstName + '.</p>'
          + emailSignature() + emailContact() + emailFooter();
        MailApp.sendEmail({
          to: data.email, subject: "CTS ETS \u2014 Payment Evidence Received",
          body: "Dear " + studentName + ", your payment evidence has been received.",
          htmlBody: payHtml, name: "CTS ETS Finance", replyTo: "finance@ctsetsjm.com"
        });
      } catch (pe) { Logger.log("Payment mail error: " + pe); }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true, ref: appRef
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost error: " + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false, error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══ SITE ANALYTICS SHEET ═══════════════════════════════════════════════

function getOrCreateAnalyticsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Site Analytics");
  if (!sh) {
    sh = ss.insertSheet("Site Analytics");
    var headers = ["Timestamp", "Date", "Page", "Referrer", "Device"];
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#011E40").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
  }
  return sh;
}

// ═══ HANDLE STATUS LOOKUPS FROM WEBSITE ══════════════════════════════════
// GET ?action=lookup&email=student@email.com
// Returns: { found, applications: [...] } — all applications for this email
// GET ?action=status&email=student@email.com — same but focused on status tracking

function doGet(e) {
  var params = e ? e.parameter : {};

  // Status lookup (supports both "lookup" and "status" actions)
  if ((params.action === "lookup" || params.action === "status") && params.email) {
    try {
      var email = params.email.toLowerCase().trim();
      var sheet = getOrCreateSheet();
      var allData = sheet.getDataRange().getValues();

      var applications = [];
      for (var r = 1; r < allData.length; r++) {
        var rowEmail = (allData[r][COL.EMAIL - 1] || "").toString().toLowerCase().trim();
        var formType = (allData[r][COL.FORM_TYPE - 1] || "").toString();
        if (rowEmail === email && formType !== "Payment Evidence") {
          applications.push({
            studentId: allData[r][COL.STUDENT_ID - 1] || "",
            ref: allData[r][COL.APP_REF - 1] || "",
            name: ((allData[r][COL.FIRST_NAME - 1] || "") + " " + (allData[r][COL.LAST_NAME - 1] || "")).trim(),
            level: allData[r][COL.LEVEL - 1] || "",
            programme: allData[r][COL.PROGRAMME - 1] || "",
            payPlan: allData[r][COL.PAY_PLAN - 1] || "",
            status: allData[r][COL.STATUS - 1] || "Under Review",
            payStatus: allData[r][COL.PAY_STATUS - 1] || "",
            submittedAt: allData[r][COL.DATE - 1] ? Utilities.formatDate(new Date(allData[r][COL.DATE - 1]), "America/Jamaica", "dd MMM yyyy") : "",
          });
        }
      }

      if (applications.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({ found: false })).setMimeType(ContentService.MimeType.JSON);
      }

      // For backward compatibility with Payment Centre (which expects single result)
      var latest = applications[applications.length - 1];
      var result = {
        found: true,
        studentId: latest.studentId,
        ref: latest.ref,
        name: latest.name,
        level: latest.level,
        programme: latest.programme,
        status: latest.status,
        payStatus: latest.payStatus,
        payPlan: latest.payPlan,
        submittedAt: latest.submittedAt,
        applications: applications
      };

      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      Logger.log("Lookup error: " + err);
      return ContentService.createTextOutput(JSON.stringify({
        found: false, error: err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ── ANALYTICS: Track page view ──
  if (params.action === "track") {
    try {
      var analyticsSheet = getOrCreateAnalyticsSheet();
      var page = params.page || "Home";
      var ref = params.ref || "";
      var device = params.device || "";
      var ts = Utilities.formatDate(new Date(), "America/Jamaica", "yyyy-MM-dd HH:mm:ss");
      var dateOnly = Utilities.formatDate(new Date(), "America/Jamaica", "yyyy-MM-dd");
      analyticsSheet.appendRow([ts, dateOnly, page, ref, device]);
      return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ── ANALYTICS: Read data for admin panel ──
  if (params.action === "analytics" && params.key === "ctsadmin2026") {
    try {
      var aSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Site Analytics");
      if (!aSheet || aSheet.getLastRow() < 2) {
        return ContentService.createTextOutput(JSON.stringify({ views: [], summary: {} })).setMimeType(ContentService.MimeType.JSON);
      }
      var aData = aSheet.getRange(2, 1, aSheet.getLastRow() - 1, 5).getValues();
      var now = new Date();
      var todayStr = Utilities.formatDate(now, "America/Jamaica", "yyyy-MM-dd");
      var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      var weekStr = Utilities.formatDate(weekAgo, "America/Jamaica", "yyyy-MM-dd");
      var monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      var monthStr = Utilities.formatDate(monthAgo, "America/Jamaica", "yyyy-MM-dd");

      var today = 0, week = 0, month = 0, total = aData.length;
      var pageCount = {}, dailyCounts = {}, deviceCount = {}, refCount = {};

      for (var a = 0; a < aData.length; a++) {
        var date = (aData[a][1] || "").toString();
        var pg = (aData[a][2] || "").toString();
        var rf = (aData[a][3] || "").toString();
        var dv = (aData[a][4] || "").toString();

        if (date === todayStr) today++;
        if (date >= weekStr) week++;
        if (date >= monthStr) month++;

        pageCount[pg] = (pageCount[pg] || 0) + 1;
        if (date >= weekStr) { dailyCounts[date] = (dailyCounts[date] || 0) + 1; }
        if (dv) deviceCount[dv] = (deviceCount[dv] || 0) + 1;
        if (rf) refCount[rf] = (refCount[rf] || 0) + 1;
      }

      return ContentService.createTextOutput(JSON.stringify({
        summary: { today: today, week: week, month: month, total: total },
        pages: pageCount,
        daily: dailyCounts,
        devices: deviceCount,
        referrers: refCount,
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Default health check
  return ContentService.createTextOutput(JSON.stringify({
    status: "CTS ETS v5.0 running"
  })).setMimeType(ContentService.MimeType.JSON);
}

// ═══ ON EDIT TRIGGER — STATUS CHANGE WORKFLOW ════════════════════════════
// When Status column changes:
//   - Send branded status update email to student
//   - If "Accepted": also generate Student ID, rename folder, etc.
//   - Log everything to Audit

function onEdit(e) {
  var sh = e.source.getActiveSheet();
  if (sh.getName() !== SHEET_NAME) return;

  var range = e.range;
  var col = range.getColumn();
  var row = range.getRow();
  if (row <= 1) return;

  // ──── NAME CHANGE DETECTION ────
  if (col === COL.FIRST_NAME || col === COL.LAST_NAME || col === COL.MIDDLE_NAME) {
    var newName = (range.getValue() || "").toString().trim();
    var oldName = (e.oldValue || "").toString().trim();
    if (newName !== oldName) {
      try {
        var nameRowData = sh.getRange(row, 1, 1, COL.NOTES).getValues()[0];
        var nAppRef = nameRowData[COL.APP_REF - 1] || "";
        var nStudentId = nameRowData[COL.STUDENT_ID - 1] || "";
        var nFullOld = oldName;
        var nFullNew = ((nameRowData[COL.FIRST_NAME - 1] || "") + " " + (nameRowData[COL.MIDDLE_NAME - 1] || "") + " " + (nameRowData[COL.LAST_NAME - 1] || "")).replace(/\s+/g, " ").trim();
        var colLabel = col === COL.FIRST_NAME ? "First Name" : col === COL.LAST_NAME ? "Last Name" : "Middle Name";
        logAudit("NAME CHANGED", nAppRef, nStudentId, nFullNew, colLabel + " changed from '" + oldName + "' to '" + newName + "'", Session.getActiveUser().getEmail());
        logNameChange(nAppRef, nStudentId, nFullOld, nFullNew, Session.getActiveUser().getEmail());
      } catch (ncErr) { Logger.log("Name change log error: " + ncErr); }
    }
    return;
  }

  // Only trigger remaining logic on Status column
  if (col !== COL.STATUS) return;

  var newVal = (range.getValue() || "").toString().trim();
  var oldVal = (e.oldValue || "").toString().trim();

  // Skip if no actual change
  if (newVal.toLowerCase() === oldVal.toLowerCase()) return;

  // Read the full row
  var rowData = sh.getRange(row, 1, 1, COL.NOTES).getValues()[0];
  var existingId = rowData[COL.STUDENT_ID - 1] || "";
  var appRef = rowData[COL.APP_REF - 1] || "";
  var lastName = rowData[COL.LAST_NAME - 1] || "";
  var firstName = rowData[COL.FIRST_NAME - 1] || "";
  var middleName = rowData[COL.MIDDLE_NAME - 1] || "";
  var email = rowData[COL.EMAIL - 1] || "";
  var phone = rowData[COL.PHONE - 1] || "";
  var dob = rowData[COL.DOB - 1] || "";
  var address = rowData[COL.ADDRESS - 1] || "";
  var parish = rowData[COL.PARISH - 1] || "";
  var level = rowData[COL.LEVEL - 1] || "";
  var programme = rowData[COL.PROGRAMME - 1] || "";
  var payPlan = rowData[COL.PAY_PLAN - 1] || "";
  var emergName = rowData[COL.EMERG_NAME - 1] || "";
  var emergRelation = rowData[COL.EMERG_RELATION - 1] || "";
  var lastSchool = rowData[COL.LAST_SCHOOL - 1] || "";
  var notes = rowData[COL.NOTES - 1] || "";
  var studentName = (firstName + " " + lastName).trim();

  // ──── ACCEPTANCE-SPECIFIC WORKFLOW ────
  if (newVal.toLowerCase() === "accepted") {
    // Skip if already has a Student ID
    if (existingId && existingId.toString().indexOf("CTSETS") > -1) {
      logAudit("ACCEPTANCE SKIPPED (already has ID)", appRef, existingId, studentName, "Student already has ID " + existingId, Session.getActiveUser().getEmail());
      // Still send the email even if already has ID
    } else {
      // 1. Generate Student ID
      var studentId = getNextStudentId();
      sh.getRange(row, COL.STUDENT_ID).setValue(studentId);
      existingId = studentId;

      logAudit("STUDENT ID ASSIGNED", appRef, studentId, studentName,
        "Application " + appRef + " accepted. Student ID " + studentId + " generated. Previous status: " + oldVal,
        Session.getActiveUser().getEmail());

      // Log to Student Lifecycle
      try {
        logStudentIdAssigned(appRef, studentId, studentName, level, programme, Session.getActiveUser().getEmail());
      } catch (lcErr) { Logger.log("Lifecycle log error: " + lcErr); }

      // 2. Rename folder
      var mainFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      var studentFolder = findStudentFolder(mainFolder, email);
      if (studentFolder) {
        var oldFolderName = studentFolder.getName();
        var last = (lastName || "UNKNOWN").toUpperCase().trim();
        var first = (firstName || "").trim();
        if (first.length > 0) first = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
        var newFolderName = last + ", " + first + " — " + studentId;
        studentFolder.setName(newFolderName);
        studentFolder.setDescription("Email:" + email + " | StudentID:" + studentId + " | Ref:" + appRef);

        logAudit("FOLDER RENAMED", appRef, studentId, studentName,
          "From: " + oldFolderName + " → To: " + newFolderName,
          Session.getActiveUser().getEmail());

        // 3. Rename all files
        var files = studentFolder.getFiles();
        while (files.hasNext()) {
          var file = files.next();
          var oldName = file.getName();
          if (oldName.indexOf(appRef) === 0) {
            var newName = oldName.replace(appRef, studentId);
            file.setName(newName);
            logAudit("FILE RENAMED", appRef, studentId, studentName,
              "From: " + oldName + " → To: " + newName,
              Session.getActiveUser().getEmail());
          }
        }
      }

      // 4. Add to Ministry Admission Register
      var regSheet = getOrCreateRegister();
      var now = new Date();
      var dobD = "", dobM = "", dobY = "";
      if (dob) {
        var dp = dob.toString();
        if (dp.indexOf("-") > -1) { var parts = dp.split("-"); dobY = parts[0]; dobM = parts[1]; dobD = parts[2]; }
      }
      var fullName = lastName.toUpperCase() + ", " + firstName;
      if (middleName) fullName += " " + middleName;
      var guardian = emergName;
      if (emergRelation) guardian += " (" + emergRelation + ")";
      var course = level + (programme ? " — " + programme : "");
      var residence = address + (parish ? ", " + parish : "");

      regSheet.appendRow([
        studentId,
        pad2(now.getDate()), pad2(now.getMonth() + 1), now.getFullYear(),
        fullName.trim(),
        dobD, dobM, dobY,
        guardian, residence, lastSchool, "",
        "", course, level,
        "", "", "", "",
        "", "", ""
      ]);

      logAudit("MINISTRY REGISTER ENTRY", appRef, studentId, studentName,
        "Added to Ministry Admission Register. Programme: " + course,
        Session.getActiveUser().getEmail());
    }
  }

  // ──── SEND STATUS UPDATE EMAIL (for ALL status changes) ────
  var config = STATUS_EMAIL_CONFIG[newVal];
  if (config && email) {
    try {
      var statusHtml = buildStatusEmail(config, studentName, appRef, existingId, level, programme, payPlan, notes);
      var emailSubject = "CTS ETS — " + config.subject;
      if (existingId && existingId.indexOf("CTSETS") > -1) {
        emailSubject += " (" + existingId + ")";
      } else {
        emailSubject += " (" + appRef + ")";
      }

      MailApp.sendEmail({
        to: email,
        subject: emailSubject,
        body: "Dear " + studentName + ", your application status has been updated to: " + newVal,
        htmlBody: statusHtml,
        name: "CTS ETS Admissions",
        replyTo: NOTIFICATION_EMAIL
      });

      logAudit("STATUS EMAIL SENT (" + newVal.toUpperCase() + ")", appRef, existingId, studentName,
        "Status changed from '" + oldVal + "' to '" + newVal + "'. Email sent to " + email,
        Session.getActiveUser().getEmail());

    } catch (mailErr) {
      logAudit("STATUS EMAIL FAILED (" + newVal.toUpperCase() + ")", appRef, existingId, studentName,
        "Error: " + mailErr,
        Session.getActiveUser().getEmail());
    }
  } else if (!config) {
    // Unknown status — just log it
    logAudit("STATUS CHANGED (no email template)", appRef, existingId, studentName,
      "Status changed from '" + oldVal + "' to '" + newVal + "'. No email template configured for this status.",
      Session.getActiveUser().getEmail());
  } else if (!email) {
    logAudit("STATUS CHANGED (no email on file)", appRef, existingId, studentName,
      "Status changed from '" + oldVal + "' to '" + newVal + "'. No email address on file — email not sent.",
      Session.getActiveUser().getEmail());
  }

  // Log ALL status changes to Student Lifecycle
  try {
    logStatusChange(appRef, existingId, studentName, oldVal, newVal, level, programme, Session.getActiveUser().getEmail());
  } catch (lcErr) { Logger.log("Lifecycle log error: " + lcErr); }

  // Auto-generate instalment schedule when enrolled on Silver/Bronze
  if (newVal.toLowerCase() === "enrolled" && (payPlan === "Silver" || payPlan === "Bronze")) {
    try {
      var enrolDate = sh.getRange(row, COL.ENROL_DATE).getValue() || new Date();
      // Look up tuition from TUITION_DATA
      var tuition = getTuitionForProgramme(programme) || 45000;
      generateInstalments(existingId, appRef, email, studentName, programme, level, payPlan, tuition, enrolDate);
    } catch (payErr) { Logger.log("Instalment generation error: " + payErr); }
  }

  // Auto-enrol in Canvas LMS when status changes to Enrolled
  if (newVal.toLowerCase() === "enrolled" && email) {
    try {
      autoEnrolInCanvas(email, firstName, lastName, programme, appRef, existingId, level);
    } catch (canvasErr) { Logger.log("Canvas enrolment error: " + canvasErr); }
    // Register for welcome drip campaign
    try {
      var enrolDate = sh.getRange(row, COL.ENROL_DATE).getValue() || new Date();
      registerForDrip(existingId, appRef, email, studentName, programme, level, enrolDate);
    } catch (dripErr) { Logger.log("Drip registration error: " + dripErr); }
    // Generate Welcome Packet PDF
    try {
      generateWelcomePacket(existingId, appRef, email, studentName, programme, level, payPlan);
    } catch (wpErr) { Logger.log("Welcome Packet error: " + wpErr); }
  }

  // Auto-generate certificate when status changes to Completed
  if (newVal.toLowerCase() === "completed") {
    try {
      var completionDate = sh.getRange(row, COL.COMPLETION).getValue() || new Date();
      onCompletionTrigger(existingId, appRef, email, studentName, programme, level);
    } catch (certErr) { Logger.log("Certificate generation error: " + certErr); }
    // Draft LinkedIn celebration post
    try {
      draftLinkedInPost(studentName, programme, level);
    } catch (liErr) { Logger.log("LinkedIn draft error: " + liErr); }
  }

  // Update notes
  var existingNotes = sh.getRange(row, COL.NOTES).getValue() || "";
  sh.getRange(row, COL.NOTES).setValue(
    "Status → " + newVal + " on " + timestamp() + ". " + existingNotes
  );
}

// ═══ STUDENT ID CARD GENERATOR ═══════════════════════════════════════════

function generateStudentIdCard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) { SpreadsheetApp.getUi().alert("Select a student row first."); return; }

  var vals = sheet.getRange(row, 1, 1, COL.NOTES).getValues()[0];
  var studentId = vals[COL.STUDENT_ID - 1];
  var appRef = vals[COL.APP_REF - 1];
  if (!studentId) { SpreadsheetApp.getUi().alert("No Student ID. Accept the student first (set Status to 'Accepted')."); return; }

  var lastName = vals[COL.LAST_NAME - 1] || "";
  var firstName = vals[COL.FIRST_NAME - 1] || "";
  var middleName = vals[COL.MIDDLE_NAME - 1] || "";
  var email = vals[COL.EMAIL - 1] || "";
  var level = vals[COL.LEVEL - 1] || "";
  var programme = vals[COL.PROGRAMME - 1] || "";
  var enrolDate = vals[COL.ENROL_DATE - 1] || "";
  var classStart = vals[COL.CLASS_START - 1] || "";
  var fullName = firstName + (middleName ? " " + middleName : "") + " " + lastName.toUpperCase();
  var period = (enrolDate && classStart) ? enrolDate + " — " + classStart : enrolDate ? "From: " + enrolDate : "To be confirmed";

  var mainFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var studentFolder = findStudentFolder(mainFolder, email);
  var photoData = "";
  if (studentFolder) {
    var exts = [".jpg", ".jpeg", ".png"];
    for (var ei = 0; ei < exts.length; ei++) {
      var photos = studentFolder.getFilesByName(studentId + "_03_Passport_Photo" + exts[ei]);
      if (photos.hasNext()) {
        var pb = photos.next().getBlob();
        photoData = "data:" + pb.getContentType() + ";base64," + Utilities.base64Encode(pb.getBytes());
        break;
      }
    }
  }

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8">'
    + '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;font-family:"DM Sans",sans-serif;gap:32px}'
    + '.card{width:3.375in;height:2.125in;border-radius:8px;overflow:hidden;position:relative;box-shadow:0 4px 20px rgba(0,0,0,0.15);page-break-inside:avoid}'
    + '.front{background:#011E40;color:#fff;padding:12px 16px;display:flex;flex-direction:column;height:100%}'
    + '.back{background:#FAFAF7;color:#011E40;padding:14px 16px;display:flex;flex-direction:column;height:100%}'
    + '.sig{font-family:"Dancing Script",cursive;font-size:16px;color:#011E40}'
    + '@media print{body{background:#fff}.card{box-shadow:none;border:1px solid #ccc}}</style></head><body>'
    + '<div class="card"><div class="front">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
    + '<div style="width:28px;height:28px;border-radius:4px;background:rgba(196,145,18,0.15);display:flex;align-items:center;justify-content:center;font-size:8px;color:#C49112;font-weight:800;font-family:Playfair Display">CTS</div>'
    + '<div><div style="font-family:Playfair Display;font-size:9px;font-weight:700">CTS Empowerment &amp; Training Solutions</div>'
    + '<div style="font-size:6px;color:#C49112;letter-spacing:1px;margin-top:1px">CALLED TO SERVE — COMMITTED TO EXCELLENCE</div></div></div>'
    + '<div style="width:100%;height:1px;background:rgba(196,145,18,0.3);margin-bottom:8px"></div>'
    + '<div style="display:flex;gap:12px;flex:1;align-items:center">'
    + (photoData ? '<img src="' + photoData + '" style="width:60px;height:70px;object-fit:cover;border-radius:4px;border:1.5px solid #C49112">' : '<div style="width:60px;height:70px;border-radius:4px;border:1.5px solid #C49112;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,0.4)">PHOTO</div>')
    + '<div style="flex:1">'
    + '<div style="font-family:Playfair Display;font-size:12px;font-weight:800;margin-bottom:4px;line-height:1.2">' + fullName + '</div>'
    + '<div style="font-size:7px;color:#C49112;letter-spacing:1.5px;margin-bottom:6px">STUDENT ID</div>'
    + '<div style="font-family:Playfair Display;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:6px">' + studentId + '</div>'
    + '<div style="font-size:7px;color:rgba(255,255,255,0.5);line-height:1.4">' + level + (programme ? " — " + programme : "") + '</div>'
    + '</div></div>'
    + '<div style="margin-top:auto;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center">'
    + '<div style="font-size:6px;color:rgba(255,255,255,0.4)">' + period + '</div>'
    + '<div style="font-size:6px;color:rgba(255,255,255,0.4)">ctsetsjm.com</div>'
    + '</div></div></div>'
    + '<div class="card"><div class="back">'
    + '<div style="text-align:center;margin-bottom:10px">'
    + '<div style="font-family:Playfair Display;font-size:10px;font-weight:700;color:#011E40;margin-bottom:2px">CTS Empowerment &amp; Training Solutions</div>'
    + '<div style="font-size:6px;color:#C49112;letter-spacing:1px">STUDENT IDENTIFICATION CARD</div></div>'
    + '<div style="font-size:7px;color:#4A5568;line-height:1.6;margin-bottom:8px;text-align:center">'
    + 'This card certifies that the holder is a registered student of CTS Empowerment &amp; Training Solutions. This card remains the property of CTS ETS and must be surrendered upon request.</div>'
    + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;padding:6px 8px;background:rgba(1,30,64,0.03);border-radius:4px">'
    + '<div><div style="font-size:6px;color:#4A5568;letter-spacing:1px">STUDENT ID</div><div style="font-size:9px;font-weight:700;color:#011E40">' + studentId + '</div></div>'
    + '<div style="text-align:right"><div style="font-size:6px;color:#4A5568;letter-spacing:1px">VALID PERIOD</div><div style="font-size:8px;font-weight:600;color:#011E40">' + period + '</div></div></div>'
    + '<div style="margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end">'
    + '<div><div style="width:100px;border-bottom:1px solid #011E40;margin-bottom:2px"></div>'
    + '<div class="sig">Mark O. Lindo, Ph.D</div>'
    + '<div style="font-size:6px;color:#4A5568">Founder &amp; Principal</div></div>'
    + '<div style="text-align:right;font-size:6px;color:#4A5568;line-height:1.5">'
    + '6 Newark Avenue, Kingston 11<br>info@ctsetsjm.com<br>876-525-6802<br>Reg. 16007/2025</div>'
    + '</div></div></div>'
    + '<button onclick="window.print()" style="padding:10px 24px;border-radius:6px;background:#011E40;color:#fff;border:none;font-size:14px;font-weight:700;cursor:pointer;font-family:DM Sans">Print ID Card</button>'
    + '</body></html>';

  if (studentFolder) {
    var cardName = studentId + "_Student_ID_Card.html";
    var ex = studentFolder.getFilesByName(cardName);
    while (ex.hasNext()) ex.next().setTrashed(true);
    studentFolder.createFile(cardName, html, MimeType.HTML);
  }

  logAudit("ID CARD GENERATED", appRef, studentId, fullName, "Student ID card created and saved to Drive", Session.getActiveUser().getEmail());

  var output = HtmlService.createHtmlOutput(html).setWidth(420).setHeight(600).setTitle("ID Card — " + fullName);
  SpreadsheetApp.getUi().showModalDialog(output, "Student ID Card — " + studentId);
}

// ═══ PROGRAMME CODES REFERENCE SHEET ═════════════════════════════════════

function getOrCreateProgrammeCodes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Programme Codes");
  if (sh) return sh;

  sh = ss.insertSheet("Programme Codes");
  var headers = ["#", "Level", "Programme Name", "Abbreviation", "Course Code", "Duration", "Tuition (JMD)", "Canvas ID", "Canvas State", "Notes"];
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#011E40").setFontColor("#FFFFFF");
  sh.setFrozenRows(1);

  var data = [
    // Job Certificates
    [1,  "Job Certificate", "Introduction to ICT Proficiency",             "ICTP", "CTSETS-JC-ICTP-FEB2026-01", "2 months",   8000,   "14200093", "Published", "First course — live"],
    [2,  "Job Certificate", "Basic Digital Literacy Skills Proficiency",    "BDLS", "CTSETS-JC-BDLS-APR2026-01", "3 months",   10000,  "", "", ""],
    [3,  "Job Certificate", "Customer Service Rep — Admin Asst.",           "CSRA", "CTSETS-JC-CSRA-APR2026-01", "3 months",   10000,  "", "", ""],
    [4,  "Job Certificate", "Customer Service Rep — Office Admin",          "CSRO", "CTSETS-JC-CSRO-APR2026-01", "3 months",   10000,  "", "", ""],
    [5,  "Job Certificate", "Data Entry Processor",                         "DEP",  "CTSETS-JC-DEP-APR2026-01",  "2 months",   8000,   "", "", ""],
    [6,  "Job Certificate", "Data Entry Advanced Processor",                "DEAP", "CTSETS-JC-DEAP-APR2026-01", "2 months",   8000,   "", "", ""],
    [7,  "Job Certificate", "Team Leader",                                  "TL",   "CTSETS-JC-TL-APR2026-01",   "2.5 months", 10000,  "", "", ""],
    [8,  "Job Certificate", "Industrial Security Ops Manager",              "ISOM", "CTSETS-JC-ISOM-APR2026-01", "3 months",   12000,  "", "", ""],
    [9,  "Job Certificate", "Data Protection Officer",                      "DPO",  "CTSETS-JC-DPO-APR2026-01",  "3 months",   15000,  "", "", ""],
    [10, "Job Certificate", "Human Resource Administrator",                 "HRA",  "CTSETS-JC-HRA-APR2026-01",  "4 months",   18000,  "", "", ""],
    // Level 2
    [11, "Level 2 — Vocational Certificate", "Customer Service",                     "CS",  "CTSETS-L2-CS-APR2026-01",  "6 months", 15000,  "", "", ""],
    [12, "Level 2 — Vocational Certificate", "Entrepreneurship",                     "ENT", "CTSETS-L2-ENT-APR2026-01", "6 months", 15000,  "", "", ""],
    [13, "Level 2 — Vocational Certificate", "Administrative Assistance",            "AA",  "CTSETS-L2-AA-APR2026-01",  "6 months", 18000,  "", "", ""],
    [14, "Level 2 — Vocational Certificate", "Business Administration (Secretarial)","BAS", "CTSETS-L2-BAS-APR2026-01", "6 months", 20000,  "", "", ""],
    [15, "Level 2 — Vocational Certificate", "Industrial Security Operations",       "ISO", "CTSETS-L2-ISO-APR2026-01", "6 months", 20000,  "", "", ""],
    // Level 3
    [16, "Level 3 — Diploma", "Customer Service",                     "CS",  "CTSETS-L3-CS-APR2026-01",  "7 months", 25000,  "", "", ""],
    [17, "Level 3 — Diploma", "Customer Service Supervision",         "CSS", "CTSETS-L3-CSS-APR2026-01", "7 months", 30000,  "", "", ""],
    [18, "Level 3 — Diploma", "Business Administration Management",   "BAM", "CTSETS-L3-BAM-APR2026-01", "7 months", 30000,  "", "", ""],
    [19, "Level 3 — Diploma", "Entrepreneurship",                     "ENT", "CTSETS-L3-ENT-APR2026-01", "7 months", 35000,  "", "", ""],
    [20, "Level 3 — Diploma", "Industrial Security Operations",       "ISO", "CTSETS-L3-ISO-APR2026-01", "7 months", 40000,  "", "", ""],
    [21, "Level 3 — Diploma", "Supervisory Management",               "SM",  "CTSETS-L3-SM-APR2026-01",  "7 months", 45000,  "", "", ""],
    // Level 4
    [22, "Level 4 — Associate Equivalent", "Human Resource Management",           "HRM", "CTSETS-L4-HRM-APR2026-01", "8 months",  60000,  "", "", ""],
    [23, "Level 4 — Associate Equivalent", "Business Administration Management",  "BAM", "CTSETS-L4-BAM-APR2026-01", "9 months",  70000,  "", "", ""],
    // Level 5
    [24, "Level 5 — Bachelor's Equivalent", "Human Resource Management",          "HRM", "CTSETS-L5-HRM-APR2026-01", "6 months",  110000, "", "", ""],
    [25, "Level 5 — Bachelor's Equivalent", "Business Administration Management", "BAM", "CTSETS-L5-BAM-APR2026-01", "9 months",  150000, "", "", ""],
  ];

  sh.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Column widths
  sh.setColumnWidth(1, 40);   // #
  sh.setColumnWidth(2, 220);  // Level
  sh.setColumnWidth(3, 300);  // Programme Name
  sh.setColumnWidth(4, 80);   // Abbreviation
  sh.setColumnWidth(5, 250);  // Course Code
  sh.setColumnWidth(6, 100);  // Duration
  sh.setColumnWidth(7, 110);  // Tuition
  sh.setColumnWidth(8, 110);  // Canvas ID
  sh.setColumnWidth(9, 100);  // Canvas State
  sh.setColumnWidth(10, 200); // Notes

  // Colour-code levels
  var levelColours = {
    "Job Certificate": ["#FFF3CD", "#856404"],
    "Level 2": ["#E3F2FD", "#1565C0"],
    "Level 3": ["#C8E6C9", "#2E7D32"],
    "Level 4": ["#E1BEE7", "#6A1B9A"],
    "Level 5": ["#011E40", "#C49112"],
  };
  for (var i = 0; i < data.length; i++) {
    var lvl = data[i][1];
    var keys = Object.keys(levelColours);
    var key = null;
    for (var k = 0; k < keys.length; k++) {
      if (lvl.indexOf(keys[k]) > -1) { key = keys[k]; break; }
    }
    if (key) {
      sh.getRange(i + 2, 1, 1, headers.length).setBackground(levelColours[key][0]).setFontColor(levelColours[key][1]);
    }
  }

  // Bold the abbreviation and course code columns
  sh.getRange(2, 4, data.length, 1).setFontWeight("bold");
  sh.getRange(2, 5, data.length, 1).setFontWeight("bold").setFontFamily("Courier New");

  // Number format for tuition
  sh.getRange(2, 7, data.length, 1).setNumberFormat("$#,##0");

  Logger.log("Programme Codes sheet created with " + data.length + " programmes.");
  return sh;
}

// ═══ MENU + SETUP ════════════════════════════════════════════════════════

function onOpen() {
  buildFullMenu();
}

function initialSetup() {
  var sheet = getOrCreateSheet();
  getOrCreateRegister();
  getOrCreateAuditLog();
  getOrCreateLifecycleSheet();
  getOrCreatePaymentSchedule();
  getOrCreateProgrammeCodes();
  DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cs = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!cs) {
    cs = ss.insertSheet(CONFIG_SHEET_NAME);
    cs.getRange("A1").setValue("next_student_number"); cs.getRange("B1").setValue(1);
    cs.getRange("A2").setValue("current_academic_year"); cs.getRange("B2").setValue(getAcademicYear(new Date()));
    cs.hideSheet();
  }

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Under Review", "Documents Needed", "Accepted", "Enrolled", "Deferred", "Withdrawn", "Completed", "Rejected"], true)
    .setAllowInvalid(false).build();
  sheet.getRange(2, COL.STATUS, 500, 1).setDataValidation(statusRule);

  var payRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending", "Evidence Uploaded", "Verified", "Confirmed", "Overdue", "Refunded"], true)
    .setAllowInvalid(false).build();
  sheet.getRange(2, COL.PAY_STATUS, 500, 1).setDataValidation(payRule);

  var statusRange = sheet.getRange(2, COL.STATUS, 500, 1);
  var statusColours = [
    ["Under Review",     "#FFF3CD", "#856404"],
    ["Documents Needed", "#FFE0B2", "#E65100"],
    ["Accepted",         "#C8E6C9", "#2E7D32"],
    ["Enrolled",         "#BBDEFB", "#0D47A1"],
    ["Deferred",         "#E1BEE7", "#6A1B9A"],
    ["Withdrawn",        "#F5F5F5", "#616161"],
    ["Completed",        "#011E40", "#C49112"],
    ["Rejected",         "#FFCDD2", "#B71C1C"]
  ];
  for (var i = 0; i < statusColours.length; i++) {
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(statusColours[i][0]).setBackground(statusColours[i][1])
      .setFontColor(statusColours[i][2]).setBold(true).setRanges([statusRange]).build();
    var rules = sheet.getConditionalFormatRules(); rules.push(rule); sheet.setConditionalFormatRules(rules);
  }

  var payRange = sheet.getRange(2, COL.PAY_STATUS, 500, 1);
  var payColours = [
    ["Pending",          "#FFF3CD", "#856404"],
    ["Evidence Uploaded", "#E3F2FD", "#1565C0"],
    ["Verified",         "#FFF9C4", "#F57F17"],
    ["Confirmed",        "#C8E6C9", "#2E7D32"],
    ["Overdue",          "#FFCDD2", "#B71C1C"],
    ["Refunded",         "#F5F5F5", "#616161"]
  ];
  for (var j = 0; j < payColours.length; j++) {
    var pRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(payColours[j][0]).setBackground(payColours[j][1])
      .setFontColor(payColours[j][2]).setBold(true).setRanges([payRange]).build();
    var pRules = sheet.getConditionalFormatRules(); pRules.push(pRule); sheet.setConditionalFormatRules(pRules);
  }

  Logger.log("Setup complete. Dropdowns added. 4 sheets + Drive folder ready.");
  Logger.log("Academic year: " + getAcademicYear(new Date()));

  var triggers = ScriptApp.getProjectTriggers();
  var hasEditTrigger = false;
  for (var t = 0; t < triggers.length; t++) {
    if (triggers[t].getHandlerFunction() === "onEdit" && triggers[t].getEventType() === ScriptApp.EventType.ON_EDIT) {
      hasEditTrigger = true; break;
    }
  }
  if (!hasEditTrigger) {
    ScriptApp.newTrigger("onEdit").forSpreadsheet(ss).onEdit().create();
    Logger.log("Edit trigger installed for acceptance workflow.");
  }
}
