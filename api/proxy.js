const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZEjUdBknkb-TpUKzufai0DWjG6HPJyR2mZsmjmiapWHTudJX51ZAEpxodw_AZQC4BFA/exec";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // Forward query params to Apps Script
      const params = new URLSearchParams(req.query);
      const url = APPS_SCRIPT_URL + "?" + params.toString();
      const response = await fetch(url, { redirect: "follow" });
      const text = await response.text();
      
      try {
        const json = JSON.parse(text);
        return res.status(200).json(json);
      } catch {
        return res.status(200).send(text);
      }
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        redirect: "follow",
      });
      const text = await response.text();

      try {
        const json = JSON.parse(text);
        return res.status(200).json(json);
      } catch {
        return res.status(200).send(text);
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + err.message });
  }
}
