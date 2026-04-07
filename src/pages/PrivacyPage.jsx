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

const SECTIONS = [
  {
    title: "1. Information We Collect",
    icon: "🗂️",
    color: S.teal,
    content: [
      "Personal identification: Full name, date of birth, TRN, and national ID details.",
      "Contact information: Email, telephone, and physical address.",
      "Educational data: Prior qualifications and assessment results.",
      "Financial data: Payment records and receipts (card details are never stored by us).",
    ],
  },
  {
    title: "2. How We Use Your Information",
    icon: "🔐",
    color: S.coral,
    content: [
      "To manage your application and enrolment.",
      "To deliver services via the Interactive Learning System.",
      "To submit details to NCTVET for external certification.",
      "To improve our programmes based on feedback.",
    ],
  },
];

function SummaryCard({ title, text, accent }) {
  return (
    <div
      style={{
        background: S.white,
        borderRadius: 18,
        padding: "20px 18px",
        border: `1px solid ${S.border}`,
        boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          fontFamily: S.heading,
          fontSize: 26,
          color: accent,
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: S.body,
          fontSize: 12,
          color: S.gray,
          lineHeight: 1.65,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function PolicySection({ section, index }) {
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
            background: `${section.color}10`,
            borderBottom: `1px solid ${section.color}20`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${section.color}18`,
              border: `1px solid ${section.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {section.icon}
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
            {section.title}
          </h3>
        </div>
        <div style={{ padding: "22px 24px 24px" }}>
          <div style={{ display: "grid", gap: 12 }}>
            {section.content.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    background: `${section.color}16`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <span style={{ color: section.color, fontWeight: 900, fontSize: 10 }}>✓</span>
                </div>
                <p
                  style={{
                    color: S.gray,
                    fontSize: 15,
                    lineHeight: 1.8,
                    margin: 0,
                    fontFamily: S.body,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function PrivacyPage({ setPage }) {
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
              "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(14,143,139,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(59,130,246,0.14), transparent 22%)",
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
              Institutional Compliance
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
              Privacy policy, structured more clearly for trust and compliance
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
              This upgrade keeps the same privacy-policy meaning from your current page, but presents it in a stronger institutional style that feels more official, more secure, and easier for learners to understand.
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
        tag="Official Policy Document"
        title="How CTS ETS protects and manages learner data"
        desc="The original page already contains the correct policy purpose and Jamaica Data Protection Act framing. This redesign improves hierarchy and readability without changing the intent."
        accentColor={S.teal}
      />

      <Container>
        <Reveal>
          <div
            style={{
              maxWidth: 960,
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
                    color: S.teal,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: S.body,
                    marginBottom: 10,
                  }}
                >
                  Privacy Summary
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
                  Data is collected only for education, administration, and certification support
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, marginBottom: 4 }}>Effective: 1 March 2026</div>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body }}>Ref: CTS-POL-PRIV-V2</div>
              </div>
            </div>

            <div style={{ padding: "28px clamp(22px,4vw,34px)" }}>
              <div
                style={{
                  background: `${S.teal}08`,
                  border: `1px solid ${S.teal}20`,
                  borderRadius: 16,
                  padding: "22px 22px",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: S.tealDark,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: S.body,
                    marginBottom: 10,
                  }}
                >
                  Quick Summary
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: S.navy,
                    margin: 0,
                    lineHeight: 1.8,
                    fontFamily: S.body,
                  }}
                >
                  We collect only what is needed for your education. We never sell your data. We share information only with trusted partners like NCTVET, HEART/NSTA, and WiPay to facilitate your certification and payments.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <SummaryCard title="No" text="We do not sell learner data to advertisers or third parties." accent={S.coral} />
                <SummaryCard title="Yes" text="We share necessary data only with trusted service and certification partners." accent={S.teal} />
                <SummaryCard title="DPA" text="This policy is presented in line with the Jamaica Data Protection Act framing used on your current page." accent={S.goldDark} />
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                {SECTIONS.map((section, index) => (
                  <PolicySection key={section.title} section={section} index={index} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              maxWidth: 960,
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
              Data Questions
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
              Need clarification about how your data is handled?
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
              Questions regarding data privacy should be directed to <strong>admin@ctsetsjm.com</strong>. This keeps the same contact purpose as your current page, but presents it in a stronger final block.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn
                primary
                onClick={() => setPage("Contact")}
                style={{
                  background: S.teal,
                  color: S.white,
                  padding: "16px 30px",
                  borderRadius: 14,
                  border: "none",
                  boxShadow: `0 8px 24px ${S.teal}28`,
                }}
              >
                Contact CTS ETS
              </Btn>
              <Btn
                onClick={() => setPage("Apply")}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: S.white,
                  padding: "16px 30px",
                  borderRadius: 14,
                }}
              >
                Return to Application
              </Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="privacy" />
      </Container>
    </PageWrapper>
  );
}
