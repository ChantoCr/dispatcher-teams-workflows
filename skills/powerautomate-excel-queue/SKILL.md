# Skill: powerautomate-excel-queue

## Propósito
Guiar el uso de Excel Online (Business) como storage de cola.

## Reglas

- `QueueTable`, `LockTable`, `ConfigTable` y `AuditTable` son obligatorias.
- Cargar `ConfigTable` primero en cada flujo.
- Actualizaciones deben incluir `lastUpdatedUtc`.
- Después de reinserción, normalizar `queueOrder` 1..N.
- Mantener `allowedChatIdsCsv` y `enforceChatAllowList` en `ConfigTable`.
