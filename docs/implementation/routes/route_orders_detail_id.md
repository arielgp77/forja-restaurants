# ROUTE CHECKLIST — `/orders/[id]`

## Objetivo
Ver y actuar sobre una orden completa.

## Layout
- [ ] header orden
- [ ] items section
- [ ] notes section
- [ ] timeline section
- [ ] customer panel
- [ ] action rail

## Data
- [ ] cargar detalle completo
- [ ] cargar payment state
- [ ] cargar fulfillment info
- [ ] cargar notes / modifiers

## Componentes
- [ ] OrderMetaCard
- [ ] OrderItemRow
- [ ] Timeline
- [ ] CustomerCard
- [ ] PaymentPanel
- [ ] ActionButtons

## Acciones
- [ ] confirmar
- [ ] preparar
- [ ] lista
- [ ] entregada
- [ ] cancelar

## Estados
- [ ] not found
- [ ] forbidden
- [ ] stale state
- [ ] payment mismatch

## Dependencias
- [ ] order detail query
- [ ] status mutation
- [ ] permissions
- [ ] payment sync view

## QA
- [ ] orden normal
- [ ] orden cancelada
- [ ] cambio de estado
- [ ] nota larga
- [ ] modifiers visibles

## Done
- [ ] todo lo crítico cabe en una sola vista