"use client";

import type { MenuItemVM } from "../../lib/menu/types";

interface ProductDetailSheetProps {
  item: MenuItemVM | null;
  onClose: () => void;
  onAdd: (itemId: string) => void;
}

export function ProductDetailSheet({
  item,
  onClose,
  onAdd,
}: ProductDetailSheetProps) {
  if (!item) {
    return null;
  }

  const addDisabled = !item.available;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-200">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900"
          >
            Cerrar
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {item.categoryName}
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
                {item.name}
              </h3>
            </div>

            <div className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">
              {item.priceLabel}
            </div>
          </div>

          <p className="mt-5 text-base leading-7 text-neutral-600">
            {item.description}
          </p>

          {!item.available ? (
            <p className="mt-4 text-sm font-semibold text-red-600">
              Este producto está marcado como no disponible.
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              disabled={addDisabled}
              className={
                addDisabled
                  ? "rounded-full bg-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-500"
                  : "rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
              }
            >
              {addDisabled ? "No disponible" : "Agregar al carrito"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Seguir viendo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
