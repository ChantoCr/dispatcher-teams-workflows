# 05 - Test Plan (PR#3 chat)

## Pre-check
- `dispatcher.xlsx` con `QueueTable`, `LockTable`, `ConfigTable`, `AuditTable`.
- Flows A/B/C activos.
- Probar dentro del chat **Dispatcher Testing**.
- `ConfigTable.enforceChatAllowList=true` y chat id presente en `allowedChatIdsCsv`.

## Casos (20)
1. `/next "Caso 001"` por líder -> asigna y marca busy.
2. `/next df "Caso 002"` -> asigna con tag válido.
3. `/next act inv "Caso 003"` -> múltiples tags válidos.
4. `/next all "Caso 004"` -> normaliza tags a `all`.
5. `/next foo "Caso 005"` -> error tags inválidos.
6. `/next Caso 006` (sin comillas) -> parse error.
7. `/next` por no líder -> unauthorized.
8. Lock ocupado intento 1 y libera en retry 1 -> éxito.
9. Lock ocupado intento 1 y 2, libre en 3 -> éxito.
10. Lock ocupado permanente -> `⏳ Bot ocupado...`.
11. Sin disponibles -> `⚠️ No hay agentes disponibles...`.
12. `/help` -> retorna `helpText`.
13. `/next help` -> retorna `helpText`.
14. `/status` -> devuelve estado + queueOrder + boost.
15. `/queue` -> lista completa ordenada.
16. `/who` -> solo disponibles ordenados.
17. `busy -> /available` con `normal` -> reinserta final.
18. `busy -> /available` con `double` -> reinserta centro.
19. `/admin add "Nuevo"` y `/admin remove "Nuevo"`.
20. `/admin leaders set "A,B"` y `/admin config show`.

## Casos chat allow-list (nuevos)
- Chat permitido + `enforceChatAllowList=true`: comandos funcionan.
- Chat NO permitido + `enforceChatAllowList=true`: termina silencioso (o solo log `wrong-chat`).
- `enforceChatAllowList=false`: permite pruebas en cualquier chat.

## Verificación de auditoría
Para cada caso reconocido, validar fila en `AuditTable`:
- `eventType` correcto
- `actor` correcto
- `details` con motivo/resultados (`assigned`, `wrong-chat`, `queue`, etc.)
- `timestampUtc` ISO UTC

## Resultado esperado
- Casos funcionales pasan en chat permitido.
- No hay respuestas en chats no permitidos cuando enforcement está activo.
- No quedan locks pegados (`lockUntilUtc` vuelve a epoch).
