# MASTER TN MAP — FORJA RESTAURANTS

| MB | Title | Wave | Status | Depends On |
|---|---|---:|---|---|
| MB01 | Contrato del producto + arquitectura madre | 1 | done | - |
| MB02 | Data model + Prisma + Neon + seed | 1 | done | MB01 |
| MB03 | Auth base + roles + team management | 1 | done | MB02 |
| MB04 | Public site por slug + lectura Neon | 1 | done | MB02 |
| MB05 | CMS restaurante story branding menu | 2 | done | MB03, MB04 |
| MB06 | Order engine V1 quote place confirmation | 2 | done | MB04, MB05 |
| MB07 | Orders board admin | 2 | done | MB06 |
| MB08 | Kitchen pickup ops board | 2 | done | MB07 |
| MB09 | SMS inbound mock + curbside arrival flow | 3 | done | MB08 |
| MB10 | Transition guards + audit hardening + proxy cleanup | 3 | done | MB09 |
| MB11 | Pricing service fees tips policy + payout ledger base | 3 | in_review | MB10 |
| MB12 | Polish release gates master map reconciliation | 3 | in_progress | MB11 |

## Resumen
- Done: 10/12
- In review: 1/12
- In progress: 1/12
- Planned: 0/12