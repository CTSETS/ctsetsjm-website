// ═══════════════════════════════════════════════════════════════════════
// CTS ETS — MULTI-SHEET APPS SCRIPT BACKEND v2
// ═══════════════════════════════════════════════════════════════════════
// SETUP: Create a new Google Sheet (Master Dashboard), paste this into
// Extensions > Apps Script > Code.gs, then run setupAllSheets().
// This auto-creates 4 child sheets with all tabs + headers.
// ═══════════════════════════════════════════════════════════════════════

var ADMIN_EMAIL = "ctsetsgroup@gmail.com";
var ADMIN_BACKUP_EMAIL = ""; // Put a personal Gmail here as backup (e.g. "mark@gmail.com")
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
  // If students_id is missing, use the host spreadsheet (container-bound)
  if (!SHEET_IDS.students) {
    try {
      var host = SpreadsheetApp.getActiveSpreadsheet();
      if (host) {
        SHEET_IDS.students = host.getId();
        SHEET_IDS.master = SHEET_IDS.master || host.getId();
        p.setProperty("students_id", SHEET_IDS.students);
        p.setProperty("master_id", SHEET_IDS.master);
        Logger.log("Auto-detected students_id from host spreadsheet: " + SHEET_IDS.students);
      }
    } catch(e) { Logger.log("Could not auto-detect host: " + e.message); }
  }
}
function tab(sheetId, name) {
  if (!sheetId) throw new Error("Sheet ID is empty for tab: " + name + ". Run setupAllSheets or check Script Properties.");
  var ss = SpreadsheetApp.openById(sheetId);
  var s = ss.getSheetByName(name);
  return s || ss.insertSheet(name);
}
function sTab(n) { loadIds(); return tab(SHEET_IDS.students, n); }
function fTab(n) { loadIds(); return tab(SHEET_IDS.finance, n); }
function oTab(n) { loadIds(); return tab(SHEET_IDS.operations, n); }
function aTab(n) { loadIds(); return tab(SHEET_IDS.academic, n); }

