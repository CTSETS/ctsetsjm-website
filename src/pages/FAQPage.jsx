import { useMemo, useState } from "react";
import S from "../constants/styles";
import { FAQS } from "../constants/content";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
  SocialProofBar,
} from "../components/shared/CoreComponents";

const QUICK_TOPICS = ["Application", "Payment", "Self-paced", "HEART", "Certification", "Support"];

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  support: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  advisor: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
};

function WideWrap({ children, style }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(18px, 3vw, 40px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionIntro({ tag, title, desc, accent = S.teal }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 0.82fr) minmax(320px, 1.18fr)",
        gap: 30,
        alignItems: "end",
        marginBottom: 28,
      }}
      className="resp-grid-2"
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            background: `${accent}12`,
            color: accent,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: S.body,
            marginBottom: 14,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(30px, 4vw, 48px)",
            lineHeight: 1.06,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 760,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 16,
          lineHeight: 1.85,
          color: S.gray,
          margin: 0,
          maxWidth: 860,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function QuickTopic({ topic, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 999,
        border: `1px solid ${active ? S.coral : S.border}`,
        background: active ? `${S.coral}12` : S.white,
        color: active ? S.coral : S.navy,
        fontFamily: S.body,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {topic}
    </button>
  );
}

function FAQItem({ faq, isOpen, onClick, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          marginBottom: 12,
          borderRadius: 18,
          border: `1px solid ${isOpen ? S.coral : S.border}`,
          overflow: "hidden",
          background: S.white,
          boxShadow: isOpen ? `0 14px 30px ${S.coral}14` : "0 8px 20px rgba(15,23,42,0.03)",
          transition: "all 0.22s ease",
        }}
      >
        <button
          onClick={onClick}
          style={{
            width: "100%",
            padding: "20px 22px",
            border: "none",
            background: isOpen ? S.coral : S.white,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? S.white : S.navy, fontFamily: S.body, lineHeight: 1.55 }}>{faq.q}</span>
          <span style={{ fontSize: 20, color: isOpen ? S.white : S.gray, fontWeight: 700, flexShrink: 0, transition: "transform 0.22s ease", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
        </button>
        {isOpen && <div style={{ padding: "22px 22px 24px", background: S.white, borderTop: `1px solid ${S.coral}22`, fontSize: 14, color: S.gray, fontFamily: S.body, lineHeight: 1.82 }}>{faq.a}</div>}
      </div>
    </Reveal>
  );
}

