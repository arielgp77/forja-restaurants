export type PaymentProviderKey = "stripe" | "square" | "adyen";
export type PaymentFlowKind = "embedded" | "redirect" | "session";

export interface PaymentLineInput {
  itemId: string;
  name: string;
  quantity: number;
  unitAmount: number;
  currency: string;
}

export interface PaymentCustomerInput {
  name: string;
  email?: string;
  phone?: string;
}

export interface PaymentPrepareInput {
  provider: PaymentProviderKey;
  restaurantSlug: string;
  orderReference: string;
  currency: string;
  returnUrl: string;
  lines: PaymentLineInput[];
  customer?: PaymentCustomerInput;
  metadata?: Record<string, string>;
}

export interface PaymentPreparedBase {
  ok: boolean;
  provider: PaymentProviderKey;
  flow: PaymentFlowKind;
  amount: number;
  currency: string;
}

export interface StripePreparedPayment extends PaymentPreparedBase {
  provider: "stripe";
  flow: "embedded";
  publishableKey: string;
  clientSecret: string;
  paymentIntentId: string;
}

export interface SquarePreparedPayment extends PaymentPreparedBase {
  provider: "square";
  flow: "redirect";
  checkoutUrl: string;
  paymentLinkId?: string;
}

export interface AdyenPreparedPayment extends PaymentPreparedBase {
  provider: "adyen";
  flow: "session";
  clientKey: string;
  environment: "test" | "live";
  session: unknown;
}

export type PaymentPreparedResult =
  | StripePreparedPayment
  | SquarePreparedPayment
  | AdyenPreparedPayment;

export interface PaymentProviderAdapter {
  key: PaymentProviderKey;
  prepare(input: PaymentPrepareInput): Promise<PaymentPreparedResult>;
}

export function computeMinorTotal(lines: PaymentLineInput[]): number {
  return lines.reduce((sum, line) => {
    const qty = Math.max(0, Number(line.quantity ?? 0));
    const unit = Math.max(0, Number(line.unitAmount ?? 0));
    return sum + qty * unit;
  }, 0);
}
