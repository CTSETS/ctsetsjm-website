import { REG_FEE } from "./config";
export const PROGRAMMES = {
  "Job / Professional Certificates": [
    { name: "Basic Digital Literacy Skills Proficiency", duration: "3 months", tuition: "$5,000", total: "$10,000", desc: "Build essential computer and internet skills for today's digital workplace." },
    { name: "Customer Service Rep — Admin Asst.", duration: "3 months", tuition: "$5,000", total: "$10,000", desc: "Gain front-line customer service and office administration capabilities.", popular: true },
    { name: "Customer Service Rep — Office Admin", duration: "3 months", tuition: "$5,000", total: "$10,000", desc: "Develop professional office administration and client-facing skills." },
    { name: "Data Entry Processor", duration: "2 months", tuition: "$5,000", total: "$10,000", desc: "Master accurate, efficient data entry and basic records management." },
    { name: "Data Entry Advanced Processor", duration: "2 months", tuition: "$5,000", total: "$10,000", desc: "Take your data processing skills to the next level." },
    { name: "Introduction to ICT Proficiency", duration: "2 months", tuition: "$5,000", total: "$10,000", desc: "A foundational course in information and communication technology." },
    { name: "Team Leader", duration: "2.5 months", tuition: "$5,000", total: "$10,000", desc: "Learn to lead, motivate, and manage small teams effectively.", popular: true },
    { name: "Industrial Security Ops Manager", duration: "3 months", tuition: "$5,000", total: "$10,000", desc: "Prepare for supervisory roles in security operations." },
    { name: "Data Protection Officer", duration: "3 months", tuition: "$5,000", total: "$10,000", desc: "Understand data privacy regulations and compliance." },
    { name: "Human Resource Administrator", duration: "4 months", tuition: "$5,000", total: "$10,000", desc: "Build foundational HR skills including recruitment and compliance." },
  ],
  "Level 2 — Vocational Certificate": [
    { name: "Customer Service", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Structured customer service delivery and communication skills.", popular: true },
    { name: "Entrepreneurship", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Plan, launch, and manage a small business venture." },
    { name: "Administrative Assistance", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Professional office management and administrative support." },
    { name: "Business Administration (Secretarial)", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Comprehensive secretarial and business administration training." },
    { name: "Industrial Security Operations", duration: "6 months", tuition: "$15,000", total: "$20,000", desc: "Formalise your security experience with recognised certification.", popular: true },
  ],
  "Level 3 — Diploma": [
    { name: "Customer Service", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Advanced strategy, quality assurance, and team coordination." },
    { name: "Customer Service Supervision", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Lead and supervise customer-facing teams with confidence.", popular: true },
    { name: "Business Administration — Management", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Core business management for aspiring mid-level managers.", popular: true },
    { name: "Entrepreneurship", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Advanced business planning, financial management, and growth." },
    { name: "Industrial Security Operations", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Senior-level security operations and risk assessment." },
    { name: "Supervisory Management", duration: "7 months", tuition: "$25,000", total: "$30,000", desc: "Leadership, decision-making, and people management skills." },
  ],
  "Level 4 — Associate Equivalent": [
    { name: "Human Resource Management", duration: "8 months", tuition: "$35,000", total: "$40,000", desc: "Strategic HR including workforce planning and labour relations.", popular: true },
    { name: "Business Administration — Management", duration: "9 months", tuition: "$35,000", total: "$40,000", desc: "Advanced business strategy and organisational leadership." },
  ],
  "Level 5 — Bachelor's Equivalent": [
    { name: "Human Resource Management", duration: "6 months", tuition: "$45,000", total: "$50,000", desc: "Executive-level HR strategy and organisational change." },
    { name: "Business Administration Management", duration: "9 months", tuition: "$45,000", total: "$50,000", desc: "Comprehensive senior management and executive leadership." },
  ],
};
export const CAREER_OUTCOMES = {
  "Job Certificate": { salaryRange: "J$600K – J$1.2M/yr", outlook: "High demand — digital literacy and customer service roles expanding across BPO, retail, government." },
  "Level 2": { salaryRange: "J$800K – J$1.5M/yr", outlook: "Strong — vocational holders prioritised for entry-level supervisory and admin positions." },
  "Level 3": { salaryRange: "J$1.2M – J$2.2M/yr", outlook: "Very strong — diploma holders qualify for supervisory, management, specialist roles." },
  "Level 4": { salaryRange: "J$1.8M – J$3.5M/yr", outlook: "Excellent — qualified HR managers, operations managers, business analysts in high demand." },
  "Level 5": { salaryRange: "J$2.5M – J$5M+/yr", outlook: "Senior management and executive roles. Eligible for director-level positions." },
};
export const CALC_DATA = [
  { level: "Job Certificate", name: "Basic Digital Literacy Skills Proficiency", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Customer Service Rep — Admin Asst.", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Customer Service Rep — Office Admin", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Data Entry Processor", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Data Entry Advanced Processor", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Introduction to ICT Proficiency", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Team Leader", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Industrial Security Ops Manager", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Data Protection Officer", tuition: 5000, goldOnly: true },
  { level: "Job Certificate", name: "Human Resource Administrator", tuition: 5000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Customer Service", tuition: 15000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Entrepreneurship", tuition: 15000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Administrative Assistance", tuition: 15000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Business Admin (Secretarial)", tuition: 15000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Industrial Security Operations", tuition: 15000, goldOnly: true },
  { level: "Level 3 — Diploma", name: "Customer Service", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Customer Service Supervision", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Bus Admin — Management", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Entrepreneurship", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Industrial Security Ops", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Supervisory Management", tuition: 25000, bronzeMonths: 6 },
  { level: "Level 4 — Associate", name: "Human Resource Management", tuition: 35000, bronzeMonths: 7 },
  { level: "Level 4 — Associate", name: "Bus Admin — Management", tuition: 35000, bronzeMonths: 8 },
  { level: "Level 5 — Bachelor's", name: "Human Resource Management", tuition: 45000, bronzeMonths: 5 },
  { level: "Level 5 — Bachelor's", name: "Bus Admin Management", tuition: 45000, bronzeMonths: 8 },
];
export const GROUP_DISCOUNTS = [
  { level: "Job Certificate", standard: "$10,000", group: "$8,500", saving: "$1,500" },
  { level: "Level 2", standard: "$20,000", group: "$17,000", saving: "$3,000" },
  { level: "Level 3", standard: "$30,000", group: "$25,500", saving: "$4,500" },
  { level: "Level 4", standard: "$40,000", group: "$34,000", saving: "$6,000" },
  { level: "Level 5", standard: "$50,000", group: "$42,500", saving: "$7,500" },
];

// ── Programme details for the modal on ProgrammesPage ──
export const PROGRAMME_DETAILS = {
  // ─── Job / Professional Certificates ───
  "Basic Digital Literacy Skills Proficiency": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Computer Fundamentals & Operating Systems", "Word Processing & Document Creation", "Spreadsheet Basics & Data Entry", "Internet Navigation & Email Communication", "Digital Safety & Online Etiquette", "Introduction to Cloud Storage & Collaboration"], careers: ["Data Entry Clerk", "Office Assistant", "Receptionist", "Customer Service Rep"] },
  "Customer Service Rep — Admin Asst.": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Principles of Customer Service", "Telephone & Email Etiquette", "Handling Customer Complaints", "Office Administration Basics", "Records & Filing Systems", "Workplace Communication"], careers: ["Customer Service Representative", "Administrative Assistant", "Front Desk Officer", "Call Centre Agent"] },
  "Customer Service Rep — Office Admin": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Customer Interaction & Service Delivery", "Office Procedures & Systems", "Business Correspondence", "Scheduling & Calendar Management", "Document Preparation", "Workplace Health & Safety"], careers: ["Office Administrator", "Customer Service Officer", "Receptionist", "Secretary"] },
  "Data Entry Processor": { level: "Job Certificate", duration: "2 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Data Entry Techniques & Accuracy", "Spreadsheet Software Skills", "Database Record Keeping", "Quality Assurance in Data Processing"], careers: ["Data Entry Clerk", "Records Officer", "Data Processor", "Filing Clerk"] },
  "Data Entry Advanced Processor": { level: "Job Certificate", duration: "2 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Advanced Data Processing Techniques", "Data Validation & Error Checking", "Report Generation from Databases", "Multi-System Data Management"], careers: ["Senior Data Entry Clerk", "Data Analyst (Entry)", "Records Supervisor", "Database Assistant"] },
  "Introduction to ICT Proficiency": { level: "Job Certificate", duration: "2 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Introduction to Computer Hardware & Software", "Operating System Navigation", "Internet & Web Browsing", "Email & Digital Communication", "Basic Troubleshooting"], careers: ["IT Support Assistant", "Office Clerk", "Digital Literacy Trainer", "Help Desk Attendant"] },
  "Team Leader": { level: "Job Certificate", duration: "2.5 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Foundations of Team Leadership", "Communication & Motivation", "Delegating Tasks & Managing Workload", "Conflict Resolution in the Workplace", "Performance Monitoring", "Leading by Example"], careers: ["Team Leader", "Shift Supervisor", "Group Coordinator", "Section Head"] },
  "Industrial Security Ops Manager": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Fundamentals of Security Operations", "Threat Assessment & Risk Identification", "Access Control & Perimeter Security", "Emergency Response Procedures", "Report Writing for Security", "Legal Framework for Security Officers"], careers: ["Security Supervisor", "Operations Coordinator", "Estate Security Manager", "Loss Prevention Officer"] },
  "Data Protection Officer": { level: "Job Certificate", duration: "3 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Introduction to Data Protection", "Jamaica Data Protection Act", "Personal Data Handling & Consent", "Data Breach Response", "Organisational Compliance", "Privacy Impact Assessments"], careers: ["Data Protection Officer", "Compliance Officer", "Privacy Coordinator", "Records Manager"] },
  "Human Resource Administrator": { level: "Job Certificate", duration: "4 months", prerequisites: "Open entry — no prior qualifications required.", modules: ["Introduction to Human Resource Management", "Recruitment & Selection Basics", "Employee Records & Documentation", "Leave Management & Attendance", "Labour Law Awareness", "Workplace Relations", "Payroll Administration Basics"], careers: ["HR Assistant", "HR Administrator", "Personnel Clerk", "Payroll Assistant"] },
  // ─── Level 2 ───
  "Customer Service": { level: "Level 2 — Vocational Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent secondary school qualifications.", modules: ["Customer Service Principles & Standards", "Effective Communication in Service", "Handling Complaints & Difficult Situations", "Service Delivery in Different Channels", "Product & Service Knowledge", "Teamwork in a Service Environment", "Personal Development & Professionalism"], careers: ["Customer Service Officer", "Client Relations Associate", "Call Centre Agent", "Service Desk Attendant"] },
  "Entrepreneurship": { level: "Level 2 — Vocational Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Entrepreneurial Mindset & Opportunity Recognition", "Business Idea Development", "Basic Financial Literacy", "Marketing Your Business", "Business Registration & Compliance", "Customer Acquisition", "Record Keeping for Small Business"], careers: ["Small Business Owner", "Freelancer", "Market Vendor (Formalised)", "Sole Trader"] },
  "Administrative Assistance": { level: "Level 2 — Vocational Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Office Administration Systems", "Business Document Preparation", "Meeting & Event Coordination", "Filing & Records Management", "Telephone & Reception Skills", "Time Management & Prioritisation", "Workplace Communication"], careers: ["Administrative Assistant", "Office Clerk", "Secretary", "Personal Assistant"] },
  "Business Administration (Secretarial)": { level: "Level 2 — Vocational Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Secretarial Practices & Procedures", "Business Correspondence & Minute Taking", "Diary & Schedule Management", "Office Technology & Equipment", "Financial Record Keeping", "Professional Communication", "Organisational Skills"], careers: ["Executive Secretary", "Office Coordinator", "Administrative Officer", "Clerical Supervisor"] },
  "Industrial Security Operations": { level: "Level 2 — Vocational Certificate", duration: "6 months", prerequisites: "Job Certificate, 2 CXC/CSEC subjects, or equivalent.", modules: ["Security Industry Standards & Legislation", "Patrol & Surveillance Techniques", "Access Control Systems", "Incident Reporting & Documentation", "Emergency & Crisis Management", "Communication & Conflict De-escalation", "Health & Safety in Security"], careers: ["Licensed Security Officer", "Access Control Supervisor", "Security Patrol Officer", "Estate Security Officer"] },
  // ─── Level 3 ───
  "Customer Service Supervision": { level: "Level 3 — Diploma", duration: "7 months", prerequisites: "Level 2 in a related area, or 3 CXC/CSEC subjects.", modules: ["Supervising Customer Service Teams", "Quality Assurance & Service Standards", "Staff Scheduling & Resource Allocation", "Performance Management", "Complaint Escalation & Resolution", "Training & Coaching Team Members", "Reporting & Analytics"], careers: ["Customer Service Supervisor", "Team Manager", "Quality Assurance Officer", "Call Centre Supervisor"] },
  "Business Administration — Management": { level: "Level 3 — Diploma", duration: "7 months", prerequisites: "Level 2 in a related area, or 3 CXC/CSEC subjects.", modules: ["Business Operations Management", "Financial Management & Budgeting", "Human Resource Fundamentals", "Marketing & Customer Strategy", "Project Planning & Coordination", "Business Communication & Reporting", "Leadership & Decision Making"], careers: ["Office Manager", "Operations Coordinator", "Branch Manager", "Business Development Officer"] },
  "Supervisory Management": { level: "Level 3 — Diploma", duration: "7 months", prerequisites: "Level 2 in a related area, or 3 CXC/CSEC subjects.", modules: ["Principles of Supervision", "Leading & Motivating Teams", "Workplace Conflict Resolution", "Performance Appraisal", "Operational Planning", "Communication & Stakeholder Management", "Change Management Basics"], careers: ["Supervisor", "Shift Manager", "Department Head", "Operations Supervisor"] },
  // ─── Level 4 ───
  "Human Resource Management": { level: "Level 4 — Associate Equivalent", duration: "8 months", prerequisites: "Level 3 diploma in a related area.", modules: ["Strategic Human Resource Management", "Workforce Planning & Talent Management", "Labour Relations & Industrial Law", "Compensation & Benefits Administration", "Organisational Development", "Training & Development Strategy", "HR Metrics & Analytics", "Employee Engagement & Retention"], careers: ["HR Manager", "Talent Acquisition Manager", "Labour Relations Officer", "Training & Development Manager"] },
  // ─── Level 5 ───
  "Business Administration Management": { level: "Level 5 — Bachelor's Equivalent", duration: "9 months", prerequisites: "Level 4 diploma in a related area.", modules: ["Strategic Business Management", "Corporate Governance & Ethics", "Advanced Financial Analysis", "Operations & Supply Chain Management", "Strategic Marketing Management", "Organisational Behaviour & Leadership", "Research Methods & Business Intelligence", "Change Management & Innovation", "Capstone: Strategic Business Plan"], careers: ["General Manager", "Operations Director", "Business Consultant", "Chief Operating Officer"] },
};