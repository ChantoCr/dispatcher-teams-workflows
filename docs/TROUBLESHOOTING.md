# Troubleshooting

## El flow no se dispara

- Verifica Team y Channel en trigger.
- Confirma que el mensaje llega al canal `dispatch` y no a chat privado.

## Error del conector Excel

- Revisa permisos sobre `dispatcher.xlsx`.
- Confirma que las tablas son Excel Tables reales.

## No encuentra filas en QueueTable

- Verifica nombre exacto de tabla: `QueueTable`.
- Verifica `displayName` coincide exactamente con Teams display name.

## Lock se queda pegado

- Revisa paso de release lock al final y en ramas de error.
- Corrige manualmente `lockUntilUtc` a `1970-01-01T00:00:00Z` si se atora.

## queueOrder inconsistente

- Ejecuta la rutina de normalización 1..N después de reinserción.
- Evita ediciones manuales concurrentes en Excel durante pruebas.
