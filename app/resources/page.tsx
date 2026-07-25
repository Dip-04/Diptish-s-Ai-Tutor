import { BookOpen, ExternalLink, FlaskConical, GraduationCap, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ResourceRefresh } from "@/components/resource-refresh";
import { Shell } from "@/components/shell";
import { getDashboardData } from "@/lib/dashboard-data";
import { getGoalResources } from "@/lib/resource-search";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const sectionIcons = {
  Learn: BookOpen,
  Practice: FlaskConical,
  Interview: GraduationCap
};

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: Promise<{ topic?: string }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [data, params] = await Promise.all([getDashboardData(user.id), searchParams]);
  const topic = typeof params.topic === "string" ? params.topic.slice(0, 80) : undefined;
  const role = data.goal?.role ?? "Software Developer";
  const experience = data.goal?.experience ?? "Beginner";
  const sections = await getGoalResources({
    role,
    experience,
    weakSkills: data.weakSkills.map((skill) => skill.name),
    topic
  });

  return (
    <Shell viewer={data.viewer} goalName={data.goal?.role}>
      <PageHeader
        eyebrow="Live learning library"
        title={`Resources for ${role}`}
        description={`Fresh study material selected from the web for your ${experience.toLowerCase()} goal${topic ? `, focused on ${topic}` : ""}.`}
        action={<ResourceRefresh/>}
      />

      <section className="resource-context card">
        <span className="resource-search-icon"><Search size={19}/></span>
        <div>
          <strong>Personalised web search</strong>
          <p>Results use your active career goal, level, and weakest skills. Official documentation and hands-on sources are ranked first.</p>
        </div>
        <span className="live-pill"><i/> Live</span>
      </section>

      <div className="resource-sections">
        {sections.map((section) => {
          const Icon = sectionIcons[section.resources[0].category];
          return (
            <section key={section.title} className="resource-section">
              <div className="resource-section-head">
                <span><Icon size={17}/></span>
                <div><h2>{section.title}</h2><p>{section.resources.length} useful resources found for your goal</p></div>
              </div>
              <div className="resource-grid">
                {section.resources.map((resource) => (
                  <a
                    className="resource-card card"
                    href={resource.url}
                    key={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="resource-card-top">
                      <span className={`resource-kind ${resource.category.toLowerCase()}`}>{resource.category}</span>
                      <ExternalLink size={16}/>
                    </div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description || "Open this resource to explore the full learning material."}</p>
                    <span className="resource-source">{resource.source}</span>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <p className="resource-safety">Links are fetched from the public web. Review the publisher and use security labs only in authorised environments.</p>
    </Shell>
  );
}
