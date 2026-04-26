# MB13 — AUTH REAL CONTRACT

## Objetivo
Sustituir el esquema actual dev-cookie por autenticación real y controlada
para `apps/admin` y protecciones de sesión en flujos internos.

## Alcance V1
- login real para admin
- sesiones seguras
- roles base por tenant
- guards para rutas internas
- logout
- bootstrap para primer owner del tenant

## Fuera de alcance en esta fase
- social login
- MFA
- SSO empresarial
- magic links
- recovery flow completo de producción

## Actores
- Owner
- Manager
- Staff
- Kitchen
- Pickup / Frontdesk
- Support interno

## Requisitos funcionales
1. Solo usuarios autenticados pueden entrar a `/orders`, `/ops/*`, `/admin/*`.
2. Debe existir un usuario owner inicial por tenant.
3. El usuario debe pertenecer al tenant correcto.
4. Deben existir roles mínimos:
   - owner
   - manager
   - staff
   - kitchen
   - pickup
5. Debe existir logout explícito.
6. Debe existir sesión persistente segura en server.
7. Debe ser posible proteger server actions / routes internas.

## Requisitos técnicos
- Windows PowerShell 5.1 friendly
- compatible con Next app router actual
- no romper `/r/demo-pizzeria`
- no romper quote / order / ops flows actuales
- envs separadas por web/admin
- contract-first antes de implementación real

## Rutas a proteger
- apps/admin/app/orders/**
- apps/admin/app/ops/**
- api/internal/**
- cualquier vista de administración posterior

## Modelo mínimo esperado
- User
- AuthSession
- UserTenantRole

## Campos mínimos User
- id
- email
- password_hash
- display_name
- is_active
- created_at
- updated_at

## Campos mínimos AuthSession
- id
- user_id
- tenant_id
- session_token_hash
- expires_at
- revoked_at
- created_at

## Campos mínimos UserTenantRole
- id
- user_id
- tenant_id
- role
- created_at

## Decisiones base
- auth por email + password
- hashing fuerte
- cookie httpOnly secure
- tenant scope obligatorio
- server-side auth checks

## Definition of Done
- contrato auth documentado
- roles documentados
- env examples creados
- healthcheck MB13 contract OK