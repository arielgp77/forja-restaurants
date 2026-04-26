import "server-only";

import { buildMenuPageViewModel } from "../menu/loader";
import type {
  CheckoutCatalogItem,
  CheckoutCartLine,
  CheckoutPageVM,
} from "./types";

function buildInitialCartFromMenu(items: Array<{
  id: string;
  name: string;
  priceValue: number;
  priceLabel: string;
  categoryName: string;
  available: boolean;
}>): CheckoutCartLine[] {
  const available = items.filter((item) => item.available);

  const pizza = available.find((item) => item.categoryName.toLowerCase().includes("pizza"));
  const drink = available.find((item) => item.categoryName.toLowerCase().includes("drink"));
  const side =
    available.find((item) => item.categoryName.toLowerCase().includes("wing")) ??
    available.find((item) => item.id !== pizza?.id && item.id !== drink?.id);

  const chosen = [pizza, side, drink].filter(Boolean) as typeof available;

  if (chosen.length === 0) {
    return [];
  }

  return chosen.map((item) => ({
    itemId: item.id,
    name: item.name,
    priceValue: item.priceValue,
    priceLabel: item.priceLabel,
    quantity: 1,
  }));
}

function buildCatalog(items: Array<{
  id: string;
  name: string;
  priceValue: number;
  priceLabel: string;
}>): CheckoutCatalogItem[] {
  return items.map((item) => ({
    itemId: item.id,
    name: item.name,
    priceValue: item.priceValue,
    priceLabel: item.priceLabel,
  }));
}

export async function buildCheckoutPageViewModel(
  slug: string,
): Promise<CheckoutPageVM | null> {
  const menuVm = await buildMenuPageViewModel(slug);

  if (!menuVm) {
    return null;
  }

  return {
    slug,
    restaurantName: menuVm.restaurantName,
    tagline: "Revisa tu pedido, calcula quote y deja el pedido listo para confirmación.",
    initialCart: buildInitialCartFromMenu(menuVm.items),
    catalog: buildCatalog(menuVm.items),
    defaultFulfillment: "pickup",
    suggestedTips: [0, 15, 18, 20],
    supportPhone: "(630) 555-0142",
    defaultCustomer: {
      name: "Ariel Demo",
      phone: "6305550199",
      email: "ariel.demo@example.com",
      notes: "",
    },
  };
}
