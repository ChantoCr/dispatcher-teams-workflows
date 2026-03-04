# Skill: assignment-engine

## Propósito
Documentar la lógica de selección de agente para `/next`.

## Reglas

- Solo considerar `status=available`.
- Elegir mínimo `queueOrder`.
- Marcar asignado como `busy`.
- Mantener `lastUpdatedUtc`.

## Entradas

- `QueueTable`
- `taskName`
- `sender`

## Salidas

- `selectedName`
- Mensaje de confirmación o no disponibles.
