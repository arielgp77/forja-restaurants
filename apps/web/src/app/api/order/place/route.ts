import { NextRequest, NextResponse } from "next/server";
import { createPickupOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.restaurantSlug || !body?.customer || !Array.isArray(body?.items)) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  try {
    const order = await createPickupOrder({
      restaurantSlug: String(body.restaurantSlug),
      customer: {
        name: String(body.customer.name ?? "").trim(),
        email: String(body.customer.email ?? "").trim(),
        phone: String(body.customer.phone ?? "").trim()
      },
      items: body.items,
      tipPercent: Number(body.tipPercent ?? 0)
    });

    return NextResponse.json({
      ok: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      redirectUrl: `/order/confirmation/${order.orderId}`
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "place_order_failed" },
      { status: 400 }
    );
  }
}