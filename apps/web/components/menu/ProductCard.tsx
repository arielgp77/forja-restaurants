import type { MenuItemVM } from "../../lib/menu/types";

interface ProductCardProps {
  item: MenuItemVM;
  quantity: number;
  onAdd: (itemId: string) => void;
  onOpen: (item: MenuItemVM) => void;
}

export function ProductCard({
  item,
  quantity,
  onAdd,
  onOpen,
}: ProductCardProps) {
  const addDisabled = !item.available;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-neutral-500">
            Sin imagen
          </div>
        )}

        {item.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
            {item.badge}
          </span>
        ) : null}

        <span className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-sm font-semibold text-neutral-900">
          {item.priceLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {item.categoryName}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
          {item.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {item.description}
        </p>

        {!item.available ? (
          <p className="mt-4 text-sm font-semibold text-red-600">
            No disponible
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onAdd(item.id)}
            disabled={addDisabled}
            className={
              addDisabled
                ? "rounded-full bg-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-500"
                : "rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            }
          >
            {addDisabled ? "No disponible" : `Agregar${quantity > 0 ? ` (${quantity})` : ""}`}
          </button>

          <button
            type="button"
            onClick={() => onOpen(item)}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}
