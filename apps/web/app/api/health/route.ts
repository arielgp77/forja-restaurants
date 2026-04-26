import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "web",
    env: process.env.APP_ENV ?? "local",
    ts: new Date().toISOString(),
  });
}