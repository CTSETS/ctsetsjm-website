// ─── EMAIL SERVICE ──────────────────────────────────────────────────
// Primary: Brevo (free 300/day) for transactional + drip emails
// Fallback: EmailJS for form notifications
// Drip: 4-email sequence triggered after application submission

import { APPS_SCRIPT_URL, EMAILJS_SERVICE, EMAILJS_TEMPLATE } from "../constants/config";

// ── BREVO (Sendinblue) TRANSACTIONAL API ──
// Sign up free at https://www.brevo.com — 300 emails/day free
// Get your API key from: Settings → SMTP & API → API Keys
const BREVO_API_KEY = import.meta.env.VITE_BREVO_KEY || "";
// Sender — MUST be verified in Brevo Dashboard → Settings → Senders & IPs
// Option 1: Use admin@ctsetsjm.com (verify your domain in Brevo)
// Option 2: Use the email you signed up to Brevo with (already verified)
const BREVO_SENDER = { name: "CTS ETS", email: "admin@ctsetsjm.com" };
const BREVO_ENABLED = !!BREVO_API_KEY;

// Send email via Brevo API
export const sendBrevoEmail = async ({ to, toName, subject, htmlContent, textContent }) => {
  if (!BREVO_ENABLED) return { success: false, reason: "brevo_not_configured" };
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "accept": "application/json", "content-type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({
        sender: BREVO_SENDER,
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent: htmlContent || `<p>${textContent}</p>`,
        textContent: textContent || "",
      }),
    });
    return { success: res.ok };
  } catch (err) {
    console.error("Brevo email error:", err);
    return { success: false };
  }
};

// Send email via EmailJS (fallback)
export const sendEmailJS = async ({ templateParams }) => {
  if (!window.emailjs) return { success: false, reason: "emailjs_not_loaded" };
  try {
    await window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams);
    return { success: true };
  } catch (err) {
    console.error("EmailJS error:", err);
    return { success: false };
  }
};

// ── UNIFIED SEND — tries Brevo first, falls back to EmailJS ──
export const sendEmail = async ({ to, toName, subject, htmlContent, textContent, emailjsParams }) => {
  // Try Brevo first
  const brevoResult = await sendBrevoEmail({ to, toName, subject, htmlContent, textContent });
  if (brevoResult.success) return brevoResult;
  // Fallback to EmailJS
  if (emailjsParams) return sendEmailJS({ templateParams: emailjsParams });
  return { success: false, reason: "all_methods_failed" };
};

// ── APPLICATION CONFIRMATION EMAIL ──
export const sendApplicationConfirmation = async ({ name, email, ref, programme, level }) => {
  const subject = `CTS ETS — Application Received (${ref})`;
  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #011E40; padding: 24px 32px; text-align: center;">
        <h1 style="color: #D4A017; font-size: 22px; margin: 0;">CTS Empowerment & Training Solutions</h1>
        <p style="color: rgba(255,255,255,0.6); font-size: 11px; margin: 4px 0 0; letter-spacing: 2px;">CALLED TO SERVE — EXCELLENCE THROUGH SERVICE</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #011E40; font-size: 20px;">Application Received, ${name}!</h2>
        <p style="color: #4A5568; line-height: 1.7;">Thank you for applying to CTS ETS. Your application is now under review.</p>
        <div style="background: #FAFAF7; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A017;">
          <p style="margin: 0 0 8px;"><strong>Reference:</strong> ${ref}</p>
          <p style="margin: 0 0 8px;"><strong>Programme:</strong> ${level} — ${programme}</p>
          <p style="margin: 0;"><strong>Status:</strong> Under Review</p>
        </div>
        <h3 style="color: #011E40; font-size: 16px;">What Happens Next?</h3>
        <ol style="color: #4A5568; line-height: 1.8;">
          <li>Our admissions team reviews your documents (48–72 hours)</li>
          <li>You receive an acceptance email with payment instructions</li>
          <li>Complete payment within 48 hours to secure your place</li>
          <li>Receive Learning Portal access and start studying</li>
        </ol>
        <p style="color: #4A5568; line-height: 1.7;">Questions? Reply to this email or WhatsApp us at <strong>876-381-9771</strong>.</p>
      </div>
      <div style="background: #011E40; padding: 16px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">CTS ETS | ctsetsjm.com | admin@ctsetsjm.com | 876-381-9771</p>
      </div>
    </div>`;
  return sendEmail({
    to: email, toName: name, subject, htmlContent: html,
    emailjsParams: { form_type: "Application Confirmation", from_name: name, email, message: `Ref: ${ref}\nLevel: ${level}\nProgramme: ${programme}` },
  });
};

// ── PAYMENT CONFIRMATION EMAIL ──
export const sendPaymentConfirmation = async ({ name, email, ref, programme, level, amount, feeType, paymentPlan }) => {
  const subject = `CTS ETS — Payment Received (${ref})`;
  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #011E40; padding: 24px 32px; text-align: center;">
        <h1 style="color: #D4A017; font-size: 22px; margin: 0;">CTS Empowerment & Training Solutions</h1>
        <p style="color: rgba(255,255,255,0.6); font-size: 11px; margin: 4px 0 0; letter-spacing: 2px;">CALLED TO SERVE — EXCELLENCE THROUGH SERVICE</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #011E40; font-size: 20px;">Payment Received, ${name}!</h2>
        <p style="color: #4A5568; line-height: 1.7;">Thank you for your payment. We are processing it now.</p>
        <div style="background: #FAFAF7; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #2D8B61;">
          <p style="margin: 0 0 8px;"><strong>Reference:</strong> ${ref}</p>
          <p style="margin: 0 0 8px;"><strong>Paying For:</strong> ${feeType || "Payment"}</p>
          <p style="margin: 0 0 8px;"><strong>Amount:</strong> J$${amount || "N/A"}</p>
          <p style="margin: 0 0 8px;"><strong>Plan:</strong> ${paymentPlan || "N/A"}</p>
          <p style="margin: 0;"><strong>Programme:</strong> ${level || ""} — ${programme || ""}</p>
        </div>
        <h3 style="color: #011E40; font-size: 16px;">What Happens Next?</h3>
        <ol style="color: #4A5568; line-height: 1.8;">
          <li>Our finance team verifies your payment (48–72 hours)</li>
          <li>You receive enrolment confirmation + Learning Portal access</li>
          <li>Start studying immediately — self-paced, 100% online</li>
        </ol>
        <p style="color: #4A5568; line-height: 1.7;">Need help? WhatsApp us at <strong>876-381-9771</strong> or email <strong>admin@ctsetsjm.com</strong>.</p>
      </div>
      <div style="background: #011E40; padding: 16px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">CTS ETS | ctsetsjm.com | admin@ctsetsjm.com | 876-381-9771</p>
      </div>
    </div>`;
  return sendEmail({ to: email, toName: name, subject, htmlContent: html });
};

