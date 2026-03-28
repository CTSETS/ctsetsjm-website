import { REG_FEE } from "./config";
export const PROGRAMMES = {
  "Job / Professional Certificates": [
    { name: "Basic Digital Literacy Skills Proficiency", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Build essential computer and internet skills for today's digital workplace." },
    { name: "Customer Service Rep — Admin Asst.", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Gain front-line customer service and office administration capabilities.", popular: true },
    { name: "Customer Service Rep — Office Admin", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Develop professional office administration and client-facing skills." },
    { name: "Data Entry Processor", duration: "2 months", tuition: "$10,000", total: "$15,000", desc: "Master accurate, efficient data entry and basic records management." },
    { name: "Data Entry Advanced Processor", duration: "2 months", tuition: "$10,000", total: "$15,000", desc: "Take your data processing skills to the next level." },
    { name: "Introduction to ICT Proficiency", duration: "2 months", tuition: "$10,000", total: "$15,000", desc: "A foundational course in information and communication technology." },
    { name: "Team Leader", duration: "2.5 months", tuition: "$10,000", total: "$15,000", desc: "Learn to lead, motivate, and manage small teams effectively.", popular: true },
    { name: "Industrial Security Ops Manager", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Prepare for supervisory roles in security operations." },
    { name: "Data Protection Officer", duration: "3 months", tuition: "$10,000", total: "$15,000", desc: "Understand data privacy regulations and compliance." },
    { name: "Human Resource Administrator", duration: "4 months", tuition: "$10,000", total: "$15,000", desc: "Build foundational HR skills including recruitment and compliance." },
  ],
  "Level 2 — Vocational Certificate": [
    { name: "Customer Service", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Structured customer service delivery and communication skills.", popular: true },
    { name: "Entrepreneurship", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Plan, launch, and manage a small business venture." },
    { name: "Administrative Assistance", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Professional office management and administrative support." },
    { name: "Business Administration (Secretarial)", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Comprehensive secretarial and business administration training." },
    { name: "Industrial Security Operations", duration: "6 months", tuition: "$20,000", total: "$25,000", desc: "Formalise your security experience with recognised certification.", popular: true },
  ],
  "Level 3 — Diploma": [
    { name: "Customer Service", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Advanced strategy, quality assurance, and team coordination." },
    { name: "Customer Service Supervision", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Lead and supervise customer-facing teams with confidence.", popular: true },
    { name: "Business Administration — Management", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Core business management for aspiring mid-level managers.", popular: true },
    { name: "Entrepreneurship", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Advanced business planning, financial management, and growth." },
    { name: "Industrial Security Operations", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Senior-level security operations and risk assessment." },
    { name: "Supervisory Management", duration: "7 months", tuition: "$30,000", total: "$35,000", desc: "Leadership, decision-making, and people management skills." },
  ],
  "Level 4 — Associate Equivalent": [
    { name: "Human Resource Management", duration: "8 months", tuition: "$60,000", total: "$65,000", desc: "Strategic HR including workforce planning and labour relations.", popular: true },
    { name: "Business Administration — Management", duration: "9 months", tuition: "$60,000", total: "$65,000", desc: "Advanced business strategy and organisational leadership." },
  ],
  "Level 5 — Bachelor's Equivalent": [
    { name: "Human Resource Management", duration: "6 months", tuition: "$100,000", total: "$105,000", desc: "Executive-level HR strategy and organisational change." },
    { name: "Business Administration Management", duration: "9 months", tuition: "$100,000", total: "$105,000", desc: "Comprehensive senior management and executive leadership." },
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
  { level: "Job Certificate", name: "Basic Digital Literacy Skills Proficiency", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Customer Service Rep — Admin Asst.", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Customer Service Rep — Office Admin", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Data Entry Processor", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Data Entry Advanced Processor", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Introduction to ICT Proficiency", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Team Leader", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Industrial Security Ops Manager", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Data Protection Officer", tuition: 10000, goldOnly: true },
  { level: "Job Certificate", name: "Human Resource Administrator", tuition: 10000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Customer Service", tuition: 20000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Entrepreneurship", tuition: 20000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Administrative Assistance", tuition: 20000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Business Admin (Secretarial)", tuition: 20000, goldOnly: true },
  { level: "Level 2 — Vocational", name: "Industrial Security Operations", tuition: 20000, goldOnly: true },
  { level: "Level 3 — Diploma", name: "Customer Service", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Customer Service Supervision", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Bus Admin — Management", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Entrepreneurship", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Industrial Security Ops", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 3 — Diploma", name: "Supervisory Management", tuition: 30000, bronzeMonths: 6 },
  { level: "Level 4 — Associate", name: "Human Resource Management", tuition: 60000, bronzeMonths: 7 },
  { level: "Level 4 — Associate", name: "Bus Admin — Management", tuition: 60000, bronzeMonths: 8 },
  { level: "Level 5 — Bachelor's", name: "Human Resource Management", tuition: 100000, bronzeMonths: 5 },
  { level: "Level 5 — Bachelor's", name: "Bus Admin Management", tuition: 100000, bronzeMonths: 8 },
];
export const GROUP_DISCOUNTS = [
  { level: "Job Certificate", standard: "$15,000", group: "$12,750", saving: "$2,250" },
  { level: "Level 2", standard: "$25,000", group: "$21,250", saving: "$3,750" },
  { level: "Level 3", standard: "$35,000", group: "$29,750", saving: "$5,250" },
  { level: "Level 4", standard: "$65,000", group: "$55,250", saving: "$9,750" },
  { level: "Level 5", standard: "$105,000", group: "$89,250", saving: "$15,750" },
];
export const FOUNDING_TUITION_DISCOUNT = 5000;
export const FOUNDING_SPOTS = 15;
export const FOUNDING_LEVEL3_PLUS = ["Level 3 — Diploma", "Level 4 — Associate Equivalent", "Level 5 — Bachelor's Equivalent"];
export const FOUNDING_COHORT = Object.entries(PROGRAMMES).map(([level, progs]) => ({
  level,
  programmes: progs.map((p) => {
    const tuitionNum = parseInt(p.tuition.replace(/[$,]/g, ""));
    const isL3 = FOUNDING_LEVEL3_PLUS.includes(level);
    return { ...p, tuitionNum, foundingTuition: isL3 ? tuitionNum - FOUNDING_TUITION_DISCOUNT : tuitionNum, saving: REG_FEE + (isL3 ? FOUNDING_TUITION_DISCOUNT : 0), regWaived: true };
  }),
}));
