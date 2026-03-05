# dispatcher-audit

Patrón de auditoría para workflows del dispatcher.

## Tabla
`AuditTable(timestampUtc, eventType, actor, target, taskName, tags, details)`

## Regla operativa
Toda rama de éxito y error debe escribir una fila de auditoría.

## Event types
- ASSIGN_OK
- ASSIGN_FAIL
- STATUS_CHANGE
- STATUS_QUERY
- ADMIN

## Buenas prácticas
- `timestampUtc = utcNow()` ISO.
- `details` corto pero accionable (ej. `invalid-tags`, `lock-busy-after-retry`).
- No terminar flujo sin auditar cuando el comando fue reconocido.
