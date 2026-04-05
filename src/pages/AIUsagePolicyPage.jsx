import React from "react";
import S from "../constants/styles";
import { Container, PageWrapper, SectionHeader, Reveal } from "../components/shared/CoreComponents";

export default function AIUsagePolicyPage() {
  const itemStyle = { display: "flex", gap: "15px", marginBottom: "20px", alignItems: "flex-start" };
  const iconStyle = { width: "32px", height: "32px", borderRadius: "50%", background: `${S.violet}15`, color: S.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", flexShrink: 0 };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Ethics & Technology" title="AI Usage Policy" desc="Defining the responsible use of Artificial Intelligence in our digital classroom." accentColor={S.violet} />
      <Container>
        <Reveal>
          <div style={{ maxWidth: "850px", margin: "0 auto", background: S.white, border: `1px solid ${S.border}`, borderRadius: "16px", overflow: "hidden" }}>
            
            <div style={{ background: S.navy, padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>🤖</div>
              <h2 style={{ color: S.white, fontFamily: S.heading, margin: 0 }}>Human-Centric AI</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginTop: "10px" }}>Active Policy Version 1.0 (April 2026)</p>
            </div>

            <div style={{ padding: "50px 40px" }}>
              <h3 style={{ color: S.navy, fontFamily: S.heading, fontSize: "22px", marginBottom: "30px" }}>Guidelines for Students</h3>

              <div style={itemStyle}>
                <div style={iconStyle}>01</div>
                <div>
                  <strong style={{ color: S.navy, display: "block", marginBottom: "5px" }}>Authorized Assistance</strong>
                  <p style={{ color: S.gray, fontSize: "14px", margin: 0 }}>Use the built-in Study Assistant to explain concepts and clarify material. This is an encouraged study aid.</p>
                </div>
              </div>

              <div style={itemStyle}>
                <div style={iconStyle}>02</div>
                <div>
                  <strong style={{ color: S.navy, display: "block", marginBottom: "5px" }}>Assessment Integrity</strong>
                  <p style={{ color: S.gray, fontSize: "14px", margin: 0 }}>Using AI to generate answers during topical or final assessments is strictly prohibited and constitutes academic dishonesty.</p>
                </div>
              </div>

              <div style={itemStyle}>
                <div style={iconStyle}>03</div>
                <div>
                  <strong style={{ color: S.navy, display: "block", marginBottom: "5px" }}>Authority of Materials</strong>
                  <p style={{ color: S.gray, fontSize: "14px", margin: 0 }}>In any conflict between an AI response and the official Learner Guide, the Learner Guide takes precedence.</p>
                </div>
              </div>

              <div style={{ marginTop: "40px", padding: "24px", background: S.lightBg, borderLeft: `4px solid ${S.violet}`, fontSize: "14px", color: S.navy, fontStyle: "italic" }}>
                "We believe AI literacy is a vital workplace skill. We aim to train students to use these tools ethically and effectively."
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </PageWrapper>
  );
}