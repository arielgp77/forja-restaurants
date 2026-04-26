import type { CheckoutQuoteResponse } from "../../lib/checkout/types";

interface OrderSummaryCardProps {
  quote: CheckoutQuoteResponse | null;
  totalUnits: number;
  isQuoteLoading: boolean;
  isPlacing: boolean;
  canPlace: boolean;
  onPlace: () => void;
}

export function OrderSummaryCard({
  quote,
  totalUnits,
  isQuoteLoading,
  isPlacing,
  canPlace,
  onPlace,
}: OrderSummaryCardProps) {
  const errorMessage = quote?.errors?.[0] ?? null;

  return (
    <aside className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Resumen
      </p>
      <h3 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
        Quote del pedido
      </h3>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Items</span>
          <span className="font-semibold text-neutral-950">{totalUnits}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-semibold text-neutral-950">{quote?.subtotalLabel ?? "$0.00"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Tax</span>
          <span className="font-semibold text-neutral-950">{quote?.taxLabel ?? "$0.00"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Fee</span>
          <span className="font-semibold text-neutral-950">{quote?.feeLabel ?? "$0.00"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Tip</span>
          <span className="font-semibold text-neutral-950">{quote?.tipLabel ?? "$0.00"}</span>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-base">
          <span className="font-semibold text-neutral-950">Total</span>
          <span className="text-xl font-black text-neutral-950">{quote?.totalLabel ?? "$0.00"}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          ETA
        </p>
        <p className="mt-2 text-lg font-bold text-neutral-950">
          {quote?.etaLabel ?? (isQuoteLoading ? "Calculando..." : "Pendiente")}
        </p>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onPlace}
        disabled={!canPlace || isPlacing || !!errorMessage}
        className={
          !canPlace || isPlacing || !!errorMessage
            ? "mt-6 w-full rounded-full bg-neutral-300 px-5 py-4 text-sm font-semibold text-neutral-500"
            : "mt-6 w-full rounded-full bg-neutral-950 px-5 py-4 text-sm font-semibold text-white hover:bg-neutral-800"
        }
      >
        {isPlacing ? "Colocando orden..." : "Place order"}
      </button>
    </aside>
  );
}
