import { Dashboard } from "@/components/dashboard";
import { Shell } from "@/components/shell";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/lib/dashboard-data";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const data = await getDashboardData(user.id);
  return <Shell viewer={data.viewer} goalName={data.goal?.role}><Dashboard data={data}/></Shell>;
}