// Run this to check what's connected
function diagnose() {
  loadIds();
  Logger.log("═══ CTS ETS DIAGNOSTICS ═══");
  Logger.log("master_id:     " + (SHEET_IDS.master || "❌ EMPTY"));
  Logger.log("students_id:   " + (SHEET_IDS.students || "❌ EMPTY"));
  Logger.log("finance_id:    " + (SHEET_IDS.finance || "❌ EMPTY"));
  Logger.log("operations_id: " + (SHEET_IDS.operations || "❌ EMPTY"));
  Logger.log("academic_id:   " + (SHEET_IDS.academic || "❌ EMPTY"));
  
  var checks = [
    ["Students", SHEET_IDS.students, "Applications"],
    ["Students", SHEET_IDS.students, "Enrolled Students"],
    ["Finance", SHEET_IDS.finance, "Payment Schedule"],
    ["Operations", SHEET_IDS.operations, "Audit Log"],
    ["Academic", SHEET_IDS.academic, "Certificates"],
  ];
  for (var i = 0; i < checks.length; i++) {
    var c = checks[i];
    try {
      if (!c[1]) { Logger.log("❌ " + c[0] + " → " + c[2] + " — ID is empty"); continue; }
      var ss = SpreadsheetApp.openById(c[1]);
      var s = ss.getSheetByName(c[2]);
      Logger.log(s ? "✅ " + c[0] + " → " + c[2] + " — OK" : "⚠️ " + c[0] + " → " + c[2] + " — tab not found");
    } catch(e) {
      Logger.log("❌ " + c[0] + " → " + c[2] + " — " + e.message);
    }
  }
  Logger.log("═══ END DIAGNOSTICS ═══");
}

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
  makeTab(s1,"Applications",["Application Ref","Date Submitted","Applicant Type","First Name","Last Name","Middle Name","Maiden Name","Email","Phone","Phone 2","TRN","NIS","Parish","Country","Gender","Date of Birth","Address","District","Postal Zone","Nationality","Marital Status","Special Needs","Special Needs Type","Highest Qualification","School Last Attended","Year Completed","Employment Status","Employer","Job Title","Industry","Years Experience","Emergency Name","Emergency Phone","Emergency Relationship","Emergency 2 Name","Emergency 2 Phone","Emergency 2 Relationship","Previous HEART","Level","Programme","Payment Plan","Hear About Us","Message","Documents Uploaded","Drive Folder Link","Photo URL","Status","Notes"]);
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
    .requireValueInList(["Pending Payment","Enrolled","Active","On Hold","Completed","Graduated","Withdrawn"], true)
    .setAllowInvalid(false).build();
  enrolled.getRange(2, statusCol2, 499, 1).setDataValidation(rule2);

  // LMS Access Yes/No dropdown
  var lmsCol = -1;
  for (var i=0; i<h2.length; i++) { if (String(h2[i]).trim() === "LMS Access") { lmsCol = i+1; break; } }
  if (lmsCol > 0) {
    var lmsRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Yes","No"], true)
      .setAllowInvalid(false).build();
    enrolled.getRange(2, lmsCol, 499, 1).setDataValidation(lmsRule);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ROW COLORING — Conditional formatting based on status column
// ═══════════════════════════════════════════════════════════════════════
function applyStatusColors(sheet, statusCol) {
  if (!sheet || statusCol < 1) return;
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(2, 1, 499, lastCol);
  sheet.clearConditionalFormatRules();
  var rules = [];
  var colorMap = [
    {status: "Under Review",     bg: "#FFF8E1", text: "#F57F17"},
    {status: "Accepted",         bg: "#E8F5E9", text: "#2E7D32"},
    {status: "Pending Payment",  bg: "#E3F2FD", text: "#1565C0"},
    {status: "Rejected",         bg: "#FFEBEE", text: "#C62828"},
    {status: "Withdrawn",        bg: "#F3E5F5", text: "#6A1B9A"},
    {status: "Deferred",         bg: "#ECEFF1", text: "#546E7A"},
    {status: "Enrolled",         bg: "#E8F5E9", text: "#2E7D32"},
    {status: "Active",           bg: "#E0F7FA", text: "#00695C"},
    {status: "On Hold",          bg: "#FFF3E0", text: "#E65100"},
    {status: "Completed",        bg: "#F1F8E9", text: "#33691E"},
    {status: "Graduated",        bg: "#FFFDE7", text: "#F9A825"},
  ];
  for (var i = 0; i < colorMap.length; i++) {
    var c = colorMap[i];
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$' + columnLetter(statusCol) + '2="' + c.status + '"')
      .setBackground(c.bg)
      .setFontColor(c.text)
      .setRanges([range])
      .build();
    rules.push(rule);
  }
  sheet.setConditionalFormatRules(rules);
}

function columnLetter(col) {
  var letter = "";
  while (col > 0) {
    var rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

// Run manually to apply colors to existing sheets
function reapplyColors() {
  loadIds();
  var ss = SpreadsheetApp.openById(SHEET_IDS.students);
  var apps = ss.getSheetByName("Applications");
  var enrolled = ss.getSheetByName("Enrolled Students");
  if (apps) {
    var h = apps.getRange(1,1,1,apps.getLastColumn()).getValues()[0];
    for (var i=0;i<h.length;i++) { if (String(h[i]).trim()==="Status") { applyStatusColors(apps, i+1); break; } }
  }
  if (enrolled) {
    var h2 = enrolled.getRange(1,1,1,enrolled.getLastColumn()).getValues()[0];
    for (var i=0;i<h2.length;i++) { if (String(h2[i]).trim()==="Status") { applyStatusColors(enrolled, i+1); break; } }
  }
  Logger.log("Status colors applied");
}

// ═══════════════════════════════════════════════════════════════════════
// DAILY SUMMARY REPORT — Set up trigger: sendDailySummary, Time-driven, 7-8am
// ═══════════════════════════════════════════════════════════════════════
function sendDailySummary() {
  loadIds();
  var today = new Date();
  var yesterday = new Date(today.getTime() - 86400000);
  var dateStr = Utilities.formatDate(today, "America/Jamaica", "EEEE, dd MMM yyyy");

  // Count Applications by status
  var apps = sTab("Applications"), ad = apps.getDataRange().getValues(), ah = ad[0], ac = {};
  for (var i=0; i<ah.length; i++) ac[String(ah[i]).trim()] = i;
  var statusCounts = {}, newApps = [], totalApps = 0;
  for (var i=1; i<ad.length; i++) {
    if (!ad[i][ac["Application Ref"]]) continue;
    totalApps++;
    var st = String(ad[i][ac["Status"]]||"Under Review").trim();
    statusCounts[st] = (statusCounts[st]||0) + 1;
    var submitted = ad[i][ac["Date Submitted"]];
    if (submitted && new Date(submitted) >= yesterday) {
      newApps.push({ ref: ad[i][ac["Application Ref"]]||"", name: (ad[i][ac["First Name"]]||"") + " " + (ad[i][ac["Last Name"]]||""), programme: ad[i][ac["Programme"]]||"", level: ad[i][ac["Level"]]||"", status: st });
    }
  }

  // Count Enrolled by status + financials
  var es = sTab("Enrolled Students"), ed = es.getDataRange().getValues(), eh = ed[0], ec = {};
  for (var i=0; i<eh.length; i++) ec[String(eh[i]).trim()] = i;
  var enrolledCounts = {}, totalEnrolled = 0, totalRevenue = 0, totalOutstanding = 0;
  for (var i=1; i<ed.length; i++) {
    if (!ed[i][ec["Student Number"]]) continue;
    totalEnrolled++;
    var est = String(ed[i][ec["Status"]]||"").trim();
    enrolledCounts[est] = (enrolledCounts[est]||0) + 1;
    totalRevenue += Number(ed[i][ec["Total Paid"]]||0);
    totalOutstanding += Number(ed[i][ec["Outstanding"]]||0);
  }

  // Recent lifecycle events (last 24h)
  var lc = sTab("Student Lifecycle"), ld = lc.getDataRange().getValues(), lh = ld[0], lcc = {};
  for (var i=0; i<lh.length; i++) lcc[String(lh[i]).trim()] = i;
  var recentEvents = [];
  for (var i=1; i<ld.length; i++) {
    var evDate = ld[i][lcc["Date/Time"]];
    if (evDate && new Date(evDate) >= yesterday) {
      recentEvents.push({ time: Utilities.formatDate(new Date(evDate), "America/Jamaica", "h:mm a"), student: ld[i][lcc["Student Name"]]||"", event: ld[i][lcc["Event Type"]]||"", details: String(ld[i][lcc["Details"]]||"").substring(0,60) });
    }
  }

  var statusBar = function(label, count, color, total) {
    var pct = total > 0 ? Math.round(count/total*100) : 0;
    return '<tr><td style="padding:4px 8px;font-size:12px">' + label + '</td><td style="padding:4px 8px;font-size:12px;font-weight:700;text-align:right">' + count + '</td><td style="padding:4px 8px;width:50%"><div style="background:#eee;border-radius:4px;height:18px;overflow:hidden"><div style="background:' + color + ';height:100%;width:' + pct + '%;min-width:' + (count>0?'2px':'0') + ';border-radius:4px"></div></div></td></tr>';
  };

  // New apps table
  var newAppsHtml = "";
  if (newApps.length > 0) {
    newAppsHtml = '<table style="width:100%;border-collapse:collapse;margin:8px 0"><tr style="background:#011E40"><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Ref</th><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Name</th><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Programme</th><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Status</th></tr>';
    for (var i=0; i<newApps.length; i++) { var a = newApps[i]; newAppsHtml += '<tr style="background:' + (i%2===0?"#f8f9fa":"#fff") + '"><td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #eee">' + a.ref + '</td><td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #eee;font-weight:600">' + a.name + '</td><td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #eee">' + a.level + ' \u2014 ' + a.programme + '</td><td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #eee">' + a.status + '</td></tr>'; }
    newAppsHtml += '</table>';
  } else { newAppsHtml = '<p style="color:#999;font-size:12px;padding:8px">No new applications in the last 24 hours.</p>'; }

  // Recent events table
  var eventsHtml = "";
  if (recentEvents.length > 0) {
    eventsHtml = '<table style="width:100%;border-collapse:collapse;margin:8px 0"><tr style="background:#011E40"><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Time</th><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Student</th><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Event</th><th style="padding:6px 8px;color:#D4A843;font-size:11px;text-align:left">Details</th></tr>';
    for (var i=0; i<Math.min(recentEvents.length,15); i++) { var ev = recentEvents[i]; eventsHtml += '<tr style="background:' + (i%2===0?"#f8f9fa":"#fff") + '"><td style="padding:4px 8px;font-size:11px;border-bottom:1px solid #eee">' + ev.time + '</td><td style="padding:4px 8px;font-size:11px;border-bottom:1px solid #eee">' + ev.student + '</td><td style="padding:4px 8px;font-size:11px;border-bottom:1px solid #eee">' + ev.event + '</td><td style="padding:4px 8px;font-size:11px;border-bottom:1px solid #eee">' + ev.details + '</td></tr>'; }
    if (recentEvents.length > 15) eventsHtml += '<tr><td colspan="4" style="padding:6px 8px;font-size:11px;color:#999">... and ' + (recentEvents.length-15) + ' more events</td></tr>';
    eventsHtml += '</table>';
  } else { eventsHtml = '<p style="color:#999;font-size:12px;padding:8px">No activity in the last 24 hours.</p>'; }

  var html = '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;background:#f5f5f5;padding:20px">'
    + '<div style="background:#011E40;padding:20px 24px;border-radius:12px 12px 0 0;text-align:center">'
    + '<h1 style="color:#D4A843;font-size:20px;margin:0">CTS ETS Daily Summary</h1>'
    + '<p style="color:rgba(255,255,255,0.6);font-size:12px;margin:6px 0 0">' + dateStr + '</p></div>'
    + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none">'
    // Key Metrics
    + '<table style="width:100%;border-collapse:separate;border-spacing:8px 0"><tr>'
    + '<td style="background:#E3F2FD;border-radius:8px;padding:14px;text-align:center;width:33%"><div style="font-size:28px;font-weight:800;color:#1565C0">' + totalApps + '</div><div style="font-size:10px;color:#1565C0;font-weight:600">TOTAL APPS</div></td>'
    + '<td style="background:#E8F5E9;border-radius:8px;padding:14px;text-align:center;width:33%"><div style="font-size:28px;font-weight:800;color:#2E7D32">' + totalEnrolled + '</div><div style="font-size:10px;color:#2E7D32;font-weight:600">ENROLLED</div></td>'
    + '<td style="background:#FFFDE7;border-radius:8px;padding:14px;text-align:center;width:33%"><div style="font-size:28px;font-weight:800;color:#F57F17">' + newApps.length + '</div><div style="font-size:10px;color:#F57F17;font-weight:600">NEW (24H)</div></td>'
    + '</tr></table>'
    // Revenue
    + '<table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin-top:8px"><tr>'
    + '<td style="background:#E8F5E9;border-radius:8px;padding:12px;text-align:center;width:50%"><div style="font-size:11px;color:#2E7D32;font-weight:600">TOTAL REVENUE</div><div style="font-size:22px;font-weight:800;color:#2E7D32;margin-top:4px">J$' + totalRevenue.toLocaleString() + '</div></td>'
    + '<td style="background:' + (totalOutstanding > 0 ? "#FFF3E0" : "#E8F5E9") + ';border-radius:8px;padding:12px;text-align:center;width:50%"><div style="font-size:11px;color:' + (totalOutstanding > 0 ? "#E65100" : "#2E7D32") + ';font-weight:600">OUTSTANDING</div><div style="font-size:22px;font-weight:800;color:' + (totalOutstanding > 0 ? "#E65100" : "#2E7D32") + ';margin-top:4px">J$' + totalOutstanding.toLocaleString() + '</div></td>'
    + '</tr></table>'
    // Application Pipeline
    + '<h3 style="color:#011E40;font-size:14px;margin:16px 0 8px;border-bottom:2px solid #011E40;padding-bottom:6px">Application Pipeline</h3>'
    + '<table style="width:100%">'
    + statusBar("Under Review", statusCounts["Under Review"]||0, "#FFC107", totalApps)
    + statusBar("Accepted", statusCounts["Accepted"]||0, "#4CAF50", totalApps)
    + statusBar("Pending Payment", statusCounts["Pending Payment"]||0, "#2196F3", totalApps)
    + statusBar("Rejected", statusCounts["Rejected"]||0, "#F44336", totalApps)
    + statusBar("Withdrawn", statusCounts["Withdrawn"]||0, "#9C27B0", totalApps)
    + statusBar("Deferred", statusCounts["Deferred"]||0, "#78909C", totalApps)
    + '</table>'
    // Enrolled Breakdown
    + '<h3 style="color:#011E40;font-size:14px;margin:16px 0 8px;border-bottom:2px solid #011E40;padding-bottom:6px">Enrolled Students</h3>'
    + '<table style="width:100%">'
    + statusBar("Enrolled", enrolledCounts["Enrolled"]||0, "#4CAF50", totalEnrolled)
    + statusBar("Active", enrolledCounts["Active"]||0, "#009688", totalEnrolled)
    + statusBar("On Hold", enrolledCounts["On Hold"]||0, "#FF9800", totalEnrolled)
    + statusBar("Graduated", enrolledCounts["Graduated"]||0, "#D4A843", totalEnrolled)
    + statusBar("Completed", enrolledCounts["Completed"]||0, "#8BC34A", totalEnrolled)
    + statusBar("Withdrawn", enrolledCounts["Withdrawn"]||0, "#9C27B0", totalEnrolled)
    + '</table>'
    // New Applications
    + '<h3 style="color:#011E40;font-size:14px;margin:16px 0 8px;border-bottom:2px solid #011E40;padding-bottom:6px">\uD83D\uDCE5 New Applications (Last 24 Hours)</h3>'
    + newAppsHtml
    // Recent Activity
    + '<h3 style="color:#011E40;font-size:14px;margin:16px 0 8px;border-bottom:2px solid #011E40;padding-bottom:6px">\u26A1 Recent Activity</h3>'
    + eventsHtml
    // Action Items
    + '<div style="margin-top:20px;padding:14px;background:#FFF8E1;border-radius:8px;border-left:4px solid #F57F17">'
    + '<div style="font-size:12px;font-weight:700;color:#F57F17;margin-bottom:6px">\u26A0\uFE0F Action Required</div>'
    + '<ul style="font-size:12px;color:#333;line-height:1.8;margin:0;padding-left:20px">'
    + (statusCounts["Under Review"]>0 ? '<li><strong>' + statusCounts["Under Review"] + ' application(s)</strong> awaiting review</li>' : '')
    + (totalOutstanding>0 ? '<li><strong>J$' + totalOutstanding.toLocaleString() + '</strong> outstanding fees to collect</li>' : '')
    + ((statusCounts["Under Review"]||0)===0 && totalOutstanding===0 ? '<li style="color:#2E7D32">All clear! No pending actions.</li>' : '')
    + '</ul></div></div>'
    + '<div style="background:#F7FAFC;padding:12px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">'
    + '<p style="font-size:10px;color:#A0AEC0;margin:0">CTS Empowerment & Training Solutions | admin@ctsetsjm.com | 876-525-6802</p></div></body></html>';

  var subject = "CTS ETS Daily Summary \u2014 " + dateStr + " \u2014 " + totalApps + " apps, " + totalEnrolled + " enrolled, " + newApps.length + " new";
  var plain = "CTS ETS Daily Summary: " + totalApps + " apps, " + totalEnrolled + " enrolled, " + newApps.length + " new, J$" + totalRevenue.toLocaleString() + " revenue, J$" + totalOutstanding.toLocaleString() + " outstanding.";
  try { GmailApp.sendEmail(ADMIN_EMAIL, subject, plain, {htmlBody: html, name: "CTS ETS Reports"}); Logger.log("Daily summary sent to: " + ADMIN_EMAIL); } catch(e) { Logger.log("Daily summary error: " + e.message); }
  if (ADMIN_BACKUP_EMAIL) { try { GmailApp.sendEmail(ADMIN_BACKUP_EMAIL, subject, plain, {htmlBody: html, name: "CTS ETS Reports"}); } catch(e) {} }
}

// ═══════════════════════════════════════════════════════════════════════
// TRIGGER INSTALLER — Run this ONCE to set up the onEdit trigger
// on the correct spreadsheet (Student Records, not Master)
// ═══════════════════════════════════════════════════════════════════════
function installOnEditTrigger() {
  loadIds();
  // Delete any existing onEditTrigger triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "onEditTrigger") {
      ScriptApp.deleteTrigger(triggers[i]);
      Logger.log("Deleted old onEditTrigger");
    }
  }
  // Install on the Student Records spreadsheet
  var ss = SpreadsheetApp.openById(SHEET_IDS.students);
  ScriptApp.newTrigger("onEditTrigger")
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  Logger.log("onEditTrigger installed on: " + ss.getName() + " (" + SHEET_IDS.students + ")");
}

// ═══════════════════════════════════════════════════════════════════════
// ON-EDIT TRIGGER — Installed on Student Records spreadsheet
// Watches:
//   Applications → "Accepted" → auto-enrolls with Pending Payment
//   Enrolled Students → "Enrolled" → unlocks LMS, sends confirmation
//   Enrolled Students → "Graduated" → logs completion
// ═══════════════════════════════════════════════════════════════════════
function onEditTrigger(e) {
  try {
    var sheet = e.source.getActiveSheet();
    var sheetName = sheet.getName();
    
    var range = e.range;
    var row = range.getRow();
    if (row < 2) return;

    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    var colMap = {};
    for (var i=0; i<headers.length; i++) colMap[String(headers[i]).trim()] = i;

    var statusCol = colMap["Status"];
    if (statusCol === undefined) return;
    if (range.getColumn() !== statusCol + 1) return;

    var newStatus = String(e.value || "").trim();
    var oldStatus = String(e.oldValue || "").trim();

    if (sheetName === "Applications") {
      if (newStatus === "Accepted" && oldStatus !== "Accepted") {
        enrollStudent(sheet, row, headers, colMap);
      }
    }
    
    if (sheetName === "Enrolled Students") {
      var rowData = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
      var ref = String(rowData[colMap["Application Ref"]]||"").trim();
      var studentNum = String(rowData[colMap["Student Number"]]||"").trim();
      var firstName = String(rowData[colMap["First Name"]]||"").trim();
      var lastName = String(rowData[colMap["Last Name"]]||"").trim();
      var email = String(rowData[colMap["Email"]]||"").trim();
      var programme = String(rowData[colMap["Programme"]]||"").trim();
      var level = String(rowData[colMap["Level"]]||"").trim();
      
      // Pending Payment → Enrolled: unlock LMS + send confirmation + generate data sheet
      if (newStatus === "Enrolled" && oldStatus !== "Enrolled") {
        sheet.getRange(row, colMap["LMS Access"]+1).setValue("Yes");
        sendEnrollmentConfirmation(firstName, email, studentNum, ref, programme, level);
        loadIds();
        try {
          sTab("Student Lifecycle").appendRow([new Date(), ref, studentNum, firstName+" "+lastName,
            "Status Change", "Enrollment", "Payment verified — LMS access granted",
            oldStatus, "Enrolled", programme, level, "Admin", "Manual"]);
        } catch(le){}
        // Start weekly encouragement tracking
        try {
          sheet.getRange(row, colMap["Last Encouragement"]+1).setValue(new Date());
          sheet.getRange(row, colMap["Encouragement Count"]+1).setValue(0);
        } catch(le){}
        // Generate Student Data Sheet PDF and save to Drive
        try {
          generateStudentDataSheet(ref, studentNum, firstName, lastName, email, String(rowData[colMap["Phone"]]||""), programme, level);
        } catch(ds) { Logger.log("Data sheet error: " + ds.message); }
        // Update cumulative record
        try { generateCumulativeRecord(studentNum); } catch(cr) {}
        Logger.log("LMS unlocked for: " + ref + " → " + studentNum);
      }
      
      // → Graduated
      if (newStatus === "Graduated" && oldStatus !== "Graduated") {
        loadIds();
        try {
          sTab("Student Lifecycle").appendRow([new Date(), ref, studentNum, firstName+" "+lastName,
            "Status Change", "Completion", "Student graduated",
            oldStatus, "Graduated", programme, level, "Admin", "Manual"]);
        } catch(le){}
        // Send graduation email
        try {
          GmailApp.sendEmail(email, "Congratulations " + firstName + "! You've Graduated — CTS ETS", "",
            {htmlBody: wrapDripEmail(
              '<h2 style="color:#011E40">Congratulations, ' + firstName + '! 🎓</h2>'
              + '<p style="color:#4A5568;line-height:1.7">You have officially completed your <strong>' + programme + ' (' + level + ')</strong> programme at CTS ETS.</p>'
              + '<p style="color:#4A5568;line-height:1.7">We are incredibly proud of you. Every late night, every lunch break study session, every audio lesson on the bus — it all led to this moment.</p>'
              + '<p style="color:#4A5568;line-height:1.7">Your NCTVET assessment will be arranged through HEART/NSTA. We will notify you of your assessment date in advance.</p>'
              + '<p style="color:#4A5568;line-height:1.7"><strong>What\'s next?</strong></p>'
              + '<ul style="color:#4A5568;line-height:2"><li>Your certificate details will be added to your Student Portal</li>'
              + '<li>Consider advancing to the next level — your journey doesn\'t have to end here</li>'
              + '<li>Share your story — your experience could inspire someone else</li></ul>'
              + '<p style="color:#4A5568;font-style:italic">"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11</p>'
            ), name: "CTS ETS"});
        } catch(ge){}
        Logger.log("Graduated: " + ref + " → " + studentNum);
        // Update cumulative record
        try { generateCumulativeRecord(studentNum); } catch(cr) {}
      }
    }
  } catch(err) {
    Logger.log("onEditTrigger error: " + err.message);
  }
}

function sendEnrollmentConfirmation(firstName, email, studentNum, ref, programme, level) {
  if (!email) return;
  try {
    GmailApp.sendEmail(email,
      "You're In, " + firstName + "! Your Learning Portal is Now Open — CTS ETS", "",
      {htmlBody: '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">'
        + '<div style="background:#011E40;color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">'
        + '<h1 style="margin:0;font-size:22px">You\'re Officially Enrolled!</h1>'
        + '<p style="margin:8px 0 0;opacity:0.8;font-size:13px">CTS ETS — Called To Serve, Excellence Through Service</p></div>'
        + '<div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
        + '<p style="font-size:16px;color:#011E40"><strong>Great news, ' + firstName + '!</strong></p>'
        + '<p style="font-size:14px;color:#4A5568;line-height:1.7">Your payment has been verified and your Learning Portal is now <strong>open</strong>. You can start studying immediately.</p>'
        + '<div style="background:#F0FFF4;border:2px solid #38A169;border-radius:10px;padding:20px;margin:20px 0;text-align:center">'
        + '<h3 style="color:#22543D;margin:0 0 12px;font-size:15px">Your Learning Portal is Ready</h3>'
        + '<p style="color:#4A5568;font-size:13px;margin:0 0 16px">Log into the Student Portal to access all your course materials.</p>'
        + '<a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:14px 36px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">Enter Student Portal</a></div>'
        + '<p style="font-size:14px;color:#4A5568;line-height:1.7"><strong>What\'s waiting for you:</strong></p>'
        + '<ul style="font-size:14px;color:#4A5568;line-height:2">'
        + '<li>📚 Full course materials for ' + programme + '</li>'
        + '<li>🎧 Audio Study Sessions — listen like a podcast</li>'
        + '<li>🤖 AI Study Assistant — ask questions 24/7</li>'
        + '<li>📝 Quizzes, flashcards, and progress tracking</li></ul>'
        + '<p style="font-size:14px;color:#4A5568;line-height:1.7">You are part of a cohort. Assessment preparation days will be announced in advance.</p>'
        + '<p style="font-size:12px;color:#A0AEC0;margin-top:20px;text-align:center">Student #: ' + studentNum + ' | Ref: ' + ref + '<br>Questions? admin@ctsetsjm.com | WhatsApp 876-381-9771</p>'
        + '</div>'
        + '<div style="background:#F7FAFC;padding:16px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">'
        + '<p style="font-size:11px;color:#A0AEC0;margin:0">CTS ETS | 6, Newark Avenue, Kingston 2 | admin@ctsetsjm.com</p></div></body></html>',
      name: "CTS ETS"});
    Logger.log("Enrollment confirmation sent to: " + email);
  } catch(e) { Logger.log("Enrollment email error: " + e.message); }
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
    "Pending Payment", // Status — waiting for payment
    "Pending",           // Payment Status
    "No",                // LMS Access — unlocked when status changes to Enrolled
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
      var subject = "Congratulations " + firstName + "! You've Been Accepted — CTS ETS";
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
    ["2. FINANCE", s2, "#C49112", ["Payment Schedule","Founding_Cohort","Founding_Credits","Founding_Referrals"]],
    ["⚙️ 3. OPERATIONS", s3, "#2D8B61", ["Site Analytics","Feedback","Interest Capture","Audit Log","Config"]],
    ["4. ACADEMIC", s4, "#7C3AED", ["Certificates","Programme Codes","Progress Reports","NCTVET Ready","Ministry Register"]],
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
    else if (a==="resetpassword") r = requestPasswordReset(e.parameter.email||"");
    else if (a==="generaterecord") r = generateCumulativeRecord(e.parameter.student||"");
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
    if(ar===refUpper || sn===refUpper){
      var storedPw=String(row[c["Portal Password"]]||"").trim();
      if(!storedPw) return {ok:false, error:"Your portal access has not been set up yet. Contact admin@ctsetsjm.com."};
      if(storedPw!==pw.trim()) return {ok:false, error:"Incorrect password. Try again or contact admin@ctsetsjm.com."};
      var status=row[c["Status"]]||"Pending Payment";
      var totalFees=Number(row[c["Total Fees"]]||0);
      var totalPaid=Number(row[c["Total Paid"]]||0);
      var outstanding=Number(row[c["Outstanding"]]||0);
      var profile = getStudentProfile(ar);
      return {
        ok:true, ref:ar, studentNumber:sn,
        name:((row[c["First Name"]]||"")+" "+(row[c["Last Name"]]||"")).trim(),
        firstName:row[c["First Name"]]||"", lastName:row[c["Last Name"]]||"",
        email:row[c["Email"]]||"", phone:row[c["Phone"]]||"",
        programme:row[c["Programme"]]||"", level:row[c["Level"]]||"",
        paymentPlan:row[c["Payment Plan"]]||"", status:status,
        paymentStatus:row[c["Payment Status"]]||"Pending",
        totalFees:totalFees, totalPaid:totalPaid, outstanding:outstanding>0?outstanding:0,
        startDate:row[c["Start Date"]]||"", endDate:row[c["End Date"]]||"",
        cohort:row[c["Cohort"]]||"", enrolledDate:row[c["Enrolled Date"]]||"",
        payments:getPaymentHistory(ar),
        lmsAccess:String(row[c["LMS Access"]]||"").toLowerCase()==="yes",
        gender:profile.gender||"", dob:profile.dob||"", nationality:profile.nationality||"",
        parish:profile.parish||"", country:profile.country||"", address:profile.address||"",
        trn:profile.trn||"", emergencyName:profile.emergencyName||"",
        emergencyPhone:profile.emergencyPhone||"", emergencyRelationship:profile.emergencyRelationship||"",
        highestQualification:profile.highestQualification||"",
        employer:profile.employer||"", jobTitle:profile.jobTitle||"",
        photoUrl:profile.photoUrl||"",
      };
    }
  }
  return {ok:false, error:"No enrolled student found. If you applied but have not been accepted yet, please wait for your acceptance email."};
}

