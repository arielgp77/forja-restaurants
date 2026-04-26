# ADR-0002 — Estrategia multi-tenant

## Estado
Accepted

## Decisión
Usar una sola base con shared schema y tenantId en tablas relevantes.

## Razón
- menor costo inicial
- más velocidad de entrega
- suficiente para MVP
- compatible con evolución SaaS

## Consecuencias
- toda entidad de negocio debe resolver a tenant
- no se permiten tablas huérfanas
- los queries admin deben filtrar por tenant
