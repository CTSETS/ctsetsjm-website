import { USD_RATE } from "../constants/config";
export const fmt = (n) => "J$" + Math.round(n).toLocaleString();
export const dualPrice = (jmdAmount) => {
  const num = typeof jmdAmount === "string" ? parseInt(jmdAmount.replace(/[^0-9]/g, "")) : jmdAmount;
  if (isNaN(num)) return "—";
  return "US$" + Math.round(num / USD_RATE).toLocaleString() + " (J$" + Math.round(num).toLocaleString() + ")";
};
export const payFmt = (jmdAmount, cur) => {
  const num = typeof jmdAmount === "number" ? jmdAmount : parseInt(String(jmdAmount).replace(/[^0-9]/g, ""));
  if (cur === "usd") return "US$" + Math.round(num / USD_RATE).toLocaleString();
  return "J$" + Math.round(num).toLocaleString();
};
export const fmtDate = (dateStr) => {
  if (!dateStr) return "";
  var d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
};