function getStudentProfile(appRef) {
  try {
    var s=sTab("Applications"), d=s.getDataRange().getValues(), h=d[0], c={};
    for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
    for(var i=1;i<d.length;i++){
      if(String(d[i][c["Application Ref"]]||"").trim().toUpperCase()===appRef.toUpperCase()){
        var row=d[i];
        return { gender:row[c["Gender"]]||"", dob:row[c["Date of Birth"]]||"",
          nationality:row[c["Nationality"]]||"", parish:row[c["Parish"]]||"",
          country:row[c["Country"]]||"", address:row[c["Address"]]||"",
          district:row[c["District"]]||"", postalZone:row[c["Postal Zone"]]||"",
          trn:row[c["TRN"]]||"", nis:row[c["NIS"]]||"",
          maritalStatus:row[c["Marital Status"]]||"",
          maidenName:row[c["Maiden Name"]]||"", middleName:row[c["Middle Name"]]||"",
          phone2:row[c["Phone 2"]]||"",
          specialNeeds:row[c["Special Needs"]]||"No", specialNeedsType:row[c["Special Needs Type"]]||"",
          emergencyName:row[c["Emergency Name"]]||"", emergencyPhone:row[c["Emergency Phone"]]||"",
          emergencyRelationship:row[c["Emergency Relationship"]]||"",
          emergency2Name:row[c["Emergency 2 Name"]]||"", emergency2Phone:row[c["Emergency 2 Phone"]]||"",
          emergency2Relationship:row[c["Emergency 2 Relationship"]]||"",
          highestQualification:row[c["Highest Qualification"]]||"",
          schoolLastAttended:row[c["School Last Attended"]]||"", yearCompleted:row[c["Year Completed"]]||"",
          employmentStatus:row[c["Employment Status"]]||"",
          employer:row[c["Employer"]]||"", jobTitle:row[c["Job Title"]]||"",
          photoUrl:row[c["Photo URL"]]||"" };
      }
    }
  } catch(e){}
  return {};
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
      s.getRange(i+1, c["Portal Password"]+1).setValue(newPw.trim());
      try {
        sTab("Student Lifecycle").appendRow([new Date(), ar, sn, (row[c["First Name"]]||"")+" "+(row[c["Last Name"]]||""),
          "Password Change", "Security", "Portal password changed by student", "", "", row[c["Programme"]]||"", row[c["Level"]]||"", "Student", "Portal"]);
      } catch(e){}
      return {ok:true, message:"Password changed successfully."};
    }
  }
  return {ok:false, error:"Student not found."};
}

// Admin password reset — run from script editor: adminResetPassword("CTSETS-STU-00001")
function adminResetPassword(studentRef) {
  if (!studentRef) return {ok:false, error:"Student ref required"};
  loadIds();
  var s=sTab("Enrolled Students"), d=s.getDataRange().getValues(), h=d[0], c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
  var refUpper = studentRef.trim().toUpperCase();
  for(var i=1;i<d.length;i++){
    var row=d[i];
    var ar=String(row[c["Application Ref"]]||"").trim().toUpperCase();
    var sn=String(row[c["Student Number"]]||"").trim().toUpperCase();
    if(ar===refUpper || sn===refUpper){
      var newPw = generatePortalPassword();
      s.getRange(i+1, c["Portal Password"]+1).setValue(newPw);
      var email = String(row[c["Email"]]||"").trim();
      var firstName = String(row[c["First Name"]]||"").trim();
      var stuNum = sn || ar;
      // Email new password to student
      try {
        GmailApp.sendEmail(email, "CTS ETS \u2014 Your Portal Password Has Been Reset", "", {
          htmlBody: '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
            + '<div style="background:#011E40;padding:20px;text-align:center;border-radius:12px 12px 0 0">'
            + '<h1 style="color:#D4A843;font-size:20px;margin:0">CTS ETS</h1></div>'
            + '<div style="padding:28px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
            + '<h2 style="color:#011E40">Password Reset, ' + firstName + '</h2>'
            + '<p style="color:#4A5568;line-height:1.7">Your Student Portal password has been reset by an administrator. Here are your new login credentials:</p>'
            + '<div style="background:#FAFAF7;border-radius:10px;padding:20px;margin:16px 0;border-left:4px solid #D4A843">'
            + '<p style="margin:0 0 8px"><strong>Student Number:</strong> ' + stuNum + '</p>'
            + '<p style="margin:0 0 8px"><strong>New Password:</strong> ' + newPw + '</p></div>'
            + '<p style="color:#4A5568;line-height:1.7">Please log in and change your password immediately for security.</p>'
            + '<div style="text-align:center;margin:20px 0"><a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:14px 32px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Log Into Portal</a></div>'
            + '</div></body></html>',
          name: "CTS ETS Admissions"
        });
      } catch(e) { Logger.log("Reset email error: " + e.message); }
      try {
        sTab("Student Lifecycle").appendRow([new Date(), ar, sn, firstName + " " + (row[c["Last Name"]]||""),
          "Password Reset", "Security", "Portal password reset by admin", "", "", row[c["Programme"]]||"", row[c["Level"]]||"", "Admin", "Manual"]);
      } catch(e){}
      audit("PASSWORD RESET", stuNum, "Admin reset password for " + firstName + " (" + email + ")", "Admin");
      Logger.log("Password reset for " + stuNum + " — new password emailed to " + email);
      return {ok:true, message:"Password reset for " + stuNum + ". New password emailed to " + email};
    }
  }
  return {ok:false, error:"Student not found: " + studentRef};
}

