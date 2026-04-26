import Stripe from "stripe";
import { getStripeConfig } from "../config";
import {
  computeMinorTotal,
  type PaymentPrepareInput,
  type PaymentProviderAdapter,
  type StripePreparedPayment,
} from "../types";

export class StripePaymentAdapter implements PaymentProviderAdapter {
  key = "stripe" as const;

  async prepare(input: PaymentPrepareInput): Promise<StripePreparedPayment> {
    const cfg = getStripeConfig();

    const stripe = new Stripe(cfg.secretKey, {
      apiVersion: "2025-03-31.basil",
    });

    const amount = computeMinorTotal(input.lines);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: input.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: input.customer?.email,
      metadata: {
        restaurantSlug: input.restaurantSlug,
        orderReference: input.orderReference,
        ...input.metadata,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe PaymentIntent missing client_secret");
    }

    return {
      ok: true,
      provider: "stripe",
      flow: "embedded",
      amount,
      currency: input.currency,
      publishableKey: cfg.publishableKey,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }
}
