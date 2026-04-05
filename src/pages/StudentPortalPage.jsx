import React, { useState } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL, WHATSAPP_NUMBER, NAV_LOGO } from "../constants/config";

const StudentPortalPage = () => {
  const [step, setStep] = useState(1); 
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [dashboardData, setDashboardData] = useState(null);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Action name matches the backend Student Number Only logic [cite: 193]
      const resp = await fetch(`${APPS_SCRIPT_URL}?action=sendotp&identifier=${encodeURIComponent(studentId.trim().toUpperCase())}&purpose=portal`);
      const data = await resp.json();
      if (data.success) {
        setMaskedEmail(data.maskedEmail);
        setStep(2);
      } else {
        setError(data.message || "Student Number not recognized.");
      }
    } catch (err) {
      setError("System connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const verifyResp = await fetch(`${APPS_SCRIPT_URL}?action=verifyotp&identifier=${encodeURIComponent(studentId.toUpperCase())}&code=${otp.trim()}&purpose=portal`);
      const verifyData = await verifyResp.json();
      if (verifyData.success) {
        // Fetches dashboard using the specialized Student Number endpoint [cite: 193, 761]
        const dashResp = await fetch(`${APPS_SCRIPT_URL}?action=getstudentdashboard_otp&ref=${encodeURIComponent(studentId.toUpperCase())}`);
        const dashData = await dashResp.json();
        if (dashData.ok) {
          setDashboardData(dashData);
          setStep(3);
        } else {
          setError(dashData.error || "Profile load failed.");
        }
      } else {
        setError(verifyData.message || "Invalid code.");
      }
    } catch (err) {
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) return <ClassroomDashboard data={dashboardData} />;

  return (
    <div style={{ minHeight: "100vh", background: S.lightBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "440px", width: "100%", background: S.white, borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", overflow: "hidden", border: `1px solid ${S.border}` }}>
        
        {/* BRANDED HEADER SECTION [cite: 136, 154, 530] */}
        <div style={{ background: S.navy, padding: "40px 20px", textAlign: "center" }}>
          <img 
            src={NAV_LOGO} 
            alt="CTS ETS Logo" 
            style={{ height: "60px", marginBottom: "16px", borderRadius: "8px" }} 
          />
          <h2 style={{ color: S.gold, fontFamily: S.heading, margin: 0, fontSize: "26px", fontWeight: "700" }}>
            Student Classroom
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2.5px", marginTop: "8px", fontWeight: "600" }}>
            Called To Serve — Excellence Through Service
          </p>
        </div>

        <div style={{ padding: "40px 35px" }}>
          {error && (
            <div style={{ background: S.roseLight, color: S.rose, padding: "14px", borderRadius: "12px", fontSize: "13px", marginBottom: "25px", border: `1px solid ${S.rose}22`, textAlign: "center", fontWeight: "600" }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP}>
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: S.navy, textTransform: "uppercase", marginBottom: "10px", letterSpacing: "0.5px" }}>
                  Your Student Number
                </label>
                <input 
                  type="text" 
                  placeholder="CTSETSS-XXXXX" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", border: `2px solid #E2E8F0`, fontSize: "16px", outline: "none", transition: "0.2s" }}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: "100%", background: S.sky, color: S.white, padding: "18px", borderRadius: "14px", border: "none", fontWeight: "800", fontSize: "16px", cursor: "pointer", boxShadow: `0 4px 14px ${S.sky}44` }}
              >
                {loading ? "Verifying Record..." : "Enter Classroom"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin}>
              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <p style={{ fontSize: "14px", color: S.gray, marginBottom: "5px" }}>Verification code sent to:</p>
                <p style={{ fontWeight: "700", color: S.navy, fontSize: "16px" }}>{maskedEmail}</p>
              </div>
              <input 
                type="text" 
                placeholder="••••••" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{ width: "100%", padding: "16px", borderRadius: "14px", border: `2px solid ${S.teal}`, fontSize: "28px", textAlign: "center", letterSpacing: "12px", fontWeight: "900", color: S.teal, marginBottom: "25px" }}
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: "100%", background: S.teal, color: S.white, padding: "18px", borderRadius: "14px", border: "none", fontWeight: "800", fontSize: "16px", cursor: "pointer" }}
              >
                {loading ? "Unlocking Portal..." : "Verify & Start Learning"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{ width: "100%", background: "none", color: S.grayLight, border: "none", marginTop: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
              >
                Change Student Number
              </button>
            </form>
          )}

          {/* SUPPORT FOOTER */}
          <div style={{ marginTop: "35px", borderTop: `1px solid ${S.border}`, paddingTop: "25px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: S.gray, marginBottom: "8px" }}>Need help accessing your portal?</p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noreferrer" 
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: S.emerald, fontSize: "14px", fontWeight: "700", textDecoration: "none" }}
            >
              <span>WhatsApp Support</span>
              <span style={{ fontSize: "18px" }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassroomDashboard = ({ data }) => {
  return (
    <div style={{ padding: "50px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${S.navy}11`, paddingBottom: "20px", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontFamily: S.heading, color: S.navy, fontSize: "32px", margin: 0 }}>Welcome, {data.profile.firstName}</h1>
          <p style={{ color: S.gray, margin: "5px 0 0" }}>Student ID: <strong>{data.profile.studentNumber}</strong></p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: S.goldLight, color: S.goldDark, padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "800" }}>
            {data.profile.status}
          </div>
        </div>
      </div>
      
      {/* MODULE CARDS WOULD RENDER HERE [cite: 717, 722] */}
      <div style={{ background: S.white, padding: "30px", borderRadius: "20px", border: `1px solid ${S.border}`, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        <h3 style={{ color: S.navy, marginBottom: "15px" }}>Your Progress</h3>
        <p>Programme: <strong>{data.profile.programme}</strong></p>
        <div style={{ marginTop: "20px", height: "12px", background: "#EDF2F7", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ width: `${(data.progress / data.curriculum.length) * 100}%`, height: "100%", background: S.emerald }}></div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortalPage;