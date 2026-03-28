// ─── 404 NOT FOUND PAGE ─────────────────────────────────────────────
import S from "../constants/styles";
import { Container, PageWrapper, Btn, Reveal } from "../components/shared/CoreComponents";

export default function NotFoundPage({ setPage }) {
  return (
    <PageWrapper bg={S.lightBg}>
      <Container style={{ paddingTop: 60 }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
            <div style={{ fontSize: 80, marginBottom: 16, lineHeight: 1 }}>🔍</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(48px,8vw,72px)", color: S.navy, fontWeight: 800, marginBottom: 8, lineHeight: 1 }}>404</h1>
            <h2 style={{ fontFamily: S.heading, fontSize: "clamp(18px,3vw,24px)", color: S.navy, fontWeight: 700, marginBottom: 16 }}>Page Not Found</h2>
            <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.7, marginBottom: 36 }}>
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
              <Btn primary onClick={() => setPage("Home")} style={{ background: S.coral, color: "#fff", fontSize: 15, padding: "14px 32px" }}>Go Home</Btn>
              <Btn onClick={() => setPage("Programmes")} style={{ fontSize: 14, border: "2px solid " + S.teal, color: S.teal }}>View Programmes</Btn>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", border: "1px solid " + S.border, textAlign: "left" }}>
              <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 14 }}>Popular Pages</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["Apply Now", "Apply", S.coral],
                  ["Fees & Calculator", "Fees & Calculator", S.teal],
                  ["Founding Cohort", "Founding Cohort", S.violet],
                  ["Contact Us", "Contact", S.emerald],
                  ["About CTS ETS", "About", S.sky],
                  ["Career Outcomes", "Careers", S.amber],
                ].map(([label, page, color]) => (
                  <button key={page} onClick={() => setPage(page)}
                    style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + S.border, background: "#fff", cursor: "pointer", textAlign: "left", fontFamily: S.body, fontSize: 13, color: S.navy, fontWeight: 500, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginTop: 24, lineHeight: 1.6 }}>
              Still can't find what you're looking for? <button onClick={() => setPage("Contact")} style={{ background: "none", border: "none", color: S.teal, cursor: "pointer", fontFamily: S.body, fontSize: 12, fontWeight: 700, padding: 0 }}>Contact us</button> or WhatsApp <strong>876-381-9771</strong>.
            </p>
          </div>
        </Reveal>
      </Container>
    </PageWrapper>
  );
}
