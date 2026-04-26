import type { NextRequest } from "next/server";
import { hasPermission } from "@/lib/auth/rbac";
import type { AppPermission, AppSession } from "@/lib/auth/types";
import { getDevDefaultSession, parseSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export function getRouteSession(request: NextRequest): AppSession | null {
  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const parsed = parseSessionCookie(raw);

  if (parsed) return parsed;

  if (process.env.AUTH_PROVIDER === "dev-cookie") {
    return getDevDefaultSession();
  }

  return null;
}

export function requireRoutePermission(
  request: NextRequest,
  permission: AppPermission
): { ok: true; session: AppSession } | { ok: false; status: number; error: string } {
  const session = getRouteSession(request);

  if (!session) {
    return { ok: false, status: 401, error: "unauthenticated" };
  }

  if (!hasPermission(session.role, permission)) {
    return { ok: false, status: 403, error: "forbidden" };
  }

  return { ok: true, session };
}