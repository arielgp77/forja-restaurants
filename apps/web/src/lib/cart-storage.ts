"use client";

import type { CartItemInput } from "@/lib/cart-types";

const CART_KEY_PREFIX = "fr_cart:";

export function getCartStorageKey(slug: string): string {
  return `${CART_KEY_PREFIX}${slug}`;
}

export function readCart(slug: string): CartItemInput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getCartStorageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItemInput[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(slug: string, items: CartItemInput[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getCartStorageKey(slug), JSON.stringify(items));
}

export function clearCart(slug: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getCartStorageKey(slug));
}