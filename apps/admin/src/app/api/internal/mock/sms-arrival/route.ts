import { NextRequest, NextResponse } from "next/server";
import { requireRoutePermission } from "@/lib/auth/route-session";
import { processMockSmsArrival } from "@/lib/db";

function clean(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length > 0 ? s : null;
}

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
  const orderNumber = clean(formData.get("orderNumber"));
  const fromPhone = clean(formData.get("fromPhone"));

  if (!orderNumber || !fromPhone) {
    return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }

  try {
    await processMockSmsArrival({
      tenantSlug: auth.session.tenantSlug,
      orderNumber,
      fromPhone,
      curbsideSpot: clean(formData.get("curbsideSpot")),
      carColor: clean(formData.get("carColor")),
      carModel: clean(formData.get("carModel")),
      body: clean(formData.get("body"))
    });

    return NextResponse.redirect(new URL("/ops/curbside?arrival=1", request.url));
  } catch (error) {
    const msg = error instanceof Error ? error.message : "arrival_failed";
    return NextResponse.redirect(new URL(buildRedirect("/ops/curbside", msg), request.url));
  }
}