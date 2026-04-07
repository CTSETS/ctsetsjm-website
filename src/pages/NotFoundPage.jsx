import React from "react";
import S from "../constants/styles";
import {
  Container,
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
} from "../components/shared/CoreComponents";

function QuickLinkCard({ item, setPage }) {
  return (
    <button
      onClick={() => setPage(item.page)}
      style={{
        padding: "16px 18px",
        borderRadius: 14,
        border: `1px solid ${S.border}`,
        background: S.white,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: S.body,
        fontSize: 14,
        color: S.navy,
        fontWeight: 700,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 10px 24px rgba(15,23,42,0.03)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = item.color;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 14px 28px ${item.color}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = S.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(15,23,42,0.03)";
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: item.color,
          flexShrink: 0,
          boxShadow: `0 0 0 4px ${item.color}18`,
        }}
      />
      <div>
        <div style={{ fontSize: 14, color: S.navy, fontWeight: 800, fontFamily: S.body }}>{item.label}</div>
        <div style={{ fontSize: 12, color: S.gray, fontWeight: 500, fontFamily: S.body, marginTop: 2 }}>{item.desc}</div>
      </div>
    </button>
  );
}

export default function NotFoundPage({ setPage }) {
  const quickLinks = [
    {
      label: "Apply Now",
      page: "Apply",
      color: S.coral,
      desc: "Start an application and move into the admissions process.",
    },
    {
      label: "Fees & Calculator",
      page: "Fees & Calculator",
      color: S.teal,
      desc: "Review likely cost and payment-plan options before applying.",
    },
    {
      label: "Our Programmes",
      page: "Programmes",
      color: S.violet,
      desc: "Browse the full list of professional pathways available at CTS ETS.",
    },
    {
      label: "Contact Support",
      page: "Contact",
      color: S.emerald,
      desc: "Reach the team if you need help finding the right page or next step.",
    },
  ];

  return (
    <PageWrapper bg={S.lightBg}>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(124,58,237,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(14,143,139,0.14), transparent 22%)",
          }}
        />
        <Container style={{ position: "relative", paddingTop: 70, paddingBottom: 72 }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: S.body,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: S.goldLight,
                  marginBottom: 18,
                }}
              >
                Navigation Error
              </div>

              <div style={{ fontSize: "clamp(72px, 10vw, 120px)", lineHeight: 1, marginBottom: 10 }}>🔭</div>

              <h1
                style={{
                  fontFamily: S.heading,
                  fontSize: "clamp(44px, 8vw, 92px)",
                  color: S.white,
                  fontWeight: 900,
                  margin: "0 0 10px",
                  lineHeight: 0.95,
                }}
              >
                404
              </h1>

              <h2
                style={{
                  fontFamily: S.heading,
                  fontSize: "clamp(26px, 4vw, 38px)",
                  color: S.goldLight,
                  fontWeight: 800,
                  margin: "0 0 18px",
                  lineHeight: 1.12,
                }}
              >
                Page not found, but your next step is still close
              </h2>

              <p
                style={{
                  fontFamily: S.body,
                  fontSize: "clamp(15px, 2vw, 18px)",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.8,
                  margin: "0 auto 28px",
                  maxWidth: 700,
                }}
              >
                It looks like you’ve wandered off the study path. Don’t worry — this upgraded fallback page keeps the same recovery purpose as your original file, but makes the experience feel more polished and more helpful.
              </p>

              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn
                  primary
                  onClick={() => setPage("Home")}
                  style={{
                    background: S.gold,
                    color: S.navy,
                    padding: "16px 32px",
                    borderRadius: 14,
                    boxShadow: "0 16px 36px rgba(217,119,6,0.26)",
                  }}
                >
                  Return to Homepage
                </Btn>
                <Btn
                  onClick={() => setPage("Contact")}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: S.white,
                    padding: "16px 32px",
                    borderRadius: 14,
                  }}
                >
                  Get Help
                </Btn>
              </div>
            </div>
          </Reveal>
        </Container>
      </div>

      <Container style={{ marginTop: -26, position: "relative", zIndex: 2 }}>
        <Reveal>
          <div
            style={{
              maxWidth: 920,
              margin: "0 auto 34px",
              background: S.white,
              borderRadius: 22,
              padding: "26px clamp(22px,4vw,30px)",
              border: `1px solid ${S.border}`,
              boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: S.goldDark,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: S.body,
                fontWeight: 800,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Quick Recovery Links
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              {quickLinks.map((item) => (
                <QuickLinkCard key={item.page} item={item} setPage={setPage} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              maxWidth: 920,
              margin: "0 auto",
              textAlign: "center",
              padding: "30px clamp(22px,4vw,34px)",
              background: S.white,
              borderRadius: 22,
              border: `1px solid ${S.border}`,
              boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 999,
                background: S.lightBg,
                color: S.teal,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontFamily: S.body,
                marginBottom: 14,
              }}
            >
              Support Path
            </div>
            <h3
              style={{
                fontFamily: S.heading,
                fontSize: "clamp(26px,4vw,38px)",
                color: S.navy,
                margin: "0 0 12px",
                fontWeight: 900,
                lineHeight: 1.12,
              }}
            >
              Still not sure where to go?
            </h3>
            <p
              style={{
                fontFamily: S.body,
                fontSize: 15,
                color: S.gray,
                lineHeight: 1.8,
                maxWidth: 700,
                margin: "0 auto 20px",
              }}
            >
              Contact the CTS ETS team and we’ll point you in the right direction, whether you are applying, checking fees, reviewing programmes, or looking for support.
            </p>
            <Btn
              onClick={() => setPage("Contact")}
              style={{
                borderRadius: 12,
                padding: "14px 28px",
                border: `2px solid ${S.teal}`,
                color: S.teal,
              }}
            >
              Contact Support
            </Btn>
          </div>
        </Reveal>

        <PageScripture page="notFound" />
      </Container>
    </PageWrapper>
  );
}
