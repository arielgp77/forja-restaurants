interface ProductHighlightCardProps {
  name: string;
  description: string;
  priceLabel: string;
  badge?: string;
}

export function ProductHighlightCard({
  name,
  description,
  priceLabel,
  badge,
}: ProductHighlightCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          {badge ? (
            <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          ) : null}
          <h3 className="mt-3 text-xl font-bold tracking-tight text-neutral-900">{name}</h3>
        </div>

        <div className="rounded-full border border-neutral-300 px-3 py-1 text-sm font-semibold text-neutral-800">
          {priceLabel}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-neutral-600">{description}</p>

      <div className="mt-6 pt-4">
        <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Agregar
        </button>
      </div>
    </article>
  );
}
