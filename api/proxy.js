const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZEjUdBknkb-TpUKzufai0DWjG6HPJyR2mZsmjmiapWHTudJX51ZAEpxodw_AZQC4BFA/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Debug mode — shows what the proxy receives
    if (req.query && req.query.action === "proxydebug") {
      return res.status(200).json({
        method: req.method,
        query: req.query,
        url: req.url,
        rawUrl: APPS_SCRIPT_URL + "?" + new URLSearchParams(req.query).toString()
      });
    }

    if (req.method === "GET") {
      const params = new URLSearchParams(req.query);
      const url = APPS_SCRIPT_URL + "?" + params.toString();
      
      // Use manual redirect following to preserve params
      let response = await fetch(url, { redirect: "manual" });
      
      // Follow redirects manually
      let redirectCount = 0;
      while (response.status >= 300 && response.status < 400 && redirectCount < 5) {
        const location = response.headers.get("location");
        if (!location) break;
        response = await fetch(location, { redirect: "manual" });
        redirectCount++;
      }
      
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
      
      let response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        redirect: "manual",
      });
      
      let redirectCount = 0;
      while (response.status >= 300 && response.status < 400 && redirectCount < 5) {
        const location = response.headers.get("location");
        if (!location) break;
        response = await fetch(location, { redirect: "manual" });
        redirectCount++;
      }
      
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
