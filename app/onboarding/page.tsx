import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const goal = await prisma.careerGoal.findFirst({ where: { userId: user.id, active: true }, select: { id: true } });
  if (goal) redirect("/roadmaps");
  return <OnboardingWizard/>;
}
