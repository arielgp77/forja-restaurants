import Link from "next/link";

interface PublicHeaderProps {
  restaurantName: string;
  menuHref: string;
  cartCount?: number;
  cartHref?: string;
  menuLabel?: string;
  cartLabel?: string;
}

export function PublicHeader({
  restaurantName,
  menuHref,
  cartCount = 0,
  cartHref,
  menuLabel = "Ver menú",
  cartLabel,
}: PublicHeaderProps) {
  const resolvedCartHref = cartHref ?? menuHref;
  const resolvedCartLabel =
    cartLabel ?? (cartCount > 0 ? `Carrito (${cartCount})` : "Carrito");

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-neutral-900">{restaurantName}</p>
          <p className="text-xs text-neutral-500">Pedido online + operación moderna</p>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href={menuHref}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            {menuLabel}
          </Link>

          <Link
            href={resolvedCartHref}
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {resolvedCartLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
