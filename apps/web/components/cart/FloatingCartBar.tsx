interface FloatingCartBarProps {
  totalUnits: number;
  subtotalLabel: string;
  summaryHref?: string;
  checkoutHref?: string;
}

export function FloatingCartBar({
  totalUnits,
  subtotalLabel,
  summaryHref = "#cart-summary",
  checkoutHref,
}: FloatingCartBarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-full border border-neutral-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Carrito
          </p>
          <p className="text-sm font-semibold text-neutral-900">
            {totalUnits} productos · {subtotalLabel}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={summaryHref}
            className="rounded-full border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Ver resumen
          </a>

          {checkoutHref ? (
            <a
              href={checkoutHref}
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Ir al checkout
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
