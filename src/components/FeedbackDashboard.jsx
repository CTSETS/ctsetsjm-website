import React, { useState, useEffect } from "react";
import S from "../constants/styles";
import { APPS_SCRIPT_URL } from "../constants/config";

const FeedbackDashboard = ({ adminPassword }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const resp = await fetch(`${APPS_SCRIPT_URL}?action=adminfeedback&pw=${encodeURIComponent(adminPassword)}`);
        const data = await resp.json();
        if (data.ok) setFeedback(data.feedback);
      } catch (err) {
        console.error("Failed to load feedback", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [adminPassword]);

  if (loading) return <div>Loading Satisfaction Data...</div>;
  if (!feedback.length) return <div>No feedback recorded yet.</div>;

  // Calculate Metrics
  const avgRating = (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1);
  const promoters = feedback.filter(f => f.recommend === "Yes").length;
  const npsScore = Math.round((promoters / feedback.length) * 100);

  return (
    <div style={{ padding: "20px", fontFamily: S.body }}>
      <h2 style={{ color: S.navy, fontFamily: S.heading }}>Student Satisfaction Overview</h2>
      
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: S.white, padding: "20px", borderRadius: "12px", border: `1px solid ${S.border}`, textAlign: "center" }}>
          <div style={{ color: S.gray, fontSize: "14px", textTransform: "uppercase" }}>Average Rating</div>
          <div style={{ color: S.gold, fontSize: "42px", fontWeight: "bold" }}>{avgRating}<span style={{fontSize:"24px"}}>/5</span></div>
        </div>
        <div style={{ background: S.white, padding: "20px", borderRadius: "12px", border: `1px solid ${S.border}`, textAlign: "center" }}>
          <div style={{ color: S.gray, fontSize: "14px", textTransform: "uppercase" }}>Willing to Recommend</div>
          <div style={{ color: S.teal, fontSize: "42px", fontWeight: "bold" }}>{npsScore}%</div>
        </div>
        <div style={{ background: S.white, padding: "20px", borderRadius: "12px", border: `1px solid ${S.border}`, textAlign: "center" }}>
          <div style={{ color: S.gray, fontSize: "14px", textTransform: "uppercase" }}>Total Responses</div>
          <div style={{ color: S.navy, fontSize: "42px", fontWeight: "bold" }}>{feedback.length}</div>
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <h3 style={{ color: S.navy, borderBottom: `2px solid ${S.border}`, paddingBottom: "10px" }}>Recent Student Comments</h3>
      <div style={{ display: "grid", gap: "15px" }}>
        {feedback.slice(0, 10).map((f, idx) => (
          <div key={idx} style={{ background: S.lightBg, padding: "20px", borderRadius: "12px", borderLeft: `4px solid ${f.rating >= 4 ? S.emerald : S.coral}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <strong style={{ color: S.navy }}>{f.name} ({f.programme})</strong>
              <span style={{ color: S.gold }}>{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span>
            </div>
            {f.whatWorked && <p style={{ fontSize: "13px", color: S.gray, margin: "5px 0" }}><strong>Worked well:</strong> {f.whatWorked}</p>}
            {f.whatToImprove && <p style={{ fontSize: "13px", color: S.gray, margin: "5px 0" }}><strong>To Improve:</strong> {f.whatToImprove}</p>}
            {f.testimonial && <p style={{ fontSize: "13px", color: S.tealDark, fontStyle: "italic", marginTop: "10px" }}>"{f.testimonial}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDashboard;