# ROUTE CHECKLIST — `/admin/integrations`

## Objetivo
Ver configuración de integraciones.

## Layout
- [ ] integration cards
- [ ] last check info
- [ ] config hints
- [ ] warnings

## Secciones
- [ ] Auth
- [ ] Payments
- [ ] SMS
- [ ] Database
- [ ] Domains / URLs

## Componentes
- [ ] IntegrationCard
- [ ] StatusBadge
- [ ] ConfigHint
- [ ] LastCheckRow

## Estados
- [ ] healthy
- [ ] not configured
- [ ] degraded
- [ ] human action needed

## Dependencias
- [ ] auth config
- [ ] payment config
- [ ] sms config
- [ ] env validation

## QA
- [ ] status refleja realidad
- [ ] hints útiles
- [ ] payments aislado se muestra claro

## Done
- [ ] owner sabe qué está listo y qué no