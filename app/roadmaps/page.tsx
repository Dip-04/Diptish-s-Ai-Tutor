import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/page-header";
import { roadmapDays } from "@/lib/data";
import { CalendarRange, Clock3, WandSparkles } from "lucide-react";

export default function RoadmapsPage() {
  return (
    <Shell>
      <PageHeader eyebrow="7-day plan" title="Your roadmap" description="A realistic plan shaped around your available time and interview goal." action={<button className="primary-button"><WandSparkles size={15}/>Adapt roadmap</button>}/>
      <div className="roadmap-grid">
        <section className="card roadmap-list">
          {roadmapDays.map((item) => (
            <article className={`roadmap-day ${item.state}`} key={item.day}>
              <span className="day-number">{item.day}</span>
              <div><h3>{item.title}</h3><div className="topic-chips">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div>
              <span><Clock3 size={12}/> {Math.floor(item.minutes / 60)}h {item.minutes % 60}m</span>
            </article>
          ))}
        </section>
        <aside className="card side-panel">
          <span className="eyebrow">Plan settings</span>
          <h2>Balanced mode</h2>
          <p>Theory, practical work, interview questions and spaced revision are distributed across your available study windows.</p>
          <div className="mode-card"><strong>Time-aware planning</strong><span>Weekdays 3h · Weekend 8h</span></div>
          <div className="goal-stats"><div><CalendarRange size={16}/><span><strong>30 Jul</strong> completion</span></div><div><Clock3 size={16}/><span><strong>21h</strong> planned</span></div></div>
          <button className="secondary-button">Edit availability</button>
        </aside>
      </div>
    </Shell>
  );
}
