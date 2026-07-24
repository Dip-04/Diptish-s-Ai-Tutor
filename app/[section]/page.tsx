import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/page-header";
import { BookOpenCheck, Brain, ChartNoAxesColumnIncreasing, FileCheck2, Layers3, Settings2 } from "lucide-react";

const pages = {
  topics: { title: "Topic library", eyebrow: "Structured learning", description: "Build durable understanding with role-aligned concepts and practice.", cards: [["Core concepts","12 topics mapped to your goal"],["Security foundations","8 topics · 3 need revision"],["Practical skills","6 guided labs available"]] },
  questions: { title: "Question bank", eyebrow: "Interview practice", description: "Practise technical, behavioural and resume-aligned questions.", cards: [["Technical questions","142 curated prompts"],["Behavioural stories","STAR practice framework"],["Saved questions","Your personal revision list"]] },
  resume: { title: "Resume readiness", eyebrow: "Verified facts only", description: "Turn your confirmed experience into confident, honest interview stories.", cards: [["Facts verified","Confirm parsed resume details"],["Project stories","Prepare decisions and trade-offs"],["Follow-up questions","Anticipate the interviewer"]] },
  analytics: { title: "Progress analytics", eyebrow: "Evidence, not vanity", description: "Understand consistency, topic confidence and readiness trends.", cards: [["Study consistency","6-day current streak"],["Topic confidence","7 topics improving"],["Interview practice","2 sessions this week"]] },
  settings: { title: "Settings", eyebrow: "Your preferences", description: "Manage your profile, study plan, privacy and notifications.", cards: [["Profile","Identity and language"],["Preparation plan","Availability and modes"],["Privacy","Data and recording controls"]] },
  flashcards: { title: "Flashcards", eyebrow: "Spaced repetition", description: "Review concepts at the right time to strengthen recall.", cards: [["Due today","8 cards"],["Weak topics","OAuth, JWT and BOLA"],["Create a set","Build your own cards"]] },
  revision: { title: "Revision queue", eyebrow: "Remember what matters", description: "Missed questions and low-confidence topics appear here automatically.", cards: [["Due now","3 important topics"],["Tomorrow","5 quick reviews"],["Before interview","Final recall set"]] },
  calendar: { title: "Study calendar", eyebrow: "Plan your time", description: "See preparation sessions around your real availability.", cards: [["This week","17 hours planned"],["Office-friendly","5 short sessions"],["Weekend deep work","2 practical labs"]] }
} as const;

const icons = [BookOpenCheck, Brain, ChartNoAxesColumnIncreasing, FileCheck2, Layers3, Settings2];

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const page = pages[section as keyof typeof pages];
  if (!page) notFound();
  return (
    <Shell>
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description}/>
      <div className="placeholder-grid">
        {page.cards.map(([title, copy], index) => {
          const Icon = icons[index % icons.length];
          return <article className="card placeholder-card" key={title}><span className="empty-icon"><Icon size={19}/></span><h3>{title}</h3><p>{copy}</p><button className="plain-button">Open <span aria-hidden>→</span></button></article>;
        })}
      </div>
    </Shell>
  );
}
