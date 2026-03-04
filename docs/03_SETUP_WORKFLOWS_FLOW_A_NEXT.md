# 03 - Setup Workflows Flow A (`/next`)

## Objetivo
Procesar comandos `/next` enviados en Teams por líderes, asignar siguiente agente disponible y bloquear concurrencia con `LockTable`.

## Trigger

- **Connector:** Microsoft Teams
- **Trigger:** `When a new channel message is added`
- **Team:** `<TU TEAM>`
- **Channel:** `dispatch`

## Variables iniciales (acciones exactas)

1. **Initialize variable** `vText` (String)
   - Value: contenido/body del mensaje.
2. **Initialize variable** `vSender` (String)
   - Value: From / User display name.
3. **Initialize variable** `vNow` (String)
   - Value (Expression):

```text
utcNow()
```

4. **Initialize variable** `vLeaders` (Array)
   - Value:

```json
["Randall","Eduardo","Jorge","Gabriel"]
```

5. **Initialize variable** `vIsNext` (Boolean)
   - Value (Expression):

```text
startsWith(toLower(trim(variables('vText'))), '/next')
```

## Condition: ¿es /next?

- Condition: `vIsNext` equals `true`.
- Si **false**: `Terminate`.

## Condition: Leader check

Expression:

```text
contains(variables('vLeaders'), variables('vSender'))
```

- Si false: responder en canal:

```text
⛔ No tienes permiso para asignar tareas.
```

Luego `Terminate`.

---

## Parse `/next` (copy/paste)

### Validar comillas

1. Initialize variable `vFirstQuote` (Integer)

```text
indexOf(variables('vText'), '"')
```

2. Initialize variable `vLastQuote` (Integer)

```text
lastIndexOf(variables('vText'), '"')
```

3. Condition:

```text
or(equals(variables('vFirstQuote'), -1), equals(variables('vLastQuote'), variables('vFirstQuote')))
```

Si TRUE: responder

```text
Formato inválido. Usa: /next df "nombre de la tarea"
```

Luego `Terminate`.

### Extraer prefix (tags raw)

Initialize variable `vPrefix` (String):

```text
trim(substring(variables('vText'), 5, sub(variables('vFirstQuote'), 5)))
```

### Extraer taskName

Initialize variable `vTaskName` (String):

```text
substring(variables('vText'), add(variables('vFirstQuote'), 1), sub(variables('vLastQuote'), add(variables('vFirstQuote'), 1)))
```

### Normalizar tags list

Initialize variable `vTagsRaw` (String):

```text
toLower(trim(variables('vPrefix')))
```

Initialize variable `vTags` (Array):

```text
if(
  equals(variables('vTagsRaw'), ''),
  createArray(),
  split(variables('vTagsRaw'), ' ')
)
```

> Nota: si aparecen tokens vacíos por espacios múltiples, puedes ignorarlos manualmente en lógica posterior.

Condition:

```text
contains(variables('vTags'), 'all')
```

Si true, **Set variable** `vTags` a:

```json
["all"]
```

---

## Lock acquire con `LockTable`

1. Excel Online (Business) → **List rows present in a table**
   - File: `dispatcher.xlsx`
   - Table: `LockTable`

2. Compose `cLockRow`:

```text
first(body('List_rows_present_in_a_table')?['value'])
```

3. Initialize variable `vLockUntil` (String):

```text
coalesce(outputs('cLockRow')?['lockUntilUtc'], '1970-01-01T00:00:00Z')
```

4. Condition lock free?:

```text
greaterOrEquals(ticks(variables('vNow')), ticks(variables('vLockUntil')))
```

- Si FALSE: responder

```text
⏳ Bot ocupado, intenta de nuevo
```

`Terminate`.

- Si TRUE: **Update lock row**
  - `lockOwner = vSender`
  - `lockUntilUtc = addSeconds(vNow, 20)`
  - `lockRowVersion = add(int(lockRowVersion), 1)`

---

## Leer `QueueTable` y elegir siguiente

1. Excel → List rows (`QueueTable`)
2. Filter array (eligible):
   - From: `value`
   - Condition:

```text
equals(toLower(item()?['status']), 'available')
```

3. Si `length(eligible) == 0`:
   - Reply: no hay agentes disponibles
   - Release lock (poner `lockUntilUtc=1970-01-01T00:00:00Z`)
   - Terminate

4. Inicializar:
   - `vMinOrder = 9999` (Integer)
   - `vSelectedName = ""` (String)
   - `vSelectedRowId = ""` (String)

5. Apply to each (eligible):
   - Condition:

```text
less(int(item()?['queueOrder']), variables('vMinOrder'))
```

Si true:
- `Set vMinOrder = int(item()?['queueOrder'])`
- `Set vSelectedName = item()?['displayName']`
- `Set vSelectedRowId = item()?['id']` (o key alternativa)

6. Update selected row en Excel:
   - `status = busy`
   - `lastUpdatedUtc = vNow`

7. Post message:

```text
✅ Asignado a: {vSelectedName} | 📌 {vTaskName}
```

8. Release lock:
   - Update lock row: `lockUntilUtc = 1970-01-01T00:00:00Z`

## Mensajes sugeridos de error

- Parse inválido: `Formato inválido. Usa: /next df "nombre de la tarea"`
- No autorizado: `⛔ No tienes permiso para asignar tareas.`
- Sin disponibles: `⚠️ No hay agentes disponibles en este momento.`
- Lock ocupado: `⏳ Bot ocupado, intenta de nuevo`
