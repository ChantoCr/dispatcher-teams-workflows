# Comandos de ejemplo

## Válidos

- `/next "Revisar folio 1001"`
- `/next df urgent "Validar transferencia internacional"`
- `/available`
- `/busy`
- `/break`
- `/lunch`
- `/offline`
- `/status`

## No válidos

- `/next Revisar folio 1001` (faltan comillas)
- `/next` (faltan datos)
- `/nxt "algo"` (comando incorrecto)

## Respuestas esperadas (resumen)

- Asignación OK: `✅ Asignado a: Nombre | 📌 Tarea`
- No autorizado: `⛔ No tienes permiso para asignar tareas.`
- Parse error: `Formato inválido. Usa: /next df "nombre de la tarea"`
