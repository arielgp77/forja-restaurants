import { NextResponse } from "next/server";
import { validateBootstrapCredentials } from "../../../../lib/auth/bootstrap";
import { getAdminAuthConfig } from "../../../../lib/auth/config";
import { createAdminSessionToken, getAdminSessionCookieOptions } from "../../../../lib/auth/session";

async function readCredentials(request: Request): Promise<{ email: string; password: string }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return {
      email: String(body?.email ?? ""),
      password: String(body?.password ?? ""),
    };
  }

  const formData = await request.formData();
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export async function POST(request: Request) {
  const config = getAdminAuthConfig();
  const { email, password } = await readCredentials(request);

  const ok = validateBootstrapCredentials(email, password);

  if (!ok) {
    return NextResponse.redirect(new URL("/login?error=invalid_credentials", request.url), 303);
  }

  const token = createAdminSessionToken({
    email: config.bootstrapOwnerEmail,
    role: "owner",
    tenantSlug: config.bootstrapTenantSlug,
  });

  const response = NextResponse.redirect(new URL("/orders", request.url), 303);
  response.cookies.set(config.cookieName, token, getAdminSessionCookieOptions());

  return response;
}