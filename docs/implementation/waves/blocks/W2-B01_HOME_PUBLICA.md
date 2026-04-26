# W2-B01 — HOME PÚBLICA

## Objetivo
Construir la landing pública `/r/[slug]` con branding, CTA y destacados.

## Archivo base
- `docs/implementation/routes/route_public_home_r_slug.md`

## Rutas
- `/r/[slug]`

## Archivos objetivo sugeridos
- `apps/web/app/r/[slug]/page.tsx`
- `apps/web/components/public/PublicHeader.tsx`
- `apps/web/components/public/HeroBanner.tsx`
- `apps/web/components/public/QuickInfoStrip.tsx`
- `apps/web/components/public/ProductHighlightCard.tsx`
- `apps/web/components/public/PublicFooter.tsx`

## Entregables
- header público
- hero
- quick info
- destacados
- CTA ordenar ahora
- estados loading / not found / closed

## Dependencias
- tenant loader
- branding/theme
- featured menu query
- cart badge state

## Smoke mínimo
- abrir slug válido
- abrir slug inválido
- restaurante cerrado
- restaurante sin portada

## Done real
- home bonita
- CTA funcional
- branding consistente
- sin huecos graves de estado
