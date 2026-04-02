import S from "../constants/styles";
import { Container, PageWrapper, SectionHeader } from "../components/shared/CoreComponents";

export default function AIUsagePolicyPage() {
  var sectionStyle = { marginBottom: 28 };
  var hStyle = { fontFamily: S.heading, fontSize: 18, color: S.navy, marginBottom: 10, fontWeight: 700 };
  var pStyle = { fontFamily: S.body, fontSize: 14, color: "#2D3748", lineHeight: 1.8, marginBottom: 10 };

  return (
    <PageWrapper bg={S.lightBg}>
      <SectionHeader tag="Policy" title="AI Usage Policy" desc="How artificial intelligence is used at CTS ETS and what is expected of students." />
      <Container>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "clamp(28px,4vw,48px)", border: "1px solid " + S.border }}>
          <p style={{ ...pStyle, fontStyle: "italic", color: S.gray }}>Effective Date: 1 April 2026 | Last Updated: April 2026</p>

          <div style={sectionStyle}>
            <h3 style={hStyle}>1. Purpose</h3>
            <p style={pStyle}>CTS Empowerment and Training Solutions ("CTS ETS") embraces artificial intelligence (AI) as a tool to enhance the learning experience. This policy establishes clear guidelines for how AI is used within our institution and what is expected of students regarding AI-assisted learning.</p>
            <p style={pStyle}>This policy applies to all students, staff, and systems associated with CTS ETS programmes, the CTS ETS Interactive Learning System, and all assessment activities.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>2. How CTS ETS Uses AI</h3>
            <p style={pStyle}>CTS ETS uses AI in the following institutional capacities:</p>
            <p style={pStyle}><strong>Intelligent Study Assistant:</strong> An AI-powered study companion is integrated into the CTS ETS Interactive Learning System. It is designed to answer student questions about course content, explain concepts, and provide guidance. It draws exclusively from authorised CTS ETS learner guide content and does not provide information outside the scope of the student's enrolled programme.</p>
            <p style={pStyle}><strong>Audio Study Sessions:</strong> AI-generated audio conversations are produced to deliver course content in an accessible, podcast-style format. These are created under the direct supervision of the Principal and reviewed for accuracy before publication.</p>
            <p style={pStyle}><strong>Learner Guide Development:</strong> AI tools are used to assist in the creation of learner guides under the direction and editorial oversight of the Principal. All content is reviewed, verified, and approved by qualified personnel before publication. AI-generated content is never published without human review.</p>
            <p style={pStyle}><strong>Administrative Communications:</strong> AI may be used to draft administrative emails, announcements, and student communications. All such communications are reviewed and approved before being sent.</p>
            <p style={pStyle}><strong>Branded Graphics:</strong> AI tools are used to generate branded marketing and instructional graphics under configured style guidelines. All outputs are reviewed before publication.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>3. Student Use of AI in Learning</h3>
            <p style={pStyle}>CTS ETS encourages students to use the Intelligent Study Assistant provided within the Interactive Learning System. This tool is specifically designed to support your learning and is considered an authorised study aid.</p>
            <p style={pStyle}>Students may also use external AI tools (such as ChatGPT, Gemini, or similar) for the following purposes:</p>
            <p style={pStyle}>Understanding concepts explained in the learner guides. Generating practice questions to test your own knowledge. Summarising or clarifying material you have already studied. Exploring related topics to deepen your understanding.</p>
            <p style={pStyle}>The use of AI for these purposes is encouraged as part of a modern learning approach. CTS ETS recognises that AI literacy is itself a valuable workplace skill.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>4. Prohibited Use of AI in Assessments</h3>
            <p style={pStyle}>The use of AI tools during formal assessments is strictly prohibited. This includes but is not limited to:</p>
            <p style={pStyle}>Using any AI tool to generate, look up, or verify answers during a timed assessment (topical or final). Copying AI-generated text into assessment responses. Using AI to complete portfolio evidence, practical assignments, or workplace evidence submissions. Sharing assessment questions with AI tools during or after an assessment.</p>
            <p style={pStyle}>Assessments at CTS ETS are designed to verify that you have personally acquired the competencies required by the programme. AI-generated answers undermine this purpose and may constitute academic dishonesty.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>5. Academic Integrity</h3>
            <p style={pStyle}>CTS ETS maintains a strict academic integrity policy. The following are considered violations:</p>
            <p style={pStyle}>Submitting AI-generated work as your own in any assessed component. Using AI to impersonate your knowledge or competence during assessment. Sharing assessment content with AI tools or other students. Attempting to manipulate or circumvent assessment security measures.</p>
            <p style={pStyle}>Violations may result in the assessment being voided (marked as NOT YET COMPETENT), a formal warning on your student record, suspension from the programme, or in serious or repeated cases, expulsion without refund.</p>
            <p style={pStyle}>CTS ETS reserves the right to investigate suspected violations and may use detection tools or manual review to identify AI-generated assessment submissions.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>6. Data Privacy and AI</h3>
            <p style={pStyle}>The CTS ETS Intelligent Study Assistant processes your questions to provide responses but does not store personal data beyond the scope of the current session. Conversations with the study assistant are not shared with third parties.</p>
            <p style={pStyle}>When using external AI tools, students are advised not to enter personal information (such as Student ID, TRN, email, or financial information) into any external AI platform. CTS ETS is not responsible for data shared by students with third-party AI tools.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>7. AI Limitations</h3>
            <p style={pStyle}>Students should be aware that AI tools, including the CTS ETS Intelligent Study Assistant, may occasionally produce inaccurate or incomplete information. AI outputs should always be cross-referenced with the official learner guides provided as part of your programme.</p>
            <p style={pStyle}>The learner guides remain the authoritative source of programme content. In any conflict between an AI-generated response and the learner guide, the learner guide takes precedence.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>8. Institutional Commitment</h3>
            <p style={pStyle}>CTS ETS commits to:</p>
            <p style={pStyle}>Transparency about how AI is used in content creation, assessment, and student support. Ensuring all AI-generated educational content is reviewed and approved by qualified personnel. Keeping this policy updated as AI technology and best practices evolve. Training students on responsible AI use as part of digital literacy development. Never using AI as a substitute for qualified human oversight of educational quality.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>9. Reporting Concerns</h3>
            <p style={pStyle}>If you have concerns about the use of AI at CTS ETS, or if you believe AI is being misused by a student or within the institution, please contact the Quality Assurance department at quality@ctsetsjm.com or the Office of the Principal at principal@ctsetsjm.com.</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={hStyle}>10. Updates to This Policy</h3>
            <p style={pStyle}>This policy will be reviewed and updated at least annually, or more frequently as AI technology evolves. Students will be notified of material changes via the Student Portal and email. The current version is always available on this page.</p>
          </div>

          <div style={{ padding: "14px 18px", borderRadius: 8, background: S.lightBg, border: "1px solid " + S.border, fontSize: 12, color: S.gray, fontFamily: S.body, lineHeight: 1.6 }}>
            CTS Empowerment and Training Solutions | Reg. No. 16007/2025 | 6 Newark Avenue, Kingston 2, Jamaica W.I. | admin@ctsetsjm.com
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}
