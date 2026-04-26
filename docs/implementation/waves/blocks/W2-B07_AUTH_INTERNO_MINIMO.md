# W2-B07 — AUTH INTERNO MÍNIMO

## Objetivo
Alinear login/logout/guards para zona interna.

## Archivo base
- `docs/implementation/routes/route_auth_internal_module.md`

## Alcance
- login
- logout
- session cookie
- role matrix base
- tenant scope
- route guards

## Archivos objetivo sugeridos
- `apps/admin/app/login/page.tsx`
- `apps/admin/app/api/auth/login/route.ts`
- `apps/admin/app/api/auth/logout/route.ts`
- `apps/admin/lib/auth/config.ts`
- `apps/admin/lib/auth/session.ts`
- `apps/admin/lib/auth/guards.ts`

## Dependencias
- MB13 auth base
- session cookie
- role enforcement

## Smoke mínimo
- login correcto
- login incorrecto
- logout
- ruta protegida

## Done real
- admin no queda expuesto
- roles básicos funcionan
