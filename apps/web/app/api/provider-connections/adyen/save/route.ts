import { NextResponse } from "next/server";
import { buildAdyenHiddenRecord } from "../../../../../lib/provider-connections/providers/adyen-hidden.server";
import { upsertConnection } from "../../../../../lib/provider-connections/store.server";

export async function POST(request: Request) {
  const form = await request.formData();

  const apiKey = String(form.get("apiKey") ?? "").trim();
  const merchantAccount = String(form.get("merchantAccount") ?? "").trim();
  const clientKey = String(form.get("clientKey") ?? "").trim();
  const environment = String(form.get("environment") ?? "test").trim();

  if (!apiKey || !merchantAccount) {
    return NextResponse.redirect(new URL("/ops/payments/connections?provider=adyen&error=missing-adyen-fields", request.url));
  }

  await upsertConnection(
    "adyen",
    buildAdyenHiddenRecord({
      apiKey,
      merchantAccount,
      clientKey,
      environment,
    }),
  );

  return NextResponse.redirect(new URL("/ops/payments/connections?provider=adyen&success=saved", request.url));
}
