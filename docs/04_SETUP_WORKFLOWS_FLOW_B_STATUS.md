# 04 - Setup Workflows Flow B (status + `/queue` + `/who` + `/help`)

## Objetivo
Procesar comandos de estado y consultas operativas, manteniendo `queueOrder` consistente y auditando cada acción.

## Trigger
- Microsoft Teams -> `When a new channel message is added`
- Team: `<TU TEAM>`
- Channel: `dispatch` (o el configurado en `ConfigTable.allowedChannel`)

## Variables
- `vText`, `vSender`, `vNow`
- `vCmd = toLower(trim(variables('vText')))`

## Cargar ConfigTable
- List rows `ConfigTable` -> `cConfigRow = first(...)`
- `vHelpText = outputs('cConfigRow')?['helpText']`

## Comandos soportados
- Cambios de estado: `/available`, `/busy`, `/break`, `/lunch`, `/offline`
- Consulta personal: `/status`
- Consulta global: `/queue`, `/who`
- Ayuda: `/help`

Si no coincide con ninguno: `Terminate`.

## Ramas de consulta
### `/help`
- Responder `vHelpText`
- Log AuditTable `STATUS_QUERY` details=`help`

### `/queue`
- List rows `QueueTable`
- Ordenar por `queueOrder` (mínimo iterativo)
- Responder por línea: `Nombre | status | order=X | boost=Y`
- Log `STATUS_QUERY` details=`queue`

### `/who`
- Filtrar `status=available`
- Ordenar por `queueOrder`
- Responder por línea: `Nombre | order=X | boost=Y`
- Log `STATUS_QUERY` details=`who`

### `/status`
- Buscar fila por `displayName==vSender`
- Responder: `Tu estado: {status} | queueOrder={queueOrder} | boost={boostMode}`
- Log `STATUS_QUERY` details=`status-self`

## Ramas de actualización de estado
1. Buscar fila sender en `QueueTable`; si no existe:
   - Responder `⚠️ No estás en cola. Contacta a un líder.`
   - Log `STATUS_CHANGE` details=`sender-not-found`
   - Terminate.

2. Mapear `vNewStatus` desde comando.
3. Guardar `vPreviousStatus`.
4. Update row sender: `status=vNewStatus`, `lastUpdatedUtc=vNow`.

## Regla busy -> available
Condición:
```text
and(equals(toLower(variables('vPreviousStatus')), 'busy'), equals(variables('vNewStatus'), 'available'))
```

Si TRUE:
1. Remover sender de lista ordenada.
2. Definir índice inserción:
   - `boostMode=normal` -> final
   - `boostMode=double` -> `div(length(lista), 2)`
3. Insertar sender.
4. Renumerar `queueOrder=1..N` para todos.
5. Respuesta:
```text
✅ Estado actualizado: busy -> available | queueOrder={nuevo}
🔁 Reinsertado: final|centro
```

Si FALSE:
```text
✅ Estado actualizado: {prev} -> {new} | queueOrder={actual}
```

Siempre log:
- `STATUS_CHANGE`
- `actor=vSender`
- `target=vSender`
- `details=prev:{prev};new:{new};queueOrder:{orderFinal}`
