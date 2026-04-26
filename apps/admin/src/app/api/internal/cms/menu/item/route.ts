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

  const formData = await request.formData();

  const categoryId = clean(formData.get("categoryId"));
  const name = clean(formData.get("name"));
  const slug = clean(formData.get("slug"));
  const priceRaw = clean(formData.get("price"));

  if (!categoryId || !name || !slug || !priceRaw) {
    return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }

  const category = await prisma.menuCategory.findUnique({
    where: { id: categoryId },
    include: { menu: true }
  });

  if (!category) {
    return NextResponse.json({ ok: false, error: "category_not_found" }, { status: 404 });
  }

  const sortOrder = Number(formData.get("sortOrder") ?? 10);
  const price = Number(priceRaw);

  if (!Number.isFinite(price)) {
    return NextResponse.json({ ok: false, error: "invalid_price" }, { status: 400 });
  }

  await prisma.menuItem.create({
    data: {
      tenantId: tenant.id,
      menuId: category.menuId,
      categoryId: category.id,
      name,
      slug,
      description: clean(formData.get("description")),
      price: price.toFixed(2),
      isActive: true,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 10
    }
  });

  return NextResponse.redirect(new URL("/menu?item_created=1", request.url));
}