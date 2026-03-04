# 02 - Setup Excel

## Archivo
Crea `dispatcher.xlsx` en OneDrive/SharePoint accesible por el conector Excel Online (Business).

---

## Tabla obligatoria: QueueTable

### Columnas exactas

1. `displayName` (Text)
2. `status` (Text)
3. `queueOrder` (Number)
4. `boostMode` (Text)
5. `lastUpdatedUtc` (Text)

### Filas iniciales (orden exacto)

1. Randall
2. Eduardo
3. Jorge
4. Gabriel
5. Marianela
6. Gerald
7. Cristian
8. Valery
9. Allan

### Valores sugeridos de arranque

- `status`: `available`
- `queueOrder`: 1..9 según orden anterior
- `boostMode`: `normal` (puedes poner `double` a quien aplique)
- `lastUpdatedUtc`: `1970-01-01T00:00:00Z`

---

## Tabla obligatoria: LockTable

### Columnas exactas

1. `lockOwner` (Text)
2. `lockUntilUtc` (Text)
3. `lockRowVersion` (Number)

### Fila inicial única

- `lockOwner` = `""`
- `lockUntilUtc` = `"1970-01-01T00:00:00Z"`
- `lockRowVersion` = `1`

## Notas importantes

- Ambas tablas deben ser **Excel Table** (Insert > Table), no solo rango.
- El Flow A asume que LockTable tiene una sola fila.
