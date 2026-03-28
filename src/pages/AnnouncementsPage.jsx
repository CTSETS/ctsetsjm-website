import S from "../constants/styles";
import { ANNOUNCEMENTS } from "../constants/content";
import { Container, PageWrapper, SectionHeader, Reveal } from "../components/shared/CoreComponents";

export default function AnnouncementsPage({ setPage }) {
  const typeColors = { intake: S.coral, offer: S.gold, feature: S.teal, milestone: S.violet };
  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="What's New" title="Updates & Announcements" desc="Intakes, offers, and news from CTS ETS." accentColor={S.amber} />
      <Container>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {ANNOUNCEMENTS.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid " + S.border, borderLeft: "4px solid " + (typeColors[a.type] || S.gold), marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: typeColors[a.type] || S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700 }}>{a.type}</span>
                  <span style={{ fontSize: 11, color: S.grayLight, fontFamily: S.body }}>{a.date}</span>
                </div>
                <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 700, marginBottom: 10 }}>{a.title}</h3>
                <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, marginBottom: 16 }}>{a.body}</p>
                <button onClick={() => setPage(a.ctaPage)} style={{ background: typeColors[a.type] || S.gold, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.body }}>{a.cta} →</button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </PageWrapper>
  );
}
