# CTS ETS Final Page Pack

This handoff pack contains upgraded replacement page files for the CTS ETS React site.

Included pages:
- HomePage.jsx
- ProgrammesPage.jsx
- WhyChoosePage.jsx
- ContactPage.jsx
- FAQPage.jsx
- AboutPage.jsx
- ApplyPage.jsx
- FeesPage.jsx
- PaymentPage.jsx
- InternationalPage.jsx
- EmployersPage.jsx
- StudentJourneyPage.jsx
- StudentPortalPage.jsx
- VerifyCertificatePage.jsx
- AdminDashboardPage.jsx

Important notes:
1. These files assume your existing shared project structure is still in place:
   - constants/styles
   - constants/content
   - constants/programmes
   - constants/config
   - shared components in ../components/...
   - utilities in ../utils/...
2. Replace the matching page files in your project one by one and test after each swap.
3. A few pages reference route labels exactly as used in the drafts, for example:
   - "Apply"
   - "Programmes"
   - "Fees & Calculator"
   - "Contact"
   - "FAQ"
   - "Pay"
   - "Home"
   Adjust any route names if your real router uses different labels.
4. The homepage in this pack is based on the latest homepage canvas state.
5. The heavier workflow pages (Apply, Payment, Student Portal, Admin Dashboard) were kept aligned to the functional direction we built, but you should still test:
   - API endpoints
   - OTP flow
   - payment flow
   - upload flow
   - record generation
   - admin auth and action endpoints

Suggested implementation order:
1. HomePage
2. ProgrammesPage
3. AboutPage / WhyChoosePage
4. ContactPage / FAQPage
5. FeesPage
6. ApplyPage
7. PaymentPage
8. InternationalPage / EmployersPage / StudentJourneyPage
9. VerifyCertificatePage
10. StudentPortalPage
11. AdminDashboardPage
