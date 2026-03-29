// ─── SMART PAYMENT FLOW ─────────────────────────────────────────────
// Only shows "Pay Online" when WiPay API key is actually configured
// Otherwise shows upload-only flow with clear bank details
// Lookup-first: student enters email → we find their application → show amount → pay
import S from "../../constants/styles";
import { WIPAY_CONFIG } from "../../constants/config";

// Check if online payments are actually available
export const isOnlinePaymentAvailable = () => !!WIPAY_CONFIG.apiKey;

// Payment method selector — adapts based on WiPay readiness
export function PaymentMethodSelector({ method, setMethod }) {
  const online = isOnlinePaymentAvailable();
  return (
    <div style={{ display: "flex", background: S.lightBg, borderRadius: 10, padding: 4, border: "1px solid rgba(1,30,64,0.08)", justifyContent: "center" }} className="payment-tabs">
      {online && (
        <button onClick={() => setMethod("online")} style={{
          flex: 1, padding: "11px 24px", borderRadius: 8, border: "none",
          background: method === "online" ? S.navy : "transparent",
          color: method === "online" ? "#fff" : S.gray,
          fontSize: 13, fontWeight: method === "online" ? 700 : 500,
          cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap",
        }}>💳 Pay Online</button>
      )}
      <button onClick={() => setMethod("upload")} style={{
        flex: 1, padding: "11px 24px", borderRadius: 8, border: "none",
        background: method === "upload" ? S.navy : "transparent",
        color: method === "upload" ? "#fff" : S.gray,
        fontSize: 13, fontWeight: method === "upload" ? 700 : 500,
        cursor: "pointer", fontFamily: S.body, whiteSpace: "nowrap",
      }}>📤 {online ? "Upload Evidence" : "Bank Transfer & Upload Receipt"}</button>
    </div>
  );
}

// Notice shown when WiPay is not configured — replaces the broken "Pay Online" flow
export function PaymentSetupNotice() {
  if (isOnlinePaymentAvailable()) return null;
  return (
    <div style={{ padding: "16px 20px", borderRadius: 10, background: S.amberLight, border: "1px solid " + S.amber + "30", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>💳</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: S.amberDark, fontFamily: S.body }}>Payment Options</span>
      </div>
      <p style={{ fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6, margin: 0 }}>
        Pay by <strong>bank transfer</strong> (NCB — JMD or USD account) then upload your receipt below. Online card payments will be available soon. Contact <strong>admin@ctsetsjm.com</strong> or <strong>876-381-9771</strong> for payment assistance.
      </p>
    </div>
  );
}
