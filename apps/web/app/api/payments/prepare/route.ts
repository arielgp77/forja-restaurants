import { NextResponse } from "next/server";
import { getDefaultPaymentProvider } from "../../../../lib/payments/config";
import { preparePayment } from "../../../../lib/payments/registry.server";
import type { PaymentPrepareInput, PaymentProviderKey } from "../../../../lib/payments/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PaymentPrepareInput>;

    const provider = (body.provider ?? getDefaultPaymentProvider()) as PaymentProviderKey;
    const lines = Array.isArray(body.lines) ? body.lines : [];

    if (lines.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Missing payment lines." },
        { status: 400 },
      );
    }

    const payload: PaymentPrepareInput = {
      provider,
      restaurantSlug: String(body.restaurantSlug ?? "demo-pizzeria"),
      orderReference: String(body.orderReference ?? `order-${Date.now()}`),
      currency: String(body.currency ?? "USD"),
      returnUrl: String(body.returnUrl ?? "http://localhost:3000/r/demo-pizzeria/checkout"),
      lines,
      customer: body.customer,
      metadata: body.metadata,
    };

    const result = await preparePayment(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown payment prepare error.",
      },
      { status: 500 },
    );
  }
}