function HelpCard({ image, title, text, accent = S.teal }) {
  return (
    <div
      style={{
        background: S.white,
        border: `1px solid ${S.border}`,
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 14px 32px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ width: "100%", height: 220, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>
        <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontSize: 11, color: accent, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>Support Guidance</div>
      <div style={{ fontFamily: S.heading, fontSize: 26, color: S.navy, fontWeight: 800, marginBottom: 10, lineHeight: 1.1 }}>{title}</div>
      <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.8, margin: 0 }}>{text}</p>
    </div>
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
        <WideWrap style={{ position: "relative", paddingTop: 64, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)", gap: 34, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 18 }}>Help Centre</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(38px, 6vw, 70px)", lineHeight: 1.02, color: S.white, fontWeight: 900, margin: "0 0 18px", maxWidth: 940 }}>Find answers faster through a clearer support page</h1>
                <p style={{ fontFamily: S.body, fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.8, color: "rgba(255,255,255,0.82)", maxWidth: 860, margin: "0 0 24px" }}>Search common questions, jump to key topics, and move straight to contact or application when you are ready.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Contact")} style={{ background: S.gold, color: S.navy, borderRadius: 14, padding: "15px 26px", boxShadow: "0 16px 38px rgba(217,119,6,0.24)" }}>Contact Us</Btn>
                  <Btn onClick={() => setPage("Apply")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 14, padding: "15px 26px" }}>Start Application</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 26, padding: 18, backdropFilter: "blur(10px)", boxShadow: "0 20px 42px rgba(2,6,23,0.16)" }}>
                <div style={{ width: "100%", height: 420, borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
                  <img src={PEOPLE.hero} alt="Support team helping learners solve questions online" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🔎</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Search quickly</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, color: "#fff" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>💬</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: S.body }}>Move to real support</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </div>

      <WideWrap style={{ marginTop: -26, position: "relative", zIndex: 2 }}>
        <Reveal><SocialProofBar /></Reveal>
      </WideWrap>

      <section style={{ paddingTop: 34 }}>
        <WideWrap>
          <SectionIntro tag="Support Centre" title="Search common questions before you reach out" desc="The search and accordion behaviour stays the same. The page is simply wider, easier to scan, and more supportive in how it guides people to the answer they need." accent={S.coral} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.12fr) minmax(320px, 0.88fr)", gap: 24, alignItems: "start", marginBottom: 26 }} className="resp-grid-2">
            <div>
              <Reveal>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 24, padding: "18px 18px 14px", boxShadow: "0 12px 28px rgba(15,23,42,0.04)", marginBottom: 18 }}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }}
                    placeholder="Search questions... e.g. HEART, payment, self-paced, certificate"
                    style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: `1px solid ${S.border}`, fontSize: 15, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", background: S.lightBg, marginBottom: 14 }}
                  />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {QUICK_TOPICS.map((topic) => (
                      <QuickTopic key={topic} topic={topic} active={search.trim().toLowerCase() === topic.toLowerCase()} onClick={() => { setSearch(topic); setOpenFaq(null); }} />
                    ))}
                  </div>
                </div>
              </Reveal>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
                <div style={{ fontSize: 13, color: S.gray, fontFamily: S.body, fontWeight: 600 }}>{filtered.length} {filtered.length === 1 ? "question" : "questions"} found</div>
                {search && <button onClick={() => { setSearch(""); setOpenFaq(null); }} style={{ border: "none", background: "transparent", color: S.coral, fontFamily: S.body, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Clear search</button>}
              </div>

              <div>
                {filtered.length > 0 ? filtered.map((faq, i) => (
                  <FAQItem key={i} faq={faq} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} delay={i * 0.02} />
                )) : (
                  <Reveal>
                    <div style={{ textAlign: "center", padding: "46px 28px", background: S.white, borderRadius: 22, border: `1px dashed ${S.border}`, boxShadow: "0 10px 24px rgba(15,23,42,0.03)" }}>
                      <div style={{ fontSize: 42, marginBottom: 12 }}>🔍</div>
                      <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.75, margin: "0 0 18px" }}>No questions match your search right now. Try different keywords or reach out directly.</p>
                      <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 12, padding: "13px 24px" }}>Go to Contact Page</Btn>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <Reveal>
                <HelpCard image={PEOPLE.support} title="Most visitors just need one clear answer to keep moving" text="A stronger FAQ page helps visitors solve the small questions that often slow down application, payment, or enrolment decisions." accent={S.teal} />
              </Reveal>
              <Reveal delay={0.06}>
                <HelpCard image={PEOPLE.advisor} title="When the FAQ is not enough, the next step should feel obvious" text="Visitors should be able to move smoothly from questions into contact, WhatsApp, or application without feeling lost." accent={S.coral} />
              </Reveal>
            </div>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 20 }}>
        <WideWrap>
          <Reveal>
            <div style={{ marginTop: 20, borderRadius: 26, padding: "32px clamp(22px,4vw,38px)", background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 14px 34px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(260px, 0.9fr)", gap: 24, alignItems: "center" }} className="resp-grid-2">
                <div>
                  <div style={{ fontSize: 11, color: S.teal, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 12 }}>Still Need Help?</div>
                  <h2 style={{ fontFamily: S.heading, fontSize: "clamp(26px,4vw,38px)", color: S.navy, margin: "0 0 10px", lineHeight: 1.1, fontWeight: 900 }}>Move from questions to action more easily</h2>
                  <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray, lineHeight: 1.8, margin: 0, maxWidth: 620 }}>If your answer is not here, reach out directly or move forward with your next step on the site.</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
                  <a href="https://wa.me/8763819771?text=Hi%2C%20I%20have%20a%20question%20about%20CTS%20ETS." target="_blank" rel="noopener noreferrer" style={{ padding: "14px 24px", borderRadius: 12, background: S.emerald, color: S.white, fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none", boxShadow: `0 12px 26px ${S.emerald}26` }}>WhatsApp Us</a>
                  <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 12, padding: "14px 24px", border: `2px solid ${S.teal}`, color: S.teal }}>Contact Page</Btn>
                </div>
              </div>
            </div>
          </Reveal>
          <PageScripture page="contact" />
        </WideWrap>
      </section>
    </PageWrapper>
  );
}
