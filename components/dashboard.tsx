import Link from "next/link";
import { CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, Target, TrendingUp } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

function daysUntil(date: Date | null) {
  if (!date) return null;
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000));
}

export function Dashboard({ data }: { data: DashboardData }) {
  if (!data.goal) {
    return (
      <section className="card placeholder-card">
        <span className="empty-icon"><Target size={22}/></span>
        <h1>Welcome, {data.viewer.name}</h1>
        <p>Your database account is ready. Add a career goal to build your first roadmap.</p>
        <Link href="/onboarding" className="primary-button">Start onboarding</Link>
      </section>
    );
  }

  const remainingDays = daysUntil(data.goal.interviewDate);
  const taskCount = data.roadmap?.taskCount ?? 0;
  const completed = data.roadmap?.completedTasks ?? 0;
  const progress = taskCount ? Math.round((completed / taskCount) * 100) : 0;
  const todayTasks = data.today?.tasks ?? [];
  const remainingMinutes = todayTasks
    .filter((task) => task.progress[0]?.status !== "COMPLETED")
    .reduce((sum, task) => sum + task.estimatedMinutes, 0);

  return (
    <>
      <section className="welcome">
        <div>
          <span className="eyebrow">{new Intl.DateTimeFormat("en", { dateStyle: "full" }).format(new Date())}</span>
          <h1>Welcome back, {data.viewer.name}</h1>
          <p>Your dashboard now reflects records stored in Supabase.</p>
        </div>
      </section>

      <section className="hero-grid">
        <article className="card readiness-card">
          <div className="card-heading">
            <div><span className="eyebrow">Roadmap progress</span><h2>{data.goal.role}</h2></div>
          </div>
          <div className="readiness-body">
            <div className="readiness-ring" style={{ "--value": `${progress * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{progress}%</strong><span>complete</span></div>
            </div>
            <div className="readiness-bars">
              <div className="metric"><div><span>Tasks completed</span><strong>{completed}/{taskCount}</strong></div><div className="bar"><i style={{ width: `${progress}%` }}/></div></div>
            </div>
          </div>
          <div className="readiness-note"><TrendingUp size={16}/><span>Calculated from your saved task progress.</span></div>
        </article>

        <article className="card goal-card">
          <span className="eyebrow">Current goal</span>
          <div className="goal-icon"><Target size={25}/></div>
          <h2>{data.goal.role}</h2>
          <p>{data.roadmap?.mode ?? "No roadmap"} · {data.goal.experience}</p>
          <div className="goal-stats">
            <div><CalendarDays size={16}/><span><strong>{remainingDays ?? "—"}</strong> days left</span></div>
            <div><Clock3 size={16}/><span><strong>{data.goal.weekdayHours}h</strong> weekday plan</span></div>
          </div>
          <Link href="/roadmaps" className="secondary-button">Open roadmap</Link>
        </article>
      </section>

      <section className="card today-card">
        <div className="today-top">
          <div>
            <span className="eyebrow">Current study day</span>
            <h2>{data.today?.objective ?? "No tasks scheduled"}</h2>
            <p>{todayTasks.length} tasks · {remainingMinutes} min remaining</p>
          </div>
        </div>
        <div className="task-list">
          {todayTasks.map((task) => {
            const done = task.progress[0]?.status === "COMPLETED";
            return (
              <div key={task.id} className={`task ${done ? "done" : ""}`}>
                <span className="check">{done && <Check size={14}/>}</span>
                <span className="task-copy"><strong>{task.title}</strong><small>{task.topic?.name ?? task.type}</small></span>
                <span className={`type-badge ${task.type.toLowerCase()}`}>{task.type}</span>
                <span className="task-time"><Clock3 size={14}/>{task.estimatedMinutes} min</span>
                <ChevronRight size={17}/>
              </div>
            );
          })}
          {!todayTasks.length && <p>No roadmap tasks are stored yet. Generate a roadmap from onboarding.</p>}
        </div>
      </section>

      {!!data.weakSkills.length && (
        <section className="card">
          <div className="card-heading compact"><div><span className="eyebrow">Focus next</span><h2>Lowest-confidence skills</h2></div></div>
          <div className="weak-list">
            {data.weakSkills.map((skill) => <div className="weak-topic" key={skill.name}><div><strong>{skill.name}</strong><small>Confidence {skill.confidence}/5</small></div></div>)}
          </div>
        </section>
      )}

      <section className="responsible-note"><CheckCircle2 size={18}/><p><strong>Prepare with integrity.</strong> Use this workspace for learning, not hidden assistance during interviews.</p></section>
    </>
  );
}
