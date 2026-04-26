# MB14 — DEPLOY SECRETS AND DOMAINS

## Dominios sugeridos
### staging
- web: staging-web.example.com
- admin: staging-admin.example.com

### production
- web: app.example.com
- admin: admin.example.com

## Secrets mínimos
- DATABASE_URL
- AUTH_SECRET
- INTERNAL_SERVICE_TOKEN
- SESSION_COOKIE_DOMAIN

## Principios
- secrets por entorno
- rotation posible
- no compartir production con staging
- valores ejemplo solo para bootstrap

## Notas
- staging puede usar DB separada o branch separada
- production requiere backups y restore plan
- el dominio de cookie debe estar alineado a subdominios usados