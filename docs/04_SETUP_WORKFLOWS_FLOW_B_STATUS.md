# 04 - Setup Workflows Flow B (status + `/queue` + `/who` + `/help`)

## Objetivo
Procesar comandos de estado/consulta en chat de Teams, con allow-list de chat, cola consistente y auditoría.

## Trigger
- Microsoft Teams -> `When a new message is added in a chat`
- Chat: `Dispatcher Testing` (o el chat permitido en ConfigTable).

## Variables
- `vText`, `vSender`, `vNow`
- `vChatId` (id del chat/conversación)
- `vCmd = toLower(trim(variables('vText')))`

## 1) Cargar ConfigTable primero
- List rows `ConfigTable` -> `cConfigRow = first(...)`
- `vHelpText = outputs('cConfigRow')?['helpText']`
- `vAllowedChatIdsCsv = toLower(outputs('cConfigRow')?['allowedChatIdsCsv'])`
- `vEnforceChatAllowList = toLower(outputs('cConfigRow')?['enforceChatAllowList'])`

## 2) Enforce chat allow-list
```text
and(
  equals(variables('vEnforceChatAllowList'), 'true'),
  not(contains(concat(',', variables('vAllowedChatIdsCsv'), ','), concat(',', toLower(variables('vChatId')), ',')))
)
```

Si TRUE:
- Terminate silencioso, o
- Log `STATUS_QUERY` details=`wrong-chat` y Terminate.

## 3) Comandos soportados
- Cambios de estado: `/available`, `/busy`, `/break`, `/lunch`, `/offline`
- Consulta personal: `/status`
- Consulta global: `/queue`, `/who`
- Ayuda: `/help`

Si no coincide: `Terminate`.

## 4) Ramas de consulta
### `/help`
- Responder `vHelpText`
- Log `STATUS_QUERY` details=`help`

### `/queue`
- List rows `QueueTable`
- Ordenar por `queueOrder`
- Responder: `Nombre | status | order=X | boost=Y`
- Log `STATUS_QUERY` details=`queue`

### `/who`
- Filtrar `status=available`
- Ordenar por `queueOrder`
- Responder: `Nombre | order=X | boost=Y`
- Log `STATUS_QUERY` details=`who`

### `/status`
- Buscar `displayName==vSender`
- Responder: `Tu estado: {status} | queueOrder={queueOrder} | boost={boostMode}`
- Log `STATUS_QUERY` details=`status-self`

## 5) Ramas de actualización de estado
1. Buscar sender en `QueueTable`; si no existe:
   - Responder `⚠️ No estás en cola. Contacta a un líder.`
   - Log `STATUS_CHANGE` details=`sender-not-found`
   - Terminate.
2. Mapear `vNewStatus` desde comando.
3. Guardar `vPreviousStatus`.
4. Update row sender: `status=vNewStatus`, `lastUpdatedUtc=vNow`.

## 6) Regla busy -> available (mantener boostMode)
Condición:
```text
and(equals(toLower(variables('vPreviousStatus')), 'busy'), equals(variables('vNewStatus'), 'available'))
```

Si TRUE:
1. Remover sender de la lista ordenada.
2. Definir inserción:
   - `boostMode=normal` -> final
   - `boostMode=double` -> centro (`div(length(lista), 2)`).
3. Insertar sender.
4. Renumerar `queueOrder=1..N` para todos.
5. Responder:
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

## Ejemplos de respuesta
- Éxito estado: `✅ Estado actualizado: available -> busy | queueOrder=2`
- Error usuario fuera de cola: `⚠️ No estás en cola. Contacta a un líder.`
