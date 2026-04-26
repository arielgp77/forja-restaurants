# MB10 — TRANSITION GUARDS + AUDIT HARDENING

## Objetivo
Endurecer el flujo operativo:
- bloquear transiciones invalidas
- evitar eventos duplicados si el status no cambia
- no permitir curbside arrival sobre orden no READY
- migrar middleware -> proxy

## Reglas V1
- PLACED -> CONFIRMED | CANCELLED
- CONFIRMED -> PREPARING | CANCELLED
- PREPARING -> READY | CANCELLED
- READY -> COMPLETED
- COMPLETED -> sin salida
- CANCELLED -> sin salida