import crypto from "node:crypto";
import { getSquareConfig } from "../config";
import {
  computeMinorTotal,
  type PaymentPrepareInput,
  type PaymentProviderAdapter,
  type SquarePreparedPayment,
} from "../types";

export class SquarePaymentAdapter implements PaymentProviderAdapter {
  key = "square" as const;

  async prepare(input: PaymentPrepareInput): Promise<SquarePreparedPayment> {
    const cfg = getSquareConfig();
    const amount = computeMinorTotal(input.lines);

    const baseUrl =
      cfg.environment === "production"
        ? "https://connect.squareup.com"
        : "https://connect.squareupsandbox.com";

    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.accessToken}`,
        "Square-Version": "2025-09-24",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        quick_pay: {
          name: `Order ${input.orderReference}`,
          price_money: {
            amount,
            currency: input.currency.toUpperCase(),
          },
          location_id: cfg.locationId,
        },
        checkout_options: {
          redirect_url: input.returnUrl,
          ask_for_shipping_address: false,
        },
        pre_populated_data: {
          buyer_email: input.customer?.email,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Square payment link failed: ${text}`);
    }

    const data = await response.json();

    const checkoutUrl =
      data?.payment_link?.url ??
      data?.related_resources?.payment_link?.url;

    const paymentLinkId =
      data?.payment_link?.id ??
      data?.related_resources?.payment_link?.id;

    if (!checkoutUrl) {
      throw new Error("Square response missing checkout URL");
    }

    return {
      ok: true,
      provider: "square",
      flow: "redirect",
      amount,
      currency: input.currency,
      checkoutUrl,
      paymentLinkId,
    };
  }
}
