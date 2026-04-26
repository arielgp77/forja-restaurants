# MB02 — RELACIONES_CLAVE

## Relaciones madre
- Tenant 1-N Restaurant
- Tenant 1-N Customer
- Tenant 1-N Driver
- Tenant 1-N Conversation
- Tenant 1-N Rule

## Relaciones restaurante
- Restaurant 1-1 RestaurantProfile
- Restaurant 1-1 BrandTheme
- Restaurant 1-N StorySection
- Restaurant 1-N BusinessHour
- Restaurant 1-N ServiceArea
- Restaurant 1-N Menu
- Restaurant 1-N Order
- Restaurant 1-N Promo
- Restaurant 1-N PlaybookInstall

## Relaciones menú
- Menu 1-N MenuCategory
- MenuCategory 1-N MenuItem
- MenuItem 1-N ModifierGroup
- ModifierGroup 1-N ModifierOption

## Relaciones orden
- Customer 1-N Order
- Order 1-N OrderItem
- OrderItem 1-N OrderItemModifier
- Order 1-1 Fulfillment
- Order 1-N OrderStatusEvent
- Order 1-1 Payment
- Order 1-N LedgerEntry
