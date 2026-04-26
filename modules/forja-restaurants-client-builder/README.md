# forja-restaurants-client-builder

Convierte un manifest de restaurante en demo reutilizable.

## Uso

powershell -ExecutionPolicy Bypass -File "C:\Users\ariel\LaForja\forja-restaurants\modules\forja-restaurants-client-builder\scripts\Run-ClientBuilder.ps1" -Slug positanos

## Salidas

- apps/web/app/r/<slug>/page.tsx
- apps/web/app/r/<slug>/menu/page.tsx
- apps/web/app/r/<slug>/checkout/page.tsx
- data/reports/client-builder/<slug>/sales_pitch.md
- data/reports/client-builder/<slug>/closeout.json
