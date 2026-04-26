import { getDefaultPaymentProvider } from "./config";
import { AdyenPaymentAdapter } from "./providers/adyen.server";
import { SquarePaymentAdapter } from "./providers/square.server";
import { StripePaymentAdapter } from "./providers/stripe.server";
import type {
  PaymentPrepareInput,
  PaymentPreparedResult,
  PaymentProviderAdapter,
  PaymentProviderKey,
} from "./types";

const registry: Record<PaymentProviderKey, PaymentProviderAdapter> = {
  stripe: new StripePaymentAdapter(),
  square: new SquarePaymentAdapter(),
  adyen: new AdyenPaymentAdapter(),
};

export function resolvePaymentProvider(key?: PaymentProviderKey): PaymentProviderAdapter {
  const providerKey = key ?? getDefaultPaymentProvider();
  const adapter = registry[providerKey];

  if (!adapter) {
    throw new Error(`Unsupported payment provider: ${providerKey}`);
  }

  return adapter;
}

export async function preparePayment(
  input: PaymentPrepareInput,
): Promise<PaymentPreparedResult> {
  const adapter = resolvePaymentProvider(input.provider);
  return adapter.prepare(input);
}
