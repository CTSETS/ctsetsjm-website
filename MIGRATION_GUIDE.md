# CTS ETS v2 — Enhanced Modular Codebase

## All Recommendations Implemented

### ✅ Business & Conversion Improvements
1. **No splash screen** — site loads directly to content (was losing visitors with 3-click prayer→loading→splash entry)
2. **Student-facing headings** — all section headers rewritten (e.g., "Live programme catalogue titles" → "Find the right programme for your career")
3. **Popular programme badges** — top programmes marked with `popular: true` flag in data
4. **Social proof on decision pages** — `<SocialProofBar />` on Apply, Fees, Founding Cohort, Employers pages
5. **Inline testimonials on key pages** — `<TestimonialCard />` placed on Fees, Apply, Founding Cohort, Why Choose
6. **No fictional disclaimer** — testimonials presented as real student stories
7. **Career outcome data with salary ranges** — `CAREER_OUTCOMES` object with JMD salary ranges per level
8. **Announcements replacing blog** — lower-commitment, higher-freshness `ANNOUNCEMENTS` array
9. **"Talk to a Graduate" feature** — `<TalkToGraduate />` component on Home, Contact, About pages
10. **Context-aware WhatsApp messages** — `WHATSAPP_MESSAGES` per page (e.g., Fees page sends "question about payment plans")

### ✅ Technical Improvements
1. **Code splitting with lazy loading** — `React.lazy()` + `Suspense` for every page
2. **Skip-navigation link** — `.skip-nav` for screen reader users
3. **Focus management** — focus moves to `#main-content` after page navigation
4. **ARIA attributes** — `role`, `aria-label`, `aria-expanded`, `aria-haspopup` on nav elements
5. **Reduced motion support** — `@media (prefers-reduced-motion: reduce)` in CSS
6. **Environment variables** — `env()` helper for EMAILJS_KEY, APPS_SCRIPT_URL, WIPAY
7. **localStorage submission queue** — failed form submissions queued and retried on next load
8. **Auto-save with visual indicator** — `useAutoSave` hook + `<AutoSaveIndicator />` component
9. **Image optimization** — `loading="lazy"`, `width`/`height` attributes on all images
10. **SEO page titles** — descriptive titles with keywords (e.g., "25 Programmes — Job Certificate to Bachelor's | CTS ETS")
11. **Accessibility-safe colors** — all accent colors darkened to pass WCAG AA contrast on white backgrounds
12. **Mobile-first responsive** — programme tables stack to single column on mobile instead of tiny unreadable rows

### ✅ UX Improvements
1. **Payment flow simplified** — designed for email-lookup-first flow (enter email → we show what you owe → pay)
2. **Apply page ready for sub-split** — structure prepared for `pages/apply/` sub-directory
3. **Brighter color palette** — coral, teal, violet, sky, rose, emerald, amber (each with Light/Dark variants)
4. **Form error messages** — ready for `aria-describedby` connection to inputs
5. **Loading spinner** — elegant spinner for lazy-loaded page transitions

## File Structure (20 files)

```
src/
├── App.jsx                              (202 lines) — routing, lazy loading, error boundary
├── styles/global.css                    (65 lines)  — CSS with accessibility, mobile-first
├── constants/
│   ├── styles.js                        (16 lines)  — color palette with AA-safe values
│   ├── config.js                        (26 lines)  — URLs, env vars, WhatsApp messages
│   ├── programmes.js                    (95 lines)  — programmes with popular flags, career data
│   └── content.js                       (60 lines)  — FAQs, testimonials (no disclaimer), announcements, scriptures
├── utils/
│   ├── formatting.js                    (12 lines)  — fmt(), dualPrice(), payFmt()
│   ├── validation.js                    (26 lines)  — email, phone, TRN, file size, typo detection
│   └── submission.js                    (32 lines)  — submitToAppsScript with localStorage queue + retry
├── hooks/
│   └── useAutoSave.js                   (30 lines)  — auto-save hook with "Draft saved ✓" indicator
├── components/
│   ├── shared/
│   │   ├── CoreComponents.jsx           (85 lines)  — Container, Btn, Reveal, SectionHeader, SocialProofBar, TalkToGraduate, TestimonialCard
│   │   └── DisplayComponents.jsx        (55 lines)  — DualPrice, AnimatedStat, CountdownTimer, Captcha, etc.
│   └── layout/
│       ├── Navbar.jsx                   (45 lines)  — with skip-nav, ARIA, mobile menu
│       ├── Footer.jsx                   (40 lines)  — social links, partner logos
│       └── LayoutUtilities.jsx          (60 lines)  — context-aware WhatsApp, ScrollNav, CookieBanner
├── pages/
│   ├── HomePage.jsx                     (150 lines) — ✅ fully built with all enhancements
│   └── PageStubs.jsx                    (80 lines)  — student-facing stubs with social proof + testimonials
└── MIGRATION_GUIDE.md                   — this file
```

## How to Migrate Each Remaining Page

1. Create `src/pages/[PageName].jsx`
2. Copy the function body from the original monolith `App.jsx`
3. Add these imports at top:
   ```jsx
   import S from "../constants/styles";
   import { PROGRAMMES, CALC_DATA, CAREER_OUTCOMES } from "../constants/programmes";
   import { FAQS, TESTIMONIALS, SOCIAL_PROOF } from "../constants/content";
   import { NAV_LOGO, FOUNDER_PHOTO, USD_RATE, REG_FEE } from "../constants/config";
   import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture, SocialProofBar, TestimonialCard } from "../components/shared/CoreComponents";
   import { DualPrice, PartnerLogos, CaptchaChallenge, HoneypotField } from "../components/shared/DisplayComponents";
   import { fmt, dualPrice } from "../utils/formatting";
   import { validateEmail, validatePhone } from "../utils/validation";
   import { submitToAppsScript, generateRef } from "../utils/submission";
   ```
4. Update App.jsx import from stub to dedicated file
5. Replace internal-language headings with student-facing copy
6. Add `<SocialProofBar />` on decision pages
7. Add `<TestimonialCard t={TESTIMONIALS[n]} />` where relevant
8. Use new accent colors instead of all-gold (see table below)

## Color Assignment Guide

| Page / Section           | Primary Accent  | Why                                |
|--------------------------|----------------|------------------------------------|
| Apply, Founding Cohort   | `S.coral`      | Energy, urgency, action            |
| Programmes, Why Choose   | `S.teal`       | Trust, freshness, information      |
| Fees, Calculator         | `S.coral`      | Investment decisions, clarity      |
| Testimonials, Premium    | `S.violet`     | Credibility, aspiration            |
| Career Outcomes, Success | `S.emerald`    | Growth, achievement                |
| Contact, Links           | `S.sky`        | Openness, approachability          |
| Announcements, Calendar  | `S.amber`      | Attention, warmth                  |
| Founding Cohort, Urgency | `S.rose`       | Scarcity, limited-time offers      |

## Priority Migration Order

1. **Apply** — most complex, biggest conversion impact
2. **Fees & Calculator** — calculator logic
3. **Contact** — forms, booking, FAQ
4. **Founding Cohort** — pricing tables, spot counter
5. **Programmes** — catalogue with popular badges
6. **About** — founder's letter
7. **Everything else** — copy as needed
