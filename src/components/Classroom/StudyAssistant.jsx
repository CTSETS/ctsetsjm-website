import React, { useState, useRef, useEffect } from "react";
import S from "../../constants/styles";
import { APPS_SCRIPT_URL } from "../../constants/config"; //

export default function StudyAssistant({ programme, currentModule }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: `Hello! I am your CTS ETS Study Assistant. What questions do you have about ${currentModule || programme}?` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      const context = `${programme} - ${currentModule || "General"}`;
      const res = await fetch(`${APPS_SCRIPT_URL}?action=askai&prompt=${encodeURIComponent(userText)}&context=${encodeURIComponent(context)}`);
      const data = await res.json();

      if (data.ok) {
        setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: "error", text: data.error || "Sorry, I am having trouble connecting." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "error", text: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Chat toggle button (floats bottom right)
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{ position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px", borderRadius: "50%", background: S.teal, color: S.white, border: "none", boxShadow: "0 8px 24px rgba(14,143,139,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      >
        <span style={{ fontSize: "28px" }}>🤖</span>
      </button>
    );
  }

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", width: "350px", height: "500px", background: S.white, borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1000, border: `1px solid ${S.border}` }}>
      
      {/* Header */}
      <div style={{ background: S.navy, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🤖</span>
          <div>
            <div style={{ color: S.gold, fontWeight: "700", fontSize: "14px", fontFamily: S.heading }}>Intelligent Study Assistant</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>Powered by AI • 24/7 Support</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: S.white, fontSize: "16px", cursor: "pointer" }}>✕</button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", background: S.lightBg, display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{ fontSize: "10px", color: S.gray, marginBottom: "4px", textAlign: msg.role === "user" ? "right" : "left" }}>
              {msg.role === "user" ? "You" : msg.role === "error" ? "System" : "Study Assistant"}
            </div>
            <div style={{ 
              padding: "12px 16px", 
              borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
              background: msg.role === "user" ? S.sky : msg.role === "error" ? S.roseLight : S.white,
              color: msg.role === "user" ? S.white : msg.role === "error" ? S.roseDark : S.navy,
              border: msg.role === "user" ? "none" : `1px solid ${msg.role === "error" ? S.rose : S.border}`,
              fontSize: "13px", fontFamily: S.body, lineHeight: "1.5"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: "16px 16px 16px 0", background: S.white, border: `1px solid ${S.border}`, color: S.gray, fontSize: "13px" }}>
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ padding: "12px", background: S.white, borderTop: `1px solid ${S.border}`, display: "flex", gap: "8px" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..." 
          disabled={isTyping}
          style={{ flex: 1, padding: "12px", borderRadius: "20px", border: `1px solid ${S.border}`, outline: "none", fontSize: "13px", fontFamily: S.body, background: S.lightBg }}
        />
        <button type="submit" disabled={isTyping || !input.trim()} style={{ background: input.trim() ? S.teal : S.border, color: S.white, border: "none", borderRadius: "50%", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", transition: "0.2s" }}>
          ➤
        </button>
      </form>
    </div>
  );
}