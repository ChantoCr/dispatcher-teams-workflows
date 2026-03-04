# Skill: teams-command-trigger

## Propósito
Estandarizar cómo se detectan y validan comandos de Teams.

## Reglas

- Escuchar solo canal `dispatch`.
- Normalizar comando con `toLower(trim(text))`.
- Ignorar mensajes fuera del set esperado.
- Aplicar autorización para `/next` por lista de líderes.
