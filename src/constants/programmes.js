import { REG_FEE } from "./config";
export const PROGRAMMES = {
  "Job / Professional Certificates": [
    { name: "Basic Digital Literacy Skills Proficiency", duration: "3 months", tuition: "J$10,000", total: "J$15,000", desc: "Build essential computer and internet skills for today's digital workplace." },
    { name: "Customer Service Rep - Admin Asst.", duration: "3 months", tuition: "J$10,000", total: "J$15,000", desc: "Gain front-line customer service and office administration capabilities.", popular: true },
    { name: "Customer Service Rep - Office Admin", duration: "3 months", tuition: "J$10,000", total: "J$15,000", desc: "Develop professional office administration and client-facing skills." },
    { name: "Data Entry Advanced Processor", duration: "2 months", tuition: "J$10,000", total: "J$15,000", desc: "Take your data processing skills to the next level." },
    { name: "Data Entry Processor", duration: "2 months", tuition: "J$10,000", total: "J$15,000", desc: "Master accurate, efficient data entry and basic records management." },
    { name: "Data Protection Officer", duration: "3 months", tuition: "J$10,000", total: "J$15,000", desc: "Understand data privacy regulations and compliance." },
    { name: "Human Resource Administrator", duration: "4 months", tuition: "J$10,000", total: "J$15,000", desc: "Build foundational HR skills including recruitment and compliance." },
    { name: "Industrial Security Ops Manager", duration: "3 months", tuition: "J$10,000", total: "J$15,000", desc: "Prepare for supervisory roles in security operations." },
    { name: "Introduction to ICT Proficiency", duration: "2 months", tuition: "J$10,000", total: "J$15,000", desc: "A foundational course in information and communication technology." },
    { name: "Team Leader", duration: "2.5 months", tuition: "J$10,000", total: "J$15,000", desc: "Learn to lead, motivate, and manage small teams effectively.", popular: true },
  ],
  "Level 2 - Vocational Certificates": [
    { name: "Accounting", duration: "6 months", tuition: "J$15,000", total: "J$20,000", desc: "Foundation-level accounting - journal entries, ledgers, payroll, and financial record keeping aligned to NCTVET standards.", popular: true },
    { name: "Administrative Assistance", duration: "6 months", tuition: "J$15,000", total: "J$20,000", desc: "Professional office management and administrative support." },
    { name: "Business Administration (Secretarial)", duration: "6 months", tuition: "J$15,000", total: "J$20,000", desc: "Comprehensive secretarial and business administration training." },
    { name: "Customer Service", duration: "6 months", tuition: "J$15,000", total: "J$20,000", desc: "Structured customer service delivery and communication skills.", popular: true },
    { name: "Entrepreneurship", duration: "6 months", tuition: "J$15,000", total: "J$20,000", desc: "Plan, launch, and manage a small business venture." },
    { name: "Industrial Security Operations", duration: "6 months", tuition: "J$15,000", total: "J$20,000", desc: "Formalise your security experience with recognised certification.", popular: true },
  ],
  "Level 3 - Diploma": [
    { name: "Accounting", duration: "8 months", tuition: "J$20,000", total: "J$25,000", desc: "Comprehensive accounting - financial reporting, costing, accounts receivable/payable, payroll, and supervisory accounting functions. 13 NCTVET clusters, 161 credits.", popular: true },
    { name: "Business Administration - Management", duration: "7 months", tuition: "J$20,000", total: "J$25,000", desc: "Core business management for aspiring mid-level managers.", popular: true },
    { name: "Customer Service", duration: "7 months", tuition: "J$20,000", total: "J$25,000", desc: "Advanced strategy, quality assurance, and team coordination." },
    { name: "Customer Service Supervision", duration: "7 months", tuition: "J$20,000", total: "J$25,000", desc: "Lead and supervise customer-facing teams with confidence.", popular: true },
    { name: "Entrepreneurship", duration: "7 months", tuition: "J$20,000", total: "J$25,000", desc: "Advanced business planning, financial management, and growth." },
    { name: "Industrial Security Operations", duration: "7 months", tuition: "J$20,000", total: "J$25,000", desc: "Senior-level security operations and risk assessment." },
    { name: "Supervisory Management", duration: "7 months", tuition: "J$20,000", total: "J$25,000", desc: "Leadership, decision-making, and people management skills." },
  ],
  "Level 4 - Associate Equivalent": [
    { name: "Business Administration - Management", duration: "9 months", tuition: "J$25,000", total: "J$30,000", desc: "Advanced business strategy and organisational leadership." },
    { name: "Human Resource Management", duration: "8 months", tuition: "J$25,000", total: "J$30,000", desc: "Strategic HR including workforce planning and labour relations.", popular: true },
    { name: "Training & Assessment", duration: "5 months", tuition: "J$25,000", total: "J$30,000", desc: "Design, deliver, and assess competency-based training programmes. Aligned to NCTVET standards for vocational trainers and assessors.", popular: true },
  ],
  "Level 5 - Bachelor's Equivalent": [
    { name: "Business Administration Management", duration: "9 months", tuition: "J$30,000", total: "J$35,000", desc: "Comprehensive senior management and executive leadership." },
    { name: "Human Resource Management", duration: "6 months", tuition: "J$30,000", total: "J$35,000", desc: "Executive-level HR strategy and organisational change." },
  ],
};
export const CAREER_OUTCOMES = {
  "Job Certificate": { salaryRange: "J$600K - J$1.2M/yr", outlook: "High demand - digital literacy and customer service roles expanding across BPO, retail, government." },
  "Level 2": { salaryRange: "J$800K - J$1.5M/yr", outlook: "Strong - vocational holders prioritised for entry-level supervisory and admin positions." },
  "Level 3": { salaryRange: "J$1.2M - J$2.2M/yr", outlook: "Very strong - diploma holders qualify for supervisory, management, specialist roles." },
  "Level 4 (Associate Equiv.)": { salaryRange: "J$1.8M - J$3.5M/yr", outlook: "Excellent - qualified HR managers, operations managers, business analysts in high demand." },
  "Level 5 (Bachelor's Equiv.)": { salaryRange: "J$2.5M - J$5M+/yr", outlook: "Senior management and executive roles. Eligible for director-level positions." },
};
const CALC_DURATION_LOOKUP = {
  ...Object.values(PROGRAMMES).flat().reduce((acc, item) => ({ ...acc, [item.name]: item.duration }), {}),
  "Business Admin (Secretarial)": "6 months",
  "Bus Admin - Management": "7 months",
  "Industrial Security Ops": "7 months",
  "Bus Admin Management": "9 months",
};

