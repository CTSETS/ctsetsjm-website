const env = (key, fallback) => {
  try { return import.meta.env[key] || fallback; } catch { return fallback; }
};

export const NAV_LOGO = "/logo.jpg";
export const HERO_LOGO = "/logo.jpg";
export const HEART_LOGO = "/HEART%20Logo.jpg";
export const NCTVET_LOGO = "/NCTVET%20Logo.jpg";
export const FOUNDER_PHOTO = "/Lead%20Facilitator.jpg";

// 👇 Paste your Google Apps Script URL here! (Must end in /exec)
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzC3HXsZj4LJS3FgaASU8UFliHc_aIqA_qYMr4dqasdSoYzwSplVAF9zJeu9AE_-gseIA/exec";

export const EMAILJS_KEY = env("VITE_EMAILJS_KEY", "");
export const EMAILJS_SERVICE = env("VITE_EMAILJS_SERVICE", "");
export const EMAILJS_TEMPLATE = env("VITE_EMAILJS_TEMPLATE", "");

export const USD_RATE = 155;
export const REG_FEE = 5000;

// 👇 External platform URLs — these now point to the CTS Group platform
export const PORTAL_URL = "https://ets.ctsgroup.app/student-portal";
export const LEARNING_PORTAL_URL = "https://ets.ctsgroup.app/student-portal";
export const APPLY_URL = "https://ets.ctsgroup.app/apply";
export const TRACK_URL = "https://ets.ctsgroup.app/track";
export const PAYMENT_URL = "https://ets.ctsgroup.app/pay";
export const ADMIN_URL = "https://ets.ctsgroup.app";

export const BOOKING_URLS = {
  general: "https://calendar.app.google/zPKr4G5hdCcbTgdj9",
  payment: "https://calendar.app.google/NBJVeEe1WhwvQXXC7",
  academic: "https://calendar.app.google/dAEuRwjV743izwJM8",
  employer: "https://calendar.app.google/wpLUXKRdWzwY7P929"
};

export const WIPAY_CONFIG = {
  accountNumber: env("VITE_WIPAY_ACCOUNT", ""),
  apiKey: env("VITE_WIPAY_KEY", ""),
  sandbox: false,
  fee: 0.035,
  baseUrl: "https://jm.wipayfinancial.com/to_me/cts_empowerment_and_training_solutions",
  currency: "JMD",
  country: "JM",
  returnUrl: "https://ets.ctsgroup.app/student-portal",
  cancelUrl: "https://ets.ctsgroup.app/student-portal"
};

export const BANK_DETAILS = {
  jmd: {
    bank: "Bank of Nova Scotia (Scotiabank)",
    accountName: "Mark Lindo",
    tradingAs: "CTS Empowerment & Training Solutions",
    accountNumber: "001042411",
    branch: "50765",
    accountType: "Savings",
    currency: "JMD",
    comingSoon: false
  },
  usd: {
    bank: "Bank of Nova Scotia (Scotiabank)",
    accountName: "Mark Lindo",
    tradingAs: "CTS Empowerment & Training Solutions",
    accountNumber: "",
    accountType: "Savings (USD)",
    currency: "USD",
    swiftCode: "",
    comingSoon: true
  }
};

// 👇 Removed Apply, Pay, Student Portal — they now live on ets.ctsgroup.app
export const PAGES = ["Home","About","Why Choose","Programmes","Fees & Calculator","For Employers","International","Student Journey","Contact","Verify Certificate","Feedback","FAQ","Privacy","Terms"];

export const SECURITY_BADGES = ["🔒 256-bit SSL","🛡️ PCI DSS Level 1","✅ 3D Secure","💳 Visa / Mastercard","🏦 USD & JMD"];

export const WHATSAPP_NUMBER = "8763819771";

export const WHATSAPP_MESSAGES = {
  Home: "Hello CTS ETS, I'd like to learn more about your programmes.",
  Programmes: "Hi, I'm browsing your programmes and have a question.",
  "Fees & Calculator": "Hi, I have a question about fees and payment plans.",
  Contact: "Hello, I'd like to speak with someone.",
  International: "Hi, I'm an international student interested in CTS ETS.",
  "For Employers": "Hi, I'm interested in the employer group discount.",
  default: "Hello CTS ETS, I have a question."
};
