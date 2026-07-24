import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", aiConfigured: Boolean(process.env.OPENAI_API_KEY), timestamp: new Date().toISOString() });
}
