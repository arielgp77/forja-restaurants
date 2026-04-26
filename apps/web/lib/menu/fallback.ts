import type { MenuPageVM } from "./types";

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildFallbackMenuViewModel(slug: string): MenuPageVM {
  const restaurantName = titleFromSlug(slug || "demo-pizzeria");

  return {
    slug,
    restaurantName,
    tagline: "Explora el menú y agrega productos rápido.",
    categories: [
      {
        id: "pizzas",
        name: "Pizzas",
        description: "Las favoritas del lugar.",
      },
      {
        id: "wings",
        name: "Wings",
        description: "Complementos con buen margen.",
      },
      {
        id: "drinks",
        name: "Drinks",
        description: "Bebidas rápidas para elevar ticket.",
      },
    ],
    items: [
      {
        id: "pepperoni-pizza",
        categoryId: "pizzas",
        categoryName: "Pizzas",
        name: "Pepperoni Pizza",
        description: "Classic pepperoni and mozzarella.",
        priceLabel: "$16.99",
        priceValue: 16.99,
        badge: "Popular",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "hawaiian-pizza",
        categoryId: "pizzas",
        categoryName: "Pizzas",
        name: "Hawaiian Pizza",
        description: "Ham, pineapple and mozzarella.",
        priceLabel: "$17.99",
        priceValue: 17.99,
        badge: "Combo",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "10-piece-wings",
        categoryId: "wings",
        categoryName: "Wings",
        name: "10 Piece Wings",
        description: "Crispy wings with your favorite sauce.",
        priceLabel: "$12.99",
        priceValue: 12.99,
        badge: "Nuevo",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "2l-soda",
        categoryId: "drinks",
        categoryName: "Drinks",
        name: "2L Soda",
        description: "Assorted flavors for groups and combos.",
        priceLabel: "$3.49",
        priceValue: 3.49,
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  };
}
