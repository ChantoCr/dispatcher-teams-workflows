# 06 - Setup Workflows Flow C (`/admin ...`)

## Objetivo
Permitir mantenimiento operativo de la cola desde Teams, solo para líderes definidos en `ConfigTable.leadersCsv`.

## Trigger
- Microsoft Teams -> `When a new channel message is added`
- Procesar solo si `startsWith(toLower(trim(vText)), '/admin')`.

## Validación de líder
```text
contains(concat(',', toLower(vLeadersCsv), ','), concat(',', toLower(vSender), ','))
```
Si false -> responder `⛔ No autorizado.` + log ADMIN error.

## Parseo base
Usa comandos exactos:
- `/admin add "Nombre"`
- `/admin remove "Nombre"`
- `/admin boost "Nombre" normal|double`
- `/admin reset`
- `/admin leaders set "csv"`
- `/admin config show`

## Acciones
### 1) add
- Validar que no exista `displayName`.
- `queueOrder = max(queueOrder)+1`
- `status=available`, `boostMode=normal`, `lastUpdatedUtc=utcNow()`.
- Reply OK + log ADMIN.

### 2) remove
- Buscar por nombre y eliminar fila.
- Renumerar `queueOrder` 1..N.
- Reply OK + log ADMIN.

### 3) boost
- Actualizar `boostMode` a `normal|double`.
- Reply OK + log ADMIN.

### 4) reset
- Reordenar por `queueOrder` actual y escribir 1..N.
- Mantener `status` y `boostMode`.
- Reply OK + log ADMIN.

### 5) leaders set
- Update `ConfigTable.leadersCsv` con CSV indicado.
- Reply OK + log ADMIN.

### 6) config show
- Responder valores actuales:
  - leadersCsv
  - lockTtlSeconds
  - allowedChannel
  - allowedTagsCsv
- Log ADMIN details=`config-show`.

## Respuestas sugeridas
- OK: `✅ Admin aplicado: <acción>`
- ERROR: `❌ Admin error: <detalle>`

## Auditoría obligatoria
Cada rama escribe en `AuditTable`:
- `eventType=ADMIN`
- `actor=vSender`
- `target` según comando
- `details` con acción y resultado
