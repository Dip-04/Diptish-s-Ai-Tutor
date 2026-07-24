"use client";

import { useState } from "react";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";

export function InterviewPractice() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(false);
  return (
    <div className="interview-layout">
      <section className="card question-card">
        <span className="question-number">QUESTION 1 OF 8 · TECHNICAL</span>
        <h2>How would you explain the difference between authentication and authorisation to a product manager?</h2>
        <textarea className="answer-box" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(false); }} placeholder="Structure your answer: definition → example → security impact…" aria-label="Your interview answer"/>
        <div className="question-actions"><span className="task-time"><Clock3 size={14}/>Suggested: 2 minutes</span><button className="primary-button" disabled={answer.trim().length < 20} onClick={() => setFeedback(true)}>Evaluate answer <ArrowRight size={15}/></button></div>
        {feedback && <div className="feedback"><strong>Clear foundation.</strong> Add a concrete example: signing in verifies identity; checking whether that user may approve invoices controls access. Mention least privilege for a stronger security finish.</div>}
      </section>
      <aside className="card side-panel">
        <span className="eyebrow">Session setup</span><h2>Technical screening</h2>
        <p>Application Security Analyst · Intermediate · Text mode</p>
        <div className="mode-card"><strong>Adaptive follow-ups</strong><span>Questions adjust to your answers</span></div>
        <div className="responsible-note" style={{marginTop: 20, textAlign:"left"}}><ShieldCheck size={18}/><p>Practice only. No hidden assistance during live interviews.</p></div>
      </aside>
    </div>
  );
}
