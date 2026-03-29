# CTS ETS — Enhancement Integration Guide

## All 12 Recommendations: What Was Built & How to Wire It In

---

### #1 — Transactional Email + Drip Sequence
**File:** `src/utils/email.js`

**What it does:** Unified email sender (Brevo primary, EmailJS fallback) + 4-email automated drip sequence templates.

**How to connect:**
```jsx
// In your Apply submission handler:
import { sendApplicationConfirmation, registerDripSequence } from "../utils/email";

// After successful submission:
await sendApplicationConfirmation({ name, email, ref, programme, level });
await registerDripSequence({ name, email, ref, programme, level });
```

**Setup required:**
1. Sign up at [brevo.com](https://brevo.com) (free — 300 emails/day)
2. Get API key from Settings → SMTP & API
3. Paste into `BREVO_API_KEY` in `src/utils/email.js`
4. Add Google Apps Script time-based trigger to send drip emails at Day 1, 3, 7, 14

---

### #2 — GA4 Event Tracking
**File:** `src/utils/analytics.js`

**What it does:** Pre-defined conversion events for every key action.

**How to connect:**
```jsx
// Import specific trackers where needed:
import { trackApplyStarted, trackPaymentInitiated, trackWhatsAppClicked } from "../utils/analytics";

// Call at the exact moment:
trackApplyStarted("Level 3", "Customer Service Supervision");
trackPaymentInitiated("Level 3", "Customer Service Supervision", 35000, "JMD");
trackWhatsAppClicked("Fees & Calculator");
```

**Events tracked:** apply_started, apply_completed, payment_initiated, payment_completed, programme_selected, whatsapp_clicked, founding_cta_clicked, quiz_completed, pdf_downloaded, booking_clicked, contact_form_sent, group_enquiry_sent, referral_code_entered.

---

### #3 — Open Graph + SEO Meta Tags
**File:** `src/public/index.html`

**What it does:** Proper social sharing previews for WhatsApp/Facebook/LinkedIn, structured data for Google, font preloading, noscript fallback for crawlers.

**Setup required:**
1. Create a 1200×630px share image and save as `/public/og-share-image.jpg`
   - Should show: CTS ETS logo, tagline, "25 Programmes — Apply Now"
2. Replace the default `index.html` in your project with this version
3. Create `/public/favicon.ico` and `/public/apple-touch-icon.png`

---

### #4 — Referral Tracking System
**File:** `src/utils/referral.js`

**What it does:** Generates unique referral codes per student, validates codes, registers referrals, calculates 5% credits.

**How to connect:**
```jsx
import { generateReferralCode, validateReferralCode, registerReferral } from "../utils/referral";

// After application acceptance (in confirmation email):
const refCode = generateReferralCode(applicationRef);  // "CTS-REF-26123"

// When a new applicant enters a referral code:
const { valid, referrerName } = await validateReferralCode(enteredCode);

// After referred person's application is submitted:
await registerReferral({ referralCode, referredName, referredEmail, referredRef, referredProgramme });
```

**Backend setup:** Add a "Referrals" sheet to your Google Spreadsheet with columns: ReferralCode, ReferrerRef, ReferrerName, ReferredRef, ReferredName, ReferredDate, Status, CreditApplied.

---

### #5 — Digital HEART Form Helper
**File:** `src/components/trust/TrustElements.jsx` → `HeartFormHelper`

**What it does:** Shows step-by-step mobile-friendly instructions for completing the HEART form, pre-fills values from the application data so students can copy them.

**How to connect:**
```jsx
import { HeartFormHelper } from "../components/trust/TrustElements";
// In the Apply page HEART Form tab:
<HeartFormHelper formData={form} />
```

---

### #6 — "What Level Am I?" Quiz
**File:** `src/components/quiz/LevelQuiz.jsx`

**What it does:** 5-question interactive quiz that recommends a starting level with salary range and programme suggestions. Tracks completion via GA4.

**How to connect:**
```jsx
import LevelQuiz from "../components/quiz/LevelQuiz";
// On Programmes page or Home page:
<LevelQuiz setPage={setPage} />
```

---

### #7 — Trust Elements (Map + Registration)
**File:** `src/components/trust/TrustElements.jsx` → `TrustSection`

**What it does:** Google Maps embed of 6 Newark Avenue + registration proof cards with verification links.

**How to connect:**
```jsx
import { TrustSection } from "../components/trust/TrustElements";
// On About page and Contact page:
<TrustSection />
```

**Note:** Update the Google Maps embed URL with your exact coordinates for accuracy.

---

### #8 — WiPay Fix (Smart Payment)
**File:** `src/components/apply/SmartPayment.jsx`

**What it does:** `isOnlinePaymentAvailable()` checks if the API key is configured. If not, it only shows "Bank Transfer + Upload Receipt" — no more broken "Pay Online" flow.

**How to connect:**
```jsx
import { PaymentMethodSelector, PaymentSetupNotice } from "../components/apply/SmartPayment";
// In Payment Centre:
<PaymentSetupNotice />  {/* Shows bank details if WiPay not configured */}
<PaymentMethodSelector method={method} setMethod={setMethod} />
```

**When WiPay is ready:** Paste your API key into `WIPAY_CONFIG.apiKey` in `src/constants/config.js` and the "Pay Online" tab appears automatically.

---

### #9 — WhatsApp Business Setup
**File:** `src/utils/operational.js` → `WHATSAPP_BUSINESS_GUIDE`

**What it does:** Complete operational guide for setting up WhatsApp Business, including quick replies, labels, away messages, and future API migration path.

**Action required:** Follow the guide in the file. No code changes needed — this is an operational setup on your phone.

---

### #10 — Downloadable Programme Guide PDF
**File:** `src/components/pdf/ProgrammeGuide.jsx`

**What it does:** Generates a printable 2-page PDF with all 25 programmes, fees, payment plans, career outcomes, and contact info. Uses browser print-to-PDF.

**How to connect:**
```jsx
import { DownloadGuideButton } from "../components/pdf/ProgrammeGuide";
// On Programmes page, Fees page, or Home page:
<DownloadGuideButton />
```

---

### #11 — Warmer Tone CTA Variants
**File:** `src/components/pdf/ProgrammeGuide.jsx` → `WARM_CTAS`

**What it does:** Provides alternative warmer/informal button text alongside formal versions.

**How to use:**
```jsx
import { WARM_CTAS } from "../components/pdf/ProgrammeGuide";
// Mix warm and formal CTAs:
<Btn primary>{WARM_CTAS.apply.encouraging}</Btn>  // "Take the first step — it's free to apply"
<Btn>{WARM_CTAS.fees.warm}</Btn>                    // "See how affordable it is"
```

Suggested placement: use warm CTAs on the homepage and founding cohort page, formal CTAs on the application and payment pages.

---

### #12 — International Privacy Policy
**File:** `src/utils/operational.js` → `INTERNATIONAL_PRIVACY_CLAUSES`

**What it does:** 6 additional privacy clauses covering GDPR, international data transfers, non-enrolled applicant retention, third-party processors, and data protection contact.

**How to connect:**
```jsx
import { INTERNATIONAL_PRIVACY_CLAUSES } from "../utils/operational";
// In Privacy Policy page, after existing sections:
{INTERNATIONAL_PRIVACY_CLAUSES.map(clause => (
  <div key={clause.title}>
    <h3>{clause.title}</h3>
    <p>{clause.content}</p>
  </div>
))}
```

---

## Quick Start Checklist

- [ ] Replace `index.html` with `src/public/index.html`
- [ ] Create `og-share-image.jpg` (1200×630px)
- [ ] Sign up for Brevo and paste API key in `src/utils/email.js`
- [ ] Set up WhatsApp Business (follow guide in `src/utils/operational.js`)
- [ ] Add GA4 event calls in Apply, Payment, and Contact handlers
- [ ] Add `<LevelQuiz />` to Programmes or Home page
- [ ] Add `<DownloadGuideButton />` to Programmes and Fees pages
- [ ] Add `<TrustSection />` to About and Contact pages
- [ ] Add `<SocialProofBar />` to Apply, Fees, and Founding Cohort pages
- [ ] Add international privacy clauses to Privacy Policy page
- [ ] Update Google Maps coordinates in TrustSection
- [ ] Create Referrals sheet in Google Spreadsheet
