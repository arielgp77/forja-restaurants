import { NextRequest, NextResponse } from "next/server";
import { requireRoutePermission } from "@/lib/auth/route-session";
import { updateAdminOrderStatus } from "@/lib/db";

const validStatuses = new Set([
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED"
]);

function buildRedirect(base: string, error?: string) {
  const hasQuery = base.includes("?");
  return error
    ? `${base}${hasQuery ? "&" : "?"}error=${encodeURIComponent(error)}`
    : base;
}

export async function POST(request: NextRequest) {
  const auth = requireRoutePermission(request, "orders:manage");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const formData = await request.formData();
  const orderId = String(formData.get("orderId") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/ops/board").trim();

  if (!orderId || !validStatuses.has(nextStatus)) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  try {
    await updateAdminOrderStatus({
      tenantSlug: auth.session.tenantSlug,
      orderId,
      nextStatus: nextStatus as any
    });

    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    const msg = error instanceof Error ? error.message : "update_failed";
    return NextResponse.redirect(new URL(buildRedirect(redirectTo, msg), request.url));
  }
}