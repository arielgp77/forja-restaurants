import { NextRequest, NextResponse } from "next/server";
import { quotePickupOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.restaurantSlug || !Array.isArray(body?.items)) {
    return NextResponse.json(
      { ok: false, error: "invalid_request", currency: "USD", subtotal: 0, tax: 0, serviceFee: 0, tipAmount: 0, total: 0, suggestedTipPercents: [15,18,20], items: [] },
      { status: 400 }
    );
  }

  try {
    const quote = await quotePickupOrder({
      restaurantSlug: String(body.restaurantSlug),
      items: body.items,
      tipPercent: Number(body.tipPercent ?? 0)
    });

    return NextResponse.json({
      ok: true,
      ...quote
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "quote_failed", currency: "USD", subtotal: 0, tax: 0, serviceFee: 0, tipAmount: 0, total: 0, suggestedTipPercents: [15,18,20], items: [] },
      { status: 400 }
    );
  }
}