import type { AppRole, AppSession } from "@/lib/auth/types";

export const SESSION_COOKIE_NAME = "fr_admin_session";

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeEncode(value: string): string {
  return encodeURIComponent(value);
}

export function serializeSessionCookie(session: AppSession): string {
  return [
    safeEncode(session.name),
    safeEncode(session.email),
    safeEncode(session.role),
    safeEncode(session.tenantSlug),
  ].join("|");
}

export function parseSessionCookie(rawValue: string | undefined | null): AppSession | null {
  if (!rawValue) return null;

  const parts = rawValue.split("|");
  if (parts.length !== 4) return null;

  const [name, email, role, tenantSlug] = parts.map(safeDecode);
  const validRoles: AppRole[] = [
    "platform_admin",
    "restaurant_owner",
    "restaurant_manager",
    "kitchen_staff",
    "support_staff",
    "driver",
    "customer",
  ];

  if (!validRoles.includes(role as AppRole)) return null;
  if (!email || !tenantSlug) return null;

  return {
    name: name || "Unknown User",
    email,
    role: role as AppRole,
    tenantSlug,
  };
}

export function getDevDefaultSession(): AppSession {
  return {
    name: process.env.DEV_DEFAULT_NAME ?? "Demo Owner",
    email: process.env.DEV_DEFAULT_EMAIL ?? "owner@demo-pizzeria.local",
    role: (process.env.DEV_DEFAULT_ROLE as AppRole) ?? "restaurant_owner",
    tenantSlug: process.env.DEV_DEFAULT_TENANT_SLUG ?? "demo-pizzeria",
  };
}