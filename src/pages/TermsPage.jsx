import React from "react";
import S from "../constants/styles";
import {
  Container,
  PageWrapper,
  SectionHeader,
  Reveal,
  Btn,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";

const TERMS = [
  {
    title: "1. Enrolment & Acceptance",
    text: "Acceptance is conditional upon receipt of the registration fee within 48 hours. Providing false information results in immediate termination without refund.",
    color: S.coral,
    icon: "📝",
  },
  {
    title: "2. Fees & Refund Policy",
    text: "Registration fees (J$5,000) are strictly non-refundable. Tuition refunds are available within 7 days if less than 20% of content has been accessed.",
    color: S.gold,
    icon: "💳",
  },
  {
    title: "3. Certification Disclosure",
    text: "CTS ETS facilitates NCTVET (NVQ-J) certification but does not guarantee it, as awarding is subject to external body policies.",
    color: S.teal,
    icon: "🎓",
  },
];

function TermCard({ item, index }) {
  return (
    <Reveal delay={index * 0.05}>
      <div
        style={{
          background: S.white,
          borderRadius: 22,
          border: `1px solid ${S.border}`,
          boxShadow: "0 14px 34px rgba(15,23,42,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            padding: "20px 22px",
            background: `${item.color}10`,
            borderBottom: `1px solid ${item.color}20`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${item.color}18`,
              border: `1px solid ${item.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <h3
            style={{
              color: S.navy,
              fontFamily: S.heading,
              fontSize: 24,
              margin: 0,
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            {item.title}
          </h3>
        </div>
        <div style={{ padding: "22px 24px 24px" }}>
          <p
            style={{
              color: S.gray,
              fontSize: 15,
              lineHeight: 1.85,
              margin: 0,
              fontFamily: S.body,
            }}
          >
            {item.text}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function TermsPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #E8634A 145%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(14,143,139,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(232,99,74,0.14), transparent 22%)",
          }}
        />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
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
              Legal Framework
            </div>
            <h1
              style={{
                fontFamily: S.heading,
                fontSize: "clamp(36px, 6vw, 66px)",
                lineHeight: 1.04,
                color: S.white,
                fontWeight: 900,
                margin: "0 0 18px",
                maxWidth: 860,
              }}
            >
              Terms and conditions, presented more clearly
            </h1>
            <p
              style={{
                fontFamily: S.body,
                fontSize: "clamp(15px, 2vw, 19px)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 780,
                margin: 0,
              }}
            >
              This upgrade keeps the same legal meaning from your current Terms page, but presents it in a way that feels more formal, more professional, and easier for learners to understand before they apply.
            </p>
          </Reveal>
        </Container>
      </div>

      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}>
        <Reveal>
          <SocialProofBar />
        </Reveal>
      </Container>

      <SectionHeader
        tag="Official Policy"
        title="The legal basis for enrolment at CTS ETS"
        desc="The original page already contains the key legal points. This redesign improves hierarchy and trust without changing the actual meaning of those terms."
        accentColor={S.coral}
      />

      <Container>
        <Reveal>
          <div
            style={{
              maxWidth: 940,
              margin: "0 auto 28px",
              background: S.white,
              borderRadius: 22,
              border: `1px solid ${S.border}`,
              boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "26px 28px",
                borderBottom: `1px solid ${S.border}`,
                background: S.lightBg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: S.coral,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: S.body,
                    marginBottom: 10,
                  }}
                >
                  Terms Summary
                </div>
                <div
                  style={{
                    fontFamily: S.heading,
                    fontSize: 28,
                    color: S.navy,
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  Key points learners should understand before enrolment
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, marginBottom: 4 }}>Effective: 1 March 2026</div>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body }}>Reference: CTS-POL-TERM-V1</div>
              </div>
            </div>

            <div style={{ padding: "28px clamp(22px,4vw,34px)" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                {[
                  ["48 hours", "Registration payment window", S.coral],
                  ["J$5,000", "Non-refundable registration fee", S.goldDark],
                  ["7 days", "Tuition refund review window", S.teal],
                ].map(([value, label, accent]) => (
                  <div
                    key={label}
                    style={{
                      padding: "18px 18px",
                      borderRadius: 16,
                      background: S.lightBg,
                      border: `1px solid ${S.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: S.heading,
                        fontSize: 28,
                        color: accent,
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: 8,
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: S.gray,
                        letterSpacing: 1.4,
                        textTransform: "uppercase",
                        fontFamily: S.body,
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                {TERMS.map((item, index) => (
                  <TermCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              maxWidth: 940,
              margin: "0 auto",
              padding: "34px clamp(22px,4vw,38px)",
              borderRadius: 24,
              background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)",
              boxShadow: "0 20px 44px rgba(15,23,42,0.14)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                color: S.goldLight,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontFamily: S.body,
                marginBottom: 14,
              }}
            >
              Student Acknowledgment
            </div>
            <h2
              style={{
                color: S.white,
                fontFamily: S.heading,
                margin: "0 0 14px",
                fontSize: "clamp(28px,4vw,40px)",
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              Applying means you agree to these terms
            </h2>
            <p
              style={{
                fontFamily: S.body,
                fontSize: 15,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.8,
                maxWidth: 760,
                margin: "0 auto 24px",
              }}
            >
              By clicking “Apply” on the CTS ETS platform, the learner signifies that they have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
            <Btn
              primary
              onClick={() => setPage("Apply")}
              style={{
                background: S.coral,
                color: S.white,
                padding: "16px 34px",
                borderRadius: 14,
                border: "none",
                boxShadow: `0 8px 24px ${S.coral}30`,
              }}
            >
              Proceed to Application
            </Btn>
          </div>
        </Reveal>

        <PageScripture page="terms" />
      </Container>
    </PageWrapper>
  );
}
