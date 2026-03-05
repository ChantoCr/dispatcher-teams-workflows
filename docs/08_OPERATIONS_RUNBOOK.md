# 08 - Operations Runbook

## 1) Lock stuck recovery
1. Abrir `LockTable`.
2. Setear `lockUntilUtc = 1970-01-01T00:00:00Z`.
3. Limpiar `lockOwner`.
4. Incrementar `lockRowVersion` en 1.
5. Probar `/next "test"`.

## 2) Queue reset
- Ejecutar `/admin reset`.
- Validar con `/queue` que quede orden 1..N.

## 3) Onboarding/Offboarding
- Alta: `/admin add "Nombre"`.
- Baja: `/admin remove "Nombre"`.
- Ajuste de boost: `/admin boost "Nombre" double`.

## 4) Cambio de líderes sin redeploy
- Ejecutar `/admin leaders set "Nombre1,Nombre2"`.
- Confirmar con `/admin config show`.

## 5) Manejo de fallos comunes
- `unauthorized`: revisar `leadersCsv`.
- `parse-error`: revisar comillas del comando.
- `invalid-tags`: revisar `allowedTagsCsv`.
- `lock-busy-after-retry`: reintentar y revisar carga concurrente.

## 6) Checklist diario de salud
- Revisar últimas filas de `AuditTable`.
- Confirmar que no haya muchos `ASSIGN_FAIL` consecutivos.
- Verificar que `queueOrder` siga secuencia sin huecos.
