# ROUTE CHECKLIST — `/r/[slug]/menu`

## Objetivo
Exploración y selección de productos.

## Layout
- [ ] header sticky
- [ ] buscador
- [ ] tabs de categorías
- [ ] grid/lista de productos
- [ ] carrito flotante en móvil

## Data
- [ ] cargar menú activo
- [ ] cargar categorías
- [ ] cargar items
- [ ] cargar modifier groups mínimos
- [ ] soportar disponibilidad por item

## Componentes
- [ ] SearchInput
- [ ] CategoryTabs
- [ ] ProductCard
- [ ] ProductBadge
- [ ] FloatingCartBar
- [ ] ProductDetailSheet

## Interacciones
- [ ] abrir detalle de producto
- [ ] agregar al carrito
- [ ] búsqueda por nombre
- [ ] navegación por categoría
- [ ] cantidad rápida opcional

## Estados
- [ ] loading skeleton
- [ ] sin resultados
- [ ] categoría vacía
- [ ] item no disponible
- [ ] error al agregar

## UX / Visual
- [ ] precios claros
- [ ] fotos consistentes
- [ ] CTA agregar visible
- [ ] tabs cómodas en móvil
- [ ] no saturar la vista

## Dependencias
- [ ] cart store
- [ ] menu query
- [ ] item detail state
- [ ] modifier resolver

## QA
- [ ] búsqueda
- [ ] add to cart
- [ ] categoría larga
- [ ] item sin imagen
- [ ] item agotado

## Done
- [ ] el flujo de explorar y agregar se siente rápido
- [ ] sin bloqueos visuales en móvil