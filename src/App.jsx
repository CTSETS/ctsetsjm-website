import { useState, useEffect, useCallback, Component, Suspense, lazy } from "react";
import S from "./constants/styles";
import { PAGES, APPS_SCRIPT_URL, EMAILJS_KEY, APPLY_URL, PAYMENT_URL, PORTAL_URL, ADMIN_URL } from "./constants/config";
import { retryQueuedSubmissions } from "./utils/submission";
import { initGA4, trackPageView } from "./utils/analytics";
import "./styles/global.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ScrollNav, WhatsAppBtn, OfflineBanner, CookieBanner } from "./components/layout/LayoutUtilities";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProgrammesPage = lazy(() => import("./pages/ProgrammesPage"));
const FeesPage = lazy(() => import("./pages/FeesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const WhyChoosePage = lazy(() => import("./pages/WhyChoosePage"));
const EmployersPage = lazy(() => import("./pages/EmployersPage"));
const InternationalPage = lazy(() => import("./pages/InternationalPage"));
const StudentJourneyPage = lazy(() => import("./pages/StudentJourneyPage"));
const VerifyCertificatePage = lazy(() => import("./pages/VerifyCertificatePage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AIUsagePolicyPage = lazy(() => import("./pages/AIUsagePolicyPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// 🔀 Redirect map — old hash routes → external platform URLs
const EXTERNAL_REDIRECTS = {
  "apply": APPLY_URL,
  "pay": PAYMENT_URL,
  "student portal": PORTAL_URL,
  "student-portal": PORTAL_URL,
  "admin": ADMIN_URL,
};

function PageLoader() {
  return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid " + S.gold + "30", borderTopColor: S.gold, animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} /><p style={{ fontFamily: S.body, fontSize: 13, color: S.gray }}>Loading...</p></div><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>;
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e, i) { console.error("CTS ETS Error:", e, i); }
  render() {
    if (this.state.hasError) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.body, background: S.lightBg, padding: 24 }}><div style={{ textAlign: "center", maxWidth: 480 }}><div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div><h1 style={{ fontFamily: S.heading, fontSize: 28, color: S.navy, marginBottom: 12 }}>Something went wrong</h1><p style={{ fontSize: 15, color: S.gray, marginBottom: 24 }}>Please refresh the page.</p><button onClick={() => window.location.reload()} style={{ padding: "14px 32px", borderRadius: 8, background: S.coral, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Refresh</button></div></div>;
    return this.props.children;
  }
}

const TITLES = {
  Home: "CTS ETS — Jamaica's Digital Vocational School",
  About: "About CTS ETS",
  "Why Choose": "Why Choose CTS ETS",
  Programmes: "Programmes | CTS ETS",
  "Fees & Calculator": "Student Finance | CTS ETS",
  "For Employers": "For Employers | CTS ETS",
  "Student Journey": "Student Journey | CTS ETS",
  Contact: "Contact Us | CTS ETS",
  International: "International Students | CTS ETS",
  "Verify Certificate": "Verify Certificate | CTS ETS",
  Feedback: "Feedback | CTS ETS",
  "AI Policy": "AI Usage Policy | CTS ETS",
  Privacy: "Privacy Policy | CTS ETS",
  Terms: "Terms & Conditions | CTS ETS"
};

// 🔀 Check if hash matches an external redirect and send user there
function checkExternalRedirect() {
  const rawHash = window.location.hash.split("?")[0];
  const hash = rawHash.replace("#", "").replace(/-/g, " ").toLowerCase();
  const url = EXTERNAL_REDIRECTS[hash];
  if (url) {
    window.location.href = url;
    return true;
  }
  return false;
}

function resolvePageFromHash() {
  const rawHash = window.location.hash.split("?")[0];
  const hash = rawHash.replace("#", "").replace(/-/g, " ");
  if (hash.toLowerCase() === "design preview") return "Home";
  return PAGES.find(p => p.toLowerCase() === hash.toLowerCase()) || "Home";
}

export default function CTSApp() {
  const [page, setPage] = useState(() => {
    // 🔀 If hash matches an external route, redirect immediately
    if (checkExternalRedirect()) return "Home";

    return resolvePageFromHash();
  });

  const [transitioning, setTransitioning] = useState(false);

  // 🔀 Map for setPage() calls that should redirect externally
  const PAGE_REDIRECTS = {
    "Apply": APPLY_URL,
    "Pay": PAYMENT_URL,
    "Student Portal": PORTAL_URL,
    "Admin": ADMIN_URL,
  };

  const navigate = useCallback((p) => {
    // 🔀 Intercept pages that now live on ets.ctsgroup.app
    if (PAGE_REDIRECTS[p]) {
      window.open(PAGE_REDIRECTS[p], "_blank", "noopener,noreferrer");
      return;
    }

    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      window.history.pushState(null, "", p === "Home" ? window.location.pathname : "#" + p.toLowerCase().replace(/ /g, "-"));
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => {
        const el = document.getElementById("main-content");
        if (el) el.focus({ preventScroll: true });
        setTransitioning(false);
      }, 50);
    }, 150);
  }, []);

  useEffect(() => {
    const onPop = () => {
      // 🔀 Check external redirects on back/forward navigation too
      if (checkExternalRedirect()) return;

      setPage(resolvePageFromHash());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => { document.title = TITLES[page] || "CTS ETS"; }, [page]);
  useEffect(() => { initGA4(); }, []);
  useEffect(() => { trackPageView(page); }, [page]);
  useEffect(() => { retryQueuedSubmissions(); }, []);

  useEffect(() => {
    if (!EMAILJS_KEY || document.getElementById("emailjs-sdk")) return;
    const s = document.createElement("script");
    s.id = "emailjs-sdk"; s.async = true;
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => {
      if (window.emailjs) {
        try { window.emailjs.init({ publicKey: EMAILJS_KEY }); } catch { window.emailjs.init(EMAILJS_KEY); }
      }
    };
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!APPS_SCRIPT_URL) return;
    try {
      const d = window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop";
      fetch(APPS_SCRIPT_URL + "?action=track&page=" + encodeURIComponent(page) + "&device=" + d).catch(() => {});
    } catch {}
  }, [page]);

  const renderPage = () => {
    const p = { setPage: navigate };
    switch (page) {
      case "Home": return <HomePage {...p} />;
      case "About": return <AboutPage {...p} />;
      case "Why Choose": return <WhyChoosePage {...p} />;
      case "Programmes": return <ProgrammesPage {...p} />;
      case "Fees & Calculator": return <FeesPage {...p} />;
      case "For Employers": return <NotFoundPage {...p} />;
      case "Student Journey": return <StudentJourneyPage {...p} />;
      case "Contact": return <ContactPage {...p} />;
      case "International": return <NotFoundPage {...p} />;
      case "Verify Certificate": return <VerifyCertificatePage {...p} />;
      case "Feedback": return <FeedbackPage {...p} />;      case "AI Policy": return <AIUsagePolicyPage />;
      case "Privacy": return <PrivacyPage />;
      case "Terms": return <TermsPage />;
      default: return <NotFoundPage {...p} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="site-shell" style={{ fontFamily: S.body, WebkitFontSmoothing: "antialiased" }}>
        <OfflineBanner />
        <Navbar page={page} setPage={navigate} />
        <Suspense fallback={<PageLoader />}>
          <div key={page} style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease"
          }}>
            {renderPage()}
          </div>
        </Suspense>
        <Footer setPage={navigate} />
        <ScrollNav />
        <WhatsAppBtn currentPage={page} />
        <CookieBanner setPage={navigate} />
      </div>
    </ErrorBoundary>
  );
}


