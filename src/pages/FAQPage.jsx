import { useMemo, useState } from "react";
import S from "../constants/styles";
import { FAQS } from "../constants/content";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
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
        gridTemplateColumns: "minmax(240px, 0.8fr) minmax(320px, 1.2fr)",
        gap: 20,
        alignItems: "end",
        marginBottom: 22,
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
            marginBottom: 12,
          }}
        >
          {tag}
        </div>
        <h2
          style={{
            fontFamily: S.heading,
            fontSize: "clamp(22px, 2.6vw, 30px)",
            lineHeight: 1.1,
            color: S.navy,
            margin: 0,
            fontWeight: 900,
            maxWidth: 700,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          fontFamily: S.body,
          fontSize: 14,
          lineHeight: 1.75,
          color: S.gray,
          margin: 0,
          maxWidth: 720,
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
        padding: "9px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? S.coral : S.border}`,
        background: active ? `${S.coral}12` : S.white,
        color: active ? S.coral : S.navy,
        fontFamily: S.body,
        fontSize: 12,
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
          marginBottom: 10,
          borderRadius: 16,
          border: `1px solid ${isOpen ? S.coral : S.border}`,
          overflow: "hidden",
          background: S.white,
          boxShadow: isOpen ? `0 12px 24px ${S.coral}12` : "0 8px 18px rgba(15,23,42,0.03)",
          transition: "all 0.22s ease",
        }}
      >
        <button
          onClick={onClick}
          style={{
            width: "100%",
            padding: "16px 18px",
            border: "none",
            background: isOpen ? S.coral : S.white,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: isOpen ? S.white : S.navy, fontFamily: S.body, lineHeight: 1.5 }}>{faq.q}</span>
          <span style={{ fontSize: 18, color: isOpen ? S.white : S.gray, fontWeight: 700, flexShrink: 0, transition: "transform 0.22s ease", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
        </button>
        {isOpen && <div style={{ padding: "18px 18px 20px", background: S.white, borderTop: `1px solid ${S.coral}22`, fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.75 }}>{faq.a}</div>}
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
        borderRadius: 18,
        padding: 14,
        boxShadow: "0 10px 22px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ width: "100%", height: 170, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
        <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontSize: 10, color: accent, letterSpacing: 1.6, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Support Guidance</div>
      <div style={{ fontFamily: S.heading, fontSize: 18, color: S.navy, fontWeight: 800, marginBottom: 8, lineHeight: 1.1 }}>{title}</div>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: 0 }}>{text}</p>
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
      <section style={{ paddingTop: 30, paddingBottom: 18, background: "linear-gradient(135deg, #102543 0%, #17325B 55%, #244D74 100%)" }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 0.92fr)", gap: 18, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 14 }}>Help Centre</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.08, color: S.white, fontWeight: 900, margin: "0 0 12px", maxWidth: 640 }}>Find answers faster through a clearer support page.</h1>
                <p style={{ fontFamily: S.body, fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.82)", maxWidth: 640, margin: "0 0 18px" }}>Search common questions, jump to key topics, and move straight to contact or application when you are ready.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Contact")} style={{ background: S.gold, color: S.navy, borderRadius: 10, padding: "12px 20px", boxShadow: "0 10px 20px rgba(196,145,18,0.18)" }}>Contact Us</Btn>
                  <Btn onClick={() => setPage("Apply")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 10, padding: "12px 20px" }}>Start Application</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 12, boxShadow: "0 12px 26px rgba(2,6,23,0.12)" }}>
                <div style={{ width: "100%", height: 210, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
                  <img src={PEOPLE.hero} alt="Support team helping learners solve questions online" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, color: S.white }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, color: S.goldLight, fontWeight: 800, marginBottom: 6 }}>Search</div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: S.body }}>Find answers more quickly</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, color: S.white }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, color: S.goldLight, fontWeight: 800, marginBottom: 6 }}>Support</div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: S.body }}>Move from questions to the next step</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 24 }}>
        <WideWrap>
          <SectionIntro tag="Support Centre" title="Search common questions before you reach out" desc="" accent={S.coral} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)", gap: 18, alignItems: "start", marginBottom: 22 }} className="resp-grid-2">
            <div>
              <Reveal>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: "14px 14px 12px", boxShadow: "0 10px 22px rgba(15,23,42,0.04)", marginBottom: 16 }}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }}
                    placeholder="Search questions... e.g. HEART, payment, self-paced, certificate"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", background: S.lightBg, marginBottom: 12 }}
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {QUICK_TOPICS.map((topic) => (
                      <QuickTopic key={topic} topic={topic} active={search.trim().toLowerCase() === topic.toLowerCase()} onClick={() => { setSearch(topic); setOpenFaq(null); }} />
                    ))}
                  </div>
                </div>
              </Reveal>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, fontWeight: 600 }}>{filtered.length} {filtered.length === 1 ? "question" : "questions"} found</div>
                {search && <button onClick={() => { setSearch(""); setOpenFaq(null); }} style={{ border: "none", background: "transparent", color: S.coral, fontFamily: S.body, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Clear search</button>}
              </div>

              <div>
                {filtered.length > 0 ? filtered.map((faq, i) => (
                  <FAQItem key={i} faq={faq} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} delay={i * 0.02} />
                )) : (
                  <Reveal>
                    <div style={{ textAlign: "center", padding: "36px 24px", background: S.white, borderRadius: 18, border: `1px dashed ${S.border}`, boxShadow: "0 10px 22px rgba(15,23,42,0.03)" }}>
                      <div style={{ fontSize: 15, color: S.navy, fontFamily: S.body, fontWeight: 700, marginBottom: 10 }}>No matching questions found.</div>
                      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: "0 0 16px" }}>Try different keywords or reach out directly if you still need help.</p>
                      <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 10, padding: "12px 20px" }}>Go to Contact Page</Btn>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>


          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 18 }}>
        <WideWrap>
          <Reveal>
            <div style={{ marginTop: 18, borderRadius: 20, padding: "24px clamp(18px,4vw,30px)", background: S.white, border: `1px solid ${S.border}`, boxShadow: "0 12px 26px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(240px, 0.92fr)", gap: 18, alignItems: "center" }} className="resp-grid-2">
                <div>
                  <div style={{ fontSize: 10, color: S.teal, letterSpacing: 1.8, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 10 }}>Still Need Help?</div>
                  <h2 style={{ fontFamily: S.heading, fontSize: "clamp(20px,2.6vw,28px)", color: S.navy, margin: "0 0 8px", lineHeight: 1.1, fontWeight: 900 }}>Move from questions to action more easily</h2>
                  <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: 0, maxWidth: 560 }}>If your answer is not here, reach out directly or move forward with your next step on the site.</p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-start" }}>
                  <a href="https://wa.me/8763819771?text=Hi%2C%20I%20have%20a%20question%20about%20CTS%20ETS." target="_blank" rel="noopener noreferrer" style={{ padding: "12px 20px", borderRadius: 10, background: S.emerald, color: S.white, fontSize: 13, fontWeight: 700, fontFamily: S.body, textDecoration: "none", boxShadow: `0 10px 20px ${S.emerald}22` }}>WhatsApp Us</a>
                  <Btn onClick={() => setPage("Contact")} style={{ borderRadius: 10, padding: "12px 20px", border: `1px solid ${S.teal}`, color: S.teal }}>Contact Page</Btn>
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


