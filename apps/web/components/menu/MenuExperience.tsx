"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuItemVM, MenuPageVM } from "../../lib/menu/types";
import { FloatingCartBar } from "../cart/FloatingCartBar";
import { CategoryTabs } from "./CategoryTabs";
import { ProductCard } from "./ProductCard";
import { ProductDetailSheet } from "./ProductDetailSheet";

interface MenuExperienceProps {
  vm: MenuPageVM;
  onCartSummaryChange?: (summary: {
    totalUnits: number;
    subtotal: number;
    subtotalLabel: string;
  }) => void;
}

const ALL_CATEGORY_ID = "all";

function formatSubtotal(value: number): string {
  return "$" + value.toFixed(2);
}

export function MenuExperience({
  vm,
  onCartSummaryChange,
}: MenuExperienceProps) {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORY_ID);
  const [selectedItem, setSelectedItem] = useState<MenuItemVM | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const tabs = useMemo(() => {
    return [
      { id: ALL_CATEGORY_ID, name: "Todos" },
      ...vm.categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    ];
  }, [vm.categories]);

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return vm.items.filter((item) => {
      const matchesCategory =
        activeCategoryId === ALL_CATEGORY_ID || item.categoryId === activeCategoryId;

      const matchesSearch =
        normalized.length === 0 ||
        item.name.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.categoryName.toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryId, search, vm.items]);

  const totalUnits = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart],
  );

  const subtotal = useMemo(() => {
    return vm.items.reduce((sum, item) => {
      const qty = cart[item.id] ?? 0;
      return sum + item.priceValue * qty;
    }, 0);
  }, [cart, vm.items]);

  useEffect(() => {
    onCartSummaryChange?.({
      totalUnits,
      subtotal,
      subtotalLabel: formatSubtotal(subtotal),
    });
  }, [onCartSummaryChange, subtotal, totalUnits]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedItem]);

  function handleAdd(itemId: string) {
    setCart((current) => ({
      ...current,
      [itemId]: (current[itemId] ?? 0) + 1,
    }));
  }

  function handleClearCart() {
    setCart({});
  }

  function handleCloseModal() {
    setSelectedItem(null);
  }

  const checkoutHref = `/r/${vm.slug}/checkout`;

  return (
    <>
      <main className="min-h-screen bg-neutral-100 text-neutral-950">
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Wave 2 · Menú
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950 md:text-5xl">
                  {vm.restaurantName} · Menú
                </h1>
                <p className="mt-4 text-base leading-7 text-neutral-600">
                  {vm.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`/r/${vm.slug}`}
                  className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  Volver al home
                </a>

                {totalUnits > 0 ? (
                  <>
                    <a
                      href={checkoutHref}
                      className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                      Ir al checkout
                    </a>

                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                    >
                      Limpiar carrito
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Buscar
                </span>
                <div className="flex gap-3">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Busca pizzas, wings o drinks..."
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-500"
                  />
                  {search.trim().length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                    >
                      Limpiar
                    </button>
                  ) : null}
                </div>
              </label>

              <div className="lg:pb-[2px]">
                <CategoryTabs
                  categories={tabs}
                  activeCategoryId={activeCategoryId}
                  onSelect={setActiveCategoryId}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Productos
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
                Explora y agrega rápido
              </h2>
            </div>

            <div className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800">
              {filteredItems.length} resultados
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-neutral-900">
                No encontramos productos con ese filtro.
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Cambia la búsqueda o selecciona otra categoría.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  quantity={cart[item.id] ?? 0}
                  onAdd={handleAdd}
                  onOpen={setSelectedItem}
                />
              ))}
            </div>
          )}
        </section>

        <section id="cart-summary" className="mx-auto max-w-6xl px-4 pb-24">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Resumen
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
                  Carrito del menú
                </h3>
              </div>

              <div className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">
                {totalUnits} items · {formatSubtotal(subtotal)}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {vm.items
                .filter((item) => (cart[item.id] ?? 0) > 0)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-neutral-950">{item.name}</p>
                      <p className="text-sm text-neutral-600">
                        {cart[item.id] ?? 0} × {item.priceLabel}
                      </p>
                    </div>

                    <div className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white">
                      {formatSubtotal((cart[item.id] ?? 0) * item.priceValue)}
                    </div>
                  </div>
                ))}

              {totalUnits === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
                  Tu carrito todavía está vacío.
                </div>
              ) : (
                <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <a
                    href={checkoutHref}
                    className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    Ir al checkout
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <ProductDetailSheet
        item={selectedItem}
        onClose={handleCloseModal}
        onAdd={handleAdd}
      />

      {totalUnits > 0 ? (
        <FloatingCartBar
          totalUnits={totalUnits}
          subtotalLabel={formatSubtotal(subtotal)}
          summaryHref="#cart-summary"
          checkoutHref={checkoutHref}
        />
      ) : null}
    </>
  );
}
