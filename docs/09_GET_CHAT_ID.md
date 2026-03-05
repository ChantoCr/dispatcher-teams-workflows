# 09 - Cómo obtener el Chat ID y activar allow-list

## Objetivo
Sacar el `chatId` desde la ejecución del trigger en Workflows y configurarlo en `ConfigTable.allowedChatIdsCsv`.

## Paso 1: Ejecuta un comando en el chat de prueba
En `Dispatcher Testing`, envía por ejemplo:
```text
/help
```

## Paso 2: Abre el historial de ejecución del flujo
1. En Workflows, abre el flujo (A, B o C).
2. Entra a **Run history**.
3. Abre la ejecución más reciente.
4. En el bloque del trigger (`When a new message is added in a chat`), abre **Outputs**.

## Paso 3: Encuentra el identificador
Busca un campo equivalente a:
- `chat id`
- `conversation id`
- `conversation.id`

> El nombre puede variar ligeramente por versión/conector. Usa el valor completo exacto.

## Paso 4: Copia a ConfigTable
En Excel (`ConfigTable`):
- `allowedChatIdsCsv` = pega el id (o varios ids separados por coma)
- `enforceChatAllowList` = `true`

Ejemplo:
```text
allowedChatIdsCsv = 19:abc123@thread.v2,19:def456@thread.v2
enforceChatAllowList = true
```

## Paso 5: Validación rápida
1. Escribe `/help` en chat permitido -> debe responder.
2. Escribe `/help` en chat no permitido -> debe terminar silencioso (o solo auditar `wrong-chat`).

## Expresión recomendada (copiar/pegar)
```text
contains(concat(',', variables('vAllowedChatIdsCsv'), ','), concat(',', variables('vChatId'), ','))
```

## Buenas prácticas
- Mantén los ids en minúsculas para comparaciones consistentes.
- Si crean un chat nuevo para pruebas, agrega su id antes de probar.
- No desactives `enforceChatAllowList` en producción salvo diagnóstico puntual.
