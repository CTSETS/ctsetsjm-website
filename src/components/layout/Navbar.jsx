import { useState } from "react";
import S from "../../constants/styles";
import { NAV_LOGO, APPLY_URL, TRACK_URL, PAYMENT_URL, PORTAL_URL } from "../../constants/config";

const NAV_GROUPS = [
  { label: "Home", page: "Home" },
  {
    label: "About",
    children: [
      { label: "Our Story", page: "About" },
      { label: "Why Choose CTS ETS", page: "Why Choose" },
    ],
  },
  { label: "Programmes", page: "Programmes" },
  {
    label: "Admissions",
    children: [
      { label: "Start Application", href: APPLY_URL },
      { label: "Check Application Status", href: TRACK_URL },
      { label: "Student Journey", page: "Student Journey" },
    ],
  },
  {
    label: "Student Finance",
    children: [
      { label: "Fees & Calculator", page: "Fees & Calculator" },
      { label: "Make a Payment", href: PAYMENT_URL },
    ],
  },
  {
    label: "Support",
    children: [
      { label: "FAQ", page: "FAQ" },
      { label: "Contact Us", page: "Contact" },
      { label: "Verify Certificate", page: "Verify Certificate" },
      { label: "Feedback", page: "Feedback" },
    ],
  },
];

