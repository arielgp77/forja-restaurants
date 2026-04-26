import { NextResponse } from "next/server";

function money(value: number): string {
  return "$" + value.toFixed(2);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fulfillment = String(body?.fulfillment ?? "pickup");
    const tipPercent = Number(body?.tipPercent ?? 0);
    const lines = Array.isArray(body?.lines) ? body.lines : [];

    const sanitizedLines = lines
      .map((line: any) => ({
        quantity: Math.max(0, Number(line?.quantity ?? 0)),
        priceValue: Math.max(0, Number(line?.priceValue ?? 0)),
      }))
      .filter((line: any) => line.quantity > 0);

    if (sanitizedLines.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          subtotal: 0,
          tax: 0,
          fee: 0,
          tip: 0,
          total: 0,
          subtotalLabel: "$0.00",
          taxLabel: "$0.00",
          feeLabel: "$0.00",
          tipLabel: "$0.00",
          totalLabel: "$0.00",
          etaMinutes: 0,
          etaLabel: "Sin items",
          errors: ["El carrito está vacío."],
        },
        { status: 400 },
      );
    }

    const subtotal = sanitizedLines.reduce(
      (sum: number, line: any) => sum + line.quantity * line.priceValue,
      0,
    );

    const taxRate = 0.08;
    const tax = Number((subtotal * taxRate).toFixed(2));

    const fee =
      fulfillment === "delivery"
        ? 4.99
        : fulfillment === "curbside"
          ? 1.99
          : 0;

    const tip = Number((subtotal * (tipPercent / 100)).toFixed(2));
    const total = Number((subtotal + tax + fee + tip).toFixed(2));

    const etaMinutes =
      fulfillment === "delivery"
        ? 45
        : fulfillment === "curbside"
          ? 25
          : 20;

    return NextResponse.json({
      ok: true,
      subtotal,
      tax,
      fee,
      tip,
      total,
      subtotalLabel: money(subtotal),
      taxLabel: money(tax),
      feeLabel: money(fee),
      tipLabel: money(tip),
      totalLabel: money(total),
      etaMinutes,
      etaLabel: `${etaMinutes}-${etaMinutes + 10} min`,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        subtotal: 0,
        tax: 0,
        fee: 0,
        tip: 0,
        total: 0,
        subtotalLabel: "$0.00",
        taxLabel: "$0.00",
        feeLabel: "$0.00",
        tipLabel: "$0.00",
        totalLabel: "$0.00",
        etaMinutes: 0,
        etaLabel: "Error",
        errors: ["No se pudo calcular el quote."],
      },
      { status: 500 },
    );
  }
}
