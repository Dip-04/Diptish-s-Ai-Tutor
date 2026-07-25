import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { FocusTimer } from "@/components/focus-timer";
import { PageHeader } from "@/components/page-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { createClient } from "@/lib/supabase/server";

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  const task = data.today?.tasks.find((item) => item.progress[0]?.status !== "COMPLETED") ?? data.today?.tasks[0];
  const criteria = Array.isArray(task?.completionCriteria)
    ? task.completionCriteria.filter((item): item is string => typeof item === "string").join(" ")
    : "Work on this task for one focused session.";

  return (
    <Shell viewer={data.viewer} goalName={data.goal?.role}>
      <PageHeader eyebrow="Daily preparation" title="Focus session" description="The current task is loaded from your active Supabase roadmap."/>
      {task
        ? <>
            <FocusTimer taskId={task.id} title={task.title} description={criteria}/>
            <section className="card focus-resource-cta">
              <div>
                <span className="eyebrow">Need study material?</span>
                <h2>Find resources for {task.topic?.name ?? task.title}</h2>
                <p>We will search the web using your goal, level, and today&apos;s topic.</p>
              </div>
              <Link className="primary-button" href={`/resources?topic=${encodeURIComponent(task.topic?.name ?? task.title)}`}>Find material</Link>
            </section>
          </>
        : <section className="card placeholder-card"><h2>No task scheduled</h2><p>Create an active roadmap before starting a focus session.</p><Link className="primary-button" href="/roadmaps">View roadmap</Link></section>}
    </Shell>
  );
}
