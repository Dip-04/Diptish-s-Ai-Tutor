import { z } from "zod";

export const roadmapTaskSchema = z.object({
  title: z.string().min(1).max(160),
  type: z.enum(["learn", "practice", "build", "interview", "revision", "quiz"]),
  topic: z.string().min(1),
  subtopic: z.string().nullable(),
  estimatedMinutes: z.number().int().min(5).max(480),
  priority: z.enum(["critical", "high", "medium", "optional"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  completionCriteria: z.array(z.string().min(1)).min(1),
  resourceIds: z.array(z.string()),
  dependencies: z.array(z.string())
});

export const roadmapDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string().date(),
  objective: z.string().min(1),
  plannedMinutes: z.number().int().positive().max(960),
  tasks: z.array(roadmapTaskSchema).min(1),
  dailyDeliverables: z.array(z.string().min(1)).min(1),
  interviewQuestionCount: z.number().int().nonnegative(),
  revisionTopics: z.array(z.string())
});

export const generatedRoadmapSchema = z.object({
  title: z.string().min(1),
  mode: z.enum(["balanced", "fast-track", "emergency", "deep-learning", "office-friendly"]),
  days: z.array(roadmapDaySchema).min(1).max(90),
  notice: z.string()
});

export const roadmapInputSchema = z.object({
  targetRole: z.string().min(2).max(100),
  experienceLevel: z.string().min(1).max(50),
  preparationDays: z.number().int().min(1).max(365),
  weekdayHours: z.number().min(0).max(16),
  weekendHours: z.number().min(0).max(16),
  selectedTopics: z.array(z.string().max(100)).max(40),
  weakTopics: z.array(z.string().max(100)).max(40),
  includeDSA: z.boolean().default(false),
  includeMockInterviews: z.boolean().default(true)
});

export type RoadmapInput = z.infer<typeof roadmapInputSchema>;
export type GeneratedRoadmap = z.infer<typeof generatedRoadmapSchema>;
