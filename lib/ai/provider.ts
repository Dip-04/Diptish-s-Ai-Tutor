import { generatedRoadmapSchema, type GeneratedRoadmap, type RoadmapInput } from "@/lib/schemas";

export interface AIProvider {
  generateRoadmap(input: RoadmapInput, safetyIdentifier: string): Promise<GeneratedRoadmap>;
  evaluateAnswer(input: { question: string; answer: string }, safetyIdentifier: string): Promise<{ score: number; strengths: string[]; improvements: string[] }>;
}

const demoRoadmap = (input: RoadmapInput): GeneratedRoadmap => ({
  title: `${input.preparationDays}-day ${input.targetRole} roadmap`,
  mode: input.preparationDays <= 3 ? "emergency" : input.preparationDays <= 14 ? "fast-track" : "balanced",
  days: [{
    dayNumber: 1,
    date: new Date().toISOString().slice(0, 10),
    objective: "Build and explain the core foundations",
    plannedMinutes: Math.round(input.weekdayHours * 60),
    tasks: [{
      title: `Review ${input.selectedTopics[0] ?? "role fundamentals"}`,
      type: "learn",
      topic: input.selectedTopics[0] ?? "Foundations",
      subtopic: null,
      estimatedMinutes: Math.max(15, Math.min(60, Math.round(input.weekdayHours * 20))),
      priority: "critical",
      difficulty: "intermediate",
      completionCriteria: ["Explain the concept clearly with one practical example"],
      resourceIds: [],
      dependencies: []
    }],
    dailyDeliverables: ["Record one two-minute spoken explanation"],
    interviewQuestionCount: 10,
    revisionTopics: input.weakTopics.slice(0, 3)
  }],
  notice: "Demo response — AI provider is not configured."
});

export class OpenAIProvider implements AIProvider {
  async generateRoadmap(input: RoadmapInput, safetyIdentifier: string): Promise<GeneratedRoadmap> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return demoRoadmap(input);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.OPENAI_TEXT_MODEL || "gpt-5.6-sol",
          safety_identifier: safetyIdentifier,
          reasoning: { effort: "medium" },
          input: [
            { role: "system", content: "Create a realistic, time-bounded interview preparation roadmap. Never invent resume facts. DSA is excluded unless explicitly enabled. Return only JSON." },
            { role: "user", content: JSON.stringify(input) }
          ],
          text: {
            format: {
              type: "json_schema",
              name: "interview_roadmap",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                required: ["title", "mode", "days", "notice"],
                properties: {
                  title: { type: "string" },
                  mode: { enum: ["balanced", "fast-track", "emergency", "deep-learning", "office-friendly"] },
                  days: { type: "array", items: { type: "object" } },
                  notice: { type: "string" }
                }
              }
            }
          }
        })
      });
      if (!response.ok) throw new Error(`AI request failed with status ${response.status}`);
      const body = await response.json() as { output_text?: string };
      return generatedRoadmapSchema.parse(JSON.parse(body.output_text ?? ""));
    } finally {
      clearTimeout(timeout);
    }
  }

  async evaluateAnswer(input: { question: string; answer: string }, safetyIdentifier: string) {
    void safetyIdentifier;
    const wordCount = input.answer.trim().split(/\s+/).length;
    return {
      score: Math.min(88, 48 + wordCount),
      strengths: ["Directly addresses the question", "Uses clear language"],
      improvements: ["Add a concrete example", "Close with the security or business impact"]
    };
  }
}
