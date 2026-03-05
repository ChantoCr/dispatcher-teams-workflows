# 06 - Setup Workflows Flow C (`/admin ...`)

## Objetivo
Permitir mantenimiento operativo desde chat de Teams, solo para líderes (`ConfigTable.leadersCsv`) y con allow-list de chat.

## Trigger
- Microsoft Teams -> `When a new message is added in a chat`
- Procesar solo si `startsWith(toLower(trim(vText)), '/admin')`.

## Variables iniciales
- `vText`, `vSender`, `vNow`
- `vChatId` (id del chat/conversación)

## 1) Cargar ConfigTable primero
- `vLeadersCsv`
- `vAllowedChatIdsCsv`
- `vEnforceChatAllowList`
- `vLockTtlSeconds`
- `vAllowedTagsCsv`

## 2) Enforce chat allow-list
```text
and(
  equals(toLower(vEnforceChatAllowList), 'true'),
  not(contains(concat(',', toLower(vAllowedChatIdsCsv), ','), concat(',', toLower(vChatId), ',')))
)
```

Si TRUE:
- Terminate silencioso, o
- Log `ADMIN` con `details=wrong-chat` y Terminate.

## 3) Validación de líder
```text
contains(concat(',', toLower(vLeadersCsv), ','), concat(',', toLower(vSender), ','))
```

Si false:
- Responder `⛔ No autorizado.`
- Log `ADMIN` details=`unauthorized`
- Terminate.

## 4) Parseo base
Comandos exactos:
- `/admin add "Nombre"`
- `/admin remove "Nombre"`
- `/admin boost "Nombre" normal|double`
- `/admin reset`
- `/admin leaders set "csv"`
- `/admin config show`

## 5) Acciones
### add
- Validar que `displayName` no exista.
- `queueOrder = max(queueOrder)+1`
- `status=available`, `boostMode=normal`, `lastUpdatedUtc=utcNow()`.
- Reply OK + log ADMIN.

### remove
- Buscar nombre y eliminar fila.
- Renumerar `queueOrder` 1..N.
- Reply OK + log ADMIN.

### boost
- Actualizar `boostMode` a `normal|double`.
- Reply OK + log ADMIN.

### reset
- Reordenar por `queueOrder` y escribir 1..N.
- Mantener `status` y `boostMode`.
- Reply OK + log ADMIN.

### leaders set
- Update `ConfigTable.leadersCsv` con CSV indicado.
- Reply OK + log ADMIN.

### config show
- Responder:
  - `leadersCsv`
  - `lockTtlSeconds`
  - `allowedChatIdsCsv`
  - `enforceChatAllowList`
  - `allowedTagsCsv`
- Log `ADMIN` details=`config-show`.

## Respuestas sugeridas
- OK: `✅ Admin aplicado: <acción>`
- ERROR: `❌ Admin error: <detalle>`

## Auditoría obligatoria
Cada rama escribe en `AuditTable`:
- `eventType=ADMIN`
- `actor=vSender`
- `target` según comando
- `details` con acción y resultado

## Ejemplos de respuesta
- Éxito: `✅ Admin aplicado: boost "Randall" double`
- Error: `❌ Admin error: usuario no existe en QueueTable`
