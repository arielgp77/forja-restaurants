import { notFound } from "next/navigation";
import { HeroBanner } from "../../../components/public/HeroBanner";
import { ProductHighlightCard } from "../../../components/public/ProductHighlightCard";
import { PublicFooter } from "../../../components/public/PublicFooter";
import { PublicHeader } from "../../../components/public/PublicHeader";
import { SplashIntro } from "../../../components/public/SplashIntro";
import { QuickInfoStrip } from "../../../components/public/QuickInfoStrip";
import { buildPublicHomeViewModelFromTenant } from "../../../lib/public-home/tenant-loader";

export async function generateStaticParams() {
  return [
    { slug: "positanos" },
    { slug: "demo-pizzeria" }
  ];
}
export default async function PublicHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vm = await buildPublicHomeViewModelFromTenant(slug);

  if (!vm) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      {slug === "positanos" ? (
        <SplashIntro logoUrl="/assets/positanos/logo.jpg" restaurantName={vm.restaurantName} />
      ) : null}
      <PublicHeader
        restaurantName={vm.restaurantName}
        menuHref={vm.ctaSecondaryHref}
        cartCount={vm.cartCount}
      />

      <HeroBanner
        title={vm.heroTitle}
        description={vm.heroDescription}
        imageUrl={vm.heroImageUrl}
        primaryHref={vm.ctaPrimaryHref}
        secondaryHref={vm.ctaSecondaryHref}
      />

      <QuickInfoStrip items={vm.info} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Destacados
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
              Lo primero que debe vender
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vm.highlights.map((item) => (
            <ProductHighlightCard
              key={item.id}
              name={item.name}
              description={item.description}
              priceLabel={item.priceLabel}
              badge={item.badge}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Confianza
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
            {vm.storyTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">{vm.storyBody}</p>
        </div>
      </section>

      <PublicFooter
        restaurantName={vm.restaurantName}
        phone={vm.contact.phone}
        address={vm.contact.address}
        hours={vm.contact.hours}
      />
    </main>
  );
}