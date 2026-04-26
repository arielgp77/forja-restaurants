import { NextResponse } from "next/server";
import { exchangeStripeCode } from "../../../../../lib/provider-connections/providers/stripe-connect.server";
import { consumePendingState, upsertConnection } from "../../../../../lib/provider-connections/store.server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/ops/payments/connections?provider=stripe&error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/ops/payments/connections?provider=stripe&error=missing-code-or-state", request.url));
  }

  const pending = await consumePendingState("stripe", state);
  if (!pending) {
    return NextResponse.redirect(new URL("/ops/payments/connections?provider=stripe&error=invalid-state", request.url));
  }

  try {
    const result = await exchangeStripeCode(code);

    await upsertConnection("stripe", {
      provider: "stripe",
      connected: true,
      connectedAt: new Date().toISOString(),
      environment: result.livemode ? "live" : "test",
      accountId: result.stripe_user_id,
      label: pending.hintEmail || result.stripe_user_id,
      mode: "oauth",
      refreshToken: result.refresh_token,
      metadata: {
        scope: result.scope,
      },
    });

    return NextResponse.redirect(new URL("/ops/payments/connections?provider=stripe&success=connected", request.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : "stripe-callback-failed";
    return NextResponse.redirect(new URL(`/ops/payments/connections?provider=stripe&error=${encodeURIComponent(message)}`, request.url));
  }
}