export const CALC_DATA = [
  { level: "Job Certificate", name: "Basic Digital Literacy Skills Proficiency", tuition: 10000 },
  { level: "Job Certificate", name: "Customer Service Rep - Admin Asst.", tuition: 10000 },
  { level: "Job Certificate", name: "Customer Service Rep - Office Admin", tuition: 10000 },
  { level: "Job Certificate", name: "Data Entry Advanced Processor", tuition: 10000 },
  { level: "Job Certificate", name: "Data Entry Processor", tuition: 10000 },
  { level: "Job Certificate", name: "Data Protection Officer", tuition: 10000 },
  { level: "Job Certificate", name: "Human Resource Administrator", tuition: 10000 },
  { level: "Job Certificate", name: "Industrial Security Ops Manager", tuition: 10000 },
  { level: "Job Certificate", name: "Introduction to ICT Proficiency", tuition: 10000 },
  { level: "Job Certificate", name: "Team Leader", tuition: 10000 },
  { level: "C/NVQ Level 2 - Certificate", name: "Accounting", tuition: 15000 },
  { level: "C/NVQ Level 2 - Certificate", name: "Administrative Assistance", tuition: 15000 },
  { level: "C/NVQ Level 2 - Certificate", name: "Business Admin (Secretarial)", tuition: 15000 },
  { level: "C/NVQ Level 2 - Certificate", name: "Customer Service", tuition: 15000 },
  { level: "C/NVQ Level 2 - Certificate", name: "Entrepreneurship", tuition: 15000 },
  { level: "C/NVQ Level 2 - Certificate", name: "Industrial Security Operations", tuition: 15000 },
  { level: "C/NVQ Level 3 - Diploma", name: "Accounting", tuition: 20000, bronzeMonths: 7 },
  { level: "C/NVQ Level 3 - Diploma", name: "Bus Admin - Management", tuition: 20000, bronzeMonths: 6 },
  { level: "C/NVQ Level 3 - Diploma", name: "Customer Service", tuition: 20000, bronzeMonths: 6 },
  { level: "C/NVQ Level 3 - Diploma", name: "Customer Service Supervision", tuition: 20000, bronzeMonths: 6 },
  { level: "C/NVQ Level 3 - Diploma", name: "Entrepreneurship", tuition: 20000, bronzeMonths: 6 },
  { level: "C/NVQ Level 3 - Diploma", name: "Industrial Security Ops", tuition: 20000, bronzeMonths: 6 },
  { level: "C/NVQ Level 3 - Diploma", name: "Supervisory Management", tuition: 20000, bronzeMonths: 6 },
  { level: "C/NVQ Level 4 - Associate Degree", name: "Bus Admin - Management", tuition: 25000, bronzeMonths: 8 },
  { level: "C/NVQ Level 4 - Associate Degree", name: "Human Resource Management", tuition: 25000, bronzeMonths: 7 },
  { level: "C/NVQ Level 4 - Associate Degree", name: "Training & Assessment", tuition: 25000, bronzeMonths: 4 },
  { level: "C/NVQ Level 5 - Bachelor's Degree", name: "Bus Admin Management", tuition: 30000, bronzeMonths: 8 },
  { level: "C/NVQ Level 5 - Bachelor's Degree", name: "Human Resource Management", tuition: 30000, bronzeMonths: 5 },
];
export const GROUP_DISCOUNTS = [
  { level: "Job Certificate", standard: "J$10,000", group: "J$8,500", saving: "J$1,500" },
  { level: "Level 2", standard: "J$20,000", group: "J$17,000", saving: "J$3,000" },
  { level: "Level 3", standard: "J$30,000", group: "J$25,500", saving: "J$4,500" },
  { level: "Level 4 (Associate Equiv.)", standard: "J$40,000", group: "J$34,000", saving: "J$6,000" },
  { level: "Level 5 (Bachelor's Equiv.)", standard: "J$50,000", group: "J$42,500", saving: "J$7,500" },
];

