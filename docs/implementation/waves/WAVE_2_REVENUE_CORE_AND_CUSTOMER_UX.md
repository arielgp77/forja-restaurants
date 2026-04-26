# WAVE 2 — REVENUE CORE + CUSTOMER UX

## Objetivo
Convertir la cara pública y el flujo de compra en algo funcional, vendible y listo para demo seria.

## Resultado esperado
El cliente puede:
- descubrir el restaurante
- explorar el menú
- agregar al carrito
- pagar en checkout
- ver confirmación
- seguir su pedido

---

## Bloque A — Home pública `/r/[slug]`
**Archivo base:** `route_public_home_r_slug.md`

### Entregables
- [ ] Header público funcional
- [ ] Hero fuerte con branding
- [ ] Quick info strip
- [ ] destacados / más vendidos
- [ ] CTA Ordenar ahora
- [ ] estados loading / not found / closed

### Dependencias
- tenant loader
- branding/theme
- featured menu query

### Done real
- [ ] home se siente bonita
- [ ] CTA lleva al flujo de orden
- [ ] no se ve como placeholder

---

## Bloque B — Menú `/r/[slug]/menu`
**Archivo base:** `route_public_menu_r_slug_menu.md`

### Entregables
- [ ] buscador
- [ ] tabs de categorías
- [ ] product cards
- [ ] product detail sheet
- [ ] add to cart
- [ ] carrito flotante móvil

### Dependencias
- menú real
- categories/items
- cart store
- modifier resolver

### Done real
- [ ] explorar y agregar se siente rápido
- [ ] cards consistentes
- [ ] móvil usable

---

## Bloque C — Checkout `/r/[slug]/checkout`
**Archivo base:** `route_public_checkout_r_slug_checkout.md`

### Entregables
- [ ] formulario pickup/curbside/delivery
- [ ] resumen sticky
- [ ] validación inline
- [ ] create order draft
- [ ] botón confirmar
- [ ] estados de error

### Dependencias
- cart store
- quote API
- order placement API

### Done real
- [ ] checkout no se rompe con refresh normal
- [ ] CTA funciona
- [ ] errores son entendibles

---

## Bloque D — Payments encapsulados
**Archivo base:** `route_payments_checkout_module.md`

### Entregables
- [ ] create payment intent / checkout session
- [ ] webhook
- [ ] reconciliation order/payment
- [ ] UI de payment status
- [ ] no provider global en app

### Dependencias
- checkout
- backend payments
- secrets/envs
- webhook verification

### Done real
- [ ] payment vive solo en checkout
- [ ] no ensucia home/menu/admin
- [ ] estados paid/failed/pending existen

---

## Bloque E — Confirmation
**Archivo base:** `route_public_confirmation_order_confirmation_id.md`

### Entregables
- [ ] número de orden
- [ ] ETA
- [ ] resumen
- [ ] CTA track
- [ ] curbside instructions si aplica

### Dependencias
- order detail query
- payment state
- fulfillment summary

### Done real
- [ ] baja ansiedad
- [ ] se siente “pedido recibido”

---

## Bloque F — Tracking
**Archivo base:** `route_public_tracking_order_track_id.md`

### Entregables
- [ ] timeline de estado
- [ ] ETA visible
- [ ] resumen pedido
- [ ] acción curbside arrival
- [ ] estados canceled/completed

### Dependencias
- order tracking query
- arrival API
- status mapper

### Done real
- [ ] tracking se entiende solo
- [ ] curbside tiene sentido

---

## Bloque G — Auth interno mínimo alineado
**Archivo base:** `route_auth_internal_module.md`

### Entregables
- [ ] login
- [ ] logout
- [ ] guards internas
- [ ] role matrix base
- [ ] tenant scope

### Dependencias
- MB13 auth base
- session cookie
- role enforcement

### Done real
- [ ] admin no queda expuesto
- [ ] roles básicos funcionan

---

## Gate de cierre Wave 2
- [ ] home bonita y usable
- [ ] menu usable
- [ ] checkout funcional
- [ ] payments encapsulados
- [ ] confirmation y tracking sólidos
- [ ] auth interno mínimo funcional

## Riesgos a vigilar
- [ ] payment contaminando todo el app tree
- [ ] checkout roto en móvil
- [ ] tracking débil
- [ ] tenant branding inconsistente