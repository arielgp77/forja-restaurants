# ROUTE CHECKLIST — `/order/track/[id]`

## Objetivo
Seguimiento del pedido.

## Layout
- [ ] tracking header
- [ ] status timeline
- [ ] ETA
- [ ] resumen pedido
- [ ] acción curbside arrival

## Data
- [ ] cargar estado actual
- [ ] cargar ETA
- [ ] cargar fulfillment
- [ ] soportar actualización de estado

## Componentes
- [ ] StatusStepper
- [ ] ETABadge
- [ ] OrderRecap
- [ ] ArrivalButton
- [ ] VehicleInfoForm opcional

## Estados
- [ ] order not found
- [ ] order canceled
- [ ] order completed
- [ ] delayed
- [ ] arrival already sent

## UX
- [ ] timeline clara
- [ ] ETA visible
- [ ] acción “ya llegué” simple
- [ ] móvil muy legible

## Dependencias
- [ ] order tracking query
- [ ] curbside arrival API
- [ ] sms status optional

## QA
- [ ] tracking normal
- [ ] curbside arrival
- [ ] order cancelada
- [ ] order vieja completada

## Done
- [ ] tracking entendible sin preguntar