import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { OpenAIProvider } from "@/lib/ai/provider";
import { roadmapInputSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (Number(request.headers.get("content-length") ?? 0) > 25_000) {
    return NextResponse.json({ success: false, error: "Request is too large." }, { status: 413 });
  }
  const now = Date.now();
  const current = attempts.get(user.id);
  if (current && current.resetAt > now && current.count >= 5) {
    return NextResponse.json({ success: false, error: "Too many requests. Try again later." }, { status: 429 });
  }
  attempts.set(user.id, current && current.resetAt > now ? { ...current, count: current.count + 1 } : { count: 1, resetAt: now + 60_000 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = roadmapInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid roadmap request", issues: parsed.error.issues }, { status: 400 });

  const safetyIdentifier = createHash("sha256").update(user.id).digest("hex").slice(0, 32);
  try {
    const roadmap = await new OpenAIProvider().generateRoadmap(parsed.data, safetyIdentifier);
    return NextResponse.json({ success: true, data: roadmap }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("must be configured")
      ? error.message
      : "Roadmap generation is temporarily unavailable. Your existing plan was not changed.";
    return NextResponse.json({ success: false, error: message }, { status: 503 });
  }
}
