"use server";

import { redirect } from "next/navigation";
import { generateAndSaveRoadmap } from "@/lib/roadmaps";
import { createClient } from "@/lib/supabase/server";

export async function generateRoadmap() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await generateAndSaveRoadmap(user.id, { allowStarter: true });
  redirect("/roadmaps");
}
