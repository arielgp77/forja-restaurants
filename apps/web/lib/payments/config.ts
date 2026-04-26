import type { PaymentProviderKey } from "./types";

function must(value: string | undefined, name: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getDefaultPaymentProvider(): PaymentProviderKey {
  const raw = (process.env.PAYMENTS_DEFAULT_PROVIDER ?? "stripe").toLowerCase();

  if (raw === "stripe" || raw === "square" || raw === "adyen") {
    return raw;
  }

  return "stripe";
}

export function getStripeConfig() {
  return {
    secretKey: must(process.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY"),
    publishableKey: must(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  };
}

export function getSquareConfig() {
  return {
    accessToken: must(process.env.SQUARE_ACCESS_TOKEN, "SQUARE_ACCESS_TOKEN"),
    locationId: must(process.env.SQUARE_LOCATION_ID, "SQUARE_LOCATION_ID"),
    environment: (process.env.SQUARE_ENVIRONMENT ?? "sandbox").toLowerCase() === "production"
      ? "production"
      : "sandbox",
  };
}

export function getAdyenConfig() {
  const environment = (process.env.ADYEN_ENVIRONMENT ?? "test").toLowerCase() === "live"
    ? "live"
    : "test";

  return {
    apiKey: must(process.env.ADYEN_API_KEY, "ADYEN_API_KEY"),
    merchantAccount: must(process.env.ADYEN_MERCHANT_ACCOUNT, "ADYEN_MERCHANT_ACCOUNT"),
    clientKey: must(process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY, "NEXT_PUBLIC_ADYEN_CLIENT_KEY"),
    environment,
  };
}
