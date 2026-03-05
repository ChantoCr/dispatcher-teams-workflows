# Skill: teams-command-trigger

## Propósito
Estandarizar cómo se detectan y validan comandos de Teams.

## Reglas

- Soporta dos patrones de trigger:
  - Chat: `When a new message is added in a chat` (recomendado)
  - Canal: `When a new channel message is added` (legacy)
- Para chat, usar allow-list con `allowedChatIdsCsv` + `enforceChatAllowList`.
- Normalizar comando con `toLower(trim(text))`.
- Ignorar mensajes fuera del set esperado.
- Aplicar autorización para `/next` y `/admin` por lista de líderes.
