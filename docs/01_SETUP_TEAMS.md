# 01 - Setup Teams (Chat de prueba)

## Objetivo
Configurar un chat de Teams (1:1 o grupal) para operar el dispatcher **sin canales**.

## Paso a paso

1. En Microsoft Teams, crea un chat grupal llamado **`Dispatcher Testing`**.
2. Agrega al menos a:
   - Líderes: Randall, Eduardo, Jorge, Gabriel.
   - Agentes: Randall, Eduardo, Jorge, Gabriel, Marianela, Gerald, Cristian, Valery, Allan.
3. Define la regla operativa: **todos los comandos del dispatcher se envían solo en este chat**.
4. Fija (Pin) un mensaje guía con comandos.
5. (Recomendado) Desactiva respuestas fuera del tema para evitar ruido durante pruebas.

## Mensaje recomendado para pin (copiar/pegar)

```text
Comandos del dispatcher (solo en este chat: Dispatcher Testing):

Líderes:
/next [tags] "nombre de la tarea"
Ejemplo: /next df urgent "Validar transferencia"
/admin config show

Agentes:
/available
/busy
/break
/lunch
/offline
/status
/queue
/who
/help
```

## Reglas recomendadas para pruebas con tu jefe

- Usar siempre el mismo chat para toda la sesión de pruebas.
- Si crean un chat nuevo, actualizar `ConfigTable.allowedChatIdsCsv` antes de seguir.
- No mezclar comandos productivos en otros chats.
- Mantener `displayName` de Teams igual a `QueueTable.displayName` en Excel.
