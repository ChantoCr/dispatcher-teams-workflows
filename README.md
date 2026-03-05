# Dispatcher Teams Workflows

Implementación completa de un **dispatcher de tareas en Microsoft Teams** usando **Power Automate Workflows + Excel Online (Business)**, lista para reconstruir desde cero sin servidor.

## Qué hace

Este repo implementa tres flujos:

1. **Flow A (`/next`, `/help`)**
   - Solo líderes pueden pedir la siguiente asignación.
   - Toma configuración dinámica desde `ConfigTable` (líderes, TTL lock, allow-list de chats, tags permitidos, help).
   - Valida tags estrictamente (`df`, `dl`, `inv`, `act`, `all`).
   - Usa lock con retry (2 intentos con delay de 2s).
   - Siempre registra auditoría (`AuditTable`) en éxito y error.

2. **Flow B (status + consultas)**
   - Comandos: `/available`, `/busy`, `/break`, `/lunch`, `/offline`, `/status`, `/queue`, `/who`, `/help`.
   - Mantiene cola y reinserta `busy -> available` (normal al final, double al centro).
   - Normaliza `queueOrder` 1..N.
   - Siempre registra auditoría (`STATUS_CHANGE`, `STATUS_QUERY`).

3. **Flow C (`/admin ...`)**
   - Solo líderes (desde `ConfigTable.leadersCsv`).
   - Administración operativa sin tocar el flujo:
     - `/admin add "Nombre"`
     - `/admin remove "Nombre"`
     - `/admin boost "Nombre" normal|double`
     - `/admin reset`
     - `/admin leaders set "csv"`
     - `/admin config show`
   - Toda acción queda en `AuditTable` (`eventType=ADMIN`).

## Arquitectura

`Teams Chat (Dispatcher Testing) -> Power Automate Workflows -> Excel Online (dispatcher.xlsx) -> Teams Chat`

## Requisitos

- Microsoft Teams con **Workflows habilitado**.
- Conector **Excel Online (Business)** activo en Power Automate.
- Archivo Excel compartido con permisos de lectura/escritura para la cuenta de ejecución.
- Tablas configuradas: `QueueTable`, `LockTable`, `ConfigTable`, `AuditTable`.

## Setup en orden

1. [docs/01_SETUP_TEAMS.md](docs/01_SETUP_TEAMS.md)
2. [docs/02_SETUP_EXCEL.md](docs/02_SETUP_EXCEL.md)
3. [docs/03_SETUP_WORKFLOWS_FLOW_A_NEXT.md](docs/03_SETUP_WORKFLOWS_FLOW_A_NEXT.md)
4. [docs/04_SETUP_WORKFLOWS_FLOW_B_STATUS.md](docs/04_SETUP_WORKFLOWS_FLOW_B_STATUS.md)
5. [docs/06_SETUP_WORKFLOWS_FLOW_C_ADMIN.md](docs/06_SETUP_WORKFLOWS_FLOW_C_ADMIN.md)
6. [docs/09_GET_CHAT_ID.md](docs/09_GET_CHAT_ID.md)
7. [docs/05_TEST_PLAN.md](docs/05_TEST_PLAN.md)
8. [docs/07_SECURITY_AND_GOVERNANCE.md](docs/07_SECURITY_AND_GOVERNANCE.md)
9. [docs/08_OPERATIONS_RUNBOOK.md](docs/08_OPERATIONS_RUNBOOK.md)

## Chat allow-list

Config en `ConfigTable`:
- `allowedChatIdsCsv`: ids de chat permitidos, separados por coma.
- `enforceChatAllowList`: `true` o `false`.

Regla:
- Si `enforceChatAllowList=true`, el flujo procesa solo chats permitidos.
- Si el chat no está permitido, termina silencioso (o solo deja log `wrong-chat`).

## Comandos disponibles

- `/next [tags opcionales] "nombre de la tarea"` (solo líderes)
- `/help`
- `/next help`
- `/available`, `/busy`, `/break`, `/lunch`, `/offline`, `/status`
- `/queue`
- `/who`
- `/admin ...` (solo líderes)

Ejemplos completos: [assets/examples/commands.md](assets/examples/commands.md)

## Observabilidad

- `AuditTable` registra: `ASSIGN_OK`, `ASSIGN_FAIL`, `STATUS_CHANGE`, `STATUS_QUERY`, `ADMIN`.
- Cada respuesta de error debe dejar evidencia con `details` para soporte.

## Limitaciones conocidas

- Excel no es transaccional; el lock reduce colisiones, no reemplaza una BD ACID.
- Los nombres en Teams deben coincidir con `displayName` de `QueueTable`.
- Adaptive Cards son opcionales; texto plano cubre todo.

## Checklist rápido de pruebas

- `/help` responde en `Dispatcher Testing`.
- `/next` solo funciona para líderes.
- `busy -> /available` respeta `boostMode` (normal final, double centro).
- `queueOrder` siempre termina en 1..N.
- `enforceChatAllowList=true` bloquea chats no permitidos.
