// ─── PROGRAMME GUIDE PDF GENERATOR ──────────────────────────────────
// Generates a printable/downloadable PDF summarizing all programmes, fees, and outcomes
// Uses browser print as PDF (no library needed)
import { PROGRAMMES, CAREER_OUTCOMES } from "../../constants/programmes";
import { USD_RATE, REG_FEE } from "../../constants/config";
import { trackPDFDownloaded } from "../../utils/analytics";
import S from "../../constants/styles";

export const generateProgrammeGuide = () => {
  trackPDFDownloaded("Programme Guide");
  const w = window.open("", "_blank");
  const levels = Object.entries(PROGRAMMES);
  const progRows = levels.map(([level, progs]) =>
    progs.map(p => `<tr><td>${p.name}</td><td>${level.split(" —")[0]}</td><td>${p.duration}</td><td>US$${Math.round(parseInt(p.total.replace(/[$,]/g, "")) / USD_RATE).toLocaleString()}</td><td>${p.total}</td></tr>`).join("")
  ).join("");
  const outcomeRows = Object.entries(CAREER_OUTCOMES).map(([level, d]) =>
    `<tr><td><strong>${level}</strong></td><td>${d.salaryRange}</td><td>${d.outlook}</td></tr>`
  ).join("");

  w.document.write(`<!DOCTYPE html><html><head><title>CTS ETS Programme Guide 2026</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; color: #011E40; max-width: 800px; margin: 0 auto; padding: 40px 32px; }
h1 { font-size: 28px; color: #011E40; margin-bottom: 4px; }
h2 { font-size: 18px; color: #D4A017; margin: 28px 0 12px; border-bottom: 2px solid #D4A017; padding-bottom: 6px; }
h3 { font-size: 14px; color: #011E40; margin: 16px 0 8px; }
p { font-size: 13px; color: #4A5568; line-height: 1.6; margin-bottom: 8px; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
th { background: #011E40; color: #D4A017; padding: 8px 10px; text-align: left; font-weight: 700; }
td { padding: 7px 10px; border-bottom: 1px solid #eee; }
tr:nth-child(even) { background: #fafaf7; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 700; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #D4A017; }
.footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
@media print { body { padding: 20px; } }
</style></head><body>
<div class="header">
  <div><h1>CTS Empowerment & Training Solutions</h1><p style="color:#D4A017;font-size:12px;letter-spacing:2px;margin:4px 0 0">PROGRAMME GUIDE 2026</p></div>
  <div style="text-align:right;font-size:11px;color:#4A5568"><p>ctsetsjm.com</p><p>info@ctsetsjm.com</p><p>876-381-9771</p></div>
</div>
<p>25 online programmes from Job Certificate to Bachelor's Equivalent. Aligned to NCTVET (NVQ-J) and City & Guilds. 100% online, self-paced. Study from anywhere.</p>

<h2>All Programmes & Fees</h2>
<table><thead><tr><th>Programme</th><th>Level</th><th>Duration</th><th>Total (USD)</th><th>Total (JMD)</th></tr></thead><tbody>${progRows}</tbody></table>
<p style="font-size:11px;color:#999">Total includes J$${REG_FEE.toLocaleString()} (US$${Math.round(REG_FEE / USD_RATE)}) registration fee. NCTVET external assessment fees separate. Exchange rate: US$1 ≈ J$${USD_RATE}.</p>

<h2>Payment Plans</h2>
<table><thead><tr><th>Plan</th><th>Structure</th><th>Surcharge</th><th>Available For</th></tr></thead><tbody>
<tr><td><strong>Gold</strong></td><td>Full payment at enrolment</td><td>0%</td><td>All levels</td></tr>
<tr><td><strong>Silver</strong></td><td>60% at enrolment, 40% at mid-point</td><td>+10%</td><td>Levels 3–5 only</td></tr>
<tr><td><strong>Bronze</strong></td><td>30% deposit + monthly instalments</td><td>+15%</td><td>Levels 3–5 only</td></tr>
</tbody></table>
<p><strong>Employer group discount:</strong> 15% off for 8 or more learners.</p>

<h2>Career Outcomes by Level</h2>
<table><thead><tr><th>Level</th><th>Salary Range (JMD/yr)</th><th>Employment Outlook</th></tr></thead><tbody>${outcomeRows}</tbody></table>

<h2>How to Apply</h2>
<p>1. Visit <strong>ctsetsjm.com</strong> → 2. Click <strong>Apply Now</strong> → 3. Complete the online form (10 minutes) → 4. Upload your documents → 5. Receive acceptance within 48 hours → 6. Pay and start studying.</p>

<h2>Contact</h2>
<p>📧 info@ctsetsjm.com &nbsp;|&nbsp; 📞 876-381-9771 &nbsp;|&nbsp; 💬 WhatsApp: 876-381-9771</p>
<p>📍 6 Newark Avenue, Kingston 11, Jamaica W.I. &nbsp;|&nbsp; Reg. No. 16007/2025</p>

<div class="footer">
<p>CTS Empowerment & Training Solutions — Called To Serve, Committed to Excellence</p>
<p>This guide is for informational purposes. Fees are current as of 2026 and subject to change. Confirmed enrolments honoured at agreed rates.</p>
</div>
</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

// Download button component
export function DownloadGuideButton({ style = {} }) {
  return (
    <button onClick={generateProgrammeGuide} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "12px 24px", borderRadius: 8, background: S.navy,
      color: S.gold, border: "none", fontSize: 13, fontWeight: 700,
      cursor: "pointer", fontFamily: S.body, transition: "all 0.2s",
      boxShadow: "0 4px 16px rgba(1,30,64,0.15)", ...style,
    }}>📄 Download Programme Guide (PDF)</button>
  );
}

// ─── WARMER TONE CTA VARIANTS ───────────────────────────────────────
// More approachable alternatives for key buttons
// Mix these in alongside the formal versions
export const WARM_CTAS = {
  apply: {
    formal: "Apply Now",
    warm: "Ready fi start? Apply now 🇯🇲",
    encouraging: "Take the first step — it's free to apply",
  },
  programmes: {
    formal: "View Programmes",
    warm: "See what you can study",
    encouraging: "Find the right programme for you",
  },
  fees: {
    formal: "View Fees & Calculator",
    warm: "See how affordable it is",
    encouraging: "Check what you'll pay — no surprises",
  },
  founding: {
    formal: "View Founding Prices",
    warm: "Lock in your savings",
    encouraging: "See how much you can save",
  },
  contact: {
    formal: "Contact Us",
    warm: "Talk to us — we're here",
    encouraging: "Have a question? Just ask",
  },
  whatsapp: {
    formal: "Chat on WhatsApp",
    warm: "WhatsApp us — we answer fast 💬",
    encouraging: "Message us anytime",
  },
};
