// ─── WHATSAPP BUSINESS SETUP GUIDE ──────────────────────────────────
// Not a code component — this is operational guidance saved as a constant
// so the dev/admin has it accessible in the codebase

export const WHATSAPP_BUSINESS_GUIDE = `
╔══════════════════════════════════════════════════════════════╗
║              WHATSAPP BUSINESS SETUP GUIDE                   ║
║              for CTS Empowerment & Training Solutions         ║
╚══════════════════════════════════════════════════════════════╝

STEP 1: INSTALL WHATSAPP BUSINESS (FREE)
────────────────────────────────────────
• Download "WhatsApp Business" from Play Store / App Store
• Register with your CTS ETS number: 876-381-9771
• Note: This will convert your personal WhatsApp to Business
  (you can use a separate device/number if preferred)

STEP 2: SET UP YOUR BUSINESS PROFILE
────────────────────────────────────────
• Business Name: CTS Empowerment & Training Solutions
• Category: Education
• Description: "25 online programmes from Job Certificate to
  Bachelor's Equivalent. Aligned to NCTVET & City & Guilds.
  100% online, self-paced. Apply at ctsetsjm.com"
• Address: 6 Newark Avenue, Kingston 11, Jamaica W.I.
• Email: info@ctsetsjm.com
• Website: https://ctsetsjm.com
• Hours: Mon–Fri 9AM–5PM, Sat 10AM–2PM

STEP 3: SET UP QUICK REPLIES (SAVES HOURS)
────────────────────────────────────────
Create these shortcuts:

/welcome → "Thank you for contacting CTS ETS! How can we
help you today? You can: 1) Ask about programmes 2) Check
your application status 3) Get payment information 4) Speak
with an advisor. Just reply with a number or your question."

/programmes → "We offer 25 programmes from Job Certificate
to Bachelor's Equivalent, all 100% online. Visit
ctsetsjm.com/programmes for the full list with fees.
Would you like help choosing the right one?"

/fees → "Total starts from J$10,000 (US$65). Payment plans
available for Level 3+. Use our calculator at
ctsetsjm.com/#fees-&-calculator. Questions? Just ask!"

/apply → "Apply online at ctsetsjm.com/#apply — it takes
about 10 minutes. You'll need: passport photo, qualifications,
national ID, and TRN (Jamaican applicants). We review
within 24–48 hours."

/status → "To check your application status, visit
ctsetsjm.com/#apply and click the 'Check Status' tab.
Enter the email you used when applying. Need help?
Send us your application reference and we'll check for you."

/payment → "Payment options: Bank transfer (NCB — JMD or USD
account), or upload receipt at ctsetsjm.com/#apply →
Payment Centre. Contact finance@ctsetsjm.com for
payment instructions."

tuition (Level 3+) for the first 15 students. Plus 5%

STEP 4: SET UP LABELS (ORGANISE CHATS)
────────────────────────────────────────
Create these labels to track conversations:
🟢 New Enquiry
🟡 Applied — Awaiting Payment
🔵 Enrolled — Active Student
🟠 Employer / Group Enquiry
🔴 Urgent / Complaint
⚪ Resolved

STEP 5: SET AWAY MESSAGE
────────────────────────────────────────
"Thank you for messaging CTS ETS. We're currently away but
will respond within 24 hours. In the meantime, visit
ctsetsjm.com for programme info, fees, and to apply online.
For urgent matters, email info@ctsetsjm.com."

STEP 6: SET GREETING MESSAGE
────────────────────────────────────────
"Welcome to CTS ETS! 🎓 We're Jamaica's digital-first
vocational training institution. How can we help you today?
• Browse programmes: ctsetsjm.com
• Apply online: ctsetsjm.com/#apply
• Check fees: ctsetsjm.com/#fees-&-calculator
Or just type your question and we'll get back to you!"

FUTURE: WHATSAPP BUSINESS API (WHEN VOLUME GROWS)
────────────────────────────────────────
When handling 50+ conversations/day, consider:
• Twilio WhatsApp API (twilio.com) — automated messages
• 360dialog (360dialog.com) — cheaper alternative
• Wati.io — built for small businesses
These allow: automated enrolment confirmations, payment
reminders, assessment notifications, and chatbot responses.
Approximate cost: US$50–150/month.
`;

// ─── INTERNATIONAL PRIVACY ADDITIONS ────────────────────────────────
// Additional privacy clauses for GDPR/international compliance
export const INTERNATIONAL_PRIVACY_CLAUSES = [
  {
    title: "International Data Transfers",
    content: "CTS ETS is based in Jamaica. When you apply from outside Jamaica, your personal data is transferred to and processed in Jamaica. By submitting your application, you consent to this transfer. We ensure your data is protected to a standard equivalent to the protections available in your home country."
  },
  {
    title: "GDPR Compliance (UK/EU Applicants)",
    content: "If you are applying from the United Kingdom or European Union, you have additional rights under the General Data Protection Regulation (GDPR). These include: the right to access your data, the right to rectification, the right to erasure ('right to be forgotten'), the right to restrict processing, the right to data portability, and the right to object to processing. To exercise any of these rights, email info@ctsetsjm.com with the subject line 'GDPR Request'. We will respond within 30 days."
  },
  {
    title: "Data Retention for Non-Enrolled Applicants",
    content: "If you submit an application but do not complete enrolment, we retain your application data for 12 months. After this period, your data is securely deleted unless you request earlier deletion. Enrolled students' records are retained for 7 years after programme completion, in accordance with Jamaican educational regulations."
  },
  {
    title: "Cookies and Tracking (International)",
    content: "Our website uses minimal cookies: a cookie consent preference (localStorage) and temporary form data storage (sessionStorage). We use Google Analytics 4 for anonymous usage statistics. We do not use advertising cookies, cross-site tracking, or sell data to third parties. International visitors may opt out of analytics via their browser settings or by declining cookies in our consent banner."
  },
  {
    title: "Third-Party Data Processors",
    content: "Your data may be processed by the following third-party services: Google (Apps Script — form processing, Analytics — usage statistics), Brevo (transactional emails), WiPay (payment processing — PCI DSS Level 1 certified), and EmailJS (notification emails). Each processor is contractually bound to protect your data and process it only for the stated purpose."
  },
  {
    title: "Data Protection Contact",
    content: "For all data protection enquiries, including international requests, contact: CTS Empowerment & Training Solutions, Data Protection, 6 Newark Avenue, Kingston 11, Jamaica W.I. Email: info@ctsetsjm.com. We aim to respond to all data protection requests within 30 days."
  },
];
