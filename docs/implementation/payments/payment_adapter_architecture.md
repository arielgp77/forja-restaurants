# W2-B04 — Payment Adapter Architecture

## Objetivo
Encapsular payments detrás de una interfaz única para que checkout no dependa de Stripe/Square/Adyen directamente.

## Providers
- stripe -> embedded payment intent
- square -> hosted checkout link
- adyen -> sessions flow

## Archivos
- apps/web/lib/payments/types.ts
- apps/web/lib/payments/config.ts
- apps/web/lib/payments/registry.server.ts
- apps/web/lib/payments/providers/stripe.server.ts
- apps/web/lib/payments/providers/square.server.ts
- apps/web/lib/payments/providers/adyen.server.ts
- apps/web/app/api/payments/prepare/route.ts

## Contrato mínimo
Input:
- provider
- restaurantSlug
- orderReference
- currency
- returnUrl
- lines
- customer
- metadata

Output:
- provider
- flow
- amount
- currency
- provider-specific data
