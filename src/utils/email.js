// ─── EMAIL SERVICE ──────────────────────────────────────────────────
// All student emails (confirmation, acceptance, payment, drip, encouragement)
// are sent via Gmail through Apps Script backend.
// EmailJS is used ONLY for admin notifications (new application alerts).

import { APPS_SCRIPT_URL, EMAILJS_SERVICE, EMAILJS_TEMPLATE } from "../constants/config";

// Send email via EmailJS (admin notifications only)
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

// Unified send — EmailJS only (Brevo removed for security)
export const sendEmail = async ({ emailjsParams }) => {
  if (emailjsParams) return sendEmailJS({ templateParams: emailjsParams });
  return { success: false, reason: "no_method" };
};

// ── All student emails (confirmation, acceptance, drip, payment, enrollment, graduation) ──
// are now sent by Apps Script backend via Gmail. See Code.gs.

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
