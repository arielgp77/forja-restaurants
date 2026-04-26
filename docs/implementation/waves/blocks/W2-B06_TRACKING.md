# W2-B06 — TRACKING

## Objetivo
Construir seguimiento del pedido.

## Archivo base
- `docs/implementation/routes/route_public_tracking_order_track_id.md`

## Rutas
- `/order/track/[id]`

## Archivos objetivo sugeridos
- `apps/web/app/order/track/[id]/page.tsx`
- `apps/web/components/tracking/StatusStepper.tsx`
- `apps/web/components/tracking/ETABadge.tsx`
- `apps/web/components/tracking/ArrivalButton.tsx`
- `apps/web/components/tracking/VehicleInfoForm.tsx`

## Entregables
- timeline de estado
- ETA
- resumen
- curbside arrival action
- estados canceled/completed

## Dependencias
- order tracking query
- arrival API
- status mapper

## Smoke mínimo
- tracking normal
- curbside arrival
- cancelada
- completada

## Done real
- tracking se entiende solo
- curbside tiene sentido
