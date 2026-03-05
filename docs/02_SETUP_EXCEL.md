# 02 - Setup Excel

Crea `dispatcher.xlsx` en OneDrive/SharePoint accesible por Excel Online (Business).

## 1) QueueTable

### Columnas exactas
1. `displayName` (Text)
2. `status` (Text)
3. `queueOrder` (Number)
4. `boostMode` (Text)
5. `lastUpdatedUtc` (Text)

### Filas iniciales sugeridas
Randall, Eduardo, Jorge, Gabriel, Marianela, Gerald, Cristian, Valery, Allan.

Valores iniciales:
- `status`: `available`
- `queueOrder`: 1..N
- `boostMode`: `normal`
- `lastUpdatedUtc`: `1970-01-01T00:00:00Z`

## 2) LockTable

### Columnas exactas
1. `lockOwner` (Text)
2. `lockUntilUtc` (Text)
3. `lockRowVersion` (Number)

### Fila única inicial
- `lockOwner` = `""`
- `lockUntilUtc` = `"1970-01-01T00:00:00Z"`
- `lockRowVersion` = `1`

## 3) ConfigTable (NUEVO PR#2)

> Debe tener **una sola fila activa**.

### Columnas exactas
1. `leadersCsv` (Text) -> `Randall,Eduardo,Jorge,Gabriel`
2. `lockTtlSeconds` (Number) -> `20`
3. `allowedChannel` (Text) -> `dispatch`
4. `allowedTagsCsv` (Text) -> `df,dl,inv,act,all`
5. `helpText` (Text) -> texto corto multi-línea, por ejemplo:

```text
Comandos:
/next [df dl inv act all] "tarea"
/status | /available | /busy | /break | /lunch | /offline
/queue | /who | /help
/admin config show (solo líderes)
```

## 4) AuditTable (NUEVO PR#2)

### Columnas exactas
1. `timestampUtc` (Text)
2. `eventType` (Text)
3. `actor` (Text)
4. `target` (Text)
5. `taskName` (Text)
6. `tags` (Text)
7. `details` (Text)

### Valores de `eventType`
- `ASSIGN_OK`
- `ASSIGN_FAIL`
- `STATUS_CHANGE`
- `STATUS_QUERY`
- `ADMIN`

## Notas importantes

- Todas deben ser **Excel Tables** reales (Insert > Table).
- Evita encabezados con espacios extra.
- `displayName` debe coincidir exactamente con el nombre visible en Teams.
