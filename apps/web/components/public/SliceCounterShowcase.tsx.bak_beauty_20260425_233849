export function SliceCounterShowcase() {
  const photos = [
    { src: "/assets/positanos/hero.jpg", label: "Slice counter" },
    { src: "/assets/positanos/margherita.jpg", label: "Margherita" },
    { src: "/assets/positanos/deep-dish.jpg", label: "Deep dish" },
    { src: "/assets/positanos/square-white.jpg", label: "Specialty square" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] px-5 py-14 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,.25),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,120,62,.18),transparent_35%,rgba(255,255,255,.04))]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-400">
              The real advantage
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              A counter full of slices sells faster.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              Instead of hiding variety inside a generic ordering system, this demo puts the slice counter first:
              fast choices, visible prices and ready-to-go cravings.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Starting at</p>
            <p className="mt-1 text-5xl font-black">$4.50</p>
            <p className="text-sm text-white/60">classic thin slice</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.src} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 text-sm font-black uppercase tracking-wide">
                  {photo.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Fast decision", "Customers see slices and prices immediately."],
            ["More impulse orders", "Italian ice, panzerotti and specialty slices become obvious add-ons."],
            ["Better mobile flow", "The page sells the restaurant before the customer even clicks order."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}