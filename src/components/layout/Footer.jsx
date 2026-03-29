import S from "../../constants/styles";
import { NAV_LOGO, NCTVET_LOGO, CG_LOGO, HEART_LOGO, PORTAL_URL } from "../../constants/config";

export default function Footer({ setPage }) {
  return (
    <footer style={{ background: S.navy, padding: "40px 20px 28px", borderTop: "3px solid " + S.gold }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 32 }} className="resp-grid-3">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 16 }} onClick={() => setPage("Home")}>
              <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 44, height: 48, objectFit: "contain" }} width={44} height={48} loading="lazy" />
              <div><div style={{ fontFamily: S.heading, fontSize: 14, fontWeight: 700, color: "#fff" }}>CTS Empowerment &amp; Training Solutions</div><div style={{ fontSize: 10, color: S.gold, fontFamily: S.body, marginTop: 2, letterSpacing: 1 }}>Called To Serve — Excellence Through Service</div></div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body, lineHeight: 1.6, marginBottom: 10 }}>25 programmes aligned to NCTVET &amp; City &amp; Guilds. 100% online, self-paced.</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: S.body, marginBottom: 4 }}>📍 6 Newark Avenue, Kingston 11, Jamaica W.I.</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: S.body }}>Reg. No. 16007/2025</p>
          </div>
          <div>
            <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 16 }}>Quick Links</div>
            {["About","Why Choose","Programmes","Certification","Careers","Student Journey","Fees & Calculator","For Employers","International","Apply","Pay","Contact","Announcements","Feedback"].map(p => <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: S.body, cursor: "pointer", padding: "4px 0", textAlign: "left" }}>{p === "Pay" ? "💳 Make a Payment" : p}</button>)}
            <button onClick={() => setPage("Verify Certificate")} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: S.body, cursor: "pointer", padding: "4px 0", textAlign: "left" }}>Verify a Certificate</button>
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", color: S.emerald, fontSize: 13, fontFamily: S.body, padding: "4px 0", textDecoration: "none", fontWeight: 600 }}>🎓 Student Portal</a>
          </div>
          <div>
            <div style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: S.body, fontWeight: 600, marginBottom: 16 }}>Our Partners</div>
            {[[NCTVET_LOGO,"NCTVET","National Standards"],[CG_LOGO,"City & Guilds","International"],[HEART_LOGO,"HEART/NSTA","Trust"]].map(([src,alt,sub]) => <div key={alt} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><img src={src} alt={alt} style={{ height: 32, objectFit: "contain", background: "#fff", borderRadius: 4, padding: "2px 4px" }} loading="lazy" /><span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: S.body }}>{alt} — {sub}</span></div>)}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: S.body }}>© 2026 CTS ETS. All Rights Reserved.</p>
          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={() => setPage("Privacy")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: S.body, cursor: "pointer" }}>Privacy</button>
            <button onClick={() => setPage("Terms")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: S.body, cursor: "pointer" }}>Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
