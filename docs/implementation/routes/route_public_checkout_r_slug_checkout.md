# ROUTE CHECKLIST — `/r/[slug]/checkout`

## Objetivo
Cerrar la compra.

## Layout
- [ ] checkout header
- [ ] columna de formulario
- [ ] resumen sticky
- [ ] bloque de pago
- [ ] CTA confirmar pedido

## Data
- [ ] leer carrito
- [ ] recalcular quote
- [ ] resolver fulfillment
- [ ] crear order draft
- [ ] integrar payment intent / equivalente

## Formulario
- [ ] pickup / curbside / delivery
- [ ] nombre
- [ ] teléfono
- [ ] email opcional
- [ ] instrucciones
- [ ] horario / ASAP

## Payments
- [ ] módulo de pagos solo aquí
- [ ] no cargar provider global
- [ ] client secret temporal
- [ ] error de pago manejado
- [ ] prevent duplicate submit

## Componentes
- [ ] CheckoutForm
- [ ] FulfillmentSelector
- [ ] SchedulePicker
- [ ] OrderSummaryCard
- [ ] PaymentMount
- [ ] SubmitOrderButton

## Estados
- [ ] carrito vacío
- [ ] quote inválido
- [ ] horario no disponible
- [ ] pago procesando
- [ ] pago rechazado
- [ ] order create failed

## UX / Visual
- [ ] resumen visible siempre
- [ ] validación inline
- [ ] scroll al error
- [ ] mensajes de seguridad
- [ ] botón deshabilitado si falta algo

## Dependencias
- [ ] cart store
- [ ] quote API
- [ ] payments API
- [ ] order placement API

## QA
- [ ] pickup
- [ ] curbside
- [ ] delivery
- [ ] error de pago
- [ ] doble click en submit
- [ ] refresh accidental

## Done
- [ ] checkout funcional
- [ ] pagos encapsulados
- [ ] confirmación redirige bien