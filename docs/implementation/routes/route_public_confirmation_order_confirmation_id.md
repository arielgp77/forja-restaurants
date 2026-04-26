# ROUTE CHECKLIST — `/order/confirmation/[id]`

## Objetivo
Dar certeza inmediata al cliente.

## Layout
- [ ] success header
- [ ] número de orden
- [ ] ETA
- [ ] resumen del pedido
- [ ] CTA tracking
- [ ] CTA contacto

## Data
- [ ] cargar orden por id
- [ ] mostrar payment status
- [ ] mostrar fulfillment
- [ ] mostrar instrucciones pickup/curbside

## Componentes
- [ ] SuccessBanner
- [ ] OrderNumberCard
- [ ] ETACard
- [ ] OrderRecap
- [ ] TrackOrderButton

## Estados
- [ ] order not found
- [ ] payment pending
- [ ] canceled
- [ ] completed already

## UX
- [ ] mensaje claro
- [ ] número visible
- [ ] resumen compacto
- [ ] CTA útil

## Dependencias
- [ ] order detail query
- [ ] payment status
- [ ] fulfillment formatter

## QA
- [ ] id válido
- [ ] id inválido
- [ ] pago pendiente
- [ ] curbside instructions

## Done
- [ ] reduce ansiedad
- [ ] redirige bien al tracking