// ─── REFERRAL TRACKING SYSTEM ────────────────────────────────────────
// Each founding student gets a unique referral code
// When a referred person enrols, the referrer gets 5% off tuition
// Tracked via Apps Script backend + localStorage for offline resilience

import { APPS_SCRIPT_URL } from "../constants/config";

// Generate a unique referral code for a student
export const generateReferralCode = (studentRef) => {
  // Format: CTSETS-REF-XXXXX (based on their application reference)
  const suffix = studentRef.replace("CTSETS-", "").replace(/-/g, "").slice(-5);
  return "CTSETS-REF-" + suffix;
};

// Check if a referral code is valid (call Apps Script)
export const validateReferralCode = async (code) => {
  if (!code || code.length < 8) return { valid: false };
  try {
    const res = await fetch(APPS_SCRIPT_URL + "?action=validateReferral&code=" + encodeURIComponent(code.trim().toUpperCase()));
    if (res.ok) {
      const data = await res.json();
      return { valid: data.valid, referrerName: data.referrerName, referrerRef: data.referrerRef };
    }
  } catch (_) {}
  return { valid: false };
};

// Register a referral (call after referred person's application is submitted)
export const registerReferral = async ({ referralCode, referredName, referredEmail, referredRef, referredProgramme }) => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        form_type: "Referral Registration",
        referralCode: referralCode.trim().toUpperCase(),
        referredName,
        referredEmail,
        referredRef,
        referredProgramme,
        timestamp: new Date().toISOString(),
      }),
      mode: "no-cors",
    });
    // Also save locally for the referral dashboard
    try {
      const local = JSON.parse(localStorage.getItem("cts_referrals") || "[]");
      local.push({ code: referralCode, referredName, referredRef, date: new Date().toISOString(), status: "pending" });
      localStorage.setItem("cts_referrals", JSON.stringify(local));
    } catch (_) {}
    return { success: true };
  } catch (err) {
    console.error("Referral registration error:", err);
    return { success: false };
  }
};

// Calculate referral credit (5% of tuition per successful referral)
export const calculateReferralCredit = (tuitionAmount, referralCount) => {
  const creditPerReferral = Math.round(tuitionAmount * 0.05);
  return {
    creditPerReferral,
    totalCredit: creditPerReferral * referralCount,
    referralCount,
  };
};
