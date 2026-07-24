"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateAndSaveRoadmap } from "@/lib/roadmaps";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const roleName = String(formData.get("role") ?? "").trim().slice(0, 100);
  const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 120);
  const experienceLevel = String(formData.get("experienceLevel") ?? "Intermediate").trim().slice(0, 50);
  const interviewDateValue = String(formData.get("interviewDate") ?? "");
  const interviewDate = interviewDateValue ? new Date(`${interviewDateValue}T00:00:00.000Z`) : null;
  const weekdayHours = Math.min(16, Math.max(0, Number(formData.get("weekdayHours") ?? 0)));
  const weekendHours = Math.min(16, Math.max(0, Number(formData.get("weekendHours") ?? 0)));
  if (!roleName || !Number.isFinite(weekdayHours) || !Number.isFinite(weekendHours)) return;

  const slug = roleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const role = await prisma.role.upsert({
    where: { slug },
    update: { name: roleName },
    create: { slug, name: roleName }
  });

  await prisma.$transaction([
    prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        profile: {
          upsert: {
            update: { fullName: fullName || String(user.user_metadata.full_name ?? user.email.split("@")[0]) },
            create: { fullName: fullName || String(user.user_metadata.full_name ?? user.email.split("@")[0]) }
          }
        }
      },
      create: {
        id: user.id,
        email: user.email,
        profile: {
          create: {
            fullName: fullName || String(user.user_metadata.full_name ?? user.email.split("@")[0])
          }
        }
      }
    }),
    prisma.careerGoal.updateMany({
      where: { userId: user.id, active: true },
      data: { active: false }
    }),
    prisma.careerGoal.create({
      data: {
        userId: user.id,
        roleId: role.id,
        experienceLevel,
        interviewDate: interviewDate && !Number.isNaN(interviewDate.getTime()) ? interviewDate : null,
        weekdayHours,
        weekendHours,
        active: true
      }
    })
  ]);

  await generateAndSaveRoadmap(user.id, { allowStarter: true });
  redirect("/roadmaps");
}
