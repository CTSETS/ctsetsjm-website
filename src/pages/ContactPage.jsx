import { useState, useRef } from "react";
import S from "../constants/styles";
import { BOOKING_URLS } from "../constants/config";
import { FAQS } from "../constants/content";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, TalkToGraduate } from "../components/shared/CoreComponents";
import { CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
import { submitToAppsScript } from "../utils/submission";
import { trackContactFormSent, trackBookingClicked } from "../utils/analytics";
import { TrustSection } from "../components/trust/TrustElements";

export default function ContactPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [hp, setHp] = useState("");
  const start = useRef(Date.now());
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid rgba(1,30,64,0.15)", background: "#fff", fontSize: 14, fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 11, color: "#4A5568", fontWeight: 700, fontFamily: S.body, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 };

  const send = async () => {
    if (hp || Date.now() - start.current < 5000 || !captcha) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { alert("Please fill in name, email, and message."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { alert("Enter a valid email."); return; }
    setSending(true);
    try {
      await submitToAppsScript({ form_type: "Contact Enquiry", contactName: form.name, email: form.email, phone: form.phone || "N/A", subject: form.subject || "General", message: form.message }, {});
      trackContactFormSent(form.subject || "General");
      setSent(true);
    } catch { alert("Something went wrong. Try admin@ctsetsjm.com."); }
    finally { setSending(false); }
  };

  return (
    <PageWrapper>
      <SectionHeader tag="We're Here to Help" title="Get in Touch" desc="Email, call, WhatsApp, or book a free consultation." accentColor={S.sky} />
      <Container>
        {/* Contact cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 40 }} className="resp-grid-2">
          {[["📧","General Enquiries","admin@ctsetsjm.com","mailto:admin@ctsetsjm.com",S.teal],["📞","Call / WhatsApp","876-381-9771","tel:8763819771",S.coral],["📍","Visit Us","6, Newark Avenue, Kingston 2 (By Appointment Only)","https://maps.google.com/?q=6+Newark+Avenue+Kingston+2+Jamaica",S.violet]].map(([icon,label,value,href,color],i) => (
            <Reveal key={label} delay={i * 0.06}><a href={href} style={{ textDecoration: "none" }} target={label.includes("Visit") ? "_blank" : undefined} rel={label.includes("Visit") ? "noopener noreferrer" : undefined}><div style={{ background: "#fff", borderRadius: 10, padding: "28px 20px", textAlign: "center", border: "1px solid " + color + "20", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = "0 4px 16px " + color + "15"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = color + "20"; e.currentTarget.style.boxShadow = "none"; }}><div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div><div style={{ fontSize: 10, color, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, marginBottom: 6 }}>{label}</div><div style={{ fontSize: 15, color: S.navy, fontWeight: 700, fontFamily: S.body }}>{value}</div></div></a></Reveal>
          ))}
        </div>

        {/* Booking appointments */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>Book a Free Consultation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="resp-grid-2">
            {[{ icon: "🎓", title: "General Enquiry", desc: "Questions about getting started.", dur: "15 min", color: S.teal, url: BOOKING_URLS.general },{ icon: "💳", title: "Payment Help", desc: "Guidance on payment plans.", dur: "20 min", color: S.amber, url: BOOKING_URLS.payment },{ icon: "📚", title: "Academic Support", desc: "Coursework and assessment help.", dur: "30 min", color: S.violet, url: BOOKING_URLS.academic },{ icon: "👥", title: "Employer Consultation", desc: "Group enrolment and 15% discount.", dur: "30 min", color: S.coral, url: BOOKING_URLS.employer }].map((apt, i) => (
              <Reveal key={apt.title} delay={i * 0.08}><a href={apt.url} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClicked(apt.title)} style={{ textDecoration: "none" }}><div style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", border: "1px solid " + apt.color + "20", transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.borderColor = apt.color; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = apt.color + "20"; e.currentTarget.style.transform = "none"; }}><div style={{ fontSize: 28, marginBottom: 10 }}>{apt.icon}</div><div style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 700, color: S.navy, marginBottom: 6 }}>{apt.title}</div><p style={{ fontFamily: S.body, fontSize: 12, color: S.gray, marginBottom: 12 }}>{apt.desc}</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 700, color: apt.color, fontFamily: S.body, background: apt.color + "15", padding: "4px 10px", borderRadius: 6 }}>{apt.dur}</span><span style={{ fontSize: 12, color: apt.color, fontWeight: 700, fontFamily: S.body }}>Book →</span></div></div></a></Reveal>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div style={{ maxWidth: 640, margin: "0 auto 48px" }}>
          <h3 style={{ fontFamily: S.heading, fontSize: "clamp(20px,3vw,28px)", color: S.navy, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>Send Us a Message</h3>
          {sent ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "48px 32px", border: "1px solid " + S.emerald + "30", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.navy, marginBottom: 10 }}>Message Sent!</h3>
              <p style={{ fontFamily: S.body, fontSize: 14, color: "#4A5568", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 20px" }}>Thank you, <strong>{form.name}</strong>. We'll respond within 48–72 hours.</p>
              <Btn primary onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); setCaptcha(false); }} style={{ color: "#fff", background: S.teal }}>Send Another</Btn>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(24px,4vw,40px)", border: "1px solid " + S.border }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="resp-grid-2">
                <div><label style={lbl}>Full Name *</label><input style={inp} value={form.name} onChange={e => u("name", e.target.value)} placeholder="Your full name" /></div>
                <div><label style={lbl}>Email *</label><input type="email" style={inp} value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.com" /></div>
                <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={e => u("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" /></div>
                <div><label style={lbl}>Subject</label><select style={inp} value={form.subject} onChange={e => u("subject", e.target.value)}><option value="">Select topic</option>{["General Enquiry","Programme Info","Fees & Payment","Application Help","Employer / Group","Programmes","Technical Issue","Feedback"].map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 20 }}><label style={lbl}>Message *</label><textarea style={{ ...inp, minHeight: 120, resize: "vertical" }} value={form.message} onChange={e => u("message", e.target.value)} placeholder="How can we help?" /></div>
              <HoneypotField value={hp} onChange={e => setHp(e.target.value)} />
              <CaptchaChallenge onVerified={setCaptcha} verified={captcha} />
              <button onClick={send} disabled={sending || !captcha} style={{ width: "100%", padding: "16px", borderRadius: 10, background: (sending || !captcha) ? "#4A5568" : S.coral, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: (sending || !captcha) ? "wait" : "pointer", fontFamily: S.body, letterSpacing: 1, textTransform: "uppercase", opacity: (sending || !captcha) ? 0.6 : 1 }}>{sending ? "Sending..." : !captcha ? "Complete Verification" : "Send Message →"}</button>
            </div>
          )}
        </div>

        {/* FAQ */}
        <h3 style={{ fontFamily: S.heading, fontSize: "clamp(22px,3vw,30px)", color: S.navy, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>Frequently Asked Questions</h3>
        <div style={{ maxWidth: 760, margin: "0 auto 40px" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderRadius: 10, border: "1px solid " + S.border, marginBottom: 8, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "16px 20px", background: openFaq === i ? S.navy : "#fff", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: openFaq === i ? "#fff" : S.navy, fontFamily: S.body, textAlign: "left" }}>{faq.q}</span>
                <span style={{ fontSize: 16, color: openFaq === i ? S.coral : S.gray, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <div style={{ padding: "16px 20px", background: S.lightBg, fontSize: 14, color: "#2D3748", fontFamily: S.body, lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>

        <TalkToGraduate setPage={setPage} />
        <TrustSection />
        <PageScripture page="contact" />
      </Container>
    </PageWrapper>
  );
}
