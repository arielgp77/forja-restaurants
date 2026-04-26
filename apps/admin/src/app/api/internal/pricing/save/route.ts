import { NextRequest, NextResponse } from "next/server";
import { requireRoutePermission } from "@/lib/auth/route-session";
import { savePricingPolicy } from "@/lib/db";

function n(v: FormDataEntryValue | null, fallback: number): number {
  const x = Number(String(v ?? "").trim());
  return Number.isFinite(x) ? x : fallback;
}

export async function POST(request: NextRequest) {
  const auth = requireRoutePermission(request, "settings:manage");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const formData = await request.formData();

  await savePricingPolicy({
    tenantSlug: auth.session.tenantSlug,
    policy: {
      taxRatePercent: n(formData.get("taxRatePercent"), 8),
      serviceFeeType: String(formData.get("serviceFeeType") ?? "fixed").trim() === "percent" ? "percent" : "fixed",
      serviceFeeValue: n(formData.get("serviceFeeValue"), 3),
      suggestedTipPercents: [
        n(formData.get("tip1"), 15),
        n(formData.get("tip2"), 18),
        n(formData.get("tip3"), 20)
      ],
      driverBasePay: n(formData.get("driverBasePay"), 3),
      tipsPassThrough: String(formData.get("tipsPassThrough") ?? "true").trim() === "true"
    }
  });

  return NextResponse.redirect(new URL("/settings/pricing?saved=1", request.url));
}