// Student self-service password reset — triggered from login page
function requestPasswordReset(emailOrRef) {
  if (!emailOrRef) return {ok:false, error:"Please enter your email or student number."};
  loadIds();
  var s=sTab("Enrolled Students"), d=s.getDataRange().getValues(), h=d[0], c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
  var lookup = emailOrRef.trim().toUpperCase();
  for(var i=1;i<d.length;i++){
    var row=d[i];
    var ar=String(row[c["Application Ref"]]||"").trim().toUpperCase();
    var sn=String(row[c["Student Number"]]||"").trim().toUpperCase();
    var em=String(row[c["Email"]]||"").trim().toUpperCase();
    if(ar===lookup || sn===lookup || em===lookup){
      var newPw = generatePortalPassword();
      s.getRange(i+1, c["Portal Password"]+1).setValue(newPw);
      var email = String(row[c["Email"]]||"").trim();
      var firstName = String(row[c["First Name"]]||"").trim();
      var stuNum = String(row[c["Student Number"]]||"").trim();
      var appRef = String(row[c["Application Ref"]]||"").trim();
      // Email new password
      try {
        GmailApp.sendEmail(email, "CTS ETS \u2014 Your New Portal Password", "", {
          htmlBody: '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
            + '<div style="background:#011E40;padding:20px;text-align:center;border-radius:12px 12px 0 0">'
            + '<h1 style="color:#D4A843;font-size:20px;margin:0">CTS ETS</h1></div>'
            + '<div style="padding:28px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
            + '<h2 style="color:#011E40">Password Reset, ' + firstName + '</h2>'
            + '<p style="color:#4A5568;line-height:1.7">You requested a password reset for your Student Portal. Here are your new login credentials:</p>'
            + '<div style="background:#FAFAF7;border-radius:10px;padding:20px;margin:16px 0;border-left:4px solid #D4A843">'
            + '<p style="margin:0 0 8px"><strong>Student Number:</strong> ' + (stuNum || appRef) + '</p>'
            + '<p style="margin:0 0 8px"><strong>New Password:</strong> ' + newPw + '</p></div>'
            + '<p style="color:#4A5568;line-height:1.7">We recommend changing this password after logging in.</p>'
            + '<div style="text-align:center;margin:20px 0"><a href="https://www.ctsetsjm.com/#Student-Portal" style="display:inline-block;padding:14px 32px;background:#0E8F8B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Log Into Portal</a></div>'
            + '</div></body></html>',
          name: "CTS ETS Admissions"
        });
      } catch(e) { Logger.log("Reset email error: " + e.message); }
      try {
        sTab("Student Lifecycle").appendRow([new Date(), appRef, stuNum, firstName + " " + (row[c["Last Name"]]||""),
          "Password Reset", "Security", "Self-service password reset requested", "", "", row[c["Programme"]]||"", row[c["Level"]]||"", "Student", "Portal"]);
      } catch(e){}
      audit("PASSWORD RESET", stuNum || appRef, "Self-service reset for " + firstName + " (" + email + ")", "Student");
      // Always return generic message for security — don't confirm whether account exists
      return {ok:true, message:"If an account exists with that information, a new password has been emailed."};
    }
  }
  // Same generic message even if not found — don't reveal account existence
  return {ok:true, message:"If an account exists with that information, a new password has been emailed."};
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

  // Duplicate check — match by TRN+programme (primary) or email+programme (fallback for international)
  for(var i=1;i<all.length;i++){
    var existTrn=String(all[i][c["TRN"]]||"").trim();
    var existEmail=String(all[i][c["Email"]]||"").trim().toLowerCase();
    var existProg=String(all[i][c["Programme"]]||"").trim().toLowerCase();
    var newTrn=String(data.trn||"").trim();
    var newEmail=(data.email||"").trim().toLowerCase();
    var newProg=(data.programme||"").trim().toLowerCase();
    var trnMatch = newTrn && existTrn && newTrn === existTrn && existProg === newProg;
    var emailMatch = newEmail && existEmail === newEmail && existProg === newProg;
    if(trnMatch || emailMatch)
      return {success:false,duplicate:true,message:"An application for this programme already exists with this TRN/email.",existingRef:all[i][c["Application Ref"]]||""};
  }

  var ref=data.ref||"", now=new Date();

  s.appendRow([
    ref,now,data.applicantType||"",
    data.firstName||"",data.lastName||"",data.middleName||"",data.maidenName||"",
    data.email||"",data.phone||"",data.phone2||"",
    data.trn||"",data.nis||"",data.parish||"",data.country||"",data.gender||"",
    data.dob||"",data.address||"",data.district||"",data.postalZone||"",
    data.nationality||"",data.maritalStatus||"",
    data.specialNeeds||"No",data.specialNeedsType||"",
    data.highestQualification||"",data.schoolLastAttended||"",data.yearCompleted||"",
    data.employmentStatus||"",data.employer||"",data.jobTitle||"",data.industry||"",data.yearsExperience||"",
    data.emergencyName||"",data.emergencyPhone||"",data.emergencyRelationship||"",
    data.emergency2Name||"",data.emergency2Phone||"",data.emergency2Relationship||"",
    data.previousHeart||"No",
    data.level||"",data.programme||"",data.paymentPlan||"",
    data.hearAbout||"",data.message||"",
    "","","Under Review",""
  ]);

  // Save files
  var fl=saveDriveFiles(data,ref);
  if(fl.url){var lr=s.getLastRow();
    if(c["Drive Folder Link"]!==undefined) s.getRange(lr,c["Drive Folder Link"]+1).setValue(fl.url);
    if(c["Documents Uploaded"]!==undefined) s.getRange(lr,c["Documents Uploaded"]+1).setValue(fl.names);
    if(fl.photoUrl && c["Photo URL"]!==undefined) s.getRange(lr,c["Photo URL"]+1).setValue(fl.photoUrl);
  }

  audit("APPLICATION RECEIVED",ref,(data.firstName||"")+" "+(data.lastName||"")+" | "+(data.programme||""),"Website");
  lifecycle(ref,"",(data.firstName||"")+" "+(data.lastName||""),"Application Submitted","Administrative",
    "Email: "+(data.email||"")+" | "+(data.applicantType||""),data.programme||"",data.level||"");

  // Send confirmation email to student
  var studentEmailSent = false;
  if (data.email) {
    var studentName = (data.firstName||"") + " " + (data.lastName||"");
    var studentSubject = "CTS ETS \u2014 Application Received (" + ref + ")";
    var studentBody = '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
      + '<div style="background:#011E40;padding:24px;text-align:center;border-radius:12px 12px 0 0">'
      + '<h1 style="color:#D4A843;font-size:22px;margin:0">CTS Empowerment & Training Solutions</h1>'
      + '<p style="color:rgba(255,255,255,0.6);font-size:11px;margin:4px 0 0;letter-spacing:2px">CALLED TO SERVE \u2014 EXCELLENCE THROUGH SERVICE</p></div>'
      + '<div style="padding:32px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
      + '<h2 style="color:#011E40;font-size:20px">Application Received, ' + (data.firstName||"") + '!</h2>'
      + '<p style="color:#4A5568;line-height:1.7">Thank you for applying to CTS ETS. Your application is now under review.</p>'
      + '<div style="background:#FAFAF7;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #D4A843">'
      + '<p style="margin:0 0 8px"><strong>Reference:</strong> ' + ref + '</p>'
      + '<p style="margin:0 0 8px"><strong>Programme:</strong> ' + (data.level||"") + ' \u2014 ' + (data.programme||"") + '</p>'
      + '<p style="margin:0"><strong>Status:</strong> Under Review</p></div>'
      + '<h3 style="color:#011E40;font-size:16px">What Happens Next?</h3>'
      + '<ol style="color:#4A5568;line-height:1.8">'
      + '<li>Our admissions team reviews your documents (48\u201372 hours)</li>'
      + '<li>You receive an acceptance email with your Student Portal credentials</li>'
      + '<li>Complete your payment</li>'
      + '<li>Your status is updated to Enrolled and the Learning Portal is unlocked</li></ol>'
      + '<p style="color:#4A5568;line-height:1.7">Questions? Email admin@ctsetsjm.com or WhatsApp 876-381-9771</p></div>'
      + '<div style="background:#F7FAFC;padding:16px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">'
      + '<p style="font-size:11px;color:#A0AEC0;margin:0">CTS ETS | 6, Newark Avenue, Kingston 2 | admin@ctsetsjm.com</p></div></body></html>';
    var studentPlain = "Thank you for applying to CTS ETS, " + (data.firstName||"") + ". Your application ref is " + ref + " for " + (data.programme||"") + ". Status: Under Review. We will review within 48-72 hours.";
    
    // Method 1: GmailApp
    try {
      GmailApp.sendEmail(data.email, studentSubject, studentPlain, {htmlBody: studentBody, name: "CTS ETS Admissions"});
      studentEmailSent = true;
      Logger.log("Student confirmation sent via GmailApp to: " + data.email);
    } catch(e1) { Logger.log("GmailApp student email FAILED: " + e1.message); }
    
    // Method 2: MailApp fallback if GmailApp failed
    if (!studentEmailSent) {
      try {
        MailApp.sendEmail({to: data.email, subject: studentSubject, htmlBody: studentBody, name: "CTS ETS Admissions"});
        studentEmailSent = true;
        Logger.log("Student confirmation sent via MailApp to: " + data.email);
      } catch(e2) { Logger.log("MailApp student email FAILED: " + e2.message); }
    }
    
    if (!studentEmailSent) {
      Logger.log("ALL student email methods failed for: " + data.email + " | Ref: " + ref);
      audit("EMAIL FAILED", ref, "Student confirmation could not be sent to " + data.email, "System");
    }
  } else {
    Logger.log("No student email provided for: " + ref);
  }

  // NOTIFY ADMIN of new application — multiple methods to ensure delivery
  // Gmail silently drops self-to-self emails, so we use backup methods
  var adminSubject = "New Application \u2014 " + ref + " \u2014 " + (data.firstName||"") + " " + (data.lastName||"");
  var adminHtml = "<h2 style='color:#011E40'>New Application Received</h2>"
    + "<table style='border-collapse:collapse;font-family:Arial;font-size:13px'>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Ref</td><td style='padding:6px 12px;border:1px solid #ddd'>" + ref + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Name</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.firstName||"") + " " + (data.lastName||"") + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Email</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.email||"") + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Phone</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.phone||"") + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Programme</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.level||"") + " \u2014 " + (data.programme||"") + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Payment Plan</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.paymentPlan||"Gold") + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Type</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.applicantType||"") + "</td></tr>"
    + "<tr><td style='padding:6px 12px;background:#f0f4f8;font-weight:600;border:1px solid #ddd'>Country</td><td style='padding:6px 12px;border:1px solid #ddd'>" + (data.country||"") + "</td></tr>"
    + "</table>"
    + "<p style='margin-top:16px;font-size:12px;color:#666'>Review in Google Sheets \u2192 Applications tab. Change Status to <b>Accepted</b> to auto-enrol.</p>";
  var adminPlain = "New application: " + ref + " | " + (data.firstName||"") + " " + (data.lastName||"") + " | " + (data.programme||"") + " | " + (data.email||"") + " | " + (data.phone||"");
  
  // Method 1: Try GmailApp to admin email
  try {
    GmailApp.sendEmail(ADMIN_EMAIL, adminSubject, adminPlain, {htmlBody: adminHtml, name: "CTS ETS System"});
    Logger.log("Admin email sent to: " + ADMIN_EMAIL);
  } catch(ae) { Logger.log("Admin email error: " + ae.message); }
  
  // Method 2: Send to backup email if configured (personal Gmail)
  if (ADMIN_BACKUP_EMAIL) {
    try {
      GmailApp.sendEmail(ADMIN_BACKUP_EMAIL, adminSubject, adminPlain, {htmlBody: adminHtml, name: "CTS ETS System"});
      Logger.log("Backup admin email sent to: " + ADMIN_BACKUP_EMAIL);
    } catch(be) { Logger.log("Backup email error: " + be.message); }
  }
  
  // Method 3: Create a Gmail draft (always works, even for self-to-self)
  try {
    GmailApp.createDraft(ADMIN_EMAIL, adminSubject, adminPlain, {htmlBody: adminHtml, name: "CTS ETS System"});
    Logger.log("Admin notification draft created for: " + ref);
  } catch(de) { Logger.log("Draft error: " + de.message); }

  return {success:true,ref:ref};
}

