# Dispatcher Teams Workflows

Implementación completa de un **dispatcher de tareas en Microsoft Teams** usando **Power Automate Workflows + Excel Online (Business)**, lista para reconstruir desde cero con instrucciones copy/paste.

## Qué hace

Este repo implementa dos flujos principales:

1. **Flow A (`/next`)**
   - Solo líderes pueden pedir la siguiente asignación.
   - Selecciona el siguiente agente por menor `queueOrder` entre los `available`.
   - Marca al agente asignado como `busy`.
   - Publica respuesta en Teams con el asignado y la tarea.
   - Usa bloqueo con `LockTable` (TTL 20s) para evitar colisiones.

2. **Flow B (cambios de estado)**
   - Cualquier agente puede usar: `/available`, `/busy`, `/break`, `/lunch`, `/offline`, `/status`.
   - Actualiza estado en `QueueTable`.
   - Si transición es `busy -> available`, reinsertar en cola:
     - `boostMode=normal` => final.
     - `boostMode=double` => centro.
   - Normaliza `queueOrder` de 1..N.

## Arquitectura

`Teams (canal dispatch) -> Power Automate Workflows -> Excel Online (dispatcher.xlsx) -> Teams (respuesta)`

- Teams recibe comandos de texto.
- Workflows ejecuta lógica y validaciones.
- Excel guarda estado de cola y lock.
- Teams recibe confirmaciones/errores.

## Requisitos

- Microsoft Teams con **Workflows habilitado**.
- Conector **Excel Online (Business)** activo en Power Automate.
- Archivo Excel compartido con permisos de lectura/escritura para la cuenta que ejecuta los flows.
- Tabla `QueueTable` y `LockTable` configuradas exactamente como se describe en docs.

## Setup en orden

1. [docs/01_SETUP_TEAMS.md](docs/01_SETUP_TEAMS.md)
2. [docs/02_SETUP_EXCEL.md](docs/02_SETUP_EXCEL.md)
3. [docs/03_SETUP_WORKFLOWS_FLOW_A_NEXT.md](docs/03_SETUP_WORKFLOWS_FLOW_A_NEXT.md)
4. [docs/04_SETUP_WORKFLOWS_FLOW_B_STATUS.md](docs/04_SETUP_WORKFLOWS_FLOW_B_STATUS.md)
5. [docs/05_TEST_PLAN.md](docs/05_TEST_PLAN.md)

## Comandos disponibles

- `/next [tags opcionales] "nombre de la tarea"` (solo líderes)
- `/available`
- `/busy`
- `/break`
- `/lunch`
- `/offline`
- `/status`

Ejemplos completos: [assets/examples/commands.md](assets/examples/commands.md)

## Limitaciones conocidas

- Excel no es una base de datos transaccional; el lock reduce colisiones pero no reemplaza un motor ACID.
- El parseo de tags en `/next` es simple (split por espacio).
- No hay sorting nativo en List Rows de Excel: se selecciona mínimo `queueOrder` manualmente.
- Adaptive Cards incluidas son opcionales; el sistema funciona 100% con texto plano.

## Checklist rápido de pruebas

- [ ] Líder ejecuta `/next df "Revisar ticket #123"` y asigna correctamente.
- [ ] Usuario no líder intenta `/next` y recibe rechazo.
- [ ] `/next` mal formado (sin comillas) devuelve error de formato.
- [ ] `LockTable` bloquea concurrencia y devuelve `⏳ Bot ocupado, intenta de nuevo`.
- [ ] `/busy`, `/break`, `/lunch`, `/offline` actualizan estado.
- [ ] `busy -> available` reinserta según `boostMode` y normaliza `queueOrder`.
- [ ] `/status` responde estado actual del usuario.
- [ ] Sin disponibles: líder recibe mensaje de no disponibilidad.

## Estructura del repo

```text
dispatcher-teams-workflows/
  AGENTS.md
  README.md
  .gitignore
  .env.example
  docs/
  skills/
  assets/
  tools/
```
