export type CartItemInput = {
  menuItemId: string;
  quantity: number;
};

export type QuoteResponse = {
  ok: boolean;
  currency: string;
  subtotal: number;
  tax: number;
  serviceFee: number;
  tipAmount: number;
  total: number;
  suggestedTipPercents: number[];
  items: Array<{
    menuItemId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineSubtotal: number;
  }>;
  error?: string;
};

export type PlaceOrderResponse = {
  ok: boolean;
  orderId?: string;
  orderNumber?: string;
  redirectUrl?: string;
  error?: string;
};