# 03 - Setup Workflows Flow A (`/next`, `/help`)

## Objetivo
Atender `/next`, `/next help` y `/help`, con lock robusto, tags estrictos, config dinámica y auditoría en todas las salidas.

## Trigger
- Microsoft Teams -> `When a new channel message is added`
- Team: `<TU TEAM>`
- Channel: usa el canal de operación (ej. `dispatch`)

## Variables iniciales
1. `vText` (String) = texto del mensaje
2. `vSender` (String) = display name remitente
3. `vNow` (String) = `utcNow()`
4. `vLockAcquired` (Boolean) = `false`
5. `vFailReason` (String) = `''`

## Cargar ConfigTable (sin hardcode)
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

## Detectar comando
`vTextLower = toLower(trim(variables('vText')))`

- Si inicia con `/help` o es `/next help`: responder `vHelpText`, log `ASSIGN_FAIL` con details=`help-request`, terminar.
- Si no inicia con `/next`: Terminate.

## Validar líder
Expresión:
```text
contains(concat(',', toLower(variables('vLeadersCsv')), ','), concat(',', toLower(variables('vSender')), ','))
```

Si false:
- Responder `⛔ No tienes permiso para asignar tareas.`
- Log `ASSIGN_FAIL` details=`unauthorized`
- Terminate.

## Parse de `/next`
- `vFirstQuote = indexOf(variables('vText'), '"')`
- `vLastQuote = lastIndexOf(variables('vText'), '"')`

Condición error:
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

## Validación estricta de tags
- Si `length(vTags)=0`: OK.
- Si contiene `all`: forzar `vTags=["all"]`.
- Si no contiene `all`: para cada tag no vacío validar contra `vAllowedTagsCsv`.

Validación por tag:
```text
contains(concat(',', variables('vAllowedTagsCsv'), ','), concat(',', item(), ','))
```

Si alguno inválido:
- Responder `❌ Tags inválidos. Usa: df dl inv act all`
- Log `ASSIGN_FAIL` details=`invalid-tags`
- Terminate.

## Lock robusto con retry (2x, 2s)
Intento 1:
1. Leer `LockTable`.
2. `vLockUntil = coalesce(lockUntilUtc, '1970-01-01T00:00:00Z')`
3. Libre si:
```text
greaterOrEquals(ticks(variables('vNow')), ticks(variables('vLockUntil')))
```
4. Si libre -> Update lock (`lockOwner=vSender`, `lockUntilUtc=addSeconds(vNow,vLockTtlSeconds)`, `lockRowVersion+1`) y `vLockAcquired=true`.

Si ocupado:
- `Delay` 2s y repetir intento (hasta 2 reintentos).
- Si sigue ocupado al final:
  - Responder `⏳ Bot ocupado, intenta de nuevo`
  - Log `ASSIGN_FAIL` details=`lock-busy-after-retry`
  - Terminate.

## Selección y asignación
1. List rows `QueueTable`
2. Filtrar `status=available`
3. Si vacío:
   - Responder `⚠️ No hay agentes disponibles en este momento.`
   - Log `ASSIGN_FAIL` details=`no-available`
   - Ir a bloque Finally.
4. Elegir menor `queueOrder`
5. Update row seleccionado:
   - `status=busy`
   - `lastUpdatedUtc=vNow`
6. Responder:
```text
✅ Asignado a: {vSelectedName} | 📌 {vTaskName}
```
7. Log `ASSIGN_OK` (`actor=vSender`, `target=vSelectedName`, `taskName=vTaskName`, `tags=join(vTags,',')`, `details=assigned`).

## Finally pattern (release lock SIEMPRE)
Agrega un Scope `Finally_ReleaseLock` configurado para ejecutarse **siempre** (success, fail, timeout, skipped del scope principal):
- Si `vLockAcquired=true`, actualizar `LockTable`:
  - `lockOwner=''`
  - `lockUntilUtc='1970-01-01T00:00:00Z'`
  - `lockRowVersion+1`

## Respuestas estándar
- Éxito: `✅ Asignado a: ...`
- No autorizado: `⛔ ...`
- Parse error: `Formato inválido...`
- Tags inválidos: `❌ Tags inválidos...`
- Lock ocupado: `⏳ Bot ocupado...`
- Sin disponibles: `⚠️ No hay agentes disponibles...`