//  Programme details for the expanded cards on ProgrammesPage 
export const PROGRAMME_DETAILS = {
  // ─ Job / Professional Certificates ─
  "Basic Digital Literacy Skills Proficiency": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Computer Fundamentals & Operating Systems", "Word Processing & Document Creation", "Spreadsheet Basics & Data Entry", "Internet Navigation & Email Communication", "Digital Safety & Online Etiquette", "Introduction to Cloud Storage & Collaboration"], careers: ["Data Entry Clerk", "Office Assistant", "Receptionist", "Customer Service Rep"] },
  "Customer Service Rep - Admin Asst.": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Principles of Customer Service", "Telephone & Email Etiquette", "Handling Customer Complaints", "Office Administration Basics", "Records & Filing Systems", "Workplace Communication"], careers: ["Customer Service Representative", "Administrative Assistant", "Front Desk Officer", "Call Centre Agent"] },
  "Customer Service Rep - Office Admin": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Customer Interaction & Service Delivery", "Office Procedures & Systems", "Business Correspondence", "Scheduling & Calendar Management", "Document Preparation", "Workplace Health & Safety"], careers: ["Office Administrator", "Customer Service Officer", "Receptionist", "Secretary"] },
  "Data Entry Processor": { level: "Job Certificate", duration: "2 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Data Entry Techniques & Accuracy", "Spreadsheet Software Skills", "Database Record Keeping", "Quality Assurance in Data Processing"], careers: ["Data Entry Clerk", "Records Officer", "Data Processor", "Filing Clerk"] },
  "Data Entry Advanced Processor": { level: "Job Certificate", duration: "2 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Advanced Data Processing Techniques", "Data Validation & Error Checking", "Report Generation from Databases", "Multi-System Data Management"], careers: ["Senior Data Entry Clerk", "Data Analyst (Entry)", "Records Supervisor", "Database Assistant"] },
  "Introduction to ICT Proficiency": { level: "Job Certificate", duration: "2 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Introduction to Computer Hardware & Software", "Operating System Navigation", "Internet & Web Browsing", "Email & Digital Communication", "Basic Troubleshooting"], careers: ["IT Support Assistant", "Office Clerk", "Digital Literacy Trainer", "Help Desk Attendant"] },
  "Team Leader": { level: "Job Certificate", duration: "2.5 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Foundations of Team Leadership", "Communication & Motivation", "Delegating Tasks & Managing Workload", "Conflict Resolution in the Workplace", "Performance Monitoring", "Leading by Example"], careers: ["Team Leader", "Shift Supervisor", "Group Coordinator", "Section Head"] },
  "Industrial Security Ops Manager": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Fundamentals of Security Operations", "Threat Assessment & Risk Identification", "Access Control & Perimeter Security", "Emergency Response Procedures", "Report Writing for Security", "Legal Framework for Security Officers"], careers: ["Security Supervisor", "Operations Coordinator", "Estate Security Manager", "Loss Prevention Officer"] },
  "Data Protection Officer": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Introduction to Data Protection", "Jamaica Data Protection Act", "Personal Data Handling & Consent", "Data Breach Response", "Organisational Compliance", "Privacy Impact Assessments"], careers: ["Data Protection Officer", "Compliance Officer", "Privacy Coordinator", "Records Manager"] },
  "Human Resource Administrator": { level: "Job Certificate", duration: "4 months", prerequisites: "Open entry - no prior qualifications required.", modules: ["Introduction to Human Resource Management", "Recruitment & Selection Basics", "Employee Records & Documentation", "Leave Management & Attendance", "Labour Law Awareness", "Workplace Relations", "Payroll Administration Basics"], careers: ["HR Assistant", "HR Administrator", "Personnel Clerk", "Payroll Assistant"] },
  // ─ Level 2 - Vocational Certificates ─
  "Customer Service": { level: "C/NVQ Level 2 - Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent secondary school qualifications.", modules: ["Customer Service Principles & Standards", "Effective Communication in Service", "Handling Complaints & Difficult Situations", "Service Delivery in Different Channels", "Product & Service Knowledge", "Teamwork in a Service Environment", "Personal Development & Professionalism"], careers: ["Customer Service Officer", "Client Relations Associate", "Call Centre Agent", "Service Desk Attendant"] },
  "Entrepreneurship": { level: "C/NVQ Level 2 - Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Entrepreneurial Mindset & Opportunity Recognition", "Business Idea Development", "Basic Financial Literacy", "Marketing Your Business", "Business Registration & Compliance", "Customer Acquisition", "Record Keeping for Small Business"], careers: ["Small Business Owner", "Freelancer", "Market Vendor (Formalised)", "Sole Trader"] },
  "Administrative Assistance": { level: "C/NVQ Level 2 - Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Office Administration Systems", "Business Document Preparation", "Meeting & Event Coordination", "Filing & Records Management", "Telephone & Reception Skills", "Time Management & Prioritisation", "Workplace Communication"], careers: ["Administrative Assistant", "Office Clerk", "Secretary", "Personal Assistant"] },
  "Business Administration (Secretarial)": { level: "C/NVQ Level 2 - Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Secretarial Practices & Procedures", "Business Correspondence & Minute Taking", "Diary & Schedule Management", "Office Technology & Equipment", "Financial Record Keeping", "Professional Communication", "Organisational Skills"], careers: ["Executive Secretary", "Office Coordinator", "Administrative Officer", "Clerical Supervisor"] },
  "Industrial Security Operations": { level: "C/NVQ Level 2 - Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Security Industry Standards & Legislation", "Patrol & Surveillance Techniques", "Access Control Systems", "Incident Reporting & Documentation", "Emergency & Crisis Management", "Communication & Conflict De-escalation", "Health & Safety in Security"], careers: ["Licensed Security Officer", "Access Control Supervisor", "Security Patrol Officer", "Estate Security Officer"] },
  "Accounting": { level: "C/NVQ Level 2 - Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Process Journal Entries", "Prepare Ledger Balances & Trial Balance", "Process Customer Accounts", "Administer Accounts Payable", "Record & Account for Cash Transactions", "Maintain Daily Financial Records", "Perform Basic Payroll Transactions", "Operate Accounting Applications"], careers: ["Accounts Clerk", "Bookkeeper", "Payroll Clerk", "Accounts Payable Clerk", "Junior Accountant"] },
  // ─ Level 3 - Diploma ─
  "Customer Service Supervision": { level: "C/NVQ Level 3 - Diploma", duration: "7 months", prerequisites: "Level 2 in a related area, or 3 CXC/CSEC subjects.", modules: ["Supervising Customer Service Teams", "Quality Assurance & Service Standards", "Staff Scheduling & Resource Allocation", "Performance Management", "Complaint Escalation & Resolution", "Training & Coaching Team Members", "Reporting & Analytics"], careers: ["Customer Service Supervisor", "Team Manager", "Quality Assurance Officer", "Call Centre Supervisor"] },
  "Business Administration - Management": { level: "C/NVQ Level 3 - Diploma", duration: "7 months", prerequisites: "Level 2 in a related area, or 3 CXC/CSEC subjects.", modules: ["Business Operations Management", "Financial Management & Budgeting", "Human Resource Fundamentals", "Marketing & Customer Strategy", "Project Planning & Coordination", "Business Communication & Reporting", "Leadership & Decision Making"], careers: ["Office Manager", "Operations Coordinator", "Branch Manager", "Business Development Officer"] },
  "Supervisory Management": { level: "C/NVQ Level 3 - Diploma", duration: "7 months", prerequisites: "Level 2 in a related area, or 3 CXC/CSEC subjects.", modules: ["Principles of Supervision", "Leading & Motivating Teams", "Workplace Conflict Resolution", "Performance Appraisal", "Operational Planning", "Communication & Stakeholder Management", "Change Management Basics"], careers: ["Supervisor", "Shift Manager", "Department Head", "Operations Supervisor"] },
  // ─ Level 4 - Associate Equivalent ─
  "Human Resource Management": { level: "C/NVQ Level 4 - Associate Degree", duration: "8 months", prerequisites: "Level 3 diploma in a related area.", modules: ["Strategic Human Resource Management", "Workforce Planning & Talent Management", "Labour Relations & Industrial Law", "Compensation & Benefits Administration", "Organisational Development", "Training & Development Strategy", "HR Metrics & Analytics", "Employee Engagement & Retention"], careers: ["HR Manager", "Talent Acquisition Manager", "Labour Relations Officer", "Training & Development Manager"] },
  "Training & Assessment": { level: "C/NVQ Level 4 - Associate Degree", duration: "5 months", prerequisites: "Level 3 diploma in a related area. Industry experience preferred.", modules: ["Maintain & Enhance Professional Practice", "Design & Develop Training Programmes", "Deliver Competency-Based Training", "Plan & Organise Assessment Activities", "Assess Competence in the Workplace", "Validate Assessment Processes", "Work Effectively with Diversity in Training", "Use Digital Tools for Training & Assessment", "Monitor Performance & Provide Feedback", "Develop Assessment Instruments"], careers: ["Vocational Trainer", "NCTVET Assessor", "Corporate Training Officer", "Learning & Development Specialist", "Curriculum Developer"] },
  // ─ Level 5 - Bachelor's Equivalent ─
  "Business Administration Management": { level: "C/NVQ Level 5 - Bachelor's Degree", duration: "9 months", prerequisites: "Level 4 diploma in a related area.", modules: ["Strategic Business Management", "Corporate Governance & Ethics", "Advanced Financial Analysis", "Operations & Supply Chain Management", "Strategic Marketing Management", "Organisational Behaviour & Leadership", "Research Methods & Business Intelligence", "Change Management & Innovation", "Capstone: Strategic Business Plan"], careers: ["General Manager", "Operations Director", "Business Consultant", "Chief Operating Officer"] },
};


