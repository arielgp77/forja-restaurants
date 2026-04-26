# MODULE CHECKLIST — PAYMENTS / CHECKOUT ONLY

## Objetivo
Aislar payments al flujo de checkout.

## Alcance
- [ ] payment intent / checkout session
- [ ] webhook
- [ ] reconciliation order/payment
- [ ] status UI en checkout y confirmation

## No hacer
- [ ] no provider global en app
- [ ] no lógica de pagos en menú/home
- [ ] no exponer secrets en cliente

## Rutas / piezas
- [ ] checkout mount
- [ ] payments create intent route
- [ ] payments confirm/update route
- [ ] payments webhook route
- [ ] order/payment state mapping

## Estados
- [ ] pending
- [ ] authorized
- [ ] paid
- [ ] failed
- [ ] refunded opcional después

## QA
- [ ] pago exitoso
- [ ] pago rechazado
- [ ] retry
- [ ] webhook atrasado
- [ ] refresh en checkout

## Done
- [ ] payments encapsulado
- [ ] no contamina todo el proyecto