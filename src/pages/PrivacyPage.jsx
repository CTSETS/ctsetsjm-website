import React from "react";
import S from "../constants/styles";
import { Container, PageWrapper, SectionHeader, Reveal } from "../components/shared/CoreComponents";

const SECTIONS = [
  { title: "1. Information We Collect", content: [
    "Personal identification: Full name, date of birth, TRN, and national ID details.",
    "Contact information: Email, telephone, and physical address.",
    "Educational data: Prior qualifications and assessment results.",
    "Financial data: Payment records and receipts (card details are never stored by us)."
  ]},
  { title: "2. How We Use Your Information", content: [
    "To manage your application and enrolment.",
    "To deliver services via the Interactive Learning System.",
    "To submit details to NCTVET for external certification.",
    "To improve our programmes based on feedback."
  ]}
];

export default function PrivacyPage() {
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Institutional Compliance" title="Privacy Policy" desc="How we protect and manage your personal data in accordance with the Jamaica Data Protection Act." accentColor={S.teal} />
      <Container>
        <Reveal>
          <div style={{ maxWidth: "850px", margin: "0 auto", background: S.white, borderRadius: "2px", border: `1px solid ${S.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            
            {/* Document Header */}
            <div style={{ padding: "40px", borderBottom: `1px solid ${S.border}`, background: S.lightBg }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: S.teal, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Official Policy Document</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                <div style={{ fontSize: "14px", color: S.gray }}>Effective: 1 March 2026</div>
                <div style={{ fontSize: "14px", color: S.gray }}>Ref: CTS-POL-PRIV-V2</div>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div style={{ padding: "40px", borderBottom: `1px solid ${S.border}` }}>
              <div style={{ background: `${S.teal}08`, border: `1px solid ${S.teal}20`, borderRadius: "12px", padding: "24px" }}>
                <h4 style={{ color: S.tealDark, fontFamily: S.heading, margin: "0 0 12px" }}>Quick Summary</h4>
                <p style={{ fontSize: "14px", color: S.navy, margin: 0, lineHeight: "1.6" }}>
                  We collect only what is needed for your education. We never sell your data. We share information only with trusted partners like NCTVET, HEART/NSTA, and WiPay to facilitate your certification and payments.
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ padding: "40px", fontFamily: S.body, color: S.gray, lineHeight: "1.8", fontSize: "15px" }}>
              {SECTIONS.map((sec, i) => (
                <div key={i} style={{ marginBottom: "40px" }}>
                  <h3 style={{ color: S.navy, fontFamily: S.heading, fontSize: "20px", marginBottom: "16px", borderLeft: `4px solid ${S.teal}`, paddingLeft: "15px" }}>{sec.title}</h3>
                  {sec.content.map((p, j) => (
                    <p key={j} style={{ marginBottom: "12px" }}>{p}</p>
                  ))}
                </div>
              ))}
              <div style={{ marginTop: "60px", padding: "20px", background: S.lightBg, borderRadius: "8px", fontSize: "13px", textAlign: "center" }}>
                Questions regarding data privacy should be directed to <strong>admin@ctsetsjm.com</strong>.
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </PageWrapper>
  );
}