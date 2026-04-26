# ADR-0014 — DEPLOY BASELINE

## Estado
accepted

## Contexto
El sistema ya corre localmente, pero necesita una base clara para
staging y production sin improvisación.

## Decisión
Definir despliegue por entornos separados con variables explícitas,
health/readiness endpoints y dominio por app.

## Consecuencias
### Positivas
- despliegue repetible
- menor riesgo de mezclar staging y production
- base para observabilidad y operación real

### Negativas
- más configuración
- más secretos
- más disciplina operativa