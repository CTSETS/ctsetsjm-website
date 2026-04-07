import React, { useState, useEffect } from "react";

// Theme colours to match your portal
const T = {
  navy: "#011E40", gold: "#C8A951", white: "#FFFFFF", 
  gray: "#4B5563", border: "rgba(1,30,64,0.1)",
  coral: "#EA580C", cream: "#F3F4F6", emerald: "#059669"
};
const f = { display: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif" };

// The Master List of 15 Orientation Quiz Questions
const BASE_QUESTIONS = [
  { id: 1, q: "What is the primary delivery method for CTS ETS programmes?", options: ["In-person on weekends", "Blended (half online, half in-person)", "100% online through a digital campus", "Through mailed paper textbooks"], correct: "100% online through a digital campus" },
  { id: 2, q: "The NVQ-J certification you earn is recognised in how many Commonwealth countries?", options: ["Only in Jamaica", "15 countries", "53+ countries", "Only in the USA"], correct: "53+ countries" },
  { id: 3, q: "When logging in, you will receive an OTP. What does OTP stand for?", options: ["Online Training Portal", "One-Time Password", "Official Transcript Printout", "Orientation Test Phase"], correct: "One-Time Password" },
  { id: 4, q: "What must you do at the end of this orientation to permanently unlock Module 1?", options: ["Email the instructor", "Pass the Knowledge Check with 70% or higher", "Pay a fee", "Wait 48 hours"], correct: "Pass the Knowledge Check with 70% or higher" },
  { id: 5, q: "Where do you submit digital links (like Google Drive or YouTube) for your practical assignments?", options: ["My Finances tab", "Email them to support", "The NCTVET Portfolio tab", "My Profile tab"], correct: "The NCTVET Portfolio tab" },
  { id: 6, q: "What dictates the ultimate deadline for completing your self-paced programme?", options: ["I have unlimited time.", "My Valid Term (printed on my Digital Student ID).", "The end of the calendar year.", "Whenever I feel like finishing."], correct: "My Valid Term (printed on my Digital Student ID)." },
  { id: 7, q: "If you need a timeline extension, who must you contact BEFORE your Valid Term expires?", options: ["The IT Support Team", "The Finance Office", "The Administration Office", "The Student Success Team"], correct: "The Administration Office" },
  { id: 8, q: "What is the minimum score required on module Knowledge Checks to earn your badge and unlock the next section?", options: ["50%", "60%", "70%", "100%"], correct: "70%" },
  { id: 9, q: "If you score below the required passing grade on a Knowledge Check, what happens?", options: ["You are expelled from the course.", "You must pay to retake it.", "Retakes are always allowed so you can try again.", "You skip that module."], correct: "Retakes are always allowed so you can try again." },
  { id: 10, q: "What happens if you submit someone else's work (plagiarism)?", options: ["I will get a warning.", "I will lose 10 points.", "Automatic module failure and enrollment review.", "Nothing, as long as it looks good."], correct: "Automatic module failure and enrollment review." },
  { id: 11, q: "How are you allowed to use the 24/7 AI Study Assistant?", options: ["To write my final assignments for me.", "To brainstorm, explain concepts, and practice scenarios.", "To take my Knowledge Checks.", "To generate practical portfolio evidence."], correct: "To brainstorm, explain concepts, and practice scenarios." },
  { id: 12, q: "If your payment plan falls into arrears (you miss a payment), what happens?", options: ["My portal access is temporarily restricted until cleared.", "I am permanently kicked out.", "Nothing happens.", "I get a discount."], correct: "My portal access is temporarily restricted until cleared." },
  { id: 13, q: "For security purposes, the portal will automatically log you out after how many minutes of inactivity?", options: ["5 minutes", "14 minutes", "30 minutes", "60 minutes"], correct: "14 minutes" },
  { id: 14, q: "If you are having technical issues with your OTP or portal glitches, which department should you email?", options: ["assessment@ctsetsjm.com", "finance@ctsetsjm.com", "support@ctsetsjm.com", "administration@ctsetsjm.com"], correct: "support@ctsetsjm.com" },
  { id: 15, q: "Do you need to go to the Apple App Store or Google Play Store to download the CTS ETS app?", options: ["Yes, search for it in the App Store.", "No, you install it directly from your web browser to your home screen.", "Yes, but only on Android.", "We do not have mobile access."], correct: "No, you install it directly from your web browser to your home screen." }
];

// Fisher-Yates Array Shuffle Algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function GatewayQuiz({ onPass }) {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize and Shuffle the Quiz
  const setupQuiz = () => {
    // 1. Shuffle the multiple-choice options for EVERY question
    const questionsWithOptionsShuffled = BASE_QUESTIONS.map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options)
    }));
    
    // 2. Shuffle the order of the 15 questions themselves
    setActiveQuestions(shuffleArray(questionsWithOptionsShuffled));
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // Run the setup when the component first loads
  useEffect(() => {
    setupQuiz();
  }, []);

  const handleSelect = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    activeQuestions.forEach((question) => {
      if (answers[question.id] === question.correct) {
        correctCount++;
      }
    });
    
    // Calculate the percentage
    const finalScore = Math.round((correctCount / activeQuestions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    // If they score 70% or higher, trigger the unlock!
    if (finalScore >= 70) {
      setTimeout(() => {
        onPass(); 
      }, 3000); 
    }
  };

  // What they see AFTER they hit submit
  if (submitted) {
    const passed = score >= 70;
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <span style={{ fontSize: "64px", display: "block", marginBottom: "20px" }}>
          {passed ? "🎉" : "🛑"}
        </span>
        <h2 style={{ fontFamily: f.display, color: T.navy, fontSize: "32px", marginBottom: "16px" }}>
          You scored {score}%
        </h2>
        {passed ? (
          <p style={{ fontFamily: f.body, color: T.emerald, fontSize: "18px", fontWeight: "700" }}>
            Congratulations! Unlocking your digital campus now...
          </p>
        ) : (
          <div>
            <p style={{ fontFamily: f.body, color: T.coral, fontSize: "18px", marginBottom: "24px" }}>
              You need at least 70% to pass the Orientation. Please review the slides and try again.
            </p>
            <button 
              // Clicking this instantly reshuffles everything for a fresh attempt
              onClick={setupQuiz} 
              style={{ padding: "12px 24px", background: T.navy, color: T.white, borderRadius: "12px", border: "none", fontFamily: f.body, fontWeight: "700", cursor: "pointer" }}
            >
              Retake Knowledge Check
            </button>
          </div>
        )}
      </div>
    );
  }

  // What they see BEFORE they hit submit (The actual questions)
  if (activeQuestions.length === 0) return null; // Prevent flash before shuffle

  return (
    <div style={{ textAlign: "left" }}>
      {activeQuestions.map((question, index) => (
        <div key={question.id} style={{ marginBottom: "30px", background: T.white, padding: "24px", borderRadius: "16px", border: `1px solid ${T.border}` }}>
          <h3 style={{ fontFamily: f.body, color: T.navy, fontSize: "18px", fontWeight: "700", marginBottom: "16px", lineHeight: 1.4 }}>
            {index + 1}. {question.q}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {question.shuffledOptions.map((option) => (
              <label key={option} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", background: answers[question.id] === option ? `${T.gold}20` : T.cream, border: `2px solid ${answers[question.id] === option ? T.gold : "transparent"}`, borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}>
                <input 
                  type="radio" 
                  name={`question-${question.id}`} 
                  value={option} 
                  checked={answers[question.id] === option}
                  onChange={() => handleSelect(question.id, option)}
                  style={{ marginTop: "4px" }}
                />
                <span style={{ fontFamily: f.body, color: T.gray, fontSize: "16px" }}>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button 
        onClick={handleSubmit} 
        disabled={Object.keys(answers).length < activeQuestions.length}
        style={{ width: "100%", padding: "18px", background: Object.keys(answers).length < activeQuestions.length ? T.gray : T.navy, color: T.white, border: "none", borderRadius: "16px", fontFamily: f.body, fontSize: "18px", fontWeight: "800", cursor: Object.keys(answers).length < activeQuestions.length ? "not-allowed" : "pointer", transition: "background 0.3s" }}
      >
        {Object.keys(answers).length < activeQuestions.length ? "Answer all questions to submit" : "Submit Knowledge Check"}
      </button>
    </div>
  );
}