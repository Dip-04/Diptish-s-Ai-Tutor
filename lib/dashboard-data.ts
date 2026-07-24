import "server-only";
import { prisma } from "./prisma";

export async function getDashboardData(userId: string) {
  const [account, goal, skills] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    }),
    prisma.careerGoal.findFirst({
      where: { userId, active: true },
      orderBy: { updatedAt: "desc" },
      include: {
        role: true,
        roadmaps: {
          where: { status: "ACTIVE" },
          orderBy: { updatedAt: "desc" },
          take: 1,
          include: {
            weeks: {
              orderBy: { weekNumber: "asc" },
              include: {
                days: {
                  orderBy: { date: "asc" },
                  include: {
                    tasks: {
                      orderBy: { orderIndex: "asc" },
                      include: {
                        topic: true,
                        progress: { where: { userId } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.userSkill.findMany({
      where: { userId },
      orderBy: { rating: "asc" },
      take: 3,
      include: { skill: true }
    })
  ]);

  const roadmap = goal?.roadmaps[0] ?? null;
  const days = roadmap?.weeks.flatMap((week) => week.days) ?? [];
  const today = days.find((day) => day.tasks.some((task) => task.progress[0]?.status !== "COMPLETED"))
    ?? days[0]
    ?? null;
  const allTasks = days.flatMap((day) => day.tasks);
  const completedTasks = allTasks.filter((task) => task.progress[0]?.status === "COMPLETED").length;

  return {
    viewer: {
      name: account?.profile?.fullName ?? account?.email.split("@")[0] ?? "Account",
      email: account?.email ?? ""
    },
    goal: goal ? {
      role: goal.role.name,
      experience: goal.experienceLevel,
      interviewDate: goal.interviewDate,
      weekdayHours: Number(goal.weekdayHours),
      weekendHours: Number(goal.weekendHours)
    } : null,
    roadmap: roadmap ? {
      title: roadmap.title,
      mode: roadmap.mode,
      days,
      taskCount: allTasks.length,
      completedTasks
    } : null,
    today,
    weakSkills: skills.map((item) => ({
      name: item.skill.name,
      confidence: item.confidence,
      rating: item.rating
    }))
  };
}
