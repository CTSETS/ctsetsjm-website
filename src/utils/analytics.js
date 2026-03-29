// ─── ANALYTICS EVENT TRACKING ────────────────────────────────────────
// GA4 custom events for key conversion actions
// Usage: trackEvent("apply_started", { level: "Level 3" })

const GA_ID = "G-CNTDTP49S4";

// Initialize GA4 (call once on app load)
export const initGA4 = () => {
  if (document.getElementById("ga4-script")) return;
  const s = document.createElement("script");
  s.id = "ga4-script"; s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
};

// Track page view
export const trackPageView = (pageName) => {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_title: pageName,
    page_location: window.location.href,
    page_path: "/" + pageName.toLowerCase().replace(/ /g, "-"),
  });
};

// Track custom event
export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag) return;
  window.gtag("event", eventName, params);
};

// ── PRE-DEFINED CONVERSION EVENTS ──
// Call these at the exact moment the action occurs

export const trackApplyStarted = (level, programme) =>
  trackEvent("apply_started", { level, programme, event_category: "conversion" });

export const trackApplyCompleted = (level, programme, ref) =>
  trackEvent("apply_completed", { level, programme, application_ref: ref, event_category: "conversion" });

export const trackPaymentInitiated = (level, programme, amount, currency) =>
  trackEvent("payment_initiated", { level, programme, value: amount, currency, event_category: "conversion" });

export const trackPaymentCompleted = (level, programme, amount, currency) =>
  trackEvent("payment_completed", { level, programme, value: amount, currency, event_category: "conversion" });

export const trackProgrammeSelected = (level, programme) =>
  trackEvent("programme_selected", { level, programme, event_category: "engagement" });

export const trackWhatsAppClicked = (page) =>
  trackEvent("whatsapp_clicked", { page, event_category: "engagement" });


export const trackQuizCompleted = (recommendedLevel) =>
  trackEvent("quiz_completed", { recommended_level: recommendedLevel, event_category: "engagement" });

export const trackPDFDownloaded = (docName) =>
  trackEvent("pdf_downloaded", { document: docName, event_category: "engagement" });

export const trackBookingClicked = (bookingType) =>
  trackEvent("booking_clicked", { booking_type: bookingType, event_category: "engagement" });

export const trackContactFormSent = (subject) =>
  trackEvent("contact_form_sent", { subject, event_category: "conversion" });

export const trackGroupEnquirySent = (company, numLearners) =>
  trackEvent("group_enquiry_sent", { company, num_learners: numLearners, event_category: "conversion" });

