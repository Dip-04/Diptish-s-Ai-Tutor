"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, Flame, Play, RotateCcw, Target, TrendingUp } from "lucide-react";
import { quickActions, roadmapDays, weakTopics } from "@/lib/data";
import { useAppStore } from "@/lib/store";

function Ring({ value }: { value: number }) {
  return (
    <div className="readiness-ring" style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}>
      <div><strong>{value}%</strong><span>ready</span></div>
    </div>
  );
}

export function Dashboard() {
  const { tasks, toggleTask, focusMinutes } = useAppStore();
  const complete = tasks.filter((task) => task.completed).length;
  const total = tasks.reduce((sum, task) => sum + task.minutes, 0);
  const doneMinutes = tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.minutes, 0);
  const progress = Math.round((complete / tasks.length) * 100);

  return (
    <>
      <section className="welcome">
        <div>
          <span className="eyebrow">Friday, 24 July</span>
          <h1>Good morning, Dipti <span>👋</span></h1>
          <p>Small steps, strong foundations. You&apos;re building real interview confidence.</p>
        </div>
        <div className="streak"><Flame size={19} fill="currentColor"/><span><strong>6 day</strong> streak</span></div>
      </section>

      <section className="hero-grid">
        <article className="card readiness-card">
          <div className="card-heading">
            <div><span className="eyebrow">Your readiness</span><h2>Application Security Analyst</h2></div>
            <button className="plain-button">View details <ArrowRight size={15}/></button>
          </div>
          <div className="readiness-body">
            <Ring value={68}/>
            <div className="readiness-bars">
              {[
                ["Technical", 74, "var(--indigo)"],
                ["Practical", 62, "var(--sky)"],
                ["Communication", 58, "var(--amber)"],
                ["Resume", 81, "var(--green)"]
              ].map(([label, value, color]) => (
                <div className="metric" key={String(label)}>
                  <div><span>{label}</span><strong>{value}%</strong></div>
                  <div className="bar"><i style={{ width: `${value}%`, background: String(color) }}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="readiness-note"><TrendingUp size={16}/><span><strong>+8% this week.</strong> Practical practice will have the biggest impact next.</span></div>
        </article>

        <article className="card goal-card">
          <span className="eyebrow">Current goal</span>
          <div className="goal-icon"><Target size={25}/></div>
          <h2>Application Security Analyst</h2>
          <p>Balanced mode · Intermediate</p>
          <div className="goal-stats">
            <div><CalendarDays size={16}/><span><strong>12</strong> days left</span></div>
            <div><Clock3 size={16}/><span><strong>3h</strong> weekday plan</span></div>
          </div>
          <Link href="/roadmaps" className="secondary-button">Open full roadmap <ArrowRight size={15}/></Link>
        </article>
      </section>

      <section className="card today-card">
        <div className="today-top">
          <div>
            <span className="eyebrow">Today&apos;s plan</span>
            <h2>Web foundations & authentication</h2>
            <p>{complete} of {tasks.length} tasks completed · {total - doneMinutes} min remaining</p>
          </div>
          <div className="progress-label"><strong>{progress}%</strong><span>complete</span></div>
        </div>
        <div className="wide-progress"><i style={{ width: `${progress}%` }}/></div>
        <div className="task-list">
          {tasks.map((task) => (
            <button key={task.id} className={`task ${task.completed ? "done" : ""}`} onClick={() => toggleTask(task.id)}>
              <span className="check">{task.completed && <Check size={14}/>}</span>
              <span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span>
              <span className={`type-badge ${task.type.toLowerCase()}`}>{task.type}</span>
              <span className="task-time"><Clock3 size={14}/>{task.minutes} min</span>
              <ChevronRight size={17}/>
            </button>
          ))}
        </div>
        <div className="today-foot">
          <span><Clock3 size={15}/>{focusMinutes} minutes focused today</span>
          <Link href="/today" className="primary-button"><Play size={15} fill="currentColor"/>Continue preparation</Link>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">Keep moving</span><h2>Quick actions</h2></div></div>
        <div className="quick-grid">
          {quickActions.map(({ label, detail, icon: Icon, href }, index) => (
            <Link key={label} href={href} className="quick-card">
              <span className={`quick-icon q${index}`}><Icon size={20}/></span>
              <span><strong>{label}</strong><small>{detail}</small></span>
              <ChevronRight size={17}/>
            </Link>
          ))}
        </div>
      </section>

      <section className="lower-grid">
        <article className="card">
          <div className="card-heading compact"><div><span className="eyebrow">Focus next</span><h2>Weak topics</h2></div><Link href="/revision" className="plain-button">View all <ArrowRight size={15}/></Link></div>
          <div className="weak-list">
            {weakTopics.map((topic) => (
              <div className="weak-topic" key={topic.name}>
                <div className="confidence"><span style={{ "--score": `${topic.confidence * 3.6}deg` } as React.CSSProperties}>{topic.confidence}</span></div>
                <div><strong>{topic.name}</strong><small>{topic.due}</small></div>
                <button aria-label={`Revise ${topic.name}`}><RotateCcw size={15}/></button>
              </div>
            ))}
          </div>
        </article>
        <article className="card">
          <div className="card-heading compact"><div><span className="eyebrow">This week</span><h2>Upcoming schedule</h2></div><Link href="/calendar" className="plain-button">Calendar <ArrowRight size={15}/></Link></div>
          <div className="schedule-list">
            {roadmapDays.slice(1, 5).map((item) => (
              <div className="schedule" key={item.day}>
                <div className="date-box"><span>{item.short}</span><strong>{item.date}</strong></div>
                <div><strong>{item.title}</strong><small>{item.topics.slice(0, 2).join(" · ")}</small></div>
                <span className="minutes">{Math.round(item.minutes / 60)}h {item.minutes % 60 || ""}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="responsible-note"><CheckCircle2 size={18}/><p><strong>Prepare with integrity.</strong> DiptishAI is designed for learning and interview preparation—not hidden assistance during real interviews.</p></section>
    </>
  );
}
