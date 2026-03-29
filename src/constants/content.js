import S from "./styles";
export const FAQS = [
  { q: "What qualifications do I need?", a: "Job Certificates: open entry. Level 2: Job Certificate or 2 CXC/CSEC subjects. Level 3: Level 2 or 3 CXCs. Levels 4–5: previous level diploma." },
  { q: "Are programmes 100% online?", a: "Yes — 100% online and self-paced with Audio Study Sessions, an Intelligent Study Assistant, video summaries, and flashcards." },
  { q: "How long do programmes take?", a: "2 months (Job Certificate) to 9 months (Level 5). At 2 topics per week, most finish within the stated timeframe." },
  { q: "What certifications will I receive?", a: "A CTS ETS Institutional Certificate plus either an NVQ-J (NCTVET) or City & Guilds qualification — both nationally and internationally recognised." },
  { q: "What payment plans are available?", a: "Gold (full, 0%) for all levels. Silver (60/40, +10%) and Bronze (30% + monthly, +15%) for Levels 3–5." },
  { q: "Can my employer pay?", a: "Yes — 15% group discount for 8+ learners. Contact us for a quotation." },
  { q: "How do I apply?", a: "Complete the online form at ctsetsjm.com. Select Jamaican, Caribbean, or International — the form adapts for your location." },
  { q: "How do I contact CTS ETS?", a: "Email info@ctsetsjm.com, call 876-381-9771, or WhatsApp us. Response within 24–48 hours." },
];
export const TESTIMONIALS = [
  { name: "Kadian H.", initials: "KH", color: S.teal, level: "Level 3 — Customer Service Supervision", outcome: "Promoted to Supervisor", quote: "CTS ETS gave me the qualification I needed. I studied in the evenings and never missed a shift. My employer now covers my Level 4 fees.", parish: "St. Andrew" },
  { name: "Rohan M.", initials: "RM", color: S.emerald, level: "Industrial Security Ops — Level 2", outcome: "Certified & Employed", quote: "I had years of experience but no paper. Now I have an internationally recognised certificate. My pay went up 40% within 3 months.", parish: "St. Catherine" },
  { name: "Nadine B.", initials: "NB", color: S.violet, level: "Level 4 — HR Management", outcome: "HR Manager", quote: "I went from HR assistant to HR manager. The learner guides are thorough and the WhatsApp support made a huge difference.", parish: "Kingston" },
  { name: "Simone A.", initials: "SA", color: S.coral, level: "Level 2 — Customer Service", outcome: "Call Centre Team Lead", quote: "As a single mother I needed something flexible. The payment plan helped and I finished in under 6 months. Now I'm training others.", parish: "St. James" },
  { name: "Dwayne P.", initials: "DP", color: S.sky, level: "Level 3 — Entrepreneurship", outcome: "Running His Own Business", quote: "I launched my business while studying. Revenue doubled in my first year after completing. CTS ETS gave me the structure I was missing.", parish: "Clarendon" },
];
export const SOCIAL_PROOF = { enrolled: "120+", programmes: "25", completionRate: "94%", satisfaction: "4.8/5", countries: "6" };
export const ANNOUNCEMENTS = [
  { id: 1, date: "March 25, 2026", type: "intake", title: "April 2026 Intake Now Open", body: "Rolling enrolment is open for all 25 programmes. Start anytime — study at your own pace.", cta: "Apply Now", ctaPage: "Apply" },
  { id: 3, date: "March 15, 2026", type: "feature", title: "Interactive Learning System Launched", body: "All students now have Audio Study Sessions, an Intelligent Study Assistant, video summaries, and flashcards — included free.", cta: "Explore Programmes", ctaPage: "Programmes" },
  { id: 4, date: "March 10, 2026", type: "milestone", title: "CTS ETS Officially Registered", body: "Registered with Companies of Jamaica (Reg. No. 16007/2025). MOE registration in progress.", cta: "About CTS ETS", ctaPage: "About" },
];
export const SCRIPTURES = {
  home: { text: "For I know the plans I have for you, declares the Lord, plans to prosper you.", ref: "Jeremiah 29:11" },
  about: { text: "The Spirit of the Sovereign Lord is on me, to proclaim good news.", ref: "Isaiah 61:1" },
  whyChoose: { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  programmes: { text: "The heart of the discerning acquires knowledge.", ref: "Proverbs 18:15" },
  certification: { text: "Whatever you do, work at it with all your heart.", ref: "Colossians 3:23" },
  fees: { text: "My God will meet all your needs according to His riches.", ref: "Philippians 4:19" },
  employers: { text: "Do you see someone skilled in their work? They will serve before kings.", ref: "Proverbs 22:29" },
  apply: { text: "Be strong and courageous.", ref: "Joshua 1:9" },
  contact: { text: "Two are better than one.", ref: "Ecclesiastes 4:9" },
  studentJourney: { text: "Trust in the Lord with all your heart.", ref: "Proverbs 3:5-6" },
  careers: { text: "For I know the plans I have for you, declares the Lord.", ref: "Jeremiah 29:11" },
  international: { text: "From the rising of the sun to its setting, my name will be great.", ref: "Malachi 1:11" },
  verify: { text: "Let your light shine before others.", ref: "Matthew 5:16" },
  feedback: { text: "As iron sharpens iron, so one person sharpens another.", ref: "Proverbs 27:17" },
};
export function genderPronouns(g) { if (g === "Male") return { he:"he", him:"him", his:"his" }; if (g === "Female") return { he:"she", him:"her", his:"her" }; return { he:"they", him:"them", his:"their" }; }
export const PRAYERS = {
  application: (n, g) => ({ title: "Our Prayer for You, " + n, prayer: `Heavenly Father, we lift up ${n} before You as ${g.he} takes this courageous step toward a better future. Grant ${n} wisdom as ${g.he} studies, discipline when the journey feels long, and perseverance when challenges arise. Let this decision bear fruit — in ${g.his} career, ${g.his} family, and ${g.his} community.`, scripture: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" }),
  contact: (n, g) => ({ title: "Our Prayer for You, " + n, prayer: `Father God, we thank You for ${n} who has reached out to us today. We pray that ${n} finds clarity, peace, and confidence in the path ahead. Guide us to give the right answer at the right time, and let this conversation be the beginning of something meaningful.`, scripture: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", ref: "Matthew 7:7" }),
  group: (n, g) => ({ title: "Our Prayer for You, " + n, prayer: `Lord, we thank You for ${n} and the heart ${g.he} has for investing in ${g.his} team. Bless ${g.his} organisation and multiply the impact of this investment. Let every learner who benefits from this decision grow in skill, confidence, and purpose.`, scripture: "Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank.", ref: "Proverbs 22:29" }),
  payment: (n, g) => ({ title: "Our Prayer for You, " + n, prayer: `Father, we honour the sacrifice that ${n} is making today. This payment represents faith, commitment, and a belief that the future can be better. Let ${n} never lack. Multiply this investment a hundredfold — in knowledge, in opportunity, and in provision.`, scripture: "And my God will meet all your needs according to the riches of His glory in Christ Jesus.", ref: "Philippians 4:19" }),
};
