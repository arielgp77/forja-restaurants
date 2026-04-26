# MB15 — PAYMENTS REAL CONTRACT

## Objetivo
Definir la base para cobros reales en `forja-restaurants`.

## Alcance V1
- payment intent / checkout base
- webhook de confirmación
- reconciliación order/payment
- refunds básicos posteriores

## Requisitos
- no crear orden pagada fantasma
- estado de pago explícito
- webhook firmado
- logs mínimos de pago
- separación staging / production

## Definition of Done
- contrato payments documentado
- ADR payments creada
- env example payments creado