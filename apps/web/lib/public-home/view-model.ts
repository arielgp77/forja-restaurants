import type { PublicHomeViewModel } from "./types";

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildPositanosHome(slug: string): PublicHomeViewModel {
  return {
    slug,
    restaurantName: "Positano's Slice and Ice",
    tagline: "Pizza by the slice, deep dish, stuffed pizza & Italian ice in Bloomingdale.",
    heroTitle: "Pizza by the Slice",
    heroDescription:
      "Walk in, choose your slice, and get real pizza fast. Classic thin slices, double dough, specialty slices, deep dish, stuffed pizza, panzerotti and Italian ice — all built around the counter.",
    heroImageUrl: "/assets/positanos/hero.jpg",
    ctaPrimaryHref: `/r/${slug}/menu`,
    ctaSecondaryHref: `/r/${slug}/menu`,
    cartCount: 0,
    info: [
      { label: "Classic thin slice", value: "$4.50" },
      { label: "Double dough slice", value: "$5.00" },
      { label: "Specialty slice", value: "$5.75+" },
      { label: "Deep dish slice", value: "$4.50+" },
    ],
    highlights: [
      {
        id: "slice-counter",
        name: "Slice Counter Experience",
        description: "Multiple styles ready at the counter: classic, pepperoni, double dough, specialty, deep dish and stuffed slices.",
        priceLabel: "From $4.50",
        badge: "Fast",
      },
      {
        id: "deep-dish",
        name: "Deep Dish & Stuffed",
        description: "Heavy, cheesy, high-value items customers crave — perfect for pickup and family orders.",
        priceLabel: "From $17.60",
        badge: "Premium",
      },
      {
        id: "italian-ice",
        name: "Italian Ice Add-On",
        description: "A sweet finish that makes every pickup order feel complete and increases ticket value.",
        priceLabel: "From $2.75",
        badge: "Sweet Finish",
      },
    ],
    storyTitle: "Built Around the Slice Counter",
    storyBody:
      "Positano's strongest advantage is not just pizza — it is variety by the slice. This demo puts the counter, real prices and ready-to-go slice experience first, so customers immediately understand why they should stop in or order pickup.",
    contact: {
      phone: "(331) 200-5023",
      address: "169 E Lake St, Bloomingdale, IL 60108",
      hours: "Daily · 10:30 AM – 9:00 PM",
    },
  };
}

export async function buildPublicHomeViewModel(slug: string): Promise<PublicHomeViewModel> {
  if (slug === "positanos") {
    return buildPositanosHome(slug);
  }

  const restaurantName = titleFromSlug(slug || "demo-pizzeria");

  return {
    slug,
    restaurantName,
    tagline: "Pedidos modernos para pickup, curbside y operación real.",
    heroTitle: `${restaurantName} listo para ordenar`,
    heroDescription:
      "Una portada clara, bonita y enfocada en conversión. El cliente entiende qué vende el lugar y cómo pedir en segundos.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80",
    ctaPrimaryHref: `/r/${slug}/menu`,
    ctaSecondaryHref: `/r/${slug}/menu`,
    cartCount: 2,
    info: [
      { label: "Horario", value: "11:00 AM – 10:00 PM" },
      { label: "Pickup", value: "Disponible" },
      { label: "Curbside", value: "Disponible" },
      { label: "Tiempo estimado", value: "20–30 min" },
    ],
    highlights: [
      {
        id: "1",
        name: "Pizza de la casa",
        description: "La favorita del local con ingredientes balanceados y presentación fuerte.",
        priceLabel: "$14.99",
        badge: "Popular",
      },
      {
        id: "2",
        name: "Combo familiar",
        description: "Pensado para elevar ticket promedio con algo obvio y fácil de ordenar.",
        priceLabel: "$27.99",
        badge: "Combo",
      },
      {
        id: "3",
        name: "Especial del chef",
        description: "Bloque visual para promociones rotativas o especiales del día.",
        priceLabel: "$16.49",
        badge: "Nuevo",
      },
    ],
    storyTitle: "Hecho para vender y operar",
    storyBody:
      "Esta portada de Wave 2 está pensada para que el restaurante se vea serio, convierta mejor y no se sienta como plantilla genérica.",
    contact: {
      phone: "(630) 555-0142",
      address: "123 Main St, Bloomingdale, IL",
      hours: "Lun–Dom · 11:00 AM – 10:00 PM",
    },
  };
}