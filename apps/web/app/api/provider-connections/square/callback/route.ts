import { NextResponse } from "next/server";
import { exchangeSquareCode } from "../../../../../lib/provider-connections/providers/square-oauth.server";
import { consumePendingState, upsertConnection } from "../../../../../lib/provider-connections/store.server";
import { getSquareOauthConfig } from "../../../../../lib/provider-connections/config";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/ops/payments/connections?provider=square&error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/ops/payments/connections?provider=square&error=missing-code-or-state", request.url));
  }

  const pending = await consumePendingState("square", state);
  if (!pending) {
    return NextResponse.redirect(new URL("/ops/payments/connections?provider=square&error=invalid-state", request.url));
  }

  try {
    const result = await exchangeSquareCode(code);
    const cfg = getSquareOauthConfig();

    await upsertConnection("square", {
      provider: "square",
      connected: true,
      connectedAt: new Date().toISOString(),
      environment: cfg.environment,
      merchantId: result.merchant_id,
      label: result.merchant_id || "square-merchant",
      mode: "oauth",
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      metadata: {
        expiresAt: result.expires_at || "",
      },
    });

    return NextResponse.redirect(new URL("/ops/payments/connections?provider=square&success=connected", request.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : "square-callback-failed";
    return NextResponse.redirect(new URL(`/ops/payments/connections?provider=square&error=${encodeURIComponent(message)}`, request.url));
  }
}
