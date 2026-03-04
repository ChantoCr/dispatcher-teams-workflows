# 05 - Test Plan

## Objetivo
Validar funcionalidad completa de Flow A y Flow B con casos felices y errores.

## Pre-check

- Canal `dispatch` creado.
- Excel `dispatcher.xlsx` con `QueueTable` y `LockTable`.
- Flows activos y apuntando a team/channel correctos.

## Casos

1. **/next exitoso (líder)**
   - Input: `/next df "Auditar caso 001"`
   - Esperado: asigna mínimo `queueOrder` disponible y lo marca `busy`.

2. **/next no autorizado**
   - Input por no-líder.
   - Esperado: `⛔ No tienes permiso para asignar tareas.`

3. **/next parse error**
   - Input: `/next df Auditar caso 001`
   - Esperado: `Formato inválido...`

4. **Sin disponibles**
   - Todos en `busy`/`offline`.
   - Esperado: mensaje de no disponibles.

5. **Lock activo**
   - Simular `lockUntilUtc` futuro.
   - Esperado: `⏳ Bot ocupado, intenta de nuevo`.

6. **Cambio a /busy**
   - Esperado: estado actualizado y timestamp.

7. **busy -> /available con boostMode normal**
   - Esperado: reinserción al final + renumeración 1..N.

8. **busy -> /available con boostMode double**
   - Esperado: reinserción al centro + renumeración 1..N.

9. **/status**
   - Esperado: devuelve estado actual sin modificar queue.

## Validación local opcional

Usa simulador en `tools/simulate.js`.

```bash
node tools/simulate.js
```
