import { NextResponse } from "next/server";
import { getStripeStartUrl } from "../../../../../lib/provider-connections/providers/stripe-connect.server";
import { createPendingState } from "../../../../../lib/provider-connections/store.server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hintEmail = url.searchParams.get("email") ?? undefined;

  const state = await createPendingState("stripe", hintEmail);
  const redirect = await getStripeStartUrl({ state, hintEmail });

  return NextResponse.redirect(redirect);
}
