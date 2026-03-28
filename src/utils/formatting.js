import { USD_RATE } from "../constants/config";
export const fmt = (n) => "$" + Math.round(n).toLocaleString();
export const dualPrice = (jmdAmount) => {
  const num = typeof jmdAmount === "string" ? parseInt(jmdAmount.replace(/[$,]/g, "")) : jmdAmount;
  if (isNaN(num)) return "—";
  return "US$" + Math.round(num / USD_RATE).toLocaleString() + " (J$" + Math.round(num).toLocaleString() + ")";
};
export const payFmt = (jmdAmount, cur) => {
  const num = typeof jmdAmount === "number" ? jmdAmount : parseInt(String(jmdAmount).replace(/[$,]/g, ""));
  if (cur === "usd") return "US$" + Math.round(num / USD_RATE).toLocaleString();
  return "J$" + Math.round(num).toLocaleString();
};
