import React from "react";
import S from "../constants/styles";
import { Container, PageWrapper, SectionHeader, Reveal, Btn } from "../components/shared/CoreComponents";

export default function TermsPage({ setPage }) {
  const sectionStyle = { marginBottom: "40px" };
  const h3Style = { color: S.navy, fontFamily: S.heading, fontSize: "20px", marginBottom: "16px" };
  const pStyle = { color: S.gray, fontSize: "15px", lineHeight: "1.8", marginBottom: "12px" };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Legal" title="Terms & Conditions" desc="The legal framework governing your enrolment and study at CTS ETS." accentColor={S.coral} />
      <Container>
        <Reveal>
          <div style={{ maxWidth: "850px", margin: "0 auto", background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "60px 40px" }}>
              
              <div style={sectionStyle}>
                <h3 style={h3Style}>1. Enrolment & Acceptance</h3>
                <p style={pStyle}>Acceptance is conditional upon receipt of the registration fee within 48 hours. Providing false information results in immediate termination without refund.</p>
              </div>

              <div style={sectionStyle}>
                <h3 style={h3Style}>2. Fees & Refund Policy</h3>
                <p style={pStyle}>Registration fees (J$5,000) are strictly non-refundable. Tuition refunds are available within 7 days if less than 20% of content has been accessed.</p>
              </div>

              <div style={sectionStyle}>
                <h3 style={h3Style}>3. Certification Disclosure</h3>
                <p style={pStyle}>CTS ETS facilitates NCTVET (NVQ-J) certification but does not guarantee it, as awarding is subject to external body policies.</p>
              </div>

              {/* Acknowledgement Footer */}
              <div style={{ marginTop: "60px", padding: "40px", border: `2px solid ${S.coral}20`, background: `${S.coral}05`, textAlign: "center", borderRadius: "12px" }}>
                <h4 style={{ color: S.navy, margin: "0 0 12px" }}>Student Acknowledgment</h4>
                <p style={{ fontSize: "14px", color: S.gray, marginBottom: "24px" }}>
                  By clicking "Apply" on our platform, you signify that you have read, understood, and agree to be bound by these Terms.
                </p>
                <Btn primary onClick={() => setPage("Apply")} style={{ background: S.coral, color: S.white }}>Proceed to Application</Btn>
              </div>

            </div>
          </div>
        </Reveal>
      </Container>
    </PageWrapper>
  );
}