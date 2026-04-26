# FORJA_RESTAURANTS

Proyecto técnico para sistema operativo ligero de restaurantes:
- sitio público con historia y branding
- menú editable
- pedidos
- checkout
- panel operativo
- pagos
- mensajería
- IA útil
- reglas/playbooks
- empaque SaaS futuro

## Estructura
- docs/: arquitectura, ADRs, MBs
- apps/: web pública y admin
- packages/: módulos compartidos
- infra/: base de datos, env, seeds
- backlog/: master_tn_map y TNs
- scripts/: utilidades locales

## MB oficiales propuestos
- MB01 contrato del producto + arquitectura madre
- MB02 datos y multi-tenant
- MB03 auth, roles y seguridad base
- MB04 experience engine
- MB05 CMS restaurante
- MB06 order engine
- MB07 ops engine
- MB08 pagos y ledger
- MB09 messaging fabric
- MB10 AI/knowledge layer
- MB11 rule engine + playbooks
- MB12 SaaS packaging

## Corte MVP digno
MB01, MB02, MB03, MB04, MB05, MB06, MB07, MB08 + slice usable de MB09 y MB10.
