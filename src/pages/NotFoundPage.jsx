import React from "react";
import S from "../constants/styles";
import { Container, PageWrapper, Btn, Reveal } from "../components/shared/CoreComponents";

export default function NotFoundPage({ setPage }) {
  const quickLinks = [
    { label: "Apply Now", page: "Apply", color: S.coral },
    { label: "Fees & Calculator", page: "Fees & Calculator", color: S.teal },
    { label: "Our Programmes", page: "Programmes", color: S.violet },
    { label: "Contact Support", page: "Contact", color: S.emerald },
  ];

  return (
    <PageWrapper bg={S.lightBg}>
      <Container style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "100px", lineHeight: "1", marginBottom: "20px" }}>🔭</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "80px", color: S.navy, fontWeight: "800", margin: 0, lineHeight: "1" }}>404</h1>
            <h2 style={{ fontFamily: S.heading, fontSize: "28px", color: S.navy, fontWeight: "700", marginBottom: "20px" }}>Page Not Found</h2>
            <p style={{ fontFamily: S.body, fontSize: "16px", color: S.gray, lineHeight: "1.7", marginBottom: "40px" }}>
              It looks like you've wandered off the study path. Don't worry, even the best learners get lost sometimes. Let's get you back to class.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "50px" }}>
              <Btn primary onClick={() => setPage("Home")} style={{ background: S.navy, color: S.white, padding: "16px 40px" }}>Go to Homepage</Btn>
              <Btn onClick={() => setPage("Contact")} style={{ border: `2px solid ${S.teal}`, color: S.teal, background: "transparent" }}>Get Help</Btn>
            </div>

            <div style={{ background: S.white, borderRadius: "20px", padding: "30px", border: `1px solid ${S.border}`, textAlign: "left", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "12px", color: S.gold, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "20px" }}>Looking for something specific?</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {quickLinks.map((link) => (
                  <button 
                    key={link.page} 
                    onClick={() => setPage(link.page)}
                    style={{ padding: "14px 18px", borderRadius: "12px", border: `1px solid ${S.border}`, background: S.lightBg, cursor: "pointer", textAlign: "left", fontFamily: S.body, fontSize: "14px", color: S.navy, fontWeight: "600", transition: "0.2s", display: "flex", alignItems: "center", gap: "10px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.background = S.white; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.background = S.lightBg; }}
                  >
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: link.color }} />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </PageWrapper>
  );
}