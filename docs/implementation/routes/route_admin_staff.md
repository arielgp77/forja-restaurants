# ROUTE CHECKLIST — `/admin/staff`

## Objetivo
Gestión de usuarios y roles.

## Layout
- [ ] toolbar
- [ ] users table
- [ ] invite modal
- [ ] role editor

## Data
- [ ] usuarios
- [ ] roles por tenant
- [ ] estado activo/inactivo
- [ ] último acceso opcional

## Componentes
- [ ] UserTable
- [ ] InviteModal
- [ ] RoleSelect
- [ ] ActiveToggle

## Acciones
- [ ] invitar usuario
- [ ] cambiar rol
- [ ] desactivar
- [ ] reactivar

## Estados
- [ ] no staff
- [ ] invite pending
- [ ] forbidden action

## Dependencias
- [ ] auth users
- [ ] role matrix
- [ ] tenant scope

## QA
- [ ] invite
- [ ] role change
- [ ] deactivate
- [ ] permisos correctos

## Done
- [ ] owner maneja staff real desde aquí