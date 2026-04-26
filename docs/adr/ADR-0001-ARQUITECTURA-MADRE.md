# ADR-0001 — Arquitectura madre

## Estado
Accepted

## Decisión
El sistema se construirá como un solo core técnico con tres capas de producto:
1. core reusable
2. premium local
3. SaaS global futuro

## Razón
Permite:
- validar localmente con alto contacto
- reutilizar motor en versión global
- evitar rehacer lógica central

## Consecuencias
- todo módulo debe clasificarse en una de las tres capas
- ningún feature premium local puede contaminar el core sin pasar por playbook/regla
