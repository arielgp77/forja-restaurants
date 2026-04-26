# WAVE 2 — EXECUTION ORDER BY BLOCKS

## Objetivo
Volver Wave 2 ejecutable por bloques concretos, en orden claro y con salida verificable.

## Orden oficial
1. W2-B01 — Home pública
2. W2-B02 — Menú
3. W2-B03 — Checkout
4. W2-B04 — Payments encapsulados
5. W2-B05 — Confirmation
6. W2-B06 — Tracking
7. W2-B07 — Auth interno mínimo

## Reglas
- no brincar bloques sin razón documentada
- cada bloque debe tener:
  - archivos objetivo
  - dependencias
  - definición de done
  - smoke manual mínimo
- payments no debe contaminar home/menu/admin
- auth interno mínimo puede correrse en paralelo si bloquea rutas internas, pero el orden oficial de Wave 2 sigue siendo el listado arriba

## Estados válidos
- planned
- in_progress
- blocked
- done

## Gate final de Wave 2
- home usable
- menu usable
- checkout usable
- payments encapsulados
- confirmation sólida
- tracking sólido
- auth interno mínimo funcional
