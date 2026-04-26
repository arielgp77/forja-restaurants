# W2-B03 — CHECKOUT

## Objetivo
Construir `/r/[slug]/checkout` con formulario, quote y draft de orden.

## Archivo base
- `docs/implementation/routes/route_public_checkout_r_slug_checkout.md`

## Rutas
- `/r/[slug]/checkout`

## Archivos objetivo sugeridos
- `apps/web/app/r/[slug]/checkout/page.tsx`
- `apps/web/components/checkout/CheckoutForm.tsx`
- `apps/web/components/checkout/FulfillmentSelector.tsx`
- `apps/web/components/checkout/SchedulePicker.tsx`
- `apps/web/components/checkout/OrderSummaryCard.tsx`
- `apps/web/lib/checkout/validators.ts`
- `apps/web/lib/checkout/submit.ts`

## Entregables
- formulario pickup/curbside/delivery
- resumen sticky
- validación inline
- create order draft
- CTA confirmar
- estados de error

## Dependencias
- cart store
- quote API
- order placement API

## Smoke mínimo
- pickup
- curbside
- delivery
- refresh accidental
- doble click submit

## Done real
- checkout usable
- errores entendibles
- draft/order placement amarrado
