import { NextRequest, NextResponse } from "next/server";
import { serializeSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";
import type { AppRole } from "@/lib/auth/types";

const validRoles: AppRole[] = [
  "platform_admin",
  "restaurant_owner",
  "restaurant_manager",
  "kitchen_staff",
  "support_staff",
  "driver",
  "customer",
];

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const name = String(formData.get("name") ?? "Demo Owner");
  const email = String(formData.get("email") ?? "owner@demo-pizzeria.local");
  const tenantSlug = String(formData.get("tenantSlug") ?? "demo-pizzeria");
  const role = String(formData.get("role") ?? "restaurant_owner") as AppRole;
  const redirectTo = String(formData.get("redirectTo") ?? "/settings/team");

  if (!validRoles.includes(role)) {
    return NextResponse.json({ ok: false, error: "invalid_role" }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: serializeSessionCookie({
      name,
      email,
      role,
      tenantSlug,
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}