export type CheckoutFulfillment = "pickup" | "curbside" | "delivery";

export interface CheckoutCartLine {
  itemId: string;
  name: string;
  priceValue: number;
  priceLabel: string;
  quantity: number;
}

export interface CheckoutCatalogItem {
  itemId: string;
  name: string;
  priceValue: number;
  priceLabel: string;
}

export interface CheckoutCustomerInput {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface CheckoutPageVM {
  slug: string;
  restaurantName: string;
  tagline: string;
  initialCart: CheckoutCartLine[];
  catalog: CheckoutCatalogItem[];
  defaultFulfillment: CheckoutFulfillment;
  suggestedTips: number[];
  supportPhone: string;
  defaultCustomer: CheckoutCustomerInput;
}

export interface CheckoutQuoteResponse {
  ok: boolean;
  subtotal: number;
  tax: number;
  fee: number;
  tip: number;
  total: number;
  subtotalLabel: string;
  taxLabel: string;
  feeLabel: string;
  tipLabel: string;
  totalLabel: string;
  etaMinutes: number;
  etaLabel: string;
  errors?: string[];
}

export interface CheckoutPlaceOrderResponse {
  ok: boolean;
  orderNumber: string;
  placedAt: string;
  fulfillment: CheckoutFulfillment;
  totalLabel: string;
  etaLabel: string;
  nextStep: string;
  errors?: string[];
}
