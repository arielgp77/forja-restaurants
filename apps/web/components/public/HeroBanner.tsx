export function HeroBanner({
  title,
  description,
  imageUrl,
  primaryHref,
  secondaryHref,
}: {
  title: string;
  description: string;
  imageUrl: string;
  primaryHref: string;
  secondaryHref: string;
}) {
  const isPositanos = imageUrl.includes("/assets/positanos/");

  return (
    <section className="relative min-h-[78vh] w-full overflow-hidden bg-black">
      <img
        src={imageUrl}
        alt="Restaurant hero"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(185,28,28,.35),transparent_35%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-100 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-16 md:px-10">
        <div className="max-w-3xl text-white">
          {isPositanos ? (
            <div className="mb-6 flex items-center gap-4">
              <img
                src="/assets/positanos/logo.jpg"
                className="h-24 w-24 rounded-full border-4 border-white bg-white object-contain shadow-2xl"
                alt="Positano logo"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-red-400">
                  Bloomingdale · Slice Counter
                </p>
                <p className="mt-1 text-sm font-bold text-white/75">
                  Ready-to-go pizza, deep dish & Italian ice
                </p>
              </div>
            </div>
          ) : null}

          <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white/85 backdrop-blur">
            Italian flavor · Fast pickup · Built for mobile
          </div>

          <h1 className="text-5xl font-black leading-[.95] tracking-tight md:text-7xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/85 md:text-xl">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={primaryHref}
              className="rounded-full bg-red-600 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-2xl shadow-red-950/40 transition hover:scale-[1.02] hover:bg-red-700"
            >
              Order Now
            </a>

            <a
              href={secondaryHref}
              className="rounded-full border border-white/40 bg-white/10 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20"
            >
              View Slice Menu
            </a>
          </div>

          {isPositanos ? (
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Thin Slice", "$4.50"],
                ["Double Dough", "$5.00"],
                ["Specialty", "$5.75+"],
                ["Deep Dish", "$4.50+"],
              ].map(([label, price]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wide text-white/55">{label}</p>
                  <p className="mt-1 text-2xl font-black text-white">{price}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}