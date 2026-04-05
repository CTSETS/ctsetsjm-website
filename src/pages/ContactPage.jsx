import React, { useState, useRef } from "react";
import S from "../constants/styles";
import { BOOKING_URLS, APPS_SCRIPT_URL } from "../constants/config"; //
import { FAQS } from "../constants/content"; //
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
import { trackContactFormSent, trackBookingClicked } from "../utils/analytics"; //
import { TrustSection } from "../components/trust/TrustElements"; //

export default function ContactPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [hp, setHp] = useState("");
  const [hoverCard, setHoverCard] = useState(null);
  const start = useRef(Date.now());

  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const inp = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: `1px solid ${S.border}`, background: S.white, fontSize: "15px", fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
  const lbl = { fontSize: "12px", color: S.navy, fontWeight: "700", fontFamily: S.body, display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" };

  const filteredFaqs = search.trim()
    ? FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : FAQS; //

  const send = async () => {
    if (hp || Date.now() - start.current < 5000 || !captcha) return; //
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
      // Secure submission via Proxy
      const payload = {
        action: "submitcontact",
        form_type: "Contact Enquiry",
        contactName: form.name,
        email: form.email,
        phone: form.phone || "N/A",
        subject: form.subject || "General",
        message: form.message,
        timestamp: new Date().toISOString()
      };

      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      trackContactFormSent(form.subject || "General"); //
      setSent(true);
    } catch { 
      alert("Something went wrong. Please email us directly at admin@ctsetsjm.com."); 
    } finally { 
      setSending(false); 
    }
  };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader 
        tag="We're Here to Help" 
        title="Get in Touch" 
        desc="Email, call, WhatsApp, or book a free video consultation with our team." 
        accentColor={S.sky} 
      />
      <Container>
        
        {/* ─── CONTACT CARDS ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "60px", marginTop: "20px" }}>
          {[
            ["📧", "General Enquiries", "admin@ctsetsjm.com", "mailto:admin@ctsetsjm.com", S.teal],
            ["📞", "Call / WhatsApp", "876-381-9771", "tel:8763819771", S.coral],
            ["📍", "Visit Us", "6, Newark Avenue, Kingston 2 (By Appt.)", "https://maps.google.com/?q=6+Newark+Avenue+Kingston+2+Jamaica", S.violet]
          ].map(([icon, label, value, href, color], i) => ( //
            <Reveal key={label} delay={i * 0.05}>
              <a href={href} style={{ textDecoration: "none" }} target={label.includes("Visit") ? "_blank" : undefined} rel={label.includes("Visit") ? "noopener noreferrer" : undefined}>
                <div 
                  onMouseEnter={() => setHoverCard(label)}
                  onMouseLeave={() => setHoverCard(null)}
                  style={{ background: S.white, borderRadius: "20px", padding: "36px 24px", textAlign: "center", border: `1px solid ${hoverCard === label ? color : S.border}`, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: hoverCard === label ? `0 15px 30px ${color}15` : "0 4px 10px rgba(0,0,0,0.02)", transform: hoverCard === label ? "translateY(-5px)" : "none" }}
                >
                  <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px" }}>{icon}</div>
                  <div style={{ fontSize: "11px", color: color, letterSpacing: "2px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "800", marginBottom: "8px" }}>{label}</div>
                  <div style={{ fontSize: "16px", color: S.navy, fontWeight: "700", fontFamily: S.heading }}>{value}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* ─── BOOKING APPOINTMENTS ─── */}
        <div style={{ marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ fontSize: "12px", color: S.violet, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "700" }}>Speak With Us</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 36px)", color: S.navy, margin: "12px 0 0", fontWeight: "800" }}>Book a Free Consultation</h3>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { icon: "🎓", title: "General Enquiry", desc: "Questions about getting started.", dur: "15 min", color: S.teal, url: BOOKING_URLS.general }, //
              { icon: "💳", title: "Payment Help", desc: "Guidance on payment plans.", dur: "20 min", color: S.amber, url: BOOKING_URLS.payment }, //
              { icon: "📚", title: "Academic Support", desc: "Coursework and assessment help.", dur: "30 min", color: S.violet, url: BOOKING_URLS.academic }, //
              { icon: "👥", title: "Employer Consultation", desc: "Group enrolment and discounts.", dur: "30 min", color: S.coral, url: BOOKING_URLS.employer } //
            ].map((apt, i) => (
              <Reveal key={apt.title} delay={i * 0.08}>
                <a href={apt.url} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClicked(apt.title)} style={{ textDecoration: "none" }}>
                  <div 
                    onMouseEnter={() => setHoverCard(apt.title)}
                    onMouseLeave={() => setHoverCard(null)}
                    style={{ background: S.white, borderRadius: "16px", padding: "28px 24px", border: `1px solid ${hoverCard === apt.title ? apt.color : S.border}`, transition: "all 0.3s", cursor: "pointer", boxShadow: hoverCard === apt.title ? `0 10px 25px ${apt.color}15` : "0 4px 6px rgba(0,0,0,0.02)", transform: hoverCard === apt.title ? "translateY(-4px)" : "none", display: "flex", flexDirection: "column", height: "100%" }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "16px" }}>{apt.icon}</div>
                    <div style={{ fontFamily: S.heading, fontSize: "18px", fontWeight: "700", color: S.navy, marginBottom: "8px" }}>{apt.title}</div>
                    <p style={{ fontFamily: S.body, fontSize: "13px", color: S.gray, marginBottom: "20px", lineHeight: "1.6", flex: 1 }}>{apt.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${S.border}`, paddingTop: "16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: apt.color, fontFamily: S.body, background: `${apt.color}15`, padding: "6px 12px", borderRadius: "8px" }}>{apt.dur}</span>
                      <span style={{ fontSize: "13px", color: apt.color, fontWeight: "700", fontFamily: S.body }}>Book Slot →</span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ─── CONTACT FORM ─── */}
        <div style={{ maxWidth: "700px", margin: "0 auto 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 36px)", color: S.navy, margin: 0, fontWeight: "800" }}>Send Us a Message</h3>
          </div>
          
          {sent ? ( //
            <div style={{ background: S.white, borderRadius: "24px", padding: "60px 40px", border: `2px solid ${S.emerald}30`, textAlign: "center", boxShadow: `0 15px 40px ${S.emerald}15` }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: S.emeraldLight, color: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", margin: "0 auto 24px" }}>✓</div>
              <h3 style={{ fontFamily: S.heading, fontSize: "28px", color: S.navy, marginBottom: "12px" }}>Message Sent!</h3>
              <p style={{ fontFamily: S.body, fontSize: "15px", color: S.gray, lineHeight: "1.7", maxWidth: "450px", margin: "0 auto 32px" }}>Thank you, <strong>{form.name}</strong>. Our team has received your message and will respond within 48–72 hours.</p>
              <Btn primary onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); setCaptcha(false); }} style={{ color: S.white, background: S.emerald, padding: "16px 32px" }}>Send Another Message</Btn>
            </div>
          ) : (
            <div style={{ background: S.white, borderRadius: "24px", padding: "clamp(30px, 5vw, 50px)", border: `1px solid ${S.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
                <div><label style={lbl}>Full Name *</label><input style={inp} value={form.name} onChange={e => u("name", e.target.value)} placeholder="Your full name" /></div>
                <div><label style={lbl}>Email Address *</label><input type="email" style={inp} value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.com" /></div>
                <div><label style={lbl}>Phone Number</label><input style={inp} value={form.phone} onChange={e => u("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Optional" /></div>
                <div>
                  <label style={lbl}>Subject</label>
                  <select style={{...inp, cursor: "pointer"}} value={form.subject} onChange={e => u("subject", e.target.value)}>
                    <option value="">Select topic</option>
                    {["General Enquiry","Programme Info","Fees & Payment","Application Help","Employer / Group","Technical Issue","Feedback"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "32px" }}>
                <label style={lbl}>Your Message *</label>
                <textarea style={{ ...inp, minHeight: "150px", resize: "vertical", paddingTop: "16px" }} value={form.message} onChange={e => u("message", e.target.value)} placeholder="How can we help you today?" />
              </div>
              
              <HoneypotField value={hp} onChange={e => setHp(e.target.value)} /> {/* */}
              <div style={{ marginBottom: "24px" }}>
                <CaptchaChallenge onVerified={setCaptcha} verified={captcha} /> {/* */}
              </div>
              
              <button 
                onClick={send} 
                disabled={sending || !captcha} 
                style={{ width: "100%", padding: "18px", borderRadius: "12px", background: (sending || !captcha) ? S.border : S.coral, color: (sending || !captcha) ? S.grayLight : S.white, border: "none", fontSize: "16px", fontWeight: "800", cursor: (sending || !captcha) ? "not-allowed" : "pointer", fontFamily: S.body, transition: "0.2s", boxShadow: (sending || !captcha) ? "none" : `0 8px 20px ${S.coral}40` }}
              >
                {sending ? "Sending Message..." : !captcha ? "Complete Verification to Send" : "Send Message →"}
              </button>
            </div>
          )}
        </div>

        {/* ─── FAQ ACCORDION ─── */}
        <div style={{ marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ fontSize: "12px", color: S.teal, letterSpacing: "3px", textTransform: "uppercase", fontFamily: S.body, fontWeight: "700" }}>Knowledge Base</span>
            <h3 style={{ fontFamily: S.heading, fontSize: "clamp(26px, 4vw, 36px)", color: S.navy, margin: "12px 0 24px", fontWeight: "800" }}>Frequently Asked Questions</h3>
            
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
              <input 
                type="text" 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }}
                placeholder="Search questions... e.g. 'payment', 'self-paced'"
                style={{ width: "100%", padding: "16px 24px", borderRadius: "30px", border: `2px solid ${S.border}`, fontSize: "15px", fontFamily: S.body, color: S.navy, outline: "none", boxSizing: "border-box", background: S.white, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }} 
              />
              {search && <div style={{ fontSize: "13px", color: S.gray, fontFamily: S.body, marginTop: "12px", fontWeight: "600" }}>{filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"} found</div>}
            </div>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => { //
              const isOpen = openFaq === i;
              return (
                <Reveal key={i} delay={i * 0.02}>
                  <div style={{ marginBottom: "12px", borderRadius: "16px", border: `1px solid ${isOpen ? S.coral : S.border}`, overflow: "hidden", background: S.white, transition: "all 0.2s", boxShadow: isOpen ? `0 10px 20px ${S.coral}15` : "none" }}>
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      style={{ width: "100%", padding: "20px 24px", background: isOpen ? S.coral : S.white, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", textAlign: "left", transition: "all 0.2s" }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: "700", color: isOpen ? S.white : S.navy, fontFamily: S.body }}>{faq.q}</span>
                      <span style={{ fontSize: "20px", color: isOpen ? S.white : S.coral, fontWeight: "400", flexShrink: 0, transition: "transform 0.3s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "24px", background: S.white, fontSize: "14px", color: S.gray, fontFamily: S.body, lineHeight: "1.8", borderTop: `1px solid ${S.coral}20` }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            }) : (
              <div style={{ textAlign: "center", padding: "40px", background: S.white, borderRadius: "16px", border: `1px dashed ${S.border}` }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
                <p style={{ fontFamily: S.body, fontSize: "15px", color: S.gray }}>No questions match your search. Try different keywords or send us a message above.</p>
              </div>
            )}
          </div>
        </div>

        <TrustSection /> {/* */}
        <PageScripture page="contact" /> {/* */}
      </Container>
    </PageWrapper>
  );
}