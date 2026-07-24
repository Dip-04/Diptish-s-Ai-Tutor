import { describe, expect, it } from "vitest";
import { roadmapInputSchema } from "./schemas";

const input = {
  targetRole: "Application Security Analyst",
  experienceLevel: "Intermediate",
  preparationDays: 7,
  weekdayHours: 3,
  weekendHours: 8,
  selectedTopics: ["OWASP Top 10"],
  weakTopics: ["OAuth 2.0"],
  includeDSA: false,
  includeMockInterviews: true
};

describe("roadmapInputSchema", () => {
  it("accepts a realistic seven-day plan", () => expect(roadmapInputSchema.safeParse(input).success).toBe(true));
  it("rejects impossible daily availability", () => expect(roadmapInputSchema.safeParse({ ...input, weekdayHours: 24 }).success).toBe(false));
  it("keeps DSA disabled unless explicitly enabled", () => expect(roadmapInputSchema.parse({ ...input, includeDSA: undefined }).includeDSA).toBe(false));
});
