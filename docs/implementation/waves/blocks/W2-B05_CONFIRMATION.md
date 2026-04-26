# W2-B05 — CONFIRMATION

## Objetivo
Construir la postcompra inmediata.

## Archivo base
- `docs/implementation/routes/route_public_confirmation_order_confirmation_id.md`

## Rutas
- `/order/confirmation/[id]`

## Archivos objetivo sugeridos
- `apps/web/app/order/confirmation/[id]/page.tsx`
- `apps/web/components/order/SuccessBanner.tsx`
- `apps/web/components/order/OrderNumberCard.tsx`
- `apps/web/components/order/OrderRecap.tsx`
- `apps/web/components/order/ETACard.tsx`

## Entregables
- número de orden
- ETA
- resumen
- CTA track
- curbside instructions si aplica

## Dependencias
- order detail query
- payment state
- fulfillment summary

## Smoke mínimo
- id válido
- id inválido
- pago pendiente
- curbside instructions

## Done real
- baja ansiedad
- se siente pedido recibido
