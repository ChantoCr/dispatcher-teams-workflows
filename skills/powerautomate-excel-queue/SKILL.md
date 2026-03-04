# Skill: powerautomate-excel-queue

## Propósito
Guiar el uso de Excel Online (Business) como storage de cola.

## Reglas

- `QueueTable` y `LockTable` son obligatorias.
- Actualizaciones deben incluir `lastUpdatedUtc`.
- Después de reinserción, normalizar `queueOrder` 1..N.
