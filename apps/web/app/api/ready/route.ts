import { NextResponse } from "next/server";

function hasRequiredEnv(): boolean {
  return Boolean(
    process.env.APP_ENV &&
    process.env.WEB_BASE_URL &&
    process.env.INTERNAL_API_BASE_URL &&
    process.env.DATABASE_URL &&
    process.env.AUTH_SECRET,
  );
}

export async function GET() {
  const ready = hasRequiredEnv();

  return NextResponse.json(
    {
      ready,
      app: "web",
      env: process.env.APP_ENV ?? "local",
    },
    { status: ready ? 200 : 503 },
  );
}