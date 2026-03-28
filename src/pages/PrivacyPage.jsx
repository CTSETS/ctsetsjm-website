// ─── PRIVACY POLICY PAGE ────────────────────────────────────────────
import S from "../constants/styles";
import { Container, PageWrapper, SectionHeader, Reveal } from "../components/shared/CoreComponents";

const SECTIONS = [
  { title: "1. Information We Collect", content: [
    "When you apply to CTS ETS, contact us, or use our website, we may collect the following personal information:",
    "Personal identification: Full name, date of birth, gender, Tax Registration Number (TRN), national ID or passport details.",
    "Contact information: Email address, telephone number, physical address, parish/country.",
    "Educational information: Prior qualifications, programme selections, assessment results, completion records.",
    "Financial information: Payment records, receipts, payment plan selections. Note: credit/debit card numbers are processed by WiPay and are never stored on CTS ETS servers.",
    "Technical information: IP address, browser type, device information, pages visited, and cookies (see Section 6).",
    "Communications: Messages sent via email, WhatsApp, or website forms.",
  ]},
  { title: "2. How We Use Your Information", content: [
    "We use your personal information for the following purposes:",
    "To process and manage your application and enrolment.",
    "To deliver educational services through our Interactive Learning System and Canvas LMS.",
    "To communicate with you about your programme, assessments, and account.",
    "To process payments and maintain financial records.",
    "To submit your details to NCTVET or City & Guilds for external certification (with your consent at enrolment).",
    "To submit registration documents to HEART/NSTA Trust where applicable.",
    "To improve our programmes, website, and services based on usage patterns and feedback.",
    "To send relevant updates about your programme, intake dates, and CTS ETS news (you can opt out at any time).",
  ]},
  { title: "3. How We Share Your Information", content: [
    "We do not sell, rent, or trade your personal information to third parties. We may share your information with:",
    "NCTVET — for national certification and external assessment registration.",
    "City & Guilds — for international certification where applicable.",
    "HEART/NSTA Trust — for training registration and compliance.",
    "WiPay — our payment processor, for secure payment transactions only.",
    "Google (Apps Script, Canvas LMS) — for learning management and form processing.",
    "EmailJS / Brevo — for transactional email delivery only.",
    "Regulatory authorities — if required by law or to protect the rights and safety of CTS ETS or its students.",
  ]},
  { title: "4. Data Security", content: [
    "We take reasonable measures to protect your personal information, including:",
    "SSL/TLS encryption on all website communications.",
    "PCI DSS Level 1 compliant payment processing through WiPay.",
    "Access controls limiting who within CTS ETS can view student records.",
    "Regular review of data handling practices.",
    "While we strive to protect your data, no method of transmission over the internet is 100% secure. You are responsible for keeping your login credentials confidential.",
  ]},
  { title: "5. Data Retention", content: [
    "We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, including:",
    "Active student records: retained for the duration of your programme plus 7 years.",
    "Certification records: retained indefinitely for verification purposes.",
    "Financial records: retained for 7 years in accordance with Jamaican tax regulations.",
    "Website analytics: anonymised data retained for up to 3 years.",
    "You may request deletion of your personal data by contacting info@ctsetsjm.com, subject to our legal retention obligations.",
  ]},
  { title: "6. Cookies & Tracking", content: [
    "Our website uses cookies and similar technologies to improve your experience:",
    "Essential cookies: Required for website functionality (session management, preferences).",
    "Analytics cookies: Google Analytics (GA4) to understand how visitors use our site. This data is anonymised.",
    "We do not use advertising cookies or third-party tracking for marketing purposes.",
    "You can manage cookies through your browser settings. Disabling cookies may affect website functionality.",
  ]},
  { title: "7. Your Rights", content: [
    "Under the Jamaica Data Protection Act (2020) and applicable international laws, you have the right to:",
    "Access: Request a copy of the personal information we hold about you.",
    "Correction: Request that we correct inaccurate or incomplete information.",
    "Deletion: Request deletion of your data, subject to legal retention requirements.",
    "Objection: Object to processing of your data for specific purposes.",
    "Portability: Request your data in a portable format.",
    "To exercise any of these rights, contact us at info@ctsetsjm.com or write to: CTS Empowerment & Training Solutions, 6 Newark Avenue, Kingston 11, Jamaica W.I.",
  ]},
  { title: "8. Children's Privacy", content: [
    "CTS ETS programmes are designed for learners aged 16 and above. We do not knowingly collect personal information from children under 16 without parental consent. If we discover that we have collected information from a child under 16, we will delete it promptly.",
  ]},
  { title: "9. Changes to This Policy", content: [
    "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our services after changes constitutes acceptance of the updated policy.",
  ]},
  { title: "10. Contact Us", content: [
    "If you have any questions about this Privacy Policy or how we handle your data, please contact us:",
    "Email: info@ctsetsjm.com",
    "Phone: 876-381-9771",
    "WhatsApp: 876-381-9771",
    "Address: 6 Newark Avenue, Kingston 11, Jamaica W.I.",
  ]},
];

export default function PrivacyPage() {
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Legal" title="Privacy Policy" desc="How CTS Empowerment & Training Solutions collects, uses, and protects your personal information." />
      <Container>
        <Reveal>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ padding: "14px 20px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30", marginBottom: 32, fontSize: 12, fontFamily: S.body, color: S.amberDark }}>
              <strong>Effective Date:</strong> 1 March 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> 28 March 2026
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,40px)", border: "1px solid " + S.border }}>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.8, marginBottom: 28 }}>
                CTS Empowerment & Training Solutions ("CTS ETS", "we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our website (ctsetsjm.com), apply to our programmes, or interact with our services.
              </p>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.8, marginBottom: 32 }}>
                By using our services, you consent to the practices described in this policy. CTS ETS is registered in Jamaica under Companies of Jamaica Registration No. 16007/2025.
              </p>

              {SECTIONS.map((sec, i) => (
                <div key={i} style={{ marginBottom: 28 }}>
                  <h3 style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: S.navy, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid " + S.border }}>{sec.title}</h3>
                  {sec.content.map((p, j) => (
                    <p key={j} style={{ fontFamily: S.body, fontSize: 13, color: j === 0 ? "#2D3748" : S.gray, lineHeight: 1.8, marginBottom: 8, paddingLeft: j > 0 ? 16 : 0, borderLeft: j > 0 ? "2px solid " + S.border : "none" }}>{p}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </PageWrapper>
  );
}
