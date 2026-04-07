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

const GUIDELINES = [
  {
    num: "01",
    title: "Authorized Assistance",
    text: "Use the built-in Study Assistant to explain concepts and clarify material. This is an encouraged study aid when used to support learning rather than replace it.",
    icon: "🤖",
    color: S.violet,
  },
  {
    num: "02",
    title: "Assessment Integrity",
    text: "Using AI to generate answers during topical or final assessments is strictly prohibited and constitutes academic dishonesty.",
    icon: "🛡️",
    color: S.coral,
  },
  {
    num: "03",
    title: "Authority of Materials",
    text: "In any conflict between an AI response and the official Learner Guide, the Learner Guide takes precedence.",
    icon: "📘",
    color: S.teal,
  },
];

function GuidelineCard({ item, index }) {
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
              width: 50,
              height: 50,
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
          <div>
            <div
              style={{
                fontSize: 11,
                color: item.color,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontFamily: S.body,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Guideline {item.num}
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

export default function AIUsagePolicyPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #7C3AED 145%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(124,58,237,0.18), transparent 24%), radial-gradient(circle at 70% 80%, rgba(14,143,139,0.14), transparent 22%)",
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
              Ethics & Technology
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
              AI usage policy, framed more clearly for responsible learning
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
              This upgrade keeps the same policy meaning from your current page, but presents it more like a formal academic-integrity and digital-ethics statement for the CTS ETS learning environment.
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
        tag="Human-Centric AI"
        title="A policy for using AI as a tool, not a substitute for learning"
        desc="The original page already defines the key rules. This redesign keeps those rules intact while making them easier to understand and more aligned with academic integrity."
        accentColor={S.violet}
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
                    color: S.violet,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: S.body,
                    marginBottom: 10,
                  }}
                >
                  Policy Statement
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
                  CTS ETS supports ethical AI literacy and responsible digital learning
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, marginBottom: 4 }}>Active Policy Version 1.0</div>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body }}>April 2026</div>
              </div>
            </div>

            <div style={{ padding: "28px clamp(22px,4vw,34px)" }}>
              <div
                style={{
                  background: `${S.violet}08`,
                  border: `1px solid ${S.violet}20`,
                  borderRadius: 16,
                  padding: "22px 22px",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: S.violet,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: S.body,
                    marginBottom: 10,
                  }}
                >
                  Core Position
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
                  We believe AI literacy is a vital workplace skill. We aim to train students to use these tools ethically and effectively.
                </p>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                {GUIDELINES.map((item, index) => (
                  <GuidelineCard key={item.title} item={item} index={index} />
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
              Learner Responsibility
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
              Use AI to support your learning, not to replace your own work
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
              Learners are expected to engage honestly with coursework, assessments, and the official study materials provided by CTS ETS.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn
                primary
                onClick={() => setPage("Student Portal")}
                style={{
                  background: S.violet,
                  color: S.white,
                  padding: "16px 30px",
                  borderRadius: 14,
                  border: "none",
                  boxShadow: `0 8px 24px ${S.violet}28`,
                }}
              >
                Go to Student Portal
              </Btn>
              <Btn
                onClick={() => setPage("Contact")}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: S.white,
                  padding: "16px 30px",
                  borderRadius: 14,
                }}
              >
                Ask a Question
              </Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="aiPolicy" />
      </Container>
    </PageWrapper>
  );
}