function NavDropdown({ group, page, setPage }) {
  const [hovered, setHovered] = useState(false);
  const isActive = group.children
    ? group.children.some((c) => c.page && c.page === page)
    : group.page === page;

  if (!group.children) {
    return (
      <button
        onClick={() => setPage(group.page)}
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          border: "none",
          background: isActive ? "rgba(196,145,18,0.14)" : "transparent",
          color: isActive ? "#F5D67A" : "rgba(255,255,255,0.78)",
          fontSize: 12,
          fontWeight: isActive ? 700 : 500,
          cursor: "pointer",
          fontFamily: S.body,
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {group.label}
      </button>
    );
  }

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        aria-expanded={hovered}
        aria-haspopup="true"
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          border: "none",
          background: isActive ? "rgba(196,145,18,0.14)" : "transparent",
          color: isActive ? "#F5D67A" : "rgba(255,255,255,0.78)",
          fontSize: 12,
          fontWeight: isActive ? 700 : 500,
          cursor: "pointer",
          fontFamily: S.body,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {group.label}
        <span
          style={{
            fontSize: 8,
            opacity: 0.7,
            transition: "transform 0.2s",
            transform: hovered ? "rotate(180deg)" : "none",
          }}
        >
          ▼
        </span>
      </button>

      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "linear-gradient(180deg, #18233C 0%, #0B1120 100%)",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
            border: "1px solid rgba(196,145,18,0.16)",
            minWidth: 210,
            padding: "4px 0",
            zIndex: 1001,
          }}
        >
          {group.children.map((c) => {
            if (c.href) {
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setHovered(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "100%",
                    padding: "10px 20px",
                    background: "transparent",
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 13,
                    fontWeight: 400,
                    cursor: "pointer",
                    fontFamily: S.body,
                    textAlign: "left",
                    textDecoration: "none",
                    transition: "background 0.15s",
                    borderLeft: "3px solid transparent",
                  }}
                >
                  {c.label}
                  <span style={{ fontSize: 9, opacity: 0.45 }}>↗</span>
                </a>
              );
            }

            return (
              <button
                key={c.page}
                onClick={() => {
                  setPage(c.page);
                  setHovered(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 20px",
                  border: "none",
                  background: page === c.page ? "rgba(196,145,18,0.12)" : "transparent",
                  color: page === c.page ? "#F5D67A" : "rgba(255,255,255,0.72)",
                  fontSize: 13,
                  fontWeight: page === c.page ? 700 : 400,
                  cursor: "pointer",
                  fontFamily: S.body,
                  textAlign: "left",
                  transition: "background 0.15s",
                  borderLeft: page === c.page ? "3px solid #C49112" : "3px solid transparent",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <nav
        style={{
          background: "linear-gradient(180deg, rgba(11,17,32,0.94) 0%, rgba(24,35,60,0.9) 100%)",
          borderBottom: "1px solid rgba(196,145,18,0.16)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
          backdropFilter: "blur(10px)",
        }}
        role="navigation"
        aria-label="Main"
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            height: 72,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
            onClick={() => setPage("Home")}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setPage("Home")}
            aria-label="CTS ETS Home"
          >
            <img src={NAV_LOGO} alt="CTS ETS" style={{ width: 52, height: 58, objectFit: "contain", borderRadius: 4 }} width={52} height={58} />
            <div className="nav-brand-text">
              <div style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                CTS Empowerment &amp; Training Solutions
              </div>
              <div className="nav-tagline" style={{ fontSize: 9, color: S.gold, fontFamily: S.body, letterSpacing: 1, marginTop: 2 }}>
                CALLED TO SERVE - EXCELLENCE THROUGH SERVICE
              </div>
            </div>
          </div>

          <div className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }} role="menubar">
            {NAV_GROUPS.map((g) => (
              <NavDropdown key={g.label} group={g} page={page} setPage={setPage} />
            ))}

            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "linear-gradient(180deg, #C49112 0%, #9F7411 100%)",
                color: "#0B1120",
                fontSize: 11,
                fontWeight: 800,
                fontFamily: S.body,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginLeft: 4,
                boxShadow: "0 8px 20px rgba(196,145,18,0.22)",
                transition: "all 0.2s",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Student Portal <span style={{ fontSize: 9, opacity: 0.7 }}>↗</span>
            </a>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "none",
              flexDirection: "column",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
            ))}
          </button>
        </div>

        {open && (
          <div style={{ background: "#0B1120", borderTop: "1px solid rgba(196,145,18,0.10)", padding: "8px 0 16px" }} role="menu">
            {NAV_GROUPS.map((g) => {
              if (!g.children) {
                return (
                  <button
                    key={g.label}
                    onClick={() => {
                      setPage(g.page);
                      setOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px 24px",
                      border: "none",
                      background: page === g.page ? "rgba(196,145,18,0.12)" : "transparent",
                      color: page === g.page ? "#F5D67A" : "rgba(255,255,255,0.85)",
                      fontSize: 14,
                      fontWeight: page === g.page ? 700 : 400,
                      cursor: "pointer",
                      fontFamily: S.body,
                      textAlign: "left",
                    }}
                  >
                    {g.label}
                  </button>
                );
              }

              return (
                <div key={g.label}>
                  <div
                    style={{
                      padding: "10px 24px 4px",
                      fontSize: 10,
                      color: S.gold,
                      fontFamily: S.body,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {g.label}
                  </div>

                  {g.children.map((c) => {
                    if (c.href) {
                      return (
                        <a
                          key={c.label}
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            width: "100%",
                            padding: "10px 40px",
                            background: "transparent",
                            color: "rgba(255,255,255,0.78)",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: S.body,
                            textAlign: "left",
                            textDecoration: "none",
                          }}
                        >
                          {c.label}
                          <span style={{ fontSize: 9, opacity: 0.4 }}>↗</span>
                        </a>
                      );
                    }

                    return (
                      <button
                        key={c.page}
                        onClick={() => {
                          setPage(c.page);
                          setOpen(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 40px",
                          border: "none",
                          background: page === c.page ? "rgba(196,145,18,0.12)" : "transparent",
                          color: page === c.page ? "#F5D67A" : "rgba(255,255,255,0.78)",
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: S.body,
                          textAlign: "left",
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                padding: "12px 24px",
                background: "transparent",
                color: "#F5D67A",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: S.body,
                cursor: "pointer",
                textAlign: "left",
                textDecoration: "none",
              }}
            >
              Student Portal <span style={{ fontSize: 9, opacity: 0.5 }}>↗</span>
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