// ── AUTOMATED DRIP SEQUENCE ──
// Schedule via Apps Script time-based triggers or Brevo Automation
// These templates are sent at Day 1, Day 3, Day 7, Day 14 after application
export const DRIP_EMAILS = [
  {
    day: 1,
    subject: "Welcome to CTS ETS — Here's What to Expect",
    template: (name) => `
      <h2>Welcome, ${name}!</h2>
      <p>Your application is being reviewed. Here's what the next few days look like:</p>
      <ul>
        <li><strong>Today:</strong> Our admissions team is reviewing your documents</li>
        <li><strong>Within 48 hours:</strong> You'll receive your acceptance decision</li>
        <li><strong>After acceptance:</strong> Payment instructions sent to this email</li>
      </ul>
      <p>In the meantime, explore what's waiting for you:</p>
      <ul>
        <li>🎧 <strong>Audio Study Sessions</strong> — learn by listening, anywhere</li>
        <li>🤖 <strong>Intelligent Study Assistant</strong> — ask questions 24/7</li>
        <li>📝 <strong>Expert-Written Guides</strong> — clear, structured content</li>
      </ul>
      <p>We're excited to have you. This is the start of something great.</p>`,
  },
  {
    day: 3,
    subject: "CTS ETS — Your Programme Starts With a Single Step",
    template: (name, programme) => `
      <h2>${name}, your ${programme} journey is almost ready.</h2>
      <p>Many of our students tell us the hardest part was pressing "Apply." You've already done that.</p>
      <p>Here's what successful CTS ETS students have in common:</p>
      <ul>
        <li>They study 6–10 hours per week (at their own pace)</li>
        <li>They use the Audio Study Sessions during commutes</li>
        <li>They ask questions early — our WhatsApp support is free</li>
      </ul>
      <p>If you haven't completed payment yet, your acceptance email contains full instructions.</p>
      <p>Questions? Reply to this email or WhatsApp <strong>876-381-9771</strong>.</p>`,
  },
  {
    day: 7,
    subject: "CTS ETS — Your Spot is Waiting",
    template: (name) => `
      <h2>${name}, just checking in.</h2>
      <p>It's been a week since you applied. If you've already paid — welcome aboard! Your Learning Portal access is on its way.</p>
      <p>If you haven't paid yet, your place is still reserved. Here's what you need:</p>
      <ul>
        <li>Check your email for the payment instructions from admin@ctsetsjm.com</li>
        <li>Pay online (Visa/Mastercard) or upload a bank transfer receipt</li>
        <li>Need a payment plan? Gold, Silver, or Bronze — details in your acceptance email</li>
      </ul>
      <p>We don't want you to miss out. If anything is holding you back, tell us — we're here to help.</p>`,
  },
  {
    day: 14,
    subject: "CTS ETS — Last Reminder: Your Place is Still Open",
    template: (name, programme) => `
      <h2>${name}, your ${programme} spot is still available.</h2>
      <p>We know life gets busy. But we wanted you to know: your application is still active and your spot is still available.</p>
      <p>Here's what you'll get when you enrol:</p>
      <ul>
        <li>✅ Immediate access to the CTS ETS Learning Portal</li>
        <li>🎧 Audio Study Sessions you can listen to like a podcast</li>
        <li>🤖 An AI study assistant that answers your questions 24/7</li>
        <li>🎓 A nationally and internationally recognised qualification</li>
      </ul>
      <p>Ready? Visit <a href="https://ctsetsjm.com/#apply">ctsetsjm.com</a> to complete your payment.</p>
      <p>Not ready yet? That's okay too. We'll be here when you are.</p>`,
  },
];

// Register drip sequence with Apps Script (call after application submission)
export const registerDripSequence = async ({ name, email, ref, programme, level }) => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        form_type: "Register Drip Sequence",
        name, email, ref, programme, level,
        dripDays: [1, 3, 7, 14],
        timestamp: new Date().toISOString(),
      }),
      mode: "no-cors",
    });
  } catch (_) {}
};
