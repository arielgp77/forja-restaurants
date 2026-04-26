import { notFound } from "next/navigation";

const categories = [
  {
    name: "Slices",
    subtitle: "Fast counter favorites",
    items: [
      ["Thin Cheese Slice", "$4.50", "Classic slice ready from the counter."],
      ["Thin Pepperoni Slice", "$4.50", "Pepperoni, cheese and red sauce."],
      ["Double Dough Cheese Slice", "$5.00", "Thicker bite, more comfort."],
      ["Double Dough Pepperoni Slice", "$5.00", "A stronger grab-and-go slice."],
      ["Positano's Favorite Slice", "$6.00", "House-style specialty slice."],
    ],
  },
  {
    name: "Deep Dish & Stuffed",
    subtitle: "Chicago-style premium pies",
    items: [
      ["Deep Dish Cheese", "From $17.60", "Thick crust, sauce and mozzarella."],
      ["Deep Dish Pepperoni", "From $20.20", "Chicago-style with pepperoni."],
      ["Stuffed Cheese", "From $18.65", "Loaded and filling."],
      ["Stuffed Pepperoni", "From $21.25", "Heavy, cheesy and premium."],
    ],
  },
  {
    name: "Panzerotti & Calzone",
    subtitle: "High-ticket handhelds",
    items: [
      ["Cheese Panzerotti", "$14.00", "Crispy, stuffed and hot."],
      ["The Positano Panzerotti", "$18.50", "Signature stuffed favorite."],
      ["Cheese Calzone", "$14.00", "Simple, cheesy and filling."],
      ["Caprese Calzone", "$17.50", "Fresh Italian flavor."],
    ],
  },
  {
    name: "Panuozzo",
    subtitle: "Italian sandwiches",
    items: [
      ["Meatball", "$15.50", "Saucy, rich and filling."],
      ["Caprese", "$16.00", "Fresh mozzarella, tomato and basil."],
      ["Italian Cheesesteak", "$19.50", "Premium lunch/dinner option."],
      ["Pepper Steak", "$19.50", "Bold and filling."],
    ],
  },
  {
    name: "Italian Ice",
    subtitle: "Sweet add-ons",
    items: [
      ["Lemon Italian Ice", "From $2.75", "Classic fresh finish."],
      ["Watermelon Italian Ice", "From $2.75", "Light, sweet and refreshing."],
    ],
  },
];

export default async function MenuPage({
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
        <img
          src="/assets/positanos/hero.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          alt="Slice counter"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/25" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-16">
          <a href="/r/positanos" className="text-sm font-bold text-white/70 hover:text-white">
            ← Back to home
          </a>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                Positano's Slice Counter
              </div>
              <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                Slice Menu
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                Classic slices, specialty slices, deep dish, stuffed pizza, panzerotti and Italian ice — organized for fast pickup.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/55">Starting at</p>
              <p className="mt-1 text-4xl font-black">$4.50</p>
              <p className="text-sm text-white/65">classic thin slice</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-10">
        {categories.map((cat) => (
          <div key={cat.name} className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">{cat.subtitle}</p>
                <h2 className="text-3xl font-black">{cat.name}</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {cat.items.map(([name, price, desc]) => (
                <div key={name} className="rounded-2xl border border-neutral-200 bg-[#fffaf2] p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black">{name}</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">{desc}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-red-600 px-3 py-1 text-sm font-black text-white">{price}</p>
                  </div>
                  <button className="mt-4 w-full rounded-full bg-neutral-950 px-4 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-red-700">
                    Add to order
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="sticky bottom-0 border-t border-neutral-200 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black">Ready for pickup</p>
            <p className="text-sm text-neutral-500">Fast pickup ordering, simple and clear.</p>
          </div>
          <a href="/r/positanos/checkout" className="rounded-full bg-red-600 px-6 py-3 text-center font-black text-white hover:bg-red-700">
            Continue to Checkout
          </a>
        </div>
      </div>
    </main>
  );
}