import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getAdminAuthConfig, type AdminRole } from "./config";

export interface AdminSessionPayload {
  email: string;
  role: AdminRole;
  tenantSlug: string;
  iat: number;
  exp: number;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
}

export function createAdminSessionToken(
  input: Omit<AdminSessionPayload, "iat" | "exp">,
): string {
  const config = getAdminAuthConfig();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + config.sessionTtlHours * 3600;

  const payload: AdminSessionPayload = {
    ...input,
    iat: now,
    exp,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, config.authSecret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | null | undefined): AdminSessionPayload | null {
  if (!token) {
    return null;
  }

  const config = getAdminAuthConfig();
  const parts = token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;
  const expected = signPayload(encodedPayload, config.authSecret);

  if (signature !== expected) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AdminSessionPayload;

    if (!payload?.email || !payload?.role || !payload?.tenantSlug) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }

    return payload;
  }
  catch {
    return null;
  }
}

export async function readAdminSessionFromCookies(): Promise<AdminSessionPayload | null> {
  const config = getAdminAuthConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get(config.cookieName)?.value ?? null;

  return verifyAdminSessionToken(token);
}

export function getAdminSessionCookieOptions() {
  const config = getAdminAuthConfig();

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: config.sessionTtlHours * 3600,
  };
}