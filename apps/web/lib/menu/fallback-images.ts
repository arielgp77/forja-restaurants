const MENU_FALLBACK_IMAGES: Record<string, string[]> = {
  pizzas: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=80",
  ],
  wings: [
    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1200&q=80",
  ],
  drinks: [
    "https://images.unsplash.com/photo-1622484212850-eb596d769edc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
  ],
};

function normalizeCategory(value: string | undefined): string {
  const raw = String(value ?? "").trim().toLowerCase();

  if (raw.includes("pizza")) return "pizzas";
  if (raw.includes("wing")) return "wings";
  if (raw.includes("drink")) return "drinks";
  if (raw.includes("bebida")) return "drinks";
  if (raw.includes("refresco")) return "drinks";

  return raw || "default";
}

function hashSeed(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

export function getMenuFallbackImage(input: {
  categoryName?: string;
  itemName?: string;
  slug?: string;
}): string {
  const key = normalizeCategory(input.categoryName);
  const bucket = MENU_FALLBACK_IMAGES[key] ?? MENU_FALLBACK_IMAGES.default;
  const seed = hashSeed(
    [input.slug ?? "", input.categoryName ?? "", input.itemName ?? ""].join("|"),
  );

  return bucket[seed % bucket.length];
}

export function ensureMenuItemImage(
  imageUrl: string | null | undefined,
  input: {
    categoryName?: string;
    itemName?: string;
    slug?: string;
  },
): string {
  const trimmed = typeof imageUrl === "string" ? imageUrl.trim() : "";
  if (trimmed.length > 0) {
    return trimmed;
  }

  return getMenuFallbackImage(input);
}
