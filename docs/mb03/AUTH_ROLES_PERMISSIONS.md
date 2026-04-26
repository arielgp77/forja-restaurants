# MB03 — AUTH, ROLES Y TEAM MANAGEMENT

## Objetivo
Sembrar una base neutral de sesion y permisos para el panel admin.

## Estrategia
- V1: auth de desarrollo con cookie firmada de forma simple
- V2: conectar proveedor real (Auth.js o Clerk)
- RBAC separado del proveedor

## Roles
- platform_admin
- restaurant_owner
- restaurant_manager
- kitchen_staff
- support_staff
- driver
- customer

## Permisos
- settings:read
- settings:manage
- team:read
- team:manage
- menu:read
- menu:manage
- orders:read
- orders:manage
- delivery:read
- delivery:manage

## Matriz resumida
- platform_admin: todos
- restaurant_owner: settings/team/menu/orders full
- restaurant_manager: settings read, team read, menu/orders manage
- kitchen_staff: orders read/manage
- support_staff: orders read, team read
- driver: delivery read
- customer: ninguno en admin

## Rutas sembradas
- /sign-in
- /settings/team
- /api/internal/dev-sign-in
- /api/internal/dev-sign-out
- /api/internal/team

## Nota
Esto no es auth de produccion. Es un scaffold de desarrollo para abrir MB03 sin bloquear el resto del producto.