import { NextRequest, NextResponse } from "next/server";
import { demoTeamMembers } from "@/lib/auth/dev-team";
import { requireRoutePermission } from "@/lib/auth/route-session";

export async function GET(request: NextRequest) {
  const auth = requireRoutePermission(request, "team:read");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const members = demoTeamMembers.filter((member) => member.tenantSlug === auth.session.tenantSlug);
  return NextResponse.json({ ok: true, members });
}

export async function POST(request: NextRequest) {
  const auth = requireRoutePermission(request, "team:manage");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => ({}));

  return NextResponse.json({
    ok: true,
    message: "MB03 scaffold received request. Persistence is postponed to the next slice.",
    input: body,
  });
}