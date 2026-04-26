import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AppPermission, AppSession } from "@/lib/auth/types";
import { hasPermission } from "@/lib/auth/rbac";
import { getDevDefaultSession, parseSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export async function getServerSessionOrNull(): Promise<AppSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE_NAME)?.value;
  const parsed = parseSessionCookie(raw);

  if (parsed) return parsed;

  if (process.env.AUTH_PROVIDER === "dev-cookie") {
    return getDevDefaultSession();
  }

  return null;
}

export async function requirePermission(permission: AppPermission): Promise<AppSession> {
  const session = await getServerSessionOrNull();

  if (!session) {
    redirect("/sign-in");
  }

  if (!hasPermission(session.role, permission)) {
    redirect("/sign-in?error=forbidden");
  }

  return session;
}