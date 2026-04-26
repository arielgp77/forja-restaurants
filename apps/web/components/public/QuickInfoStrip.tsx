interface QuickInfoItem {
  label: string;
  value: string;
}

interface QuickInfoStripProps {
  items: QuickInfoItem[];
}

export function QuickInfoStrip({ items }: QuickInfoStripProps) {
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              {item.label}
            </p>
            <p className="mt-2 text-base font-semibold text-neutral-900">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
