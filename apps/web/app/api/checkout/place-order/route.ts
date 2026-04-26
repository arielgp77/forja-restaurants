import { NextResponse } from "next/server";

function money(value: number): string {
  return "$" + value.toFixed(2);
}

function buildOrderNumber(): string {
  const seed = Date.now().toString().slice(-6);
  return "W2-" + seed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customer = body?.customer ?? {};
    const quote = body?.quote ?? {};
    const fulfillment = String(body?.fulfillment ?? "pickup");
    const lines = Array.isArray(body?.lines) ? body.lines : [];

    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        {
          ok: false,
          errors: ["Nombre y teléfono son obligatorios."],
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          errors: ["No puedes colocar una orden vacía."],
        },
        { status: 400 },
      );
    }

    const total = Number(quote?.total ?? 0);
    const orderNumber = buildOrderNumber();

    return NextResponse.json({
      ok: true,
      orderNumber,
      placedAt: new Date().toISOString(),
      fulfillment,
      totalLabel: money(total),
      etaLabel: String(quote?.etaLabel ?? "20-30 min"),
      nextStep:
        fulfillment === "delivery"
          ? "Tu orden fue colocada. El tracking y confirmación final se conectan en W2-B05."
          : "Tu orden fue colocada. Confirmation y tracking se conectan en los siguientes bloques.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: ["No se pudo colocar la orden."],
      },
      { status: 500 },
    );
  }
}
