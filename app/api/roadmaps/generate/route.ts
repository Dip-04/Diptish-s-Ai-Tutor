import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { OpenAIProvider } from "@/lib/ai/provider";
import { roadmapInputSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = roadmapInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid roadmap request", issues: parsed.error.issues }, { status: 400 });

  const fingerprint = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "demo-user";
  const safetyIdentifier = createHash("sha256").update(fingerprint).digest("hex").slice(0, 32);
  try {
    const roadmap = await new OpenAIProvider().generateRoadmap(parsed.data, safetyIdentifier);
    return NextResponse.json(roadmap, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Roadmap generation is temporarily unavailable. Your existing plan was not changed." }, { status: 503 });
  }
}
