# Skill: teams-chat-trigger

## Propósito
Configurar triggers de Workflows para chats de Teams (1:1 o grupales), sin usar canales.

## Reglas

- Trigger obligatorio: `When a new message is added in a chat`.
- Cargar `ConfigTable` al inicio del flujo.
- Leer `vChatId` desde el payload del trigger.
- Enforce allow-list si `enforceChatAllowList=true`.
- Si chat no permitido: terminar silencioso o auditar `wrong-chat` sin responder en otros chats.

## Expresión base

```text
contains(concat(',', variables('vAllowedChatIdsCsv'), ','), concat(',', variables('vChatId'), ','))
```
