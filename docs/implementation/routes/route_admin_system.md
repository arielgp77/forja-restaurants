# ROUTE CHECKLIST — `/admin/system`

## Objetivo
Salud técnica y despliegue.

## Layout
- [ ] environment panel
- [ ] URLs panel
- [ ] health rows
- [ ] readiness rows
- [ ] evidence / warnings

## Data
- [ ] env actual
- [ ] web base url
- [ ] admin base url
- [ ] health web/admin
- [ ] readiness web/admin
- [ ] latest evidence

## Componentes
- [ ] EnvCard
- [ ] URLRow
- [ ] HealthRow
- [ ] WarningBanner
- [ ] EvidenceLinkList

## Estados
- [ ] staging misconfigured
- [ ] readiness fail
- [ ] missing env
- [ ] evidence stale

## Dependencias
- [ ] deploy env readers
- [ ] health routes
- [ ] readiness routes
- [ ] evidence module

## QA
- [ ] health visible
- [ ] readiness visible
- [ ] warning claro

## Done
- [ ] owner/admin técnico puede detectar problemas rápido