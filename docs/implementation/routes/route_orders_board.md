# ROUTE CHECKLIST — `/orders`

## Objetivo
Centro operativo principal.

## Layout
- [ ] top filters
- [ ] KPI strip corto
- [ ] kanban columns
- [ ] quick detail drawer

## Data
- [ ] cargar órdenes activas
- [ ] agrupar por estado
- [ ] filtros por canal
- [ ] filtros por fulfillment
- [ ] sort por urgencia / tiempo

## Componentes
- [ ] FilterBar
- [ ] OrderBoardColumn
- [ ] OrderCard
- [ ] PaymentBadge
- [ ] TimerChip
- [ ] StatusBadge

## Acciones
- [ ] cambiar estado rápido
- [ ] abrir order detail
- [ ] refresh
- [ ] buscar orden

## Estados
- [ ] no active orders
- [ ] delayed orders
- [ ] stale data
- [ ] forbidden

## Dependencias
- [ ] auth guard
- [ ] orders query
- [ ] order status mutation
- [ ] role permissions

## QA
- [ ] desktop
- [ ] móvil utilizable
- [ ] cambio de estado
- [ ] filtro funciona
- [ ] orden con pago pendiente

## Done
- [ ] board usable en operación real