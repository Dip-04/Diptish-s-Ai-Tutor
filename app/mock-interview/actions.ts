"use server";

import { createHash } from "node:crypto";
import { z } from "zod";
import { OpenAIProvider, type AnswerFeedback } from "@/lib/ai/provider";
import { createClient } from "@/lib/supabase/server";

export type FeedbackState = { feedback?: AnswerFeedback; error?: string } | null;

export async function evaluateAnswer(_: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to evaluate an answer." };
  const parsed = z.object({
    question: z.string().min(10).max(500),
    answer: z.string().trim().min(20, "Write at least 20 characters.").max(5_000)
  }).safeParse({
    question: formData.get("question"),
    answer: formData.get("answer")
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid answer." };
  try {
    const safetyIdentifier = createHash("sha256").update(user.id).digest("hex").slice(0, 32);
    return { feedback: await new OpenAIProvider().evaluateAnswer(parsed.data, safetyIdentifier) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Answer evaluation failed." };
  }
}
