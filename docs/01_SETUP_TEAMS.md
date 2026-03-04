# 01 - Setup Teams

## Objetivo
Configurar Teams para que los comandos del dispatcher se usen de forma consistente y segura.

## Paso a paso

1. En tu Team, crea (o reutiliza) el canal **`dispatch`**.
2. Define como regla operativa: **los comandos del bot solo se envían en este canal**.
3. Publica y fija (Pin) un mensaje guía con formato de comandos.

## Mensaje recomendado para pin

```text
Comandos del dispatcher (solo en este canal):

Líderes:
/next [tags] "nombre de la tarea"
Ejemplo: /next df urgent "Validar transferencia"

Agentes:
/available
/busy
/break
/lunch
/offline
/status
```

## Recomendaciones

- Evita usar hilos diferentes para comandos automáticos.
- Mantén nombres de displayName en Teams alineados con Excel (`QueueTable.displayName`).
