import { NextRequest, NextResponse } from "next/server";
import { requireRoutePermission } from "@/lib/auth/route-session";
import { getTenantBySlug, prisma } from "@/lib/db";

function clean(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

export async function POST(request: NextRequest) {
  const auth = requireRoutePermission(request, "settings:manage");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const tenant = await getTenantBySlug(auth.session.tenantSlug);
  if (!tenant) {
    return NextResponse.json({ ok: false, error: "tenant_not_found" }, { status: 404 });
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { tenantId: tenant.id },
    select: { id: true }
  });

  if (!restaurant) {
    return NextResponse.json({ ok: false, error: "restaurant_not_found" }, { status: 404 });
  }

  const formData = await request.formData();

  await prisma.restaurantProfile.upsert({
    where: { restaurantId: restaurant.id },
    create: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      storyHeadline: clean(formData.get("storyHeadline")),
      storyBody: clean(formData.get("storyBody")),
      ownerStory: clean(formData.get("ownerStory")),
    },
    update: {
      storyHeadline: clean(formData.get("storyHeadline")),
      storyBody: clean(formData.get("storyBody")),
      ownerStory: clean(formData.get("ownerStory")),
    }
  });

  return NextResponse.redirect(new URL("/content/story?saved=1", request.url));
}