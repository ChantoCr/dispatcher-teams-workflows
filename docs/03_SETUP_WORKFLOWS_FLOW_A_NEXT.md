# 03 - Setup Workflows Flow A (`/next`, `/help`)

## Objetivo
Atender `/next`, `/next help` y `/help` en chat de Teams, con lock robusto, tags estrictos, allow-list de chat y auditoría.

## Trigger
- Microsoft Teams -> `When a new message is added in a chat`
- Chat: selecciona el chat de pruebas (ej. `Dispatcher Testing`).

## Variables iniciales
1. `vText` (String) = texto del mensaje
2. `vSender` (String) = display name remitente
3. `vNow` (String) = `utcNow()`
4. `vChatId` (String) = id del chat/conversación del trigger
5. `vLockAcquired` (Boolean) = `false`

## 1) Cargar ConfigTable primero
1. List rows -> `ConfigTable`
2. Compose `cConfigRow`:
```text
first(body('List_rows_ConfigTable')?['value'])
```
3. Variables:
- `vLeadersCsv` = `outputs('cConfigRow')?['leadersCsv']`
- `vAllowedTagsCsv` = `toLower(outputs('cConfigRow')?['allowedTagsCsv'])`
- `vHelpText` = `outputs('cConfigRow')?['helpText']`
- `vLockTtlSeconds` = `int(outputs('cConfigRow')?['lockTtlSeconds'])`
- `vAllowedChatIdsCsv` = `toLower(outputs('cConfigRow')?['allowedChatIdsCsv'])`
- `vEnforceChatAllowList` = `toLower(outputs('cConfigRow')?['enforceChatAllowList'])`

## 2) Enforce chat allow-list
Condición principal:
```text
and(
  equals(variables('vEnforceChatAllowList'), 'true'),
  not(contains(concat(',', variables('vAllowedChatIdsCsv'), ','), concat(',', toLower(variables('vChatId')), ',')))
)
```

Si TRUE (chat no permitido):
- Opción silenciosa: `Terminate` sin responder.
- Opción recomendada para soporte: log `ASSIGN_FAIL` con `details=wrong-chat` y luego `Terminate`.

## 3) Detectar comando
`vTextLower = toLower(trim(variables('vText')))`

- Si inicia con `/help` o es `/next help`:
  - Responder `vHelpText`
  - Log `ASSIGN_FAIL` con `details=help-request`
  - Terminate.
- Si no inicia con `/next`: `Terminate`.

## 4) Validar líder
```text
contains(concat(',', toLower(variables('vLeadersCsv')), ','), concat(',', toLower(variables('vSender')), ','))
```

Si false:
- Responder `⛔ No tienes permiso para asignar tareas.`
- Log `ASSIGN_FAIL` details=`unauthorized`
- Terminate.

## 5) Parse de `/next`
- `vFirstQuote = indexOf(variables('vText'), '"')`
- `vLastQuote = lastIndexOf(variables('vText'), '"')`

Error de parse:
```text
or(equals(variables('vFirstQuote'), -1), equals(variables('vLastQuote'), variables('vFirstQuote')))
```

Si error:
- Responder `Formato inválido. Usa: /next df "nombre de la tarea"`
- Log `ASSIGN_FAIL` details=`parse-error`
- Terminate.

Extraer:
- `vPrefix = trim(substring(variables('vText'), 5, sub(variables('vFirstQuote'), 5)))`
- `vTaskName = substring(variables('vText'), add(variables('vFirstQuote'),1), sub(variables('vLastQuote'), add(variables('vFirstQuote'),1)))`
- `vTagsRaw = toLower(trim(variables('vPrefix')))`
- `vTags = if(equals(variables('vTagsRaw'), ''), createArray(), split(variables('vTagsRaw'), ' '))`

## 6) Validación estricta de tags
- Si `length(vTags)=0`: OK.
- Si contiene `all`: forzar `vTags=["all"]`.
- Si no contiene `all`: validar cada tag no vacío con:

```text
contains(concat(',', variables('vAllowedTagsCsv'), ','), concat(',', item(), ','))
```

Si inválido:
- Responder `❌ Tags inválidos. Usa: df dl inv act all`
- Log `ASSIGN_FAIL` details=`invalid-tags`
- Terminate.

## 7) Lock con retry (2 reintentos, delay 2s)
- Intento inicial + 2 reintentos.
- Si lock activo: `Delay` 2s y reintentar.
- Si no se adquiere:
  - Responder `⏳ Bot ocupado, intenta de nuevo`
  - Log `ASSIGN_FAIL` details=`lock-busy-after-retry`
  - Terminate.

## 8) Selección y asignación
1. List rows `QueueTable`
2. Filtrar `status=available`
3. Si vacío:
   - Responder `⚠️ No hay agentes disponibles en este momento.`
   - Log `ASSIGN_FAIL` details=`no-available`
   - Continuar a Finally.
4. Elegir menor `queueOrder`.
5. Update row:
   - `status=busy`
   - `lastUpdatedUtc=vNow`
6. Responder éxito:
```text
✅ Asignado a: {vSelectedName} | 📌 {vTaskName}
```
7. Log `ASSIGN_OK` (`actor=vSender`, `target=vSelectedName`, `taskName=vTaskName`, `tags=join(vTags,',')`, `details=assigned`).

## 9) Finally_ReleaseLock (siempre)
Crea Scope `Finally_ReleaseLock` con **Run After: succeeded, failed, skipped, timed out** del Scope principal.

Si `vLockAcquired=true`, actualizar `LockTable`:
- `lockOwner=''`
- `lockUntilUtc='1970-01-01T00:00:00Z'`
- `lockRowVersion+1`

## Ejemplos de respuesta
- Éxito: `✅ Asignado a: Randall | 📌 Validar transferencia`
- Error no autorizado: `⛔ No tienes permiso para asignar tareas.`
- Error de tags: `❌ Tags inválidos. Usa: df dl inv act all`
