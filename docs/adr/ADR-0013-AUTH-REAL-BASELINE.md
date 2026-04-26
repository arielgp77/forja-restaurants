# ADR-0013 — AUTH REAL BASELINE

## Estado
accepted

## Contexto
El sistema actual funciona para demo/piloto, pero usa esquema de acceso no suficiente
para operación real multiusuario.

## Decisión
Implementar auth real por email/password con sesiones server-side y roles por tenant.

## Consecuencias
### Positivas
- acceso real y controlado
- base para producción
- base para auditoría
- base para staff real

### Negativas
- requiere cambios de schema
- requiere manejo de secrets
- requiere guards en rutas y APIs
- aumenta complejidad operativa