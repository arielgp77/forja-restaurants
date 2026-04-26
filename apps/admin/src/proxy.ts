import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/content") ||
    pathname === "/menu" ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/ops")
  );
}

function isAuthRoute(pathname: string): boolean {
  return pathname === "/sign-in";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSessionCookie(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const devCookieMode = process.env.AUTH_PROVIDER === "dev-cookie";

  if (isProtectedPath(pathname) && !session && !devCookieMode) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(pathname) && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/settings/team";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/settings/:path*",
    "/dashboard/:path*",
    "/content/:path*",
    "/menu",
    "/orders/:path*",
    "/ops/:path*"
  ],
};