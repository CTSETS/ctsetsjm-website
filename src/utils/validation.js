export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone) => { var d = phone.replace(/\D/g, ""); return d.length >= 10 && d.length <= 15 && /^\d{3}/.test(d); };
export const validateTRN = (trn) => trn.replace(/\D/g, "").length === 9;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const validateFileSize = (file) => file && file.size <= MAX_FILE_SIZE;
const EMAIL_DOMAINS = ["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com","live.com","msn.com","aol.com","ymail.com","mail.com","protonmail.com"];
export const suggestEmail = (email) => {
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[1]) return null;
  const domain = parts[1].toLowerCase();
  if (EMAIL_DOMAINS.includes(domain)) return null;
  for (const d of EMAIL_DOMAINS) {
    let diff = 0;
    const shorter = domain.length <= d.length ? domain : d;
    const longer = domain.length > d.length ? domain : d;
    if (Math.abs(domain.length - d.length) > 2) continue;
    for (let i = 0; i < shorter.length; i++) if (shorter[i] !== longer[i]) diff++;
    diff += longer.length - shorter.length;
    if (diff > 0 && diff <= 2) return parts[0] + "@" + d;
  }
  return null;
};
