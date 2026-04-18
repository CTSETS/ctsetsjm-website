import React, { useState, useRef } from "react";
import S from "../constants/styles";
import { BOOKING_URLS, APPS_SCRIPT_URL } from "../constants/config";
import { FAQS } from "../constants/content";
import {
  PageWrapper,
  Btn,
  Reveal,
  PageScripture,
} from "../components/shared/CoreComponents";
import { CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
import { trackContactFormSent, trackBookingClicked } from "../utils/analytics";
import { TrustSection } from "../components/trust/TrustElements";

const PEOPLE = {
  hero: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  support: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  consultation: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
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
        gap: 14,
        alignItems: "end",
        marginBottom: 14,
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
            fontSize: "clamp(18px, 1.9vw, 22px)",
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

function ContactMethodCard({ icon, label, value, href, color, external }) {
  return (
    <a href={href} style={{ textDecoration: "none" }} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      <div
        style={{
          background: S.white,
          borderRadius: 18,
          padding: "16px 14px",
          border: `1px solid ${S.border}`,
          transition: "all 0.24s ease",
          boxShadow: "0 10px 22px rgba(15,23,42,0.04)",
          height: "100%",
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginBottom: 10 }}>
          {icon}
        </div>
        <div style={{ fontSize: 10, color, letterSpacing: 1.6, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: S.navy, fontWeight: 800, fontFamily: S.heading, lineHeight: 1.3 }}>
          {value}
        </div>
      </div>
    </a>
  );
}

function AppointmentCard({ apt }) {
  return (
    <a href={apt.url} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClicked(apt.title)} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: S.white,
          borderRadius: 16,
          padding: "16px 14px",
          border: `1px solid ${S.border}`,
          transition: "all 0.24s ease",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 12 }}>{apt.icon}</div>
        <div style={{ fontFamily: S.heading, fontSize: 13, fontWeight: 800, color: S.navy, marginBottom: 8 }}>{apt.title}</div>
        <p style={{ fontFamily: S.body, fontSize: 11, color: S.gray, marginBottom: 12, lineHeight: 1.7, flex: 1 }}>{apt.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${S.border}`, paddingTop: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: apt.color, fontFamily: S.body, background: `${apt.color}15`, padding: "6px 10px", borderRadius: 8 }}>{apt.dur}</span>
          <span style={{ fontSize: 12, color: apt.color, fontWeight: 700, fontFamily: S.body }}>Book Slot</span>
        </div>
      </div>
    </a>
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
          transition: "all 0.22s ease",
          boxShadow: isOpen ? `0 12px 24px ${S.coral}12` : "0 8px 18px rgba(15,23,42,0.03)",
        }}
      >
        <button
          onClick={onClick}
          style={{
            width: "100%",
            padding: "16px 18px",
            background: isOpen ? S.coral : S.white,
            border: "none",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            textAlign: "left",
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: isOpen ? S.white : S.navy, fontFamily: S.body, lineHeight: 1.5 }}>{faq.q}</span>
          <span style={{ fontSize: 18, color: isOpen ? S.white : S.coral, fontWeight: 400, flexShrink: 0, transition: "transform 0.25s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
        </button>
        {isOpen && <div style={{ padding: 12, background: S.white, fontSize: 13, color: S.gray, fontFamily: S.body, lineHeight: 1.75, borderTop: `1px solid ${S.coral}20` }}>{faq.a}</div>}
      </div>
    </Reveal>
  );
}

function SideSupportCard({ title, desc, img, accent = S.teal }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: 12, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
      <div style={{ width: "100%", height: 120, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
        <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontSize: 10, color: accent, letterSpacing: 1.6, textTransform: "uppercase", fontFamily: S.body, fontWeight: 800, marginBottom: 8 }}>Support Guidance</div>
      <div style={{ fontFamily: S.heading, fontSize: 14, color: S.navy, fontWeight: 800, marginBottom: 8, lineHeight: 1.1 }}>{title}</div>
      <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </div>
  );
}

export default function ContactPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [hp, setHp] = useState("");
  const start = useRef(Date.now());

  const u = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inp = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 10,
    border: `1px solid ${S.border}`,
    background: S.white,
    fontSize: 14,
    fontFamily: S.body,
    color: S.navy,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const lbl = {
    fontSize: 11,
    color: S.navy,
    fontWeight: 700,
    fontFamily: S.body,
    display: "block",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  };

  const filteredFaqs = search.trim()
    ? FAQS.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : FAQS;

  const send = async () => {
    if (hp || Date.now() - start.current < 5000 || !captcha) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill in your name, email, and a message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const payload = {
        action: "submitcontact",
        form_type: "Contact Enquiry",
        contactName: form.name,
        email: form.email,
        phone: form.phone || "N/A",
        subject: form.subject || "General",
        message: form.message,
        timestamp: new Date().toISOString(),
      };
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      trackContactFormSent(form.subject || "General");
      setSent(true);
    } catch {
      alert("Something went wrong. Please email us directly at admin@ctsetsjm.com.");
    } finally {
      setSending(false);
    }
  };

  const contactCards = [
    ["Email", "General Enquiries", "admin@ctsetsjm.com", "mailto:admin@ctsetsjm.com", S.teal, false],
    ["Call", "Call / WhatsApp", "876-381-9771", "tel:8763819771", S.coral, false],
    ["Visit", "Visit Us", "6 Newark Avenue, Kingston 2 (By Appointment)", "https://maps.google.com/?q=6+Newark+Avenue+Kingston+2+Jamaica", S.violet, true],
  ];

  const appointments = [
    { icon: "Guide", title: "General Enquiry", desc: "Questions about getting started, eligibility, or choosing the right path.", dur: "15 min", color: S.teal, url: BOOKING_URLS.general },
    { icon: "Fees", title: "Payment Help", desc: "Guidance on fees, staged payment options, and planning your enrolment.", dur: "20 min", color: S.amber, url: BOOKING_URLS.payment },
    { icon: "Study", title: "Academic Support", desc: "Support for learners who need clarity around coursework, assessments, or progress.", dur: "30 min", color: S.violet, url: BOOKING_URLS.academic },
    { icon: "Team", title: "Employer Consultation", desc: "For group enrolment, team training, and organisational learning support.", dur: "30 min", color: S.coral, url: BOOKING_URLS.employer },
  ];

  return (
    <PageWrapper bg={S.lightBg}>
      <section style={{ paddingTop: 12, paddingBottom: 14, background: "linear-gradient(135deg, #102543 0%, #17325B 55%, #244D74 100%)" }}>
        <WideWrap>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 0.92fr)", gap: 14, alignItems: "center" }} className="resp-grid-2">
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: S.body, fontSize: 11, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: S.goldLight, marginBottom: 14 }}>Contact CTS ETS</div>
                <h1 style={{ fontFamily: S.heading, fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.08, color: S.white, fontWeight: 900, margin: "0 0 12px", maxWidth: 640 }}>Get help, ask questions, or book time with the team.</h1>
                <p style={{ fontFamily: S.body, fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", maxWidth: 640, margin: "0 0 18px" }}>Reach out for programme guidance, payment clarification, academic support, employer discussions, or general enquiries through the contact path that suits you best.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setPage("Apply")} style={{ background: S.gold, color: S.navy, borderRadius: 10, padding: "10px 16px", boxShadow: "0 10px 20px rgba(196,145,18,0.18)" }}>Start Application</Btn>
                  <Btn onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: S.white, borderRadius: 10, padding: "10px 16px" }}>Support Options</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 8, boxShadow: "0 12px 26px rgba(2,6,23,0.12)" }}>
                <div style={{ width: "100%", height: 150, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
                  <img src={PEOPLE.hero} alt="Professional team supporting learners and enquiries" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 7, color: S.white }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, color: S.goldLight, fontWeight: 800, marginBottom: 6 }}>Support</div>
                    <div style={{ fontSize: 10, fontWeight: 700, fontFamily: S.body }}>Quick support paths</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 7, color: S.white }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.3, textTransform: "uppercase", fontFamily: S.body, color: S.goldLight, fontWeight: 800, marginBottom: 6 }}>Booking</div>
                    <div style={{ fontSize: 10, fontWeight: 700, fontFamily: S.body }}>Bookable consultations</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 12 }}>
        <WideWrap>
          <SectionIntro tag="Contact Options" title="Reach us in the way that fits you best" desc="" accent={S.teal} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18, marginBottom: 22 }} className="resp-grid-3">
            {contactCards.map(([icon, label, value, href, color, external]) => (
              <Reveal key={label}><ContactMethodCard icon={icon} label={label} value={value} href={href} color={color} external={external} /></Reveal>
            ))}
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 0 }}>
        <WideWrap>
          <SectionIntro tag="Consultations" title="Book a free conversation with the team" desc="Choose the appointment type that best matches your need, whether it is programme guidance, payment help, academic support, or employer consultation." accent={S.violet} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.9fr) minmax(0, 1.1fr)", gap: 14, alignItems: "stretch", marginBottom: 24 }} className="resp-grid-2">
            <Reveal>
              <SideSupportCard title="Sometimes the fastest answer is a scheduled conversation" desc="A short consultation can quickly move someone from uncertainty into action, especially when they are deciding on a programme, payment plan, or next step." img={PEOPLE.consultation} accent={S.coral} />
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }} className="resp-grid-2">
              {appointments.map((apt) => (
                <Reveal key={apt.title}><AppointmentCard apt={apt} /></Reveal>
              ))}
            </div>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 0 }}>
        <WideWrap>
          <SectionIntro tag="Message Us" title="Send a direct enquiry" desc="Use the contact form when you want written support, clarification, or a response from the team by email." accent={S.coral} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.88fr) minmax(0, 1.12fr)", gap: 14, alignItems: "start", marginBottom: 36 }} className="resp-grid-2">
            <div style={{ display: "grid", gap: 16 }}>
              <SideSupportCard title="A clearer contact experience makes it easier to finish the step" desc="When support options are visible and the form feels calm and well structured, more visitors complete their enquiry instead of dropping off." img={PEOPLE.support} accent={S.teal} />
              <div style={{ background: S.white, borderRadius: 18, padding: 12, border: `1px solid ${S.border}`, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    ["Response Time", "Usually within 48-72 hours", S.teal],
                    ["Best for", "General questions, clarification, or written support", S.violet],
                    ["Tip", "Include the programme name or issue for faster support", S.coral],
                  ].map(([label, text, color]) => (
                    <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 999, background: color, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, color: S.navy, fontWeight: 800, fontFamily: S.body, letterSpacing: 1.0, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 11, color: S.gray, fontFamily: S.body, lineHeight: 1.5 }}>{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Reveal>
              {sent ? (
                <div style={{ background: S.white, borderRadius: 20, padding: "40px 28px", border: `2px solid ${S.emerald}30`, textAlign: "center", boxShadow: `0 16px 34px ${S.emerald}15` }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: S.emeraldLight, color: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px" }}>OK</div>
                  <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.navy, margin: "0 0 10px", fontWeight: 800 }}>Message Sent</h3>
                  <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 22px" }}>Thank you, <strong>{form.name}</strong>. Your message has been received and the CTS ETS team will respond within 48-72 hours.</p>
                  <Btn primary onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); setCaptcha(false); }} style={{ color: S.white, background: S.emerald, padding: "14px 24px", borderRadius: 10 }}>Send Another Message</Btn>
                </div>
              ) : (
                <div style={{ background: S.white, borderRadius: 14, padding: "clamp(16px, 2.4vw, 20px)", border: `1px solid ${S.border}`, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={lbl}>Full Name *</label>
                      <input style={inp} value={form.name} onChange={(e) => u("name", e.target.value)} placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={lbl}>Email Address *</label>
                      <input type="email" style={inp} value={form.email} onChange={(e) => u("email", e.target.value)} placeholder="your@email.com" />
                    </div>
                    <div>
                      <label style={lbl}>Phone Number</label>
                      <input style={inp} value={form.phone} onChange={(e) => u("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" />
                    </div>
                    <div>
                      <label style={lbl}>Subject</label>
                      <select style={{ ...inp, cursor: "pointer" }} value={form.subject} onChange={(e) => u("subject", e.target.value)}>
                        <option value="">Select topic</option>
                        {["General Enquiry", "Programme Info", "Fees & Payment", "Application Help", "Employer / Group", "Technical Issue", "Feedback"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>Your Message *</label>
                    <textarea style={{ ...inp, minHeight: 100, resize: "vertical", paddingTop: 14 }} value={form.message} onChange={(e) => u("message", e.target.value)} placeholder="How can we help you today?" />
                  </div>
                  <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />
                  <div style={{ marginBottom: 20 }}><CaptchaChallenge onVerified={setCaptcha} verified={captcha} /></div>
                  <button onClick={send} disabled={sending || !captcha} style={{ width: "100%", padding: 12, borderRadius: 10, background: sending || !captcha ? S.border : S.coral, color: sending || !captcha ? S.grayLight : S.white, border: "none", fontSize: 13, fontWeight: 800, cursor: sending || !captcha ? "not-allowed" : "pointer", fontFamily: S.body, transition: "0.2s", boxShadow: sending || !captcha ? "none" : `0 8px 20px ${S.coral}30` }}>{sending ? "Sending Message..." : !captcha ? "Complete Verification to Send" : "Send Message"}</button>
                </div>
              )}
            </Reveal>
          </div>
        </WideWrap>
      </section>

      <section style={{ paddingTop: 0 }}>
        <WideWrap>
          <SectionIntro tag="Knowledge Base" title="Search frequently asked questions" desc="Search the FAQ content more easily and expand the answer you need without leaving the page." accent={S.teal} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(280px, 0.92fr)", gap: 18, alignItems: "start", marginBottom: 36 }} className="resp-grid-2">
            <div>
              <div style={{ marginBottom: 16 }}>
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }} placeholder="Search questions... e.g. payment, self-paced, application" style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", background: S.white, boxShadow: "0 8px 18px rgba(15,23,42,0.03)" }} />
                {search && <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, marginTop: 8, fontWeight: 600 }}>{filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"} found</div>}
              </div>
              <div>
                {filteredFaqs.length > 0
                  ? filteredFaqs.map((faq, i) => <FAQItem key={i} faq={faq} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} delay={i * 0.02} />)
                  : <div style={{ textAlign: "center", padding: "34px 22px", background: S.white, borderRadius: 16, border: `1px dashed ${S.border}` }}><div style={{ fontSize: 14, fontFamily: S.body, fontWeight: 700, color: S.navy, marginBottom: 8 }}>No matching questions found.</div><p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.7, margin: 0 }}>Try different keywords or send a direct message above.</p></div>}
              </div>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <SideSupportCard title="Many questions can be resolved faster through the right answer path" desc="Visitors often need quick clarity on fees, applications, self-paced study, or support. A well-structured FAQ section helps reduce friction and build trust." img={PEOPLE.consultation} accent={S.violet} />
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, padding: 12, boxShadow: "0 10px 22px rgba(15,23,42,0.04)" }}>
                <div style={{ fontFamily: S.heading, fontSize: 14, color: S.navy, fontWeight: 800, marginBottom: 8 }}>Still need help?</div>
                <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.75, marginBottom: 12 }}>If you cannot find the answer here, send a message or book a conversation with the team.</p>
                <Btn onClick={() => setPage("Apply")} style={{ borderRadius: 10, border: `1px solid ${S.teal}`, color: S.teal }}>Go to Application</Btn>
              </div>
            </div>
          </div>

          <TrustSection />
          <PageScripture page="contact" />
        </WideWrap>
      </section>
    </PageWrapper>
  );
}





