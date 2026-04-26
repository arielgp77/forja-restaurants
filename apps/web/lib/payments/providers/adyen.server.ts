import { getAdyenConfig } from "../config";
import {
  computeMinorTotal,
  type AdyenPreparedPayment,
  type PaymentPrepareInput,
  type PaymentProviderAdapter,
} from "../types";

export class AdyenPaymentAdapter implements PaymentProviderAdapter {
  key = "adyen" as const;

  async prepare(input: PaymentPrepareInput): Promise<AdyenPreparedPayment> {
    const cfg = getAdyenConfig();
    const amount = computeMinorTotal(input.lines);

    const baseUrl =
      cfg.environment === "live"
        ? "https://checkout-live.adyen.com"
        : "https://checkout-test.adyen.com";

    const response = await fetch(`${baseUrl}/v69/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": cfg.apiKey,
      },
      body: JSON.stringify({
        amount: {
          value: amount,
          currency: input.currency.toUpperCase(),
        },
        merchantAccount: cfg.merchantAccount,
        reference: input.orderReference,
        returnUrl: input.returnUrl,
        countryCode: "US",
        shopperEmail: input.customer?.email,
        telephoneNumber: input.customer?.phone,
        shopperReference: input.customer?.email || input.customer?.phone || input.orderReference,
        lineItems: input.lines.map((line) => ({
          id: line.itemId,
          description: line.name,
          quantity: line.quantity,
          amountIncludingTax: line.unitAmount * line.quantity,
        })),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Adyen session failed: ${text}`);
    }

    const session = await response.json();

    return {
      ok: true,
      provider: "adyen",
      flow: "session",
      amount,
      currency: input.currency,
      clientKey: cfg.clientKey,
      environment: (cfg.environment as 'test' | 'live'),
      session,
    };
  }
}
