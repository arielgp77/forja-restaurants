import { notFound } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug !== "positanos") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-neutral-950">
      <section className="relative overflow-hidden bg-black text-white">
        <img src="/assets/positanos/hero.jpg" className="absolute inset-0 h-full w-full object-cover opacity-35" alt="Positano counter" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
        <div className="relative mx-auto max-w-5xl px-5 py-12">
          <a href="/r/positanos/menu" className="text-sm font-bold text-white/70 hover:text-white">← Back to menu</a>
          <div className="mt-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-400">Checkout</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight md:text-7xl">Pickup order preview</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
              Simple branded checkout, ready for pickup orders.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-10 md:grid-cols-[1.4fr_.8fr]">
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Customer info</h2>
          <div className="mt-5 grid gap-4">
            {["Name", "Phone", "Pickup notes"].map((label) => (
              <label key={label} className="grid gap-2">
                <span className="text-sm font-bold text-neutral-600">{label}</span>
                <input className="rounded-2xl border border-neutral-200 bg-[#fffaf2] px-4 py-3 outline-none focus:border-red-500" placeholder={label} />
              </label>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-black text-red-700">Payment integration ready</p>
            <p className="mt-1 text-sm leading-6 text-red-900/70">Stripe / Square can be connected later. Secure checkout can be connected when ready.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Order summary</h2>
          <div className="mt-5 grid gap-4">
            {[["Thin Pepperoni Slice", "$4.50"], ["Deep Dish Slice", "$6.00"], ["Lemon Italian Ice", "$2.75"]].map(([name, price]) => (
              <div key={name} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <p className="font-bold">{name}</p>
                <p className="font-black">{price}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>$13.25</strong></div>
            <div className="flex justify-between"><span>Estimated tax</span><strong>$1.10</strong></div>
            <div className="flex justify-between text-lg"><span className="font-black">Total</span><strong>$14.35</strong></div>
          </div>
          <button className="mt-6 w-full rounded-full bg-red-600 px-6 py-4 font-black uppercase tracking-wide text-white shadow-xl hover:bg-red-700">
            Place demo order
          </button>
        </div>
      </section>
    </main>
  );
}