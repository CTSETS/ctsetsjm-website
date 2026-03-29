import { useState } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, LEARNING_PORTAL_URL } from "../constants/config";
import { Container, PageWrapper, Btn, SectionHeader, Reveal, PageScripture } from "../components/shared/CoreComponents";
import { fmt } from "../utils/formatting";

var QUICK_LINKS = [
  { icon: "\uD83D\uDCDA", title: "Learning Portal", desc: "Access your lessons, quizzes, audio sessions, and study guides.", href: LEARNING_PORTAL_URL, external: true, color: S.teal },
  { icon: "\uD83E\uDD16", title: "AI Study Assistant", desc: "Ask questions about your course material 24/7.", href: LEARNING_PORTAL_URL, external: true, color: S.violet },
  { icon: "\uD83C\uDFA7", title: "Audio Study Sessions", desc: "Listen to your lessons like a podcast — on the bus, at work, anywhere.", href: LEARNING_PORTAL_URL, external: true, color: S.coral },
  { icon: "\uD83D\uDCDD", title: "Download Study Guides", desc: "PDF guides for every module — read offline, highlight, take notes.", href: LEARNING_PORTAL_URL, external: true, color: S.emerald },
];

export default function StudentPortalPage({ setPage }) {
  var [ref, setRef] = useState("");
  var [state, setState] = useState("idle"); // idle, loading, found, not_found, error
  var [student, setStudent] = useState(null);
  var [msg, setMsg] = useState("");

  var lookup = async function() {
    var val = ref.trim().toUpperCase();
    if (!val) return;
    if (!val.startsWith("CTSETS-")) { setState("not_found"); setMsg("Application numbers start with CTSETS- (e.g. CTSETS-2026-03-12345)."); return; }
    setState("loading");
    try {
      var res = await fetch(APPS_SCRIPT_URL + "?action=lookupStudent&ref=" + encodeURIComponent(val));
      var data = await res.json();
      if (data.found) { setStudent(data); setState("found"); }
      else { setState("not_found"); setMsg("No application found with this reference. Check the number and try again."); }
    } catch(e) { setState("error"); setMsg("Connection error. Please try again."); }
  };

  return (
    <PageWrapper>
      <SectionHeader tag="For Current Students" title="Student Portal" desc="Access your learning tools, check your application status, and manage your payments." accentColor={S.teal} />
      <Container>

        {/* Quick Access Links */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }} className="resp-grid-2">
            {QUICK_LINKS.map(function(link, i) {
              return (
                <a key={i} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}
                  style={{ padding: "24px 18px", borderRadius: 14, background: "#fff", border: "1px solid " + S.border, borderTop: "4px solid " + link.color, textAlign: "center", textDecoration: "none", transition: "box-shadow 0.2s", display: "block" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{link.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, fontFamily: S.heading, marginBottom: 6 }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.5 }}>{link.desc}</div>
                </a>
              );
            })}
          </div>
        </Reveal>

        {/* Status Lookup */}
        <Reveal>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "1px solid " + S.border, marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: S.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff" }}>{"\uD83D\uDD0D"}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: S.navy, fontFamily: S.heading }}>Check Your Application Status</div>
                <div style={{ fontSize: 12, color: S.gray, fontFamily: S.body }}>Enter the reference number from your confirmation email</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input type="text" value={ref} onChange={function(e) { setRef(e.target.value.toUpperCase()); setState("idle"); }}
                onKeyDown={function(e) { if (e.key === "Enter") lookup(); }}
                placeholder="CTSETS-2026-03-XXXXX"
                style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: "2px solid " + S.border, fontSize: 15, fontFamily: S.body, color: S.navy, fontWeight: 600, outline: "none", letterSpacing: 1, boxSizing: "border-box" }} />
              <button onClick={lookup} disabled={state === "loading" || !ref.trim()}
                style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: ref.trim() ? S.teal : S.border, color: ref.trim() ? "#fff" : S.grayLight, fontSize: 14, fontWeight: 700, cursor: ref.trim() ? "pointer" : "not-allowed", fontFamily: S.body }}>
                {state === "loading" ? "..." : "Look Up"}
              </button>
            </div>

            {/* Results */}
            {state === "found" && student && (
              <div style={{ marginTop: 20 }}>
                <div style={{ padding: "20px 24px", borderRadius: 12, background: S.emeraldLight + "60", border: "2px solid " + S.emerald + "40", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: S.emerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>{"\u2713"}</div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: S.emeraldDark, fontFamily: S.body }}>Application Found</span>
                  </div>
                  {[
                    ["Name", student.name],
                    ["Reference", student.ref],
                    ["Programme", (student.level ? student.level + " — " : "") + (student.programme || "")],
                    ["Application Status", student.status || "Under Review"],
                    ["Payment Status", student.paymentStatus || "Pending"],
                  ].map(function(row) {
                    var statusColor = row[0] === "Application Status" ? (row[1] === "Accepted" ? S.emerald : row[1] === "Under Review" ? S.amber : S.navy) : row[0] === "Payment Status" ? (row[1].indexOf("Paid") >= 0 ? S.emerald : S.amber) : S.navy;
                    return (
                      <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + S.emerald + "20", fontSize: 13, fontFamily: S.body }}>
                        <span style={{ color: S.gray }}>{row[0]}</span>
                        <span style={{ color: statusColor, fontWeight: 700 }}>{row[1]}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn primary onClick={function() { setPage("Pay"); }} style={{ color: "#fff", background: S.coral, flex: 1, fontSize: 13 }}>Make a Payment</Btn>
                  <a href={LEARNING_PORTAL_URL} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "12px 20px", borderRadius: 8, border: "2px solid " + S.teal, color: S.teal, fontSize: 13, fontWeight: 700, fontFamily: S.body, textDecoration: "none", textAlign: "center" }}>Go to Learning Portal</a>
                </div>
              </div>
            )}

            {state === "not_found" && <div style={{ marginTop: 12, padding: "14px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 13, color: S.amberDark, fontFamily: S.body }}>{msg}</div>}
            {state === "error" && <div style={{ marginTop: 12, padding: "14px 18px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30", fontSize: 13, color: S.amberDark, fontFamily: S.body }}>{msg}</div>}
          </div>
        </Reveal>

        {/* Help section */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }} className="resp-grid-2">
            <div style={{ padding: "24px", borderRadius: 14, background: "#fff", border: "1px solid " + S.border }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{"\uD83D\uDCB3"}</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 700, marginBottom: 6 }}>Payment & Finance</h3>
              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, marginBottom: 14 }}>View fee structure, use the payment calculator, or submit payment evidence.</p>
              <Btn onClick={function() { setPage("Fees & Calculator"); }} style={{ fontSize: 12, border: "2px solid " + S.coral, color: S.coral }}>Student Finance</Btn>
            </div>
            <div style={{ padding: "24px", borderRadius: 14, background: "#fff", border: "1px solid " + S.border }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{"\uD83D\uDCAC"}</div>
              <h3 style={{ fontFamily: S.heading, fontSize: 16, color: S.navy, fontWeight: 700, marginBottom: 6 }}>Need Help?</h3>
              <p style={{ fontFamily: S.body, fontSize: 13, color: S.gray, lineHeight: 1.6, marginBottom: 14 }}>WhatsApp us or check the FAQ for instant answers. We respond within 48–72 hours.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href="https://wa.me/8763819771" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 6, background: S.emerald, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: S.body, textDecoration: "none" }}>WhatsApp</a>
                <Btn onClick={function() { setPage("FAQ"); }} style={{ fontSize: 12, border: "2px solid " + S.teal, color: S.teal, padding: "8px 16px" }}>FAQ</Btn>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Not enrolled yet? */}
        <Reveal>
          <div style={{ textAlign: "center", padding: "32px", borderRadius: 16, background: S.lightBg, border: "1px solid " + S.border }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 20, color: S.navy, fontWeight: 700, marginBottom: 8 }}>Not Enrolled Yet?</h3>
            <p style={{ fontFamily: S.body, fontSize: 14, color: S.gray, lineHeight: 1.6, marginBottom: 20 }}>Apply in under 10 minutes. 100% online, self-paced. Join the next cohort.</p>
            <Btn primary onClick={function() { setPage("Apply"); }} style={{ color: "#fff", background: S.coral, fontSize: 15, padding: "14px 36px" }}>Apply Now</Btn>
          </div>
        </Reveal>

        <PageScripture page="home" />
      </Container>
    </PageWrapper>
  );
}
