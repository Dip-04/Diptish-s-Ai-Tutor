"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function userId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

async function ownedTask(taskId: string, ownerId: string) {
  return prisma.roadmapTask.findFirst({
    where: { id: taskId, day: { week: { roadmap: { userId: ownerId } } } },
    select: { id: true }
  });
}

export async function toggleTask(taskId: string) {
  const ownerId = await userId();
  if (!await ownedTask(taskId, ownerId)) throw new Error("Task not found");
  const existing = await prisma.taskProgress.findUnique({
    where: { roadmapTaskId_userId: { roadmapTaskId: taskId, userId: ownerId } }
  });
  const completed = existing?.status !== "COMPLETED";
  await prisma.taskProgress.upsert({
    where: { roadmapTaskId_userId: { roadmapTaskId: taskId, userId: ownerId } },
    create: { roadmapTaskId: taskId, userId: ownerId, status: completed ? "COMPLETED" : "IN_PROGRESS", completedAt: completed ? new Date() : null },
    update: { status: completed ? "COMPLETED" : "IN_PROGRESS", completedAt: completed ? new Date() : null }
  });
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/roadmaps");
}

export async function saveFocusTime(taskId: string, minutes: number) {
  const ownerId = await userId();
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 480) throw new Error("Invalid focus duration");
  if (!await ownedTask(taskId, ownerId)) throw new Error("Task not found");
  await prisma.taskProgress.upsert({
    where: { roadmapTaskId_userId: { roadmapTaskId: taskId, userId: ownerId } },
    create: { roadmapTaskId: taskId, userId: ownerId, status: "IN_PROGRESS", actualMinutes: minutes },
    update: { actualMinutes: { increment: minutes }, status: "IN_PROGRESS" }
  });
  revalidatePath("/");
  revalidatePath("/today");
}
