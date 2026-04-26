import { NextRequest, NextResponse } from "next/server";
import { requireRoutePermission } from "@/lib/auth/route-session";
import { getTenantBySlug, prisma } from "@/lib/db";

function clean(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

export async function POST(request: NextRequest) {
  const auth = requireRoutePermission(request, "menu:manage");
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const tenant = await getTenantBySlug(auth.session.tenantSlug);
  if (!tenant) {
    return NextResponse.json({ ok: false, error: "tenant_not_found" }, { status: 404 });
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { tenantId: tenant.id },
    include: {
      menus: {
        where: { isActive: true },
        take: 1
      }
    }
  });

  if (!restaurant) {
    return NextResponse.json({ ok: false, error: "restaurant_not_found" }, { status: 404 });
  }

  let menu = restaurant.menus[0];
  if (!menu) {
    menu = await prisma.menu.create({
      data: {
        tenantId: tenant.id,
        restaurantId: restaurant.id,
        name: "Main Menu",
        description: "Auto-created by MB05",
        isActive: true,
        currency: "USD"
      }
    });
  }

  const formData = await request.formData();
  const name = clean(formData.get("name"));
  if (!name) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }

  const sortOrder = Number(formData.get("sortOrder") ?? 10);

  await prisma.menuCategory.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      name,
      description: clean(formData.get("description")),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 10,
      isActive: true
    }
  });

  return NextResponse.redirect(new URL("/menu?category_created=1", request.url));
}