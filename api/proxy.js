const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZEjUdBknkb-TpUKzufai0DWjG6HPJyR2mZsmjmiapWHTudJX51ZAEpxodw_AZQC4BFA/exec";

// Admin credentials — validated server-side in the proxy
const ADMIN_PASSWORDS = ["CtsAdmin2026!", "Detailed1982"];

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

      // Admin actions: validate password in the proxy, then forward with internal token
      const adminActions = ["admindashboard","adminlistapps","adminliststudents","adminlistpayments","adminacceptapp","adminrejectapp","adminenrollstudent","adminresetpw","adminauditlog","verifypayment","rejectpayment","generaterecord"];

      if (adminActions.includes(action)) {
        // We added query.pw and query.password so the proxy catches what the frontend sends!
        const pw = query.akey || query.key || query.auth || query.adminpw || query.pw || query.password || "";
        
        if (!ADMIN_PASSWORDS.includes(pw)) {
          return res.status(200).json({ ok: false, error: "Invalid password" });
        }
        
        // Remove all auth params — don't send them to Google (they get stripped anyway)
        delete query.akey;
        delete query.key;
        delete query.auth;
        delete query.adminpw;
        delete query.pw;
        delete query.password;
        delete query.v;
        
        // Add the safe internal token that Code.gs is now looking for
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
      try {
        return res.status(200).json(JSON.parse(text));
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
        return res.status(200).json(JSON.parse(text));
      } catch {
        return res.status(200).send(text);
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + err.message });
  }
}