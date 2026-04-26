"use client";

import { useEffect, useMemo, useState } from "react";
import { clearBrowserCart, readBrowserCart, writeBrowserCart } from "../../lib/cart/browser-cart";
import { PublicHeader } from "../public/PublicHeader";
import { FulfillmentSelector } from "./FulfillmentSelector";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { TipSelector } from "./TipSelector";
import type {
  CheckoutCartLine,
  CheckoutCustomerInput,
  CheckoutFulfillment,
  CheckoutPageVM,
  CheckoutPlaceOrderResponse,
  CheckoutQuoteResponse,
} from "../../lib/checkout/types";

interface CheckoutClientShellProps {
  vm: CheckoutPageVM;
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "").slice(0, 10);
}

export function CheckoutClientShell({ vm }: CheckoutClientShellProps) {
  const [lines, setLines] = useState<CheckoutCartLine[]>(vm.initialCart);
  const [fulfillment, setFulfillment] = useState<CheckoutFulfillment>(vm.defaultFulfillment);
  const [tipPercent, setTipPercent] = useState<number>(vm.suggestedTips[0] ?? 0);
  const [customer, setCustomer] = useState<CheckoutCustomerInput>(vm.defaultCustomer);
  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeResult, setPlaceResult] = useState<CheckoutPlaceOrderResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const catalogById = useMemo(() => {
    return new Map(
      vm.catalog.map((item) => [
        item.itemId,
        {
          itemId: item.itemId,
          name: item.name,
          priceValue: item.priceValue,
          priceLabel: item.priceLabel,
        },
      ]),
    );
  }, [vm.catalog]);

  const totalUnits = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  useEffect(() => {
    const stored = readBrowserCart(vm.slug);
    const entries = Object.entries(stored);

    if (entries.length > 0) {
      const restored = entries
        .map(([itemId, quantity]) => {
          const item = catalogById.get(itemId);
          if (!item || quantity <= 0) {
            return null;
          }

          return {
            itemId: item.itemId,
            name: item.name,
            priceValue: item.priceValue,
            priceLabel: item.priceLabel,
            quantity,
          } satisfies CheckoutCartLine;
        })
        .filter(Boolean) as CheckoutCartLine[];

      if (restored.length > 0) {
        setLines(restored);
      }
    }

    setHydrated(true);
  }, [catalogById, vm.slug]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const nextCart = Object.fromEntries(
      lines
        .filter((line) => line.quantity > 0)
        .map((line) => [line.itemId, line.quantity]),
    );

    writeBrowserCart(vm.slug, nextCart);
  }, [hydrated, lines, vm.slug]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    let cancelled = false;

    async function runQuote() {
      setIsQuoteLoading(true);

      try {
        const response = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: vm.slug,
            fulfillment,
            tipPercent,
            lines,
          }),
        });

        const data = await response.json();

        if (!cancelled) {
          setQuote(data);
        }
      } catch {
        if (!cancelled) {
          setQuote({
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
          });
        }
      } finally {
        if (!cancelled) {
          setIsQuoteLoading(false);
        }
      }
    }

    runQuote();

    return () => {
      cancelled = true;
    };
  }, [hydrated, fulfillment, lines, tipPercent, vm.slug]);

  function updateQuantity(itemId: string, delta: number) {
    setLines((current) =>
      current
        .map((line) =>
          line.itemId === itemId
            ? { ...line, quantity: Math.max(0, line.quantity + delta) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
    setPlaceResult(null);
  }

  function validateForm(): string | null {
    if (lines.length === 0) return "El carrito está vacío.";
    if (!customer.name.trim()) return "Escribe el nombre del cliente.";
    if (normalizePhone(customer.phone).length < 10) return "Escribe un teléfono válido de 10 dígitos.";
    return null;
  }

  async function handlePlaceOrder() {
    const error = validateForm();
    setFormError(error);

    if (error || !quote?.ok) {
      return;
    }

    setIsPlacing(true);
    setPlaceResult(null);

    try {
      const response = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: vm.slug,
          fulfillment,
          customer: {
            ...customer,
            phone: normalizePhone(customer.phone),
          },
          lines,
          quote,
        }),
      });

      const data = await response.json();
      setPlaceResult(data);

      if (data?.ok) {
        clearBrowserCart(vm.slug);
      }
    } catch {
      setPlaceResult({
        ok: false,
        orderNumber: "",
        placedAt: "",
        fulfillment,
        totalLabel: "$0.00",
        etaLabel: "Error",
        nextStep: "",
        errors: ["No se pudo colocar la orden."],
      });
    } finally {
      setIsPlacing(false);
    }
  }

  const canPlace = hydrated && lines.length > 0 && !!quote?.ok && !isQuoteLoading;

  return (
    <>
      <PublicHeader
        restaurantName={vm.restaurantName}
        menuHref={`/r/${vm.slug}/menu`}
        cartHref={`/r/${vm.slug}/checkout`}
        cartCount={totalUnits}
      />

      <main className="min-h-screen bg-neutral-100 text-neutral-950">
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Wave 2 · Checkout
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950 md:text-5xl">
                  {vm.restaurantName} · Checkout
                </h1>
                <p className="mt-4 text-base leading-7 text-neutral-600">
                  {vm.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`/r/${vm.slug}/menu`}
                  className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  Volver al menú
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-6">
              <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Fulfillment
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
                  ¿Cómo se entrega?
                </h2>
                <div className="mt-5">
                  <FulfillmentSelector
                    value={fulfillment}
                    onChange={setFulfillment}
                  />
                </div>
              </section>

              <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Cliente
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
                  Datos del pedido
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-neutral-700">Nombre</span>
                    <input
                      value={customer.name}
                      onChange={(event) =>
                        setCustomer((current) => ({ ...current, name: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-neutral-700">Teléfono</span>
                    <input
                      value={customer.phone}
                      onChange={(event) =>
                        setCustomer((current) => ({ ...current, phone: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-neutral-700">Email</span>
                    <input
                      value={customer.email}
                      onChange={(event) =>
                        setCustomer((current) => ({ ...current, email: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-500"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-neutral-700">Notas</span>
                    <textarea
                      value={customer.notes}
                      onChange={(event) =>
                        setCustomer((current) => ({ ...current, notes: event.target.value }))
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-500"
                      placeholder="Instrucciones del pedido..."
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Tip
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
                  Tip sugerido
                </h2>

                <div className="mt-5">
                  <TipSelector
                    value={tipPercent}
                    options={vm.suggestedTips}
                    onChange={setTipPercent}
                  />
                </div>
              </section>

              <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Cart
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
                      Items del checkout
                    </h2>
                  </div>

                  <div className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">
                    {totalUnits} items
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {lines.map((line) => (
                    <div
                      key={line.itemId}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-neutral-950">{line.name}</p>
                        <p className="text-sm text-neutral-600">
                          {line.quantity} × {line.priceLabel}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.itemId, -1)}
                          className="rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.itemId, 1)}
                          className="rounded-full bg-neutral-950 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {lines.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
                      No hay items en el checkout demo.
                    </div>
                  ) : null}
                </div>
              </section>

              {formError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  {formError}
                </div>
              ) : null}

              {placeResult?.ok ? (
                <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Orden colocada
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-emerald-950">
                    {placeResult.orderNumber}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-emerald-800">
                    Total: {placeResult.totalLabel} · ETA: {placeResult.etaLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    {placeResult.nextStep}
                  </p>
                </section>
              ) : null}
            </div>

            <OrderSummaryCard
              quote={quote}
              totalUnits={totalUnits}
              isQuoteLoading={isQuoteLoading}
              isPlacing={isPlacing}
              canPlace={canPlace}
              onPlace={handlePlaceOrder}
            />
          </div>
        </section>
      </main>
    </>
  );
}
