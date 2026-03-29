// ═══════════════════════════════════════════════════════════════════════
// CTS ETS — MULTI-SHEET APPS SCRIPT BACKEND v2
// ═══════════════════════════════════════════════════════════════════════
// SETUP: Create a new Google Sheet (Master Dashboard), paste this into
// Extensions > Apps Script > Code.gs, then run setupAllSheets().
// This auto-creates 4 child sheets with all tabs + headers.
// ═══════════════════════════════════════════════════════════════════════

var ADMIN_EMAIL = "info@ctsetsjm.com";
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
  makeTab(s1,"Student Tracker",["Student ID","Application Ref","Date Submitted","Form Type","Applicant Type","Last Name","First Name","Middle Name","Email","Phone","TRN","NIS","Parish","Country","Gender","Date of Birth","Address","Nationality","Marital Status","Highest Qualification","School Last Attended","Year Completed","Employment Status","Employer","Job Title","Industry","Years Experience","Emergency Name","Emergency Phone","Emergency Relationship","Level","Programme","Payment Plan","Hear About Us","Referral Code","Message","Documents Uploaded","Drive Folder Link","Status","Payment Status","Payment Reference","Enrolment Date","Class Start","Completion Date","Is Founding Member","Founding Member #"]);
  makeTab(s1,"Student Lifecycle",["Date/Time","Application Ref","Student ID","Student Name","Event Type","Category","Details","Previous Value","New Value","Programme","Level","Performed By","Source"]);
  makeTab(s1,"Drip Log",["Student ID","App Ref","Email","Student Name","Programme","Level","Enrolled Date","day1_welcome","day3_tips","day7_checkin","day14_encourage"]);
  makeTab(s1,"Communication Log",["Timestamp","Student Name","Student ID","App Ref","Channel","Direction","Subject","Summary","Logged By"]);
  makeTab(s1,"Employer Contacts",["Organisation","Contact Name","Email","Phone","Students Enrolled","Discount","Notes"]);
  makeTab(s1,"Testimonials",["Date","Student Name","Programme","Level","Quote","Permission","Photo Consent","Student ID","Email","Status"]);
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
    ["📘 1. STUDENT RECORDS", s1, "#011E40", ["Student Tracker","Student Lifecycle","Drip Log","Communication Log","Employer Contacts","Testimonials"]],
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
  var s=sTab("Student Tracker"), d=s.getDataRange().getValues(), h=d[0], c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;
  for(var i=1;i<d.length;i++){
    var row=d[i], ar=String(row[c["Application Ref"]]||"").trim().toUpperCase(), re=String(row[c["Email"]]||"").trim().toLowerCase();
    var match=false;
    if(ref&&ar===ref.trim().toUpperCase()) match=true;
    if(!match&&email&&re===email.trim().toLowerCase()) match=true;
    if(match) return {
      found:true, ref:ar, studentId:row[c["Student ID"]]||"",
      name:((row[c["First Name"]]||"")+" "+(row[c["Last Name"]]||"")).trim(),
      email:row[c["Email"]]||"", phone:row[c["Phone"]]||"",
      programme:row[c["Programme"]]||"", level:row[c["Level"]]||"",
      paymentPlan:row[c["Payment Plan"]]||"",
      status:row[c["Status"]]||"Under Review",
      paymentStatus:row[c["Payment Status"]]||"Pending",
      isFoundingMember:String(row[c["Is Founding Member"]]||"").toLowerCase()==="yes",
      foundingMemberNumber:row[c["Founding Member #"]]||"",
      amountDue:getAmtDue(ar)
    };
  }
  return {found:false};
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
  var s=sTab("Student Tracker"),all=s.getDataRange().getValues(),h=all[0],c={};
  for(var i=0;i<h.length;i++) c[String(h[i]).trim()]=i;

  // Duplicate check
  for(var i=1;i<all.length;i++){
    var ee=String(all[i][c["Email"]]||"").trim().toLowerCase();
    var pp=String(all[i][c["Programme"]]||"").trim().toLowerCase();
    if(ee===(data.email||"").trim().toLowerCase()&&pp===(data.programme||"").trim().toLowerCase())
      return {success:false,duplicate:true,message:"Application with this email/programme exists.",existingRef:all[i][c["Application Ref"]]||""};
  }

  // Founding check
  var fc=getFoundingCount(data.programme||"",data.level||"");
  var isFounding=fc.count<fc.maxSpots, fNum=isFounding?fc.count+1:"";
  var ref=data.ref||"", now=new Date();

  s.appendRow([
    "",ref,now,data.form_type||"Student Application",data.applicantType||"",
    data.lastName||"",data.firstName||"",data.middleName||"",data.email||"",data.phone||"",
    data.trn||"",data.nis||"",data.parish||"",data.country||"",data.gender||"",
    data.dob||"",data.address||"",data.nationality||"",data.maritalStatus||"",
    data.highestQualification||"",data.schoolLastAttended||"",data.yearCompleted||"",
    data.employmentStatus||"",data.employer||"",data.jobTitle||"",data.industry||"",data.yearsExperience||"",
    data.emergencyName||"",data.emergencyPhone||"",data.emergencyRelationship||"",
    data.level||"",data.programme||"","",
    data.hearAbout||"",data.referralCode||"",data.message||"",
    "","","Under Review","Pending","","","","",
    isFounding?"Yes":"No",fNum
  ]);

  // Save files
  var fl=saveDriveFiles(data,ref);
  if(fl.url){var lr=s.getLastRow();
    if(c["Drive Folder Link"]!==undefined) s.getRange(lr,c["Drive Folder Link"]+1).setValue(fl.url);
    if(c["Documents Uploaded"]!==undefined) s.getRange(lr,c["Documents Uploaded"]+1).setValue(fl.names);
  }

  if(isFounding) updateFC(data.programme||"");

  audit("APPLICATION RECEIVED",ref,(data.firstName||"")+" "+(data.lastName||"")+" | "+(data.programme||""),"Website");
  lifecycle(ref,"",(data.firstName||"")+" "+(data.lastName||""),"Application Submitted","Administrative",
    "Email: "+(data.email||"")+" | "+(data.applicantType||"")+" | Founding: "+(isFounding?"Yes #"+fNum:"No"),data.programme||"",data.level||"");

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
  var s=sTab("Student Tracker"),d=s.getDataRange().getValues(),h=d[0],mi=-1,ti=-1;
  for(var i=0;i<h.length;i++){if(String(h[i]).trim()===matchCol)mi=i;if(String(h[i]).trim()===targetCol)ti=i;}
  if(mi<0||ti<0) return;
  for(var i=1;i<d.length;i++){
    if(String(d[i][mi]||"").trim().toUpperCase()===matchVal.trim().toUpperCase()){s.getRange(i+1,ti+1).setValue(newVal);return;}
  }
}

function audit(action,ref,details,by) {
  try{oTab("Audit Log").appendRow([new Date(),action,ref||"","",String(details||"").substring(0,80),details||"",by||"System"]);}catch(e){}
}

function lifecycle(ref,sid,name,event,cat,details,prog,level) {
  try{sTab("Student Lifecycle").appendRow([new Date(),ref||"",sid||"",name||"",event||"",cat||"",details||"","","",prog||"",level||"","System","Website"]);}catch(e){}
}
