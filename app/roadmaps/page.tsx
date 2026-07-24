import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarRange, Clock3 } from "lucide-react";
import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/page-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { createClient } from "@/lib/supabase/server";
import { generateRoadmap } from "./actions";

export default async function RoadmapsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);

  return (
    <Shell viewer={data.viewer} goalName={data.goal?.role}>
      <PageHeader eyebrow="Preparation plan" title={data.roadmap?.title ?? "Your roadmap"} description="This page reads your active roadmap directly from Supabase."/>
      {!data.roadmap ? (
        <section className="card placeholder-card">
          <h2>No active roadmap</h2>
          <p>{data.goal ? "Your career goal is saved. Generate the missing roadmap now." : "Complete onboarding to create your career goal and study plan."}</p>
          {data.goal ? (
            <form action={generateRoadmap}><button className="primary-button" type="submit">Generate roadmap</button></form>
          ) : (
            <Link href="/onboarding" className="primary-button">Start onboarding</Link>
          )}
        </section>
      ) : (
        <div className="roadmap-grid">
          <section className="card roadmap-list">
            {data.roadmap.days.map((day) => (
              <article className={`roadmap-day ${day.id === data.today?.id ? "today" : ""}`} key={day.id}>
                <span className="day-number">{day.dayNumber}</span>
                <div>
                  <h3>{day.objective}</h3>
                  <div className="topic-chips">
                    {[...new Set(day.tasks.map((task) => task.topic?.name).filter(Boolean))].map((topic) => <span key={topic}>{topic}</span>)}
                  </div>
                </div>
                <span><Clock3 size={12}/> {Math.floor(day.plannedMinutes / 60)}h {day.plannedMinutes % 60}m</span>
              </article>
            ))}
          </section>
          <aside className="card side-panel">
            <span className="eyebrow">Plan settings</span>
            <h2>{data.roadmap.mode}</h2>
            <p>{data.roadmap.completedTasks} of {data.roadmap.taskCount} stored tasks are complete.</p>
            <div className="mode-card"><strong>Availability</strong><span>Weekdays {data.goal?.weekdayHours}h · Weekend {data.goal?.weekendHours}h</span></div>
            <div className="goal-stats">
              <div><CalendarRange size={16}/><span><strong>{data.roadmap.days.length}</strong> study days</span></div>
              <div><Clock3 size={16}/><span><strong>{Math.round(data.roadmap.days.reduce((sum, day) => sum + day.plannedMinutes, 0) / 60)}h</strong> planned</span></div>
            </div>
          </aside>
        </div>
      )}
    </Shell>
  );
}
