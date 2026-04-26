# FORJA RESTAURANTS — MASTER CHECKLIST BY ROUTE

## Objetivo
Checklist maestro por ruta para construir la versión final del sistema.

## Convención
- [ ] pendiente
- [~] en progreso
- [x] terminado
- [!] bloqueado / depende de otra cosa

## Público
- [ ] `route_public_home_r_slug.md`
- [ ] `route_public_menu_r_slug_menu.md`
- [ ] `route_public_checkout_r_slug_checkout.md`
- [ ] `route_public_confirmation_order_confirmation_id.md`
- [ ] `route_public_tracking_order_track_id.md`

## Interno / Operación
- [ ] `route_admin_login.md`
- [ ] `route_orders_board.md`
- [ ] `route_orders_detail_id.md`
- [ ] `route_ops_board.md`
- [ ] `route_ops_kitchen.md`
- [ ] `route_ops_curbside.md`

## Owner / Config
- [ ] `route_admin_dashboard.md`
- [ ] `route_admin_menu.md`
- [ ] `route_admin_branding.md`
- [ ] `route_admin_staff.md`
- [ ] `route_admin_integrations.md`
- [ ] `route_admin_system.md`
- [ ] `route_admin_activity.md`

## Módulos transversales
- [ ] `route_payments_checkout_module.md`
- [ ] `route_auth_internal_module.md`
- [ ] `route_sms_operational_module.md`
- [ ] `route_design_system_shared.md`

## Regla de trabajo
1. contrato / blueprint
2. layout
3. data loader
4. componentes
5. estados vacíos / loading / error
6. acciones / mutations
7. smoke / QA visual
8. polish

## Orden sugerido
1. Público
2. Checkout / payments aislado
3. Orders / kitchen / curbside
4. Owner / dashboard / branding / staff
5. Integrations / system / activity