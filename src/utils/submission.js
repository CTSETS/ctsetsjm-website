import { APPS_SCRIPT_URL } from "../constants/config";
export const fileToBase64 = (slot, file) => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve({ slot, name: file.name, originalName: file.name, type: file.type, data: r.result.split(",")[1] }); r.onerror = reject; r.readAsDataURL(file); });
export const submitToAppsScript = async (formData, fileMap) => {
  try {
    const files = [];
    for (const [slot, file] of Object.entries(fileMap)) { if (file) { try { files.push(await fileToBase64(slot, file)); } catch {} } }
    const payload = JSON.stringify({ ...formData, files });
    try { const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: payload }); if (res.ok) { try { const json = await res.json(); if (json.duplicate) return { success: false, duplicate: true, message: json.message, existingRef: json.existingRef }; return { success: true, ref: json.ref }; } catch { return { success: true }; } } } catch {}
    try { await fetch(APPS_SCRIPT_URL, { method: "POST", body: payload, mode: "no-cors" }); return { success: true }; } catch {}
    // Fallback: queue in localStorage for retry
    try { const q = JSON.parse(localStorage.getItem("cts_submit_queue") || "[]"); q.push({ payload, timestamp: Date.now() }); localStorage.setItem("cts_submit_queue", JSON.stringify(q)); return { success: true, queued: true }; } catch {}
    return { success: false };
  } catch (err) { console.error("Submit error:", err); return { success: false }; }
};
export const generateRef = () => { var d = new Date(); var yr = d.getFullYear(); var mth = String(d.getMonth() + 1).padStart(2, "0"); var num = String(Math.floor(10000 + Math.random() * 90000)); return "CTSETS-" + yr + "-" + mth + "-" + num; };
// Retry queued submissions on load
export const retryQueuedSubmissions = async () => {
  try {
    const q = JSON.parse(localStorage.getItem("cts_submit_queue") || "[]");
    if (!q.length) return;
    const remaining = [];
    for (const item of q) { try { const r = await fetch(APPS_SCRIPT_URL, { method: "POST", body: item.payload }); if (!r.ok) remaining.push(item); } catch { remaining.push(item); } }
    localStorage.setItem("cts_submit_queue", JSON.stringify(remaining));
  } catch {}
};
