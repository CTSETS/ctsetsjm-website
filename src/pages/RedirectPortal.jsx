// RedirectPortal.jsx
// Replace the existing StudentPortal page on ctsetsjm.com
// Redirects users to ets.ctsgroup.app/portal

import { useEffect } from "react";

export default function RedirectPortal() {
  useEffect(() => {
    window.location.href = "https://ets.ctsgroup.app/portal";
  }, []);

  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      color: "#0a1628",
      textAlign: "center",
      padding: "2rem"
    }}>
      <p style={{ fontSize: "16px", marginBottom: "12px" }}>
        Redirecting to Student Portal...
      </p>
      <a
        href="https://ets.ctsgroup.app/portal"
        style={{
          color: "#C5A23E",
          fontWeight: 600,
          textDecoration: "underline"
        }}
      >
        Click here if not redirected
      </a>
    </div>
  );
}
