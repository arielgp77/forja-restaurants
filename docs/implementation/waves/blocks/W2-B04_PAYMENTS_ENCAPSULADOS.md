# W2-B04 — PAYMENTS ENCAPSULADOS

## Objetivo
Meter pagos reales sin contaminar el resto de la app.

## Archivo base
- `docs/implementation/routes/route_payments_checkout_module.md`

## Alcance
- payment intent / checkout session
- webhook
- reconciliation order/payment
- payment status UI

## Archivos objetivo sugeridos
- `apps/web/components/payments/PaymentMount.tsx`
- `apps/web/lib/payments/client.ts`
- `apps/web/lib/payments/server.ts`
- `apps/web/app/api/payments/create-intent/route.ts`
- `apps/web/app/api/payments/confirm/route.ts`
- `apps/web/app/api/payments/webhook/route.ts`
- `apps/web/lib/payments/reconciliation.ts`

## Reglas
- no provider global
- no lógica de pagos en home/menu/admin
- no secrets en cliente

## Dependencias
- checkout
- backend payments
- secrets/envs
- webhook verification

## Smoke mínimo
- create intent
- pago exitoso
- pago rechazado
- webhook atrasado
- refresh checkout

## Done real
- payments vive solo en checkout
- estados paid/failed/pending existen
- reconciliación mínima existe
