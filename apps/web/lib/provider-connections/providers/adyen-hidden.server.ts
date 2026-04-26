import "server-only";

import { getAdyenHiddenConfigDefaults } from "../config";

export function buildAdyenHiddenRecord(input: {
  apiKey: string;
  merchantAccount: string;
  clientKey?: string;
  environment?: string;
}) {
  const defaults = getAdyenHiddenConfigDefaults();

  return {
    provider: "adyen" as const,
    connected: true,
    connectedAt: new Date().toISOString(),
    environment: input.environment || defaults.environment,
    merchantId: input.merchantAccount,
    label: input.merchantAccount,
    mode: "manual" as const,
    accessToken: input.apiKey,
    refreshToken: input.clientKey,
    metadata: {},
  };
}
