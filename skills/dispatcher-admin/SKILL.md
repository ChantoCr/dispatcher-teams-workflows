# dispatcher-admin

Guía rápida para implementar comandos `/admin` en Power Automate + Excel.

## Objetivo
Operar mantenimiento de cola sin editar manualmente Excel.

## Comandos
- `/admin add "Nombre"`
- `/admin remove "Nombre"`
- `/admin boost "Nombre" normal|double`
- `/admin reset`
- `/admin leaders set "csv"`
- `/admin config show`

## Reglas
- Validar líder desde `ConfigTable.leadersCsv`.
- Registrar cada acción en `AuditTable` (`eventType=ADMIN`).
- Responder siempre con OK o ERROR explícito.
