# MB01 — ACTORES_Y_ROLES

## Actores humanos
- customer
- restaurant_owner
- restaurant_manager
- kitchen_staff
- support_staff
- driver
- platform_admin

## Actores externos
- Stripe
- Twilio
- email provider
- maps provider
- AI provider

## Regla
Ningún actor admin opera fuera de tenant context salvo platform_admin con permiso explícito.
