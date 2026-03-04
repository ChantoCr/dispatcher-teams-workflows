# Skill: lock-table

## Propósito
Evitar colisiones simultáneas en `/next` usando lock temporal.

## Política

- Lock TTL: 20 segundos.
- Si lock activo: responder `⏳ Bot ocupado, intenta de nuevo`.
- Siempre liberar lock en ramas de éxito y fallo.
