import S from "../../constants/styles";
import { NAV_LOGO, NCTVET_LOGO, HEART_LOGO } from "../../constants/config";

export default function Footer({ setPage }) {
  var link = function(label, page) {
    return <button key={label} onClick={function() { setPage(page || label); }} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: S.body, cursor: "pointer", padding: "3px 0", textAlign: "left", transition: "color 0.15s" }}>{label}</button>;
  };

  return (
    <footer style={{ background: "linear-gradient(180deg, #131B2E 0%, #0B1120 100%)", padding: "48px 20px 20px", borderTop: "1px solid rgba(37,99,235,0.12)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 28, marginBottom: 28 }} className="resp-grid-2">
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 14 }} onClick={function() { setPage("Home"); }}>
              <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 40, height: 44, objectFit: "contain" }} width={40} height={44} loading="lazy" />
              <div>
                <div style={{ fontFamily: S.heading, fontSize: 13, fontWeight: 700, color: "#fff" }}>CTS ETS</div>
                <div style={{ fontSize: 9, color: S.gold, fontFamily: S.body, letterSpacing: 1 }}>Called To Serve — Excellence Through Service</div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: S.body, lineHeight: 1.6, marginBottom: 8 }}>Jamaica's Digital Vocational School. 100% online, self-paced programmes aligned to NCTVET.</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: S.body, marginBottom: 4 }}>{"📍 6, Newark Avenue, Kingston 2 (By Appointment Only)"}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: S.body, marginBottom: 4 }}>{"📧 admin@ctsetsjm.com | 📞 876-525-6802 | 💬 876-381-9771"}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: S.body }}>Reg. No. 16007/2025</p>
            {/* Partners */}
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {[[NCTVET_LOGO,"NCTVET"],[HEART_LOGO,"HEART/NSTA"]].map(function(p) {
                return <img key={p[1]} src={p[0]} alt={p[1]} style={{ height: 28, objectFit: "contain", background: "#fff", borderRadius: 4, padding: "2px 4px" }} loading="lazy" />;
              })}
            </div>
          </div>

          {/* Column 2: Admissions */}
          <div>
            <div style={{ fontSize: 10, color: "#93C5FD", letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>Admissions</div>
            {link("Apply Now", "Apply")}
            {link("Programmes", "Programmes")}
            {link("Why Choose CTS ETS", "Why Choose")}
            {link("International Students", "International")}
            {link("For Employers", "For Employers")}
            {link("Student Journey", "Student Journey")}
            {link("About CTS ETS", "About")}
          </div>

          {/* Column 3: Student Finance */}
          <div>
            <div style={{ fontSize: 10, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>Student Finance</div>
            {link("Fees & Calculator", "Fees & Calculator")}
            {link("Make a Payment", "Pay")}
            <button onClick={function() { setPage("Student Portal"); }} style={{ display: "block", background: "none", border: "none", color: "#93C5FD", fontSize: 12, fontFamily: S.body, padding: "3px 0", cursor: "pointer", fontWeight: 600, textAlign: "left" }}>Student Portal →</button>
          </div>

          {/* Column 4: Support */}
          <div>
            <div style={{ fontSize: 10, color: S.emerald, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 700, marginBottom: 12 }}>Support</div>
            {link("FAQ", "FAQ")}
            {link("Contact Us", "Contact")}
            {link("Verify a Certificate", "Verify Certificate")}
            {link("Feedback", "Feedback")}
            <a href="https://wa.me/8763819771" target="_blank" rel="noopener noreferrer" style={{ display: "block", color: S.emerald, fontSize: 12, fontFamily: S.body, padding: "3px 0", textDecoration: "none", fontWeight: 600 }}>WhatsApp Us →</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: S.body, margin: 0 }}>© 2026 CTS Empowerment & Training Solutions. All Rights Reserved.</p>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button onClick={function() { setPage("Privacy"); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: S.body, cursor: "pointer" }}>Privacy</button>
            <button onClick={function() { setPage("Terms"); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: S.body, cursor: "pointer" }}>Terms</button>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontFamily: S.body }}>Last Updated: March 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