// ═══════════════════════════════════════════════════════════════════════
// STUDENT DATA SHEET — Auto-generated on enrollment, saved to Drive
// ═══════════════════════════════════════════════════════════════════════
function generateStudentDataSheet(appRef, studentNum, firstName, lastName, email, phone, programme, level) {
  loadIds();
  var profile = getStudentProfile(appRef);
  var today = new Date();
  var dateStr = Utilities.formatDate(today, "America/Jamaica", "dd MMM yyyy");
  
  // Get enrolled data
  var enrolled = sTab("Enrolled Students"), ed = enrolled.getDataRange().getValues(), eh = ed[0], ec = {};
  for (var i=0; i<eh.length; i++) ec[String(eh[i]).trim()] = i;
  var cohort = "", startDate = "", endDate = "", paymentPlan = "", totalFees = "";
  for (var i=1; i<ed.length; i++) {
    if (String(ed[i][ec["Application Ref"]]||"").trim().toUpperCase() === appRef.toUpperCase()) {
      cohort = ed[i][ec["Cohort"]]||""; startDate = ed[i][ec["Start Date"]]||""; endDate = ed[i][ec["End Date"]]||"";
      paymentPlan = ed[i][ec["Payment Plan"]]||""; totalFees = ed[i][ec["Total Fees"]]||"";
      break;
    }
  }
  
  var v = function(val) { return val || "\u2014"; };
  var photoImg = profile.photoUrl ? '<img src="' + profile.photoUrl + '" style="width:90px;height:110px;object-fit:cover;border:1px solid #ccc;border-radius:4px" />' : '<div style="width:90px;height:110px;border:1px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;font-size:10px;color:#999;text-align:center">No Photo<br>On File</div>';
  
  var html = '<!DOCTYPE html><html><head><style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'body{font-family:Arial,sans-serif;font-size:11px;color:#111;max-width:720px;margin:0 auto;padding:20px}'
    + '.hdr{background:#011E40;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border-radius:4px 4px 0 0}'
    + '.hdr h1{color:#D4A843;font-size:16px;margin:0}'
    + '.hdr .sub{color:rgba(255,255,255,.7);font-size:9px;margin-top:2px}'
    + '.sec{background:#011E40;color:#D4A843;padding:5px 10px;font-size:10px;font-weight:700;letter-spacing:1px;margin-top:10px}'
    + 'table{width:100%;border-collapse:collapse;margin-bottom:2px}'
    + 'td{border:1px solid #bbb;padding:4px 8px;font-size:10px;vertical-align:top}'
    + 'td.l{background:#f0f4f8;font-weight:600;color:#333;width:28%}'
    + 'td.v{font-weight:500}'
    + '.ft{margin-top:12px;font-size:8px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:6px}'
    + '.conf{font-size:9px;color:#333;margin-top:10px;line-height:1.6;border:1px solid #ddd;padding:8px;background:#fafafa}'
    + '.sig-area{display:flex;justify-content:space-between;margin-top:16px;padding-top:8px}'
    + '.sig-box{width:45%}'
    + '.sig-line{border-bottom:1px solid #333;height:30px;margin-bottom:4px}'
    + '.sig-label{font-size:8px;color:#666}'
    + '</style></head><body>'
    
    // Header
    + '<div class="hdr"><div><h1>CTS Empowerment & Training Solutions</h1>'
    + '<div class="sub">STUDENT DATA SHEET \u2014 CONFIDENTIAL</div></div>'
    + '<div style="text-align:right;color:rgba(255,255,255,.5);font-size:8px">Date Generated: ' + dateStr + '<br>COJ Reg. No. 16007/2025</div></div>'
    
    // Student ID + Photo
    + '<div class="sec">STUDENT IDENTIFICATION</div>'
    + '<table><tr><td class="l" rowspan="4" style="width:110px;text-align:center;vertical-align:middle">' + photoImg + '</td>'
    + '<td class="l" style="width:20%">Student Number</td><td class="v" style="font-size:13px;font-weight:700;letter-spacing:1px">' + v(studentNum) + '</td></tr>'
    + '<tr><td class="l">Application Ref</td><td class="v">' + v(appRef) + '</td></tr>'
    + '<tr><td class="l">Full Name</td><td class="v" style="font-size:12px;font-weight:700">' + v(firstName + " " + (profile.middleName ? profile.middleName + " " : "") + lastName) + '</td></tr>'
    + '<tr><td class="l">Maiden Name</td><td class="v">' + v(profile.maidenName) + '</td></tr></table>'
    
    // Personal Information
    + '<div class="sec">PERSONAL INFORMATION</div>'
    + '<table>'
    + '<tr><td class="l">Gender</td><td class="v">' + v(profile.gender) + '</td><td class="l">Date of Birth</td><td class="v">' + v(profile.dob) + '</td></tr>'
    + '<tr><td class="l">Nationality</td><td class="v">' + v(profile.nationality) + '</td><td class="l">Marital Status</td><td class="v">' + v(profile.maritalStatus) + '</td></tr>'
    + '<tr><td class="l">TRN</td><td class="v">' + v(profile.trn) + '</td><td class="l">NIS #</td><td class="v">' + v(profile.nis) + '</td></tr>'
    + '<tr><td class="l">Email</td><td class="v" colspan="3">' + v(email) + '</td></tr>'
    + '<tr><td class="l">Phone 1</td><td class="v">' + v(phone) + '</td><td class="l">Phone 2</td><td class="v">' + v(profile.phone2) + '</td></tr>'
    + '<tr><td class="l">Special Needs</td><td class="v" colspan="3">' + (profile.specialNeeds === "Yes" ? "Yes \u2014 " + v(profile.specialNeedsType) : "No") + '</td></tr>'
    + '</table>'
    
    // Address
    + '<div class="sec">ADDRESS</div>'
    + '<table>'
    + '<tr><td class="l">Street</td><td class="v" colspan="3">' + v(profile.address) + '</td></tr>'
    + '<tr><td class="l">District/Town</td><td class="v">' + v(profile.district) + '</td><td class="l">Postal Zone</td><td class="v">' + v(profile.postalZone) + '</td></tr>'
    + '<tr><td class="l">Parish</td><td class="v">' + v(profile.parish) + '</td><td class="l">Country</td><td class="v">' + v(profile.country) + '</td></tr>'
    + '</table>'
    
    // Emergency Contacts
    + '<div class="sec">EMERGENCY CONTACTS</div>'
    + '<table>'
    + '<tr><td class="l">Contact #1 Name</td><td class="v">' + v(profile.emergencyName) + '</td><td class="l">Contact #2 Name</td><td class="v">' + v(profile.emergency2Name) + '</td></tr>'
    + '<tr><td class="l">Phone</td><td class="v">' + v(profile.emergencyPhone) + '</td><td class="l">Phone</td><td class="v">' + v(profile.emergency2Phone) + '</td></tr>'
    + '<tr><td class="l">Relationship</td><td class="v">' + v(profile.emergencyRelationship) + '</td><td class="l">Relationship</td><td class="v">' + v(profile.emergency2Relationship) + '</td></tr>'
    + '</table>'
    
    // Education & Employment
    + '<div class="sec">EDUCATION & EMPLOYMENT</div>'
    + '<table>'
    + '<tr><td class="l">Highest Qualification</td><td class="v">' + v(profile.highestQualification) + '</td><td class="l">Year Completed</td><td class="v">' + v(profile.yearCompleted) + '</td></tr>'
    + '<tr><td class="l">Last School / Institution</td><td class="v" colspan="3">' + v(profile.schoolLastAttended) + '</td></tr>'
    + '<tr><td class="l">Employment Status</td><td class="v">' + v(profile.employmentStatus) + '</td><td class="l">Employer</td><td class="v">' + v(profile.employer) + '</td></tr>'
    + '<tr><td class="l">Job Title</td><td class="v" colspan="3">' + v(profile.jobTitle) + '</td></tr>'
    + '</table>'
    
    // Programme & Enrolment
    + '<div class="sec">PROGRAMME & ENROLMENT</div>'
    + '<table>'
    + '<tr><td class="l">Programme</td><td class="v" colspan="3" style="font-weight:700">' + v(programme) + '</td></tr>'
    + '<tr><td class="l">Level</td><td class="v">' + v(level) + '</td><td class="l">Payment Plan</td><td class="v">' + v(paymentPlan) + '</td></tr>'
    + '<tr><td class="l">Cohort</td><td class="v">' + v(cohort) + '</td><td class="l">Total Fees</td><td class="v">' + (totalFees ? "J$" + Number(totalFees).toLocaleString() : "\u2014") + '</td></tr>'
    + '<tr><td class="l">Start Date</td><td class="v">' + v(startDate) + '</td><td class="l">End Date</td><td class="v">' + v(endDate) + '</td></tr>'
    + '<tr><td class="l">Enrolled Date</td><td class="v" colspan="3">' + dateStr + '</td></tr>'
    + '</table>'
    
    // Confidentiality
    + '<div class="conf"><strong>CONFIDENTIALITY NOTICE:</strong> This document contains personal information about the above-named student. It is intended solely for institutional records and must be handled in accordance with data protection requirements. Unauthorised disclosure, copying, or distribution is prohibited.</div>'
    
    // Signature areas
    + '<div class="sig-area">'
    + '<div class="sig-box"><div class="sig-line"></div><div class="sig-label">Student Signature / Date</div></div>'
    + '<div class="sig-box"><div class="sig-line"></div><div class="sig-label">Administrator Signature / Date</div></div>'
    + '</div>'
    
    + '<div class="ft">CTS Empowerment & Training Solutions | 6, Newark Avenue, Kingston 2 | admin@ctsetsjm.com | 876-525-6802 | 876-381-9771<br>'
    + 'This document was auto-generated on enrolment. Student #: ' + studentNum + ' | Ref: ' + appRef + '</div>'
    + '</body></html>';
  
  // Create Google Doc from HTML, convert to PDF, save to folder
  var rf = DriveApp.getFoldersByName("CTS ETS Student Records");
  var recordsFolder = rf.hasNext() ? rf.next() : DriveApp.createFolder("CTS ETS Student Records");
  
  // Create temp HTML file, convert via Google Docs
  var tempFile = recordsFolder.createFile(studentNum + "_DataSheet.html", html, "text/html");
  var docBlob = tempFile.getAs("text/html");
  
  // Use Google Docs to convert HTML to clean PDF
  var tempDoc = DocumentApp.create("TEMP_" + studentNum);
  var tempDocId = tempDoc.getId();
  
  // Insert HTML content into doc body
  var body = tempDoc.getBody();
  body.setText(""); // Clear
  
  // Since we can't directly insert HTML into Docs, create the PDF from the HTML blob directly
  DriveApp.getFileById(tempDocId).setTrashed(true); // Remove temp doc
  
  // Save HTML as the record (can be opened in browser and printed to PDF)
  var fileName = studentNum + " \u2014 " + firstName + " " + lastName + " \u2014 Student Data Sheet.html";
  tempFile.setName(fileName);
  
  // Also create a simple text summary
  var summaryText = "CTS ETS \u2014 STUDENT DATA SHEET\n"
    + "Generated: " + dateStr + "\n"
    + "═══════════════════════════════\n"
    + "Student #: " + studentNum + "\n"
    + "Ref: " + appRef + "\n"
    + "Name: " + firstName + " " + lastName + "\n"
    + "Email: " + email + "\n"
    + "Phone: " + phone + "\n"
    + "Programme: " + programme + "\n"
    + "Level: " + level + "\n"
    + "Payment Plan: " + (paymentPlan||"Gold") + "\n"
    + "Total Fees: J$" + (totalFees ? Number(totalFees).toLocaleString() : "N/A") + "\n"
    + "═══════════════════════════════\n"
    + "TRN: " + (profile.trn||"N/A") + "\n"
    + "DOB: " + (profile.dob||"N/A") + "\n"
    + "Gender: " + (profile.gender||"N/A") + "\n"
    + "Nationality: " + (profile.nationality||"N/A") + "\n"
    + "Address: " + (profile.address||"N/A") + ", " + (profile.district||"") + ", " + (profile.parish||"") + "\n"
    + "Country: " + (profile.country||"Jamaica") + "\n"
    + "Emergency: " + (profile.emergencyName||"N/A") + " (" + (profile.emergencyRelationship||"") + ") " + (profile.emergencyPhone||"") + "\n";
  
  audit("DATA SHEET", appRef, "Student data sheet generated for " + studentNum + " in CTS ETS Student Records folder", "System");
  Logger.log("Data sheet saved: " + fileName);
}

function saveDriveFiles(data, ref) {
  var r={url:"",names:"",photoUrl:""};
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
        var savedFile=folder.createFile(blob); names.push(blob.getName());
        // If this is the passport photo, make it publicly viewable and save URL
        if((f.slot||"") === "passportPhoto"){
          savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          r.photoUrl = "https://drive.google.com/uc?id=" + savedFile.getId();
        }
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
  var rawRef=data.ref||"",now=new Date(),receiptUrl="";
  if(data.files&&data.files.length>0){
    try{
      var rf=DriveApp.getFoldersByName("CTS ETS Payments");
      var root=rf.hasNext()?rf.next():DriveApp.createFolder("CTS ETS Payments");
      var f=data.files[0]; if(f.data){
        var dec=Utilities.base64Decode(f.data);
        var ext=(f.name||"").indexOf(".")>=0?(f.name||"").split(".").pop():"pdf";
        var blob=Utilities.newBlob(dec,f.type||"application/pdf",rawRef.replace(/[, ]+/g,"_")+"_receipt_"+Utilities.formatDate(now,"America/Jamaica","yyyyMMdd")+"."+ext);
        receiptUrl=root.createFile(blob).getUrl();
      }
    }catch(e){audit("PAY FILE ERR",rawRef,e.message,"System");}
  }
  
  // Split refs — supports "REF1, REF2" or "REF1+REF2" format
  var refs = rawRef.split(/[,+]/).map(function(r) { return r.trim(); }).filter(function(r) { return r; });
  var amountPerStudent = refs.length > 1 ? Math.round((Number(data.amountPaid)||0) / refs.length) : (data.amountPaid||"");
  
  for (var i=0; i<refs.length; i++) {
    var ref = refs[i];
    // Look up individual student info from Applications
    var studentInfo = lookupStudent(ref, "");
    var studentName = studentInfo.found ? studentInfo.name : (data.studentName||"");
    var email = studentInfo.found ? studentInfo.email : (data.email||"");
    var programme = studentInfo.found ? studentInfo.programme : (data.programme||"");
    var level = studentInfo.found ? studentInfo.level : (data.level||"");
    
    fTab("Payment Schedule").appendRow([
      "",ref,email,studentName,programme,level,data.paymentPlan||"",
      "1","Payment Evidence",amountPerStudent,data.paymentDate||"",
      "Pending Verification","",amountPerStudent,receiptUrl,"","",
      (data.paymentNote||"")+(refs.length>1?" | Multi-payment ("+refs.length+" applications)":"")
    ]);
    updateField("Application Ref",ref,"Payment Status","Evidence Submitted");
    // Also update Enrolled Students payment status if they exist there
    updateEnrolledPayment(ref, amountPerStudent);
    audit("PAYMENT",ref,"J$"+amountPerStudent+" Plan:"+(data.paymentPlan||"")+(refs.length>1?" [Multi: "+rawRef+"]":""),"Website");
    lifecycle(ref,"",studentName,"Payment Evidence","Financial",
      "J$"+amountPerStudent+" via "+(data.paymentMethod||"upload")+(refs.length>1?" | Part of multi-payment":""),programme,level);
  }
  
  try{GmailApp.sendEmail(ADMIN_EMAIL,"Payment — "+(refs.length>1?refs.length+" applications":rawRef),"",
    {htmlBody:"<h2>Payment Evidence Received</h2>"
    +(refs.length>1?"<p><b>Multi-Payment:</b> "+refs.length+" applications</p>":"")
    +"<p><b>Ref(s):</b> "+rawRef+"</p>"
    +"<p><b>Total Amount:</b> J$"+(data.amountPaid||"N/A")+"</p>"
    +(refs.length>1?"<p><b>Per Student:</b> J$"+amountPerStudent+"</p>":"")
    +"<p><b>Plan:</b> "+(data.paymentPlan||"")+"</p>"
    +(receiptUrl?"<p><a href='"+receiptUrl+"'>View Receipt</a></p>":""),
    name:"CTS ETS System"});}catch(e){}
  
  // Send payment confirmation to each student
  for (var j=0; j<refs.length; j++) {
    var sRef = refs[j];
    var sInfo = lookupStudent(sRef, "");
    if (sInfo.found && sInfo.email) {
      try {
        GmailApp.sendEmail(sInfo.email,
          "CTS ETS — Payment Received (" + sRef + ")", "",
          {htmlBody: wrapDripEmail(
            '<h2 style="color:#011E40">Payment Received, ' + (sInfo.name||"") + '!</h2>'
            + '<p style="color:#4A5568;line-height:1.7">Thank you for your payment. We are processing it now.</p>'
            + '<div style="background:#FAFAF7;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #2D8B61">'
            + '<p style="margin:0 0 8px"><strong>Reference:</strong> ' + sRef + '</p>'
            + '<p style="margin:0 0 8px"><strong>Amount:</strong> J$' + amountPerStudent + '</p>'
            + '<p style="margin:0"><strong>Programme:</strong> ' + (sInfo.level||"") + ' — ' + (sInfo.programme||"") + '</p></div>'
            + '<h3 style="color:#011E40;font-size:16px">What Happens Next?</h3>'
            + '<ol style="color:#4A5568;line-height:1.8">'
            + '<li>Our team verifies your payment (48\u201372 hours)</li>'
            + '<li>Your status is updated to Enrolled</li>'
            + '<li>Your Learning Portal is unlocked — start studying!</li></ol>'
          ), name: "CTS ETS"});
      } catch(se) {}
    }
  }
}

function updateEnrolledPayment(ref, amount) {
  try {
    var s = sTab("Enrolled Students"), d = s.getDataRange().getValues(), h = d[0], c = {};
    for (var i=0; i<h.length; i++) c[String(h[i]).trim()] = i;
    for (var i=1; i<d.length; i++) {
      if (String(d[i][c["Application Ref"]]||"").trim().toUpperCase() === ref.toUpperCase()) {
        var paid = Number(d[i][c["Total Paid"]]||0) + Number(amount||0);
        var fees = Number(d[i][c["Total Fees"]]||0);
        var outstanding = fees - paid;
        s.getRange(i+1, c["Total Paid"]+1).setValue(paid);
        s.getRange(i+1, c["Outstanding"]+1).setValue(outstanding > 0 ? outstanding : 0);
        s.getRange(i+1, c["Payment Status"]+1).setValue(outstanding <= 0 ? "Paid in Full" : "Partial Payment");
        // Update cumulative record
        var stuNum = String(d[i][c["Student Number"]]||"").trim();
        if (stuNum) { try { generateCumulativeRecord(stuNum); } catch(cr){} }
        return;
      }
    }
  } catch(e) {}
}

function handleWiPay(data) {
  var rawRef=data.ref||"",st=data.wipayStatus||"";
  // Split refs — WiPay order_id uses + separator
  var refs = rawRef.split(/[+]/).map(function(r) { return r.trim().replace(/-(?:BOTH|REG|TUI)$/, ""); }).filter(function(r) { return r && r.startsWith("CTSETS-"); });
  if (refs.length === 0) refs = [rawRef]; // fallback
  
  audit("WIPAY "+st.toUpperCase(),rawRef,"Txn:"+(data.transactionId||"")+" J$"+(data.totalCharged||""),"WiPay");
  
  if(st==="success"){
    var amountPerStudent = refs.length > 1 ? Math.round((Number(data.totalCharged)||0) / refs.length) : (data.totalCharged||"");
    for (var i=0; i<refs.length; i++) {
      var ref = refs[i];
      updateField("Application Ref",ref,"Payment Status","Paid (Online)");
      updateField("Application Ref",ref,"Payment Reference",data.transactionId||"");
      updateEnrolledPayment(ref, amountPerStudent);
      lifecycle(ref,"","","Online Payment","Financial","Txn:"+(data.transactionId||"")+" J$"+amountPerStudent+(refs.length>1?" [Multi]":""),"","");
    }
    try{GmailApp.sendEmail(ADMIN_EMAIL,"Payment Confirmed — "+(refs.length>1?refs.length+" applications":rawRef),"",
      {htmlBody:"<h2>Payment Confirmed</h2>"
      +(refs.length>1?"<p><b>Multi-Payment:</b> "+refs.length+" applications</p>":"")
      +"<p><b>Ref(s):</b> "+rawRef+"</p><p><b>Txn:</b> "+(data.transactionId||"")+"</p>"
      +"<p><b>Total:</b> J$"+(data.totalCharged||"")+"</p>"
      +(refs.length>1?"<p><b>Per Student:</b> J$"+amountPerStudent+"</p>":""),
      name:"CTS ETS System"});}catch(e){}
  }
}

function handleDispute(data) {
  audit("DISPUTE",data.ref||"",data.message||"Lookup failed","Website");
  try{GmailApp.sendEmail(ADMIN_EMAIL,"Dispute — "+(data.ref||""),"",
    {htmlBody:"<h2>Payment Lookup Dispute</h2><p>Ref: <b>"+(data.ref||"")+"</b></p><p>"+(data.message||"")+"</p>",
    name:"CTS ETS System"});}catch(e){}
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
    + '<p style="font-size:11px;color:#A0AEC0;margin:0">CTS ETS | admin@ctsetsjm.com | 876-525-6802 | 876-381-9771</p></div></body></html>';
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
// WEEKLY ENCOURAGEMENT EMAILS — Run daily via Time-Based Trigger
// Triggers > Add Trigger > processEncouragementEmails > Time-driven > Day timer
// Sends weekly to active enrolled students once course has started
// ═══════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════
// PAYMENT REMINDERS — Checks due dates, sends 3/2/1 week reminders
// Blocks LMS if payment overdue. Set trigger: processPaymentReminders, daily 8-9am
// ═══════════════════════════════════════════════════════════════════════
function processPaymentReminders() {
  loadIds();
  var today = new Date();
  var todayMs = today.getTime();
  var DAY = 86400000;
  
  // Get enrolled students
  var es = sTab("Enrolled Students"), ed = es.getDataRange().getValues(), eh = ed[0], ec = {};
  for (var i=0; i<eh.length; i++) ec[String(eh[i]).trim()] = i;
  
  // Get payment schedule
  var ps = fTab("Payment Schedule"), pd = ps.getDataRange().getValues(), ph = pd[0], pc = {};
  for (var i=0; i<ph.length; i++) pc[String(ph[i]).trim()] = i;
  
  // Check each enrolled student on Silver or Bronze plans
  for (var i=1; i<ed.length; i++) {
    var stuNum = String(ed[i][ec["Student Number"]]||"").trim();
    var appRef = String(ed[i][ec["Application Ref"]]||"").trim();
    var plan = String(ed[i][ec["Payment Plan"]]||"").trim();
    var email = String(ed[i][ec["Email"]]||"").trim();
    var firstName = String(ed[i][ec["First Name"]]||"").trim();
    var programme = String(ed[i][ec["Programme"]]||"").trim();
    var status = String(ed[i][ec["Status"]]||"").trim();
    var lmsAccess = String(ed[i][ec["LMS Access"]]||"").trim();
    
    if (!stuNum || !email || plan === "Gold") continue;
    if (status === "Graduated" || status === "Withdrawn" || status === "Completed") continue;
    
    // Find unpaid instalments for this student
    for (var j=1; j<pd.length; j++) {
      var pRef = String(pd[j][pc["Application Ref"]]||"").trim();
      if (pRef.toUpperCase() !== appRef.toUpperCase()) continue;
      
      var pStatus = String(pd[j][pc["Status"]]||"").trim();
      if (pStatus === "Paid" || pStatus === "Paid (Online)") continue;
      
      var dueDate = pd[j][pc["Due Date"]];
      if (!dueDate) continue;
      var dueDateMs = new Date(dueDate).getTime();
      var daysUntil = Math.round((dueDateMs - todayMs) / DAY);
      
      var instalment = pd[j][pc["Instalment Label"]]||"";
      var amount = pd[j][pc["Amount Due (JMD)"]]||0;
      var amountStr = "J$" + Number(amount).toLocaleString();
      var dueDateStr = Utilities.formatDate(new Date(dueDate), "America/Jamaica", "dd MMM yyyy");
      var reminderStage = String(pd[j][pc["Reminder Stage"]]||"").trim();
      
      // 3 weeks (21 days)
      if (daysUntil <= 21 && daysUntil > 14 && reminderStage !== "3wk" && reminderStage !== "2wk" && reminderStage !== "1wk" && reminderStage !== "overdue") {
        sendPaymentReminder(email, firstName, stuNum, programme, instalment, amountStr, dueDateStr, "3 weeks");
        ps.getRange(j+1, pc["Reminder Stage"]+1).setValue("3wk");
        ps.getRange(j+1, pc["Last Reminder"]+1).setValue(new Date());
      }
      // 2 weeks (14 days)
      else if (daysUntil <= 14 && daysUntil > 7 && reminderStage !== "2wk" && reminderStage !== "1wk" && reminderStage !== "overdue") {
        sendPaymentReminder(email, firstName, stuNum, programme, instalment, amountStr, dueDateStr, "2 weeks");
        ps.getRange(j+1, pc["Reminder Stage"]+1).setValue("2wk");
        ps.getRange(j+1, pc["Last Reminder"]+1).setValue(new Date());
      }
      // 1 week (7 days)
      else if (daysUntil <= 7 && daysUntil > 0 && reminderStage !== "1wk" && reminderStage !== "overdue") {
        sendPaymentReminder(email, firstName, stuNum, programme, instalment, amountStr, dueDateStr, "1 week");
        ps.getRange(j+1, pc["Reminder Stage"]+1).setValue("1wk");
        ps.getRange(j+1, pc["Last Reminder"]+1).setValue(new Date());
      }
      // OVERDUE — block LMS access
      else if (daysUntil <= 0 && reminderStage !== "overdue") {
        sendPaymentReminder(email, firstName, stuNum, programme, instalment, amountStr, dueDateStr, "overdue");
        ps.getRange(j+1, pc["Reminder Stage"]+1).setValue("overdue");
        ps.getRange(j+1, pc["Last Reminder"]+1).setValue(new Date());
        
        // Block LMS access
        if (lmsAccess === "Yes") {
          es.getRange(i+1, ec["LMS Access"]+1).setValue("No");
          audit("LMS BLOCKED", appRef, "Payment overdue for " + instalment + " (" + amountStr + " due " + dueDateStr + "). LMS access revoked.", "System");
          Logger.log("LMS blocked for " + stuNum + " — overdue payment: " + instalment);
          
          // Notify student LMS is blocked
          try {
            GmailApp.sendEmail(email, "CTS ETS \u2014 Learning Portal Access Suspended", "", {
              htmlBody: '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
                + '<div style="background:#011E40;padding:20px;text-align:center;border-radius:12px 12px 0 0">'
                + '<h1 style="color:#D4A843;font-size:20px;margin:0">CTS ETS</h1></div>'
                + '<div style="padding:28px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
                + '<h2 style="color:#C62828">Learning Portal Access Suspended</h2>'
                + '<p style="color:#4A5568;line-height:1.7">Dear ' + firstName + ',</p>'
                + '<p style="color:#4A5568;line-height:1.7">Your payment for <strong>' + instalment + '</strong> (' + amountStr + ') was due on <strong>' + dueDateStr + '</strong> and has not been received. Your Learning Portal access has been temporarily suspended.</p>'
                + '<p style="color:#4A5568;line-height:1.7">To restore access, please make your payment as soon as possible:</p>'
                + '<div style="text-align:center;margin:20px 0"><a href="https://jm.wipayfinancial.com/to_me/cts_empowerment_and_training_solutions" style="display:inline-block;padding:14px 32px;background:#C62828;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Pay Now</a></div>'
                + '<p style="color:#4A5568;font-size:12px">Reference: <strong>' + stuNum + '</strong></p>'
                + '<p style="color:#4A5568;line-height:1.7">Once payment is verified, your access will be restored. Contact admin@ctsetsjm.com or WhatsApp 876-381-9771 if you need assistance.</p>'
                + '</div></body></html>',
              name: "CTS ETS Finance"
            });
          } catch(e) {}
          
          // Notify admin
          try {
            GmailApp.sendEmail(ADMIN_EMAIL, "LMS Blocked \u2014 " + stuNum + " \u2014 Overdue Payment", "", {
              htmlBody: "<h2>LMS Access Blocked</h2><p><b>" + stuNum + "</b> \u2014 " + firstName + "</p><p>Overdue: " + instalment + " (" + amountStr + " due " + dueDateStr + ")</p><p>LMS set to No. Restore manually in Enrolled Students when payment received.</p>",
              name: "CTS ETS System"
            });
          } catch(e) {}
        }
      }
      
      // Only process the first unpaid instalment per student
      break;
    }
  }
  Logger.log("Payment reminders processed");
}

function sendPaymentReminder(email, firstName, stuNum, programme, instalment, amount, dueDate, urgency) {
  var isOverdue = urgency === "overdue";
  var bgColor = isOverdue ? "#C62828" : urgency === "1 week" ? "#E65100" : "#F57F17";
  var urgencyText = isOverdue ? "OVERDUE" : "Due in " + urgency;
  
  try {
    GmailApp.sendEmail(email, "CTS ETS \u2014 Payment " + (isOverdue ? "Overdue" : "Reminder") + " \u2014 " + instalment + " (" + amount + ")", "", {
      htmlBody: '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
        + '<div style="background:#011E40;padding:20px;text-align:center;border-radius:12px 12px 0 0">'
        + '<h1 style="color:#D4A843;font-size:20px;margin:0">CTS ETS</h1>'
        + '<p style="color:rgba(255,255,255,0.6);font-size:11px;margin:4px 0 0">Payment ' + (isOverdue ? "Notice" : "Reminder") + '</p></div>'
        + '<div style="padding:28px;background:#fff;border:1px solid #e2e8f0;border-top:none">'
        + '<p style="color:#4A5568;line-height:1.7">Dear ' + firstName + ',</p>'
        + '<div style="background:' + bgColor + ';color:#fff;padding:14px 20px;border-radius:8px;text-align:center;margin:16px 0">'
        + '<div style="font-size:12px;opacity:0.8">' + urgencyText.toUpperCase() + '</div>'
        + '<div style="font-size:24px;font-weight:800;margin:4px 0">' + amount + '</div>'
        + '<div style="font-size:12px">' + instalment + ' \u2014 Due: ' + dueDate + '</div></div>'
        + '<p style="color:#4A5568;line-height:1.7">Programme: <strong>' + programme + '</strong></p>'
        + (isOverdue ? '<p style="color:#C62828;font-weight:700;line-height:1.7">Your Learning Portal access will be suspended until this payment is received.</p>' : '')
        + '<div style="text-align:center;margin:20px 0"><a href="https://jm.wipayfinancial.com/to_me/cts_empowerment_and_training_solutions" style="display:inline-block;padding:14px 32px;background:' + bgColor + ';color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Pay Now</a></div>'
        + '<p style="color:#4A5568;font-size:12px">Reference: <strong>' + stuNum + '</strong> \u2014 use this when making payment</p>'
        + '<p style="color:#4A5568;line-height:1.7;font-size:12px">Questions? Email admin@ctsetsjm.com or WhatsApp 876-381-9771</p>'
        + '</div></body></html>',
      name: "CTS ETS Finance"
    });
    Logger.log("Payment reminder (" + urgency + ") sent to: " + email + " for " + instalment);
  } catch(e) { Logger.log("Payment reminder error: " + e.message); }
}

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
    if (status !== "Active" && status !== "Enrolled") continue;

    var email = String(row[c["Email"]]||"").trim();
    var firstName = String(row[c["First Name"]]||"").trim();
    var programme = String(row[c["Programme"]]||"").trim();
    if (!email) continue;

    var lastSent = row[c["Last Encouragement"]];
    var count = Number(row[c["Encouragement Count"]]||0);

    // Check if 7 days since last encouragement (or enrollment if never sent)
    var lastDate = lastSent ? new Date(lastSent) : new Date(row[c["Enrolled Date"]]||now);
    var daysSince = Math.floor((now - lastDate) / (1000*60*60*24));

    if (daysSince >= 7) {
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

// ═══════════════════════════════════════════════════════════════════════
// CUMULATIVE STUDENT RECORD — Live document, grows with every event
// Legal size (8.5"×14"), page breaks, ministry-ready
// APPEND-ONLY: New versions are added, old versions are NEVER deleted
// Only admin with authorization code can overwrite/delete records
// ═══════════════════════════════════════════════════════════════════════
var RECORD_AUTH_CODE = "Detailed1982"; // Change this to your secret code

function generateCumulativeRecord(studentNum) {
  loadIds();
  if (!studentNum) return {ok:false, error:"Student number required"};
  
  var es = sTab("Enrolled Students"), ed = es.getDataRange().getValues(), eh = ed[0], ec = {};
  for (var i=0; i<eh.length; i++) ec[String(eh[i]).trim()] = i;
  var studentRow = null, appRef = "";
  for (var i=1; i<ed.length; i++) {
    if (String(ed[i][ec["Student Number"]]||"").trim().toUpperCase() === studentNum.toUpperCase()) {
      studentRow = ed[i]; appRef = String(ed[i][ec["Application Ref"]]||"").trim(); break;
    }
  }
  if (!studentRow) return {ok:false, error:"Student not found: " + studentNum};
  
  var profile = getStudentProfile(appRef);
  var firstName = String(studentRow[ec["First Name"]]||"").trim();
  var lastName = String(studentRow[ec["Last Name"]]||"").trim();
  var fullName = firstName + (profile.middleName ? " " + profile.middleName : "") + " " + lastName;
  var today = new Date();
  var dateStr = Utilities.formatDate(today, "America/Jamaica", "dd MMM yyyy, h:mm a");
  var versionStamp = Utilities.formatDate(today, "America/Jamaica", "yyyyMMdd_HHmmss");
  var v = function(val) { return val || "\u2014"; };
  
  var photoImg = profile.photoUrl 
    ? '<img src="' + profile.photoUrl + '" style="width:90px;height:110px;object-fit:cover;border:1px solid #999;border-radius:3px" />' 
    : '<div style="width:90px;height:110px;border:1px solid #999;display:flex;align-items:center;justify-content:center;background:#f5f5f5;font-size:9px;color:#999;text-align:center">No Photo<br>On File</div>';
  
  // Get ALL lifecycle events
  var lc = sTab("Student Lifecycle"), ld = lc.getDataRange().getValues(), lh = ld[0], lcc = {};
  for (var i=0; i<lh.length; i++) lcc[String(lh[i]).trim()] = i;
  var events = [];
  for (var i=1; i<ld.length; i++) {
    var eRef = String(ld[i][lcc["Application Ref"]]||"").trim().toUpperCase();
    var eStu = String(ld[i][lcc["Student Number"]]||"").trim().toUpperCase();
    if (eRef === appRef.toUpperCase() || eStu === studentNum.toUpperCase()) {
      events.push({
        date: ld[i][lcc["Date/Time"]] ? Utilities.formatDate(new Date(ld[i][lcc["Date/Time"]]), "America/Jamaica", "dd MMM yyyy, h:mm a") : "",
        event: ld[i][lcc["Event Type"]]||"", category: ld[i][lcc["Category"]]||"",
        details: ld[i][lcc["Details"]]||"",
        from: ld[i][lcc["Previous Value"]]||"", to: ld[i][lcc["New Value"]]||"",
        by: ld[i][lcc["Performed By"]]||""
      });
    }
  }
  
  // Get ALL payment records
  var ps = fTab("Payment Schedule"), pd = ps.getDataRange().getValues();
  var payments = [];
  for (var i=1; i<pd.length; i++) {
    if (String(pd[i][1]||"").trim().toUpperCase() === appRef.toUpperCase()) {
      payments.push({
        date: pd[i][0] ? Utilities.formatDate(new Date(pd[i][0]), "America/Jamaica", "dd MMM yyyy") : "",
        type: pd[i][8]||"", amount: "J$" + (Number(pd[i][9])||0).toLocaleString(),
        status: pd[i][11]||"", method: pd[i][10]||"", plan: pd[i][6]||""
      });
    }
  }
  
  // Get communication log
  var cl = sTab("Communication Log"), cd = cl.getDataRange().getValues(), clh = cd[0], clc = {};
  for (var i=0; i<clh.length; i++) clc[String(clh[i]).trim()] = i;
  var comms = [];
  for (var i=1; i<cd.length; i++) {
    var cRef = String(cd[i][clc["App Ref"]]||"").trim().toUpperCase();
    var cStu = String(cd[i][clc["Student Number"]]||"").trim().toUpperCase();
    if (cRef === appRef.toUpperCase() || cStu === studentNum.toUpperCase()) {
      comms.push({
        date: cd[i][clc["Timestamp"]] ? Utilities.formatDate(new Date(cd[i][clc["Timestamp"]]), "America/Jamaica", "dd MMM yyyy") : "",
        channel: cd[i][clc["Channel"]]||"", direction: cd[i][clc["Direction"]]||"",
        subject: cd[i][clc["Subject"]]||"", summary: cd[i][clc["Summary"]]||""
      });
    }
  }
  
  // Build table rows
  var eventRows = "";
  for (var i=0; i<events.length; i++) {
    var e = events[i];
    eventRows += '<tr><td style="width:18%">' + v(e.date) + '</td><td style="width:14%">' + v(e.event) + '</td><td style="width:10%">' + v(e.category) + '</td><td style="width:35%">' + v(e.details) + '</td><td style="width:13%">' + (e.from && e.to ? e.from + " \u2192 " + e.to : v(e.to || e.from)) + '</td><td style="width:10%">' + v(e.by) + '</td></tr>';
  }
  if (!eventRows) eventRows = '<tr><td colspan="6" style="text-align:center;color:#999;padding:10px">No lifecycle events recorded.</td></tr>';
  
  var payRows = "";
  for (var i=0; i<payments.length; i++) {
    var p = payments[i];
    payRows += '<tr><td>' + v(p.date) + '</td><td>' + v(p.type) + '</td><td style="font-weight:700">' + v(p.amount) + '</td><td>' + v(p.status) + '</td><td>' + v(p.method) + '</td><td>' + v(p.plan) + '</td></tr>';
  }
  if (!payRows) payRows = '<tr><td colspan="6" style="text-align:center;color:#999;padding:10px">No payment records.</td></tr>';
  
  var commRows = "";
  for (var i=0; i<comms.length; i++) {
    var cm = comms[i];
    commRows += '<tr><td>' + v(cm.date) + '</td><td>' + v(cm.channel) + '</td><td>' + v(cm.direction) + '</td><td>' + v(cm.subject) + '</td><td>' + v(cm.summary) + '</td></tr>';
  }
  if (!commRows) commRows = '<tr><td colspan="5" style="text-align:center;color:#999;padding:10px">No communications logged.</td></tr>';
  
  var status = studentRow[ec["Status"]]||"";
  var payStatus = studentRow[ec["Payment Status"]]||"";
  var totalFees = Number(studentRow[ec["Total Fees"]]||0);
  var totalPaid = Number(studentRow[ec["Total Paid"]]||0);
  var outstanding = Number(studentRow[ec["Outstanding"]]||0);
  var cohort = studentRow[ec["Cohort"]]||"";
  var startDate = studentRow[ec["Start Date"]]||"";
  var endDate = studentRow[ec["End Date"]]||"";
  var paymentPlan = studentRow[ec["Payment Plan"]]||"";
  var enrolledDate = studentRow[ec["Enrolled Date"]]||"";
  var programme = studentRow[ec["Programme"]]||"";
  var level = studentRow[ec["Level"]]||"";
  
  // Determine how many pages needed for events
  var eventsPerPage = 25;
  var totalEventPages = Math.max(1, Math.ceil(events.length / eventsPerPage));
  
  var css = '*{margin:0;padding:0;box-sizing:border-box}'
    + 'body{font-family:Arial,Helvetica,sans-serif;font-size:9px;color:#111}'
    + '@page{size:8.5in 14in;margin:12mm 10mm}'
    + '.page{width:100%;padding:8mm 0;page-break-after:always}'
    + '.page:last-child{page-break-after:auto}'
    + '.hdr{background:#011E40;padding:10px 14px;display:flex;justify-content:space-between;align-items:center}'
    + '.hdr h1{color:#D4A843;font-size:14px;margin:0;font-weight:700}'
    + '.hdr .sub{color:rgba(255,255,255,.7);font-size:8px;margin-top:2px}'
    + '.hdr .right{text-align:right;color:rgba(255,255,255,.5);font-size:7px}'
    + '.sec{background:#011E40;color:#D4A843;padding:4px 10px;font-size:9px;font-weight:700;letter-spacing:.5px;margin-top:8px}'
    + 'table{width:100%;border-collapse:collapse;margin-bottom:2px}'
    + 'td,th{border:1px solid #aaa;padding:3px 6px;font-size:8px;vertical-align:top;text-align:left}'
    + 'th{background:#011E40;color:#D4A843;font-weight:700;font-size:7px;letter-spacing:.3px}'
    + 'td.l{background:#f0f4f8;font-weight:600;color:#333;width:22%}'
    + 'td.v{font-weight:500}'
    + '.live-tag{display:inline-block;background:#38A169;color:#fff;padding:2px 8px;border-radius:10px;font-size:7px;font-weight:700}'
    + '.status-badge{display:inline-block;padding:2px 10px;border-radius:10px;font-size:8px;font-weight:700}'
    + '.ft{font-size:7px;color:#888;text-align:center;border-top:1px solid #ccc;padding-top:4px;margin-top:8px}'
    + '.version{font-size:6px;color:#aaa;text-align:right;margin-top:2px}'
    + '@media print{.page{page-break-after:always}}';

  // PAGE 1
  var page1 = '<div class="page">'
    + '<div class="hdr"><div><h1>CTS Empowerment & Training Solutions</h1>'
    + '<div class="sub">CUMULATIVE STUDENT RECORD \u2014 <span class="live-tag">LIVE DOCUMENT</span></div></div>'
    + '<div class="right">Generated: ' + dateStr + '<br>COJ Reg. No. 16007/2025<br>6, Newark Avenue, Kingston 2</div></div>'
    + '<div class="version">Version: ' + versionStamp + ' | Events: ' + events.length + ' | Payments: ' + payments.length + '</div>'
    + '<div class="sec">1. STUDENT IDENTIFICATION</div>'
    + '<table><tr><td rowspan="5" style="width:100px;text-align:center;vertical-align:middle">' + photoImg + '</td>'
    + '<td class="l">Student Number</td><td class="v" style="font-size:11px;font-weight:700;letter-spacing:1px">' + v(studentNum) + '</td>'
    + '<td class="l">Application Ref</td><td class="v">' + v(appRef) + '</td></tr>'
    + '<tr><td class="l">Full Name</td><td class="v" colspan="3" style="font-size:10px;font-weight:700">' + fullName.toUpperCase() + '</td></tr>'
    + '<tr><td class="l">Maiden Name</td><td class="v">' + v(profile.maidenName) + '</td><td class="l">Date of Birth</td><td class="v">' + v(profile.dob) + '</td></tr>'
    + '<tr><td class="l">Gender</td><td class="v">' + v(profile.gender) + '</td><td class="l">Nationality</td><td class="v">' + v(profile.nationality) + '</td></tr>'
    + '<tr><td class="l">TRN</td><td class="v">' + v(profile.trn) + '</td><td class="l">NIS #</td><td class="v">' + v(profile.nis) + '</td></tr></table>'
    + '<div class="sec">2. CONTACT INFORMATION</div>'
    + '<table><tr><td class="l">Email</td><td class="v" colspan="3">' + v(studentRow[ec["Email"]]) + '</td></tr>'
    + '<tr><td class="l">Phone 1</td><td class="v">' + v(studentRow[ec["Phone"]]) + '</td><td class="l">Phone 2</td><td class="v">' + v(profile.phone2) + '</td></tr>'
    + '<tr><td class="l">Address</td><td class="v" colspan="3">' + v(profile.address) + (profile.district ? ", " + profile.district : "") + (profile.postalZone ? ", " + profile.postalZone : "") + '</td></tr>'
    + '<tr><td class="l">Parish</td><td class="v">' + v(profile.parish) + '</td><td class="l">Country</td><td class="v">' + v(profile.country) + '</td></tr>'
    + '<tr><td class="l">Marital Status</td><td class="v">' + v(profile.maritalStatus) + '</td><td class="l">Special Needs</td><td class="v">' + (profile.specialNeeds === "Yes" ? "Yes \u2014 " + v(profile.specialNeedsType) : "No") + '</td></tr></table>'
    + '<div class="sec">3. EMERGENCY CONTACTS</div>'
    + '<table><tr><th colspan="3">EMERGENCY CONTACT #1</th><th colspan="3">EMERGENCY CONTACT #2</th></tr>'
    + '<tr><td class="l">Name</td><td class="v" colspan="2">' + v(profile.emergencyName) + '</td><td class="l">Name</td><td class="v" colspan="2">' + v(profile.emergency2Name) + '</td></tr>'
    + '<tr><td class="l">Phone</td><td class="v" colspan="2">' + v(profile.emergencyPhone) + '</td><td class="l">Phone</td><td class="v" colspan="2">' + v(profile.emergency2Phone) + '</td></tr>'
    + '<tr><td class="l">Relationship</td><td class="v" colspan="2">' + v(profile.emergencyRelationship) + '</td><td class="l">Relationship</td><td class="v" colspan="2">' + v(profile.emergency2Relationship) + '</td></tr></table>'
    + '<div class="sec">4. EDUCATION & EMPLOYMENT</div>'
    + '<table><tr><td class="l">Highest Qualification</td><td class="v">' + v(profile.highestQualification) + '</td><td class="l">Year Completed</td><td class="v">' + v(profile.yearCompleted) + '</td></tr>'
    + '<tr><td class="l">Last School</td><td class="v" colspan="3">' + v(profile.schoolLastAttended) + '</td></tr>'
    + '<tr><td class="l">Employment Status</td><td class="v">' + v(profile.employmentStatus) + '</td><td class="l">Employer</td><td class="v">' + v(profile.employer) + '</td></tr>'
    + '<tr><td class="l">Job Title</td><td class="v" colspan="3">' + v(profile.jobTitle) + '</td></tr></table>'
    + '<div class="sec">5. PROGRAMME & ENROLMENT</div>'
    + '<table><tr><td class="l">Programme</td><td class="v" colspan="3" style="font-weight:700;font-size:9px">' + v(programme) + '</td></tr>'
    + '<tr><td class="l">Level</td><td class="v">' + v(level) + '</td><td class="l">Payment Plan</td><td class="v">' + v(paymentPlan) + '</td></tr>'
    + '<tr><td class="l">Cohort</td><td class="v">' + v(cohort) + '</td><td class="l">Enrolled Date</td><td class="v">' + (enrolledDate ? Utilities.formatDate(new Date(enrolledDate), "America/Jamaica", "dd MMM yyyy") : "\u2014") + '</td></tr>'
    + '<tr><td class="l">Start Date</td><td class="v">' + v(startDate) + '</td><td class="l">End Date</td><td class="v">' + v(endDate) + '</td></tr>'
    + '<tr><td class="l">Current Status</td><td class="v"><span class="status-badge" style="background:' + (status==="Enrolled"||status==="Active"?"#38A169":status==="Graduated"?"#D4A843":"#E8634A") + ';color:#fff">' + v(status) + '</span></td>'
    + '<td class="l">LMS Access</td><td class="v">' + v(studentRow[ec["LMS Access"]]) + '</td></tr></table>'
    + '<div class="sec">6. FINANCIAL SUMMARY</div>'
    + '<table><tr><td class="l">Total Fees</td><td class="v" style="font-weight:700">J$' + totalFees.toLocaleString() + '</td><td class="l">Total Paid</td><td class="v" style="font-weight:700;color:#38A169">J$' + totalPaid.toLocaleString() + '</td></tr>'
    + '<tr><td class="l">Outstanding</td><td class="v" style="font-weight:700;color:' + (outstanding > 0 ? "#E8634A" : "#38A169") + '">J$' + outstanding.toLocaleString() + '</td><td class="l">Payment Status</td><td class="v">' + v(payStatus) + '</td></tr></table>'
    + '<div class="ft">CTS ETS \u2014 Cumulative Student Record \u2014 ' + studentNum + ' \u2014 Page 1 | APPEND-ONLY \u2014 This document cannot be altered without authorization.</div></div>';

  // PAGE 2: Events + Payments + Comms
  var page2 = '<div class="page">'
    + '<div class="hdr"><div><h1>' + fullName.toUpperCase() + '</h1><div class="sub">' + studentNum + ' | ' + programme + ' | ' + level + '</div></div>'
    + '<div class="right">CUMULATIVE RECORD \u2014 Page 2<br>' + dateStr + '</div></div>'
    + '<div class="sec">7. STUDENT LIFECYCLE \u2014 CHRONOLOGICAL EVENT LOG (' + events.length + ' events)</div>'
    + '<table><tr><th>Date/Time</th><th>Event</th><th>Category</th><th>Details</th><th>Change</th><th>By</th></tr>' + eventRows + '</table>'
    + '<div class="sec">8. PAYMENT HISTORY (' + payments.length + ' records)</div>'
    + '<table><tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th><th>Method</th><th>Plan</th></tr>' + payRows + '</table>'
    + '<div class="sec">9. COMMUNICATION LOG (' + comms.length + ' entries)</div>'
    + '<table><tr><th>Date</th><th>Channel</th><th>Direction</th><th>Subject</th><th>Summary</th></tr>' + commRows + '</table>'
    + '<div class="ft">CTS ETS \u2014 Cumulative Student Record \u2014 ' + studentNum + ' \u2014 Page 2 | APPEND-ONLY \u2014 This document cannot be altered without authorization.</div></div>';

  // PAGE 3: Notes + Assessment + Sign-off
  var page3 = '<div class="page">'
    + '<div class="hdr"><div><h1>' + fullName.toUpperCase() + '</h1><div class="sub">' + studentNum + ' | ' + programme + ' | ' + level + '</div></div>'
    + '<div class="right">CUMULATIVE RECORD \u2014 Page 3<br>' + dateStr + '</div></div>'
    + '<div class="sec">10. ADMINISTRATIVE NOTES</div>'
    + '<div style="min-height:100px;border:1px solid #aaa;padding:6px;font-size:8px;color:#999;line-height:2">'
    + '___________________________________________________________________________________________________________<br>'
    + '___________________________________________________________________________________________________________<br>'
    + '___________________________________________________________________________________________________________<br>'
    + '___________________________________________________________________________________________________________<br>'
    + '___________________________________________________________________________________________________________</div>'
    + '<div class="sec">11. ASSESSMENT & CERTIFICATION</div>'
    + '<table><tr><th style="width:18%">Date</th><th style="width:30%">Assessment / Module</th><th style="width:15%">Result</th><th style="width:17%">Assessor</th><th style="width:20%">Notes</th></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>'
    + '<div class="sec">12. OFFICIAL SIGN-OFF</div>'
    + '<div style="padding:8px;border:1px solid #aaa">'
    + '<div style="font-size:8px;color:#333;line-height:1.6;margin-bottom:10px">I certify that the information contained in this cumulative student record is accurate and complete to the best of my knowledge. This record has been maintained in accordance with CTS ETS institutional policies and regulatory requirements.</div>'
    + '<div style="display:flex;justify-content:space-between;margin-top:16px">'
    + '<div style="width:30%"><div style="border-bottom:1px solid #333;height:28px"></div><div style="font-size:7px;color:#666;margin-top:3px">Principal / Administrator</div></div>'
    + '<div style="width:30%"><div style="border-bottom:1px solid #333;height:28px"></div><div style="font-size:7px;color:#666;margin-top:3px">Date</div></div>'
    + '<div style="width:30%"><div style="border-bottom:1px solid #333;height:28px"></div><div style="font-size:7px;color:#666;margin-top:3px">Official Stamp</div></div></div>'
    + '<div style="display:flex;justify-content:space-between;margin-top:16px">'
    + '<div style="width:30%"><div style="border-bottom:1px solid #333;height:28px"></div><div style="font-size:7px;color:#666;margin-top:3px">Student Signature</div></div>'
    + '<div style="width:30%"><div style="border-bottom:1px solid #333;height:28px"></div><div style="font-size:7px;color:#666;margin-top:3px">Date</div></div>'
    + '<div style="width:30%"></div></div></div>'
    + '<div style="margin-top:8px;font-size:7px;color:#999;text-align:center;border:1px dashed #ccc;padding:5px">'
    + '<strong>DOCUMENT CONTROL:</strong> This cumulative record is an APPEND-ONLY live document. New versions are generated as events occur. '
    + 'Previous versions are retained and marked with their version timestamp. No record may be deleted or overwritten without '
    + 'written authorization from the Principal (code: CTSETS-ADMIN-XXXX). For audit purposes, note the version stamp on page 1.</div>'
    + '<div class="ft">CTS ETS \u2014 Cumulative Student Record \u2014 ' + studentNum + ' \u2014 Page 3 of 3 | Version: ' + versionStamp + ' | admin@ctsetsjm.com | 876-525-6802 | 876-381-9771</div></div>';

  var html = '<!DOCTYPE html><html><head><style>' + css + '</style></head><body>' + page1 + page2 + page3 + '</body></html>';
  
  // APPEND-ONLY: Save new version, NEVER delete old ones
  var rf = DriveApp.getFoldersByName("CTS ETS Student Records");
  var folder = rf.hasNext() ? rf.next() : DriveApp.createFolder("CTS ETS Student Records");
  
  // Create student subfolder if doesn't exist
  var stuFolders = folder.getFoldersByName(studentNum);
  var stuFolder = stuFolders.hasNext() ? stuFolders.next() : folder.createFolder(studentNum + " \u2014 " + firstName + " " + lastName);
  
  // Save with version timestamp — old versions are kept
  var fileName = studentNum + " \u2014 Cumulative Record \u2014 v" + versionStamp + ".html";
  stuFolder.createFile(fileName, html, "text/html");
  
  // Also save a "LATEST" copy for easy access (this one gets replaced)
  var latestName = studentNum + " \u2014 Cumulative Record \u2014 LATEST.html";
  var latestFiles = stuFolder.getFilesByName(latestName);
  while (latestFiles.hasNext()) { latestFiles.next().setTrashed(true); }
  stuFolder.createFile(latestName, html, "text/html");
  
  audit("RECORD GENERATED", appRef, "Cumulative record v" + versionStamp + " for " + studentNum + " (" + events.length + " events, " + payments.length + " payments)", "System");
  Logger.log("Cumulative record v" + versionStamp + " saved: " + fileName);
  return {ok:true, message:"Cumulative record generated for " + studentNum + " (v" + versionStamp + ")"};
}

// Admin-only: Delete or overwrite a student record version
function deleteStudentRecord(studentNum, authCode, fileName) {
  if (authCode !== RECORD_AUTH_CODE) {
    audit("UNAUTHORIZED", studentNum, "Attempted record deletion with invalid auth code", "Unknown");
    return {ok:false, error:"Authorization denied. Invalid admin code."};
  }
  try {
    loadIds();
    var rf = DriveApp.getFoldersByName("CTS ETS Student Records");
    if (!rf.hasNext()) return {ok:false, error:"Records folder not found"};
    var folder = rf.next();
    var stuFolders = folder.getFoldersByName(studentNum.split(" ")[0]);
    if (!stuFolders.hasNext()) return {ok:false, error:"Student folder not found"};
    var stuFolder = stuFolders.next();
    
    if (fileName) {
      // Delete specific version
      var files = stuFolder.getFilesByName(fileName);
      if (files.hasNext()) {
        files.next().setTrashed(true);
        audit("RECORD DELETED", studentNum, "Authorized deletion of: " + fileName + " by admin", "Admin");
        return {ok:true, message:"Record version deleted: " + fileName};
      }
      return {ok:false, error:"File not found: " + fileName};
    }
    return {ok:false, error:"Specify a fileName to delete"};
  } catch(e) { return {ok:false, error:e.message}; }
}

function audit(action,ref,details,by) {
  try{oTab("Audit Log").appendRow([new Date(),action,ref||"","",String(details||"").substring(0,80),details||"",by||"System"]);}catch(e){}
}

function lifecycle(ref,sid,name,event,cat,details,prog,level) {
  try{sTab("Student Lifecycle").appendRow([new Date(),ref||"",sid||"",name||"",event||"",cat||"",details||"","","",prog||"",level||"","System","Website"]);}catch(e){}
}
