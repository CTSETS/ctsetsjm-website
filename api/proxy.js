const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZEjUdBknkb-TpUKzufai0DWjG6HPJyR2mZsmjmiapWHTudJX51ZAEpxodw_AZQC4BFA/exec";

// Admin credentials — validated server-side in the proxy
const ADMIN_PASSWORDS = ["CtsAdmin2026", "Detailed1982"];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const query = { ...req.query };
      const action = (query.action || "").toLowerCase();

      const adminActions = ["admindashboard","adminlistapps","adminliststudents","adminlistpayments","adminacceptapp","adminrejectapp","adminenrollstudent","adminresetpw","adminauditlog","verifypayment","rejectpayment","generaterecord"];

      if (adminActions.includes(action)) {
        let isAuthorized = false;
        let debugData = {}; // We will use this to see what the frontend sent

        for (const key in query) {
          let val = String(query[key]).trim();
          let decodedVal = decodeURIComponent(val); // Fixes %21 instead of !
          
          debugData[key] = decodedVal; // Save to show you on screen

          if (ADMIN_PASSWORDS.includes(val) || ADMIN_PASSWORDS.includes(decodedVal)) {
            isAuthorized = true;
            delete query[key]; 
          }
        }

        if (!isAuthorized) {
          // DIAGNOSTIC ERROR MESSAGE: This will print the exact data to your screen
          return res.status(200).json({ 
            ok: false, 
            error: "DEBUG: " + JSON.stringify(debugData) 
          });
        }

        delete query.v;
        query.proxysig = "Detailed1982";
      }

      const params = new URLSearchParams(query);
      const url = APPS_SCRIPT_URL + "?" + params.toString();

      let response = await fetch(url, { redirect: "manual" });
      let redirectCount = 0;
      while (response.status >= 300 && response.status < 400 && redirectCount < 5) {
        const location = response.headers.get("location");
        if (!location) break;
        response = await fetch(location, { redirect: "manual" });
        redirectCount++;
      }

      const text = await response.text();
      try { return res.status(200).json(JSON.parse(text)); } 
      catch { return res.status(200).send(text); }
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
      try { return res.status(200).json(JSON.parse(text)); } 
      catch { return res.status(200).send(text); }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + err.message });
  }
}