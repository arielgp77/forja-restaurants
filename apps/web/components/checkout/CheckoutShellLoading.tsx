export function CheckoutShellLoading() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Wave 2 · Checkout
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950 md:text-5xl">
            Cargando checkout...
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-600">
            Preparando carrito, quote y formulario.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6">
            <div className="h-28 rounded-[2rem] border border-neutral-200 bg-white shadow-sm" />
            <div className="h-56 rounded-[2rem] border border-neutral-200 bg-white shadow-sm" />
            <div className="h-24 rounded-[2rem] border border-neutral-200 bg-white shadow-sm" />
            <div className="h-64 rounded-[2rem] border border-neutral-200 bg-white shadow-sm" />
          </div>
          <div className="h-[28rem] rounded-[2rem] border border-neutral-200 bg-white shadow-sm" />
        </div>
      </section>
    </main>
  );
}
