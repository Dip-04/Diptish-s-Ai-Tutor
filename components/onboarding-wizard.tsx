"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { completeOnboarding } from "@/app/onboarding/actions";

const steps = ["Profile", "Career goal", "Experience", "Deadline", "Availability", "Skills", "Resume", "Preferences"];
const roles = ["Application Security Analyst", "Product Security Engineer", "Frontend Developer", "Full-Stack Developer", "Backend Developer", "DevOps Engineer"];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [experience, setExperience] = useState("Intermediate");
  const [interviewDate, setInterviewDate] = useState("");
  const [hours, setHours] = useState(3);
  const [weekendHours, setWeekendHours] = useState(8);
  return (
    <div className="onboarding-shell">
      <aside className="onboarding-aside">
        <Link className="logo" href="/"><span className="logo-mark"><Sparkles size={18}/></span><span>Diptish<span>AI</span></span></Link>
        <div><span className="eyebrow">Personal setup</span><h1>A plan made for your real life.</h1><p>Tell us where you&apos;re headed and how much time you actually have. We&apos;ll do the scheduling.</p></div>
        <div className="privacy-line"><ShieldCheck size={17}/><span>Your resume facts stay unverified until you confirm them.</span></div>
      </aside>
      <main className="wizard-panel">
        <div className="step-track">{steps.map((label,index) => <span key={label} className={index <= step ? "active" : ""}><i>{index < step ? <Check size={11}/> : index + 1}</i><small>{label}</small></span>)}</div>
        <div className="wizard-content">
          <span className="eyebrow">Step {step + 1} of {steps.length}</span>
          <h2>{[
            "Let’s start with you", "Which role are you targeting?", "Where are you starting from?", "When is your interview?", "How much time can you study?", "Rate your current confidence", "Add your resume", "Choose how you learn"
          ][step]}</h2>
          <p>{[
            "This helps us personalise language and recommendations.", "Select the goal that matters most right now.", "We’ll adjust depth and difficulty to match.", "A deadline helps us protect your highest-priority topics.", "We never schedule more work than your availability.", "Be honest—this only improves your plan.", "PDF, DOCX or TXT · you confirm every extracted fact.", "DSA is off by default and always under your control."
          ][step]}</p>
          <div className="wizard-form">
            {step === 0 && <><label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name"/></label><label>Preferred interview language<select defaultValue="English"><option>English</option><option>Hindi</option><option>Marathi</option><option>English and Hindi</option></select></label></>}
            {step === 1 && <div className="choice-grid">{roles.map((item) => <button key={item} className={role === item ? "selected" : ""} onClick={() => setRole(item)}><span>{role === item && <Check size={13}/>}</span>{item}</button>)}</div>}
            {step === 2 && <div className="choice-grid">{["Beginner","Fresher","0–1 years","1–2 years","2–4 years","4–7 years"].map(item => <button key={item} className={experience === item ? "selected" : ""} onClick={() => setExperience(item)}>{item}</button>)}</div>}
            {step === 3 && <label>Interview date<input type="date" value={interviewDate} onChange={(event) => setInterviewDate(event.target.value)}/></label>}
            {step === 4 && <><label>Weekday hours <strong>{hours}h</strong><input type="range" min="1" max="8" value={hours} onChange={(e) => setHours(Number(e.target.value))}/></label><label>Weekend hours<select value={weekendHours} onChange={(event) => setWeekendHours(Number(event.target.value))}><option>4</option><option>6</option><option>8</option><option>10</option></select></label></>}
            {step === 5 && <div className="skill-ratings">{["HTTP & HTTPS","OWASP Top 10","API Security","Burp Suite"].map((item,index) => <label key={item}><span>{item}</span><input type="range" min="0" max="5" defaultValue={index + 1}/></label>)}</div>}
            {step === 6 && <label className="upload-box"><input type="file" accept=".pdf,.docx,.txt"/><span>Drop a resume or choose a file</span><small>Maximum 5 MB · Safe parsing only</small></label>}
            {step === 7 && <div className="preference-list">{["Theory","Practical coding","Security labs","Interview questions","Mock interviews","Voice practice","Quizzes","Flashcards","DSA (off by default)"].map((item,index) => <label key={item}><input type="checkbox" defaultChecked={index < 8}/><span>{item}</span></label>)}</div>}
          </div>
          <div className="wizard-actions">
            <button className="secondary-button" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={15}/>Back</button>
            {step === steps.length - 1 ? (
              <form action={completeOnboarding}>
                <input type="hidden" name="role" value={role}/>
                <input type="hidden" name="fullName" value={fullName}/>
                <input type="hidden" name="experienceLevel" value={experience}/>
                <input type="hidden" name="interviewDate" value={interviewDate}/>
                <input type="hidden" name="weekdayHours" value={hours}/>
                <input type="hidden" name="weekendHours" value={weekendHours}/>
                <button className="primary-button" type="submit">Save my goal <ArrowRight size={15}/></button>
              </form>
            ) : (
              <button className="primary-button" onClick={() => setStep(step + 1)}>Continue <ArrowRight size={15}/></button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
