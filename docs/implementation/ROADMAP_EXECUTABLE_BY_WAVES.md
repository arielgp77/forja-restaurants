# FORJA RESTAURANTS — ROADMAP EJECUTABLE POR OLAS

## Objetivo
Convertir el master checklist por ruta en una secuencia real de ejecución por olas,
para construir la versión final del producto sin perder foco.

## Convención
- [ ] pendiente
- [~] en progreso
- [x] terminado
- [!] bloqueado

## Olas
1. **Wave 2 — Revenue Core + Customer UX**
2. **Wave 3 — Operations + Owner Control**
3. **Polish Final — Hardening + Launch Finish**

---

## Wave 2 — Revenue Core + Customer UX
**Meta:** dejar la experiencia pública y de compra funcional, coherente y vendible.

### Prioridades
- [ ] cerrar checkout real
- [ ] aislar payments solo en checkout
- [ ] dejar confirmation y tracking sólidos
- [ ] pulir home y menu
- [ ] amarrar auth interno mínimo donde toque

### Rutas / módulos
- [ ] `route_public_home_r_slug.md`
- [ ] `route_public_menu_r_slug_menu.md`
- [ ] `route_public_checkout_r_slug_checkout.md`
- [ ] `route_public_confirmation_order_confirmation_id.md`
- [ ] `route_public_tracking_order_track_id.md`
- [ ] `route_payments_checkout_module.md`
- [ ] `route_auth_internal_module.md`

### Gate de salida Wave 2
- [ ] cliente puede navegar home → menú → checkout → confirmation → tracking
- [ ] pagos encapsulados y funcionales
- [ ] errores base manejados
- [ ] móvil usable
- [ ] no depende de hacks temporales

---

## Wave 3 — Operations + Owner Control
**Meta:** volverlo operable y administrable para el restaurante.

### Prioridades
- [ ] orders board usable
- [ ] kitchen usable
- [ ] curbside usable
- [ ] dashboard owner con KPIs mínimos
- [ ] menu manager / branding / staff
- [ ] integrations / system / activity
- [ ] SMS integrado donde sí aporta

### Rutas / módulos
- [ ] `route_admin_login.md`
- [ ] `route_orders_board.md`
- [ ] `route_orders_detail_id.md`
- [ ] `route_ops_board.md`
- [ ] `route_ops_kitchen.md`
- [ ] `route_ops_curbside.md`
- [ ] `route_admin_dashboard.md`
- [ ] `route_admin_menu.md`
- [ ] `route_admin_branding.md`
- [ ] `route_admin_staff.md`
- [ ] `route_admin_integrations.md`
- [ ] `route_admin_system.md`
- [ ] `route_admin_activity.md`
- [ ] `route_sms_operational_module.md`

### Gate de salida Wave 3
- [ ] restaurante puede operar órdenes reales
- [ ] owner puede ver/controlar branding, menú, staff e integraciones
- [ ] SMS operativo útil
- [ ] auth/roles coherentes
- [ ] system status entendible

---

## Polish Final — Hardening + Launch Finish
**Meta:** pasar de funcional a “vendible serio”.

### Prioridades
- [ ] design system consistente
- [ ] estados vacíos / loading / error bonitos
- [ ] mobile polish
- [ ] performance básica
- [ ] QA visual y funcional cruzado
- [ ] release checklist

### Rutas / módulos
- [ ] `route_design_system_shared.md`
- [ ] revisar todas las rutas públicas
- [ ] revisar todas las rutas internas
- [ ] revisar owner/config
- [ ] revisar integrations/system

### Gate de salida Polish Final
- [ ] consistencia visual aceptable
- [ ] flows críticos sin huecos
- [ ] responsive aceptable
- [ ] estados de error útiles
- [ ] listo para demo seria / piloto

---

## Orden de ejecución recomendado
1. Wave 2
2. Wave 3
3. Polish Final

## Regla de foco
Si una tarea no mejora:
- conversión
- operación
- control del owner
- confiabilidad

entonces no es prioridad de esta fase.