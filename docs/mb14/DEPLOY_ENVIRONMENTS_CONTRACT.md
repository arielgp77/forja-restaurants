# MB14 — DEPLOY ENVIRONMENTS CONTRACT

## Objetivo
Definir el contrato operativo para desplegar `forja-restaurants`
en entornos reales separados y repetibles.

## Entornos mínimos
- local
- staging
- production

## Objetivos del bloque
- separar configuración por entorno
- definir dominios / URLs base
- definir secretos requeridos
- definir health endpoints
- definir readiness checklist

## Requisitos funcionales
1. `apps/web` y `apps/admin` deben poder correr con variables separadas.
2. Debe existir una URL base por entorno para web y admin.
3. Debe existir configuración explícita para DB, auth y futuras integraciones.
4. Debe existir un checklist mínimo de despliegue.
5. Debe existir un endpoint de health y uno de readiness por app.

## Requisitos técnicos
- Windows PowerShell 5.1 friendly
- no romper entorno local actual
- contract-first antes de tocar despliegues reales
- staging primero, production después
- secrets nunca hardcodeadas

## Apps cubiertas
- apps/web
- apps/admin

## Variables mínimas por entorno
- APP_ENV
- WEB_BASE_URL
- ADMIN_BASE_URL
- DATABASE_URL
- AUTH_SECRET
- SESSION_COOKIE_DOMAIN
- INTERNAL_API_BASE_URL

## Health / readiness mínimos
- `/api/health`
- `/api/ready`

## Definition of Done
- contrato de entornos documentado
- contratos de dominios/secrets documentados
- env examples creados
- ADR de deploy baseline creada
- healthcheck MB14 contract OK