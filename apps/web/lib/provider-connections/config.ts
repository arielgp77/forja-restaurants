function must(value: string | undefined, name: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getAppBaseUrl(): string {
  return process.env.APP_BASE_URL?.trim() || "http://localhost:3000";
}

export function getStripeConnectConfig() {
  return {
    clientId: must(process.env.STRIPE_CONNECT_CLIENT_ID, "STRIPE_CONNECT_CLIENT_ID"),
    secretKey: must(process.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY"),
    mode: (process.env.STRIPE_CONNECT_MODE ?? "oauth_standard_mvp").trim(),
  };
}

export function getSquareOauthConfig() {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "sandbox").toLowerCase() === "production"
    ? "production"
    : "sandbox";

  return {
    appId: must(process.env.SQUARE_APP_ID, "SQUARE_APP_ID"),
    appSecret: must(process.env.SQUARE_APP_SECRET, "SQUARE_APP_SECRET"),
    environment: env,
    scopes: (process.env.SQUARE_OAUTH_SCOPES ?? "MERCHANT_PROFILE_READ PAYMENTS_WRITE PAYMENTS_READ ORDERS_READ ORDERS_WRITE")
      .trim()
      .split(/\s+/)
      .filter(Boolean),
  };
}

export function getAdyenHiddenConfigDefaults() {
  return {
    environment: (process.env.ADYEN_ENVIRONMENT ?? "test").trim(),
  };
}
