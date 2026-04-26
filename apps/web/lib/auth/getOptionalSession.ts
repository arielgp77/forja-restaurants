import crypto from "node:crypto";
import { cookies } from "next/headers";

export interface WebSessionPayload {
  email: string;
  role: string;
  tenantSlug: string;
  iat: number;
  exp: number;
}

function signPayload(encodedPayload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

export async function getOptionalWebSession(): Promise<WebSessionPayload | null> {
  const cookieName = process.env.AUTH_COOKIE_NAME ?? "fr_web_session";
  const authSecret = process.env.AUTH_SECRET ?? "dev-change-me-auth-secret";

  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value ?? null;

  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;
  const expected = signPayload(encodedPayload, authSecret);

  if (signature !== expected) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as WebSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload?.email || payload.exp <= now) {
      return null;
    }

    return payload;
  }
  catch {
    return null;
  }
}