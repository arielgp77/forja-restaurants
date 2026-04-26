import { NextResponse } from "next/server";
import { getAdminAuthConfig, } from "../../../../lib/auth/config";
import { getAdminSessionCookieOptions } from "../../../../lib/auth/session";

export async function POST(request: Request) {
  const config = getAdminAuthConfig();

  const response = NextResponse.redirect(new URL("/login?logout=1", request.url), 303);
  response.cookies.set(config.cookieName, "", {
    ...getAdminSessionCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}