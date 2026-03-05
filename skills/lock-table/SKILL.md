# Skill: lock-table

## Propósito
Evitar colisiones simultáneas en `/next` usando lock temporal.

## Política

- Lock TTL: 20 segundos (o `ConfigTable.lockTtlSeconds`).
- Retry: 2 reintentos con delay de 2 segundos.
- Si lock activo tras retries: responder `⏳ Bot ocupado, intenta de nuevo`.
- Siempre liberar lock en Scope `Finally_ReleaseLock` con Run After: success, failed, skipped, timed out.
