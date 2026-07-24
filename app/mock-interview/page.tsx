import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { PageHeader } from "@/components/page-header";
import { InterviewPractice } from "@/components/interview-practice";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function MockInterviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  return <Shell viewer={data.viewer} goalName={data.goal?.role}><PageHeader eyebrow="AI practice" title="Mock interview" description="Practise honest, structured answers in a safe preparation environment."/><InterviewPractice role={data.goal?.role ?? "Your target role"}/></Shell>;
}
