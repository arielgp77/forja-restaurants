interface PublicFooterProps {
  restaurantName: string;
  phone: string;
  address: string;
  hours: string;
}

export function PublicFooter({
  restaurantName,
  phone,
  address,
  hours,
}: PublicFooterProps) {
  return (
    <footer className="border-t border-black/5 bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{restaurantName}</p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Sistema de pedido, operación y seguimiento con presentación seria para demo y piloto.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Contacto</p>
          <p className="mt-3 text-sm text-white/80">{phone}</p>
          <p className="mt-1 text-sm text-white/80">{address}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Horario</p>
          <p className="mt-3 text-sm text-white/80">{hours}</p>
        </div>
      </div>
    </footer>
  );
}
