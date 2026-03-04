# 04 - Setup Workflows Flow B (status)

## Objetivo
Procesar comandos de estado y mantener la cola consistente, incluyendo reinserción al volver de `busy` a `available`.

## Trigger

- Microsoft Teams → `When a new channel message is added`
- Team: `<TU TEAM>`
- Channel: `dispatch`

## Variables iniciales

- `vText` (String): message content
- `vSender` (String): display name del usuario
- `vNow` (String):

```text
utcNow()
```

- `vCmd` (String):

```text
toLower(trim(variables('vText')))
```

## Condition: comando válido

```text
or(
 equals(variables('vCmd'), '/available'),
 equals(variables('vCmd'), '/busy'),
 equals(variables('vCmd'), '/break'),
 equals(variables('vCmd'), '/lunch'),
 equals(variables('vCmd'), '/offline'),
 equals(variables('vCmd'), '/status')
)
```

Si FALSE: `Terminate`.

## Resolver `vNewStatus`

Mapeo recomendado:

- `/available` => `available`
- `/busy` => `busy`
- `/break` => `break`
- `/lunch` => `lunch`
- `/offline` => `offline`
- `/status` => mantener estado actual (solo consulta)

Puedes resolverlo con Switch o Condition anidada.

## Lookup sender row

1. List rows (`QueueTable`)
2. Filter array:

```text
equals(item()?['displayName'], variables('vSender'))
```

3. Si none: responder

```text
⚠️ No estás en cola. Contacta a un líder.
```

Terminate.

## Update estado

Guarda `previousStatus = row.status`.

Si `vCmd != '/status'`, actualizar:
- `status = vNewStatus`
- `lastUpdatedUtc = vNow`

Si `vCmd == '/status'`, responder estado actual y terminar.

---

## Reinserción `busy -> available`

Condition:

```text
and(equals(toLower(previousStatus), 'busy'), equals(variables('vNewStatus'), 'available'))
```

Si TRUE:

1. Construir lista ordenada por `queueOrder` (puedes usar Apply to each + selección mínima iterativa si no ordenas en origen).
2. Remover al sender de la lista temporal.
3. Definir índice de inserción según `boostMode` del sender:
   - `normal` => `index = length(list)` (final)
   - `double` => `index = div(length(list), 2)` (centro)
4. Insertar sender en índice.
5. Loop final para actualizar `queueOrder = 1..N` en Excel para todos los miembros.

### Resultado en respuesta

```text
✅ Estado actualizado: {previousStatus} → available
🔁 Reinsertado: final/centro
```

Si no aplica reinserción (ej. busy->break):

```text
✅ Estado actualizado: {previousStatus} → {vNewStatus}
```

## TODO PR#2

- Reglas avanzadas de prioridad por tags/skills.
- Estrategias de reinserción adicionales.
