# Troubleshooting

## Error al actualizar fila de Excel (`Update a row`)
- Verifica que uses el `id` correcto devuelto por `List rows`.
- Confirma que la tabla no cambió de nombre (`QueueTable`, `LockTable`, etc.).
- Si el archivo está abierto con edición pesada, cierra sesiones y reintenta.

## Lock se queda pegado
- Revisa que exista Scope `Finally_ReleaseLock` con Run After en success/fail/timeout/skipped.
- Corrige manualmente `LockTable.lockUntilUtc` a `1970-01-01T00:00:00Z`.
- Revisa `lockTtlSeconds` en `ConfigTable` (ej. 20).

## `displayName` no coincide
- Teams puede mostrar variantes de nombre.
- Copia exactamente el display name del mensaje Teams y actualiza `QueueTable.displayName`.

## `/next` falla por tags
- Revisa `ConfigTable.allowedTagsCsv`.
- Debe estar en minúsculas y separado por coma: `df,dl,inv,act,all`.

## `/admin` devuelve no autorizado
- Revisa `ConfigTable.leadersCsv`.
- Evita espacios extra, o usa trim en comparación.

## `/queue` o `/who` desordenado
- Ejecuta `/admin reset` para normalizar `queueOrder`.
- Evita ediciones manuales concurrentes en Excel durante operación.
