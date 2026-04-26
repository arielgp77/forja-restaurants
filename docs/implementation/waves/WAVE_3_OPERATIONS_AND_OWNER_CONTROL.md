# WAVE 3 — OPERATIONS + OWNER CONTROL

## Objetivo
Volver el sistema operable por el restaurante y útil para el owner.

## Resultado esperado
El negocio puede:
- recibir y mover órdenes
- preparar y entregar
- operar curbside
- administrar menú y branding
- manejar staff y roles
- revisar integraciones y system status

---

## Bloque A — Login interno
**Archivo base:** `route_admin_login.md`

### Entregables
- [ ] login limpio
- [ ] error states
- [ ] redirect correcto
- [ ] logout visible

### Done real
- [ ] entrada sobria
- [ ] auth clara

---

## Bloque B — Orders board
**Archivo base:** `route_orders_board.md`

### Entregables
- [ ] kanban principal
- [ ] filtros
- [ ] order cards
- [ ] timers
- [ ] quick status updates

### Dependencias
- orders query
- status mutation
- permissions

### Done real
- [ ] usable en operación diaria
- [ ] un manager lo entiende rápido

---

## Bloque C — Order detail
**Archivo base:** `route_orders_detail_id.md`

### Entregables
- [ ] vista completa de orden
- [ ] timeline
- [ ] payment panel
- [ ] actions rail

### Done real
- [ ] resolver orden desde una sola vista

---

## Bloque D — Ops board / kitchen / curbside
**Archivos base:**
- `route_ops_board.md`
- `route_ops_kitchen.md`
- `route_ops_curbside.md`

### Entregables
- [ ] ops board simplificado
- [ ] kitchen board legible a distancia
- [ ] curbside board útil
- [ ] pickup/arrival/handoff claro

### Dependencias
- order feed
- status mutation
- SMS inbound/outbound

### Done real
- [ ] operación más rápida
- [ ] curbside con sentido
- [ ] kitchen sin ruido

---

## Bloque E — Dashboard owner
**Archivo base:** `route_admin_dashboard.md`

### Entregables
- [ ] KPIs básicos
- [ ] ventas / órdenes
- [ ] alertas
- [ ] health summary
- [ ] integration summary

### Done real
- [ ] owner entiende el estado del negocio en 1 minuto

---

## Bloque F — Menu manager
**Archivo base:** `route_admin_menu.md`

### Entregables
- [ ] categories
- [ ] item CRUD
- [ ] modifiers
- [ ] disponibilidad
- [ ] media

### Done real
- [ ] un manager puede editar menú sin ayuda

---

## Bloque G — Branding
**Archivo base:** `route_admin_branding.md`

### Entregables
- [ ] logo
- [ ] colores
- [ ] portada
- [ ] textos
- [ ] preview

### Done real
- [ ] el restaurante lo siente suyo

---

## Bloque H — Staff
**Archivo base:** `route_admin_staff.md`

### Entregables
- [ ] tabla de usuarios
- [ ] invite
- [ ] role change
- [ ] deactivate/reactivate

### Done real
- [ ] owner controla acceso real

---

## Bloque I — Integrations / System / Activity
**Archivos base:**
- `route_admin_integrations.md`
- `route_admin_system.md`
- `route_admin_activity.md`

### Entregables
- [ ] integrations cards
- [ ] system env/health/readiness
- [ ] activity trail

### Dependencias
- env readers
- evidence module
- integration config state

### Done real
- [ ] dueño sabe qué está listo
- [ ] admin técnico detecta problemas rápido
- [ ] actividad mínima trazable

---

## Bloque J — SMS operativo
**Archivo base:** `route_sms_operational_module.md`

### Entregables
- [ ] outbound ready
- [ ] outbound confirmation
- [ ] inbound arrival
- [ ] curbside integration

### Done real
- [ ] SMS aporta a operación, no solo marketing

---

## Gate de cierre Wave 3
- [ ] orders board usable
- [ ] kitchen usable
- [ ] curbside usable
- [ ] owner dashboard útil
- [ ] branding/menu/staff funcionales
- [ ] integrations/system/activity base funcional
- [ ] SMS útil

## Riesgos a vigilar
- [ ] demasiada complejidad en admin
- [ ] kitchen con UI pequeña
- [ ] curbside sin señal clara
- [ ] dashboard lleno de vanity metrics