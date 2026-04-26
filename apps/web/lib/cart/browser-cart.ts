export type BrowserCartMap = Record<string, number>;

function keyForSlug(slug: string): string {
  return `forja_restaurants_menu_cart_${slug}`;
}

export function readBrowserCart(slug: string): BrowserCartMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(keyForSlug(slug));
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const entries = Object.entries(parsed)
      .map(([itemId, qty]) => [String(itemId), Math.max(0, Number(qty ?? 0))] as const)
      .filter(([, qty]) => Number.isFinite(qty) && qty > 0);

    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

export function writeBrowserCart(slug: string, cart: BrowserCartMap): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const sanitized = Object.fromEntries(
      Object.entries(cart)
        .map(([itemId, qty]) => [String(itemId), Math.max(0, Number(qty ?? 0))] as const)
        .filter(([, qty]) => Number.isFinite(qty) && qty > 0),
    );

    window.localStorage.setItem(keyForSlug(slug), JSON.stringify(sanitized));
  } catch {
    // noop
  }
}

export function clearBrowserCart(slug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(keyForSlug(slug));
  } catch {
    // noop
  }
}
