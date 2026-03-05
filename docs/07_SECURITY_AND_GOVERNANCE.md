# 07 - Security and Governance

## Ownership
- Define mínimo 2 owners técnicos del archivo Excel y de los flows.
- Documenta reemplazos para vacaciones/incidencias.

## Permisos recomendados
- Solo owners editan estructura de tablas.
- Líderes operan con comandos `/next` y `/admin`.
- Agentes solo usan comandos de estado.

## Excel governance
- Evita compartir `dispatcher.xlsx` con permisos de edición masivos.
- Activa historial/versionado del archivo.
- No renombrar columnas/tablas sin cambio coordinado en flows.

## Cuenta de ejecución
- Recomendado: cuenta de servicio de M365 para correr los flows (si la política lo permite).
- Si no hay cuenta de servicio, documenta owner principal + owner backup.

## Auditoría
- `AuditTable` es fuente oficial de trazabilidad.
- Retención sugerida: export mensual a archivo histórico.
