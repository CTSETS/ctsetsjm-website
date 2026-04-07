import { useMemo, useState } from "react";
import S from "../constants/styles";
import { FAQS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar } from "../components/shared/CoreComponents";

const QUICK_TOPICS = ["Application", "Payment", "Self-paced", "HEART", "Certification", "Support"];

function QuickTopic({ topic, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "10px 14px", borderRadius: 999, border: `1px solid ${active ? S.coral : S.border}`, background: active ? `${S.coral}12` : S.white, color: active ? S.coral : S.navy, fontFamily: S.body, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}>{topic}</button>;
}
function FAQItem({ faq, isOpen, onClick, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div style={{ marginBottom: 12, borderRadius: 18, border: `1px solid ${isOpen ? S.coral : S.border}`, overflow: "hidden", background: S.white, boxShadow: isOpen ? `0 14px 30px ${S.coral}14` : "0 8px 20px rgba(15,23,42,0.03)", transition: "all 0.22s ease" }}>
        <button onClick={onClick} style={{ width: "100%", padding: "20px 22px", border: "none", background: isOpen ? S.coral : S.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left", transition: "all 0.2s ease" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? S.white : S.navy, fontFamily: S.body, lineHeight: 1.55 }}>{faq.q}</span>
          <span style={{ fontSize: 20, color: isOpen ? S.white : S.gray, fontWeight: 700, flexShrink: 0, transition: "transform 0.22s ease", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
        </button>
        {isOpen && <div style={{ padding: "22px 22px 24px", background: S.white, borderTop: `1px solid ${S.coral}22`, fontSize: 14, color: S.gray, fontFamily: S.body, lineHeight: 1.82 }}>{faq.a}</div>}
      </div>
    </Reveal>
  );
}

export default function FAQPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [search]);

  return (
    <PageWrapper bg={S.lightBg}>
      <div style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E293B 58%, #0E8F8B 145%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, rgba(217,119,6,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.14), transparent 24%), radial-gradient(circle at 70% 80%, rgba(124,58,237,0.12), transparent 22%)" }} />
        <Container style={{ position: "relative", paddingTop: 60, paddingBottom: 54 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Help Centre</div>
            <h1 style={{ fontFamily: S.heading, fontSize: "clamp(36px, 6vw, 66px)", lineHeight: 1.04, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 860 }}>Frequently asked questions, organised more clearly</h1>
            <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 780, margin: "0 0 24px" }}>This keeps the same FAQ search and accordion behaviour from your current page, but presents it with stronger hierarchy, cleaner spacing, and a more premium support experience.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn primary onClick={() => setPage("Contact")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Contact Us</Btn>
              <Btn onClick={() => setPage("Apply")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>Start Application</Btn>
            </div>
          </Reveal>
        </Container>
      </div>
      <Container style={{ marginTop: -24, position: "relative", zIndex: 2 }}><Reveal><SocialProofBar /></Reveal></Container>
      <Container style={{ paddingTop: 26 }}>
        <SectionHeader tag="Support Centre" title="Search common questions before you reach out" desc="The original page already works. This redesign mainly improves how quickly visitors can scan, search, and decide whether they already have the answer." accentColor={S.coral} />
        <Reveal>
          <div style={{ maxWidth: 900, margin: "0 auto 18px", background: S.white, border: `1px solid ${S.border}`, borderRadius: 24, padding: "18px 18px 14px", boxShadow: "0 12px 28px rgba(15,23,42,0.04)" }}>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }} placeholder="Search questions... e.g. HEART, payment, self-paced, certificate" style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: `1px solid ${S.border}`, fontSize: 15, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", background: S.lightBg, marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {QUICK_TOPICS.map((topic) => <QuickTopic key={topic} topic={topic} active={search.trim().toLowerCase() === topic.toLowerCase()} onClick={() => { setSearch(topic); setOpenFaq(null); }} />)}
            </div>
          </div>
        </Reveal>

        <div style={{ maxWidth: 900, margin: "0 auto 18px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, fontWeight: 600 }}>{filtered.length} {filtered.length === 1 ? "question" : "questions"} found</div>
          {search && <button onClick={() => { setSearch(""); setOpenFaq(null); }} style={{ border: "none", background: "transparent", color: S.coral, fontFamily: S.body, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Clear search</button>}
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {filtered.length > 0 ? filtered.map((faq, i) => <FAQItem key={i} faq={faq} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} delay={i * 0.02} />) : (
            <Reveal>
              <div style={{ textAlign: "center", padding: "46px 28px", background: S.white, borderRadius: 22, border: `1px dashed ${S.border}`, boxShadow: "0 10px 24px rgba(15,23,42,0.03)" }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>🔍</div>
                <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.75, margin: "0 0 18px" }}>No questions match your search right now. Try different keywords or reach out directly.</p>
                <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 12, padding: "13px 24px" }}>Go to Contact Page</Btn>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal>
          <div style={{ marginTop: 54, borderRadius: 26, padding: "32px clamp(22px,4vw,38px)", background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 14px 34px rgba(15,23,42,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>Still Need Help?</div>
                <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,38px)", color: S.navy, margin: "0 0 10px", lineHeight: 1.1, fontWeight: 900 }}>Move from questions to action more easily</h2>
                <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, margin: 0, maxWidth: 620 }}>This closing section keeps the same purpose as the original page, but gives visitors clearer next steps after they finish searching.</p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
                <a href="https://wa.me/8763819771?text=Hi%2C%20I%20have%20a%20question%20about%20CTS%20ETS." target="_blank" rel="noopener noreferrer" style={{ padding: "14px 24px", borderRadius: 12, background: S.emerald, color: S.white, fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none", boxShadow: `0 12px 26px ${S.emerald}26` }}>WhatsApp Us</a>
                <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 12, padding: "14px 24px", border: `2px solid ${S.teal}`, color: S.teal }}>Contact Page</Btn>
              </div>
            </div>
          </div>
        </Reveal>
        <PageScripture page="contact" />
      </Container>
    </PageWrapper>
  );
}
