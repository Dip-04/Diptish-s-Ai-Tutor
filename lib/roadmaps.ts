import "server-only";
import { createHash } from "node:crypto";
import { Priority, RoadmapStatus, TaskType } from "@prisma/client";
import { AIConfigurationError, OpenAIProvider } from "@/lib/ai/provider";
import type { GeneratedRoadmap, RoadmapInput } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fallbackRoadmap(input: RoadmapInput): GeneratedRoadmap {
  const date = new Date().toISOString().slice(0, 10);
  return {
    title: `${input.targetRole} preparation roadmap`,
    mode: input.preparationDays <= 14 ? "fast-track" : "balanced",
    notice: "A starter roadmap was created. Adapt it when the AI provider is available.",
    days: [{
      dayNumber: 1,
      date,
      objective: `Establish the core ${input.targetRole} foundations`,
      plannedMinutes: Math.max(30, Math.round(input.weekdayHours * 60)),
      tasks: [{
        title: `Review the core responsibilities of a ${input.targetRole}`,
        type: "learn",
        topic: input.targetRole,
        subtopic: null,
        estimatedMinutes: Math.max(30, Math.min(120, Math.round(input.weekdayHours * 60))),
        priority: "critical",
        difficulty: "intermediate",
        completionCriteria: ["Write and explain three core responsibilities in your own words"],
        resourceIds: [],
        dependencies: []
      }],
      dailyDeliverables: ["A concise role summary"],
      interviewQuestionCount: 5,
      revisionTopics: []
    }]
  };
}

export async function generateAndSaveRoadmap(userId: string, options: { allowStarter?: boolean } = {}) {
  const goal = await prisma.careerGoal.findFirst({
    where: { userId, active: true },
    orderBy: { updatedAt: "desc" },
    include: { role: true }
  });
  if (!goal) throw new Error("Complete onboarding before generating a roadmap.");

  const preparationDays = goal.interviewDate
    ? Math.max(1, Math.min(365, Math.ceil((goal.interviewDate.getTime() - Date.now()) / 86_400_000)))
    : 30;
  const input: RoadmapInput = {
    targetRole: goal.role.name,
    experienceLevel: goal.experienceLevel,
    preparationDays,
    weekdayHours: Number(goal.weekdayHours),
    weekendHours: Number(goal.weekendHours),
    selectedTopics: [goal.role.name],
    weakTopics: [],
    includeDSA: false,
    includeMockInterviews: true
  };
  const safetyIdentifier = createHash("sha256").update(userId).digest("hex").slice(0, 32);

  let generated: GeneratedRoadmap;
  try {
    generated = await new OpenAIProvider().generateRoadmap(input, safetyIdentifier);
  } catch (error) {
    if (!(error instanceof AIConfigurationError) && !options.allowStarter) throw error;
    generated = fallbackRoadmap(input);
  }

  const topicNames = [...new Set(generated.days.flatMap((day) => day.tasks.map((task) => task.topic)))];
  const topics = await Promise.all(topicNames.map((name) =>
    prisma.topic.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { slug: slugify(name), name }
    })
  ));
  const topicIds = new Map(topics.map((topic) => [topic.name, topic.id]));
  const weeks = new Map<number, typeof generated.days>();
  generated.days.forEach((day, index) => {
    const weekNumber = Math.floor(index / 7) + 1;
    weeks.set(weekNumber, [...(weeks.get(weekNumber) ?? []), day]);
  });

  return prisma.$transaction(async (tx) => {
    await tx.roadmap.updateMany({
      where: { userId, status: RoadmapStatus.ACTIVE },
      data: { status: RoadmapStatus.ARCHIVED }
    });
    return tx.roadmap.create({
      data: {
        userId,
        careerGoalId: goal.id,
        title: generated.title,
        mode: generated.notice.startsWith("A starter roadmap") ? "starter" : generated.mode,
        status: RoadmapStatus.ACTIVE,
        weeks: {
          create: [...weeks.entries()].map(([weekNumber, days]) => ({
            weekNumber,
            days: {
              create: days.map((day) => ({
                dayNumber: day.dayNumber,
                date: new Date(`${day.date}T00:00:00.000Z`),
                objective: day.objective,
                plannedMinutes: day.plannedMinutes,
                tasks: {
                  create: day.tasks.map((task, orderIndex) => ({
                    topicId: topicIds.get(task.topic),
                    title: task.title,
                    type: TaskType[task.type.toUpperCase() as keyof typeof TaskType],
                    estimatedMinutes: task.estimatedMinutes,
                    priority: Priority[task.priority.toUpperCase() as keyof typeof Priority],
                    completionCriteria: task.completionCriteria,
                    orderIndex
                  }))
                }
              }))
            }
          }))
        }
      }
    });
  });
}
