// ─── TERMS & CONDITIONS PAGE ────────────────────────────────────────
import S from "../constants/styles";
import { Container, PageWrapper, SectionHeader, Reveal } from "../components/shared/CoreComponents";

const SECTIONS = [
  { title: "1. Definitions", content: [
    '"CTS ETS" refers to CTS Empowerment & Training Solutions, a registered post-secondary vocational training institution in Jamaica (Reg. No. 16007/2025).',
    '"Student", "Learner", or "You" refers to any person enrolled in or applying to a CTS ETS programme.',
    '"Programme" refers to any course of study offered by CTS ETS, including all associated learning materials, assessments, and support services.',
    '"Interactive Learning System" refers to the CTS ETS proprietary study platform, including audio sessions, AI study assistant, video summaries, and flashcards.',
  ]},
  { title: "2. Enrolment & Acceptance", content: [
    "Submission of an application does not guarantee acceptance. CTS ETS reserves the right to accept or decline any application at its discretion.",
    "Acceptance is confirmed by email and is conditional upon receipt of the applicable registration fee and/or tuition payment within 48 hours of acceptance (or as otherwise agreed).",
    "By completing enrolment, you confirm that all information provided in your application is true and accurate. False information may result in immediate termination of enrolment without refund.",
    "Students must meet the entry requirements for their chosen qualification level as published on ctsetsjm.com.",
  ]},
  { title: "3. Fees & Payment", content: [
    "All fees are published on ctsetsjm.com and are quoted in Jamaican Dollars (JMD). USD equivalents are provided for reference at the stated exchange rate and may vary.",
    "Registration fee: J$5,000 (non-refundable). Tuition fees vary by qualification level.",
    "Payment plans: Gold (full payment, 0% surcharge), Silver (60/40 split, +10% surcharge — Levels 3–5 only), Bronze (30% deposit + monthly instalments, +15% surcharge — Levels 3–5 only).",
    "Failure to complete payment plan instalments by the agreed dates may result in suspension of access to learning materials until payment is current.",
    "NCTVET and City & Guilds external assessment and certification fees are separate from CTS ETS tuition and are payable directly to the respective awarding body.",
  ]},
  { title: "4. Refund Policy", content: [
    "Registration fees are non-refundable under any circumstances.",
    "Tuition refunds may be requested within 7 calendar days of enrolment, provided the student has not accessed more than 20% of the programme content. A J$2,000 administrative fee will be deducted.",
    "After 7 days or after accessing more than 20% of content, no tuition refund will be issued.",
    "Refunds are processed within 14 business days to the original payment method.",
    "If CTS ETS is unable to deliver a programme after enrolment (e.g. due to programme cancellation), a full refund will be issued.",
  ]},
  { title: "5. Programme Delivery", content: [
    "All CTS ETS programmes are delivered primarily online (minimum 90%) through expert-written learner guides and the CTS ETS Interactive Learning System.",
    "CTS ETS reserves the right to update programme content, assessment methods, and learning materials at any time to reflect current competency standards.",
    "Programme durations are estimates. Actual completion time depends on individual pace of study. CTS ETS recommends 6–10 hours of study per week.",
    "Some practical assessments may require workplace evidence. Students are responsible for arranging access to a suitable workplace environment where applicable.",
    "CTS ETS does not guarantee employment outcomes. Career salary ranges and employment outlook data published on ctsetsjm.com are estimates based on market research and are provided for informational purposes only.",
  ]},
  { title: "6. Assessment & Certification", content: [
    "Internal assessments are administered by CTS ETS in accordance with the relevant competency standard.",
    "Students who pass all internal assessments receive a CTS ETS Institutional Certificate of Completion.",
    "External certification through NCTVET (NVQ-J) or City & Guilds is subject to the policies, fees, and assessment requirements of the respective awarding body. CTS ETS facilitates but does not guarantee external certification.",
    "Each programme is aligned to either NCTVET or City & Guilds — not both simultaneously.",
    "CTS ETS is NOT a City & Guilds Assured Provider. City & Guilds alignment refers to programme content standards, not institutional accreditation.",
  ]},
  { title: "7. Student Conduct", content: [
    "Students are expected to engage with CTS ETS programmes honestly and ethically.",
    "Plagiarism, cheating, submitting another person's work as your own, or any form of academic dishonesty will result in failure of the affected assessment and may lead to termination of enrolment without refund.",
    "Students must not share login credentials, learning materials, or assessment content with any person not enrolled in the same programme.",
    "Abusive, threatening, or inappropriate communication with CTS ETS staff will not be tolerated and may result in suspension or termination of enrolment.",
  ]},
  { title: "8. Intellectual Property", content: [
    "All learning materials, learner guides, audio sessions, video content, and platform tools are the intellectual property of CTS ETS and are protected by copyright.",
    "Students are granted a personal, non-transferable licence to use programme materials for the duration of their enrolment.",
    "Reproduction, distribution, or commercial use of CTS ETS materials without written permission is strictly prohibited.",
  ]},
  { title: "9. Privacy & Data Protection", content: [
    "Your personal information is handled in accordance with our Privacy Policy, available at ctsetsjm.com.",
    "By enrolling, you consent to CTS ETS sharing your information with NCTVET, City & Guilds, HEART/NSTA Trust, and payment processors as necessary for programme delivery and certification.",
  ]},
  { title: "10. Limitation of Liability", content: [
    "CTS ETS is not liable for any indirect, consequential, or incidental damages arising from the use of our services, website, or learning platform.",
    "CTS ETS is not liable for interruptions to service caused by internet connectivity issues, third-party platform outages, or force majeure events.",
    "Our total liability for any claim shall not exceed the total fees paid by the student for the specific programme in question.",
  ]},
  { title: "11. Changes to Terms", content: [
    "CTS ETS reserves the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date.",
    "Students enrolled at the time of a change will be notified by email. Continued use of our services constitutes acceptance of the updated terms.",
    "Fee changes will not affect students who have already completed payment at the time of the change.",
  ]},
  { title: "12. Governing Law", content: [
    "These Terms & Conditions are governed by and construed in accordance with the laws of Jamaica.",
    "Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Jamaica.",
  ]},
  { title: "13. Contact", content: [
    "For questions about these terms, contact CTS ETS:",
    "Email: info@ctsetsjm.com | Phone: 876-381-9771 | WhatsApp: 876-381-9771",
    "Address: 6 Newark Avenue, Kingston 11, Jamaica W.I. | Reg. No. 16007/2025",
  ]},
];

export default function TermsPage() {
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Legal" title="Terms & Conditions" desc="The terms governing your use of CTS ETS services and programmes." />
      <Container>
        <Reveal>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ padding: "14px 20px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30", marginBottom: 32, fontSize: 12, fontFamily: S.body, color: S.amberDark }}>
              <strong>Effective Date:</strong> 1 March 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> 28 March 2026
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,40px)", border: "1px solid " + S.border }}>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.8, marginBottom: 32 }}>
                These Terms & Conditions ("Terms") govern your use of the services provided by CTS Empowerment & Training Solutions ("CTS ETS"). By applying to, enrolling in, or using any CTS ETS programme or service, you agree to be bound by these Terms. If you do not agree, do not use our services.
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
