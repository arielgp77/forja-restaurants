# ROUTE CHECKLIST — `/ops/curbside`

## Objetivo
Operar pickup / curbside.

## Layout
- [ ] ready column
- [ ] arrived column
- [ ] handed off column
- [ ] arrival detail panel

## Data
- [ ] órdenes ready
- [ ] llegada del cliente
- [ ] color/modelo del carro
- [ ] spot number
- [ ] teléfono

## Componentes
- [ ] PickupTicketCard
- [ ] VehicleBadge
- [ ] SpotBadge
- [ ] HandOffButton

## Estados
- [ ] no arrivals
- [ ] order not ready
- [ ] already delivered
- [ ] inbound sms inconsistente

## Dependencias
- [ ] SMS inbound
- [ ] order status
- [ ] pickup actions
- [ ] role pickup/staff

## QA
- [ ] marcar llegada
- [ ] handoff
- [ ] múltiples carros
- [ ] orden lista sin llegada

## Done
- [ ] flujo curbside claro y rápido