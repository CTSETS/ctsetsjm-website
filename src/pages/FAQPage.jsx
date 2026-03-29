import { useState } from "react";
import S from "../constants/styles";
import { FAQS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";

export default function FAQPage({ setPage }) {
  var [openFaq, setOpenFaq] = useState(null);
  var [search, setSearch] = useState("");

  var filtered = search.trim()
    ? FAQS.filter(function(f) { var q = search.toLowerCase(); return f.q.toLowerCase().indexOf(q) >= 0 || f.a.toLowerCase().indexOf(q) >= 0; })
    : FAQS;

  return (
    <PageWrapper>
      <SectionHeader tag="Help Centre" title="Frequently Asked Questions" desc="Everything you need to know about studying with CTS ETS — from HEART comparisons to payment plans." accentColor={S.coral} />
      <Container>
        {/* Search */}
        <div style={{ maxWidth: 560, margin: "0 auto 40px" }}>
          <input type="text" value={search} onChange={function(e) { setSearch(e.target.value); setOpenFaq(null); }}
            placeholder="Search questions... e.g. 'HEART', 'payment', 'self-paced'"
            style={{ width: "100%", padding: "14px 20px", borderRadius: 10, border: "2px solid " + S.border, fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", background: "#fff" }} />
          {search && <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 8, textAlign: "center" }}>{filtered.length + " question" + (filtered.length !== 1 ? "s" : "") + " found"}</div>}
        </div>

        {/* FAQ accordion */}
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {filtered.map(function(faq, i) {
            var isOpen = openFaq === i;
            return (
              <Reveal key={i} delay={i * 0.03}>
                <div style={{ marginBottom: 8 }}>
                  <button onClick={function() { setOpenFaq(isOpen ? null : i); }}
                    style={{ width: "100%", padding: "16px 20px", borderRadius: isOpen ? "12px 12px 0 0" : 12, border: "1px solid " + (isOpen ? S.coral + "40" : S.border), borderBottom: isOpen ? "none" : "1px solid " + S.border, background: isOpen ? S.coral : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", transition: "all 0.2s" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isOpen ? "#fff" : S.navy, fontFamily: S.body }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: isOpen ? "#fff" : S.gray, fontWeight: 700, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "18px 20px", background: "#fff", border: "1px solid " + S.coral + "40", borderTop: "none", borderRadius: "0 0 12px 12px", fontSize: 14, color: "#2D3748", fontFamily: S.body, lineHeight: 1.75 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontFamily: S.body, fontSize: 15, color: S.gray }}>No questions match your search. Try different keywords.</p>
          </div>
        )}

        {/* Still have questions */}
        <Reveal>
          <div style={{ textAlign: "center", marginTop: 48, padding: "32px", borderRadius: 16, background: S.lightBg, border: "1px solid " + S.border }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, fontWeight: 700, marginBottom: 10 }}>Still Have Questions?</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.7, marginBottom: 20 }}>We respond within 48–72 hours. WhatsApp is usually fastest.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://wa.me/8763819771?text=Hi%2C%20I%20have%20a%20question%20about%20CTS%20ETS." target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", borderRadius: 8, background: S.emerald, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>WhatsApp Us</a>
              <Btn onClick={function() { setPage("Contact"); }} style={{ border: "2px solid " + S.teal, color: S.teal }}>Contact Page</Btn>
            </div>
          </div>
        </Reveal>

        <PageScripture page="contact" />
      </Container>
    </PageWrapper>
  );
}
