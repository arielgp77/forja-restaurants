import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../../infra/db/generated/client/client.ts";
import { ensureMenuItemImage } from "./fallback-images";
import { buildFallbackMenuViewModel } from "./fallback";
import type { MenuCategoryVM, MenuItemVM, MenuPageVM } from "./types";

let prismaSingleton: PrismaClient | null | undefined;

function getPrisma(): PrismaClient | null {
  if (prismaSingleton !== undefined) {
    return prismaSingleton;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    prismaSingleton = null;
    return prismaSingleton;
  }

  try {
    const adapter = new PrismaPg({ connectionString });
    prismaSingleton = new PrismaClient({ adapter });
    return prismaSingleton;
  } catch {
    prismaSingleton = null;
    return prismaSingleton;
  }
}

function asPriceValue(raw: unknown): number {
  if (raw == null) {
    return 0;
  }

  if (typeof raw === "number") {
    if (raw > 1000) {
      return Number((raw / 100).toFixed(2));
    }
    return Number(raw.toFixed(2));
  }

  const num = Number(raw);
  if (Number.isFinite(num)) {
    if (num > 1000) {
      return Number((num / 100).toFixed(2));
    }
    return Number(num.toFixed(2));
  }

  return 0;
}

function asPriceLabel(raw: unknown): string {
  const value = asPriceValue(raw);
  return "$" + value.toFixed(2);
}

export async function buildMenuPageViewModel(
  slug: string,
): Promise<MenuPageVM | null> {
  const fallback = buildFallbackMenuViewModel(slug);
  const prisma = getPrisma();

  if (!prisma) {
    return fallback;
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        restaurants: {
          include: {
            profile: true,
            menus: {
              include: {
                categories: {
                  include: {
                    items: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      if (slug === "demo-pizzeria") {
        return fallback;
      }
      return null;
    }

    const restaurant: any = Array.isArray((tenant as any).restaurants)
      ? (tenant as any).restaurants[0]
      : null;

    if (!restaurant) {
      return fallback;
    }

    const profile: any = restaurant?.profile ?? {};
    const menus: any[] = Array.isArray(restaurant?.menus) ? restaurant.menus : [];
    const rawCategories = menus.flatMap((menu: any) =>
      Array.isArray(menu?.categories) ? menu.categories : []
    );

    const categories: MenuCategoryVM[] = rawCategories.map((category: any, index: number) => ({
      id: String(category?.id ?? "category-" + (index + 1)),
      name: String(category?.name ?? category?.title ?? "Category"),
      description: String(category?.description ?? ""),
    }));

    const items: MenuItemVM[] = rawCategories.flatMap((category: any, categoryIndex: number) => {
      const categoryId = String(category?.id ?? "category-" + (categoryIndex + 1));
      const categoryName = String(category?.name ?? category?.title ?? "Category");
      const rawItems: any[] = Array.isArray(category?.items) ? category.items : [];

      return rawItems.map((item: any, itemIndex: number) => {
        const priceRaw =
          item?.priceCents ??
          item?.basePriceCents ??
          item?.price ??
          item?.basePrice ??
          0;

        const name = String(item?.name ?? "Item");
        const imageUrl = ensureMenuItemImage(
          String(item?.imageUrl ?? item?.photoUrl ?? ""),
          {
            categoryName,
            itemName: name,
            slug,
          },
        );

        return {
          id: String(item?.id ?? categoryId + "-item-" + (itemIndex + 1)),
          categoryId,
          categoryName,
          name,
          description: String(
            item?.description ??
            item?.shortDescription ??
            "Producto del menú."
          ),
          priceLabel: asPriceLabel(priceRaw),
          priceValue: asPriceValue(priceRaw),
          badge: itemIndex === 0 ? "Popular" : undefined,
          available: item?.isActive === false ? false : true,
          imageUrl,
        };
      });
    });

    return {
      slug,
      restaurantName: String(
        profile?.displayName ??
        profile?.name ??
        restaurant?.name ??
        fallback.restaurantName
      ),
      tagline: String(
        profile?.tagline ??
        fallback.tagline
      ),
      categories: categories.length > 0 ? categories : fallback.categories,
      items: items.length > 0 ? items : fallback.items,
    };
  } catch {
    return fallback;
  }
}
