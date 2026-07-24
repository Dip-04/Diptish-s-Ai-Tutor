import { z } from "zod";
import { generatedRoadmapSchema, type GeneratedRoadmap, type RoadmapInput } from "@/lib/schemas";

const answerFeedbackSchema = z.object({
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string().min(1).max(240)).min(1).max(5),
  improvements: z.array(z.string().min(1).max(240)).min(1).max(5)
});

export type AnswerFeedback = z.infer<typeof answerFeedbackSchema>;

export interface AIProvider {
  generateRoadmap(input: RoadmapInput, safetyIdentifier: string): Promise<GeneratedRoadmap>;
  evaluateAnswer(input: { question: string; answer: string }, safetyIdentifier: string): Promise<AnswerFeedback>;
}

export class AIConfigurationError extends Error {}

type ResponseBody = {
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  error?: { message?: string };
};

function outputText(body: ResponseBody) {
  return body.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
}

export class OpenAIProvider implements AIProvider {
  private async structuredResponse<T>(name: string, schema: z.ZodType<T>, system: string, input: unknown, safetyIdentifier: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_TEXT_MODEL;
    if (!apiKey || !model) throw new AIConfigurationError("OPENAI_API_KEY and OPENAI_TEXT_MODEL must be configured.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          safety_identifier: safetyIdentifier,
          input: [
            { role: "system", content: system },
            { role: "user", content: JSON.stringify(input) }
          ],
          text: {
            format: {
              type: "json_schema",
              name,
              strict: true,
              schema: z.toJSONSchema(schema)
            }
          }
        })
      });
      const body = await response.json() as ResponseBody;
      if (!response.ok) throw new Error(body.error?.message ?? `OpenAI request failed (${response.status}).`);
      const text = outputText(body);
      if (!text) throw new Error("OpenAI returned no structured output.");
      return schema.parse(JSON.parse(text));
    } finally {
      clearTimeout(timeout);
    }
  }

  generateRoadmap(input: RoadmapInput, safetyIdentifier: string) {
    return this.structuredResponse(
      "interview_roadmap",
      generatedRoadmapSchema,
      "Create a realistic, time-bounded interview preparation roadmap. Never invent resume facts. Exclude DSA unless explicitly enabled. Fit every day within the supplied availability.",
      input,
      safetyIdentifier
    );
  }

  evaluateAnswer(input: { question: string; answer: string }, safetyIdentifier: string) {
    return this.structuredResponse(
      "answer_feedback",
      answerFeedbackSchema,
      "Evaluate this practice interview answer. Be concise, constructive, and specific. Do not claim facts not present in the answer.",
      input,
      safetyIdentifier
    );
  }
}
