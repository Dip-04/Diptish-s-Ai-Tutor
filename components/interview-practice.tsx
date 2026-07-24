"use client";

import { useActionState } from "react";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { evaluateAnswer, type FeedbackState } from "@/app/mock-interview/actions";

const question = "How would you explain the difference between authentication and authorisation to a product manager?";

export function InterviewPractice({ role }: { role: string }) {
  const [state, action, pending] = useActionState<FeedbackState, FormData>(evaluateAnswer, null);
  return (
    <div className="interview-layout">
      <section className="card question-card">
        <span className="question-number">TECHNICAL PRACTICE</span>
        <h2>{question}</h2>
        <form action={action}>
          <input type="hidden" name="question" value={question}/>
          <textarea name="answer" className="answer-box" minLength={20} maxLength={5000} placeholder="Structure your answer: definition → example → security impact…" aria-label="Your interview answer" required/>
          <div className="question-actions">
            <span className="task-time"><Clock3 size={14}/>Suggested: 2 minutes</span>
            <button className="primary-button" disabled={pending}>{pending ? "Evaluating…" : "Evaluate answer"} <ArrowRight size={15}/></button>
          </div>
        </form>
        {state?.error && <div className="feedback" role="alert">{state.error}</div>}
        {state?.feedback && <div className="feedback" role="status"><strong>Score: {state.feedback.score}/100</strong><p>{state.feedback.strengths.join(" ")}</p><p><strong>Improve:</strong> {state.feedback.improvements.join(" ")}</p></div>}
      </section>
      <aside className="card side-panel">
        <span className="eyebrow">Session setup</span><h2>Technical screening</h2>
        <p>{role} · Text mode</p>
        <div className="responsible-note" style={{marginTop: 20, textAlign:"left"}}><ShieldCheck size={18}/><p>Practice only. No hidden assistance during live interviews.</p></div>
      </aside>
    </div>
  );
}
