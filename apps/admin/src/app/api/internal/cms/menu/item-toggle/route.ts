import { NextRequest, NextResponse } from "next/server";
import { requireRoutePermission } from "@/lib/auth/route-session";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = requireRoutePermission(request, "menu:manage");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const formData = await request.formData();
  const itemId = String(formData.get("itemId") ?? "").trim();
  const nextState = String(formData.get("nextState") ?? "").trim() === "true";

  if (!itemId) {
    return NextResponse.json({ ok: false, error: "item_id_required" }, { status: 400 });
  }

  await prisma.menuItem.update({
    where: { id: itemId },
    data: { isActive: nextState }
  });

  return NextResponse.redirect(new URL("/menu?toggled=1", request.url));
}