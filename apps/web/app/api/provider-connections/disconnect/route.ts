import { NextResponse } from "next/server";
import { deauthorizeStripeAccount } from "../../../../lib/provider-connections/providers/stripe-connect.server";
import { readProviderConnectionState, removeConnection } from "../../../../lib/provider-connections/store.server";
import type { ProviderConnectionKey } from "../../../../lib/provider-connections/types";

export async function POST(request: Request) {
  const form = await request.formData();
  const provider = String(form.get("provider") ?? "") as ProviderConnectionKey;

  if (!provider) {
    return NextResponse.redirect(new URL("/ops/payments/connections?error=missing-provider", request.url));
  }

  const state = await readProviderConnectionState();
  const current = state.connections?.[provider];

  try {
    if (provider === "stripe" && current?.accountId) {
      await deauthorizeStripeAccount(current.accountId);
    }
  } catch {
    // local disconnect still proceeds for MVP
  }

  await removeConnection(provider);

  return NextResponse.redirect(new URL("/ops/payments/connections?success=disconnected", request.url));
}
