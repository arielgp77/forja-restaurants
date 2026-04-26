# MB02 — README_MODELO_DATOS

## Regla madre
Todo cuelga de tenant.

## Estrategia multi-tenant
- Single database
- Shared schema
- `tenantId` en entidades de negocio
- El aislamiento se hace por filtros de aplicación y permisos

## Grupos
- A: tenant y configuración base
- B: horarios y servicio
- C: catálogo/menú
- D: clientes
- E: órdenes
- F: fulfillment
- G: mensajería
- H: pagos
- I: promos/reglas

## Reglas importantes
- Toda orden guarda snapshots de nombre, precio y modifiers
- `Restaurant.publicSlug` es único
- `Order.orderNumber` es único por restaurante
- `PlaybookInstall(restaurantId, playbookKey)` es único
- Se usan `status` e `isActive` en vez de soft delete pesado para MVP

## Puntos a vigilar después
- Relacionar `Fulfillment.deliveryAddressId` con `CustomerAddress`
- Relacionar más directamente tablas con `Tenant` si luego quieres enforcement adicional
- Evaluar provider específico de auth antes de MB03
