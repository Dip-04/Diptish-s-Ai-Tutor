"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { saveFocusTime } from "@/app/progress/actions";

export function FocusTimer({ taskId, title, description }: { taskId: string; title: string; description: string }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const addFocus = useAppStore((state) => state.addFocus);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);
  const reset = () => { setRunning(false); setSeconds(25 * 60); };
  const finish = async () => {
    const minutes = Math.ceil((25 * 60 - seconds) / 60);
    setRunning(false);
    setSaving(true);
    setError("");
    try {
      await saveFocusTime(taskId, minutes);
      addFocus(minutes);
      reset();
    } catch {
      setError("Focus time could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="card today-focus">
      <div>
        <span className="eyebrow">Current task</span>
        <h2>{title}</h2>
        <p className="focus-copy">{description}</p>
        <div className="timer" aria-live="polite">{String(Math.floor(seconds / 60)).padStart(2,"0")}:{String(seconds % 60).padStart(2,"0")}</div>
        <div className="focus-actions">
          <button className="primary-button" onClick={() => setRunning(!running)}>{running ? <Pause size={16}/> : <Play size={16}/>} {running ? "Pause" : "Start focus"}</button>
          <button className="secondary-button" style={{width: 110}} onClick={reset}><RotateCcw size={15}/>Reset</button>
        </div>
        {seconds < 25 * 60 && <button className="plain-button" disabled={saving} style={{margin:"18px auto 0"}} onClick={finish}>{saving ? "Saving…" : "Save focus time"}</button>}
        {error && <p role="alert">{error}</p>}
      </div>
    </section>
  );
}
